// api/_usage.js — Server-side usage tracking
// Uses Vercel KV when available, falls back to in-memory (resets on cold start)
//
// TO ENABLE PERSISTENT TRACKING:
//   vercel kv create usage-store
//   (auto-sets KV_REST_API_URL and KV_REST_API_TOKEN)

// ─── In-memory fallback ───────────────────────────────────────
const memStore = new Map();

// ─── KV helpers ───────────────────────────────────────────────
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
    return d.result ? JSON.parse(d.result) : null;
  } catch { return null; }
}

async function kvSet(key, value, exSeconds) {
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;
  try {
    // FIX: Vercel KV REST API uses POST with JSON body, not GET with URL encoding
    const body = { value: JSON.stringify(value) };
    if (exSeconds) body.ex = exSeconds;
    const r = await fetch(`${url}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return r.ok;
  } catch { return false; }
}

// ─── Month key ────────────────────────────────────────────────
function monthKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

// ─── Build store key ──────────────────────────────────────────
function buildKey(sessionId, windowType) {
  return windowType === 'monthly'
    ? `usage:${sessionId}:${monthKey()}`
    : `usage:${sessionId}:lifetime`;
}

// ─── Get usage record ─────────────────────────────────────────
async function getUsage(sessionId, windowType) {
  const key = buildKey(sessionId, windowType);
  const kvData = await kvGet(key);
  if (kvData !== null) return kvData;
  return memStore.get(key) || { count: 0, firstUse: null };
}

// ─── Increment usage ──────────────────────────────────────────
async function incrementUsage(sessionId, windowType) {
  const key     = buildKey(sessionId, windowType);
  const current = await getUsage(sessionId, windowType);
  const updated = {
    count:    (current.count || 0) + 1,
    firstUse: current.firstUse || new Date().toISOString(),
    lastUse:  new Date().toISOString(),
  };

  // Monthly: expire after 35 days (covers full month + buffer)
  const ex = windowType === 'monthly' ? 35 * 24 * 60 * 60 : null;
  await kvSet(key, updated, ex);

  // Always update memory (faster for same-request reads)
  memStore.set(key, updated);
  return updated;
}

// ─── Check and enforce limit ──────────────────────────────────
// Returns { allowed, used, remaining, limit }
export async function checkAndEnforce(sessionId, tier, tierConfig) {
  const { maxAnalyses, windowType } = tierConfig;
  const usage = await getUsage(sessionId, windowType);
  const used  = usage.count || 0;

  console.log(`[usage] key=${sessionId.slice(0,8)}... tier=${tier} window=${windowType} used=${used}/${maxAnalyses}`);

  if (used >= maxAnalyses) {
    return { allowed: false, used, remaining: 0, limit: maxAnalyses };
  }

  return { allowed: true, used, remaining: maxAnalyses - used - 1, limit: maxAnalyses };
}

// ─── Record a used analysis ───────────────────────────────────
export async function recordUsage(sessionId, tierConfig) {
  const updated = await incrementUsage(sessionId, tierConfig.windowType);
  console.log(`[usage] Recorded. New count: ${updated.count}`);
  return updated;
}
