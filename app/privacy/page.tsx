import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacybeleid — Sollicitatie Coach',
  description: 'Hoe we omgaan met jouw gegevens bij Sollicitatie Coach.',
};

export default function PrivacyPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 900, letterSpacing: '-.03em', marginBottom: 10 }}>Privacybeleid</h1>
        <p style={{ color: '#94a3b8', fontSize: 15 }}>Laatst bijgewerkt: januari 2026</p>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 80px' }}>
        {[
          {
            title: '1. Welke gegevens we verzamelen',
            content: 'We verzamelen minimale gegevens die nodig zijn om de dienst te leveren. Als je de CV-analyse gebruikt zonder account, slaan we je CV of vacaturetekst niet op — elke analyse is een losse, anonieme API-aanroep. Als je een account aanmaakt, bewaren we je e-mailadres en de resultaten van je analyses.'
          },
          {
            title: '2. Hoe we je gegevens gebruiken',
            content: 'Je gegevens worden uitsluitend gebruikt voor: het leveren van de CV-analyseservice, het bijhouden van je gebruiksstatistieken (aantal analyses) en het opslaan van je dashboard-gegevens als je een account hebt. We verkopen je gegevens nooit aan derden.'
          },
          {
            title: '3. Cookies en tracking',
            content: 'We gebruiken een anonieme sessie-ID (opgeslagen in localStorage) om je analysesaldo bij te houden. We gebruiken Vercel Analytics voor anonieme paginastatistieken. Er worden geen persoonlijke tracking-cookies geplaatst.'
          },
          {
            title: '4. AI-verwerking',
            content: 'Je CV en vacaturetekst worden verwerkt door de Claude API van Anthropic om de analyse te genereren. Deze gegevens worden niet opgeslagen na de analyse. Raadpleeg het privacybeleid van Anthropic voor meer informatie over hun dataverwerking.'
          },
          {
            title: '5. Beveiliging',
            content: 'Alle communicatie verloopt via HTTPS. We gebruiken Supabase voor veilige authenticatie en Upstash KV voor het bijhouden van gebruikslimieten. Wachtwoorden worden nooit in plain text opgeslagen.'
          },
          {
            title: '6. Jouw rechten',
            content: 'Je hebt het recht om je account en gegevens te verwijderen. Stuur een e-mail naar privacy@sollicitatie-coach.nl en we verwijderen je gegevens binnen 30 dagen. Je kunt ook je browsergegevens verwijderen om de anonieme sessie te resetten.'
          },
          {
            title: '7. Contact',
            content: 'Vragen over dit privacybeleid? Stuur een e-mail naar privacy@sollicitatie-coach.nl.'
          },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{s.title}</h2>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.75 }}>{s.content}</p>
          </div>
        ))}

        <div style={{ marginTop: 48, padding: '20px 24px', background: '#f8fafc', borderRadius: 14, border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: 14, color: '#64748b' }}>
            <Link href="/" style={{ color: '#4f46e5', fontWeight: 600 }}>← Terug naar home</Link>
            {' · '}
            <Link href="/terms" style={{ color: '#4f46e5', fontWeight: 600 }}>Algemene voorwaarden</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
