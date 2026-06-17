## Enterprise Remediation — Phases 2-4 Detailed Plan

Phase 1 (P0 trust/legal/metadata) is complete: single-source tool count, FTC disclosure, Consent Mode v2, keywords stripped sitewide. The next three phases cover SEO depth, security/perf, and UX/monetisation polish.

---

### PHASE 2 — SEO Depth, Schema Coverage & E-E-A-T
**Goal:** Make every calculator + article eligible for Google rich results, Dataset Search, and AI-engine citation.

**2.1 Privacy + consent UX on email form** (P0 carryover)
- Add visible `<a href="/privacy">` link below homepage email input (EN + TR).
- Add required `<input type="checkbox">` "I agree to receive emails…" — submit disabled until checked.
- Mirror on TR `TurkishHome`.

**2.2 SoftwareApplication JSON-LD on every calculator (46 pages)**
- Create `src/components/seo/SoftwareApplicationSchema.tsx` driven by `calculatorMeta.ts`.
- Fields: `name`, `applicationCategory: "FinanceApplication"`, `operatingSystem: "Any"`, `offers.price: "0"`, `inLanguage`, `url`, `aggregateRating` only if real reviews exist (skip if not).
- Mount via shared `CalculatorPageShell` or per-page Helmet.
- Add `scripts/audit-softwareapp-schema.mjs` — fails CI if any sitemap calculator URL lacks the block.

**2.3 HowTo JSON-LD on step-based calculators**
- Target: DCA, Retirement, Profit-Loss, Stack Sats Goal, SIP, ETF (6 pages).
- Reuse the existing HowTo emitter pattern from `ArticleSchema`.
- Steps sourced from a new `howToSteps` field in `calculatorMeta.ts` (EN + TR).

**2.4 Dataset JSON-LD on data-table pages**
- Already have `DatasetSchema.tsx` — wire it into: Index (asset comparison), Halving Countdown, Inflation Dashboard, Pizza Day, Power Law, Rainbow Chart, On-Chain Dashboard.
- `temporalCoverage`, `variableMeasured`, `dateModified` driven by underlying JSON source.

**2.5 Article E-E-A-T upgrade**
- Create `src/data/authors.ts` (Web3Believer, Webio: name, bio, credentials, sameAs links, avatar).
- New reusable `<AuthorBio>` component, mounted at top + bottom of every article.
- Add visible `Last reviewed: <date>` line in article header.
- `scripts/sync-article-modified.mjs` — bumps `updatedDate` when article body file mtime changes; runs in CI.

**2.6 Category-differentiated OG images**
- Generate 3 1200×630 WebP via `imagegen` standard: Calculators / Learn / Home (EN + TR = 6 total).
- Route in `src/lib/ogImage.ts` by route prefix.
- Update `tr-og-image.test.tsx` expectations.

**Verification:** `bunx vitest run`, new `audit-softwareapp-schema.mjs`, `audit-jsonld.mjs`, Rich Results live test on 5 sample URLs.

---

### PHASE 3 — Security Headers, Performance & A11y
**Goal:** Lighthouse ≥95 all categories, OWASP secure-headers A grade, WCAG AA contrast.

**3.1 Security headers**
- Edit `vercel.json` (and mirror in `public/.htaccess`):
  - `Content-Security-Policy-Report-Only` first deploy (script-src self + AdSense + GA + TradingView; img-src self data: https:; frame-src AdSense + TradingView; connect-src self + CoinGecko + Supabase).
  - `X-Frame-Options: SAMEORIGIN` (relax from current DENY — required for TradingView embeds).
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`.
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
  - `X-Content-Type-Options: nosniff` (already in .htaccess; add to vercel.json).
- After 7-day report window: flip CSP to enforcing.

**3.2 Live BTC price hardening**
- Edge function `supabase/functions/btc-price-cache` with 60s in-memory TTL → CoinGecko fallback chain.
- Skeleton shimmer in `useLiveBitcoinPrice` while loading; remove "Tick" text artefact.
- SSG-injected last-known price in `index.html` for instant LCP.

**3.3 Image & asset diet**
- `loading="lazy"` + `decoding="async"` on every `<img>` outside the LCP viewport (codemod).
- `fetchpriority="high"` on hero image only.
- `content-visibility:auto` + `contain-intrinsic-size: 280px` on `CalculatorCard`.
- Self-host TradingView banner under `src/assets/affiliates/tradingview/` (kill third-party 200KB fetch).

**3.4 Font subset**
- Trim Google Fonts request to Inter [400,500,600,700,800] + Roboto Mono [400,500].
- `display=swap`, `&subset=latin,latin-ext` only (drop Cyrillic/Greek).

**3.5 Accessibility**
- Codemod: every `<input>` gets `<label htmlFor>` or `aria-labelledby`.
- Bump `--muted-foreground` to `0 0% 38%` (current fails 4.5:1 on `--background`).
- New `src/test/contrast.test.ts` — parses tokens, asserts AA on text pairs.
- Audit with `@axe-core/playwright` in `e2e/a11y.spec.ts`.

**Verification:** Lighthouse CI both desktop+mobile configs, axe-core e2e, securityheaders.com manual check post-deploy.

---

### PHASE 4 — UX Polish, Monetisation & Internal Linking
**Goal:** Tighter funnel, real category signals, every calculator cross-links to its Learn article.

**4.1 Homepage diet**
- Final order: Hero → 6 featured calculators → 3-step "How it works" → Comparison table → FAQ → Email capture.
- Remove: network stats strip, 4-step timeline duplication, redundant editorial card row.
- Keep "App Coming Soon Q2 2026" (user-requested).

**4.2 Real category labels**
- Replace placeholder `CALC-01 PRO` / `CALC-02 PRO` chips on cards with `category` token from `calculatorMeta.ts` ("Tax", "DCA", "Mining", etc., localized).

**4.3 CTA unification**
- Every calculator CTA → `t('common.launchCalculator')` = "Launch Calculator" / "Hesaplayıcıyı Aç".
- Audit script `scripts/audit-cta-strings.mjs`.

**4.4 Calculator ↔ Learn cross-linking**
- Add `relatedArticleSlug` field to every entry in `calculatorMeta.ts`.
- Render "Read the guide: <article title>" card at bottom of every calculator page.
- Article sidebar already has "Try the calculator" — verify all 32 articles have a `relatedCalculatorSlug`.

**4.5 Footer "Calculators" column**
- New column with 8 top calculators (by sitemap priority).
- Both EN and TR footers.

**4.6 Ad monetisation**
- Replace 468×60 Ledger banner with native 300×250, repositioned above FAQ (better viewability).
- AdSense slots: confirm all behind Phase 1 consent gate, lazy-mount only after user scrolls past 50% (already partial — finish).
- A/B test slot via `src/config/adConfig.ts` flag.

**Verification:** Playwright e2e for funnel, `audit-cta-strings.mjs`, `audit-internal-links.mjs`, manual screenshots at 360 / 768 / 1280 EN+TR.

---

### Execution order & batching
1. **2.1 + 2.2 + 2.3 + 2.4** in one batch (all are additive Helmet/JSON-LD work).
2. **2.5 + 2.6** in one batch (author component + OG images, no overlap).
3. **3.1 + 3.4** in one batch (config-only).
4. **3.2 + 3.3 + 3.5** sequentially (touch overlapping components).
5. **4.1–4.6** sequentially (homepage layout touched by 4.1, 4.5).

### Out of scope
- Calculator math changes.
- New translation keys beyond required disclosures + CTAs.
- New backend tables (only `btc-price-cache` edge fn).
- Mobile app launch copy (deferred until real launch date).

### Files that will change (high-level)
- Created: `src/components/seo/SoftwareApplicationSchema.tsx`, `src/data/authors.ts`, `src/components/learn/AuthorBio.tsx`, `supabase/functions/btc-price-cache/index.ts`, `scripts/audit-softwareapp-schema.mjs`, `scripts/audit-cta-strings.mjs`, `scripts/sync-article-modified.mjs`, `src/test/contrast.test.ts`, `e2e/a11y.spec.ts`, 6 OG images.
- Edited: `vercel.json`, `public/.htaccess`, `index.html`, `src/data/calculatorMeta.ts`, `src/lib/ogImage.ts`, `src/translations/index.ts`, `src/pages/Index.tsx`, `src/pages/TurkishHome.tsx`, `src/components/Footer.tsx`, all 46 calculator pages (schema mounting), all 32 article files (author + reviewed date).

**Approve to start Phase 2.1 + 2.2 + 2.3 + 2.4 in parallel.**
