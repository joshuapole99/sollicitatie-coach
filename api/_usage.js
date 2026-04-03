// api/_usage.js — Server-side usage tracking
// Uses Upstash/Vercel KV REST API with ATOMIC INCR (no race conditions)
// Falls back to in-memory only when KV is not configured (dev mode)

// ─── In-memory fallback (dev only — resets on cold start) ─────
const memStore = new Map();

// ─── KV REST helpers ──────────────────────────────────────────
function kvHeaders() {
  return { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` };
}
function kvUrl() { return process.env.KV_REST_API_URL; }
function hasKv()  { return !!(kvUrl() && process.env.KV_REST_API_TOKEN); }

// Atomic increment — returns new integer value
async function kvIncr(key) {
  if (!hasKv()) {
    const cur = (memStore.get(key) || 0);
    memStore.set(key, cur + 1);
    return cur + 1;
  }
  try {
    const r = await fetch(`${kvUrl()}/incr/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: kvHeaders(),
    });
    if (!r.ok) throw new Error(`INCR ${r.status}`);
    const d = await r.json();
    return d.result;
  } catch (e) {
    console.error('[usage] kvIncr failed:', e.message);
    throw e;
  }
}

// Set TTL in seconds on an existing key
async function kvExpire(key, seconds) {
  if (!hasKv()) return;
  try {
    await fetch(`${kvUrl()}/expire/${encodeURIComponent(key)}/${seconds}`, {
      method: 'POST',
      headers: kvHeaders(),
    });
  } catch (e) {
    console.error('[usage] kvExpire failed:', e.message);
  }
}

// Plain GET — returns raw string or null
async function kvGet(key) {
  if (!hasKv()) return memStore.has(key) ? String(memStore.get(key)) : null;
  try {
    const r = await fetch(`${kvUrl()}/get/${encodeURIComponent(key)}`, {
      headers: kvHeaders(),
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d.result ?? null;
  } catch { return null; }
}

// ─── Month key ────────────────────────────────────────────────
function monthKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

// ─── Build KV usage key ───────────────────────────────────────
// FREE  → usage:lifetime:{sessionId}          (never expires)
// PLUS/PRO → usage:monthly:{sessionId}:YYYY-MM (expires after 35d)
function buildKey(sessionId, windowType) {
  return windowType === 'monthly'
    ? `usage:monthly:${sessionId}:${monthKey()}`
    : `usage:lifetime:${sessionId}`;
}

// ─── Get current count (read-only) ───────────────────────────
async function getCount(sessionId, windowType) {
  const key = buildKey(sessionId, windowType);
  const val = await kvGet(key);
  return val !== null ? parseInt(val, 10) : 0;
}

// ─── Check and enforce limit ──────────────────────────────────
// Returns { allowed, used, remaining, limit }
// Does NOT increment — call recordUsage() after successful AI response
export async function checkAndEnforce(sessionId, tier, tierConfig) {
  const { maxAnalyses, windowType } = tierConfig;
  const used = await getCount(sessionId, windowType);

  console.log(`[usage] check: ${sessionId.slice(0,8)}... tier=${tier} window=${windowType} used=${used}/${maxAnalyses}`);

  if (used >= maxAnalyses) {
    return { allowed: false, used, remaining: 0, limit: maxAnalyses };
  }

  return { allowed: true, used, remaining: maxAnalyses - used - 1, limit: maxAnalyses };
}

// ─── Record a used analysis (ATOMIC) ─────────────────────────
// Called AFTER successful AI response — never before
export async function recordUsage(sessionId, tierConfig) {
  const { windowType } = tierConfig;
  const key = buildKey(sessionId, windowType);

  const newCount = await kvIncr(key);

  // Set expiry on monthly keys (35 days = full month + buffer)
  // Re-set on every increment — idempotent and safe
  if (windowType === 'monthly') {
    await kvExpire(key, 35 * 24 * 60 * 60);
  }

  console.log(`[usage] recorded: key=${key.slice(0,30)}... newCount=${newCount}`);
  return newCount;
}
