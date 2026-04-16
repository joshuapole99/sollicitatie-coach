'use client';

import { useState, useEffect, useRef } from 'react';

interface Result {
  score: number; score_uitleg: string;
  sterke_punten: string[]; verbeterpunten: string[];
  match_keywords: string[]; mis_keywords: string[];
  motivatiebrief: string; cv_tips: string;
  tier: string; canPdf: boolean; coverLetter: boolean;
  usage: { used: number; remaining: number; limit: number };
}

const EXAMPLES = {
  cv:  `Lisa de Vries\nMarketing Manager | lisa@email.nl\n\nWERKERVARING\nMarketing Manager — TechStartup BV (2021–heden)\n• Verhoogde organisch verkeer met 140% via SEO\n• Beheerde €200.000 advertentiebudget\n• Leidde team van 4 marketeers\n\nJunior Marketeer — Retailbedrijf NV (2019–2021)\n• Social media: +8.000 volgers in 1 jaar\n\nOPLEIDING\nBachelor Marketing — Hogeschool Utrecht (2019)\n\nVAARDIGHEDEN\nGoogle Analytics, SEO, Google Ads, Meta Ads, HubSpot, Copywriting`,
  job: `Vacature: Senior Digital Marketeer — ScaleUp BV (Amsterdam)\n\nVereisten:\n• Minimaal 3 jaar digitale marketing\n• Google Ads en SEO ervaring\n• HubSpot of vergelijkbaar CRM\n\nWij bieden: €45.000–€55.000 | Hybride werken`,
};

function scoreColor(s: number) { return s >= 75 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626'; }
function scoreClass(s: number) { return s >= 75 ? 'score-hi' : s >= 50 ? 'score-mid' : 'score-lo'; }

export default function AnalysePage() {
  const [cv,       setCv]       = useState('');
  const [job,      setJob]      = useState('');
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<Result | null>(null);
  const [error,    setError]    = useState('');
  const [ui,       setUi]       = useState({ tier: 'free', canPdf: false, coverLetter: false, usage: { used: 0, remaining: 3, limit: 3 }, blocked: false });
  const [verifying,setVerifying]= useState(true);
  const [copied,   setCopied]   = useState(false);
  const sid = useRef('');

  useEffect(() => {
    let s = localStorage.getItem('sol_session_id') || '';
    if (!s || s.includes('{') || s.length < 10) { s = crypto.randomUUID(); localStorage.setItem('sol_session_id', s); }
    sid.current = s;
    const c = sessionStorage.getItem('sol_cv_draft');
    const j = sessionStorage.getItem('sol_job_draft');
    if (c) setCv(c); if (j) setJob(j);
    fetch('/api/session/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: s }) })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setUi({ tier: d.tier, canPdf: d.canPdf, coverLetter: d.coverLetter, usage: d.usage, blocked: d.blocked }); })
      .finally(() => setVerifying(false));
  }, []);

  async function runAnalysis() {
    if (ui.blocked) { window.location.href = '/pricing'; return; }
    if (cv.trim().length < 30) { setError('Plak je CV in het linkerveld.'); return; }
    if (job.trim().length < 30) { setError('Plak de vacaturetekst in het rechterveld.'); return; }
    setError(''); setLoading(true); setResult(null);
    try {
      const r = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': sid.current },
        body: JSON.stringify({ cv, job }),
      });
      const data = await r.json();
      if (r.status === 429) { setUi(p => ({ ...p, blocked: true })); setError(data.message || 'Analysislimiet bereikt.'); return; }
      if (!r.ok) throw new Error(data.error || 'Er is een fout opgetreden.');
      setResult(data);
      setUi({ tier: data.tier, canPdf: data.canPdf, coverLetter: data.coverLetter, usage: data.usage, blocked: false });
      setTimeout(() => document.getElementById('results-top')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e: any) {
      setError(e.message || 'Onverwachte fout. Probeer opnieuw.');
    } finally { setLoading(false); }
  }

  function fillExample() {
    setCv(EXAMPLES.cv); setJob(EXAMPLES.job);
    sessionStorage.setItem('sol_cv_draft', EXAMPLES.cv);
    sessionStorage.setItem('sol_job_draft', EXAMPLES.job);
  }

  function copyLetter() {
    if (!result?.motivatiebrief) return;
    navigator.clipboard.writeText(result.motivatiebrief).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  const circ   = 2 * Math.PI * 32;
  const offset = result ? circ * (1 - result.score / 100) : circ;

  return (
    <div className="app-wrap">
      {/* Header */}
      <div className="app-header">
        <h1>
          CV Analyse
          {!verifying && (
            <span className={`badge-${ui.tier}`} style={{ marginLeft: 10, verticalAlign: 'middle', fontSize: 11 }}>
              {ui.tier.toUpperCase()}
            </span>
          )}
        </h1>
        <p>Zie in 30 seconden hoe goed je aansluit op de vacature.</p>
      </div>

      {/* Usage bar */}
      {!verifying && (
        <div className="usage-bar">
          {ui.tier === 'free' && (
            <div className="usage-dots">
              {Array.from({ length: ui.usage.limit }, (_, i) => (
                <div key={i} className={`udot ${i < ui.usage.used ? 'udot-used' : 'udot-free'}`} />
              ))}
            </div>
          )}
          <span style={{ color: '#475569', fontSize: 13 }}>
            {ui.tier === 'pro'  ? '✓ Pro actief — 100 analyses/maand' :
             ui.tier === 'plus' ? `✓ Plus actief — ${ui.usage.remaining} over deze maand` :
             ui.usage.remaining > 0 ? `${ui.usage.remaining} van ${ui.usage.limit} gratis analyses resterend` : 'Geen gratis analyses meer'}
          </span>
          {ui.tier === 'free' && (
            <a href="/pricing" className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>
              {ui.blocked ? 'Upgrade vereist →' : 'Upgrade →'}
            </a>
          )}
        </div>
      )}

      {/* Example button */}
      <div className="example-bar">
        <button onClick={fillExample} className="btn btn-ghost btn-sm">
          ✨ Probeer met voorbeeldtekst
        </button>
      </div>

      {/* Inputs */}
      <div className="input-grid">
        <div>
          <label className="label">Jouw CV</label>
          <textarea className="input" placeholder="Plak hier de tekst van je CV..." value={cv}
            onChange={e => { setCv(e.target.value); sessionStorage.setItem('sol_cv_draft', e.target.value); }} />
        </div>
        <div>
          <label className="label">Vacaturetekst</label>
          <textarea className="input" placeholder="Plak hier de volledige vacaturetekst..." value={job}
            onChange={e => { setJob(e.target.value); sessionStorage.setItem('sol_job_draft', e.target.value); }} />
        </div>
      </div>

      <button onClick={runAnalysis} disabled={loading || verifying} className="analyse-btn">
        {loading
          ? <><span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .65s linear infinite' }} /> AI analyseert je match...</>
          : 'Analyseer mijn sollicitatie →'}
      </button>

      {error && (
        <div className="error-msg" style={{ marginTop: 14 }}>
          {error}
          {ui.blocked && <> <a href="/pricing" style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'underline' }}>Upgrade →</a></>}
        </div>
      )}

      {/* Results */}
      {result && (
        <div id="results-top" className="results">
          {/* Score */}
          <div className="score-card">
            <div className="score-ring">
              <svg width="84" height="84" viewBox="0 0 84 84">
                <circle cx="42" cy="42" r="32" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                <circle cx="42" cy="42" r="32" fill="none" stroke={scoreColor(result.score)} strokeWidth="6"
                  strokeDasharray={circ.toFixed(1)} strokeDashoffset={offset.toFixed(1)} strokeLinecap="round" />
              </svg>
              <div className={`score-num ${scoreClass(result.score)}`}>{result.score}</div>
            </div>
            <div>
              <p className="score-title">Match score: {result.score}/100</p>
              <p className="score-desc">{result.score_uitleg}</p>
            </div>
          </div>

          {/* Keywords */}
          <details className="result-card" open>
            <summary className="result-summary">🔑 Keywords <span className="result-chev">▼</span></summary>
            <div className="result-body">
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Aanwezig in je CV</p>
              <div className="tags-row" style={{ marginBottom: 16 }}>
                {result.match_keywords.length ? result.match_keywords.map(k => <span key={k} className="tag-match">{k}</span>) : <span style={{ fontSize: 13, color: '#94a3b8' }}>Geen gevonden</span>}
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Ontbreekt in je CV</p>
              <div className="tags-row">
                {result.mis_keywords.length ? result.mis_keywords.map(k => <span key={k} className="tag-miss">{k}</span>) : <span style={{ fontSize: 13, color: '#94a3b8' }}>Geen</span>}
              </div>
            </div>
          </details>

          {/* Strengths */}
          <details className="result-card" open>
            <summary className="result-summary">💪 Sterke punten & verbeterpunten <span className="result-chev">▼</span></summary>
            <div className="result-body">
              <div className="bullets">
                {result.sterke_punten.map((p, i) => <div key={i} className="bullet-good">✓ {p}</div>)}
                {result.verbeterpunten.map((p, i) => <div key={i} className="bullet-bad">↑ {p}</div>)}
              </div>
            </div>
          </details>

          {/* Cover letter */}
          <details className="result-card" open>
            <summary className="result-summary">
              {result.coverLetter ? '✉️ Motivatiebrief op maat' : '🔒 Motivatiebrief — upgrade naar Plus of Pro'}
              <div className="result-actions" onClick={e => e.preventDefault()}>
                {result.coverLetter && (
                  <button onClick={copyLetter} className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
                    {copied ? '✓ Gekopieerd' : 'Kopieer'}
                  </button>
                )}
                <span className="result-chev">▼</span>
              </div>
            </summary>
            <div className="result-body">
              {result.coverLetter ? (
                <pre className="cover-txt">{result.motivatiebrief}</pre>
              ) : (
                <div className="paywall">
                  <div className="paywall-blur cover-txt">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Beste mevrouw de Vries, met groot enthousiasme reageer ik op uw vacature voor de functie van Senior Digital Marketeer bij ScaleUp BV. Gezien mijn achtergrond in digitale marketing en mijn bewezen resultaten...</div>
                  <div className="paywall-overlay">
                    <div className="paywall-box">
                      <h3>Motivatiebrief inbegrepen bij Plus</h3>
                      <p>Upgrade voor €2,99/mnd en ontvang een volledige motivatiebrief bij elke analyse.</p>
                      <a href="/pricing" className="btn btn-primary" style={{ display: 'block', justifyContent: 'center' }}>Bekijk plannen →</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </details>

          {/* CV tips */}
          <details className="result-card" open>
            <summary className="result-summary">📝 CV verbeterpunten <span className="result-chev">▼</span></summary>
            <div className="result-body">
              <p style={{ fontSize: 14, lineHeight: 1.75, color: '#475569' }}>{result.cv_tips}</p>
            </div>
          </details>
        </div>
      )}

      {/* Empty state — show features when no result yet */}
      {!result && !loading && (
        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { icon: '📊', t: 'Match score', d: 'Hoe goed sluit je CV aan op de vacature — score van 0–100.' },
            { icon: '🔑', t: 'Keyword analyse', d: 'Welke termen ontbreken in je CV die de vacature vereist.' },
            { icon: '✉️', t: 'Motivatiebrief', d: 'Een volledige, gepersonaliseerde motivatiebrief in seconden.' },
          ].map(f => (
            <div key={f.t} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{f.t}</p>
              <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{f.d}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
