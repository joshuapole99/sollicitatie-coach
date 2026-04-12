// api/analyse.js
// All tier enforcement happens here server-side.
// Frontend sends sessionId via header — server decides everything.

import { resolveTier } from './_tier.js';
import { checkAndEnforce, recordUsage } from './_usage.js';

// ─── JSON extractor ───────────────────────────────────────────
function extractJSON(text) {
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

// ─── Prompt builder ───────────────────────────────────────────
const SYSTEM_PROMPT = `Je bent een Nederlandse sollicitatiecoach AI.
KRITIEKE REGELS:
1. Geef ALLEEN een JSON object terug. Geen tekst ervoor of erna.
2. Geen markdown, geen code blocks, geen backticks.
3. Begin met { en eindig met }
4. Alle strings in dubbele aanhalingstekens.
5. Geen trailing commas.`;

function buildPrompt(cv, job, includeCoverLetter) {
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
  "motivatiebrief": ${includeCoverLetter
    ? '"Volledige motivatiebrief in drie alineas. Professionele toon."'
    : '""'},
  "cv_tips": "Twee of drie concrete verbeterpunten als lopende tekst."
}

BELANGRIJK: Alleen dit JSON object. Niets anders.`;
}

// ─── Handler ──────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-session-id');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { cv, job } = req.body || {};

    if (!cv  || typeof cv  !== 'string' || cv.trim().length  < 30)
      return res.status(400).json({ error: 'CV te kort of ontbreekt' });
    if (!job || typeof job !== 'string' || job.trim().length < 30)
      return res.status(400).json({ error: 'Vacature te kort of ontbreekt' });

    // ── 1. Get sessionId — header only, body fallback ─────────
    // Header: x-session-id (preferred, set by frontend)
    // Body: sessionId (fallback)
    const sessionId = (
      (req.headers['x-session-id'] || req.headers['x-ls-session'] || '').trim() ||
      (typeof req.body?.sessionId === 'string' ? req.body.sessionId.trim() : '')
    ) || null;

    // ── 2. Resolve tier from KV (single deterministic read) ───
    const { tier, config, source } = await resolveTier(sessionId);

    console.log(`[analyse] sid=${sessionId?.slice(0,10)||'NONE'} tier=${tier} source=${source}`);

    // ── 3. Usage key: always sessionId for paid, or a stable
    //    IP+UA fingerprint for anonymous free users.
    //    Free users without a session get a best-effort key.
    //    Paid users always have a sessionId.
    let usageKey;
    if (sessionId) {
      usageKey = sessionId;
    } else {
      // Anonymous free — best-effort IP fingerprint
      const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
              || req.headers['x-real-ip']
              || 'unknown';
      usageKey = `anon:${Buffer.from(ip).toString('base64').slice(0, 20)}`;
    }

    // ── 4. Enforce usage limit (server-side, always) ──────────
    const { allowed, used, remaining, limit } = await checkAndEnforce(usageKey, tier, config);

    if (!allowed) {
      console.log(`[analyse] BLOCKED: tier=${tier} used=${used}/${limit}`);
      return res.status(429).json({
        error: 'Limiet bereikt',
        message: tier === 'free'
          ? 'Je hebt je 3 gratis analyses gebruikt. Upgrade voor meer.'
          : `Je maandlimiet van ${limit} analyses is bereikt.`,
        tier,
        usage: { used, remaining: 0, limit },
        upgrade: tier === 'free',
      });
    }

    if (!process.env.ANTHROPIC_API_KEY)
      return res.status(500).json({ error: 'Serverconfiguratie fout.' });

    // ── 5. Feature gating — server decides ───────────────────
    const includeCoverLetter = config.coverLetter;
    console.log(`[analyse] allowed: used=${used}/${limit} coverLetter=${includeCoverLetter} pdf=${config.pdf}`);

    // ── 6. AI call ────────────────────────────────────────────
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    let apiResp;
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
      console.error('[analyse] Anthropic error:', err.error?.message);
      return res.status(502).json({ error: 'AI service niet beschikbaar. Probeer opnieuw.' });
    }

    const aiData = await apiResp.json();
    const rawText = aiData.content?.[0]?.text;
    if (!rawText) return res.status(502).json({ error: 'Lege AI response. Probeer opnieuw.' });

    // ── 7. Parse AI response ──────────────────────────────────
    let result;
    try { result = extractJSON(rawText); }
    catch (_) {
      console.error('[analyse] JSON parse error:', rawText.slice(0, 300));
      return res.status(502).json({ error: 'AI response onverwacht formaat. Probeer opnieuw.' });
    }

    // ── 8. Validate required fields ───────────────────────────
    for (const f of ['score', 'score_uitleg', 'sterke_punten', 'verbeterpunten',
                      'match_keywords', 'mis_keywords', 'motivatiebrief', 'cv_tips']) {
      if (result[f] === undefined || result[f] === null)
        return res.status(502).json({ error: `Analyse onvolledig (${f}). Probeer opnieuw.` });
    }

    result.score = Math.min(100, Math.max(0, parseInt(result.score) || 0));
    for (const f of ['sterke_punten', 'verbeterpunten', 'match_keywords', 'mis_keywords'])
      if (!Array.isArray(result[f])) result[f] = [];

    // ── 9. Server strips cover letter for free/plus users ─────
    if (!includeCoverLetter) result.motivatiebrief = '';

    // ── 10. Record usage AFTER successful AI response (atomic) ─
    const newCount = await recordUsage(usageKey, config);
    console.log(`[analyse] usage recorded: ${newCount}/${limit}`);

    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, limit - newCount)));

    return res.status(200).json({
      ...result,
      tier,
      canPdf:      config.pdf,
      coverLetter: config.coverLetter,
      usage: { used: newCount, remaining: Math.max(0, limit - newCount), limit },
    });

  } catch (e) {
    if (e.name === 'AbortError') return res.status(504).json({ error: 'Analyse duurde te lang.' });
    console.error('[analyse] Unexpected error:', e.message, e.stack?.split('\n')[1]);
    return res.status(500).json({ error: 'Onverwachte fout. Probeer opnieuw.' });
  }
}
