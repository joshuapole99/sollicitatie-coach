'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { T } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

export default function Nav() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [user, setUser] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const sb = createClient();
      sb.auth.getUser().then(({ data }) => setUser(!!data.user));
      sb.auth.onAuthStateChange((_, session) => setUser(!!session));
    });
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, []);

  return (
    <header className="nav" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="nav-inner">
        <Link href="/" className="nav-logo">Sollicitatie Coach</Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link href="/analyse" className="nav-link">{t.navAnalyse}</Link>
          <Link href="/pricing"  className="nav-link">{t.navPricing}</Link>
          <Link href="/blog"     className="nav-link">{t.navBlog}</Link>
        </nav>

        <div className="nav-actions">
          <LanguageSwitcher />
          {user === null ? null : user ? (
            <Link href="/dashboard" className="btn btn-secondary btn-sm">{t.navDashboard}</Link>
          ) : (
            <>
              <Link href="/login"  className="btn btn-ghost btn-sm">{t.navLogin}</Link>
              <Link href="/signup" className="btn btn-primary btn-sm">{t.navSignup}</Link>
            </>
          )}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </div>
      </div>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link href="/analyse" onClick={() => setMenuOpen(false)}>{t.navAnalyse}</Link>
        <Link href="/pricing"  onClick={() => setMenuOpen(false)}>{t.navPricing}</Link>
        <Link href="/blog"     onClick={() => setMenuOpen(false)}>{t.navBlog}</Link>
        {user && <Link href="/dashboard" onClick={() => setMenuOpen(false)}>{t.navDashboard}</Link>}
        {!user && <>
          <Link href="/login"  onClick={() => setMenuOpen(false)}>{t.navLogin}</Link>
          <Link href="/signup" onClick={() => setMenuOpen(false)}>{t.navSignup}</Link>
        </>}
      </div>
    </header>
  );
}
