'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { T } from '@/lib/i18n';

interface Analysis { id: string; job_title: string | null; company: string | null; score: number | null; created_at: string; }
interface Application { id: string; role: string; company: string; status: string; applied_at: string | null; }
interface Props { name: string; analyses: Analysis[]; applications: Application[]; interviews: number; totalAn: number; totalAp: number; }

function scoreClass(s: number) { return s >= 75 ? 'score-hi' : s >= 50 ? 'score-mid' : 'score-lo'; }

export default function DashboardHomeClient({ name, analyses, applications, interviews, totalAn, totalAp }: Props) {
  const { lang } = useLanguage();
  const t = T[lang];

  const STATUS_LABELS: Record<string, string> = {
    applied: t.trackerStatusApplied,
    interview: t.trackerStatusInterview,
    offer: t.trackerStatusOffer,
    rejected: t.trackerStatusRejected,
  };

  const locale = lang === 'nl' ? 'nl-NL' : 'en-GB';

  return (
    <>
      <div>
        <h1 className="db-page-title">{t.dashWelcome(name)}</h1>
        <p className="db-page-sub">{t.dashSub}</p>
      </div>

      <div className="quick-actions">
        {[
          { href: '/analyse',             icon: '📊', label: t.dashActionAnalyse,   cls: 'qa-blue'   },
          { href: '/dashboard/tracker',   icon: '➕', label: t.dashActionTracker,  cls: 'qa-green'  },
          { href: '/dashboard/interview', icon: '🎯', label: t.dashActionInterview, cls: 'qa-amber'  },
          { href: '/pricing',             icon: '⚡', label: t.dashActionUpgrade,  cls: 'qa-purple' },
        ].map(a => (
          <Link key={a.href} href={a.href} className={`quick-action ${a.cls}`}>
            <span className="quick-action-icon">{a.icon}</span>
            <span className="quick-action-label">{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-num">{totalAn}</div><div className="stat-label">{t.dashStatAnalyses}</div></div>
        <div className="stat-card"><div className="stat-num">{totalAp}</div><div className="stat-label">{t.dashStatApps}</div></div>
        <div className="stat-card"><div className="stat-num">{interviews}</div><div className="stat-label">{t.dashStatInterviews}</div></div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-body">
            <div className="card-header">
              <span className="card-title">{t.dashRecentAnalyses}</span>
              <Link href="/analyse" className="card-link">{t.dashNewAnalysis}</Link>
            </div>
            {!analyses.length ? (
              <div className="empty-state">
                <p>{t.dashEmptyAnalyses}</p>
                <Link href="/analyse" className="btn btn-primary btn-sm">{t.dashFirstAnalysis}</Link>
              </div>
            ) : analyses.map(a => (
              <div key={a.id} className="list-row">
                <div className="min-w-0">
                  <p className="list-main truncate">{a.job_title || t.dashUnknownRole}</p>
                  <p className="list-sub">{a.company ? `${a.company} · ` : ''}{new Date(a.created_at).toLocaleDateString(locale)}</p>
                </div>
                <span className={scoreClass(a.score ?? 0)}>{a.score ?? 0}/100</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="card-header">
              <span className="card-title">{t.dashRecentApps}</span>
              <Link href="/dashboard/tracker" className="card-link">{t.dashViewAll}</Link>
            </div>
            {!applications.length ? (
              <div className="empty-state">
                <p>{t.dashEmptyApps}</p>
                <Link href="/dashboard/tracker" className="btn btn-primary btn-sm">{t.dashFirstApp}</Link>
              </div>
            ) : applications.map(a => (
              <div key={a.id} className="list-row">
                <div className="min-w-0">
                  <p className="list-main truncate">{a.role}</p>
                  <p className="list-sub">{a.company}</p>
                </div>
                <span className={`status-${a.status}`}>{STATUS_LABELS[a.status] || a.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
