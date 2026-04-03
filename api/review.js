// api/review.js — Uses same tier resolver, consistent with analyse.js

import { resolveTier } from './_tier.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { rating, message } = req.body || {};

  if (!rating || !message || typeof message !== 'string' || message.trim().length < 3)
    return res.status(400).json({ error: 'Rating en bericht zijn verplicht.' });

  // Forward to Formspree
  const FORMSPREE_URL = process.env.FORMSPREE_URL || 'https://formspree.io/f/xnjozwbr';

  try {
    const resp = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ rating, message: message.trim() }),
    });
    if (!resp.ok) throw new Error(`Formspree ${resp.status}`);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[review] Error:', e.message);
    return res.status(502).json({ error: 'Review kon niet worden verstuurd. Probeer opnieuw.' });
  }
}
