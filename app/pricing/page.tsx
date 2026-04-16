import type { Metadata } from 'next';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';

export const metadata: Metadata = {
  title: 'Prijzen — Sollicitatie Coach',
  description: 'Kies het plan dat bij jouw situatie past. Begin gratis, upgrade wanneer je klaar bent.',
};

export default function PricingPage() {
  return (
    <div style={{ padding: '56px 0 80px' }}>
      <div className="container-sm">
        <div className="section-header text-center">
          <p className="section-label">Prijzen</p>
          <h1 style={{ fontSize: '2.2rem', marginBottom: 10 }}>Begin gratis. Upgrade wanneer je klaar bent.</h1>
          <p>Geen creditcard nodig om te beginnen. Maandelijks opzegbaar.</p>
        </div>

        <div className="pricing-grid" style={{ marginTop: 40 }}>
          {/* Free */}
          <div className="card pricing-card">
            <p className="pricing-tier">Gratis</p>
            <p className="pricing-price"><sup>€</sup>0 <span>voor altijd</span></p>
            <p className="pricing-desc">Probeer de tool zonder verplichting.</p>
            <ul className="pricing-features">
              {['3 analyses (eenmalig)','Match score + uitleg','Keyword analyse','Sterke punten & verbeterpunten','CV verbeterpunten'].map(i => <li key={i}>{i}</li>)}
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

        {/* FAQ */}
        <div style={{ marginTop: 64 }}>
          <h2 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: 28 }}>Veelgestelde vragen</h2>
          <div className="faq-list">
            {[
              { q: 'Kan ik op elk moment opzeggen?', a: 'Ja. Abonnementen zijn maandelijks opzegbaar, zonder minimale looptijd of opzegtermijn.' },
              { q: 'Welke betaalmethoden worden geaccepteerd?', a: 'iDEAL, creditcard (Visa/Mastercard) en andere methoden via LemonSqueezy.' },
              { q: 'Wat als ik mijn maandlimiet bereik?', a: 'Je ontvangt een melding. Je kunt op elk moment upgraden of wachten tot de volgende maand.' },
              { q: 'Zijn analyses echt gepersonaliseerd?', a: 'Ja. De AI analyseert jouw specifieke CV en vacature. Er worden geen sjablonen gebruikt.' },
            ].map((f, i) => (
              <details key={i} className="faq-item">
                <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', cursor: 'pointer', fontWeight: 600, fontSize: 15, listStyle: 'none', gap: 20, color: 'var(--text)' }}>
                  {f.q}<span className="faq-icon">+</span>
                </summary>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, paddingBottom: 16 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
