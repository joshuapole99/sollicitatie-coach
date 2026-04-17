'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { T } from '@/lib/i18n';
import CheckoutButton from '@/components/CheckoutButton';

export default function LandingPage() {
  const { lang } = useLanguage();
  const t = T[lang];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <div className="hero-wrap">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          {t.heroBadge}
        </div>
        <h1>{t.heroTitle1}<br /><span>{t.heroTitle2}</span></h1>
        <p>{t.heroSub}</p>
        <div className="hero-ctas">
          <Link href="/analyse" className="btn btn-white btn-lg">{t.heroCta}</Link>
          <Link href="/pricing" className="btn btn-lg" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }}>
            {t.heroCtaSec}
          </Link>
        </div>
        <p className="hero-note">
          <span>{t.heroN1}</span><span>{t.heroN2}</span><span>{t.heroN3}</span>
        </p>
        <div className="hero-stats">
          <div><div className="hero-stat-num">10.000+</div><div className="hero-stat-label">{t.heroStat1}</div></div>
          <div><div className="hero-stat-num">30 sec</div><div className="hero-stat-label">{t.heroStat2}</div></div>
          <div><div className="hero-stat-num">4.8 ★</div><div className="hero-stat-label">{t.heroStat3}</div></div>
        </div>
      </div>

      {/* ── TRUST PILLS ──────────────────────────────── */}
      <div className="trust-bar">
        {[t.feat1T, t.feat2T, t.feat3T, t.feat4T, lang === 'nl' ? 'Interview voorbereiding' : 'Interview preparation', lang === 'nl' ? 'Sollicitatie tracker' : 'Application tracker', lang === 'nl' ? '📱 Installeerbaar als app' : '📱 Installable as app'].map(pill => (
          <span key={pill} className="trust-pill">{pill}</span>
        ))}
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">{t.howLabel}</p>
            <h2 className="section-title">{t.howTitle}</h2>
            <p className="section-sub">{t.howSub}</p>
          </div>
          <div className="steps-grid">
            {[
              { n: '1', title: t.step1T, desc: t.step1D },
              { n: '2', title: t.step2T, desc: t.step2D },
              { n: '3', title: t.step3T, desc: t.step3D },
            ].map(s => (
              <div key={s.n} className="step-card">
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="section bg-gray">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">{t.featLabel}</p>
            <h2 className="section-title">{t.featTitle}</h2>
            <p className="section-sub">{t.featSub}</p>
          </div>
          <div className="features-grid">
            {[
              { icon: '📊', cls: 'icon-blue',   title: t.feat1T, desc: t.feat1D },
              { icon: '🔑', cls: 'icon-indigo', title: t.feat2T, desc: t.feat2D },
              { icon: '✉️', cls: 'icon-green',  title: t.feat3T, desc: t.feat3D },
              { icon: '📋', cls: 'icon-amber',  title: t.feat4T, desc: t.feat4D },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className={`feature-icon-wrap ${f.cls}`}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-label">{t.revLabel}</p>
            <h2 className="section-title">{t.revTitle}</h2>
          </div>
          <div className="testimonials-grid">
            {[
              { text: t.rev1, name: 'Laura M.', role: lang === 'nl' ? 'Marketing Manager' : 'Marketing Manager' },
              { text: t.rev2, name: 'Thomas B.', role: lang === 'nl' ? 'Software Engineer' : 'Software Engineer' },
              { text: t.rev3, name: 'Sanne V.', role: lang === 'nl' ? 'HR Consultant' : 'HR Consultant' },
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
            <p className="section-label">{t.priceLabel}</p>
            <h2 className="section-title">{t.priceTitle}</h2>
            <p className="section-sub">{t.priceSub}</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <p className="pricing-tier">{t.planFree}</p>
              <p className="pricing-price"><sup>€</sup>0</p>
              <p className="pricing-price-sub">{t.planFreeSub}</p>
              <p className="pricing-desc">{t.planFreeDesc}</p>
              <div className="pricing-divider" />
              <ul className="pricing-features">
                {t.featFreeItems.map(i => <li key={i}><span className="pricing-check">✓</span>{i}</li>)}
              </ul>
              <Link href="/analyse" className="btn btn-ghost w-full" style={{ justifyContent: 'center' }}>{t.planCtaFree}</Link>
            </div>
            <div className="pricing-card featured">
              <div className="pricing-popular">{t.planPlusPopular}</div>
              <p className="pricing-tier">{t.planPlus}</p>
              <p className="pricing-price"><sup>€</sup>2,99</p>
              <p className="pricing-price-sub">{t.planPlusSub}</p>
              <p className="pricing-desc">{t.planPlusDesc}</p>
              <div className="pricing-divider" />
              <ul className="pricing-features">
                {t.featPlusItems.map(i => <li key={i}><span className="pricing-check">✓</span>{i}</li>)}
              </ul>
              <CheckoutButton plan="plus" label={t.planCtaPlus} highlight={true} />
            </div>
            <div className="pricing-card">
              <p className="pricing-tier">{t.planPro}</p>
              <p className="pricing-price"><sup>€</sup>9,99</p>
              <p className="pricing-price-sub">{t.planProSub}</p>
              <p className="pricing-desc">{t.planProDesc}</p>
              <div className="pricing-divider" />
              <ul className="pricing-features">
                {t.featProItems.map(i => <li key={i}><span className="pricing-check">✓</span>{i}</li>)}
              </ul>
              <CheckoutButton plan="pro" label={t.planCtaPro} highlight={false} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="section">
        <div className="container-sm">
          <div className="section-header text-center">
            <p className="section-label">{t.faqLabel}</p>
            <h2 className="section-title">{t.faqTitle}</h2>
          </div>
          {t.faq.map((f, i) => (
            <details key={i} className="faq-item">
              <summary>{f.q}<span className="faq-icon">+</span></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaSub}</p>
            <Link href="/analyse" className="btn btn-white btn-lg" style={{ display: 'inline-flex' }}>{t.ctaBtn}</Link>
            <p style={{ marginTop: 16, fontSize: 12, color: '#475569' }}>{t.ctaNote}</p>
          </div>
        </div>
      </section>
    </>
  );
}
