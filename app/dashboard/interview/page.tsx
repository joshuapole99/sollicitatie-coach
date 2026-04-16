'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { T } from '@/lib/i18n';

interface QA { question: string; answer: string; tip: string; }

export default function InterviewPrepPage() {
  const { lang } = useLanguage();
  const t = T[lang];

  const [role,    setRole]    = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [qas,     setQAs]     = useState<QA[]>([]);
  const [error,   setError]   = useState('');

  async function generate() {
    if (!role.trim()) return;
    setLoading(true); setError(''); setQAs([]);
    const r = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: role.trim(), context: context.trim() }),
    });
    setLoading(false);
    if (!r.ok) { setError(t.interviewError); return; }
    const data = await r.json();
    setQAs(data.questions || []);
  }

  function copyAll() {
    const text = qas.map((q, i) => `${i + 1}. ${q.question}\n\n${t.interviewAnswerLabel}: ${q.answer}\n\n${t.interviewTipLabel}: ${q.tip}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="interview-wrap">
      <div style={{ marginBottom: 24 }}>
        <h1 className="db-page-title">{t.interviewTitle}</h1>
        <p className="db-page-sub">{t.interviewSub}</p>
      </div>

      <div className="card">
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="label">{t.interviewLabelRole}</label>
            <input className="input" placeholder={t.interviewPlaceholderRole}
              value={role} onChange={e => setRole(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()} />
          </div>
          <div>
            <label className="label">
              {t.interviewLabelContext}{' '}
              <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{t.interviewOptional}</span>
            </label>
            <textarea className="input" rows={2}
              placeholder={t.interviewPlaceholderContext}
              value={context} onChange={e => setContext(e.target.value)} />
          </div>
          <button onClick={generate} disabled={loading || !role.trim()}
            className="btn btn-primary" style={{ justifyContent: 'center' }}>
            {loading
              ? <><span className="spinner-btn" /> {t.interviewGenerating}</>
              : t.interviewGenerate}
          </button>
        </div>
      </div>

      {error && <p className="error-msg" style={{ marginTop: 12 }}>{error}</p>}

      {qas.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div className="int-header">
            <h2>{t.interviewQuestionsFor(qas.length)} <span style={{ color: '#2563eb' }}>{role}</span></h2>
            <button onClick={copyAll} className="btn btn-secondary btn-sm">{t.interviewCopyAll}</button>
          </div>
          <div className="qa-list">
            {qas.map((qa, i) => (
              <details key={i} className="qa-card">
                <summary className="qa-summary">
                  <span className="qa-num">{i + 1}</span>
                  <span className="qa-q">{qa.question}</span>
                  <span className="qa-chev">▼</span>
                </summary>
                <div className="qa-body">
                  <div className="qa-answer">
                    <p className="qa-answer-label">{t.interviewAnswerLabel}</p>
                    <p>{qa.answer}</p>
                  </div>
                  {qa.tip && (
                    <div className="qa-tip">
                      <p className="qa-tip-label">{t.interviewTipLabel}</p>
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
