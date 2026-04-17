# Product Backlog — Sollicitatie Coach

Priority order: P1 (critical) → P2 (high) → P3 (nice to have)

---

## P1 — Bugs / Critical fixes

- [x] **Textarea reset on mobile tab switch** — Opgelost via sessionStorage. Afgerond.
- [ ] **Session verify failure silent** — If `/api/session/verify` fails, the user gets no feedback and the button is re-enabled. Consider a subtle warning if verify fails multiple times.
- [ ] **Cover letter paywall copy wrong for Plus** — Review paywall conditions for Plus users.

---

## P2 — UX improvements

- [ ] **Persist analysis results across tab switches** — Save last result to sessionStorage so results are still visible after a tab switch on mobile.
- [ ] **Character counter on textareas** — Show a subtle character count on the CV and job textareas. Helps users know if they've pasted enough content.
- [ ] **Clear drafts button** — Add a small "wis velden" link to clear the CV and job textareas (and sessionStorage drafts).
- [ ] **Loading state improvements** — Current spinner has no progress indication. Consider rotating tips or step labels ("Analyseren keywords...", "Schrijven motivatiebrief...").
- [ ] **Error recovery** — When the API returns an error, keep the analyse button enabled immediately (currently done) but also re-show the textarea values if the user accidentally cleared them.
- [x] **Language preference synced across pages** — Opgelost via LanguageProvider context. Afgerond 2026-04-16.
- [x] **Mobile responsiveness** — Hamburger menu, grid breakpoints, touch targets, font sizes gefixed. Afgerond 2026-04-17.
- [x] **PWA / installeerbaar als app** — manifest.json, service worker, install banner (Android + iOS), trust pill. Afgerond 2026-04-17.
- [ ] **Review form: only show once per session** — The review form is gated by `sol_reviewed` in localStorage, but it fires 2 seconds after every analysis in the same session. Add a session-level flag so it only shows once per session.

---

## P3 — Features

- [ ] **Real user reviews on index.html** — The reviews section has placeholder cards. Collect real reviews (from the review form submissions) and add them to the landing page.
- [ ] **Email tips drip sequence** — The email modal captures addresses but `submitEmail()` only stores to localStorage. Wire it to an email service (Resend, Mailchimp) to actually send follow-up tips.
- [ ] **Analysis history** — For Plus/Pro users, store the last 5 analyses in localStorage (score, date, job title) so they can see their progress over time.
- [ ] **Paste from PDF button** — Browser-based PDF text extraction (pdf.js) so users can upload a PDF CV instead of copy-pasting.
- [x] **Mobile layout polish** — Opgelost als onderdeel van mobile responsiveness fix. Afgerond 2026-04-17.
- [ ] **Free tier generic response** — Free users krijgen een gescript antwoord (geen Claude API) zodat API-kosten alleen voor betaalde gebruikers zijn. Zie implementatieplan.
- [ ] **Webhook retry handling** — If the LemonSqueezy webhook fails, the tier won't be written to KV. Consider adding a `/api/session/refresh?orderId=...` endpoint that the success page can poll.
- [ ] **Usage reset endpoint** — Admin endpoint (protected) to manually reset a user's usage counter for support cases.
- [ ] **Referral tracking** — Add UTM parameter tracking via Vercel Analytics to understand which channels convert best.
