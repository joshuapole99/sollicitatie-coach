export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { cv, job } = req.body;
  if (!cv || !job) return res.status(400).json({ error: 'cv en job verplicht' });

  const prompt = `Je bent een professionele Nederlandse sollicitatiecoach. Analyseer de onderstaande CV en vacature grondig.

CV:
${cv}

VACATURE:
${job}

Geef je analyse ALLEEN als geldig JSON (geen markdown, geen uitleg buiten de JSON):
{
  "score": <getal 0-100>,
  "score_uitleg": "<2 zinnen waarom deze score>",
  "sterke_punten": ["<punt 1>", "<punt 2>", "<punt 3>"],
  "verbeterpunten": ["<punt 1>", "<punt 2>", "<punt 3>"],
  "match_keywords": ["<keyword aanwezig in CV en vacature>"],
  "mis_keywords": ["<vereist keyword dat NIET in CV staat>"],
  "motivatiebrief": "<volledige Nederlandse motivatiebrief, 3 alineas, geschreven alsof de kandidaat het schrijft>",
  "cv_tips": "<2-3 concrete verbeterpunten voor dit CV als lopende tekst>"
}`;

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
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
