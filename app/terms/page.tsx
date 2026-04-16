import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden — Sollicitatie Coach',
  description: 'Algemene voorwaarden voor het gebruik van Sollicitatie Coach.',
};

export default function TermsPage() {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 900, letterSpacing: '-.03em', marginBottom: 10 }}>Algemene Voorwaarden</h1>
        <p style={{ color: '#94a3b8', fontSize: 15 }}>Laatst bijgewerkt: januari 2026</p>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 80px' }}>
        {[
          {
            title: '1. Gebruik van de dienst',
            content: 'Sollicitatie Coach biedt een AI-gedreven CV-analyseservice. Je mag de dienst uitsluitend gebruiken voor persoonlijke, niet-commerciële doeleinden — het verbeteren van je eigen sollicitaties. Het is niet toegestaan de service te gebruiken voor het in bulk genereren van motivatiebrieven namens anderen.'
          },
          {
            title: '2. Gratis gebruik en betaalde plannen',
            content: 'Het gratis plan biedt 3 analyses (eenmalig). Betaalde plannen (Plus en Pro) worden maandelijks gefactureerd via LemonSqueezy. Je kunt op elk moment opzeggen via je abonnementsbeheer. Na opzegging heb je tot het einde van de betaalde periode toegang.'
          },
          {
            title: '3. Aansprakelijkheid',
            content: 'De analyses en motivatiebrieven worden gegenereerd door AI en zijn indicatief van aard. Sollicitatie Coach garandeert geen specifieke resultaten (zoals een aangenomen worden voor een functie). Je bent zelf verantwoordelijk voor de inhoud die je indient bij werkgevers.'
          },
          {
            title: '4. Intellectueel eigendom',
            content: 'De door AI gegenereerde content (analyses, motivatiebrieven) wordt eigendom van de gebruiker zodra deze is gegenereerd. De software, het platform en de merknaam "Sollicitatie Coach" zijn eigendom van de ontwikkelaar.'
          },
          {
            title: '5. Beschikbaarheid',
            content: 'We streven naar maximale beschikbaarheid maar garanderen geen 100% uptime. Geplande onderhoudswerkzaamheden worden waar mogelijk van tevoren aangekondigd.'
          },
          {
            title: '6. Wijzigingen',
            content: 'We kunnen deze voorwaarden op elk moment aanpassen. Bij significante wijzigingen ontvangen geregistreerde gebruikers een e-mailnotificatie. Voortgezet gebruik na wijziging geldt als akkoord.'
          },
          {
            title: '7. Toepasselijk recht',
            content: 'Op deze overeenkomst is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.'
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
            <Link href="/privacy" style={{ color: '#4f46e5', fontWeight: 600 }}>Privacybeleid</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
