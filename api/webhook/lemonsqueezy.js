// api/webhook/lemonsqueezy.js
//
// ✅ Receives LemonSqueezy subscription events
// ✅ Extracts sessionId from custom_data
// ✅ Writes tier:{sessionId} to KV
// ✅ Verifies webhook signature (HMAC-SHA256)
//
// Required env vars:
//   LEMONSQUEEZY_WEBHOOK_SECRET  — set in LS dashboard → Webhooks
//   KV_REST_API_URL
//   KV_REST_API_TOKEN
//   LS_VARIANT_PLUS              — variant ID for €2,99 plan
//   LS_VARIANT_PRO               — variant ID for €9,99 plan

import crypto from 'crypto';

// ─── KV write helper ─────────────────────────────────────────
async function kvSet(key, value) {
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    console.error('[webhook] KV not configured — tier NOT saved');
    return false;
  }
  try {
    const r = await fetch(`${url}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Upstash REST: value as top-level field
      body: JSON.stringify(value),
    });
    return r.ok;
  } catch (e) {
    console.error('[webhook] kvSet error:', e.message);
    return false;
  }
}

// ─── Variant → tier map ───────────────────────────────────────
function getVariantMap() {
  return {
    [String(process.env.LS_VARIANT_PLUS || '')]: 'plus',
    [String(process.env.LS_VARIANT_PRO  || '')]: 'pro',
  };
}

// ─── Signature verification ───────────────────────────────────
function verifySignature(rawBody, signatureHeader) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[webhook] LEMONSQUEEZY_WEBHOOK_SECRET not set — rejecting');
    return false;
  }
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(signatureHeader || '', 'hex')
    );
  } catch {
    return false;
  }
}

// ─── Main handler ─────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Vercel provides the raw body as a Buffer when bodyParser is disabled
  // We need the raw body for HMAC verification
  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (e) {
    console.error('[webhook] Failed to read body:', e.message);
    return res.status(400).json({ error: 'Cannot read body' });
  }

  // Verify signature
  const signature = req.headers['x-signature'] || req.headers['x-lemon-squeezy-signature'] || '';
  if (!verifySignature(rawBody, signature)) {
    console.warn('[webhook] Invalid signature — rejected');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf-8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const eventName = payload?.meta?.event_name || '';
  console.log(`[webhook] Event: ${eventName}`);

  // Handle subscription lifecycle events
  if (
    eventName === 'subscription_created' ||
    eventName === 'subscription_updated' ||
    eventName === 'subscription_resumed'  ||
    eventName === 'subscription_unpaused'
  ) {
    await handleSubscriptionActive(payload);
  } else if (
    eventName === 'subscription_cancelled' ||
    eventName === 'subscription_expired'   ||
    eventName === 'subscription_paused'
  ) {
    await handleSubscriptionInactive(payload);
  } else {
    // Other events (order_created, etc.) — acknowledge and ignore
    console.log(`[webhook] Unhandled event: ${eventName} — acknowledged`);
  }

  // Always return 200 quickly — LS will retry on failure
  return res.status(200).json({ received: true });
}

// ─── Handle active subscription ───────────────────────────────
async function handleSubscriptionActive(payload) {
  const attrs     = payload?.data?.attributes;
  const variantId = String(attrs?.variant_id ?? '');
  const status    = attrs?.status ?? '';
  const customData = attrs?.custom_data ?? payload?.meta?.custom_data ?? {};

  console.log(`[webhook] subscription: status=${status} variantId=${variantId}`);
  console.log(`[webhook] custom_data:`, JSON.stringify(customData));

  // Extract sessionId — support both naming conventions
  const sessionId = customData?.sessionId || customData?.session_id || null;

  if (!sessionId) {
    console.error('[webhook] No sessionId in custom_data — cannot assign tier');
    console.error('[webhook] Full custom_data:', JSON.stringify(customData));
    return;
  }

  // Guard against template placeholders (checkout misconfiguration)
  if (String(sessionId).includes('{') || String(sessionId).includes('}')) {
    console.error('[webhook] sessionId contains unresolved placeholder:', sessionId);
    return;
  }

  // Only activate for active/trialing subscriptions
  if (!['active', 'trialing'].includes(status)) {
    console.log(`[webhook] Subscription status=${status} — not activating tier`);
    return;
  }

  const variantMap = getVariantMap();
  const tier = variantMap[variantId];

  if (!tier) {
    console.error(`[webhook] Unknown variantId=${variantId} — check LS_VARIANT_PLUS / LS_VARIANT_PRO env vars`);
    console.error(`[webhook] Known variants:`, JSON.stringify(variantMap));
    return;
  }

  // Write to KV — this is what verify.js reads
  const key = `tier:${sessionId}`;
  const ok  = await kvSet(key, tier);

  if (ok) {
    console.log(`[webhook] ✅ tier:${sessionId.slice(0,10)}... = ${tier}`);
  } else {
    console.error(`[webhook] ❌ KV write failed for ${sessionId.slice(0,10)}...`);
  }
}

// ─── Handle cancelled/expired subscription ────────────────────
async function handleSubscriptionInactive(payload) {
  const attrs      = payload?.data?.attributes;
  const customData = attrs?.custom_data ?? payload?.meta?.custom_data ?? {};
  const sessionId  = customData?.sessionId || customData?.session_id || null;

  if (!sessionId) {
    console.warn('[webhook] No sessionId in cancelled event — cannot downgrade');
    return;
  }

  // Downgrade to free
  const key = `tier:${sessionId}`;
  const ok  = await kvSet(key, 'free');

  if (ok) {
    console.log(`[webhook] ✅ Downgraded ${sessionId.slice(0,10)}... → free`);
  } else {
    console.error(`[webhook] ❌ KV downgrade failed for ${sessionId.slice(0,10)}...`);
  }
}

// ─── Raw body reader ──────────────────────────────────────────
// Vercel serverless: req is a Node.js IncomingMessage stream
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(typeof c === 'string' ? Buffer.from(c) : c));
    req.on('end',  () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// ─── Vercel config: disable body parser so we get raw stream ──
export const config = {
  api: { bodyParser: false },
};
