// app/api/interview/route.ts — Interview question generator (Plus/Pro only)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function extractJSON(text: string) {
  let s = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const a = s.indexOf('['), b = s.lastIndexOf(']');
  if (a !== -1 && b !== -1) s = s.slice(a, b + 1);
  else {
    const ca = s.indexOf('{'), cb = s.lastIndexOf('}');
    if (ca !== -1 && cb !== -1) s = s.slice(ca, cb + 1);
  }
  return JSON.parse(s);
}

export async function POST(req: NextRequest) {
  try {
    // Auth check — dashboard feature, must be logged in
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Niet ingelogd.' }, { status: 401 });

    const { role, context } = await req.json();

    if (!role || typeof role !== 'string' || role.trim().length < 2)
      return NextResponse.json({ error: 'Functietitel is verplicht.' }, { status: 400 });

    if (!process.env.ANTHROPIC_API_KEY)
      return NextResponse.json({ error: 'Serverconfiguratie fout.' }, { status: 500 });

    const prompt = `Je bent een Nederlandse sollicitatiecoach. Genereer 8 veelgestelde interviewvragen voor de functie: "${role.trim()}"${context ? ` (context: ${context.trim()})` : ''}.

Geef EXACT dit JSON terug (een array van 8 objecten):
[
  {
    "question": "Vertel eens iets over jezelf.",
    "answer": "Concreet voorbeeldantwoord van 2-4 zinnen dat indruk maakt.",
    "tip": "Korte pro tip voor deze vraag."
  }
]

Maak de vragen en antwoorden specifiek voor de functie. Geen generieke antwoorden.
BELANGRIJK: Alleen het JSON array. Niets anders.`;

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
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!apiResp.ok)
      return NextResponse.json({ error: 'AI service niet beschikbaar.' }, { status: 502 });

    const aiData = await apiResp.json();
    const rawText = aiData.content?.[0]?.text;
    if (!rawText) return NextResponse.json({ error: 'Lege AI response.' }, { status: 502 });

    let questions: any[];
    try {
      const parsed = extractJSON(rawText);
      questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
    } catch (_) {
      return NextResponse.json({ error: 'Kon vragen niet verwerken. Probeer opnieuw.' }, { status: 502 });
    }

    return NextResponse.json({ questions: questions.slice(0, 8) });

  } catch (e: any) {
    if (e.name === 'AbortError') return NextResponse.json({ error: 'Verzoek duurde te lang.' }, { status: 504 });
    return NextResponse.json({ error: 'Onverwachte fout.' }, { status: 500 });
  }
}
