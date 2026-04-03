// api/session/verify.js
// Single entry point for tier verification.
// Called by frontend on page load and immediately after payment redirect.
// Returns tier + usage info. Frontend ONLY reads this — never calculates tier itself.

import { resolveTier } from '../_tier.js';
import { checkAndEnforce } from '../_usage.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sessionId } = req.body || {};
  const sid = (typeof sessionId === 'string' ? sessionId.trim() : '') || null;

  console.log('[verify] sessionId:', sid ? sid.slice(0, 12) + '...' : 'NONE');

  // Resolve tier from KV (single read, deterministic)
  const { tier, config, source } = await resolveTier(sid);

  // Usage: always check against sessionId (stable, paid users always have one)
  // For sessions without KV tier record (free users), still check usage by sid
  let usageData = { used: 0, remaining: config.maxAnalyses, limit: config.maxAnalyses, windowType: config.windowType };
  let blocked = false;

  if (sid) {
    const result = await checkAndEnforce(sid, tier, config);
    usageData = {
      used:       result.used,
      remaining:  result.remaining,
      limit:      result.limit,
      windowType: config.windowType,
    };
    blocked = !result.allowed;
  }

  console.log(`[verify] tier=${tier} source=${source} used=${usageData.used}/${usageData.limit} blocked=${blocked}`);

  return res.status(200).json({
    tier,                          // 'free' | 'plus' | 'pro'
    canPdf:      config.pdf,       // true only for pro
    coverLetter: config.coverLetter,
    usage:       usageData,
    source,                        // for debugging
    blocked,
  });
}
