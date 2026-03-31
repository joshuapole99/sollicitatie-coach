const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const RATE_LIMIT_FREE = 3;

function getIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: RATE_LIMIT_FREE - 1 };
  }
  if (entry.count >= RATE_LIMIT_FREE) {
    return { allowed: false, remaining: 0 };
  }
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_FREE - entry.count };
}

function extractJSON(text) {
  let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Geen JSON gevonden in response');
  cleaned = cleaned.slice(start, end + 1);

  try {
    return JSON.parse(cleaned);
  } catch (_) {}

  cleaned = cleaned
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
    .replace(/:\s*'([^']*)'/g, ': "$1"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '');

  return JSON.parse(cleaned);
}

async function checkProAccess(req) {
  const sessionId = req.headers['x-stripe-session'];
  if (!sessionId) return false;
  if (!process.env.STRIPE_SECRET_KEY) return false;

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });

    if (session.payment_status !== 'paid') return false;
    if (!session.subscription) return true;

    const sub = session.subscription;
    if (typeof sub === 'object' && sub !== null) {
      return sub.status === 'active';
    }

    const subscription = await stripe.subscriptions.retrieve(sub);
    return subscription.status === 'active';
  } catch (err) {
    console.error('Stripe check fout:', err.message);
    return false;
  }
}

const SYSTEM_PROMPT = `Je bent een Nederlandse sollicitatiecoach AI. Je taak is CV en vacature analyses uitvoeren.

KRITIEKE REGELS — GEEN UITZONDERINGEN:
1. Geef ALLEEN een JSON object terug. Geen tekst ervoor, geen tekst erna.
2. Geen markdown, geen code blocks, geen backticks.
3. Begin direct met { en eindig met }
4. Alle strings in dubbele aanhalingstekens.
5. Geen trailing commas.
6. Als je iets niet weet, gebruik een lege string of lege array — nooit null of undefined.`;

function buildPrompt(cv, job) {
  return `Analyseer deze CV en vacature en geef je analyse als JSON.

CV:
${cv}

VACATURE:
${job}

Geef EXACT dit JSON formaat terug (vul alle velden in, geen extra velden):
{
  "score": 72,
  "score_uitleg": "Twee zinnen uitleg over de score.",
  "sterke_punten": ["Sterk punt 1", "Sterk punt 2", "Sterk punt 3"],
  "verbeterpunten": ["Verbeterpunt 1", "Verbeterpunt 2", "Verbeterpunt 3"],
  "match_keywords": ["keyword1", "keyword2", "keyword3"],
  "mis_keywords": ["ontbrekend1", "ontbrekend2", "ontbrekend3"],
  "motivatiebrief": "Volledige motivatiebrief in drie alineas. Geschreven vanuit de kandidaat. Professionele toon.",
  "cv_tips": "Twee of drie concrete verbeterpunten voor het CV als lopende tekst."
}

BELANGRIJK: Geef alleen dit JSON object terug. Niets anders.`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-stripe-session');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cv, job } = req.body || {};

    if (!cv || typeof cv !== 'string' || cv.trim().length < 30) {
      return res.status(400).json({ error: 'CV te kort of ontbreekt' });
    }
    if (!job || typeof job !== 'string' || job.trim().length < 30) {
      return res.status(400).json({ error: 'Vacature te kort of ontbreekt' });
    }

    const isPro = await checkProAccess(req);

    if (!isPro) {
      const ip = getIP(req);
      const { allowed, remaining } = checkRateLimit(ip);
      if (!allowed) {
        return res.status(429).json({
          error: 'Limiet bereikt',
          message: 'Je hebt je 3 gratis analyses gebruikt.',
          upgrade: true,
          remaining: 0
        });
      }
      res.setHeader('X-RateLimit-Remaining', remaining);
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is niet ingesteld');
      return res.status(500).json({ error: 'Serverconfiguratie fout. Neem contact op met de beheerder.' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    let apiResponse;
    try {
      apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: buildPrompt(cv.trim(), job.trim()) }]
        }),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!apiResponse.ok) {
      let errMsg = `API fout: ${apiResponse.status}`;
      try {
        const errBody = await apiResponse.json();
        errMsg = errBody.error?.message || errMsg;
      } catch (_) {}
      console.error('Anthropic API fout:', errMsg);
      return res.status(502).json({ error: 'AI service tijdelijk niet beschikbaar. Probeer opnieuw.' });
    }

    const data = await apiResponse.json();
    const rawText = data.content?.[0]?.text;

    if (!rawText) {
      console.error('Lege response van Anthropic:', JSON.stringify(data));
      return res.status(502).json({ error: 'AI gaf een lege response. Probeer opnieuw.' });
    }

    let result;
    try {
      result = extractJSON(rawText);
    } catch (parseErr) {
      console.error('JSON parse fout. Raw AI response:', rawText.substring(0, 500));
      return res.status(502).json({ error: 'AI response kon niet worden verwerkt. Probeer opnieuw.' });
    }

    const required = ['score', 'score_uitleg', 'sterke_punten', 'verbeterpunten',
                      'match_keywords', 'mis_keywords', 'motivatiebrief', 'cv_tips'];
    for (const field of required) {
      if (result[field] === undefined || result[field] === null) {
        console.error(`Veld ontbreekt in AI response: ${field}`, result);
        return res.status(502).json({ error: `Analyse onvolledig (veld: ${field}). Probeer opnieuw.` });
      }
    }

    result.score = Math.min(100, Math.max(0, parseInt(result.score) || 0));

    for (const field of ['sterke_punten', 'verbeterpunten', 'match_keywords', 'mis_keywords']) {
      if (!Array.isArray(result[field])) result[field] = [];
    }

    return res.status(200).json({ ...result, isPro });

  } catch (e) {
    if (e.name === 'AbortError') {
      return res.status(504).json({ error: 'Analyse duurde te lang, probeer opnieuw.' });
    }
    console.error('Onverwachte fout in handler:', e.message, e.stack);
    return res.status(500).json({ error: 'Er is een onverwachte fout opgetreden. Probeer opnieuw.' });
  }
}
