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

  const PLUS_VARIANT_IDS = ['1478006'];
  const PRO_VARIANT_IDS  = ['1468118'];

  try {
    const orderNum = order.replace(/\D/g, '');
    let foundOrder = null;

    // Probeer directe order lookup via ID
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

    // Als directe lookup faalt, zoek via identifier filter
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

    // Als nog steeds niet gevonden — debug: haal orders lijst op
    if (!foundOrder) {
      const listResp = await fetch(
        'https://api.lemonsqueezy.com/v1/orders?page[size]=5',
        { headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' } }
      );
      const listText = await listResp.text();
      let listData;
      try { listData = JSON.parse(listText); } catch(_) { listData = { raw: listText.slice(0, 300) }; }

      return res.status(404).json({
        error: 'Order not found',
        debug_orderNum: orderNum,
        debug_apiStatus: listResp.status,
        debug_listCount: listData?.data?.length ?? 0,
        debug_listSample: listData?.data?.slice(0, 3)?.map(o => ({
          id: o.id,
          number: o.attributes?.order_number,
          email: o.attributes?.user_email,
          status: o.attributes?.status
        })),
        debug_errors: listData?.errors,
        debug_raw: listData?.raw
      });
    }

    // Valideer email
    const orderEmail = foundOrder.attributes?.user_email?.toLowerCase();
    if (orderEmail !== email.toLowerCase()) {
      return res.status(404).json({ error: 'Email does not match order' });
    }

    // Check order status
    const orderStatus = foundOrder.attributes?.status;
    if (!['paid', 'refunded'].includes(orderStatus)) {
      return res.status(404).json({ error: 'Order not paid', status: orderStatus });
    }

    // Bepaal tier via subscription variant
    const orderId = foundOrder.id;
    const subsResp = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions?filter[order_id]=${orderId}`,
      { headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' } }
    );

    let tier = 'plus';
    if (subsResp.ok) {
      const subsData = await subsResp.json();
      if (subsData.data?.length > 0) {
        const sub = subsData.data[0];
        const subStatus = sub.attributes?.status;
        if (!['active', 'trialing', 'past_due'].includes(subStatus)) {
          return res.status(404).json({ error: 'Subscription is not active', subStatus });
        }
        const variantId = String(sub.attributes?.variant_id);
        if (PRO_VARIANT_IDS.includes(variantId)) tier = 'pro';
        else if (PLUS_VARIANT_IDS.includes(variantId)) tier = 'plus';
      }
    }

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
