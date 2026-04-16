export type Lang = 'nl' | 'en';

export const T = {
  nl: {
    // Nav
    navAnalyse: 'CV analyseren', navPricing: 'Prijzen', navBlog: 'Blog',
    navLogin: 'Inloggen', navSignup: 'Gratis starten →', navDashboard: 'Dashboard',

    // Hero
    heroBadge: 'Gratis proberen — geen account nodig',
    heroTitle1: 'Schrijf je motivatiebrief', heroTitle2: 'in 30 seconden',
    heroSub: 'Plak je CV en vacature. AI analyseert de match, geeft verbeterpunten en schrijft een professionele brief die aansluit op de specifieke vacature.',
    heroCta: 'Start gratis →', heroCtaSec: 'Bekijk prijzen',
    heroN1: '3 analyses gratis', heroN2: 'Geen creditcard', heroN3: 'Direct resultaat',
    heroStat1: 'Analyses uitgevoerd', heroStat2: 'Gemiddelde tijd', heroStat3: 'Gemiddelde beoordeling',

    // How it works
    howLabel: 'Hoe het werkt', howTitle: 'Drie stappen. Dertig seconden.',
    howSub: 'Geen sjablonen. Geen gedoe. Plak en ontvang direct resultaat.',
    step1T: 'Plak je CV', step1D: 'Kopieer de tekst van je CV — werkervaring, opleiding en vaardigheden.',
    step2T: 'Plak de vacature', step2D: 'Voeg de volledige vacaturetekst toe inclusief functie-eisen.',
    step3T: 'Ontvang je analyse', step3D: 'Match score, verbeterpunten, keywords én een complete motivatiebrief op maat.',

    // Features
    featLabel: 'Wat je krijgt', featTitle: 'Alles in één tool',
    featSub: 'Gebouwd voor mensen die betere sollicitaties willen met minder moeite.',
    feat1T: 'CV Match Score', feat1D: 'Zie direct hoe goed je CV aansluit op de vacature. Score van 0–100 met concrete verbeterpunten.',
    feat2T: 'Keyword Analyse', feat2D: 'Ontdek welke termen uit de vacature ontbreken in je CV. Vergroot je kansen bij ATS-systemen.',
    feat3T: 'Motivatiebrief op Maat', feat3D: 'Een volledige, professionele motivatiebrief die aansluit op de specifieke vacature. Niet een sjabloon.',
    feat4T: 'Sollicitatie Tracker', feat4D: 'Houd alle sollicitaties bij op één plek. Status, notities en datums overzichtelijk in je dashboard.',

    // Testimonials
    revLabel: 'Gebruikerservaringen', revTitle: 'Wat mensen zeggen',
    rev1: 'In 10 minuten had ik een motivatiebrief die perfect aansloot op de vacature. Binnen een week uitgenodigd voor een gesprek.',
    rev2: 'De keyword-analyse opende mijn ogen. Ik miste 6 cruciale termen in mijn CV. Na het aanpassen werd ik meteen vaker teruggebeld.',
    rev3: 'Eindelijk een tool die echt helpt. Niet alleen een sjabloon, maar een echte analyse van mijn specifieke situatie.',

    // Pricing
    priceLabel: 'Prijzen', priceTitle: 'Begin gratis. Upgrade wanneer je klaar bent.',
    priceSub: 'Geen creditcard nodig. Maandelijks opzegbaar.',
    planFree: 'Gratis', planFreeSub: 'voor altijd', planFreeDesc: 'Probeer de tool zonder verplichting.',
    planPlus: 'Plus', planPlusSub: 'per maand', planPlusDesc: 'Voor mensen die actief solliciteren.',
    planPlusPopular: '⚡ Meest gekozen',
    planPro: 'Pro', planProSub: 'per maand', planProDesc: 'Voor serieuze sollicitanten.',
    planCtaFree: 'Gratis starten →', planCtaPlus: 'Plus starten →', planCtaPro: 'Pro starten →',
    featFreeItems: ['3 analyses (eenmalig)', 'Match score + uitleg', 'Keyword analyse', 'CV verbeterpunten'],
    featPlusItems: ['10 analyses per maand', 'Alles in Gratis', 'Motivatiebrief op maat', 'Dashboard & analyse historie', 'Sollicitatie tracker', 'Interview voorbereiding'],
    featProItems: ['100 analyses per maand', 'Alles in Plus', 'PDF export', 'Prioriteit support'],

    // FAQ
    faqLabel: 'FAQ', faqTitle: 'Veelgestelde vragen',
    faq: [
      { q: 'Is het echt gratis?', a: 'Ja. De eerste 3 analyses zijn volledig gratis — inclusief de motivatiebrief. Geen creditcard nodig.' },
      { q: 'Heb ik een account nodig?', a: 'Nee. Je kunt de CV-analyse direct gebruiken zonder account. Een account geeft toegang tot het dashboard, de tracker en interview prep.' },
      { q: 'Hoe nauwkeurig is de analyse?', a: 'De AI gebruikt Claude van Anthropic — een van de krachtigste modellen beschikbaar. Resultaten zijn specifiek voor jouw CV en vacature, niet generiek.' },
      { q: 'Is mijn CV veilig?', a: 'Je CV wordt uitsluitend gebruikt voor de analyse. Elke analyse is een losse, beveiligde API-aanroep. Zonder account slaan we niets op.' },
      { q: 'Kan ik op elk moment opzeggen?', a: 'Ja. Abonnementen zijn maandelijks opzegbaar, zonder minimale looptijd.' },
    ],

    // CTA
    ctaTitle: 'Klaar voor een betere motivatiebrief?',
    ctaSub: 'Gratis proberen — geen account nodig — in 30 seconden klaar.',
    ctaBtn: 'Start gratis analyse →',
    ctaNote: '3 analyses gratis · Geen creditcard',

    // Analyse page
    analyseTitle: 'CV Analyse',
    analyseSub: 'Zie in 30 seconden hoe goed je aansluit op de vacature.',
    analyseUsagePro: '✓ Pro actief — 100 analyses/maand',
    analyseUsagePlus: (n: number) => `✓ Plus actief — ${n} over deze maand`,
    analyseUsageFree: (n: number, t: number) => `${n} van ${t} gratis analyses resterend`,
    analyseUsageNone: 'Geen gratis analyses meer',
    analyseUpgrade: 'Upgrade →', analyseUpgradeRequired: 'Upgrade vereist →',
    analyseExample: '✨ Probeer met voorbeeldtekst',
    analyseLabelCv: 'Jouw CV', analyseLabelJob: 'Vacaturetekst',
    analysePlaceholderCv: 'Plak hier de tekst van je CV...',
    analysePlaceholderJob: 'Plak hier de volledige vacaturetekst...',
    analyseBtn: 'Analyseer mijn sollicitatie →',
    analyseLoading: 'AI analyseert je match...',
    analyseErrCv: 'Plak je CV in het linkerveld.',
    analyseErrJob: 'Plak de vacaturetekst in het rechterveld.',
    analyseScoreTitle: (n: number) => `Match score: ${n}/100`,
    analyseKeywords: '🔑 Keywords',
    analysePresent: 'Aanwezig in je CV',
    analyseMissing: 'Ontbreekt in je CV',
    analyseStrengths: '💪 Sterke punten & verbeterpunten',
    analyseCoverLocked: '🔒 Motivatiebrief — upgrade naar Plus of Pro',
    analyseCoverTitle: '✉️ Motivatiebrief op maat',
    analyseCoverPaywallTitle: 'Motivatiebrief inbegrepen bij Plus',
    analyseCoverPaywallSub: 'Upgrade voor €2,99/mnd en ontvang een volledige motivatiebrief bij elke analyse.',
    analyseCoverPaywallBtn: 'Bekijk plannen →',
    analyseCopy: 'Kopieer', analyseCopied: '✓ Gekopieerd',
    analyseCvTips: '📝 CV verbeterpunten',
    analyseNoneFound: 'Geen gevonden', analyseNone: 'Geen',
    analyseFeat1T: 'Match score', analyseFeat1D: 'Hoe goed sluit je CV aan op de vacature — score van 0–100.',
    analyseFeat2T: 'Keyword analyse', analyseFeat2D: 'Welke termen ontbreken in je CV die de vacature vereist.',
    analyseFeat3T: 'Motivatiebrief', analyseFeat3D: 'Een volledige, gepersonaliseerde motivatiebrief in seconden.',

    // Pricing page
    pricingTitle: 'Begin gratis. Upgrade wanneer je klaar bent.',
    pricingFaqTitle: 'Veelgestelde vragen over betaling',
    pricingFaq: [
      { q: 'Kan ik op elk moment opzeggen?', a: 'Ja. Abonnementen zijn maandelijks opzegbaar, zonder minimale looptijd of opzegtermijn.' },
      { q: 'Welke betaalmethoden worden geaccepteerd?', a: 'iDEAL, creditcard (Visa/Mastercard) en andere methoden via LemonSqueezy.' },
      { q: 'Wat als ik mijn maandlimiet bereik?', a: 'Je ontvangt een melding. Je kunt op elk moment upgraden of wachten tot de volgende maand.' },
      { q: 'Zijn analyses echt gepersonaliseerd?', a: 'Ja. De AI analyseert jouw specifieke CV en vacature. Er worden geen sjablonen gebruikt.' },
    ],

    // Footer
    footerPrivacy: 'Privacy', footerTerms: 'Voorwaarden',
  },

  en: {
    // Nav
    navAnalyse: 'Analyse CV', navPricing: 'Pricing', navBlog: 'Blog',
    navLogin: 'Log in', navSignup: 'Start free →', navDashboard: 'Dashboard',

    // Hero
    heroBadge: 'Try for free — no account needed',
    heroTitle1: 'Write your cover letter', heroTitle2: 'in 30 seconds',
    heroSub: 'Paste your CV and job posting. AI analyses the match, gives improvement tips and writes a professional cover letter tailored to the specific role.',
    heroCta: 'Start for free →', heroCtaSec: 'View pricing',
    heroN1: '3 free analyses', heroN2: 'No credit card', heroN3: 'Instant results',
    heroStat1: 'Analyses completed', heroStat2: 'Average time', heroStat3: 'Average rating',

    // How it works
    howLabel: 'How it works', howTitle: 'Three steps. Thirty seconds.',
    howSub: 'No templates. No hassle. Just paste and get instant results.',
    step1T: 'Paste your CV', step1D: 'Copy the text from your CV — work experience, education and skills.',
    step2T: 'Paste the job posting', step2D: 'Add the full job posting including requirements and responsibilities.',
    step3T: 'Get your results', step3D: 'Match score, improvements, missing keywords and a complete tailored cover letter.',

    // Features
    featLabel: 'What you get', featTitle: 'Everything in one tool',
    featSub: 'Built for job seekers who want better results with less effort.',
    feat1T: 'CV Match Score', feat1D: 'See instantly how well your CV matches the job posting. Score from 0–100 with concrete improvement tips.',
    feat2T: 'Keyword Analysis', feat2D: 'Discover which keywords are missing from your CV. Boost your chances with ATS systems.',
    feat3T: 'Tailored Cover Letter', feat3D: 'A complete, professional cover letter perfectly aligned with the specific job. Not a template.',
    feat4T: 'Application Tracker', feat4D: 'Keep track of all your applications in one place. Status, notes and dates in your personal dashboard.',

    // Testimonials
    revLabel: 'User experiences', revTitle: 'What people say',
    rev1: 'In 10 minutes I had a cover letter that perfectly matched the job posting. Within a week I was invited for an interview.',
    rev2: 'The keyword analysis opened my eyes. I was missing 6 crucial terms in my CV. After updating it, I started getting called back much more often.',
    rev3: 'Finally a tool that actually helps. Not just a template, but a real analysis of my specific situation.',

    // Pricing
    priceLabel: 'Pricing', priceTitle: 'Start free. Upgrade when ready.',
    priceSub: 'No credit card required. Cancel anytime.',
    planFree: 'Free', planFreeSub: 'forever', planFreeDesc: 'Try the tool with no commitment.',
    planPlus: 'Plus', planPlusSub: 'per month', planPlusDesc: 'For active job seekers.',
    planPlusPopular: '⚡ Most popular',
    planPro: 'Pro', planProSub: 'per month', planProDesc: 'For serious job seekers.',
    planCtaFree: 'Start for free →', planCtaPlus: 'Start Plus →', planCtaPro: 'Start Pro →',
    featFreeItems: ['3 analyses (one-time)', 'Match score + explanation', 'Keyword analysis', 'CV improvement tips'],
    featPlusItems: ['10 analyses per month', 'Everything in Free', 'Tailored cover letter', 'Dashboard & history', 'Application tracker', 'Interview preparation'],
    featProItems: ['100 analyses per month', 'Everything in Plus', 'PDF export', 'Priority support'],

    // FAQ
    faqLabel: 'FAQ', faqTitle: 'Frequently asked questions',
    faq: [
      { q: 'Is it really free?', a: 'Yes. The first 3 analyses are completely free — including the cover letter. No credit card required.' },
      { q: 'Do I need an account?', a: 'No. You can use the CV analysis immediately without an account. An account gives access to the dashboard, tracker and interview prep.' },
      { q: 'How accurate is the analysis?', a: "The AI uses Claude by Anthropic — one of the most powerful models available. Results are specific to your CV and job posting, not generic." },
      { q: 'Is my CV safe?', a: 'Your CV is only used for the analysis. Every analysis is a separate, secure API call. Without an account, we store nothing.' },
      { q: 'Can I cancel anytime?', a: 'Yes. Subscriptions are monthly with no minimum term or cancellation notice.' },
    ],

    // CTA
    ctaTitle: 'Ready to write a better cover letter?',
    ctaSub: 'Try for free — no account needed — ready in 30 seconds.',
    ctaBtn: 'Start free analysis →',
    ctaNote: '3 analyses free · No credit card',

    // Analyse page
    analyseTitle: 'CV Analysis',
    analyseSub: 'See in 30 seconds how well you match the job.',
    analyseUsagePro: '✓ Pro active — 100 analyses/month',
    analyseUsagePlus: (n: number) => `✓ Plus active — ${n} remaining this month`,
    analyseUsageFree: (n: number, t: number) => `${n} of ${t} free analyses remaining`,
    analyseUsageNone: 'No free analyses left',
    analyseUpgrade: 'Upgrade →', analyseUpgradeRequired: 'Upgrade required →',
    analyseExample: '✨ Try with example text',
    analyseLabelCv: 'Your CV', analyseLabelJob: 'Job posting',
    analysePlaceholderCv: 'Paste your CV text here...',
    analysePlaceholderJob: 'Paste the full job posting here...',
    analyseBtn: 'Analyse my application →',
    analyseLoading: 'AI is analysing your match...',
    analyseErrCv: 'Please paste your CV in the left field.',
    analyseErrJob: 'Please paste the job posting in the right field.',
    analyseScoreTitle: (n: number) => `Match score: ${n}/100`,
    analyseKeywords: '🔑 Keywords',
    analysePresent: 'Present in your CV',
    analyseMissing: 'Missing from your CV',
    analyseStrengths: '💪 Strengths & improvements',
    analyseCoverLocked: '🔒 Cover letter — upgrade to Plus or Pro',
    analyseCoverTitle: '✉️ Tailored cover letter',
    analyseCoverPaywallTitle: 'Cover letter included in Plus',
    analyseCoverPaywallSub: 'Upgrade for €2.99/mo and get a full cover letter with every analysis.',
    analyseCoverPaywallBtn: 'View plans →',
    analyseCopy: 'Copy', analyseCopied: '✓ Copied',
    analyseCvTips: '📝 CV improvement tips',
    analyseNoneFound: 'None found', analyseNone: 'None',
    analyseFeat1T: 'Match score', analyseFeat1D: 'How well your CV matches the job — score from 0–100.',
    analyseFeat2T: 'Keyword analysis', analyseFeat2D: 'Which required keywords are missing from your CV.',
    analyseFeat3T: 'Cover letter', analyseFeat3D: 'A full, personalised cover letter in seconds.',

    // Pricing page
    pricingTitle: 'Start free. Upgrade when ready.',
    pricingFaqTitle: 'Payment FAQ',
    pricingFaq: [
      { q: 'Can I cancel anytime?', a: 'Yes. Subscriptions are monthly with no minimum term or notice period.' },
      { q: 'Which payment methods are accepted?', a: 'Credit card (Visa/Mastercard), iDEAL and other local methods via LemonSqueezy.' },
      { q: 'What happens if I reach my monthly limit?', a: "You'll receive a notification. You can upgrade at any time or wait until next month." },
      { q: 'Are analyses really personalised?', a: 'Yes. The AI analyses your specific CV and job posting. No templates are used.' },
    ],

    // Footer
    footerPrivacy: 'Privacy', footerTerms: 'Terms',
  },
} as const;

export type Translations = typeof T.nl;
