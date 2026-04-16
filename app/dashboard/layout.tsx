import { redirect } from 'next/navigation';
import Link from 'next/link';

async function getUser() {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect('/login');

  const email   = user.email || '';
  const initial = email[0]?.toUpperCase() || '?';

  return (
    <div className="db-wrap">
      <div className="db-bar">
        <div className="db-bar-inner">
          <Link href="/dashboard"           className="db-tab">Overzicht</Link>
          <Link href="/dashboard/tracker"   className="db-tab">Tracker</Link>
          <Link href="/dashboard/interview" className="db-tab">Interview Prep</Link>
          <Link href="/analyse"             className="db-tab">CV analyseren</Link>
          <div className="db-user">
            <span className="sm-hide" style={{ fontSize: 12, color: 'var(--text-3)' }}>{email}</span>
            <div className="db-avatar">{initial}</div>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--text-3)', cursor: 'pointer', padding: '4px 8px' }}>
                Uitloggen
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="db-content">{children}</div>
    </div>
  );
}
