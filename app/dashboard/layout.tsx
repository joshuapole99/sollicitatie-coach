import { redirect } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';

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
      <DashboardNav email={email} initial={initial} />
      <div className="db-content">{children}</div>
    </div>
  );
}
