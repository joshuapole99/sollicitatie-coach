'use client';

import { useState } from 'react';

interface QA { question: string; answer: string; tip: string; }

export default function InterviewPrepPage() {
  const [role,    setRole]    = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [qas,     setQAs]     = useState<QA[]>([]);
  const [error,   setError]   = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  async function generate() {
    if (!role.trim()) return;
    setLoading(true); setError(''); setQAs([]);
    const r = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: role.trim(), context: context.trim() }),
    });
    setLoading(false);
    if (!r.ok) { setError('Er is iets misgegaan. Probeer opnieuw.'); return; }
    const data = await r.json();
    setQAs(data.questions || []);
  }

  function copyAll() {
    const text = qas.map((q, i) => `${i + 1}. ${q.question}\n\nAntwoord: ${q.answer}\n\nTip: ${q.tip}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="interview-wrap">
      <div className="db-page-header">
        <h1>Interview Voorbereiding</h1>
        <p>Genereer veelgestelde vragen voor jouw rol — inclusief sterke antwoorden.</p>
      </div>

      <div className="card">
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="label">Functietitel *</label>
            <input className="input" placeholder="bijv. Software Engineer, Marketing Manager, Data Analyst..."
              value={role} onChange={e => setRole(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()} />
          </div>
          <div>
            <label className="label">Extra context <span style={{ color: 'var(--text-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optioneel)</span></label>
            <textarea className="input" rows={2}
              placeholder="bijv. 5 jaar ervaring, bij een scale-up, technisch team, focus op B2B..."
              value={context} onChange={e => setContext(e.target.value)} />
          </div>
          <button onClick={generate} disabled={loading || !role.trim()}
            className="btn btn-primary" style={{ justifyContent: 'center' }}>
            {loading
              ? <><span className="spinner-btn" /> Vragen genereren...</>
              : '🎯  Genereer interviewvragen'}
          </button>
        </div>
      </div>

      {error && <p className="error-msg" style={{ marginTop: 12 }}>{error}</p>}

      {qas.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div className="interview-header-row">
            <h2>{qas.length} vragen voor: <span style={{ color: 'var(--blue)' }}>{role}</span></h2>
            <button onClick={copyAll} className="btn btn-secondary btn-sm">Alles kopiëren</button>
          </div>
          <div className="qa-list">
            {qas.map((qa, i) => (
              <details key={i} className="card qa-item">
                <summary className="qa-summary">
                  <span className="qa-num">{i + 1}</span>
                  <span className="qa-q">{qa.question}</span>
                  <span className="qa-chev">▼</span>
                </summary>
                <div className="qa-body">
                  <div className="qa-answer">
                    <p className="qa-answer-label">Sterk antwoord</p>
                    <p>{qa.answer}</p>
                  </div>
                  {qa.tip && (
                    <div className="qa-tip">
                      <p className="qa-tip-label">💡 Pro tip</p>
                      <p>{qa.tip}</p>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
