'use client';

import { useState, useEffect, useRef } from 'react';
import type { Metadata } from 'next';

// ─── Types ────────────────────────────────────────────────────
interface AnalysisResult {
  score: number;
  score_uitleg: string;
  sterke_punten: string[];
  verbeterpunten: string[];
  match_keywords: string[];
  mis_keywords: string[];
  motivatiebrief: string;
  cv_tips: string;
  tier: string;
  canPdf: boolean;
  coverLetter: boolean;
  usage: { used: number; remaining: number; limit: number };
}

interface UiState {
  tier: string;
  canPdf: boolean;
  coverLetter: boolean;
  usage: { used: number; remaining: number; limit: number };
  blocked: boolean;
}

const EXAMPLES = {
  cv: `Lisa de Vries\nMarketing Manager | linkedin.com/in/lisadevries | lisa@email.nl\n\nWERKERVARING\nMarketing Manager — TechStartup BV (2021–heden)\n• Verhoogde organisch websiteverkeer met 140% via SEO\n• Beheerde €200.000 advertentiebudget (Google Ads, Meta)\n• Leidde team van 4 marketeers\n\nJunior Marketeer — Retailbedrijf NV (2019–2021)\n• Social media — +8.000 volgers in 1 jaar\n\nOPLEIDING\nBachelor Marketing — Hogeschool Utrecht (2019)\n\nVAARDIGHEDEN\nGoogle Analytics, SEO, Google Ads, Meta Ads, HubSpot, Figma, Copywriting`,
  job: `Vacature: Senior Digital Marketeer — ScaleUp BV (Amsterdam)\n\nVereisten:\n• Minimaal 3 jaar digitale marketing\n• Google Ads en SEO ervaring\n• HubSpot of vergelijkbaar CRM\n\nWij bieden: €45.000–€55.000 | Hybride werken`,
};

function scoreColor(s: number) {
  return s >= 75 ? 'text-green-600' : s >= 50 ? 'text-amber-500' : 'text-red-500';
}
function scoreStroke(s: number) {
  return s >= 75 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626';
}

export default function AnalysePage() {
  const [cv, setCv]           = useState('');
  const [job, setJob]         = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<AnalysisResult | null>(null);
  const [error, setError]     = useState('');
  const [ui, setUi]           = useState<UiState>({ tier: 'free', canPdf: false, coverLetter: false, usage: { used: 0, remaining: 3, limit: 3 }, blocked: false });
  const [verifying, setVerifying] = useState(true);
  const [copied, setCopied]   = useState(false);
  const sessionRef            = useRef<string>('');

  // Restore drafts + verify session on mount
  useEffect(() => {
    let sid = localStorage.getItem('sol_session_id') || '';
    if (!sid || sid.includes('{') || sid.length < 10) {
      sid = crypto.randomUUID();
      localStorage.setItem('sol_session_id', sid);
    }
    sessionRef.current = sid;

    const savedCv  = sessionStorage.getItem('sol_cv_draft');
    const savedJob = sessionStorage.getItem('sol_job_draft');
    if (savedCv)  setCv(savedCv);
    if (savedJob) setJob(savedJob);

    (async () => {
      try {
        const r = await fetch('/api/session/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sid }),
        });
        if (r.ok) {
          const d = await r.json();
          setUi({ tier: d.tier, canPdf: d.canPdf, coverLetter: d.coverLetter, usage: d.usage, blocked: d.blocked });
        }
      } finally {
        setVerifying(false);
      }
    })();
  }, []);

  async function runAnalysis() {
    if (ui.blocked) { window.location.href = '/pricing'; return; }
    if (cv.trim().length < 30) { setError('Plak je CV in het linkerveld (minimaal 30 tekens).'); return; }
    if (job.trim().length < 30) { setError('Plak de vacaturetekst in het rechterveld.'); return; }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const r = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': sessionRef.current },
        body: JSON.stringify({ cv, job }),
      });
      const data = await r.json();
      if (r.status === 429) {
        setUi(p => ({ ...p, blocked: true }));
        setError(data.message || 'Analysislimiet bereikt. Upgrade voor meer analyses.');
        return;
      }
      if (!r.ok) throw new Error(data.error || 'Er is een fout opgetreden.');
      setResult(data);
      setUi({ tier: data.tier, canPdf: data.canPdf, coverLetter: data.coverLetter, usage: data.usage, blocked: false });
    } catch (e: any) {
      setError(e.message || 'Onverwachte fout. Probeer opnieuw.');
    } finally {
      setLoading(false);
    }
  }

  function fillExample() {
    setCv(EXAMPLES.cv);
    setJob(EXAMPLES.job);
    sessionStorage.setItem('sol_cv_draft', EXAMPLES.cv);
    sessionStorage.setItem('sol_job_draft', EXAMPLES.job);
  }

  function copyLetter() {
    if (!result?.motivatiebrief) return;
    navigator.clipboard.writeText(result.motivatiebrief).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const circ   = 2 * Math.PI * 32;
  const offset = result ? circ * (1 - result.score / 100) : circ;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          CV Analyse
          {!verifying && (
            <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full align-middle ${
              ui.tier === 'pro' ? 'badge-pro' : ui.tier === 'plus' ? 'badge-plus' : 'badge-free'
            }`}>
              {ui.tier.toUpperCase()}
            </span>
          )}
        </h1>
        <p className="text-sm text-gray-500">Zie in 30 seconden of jij de beste kandidaat bent voor de baan.</p>
      </div>

      {/* Usage bar */}
      {!verifying && (
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-5 text-xs">
          {ui.tier === 'free' && (
            <div className="flex gap-1.5">
              {Array.from({ length: ui.usage.limit }, (_, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < ui.usage.used ? 'bg-gray-900/30' : 'bg-gray-200 border border-gray-300'}`} />
              ))}
            </div>
          )}
          <span className="text-gray-500">
            {ui.tier === 'pro' ? 'Pro actief' :
             ui.tier === 'plus' ? `Plus — ${ui.usage.remaining} over` :
             ui.usage.remaining > 0 ? `${ui.usage.remaining} van ${ui.usage.limit} analyses over` : 'Geen analyses meer'}
          </span>
          {ui.tier === 'free' && (
            <a href="/pricing" className="ml-auto btn-primary text-xs px-3 py-1.5">Upgrade →</a>
          )}
        </div>
      )}

      {/* Example button */}
      <div className="text-center mb-4">
        <button onClick={fillExample} className="btn-secondary text-xs px-4 py-2">
          ✨ Probeer met voorbeeldtekst
        </button>
      </div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="label">Jouw CV</label>
          <textarea
            className="input resize-y min-h-[180px]"
            placeholder="Plak hier de tekst van je CV..."
            value={cv}
            onChange={e => { setCv(e.target.value); sessionStorage.setItem('sol_cv_draft', e.target.value); }}
          />
        </div>
        <div>
          <label className="label">Vacaturetekst</label>
          <textarea
            className="input resize-y min-h-[180px]"
            placeholder="Plak hier de volledige vacaturetekst..."
            value={job}
            onChange={e => { setJob(e.target.value); sessionStorage.setItem('sol_job_draft', e.target.value); }}
          />
        </div>
      </div>

      <button
        onClick={runAnalysis}
        disabled={loading || verifying}
        className="btn-primary w-full btn-lg mb-4"
      >
        {loading ? (
          <span className="flex items-center gap-2 justify-center">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            AI analyseert jouw match...
          </span>
        ) : 'Analyseer mijn sollicitatie →'}
      </button>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
          {error}
          {ui.blocked && (
            <a href="/pricing" className="ml-3 font-semibold underline">Upgrade →</a>
          )}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 mt-2">
          {/* Score card */}
          <div className="card p-5 flex items-center gap-5">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                <circle cx="40" cy="40" r="32" fill="none" stroke={scoreStroke(result.score)} strokeWidth="5"
                  strokeDasharray={circ.toFixed(1)} strokeDashoffset={offset.toFixed(1)} strokeLinecap="round" />
              </svg>
              <div className={`absolute inset-0 flex items-center justify-center text-xl font-extrabold ${scoreColor(result.score)}`}>
                {result.score}
              </div>
            </div>
            <div>
              <p className="font-bold text-sm mb-1">Match score: {result.score}/100</p>
              <p className="text-sm text-gray-500 leading-relaxed">{result.score_uitleg}</p>
            </div>
          </div>

          {/* Keywords */}
          <details className="card" open>
            <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-sm select-none list-none">
              Keywords <span className="text-gray-400 text-xs">▼</span>
            </summary>
            <div className="px-4 pb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Aanwezig in je CV</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {result.match_keywords.length ? result.match_keywords.map(k => (
                  <span key={k} className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">{k}</span>
                )) : <span className="text-xs text-gray-400">Geen gevonden</span>}
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Ontbreekt nog</p>
              <div className="flex flex-wrap gap-1.5">
                {result.mis_keywords.length ? result.mis_keywords.map(k => (
                  <span key={k} className="px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">{k}</span>
                )) : <span className="text-xs text-gray-400">Geen</span>}
              </div>
            </div>
          </details>

          {/* Strengths */}
          <details className="card" open>
            <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-sm select-none list-none">
              Sterke punten & verbeterpunten <span className="text-gray-400 text-xs">▼</span>
            </summary>
            <div className="px-4 pb-4 space-y-2">
              {result.sterke_punten.map((p, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 bg-green-50 border-l-2 border-green-500 rounded-r-lg text-sm text-gray-800">{p}</div>
              ))}
              {result.verbeterpunten.map((p, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 bg-red-50 border-l-2 border-red-400 rounded-r-lg text-sm text-gray-800">{p}</div>
              ))}
            </div>
          </details>

          {/* Cover letter */}
          <details className="card" open>
            <summary className="flex items-center justify-between p-4 cursor-pointer select-none list-none">
              <span className="font-bold text-sm">
                {result.coverLetter ? 'Motivatiebrief op maat' : '🔒 Motivatiebrief — upgrade naar Plus of Pro'}
              </span>
              <div className="flex items-center gap-2">
                {result.coverLetter && (
                  <button onClick={e => { e.preventDefault(); copyLetter(); }} className="btn-secondary text-xs px-3 py-1">
                    {copied ? 'Gekopieerd!' : 'Kopieer'}
                  </button>
                )}
                <span className="text-gray-400 text-xs">▼</span>
              </div>
            </summary>
            <div className="px-4 pb-4">
              {result.coverLetter ? (
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{result.motivatiebrief}</pre>
              ) : (
                <div className="relative">
                  <div className="text-sm text-gray-300 blur-sm select-none pointer-events-none leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Uw brief wordt hier weergegeven na upgrade naar Plus of Pro. Nunc dapibus purus ac velit fermentum, vel posuere nisi hendrerit.
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="card p-5 text-center shadow-md">
                      <p className="font-bold text-sm mb-1">Upgrade voor je motivatiebrief</p>
                      <p className="text-xs text-gray-400 mb-3">Beschikbaar in Plus en Pro plannen</p>
                      <a href="/pricing" className="btn-primary text-xs px-4 py-2">Bekijk plannen →</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </details>

          {/* CV tips */}
          <details className="card" open>
            <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-sm select-none list-none">
              CV verbeterpunten <span className="text-gray-400 text-xs">▼</span>
            </summary>
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-600 leading-relaxed">{result.cv_tips}</p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
