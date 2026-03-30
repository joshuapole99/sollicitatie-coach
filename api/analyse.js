import Stripe from 'stripe';

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
  // Stap 1: strip markdown code blocks
  let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

  // Stap 2: zoek eerste { en laatste }
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Geen JSON gevonden in response');
  cleaned = cleaned.slice(start, end + 1);

  // Stap 3: probeer direct te parsen
  try {
    return JSON.parse(cleaned);
  } catch (_) {}

  // Stap 4: auto-repair veelvoorkomende problemen
  cleaned = cleaned
    .replace(/,\s*}/g, '}')         // trailing commas in objects
    .replace(/,\s*]/g, ']')         // trailing commas in arrays
    .replace(/([{,]\s*)(\w+):/g, '$1"$2":')  // unquoted keys
    .replace(/:\s*'([^']*)'/g, ': "$1"')     // single quotes naar double
    .replace(/\n/g, ' ')            // newlines in strings
    .replace(/\r/g, '');

  return JSON.parse(cleaned);
}

async function checkProAccess(req) {
  const sessionId = req.headers['x-stripe-session'];
  if (!sessionId) return false;
  if (!process.env.STRIPE_SECRET_KEY) return false;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') return false;

    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    return subscription.status === 'active';
  } catch (_) {
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
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-stripe-session');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { cv, job } = req.body || {};
  if (!cv || typeof cv !== 'string' || cv.trim().length < 30) {
    return res.status(400).json({ error: 'CV te kort of ontbreekt' });
  }
  if (!job || typeof job !== 'string' || job.trim().length < 30) {
    return res.status(400).json({ error: 'Vacature te kort of ontbreekt' });
  }

  // Check Pro toegang
  const isPro = await checkProAccess(req);

  // Rate limiting alleen voor gratis users
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

  // API call met timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
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

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API fout: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text;
    if (!rawText) throw new Error('Lege response van AI');

    const result = extractJSON(rawText);

    // Valideer verplichte velden
    const required = ['score', 'score_uitleg', 'sterke_punten', 'verbeterpunten',
                      'match_keywords', 'mis_keywords', 'motivatiebrief', 'cv_tips'];
    for (const field of required) {
      if (result[field] === undefined) throw new Error(`Veld ontbreekt in response: ${field}`);
    }

    // Score moet een getal zijn tussen 0 en 100
    result.score = Math.min(100, Math.max(0, parseInt(result.score) || 0));

    return res.status(200).json({ ...result, isPro });

  } catch (e) {
    clearTimeout(timeout);
    if (e.name === 'AbortError') {
      return res.status(504).json({ error: 'Analyse duurde te lang, probeer opnieuw.' });
    }
    console.error('Analyse fout:', e.message);
    return res.status(500).json({ error: 'Analyse mislukt: ' + e.message });
  }
}
