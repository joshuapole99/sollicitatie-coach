import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sollicitatie Coach — Schrijf je motivatiebrief in 30 seconden',
  description: 'Plak je CV en vacature — AI analyseert de match en schrijft een professionele motivatiebrief. Gratis proberen, geen account nodig.',
};

const features = [
  { icon: '📊', title: 'CV Analyse & Match Score', desc: 'Zie direct hoe goed je CV aansluit op de vacature. Score van 0–100 met concrete verbeterpunten.' },
  { icon: '✉️', title: 'Motivatiebrief op Maat', desc: 'Een volledige, professionele motivatiebrief die perfect aansluit op de specifieke vacature.' },
  { icon: '🎯', title: 'Interview Voorbereiding', desc: 'Genereer de meest gestelde vragen voor jouw rol, inclusief sterke antwoorden.' },
  { icon: '📋', title: 'Sollicitatie Tracker', desc: 'Houd al je sollicitaties bij op één plek. Status, notities en datums overzichtelijk.' },
];

const faqs = [
  { q: 'Is het echt gratis?', a: 'Ja. De eerste 3 analyses zijn volledig gratis — inclusief de motivatiebrief. Geen creditcard nodig.' },
  { q: 'Heb ik een account nodig?', a: 'Nee. Je kunt de CV-analyse direct gebruiken zonder account. Een account geeft je toegang tot het dashboard, de tracker en interview prep.' },
  { q: 'Hoe nauwkeurig is de analyse?', a: 'De AI gebruikt Claude van Anthropic — een van de krachtigste modellen beschikbaar. Resultaten zijn specifiek voor jouw CV en vacature, niet generiek.' },
  { q: 'Is mijn CV veilig?', a: 'Je CV wordt uitsluitend gebruikt voor de analyse en nooit opgeslagen zonder jouw toestemming. Elke analyse is een losse, beveiligde API call.' },
  { q: 'Werkt het voor elke baan?', a: 'Ja. De tool werkt voor elke sector en elk functieniveau. Hoe gedetailleerder je CV en vacature, hoe beter de resultaten.' },
  { q: 'In welke talen werkt het?', a: 'De tool werkt in het Nederlands en Engels. De motivatiebrief wordt geschreven in de taal van je CV en vacature.' },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          Gratis proberen — geen account nodig
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
          Schrijf je motivatiebrief<br className="hidden sm:block" /> in 30 seconden
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
          Plak je CV en vacature. AI analyseert de match, geeft verbeterpunten en schrijft een professionele brief op maat. Geen sjablonen — alles 100% gepersonaliseerd.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/analyse" className="btn-primary btn-lg">
            Start gratis →
          </Link>
          <Link href="/pricing" className="btn-secondary btn-lg">
            Bekijk prijzen
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">Eerste 3 analyses gratis · Geen creditcard nodig</p>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-2 justify-center mt-8">
          {['Match score 0–100', 'Ontbrekende keywords', 'Motivatiebrief op maat', 'CV verbeterpunten', 'Interview prep', 'Sollicitatie tracker'].map(b => (
            <span key={b} className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">{b}</span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Hoe het werkt</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Drie stappen. Dertig seconden.</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { n: '1', t: 'Plak je CV', d: 'Kopieer de tekst van je CV — werkervaring, opleiding en vaardigheden.' },
            { n: '2', t: 'Plak de vacature', d: 'Voeg de volledige vacaturetekst toe inclusief vereisten.' },
            { n: '3', t: 'Ontvang je analyse', d: 'Match score, verbeterpunten, keywords én een complete motivatiebrief.' },
          ].map(s => (
            <div key={s.n} className="card p-6">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">{s.n}</div>
              <h3 className="font-bold text-sm mb-2">{s.t}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Alles in één</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold">De tools die je nodig hebt om aangenomen te worden</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map(f => (
              <div key={f.title} className="card p-6 flex gap-4">
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <h3 className="font-bold text-sm mb-1.5">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof / stats */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14 text-center">
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { n: '10.000+', l: 'Analyses uitgevoerd' },
            { n: '30 sec', l: 'Gemiddelde tijd' },
            { n: 'Claude AI', l: 'Aangedreven door Anthropic' },
          ].map(s => (
            <div key={s.l}>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">{s.n}</div>
              <div className="text-xs text-gray-400">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { stars: 5, text: '"In 10 minuten had ik een motivatiebrief die perfect aansloot op de vacature. Binnen een week uitgenodigd voor een gesprek."', name: 'Laura M. — Marketing Manager' },
            { stars: 5, text: '"De keyword-analyse opende mijn ogen. Ik miste 6 cruciale termen in mijn CV. Na aanpassing werd ik meteen vaker teruggebeld."', name: 'Thomas B. — Software Engineer' },
            { stars: 5, text: '"Eindelijk een tool die echt helpt. Niet alleen een sjabloon, maar een echte analyse van mijn specifieke situatie."', name: 'Sanne V. — HR Consultant' },
          ].map((r, i) => (
            <div key={i} className="card p-5 text-left">
              <div className="text-amber-400 text-sm mb-3">{'★'.repeat(r.stars)}</div>
              <p className="text-sm text-gray-600 italic leading-relaxed mb-3">{r.text}</p>
              <p className="text-xs font-semibold text-gray-400">{r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="bg-gray-50 border-y border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Prijzen</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Begin gratis. Upgrade wanneer je klaar bent.</h2>
          <p className="text-gray-500 text-sm mb-8">Geen creditcard nodig om te beginnen.</p>
          <div className="grid sm:grid-cols-3 gap-5 text-left">
            {[
              { name: 'Gratis', price: '€0', sub: 'voor altijd', items: ['3 analyses', 'Match score', 'Keyword analyse', 'CV verbeterpunten'], cta: 'Gratis starten →', href: '/analyse', featured: false },
              { name: 'Plus', price: '€2,99', sub: '/ maand', items: ['10 analyses/maand', 'Motivatiebrief op maat', 'Dashboard & historie', 'Sollicitatie tracker'], cta: 'Plus starten →', href: '/pricing', featured: true },
              { name: 'Pro', price: '€9,99', sub: '/ maand', items: ['100 analyses/maand', 'Alles in Plus', 'PDF export', 'Interview prep', 'Prioriteit support'], cta: 'Pro starten →', href: '/pricing', featured: false },
            ].map(p => (
              <div key={p.name} className={`card p-6 ${p.featured ? 'ring-2 ring-primary' : ''}`}>
                <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${p.featured ? 'text-blue-600' : 'text-gray-400'}`}>{p.name}</p>
                <p className="text-3xl font-extrabold mb-0.5">{p.price} <span className="text-sm font-normal text-gray-400">{p.sub}</span></p>
                <ul className="mt-4 mb-5 space-y-2">
                  {p.items.map(i => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500 font-bold">✓</span>{i}
                    </li>
                  ))}
                </ul>
                <Link href={p.href} className={p.featured ? 'btn-primary w-full text-center block' : 'btn-secondary w-full text-center block'}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">FAQ</p>
          <h2 className="text-2xl font-extrabold">Veelgestelde vragen</h2>
        </div>
        <div className="space-y-0">
          {faqs.map((f, i) => (
            <details key={i} className="border-b border-gray-100 py-4 group">
              <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-sm text-gray-900 select-none">
                {f.q}
                <span className="text-gray-400 group-open:rotate-45 transition-transform duration-200 text-lg leading-none ml-4 flex-shrink-0">+</span>
              </summary>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="card p-10 text-center bg-gray-900 border-0">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Klaar voor een betere motivatiebrief?</h2>
          <p className="text-gray-400 text-sm mb-6">Gratis proberen — geen account nodig — in 30 seconden klaar.</p>
          <Link href="/analyse" className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-gray-900 font-bold rounded-xl text-base hover:bg-gray-100 transition-colors">
            Start gratis →
          </Link>
          <p className="text-xs text-gray-600 mt-4">Eerste 3 analyses volledig gratis · Geen creditcard nodig</p>
        </div>
      </section>
    </div>
  );
}
