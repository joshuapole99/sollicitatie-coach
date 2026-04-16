'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Onjuist e-mailadres of wachtwoord. Probeer opnieuw.');
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <div className="card p-8 w-full max-w-sm">
      <h1 className="text-xl font-extrabold text-gray-900 mb-1">Inloggen</h1>
      <p className="text-sm text-gray-500 mb-6">Welkom terug. Log in op je account.</p>

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
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Inloggen...' : 'Inloggen →'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-5">
        Nog geen account?{' '}
        <Link href="/signup" className="text-primary font-semibold hover:underline">
          Maak een account aan
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
