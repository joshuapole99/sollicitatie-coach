// api/_tier.js — SINGLE shared tier resolver used by ALL endpoints
// Import this in analyse.js, session/verify.js, review.js
// NEVER duplicate this logic anywhere else
//
// ✅ Source of truth: KV key `tier:{sessionId}` (written by webhook)
// ❌ REMOVED: LemonSqueezy API lookup (was non-deterministic, always returned not_found)

// ─── KV helper ────────────────────────────────────────────────
async function kvGet(key) {
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const r = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d.result ?? null;
  } catch { return null; }
}

// ─── Tier config ──────────────────────────────────────────────
export const TIER_CONFIG = {
  free: {
    maxAnalyses: 3,
    windowType:  'lifetime',  // never resets
    coverLetter: false,
    pdf:         false,
  },
  plus: {
    maxAnalyses: 10,
    windowType:  'monthly',
    coverLetter: true,
    pdf:         false,
  },
  pro: {
    maxAnalyses: 100,
    windowType:  'monthly',
    coverLetter: true,
    pdf:         true,
  },
};

// ─── MAIN EXPORT: resolveTier ─────────────────────────────────
// Reads tier from KV `tier:{sessionId}` — written by webhook on payment.
// Returns free if no session or no KV record (new user, not paid).
export async function resolveTier(sessionId) {
  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
    console.log('[tier] No sessionId — free');
    return { tier: 'free', config: TIER_CONFIG.free, source: 'no_session' };
  }

  const sid = sessionId.trim();

  // Guard against unresolved LemonSqueezy template placeholders
  if (sid.includes('{') || sid.includes('}')) {
    console.warn('[tier] Unresolved placeholder in sessionId — checkout misconfigured');
    return { tier: 'free', config: TIER_CONFIG.free, source: 'invalid_session' };
  }

  // KV lookup — single deterministic read
  const stored = await kvGet(`tier:${sid}`);

  if (stored === 'plus' || stored === 'pro') {
    console.log(`[tier] KV hit: ${sid.slice(0, 8)}... → ${stored}`);
    return { tier: stored, config: TIER_CONFIG[stored], source: 'kv' };
  }

  // No KV record → free (new user or payment not yet processed)
  console.log(`[tier] KV miss: ${sid.slice(0, 8)}... → free (stored=${stored})`);
  return { tier: 'free', config: TIER_CONFIG.free, source: 'not_found' };
}
