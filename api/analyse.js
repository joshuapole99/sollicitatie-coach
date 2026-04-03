// /api/analyse.js
// Gebruikt EXACT dezelfde tier logica als verify.js

import { createHash } from 'crypto';

const PLUS_VARIANT_IDS = ['1478006'];
const PRO_VARIANT_IDS  = ['1468118'];

// ─── Zelfde tier logica als verify.js ────────────────────────
async function getTierFromLemonSqueezy(sessionId, apiKey) {
  if (!sessionId) return 'free';
  if (!apiKey)    return 'free';

  let orderId = null;
  if (sessionId.startsWith('ls_')) {
    const parts = sessionId.split('_');
    if (parts.length >= 3) orderId = parts[1];
  }

  if (!orderId || isNaN(orderId)) return 'free';

  try {
    // Check subscription
    const subsResp = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions?filter[order_id]=${orderId}`,
      { headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' } }
    );

    if (subsResp.ok) {
      const subsData = await subsResp.json();
      if (subsData.data?.length > 0) {
        const sub = subsData.data[0];
        const subStatus = sub.attributes?.status;
        const variantId = String(sub.attributes?.variant_id);
        if (!['active', 'trialing', 'past_due'].includes(subStatus)) return 'free';
        if (PRO_VARIANT_IDS.includes(variantId))  return 'pro';
        if (PLUS_VARIANT_IDS.includes(variantId)) return 'plus';
        return 'plus';
      }
    }

    // Fallback: check order
    const orderResp = await fetch(
      `https://api.lemonsqueezy.com/v1/orders/${orderId}`,
      { headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' } }
    );

    if (orderResp.ok) {
      const orderData = await orderResp.json();
      const orderStatus = orderData.data?.attributes?.status;
      const variantId = String(orderData.data?.attributes?.first_order_item?.variant_id);
      if (orderStatus !== 'paid') return 'free';
      if (PRO_VARIANT_IDS.includes(variantId))  return 'pro';
      if (PLUS_VARIANT_IDS.includes(variantId)) return 'plus';
      return 'plus';
    }
  } catch (e) {
    console.error('[analyse] getTier exception:', e.message);
  }

  return 'free';
}

// ─── Rate limiting ────────────────────────────────────────────
const rateLimitMap = new Map();
const TIER_LIMITS = {
  free: { total: 3,   window: null },
  plus: { total: 10,  window: 30 * 24 * 60 * 60 * 1000 },
  pro:  { total: 100, window: 30 * 24 * 60 * 60 * 1000 },
};

function getFingerprint(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || 'unknown';
  const ua = req.headers['user-agent'] || 'unknown';
  return createHash('sha256').update(`${ip}:${ua}`).digest('hex').slice(0, 16);
}

function checkRateLimit(key, tier) {
  const { total, window: windowMs } = TIER_LIMITS[tier];
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: total - 1 };
  }

  // Free: lifetime limit, nooit resetten
  if (tier === 'free') {
    if (entry.count >= total) return { allowed: false, remaining: 0 };
    entry.count++;
    return { allowed: true, remaining: total - entry.count };
  }

  // Paid: maandelijks window
  if (windowMs && now - entry.windowStart > windowMs) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: total - 1 };
  }

  if (entry.count >= total) return { allowed: false, remaining: 0 };
  entry.count++;
  return { allowed: true, remaining: total - entry.count };
}

// ─── Prompts ──────────────────────────────────────────────────
const SYSTEM_PROMPT = `Je bent een Nederlandse sollicitatiecoach AI.
KRITIEKE REGELS:
1. Geef ALLEEN een JSON object terug. Geen tekst ervoor of erna.
2. Geen markdown, geen code blocks, geen backticks.
3. Begin met { en eindig met }
4. Alle strings in dubbele aanhalingstekens.
5. Geen trailing commas.`;

function buildPrompt(cv, job, includeCoverLetter) {
  return `Analyseer deze CV en vacature en geef je analyse als JSON.

CV:
${cv}

VACATURE:
${job}

Geef EXACT dit JSON formaat terug:
{
  "score": 72,
  "score_uitleg": "Twee zinnen uitleg over de score.",
  "sterke_punten": ["Sterk punt 1", "Sterk punt 2", "Sterk punt 3"],
  "verbeterpunten": ["Verbeterpunt 1", "Verbeterpunt 2", "Verbeterpunt 3"],
  "match_keywords": ["keyword1", "keyword2", "keyword3"],
  "mis_keywords": ["ontbrekend1", "ontbrekend2", "ontbrekend3"],
  "motivatiebrief": "${includeCoverLetter ? 'Volledige motivatiebrief in drie alineas. Geschreven vanuit de kandidaat. Professionele toon.' : ''}",
  "cv_tips": "Twee of drie concrete verbeterpunten als lopende tekst."
}

BELANGRIJK: Alleen dit JSON object. Niets anders.`;
}

function extractJSON(text) {
  let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Geen JSON gevonden');
  cleaned = cleaned.slice(start, end + 1);
  try { return JSON.parse(cleaned); } catch (_) {}
  cleaned = cleaned
    .replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')
    .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
    .replace(/:\s*'([^']*)'/g, ': "$1"')
    .replace(/\n/g, ' ').replace(/\r/g, '');
  return JSON.parse(cleaned);
}

// ─── Handler ──────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-ls-session');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { cv, job } = req.body || {};
    if (!cv || typeof cv !== 'string' || cv.trim().length < 30)
      return res.status(400).json({ error: 'CV te kort of ontbreekt' });
    if (!job || typeof job !== 'string' || job.trim().length < 30)
      return res.status(400).json({ error: 'Vacature te kort of ontbreekt' });

    const sessionId = req.headers['x-ls-session'] || null;
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;

    // Tier bepalen — server is source of truth
    const tier = await getTierFromLemonSqueezy(sessionId, apiKey);
    const canPdf = tier === 'pro';
    const includeCoverLetter = tier === 'plus' || tier === 'pro';

    // Rate limiting
    // Paid users: rate limit op sessionId (niet fingerprint)
    // Free users: rate limit op fingerprint
    const rlKey = tier !== 'free' && sessionId
      ? `paid:${sessionId.slice(0, 20)}`
      : `free:${getFingerprint(req)}`;

    const { allowed, remaining } = checkRateLimit(rlKey, tier);

    if (!allowed) {
      return res.status(429).json({
        error: 'Limiet bereikt',
        message: tier === 'free'
          ? 'Je hebt je 3 gratis analyses gebruikt.'
          : `Je maandlimiet van ${TIER_LIMITS[tier].total} analyses is bereikt.`,
        tier,
        upgrade: tier === 'free',
        remaining: 0,
      });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Serverconfiguratie fout.' });
    }

    // AI call
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    let apiResponse;
    try {
      apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: buildPrompt(cv.trim(), job.trim(), includeCoverLetter) }],
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!apiResponse.ok) {
      const err = await apiResponse.json().catch(() => ({}));
      console.error('[analyse] Anthropic fout:', err.error?.message);
      return res.status(502).json({ error: 'AI service niet beschikbaar. Probeer opnieuw.' });
    }

    const data = await apiResponse.json();
    const rawText = data.content?.[0]?.text;
    if (!rawText) return res.status(502).json({ error: 'Lege AI response.' });

    let result;
    try { result = extractJSON(rawText); }
    catch (_) {
      console.error('[analyse] JSON parse fout:', rawText.slice(0, 300));
      return res.status(502).json({ error: 'AI response kon niet worden verwerkt.' });
    }

    // Valideer velden
    const required = ['score', 'score_uitleg', 'sterke_punten', 'verbeterpunten',
                      'match_keywords', 'mis_keywords', 'motivatiebrief', 'cv_tips'];
    for (const field of required) {
      if (result[field] === undefined || result[field] === null) {
        return res.status(502).json({ error: `Analyse onvolledig (${field}). Probeer opnieuw.` });
      }
    }

    result.score = Math.min(100, Math.max(0, parseInt(result.score) || 0));
    for (const f of ['sterke_punten', 'verbeterpunten', 'match_keywords', 'mis_keywords']) {
      if (!Array.isArray(result[f])) result[f] = [];
    }

    // Server enforces feature gating
    if (!includeCoverLetter) result.motivatiebrief = '';

    res.setHeader('X-RateLimit-Remaining', remaining);

    return res.status(200).json({
      ...result,
      tier,
      canPdf,
      remaining,
    });

  } catch (e) {
    if (e.name === 'AbortError') return res.status(504).json({ error: 'Analyse duurde te lang.' });
    console.error('[analyse] Handler fout:', e.message);
    return res.status(500).json({ error: 'Onverwachte fout.' });
  }
}
