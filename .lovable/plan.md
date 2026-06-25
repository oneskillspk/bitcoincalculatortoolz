# Batch 4 — Non-Calculator Pages, Hubs & TR Localization

Sequenced by priority. Each step is small, reviewable, and verifiable.

## Step 1 — P0 Critical Fixes (SEO/A11y/Compliance)

**1a. Admin noindex**
- `src/pages/AdminDashboard.tsx`, `src/pages/AdminLogin.tsx`: add `<Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>`.
- Verify `/admin/*` excluded from `public/sitemap.xml` and `scripts/generate-sitemap.ts`.

**1b. About H1**
- `src/pages/OptimizedAbout.tsx`: add semantic `<h1>` ("About BitcoinCalculatorToolz" / TR equivalent) at top of main content. Hide visually only if duplicating hero — but keep in DOM.

**1c. TurkishHome localization**
- Audit `ProfessionalHeroSection`, `PremiumCalculatorCards`, `LiveCalculationDemo`, `EditorialStatement` for hard-coded EN strings.
- Wire each to `useLanguage()` with a `tr` copy map (no new components — reuse via prop/hook).
- Confirm rendered H1 in `/tr/` is Turkish; add `lang="tr"` on H1 if needed.

**1d. Calculators.tsx legacy AffiliatePlacement**
- Replace `<AffiliatePlacement forceAffiliateId="..." />` with V2 `<PreFAQPlacement />` (shim) so `scripts/audit-legacy-placements.mjs` passes without allowlist entry.
- Same treatment for `Index.tsx` legacy import (move to V2 shim or formally allowlist Home in audit script — pick shim for consistency).

Verify: `node scripts/audit-legacy-placements.mjs` → 0 violations. `bunx tsgo --noEmit` → clean.

## Step 2 — P1 Revenue & Routing Gaps

**2a. /learn affiliate placement**
- Inject `<PreFAQPlacement />` between `prominentArticles` and `remainingArticles` blocks in `Learn.tsx`.

**2b. Unsubscribe H1 + Footer**
- Add `<h1>Unsubscribe</h1>` (localized) and `<Footer />` to `Unsubscribe.tsx`.

**2c. TR routes**
- Add to `src/App.tsx`:
  - `/tr/hakkimizda` → `OptimizedAbout`
  - `/tr/iletisim` → `Contact`
  - `/tr/yontem` → `Methodology`
  - `/tr/sartlar` → `Terms`
  - `/tr/ortaklik-aciklamasi` → `AffiliateDisclosure`
- Add matching entries to `scripts/generate-sitemap.ts` and hreflang alternates in each page Helmet.

**2d. Tools.tsx coming-soon gating**
- Add `comingSoon: boolean` flag to tool entries; render disabled card with "Notify me" mailto or no `<Link>` wrapper when true.

**2e. Privacy/Terms/AffiliateDisclosure Helmet**
- Replace `window.location.pathname.startsWith('/tr')` with the existing `tr` flag from `useLanguage()` in all three files (og:locale, og:image suffix logic).

## Step 3 — P2 Polish & Consistency

- **3a.** Replace every literal `"49+"` in `Calculators.tsx` and `Index.tsx` with `LIVE_CALCULATOR_COUNT_DISPLAY` from `src/config/siteStats.ts`.
- **3b.** Add `<meta name="robots" content="noindex" />` to `NotFound.tsx` and `TurkishNotFound.tsx`; add top-5 calculator recovery links.
- **3c.** Localize `Index.tsx` FAQPage JSON-LD: branch question/answer arrays by `language === 'tr'`. Also make `inLanguage` dynamic and `<title>` conditional on `tr`.
- **3d.** Add visible `Last updated: 2026-06-25` block in `Privacy.tsx`, `Terms.tsx`, `AffiliateDisclosure.tsx` (bilingual).
- **3e.** Split `Contact.tsx` (508L) → `ContactForm.tsx`, `ContactInfoCards.tsx`, `ContactFAQ.tsx`. Keep zod schema co-located with form. Add parity test under `src/test/`.

## Step 4 — P3 Nice-to-have

- `/learn` sticky filter: change `top-16` → `top-14` or use `[--header-h:64px] top-[var(--header-h)]`.
- Delete `About.tsx` shim; route `/about` directly to `OptimizedAbout`.
- Remove preconnect to `affiliate.ledger.com` from `Index.tsx` or move into AffiliateAI runtime (only preconnect when banner is armed).

## Technical Notes

- All H1 additions must remain unique per page; if a child component already renders H1, demote child to H2 and put H1 in the page file.
- TR localization rule: components consumed by `/tr/*` routes must call `useLanguage()` directly — no prop drilling — so EN routes stay unchanged.
- V2 audit script lives at `scripts/audit-legacy-placements.mjs`; run after every step touching banners.
- Sitemap regenerates via `predev`/`prebuild`; new TR routes appear automatically after entries added.

## Verification per step

1. `bunx tsgo --noEmit` — type clean.
2. `node scripts/audit-legacy-placements.mjs` — 0 legacy.
3. `node scripts/audit-schema.mjs` — canonical/Helmet present.
4. Playwright spot-check: `/tr/`, `/learn`, `/about`, `/unsubscribe`, `/admin/login` — H1 + robots meta + visible language.

## Out of scope (intentionally deferred)

- New category filter on `/calculators` and recently-viewed widget on hubs (feature work, not audit fix).
- TR copy editorial review for legal pages (requires native reviewer).
- TR voice/tone style guide.
