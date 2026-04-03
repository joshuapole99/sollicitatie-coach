// api/_tier.js — SINGLE shared tier resolver used by ALL endpoints
// Import this in analyse.js, session/verify.js
// NEVER duplicate this logic anywhere else
//
// ✅ Source of truth: KV key `tier:{sessionId}` (written by webhook)
// ✅ Reads plain string 'plus' or 'pro' — no JSON.parse needed
// ❌ No LemonSqueezy API calls

// ─── KV GET ──────────────────────────────────────────────────
async function kvGet(key) {
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    console.warn('[tier] KV not configured — KV_REST_API_URL / KV_REST_API_TOKEN missing');
    return null;
  }
  try {
    const r = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) {
      console.error(`[tier] kvGet HTTP ${r.status} for key ${key}`);
      return null;
    }
    const d = await r.json();
    // Upstash returns { result: "plus" } for plain strings
    // or { result: null } when key doesn't exist
    const raw = d.result;
    if (raw === null || raw === undefined) return null;
    // Strip JSON quotes if value was accidentally stored as '"plus"'
    // This provides backward-compat if old webhook ran before this fix
    const val = String(raw).replace(/^"|"$/g, '').trim();
    return val;
  } catch (e) {
    console.error('[tier] kvGet error:', e.message);
    return null;
  }
}

// ─── Tier config ─────────────────────────────────────────────
export const TIER_CONFIG = {
  free: {
    maxAnalyses: 3,
    windowType:  'lifetime',
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

// ─── resolveTier ─────────────────────────────────────────────
export async function resolveTier(sessionId) {
  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
    console.log('[tier] No sessionId → free');
    return { tier: 'free', config: TIER_CONFIG.free, source: 'no_session' };
  }

  const sid = sessionId.trim();

  if (sid.includes('{') || sid.includes('}')) {
    console.warn('[tier] Unresolved placeholder in sessionId');
    return { tier: 'free', config: TIER_CONFIG.free, source: 'invalid_session' };
  }

  const stored = await kvGet(`tier:${sid}`);
  console.log(`[tier] KV lookup tier:${sid.slice(0, 10)}... → raw="${stored}"`);

  if (stored === 'plus' || stored === 'pro') {
    return { tier: stored, config: TIER_CONFIG[stored], source: 'kv' };
  }

  return { tier: 'free', config: TIER_CONFIG.free, source: 'not_found' };
}
