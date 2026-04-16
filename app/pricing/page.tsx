'use client';

import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import { useLanguage } from '@/components/LanguageProvider';
import { T } from '@/lib/i18n';

export default function PricingPage() {
  const { lang } = useLanguage();
  const t = T[lang];

  return (
    <div style={{ padding: '56px 0 80px' }}>
      <div className="container-sm">
        <div className="section-header text-center">
          <p className="section-label">{t.priceLabel}</p>
          <h1 style={{ fontSize: '2.2rem', marginBottom: 10 }}>{t.pricingTitle}</h1>
          <p>{t.priceSub}</p>
        </div>

        <div className="pricing-grid" style={{ marginTop: 40 }}>
          {/* Free */}
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

          {/* Plus */}
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

          {/* Pro */}
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

        {/* FAQ */}
        <div style={{ marginTop: 64 }}>
          <h2 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: 28 }}>{t.pricingFaqTitle}</h2>
          {t.pricingFaq.map((f, i) => (
            <details key={i} className="faq-item">
              <summary>{f.q}<span className="faq-icon">+</span></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
