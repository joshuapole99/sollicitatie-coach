'use client';

import { useState } from 'react';

interface QA { question: string; answer: string; tip: string; }

export default function InterviewPrepPage() {
  const [role, setRole]       = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [qas, setQAs]         = useState<QA[]>([]);
  const [error, setError]     = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  async function generate() {
    if (!role.trim()) return;
    setLoading(true);
    setError('');
    setQAs([]);

    const r = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: role.trim(), context: context.trim() }),
    });

    setLoading(false);
    if (!r.ok) {
      setError('Er is iets misgegaan. Probeer opnieuw.');
      return;
    }
    const data = await r.json();
    setQAs(data.questions || []);
  }

  function copyAll() {
    const text = qas.map((q, i) => `${i + 1}. ${q.question}\n\nAntwoord: ${q.answer}\n\nTip: ${q.tip}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">Interview Voorbereiding</h1>
        <p className="text-sm text-gray-500 mt-0.5">Genereer veelgestelde vragen voor jouw specifieke rol — inclusief sterke antwoorden.</p>
      </div>

      <div className="card p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="label">Functietitel *</label>
            <input
              className="input"
              placeholder="Bijv. Software Engineer, Marketing Manager, Data Analyst..."
              value={role}
              onChange={e => setRole(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
            />
          </div>
          <div>
            <label className="label">Extra context (optioneel)</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Bijv. 5 jaar ervaring in e-commerce, bij een scale-up, focus op technisch team..."
              value={context}
              onChange={e => setContext(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">Hoe specifieker, hoe relevanter de vragen.</p>
          </div>
          <button
            onClick={generate}
            disabled={loading || !role.trim()}
            className="btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                Vragen genereren...
              </span>
            ) : '🎯 Genereer interviewvragen'}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">{error}</div>
      )}

      {qas.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-gray-900">{qas.length} vragen voor: <span className="text-primary">{role}</span></h2>
            <button onClick={copyAll} className="btn-secondary text-xs px-3 py-1.5">
              Alles kopiëren
            </button>
          </div>

          <div className="space-y-3">
            {qas.map((qa, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="font-semibold text-sm text-gray-900">{qa.question}</span>
                  </span>
                  <span className={`text-gray-400 text-xs ml-4 flex-shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {openIdx === i && (
                  <div className="px-4 pb-4 border-t border-gray-50">
                    <div className="mt-3 space-y-3">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">Sterk antwoord</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{qa.answer}</p>
                      </div>
                      {qa.tip && (
                        <div className="bg-amber-50 rounded-xl p-3">
                          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">💡 Pro tip</p>
                          <p className="text-xs text-gray-600 leading-relaxed">{qa.tip}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
