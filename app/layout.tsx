import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

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
        {/* style in body — avoids Next.js head deduplication stripping it */}
        <style>{CSS}</style>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
img,svg,video{display:block;max-width:100%}
button{cursor:pointer}
a{color:inherit;text-decoration:none}
:root{
  --font:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
  --bg:#F5F5F7;--surface:#FFFFFF;--border:#E2E2E9;--border-2:#C7C7D1;
  --text:#16161D;--text-2:#56566A;--text-3:#9898AB;
  --blue:#2563EB;--blue-dark:#1D4ED8;--blue-faint:#EEF4FF;
  --green:#16A34A;--green-faint:#F0FDF4;
  --red:#DC2626;--red-faint:#FFF1F2;
  --amber:#D97706;--amber-faint:#FFFBEB;
  --shadow-sm:0 1px 2px rgba(0,0,0,.06);
  --shadow:0 1px 4px rgba(0,0,0,.07),0 4px 12px rgba(0,0,0,.05);
  --shadow-md:0 2px 8px rgba(0,0,0,.08),0 8px 24px rgba(0,0,0,.06);
  --r-sm:8px;--r:12px;--r-lg:16px;--r-xl:20px
}
body{font-family:var(--font);background:var(--bg);color:var(--text);font-size:15px;line-height:1.65;min-height:100vh;display:flex;flex-direction:column}
main{flex:1}
h1{font-size:2.8rem;font-weight:800;line-height:1.08;letter-spacing:-.04em}
h2{font-size:2rem;font-weight:700;line-height:1.15;letter-spacing:-.03em}
h3{font-size:1.05rem;font-weight:600;line-height:1.3}
p{color:var(--text-2)}
@media(max-width:640px){h1{font-size:2.1rem}h2{font-size:1.6rem}}
.container{max-width:1100px;margin:0 auto;padding:0 24px}
.container-sm{max-width:720px;margin:0 auto;padding:0 24px}
.w-full{width:100%}
.text-center{text-align:center}
.ml-auto{margin-left:auto}
.mt-4{margin-top:16px}
.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.min-w-0{min-width:0}
@media(max-width:640px){.sm-hide{display:none}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 18px;font-size:14px;font-weight:600;font-family:var(--font);border-radius:var(--r-sm);border:1.5px solid transparent;transition:all .15s ease;white-space:nowrap;line-height:1;text-decoration:none}
.btn:disabled{opacity:.45;cursor:not-allowed;pointer-events:none}
.btn-primary{background:var(--blue);color:#fff;border-color:var(--blue);box-shadow:0 1px 2px rgba(37,99,235,.25)}
.btn-primary:hover{background:var(--blue-dark);border-color:var(--blue-dark)}
.btn-secondary{background:var(--surface);color:var(--text);border-color:var(--border-2);box-shadow:var(--shadow-sm)}
.btn-secondary:hover{background:var(--bg)}
.btn-ghost{background:transparent;color:var(--text-2);border-color:transparent}
.btn-ghost:hover{background:var(--bg);color:var(--text)}
.btn-light{background:#fff;color:var(--text);border:none}
.btn-light:hover{background:#F0F0F3}
.btn-lg{padding:13px 26px;font-size:15px;border-radius:var(--r)}
.btn-sm{padding:6px 12px;font-size:13px;border-radius:7px}
.spinner-btn{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:spin .65s linear infinite}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);box-shadow:var(--shadow-sm)}
.card-hover{transition:box-shadow .15s,transform .15s}
.card-hover:hover{box-shadow:var(--shadow);transform:translateY(-1px)}
.card-body{padding:24px}
.label{display:block;font-size:12px;font-weight:600;color:var(--text-2);letter-spacing:.03em;text-transform:uppercase;margin-bottom:6px}
.input{width:100%;padding:9px 13px;font-size:14px;font-family:var(--font);color:var(--text);background:var(--surface);border:1.5px solid var(--border-2);border-radius:var(--r-sm);outline:none;transition:border-color .15s,box-shadow .15s;line-height:1.5}
.input:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.12)}
.input::placeholder{color:var(--text-3)}
textarea.input{resize:vertical}
select.input{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239898AB' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:36px}
.error-msg{font-size:13px;color:var(--red);background:var(--red-faint);border:1px solid #fecaca;border-radius:var(--r-sm);padding:10px 14px}
.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600}
.badge-free{background:var(--bg);color:var(--text-2);border:1px solid var(--border-2)}
.badge-plus{background:var(--blue-faint);color:var(--blue)}
.badge-pro{background:var(--amber-faint);color:var(--amber)}
.status-applied{background:var(--blue-faint);color:var(--blue);padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap}
.status-interview{background:var(--amber-faint);color:var(--amber);padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap}
.status-offer{background:var(--green-faint);color:var(--green);padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap}
.status-rejected{background:var(--red-faint);color:var(--red);padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap}
.tag-match{background:var(--green-faint);color:var(--green);padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600}
.tag-miss{background:var(--red-faint);color:var(--red);padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600}
.nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.88);backdrop-filter:blur(12px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:1100px;margin:0 auto;padding:0 24px;height:56px;display:flex;align-items:center;gap:32px}
.nav-logo{font-size:15px;font-weight:700;color:var(--text)}
.nav-links{display:flex;align-items:center;gap:4px}
.nav-link{padding:6px 10px;font-size:14px;color:var(--text-2);border-radius:7px;transition:all .15s}
.nav-link:hover{background:var(--bg);color:var(--text)}
.nav-actions{margin-left:auto;display:flex;align-items:center;gap:8px}
@media(max-width:640px){.nav-links{display:none}}
.footer{border-top:1px solid var(--border);margin-top:auto}
.footer-inner{max-width:1100px;margin:0 auto;padding:28px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.footer-links{display:flex;gap:20px}
.footer a{font-size:13px;color:var(--text-3);transition:color .15s}
.footer a:hover{color:var(--text-2)}
.auth-wrap{min-height:calc(100vh - 56px);display:flex;align-items:center;justify-content:center;padding:40px 20px;background:var(--bg)}
.auth-card{width:100%;max-width:400px}
.auth-footer{text-align:center;margin-top:20px;font-size:13px;color:var(--text-3)}
.auth-footer a{color:var(--blue);font-weight:600}
.hero{padding:80px 24px 64px;text-align:center;max-width:700px;margin:0 auto}
.hero-badge{display:inline-flex;align-items:center;gap:7px;background:var(--green-faint);color:var(--green);font-size:12px;font-weight:700;padding:5px 14px;border-radius:20px;margin-bottom:24px}
.hero-badge::before{content:'';width:7px;height:7px;background:var(--green);border-radius:50%;display:inline-block}
.hero h1{margin-bottom:20px;color:var(--text)}
.hero p{font-size:17px;color:var(--text-2);max-width:520px;margin:0 auto 32px;line-height:1.65}
.hero-ctas{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.hero-note{margin-top:16px;font-size:12px;color:var(--text-3)}
.hero-note span+span::before{content:' · '}
.trust-bar{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;padding:24px}
.trust-pill{background:var(--surface);border:1px solid var(--border);font-size:12px;font-weight:500;color:var(--text-2);padding:5px 13px;border-radius:20px}
.section{padding:72px 0}
.section-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--blue);margin-bottom:10px}
.section-header{margin-bottom:40px}
.section-header h2{margin-bottom:10px}
.section-header p{font-size:16px}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
@media(max-width:700px){.steps{grid-template-columns:1fr}}
.step-card{padding:24px}
.step-num{width:32px;height:32px;background:var(--text);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;margin-bottom:14px}
.step-card h3{font-size:15px;margin-bottom:6px}
.feature-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
@media(max-width:640px){.feature-grid{grid-template-columns:1fr}}
.feature-card{display:flex;gap:18px;padding:24px;align-items:flex-start}
.feature-icon{font-size:24px;flex-shrink:0;margin-top:1px}
.testimonial-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:860px){.testimonial-grid{grid-template-columns:1fr}}
.testimonial-card{padding:24px}
.stars{color:#FBBF24;font-size:14px;letter-spacing:2px;margin-bottom:12px}
.testimonial-text{font-size:14px;line-height:1.65;color:var(--text-2);font-style:italic;margin-bottom:14px}
.testimonial-author{font-size:12px;font-weight:700;color:var(--text-3)}
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:860px){.pricing-grid{grid-template-columns:1fr;max-width:380px;margin:0 auto}}
.pricing-card{padding:28px;display:flex;flex-direction:column}
.pricing-card.featured{border-color:var(--blue);box-shadow:0 0 0 1px var(--blue),var(--shadow)}
.pricing-tier{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-3);margin-bottom:10px}
.pricing-tier.highlight{color:var(--blue)}
.pricing-price{font-size:2.2rem;font-weight:800;letter-spacing:-.03em;margin-bottom:4px;color:var(--text)}
.pricing-price sup{font-size:1rem;font-weight:600;vertical-align:super}
.pricing-price span{font-size:.85rem;font-weight:400;color:var(--text-3)}
.pricing-desc{font-size:13px;color:var(--text-2);margin-bottom:18px}
.pricing-features{list-style:none;display:flex;flex-direction:column;gap:9px;flex:1;margin-bottom:22px}
.pricing-features li{display:flex;align-items:flex-start;gap:9px;font-size:13px;color:var(--text-2)}
.pricing-features li::before{content:'✓';color:var(--green);font-weight:700;flex-shrink:0;margin-top:1px}
.faq-list{border-top:1px solid var(--border)}
.faq-item{border-bottom:1px solid var(--border)}
.faq-icon{font-size:20px;color:var(--text-3);flex-shrink:0;transition:transform .2s}
.faq-item[open] .faq-icon{transform:rotate(45deg)}
.cta-banner{background:#111118;border-radius:var(--r-xl);padding:56px 40px;text-align:center}
.cta-banner h2{color:#fff;margin-bottom:12px}
.cta-banner p{color:#8888AA;margin-bottom:28px}
.db-wrap{background:var(--bg);min-height:calc(100vh - 56px)}
.db-bar{background:var(--surface);border-bottom:1px solid var(--border)}
.db-bar-inner{max-width:1100px;margin:0 auto;padding:0 24px;height:48px;display:flex;align-items:center;gap:4px}
.db-tab{padding:6px 12px;font-size:13px;font-weight:500;color:var(--text-2);border-radius:7px;transition:all .15s;white-space:nowrap;text-decoration:none}
.db-tab:hover{background:var(--bg);color:var(--text)}
.db-user{margin-left:auto;display:flex;align-items:center;gap:10px}
.db-avatar{width:28px;height:28px;border-radius:50%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0}
.db-content{max-width:1100px;margin:0 auto;padding:32px 24px}
.db-page-header{margin-bottom:28px}
.db-page-header h1{font-size:1.5rem}
.db-page-header p{font-size:14px;margin-top:3px}
.stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
@media(max-width:640px){.stat-grid{grid-template-columns:1fr}}
.stat-card{padding:20px 22px}
.stat-num{font-size:1.9rem;font-weight:800;letter-spacing:-.03em;margin-bottom:2px;color:var(--text)}
.stat-label{font-size:12px;color:var(--text-3);font-weight:500}
.quick-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:28px}
@media(max-width:640px){.quick-actions{grid-template-columns:repeat(2,1fr)}}
.quick-action{padding:16px 14px;text-align:center;cursor:pointer;transition:all .15s;border-radius:var(--r-lg);display:flex;flex-direction:column;align-items:center;gap:8px;text-decoration:none}
.quick-action:hover{transform:translateY(-1px);box-shadow:var(--shadow)}
.quick-action-icon{font-size:20px}
.quick-action-label{font-size:12px;font-weight:600;color:var(--text);line-height:1.3}
.quick-action.blue{background:var(--blue-faint)}
.quick-action.green{background:var(--green-faint)}
.quick-action.amber{background:var(--amber-faint)}
.quick-action.purple{background:#F5F0FF}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:900px){.two-col{grid-template-columns:1fr}}
.section-header-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.section-header-row h2{font-size:1rem}
.section-header-row a{font-size:12px;color:var(--blue)}
.section-header-row a:hover{text-decoration:underline}
.list-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border);gap:12px}
.list-row:last-child{border-bottom:none}
.list-main{font-size:14px;font-weight:500;color:var(--text)}
.list-sub{font-size:12px;color:var(--text-3);margin-top:1px}
.score-green{color:var(--green)}
.score-amber{color:var(--amber)}
.score-red{color:var(--red)}
.empty-state{text-align:center;padding:40px 20px}
.empty-state p{font-size:14px;color:var(--text-3);margin-bottom:14px}
.filter-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px}
.filter-btn{padding:6px 14px;font-size:13px;font-weight:500;border-radius:7px;background:var(--surface);border:1px solid var(--border-2);color:var(--text-2);cursor:pointer;transition:all .15s;font-family:var(--font)}
.filter-btn.active{background:var(--text);border-color:var(--text);color:#fff}
.filter-btn:hover:not(.active){background:var(--bg)}
.form-panel{background:var(--blue-faint);border:1px solid #BFD4FF;border-radius:var(--r-lg);padding:22px;margin-bottom:20px}
.form-panel h3{font-size:14px;margin-bottom:16px;color:var(--text)}
.form-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:12px}
@media(max-width:640px){.form-grid{grid-template-columns:1fr}}
.form-actions{display:flex;gap:8px}
.table-wrap{border-radius:var(--r-lg);overflow:hidden;border:1px solid var(--border)}
table{width:100%;border-collapse:collapse;background:var(--surface);font-size:14px}
thead{background:var(--bg)}
th{text-align:left;padding:11px 16px;font-size:11px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}
td{padding:13px 16px;border-top:1px solid var(--border);vertical-align:middle}
tr:hover td{background:#FAFAFE}
.td-main{font-weight:500;color:var(--text)}
.overflow-x{overflow-x:auto}
.action-edit{color:var(--blue)}
.action-edit:hover{background:var(--blue-faint)}
.action-del{color:var(--red)}
.action-del:hover{background:var(--red-faint)}
.app-wrap{max-width:820px;margin:0 auto;padding:32px 24px 64px}
.app-header{text-align:center;margin-bottom:24px}
.app-header h1{font-size:1.7rem;margin-bottom:6px}
.usage-bar-wrap{display:flex;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:12px 18px;margin-bottom:18px;font-size:13px;color:var(--text-2)}
.usage-dots{display:flex;gap:5px}
.usage-dot{width:9px;height:9px;border-radius:50%}
.usage-dot.used{background:var(--text-3)}
.usage-dot.avail{background:var(--border);border:1px solid var(--border-2)}
.example-bar{text-align:center;margin-bottom:14px}
.input-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
@media(max-width:600px){.input-grid{grid-template-columns:1fr}}
.input-grid textarea{height:190px;min-height:140px}
.analyse-btn{width:100%;padding:15px;font-size:15px;font-weight:700;background:var(--text);color:#fff;border:none;border-radius:var(--r);cursor:pointer;font-family:var(--font);transition:opacity .15s;display:flex;align-items:center;justify-content:center;gap:8px}
.analyse-btn:hover:not(:disabled){opacity:.88}
.analyse-btn:disabled{opacity:.4;cursor:not-allowed}
.results-stack{margin-top:20px;display:flex;flex-direction:column;gap:12px}
.score-card{display:flex;align-items:center;gap:22px;padding:22px}
.score-ring{position:relative;width:80px;height:80px;flex-shrink:0}
.score-ring svg{transform:rotate(-90deg)}
.score-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800}
.score-info h3{font-size:15px;margin-bottom:5px}
.result-section{overflow:hidden}
.result-summary{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;cursor:pointer;list-style:none;font-weight:600;font-size:14px;color:var(--text)}
.result-summary::-webkit-details-marker{display:none}
.result-summary:hover{background:var(--bg)}
.result-chev{font-size:10px;color:var(--text-3);transition:transform .2s}
details[open] .result-chev{transform:rotate(180deg)}
.result-body{padding:0 18px 18px}
.tags-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px}
.bullet-list{display:flex;flex-direction:column;gap:6px}
.bullet-good{padding:9px 13px;background:var(--green-faint);border-left:3px solid var(--green);border-radius:0 7px 7px 0;font-size:13px;color:var(--text)}
.bullet-bad{padding:9px 13px;background:var(--red-faint);border-left:3px solid var(--red);border-radius:0 7px 7px 0;font-size:13px;color:var(--text)}
.cover-letter{white-space:pre-wrap;font-size:14px;line-height:1.7;color:var(--text)}
.paywall{position:relative}
.paywall-blur{filter:blur(5px);user-select:none;pointer-events:none;font-size:14px;line-height:1.7;color:var(--text-2)}
.paywall-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.paywall-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:22px 28px;text-align:center;box-shadow:var(--shadow-md)}
.paywall-box h3{font-size:15px;margin-bottom:4px;color:var(--text)}
.paywall-box p{font-size:13px;color:var(--text-2);margin-bottom:16px}
.result-actions{display:flex;gap:6px;align-items:center}
.interview-wrap{max-width:680px}
.qa-list{display:flex;flex-direction:column;gap:10px;margin-top:24px}
.qa-item{overflow:hidden}
.qa-summary{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;cursor:pointer;list-style:none}
.qa-summary::-webkit-details-marker{display:none}
.qa-summary:hover{background:var(--bg)}
.qa-num{width:24px;height:24px;min-width:24px;background:var(--blue-faint);color:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-top:1px}
.qa-q{font-size:14px;font-weight:600;color:var(--text);flex:1}
.qa-chev{font-size:10px;color:var(--text-3);flex-shrink:0;transition:transform .2s;margin-top:5px}
details[open] .qa-chev{transform:rotate(180deg)}
.qa-body{padding:0 16px 16px 52px}
.qa-answer{background:var(--blue-faint);border-radius:var(--r-sm);padding:14px;margin-bottom:8px}
.qa-answer-label{font-size:11px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
.qa-answer p{font-size:13px;color:var(--text)}
.qa-tip{background:var(--amber-faint);border-radius:var(--r-sm);padding:10px 14px}
.qa-tip-label{font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
.qa-tip p{font-size:13px;color:var(--text-2)}
.interview-header-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.interview-header-row h2{font-size:16px;color:var(--text)}
.blog-wrap{max-width:780px;margin:0 auto;padding:48px 24px 80px}
.blog-post-wrap{max-width:680px;margin:0 auto;padding:48px 24px 80px}
.blog-list{display:flex;flex-direction:column;gap:14px;margin-top:32px}
.blog-card{padding:24px;display:block}
.blog-meta{font-size:12px;color:var(--text-3);margin-bottom:8px}
.blog-card h2{font-size:1.1rem;margin-bottom:6px;transition:color .15s;color:var(--text)}
.blog-card:hover h2{color:var(--blue)}
.blog-card p{font-size:14px}
.blog-more{font-size:13px;color:var(--blue);font-weight:600;margin-top:10px;display:block}
.post-h2{font-size:1.3rem;font-weight:700;margin:36px 0 12px;color:var(--text)}
.post-h3{font-size:1rem;font-weight:600;margin:24px 0 8px;color:var(--text)}
.post-p{font-size:15px;line-height:1.75;color:var(--text-2);margin-bottom:14px}
.post-ul{list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:14px}
.post-ul li{display:flex;gap:10px;font-size:14px;color:var(--text-2)}
.post-ul li::before{content:'•';color:var(--blue);font-weight:700;flex-shrink:0}
.spinner{display:inline-block;width:28px;height:28px;border:2.5px solid var(--border);border-top-color:var(--text);border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-box{text-align:center;padding:48px}
.loading-box p{margin-top:14px;font-size:14px;color:var(--text-2)}
`;
