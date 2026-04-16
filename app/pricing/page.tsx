import type { Metadata } from 'next';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';

export const metadata: Metadata = {
  title: 'Prijzen — Sollicitatie Coach',
  description: 'Kies het plan dat bij jouw situatie past. Begin gratis, upgrade wanneer je klaar bent.',
};

export default function PricingPage() {
  const plans = [
    {
      name: 'Gratis',
      price: '€0',
      period: 'voor altijd',
      description: 'Probeer de tool zonder verplichting.',
      highlight: false,
      items: [
        '3 analyses (eenmalig)',
        'Match score + uitleg',
        'Keyword analyse',
        'Sterke punten & verbeterpunten',
        'CV verbeterpunten',
      ],
      cta: 'Gratis starten →',
      href: '/analyse',
      action: null,
    },
    {
      name: 'Plus',
      price: '€2,99',
      period: '/ maand',
      description: 'Voor mensen die actief solliciteren.',
      highlight: true,
      items: [
        '10 analyses per maand',
        'Alles in Gratis',
        'Motivatiebrief op maat',
        'Dashboard & analyse historie',
        'Sollicitatie tracker',
        'Interview voorbereiding',
      ],
      cta: 'Plus starten →',
      href: null,
      action: 'plus',
    },
    {
      name: 'Pro',
      price: '€9,99',
      period: '/ maand',
      description: 'Voor serieuze sollicitanten.',
      highlight: false,
      items: [
        '100 analyses per maand',
        'Alles in Plus',
        'PDF export van motivatiebrief',
        'Prioriteit support',
      ],
      cta: 'Pro starten →',
      href: null,
      action: 'pro',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Prijzen</p>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Begin gratis. Upgrade wanneer je klaar bent.</h1>
        <p className="text-gray-500 text-sm">Geen creditcard nodig om te beginnen.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-12">
        {plans.map(p => (
          <div key={p.name} className={`card p-7 flex flex-col ${p.highlight ? 'ring-2 ring-primary' : ''}`}>
            <div className={`text-xs font-bold uppercase tracking-wide mb-3 ${p.highlight ? 'text-blue-600' : 'text-gray-400'}`}>
              {p.name}
            </div>
            <div className="mb-1">
              <span className="text-4xl font-extrabold text-gray-900">{p.price}</span>
              <span className="text-sm text-gray-400 ml-1">{p.period}</span>
            </div>
            <p className="text-xs text-gray-500 mb-5">{p.description}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {p.items.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            {p.href ? (
              <Link href={p.href} className={`${p.highlight ? 'btn-primary' : 'btn-secondary'} w-full text-center`}>
                {p.cta}
              </Link>
            ) : (
              <CheckoutButton plan={p.action!} label={p.cta} highlight={p.highlight} />
            )}
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-xl mx-auto">
        <h2 className="text-lg font-extrabold text-center mb-6">Veelgestelde vragen over betaling</h2>
        <div className="space-y-4">
          {[
            { q: 'Kan ik op elk moment opzeggen?', a: 'Ja. Abonnementen zijn maandelijks opzegbaar. Er is geen minimale looptijd of opzegtermijn.' },
            { q: 'Welke betaalmethoden worden geaccepteerd?', a: 'iDEAL, creditcard (Visa/Mastercard), en andere lokale betaalmethoden via LemonSqueezy.' },
            { q: 'Wat gebeurt er als ik mijn limiet bereikt?', a: 'Je ontvangt een melding wanneer je de limiet bereikt. Je kunt je abonnement op elk moment upgraden.' },
            { q: 'Zijn er kortingen voor jaarlijkse betaling?', a: 'Op dit moment bieden we maandelijkse abonnementen aan. Jaarlijkse kortingen worden binnenkort beschikbaar.' },
          ].map((f, i) => (
            <details key={i} className="border-b border-gray-100 py-4 group">
              <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-sm text-gray-900 select-none">
                {f.q}
                <span className="text-gray-400 group-open:rotate-45 transition-transform text-lg ml-4 flex-shrink-0">+</span>
              </summary>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

