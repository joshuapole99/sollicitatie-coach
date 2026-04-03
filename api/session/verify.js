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

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sessionId } = req.body || {};

  console.log('[verify] Request for sessionId:', sessionId
    ? sessionId.slice(0, 12) + '...'
    : 'NONE');

  // Resolve tier from LemonSqueezy (or free if no session)
  const { tier, config, source } = await resolveTier(sessionId);

  // Get current usage for this session
  const usageKey = sessionId || 'anonymous';
  const { used, remaining, limit, allowed } = await checkAndEnforce(usageKey, tier, config);

  console.log(`[verify] Result: tier=${tier} source=${source} used=${used}/${limit} allowed=${allowed}`);

  return res.status(200).json({
    tier,                        // 'free' | 'plus' | 'pro'
    canPdf: config.pdf,          // true only for pro
    coverLetter: config.coverLetter,
    usage: { used, remaining, limit, windowType: config.windowType },
    source,                      // for debugging
    blocked: !allowed,           // true if limit reached
  });
}
