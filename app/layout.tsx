import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageProvider';

export const metadata: Metadata = {
  title: 'Sollicitatie Coach — AI CV Analyse & Motivatiebrief',
  description: 'Schrijf in 30 seconden een professionele motivatiebrief op maat.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <meta name="google-site-verification" content="ryj8EEkXeSiHPluEDmeKREf6RJj9WhQjFtCgCwgOEDU" />
      </head>
      <body>
        <style>{CSS}</style>
        <LanguageProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fff;color:#0f172a;font-size:15px;line-height:1.6;min-height:100vh;display:flex;flex-direction:column}
main{flex:1}
a{color:inherit;text-decoration:none}
button{cursor:pointer;font-family:inherit}
img,svg{display:block;max-width:100%}

/* ── NAV ── */
.nav{background:rgba(255,255,255,.92);backdrop-filter:blur(16px);border-bottom:1px solid #e2e8f0;position:sticky;top:0;z-index:100}
.nav-inner{max-width:1140px;margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;gap:8px}
.nav-logo{font-size:16px;font-weight:800;color:#0f172a;letter-spacing:-.02em;margin-right:16px}
.nav-link{padding:7px 13px;font-size:14px;color:#475569;border-radius:8px;transition:all .15s;font-weight:500}
.nav-link:hover{background:#f1f5f9;color:#0f172a}
.nav-actions{margin-left:auto;display:flex;align-items:center;gap:8px}
@media(max-width:640px){.nav-link{display:none}}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:10px 20px;font-size:14px;font-weight:600;border-radius:10px;border:none;cursor:pointer;transition:all .18s;white-space:nowrap;text-decoration:none;font-family:inherit;line-height:1}
.btn:disabled{opacity:.5;cursor:not-allowed;pointer-events:none}
.btn-primary{background:linear-gradient(135deg,#2563eb,#4f46e5);color:#fff;box-shadow:0 4px 14px rgba(79,70,229,.4)}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(79,70,229,.5)}
.btn-secondary{background:#fff;color:#0f172a;border:1.5px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.07)}
.btn-secondary:hover{background:#f8fafc;border-color:#cbd5e1}
.btn-white{background:#fff;color:#1e40af;font-weight:700;box-shadow:0 2px 10px rgba(0,0,0,.15)}
.btn-white:hover{background:#f0f7ff;transform:translateY(-1px)}
.btn-ghost{background:transparent;color:#475569;border:1.5px solid #e2e8f0}
.btn-ghost:hover{background:#f8fafc;color:#0f172a}
.btn-lg{padding:14px 28px;font-size:16px;border-radius:12px}
.btn-sm{padding:7px 14px;font-size:13px;border-radius:8px}
.btn-danger{background:#fff1f2;color:#dc2626;border:1px solid #fecaca}
.btn-danger:hover{background:#fee2e2}
.spinner-btn{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite}

/* ── HERO ── */
.hero-wrap{background:linear-gradient(145deg,#0f172a 0%,#1e3a8a 50%,#312e81 100%);padding:90px 24px 80px;text-align:center;position:relative;overflow:hidden}
.hero-wrap::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(99,102,241,.25),transparent);pointer-events:none}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#c7d2fe;font-size:12px;font-weight:600;padding:6px 16px;border-radius:20px;margin-bottom:28px;backdrop-filter:blur(4px)}
.hero-badge-dot{width:7px;height:7px;background:#6ee7b7;border-radius:50%;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.hero-wrap h1{font-size:clamp(2.2rem,5vw,3.5rem);font-weight:900;line-height:1.06;letter-spacing:-.04em;color:#fff;margin-bottom:22px;max-width:680px;margin-left:auto;margin-right:auto}
.hero-wrap h1 span{background:linear-gradient(90deg,#818cf8,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-wrap p{font-size:18px;color:#94a3b8;max-width:520px;margin:0 auto 36px;line-height:1.65}
.hero-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.hero-note{margin-top:18px;font-size:12px;color:#64748b}
.hero-note span+span::before{content:' · '}
.hero-stats{display:flex;gap:48px;justify-content:center;flex-wrap:wrap;margin-top:56px;padding-top:40px;border-top:1px solid rgba(255,255,255,.08)}
.hero-stat-num{font-size:2rem;font-weight:800;color:#fff;letter-spacing:-.03em}
.hero-stat-label{font-size:12px;color:#64748b;margin-top:2px}

/* ── TRUST PILLS ── */
.trust-bar{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:28px 24px;background:#f8fafc;border-bottom:1px solid #e2e8f0}
.trust-pill{background:#fff;border:1px solid #e2e8f0;color:#475569;font-size:12px;font-weight:600;padding:6px 14px;border-radius:20px;box-shadow:0 1px 2px rgba(0,0,0,.04)}

/* ── SECTIONS ── */
.section{padding:80px 0}
.section-label{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#6366f1;margin-bottom:12px}
.section-title{font-size:clamp(1.7rem,3vw,2.4rem);font-weight:800;letter-spacing:-.03em;color:#0f172a;margin-bottom:12px}
.section-sub{font-size:16px;color:#64748b;max-width:520px;margin:0 auto}
.section-header{margin-bottom:56px}
.container{max-width:1140px;margin:0 auto;padding:0 24px}
.container-sm{max-width:720px;margin:0 auto;padding:0 24px}
.bg-gray{background:#f8fafc}
.bg-dark{background:linear-gradient(145deg,#0f172a,#1e3a8a)}

/* ── FEATURE CARDS ── */
.features-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
@media(max-width:700px){.features-grid{grid-template-columns:1fr}}
.feature-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;transition:all .2s;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.feature-card:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(0,0,0,.1);border-color:#c7d2fe}
.feature-icon-wrap{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:16px}
.icon-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe)}
.icon-indigo{background:linear-gradient(135deg,#eef2ff,#e0e7ff)}
.icon-green{background:linear-gradient(135deg,#f0fdf4,#dcfce7)}
.icon-amber{background:linear-gradient(135deg,#fffbeb,#fef3c7)}
.feature-card h3{font-size:16px;font-weight:700;color:#0f172a;margin-bottom:8px}
.feature-card p{font-size:14px;color:#64748b;line-height:1.6}

/* ── STEPS ── */
.steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
@media(max-width:700px){.steps-grid{grid-template-columns:1fr}}
.step-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;position:relative}
.step-num{width:36px;height:36px;background:linear-gradient(135deg,#2563eb,#4f46e5);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;margin-bottom:16px;box-shadow:0 4px 10px rgba(79,70,229,.35)}
.step-card h3{font-size:15px;font-weight:700;color:#0f172a;margin-bottom:8px}
.step-card p{font-size:13px;color:#64748b;line-height:1.6}

/* ── TESTIMONIALS ── */
.testimonials-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
@media(max-width:860px){.testimonials-grid{grid-template-columns:1fr}}
.testimonial-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.testimonial-stars{font-size:16px;color:#f59e0b;letter-spacing:2px;margin-bottom:14px}
.testimonial-text{font-size:14px;line-height:1.7;color:#475569;font-style:italic;margin-bottom:18px}
.testimonial-author{font-size:13px;font-weight:700;color:#0f172a}
.testimonial-role{font-size:12px;color:#94a3b8;margin-top:2px}

/* ── PRICING ── */
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:start}
@media(max-width:860px){.pricing-grid{grid-template-columns:1fr;max-width:400px;margin:0 auto}}
.pricing-card{background:#fff;border:1.5px solid #e2e8f0;border-radius:20px;padding:32px;position:relative;transition:all .2s}
.pricing-card:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(0,0,0,.09)}
.pricing-card.featured{background:linear-gradient(145deg,#1e3a8a,#312e81);border-color:transparent;box-shadow:0 16px 40px rgba(79,70,229,.35)}
.pricing-popular{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:linear-gradient(90deg,#6366f1,#8b5cf6);color:#fff;font-size:11px;font-weight:700;padding:5px 16px;border-radius:20px;white-space:nowrap;letter-spacing:.05em}
.pricing-tier{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin-bottom:10px}
.pricing-card.featured .pricing-tier{color:#a5b4fc}
.pricing-price{font-size:2.8rem;font-weight:900;letter-spacing:-.04em;color:#0f172a;margin-bottom:6px;line-height:1}
.pricing-card.featured .pricing-price{color:#fff}
.pricing-price sup{font-size:1.2rem;vertical-align:super;font-weight:700}
.pricing-price-sub{font-size:13px;color:#94a3b8;margin-bottom:12px}
.pricing-card.featured .pricing-price-sub{color:#a5b4fc}
.pricing-desc{font-size:14px;color:#64748b;margin-bottom:24px;line-height:1.5}
.pricing-card.featured .pricing-desc{color:#c7d2fe}
.pricing-divider{height:1px;background:#f1f5f9;margin-bottom:20px}
.pricing-card.featured .pricing-divider{background:rgba(255,255,255,.15)}
.pricing-features{list-style:none;display:flex;flex-direction:column;gap:11px;margin-bottom:28px}
.pricing-features li{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:#475569;line-height:1.4}
.pricing-card.featured .pricing-features li{color:#c7d2fe}
.pricing-check{color:#22c55e;font-weight:800;flex-shrink:0;font-size:14px}
.pricing-card.featured .pricing-check{color:#6ee7b7}

/* ── FAQ ── */
.faq-item{border-bottom:1px solid #e2e8f0}
.faq-item:first-child{border-top:1px solid #e2e8f0}
.faq-item summary{display:flex;justify-content:space-between;align-items:center;padding:20px 0;cursor:pointer;font-weight:600;font-size:15px;color:#0f172a;list-style:none;gap:24px}
.faq-item summary::-webkit-details-marker{display:none}
.faq-icon{width:26px;height:26px;background:#f1f5f9;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;color:#64748b;flex-shrink:0;transition:all .2s}
.faq-item[open] .faq-icon{background:#eef2ff;color:#6366f1;transform:rotate(45deg)}
.faq-item p{font-size:14px;color:#64748b;line-height:1.7;padding-bottom:20px}

/* ── CTA BANNER ── */
.cta-banner{background:linear-gradient(135deg,#0f172a,#1e3a8a,#312e81);border-radius:24px;padding:64px 40px;text-align:center;position:relative;overflow:hidden}
.cta-banner::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 100%,rgba(99,102,241,.3),transparent);pointer-events:none}
.cta-banner h2{font-size:clamp(1.8rem,3vw,2.5rem);font-weight:900;color:#fff;letter-spacing:-.03em;margin-bottom:14px}
.cta-banner p{font-size:16px;color:#94a3b8;margin-bottom:32px;max-width:450px;margin-left:auto;margin-right:auto}

/* ── FOOTER ── */
.footer{background:#0f172a;border-top:none;margin-top:auto}
.footer-inner{max-width:1140px;margin:0 auto;padding:32px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.footer-logo{font-size:15px;font-weight:800;color:#fff}
.footer-links{display:flex;gap:24px}
.footer a{font-size:13px;color:#64748b;transition:color .15s}
.footer a:hover{color:#94a3b8}

/* ── AUTH ── */
.auth-wrap{min-height:calc(100vh - 60px);display:flex;align-items:center;justify-content:center;padding:40px 20px;background:linear-gradient(145deg,#f8fafc,#eff6ff)}
.auth-card{width:100%;max-width:420px;background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:36px;box-shadow:0 8px 30px rgba(0,0,0,.08)}
.auth-card h1{font-size:1.6rem;font-weight:800;color:#0f172a;letter-spacing:-.03em;margin-bottom:6px}
.auth-subtitle{font-size:14px;color:#64748b;margin-bottom:28px}
.auth-footer{text-align:center;margin-top:24px;font-size:13px;color:#94a3b8}
.auth-footer a{color:#4f46e5;font-weight:600}

/* ── FORMS ── */
.label{display:block;font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}
.input{width:100%;padding:11px 14px;font-size:14px;font-family:inherit;color:#0f172a;background:#fff;border:1.5px solid #e2e8f0;border-radius:10px;outline:none;transition:all .15s;line-height:1.5}
.input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12)}
.input::placeholder{color:#94a3b8}
textarea.input{resize:vertical}
select.input{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:36px}
.error-msg{font-size:13px;color:#dc2626;background:#fff1f2;border:1px solid #fecaca;border-radius:10px;padding:11px 15px}

/* ── BADGES ── */
.badge-free{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0}
.badge-plus{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;background:#eef2ff;color:#4f46e5}
.badge-pro{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;background:linear-gradient(90deg,#fef3c7,#fde68a);color:#92400e}
.status-applied{background:#eff6ff;color:#2563eb;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap}
.status-interview{background:#fffbeb;color:#d97706;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap}
.status-offer{background:#f0fdf4;color:#16a34a;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap}
.status-rejected{background:#fff1f2;color:#dc2626;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap}
.tag-match{background:#f0fdf4;color:#16a34a;padding:4px 11px;border-radius:20px;font-size:12px;font-weight:600;display:inline-flex}
.tag-miss{background:#fff1f2;color:#dc2626;padding:4px 11px;border-radius:20px;font-size:12px;font-weight:600;display:inline-flex}

/* ── DASHBOARD ── */
.db-wrap{background:#f8fafc;min-height:calc(100vh - 60px)}
.db-bar{background:#fff;border-bottom:1px solid #e2e8f0}
.db-bar-inner{max-width:1140px;margin:0 auto;padding:0 24px;height:50px;display:flex;align-items:center;gap:4px}
.db-tab{padding:7px 14px;font-size:13px;font-weight:500;color:#64748b;border-radius:8px;transition:all .15s;white-space:nowrap;text-decoration:none}
.db-tab:hover{background:#f1f5f9;color:#0f172a}
.db-user{margin-left:auto;display:flex;align-items:center;gap:10px}
.db-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#4f46e5);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700}
.db-content{max-width:1140px;margin:0 auto;padding:32px 24px}
.db-page-title{font-size:1.6rem;font-weight:800;color:#0f172a;letter-spacing:-.03em;margin-bottom:4px}
.db-page-sub{font-size:14px;color:#64748b;margin-bottom:32px}
.stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px}
@media(max-width:640px){.stat-grid{grid-template-columns:1fr}}
.stat-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.stat-num{font-size:2.2rem;font-weight:900;letter-spacing:-.04em;color:#0f172a;margin-bottom:4px}
.stat-label{font-size:13px;color:#64748b}
.quick-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px}
@media(max-width:640px){.quick-actions{grid-template-columns:repeat(2,1fr)}}
.quick-action{padding:20px 16px;text-align:center;border-radius:16px;display:flex;flex-direction:column;align-items:center;gap:10px;text-decoration:none;transition:all .18s;border:1px solid transparent}
.quick-action:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.1)}
.quick-action-icon{font-size:22px}
.quick-action-label{font-size:12px;font-weight:700;color:#0f172a;line-height:1.3}
.qa-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#bfdbfe}
.qa-green{background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-color:#bbf7d0}
.qa-amber{background:linear-gradient(135deg,#fffbeb,#fef3c7);border-color:#fde68a}
.qa-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#ddd6fe}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:900px){.two-col{grid-template-columns:1fr}}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.card-body{padding:24px}
.card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.card-title{font-size:15px;font-weight:700;color:#0f172a}
.card-link{font-size:12px;color:#4f46e5;font-weight:600}
.card-link:hover{text-decoration:underline}
.list-row{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-bottom:1px solid #f1f5f9;gap:12px}
.list-row:last-child{border-bottom:none}
.list-main{font-size:14px;font-weight:600;color:#0f172a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.list-sub{font-size:12px;color:#94a3b8;margin-top:2px}
.score-hi{color:#16a34a;font-weight:800;font-size:15px}
.score-mid{color:#d97706;font-weight:800;font-size:15px}
.score-lo{color:#dc2626;font-weight:800;font-size:15px}
.empty-state{text-align:center;padding:48px 20px}
.empty-state p{font-size:14px;color:#94a3b8;margin-bottom:16px}

/* ── TRACKER ── */
.filter-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px}
.filter-btn{padding:7px 15px;font-size:13px;font-weight:500;border-radius:8px;background:#fff;border:1.5px solid #e2e8f0;color:#64748b;cursor:pointer;transition:all .15s;font-family:inherit}
.filter-btn.active{background:linear-gradient(135deg,#2563eb,#4f46e5);border-color:transparent;color:#fff;box-shadow:0 3px 10px rgba(79,70,229,.3)}
.filter-btn:hover:not(.active){background:#f8fafc}
.form-panel{background:linear-gradient(135deg,#eff6ff,#eef2ff);border:1px solid #bfdbfe;border-radius:16px;padding:24px;margin-bottom:20px}
.form-panel h3{font-size:15px;font-weight:700;color:#0f172a;margin-bottom:18px}
.form-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:14px}
@media(max-width:640px){.form-grid{grid-template-columns:1fr}}
.form-actions{display:flex;gap:8px}
.table-wrap{border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.05)}
table{width:100%;border-collapse:collapse;background:#fff;font-size:14px}
thead{background:#f8fafc}
th{text-align:left;padding:12px 18px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;white-space:nowrap}
td{padding:14px 18px;border-top:1px solid #f1f5f9;vertical-align:middle;color:#374151}
tr:hover td{background:#fafbff}
.td-company{font-weight:700;color:#0f172a}
.overflow-x{overflow-x:auto}
.action-edit{color:#4f46e5;font-size:13px;background:none;border:none;cursor:pointer;padding:3px 8px;border-radius:6px;font-family:inherit}
.action-edit:hover{background:#eef2ff}
.action-del{color:#dc2626;font-size:13px;background:none;border:none;cursor:pointer;padding:3px 8px;border-radius:6px;font-family:inherit}
.action-del:hover{background:#fff1f2}

/* ── ANALYSE TOOL ── */
.app-wrap{max-width:840px;margin:0 auto;padding:36px 24px 72px}
.app-header{text-align:center;margin-bottom:28px}
.app-header h1{font-size:1.8rem;font-weight:800;color:#0f172a;letter-spacing:-.03em;margin-bottom:8px}
.app-header p{font-size:15px;color:#64748b}
.usage-bar{display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:1px solid #e2e8f0;border-radius:12px;padding:12px 18px;margin-bottom:20px;font-size:13px;color:#64748b}
.usage-dots{display:flex;gap:6px}
.udot{width:9px;height:9px;border-radius:50%}
.udot-used{background:#cbd5e1}
.udot-free{background:#e2e8f0;border:1px solid #cbd5e1}
.example-bar{text-align:center;margin-bottom:16px}
.input-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
@media(max-width:600px){.input-grid{grid-template-columns:1fr}}
.input-grid textarea{height:200px;min-height:140px}
.analyse-btn{width:100%;padding:16px;font-size:15px;font-weight:700;background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;border:none;border-radius:12px;cursor:pointer;font-family:inherit;transition:all .18s;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:-.01em}
.analyse-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 24px rgba(30,58,138,.4)}
.analyse-btn:disabled{opacity:.45;cursor:not-allowed}
.results{margin-top:24px;display:flex;flex-direction:column;gap:14px}
.score-card{display:flex;align-items:center;gap:24px;padding:24px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.score-ring{position:relative;width:84px;height:84px;flex-shrink:0}
.score-ring svg{transform:rotate(-90deg)}
.score-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900}
.score-title{font-size:16px;font-weight:700;color:#0f172a;margin-bottom:6px}
.score-desc{font-size:14px;color:#64748b;line-height:1.6}
.result-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.result-summary{display:flex;align-items:center;justify-content:space-between;padding:15px 20px;cursor:pointer;list-style:none;font-weight:700;font-size:14px;color:#0f172a}
.result-summary::-webkit-details-marker{display:none}
.result-summary:hover{background:#fafbff}
.result-chev{font-size:10px;color:#94a3b8;transition:transform .2s}
details[open] .result-chev{transform:rotate(180deg)}
.result-body{padding:0 20px 20px}
.tags-row{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:6px}
.bullets{display:flex;flex-direction:column;gap:7px}
.bullet-good{padding:10px 14px;background:#f0fdf4;border-left:3px solid #22c55e;border-radius:0 8px 8px 0;font-size:13px;color:#0f172a}
.bullet-bad{padding:10px 14px;background:#fff1f2;border-left:3px solid #f87171;border-radius:0 8px 8px 0;font-size:13px;color:#0f172a}
.cover-txt{white-space:pre-wrap;font-size:14px;line-height:1.75;color:#374151}
.paywall{position:relative}
.paywall-blur{filter:blur(6px);user-select:none;pointer-events:none;font-size:14px;line-height:1.75;color:#64748b}
.paywall-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.paywall-box{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,.12);max-width:300px}
.paywall-box h3{font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px}
.paywall-box p{font-size:13px;color:#64748b;margin-bottom:18px}
.result-actions{display:flex;gap:8px;align-items:center}

/* ── INTERVIEW ── */
.interview-wrap{max-width:700px}
.qa-list{display:flex;flex-direction:column;gap:12px;margin-top:28px}
.qa-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden}
.qa-summary{display:flex;align-items:flex-start;gap:14px;padding:16px 18px;cursor:pointer;list-style:none}
.qa-summary::-webkit-details-marker{display:none}
.qa-summary:hover{background:#fafbff}
.qa-num{width:26px;height:26px;min-width:26px;background:linear-gradient(135deg,#2563eb,#4f46e5);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;margin-top:1px}
.qa-q{font-size:14px;font-weight:600;color:#0f172a;flex:1;line-height:1.4}
.qa-chev{font-size:10px;color:#94a3b8;flex-shrink:0;transition:transform .2s;margin-top:4px}
details[open] .qa-chev{transform:rotate(180deg)}
.qa-body{padding:0 18px 18px 58px}
.qa-answer{background:linear-gradient(135deg,#eff6ff,#eef2ff);border-radius:10px;padding:14px;margin-bottom:10px}
.qa-answer-label{font-size:10px;font-weight:800;color:#4f46e5;text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px}
.qa-answer p{font-size:13px;color:#0f172a;line-height:1.6}
.qa-tip{background:#fffbeb;border-radius:10px;padding:12px}
.qa-tip-label{font-size:10px;font-weight:800;color:#d97706;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
.qa-tip p{font-size:13px;color:#78350f;line-height:1.5}
.int-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px}
.int-header h2{font-size:16px;font-weight:700;color:#0f172a}

/* ── BLOG ── */
.blog-wrap{max-width:800px;margin:0 auto;padding:56px 24px 80px}
.blog-post-wrap{max-width:680px;margin:0 auto;padding:56px 24px 80px}
.blog-list{display:flex;flex-direction:column;gap:16px;margin-top:36px}
.blog-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;display:block;transition:all .18s;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.blog-card:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.09);border-color:#c7d2fe}
.blog-meta{font-size:12px;color:#94a3b8;margin-bottom:10px}
.blog-card h2{font-size:1.15rem;font-weight:700;color:#0f172a;margin-bottom:8px;transition:color .15s}
.blog-card:hover h2{color:#4f46e5}
.blog-card p{font-size:14px;color:#64748b;line-height:1.6}
.blog-more{font-size:13px;color:#4f46e5;font-weight:700;margin-top:12px;display:block}
.post-h2{font-size:1.35rem;font-weight:800;color:#0f172a;margin:40px 0 14px;letter-spacing:-.02em}
.post-h3{font-size:1rem;font-weight:700;color:#0f172a;margin:28px 0 10px}
.post-p{font-size:15px;line-height:1.8;color:#475569;margin-bottom:16px}
.post-ul{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:16px}
.post-ul li{display:flex;gap:12px;font-size:14px;color:#475569;line-height:1.6}
.post-ul li::before{content:'•';color:#4f46e5;font-weight:800;flex-shrink:0;margin-top:1px}

/* ── MISC ── */
.spinner{display:inline-block;width:30px;height:30px;border:2.5px solid #e2e8f0;border-top-color:#4f46e5;border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-box{text-align:center;padding:56px}
.loading-box p{margin-top:14px;font-size:14px;color:#64748b}
.w-full{width:100%}
.text-center{text-align:center}
.mt-4{margin-top:16px}
.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.min-w-0{min-width:0}
@media(max-width:640px){.sm-hide{display:none}}
`;
