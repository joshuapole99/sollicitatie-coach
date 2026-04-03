// api/checkout.js
//
// Redirects to the correct LemonSqueezy checkout URL with sessionId injected.
// Frontend calls /api/checkout?plan=plus&sessionId=UUID
// → 302 to LemonSqueezy with ?checkout[custom][sessionId]=UUID
//
// ─── Required Vercel env vars ─────────────────────────────────
// APP_MODE = test | live   (controls which checkout URLs are used)
//
// TEST mode URLs (for LemonSqueezy test products):
//   LS_CHECKOUT_PLUS_TEST
//   LS_CHECKOUT_PRO_TEST
//
// LIVE mode URLs (for real products):
//   LS_CHECKOUT_PLUS_LIVE  (fallback: hardcoded live URL)
//   LS_CHECKOUT_PRO_LIVE   (fallback: hardcoded live URL)
//
// ─── Also update LS_VARIANT_PLUS / LS_VARIANT_PRO ───────────
// These must match the variant IDs of whichever mode is active.
// TEST Plus variant: 1478006  (from webhook payload)
// LIVE Plus variant: set LS_VARIANT_PLUS to the live variant ID
//
// ─── How sessionId flows ──────────────────────────────────────
// 1. Frontend generates UUID → localStorage('sol_session_id')
// 2. User clicks upgrade → GET /api/checkout?plan=plus&sessionId=UUID
// 3. This endpoint redirects to LemonSqueezy with ?checkout[custom][sessionId]=UUID
// 4. After payment, LemonSqueezy webhook fires with custom_data.sessionId=UUID
// 5. Webhook writes tier:UUID = 'plus' to KV
// 6. verify.js reads KV → returns tier=plus to frontend

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET')    return res.status(405).json({ error: 'Method not allowed' });

  const { plan, sessionId } = req.query;

  if (!plan || !['plus', 'pro'].includes(plan)) {
    return res.status(400).json({ error: 'plan must be "plus" or "pro"' });
  }
  if (!sessionId || String(sessionId).trim().length < 10) {
    return res.status(400).json({ error: 'sessionId required (UUID)' });
  }

  const sid  = String(sessionId).trim();
  const mode = String(process.env.APP_MODE || 'live').toLowerCase() === 'test' ? 'test' : 'live';

  // Resolve checkout base URL from env vars with hardcoded fallbacks
  let base;
  if (mode === 'test') {
    base = process.env.LS_CHECKOUT_PLUS_TEST || process.env.LS_CHECKOUT_PRO_TEST || null;
    // Plan-specific test URLs
    if (plan === 'plus') base = process.env.LS_CHECKOUT_PLUS_TEST || null;
    if (plan === 'pro')  base = process.env.LS_CHECKOUT_PRO_TEST  || null;

    if (!base) {
      console.error('[checkout] TEST mode but LS_CHECKOUT_PLUS_TEST / LS_CHECKOUT_PRO_TEST not set');
      return res.status(500).json({
        error: 'Test checkout URL not configured',
        hint: 'Set LS_CHECKOUT_PLUS_TEST and LS_CHECKOUT_PRO_TEST in Vercel env vars',
      });
    }
  } else {
    // Live mode
    const liveUrls = {
      plus: process.env.LS_CHECKOUT_PLUS_LIVE || 'https://sollicitatie-coach.lemonsqueezy.com/checkout/buy/18245f15-0847-400a-8688-cdf664bf9771',
      pro:  process.env.LS_CHECKOUT_PRO_LIVE  || 'https://sollicitatie-coach.lemonsqueezy.com/checkout/buy/7719f367-3c74-4f30-bd9e-323f3f66a382',
    };
    base = liveUrls[plan];
  }

  // Inject sessionId — this is the critical step that was missing
  const url = `${base}?checkout[custom][sessionId]=${encodeURIComponent(sid)}`;

  console.log(`[checkout] mode=${mode} plan=${plan} sid=${sid.slice(0, 10)}... → redirect`);

  res.setHeader('Location', url);
  res.setHeader('Cache-Control', 'no-store');
  return res.status(302).end();
}
