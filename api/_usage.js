// api/_usage.js — Server-side usage tracking
// Uses Vercel KV when available, falls back to in-memory (resets on cold start)
//
// TO ENABLE PERSISTENT TRACKING:
//   1. vercel env add KV_REST_API_URL
//   2. vercel env add KV_REST_API_TOKEN
//   Both are auto-set if you run: vercel kv create usage-store
//
// Without KV: usage resets on Vercel cold starts (~every few hours).
// With KV: fully persistent across all requests and restarts.

// ─── In-memory fallback ───────────────────────────────────────
const memStore = new Map();

// ─── KV helpers ───────────────────────────────────────────────
async function kvGet(key) {
  const url = process.env.KV_REST_API_URL;
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
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;
  try {
    const body = exSeconds
      ? `${JSON.stringify(value)}\r\nEX\r\n${exSeconds}`
      : JSON.stringify(value);
    const path = exSeconds
      ? `${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(value))}?ex=${exSeconds}`
      : `${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(value))}`;
    const r = await fetch(path, {
      method: 'GET', // Vercel KV REST uses GET for set with value in URL
      headers: { Authorization: `Bearer ${token}` },
    });
    return r.ok;
  } catch { return false; }
}

// ─── Month key helper ─────────────────────────────────────────
function monthKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

// ─── Get usage record ─────────────────────────────────────────
async function getUsage(sessionId, windowType) {
  const storeKey = windowType === 'monthly'
    ? `usage:${sessionId}:${monthKey()}`
    : `usage:${sessionId}:lifetime`;

  // Try KV first
  const kvData = await kvGet(storeKey);
  if (kvData !== null) return kvData;

  // Fall back to memory
  return memStore.get(storeKey) || { count: 0, firstUse: null };
}

// ─── Increment usage ──────────────────────────────────────────
async function incrementUsage(sessionId, windowType) {
  const storeKey = windowType === 'monthly'
    ? `usage:${sessionId}:${monthKey()}`
    : `usage:${sessionId}:lifetime`;

  const current = await getUsage(sessionId, windowType);
  const updated = {
    count: (current.count || 0) + 1,
    firstUse: current.firstUse || new Date().toISOString(),
    lastUse: new Date().toISOString(),
  };

  // Monthly: expire after 35 days (covers full month + buffer)
  const ex = windowType === 'monthly' ? 35 * 24 * 60 * 60 : null;
  await kvSet(storeKey, updated, ex);

  // Always update memory too (faster reads same request)
  memStore.set(storeKey, updated);

  return updated;
}

// ─── Check and enforce limit ──────────────────────────────────
// Returns { allowed, used, remaining, limit }
export async function checkAndEnforce(sessionId, tier, tierConfig) {
  const { maxAnalyses, windowType } = tierConfig;
  const usage = await getUsage(sessionId, windowType);
  const used = usage.count || 0;

  console.log(`[usage] sessionId=${sessionId.slice(0,8)}... tier=${tier} window=${windowType} used=${used}/${maxAnalyses}`);

  if (used >= maxAnalyses) {
    return { allowed: false, used, remaining: 0, limit: maxAnalyses };
  }

  return { allowed: true, used, remaining: maxAnalyses - used - 1, limit: maxAnalyses };
}

// ─── Record a used analysis ───────────────────────────────────
export async function recordUsage(sessionId, tierConfig) {
  const updated = await incrementUsage(sessionId, tierConfig.windowType);
  console.log(`[usage] Recorded use. New count: ${updated.count}`);
  return updated;
}
