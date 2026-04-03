// ============================================================
// analyse.js — Production-ready, secure Sollicitatie Coach API
// ============================================================

import { createHash } from 'crypto';

// ─── Config ──────────────────────────────────────────────────
const LEMON_SQUEEZY_VARIANT = {
  1478006: 'plus',
  1468118: 'pro',
};

const TIER_LIMITS = {
  free: { total: 3,   window: null },
  plus: { total: 10,  window: 30 * 24 * 60 * 60 * 1000 },
  pro:  { total: 100, window: 30 * 24 * 60 * 60 * 1000 },
};

const rateLimitMap = new Map();

// ─── Fingerprinting ──────────────────────────────────────────
function getFingerprint(req) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown';
  const ua = req.headers['user-agent'] || 'unknown';
  return createHash('sha256').update(`${ip}:${ua}`).digest('hex').slice(0, 16);
}

// ─── Rate limiting ────────────────────────────────────────────
function checkRateLimit(fingerprint, tier) {
  const { total, window: windowMs } = TIER_LIMITS[tier];
  const now = Date.now();
  const key = `${tier}:${fingerprint}`;
  const entry = rateLimitMap.get(key);

  if (!entry) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: total - 1 };
  }

  if (tier === 'free') {
    if (entry.count >= total) return { allowed: false, remaining: 0 };
    entry.count++;
    return { allowed: true, remaining: total - entry.count };
  }

  if (now - entry.windowStart > windowMs) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: total - 1 };
  }

  if (entry.count >= total) return { allowed: false, remaining: 0 };
  entry.count++;
  return { allowed: true, remaining: total - entry.count };
}

// ─── Lemon Squeezy tier detection ────────────────────────────
// Supports both order IDs (one-time) and subscription IDs
async function getTier(req) {
  const sessionId = req.headers['x-ls-session'];
  if (!sessionId) return 'free';
  if (!process.env.LEMONSQUEEZY_API_KEY) return 'free';

  const headers = {
    Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
    Accept: 'application/vnd.api+json',
  };

  try {
    // Strategy 1: try as order ID directly (numeric)
    // Lemon Squeezy order IDs are numeric strings
    if (/^\d+$/.test(sessionId)) {
      const resp = await fetch(
        `https://api.lemonsqueezy.com/v1/orders/${sessionId}`,
        { headers }
      );
      if (resp.ok) {
        const data = await resp.json();
        const variantId = data?.data?.attributes?.first_order_item?.variant_id;
        const tier = LEMON_SQUEEZY_VARIANT[variantId];
        if (tier) return tier;
      }
    }

    // Strategy 2: try as order identifier (UUID/hash from checkout redirect)
    // The {order_id} template in LS redirect gives the numeric order ID
    // But some setups pass the order identifier instead — try filter
    const resp2 = await fetch(
      `https://api.lemonsqueezy.com/v1/orders?filter[identifier]=${encodeURIComponent(sessionId)}`,
      { headers }
    );
    if (resp2.ok) {
      const data2 = await resp2.json();
      const order = data2?.data?.[0];
      if (order) {
        const variantId = order.attributes?.first_order_item?.variant_id;
        const tier = LEMON_SQUEEZY_VARIANT[variantId];
        if (tier) return tier;
      }
    }

    // Strategy 3: try as subscription ID
    const resp3 = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${sessionId}`,
      { headers }
    );
    if (resp3.ok) {
      const data3 = await resp3.json();
      const sub = data3?.data;
      if (sub && sub.attributes?.status === 'active') {
        const variantId = sub.attributes?.variant_id;
        const tier = LEMON_SQUEEZY_VARIANT[variantId];
        if (tier) return tier;
      }
    }

    // Strategy 4: search subscriptions by order_id
    const resp4 = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions?filter[order_id]=${encodeURIComponent(sessionId)}`,
      { headers }
    );
    if (resp4.ok) {
      const data4 = await resp4.json();
      const sub = data4?.data?.[0];
      if (sub && sub.attributes?.status === 'active') {
        const variantId = sub.attributes?.variant_id;
        const tier = LEMON_SQUEEZY_VARIANT[variantId];
        if (tier) return tier;
      }
    }

    console.warn('LS: geen tier gevonden voor sessionId:', sessionId.slice(0, 8) + '...');
    return 'free';

  } catch (err) {
    console.error('LemonSqueezy check fout:', err.message);
    return 'free';
  }
}

// ─── JSON extractor ───────────────────────────────────────────
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

// ─── Prompts ──────────────────────────────────────────────────
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

// ─── Main handler ─────────────────────────────────────────────
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

    // 1. Server determines tier — client cannot override
    const tier = await getTier(req);

    // 2. Fingerprint for rate limiting
    const fingerprint = getFingerprint(req);

    // 3. Rate limit — AI never runs if exceeded
    const { allowed, remaining } = checkRateLimit(fingerprint, tier);
    if (!allowed) {
      return res.status(429).json({
        error: 'Limiet bereikt',
        message: tier === 'free'
          ? 'Je hebt je 3 gratis analyses gebruikt.'
          : `Je maandlimiet is bereikt (${TIER_LIMITS[tier].total} analyses).`,
        tier,
        upgrade: tier === 'free',
        remaining: 0,
      });
    }

    if (!process.env.ANTHROPIC_API_KEY)
      return res.status(500).json({ error: 'Serverconfiguratie fout.' });

    // 4. Feature gating — server decides
    const includeCoverLetter = tier === 'plus' || tier === 'pro';

    // 5. AI call
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
    try {
      result = extractJSON(rawText);
    } catch (_) {
      console.error('JSON parse fout:', rawText.substring(0, 300));
      return res.status(502).json({ error: 'AI response kon niet worden verwerkt. Probeer opnieuw.' });
    }

    // 6. Validate
    const required = ['score', 'score_uitleg', 'sterke_punten', 'verbeterpunten',
                      'match_keywords', 'mis_keywords', 'motivatiebrief', 'cv_tips'];
    for (const field of required) {
      if (result[field] === undefined || result[field] === null)
        return res.status(502).json({ error: `Analyse onvolledig (${field}). Probeer opnieuw.` });
    }

    result.score = Math.min(100, Math.max(0, parseInt(result.score) || 0));
    for (const f of ['sterke_punten', 'verbeterpunten', 'match_keywords', 'mis_keywords']) {
      if (!Array.isArray(result[f])) result[f] = [];
    }

    // 7. Server enforces feature visibility
    if (!includeCoverLetter) result.motivatiebrief = '';
    const canPdf = tier === 'pro';

    res.setHeader('X-RateLimit-Remaining', remaining);

    return res.status(200).json({
      ...result,
      tier,
      canPdf,
      remaining,
    });

  } catch (e) {
    if (e.name === 'AbortError') return res.status(504).json({ error: 'Analyse duurde te lang.' });
    console.error('Handler fout:', e.message);
    return res.status(500).json({ error: 'Onverwachte fout. Probeer opnieuw.' });
  }
}
