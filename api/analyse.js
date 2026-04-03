export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-ls-session');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── DEV MODE ──────────────────────────────────────────────────
  if (process.env.APP_MODE === 'dev') {
    const { cv, job } = req.body || {};
    if (!cv || cv.trim().length < 30) return res.status(400).json({ error: 'CV te kort' });
    if (!job || job.trim().length < 30) return res.status(400).json({ error: 'Vacature te kort' });
    const result = await callClaude(cv.trim(), job.trim(), process.env.ANTHROPIC_API_KEY);
    if (result.error) return res.status(500).json({ error: result.error });
    return res.status(200).json({ ...result, tier: 'pro', canPdf: true, mode: 'dev' });
  }

  // ── RATE LIMITING (free users only) ───────────────────────────
  const sessionId = req.headers['x-ls-session'] || null;
  const rawOrderId = sessionId?.startsWith('ls_') ? sessionId.split('_')[1] : sessionId;

  const { cv, job } = req.body || {};
  if (!cv || typeof cv !== 'string' || cv.trim().length < 30) {
    return res.status(400).json({ error: 'CV te kort of ontbreekt' });
  }
  if (!job || typeof job !== 'string' || job.trim().length < 30) {
    return res.status(400).json({ error: 'Vacature te kort of ontbreekt' });
  }

  // ── TIER DETECTION (server only) ──────────────────────────────
  let tier = 'free';
  let canPdf = false;

  if (rawOrderId) {
    try {
      const apiKey = process.env.LEMONSQUEEZY_API_KEY_LIVE || process.env.LEMONSQUEEZY_API_KEY;
      const PLUS_VARIANTS = ['1478006'];
      const PRO_VARIANTS  = ['1468118'];
      const headers = { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' };

      // Try order lookup first
      let variantId = null;
      let subStatus = null;

      const orderResp = await fetch(`https://api.lemonsqueezy.com/v1/orders/${rawOrderId}`, { headers });
      if (orderResp.ok) {
        const orderData = await orderResp.json();
        if (['paid', 'refunded'].includes(orderData.data?.attributes?.status)) {
          const subsResp = await fetch(
            `https://api.lemonsqueezy.com/v1/subscriptions?filter[order_id]=${rawOrderId}`,
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
      }

      // Fallback: treat as subscription ID
      if (!variantId) {
        const subResp = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${rawOrderId}`, { headers });
        if (subResp.ok) {
          const subData = await subResp.json();
          subStatus = subData.data?.attributes?.status;
          variantId = String(subData.data?.attributes?.variant_id);
        }
      }

      if (variantId && (!subStatus || ['active', 'trialing', 'past_due'].includes(subStatus))) {
        if (PRO_VARIANTS.includes(variantId)) { tier = 'pro'; canPdf = true; }
        else if (PLUS_VARIANTS.includes(variantId)) { tier = 'plus'; canPdf = false; }
      }
    } catch (e) {
      console.error('Tier detection error:', e.message);
    }
  }

  // ── RATE LIMITING (only for free users) ───────────────────────
  if (tier === 'free') {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
             || req.headers['x-real-ip']
             || 'unknown';
    const ua = req.headers['user-agent'] || '';
    const fingerprint = await hash(ip + ua);
    const limited = checkRateLimit(fingerprint);
    if (!limited) {
      return res.status(429).json({
        error: 'Limiet bereikt',
        message: '3 gratis analyses gebruikt.',
        upgrade: true
      });
    }
  }

  // ── AI CALL ───────────────────────────────────────────────────
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const result = await callClaude(cv.trim(), job.trim(), process.env.ANTHROPIC_API_KEY, controller.signal);
    clearTimeout(timeout);
    if (result.error) return res.status(500).json({ error: result.error });

    // Free users get no cover letter from server
    if (tier === 'free') {
      result.motivatiebrief = '';
    }

    return res.status(200).json({ ...result, tier, canPdf });

  } catch (e) {
    clearTimeout(timeout);
    if (e.name === 'AbortError') return res.status(504).json({ error: 'Te lang, probeer opnieuw.' });
    console.error('Analyse error:', e.message);
    return res.status(500).json({ error: 'Analyse mislukt: ' + e.message });
  }
}

// ── Rate limit map ─────────────────────────────────────────────
const rateLimitMap = new Map();
const WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const FREE_LIMIT = 3;

function checkRateLimit(fp) {
  const now = Date.now();
  const entry = rateLimitMap.get(fp);
  if (!entry || now - entry.ts > WINDOW) {
    rateLimitMap.set(fp, { count: 1, ts: now });
    return true;
  }
  if (entry.count >= FREE_LIMIT) return false;
  entry.count++;
  return true;
}

async function hash(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

// ── JSON extraction ────────────────────────────────────────────
function extractJSON(text) {
  let s = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Geen JSON gevonden');
  s = s.slice(start, end + 1);
  try { return JSON.parse(s); } catch (_) {}
  s = s.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']').replace(/\n/g, ' ').replace(/\r/g, '');
  return JSON.parse(s);
}

// ── Claude API call ────────────────────────────────────────────
async function callClaude(cv, job, apiKey, signal) {
  const prompt = `Je bent een professionele Nederlandse sollicitatiecoach. Analyseer de CV en vacature.

CV:
${cv}

VACATURE:
${job}

Geef ALLEEN dit JSON object terug, geen andere tekst:
{
  "score": 72,
  "score_uitleg": "Twee zinnen uitleg over de score.",
  "sterke_punten": ["Punt 1", "Punt 2", "Punt 3"],
  "verbeterpunten": ["Punt 1", "Punt 2", "Punt 3"],
  "match_keywords": ["keyword1", "keyword2"],
  "mis_keywords": ["ontbrekend1", "ontbrekend2"],
  "motivatiebrief": "Volledige motivatiebrief in drie alineas.",
  "cv_tips": "Twee of drie concrete verbeterpunten als lopende tekst."
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: 'Je bent een CV-analyse expert. Geef ALLEEN een JSON object terug. Geen markdown, geen uitleg.',
        messages: [{ role: 'user', content: prompt }]
      }),
      signal
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { error: err.error?.message || `API fout: ${response.status}` };
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text;
    if (!raw) return { error: 'Lege response van AI' };

    const result = extractJSON(raw);
    result.score = Math.min(100, Math.max(0, parseInt(result.score) || 0));
    return result;

  } catch (e) {
    return { error: e.message };
  }
}
