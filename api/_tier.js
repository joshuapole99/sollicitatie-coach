// api/_tier.js — SINGLE shared tier resolver used by ALL endpoints
// Import this in analyse.js, session/verify.js, review.js
// NEVER duplicate this logic anywhere else

// ─── LemonSqueezy variant → tier mapping ─────────────────────
// Update these IDs if you add new products
const LS_VARIANT_MAP = {
  1478006: 'plus',  // Plus €2,99/mnd
  1468118: 'pro',   // Pro  €9,99/mnd
};

// ─── Tier config ──────────────────────────────────────────────
export const TIER_CONFIG = {
  free: {
    maxAnalyses: 3,
    windowType: 'lifetime',   // never resets
    coverLetter: false,
    pdf: false,
  },
  plus: {
    maxAnalyses: 10,
    windowType: 'monthly',
    coverLetter: true,
    pdf: false,
  },
  pro: {
    maxAnalyses: 100,
    windowType: 'monthly',
    coverLetter: true,
    pdf: true,
  },
};

// ─── LemonSqueezy lookup ──────────────────────────────────────
async function lsLookup(sessionId, apiKey) {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Accept: 'application/vnd.api+json',
  };

  const raw = sessionId.trim();

  // Guard: unresolved LS redirect placeholder
  if (raw.includes('{') || raw.includes('}')) {
    console.warn('[tier] Unresolved placeholder in sessionId — LS redirect misconfigured');
    return null;
  }

  // Strategy 1: numeric order ID → direct order lookup
  if (/^\d+$/.test(raw)) {
    try {
      const r = await fetch(`https://api.lemonsqueezy.com/v1/orders/${raw}`, { headers });
      if (r.ok) {
        const d = await r.json();
        const attrs = d?.data?.attributes;
        const variantId = attrs?.first_order_item?.variant_id;
        console.log(`[tier] S1 order ${raw}: status=${attrs?.status} variant=${variantId}`);
        if (attrs?.status === 'paid' && LS_VARIANT_MAP[variantId])
          return { tier: LS_VARIANT_MAP[variantId], source: 'order_direct' };
      }
    } catch (e) { console.error('[tier] S1 error:', e.message); }
  }

  // Strategy 2: extract numeric prefix from compound token (ls_123_abc)
  const numericMatch = raw.match(/^(?:ls_)?(\d+)/);
  const extractedId = numericMatch?.[1];
  if (extractedId && extractedId !== raw) {
    try {
      const r = await fetch(`https://api.lemonsqueezy.com/v1/orders/${extractedId}`, { headers });
      if (r.ok) {
        const d = await r.json();
        const attrs = d?.data?.attributes;
        const variantId = attrs?.first_order_item?.variant_id;
        console.log(`[tier] S2 extracted order ${extractedId}: status=${attrs?.status} variant=${variantId}`);
        if (attrs?.status === 'paid' && LS_VARIANT_MAP[variantId])
          return { tier: LS_VARIANT_MAP[variantId], source: 'order_extracted' };
      }
    } catch (e) { console.error('[tier] S2 error:', e.message); }
  }

  // Strategy 3: order identifier filter (UUID-style token from LS)
  try {
    const r = await fetch(
      `https://api.lemonsqueezy.com/v1/orders?filter[identifier]=${encodeURIComponent(raw)}`,
      { headers }
    );
    if (r.ok) {
      const d = await r.json();
      const order = d?.data?.[0];
      const variantId = order?.attributes?.first_order_item?.variant_id;
      console.log(`[tier] S3 identifier filter: status=${order?.attributes?.status} variant=${variantId}`);
      if (order?.attributes?.status === 'paid' && LS_VARIANT_MAP[variantId])
        return { tier: LS_VARIANT_MAP[variantId], source: 'order_filter' };
    }
  } catch (e) { console.error('[tier] S3 error:', e.message); }

  // Strategy 4: subscription direct lookup
  try {
    const r = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${raw}`, { headers });
    if (r.ok) {
      const d = await r.json();
      const sub = d?.data?.attributes;
      console.log(`[tier] S4 subscription ${raw}: status=${sub?.status} variant=${sub?.variant_id}`);
      if (['active', 'trialing'].includes(sub?.status) && LS_VARIANT_MAP[sub?.variant_id])
        return { tier: LS_VARIANT_MAP[sub.variant_id], source: 'subscription_direct' };
    }
  } catch (e) { console.error('[tier] S4 error:', e.message); }

  // Strategy 5: subscription filter by order_id
  const orderId = extractedId || (/^\d+$/.test(raw) ? raw : null);
  if (orderId) {
    try {
      const r = await fetch(
        `https://api.lemonsqueezy.com/v1/subscriptions?filter[order_id]=${orderId}`,
        { headers }
      );
      if (r.ok) {
        const d = await r.json();
        const sub = d?.data?.[0]?.attributes;
        console.log(`[tier] S5 sub by order ${orderId}: status=${sub?.status} variant=${sub?.variant_id}`);
        if (['active', 'trialing'].includes(sub?.status) && LS_VARIANT_MAP[sub?.variant_id])
          return { tier: LS_VARIANT_MAP[sub.variant_id], source: 'subscription_filter' };
      }
    } catch (e) { console.error('[tier] S5 error:', e.message); }
  }

  console.warn('[tier] All strategies exhausted for:', raw.slice(0, 12) + '...');
  return null;
}

// ─── MAIN EXPORT: resolveTier ─────────────────────────────────
// Called by every endpoint. Returns full tier info.
export async function resolveTier(sessionId) {
  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
    return { tier: 'free', config: TIER_CONFIG.free, source: 'no_session' };
  }

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    console.error('[tier] LEMONSQUEEZY_API_KEY not set');
    return { tier: 'free', config: TIER_CONFIG.free, source: 'no_api_key' };
  }

  const result = await lsLookup(sessionId.trim(), apiKey);

  if (!result) {
    return { tier: 'free', config: TIER_CONFIG.free, source: 'not_found' };
  }

  console.log(`[tier] Resolved: ${result.tier} via ${result.source}`);
  return {
    tier: result.tier,
    config: TIER_CONFIG[result.tier],
    source: result.source,
  };
}
