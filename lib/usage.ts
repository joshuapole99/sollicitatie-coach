// lib/usage.ts — Server-side usage tracking (ported from api/_usage.js)
// Uses Upstash KV REST API with ATOMIC INCR

import type { TierConfig } from './tier';

function kvHeaders() {
  return { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` };
}
function kvUrl() { return process.env.KV_REST_API_URL || ''; }
function hasKv()  { return !!(kvUrl() && process.env.KV_REST_API_TOKEN); }

// In-memory fallback for local dev (resets on cold start)
const memStore = new Map<string, number>();

async function kvIncr(key: string): Promise<number> {
  if (!hasKv()) {
    const cur = memStore.get(key) || 0;
    memStore.set(key, cur + 1);
    return cur + 1;
  }
  const r = await fetch(`${kvUrl()}/incr/${encodeURIComponent(key)}`, {
    method: 'POST', headers: kvHeaders(), cache: 'no-store',
  });
  if (!r.ok) throw new Error(`INCR ${r.status}`);
  const d = await r.json();
  return d.result;
}

async function kvExpire(key: string, seconds: number) {
  if (!hasKv()) return;
  await fetch(`${kvUrl()}/expire/${encodeURIComponent(key)}/${seconds}`, {
    method: 'POST', headers: kvHeaders(), cache: 'no-store',
  }).catch(() => {});
}

async function kvGet(key: string): Promise<string | null> {
  if (!hasKv()) return memStore.has(key) ? String(memStore.get(key)) : null;
  try {
    const r = await fetch(`${kvUrl()}/get/${encodeURIComponent(key)}`, {
      headers: kvHeaders(), cache: 'no-store',
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d.result ?? null;
  } catch { return null; }
}

function monthKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function buildKey(sessionId: string, windowType: 'lifetime' | 'monthly') {
  return windowType === 'monthly'
    ? `usage:monthly:${sessionId}:${monthKey()}`
    : `usage:lifetime:${sessionId}`;
}

async function getCount(sessionId: string, windowType: 'lifetime' | 'monthly') {
  const val = await kvGet(buildKey(sessionId, windowType));
  return val !== null ? parseInt(val, 10) : 0;
}

export async function checkAndEnforce(
  sessionId: string,
  tier: string,
  tierConfig: TierConfig
): Promise<{ allowed: boolean; used: number; remaining: number; limit: number }> {
  const { maxAnalyses, windowType } = tierConfig;
  const used = await getCount(sessionId, windowType);
  if (used >= maxAnalyses) {
    return { allowed: false, used, remaining: 0, limit: maxAnalyses };
  }
  return { allowed: true, used, remaining: maxAnalyses - used - 1, limit: maxAnalyses };
}

export async function recordUsage(sessionId: string, tierConfig: TierConfig): Promise<number> {
  const { windowType } = tierConfig;
  const key = buildKey(sessionId, windowType);
  const newCount = await kvIncr(key);
  if (windowType === 'monthly') {
    await kvExpire(key, 35 * 24 * 60 * 60);
  }
  return newCount;
}
