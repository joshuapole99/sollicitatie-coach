import DashboardHomeClient from '@/components/DashboardHomeClient';

export default async function DashboardPage() {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: analyses }, { data: applications }] = await Promise.all([
    supabase.from('analyses').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('applications').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  const name       = user?.email?.split('@')[0] || 'there';
  const totalAn    = analyses?.length ?? 0;
  const totalAp    = applications?.length ?? 0;
  const interviews = (applications ?? []).filter((a: any) => ['interview','offer'].includes(a.status)).length;

  return (
    <DashboardHomeClient
      name={name}
      analyses={(analyses ?? []) as any[]}
      applications={(applications ?? []) as any[]}
      interviews={interviews}
      totalAn={totalAn}
      totalAp={totalAp}
    />
  );
}
