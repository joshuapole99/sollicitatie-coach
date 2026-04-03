export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, order } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });
  if (!order) return res.status(400).json({ error: 'Order number required' });

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server configuration error' });

  const PLUS_VARIANT_IDS  = ['1478006'];
  const PRO_VARIANT_IDS   = ['1468118'];

  try {
    // Stap 1: Zoek order op nummer
    const orderNum = order.replace(/\D/g, '');
    let foundOrder = null;
    let foundTier = null;

    // Probeer directe order lookup
    if (orderNum) {
      const orderResp = await fetch(
        `https://api.lemonsqueezy.com/v1/orders/${orderNum}`,
        { headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' } }
      );
      if (orderResp.ok) {
        const orderData = await orderResp.json();
        foundOrder = orderData.data;
      }
    }

    // Als directe lookup faalt, zoek via filter
    if (!foundOrder) {
      const searchResp = await fetch(
        `https://api.lemonsqueezy.com/v1/orders?filter[identifier]=${encodeURIComponent(order)}`,
        { headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' } }
      );
      if (searchResp.ok) {
        const searchData = await searchResp.json();
        if (searchData.data?.length > 0) foundOrder = searchData.data[0];
      }
    }

    if (!foundOrder) return res.status(404).json({ 
      error: 'Order not found',
      debug_orderNum: orderNum,
      debug_originalOrder: order
    });

    if (!foundOrder) {
  // Extra: probeer orders lijst ophalen om te zien wat er is
  const listResp = await fetch(
    `https://api.lemonsqueezy.com/v1/orders?page[size]=5`,
    { headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' } }
  );
  const listData = listResp.ok ? await listResp.json() : { error: 'list failed' };
  return res.status(404).json({ 
    error: 'Order not found',
    debug_orderNum: orderNum,
    debug_listSample: listData?.data?.map(o => ({ id: o.id, number: o.attributes?.order_number, email: o.attributes?.user_email }))
  });
}

    // Stap 2: Valideer email
    const orderEmail = foundOrder.attributes?.user_email?.toLowerCase();
    if (orderEmail !== email.toLowerCase()) {
      return res.status(404).json({ error: 'Email does not match order' });
    }

    // Stap 3: Check order status
    const orderStatus = foundOrder.attributes?.status;
    if (!['paid', 'refunded'].includes(orderStatus)) {
      return res.status(404).json({ error: 'Order not paid' });
    }

    // Stap 4: Bepaal tier via subscription variant
    const orderId = foundOrder.id;
    const subsResp = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions?filter[order_id]=${orderId}`,
      { headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' } }
    );

    let tier = 'plus'; // default als subscription gevonden
    if (subsResp.ok) {
      const subsData = await subsResp.json();
      if (subsData.data?.length > 0) {
        const sub = subsData.data[0];
        const subStatus = sub.attributes?.status;
        // Check of subscription actief is
        if (!['active', 'trialing', 'past_due'].includes(subStatus)) {
          return res.status(404).json({ error: 'Subscription is not active' });
        }
        const variantId = String(sub.attributes?.variant_id);
        if (PRO_VARIANT_IDS.includes(variantId)) tier = 'pro';
        else if (PLUS_VARIANT_IDS.includes(variantId)) tier = 'plus';
      }
    }

    // Stap 5: Maak session ID aan — gebruik order ID + email hash
    const sessionId = `ls_${orderId}_${Buffer.from(email.toLowerCase()).toString('base64').slice(0, 8)}`;

    return res.status(200).json({
      success: true,
      tier,
      sessionId,
      message: `${tier} activated successfully`
    });

  } catch (e) {
    console.error('Activation error:', e.message);
    return res.status(500).json({ error: 'Activation failed: ' + e.message });
  }
}
