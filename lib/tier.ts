// lib/tier.ts — Shared tier resolver (ported from api/_tier.js)
// Source of truth: Upstash KV key `tier:{sessionId}` written by LemonSqueezy webhook

async function kvGet(key: string): Promise<string | null> {
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    console.warn('[tier] KV not configured — KV_REST_API_URL / KV_REST_API_TOKEN missing');
    return null;
  }
  try {
    const r = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!r.ok) return null;
    const d = await r.json();
    const raw = d.result;
    if (raw === null || raw === undefined) return null;
    return String(raw).replace(/^"|"$/g, '').trim();
  } catch (e: any) {
    console.error('[tier] kvGet error:', e.message);
    return null;
  }
}

export type Tier = 'free' | 'plus' | 'pro';

export interface TierConfig {
  maxAnalyses: number;
  windowType: 'lifetime' | 'monthly';
  coverLetter: boolean;
  pdf: boolean;
}

export const TIER_CONFIG: Record<Tier, TierConfig> = {
  free: { maxAnalyses: 3,   windowType: 'lifetime', coverLetter: false, pdf: false },
  plus: { maxAnalyses: 10,  windowType: 'monthly',  coverLetter: true,  pdf: false },
  pro:  { maxAnalyses: 100, windowType: 'monthly',  coverLetter: true,  pdf: true  },
};

export async function resolveTier(sessionId: string | null): Promise<{
  tier: Tier;
  config: TierConfig;
  source: string;
}> {
  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
    return { tier: 'free', config: TIER_CONFIG.free, source: 'no_session' };
  }
  const sid = sessionId.trim();
  if (sid.includes('{') || sid.includes('}')) {
    return { tier: 'free', config: TIER_CONFIG.free, source: 'invalid_session' };
  }
  const stored = await kvGet(`tier:${sid}`);
  if (stored === 'plus' || stored === 'pro') {
    return { tier: stored, config: TIER_CONFIG[stored], source: 'kv' };
  }
  return { tier: 'free', config: TIER_CONFIG.free, source: 'not_found' };
}
