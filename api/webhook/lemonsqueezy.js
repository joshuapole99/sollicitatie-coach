// api/webhook/lemonsqueezy.js
//
// ✅ Receives LemonSqueezy payment + subscription events
// ✅ Verifies HMAC-SHA256 signature
// ✅ Extracts sessionId from custom_data
// ✅ Maps variant_id → plus/pro via LS_VARIANT_PLUS / LS_VARIANT_PRO env vars
// ✅ Writes tier:{sessionId} to Upstash KV (plain string, no JSON encoding bug)
//
// Handles:
//   subscription_created / subscription_updated / subscription_resumed
//   order_created (TEST mode one-time / subscription orders)
//   subscription_cancelled / subscription_expired / subscription_paused

import crypto from 'crypto';

// ─── KV write ────────────────────────────────────────────────
// Uses /set/key/value URL form — avoids JSON serialization bug
// where JSON.stringify('plus') = '"plus"' (with quotes) gets stored literally
async function kvSet(key, value) {
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    console.error('[webhook] KV not configured (KV_REST_API_URL / KV_REST_API_TOKEN missing)');
    return false;
  }
  try {
    // Use pipeline-safe URL form: /set/{key}/{value}
    // This stores the raw string 'plus' or 'pro' without JSON encoding
    const r = await fetch(
      `${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const body = await r.json().catch(() => null);
    console.log(`[webhook] kvSet ${key}=${value} → status=${r.status} result=${JSON.stringify(body)}`);
    return r.ok;
  } catch (e) {
    console.error('[webhook] kvSet error:', e.message);
    return false;
  }
}

// ─── Variant → tier map ──────────────────────────────────────
function getVariantMap() {
  const plus = process.env.LS_VARIANT_PLUS || '';
  const pro  = process.env.LS_VARIANT_PRO  || '';
  console.log(`[webhook] Variant map: PLUS=${plus} PRO=${pro}`);
  const map = {};
  if (plus) map[String(plus)] = 'plus';
  if (pro)  map[String(pro)]  = 'pro';
  return map;
}

// ─── Signature verification ──────────────────────────────────
function verifySignature(rawBody, signatureHeader) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[webhook] LEMONSQUEEZY_WEBHOOK_SECRET not set');
    return false;
  }
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(String(signatureHeader || '').toLowerCase(), 'hex')
    );
  } catch {
    return false;
  }
}

// ─── Main handler ────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Read raw body stream (bodyParser is disabled via config below)
  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (e) {
    console.error('[webhook] Failed to read body:', e.message);
    return res.status(400).json({ error: 'Cannot read body' });
  }

  // LemonSqueezy sends signature in X-Signature header
  const signature = (
    req.headers['x-signature'] ||
    req.headers['x-lemon-squeezy-signature'] ||
    ''
  ).trim();

  if (!verifySignature(rawBody, signature)) {
    console.warn('[webhook] Signature mismatch — rejected');
    console.warn('[webhook] Received signature:', signature?.slice(0, 16) + '...');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf-8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const eventName = String(payload?.meta?.event_name || '');
  console.log(`[webhook] ─── Event: ${eventName} ───`);

  if (
    eventName === 'subscription_created' ||
    eventName === 'subscription_resumed' ||
    eventName === 'subscription_unpaused'
  ) {
    await handleSubscription(payload, true);

  } else if (eventName === 'order_created') {
    // Fires in TEST mode for both one-time and subscription orders
    // Also fires in LIVE mode for all orders — safe to handle
    await handleOrder(payload);

  } else if (
    eventName === 'subscription_cancelled' ||
    eventName === 'subscription_expired'  ||
    eventName === 'subscription_paused'
  ) {
    // Explicit downgrade — always deactivate regardless of status field
    await handleSubscription(payload, false);

  } else if (eventName === 'subscription_updated') {
    // subscription_updated fires for ANY change (plan change, renewal, etc.)
    // Must check status before deciding to activate or downgrade
    const status = payload?.data?.attributes?.status || '';
    if (['cancelled', 'expired', 'paused'].includes(status)) {
      // Status confirms this update is a downgrade
      await handleSubscription(payload, false);
    } else if (['active', 'trialing', 'past_due'].includes(status)) {
      // Status confirms this update is an upgrade/renewal
      await handleSubscription(payload, true);
    } else {
      console.log(`[webhook] subscription_updated with unhandled status '${status}' — acknowledged`);
    }

  } else {
    console.log(`[webhook] Unhandled event: ${eventName} — 200 acknowledged`);
  }

  return res.status(200).json({ received: true });
}

// ─── Handle subscription_created / subscription_updated ──────
async function handleSubscription(payload, activate) {
  const attrs      = payload?.data?.attributes || {};
  const variantId  = String(attrs.variant_id ?? '');
  const status     = String(attrs.status ?? '');
  const customData = attrs.custom_data ?? payload?.meta?.custom_data ?? {};

  console.log(`[webhook] subscription: status=${status} variantId=${variantId}`);
  console.log(`[webhook] custom_data:`, JSON.stringify(customData));

  if (!activate) {
    // Downgrade flow
    const sessionId = extractSessionId(customData);
    if (!sessionId) return;
    await writeKv(sessionId, 'free', 'downgrade');
    return;
  }

  if (!['active', 'trialing', 'past_due'].includes(status)) {
    console.log(`[webhook] Subscription status '${status}' — not activating`);
    return;
  }

  await activateFromVariant(variantId, customData);
}

// ─── Handle order_created (TEST mode + all live purchases) ───
async function handleOrder(payload) {
  const attrs      = payload?.data?.attributes || {};
  const status     = String(attrs.status ?? '');
  const customData = attrs.custom_data ?? payload?.meta?.custom_data ?? {};

  console.log(`[webhook] order: status=${status}`);
  console.log(`[webhook] order custom_data:`, JSON.stringify(customData));

  // Only process paid orders
  if (!['paid', 'pending'].includes(status)) {
    console.log(`[webhook] Order status '${status}' — skipping`);
    return;
  }

  // Extract variant from first order item
  const items = attrs.first_order_item
    ? [attrs.first_order_item]
    : (payload?.data?.relationships?.order_items?.data || []);

  // Try first_order_item directly
  const firstItem = attrs.first_order_item;
  const variantId = firstItem
    ? String(firstItem.variant_id ?? '')
    : '';

  console.log(`[webhook] order variantId=${variantId}`);

  if (variantId) {
    await activateFromVariant(variantId, customData);
  } else {
    console.error('[webhook] Could not extract variantId from order — payload:', JSON.stringify(attrs).slice(0, 500));
  }
}

// ─── Shared: map variant → tier and write KV ────────────────
async function activateFromVariant(variantId, customData) {
  const variantMap = getVariantMap();
  const tier = variantMap[variantId];

  console.log(`[webhook] variantId=${variantId} → tier=${tier || 'UNKNOWN'}`);

  if (!tier) {
    console.error(`[webhook] ❌ Unknown variantId=${variantId}`);
    console.error(`[webhook] Set LS_VARIANT_PLUS and LS_VARIANT_PRO env vars correctly`);
    console.error(`[webhook] Known map:`, JSON.stringify(variantMap));
    return;
  }

  const sessionId = extractSessionId(customData);
  if (!sessionId) return;

  await writeKv(sessionId, tier, 'activate');
}

// ─── Extract sessionId from custom_data ─────────────────────
function extractSessionId(customData) {
  const sessionId =
    customData?.sessionId ||
    customData?.session_id ||
    customData?.SessionId ||
    null;

  if (!sessionId) {
    console.error('[webhook] ❌ No sessionId in custom_data');
    console.error('[webhook] custom_data dump:', JSON.stringify(customData));
    console.error('[webhook] Make sure checkout URL includes: ?checkout[custom][sessionId]=SESSION_UUID');
    return null;
  }

  const sid = String(sessionId).trim();

  if (sid.includes('{') || sid.includes('}')) {
    console.error('[webhook] ❌ sessionId contains unresolved placeholder:', sid);
    return null;
  }

  return sid;
}

// ─── Write to KV with full logging ──────────────────────────
async function writeKv(sessionId, tier, reason) {
  const key = `tier:${sessionId}`;
  console.log(`[webhook] Writing KV: ${key} = ${tier} (reason: ${reason})`);
  const ok = await kvSet(key, tier);
  if (ok) {
    console.log(`[webhook] ✅ KV written: tier:${sessionId.slice(0, 10)}... = ${tier}`);
  } else {
    console.error(`[webhook] ❌ KV write FAILED for ${sessionId.slice(0, 10)}...`);
  }
}

// ─── Raw body reader ────────────────────────────────────────
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end',  () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// ─── Disable Vercel body parser for HMAC verification ───────
export const config = {
  api: { bodyParser: false },
};
