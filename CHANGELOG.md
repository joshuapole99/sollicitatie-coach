# Changelog

All notable changes to Sollicitatie Coach are documented here.

## [Unreleased]

### Fixed
- **Textarea content lost on tab switch** — CV and job textarea values are now saved to `sessionStorage` on every keystroke and restored on page load. Fixes the issue reported by user Nicky where pasting text in one field and switching to another app to copy more text would reset the previously pasted content. Root cause: iOS Safari and some Android browsers unload pages from memory when switching tabs/apps, resetting all form state. Also added `autocomplete="off"` to prevent browser autocomplete interference.
- **`fillExample()` not persisting to sessionStorage** — example content is now also saved to sessionStorage so switching tabs after clicking the example button no longer clears the fields.
- **Usage counter off-by-one on page load** — `verify.js` was using `checkAndEnforce`'s `remaining` value which pre-subtracts 1 for an "upcoming" analysis. On first visit a new user would see "2 of 3 analyses left" instead of "3 of 3". Fixed by computing remaining as `limit - used` directly in verify.js.

---

## [1.0.0] — Initial release

### Added
- AI-powered CV and job posting analysis using Claude claude-sonnet-4-20250514
- Match score (0–100) with explanation
- Keyword analysis: present vs. missing keywords
- Strengths and improvement points
- CV improvement tips
- Tailored cover letter generation (Plus/Pro tiers)
- PDF export of cover letter (Pro tier)
- Free tier: 3 lifetime analyses
- Plus tier (€2,99/mo): 10 analyses/month + cover letter
- Pro tier (€9,99/mo): 100 analyses/month + cover letter + PDF
- NL/EN language switcher with localStorage persistence
- Example prefill button
- Usage tracking via Upstash KV (atomic INCR, no race conditions)
- Tier resolution via KV (written by LemonSqueezy webhook)
- Session-based tier lookup (no account required)
- Post-analysis star rating + review form
- Email capture modal (optional, single prompt)
- Vercel Analytics integration
- Dark mode support via `prefers-color-scheme`
- Payment processing via LemonSqueezy with webhook verification
- Privacy and terms pages
