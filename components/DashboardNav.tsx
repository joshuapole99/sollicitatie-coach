'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { T } from '@/lib/i18n';

interface Props { email: string; initial: string; }

export default function DashboardNav({ email, initial }: Props) {
  const { lang } = useLanguage();
  const t = T[lang];

  return (
    <div className="db-bar">
      <div className="db-bar-inner">
        <Link href="/dashboard"           className="db-tab">{t.dashTabOverview}</Link>
        <Link href="/dashboard/tracker"   className="db-tab">{t.dashTabTracker}</Link>
        <Link href="/dashboard/interview" className="db-tab">{t.dashTabInterview}</Link>
        <Link href="/analyse"             className="db-tab">{t.dashTabAnalyse}</Link>
        <div className="db-user">
          <span className="sm-hide" style={{ fontSize: 12, color: '#94a3b8' }}>{email}</span>
          <div className="db-avatar">{initial}</div>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" style={{ background: 'none', border: 'none', fontSize: 12, color: '#94a3b8', cursor: 'pointer', padding: '4px 8px' }}>
              {t.dashLogout}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
