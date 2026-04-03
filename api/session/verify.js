// api/session/verify.js
// Single source of truth for tier verification
// Called by frontend immediately after payment redirect and on page load

import { createHash } from 'crypto';

const LEMON_SQUEEZY_VARIANTS = {
  1478006: 'plus',
  1468118: 'pro',
};

async function lookupTier(sessionId) {
  if (!sessionId || typeof sessionId !== 'string') return { tier: 'free', reason: 'no_session' };

  const raw = sessionId.trim();

  // Guard: reject unresolved placeholders from LS redirect template
  if (raw.includes('{') || raw.includes('}')) {
    console.warn('[verify] Unresolved placeholder in sessionId:', raw);
    return { tier: 'free', reason: 'placeholder_not_replaced' };
  }

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    console.error('[verify] LEMONSQUEEZY_API_KEY not set');
    return { tier: 'free', reason: 'no_api_key' };
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Accept: 'application/vnd.api+json',
  };

  console.log('[verify] Looking up sessionId:', raw.slice(0, 12) + '...');

  // ── Strategy 1: raw is a numeric order ID ──────────────────
  if (/^\d+$/.test(raw)) {
    console.log('[verify] Strategy 1: numeric order ID');
    try {
      const r = await fetch(`https://api.lemonsqueezy.com/v1/orders/${raw}`, { headers });
      if (r.ok) {
        const d = await r.json();
        const variantId = d?.data?.attributes?.first_order_item?.variant_id;
        const status = d?.data?.attributes?.status;
        console.log('[verify] Order status:', status, 'variantId:', variantId);
        if (status === 'paid' && LEMON_SQUEEZY_VARIANTS[variantId]) {
          return { tier: LEMON_SQUEEZY_VARIANTS[variantId], reason: 'order_direct', orderId: raw };
        }
      }
    } catch (e) { console.error('[verify] Strategy 1 error:', e.message); }
  }

  // ── Strategy 2: extract numeric ID from compound token ─────
  // Handles formats like: ls_123456_abc, 123456_abc, etc.
  const numericMatch = raw.match(/^(?:ls_)?(\d+)/);
  if (numericMatch && numericMatch[1] !== raw) {
    const orderId = numericMatch[1];
    console.log('[verify] Strategy 2: extracted orderId', orderId);
    try {
      const r = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, { headers });
      if (r.ok) {
        const d = await r.json();
        const variantId = d?.data?.attributes?.first_order_item?.variant_id;
        const status = d?.data?.attributes?.status;
        console.log('[verify] Order status:', status, 'variantId:', variantId);
        if (status === 'paid' && LEMON_SQUEEZY_VARIANTS[variantId]) {
          return { tier: LEMON_SQUEEZY_VARIANTS[variantId], reason: 'order_extracted', orderId };
        }
      }
    } catch (e) { console.error('[verify] Strategy 2 error:', e.message); }
  }

  // ── Strategy 3: order identifier filter (UUID-style) ───────
  console.log('[verify] Strategy 3: order identifier filter');
  try {
    const r = await fetch(
      `https://api.lemonsqueezy.com/v1/orders?filter[identifier]=${encodeURIComponent(raw)}`,
      { headers }
    );
    if (r.ok) {
      const d = await r.json();
      const order = d?.data?.[0];
      if (order) {
        const variantId = order.attributes?.first_order_item?.variant_id;
        const status = order.attributes?.status;
        console.log('[verify] Order filter status:', status, 'variantId:', variantId);
        if (status === 'paid' && LEMON_SQUEEZY_VARIANTS[variantId]) {
          return { tier: LEMON_SQUEEZY_VARIANTS[variantId], reason: 'order_filter' };
        }
      }
    }
  } catch (e) { console.error('[verify] Strategy 3 error:', e.message); }

  // ── Strategy 4: subscription direct lookup ─────────────────
  console.log('[verify] Strategy 4: subscription direct');
  try {
    const r = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${raw}`, { headers });
    if (r.ok) {
      const d = await r.json();
      const sub = d?.data;
      const variantId = sub?.attributes?.variant_id;
      const status = sub?.attributes?.status;
      console.log('[verify] Sub status:', status, 'variantId:', variantId);
      if (['active', 'trialing'].includes(status) && LEMON_SQUEEZY_VARIANTS[variantId]) {
        return { tier: LEMON_SQUEEZY_VARIANTS[variantId], reason: 'subscription_direct' };
      }
    }
  } catch (e) { console.error('[verify] Strategy 4 error:', e.message); }

  // ── Strategy 5: subscription filter by order_id ────────────
  if (/^\d+$/.test(raw) || numericMatch) {
    const orderId = numericMatch ? numericMatch[1] : raw;
    console.log('[verify] Strategy 5: subscription filter by order_id', orderId);
    try {
      const r = await fetch(
        `https://api.lemonsqueezy.com/v1/subscriptions?filter[order_id]=${orderId}`,
        { headers }
      );
      if (r.ok) {
        const d = await r.json();
        const sub = d?.data?.[0];
        const variantId = sub?.attributes?.variant_id;
        const status = sub?.attributes?.status;
        console.log('[verify] Sub filter status:', status, 'variantId:', variantId);
        if (['active', 'trialing'].includes(status) && LEMON_SQUEEZY_VARIANTS[variantId]) {
          return { tier: LEMON_SQUEEZY_VARIANTS[variantId], reason: 'subscription_filter' };
        }
      }
    } catch (e) { console.error('[verify] Strategy 5 error:', e.message); }
  }

  console.warn('[verify] All strategies exhausted — returning free for sessionId:', raw.slice(0, 12));
  return { tier: 'free', reason: 'not_found' };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sessionId } = req.body || {};
  const { tier, reason, orderId } = await lookupTier(sessionId);

  return res.status(200).json({
    tier,
    canPdf: tier === 'pro',
    reason, // helpful for debugging, safe to expose
    ...(orderId ? { orderId } : {}),
  });
}
