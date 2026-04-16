import Link from 'next/link';
import type { Metadata } from 'next';
import CheckoutButton from '@/components/CheckoutButton';

export const metadata: Metadata = {
  title: 'Sollicitatie Coach — Schrijf je motivatiebrief in 30 seconden',
  description: 'Plak je CV en vacature — AI analyseert de match en schrijft een professionele motivatiebrief. Gratis proberen, geen account nodig.',
};

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="hero">
        <div className="hero-badge">Gratis proberen — geen account nodig</div>
        <h1>Schrijf je motivatiebrief<br />in 30 seconden</h1>
        <p>
          Plak je CV en vacature. AI analyseert de match, geeft concrete verbeterpunten
          en schrijft een volledige motivatiebrief die aansluit op de specifieke vacature.
        </p>
        <div className="hero-ctas">
          <Link href="/analyse" className="btn btn-primary btn-lg">Start gratis →</Link>
          <Link href="/pricing" className="btn btn-secondary btn-lg">Bekijk prijzen</Link>
        </div>
        <p className="hero-note">
          <span>Eerste 3 analyses gratis</span>
          <span>Geen creditcard nodig</span>
          <span>Direct resultaat</span>
        </p>
      </div>

      {/* ── Trust pills ──────────────────────────────────── */}
      <div className="trust-bar">
        {['Match score 0–100','Ontbrekende keywords','Motivatiebrief op maat','CV verbeterpunten','Interview voorbereiding','Sollicitatie tracker'].map(t => (
          <span key={t} className="trust-pill">{t}</span>
        ))}
      </div>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">Hoe het werkt</p>
            <h2>Drie stappen. Dertig seconden.</h2>
            <p>Geen sjablonen. Geen gedoe. Gewoon plakken en gaan.</p>
          </div>
          <div className="steps">
            {[
              { n: '1', t: 'Plak je CV', d: 'Kopieer de tekst van je CV — werkervaring, opleiding en vaardigheden.' },
              { n: '2', t: 'Plak de vacature', d: 'Voeg de volledige vacaturetekst toe inclusief functie-eisen.' },
              { n: '3', t: 'Ontvang je analyse', d: 'Match score, verbeterpunten, keywords én een complete motivatiebrief.' },
            ].map(s => (
              <div key={s.n} className="card step-card">
                <div className="step-num">{s.n}</div>
                <h3>{s.t}</h3>
                <p style={{ fontSize: 14, marginTop: 6 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">Alles in één</p>
            <h2>De tools die je nodig hebt</h2>
            <p>Gebouwd voor mensen die betere sollicitaties willen met minder moeite.</p>
          </div>
          <div className="feature-grid">
            {[
              { icon: '📊', t: 'Match score', d: 'Zie direct hoe goed je CV aansluit op de vacature. Score van 0–100 met een heldere uitleg.' },
              { icon: '🔑', t: 'Keyword analyse', d: 'Ontdek welke termen uit de vacature ontbreken in je CV en vergroot je kansen bij ATS-systemen.' },
              { icon: '✉️', t: 'Motivatiebrief op maat', d: 'Een volledige, professionele motivatiebrief die aansluit op de specifieke vacature — niet een sjabloon.' },
              { icon: '📋', t: 'Sollicitatie tracker', d: 'Houd alle sollicitaties bij op één plek. Status, notities en datums overzichtelijk in een dashboard.' },
            ].map(f => (
              <div key={f.t} className="card feature-card">
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <h3 style={{ marginBottom: 6 }}>{f.t}</h3>
                  <p style={{ fontSize: 14 }}>{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">Wat gebruikers zeggen</p>
            <h2>Echte resultaten</h2>
          </div>
          <div className="testimonial-grid">
            {[
              { text: '"In 10 minuten had ik een motivatiebrief die perfect aansloot op de vacature. Binnen een week uitgenodigd voor een gesprek."', name: 'Laura M. — Marketing Manager' },
              { text: '"De keyword-analyse opende mijn ogen. Ik miste 6 cruciale termen. Na het aanpassen van mijn CV werd ik meteen vaker teruggebeld."', name: 'Thomas B. — Software Engineer' },
              { text: '"Eindelijk een tool die echt helpt. Niet alleen een sjabloon, maar een echte analyse van mijn situatie."', name: 'Sanne V. — HR Consultant' },
            ].map((r, i) => (
              <div key={i} className="card testimonial-card">
                <div className="stars">★★★★★</div>
                <p className="testimonial-text">"{r.text}"</p>
                <p className="testimonial-author">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">Prijzen</p>
            <h2>Begin gratis. Upgrade wanneer je klaar bent.</h2>
            <p>Geen creditcard nodig om te beginnen.</p>
          </div>
          <div className="pricing-grid">
            {/* Free */}
            <div className="card pricing-card">
              <p className="pricing-tier">Gratis</p>
              <p className="pricing-price"><sup>€</sup>0 <span>voor altijd</span></p>
              <p className="pricing-desc">Probeer de tool zonder verplichting.</p>
              <ul className="pricing-features">
                {['3 analyses','Match score + uitleg','Keyword analyse','CV verbeterpunten'].map(i => <li key={i}>{i}</li>)}
              </ul>
              <Link href="/analyse" className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>Gratis starten →</Link>
            </div>
            {/* Plus */}
            <div className="card pricing-card featured">
              <p className="pricing-tier highlight">Plus — Meest gekozen</p>
              <p className="pricing-price"><sup>€</sup>2,99 <span>/ maand</span></p>
              <p className="pricing-desc">Voor mensen die actief solliciteren.</p>
              <ul className="pricing-features">
                {['10 analyses per maand','Alles in Gratis','Motivatiebrief op maat','Dashboard & analyse historie','Sollicitatie tracker','Interview voorbereiding'].map(i => <li key={i}>{i}</li>)}
              </ul>
              <CheckoutButton plan="plus" label="Plus starten →" highlight={true} />
            </div>
            {/* Pro */}
            <div className="card pricing-card">
              <p className="pricing-tier">Pro</p>
              <p className="pricing-price"><sup>€</sup>9,99 <span>/ maand</span></p>
              <p className="pricing-desc">Voor serieuze sollicitanten.</p>
              <ul className="pricing-features">
                {['100 analyses per maand','Alles in Plus','PDF export van motivatiebrief','Prioriteit support'].map(i => <li key={i}>{i}</li>)}
              </ul>
              <CheckoutButton plan="pro" label="Pro starten →" highlight={false} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-sm">
          <div className="section-header text-center">
            <p className="section-label">FAQ</p>
            <h2>Veelgestelde vragen</h2>
          </div>
          <div className="faq-list">
            {[
              { q: 'Is het echt gratis?', a: 'Ja. De eerste 3 analyses zijn volledig gratis — inclusief de motivatiebrief. Geen creditcard nodig. Daarna kun je upgraden voor meer analyses.' },
              { q: 'Heb ik een account nodig?', a: 'Nee. Je kunt de CV-analyse direct gebruiken zonder account. Een account geeft toegang tot het dashboard, de tracker en interview prep.' },
              { q: 'Hoe nauwkeurig is de analyse?', a: 'De AI gebruikt Claude van Anthropic — een van de krachtigste modellen beschikbaar. Resultaten zijn specifiek voor jouw CV en vacature, niet generiek.' },
              { q: 'Is mijn CV veilig?', a: 'Je CV wordt uitsluitend gebruikt voor de analyse. Elke analyse is een losse, beveiligde API-aanroep. Zonder account slaan we niets op.' },
              { q: 'Werkt het voor elke baan?', a: 'Ja. De tool werkt voor elke sector en elk niveau. Hoe gedetailleerder je CV en vacature, hoe beter de resultaten.' },
              { q: 'In welke talen werkt het?', a: 'De tool werkt in het Nederlands en Engels. De motivatiebrief wordt geschreven in de taal van je CV en vacature.' },
            ].map((f, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', cursor: 'pointer', fontWeight: 600, fontSize: 15, listStyle: 'none', gap: 24, color: 'var(--text)', borderBottom: 'none' }}>
                  {f.q}<span className="faq-icon">+</span>
                </summary>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, paddingBottom: 18 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Klaar voor een betere motivatiebrief?</h2>
            <p>Gratis proberen — geen account nodig — in 30 seconden klaar.</p>
            <Link href="/analyse" className="btn btn-light btn-lg">Start gratis →</Link>
            <p style={{ marginTop: 14, fontSize: 12, color: '#55556A' }}>Eerste 3 analyses gratis · Geen creditcard</p>
          </div>
        </div>
      </section>
    </>
  );
}
