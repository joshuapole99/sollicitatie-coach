// app/api/checkout/route.ts — LemonSqueezy checkout redirect (ported from api/checkout.js)
import { NextRequest, NextResponse } from 'next/server';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const plan      = searchParams.get('plan');
  const sessionId = searchParams.get('sessionId');

  if (!plan || !['plus', 'pro'].includes(plan))
    return NextResponse.json({ error: 'plan must be "plus" or "pro"' }, { status: 400 });

  if (!sessionId || !UUID_RE.test(sessionId.trim()))
    return NextResponse.json({ error: 'sessionId must be a valid UUID v4' }, { status: 400 });

  const sid  = sessionId.trim();
  const mode = String(process.env.APP_MODE || 'live').toLowerCase() === 'test' ? 'test' : 'live';

  let base: string | null = null;

  if (mode === 'test') {
    base = plan === 'plus'
      ? (process.env.LS_CHECKOUT_PLUS_TEST || null)
      : (process.env.LS_CHECKOUT_PRO_TEST  || null);
    if (!base) return NextResponse.json({ error: 'Test checkout URL not configured' }, { status: 500 });
  } else {
    const liveUrls: Record<string, string> = {
      plus: process.env.LS_CHECKOUT_PLUS_LIVE || 'https://sollicitatie-coach.lemonsqueezy.com/checkout/buy/18245f15-0847-400a-8688-cdf664bf9771',
      pro:  process.env.LS_CHECKOUT_PRO_LIVE  || 'https://sollicitatie-coach.lemonsqueezy.com/checkout/buy/7719f367-3c74-4f30-bd9e-323f3f66a382',
    };
    base = liveUrls[plan];
  }

  const url = `${base}?checkout[custom][sessionId]=${encodeURIComponent(sid)}`;
  console.log(`[checkout] mode=${mode} plan=${plan} sid=${sid.slice(0, 10)}... → redirect`);

  return NextResponse.redirect(url, { headers: { 'Cache-Control': 'no-store' } });
}
