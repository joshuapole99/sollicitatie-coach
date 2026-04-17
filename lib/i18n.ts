export type Lang = 'nl' | 'en';

export const T = {
  nl: {
    // Nav
    navAnalyse: 'CV analyseren', navPricing: 'Prijzen', navBlog: 'Blog',
    navLogin: 'Inloggen', navSignup: 'Gratis starten →', navDashboard: 'Dashboard',

    // Hero
    heroBadge: 'Gratis proberen — geen account nodig',
    heroTitle1: 'Je stuurt sollicitaties.', heroTitle2: 'Niemand reageert.',
    heroSub: 'Plak je CV. Zie in 30 seconden wat er mist — en ontvang een motivatiebrief die wél werkt.',
    heroCta: 'Ontdek wat ontbreekt →', heroCtaSec: 'Bekijk prijzen',
    heroN1: '3 analyses gratis', heroN2: 'Geen creditcard', heroN3: 'Direct resultaat',
    heroStat1: 'Analyses uitgevoerd', heroStat2: 'Gemiddelde tijd', heroStat3: 'Gemiddelde beoordeling',

    // How it works
    howLabel: 'Hoe het werkt', howTitle: 'Drie stappen. Dertig seconden.',
    howSub: 'Geen sjablonen. Geen gedoe. Plak en ontvang direct resultaat.',
    step1T: 'Plak je CV', step1D: 'Kopieer de tekst van je CV — werkervaring, opleiding en vaardigheden.',
    step2T: 'Plak de vacature', step2D: 'Voeg de volledige vacaturetekst toe inclusief functie-eisen.',
    step3T: 'Ontvang je analyse', step3D: 'Match score, verbeterpunten, keywords én een complete motivatiebrief op maat.',

    // Features
    featLabel: 'Wat je krijgt', featTitle: 'Alles wat je nodig hebt voor je volgende gesprek',
    featSub: 'Zodat je niet méér sollicitaties hoeft te sturen — maar betere.',
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
    planPlus: 'Plus', planPlusSub: 'per maand', planPlusDesc: 'Voor wie serieus zoekt en snel resultaat wil.',
    planPlusPopular: '⚡ Meest gekozen',
    planPro: 'Pro', planProSub: 'per maand', planProDesc: 'Voor wie maximale kansen wil bij elke sollicitatie.',
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
    ctaTitle: 'Klaar om eindelijk uitgenodigd te worden?',
    ctaSub: 'Gratis proberen — geen account nodig — in 30 seconden klaar.',
    ctaBtn: 'Ontdek wat ontbreekt →',
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

    // Install banner
    installTitle: 'Voeg toe aan startscherm',
    installSub: 'Open de app direct vanuit je startscherm',
    installBtn: 'Installeren', installDismiss: 'Niet nu',
    installIosHint: 'Tik op Delen → Zet op beginscherm',

    // Dashboard layout
    dashTabOverview: 'Overzicht', dashTabTracker: 'Tracker', dashTabInterview: 'Interview Prep',
    dashTabAnalyse: 'CV analyseren', dashLogout: 'Uitloggen',

    // Dashboard home
    dashWelcome: (name: string) => `Welkom terug, ${name} 👋`,
    dashSub: 'Hier is een overzicht van je sollicitatieactiviteiten.',
    dashActionAnalyse: 'CV analyseren', dashActionTracker: 'Sollicitatie toevoegen',
    dashActionInterview: 'Interview prep', dashActionUpgrade: 'Upgrade plan',
    dashStatAnalyses: 'Analyses gedaan', dashStatApps: 'Sollicitaties bijgehouden',
    dashStatInterviews: 'Gesprekken / aanbiedingen',
    dashRecentAnalyses: 'Recente analyses', dashNewAnalysis: 'Nieuwe analyse →',
    dashEmptyAnalyses: 'Nog geen analyses opgeslagen.', dashFirstAnalysis: 'Start eerste analyse',
    dashUnknownRole: 'Onbekende rol',
    dashRecentApps: 'Recente sollicitaties', dashViewAll: 'Alles bekijken →',
    dashEmptyApps: 'Nog geen sollicitaties bijgehouden.', dashFirstApp: 'Eerste toevoegen',

    // Tracker
    trackerTitle: 'Sollicitatie Tracker', trackerSub: 'Houd al je sollicitaties bij op één plek.',
    trackerAdd: '+ Toevoegen', trackerAll: 'Alles',
    trackerStatusApplied: 'Gesolliciteerd', trackerStatusInterview: 'Gesprek',
    trackerStatusOffer: 'Aanbod', trackerStatusRejected: 'Afgewezen',
    trackerFormNew: 'Nieuwe sollicitatie', trackerFormEdit: 'Bewerken',
    trackerLabelCompany: 'Bedrijf *', trackerPlaceholderCompany: 'bijv. ASML',
    trackerLabelRole: 'Functie *', trackerPlaceholderRole: 'bijv. Software Engineer',
    trackerLabelStatus: 'Status', trackerLabelDate: 'Datum gesolliciteerd',
    trackerLabelNotes: 'Notities', trackerPlaceholderNotes: 'Contactpersoon, recruiter, volgende stap...',
    trackerSave: 'Opslaan', trackerSaving: 'Opslaan...', trackerCancel: 'Annuleren',
    trackerDeleteConfirm: 'Sollicitatie verwijderen?',
    trackerEmptyAll: 'Nog geen sollicitaties.', trackerEmptyFiltered: 'Geen sollicitaties met deze status.',
    trackerFirstAdd: 'Eerste toevoegen',
    trackerColCompany: 'Bedrijf', trackerColRole: 'Functie', trackerColStatus: 'Status',
    trackerColDate: 'Datum', trackerColNotes: 'Notities',
    trackerEditBtn: 'Bewerk', trackerDeleteBtn: 'Verwijder',

    // Interview
    interviewTitle: 'Interview Voorbereiding',
    interviewSub: 'Genereer veelgestelde vragen voor jouw rol — inclusief sterke antwoorden.',
    interviewLabelRole: 'Functietitel *',
    interviewPlaceholderRole: 'bijv. Software Engineer, Marketing Manager, Data Analyst...',
    interviewLabelContext: 'Extra context', interviewOptional: '(optioneel)',
    interviewPlaceholderContext: 'bijv. 5 jaar ervaring, bij een scale-up, technisch team, focus op B2B...',
    interviewGenerate: '🎯  Genereer interviewvragen', interviewGenerating: 'Vragen genereren...',
    interviewError: 'Er is iets misgegaan. Probeer opnieuw.',
    interviewQuestionsFor: (n: number) => `${n} vragen voor:`,
    interviewCopyAll: 'Alles kopiëren', interviewAnswerLabel: 'Sterk antwoord', interviewTipLabel: '💡 Pro tip',

    // Blog
    blogTitle: 'Sollicitatie Tips & Advies',
    blogSub: 'Praktisch advies voor een beter CV, sterkere motivatiebrief en meer interviews.',
    blogRead: 'lezen', blogReadMore: 'Lees meer →',
    blogCtaTitle: 'Pas de tips direct toe',
    blogCtaSub: 'Analyseer je CV op een vacature en ontvang gepersonaliseerde feedback in 30 seconden.',
    blogCtaBtn: 'Start gratis analyse →',
    blogBack: '← Terug naar blog',
    blogPostCtaTitle: 'Pas deze tips direct toe',
    blogPostCtaSub: 'Analyseer je CV op een vacature en ontvang gepersonaliseerde feedback in 30 seconden.',
    blogPostCtaBtn: 'Start gratis analyse →',
    blogOtherPosts: 'Andere artikelen',
  },

  en: {
    // Nav
    navAnalyse: 'Analyse CV', navPricing: 'Pricing', navBlog: 'Blog',
    navLogin: 'Log in', navSignup: 'Start free →', navDashboard: 'Dashboard',

    // Hero
    heroBadge: 'Try for free — no account needed',
    heroTitle1: 'You send applications.', heroTitle2: 'Nobody replies.',
    heroSub: 'Paste your CV. See in 30 seconds what\'s missing — and get a cover letter that actually works.',
    heroCta: 'Find out what\'s missing →', heroCtaSec: 'View pricing',
    heroN1: '3 free analyses', heroN2: 'No credit card', heroN3: 'Instant results',
    heroStat1: 'Analyses completed', heroStat2: 'Average time', heroStat3: 'Average rating',

    // How it works
    howLabel: 'How it works', howTitle: 'Three steps. Thirty seconds.',
    howSub: 'No templates. No hassle. Just paste and get instant results.',
    step1T: 'Paste your CV', step1D: 'Copy the text from your CV — work experience, education and skills.',
    step2T: 'Paste the job posting', step2D: 'Add the full job posting including requirements and responsibilities.',
    step3T: 'Get your results', step3D: 'Match score, improvements, missing keywords and a complete tailored cover letter.',

    // Features
    featLabel: 'What you get', featTitle: 'Everything you need for your next interview',
    featSub: 'So you don\'t need to send more applications — just better ones.',
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
    planPlus: 'Plus', planPlusSub: 'per month', planPlusDesc: 'For those who want results fast.',
    planPlusPopular: '⚡ Most popular',
    planPro: 'Pro', planProSub: 'per month', planProDesc: 'For maximum chances on every application.',
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
    ctaTitle: 'Ready to finally get invited?',
    ctaSub: 'Try for free — no account needed — ready in 30 seconds.',
    ctaBtn: 'Find out what\'s missing →',
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

    // Install banner
    installTitle: 'Add to home screen',
    installSub: 'Open the app directly from your home screen',
    installBtn: 'Install', installDismiss: 'Not now',
    installIosHint: 'Tap Share → Add to Home Screen',

    // Dashboard layout
    dashTabOverview: 'Overview', dashTabTracker: 'Tracker', dashTabInterview: 'Interview Prep',
    dashTabAnalyse: 'Analyse CV', dashLogout: 'Log out',

    // Dashboard home
    dashWelcome: (name: string) => `Welcome back, ${name} 👋`,
    dashSub: 'Here is an overview of your job search activity.',
    dashActionAnalyse: 'Analyse CV', dashActionTracker: 'Add application',
    dashActionInterview: 'Interview prep', dashActionUpgrade: 'Upgrade plan',
    dashStatAnalyses: 'Analyses done', dashStatApps: 'Applications tracked',
    dashStatInterviews: 'Interviews / offers',
    dashRecentAnalyses: 'Recent analyses', dashNewAnalysis: 'New analysis →',
    dashEmptyAnalyses: 'No analyses saved yet.', dashFirstAnalysis: 'Start first analysis',
    dashUnknownRole: 'Unknown role',
    dashRecentApps: 'Recent applications', dashViewAll: 'View all →',
    dashEmptyApps: 'No applications tracked yet.', dashFirstApp: 'Add first one',

    // Tracker
    trackerTitle: 'Application Tracker', trackerSub: 'Track all your applications in one place.',
    trackerAdd: '+ Add', trackerAll: 'All',
    trackerStatusApplied: 'Applied', trackerStatusInterview: 'Interview',
    trackerStatusOffer: 'Offer', trackerStatusRejected: 'Rejected',
    trackerFormNew: 'New application', trackerFormEdit: 'Edit',
    trackerLabelCompany: 'Company *', trackerPlaceholderCompany: 'e.g. Google',
    trackerLabelRole: 'Role *', trackerPlaceholderRole: 'e.g. Software Engineer',
    trackerLabelStatus: 'Status', trackerLabelDate: 'Date applied',
    trackerLabelNotes: 'Notes', trackerPlaceholderNotes: 'Contact, recruiter, next step...',
    trackerSave: 'Save', trackerSaving: 'Saving...', trackerCancel: 'Cancel',
    trackerDeleteConfirm: 'Delete this application?',
    trackerEmptyAll: 'No applications yet.', trackerEmptyFiltered: 'No applications with this status.',
    trackerFirstAdd: 'Add first one',
    trackerColCompany: 'Company', trackerColRole: 'Role', trackerColStatus: 'Status',
    trackerColDate: 'Date', trackerColNotes: 'Notes',
    trackerEditBtn: 'Edit', trackerDeleteBtn: 'Delete',

    // Interview
    interviewTitle: 'Interview Preparation',
    interviewSub: 'Generate common questions for your role — including strong answers.',
    interviewLabelRole: 'Job title *',
    interviewPlaceholderRole: 'e.g. Software Engineer, Marketing Manager, Data Analyst...',
    interviewLabelContext: 'Extra context', interviewOptional: '(optional)',
    interviewPlaceholderContext: 'e.g. 5 years experience, scale-up, technical team, B2B focus...',
    interviewGenerate: '🎯  Generate interview questions', interviewGenerating: 'Generating questions...',
    interviewError: 'Something went wrong. Please try again.',
    interviewQuestionsFor: (n: number) => `${n} questions for:`,
    interviewCopyAll: 'Copy all', interviewAnswerLabel: 'Strong answer', interviewTipLabel: '💡 Pro tip',

    // Blog
    blogTitle: 'Job Search Tips & Advice',
    blogSub: 'Practical advice for a better CV, stronger cover letter and more interviews.',
    blogRead: 'read', blogReadMore: 'Read more →',
    blogCtaTitle: 'Apply these tips right now',
    blogCtaSub: 'Analyse your CV against a job posting and get personalised feedback in 30 seconds.',
    blogCtaBtn: 'Start free analysis →',
    blogBack: '← Back to blog',
    blogPostCtaTitle: 'Apply these tips right now',
    blogPostCtaSub: 'Analyse your CV against a job posting and get personalised feedback in 30 seconds.',
    blogPostCtaBtn: 'Start free analysis →',
    blogOtherPosts: 'Other articles',
  },
} as const;

export type Translations = typeof T.nl;
