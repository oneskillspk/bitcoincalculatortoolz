# Enterprise Audit Remediation — bitcoincalculator.tools

Source: `live-site-audit.html` (323 lines, 12 sections, scores 3.0–9.0). This plan converts every Critical/High finding into a concrete code change, grouped into 4 shippable phases. Each phase is independently deployable and verifiable. Scope: presentation, head/meta, schema, security headers, copy, monetisation placements. Out of scope: calculator math, new backend tables, new translation strings beyond what these fixes require.

---

## Phase 0 — Triage map (no code)

Re-confirm against current source the 5 audit claims that may already be partially fixed since the audit ran:

- meta `theme-color` value in `index.html`
- meta `keywords` presence (Helmet + index.html)
- `og:type` on Learn article Helmets
- Actual live calculator count vs hero "45+" / `/calculators` H1 "35+"
- AdSense ad slot presence in DOM

Output: short delta table appended to `tmp/audit-2026-06-followup.md`. Anything already fixed is dropped from later phases.

---

## Phase 1 — P0 Trust, Legal, Credibility (ship first)

Goal: stop bleeding trust + unblock AdSense compliance. All changes EN+TR.

1. **Tool count single source of truth**
  - Count live calculators from `src/utils/localizedRoutes.ts` `EN_TO_TR` calculator slugs (build-time constant).
  - Export `LIVE_CALCULATOR_COUNT` from a new `src/config/siteStats.ts`.
  - Replace every hard-coded `45+`, `35+`, `36`, `40+` across hero, FAQ, `/calculators` H1, eyebrow pills, meta titles, OG descriptions, TR mirrors, and `index.html` title.
  - Add `scripts/audit-tool-count.mjs` to fail CI if any literal `\d\d\+\s*(tools|calculator|hesaplay)` appears outside `siteStats.ts`.
2. **"App Coming Soon Q2 2026" expired**
  - Remove the entire "App coming soon" section from homepage (EN + TR) until a real launch date exists. Strip dead links/images. NO CHANGE THE DATE INTO Q3, DO NOT REMOVE THEM, 
3. **"Trusted by 50k+ hodlers" unverifiable**
  - Replace with a sourced, dated metric driven by `siteStats.ts` (e.g. "36 free calculators · updated weekly") or remove the badge. No fabricated user counts.
4. **GDPR / CMP for AdSense**
  - Integrate Google Funding Choices (Consent Mode v2) loader in `index.html` before the AdSense tag.
  - Gate AdSense `(adsbygoogle = window.adsbygoogle || []).push(...)` calls behind consent signal.
  - Add `window.dataLayer` consent defaults (`ad_storage=denied`, `analytics_storage=denied` until granted).
5. **Privacy / Terms / Email-form disclosure**
  - Confirm `/privacy` and `/terms` (+ `/tr/gizlilik`, `/tr/kosullar`) render real content (not stubs). Fill gaps if stubs.
  - On the homepage email signup: add visible `<a href="/privacy">` link + one-sentence disclosure + explicit consent checkbox for EU (zod-validated, EN+TR strings).
  - Add site-wide footer affiliate disclosure line.
6. **Affiliate FTC disclosure**
  - Add "Affiliate link — we may earn a commission at no cost to you" caption adjacent to every Ledger and TradingView placement (component-level, not per-page).

**Verify Phase 1:** `bunx vitest run`, `node scripts/audit-tool-count.mjs`, `node scripts/audit-app-readiness.mjs`, manual screenshot of homepage + email form EN/TR.

---

## Phase 2 — P1 SEO depth, Schema, E-E-A-T

1. **Head/meta hygiene** (`index.html` + every Helmet)
  - Set `<meta name="theme-color" content="#ffffff">` (and matching media-query dark variant if dark mode is shipped).
  - Set `apple-mobile-web-app-status-bar-style` to `default`.
  - Strip all `<meta name="keywords">` tags (index.html + any Helmet writer).
  - Add `Referrer-Policy` and `Permissions-Policy` via `<meta http-equiv>` fallback alongside the real headers in Phase 3.
2. **og:type per surface**
  - Article Helmet in `src/components/articles/*` (or wherever the Learn article page renders) sets `og:type=article`, `article:published_time`, `article:modified_time`, `article:author`, `article:section`, `article:tag[]`. Hub `/learn` stays `website`.
3. **SoftwareApplication JSON-LD on every calculator**
  - New `src/components/schema/SoftwareApplicationJsonLd.tsx` injected by the calculator layout. Fields: `name`, `applicationCategory:"FinanceApplication"`, `operatingSystem:"Any"`, `offers:{price:"0",priceCurrency:"USD"}`, `inLanguage`, `url`.
4. **HowTo JSON-LD** on calculator pages that already render a numbered step section (DCA, Retirement, Profit-Loss to start). Read steps from the same content source the UI uses — no duplicated copy.
5. **Dataset JSON-LD** on homepage "Bitcoin vs Traditional Assets" + DCA "Returns by Monthly Investment" tables.
6. **Article E-E-A-T**
  - Add reusable `AuthorBio` component rendered at the foot of all 38 Learn articles, driven by an `authors` registry (`src/data/authors.ts`) keyed by `authorId` on the article frontmatter. EN + TR bios.
  - Add `Last reviewed: <date>` line under publish date; surface `dateModified` to Article schema.
  - Sync `dateModified` from a build-time scan of article file mtimes (script `scripts/sync-article-modified.mjs`).
7. **OG image differentiation**
  - Generate 3 category-level OG assets (Calculators / Learn / Home) via `imagegen` at 1200×630 WebP, route them in `src/lib/ogImage.ts` based on path. Keeps total assets small (3 files cover 80+ pages).

**Verify Phase 2:** `bunx vitest run`, `node scripts/audit-jsonld.mjs`, Rich Results test stub, Helmet snapshot tests.

---

## Phase 3 — Security headers, Performance, A11y

1. **Security headers** (`vercel.json` `headers`, plus `public/.htaccess` mirror)
  - `Content-Security-Policy` (script-src self + AdSense + GA + TradingView; img-src self data: https:; frame-src AdSense+TradingView; connect-src self + CoinGecko + Supabase; report-only first deploy).
  - `X-Frame-Options: SAMEORIGIN`.
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`.
  - `X-Content-Type-Options: nosniff`, `Strict-Transport-Security` (preload-ready).
2. **Live BTC "———" empty state**
  - Edge fallback: tiny `supabase/functions/btc-price-cache` (60s TTL) returning JSON; SSG-injected last-known price into `index.html` placeholder so first paint shows a real number; client hydrates to live.
  - Replace dash placeholders with a skeleton shimmer where SSR price is unavailable.
  - Remove the "Tick" rendering artefact next to sats label.
3. **/calculators virtualisation + lazy images**
  - Apply `content-visibility:auto` + `contain-intrinsic-size` to each `CalculatorCard`.
  - `loading="lazy" decoding="async"` on every card image; `fetchpriority="high"` on the LCP hero image only.
4. **Self-host TradingView banner**: download creative, store under `src/assets/affiliates/tradingview/`, swap external `<img>` src.
5. **Font diet**: trim Google Fonts URL to Inter [400,500,600,700,800] + Roboto Mono [400,500], `display=swap`, Latin + Latin-Ext subset only. Drop unused weights.
6. **A11y**
  - Audit `src/components/calculator-inputs/*` for explicit `<label htmlFor>`/`aria-labelledby` on every input + button group `role="group"`.
  - Bump `--muted-foreground` from `0 0% 42%` to `0 0% 38%`; add Vitest contrast guard reading the CSS var and asserting ≥4.5:1 against `--background` and `--muted`.

**Verify Phase 3:** Lighthouse CI (`.lighthouserc.json`), `browser--performance_profile` on `/` and `/calculators/dca`, axe-core run, CSP report-only logs.

---

## Phase 4 — UX polish, Monetisation, Internal linking

1. **Homepage section diet**
  - Collapse the 13-section homepage to a focused funnel: Hero → 6 featured calculators → How it works (3 steps, not 4) → Asset comparison → FAQ → Email signup. Remove network stats widget from above the fold (move to `/tools` or footer strip), drop the 4-step timeline, drop the editorial statement card duplication.
2. **Card label cleanup**
  - Replace `CALC-01 PRO`, `CALC-02 ADVANCED`, `CALC-03 PREMIUM` with real category tokens from `src/data/calculatorMeta.ts` (`Investment`, `Strategy`, `Tax`, `Market`).
3. **CTA copy unification**: every calculator card CTA → "Launch Calculator" (EN) / "Hesaplayıcıyı Aç" (TR). Single source in i18n.
4. **Calculator → Learn cross-link**
  - At the top of each calculator page, render "Read: &nbsp;" pulled from `src/data/calculatorMeta.ts` `relatedArticleSlug` field. Localized link.
5. **Footer "Calculators" column**: 8 top calculators by name + link, EN + TR.
6. **Ledger banner refresh**: replace 468×60 with native 300×250 (or text CTA), reposition above FAQ.
7. **AdSense slots**: confirm publisher id approved; if so, add manual `<ins class="adsbygoogle">` slots at: post-hero strip, mid-article (Learn), between FAQ and footer. Behind consent gate from Phase 1.
8. **Out of scope this phase (logged in `tmp/audit-2026-06-deferred.md`):** new exchange affiliate integrations (Coinbase/Kraken/Swan), new tooling for Dataset Search submissions, paid CMP migration.

**Verify Phase 4:** screenshot diffs at 360/768/1280 EN+TR for `/`, `/calculators`, `/calculators/dca`, `/learn`, `/learn/<sample-article>`; `node scripts/audit-tr-links.mjs`; `node scripts/audit-app-readiness.mjs`.

---

## Deliverables

- 4 commits, one per phase, each independently revertable.
- `tmp/audit-2026-06-followup.md` — delta vs original audit, screenshots before/after for top 6 offenders, perf + a11y deltas.
- New CI guards: `audit-tool-count.mjs`, contrast Vitest, JSON-LD snapshot expansions.
- Updated docs: `docs/SECURITY_HEADERS.md`, `docs/CONSENT_MODE.md`.

## Technical notes

- All Helmet writes flow through existing locale-aware wrappers — no per-page Helmet duplication.
- Security headers live in `vercel.json` (canonical) with an `.htaccess` mirror; the meta-equiv fallback in `index.html` is only for headers browsers honour from `<meta>` (Referrer-Policy, Permissions-Policy).
- Consent Mode v2 defaults must load synchronously before any GA/AdSense script; everything else can be `async`/deferred.
- TR parity: every copy change updates `src/translations/*` keys; `scripts/audit-translations.ts` must stay green.