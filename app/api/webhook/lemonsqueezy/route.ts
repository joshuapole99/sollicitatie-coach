// app/api/webhook/lemonsqueezy/route.ts — Payment webhook (ported from api/webhook/lemonsqueezy.js)
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ─── KV write ────────────────────────────────────────────────
async function kvSet(key: string, value: string): Promise<boolean> {
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;
  try {
    const r = await fetch(
      `${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`,
      { method: 'GET', headers: { Authorization: `Bearer ${token}` } }
    );
    return r.ok;
  } catch { return false; }
}

function getVariantMap() {
  const map: Record<string, string> = {};
  const plus = process.env.LS_VARIANT_PLUS || '';
  const pro  = process.env.LS_VARIANT_PRO  || '';
  if (plus) map[plus] = 'plus';
  if (pro)  map[pro]  = 'pro';
  return map;
}

function verifySignature(rawBody: Buffer, signatureHeader: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(signatureHeader.toLowerCase(), 'hex')
    );
  } catch { return false; }
}

function extractSessionId(customData: any): string | null {
  const sid = customData?.sessionId || customData?.session_id || customData?.SessionId || null;
  if (!sid) return null;
  const s = String(sid).trim();
  return (s.includes('{') || s.includes('}')) ? null : s;
}

async function writeKv(sessionId: string, tier: string, reason: string) {
  const key = `tier:${sessionId}`;
  const ok = await kvSet(key, tier);
  console.log(`[webhook] KV ${reason}: ${key}=${tier} ok=${ok}`);
}

async function activateFromVariant(variantId: string, customData: any) {
  const tier = getVariantMap()[variantId];
  if (!tier) { console.error(`[webhook] Unknown variantId=${variantId}`); return; }
  const sid = extractSessionId(customData);
  if (!sid) return;
  await writeKv(sid, tier, 'activate');
}

async function handleSubscription(payload: any, activate: boolean) {
  const attrs      = payload?.data?.attributes || {};
  const variantId  = String(attrs.variant_id ?? '');
  const status     = String(attrs.status ?? '');
  const customData = attrs.custom_data ?? payload?.meta?.custom_data ?? {};

  if (!activate) {
    const sid = extractSessionId(customData);
    if (sid) await writeKv(sid, 'free', 'downgrade');
    return;
  }
  if (!['active', 'trialing', 'past_due'].includes(status)) return;
  await activateFromVariant(variantId, customData);
}

async function handleOrder(payload: any) {
  const attrs      = payload?.data?.attributes || {};
  const status     = String(attrs.status ?? '');
  const customData = attrs.custom_data ?? payload?.meta?.custom_data ?? {};
  if (!['paid', 'pending'].includes(status)) return;
  const variantId  = String(attrs.first_order_item?.variant_id ?? '');
  if (variantId) await activateFromVariant(variantId, customData);
}

export async function POST(req: NextRequest) {
  const rawBody = Buffer.from(await req.arrayBuffer());
  const signature = (req.headers.get('x-signature') || req.headers.get('x-lemon-squeezy-signature') || '').trim();

  if (!verifySignature(rawBody, signature)) {
    console.warn('[webhook] Signature mismatch — rejected');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: any;
  try { payload = JSON.parse(rawBody.toString('utf-8')); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const eventName = String(payload?.meta?.event_name || '');
  console.log(`[webhook] Event: ${eventName}`);

  if (['subscription_created', 'subscription_resumed', 'subscription_unpaused'].includes(eventName)) {
    await handleSubscription(payload, true);
  } else if (eventName === 'order_created') {
    await handleOrder(payload);
  } else if (['subscription_cancelled', 'subscription_expired', 'subscription_paused'].includes(eventName)) {
    await handleSubscription(payload, false);
  } else if (eventName === 'subscription_updated') {
    const status = payload?.data?.attributes?.status || '';
    if (['cancelled', 'expired', 'paused'].includes(status)) await handleSubscription(payload, false);
    else if (['active', 'trialing', 'past_due'].includes(status)) await handleSubscription(payload, true);
  }

  return NextResponse.json({ received: true });
}
