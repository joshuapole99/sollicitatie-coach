// api/analyse.js — Server-authoritative, uses same lookup as verify.js

import { createHash } from 'crypto';

const LEMON_SQUEEZY_VARIANTS = {
  1478006: 'plus',
  1468118: 'pro',
};

const TIER_LIMITS = {
  free: { total: 3,   window: null },
  plus: { total: 10,  window: 30 * 24 * 60 * 60 * 1000 },
  pro:  { total: 100, window: 30 * 24 * 60 * 60 * 1000 },
};

const rateLimitMap = new Map();

function getFingerprint(req) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown';
  const ua = req.headers['user-agent'] || 'unknown';
  return createHash('sha256').update(`${ip}:${ua}`).digest('hex').slice(0, 16);
}

// Paid users bypass rate limiting completely — no free usage bleeds into paid
function checkRateLimit(fingerprint, tier) {
  if (tier === 'plus' || tier === 'pro') {
    // Paid: use monthly window but don't block based on old free usage
    const { total, window: windowMs } = TIER_LIMITS[tier];
    const now = Date.now();
    const key = `paid:${tier}:${fingerprint}`;
    const entry = rateLimitMap.get(key);
    if (!entry || now - entry.windowStart > windowMs) {
      rateLimitMap.set(key, { count: 1, windowStart: now });
      return { allowed: true, remaining: total - 1 };
    }
    if (entry.count >= total) return { allowed: false, remaining: 0 };
    entry.count++;
    return { allowed: true, remaining: total - entry.count };
  }

  // Free: lifetime limit, separate key from paid
  const key = `free:${fingerprint}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: TIER_LIMITS.free.total - 1 };
  }
  if (entry.count >= TIER_LIMITS.free.total) return { allowed: false, remaining: 0 };
  entry.count++;
  return { allowed: true, remaining: TIER_LIMITS.free.total - entry.count };
}

// Shared tier lookup — identical logic to verify.js
async function lookupTier(sessionId) {
  if (!sessionId || typeof sessionId !== 'string') return 'free';

  const raw = sessionId.trim();

  if (raw.includes('{') || raw.includes('}')) {
    console.warn('[analyse] Unresolved placeholder in sessionId');
    return 'free';
  }

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) return 'free';

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Accept: 'application/vnd.api+json',
  };

  // Strategy 1: numeric order ID direct
  if (/^\d+$/.test(raw)) {
    try {
      const r = await fetch(`https://api.lemonsqueezy.com/v1/orders/${raw}`, { headers });
      if (r.ok) {
        const d = await r.json();
        const variantId = d?.data?.attributes?.first_order_item?.variant_id;
        if (d?.data?.attributes?.status === 'paid' && LEMON_SQUEEZY_VARIANTS[variantId])
          return LEMON_SQUEEZY_VARIANTS[variantId];
      }
    } catch (_) {}
  }

  // Strategy 2: extract numeric from compound token
  const numericMatch = raw.match(/^(?:ls_)?(\d+)/);
  if (numericMatch && numericMatch[1] !== raw) {
    const orderId = numericMatch[1];
    try {
      const r = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, { headers });
      if (r.ok) {
        const d = await r.json();
        const variantId = d?.data?.attributes?.first_order_item?.variant_id;
        if (d?.data?.attributes?.status === 'paid' && LEMON_SQUEEZY_VARIANTS[variantId])
          return LEMON_SQUEEZY_VARIANTS[variantId];
      }
    } catch (_) {}
  }

  // Strategy 3: order identifier filter
  try {
    const r = await fetch(
      `https://api.lemonsqueezy.com/v1/orders?filter[identifier]=${encodeURIComponent(raw)}`,
      { headers }
    );
    if (r.ok) {
      const d = await r.json();
      const order = d?.data?.[0];
      const variantId = order?.attributes?.first_order_item?.variant_id;
      if (order?.attributes?.status === 'paid' && LEMON_SQUEEZY_VARIANTS[variantId])
        return LEMON_SQUEEZY_VARIANTS[variantId];
    }
  } catch (_) {}

  // Strategy 4: subscription direct
  try {
    const r = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${raw}`, { headers });
    if (r.ok) {
      const d = await r.json();
      const sub = d?.data;
      const variantId = sub?.attributes?.variant_id;
      if (['active', 'trialing'].includes(sub?.attributes?.status) && LEMON_SQUEEZY_VARIANTS[variantId])
        return LEMON_SQUEEZY_VARIANTS[variantId];
    }
  } catch (_) {}

  // Strategy 5: subscription filter by order_id
  const orderId = numericMatch ? numericMatch[1] : (/^\d+$/.test(raw) ? raw : null);
  if (orderId) {
    try {
      const r = await fetch(
        `https://api.lemonsqueezy.com/v1/subscriptions?filter[order_id]=${orderId}`,
        { headers }
      );
      if (r.ok) {
        const d = await r.json();
        const sub = d?.data?.[0];
        const variantId = sub?.attributes?.variant_id;
        if (['active', 'trialing'].includes(sub?.attributes?.status) && LEMON_SQUEEZY_VARIANTS[variantId])
          return LEMON_SQUEEZY_VARIANTS[variantId];
      }
    } catch (_) {}
  }

  return 'free';
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

const SYSTEM_PROMPT = `Je bent een Nederlandse sollicitatiecoach AI.
KRITIEKE REGELS:
1. Geef ALLEEN een JSON object terug. Geen tekst ervoor of erna.
2. Geen markdown, geen code blocks, geen backticks.
3. Begin met { en eindig met }
4. Alle strings in dubbele aanhalingstekens.
5. Geen trailing commas.`;

function buildPrompt(cv, job, includeCoverLetter) {
  const motivField = includeCoverLetter
    ? `"motivatiebrief": "Volledige motivatiebrief in drie alineas. Professionele toon."`
    : `"motivatiebrief": ""`;
  return `Analyseer deze CV en vacature.

CV:
${cv}

VACATURE:
${job}

Geef EXACT dit JSON terug:
{
  "score": 72,
  "score_uitleg": "Twee zinnen uitleg.",
  "sterke_punten": ["punt 1", "punt 2", "punt 3"],
  "verbeterpunten": ["punt 1", "punt 2", "punt 3"],
  "match_keywords": ["keyword1", "keyword2", "keyword3"],
  "mis_keywords": ["ontbrekend1", "ontbrekend2", "ontbrekend3"],
  ${motivField},
  "cv_tips": "Twee of drie concrete verbeterpunten als lopende tekst."
}

BELANGRIJK: Alleen dit JSON object. Niets anders.`;
}

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

    const sessionId = req.headers['x-ls-session'];
    const tier = await lookupTier(sessionId);
    const fingerprint = getFingerprint(req);
    const { allowed, remaining } = checkRateLimit(fingerprint, tier);

    if (!allowed) {
      return res.status(429).json({
        error: 'Limiet bereikt',
        message: tier === 'free'
          ? 'Je hebt je 3 gratis analyses gebruikt.'
          : `Je maandlimiet is bereikt (${TIER_LIMITS[tier].total} analyses).`,
        tier, upgrade: tier === 'free', remaining: 0,
      });
    }

    if (!process.env.ANTHROPIC_API_KEY)
      return res.status(500).json({ error: 'Serverconfiguratie fout.' });

    const includeCoverLetter = tier === 'plus' || tier === 'pro';
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
      console.error('Anthropic fout:', err.error?.message);
      return res.status(502).json({ error: 'AI service niet beschikbaar. Probeer opnieuw.' });
    }

    const aiData = await apiResponse.json();
    const rawText = aiData.content?.[0]?.text;
    if (!rawText) return res.status(502).json({ error: 'Lege AI response. Probeer opnieuw.' });

    let result;
    try { result = extractJSON(rawText); }
    catch (_) {
      console.error('JSON parse fout:', rawText.substring(0, 300));
      return res.status(502).json({ error: 'AI response kon niet worden verwerkt. Probeer opnieuw.' });
    }

    const required = ['score', 'score_uitleg', 'sterke_punten', 'verbeterpunten',
                      'match_keywords', 'mis_keywords', 'motivatiebrief', 'cv_tips'];
    for (const field of required) {
      if (result[field] === undefined || result[field] === null)
        return res.status(502).json({ error: `Analyse onvolledig (${field}). Probeer opnieuw.` });
    }

    result.score = Math.min(100, Math.max(0, parseInt(result.score) || 0));
    for (const f of ['sterke_punten', 'verbeterpunten', 'match_keywords', 'mis_keywords'])
      if (!Array.isArray(result[f])) result[f] = [];

    if (!includeCoverLetter) result.motivatiebrief = '';
    const canPdf = tier === 'pro';
    res.setHeader('X-RateLimit-Remaining', remaining);

    return res.status(200).json({ ...result, tier, canPdf, remaining });

  } catch (e) {
    if (e.name === 'AbortError') return res.status(504).json({ error: 'Analyse duurde te lang.' });
    console.error('Handler fout:', e.message);
    return res.status(500).json({ error: 'Onverwachte fout. Probeer opnieuw.' });
  }
}
