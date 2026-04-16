'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError('Wachtwoord moet minimaal 8 tekens bevatten.'); return; }
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message === 'User already registered'
        ? 'Dit e-mailadres is al in gebruik. Probeer in te loggen.'
        : 'Er is iets misgegaan. Probeer opnieuw.');
      setLoading(false);
      return;
    }

    // Link existing sessionId to new account
    const sessionId = localStorage.getItem('sol_session_id');
    if (sessionId && data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, email: data.user.email, session_id: sessionId });
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="card">
          <div className="card-body">
            <h1 style={{ fontSize: '1.4rem', marginBottom: 4 }}>Account aanmaken</h1>
            <p style={{ fontSize: 14, marginBottom: 24 }}>Gratis — geen creditcard nodig.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">E-mailadres</label>
                <input type="email" className="input" placeholder="jouw@email.nl"
                  value={email} onChange={e => setEmail(e.target.value)}
                  required autoComplete="email" />
              </div>
              <div>
                <label className="label">Wachtwoord</label>
                <input type="password" className="input" placeholder="Minimaal 8 tekens"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required autoComplete="new-password" />
              </div>
              {error && <p className="error-msg">{error}</p>}
              <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ justifyContent: 'center', marginTop: 4 }}>
                {loading ? <><span className="spinner-btn" /> Account aanmaken...</> : 'Account aanmaken →'}
              </button>
            </form>

            <p className="auth-footer mt-4">
              Al een account? <Link href="/login">Inloggen</Link>
            </p>
            <p className="auth-footer" style={{ marginTop: 8, fontSize: 11 }}>
              Door te registreren ga je akkoord met onze{' '}
              <Link href="/terms.html" style={{ color: 'var(--text-3)' }}>voorwaarden</Link> en{' '}
              <Link href="/privacy.html" style={{ color: 'var(--text-3)' }}>privacybeleid</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
