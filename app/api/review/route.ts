// app/api/review/route.ts — Feedback proxy to Formspree
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { rating, message } = body;

  if (!rating || !message || typeof message !== 'string' || message.trim().length < 3)
    return NextResponse.json({ error: 'Rating en bericht zijn verplicht.' }, { status: 400 });

  const FORMSPREE_URL = process.env.FORMSPREE_URL || 'https://formspree.io/f/xnjozwbr';

  try {
    const resp = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ rating, message: message.trim() }),
    });
    if (!resp.ok) throw new Error(`Formspree ${resp.status}`);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Review kon niet worden verstuurd.' }, { status: 502 });
  }
}
