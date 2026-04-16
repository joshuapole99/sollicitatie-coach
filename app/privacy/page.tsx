'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

const CONTENT = {
  nl: {
    title: 'Privacybeleid',
    updated: 'Laatst bijgewerkt: januari 2026',
    back: '← Terug naar home',
    other: 'Algemene voorwaarden',
    otherHref: '/terms',
    sections: [
      { title: '1. Welke gegevens we verzamelen', content: 'We verzamelen minimale gegevens die nodig zijn om de dienst te leveren. Als je de CV-analyse gebruikt zonder account, slaan we je CV of vacaturetekst niet op — elke analyse is een losse, anonieme API-aanroep. Als je een account aanmaakt, bewaren we je e-mailadres en de resultaten van je analyses.' },
      { title: '2. Hoe we je gegevens gebruiken', content: 'Je gegevens worden uitsluitend gebruikt voor: het leveren van de CV-analyseservice, het bijhouden van je gebruiksstatistieken (aantal analyses) en het opslaan van je dashboard-gegevens als je een account hebt. We verkopen je gegevens nooit aan derden.' },
      { title: '3. Cookies en tracking', content: 'We gebruiken een anonieme sessie-ID (opgeslagen in localStorage) om je analysesaldo bij te houden. We gebruiken Vercel Analytics voor anonieme paginastatistieken. Er worden geen persoonlijke tracking-cookies geplaatst.' },
      { title: '4. AI-verwerking', content: 'Je CV en vacaturetekst worden verwerkt door de Claude API van Anthropic om de analyse te genereren. Deze gegevens worden niet opgeslagen na de analyse. Raadpleeg het privacybeleid van Anthropic voor meer informatie over hun dataverwerking.' },
      { title: '5. Beveiliging', content: 'Alle communicatie verloopt via HTTPS. We gebruiken Supabase voor veilige authenticatie en Upstash KV voor het bijhouden van gebruikslimieten. Wachtwoorden worden nooit in plain text opgeslagen.' },
      { title: '6. Jouw rechten', content: 'Je hebt het recht om je account en gegevens te verwijderen. Stuur een e-mail naar privacy@sollicitatie-coach.nl en we verwijderen je gegevens binnen 30 dagen. Je kunt ook je browsergegevens verwijderen om de anonieme sessie te resetten.' },
      { title: '7. Contact', content: 'Vragen over dit privacybeleid? Stuur een e-mail naar privacy@sollicitatie-coach.nl.' },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: January 2026',
    back: '← Back to home',
    other: 'Terms and Conditions',
    otherHref: '/terms',
    sections: [
      { title: '1. What data we collect', content: 'We collect minimal data necessary to provide the service. If you use the CV analysis without an account, we do not store your CV or job posting — every analysis is a separate, anonymous API call. If you create an account, we store your email address and the results of your analyses.' },
      { title: '2. How we use your data', content: 'Your data is used exclusively for: delivering the CV analysis service, tracking your usage statistics (number of analyses), and storing your dashboard data if you have an account. We never sell your data to third parties.' },
      { title: '3. Cookies and tracking', content: 'We use an anonymous session ID (stored in localStorage) to track your analysis balance. We use Vercel Analytics for anonymous page statistics. No personal tracking cookies are placed.' },
      { title: '4. AI processing', content: "Your CV and job posting are processed by Anthropic's Claude API to generate the analysis. This data is not stored after the analysis. Please refer to Anthropic's privacy policy for more information about their data processing." },
      { title: '5. Security', content: 'All communication is via HTTPS. We use Supabase for secure authentication and Upstash KV for tracking usage limits. Passwords are never stored in plain text.' },
      { title: '6. Your rights', content: 'You have the right to delete your account and data. Send an email to privacy@sollicitatie-coach.nl and we will delete your data within 30 days. You can also clear your browser data to reset the anonymous session.' },
      { title: '7. Contact', content: 'Questions about this privacy policy? Send an email to privacy@sollicitatie-coach.nl.' },
    ],
  },
};

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const c = CONTENT[lang];

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 900, letterSpacing: '-.03em', marginBottom: 10 }}>{c.title}</h1>
        <p style={{ color: '#94a3b8', fontSize: 15 }}>{c.updated}</p>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 80px' }}>
        {c.sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{s.title}</h2>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.75 }}>{s.content}</p>
          </div>
        ))}

        <div style={{ marginTop: 48, padding: '20px 24px', background: '#f8fafc', borderRadius: 14, border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: 14, color: '#64748b' }}>
            <Link href="/" style={{ color: '#4f46e5', fontWeight: 600 }}>{c.back}</Link>
            {' · '}
            <Link href={c.otherHref} style={{ color: '#4f46e5', fontWeight: 600 }}>{c.other}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
