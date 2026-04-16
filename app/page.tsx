import Link from 'next/link';
import type { Metadata } from 'next';
import CheckoutButton from '@/components/CheckoutButton';

export const metadata: Metadata = {
  title: 'Sollicitatie Coach — Schrijf je motivatiebrief in 30 seconden',
  description: 'AI analyseert je CV op de vacature en schrijft een professionele motivatiebrief. Gratis proberen.',
};

export default function LandingPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <div className="hero-wrap">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Gratis proberen — geen account nodig
        </div>
        <h1>Schrijf je motivatiebrief<br /><span>in 30 seconden</span></h1>
        <p>Plak je CV en vacature. AI analyseert de match, geeft verbeterpunten en schrijft een professionele brief die aansluit op de specifieke vacature.</p>
        <div className="hero-ctas">
          <Link href="/analyse" className="btn btn-white btn-lg">Start gratis →</Link>
          <Link href="/pricing" className="btn btn-lg" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }}>Bekijk prijzen</Link>
        </div>
        <p className="hero-note">
          <span>3 analyses gratis</span>
          <span>Geen creditcard</span>
          <span>Direct resultaat</span>
        </p>
        <div className="hero-stats">
          <div>
            <div className="hero-stat-num">10.000+</div>
            <div className="hero-stat-label">Analyses uitgevoerd</div>
          </div>
          <div>
            <div className="hero-stat-num">30 sec</div>
            <div className="hero-stat-label">Gemiddelde tijd</div>
          </div>
          <div>
            <div className="hero-stat-num">4.8 ★</div>
            <div className="hero-stat-label">Gemiddelde beoordeling</div>
          </div>
        </div>
      </div>

      {/* ── TRUST PILLS ──────────────────────────────── */}
      <div className="trust-bar">
        {['Match score 0–100','Ontbrekende keywords','Motivatiebrief op maat','CV verbeterpunten','Interview voorbereiding','Sollicitatie tracker'].map(t => (
          <span key={t} className="trust-pill">{t}</span>
        ))}
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">Hoe het werkt</p>
            <h2 className="section-title">Drie stappen. Dertig seconden.</h2>
            <p className="section-sub">Geen sjablonen. Geen gedoe. Plak en ontvang direct resultaat.</p>
          </div>
          <div className="steps-grid">
            {[
              { n: '1', t: 'Plak je CV', d: 'Kopieer de tekst van je CV — werkervaring, opleiding en vaardigheden.' },
              { n: '2', t: 'Plak de vacature', d: 'Voeg de volledige vacaturetekst toe inclusief functie-eisen.' },
              { n: '3', t: 'Ontvang je analyse', d: 'Match score, verbeterpunten, ontbrekende keywords én een complete motivatiebrief op maat.' },
            ].map(s => (
              <div key={s.n} className="step-card">
                <div className="step-num">{s.n}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="section bg-gray">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">Wat je krijgt</p>
            <h2 className="section-title">Alles in één tool</h2>
            <p className="section-sub">Gebouwd voor mensen die betere sollicitaties willen met minder moeite.</p>
          </div>
          <div className="features-grid">
            {[
              { icon: '📊', cls: 'icon-blue', t: 'CV Match Score', d: 'Zie direct hoe goed je CV aansluit op de vacature. Score van 0–100 met een heldere uitleg en concrete verbeterpunten.' },
              { icon: '🔑', cls: 'icon-indigo', t: 'Keyword Analyse', d: 'Ontdek welke termen uit de vacature ontbreken in je CV. Vergroot je kansen bij ATS-systemen van grote bedrijven.' },
              { icon: '✉️', cls: 'icon-green', t: 'Motivatiebrief op Maat', d: 'Een volledige, professionele motivatiebrief die aansluit op de specifieke vacature. Niet een sjabloon — echt gepersonaliseerd.' },
              { icon: '📋', cls: 'icon-amber', t: 'Sollicitatie Tracker', d: 'Houd alle sollicitaties bij op één plek. Status, notities en datums overzichtelijk in je persoonlijke dashboard.' },
            ].map(f => (
              <div key={f.t} className="feature-card">
                <div className={`feature-icon-wrap ${f.cls}`}>{f.icon}</div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">Gebruikerservaringen</p>
            <h2 className="section-title">Wat mensen zeggen</h2>
          </div>
          <div className="testimonials-grid">
            {[
              { text: 'In 10 minuten had ik een motivatiebrief die perfect aansloot op de vacature. Binnen een week uitgenodigd voor een gesprek.', name: 'Laura M.', role: 'Marketing Manager' },
              { text: 'De keyword-analyse opende mijn ogen. Ik miste 6 cruciale termen in mijn CV. Na het aanpassen werd ik meteen vaker teruggebeld.', name: 'Thomas B.', role: 'Software Engineer' },
              { text: 'Eindelijk een tool die echt helpt. Niet alleen een sjabloon, maar een echte analyse van mijn specifieke situatie.', name: 'Sanne V.', role: 'HR Consultant' },
            ].map((r, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{r.text}"</p>
                <p className="testimonial-author">{r.name}</p>
                <p className="testimonial-role">{r.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────── */}
      <section className="section bg-gray">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">Prijzen</p>
            <h2 className="section-title">Begin gratis. Upgrade wanneer je klaar bent.</h2>
            <p className="section-sub">Geen creditcard nodig. Maandelijks opzegbaar.</p>
          </div>
          <div className="pricing-grid">
            {/* Free */}
            <div className="pricing-card">
              <p className="pricing-tier">Gratis</p>
              <p className="pricing-price"><sup>€</sup>0</p>
              <p className="pricing-price-sub">voor altijd</p>
              <p className="pricing-desc">Probeer de tool zonder verplichting.</p>
              <div className="pricing-divider" />
              <ul className="pricing-features">
                {['3 analyses (eenmalig)','Match score + uitleg','Keyword analyse','CV verbeterpunten'].map(i => (
                  <li key={i}><span className="pricing-check">✓</span>{i}</li>
                ))}
              </ul>
              <Link href="/analyse" className="btn btn-ghost w-full" style={{ justifyContent: 'center' }}>Gratis starten →</Link>
            </div>
            {/* Plus — featured */}
            <div className="pricing-card featured">
              <div className="pricing-popular">⚡ Meest gekozen</div>
              <p className="pricing-tier">Plus</p>
              <p className="pricing-price"><sup>€</sup>2,99</p>
              <p className="pricing-price-sub">per maand</p>
              <p className="pricing-desc">Voor mensen die actief solliciteren.</p>
              <div className="pricing-divider" />
              <ul className="pricing-features">
                {['10 analyses per maand','Alles in Gratis','Motivatiebrief op maat','Dashboard & analyse historie','Sollicitatie tracker','Interview voorbereiding'].map(i => (
                  <li key={i}><span className="pricing-check">✓</span>{i}</li>
                ))}
              </ul>
              <CheckoutButton plan="plus" label="Plus starten →" highlight={true} />
            </div>
            {/* Pro */}
            <div className="pricing-card">
              <p className="pricing-tier">Pro</p>
              <p className="pricing-price"><sup>€</sup>9,99</p>
              <p className="pricing-price-sub">per maand</p>
              <p className="pricing-desc">Voor serieuze sollicitanten.</p>
              <div className="pricing-divider" />
              <ul className="pricing-features">
                {['100 analyses per maand','Alles in Plus','PDF export','Prioriteit support'].map(i => (
                  <li key={i}><span className="pricing-check">✓</span>{i}</li>
                ))}
              </ul>
              <CheckoutButton plan="pro" label="Pro starten →" highlight={false} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="section">
        <div className="container-sm">
          <div className="section-header text-center">
            <p className="section-label">FAQ</p>
            <h2 className="section-title">Veelgestelde vragen</h2>
          </div>
          {[
            { q: 'Is het echt gratis?', a: 'Ja. De eerste 3 analyses zijn volledig gratis — inclusief de motivatiebrief. Geen creditcard nodig.' },
            { q: 'Heb ik een account nodig?', a: 'Nee. Je kunt de CV-analyse direct gebruiken zonder account. Een account geeft toegang tot het dashboard, de tracker en interview prep.' },
            { q: 'Hoe nauwkeurig is de analyse?', a: 'De AI gebruikt Claude van Anthropic — een van de krachtigste modellen beschikbaar. Resultaten zijn specifiek voor jouw CV en vacature, niet generiek.' },
            { q: 'Is mijn CV veilig?', a: 'Je CV wordt uitsluitend gebruikt voor de analyse. Elke analyse is een losse, beveiligde API-aanroep. Zonder account slaan we niets op.' },
            { q: 'Kan ik op elk moment opzeggen?', a: 'Ja. Abonnementen zijn maandelijks opzegbaar, zonder minimale looptijd.' },
          ].map((f, i) => (
            <details key={i} className="faq-item">
              <summary>
                {f.q}
                <span className="faq-icon">+</span>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Klaar voor een betere motivatiebrief?</h2>
            <p>Gratis proberen — geen account nodig — in 30 seconden klaar.</p>
            <Link href="/analyse" className="btn btn-white btn-lg" style={{ display: 'inline-flex' }}>
              Start gratis analyse →
            </Link>
            <p style={{ marginTop: 16, fontSize: 12, color: '#475569' }}>3 analyses gratis · Geen creditcard</p>
          </div>
        </div>
      </section>
    </>
  );
}
