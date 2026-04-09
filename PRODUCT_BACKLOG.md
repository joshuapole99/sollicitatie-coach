# Product Backlog — Sollicitatie Coach

Priority order: P1 (critical) → P2 (high) → P3 (nice to have)

---

## P1 — Bugs / Critical fixes

- [ ] **Textarea reset on mobile tab switch** — FIXED in latest commit. Monitor for edge cases on Android Chrome.
- [ ] **Session verify failure silent** — If `/api/session/verify` fails, the user gets no feedback and the button is re-enabled with `uiState.verified = false`. Consider a subtle warning if verify fails multiple times.
- [ ] **Cover letter paywall copy wrong for Plus** — When a Plus user sees the cover letter paywall, it shows `motivPdfLocked` ("PDF export alleen voor Pro") instead of `motivLocked` ("Motivatiebrief — upgrade"). The logic at line 633 checks `r.tier === 'plus'` but Plus users DO get a cover letter — the paywall for Plus is only for PDF, not the letter itself. Review the paywall conditions.

---

## P2 — UX improvements

- [ ] **Persist analysis results across tab switches** — Save last result to sessionStorage so results are still visible after a tab switch on mobile.
- [ ] **Character counter on textareas** — Show a subtle character count on the CV and job textareas. Helps users know if they've pasted enough content.
- [ ] **Clear drafts button** — Add a small "wis velden" link to clear the CV and job textareas (and sessionStorage drafts).
- [ ] **Loading state improvements** — Current spinner has no progress indication. Consider rotating tips or step labels ("Analyseren keywords...", "Schrijven motivatiebrief...").
- [ ] **Error recovery** — When the API returns an error, keep the analyse button enabled immediately (currently done) but also re-show the textarea values if the user accidentally cleared them.
- [ ] **Language preference synced across pages** — `index.html` and `app.html` each read `sol_lang` from localStorage, but the index page's lang switcher sets it correctly. Verify both pages stay in sync on first visit.
- [ ] **Review form: only show once per session** — The review form is gated by `sol_reviewed` in localStorage, but it fires 2 seconds after every analysis in the same session. Add a session-level flag so it only shows once per session.

---

## P3 — Features

- [ ] **Real user reviews on index.html** — The reviews section has placeholder cards. Collect real reviews (from the review form submissions) and add them to the landing page.
- [ ] **Email tips drip sequence** — The email modal captures addresses but `submitEmail()` only stores to localStorage. Wire it to an email service (Resend, Mailchimp) to actually send follow-up tips.
- [ ] **Analysis history** — For Plus/Pro users, store the last 5 analyses in localStorage (score, date, job title) so they can see their progress over time.
- [ ] **Paste from PDF button** — Browser-based PDF text extraction (pdf.js) so users can upload a PDF CV instead of copy-pasting.
- [ ] **Mobile layout polish** — On small screens, the two-column textarea layout (cv | job) collapses to single column (already handled via media query). Verify spacing and tap target sizes on iOS Safari.
- [ ] **Webhook retry handling** — If the LemonSqueezy webhook fails, the tier won't be written to KV. Consider adding a `/api/session/refresh?orderId=...` endpoint that the success page can poll.
- [ ] **Usage reset endpoint** — Admin endpoint (protected) to manually reset a user's usage counter for support cases.
- [ ] **Referral tracking** — Add UTM parameter tracking via Vercel Analytics to understand which channels convert best.
