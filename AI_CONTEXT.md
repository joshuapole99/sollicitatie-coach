# AI Context — Sollicitatie Coach

This file gives AI assistants (Claude, Copilot, etc.) a quick map of the project so they can help without reading every file first.

---

## What this project is

**Sollicitatie Coach** (`sollicitatie-coach.vercel.app`) is a Dutch AI job-application coach SaaS. Users paste their CV and a job posting; the AI returns a match score, keyword analysis, strengths/weaknesses, CV tips, and an optional tailored cover letter. No account required. Payment via LemonSqueezy.

---

## Tech stack

| Layer | Technology |
|---|---|
| Hosting | Vercel (static + serverless functions) |
| Frontend | Vanilla HTML/CSS/JS — no framework, no build step |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Payments | LemonSqueezy (subscriptions) |
| Storage | Upstash KV (REST API) — tier + usage tracking |
| PDF | jsPDF (CDN) |
| Analytics | Vercel Analytics |

---

## File map

```
/
├── index.html          # Landing page (hero, pricing, FAQ, reviews)
├── app.html            # Main app (textarea inputs, analysis results)
├── privacy.html        # Privacy policy
├── terms.html          # Terms of service
├── package.json        # Minimal — only declares Node version for Vercel
├── vercel.json         # Vercel config (currently empty {})
│
└── api/
    ├── analyse.js          # POST /api/analyse — main AI endpoint
    ├── review.js           # POST /api/review — submit star rating + text
    ├── checkout.js         # GET  /api/checkout — redirect to LemonSqueezy checkout
    ├── _tier.js            # Shared: resolve tier from KV (import everywhere)
    ├── _usage.js           # Shared: atomic usage tracking via KV
    ├── session/
    │   └── verify.js       # POST /api/session/verify — check tier + usage for session
    └── webhook/
        └── lemonsqueezy.js # POST /api/webhook/lemonsqueezy — write tier to KV on payment
```

---

## Business logic (critical — never change without understanding this)

### Tier system
- `free` → 3 lifetime analyses, no cover letter, no PDF
- `plus` (€2,99/mo) → 10 analyses/month, cover letter, no PDF
- `pro`  (€9,99/mo) → 100 analyses/month, cover letter + PDF

### How tier is determined (server-side, always)
1. Frontend generates a UUID `sessionId` and stores it in `localStorage` under key `sol_session_id`
2. `sessionId` is sent with every API request as the `x-session-id` header
3. `_tier.js` reads `tier:{sessionId}` from Upstash KV → returns `'plus'`, `'pro'`, or `null` (→ free)
4. When a payment completes, the LemonSqueezy webhook writes `tier:{sessionId} = 'plus'|'pro'` to KV
5. **Frontend has zero business logic** — it only renders what the server tells it

### Usage tracking
- Keys in KV: `usage:lifetime:{sessionId}` (free) or `usage:monthly:{sessionId}:YYYY-MM` (paid)
- `checkAndEnforce` reads current count; `recordUsage` atomically increments AFTER AI responds
- Monthly keys expire after 35 days (auto-reset)

---

## Key frontend patterns

- `uiState` object holds all UI state; only updated from server responses
- `applyLang()` updates all text from the `T` translation object
- `renderUI()` updates usage dots, tier badge, upgrade button
- `renderResults(data)` renders the full analysis result as HTML
- `sessionStorage` keys `sol_cv_draft` / `sol_job_draft` persist textarea values across tab switches
- `localStorage` keys: `sol_session_id`, `sol_lang`, `sol_email`, `sol_reviewed`

---

## Environment variables (required on Vercel)

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API key |
| `KV_REST_API_URL` | Upstash KV REST URL |
| `KV_REST_API_TOKEN` | Upstash KV REST token |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook signature verification |
| `LEMONSQUEEZY_STORE_ID` | LemonSqueezy store ID |
| `LEMONSQUEEZY_PLUS_VARIANT_ID` | LemonSqueezy variant for Plus plan |
| `LEMONSQUEEZY_PRO_VARIANT_ID` | LemonSqueezy variant for Pro plan |

---

## Common pitfalls

- **Do not add tier logic to the frontend.** The server (`_tier.js`) is the single source of truth. Frontend only renders what it receives.
- **`_tier.js` and `_usage.js` are shared modules** — prefix `_` means they are NOT Vercel API routes. Don't add a default export to them expecting a route to be created.
- **jsPDF is loaded from CDN** — check `window.jspdf` exists before using it (already guarded in `downloadPDF()`).
- **`extractJSON` in `analyse.js`** — the AI sometimes wraps JSON in markdown code fences. The extractor strips those. Don't remove it.
- **No build step** — edits to HTML/JS files go live directly on Vercel deploy. No transpilation, no bundling.
