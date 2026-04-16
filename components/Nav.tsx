import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Nav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-gray-900 text-sm">
          Sollicitatie Coach
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/analyse" className="hover:text-gray-900 transition-colors">Analyseer CV</Link>
          <Link href="/pricing" className="hover:text-gray-900 transition-colors">Prijzen</Link>
          <Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-secondary text-xs px-4 py-2">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2">
                Inloggen
              </Link>
              <Link href="/signup" className="btn-primary text-xs px-4 py-2">
                Gratis starten →
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
