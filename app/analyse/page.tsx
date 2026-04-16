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
  cv:  `Lisa de Vries\nMarketing Manager | lisa@email.nl\n\nWERKERVARING\nMarketing Manager — TechStartup BV (2021–heden)\n• Verhoogde organisch verkeer met 140% via SEO\n• Beheerde €200.000 advertentiebudget (Google Ads, Meta)\n• Leidde team van 4 marketeers\n\nJunior Marketeer — Retailbedrijf NV (2019–2021)\n• Social media: +8.000 volgers in 1 jaar\n\nOPLEIDING\nBachelor Marketing — Hogeschool Utrecht (2019)\n\nVAARDIGHEDEN\nGoogle Analytics, SEO, Google Ads, Meta Ads, HubSpot, Copywriting`,
  job: `Vacature: Senior Digital Marketeer — ScaleUp BV (Amsterdam)\n\nVereisten:\n• Minimaal 3 jaar digitale marketing\n• Google Ads en SEO ervaring\n• HubSpot of vergelijkbaar CRM\n\nWij bieden: €45.000–€55.000 | Hybride werken`,
};

function scoreColor(s: number) { return s >= 75 ? 'var(--green)' : s >= 50 ? 'var(--amber)' : 'var(--red)'; }
function scoreClass(s: number) { return s >= 75 ? 'score-green' : s >= 50 ? 'score-amber' : 'score-red'; }

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
      const r = await fetch('/api/analyse', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-session-id': sid.current }, body: JSON.stringify({ cv, job }) });
      const data = await r.json();
      if (r.status === 429) { setUi(p => ({ ...p, blocked: true })); setError(data.message || 'Analysislimiet bereikt.'); return; }
      if (!r.ok) throw new Error(data.error || 'Er is een fout opgetreden.');
      setResult(data);
      setUi({ tier: data.tier, canPdf: data.canPdf, coverLetter: data.coverLetter, usage: data.usage, blocked: false });
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
            <span className={`badge badge-${ui.tier}`} style={{ marginLeft: 10, verticalAlign: 'middle' }}>
              {ui.tier.toUpperCase()}
            </span>
          )}
        </h1>
        <p>Zie in 30 seconden of jij de beste kandidaat bent voor de baan.</p>
      </div>

      {/* Usage bar */}
      {!verifying && (
        <div className="usage-bar-wrap">
          {ui.tier === 'free' && (
            <div className="usage-dots">
              {Array.from({ length: ui.usage.limit }, (_, i) => (
                <div key={i} className={`usage-dot ${i < ui.usage.used ? 'used' : 'avail'}`} />
              ))}
            </div>
          )}
          <span>
            {ui.tier === 'pro'  ? 'Pro actief — 100 analyses/maand' :
             ui.tier === 'plus' ? `Plus actief — ${ui.usage.remaining} analyses over` :
             ui.usage.remaining > 0 ? `${ui.usage.remaining} van ${ui.usage.limit} analyses over` : 'Geen analyses meer'}
          </span>
          {ui.tier === 'free' && (
            <a href="/pricing" className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>Upgrade →</a>
          )}
        </div>
      )}

      {/* Example */}
      <div className="example-bar">
        <button onClick={fillExample} className="btn btn-secondary btn-sm">✨ Probeer met voorbeeldtekst</button>
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
        {loading ? <><span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .65s linear infinite' }} /> AI analyseert jouw match...</> : 'Analyseer mijn sollicitatie →'}
      </button>

      {error && (
        <p className="error-msg" style={{ marginTop: 12 }}>
          {error}
          {ui.blocked && <> <a href="/pricing" style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'underline' }}>Upgrade →</a></>}
        </p>
      )}

      {/* Results */}
      {result && (
        <div className="results-stack">
          {/* Score */}
          <div className="card score-card">
            <div className="score-ring">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="5" />
                <circle cx="40" cy="40" r="32" fill="none" stroke={scoreColor(result.score)} strokeWidth="5"
                  strokeDasharray={circ.toFixed(1)} strokeDashoffset={offset.toFixed(1)} strokeLinecap="round" />
              </svg>
              <div className={`score-num ${scoreClass(result.score)}`}>{result.score}</div>
            </div>
            <div className="score-info">
              <h3>Match score: {result.score}/100</h3>
              <p style={{ fontSize: 14 }}>{result.score_uitleg}</p>
            </div>
          </div>

          {/* Keywords */}
          <details className="card result-section" open>
            <summary className="result-summary">Keywords <span className="result-chev">▼</span></summary>
            <div className="result-body">
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Aanwezig in je CV</p>
              <div className="tags-row" style={{ marginBottom: 14 }}>
                {result.match_keywords.length ? result.match_keywords.map(k => <span key={k} className="tag-match">{k}</span>) : <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Geen gevonden</span>}
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Ontbreekt nog</p>
              <div className="tags-row">
                {result.mis_keywords.length ? result.mis_keywords.map(k => <span key={k} className="tag-miss">{k}</span>) : <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Geen</span>}
              </div>
            </div>
          </details>

          {/* Strengths */}
          <details className="card result-section" open>
            <summary className="result-summary">Sterke punten & verbeterpunten <span className="result-chev">▼</span></summary>
            <div className="result-body">
              <div className="bullet-list">
                {result.sterke_punten.map((p, i) => <div key={i} className="bullet-good">{p}</div>)}
                {result.verbeterpunten.map((p, i) => <div key={i} className="bullet-bad">{p}</div>)}
              </div>
            </div>
          </details>

          {/* Cover letter */}
          <details className="card result-section" open>
            <summary className="result-summary">
              {result.coverLetter ? 'Motivatiebrief op maat' : '🔒 Motivatiebrief — upgrade naar Plus of Pro'}
              <div className="result-actions" onClick={e => e.preventDefault()}>
                {result.coverLetter && (
                  <button onClick={copyLetter} className="btn btn-secondary btn-sm">{copied ? 'Gekopieerd!' : 'Kopieer'}</button>
                )}
                <span className="result-chev">▼</span>
              </div>
            </summary>
            <div className="result-body">
              {result.coverLetter ? (
                <pre className="cover-letter">{result.motivatiebrief}</pre>
              ) : (
                <div className="paywall">
                  <div className="paywall-blur cover-letter">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Beste mevrouw de Vries, met groot enthousiasme reageer ik op uw vacature voor de functie van Senior Digital Marketeer bij ScaleUp BV. Gezien mijn achtergrond in...</div>
                  <div className="paywall-overlay">
                    <div className="paywall-box">
                      <h3>Upgrade voor je motivatiebrief</h3>
                      <p>Beschikbaar in Plus (€2,99/mnd) en Pro.</p>
                      <a href="/pricing" className="btn btn-primary" style={{ display: 'block', justifyContent: 'center' }}>Bekijk plannen →</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </details>

          {/* CV tips */}
          <details className="card result-section" open>
            <summary className="result-summary">CV verbeterpunten <span className="result-chev">▼</span></summary>
            <div className="result-body">
              <p style={{ fontSize: 14, lineHeight: 1.7 }}>{result.cv_tips}</p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
