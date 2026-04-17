'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { T } from '@/lib/i18n';

export default function Footer() {
  const { lang } = useLanguage();
  const t = T[lang];

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">Sollicitatie Coach</span>
        <div className="footer-links">
          <Link href="/blog">Blog</Link>
          <Link href="/pricing">{t.navPricing}</Link>
          <Link href="/privacy">{t.footerPrivacy}</Link>
          <Link href="/terms">{t.footerTerms}</Link>
        </div>
        <span style={{ fontSize: 13, color: '#475569' }}>© 2026</span>
      </div>
    </footer>
  );
}
