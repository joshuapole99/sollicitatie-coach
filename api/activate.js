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
    let foundOrder = null;

    // ✅ FIX: haal orders op en zoek zelf op identifier
    const r1 = await fetch(
      `https://api.lemonsqueezy.com/v1/orders?page[size]=100`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.api+json'
        }
      }
    );
    const d1 = await r1.json();

    if (r1.ok && d1.data?.length > 0) {
      foundOrder = d1.data.find(o =>
        String(o.attributes?.identifier) === String(order)
      );
    }

    // DEBUG — laat je zitten zoals gevraagd
    if (!foundOrder) {
      return res.status(404).json({
        error: 'Order not found',
        debug_fetchStatus: r1.status,
        debug_ordersReturned: d1.data?.length ?? 0,
        debug_errors: d1.errors,
        debug_orderInput: order,
      });
    }

    // Poging 2: (blijft bestaan, maar praktisch niet meer nodig)
    if (!foundOrder) {
      const r2 = await fetch(
        `https://api.lemonsqueezy.com/v1/orders?page[size]=100`,
        { headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' } }
      );
      if (r2.ok) {
        const d2 = await r2.json();
        if (d2.data?.length > 0) {
          foundOrder = d2.data.find(o =>
            String(o.attributes?.identifier) === String(order)
          );
        }
      }
    }

    if (!foundOrder) {
      return res.status(404).json({
        error: 'Order number not found or email does not match. Check your confirmation email.'
      });
    }

    // Valideer email
    const orderEmail = foundOrder.attributes?.user_email?.toLowerCase();
    if (orderEmail !== email.toLowerCase()) {
      return res.status(404).json({
        error: 'Order number not found or email does not match. Check your confirmation email.'
      });
    }

    // Check order status
    const orderStatus = foundOrder.attributes?.status;
    if (!['paid', 'refunded'].includes(orderStatus)) {
      return res.status(404).json({
        error: 'Order not paid yet. Please wait a moment and try again.'
      });
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
          return res.status(404).json({
            error: 'Subscription is not active. Please contact support.'
          });
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
