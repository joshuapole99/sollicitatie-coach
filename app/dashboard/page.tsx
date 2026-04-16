import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

const STATUS_LABELS: Record<string, string> = {
  applied: 'Gesolliciteerd',
  interview: 'Gesprek',
  offer: 'Aanbod',
  rejected: 'Afgewezen',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [analysesRes, applicationsRes] = await Promise.all([
    supabase.from('analyses').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('applications').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  const analyses = analysesRes.data || [];
  const applications = applicationsRes.data || [];

  const email = user?.email || '';
  const name = email.split('@')[0];

  // Stats
  const totalAnalyses = analyses.length;
  const totalApps = applications.length;
  const interviews = applications.filter((a: any) => a.status === 'interview' || a.status === 'offer').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Welkom terug, {name} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Hier is een overzicht van je sollicitatieactiviteiten.</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { href: '/analyse', icon: '📊', label: 'CV Analyseren', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
          { href: '/dashboard/tracker', icon: '📋', label: 'Sollicitatie toevoegen', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
          { href: '/dashboard/interview', icon: '🎯', label: 'Interview Prep', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700' },
          { href: '/pricing', icon: '⚡', label: 'Upgrade Plan', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
        ].map(a => (
          <Link
            key={a.href}
            href={a.href}
            className={`card p-4 flex flex-col items-center gap-2 text-center transition-colors cursor-pointer ${a.color}`}
          >
            <span className="text-xl">{a.icon}</span>
            <span className="text-xs font-semibold">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { n: totalAnalyses, l: 'Analyses gedaan' },
          { n: totalApps, l: 'Sollicitaties bijgehouden' },
          { n: interviews, l: 'Gesprekken/aanbiedingen' },
        ].map(s => (
          <div key={s.l} className="card p-5 text-center">
            <div className="text-2xl font-extrabold text-gray-900">{s.n}</div>
            <div className="text-xs text-gray-400 mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent analyses */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm">Recente Analyses</h2>
            <Link href="/analyse" className="text-xs text-primary hover:underline">Nieuwe analyse →</Link>
          </div>
          {analyses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 mb-3">Nog geen analyses opgeslagen.</p>
              <Link href="/analyse" className="btn-primary text-xs px-4 py-2">Start eerste analyse</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{a.job_title || 'Onbekende rol'}</p>
                    <p className="text-xs text-gray-400">{a.company || ''} · {new Date(a.created_at).toLocaleDateString('nl-NL')}</p>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <span className={`text-sm font-bold ${(a.score || 0) >= 75 ? 'text-green-600' : (a.score || 0) >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                      {a.score || 0}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent applications */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm">Recente Sollicitaties</h2>
            <Link href="/dashboard/tracker" className="text-xs text-primary hover:underline">Alles bekijken →</Link>
          </div>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 mb-3">Nog geen sollicitaties bijgehouden.</p>
              <Link href="/dashboard/tracker" className="btn-primary text-xs px-4 py-2">Eerste toevoegen</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{a.role}</p>
                    <p className="text-xs text-gray-400">{a.company}</p>
                  </div>
                  <span className={`status-${a.status} flex-shrink-0 ml-2`}>
                    {STATUS_LABELS[a.status] || a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
