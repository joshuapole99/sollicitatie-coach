export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // DEV MODE BYPASS
  if (process.env.APP_MODE === 'dev') {
    return res.status(200).json({ tier: 'pro', canPdf: true, mode: 'dev' });
  }

  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(200).json({ tier: 'free', canPdf: false });

  const apiKey = process.env.LEMONSQUEEZY_API_KEY_LIVE || process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) return res.status(200).json({ tier: 'free', canPdf: false });

  const PLUS_VARIANTS = ['1478006'];
  const PRO_VARIANTS  = ['1468118'];

  try {
    // Extract order ID from session — format: ls_{orderId}_{hash} or raw orderId
    const rawId = sessionId.startsWith('ls_') ? sessionId.split('_')[1] : sessionId;
    if (!rawId) return res.status(200).json({ tier: 'free', canPdf: false });

    const headers = { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' };

    // Strategy 1: direct order lookup
    let variantId = null;
    let subStatus = null;

    const orderResp = await fetch(`https://api.lemonsqueezy.com/v1/orders/${rawId}`, { headers });
    if (orderResp.ok) {
      const orderData = await orderResp.json();
      const orderStatus = orderData.data?.attributes?.status;
      if (!['paid', 'refunded'].includes(orderStatus)) {
        return res.status(200).json({ tier: 'free', canPdf: false });
      }
      // Get subscription for this order
      const subsResp = await fetch(
        `https://api.lemonsqueezy.com/v1/subscriptions?filter[order_id]=${rawId}`,
        { headers }
      );
      if (subsResp.ok) {
        const subsData = await subsResp.json();
        if (subsData.data?.length > 0) {
          const sub = subsData.data[0];
          subStatus = sub.attributes?.status;
          variantId = String(sub.attributes?.variant_id);
        }
      }
    }

    // Strategy 2: treat rawId as subscription ID
    if (!variantId) {
      const subResp = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${rawId}`, { headers });
      if (subResp.ok) {
        const subData = await subResp.json();
        subStatus = subData.data?.attributes?.status;
        variantId = String(subData.data?.attributes?.variant_id);
      }
    }

    if (!variantId) return res.status(200).json({ tier: 'free', canPdf: false });

    // Check subscription is active
    if (subStatus && !['active', 'trialing', 'past_due'].includes(subStatus)) {
      return res.status(200).json({ tier: 'free', canPdf: false });
    }

    const tier = PRO_VARIANTS.includes(variantId) ? 'pro'
               : PLUS_VARIANTS.includes(variantId) ? 'plus'
               : 'free';

    return res.status(200).json({ tier, canPdf: tier === 'pro' });

  } catch (e) {
    console.error('session-verify error:', e.message);
    return res.status(200).json({ tier: 'free', canPdf: false });
  }
}
