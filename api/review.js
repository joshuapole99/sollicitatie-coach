export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { rating, message } = req.body || {};
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
  if (!message || message.trim().length < 5) return res.status(400).json({ error: 'Message too short' });

  if (!process.env.RESEND_API_KEY) return res.status(500).json({ error: 'Email service not configured' });

  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'reviews@sollicitatie-coach.vercel.app',
        to: 'joshuapole@live.nl',
        subject: `New review: ${stars} (${rating}/5)`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px">
            <h2 style="margin-bottom:8px">New Review</h2>
            <p style="color:#666;font-size:13px;margin-bottom:20px">${timestamp}</p>
            <div style="background:#f5f4f0;border-radius:10px;padding:20px;margin-bottom:16px">
              <div style="font-size:24px;margin-bottom:8px">${stars}</div>
              <div style="font-size:15px;font-weight:700;margin-bottom:4px">${rating}/5 stars</div>
              <p style="font-size:14px;color:#444;margin:0">"${message.trim()}"</p>
            </div>
            <p style="font-size:12px;color:#999">Sollicitatie Coach — Review System</p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Email sending failed');
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('Review error:', e.message);
    return res.status(500).json({ error: 'Could not send review' });
  }
}
