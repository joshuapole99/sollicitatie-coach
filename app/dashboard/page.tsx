import Link from 'next/link';

const STATUS_LABELS: Record<string, string> = {
  applied: 'Gesolliciteerd', interview: 'Gesprek',
  offer: 'Aanbod', rejected: 'Afgewezen',
};

export default async function DashboardPage() {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: analyses }, { data: applications }] = await Promise.all([
    supabase.from('analyses').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('applications').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  const name       = user?.email?.split('@')[0] || 'daar';
  const totalAn    = analyses?.length ?? 0;
  const totalAp    = applications?.length ?? 0;
  const interviews = (applications ?? []).filter((a: any) => ['interview','offer'].includes(a.status)).length;

  function scoreClass(s: number) {
    return s >= 75 ? 'score-green' : s >= 50 ? 'score-amber' : 'score-red';
  }

  return (
    <>
      <div className="db-page-header">
        <h1>Welkom terug, {name} 👋</h1>
        <p>Overzicht van je sollicitatieactiviteiten.</p>
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        {[
          { href: '/analyse',             icon: '📊', label: 'CV analyseren',           cls: 'blue'   },
          { href: '/dashboard/tracker',   icon: '➕', label: 'Sollicitatie toevoegen',   cls: 'green'  },
          { href: '/dashboard/interview', icon: '🎯', label: 'Interview voorbereiding', cls: 'amber'  },
          { href: '/pricing',             icon: '⚡', label: 'Upgrade plan',             cls: 'purple' },
        ].map(a => (
          <Link key={a.href} href={a.href} className={`quick-action ${a.cls}`}>
            <span className="quick-action-icon">{a.icon}</span>
            <span className="quick-action-label">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="card stat-card">
          <div className="stat-num">{totalAn}</div>
          <div className="stat-label">Analyses gedaan</div>
        </div>
        <div className="card stat-card">
          <div className="stat-num">{totalAp}</div>
          <div className="stat-label">Sollicitaties bijgehouden</div>
        </div>
        <div className="card stat-card">
          <div className="stat-num">{interviews}</div>
          <div className="stat-label">Gesprekken / aanbiedingen</div>
        </div>
      </div>

      {/* Recent content */}
      <div className="two-col">
        {/* Analyses */}
        <div className="card">
          <div className="card-body">
            <div className="section-header-row">
              <h2>Recente analyses</h2>
              <Link href="/analyse">Nieuwe analyse →</Link>
            </div>
            {!analyses?.length ? (
              <div className="empty-state">
                <p>Nog geen analyses opgeslagen.</p>
                <Link href="/analyse" className="btn btn-primary btn-sm">Start eerste analyse</Link>
              </div>
            ) : (analyses as any[]).map((a: any) => (
              <div key={a.id} className="list-row">
                <div className="min-w-0">
                  <p className="list-main truncate">{a.job_title || 'Onbekende rol'}</p>
                  <p className="list-sub">{a.company || ''}{a.company ? ' · ' : ''}{new Date(a.created_at).toLocaleDateString('nl-NL')}</p>
                </div>
                <span className={`list-score ${scoreClass(a.score ?? 0)}`}>{a.score ?? 0}/100</span>
              </div>
            ))}
          </div>
        </div>

        {/* Applications */}
        <div className="card">
          <div className="card-body">
            <div className="section-header-row">
              <h2>Recente sollicitaties</h2>
              <Link href="/dashboard/tracker">Alles bekijken →</Link>
            </div>
            {!applications?.length ? (
              <div className="empty-state">
                <p>Nog geen sollicitaties bijgehouden.</p>
                <Link href="/dashboard/tracker" className="btn btn-primary btn-sm">Eerste toevoegen</Link>
              </div>
            ) : (applications as any[]).map((a: any) => (
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
