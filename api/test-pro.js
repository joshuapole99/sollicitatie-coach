export default async function handler(req, res) {
  // VEILIGHEID: alleen toegankelijk in development of met secret
  const secret = req.headers['x-test-secret'];
  if (secret !== process.env.TEST_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Geeft een nep-pro response terug zodat je de PDF kan testen
  const mockResult = {
    score: 85,
    score_uitleg: 'TEST MODE — Dit is een test analyse voor Pro features.',
    sterke_punten: ['Sterke technische achtergrond', 'Relevante werkervaring', 'Goede communicatievaardigheden'],
    verbeterpunten: ['Voeg meer concrete resultaten toe', 'Vermeld certificeringen'],
    match_keywords: ['JavaScript', 'React', 'Node.js'],
    mis_keywords: ['TypeScript', 'AWS'],
    motivatiebrief: `Geachte heer/mevrouw,

Dit is een TEST motivatiebrief gegenereerd in Pro modus. Als je deze tekst ziet én de PDF knop zichtbaar is, werkt de Pro tier correct.

In een echte analyse zou hier een op maat geschreven motivatiebrief staan die aansluit op de vacature en je CV.

Met vriendelijke groet,
Test Gebruiker`,
    cv_tips: 'TEST: Voeg concrete cijfers toe aan je werkervaring. Vermeld relevante certificeringen bovenaan je CV.',
    isPro: true,
    canPdf: true,
    tier: 'pro'
  };

  return res.status(200).json(mockResult);
}
