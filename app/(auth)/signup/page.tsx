'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens bevatten.');
      return;
    }
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message === 'User already registered'
        ? 'Dit e-mailadres is al in gebruik. Log in of gebruik een ander e-mailadres.'
        : 'Er is iets misgegaan. Probeer opnieuw.');
      setLoading(false);
      return;
    }

    // Save session_id from localStorage to link future payments
    const sessionId = localStorage.getItem('sol_session_id');
    if (sessionId) {
      const supabase2 = createClient();
      const { data: { user } } = await supabase2.auth.getUser();
      if (user) {
        await supabase2.from('profiles').upsert({
          id: user.id,
          email: user.email,
          session_id: sessionId,
        });
      }
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="card p-8 w-full max-w-sm">
      <h1 className="text-xl font-extrabold text-gray-900 mb-1">Account aanmaken</h1>
      <p className="text-sm text-gray-500 mb-6">Gratis — geen creditcard nodig.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">E-mailadres</label>
          <input
            type="email"
            className="input"
            placeholder="jouw@email.nl"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="label">Wachtwoord</label>
          <input
            type="password"
            className="input"
            placeholder="Minimaal 8 tekens"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Account aanmaken...' : 'Maak account aan →'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-5">
        Al een account?{' '}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Inloggen
        </Link>
      </p>

      <p className="text-center text-xs text-gray-400 mt-3">
        Door te registreren ga je akkoord met onze{' '}
        <Link href="/terms.html" className="underline">voorwaarden</Link>
        {' '}en{' '}
        <Link href="/privacy.html" className="underline">privacybeleid</Link>.
      </p>
    </div>
  );
}
