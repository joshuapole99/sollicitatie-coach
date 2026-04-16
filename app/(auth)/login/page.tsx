'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const next         = searchParams.get('next') || '/dashboard';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Onjuist e-mailadres of wachtwoord.');
      setLoading(false);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="card">
          <div className="card-body">
            <h1 style={{ fontSize: '1.4rem', marginBottom: 4 }}>Inloggen</h1>
            <p style={{ fontSize: 14, marginBottom: 24 }}>Welkom terug.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">E-mailadres</label>
                <input type="email" className="input" placeholder="jouw@email.nl"
                  value={email} onChange={e => setEmail(e.target.value)}
                  required autoComplete="email" />
              </div>
              <div>
                <label className="label">Wachtwoord</label>
                <input type="password" className="input" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required autoComplete="current-password" />
              </div>
              {error && <p className="error-msg">{error}</p>}
              <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ justifyContent: 'center', marginTop: 4 }}>
                {loading ? <><span className="spinner-btn" /> Inloggen...</> : 'Inloggen →'}
              </button>
            </form>

            <p className="auth-footer mt-4">
              Nog geen account?{' '}
              <Link href="/signup">Maak een account aan</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
