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

  useEffect(() => {
    // Check auth state client-side
    import('@/lib/supabase/client').then(({ createClient }) => {
      const sb = createClient();
      sb.auth.getUser().then(({ data }) => setUser(!!data.user));
      sb.auth.onAuthStateChange((_, session) => setUser(!!session));
    });
  }, []);

  return (
    <header className="nav">
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
        </div>
      </div>
    </header>
  );
}
