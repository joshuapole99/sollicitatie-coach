export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // DEV MODE
  if (process.env.APP_MODE === 'dev') {
    return res.status(200).json({ success: true, tier: 'pro', canPdf: true, sessionId: 'ls_dev_test', mode: 'dev' });
  }

  const { email, order } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });
  if (!order) return res.status(400).json({ error: 'Order number required' });

  const apiKey = process.env.LEMONSQUEEZY_API_KEY_LIVE || process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server configuration error' });

  const PLUS_VARIANTS = ['1478006'];
  const PRO_VARIANTS  = ['1468118'];

  const headers = { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' };

  try {
    const orderNum = order.replace(/\D/g, '');
    let foundOrder = null;

    // Strategy 1: direct numeric order ID
    if (orderNum) {
      const r = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderNum}`, { headers });
      if (r.ok) {
        const d = await r.json();
        foundOrder = d.data;
      }
    }

    // Strategy 2: filter by identifier (UUID format)
    if (!foundOrder) {
      const r = await fetch(
        `https://api.lemonsqueezy.com/v1/orders?filter[identifier]=${encodeURIComponent(order)}`,
        { headers }
      );
      if (r.ok) {
        const d = await r.json();
        if (d.data?.length > 0) foundOrder = d.data[0];
      }
    }

    if (!foundOrder) return res.status(404).json({ error: 'Order not found' });

    // Validate email
    const orderEmail = (foundOrder.attributes?.user_email || '').toLowerCase();
    if (orderEmail !== email.toLowerCase()) {
      return res.status(404).json({ error: 'Email does not match order' });
    }

    // Validate payment status
    const orderStatus = foundOrder.attributes?.status;
    if (!['paid', 'refunded'].includes(orderStatus)) {
      return res.status(404).json({ error: 'Order not paid' });
    }

    const orderId = foundOrder.id;

    // Get subscription to determine tier
    let tier = 'plus'; // default
    const subsResp = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions?filter[order_id]=${orderId}`,
      { headers }
    );

    if (subsResp.ok) {
      const subsData = await subsResp.json();
      if (subsData.data?.length > 0) {
        const sub = subsData.data[0];
        const subStatus = sub.attributes?.status;
        if (!['active', 'trialing', 'past_due'].includes(subStatus)) {
          return res.status(404).json({ error: 'Subscription not active' });
        }
        const variantId = String(sub.attributes?.variant_id);
        if (PRO_VARIANTS.includes(variantId)) tier = 'pro';
        else if (PLUS_VARIANTS.includes(variantId)) tier = 'plus';
      }
    }

    // Build session ID
    const sessionId = `ls_${orderId}_${Buffer.from(email.toLowerCase()).toString('base64').slice(0, 8)}`;

    return res.status(200).json({
      success: true,
      tier,
      canPdf: tier === 'pro',
      sessionId
    });

  } catch (e) {
    console.error('Activation error:', e.message);
    return res.status(500).json({ error: 'Activation failed: ' + e.message });
  }
}
