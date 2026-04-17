// app/api/analyse/route.ts — v3 (free tier = scripted, paid = Claude)
import { NextRequest, NextResponse } from 'next/server';
import { resolveTier } from '@/lib/tier';
import { checkAndEnforce, recordUsage } from '@/lib/usage';
import { createClient } from '@/lib/supabase/server';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-session-id',
};

// Generic scripted response for free-tier users (no Claude API cost)
const SCRIPTED_RESPONSE = {
  score: 65,
  score_uitleg: 'Dit is een voorbeeldanalyse. Upgrade naar Plus of Pro voor jouw persoonlijke match score op basis van jouw specifieke CV en vacature.',
  sterke_punten: [
    'Je CV bevat werkervaring die relevant kan zijn voor de functie',
    'Je opleiding sluit mogelijk aan op de functievereisten',
    'Upgrade naar Plus voor 3 concrete sterke punten uit jouw CV',
  ],
  verbeterpunten: [
    'Veel CV\'s missen vacature-specifieke keywords — dit verlaagt je ATS-score',
    'Een op maat gemaakte motivatiebrief verhoogt je kansen significant',
    'Upgrade naar Plus voor jouw persoonlijke verbeterpunten',
  ],
  match_keywords: ['werkervaring', 'opleiding', 'vaardigheden'],
  mis_keywords: ['upgrade voor jouw specifieke keywords', 'ATS-termen uit vacature', 'functie-specifieke competenties'],
  motivatiebrief: '',
  cv_tips: 'Upgrade naar Plus of Pro voor gepersonaliseerde CV-verbeterpunten. Plus-gebruikers ontvangen gemiddeld 4 concrete tips om hun CV te versterken voor deze specifieke vacature.',
  job_title: null,
  company: null,
};

function extractJSON(text: string) {
  let s = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a === -1 || b === -1) throw new Error('No JSON found');
  s = s.slice(a, b + 1);
  try { return JSON.parse(s); } catch (_) {}
  s = s
    .replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')
    .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
    .replace(/:\s*'([^']*)'/g, ': "$1"')
    .replace(/\n/g, ' ').replace(/\r/g, '');
  return JSON.parse(s);
}

const SYSTEM_PROMPT = `Je bent een Nederlandse sollicitatiecoach AI.
KRITIEKE REGELS:
1. Geef ALLEEN een JSON object terug. Geen tekst ervoor of erna.
2. Geen markdown, geen code blocks, geen backticks.
3. Begin met { en eindig met }
4. Alle strings in dubbele aanhalingstekens.
5. Geen trailing commas.`;

function buildPrompt(cv: string, job: string, includeCoverLetter: boolean) {
  return `Analyseer deze CV en vacature.

CV:
${cv}

VACATURE:
${job}

Geef EXACT dit JSON terug:
{
  "score": 72,
  "score_uitleg": "Twee zinnen uitleg.",
  "sterke_punten": ["punt 1", "punt 2", "punt 3"],
  "verbeterpunten": ["punt 1", "punt 2", "punt 3"],
  "match_keywords": ["keyword1", "keyword2", "keyword3"],
  "mis_keywords": ["ontbrekend1", "ontbrekend2", "ontbrekend3"],
  "motivatiebrief": ${includeCoverLetter ? '"Volledige motivatiebrief in drie alineas. Professionele toon."' : '""'},
  "cv_tips": "Twee of drie concrete verbeterpunten als lopende tekst.",
  "job_title": "Functietitel uit de vacature",
  "company": "Bedrijfsnaam uit de vacature"
}

BELANGRIJK: Alleen dit JSON object. Niets anders.`;
}

export async function OPTIONS(_req: NextRequest) {
  return new NextResponse(null, { headers: CORS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cv, job } = body || {};

    if (!cv || typeof cv !== 'string' || cv.trim().length < 30)
      return NextResponse.json({ error: 'CV te kort of ontbreekt' }, { status: 400 });
    if (!job || typeof job !== 'string' || job.trim().length < 30)
      return NextResponse.json({ error: 'Vacature te kort of ontbreekt' }, { status: 400 });

    const sessionId = (req.headers.get('x-session-id') || '').trim() || null;
    const { tier, config, source } = await resolveTier(sessionId);

    console.log(`[analyse] sid=${sessionId?.slice(0, 10) || 'NONE'} tier=${tier} source=${source}`);

    // Free tier: return scripted response — no Claude API cost
    if (tier === 'free') {
      return NextResponse.json({
        ...SCRIPTED_RESPONSE,
        tier: 'free',
        canPdf: false,
        coverLetter: false,
        usage: { used: 0, remaining: 0, limit: 0 },
      }, { headers: CORS });
    }

    // Plus / Pro: enforce usage limits then call Claude
    const usageKey = sessionId!;
    const { allowed, used, remaining, limit } = await checkAndEnforce(usageKey, tier, config);

    if (!allowed) {
      return NextResponse.json({
        error: 'Limiet bereikt',
        message: `Je maandlimiet van ${limit} analyses is bereikt.`,
        tier, usage: { used, remaining: 0, limit },
      }, { status: 429, headers: CORS });
    }

    if (!process.env.ANTHROPIC_API_KEY)
      return NextResponse.json({ error: 'Serverconfiguratie fout.' }, { status: 500, headers: CORS });

    const includeCoverLetter = config.coverLetter;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    let apiResp: Response;
    try {
      apiResp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: buildPrompt(cv.trim(), job.trim(), includeCoverLetter) }],
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!apiResp.ok) {
      const err = await apiResp.json().catch(() => ({}));
      console.error('[analyse] Anthropic error:', (err as any).error?.message);
      return NextResponse.json({ error: 'AI service niet beschikbaar. Probeer opnieuw.' }, { status: 502, headers: CORS });
    }

    const aiData = await apiResp.json();
    const rawText = aiData.content?.[0]?.text;
    if (!rawText) return NextResponse.json({ error: 'Lege AI response.' }, { status: 502, headers: CORS });

    let result: any;
    try { result = extractJSON(rawText); }
    catch (_) {
      console.error('[analyse] JSON parse error:', rawText.slice(0, 300));
      return NextResponse.json({ error: 'AI response onverwacht formaat. Probeer opnieuw.' }, { status: 502, headers: CORS });
    }

    for (const f of ['score', 'score_uitleg', 'sterke_punten', 'verbeterpunten', 'match_keywords', 'mis_keywords', 'motivatiebrief', 'cv_tips']) {
      if (result[f] === undefined || result[f] === null)
        return NextResponse.json({ error: `Analyse onvolledig (${f}).` }, { status: 502, headers: CORS });
    }

    result.score = Math.min(100, Math.max(0, parseInt(result.score) || 0));
    for (const f of ['sterke_punten', 'verbeterpunten', 'match_keywords', 'mis_keywords'])
      if (!Array.isArray(result[f])) result[f] = [];
    if (!includeCoverLetter) result.motivatiebrief = '';

    const newCount = await recordUsage(usageKey, config);

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('analyses').insert({
          user_id: user.id,
          job_title: result.job_title || null,
          company: result.company || null,
          score: result.score,
          result: result,
        });
      }
    } catch (e: any) {
      console.warn('[analyse] Failed to save to Supabase:', e.message);
    }

    return NextResponse.json({
      ...result,
      tier,
      canPdf: config.pdf,
      coverLetter: config.coverLetter,
      usage: { used: newCount, remaining: Math.max(0, limit - newCount), limit },
    }, {
      headers: {
        ...CORS,
        'X-RateLimit-Remaining': String(Math.max(0, limit - newCount)),
      },
    });

  } catch (e: any) {
    if (e.name === 'AbortError') return NextResponse.json({ error: 'Analyse duurde te lang.' }, { status: 504 });
    console.error('[analyse] Unexpected error:', e.message);
    return NextResponse.json({ error: 'Onverwachte fout. Probeer opnieuw.' }, { status: 500 });
  }
}
