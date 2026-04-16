import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Nav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">Sollicitatie Coach</Link>

        <nav className="nav-links">
          <Link href="/analyse" className="nav-link">CV analyseren</Link>
          <Link href="/pricing" className="nav-link">Prijzen</Link>
          <Link href="/blog"    className="nav-link">Blog</Link>
        </nav>

        <div className="nav-actions">
          {user ? (
            <Link href="/dashboard" className="btn btn-secondary btn-sm">Dashboard</Link>
          ) : (
            <>
              <Link href="/login"  className="btn btn-ghost btn-sm">Inloggen</Link>
              <Link href="/signup" className="btn btn-primary btn-sm">Gratis starten →</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
