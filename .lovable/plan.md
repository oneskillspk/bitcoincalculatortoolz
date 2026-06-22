# Audit remediation plan — bitcoincalculator.tools

Source: `bitcoincalculator.tools - Website Audit Report.docx` (Jun 21, 2026). Overall verified score 58/100. Plan groups every High/Medium/Low action from §17 plus the cross-cutting items called out in the executive summary, ordered by impact-per-hour.

---

## P0 — Ship this week (trust + legal + credibility)

### skip the entire P0, or pre rendering functions bcz we have alredy using 3rd party pre rendering services lovablehtml

### 2. Resolve the "No ads" contradiction on `/about`

Audit flags the About comparison table claiming "No sponsors, no VC, no ads" while every page ships Google AdSense + Sponsored TradingView/Ledger banners.

Action: edit the About comparison row to say "No paywalls, no signup walls, no data sold" (or equivalent honest phrasing) and add a one-line footnote: "Funded by clearly-labeled affiliate links and display ads — see Affiliate Disclosure." Link to `/affiliate-disclosure`.

### 3. Cookie / GDPR consent verification

Audit could not confirm a working consent banner.

Action: audit `src/` for an existing consent component; if absent, add a lightweight EU-gated banner that gates AdSense + analytics until consent (Google Consent Mode v2 defaults to denied). Document the choice in `/privacy`.

### 4. Single source of truth for tool count

"45+", "46", "46+", and "47" all appear sitewide.

Action: export a single constant from `src/config/siteStats.ts` (already exists per file tree) — `TOOL_COUNT = 46` — and grep-replace every literal occurrence in components, translations (en + tr), meta descriptions, OG copy, and sitemap generator. Add a `scripts/audit-tool-count.mjs` CI check (already present — wire it into the required checks list).

---

## P1 — Within 2 weeks (SEO + content integrity)

### 5. Verify FAQ schema renders in HTML on calculator pages, not just homepage

Audit could not confirm FAQ JSON-LD on calculator templates.

Action: extend the prerender list (item 1) to include the top 10 calculator routes by traffic so the FAQ JSON-LD + answer text ships in initial HTML. Add a Playwright test that `curl`s each prerendered route and asserts `application/ld+json` with `@type: FAQPage` is present.

### 6. Run real Lighthouse / PSI against home, one calculator, one guide

Audit explicitly avoided guessing CWV numbers.

Action: `.lighthouserc.json` and `.lighthouserc.mobile.json` already exist — extend the URL list to cover `/`, `/calculators/dca`, and one `/learn/*` guide; wire the GitHub Action (`.github/workflows/lighthouse.yml`) to fail PRs on LCP > 2.5s or CLS > 0.1. Publish results to a `docs/lighthouse-latest.md` checked into the repo.

### 7. Resolve Q2 2026 app-launch messaging

Audit warns that "Coming Soon" without a date will look stale by July.

Action: either swap the app-store badges for a "Join the waitlist" CTA pointing to a `/app` waitlist route, OR remove the badges entirely until the apps ship. Decision needed from owner — surfacing here as a flag, not a code change. just adjust to Q3 2026 nothing changes more.

---

## P2 — Within 4 weeks (polish + growth)

### 8. Brand-name casing

Standardize on `bitcoincalculator.tools` (lowercase) sitewide — meta tags, footer, OG titles, JSON-LD `name`. Add a `scripts/audit-brand-casing.mjs` walker.

### 9. Inline methodology links next to backtest stats

On `/about` and on calculator result panels that quote backtest percentages, link the number to a `/methodology` anchor that shows the formula + data window.

### 10. Real, attributed testimonials

Replace the "50k+ hodlers" claim either with 3–5 real quotes (name, role, link) or remove the number. Add a `testimonials.json` data file so future additions are content-only.

### 11. Geographic / regulatory long-tail expansion

Audit calls this out as cheap wins. Zakat calculator already exists. Spec 3 new variants: India 30% crypto tax calculator, UK CGT allowance calculator, Germany 1-year holding-period calculator. Each one reuses the existing tax-calculator template.

---

## Technical notes

- Prerender approach (item 1) is the single biggest unlock — it fixes findings in §1 (executive summary), §2 (homepage), §7 (technical SEO), §10 (speed — initial HTML is faster than CSR shell), §13 (trust), and §15 (security via real CSP-friendly static HTML).
- Files in scope for P0:
  - `vite.config.ts` (add prerender plugin or post-build script)/ SKIP THIS
  - `src/pages/Privacy.tsx`, `Terms.tsx`, `Contact.tsx` (add `<noscript>` fallbacks)
  - `src/pages/About.tsx` (fix "no ads" row)
  - `src/config/siteStats.ts` + every component citing the tool count
  - `index.html` (per-route head patches if we go the post-build-copy route)
- Tests to add: prerender HTML assertion spec, FAQ JSON-LD spec, tool-count sitewide grep test.
- Risk: prerender adds build time (~20–60s for 5 routes via puppeteer). Mitigation: cache puppeteer in CI, prerender only the 5 P0 routes first, expand once stable.

## Suggested execution order

1. Item 4 (tool-count constant) — 30 min, kills a sitewide credibility paper-cut immediately.
2. Item 2 (About "no ads" copy) — 15 min, removes the sharpest trust contradiction.
3. Item 3 (consent banner audit + fix) — half day, compliance.
4. Item 1 (prerender for 5 utility routes) — 1–2 days, unlocks §7/§10/§13 findings.
5. Item 5 (extend prerender to top calculators + FAQ schema test) — 1 day.
6. Item 6 (Lighthouse CI) — half day.
7. Items 7–11 — scheduled into the next sprint.