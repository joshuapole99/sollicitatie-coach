'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { T } from '@/lib/i18n';

interface Result {
  score: number; score_uitleg: string;
  sterke_punten: string[]; verbeterpunten: string[];
  match_keywords: string[]; mis_keywords: string[];
  motivatiebrief: string; cv_tips: string;
  tier: string; canPdf: boolean; coverLetter: boolean;
  usage: { used: number; remaining: number; limit: number };
}

const EXAMPLES = {
  nl: {
    cv:  `Lisa de Vries\nMarketing Manager | lisa@email.nl\n\nWERKERVARING\nMarketing Manager — TechStartup BV (2021–heden)\n• Verhoogde organisch verkeer met 140% via SEO\n• Beheerde €200.000 advertentiebudget\n• Leidde team van 4 marketeers\n\nOPLEIDING\nBachelor Marketing — Hogeschool Utrecht (2019)\n\nVAARDIGHEDEN\nGoogle Analytics, SEO, Google Ads, Meta Ads, HubSpot`,
    job: `Vacature: Senior Digital Marketeer — ScaleUp BV (Amsterdam)\n\nVereisten:\n• Minimaal 3 jaar digitale marketing\n• Google Ads en SEO ervaring\n• HubSpot of vergelijkbaar CRM\n\nWij bieden: €45.000–€55.000 | Hybride werken`,
  },
  en: {
    cv:  `James Carter\nSoftware Engineer | james@email.com\n\nWORK EXPERIENCE\nSenior Software Engineer — FinTech Ltd (2021–present)\n• Built microservices handling 2M+ daily transactions\n• Reduced API response time by 60%\n\nEDUCATION\nBSc Computer Science — University of Amsterdam (2019)\n\nSKILLS\nJavaScript, TypeScript, Node.js, React, PostgreSQL, Docker, AWS`,
    job: `Job: Full Stack Engineer — GrowthApp\n\nRequirements:\n• 3+ years full stack experience\n• React and Node.js\n• PostgreSQL\n\nSalary: €55.000–€70.000 | Remote-friendly`,
  },
};

function scoreColor(s: number) { return s >= 75 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626'; }
function scoreClass(s: number) { return s >= 75 ? 'score-hi' : s >= 50 ? 'score-mid' : 'score-lo'; }

export default function AnalysePage() {
  const { lang } = useLanguage();
  const t = T[lang];
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
    if (cv.trim().length < 30) { setError(t.analyseErrCv); return; }
    if (job.trim().length < 30) { setError(t.analyseErrJob); return; }
    setError(''); setLoading(true); setResult(null);
    try {
      const r = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': sid.current },
        body: JSON.stringify({ cv, job }),
      });
      const data = await r.json();
      if (r.status === 429) { setUi(p => ({ ...p, blocked: true })); setError(data.message || t.analyseUsageNone); return; }
      if (!r.ok) throw new Error(data.error || 'Error.');
      setResult(data);
      setUi({ tier: data.tier, canPdf: data.canPdf, coverLetter: data.coverLetter, usage: data.usage, blocked: false });
      setTimeout(() => document.getElementById('results-top')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e: any) {
      setError(e.message || 'Unexpected error. Please try again.');
    } finally { setLoading(false); }
  }

  function fillExample() {
    const ex = EXAMPLES[lang];
    setCv(ex.cv); setJob(ex.job);
    sessionStorage.setItem('sol_cv_draft', ex.cv);
    sessionStorage.setItem('sol_job_draft', ex.job);
  }

  function copyLetter() {
    if (!result?.motivatiebrief) return;
    navigator.clipboard.writeText(result.motivatiebrief).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  const circ   = 2 * Math.PI * 32;
  const offset = result ? circ * (1 - result.score / 100) : circ;

  const usageText = ui.tier === 'pro'  ? t.analyseUsagePro :
                    ui.tier === 'plus' ? t.analyseUsagePlus(ui.usage.remaining) :
                    ui.usage.remaining > 0 ? t.analyseUsageFree(ui.usage.remaining, ui.usage.limit) : t.analyseUsageNone;

  return (
    <div className="app-wrap">
      <div className="app-header">
        <h1>
          {t.analyseTitle}
          {!verifying && (
            <span className={`badge-${ui.tier}`} style={{ marginLeft: 10, verticalAlign: 'middle', fontSize: 11 }}>
              {ui.tier.toUpperCase()}
            </span>
          )}
        </h1>
        <p>{t.analyseSub}</p>
      </div>

      {!verifying && (
        <div className="usage-bar">
          {ui.tier === 'free' && (
            <div className="usage-dots">
              {Array.from({ length: ui.usage.limit }, (_, i) => (
                <div key={i} className={`udot ${i < ui.usage.used ? 'udot-used' : 'udot-free'}`} />
              ))}
            </div>
          )}
          <span style={{ color: '#475569', fontSize: 13 }}>{usageText}</span>
          {ui.tier === 'free' && (
            <a href="/pricing" className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>
              {ui.blocked ? t.analyseUpgradeRequired : t.analyseUpgrade}
            </a>
          )}
        </div>
      )}

      <div className="example-bar">
        <button onClick={fillExample} className="btn btn-ghost btn-sm">{t.analyseExample}</button>
      </div>

      <div className="input-grid">
        <div>
          <label className="label">{t.analyseLabelCv}</label>
          <textarea className="input" placeholder={t.analysePlaceholderCv} value={cv}
            onChange={e => { setCv(e.target.value); sessionStorage.setItem('sol_cv_draft', e.target.value); }} />
        </div>
        <div>
          <label className="label">{t.analyseLabelJob}</label>
          <textarea className="input" placeholder={t.analysePlaceholderJob} value={job}
            onChange={e => { setJob(e.target.value); sessionStorage.setItem('sol_job_draft', e.target.value); }} />
        </div>
      </div>

      <button onClick={runAnalysis} disabled={loading || verifying} className="analyse-btn">
        {loading
          ? <><span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .65s linear infinite' }} /> {t.analyseLoading}</>
          : t.analyseBtn}
      </button>

      {error && (
        <div className="error-msg" style={{ marginTop: 14 }}>
          {error}
          {ui.blocked && <> <a href="/pricing" style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'underline' }}>{t.analyseUpgrade}</a></>}
        </div>
      )}

      {result && (
        <div id="results-top" className="results">
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
              <p className="score-title">{t.analyseScoreTitle(result.score)}</p>
              <p className="score-desc">{result.score_uitleg}</p>
            </div>
          </div>

          <details className="result-card" open>
            <summary className="result-summary">{t.analyseKeywords} <span className="result-chev">▼</span></summary>
            <div className="result-body">
              <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>{t.analysePresent}</p>
              <div className="tags-row" style={{ marginBottom: 16 }}>
                {result.match_keywords.length ? result.match_keywords.map(k => <span key={k} className="tag-match">{k}</span>) : <span style={{ fontSize: 13, color: '#94a3b8' }}>{t.analyseNoneFound}</span>}
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>{t.analyseMissing}</p>
              <div className="tags-row">
                {result.mis_keywords.length ? result.mis_keywords.map(k => <span key={k} className="tag-miss">{k}</span>) : <span style={{ fontSize: 13, color: '#94a3b8' }}>{t.analyseNone}</span>}
              </div>
            </div>
          </details>

          <details className="result-card" open>
            <summary className="result-summary">{t.analyseStrengths} <span className="result-chev">▼</span></summary>
            <div className="result-body">
              <div className="bullets">
                {result.sterke_punten.map((p, i) => <div key={i} className="bullet-good">✓ {p}</div>)}
                {result.verbeterpunten.map((p, i) => <div key={i} className="bullet-bad">↑ {p}</div>)}
              </div>
            </div>
          </details>

          <details className="result-card" open>
            <summary className="result-summary">
              {result.coverLetter ? t.analyseCoverTitle : t.analyseCoverLocked}
              <div className="result-actions" onClick={e => e.preventDefault()}>
                {result.coverLetter && (
                  <button onClick={copyLetter} className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
                    {copied ? t.analyseCopied : t.analyseCopy}
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
                  <div className="paywall-blur cover-txt">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Beste mevrouw de Vries, met groot enthousiasme reageer ik op uw vacature voor de functie van Senior Digital Marketeer bij ScaleUp BV...</div>
                  <div className="paywall-overlay">
                    <div className="paywall-box">
                      <h3>{t.analyseCoverPaywallTitle}</h3>
                      <p>{t.analyseCoverPaywallSub}</p>
                      <a href="/pricing" className="btn btn-primary" style={{ display: 'block', justifyContent: 'center' }}>{t.analyseCoverPaywallBtn}</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </details>

          <details className="result-card" open>
            <summary className="result-summary">{t.analyseCvTips} <span className="result-chev">▼</span></summary>
            <div className="result-body">
              <p style={{ fontSize: 14, lineHeight: 1.75, color: '#475569' }}>{result.cv_tips}</p>
            </div>
          </details>
        </div>
      )}

      {!result && !loading && (
        <div className="feat-preview-grid">
          {[
            { icon: '📊', title: t.analyseFeat1T, desc: t.analyseFeat1D },
            { icon: '🔑', title: t.analyseFeat2T, desc: t.analyseFeat2D },
            { icon: '✉️', title: t.analyseFeat3T, desc: t.analyseFeat3D },
          ].map(f => (
            <div key={f.title} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{f.title}</p>
              <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
