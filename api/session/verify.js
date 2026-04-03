// /api/session/verify.js
// Source of truth voor tier detectie
// Gebruikt zelfde logica als analyse.js

const PLUS_VARIANT_IDS = ['1478006'];
const PRO_VARIANT_IDS  = ['1468118'];

async function getTierFromLemonSqueezy(sessionId, apiKey) {
  if (!sessionId) return { tier: 'free', reason: 'no_session' };
  if (!apiKey)    return { tier: 'free', reason: 'no_api_key' };

  // sessionId = ls_{internalOrderId}_{emailHash}
  // Extract interne order ID (het getal na ls_)
  let orderId = null;
  if (sessionId.startsWith('ls_')) {
    const parts = sessionId.split('_');
    // ls_ = parts[0]+parts[1] leeg, parts[1] = orderId, rest = hash
    // Format: ls_7960402_abc12345
    if (parts.length >= 3) orderId = parts[1];
  }

  if (!orderId || isNaN(orderId)) {
    return { tier: 'free', reason: 'invalid_session_format', sessionId };
  }

  try {
    // Check subscription voor dit order
    const subsResp = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions?filter[order_id]=${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.api+json',
        },
      }
    );

    if (!subsResp.ok) {
      const errText = await subsResp.text();
      console.error(`[verify] LS subscriptions API fout ${subsResp.status}:`, errText.slice(0, 200));
      return { tier: 'free', reason: `ls_api_error_${subsResp.status}` };
    }

    const subsData = await subsResp.json();
    console.log(`[verify] orderId=${orderId} subscriptions count=${subsData.data?.length}`);

    if (subsData.data?.length > 0) {
      const sub = subsData.data[0];
      const subStatus = sub.attributes?.status;
      const variantId = String(sub.attributes?.variant_id);

      console.log(`[verify] sub status=${subStatus} variantId=${variantId}`);

      if (!['active', 'trialing', 'past_due'].includes(subStatus)) {
        return { tier: 'free', reason: `subscription_inactive_${subStatus}` };
      }

      if (PRO_VARIANT_IDS.includes(variantId))  return { tier: 'pro',  reason: 'subscription_pro' };
      if (PLUS_VARIANT_IDS.includes(variantId)) return { tier: 'plus', reason: 'subscription_plus' };

      return { tier: 'plus', reason: 'subscription_unknown_variant' };
    }

    // Geen subscription gevonden — check order zelf (eenmalige betaling)
    const orderResp = await fetch(
      `https://api.lemonsqueezy.com/v1/orders/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.api+json',
        },
      }
    );

    if (!orderResp.ok) {
      return { tier: 'free', reason: `order_not_found_${orderResp.status}` };
    }

    const orderData = await orderResp.json();
    const orderStatus = orderData.data?.attributes?.status;
    const variantId = String(orderData.data?.attributes?.first_order_item?.variant_id);

    console.log(`[verify] order status=${orderStatus} variantId=${variantId}`);

    if (orderStatus !== 'paid') {
      return { tier: 'free', reason: `order_not_paid_${orderStatus}` };
    }

    if (PRO_VARIANT_IDS.includes(variantId))  return { tier: 'pro',  reason: 'order_pro' };
    if (PLUS_VARIANT_IDS.includes(variantId)) return { tier: 'plus', reason: 'order_plus' };

    return { tier: 'plus', reason: 'order_paid_unknown_variant' };

  } catch (e) {
    console.error('[verify] Exception:', e.message);
    return { tier: 'free', reason: `exception_${e.message}` };
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sessionId } = req.body || {};
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  console.log(`[verify] sessionId=${sessionId ? sessionId.slice(0,20) + '...' : 'none'} apiKey=${!!apiKey}`);

  const { tier, reason } = await getTierFromLemonSqueezy(sessionId, apiKey);

  console.log(`[verify] result tier=${tier} reason=${reason}`);

  return res.status(200).json({
    tier,    // "free" | "plus" | "pro"
    canPdf: tier === 'pro',
    // reason alleen in development — verwijder in productie als gewenst
    _reason: process.env.NODE_ENV !== 'production' ? reason : undefined,
  });
}
