import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function SignOutButton() {
  return (
    <form action="/api/auth/signout" method="POST">
      <button type="submit" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
        Uitloggen
      </button>
    </form>
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const email = user.email || '';
  const initial = email[0]?.toUpperCase() || '?';

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50">
      {/* Dashboard top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <nav className="flex items-center gap-1">
            {[
              { href: '/dashboard', label: 'Overzicht' },
              { href: '/dashboard/tracker', label: 'Tracker' },
              { href: '/dashboard/interview', label: 'Interview Prep' },
              { href: '/analyse', label: 'Analyseer CV' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">{email}</span>
            <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
              {initial}
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </div>
    </div>
  );
}
