# Comprehensive Pre-Launch Audit Fixes

Fix the 9 audit findings + add a few related cleanups discovered during exploration. Grouped by impact.

## 1. BreadcrumbList schema error (affects all 180+ pages — HIGH)

**Issue**: Every page emits `"@type": "BreadcrumbList", "inLanguage": "en|tr"`. schema.org rejects `inLanguage` on `BreadcrumbList`.

**Fix**:
- `src/components/seo/BreadcrumbSchema.tsx` — remove the `inLanguage` key from the BreadcrumbList JSON-LD object.
- `src/components/learn/ArticleSchema.tsx` (line 143–145) — remove `inLanguage` from the BreadcrumbList block only. Keep `inLanguage` on `Article`, `FAQPage`, `HowTo`, `WebPage` (it IS valid there).
- Update the related test `src/test/tr-breadcrumb-locale.test.ts` so it no longer asserts `inLanguage` on BreadcrumbList; add a negative assertion that BreadcrumbList never contains `inLanguage`.
- Update `src/test/tr-jsonld-inlanguage.test.tsx` snapshots if they reference the BreadcrumbList key.

## 2. Splash screen "red vertical line" (UX polish — HIGH)

**Issue**: Screenshot shows a small orange/red bar at the top-left of the splash. Source: `RouteLoadingFallback` in `src/App.tsx` renders a `fixed top-0 left-0 h-[3px] w-1/3 bg-primary/80` progress bar that paints behind/around the splash. Also the splash has no centered logo treatment (icon floats alone above title).

**Fix**:
- Hide the route-progress bar while the splash is still mounted. Easiest: in `RouteLoadingFallback`, render `null` for the bar when `document.querySelector('.splash-container')` exists; or scope visibility with `.splash-container ~ * .route-progress { display:none }`. Cleanest is to give the bar `id="route-progress"` and add an inline CSS rule in `index.html` `body:has(.splash-container) #route-progress { display:none }`.
- Restyle splash so the brand mark + text are visually grouped — wrap them in a subtle card-less centered stack (already done) and bump icon-to-title gap; add `pointer-events:none` so no element can paint a stray border.
- Remove the unused `src/styles/splash-screen.css` rules that overlap (only inline `index.html` styles ship now).

## 3. Multiple H1 on /learn and /tr/ogrenin

**Issue**: `Learn.tsx` line 138 is H1, and `FeaturedArticleHero.tsx` line 34 is also H1 (rendered inside the page).

**Fix**: Change `FeaturedArticleHero.tsx` H1 to H2. Keep `Learn.tsx` H1 as the single page heading. (Article detail pages keep their own H1 — `FeaturedArticleHero` is only used on the listing page.)

## 4. Internal-link distribution (TR pages)

**Issue 1 — pages with mixed nofollow/dofollow incoming links** (`/tr/araclar`, `/tr/hesaplayicilar`, `/tr/`, `/tr/ogrenin`, `/tr/hakkimizda`). Means some internal links to them have `rel="nofollow"`. We should never nofollow our own internal navigation.

**Fix**: Grep all components for `rel=.*nofollow` where the `href` starts with `/` or matches our domain, and remove the nofollow attribute. Likely culprits: footer "external" helper, share buttons treating internal links as external, `InternalLinkInterceptor`.

**Issue 2 — pages with only one dofollow incoming link** (3 TR articles + `/tr/hesaplayicilar/bitcoin-yarilanma-geri-sayim`, `/tr/tr`):
- The article `/tr/ogrenin/korku-acgozluluk-endeksi-stratejisi`, `/tr/ogrenin/bitcoin-hesaplayici-karsilastirma`, `/tr/ogrenin/cf-benchmarks-brti-aciklamasi` need more internal links pointing to them.
- Add them into the relevant TR article `relatedSlugs`/recommended-reads sets, and into the TR Learn listing's "Featured" or top-section so the homepage and `/tr/ogrenin` link to them.
- `/tr/hesaplayicilar/bitcoin-yarilama-geri-sayim` is the Halving countdown — link it from TR homepage hero/featured tools row.
- `/tr/tr` (note the duplicate) is a 404-prone path; add a redirect `/tr/tr` → `/tr` in `src/App.tsx` and remove any source emitting it.

**Issue 3 — orphan `?ref=peerpush`**: this is an external referral URL appearing in the audit only because someone shared it. The canonical correctly strips the query, so it cannot accrue internal links. No code action needed; document in `docs/audit-2026-05.md` that the audit tool sees the query string as a distinct URL but the canonical resolves it. (Optional: in `src/main.tsx` strip known marketing params from `window.location` on load to keep clean URLs in browser history.)

## 5. Slow pages

**Issue**: `/tools`, `/calculators/btc-vs-real-estate`, `/tr/hesaplayicilar/bitcoin-kredi`, `/tr/ogrenin/bitcoin-gayrimenkul-sp500-altin-karsilastirma`, `/tr/404`.

**Fix**:
- Audit each route's eager imports; convert heavy child components (charts, JSON datasets) to `React.lazy` inside the page if not already.
- `/tr/404` should not be slow — verify it isn't dragging the whole bundle. Make `TurkishNotFound` import only Helmet + a static layout (no recharts, no service imports).
- For BTC vs Real Estate and Bitcoin Loan: lazy-load the chart card behind `useIntersectionObserver` so it only mounts when scrolled into view.
- Add `loading="lazy"` + explicit width/height to any remaining `<img>` below the fold on these pages.
- Verify with `npm run build` + bundle-size diff; target initial JS ≤ existing budget.

## 6. Oversized images (RedotPay banners on CDN)

**Issue**: 3 PNG banners > 1 MB each are loaded over the wire.

**Fix**:
- Re-export the 3 source PNGs as quality-85 WebP (1920×N) locally; the visuals are gradients/illustration so WebP keeps fidelity at ~10× smaller size.
- Upload via `lovable-assets create` for each new `.webp`, producing fresh `.asset.json` pointers in `src/assets/affiliates/redotpay/`.
- Update `src/config/affiliates.config.ts` to reference the new `.webp` pointers (replace the 3 PNG imports).
- Update the snapshot test `src/lib/affiliateAI/__tests__/__snapshots__/redotpayFinalBanners.test.tsx.snap` to match new URLs (re-run vitest with `-u`).
- Delete the 3 obsolete PNG `.asset.json` pointers via the `delete_asset` tool so they don't keep getting served.
- Sanity-check other affiliate creatives in the same folder; convert any that are also >500 KB.

## 7. Bonus cleanups uncovered during exploration

- `index.html` line 37/40 still references `social-preview.webp` for `og:image`. WebP is rejected by many social crawlers. Replace with a PNG or JPG of identical 1200×630 (separate small task; flag only — defer if not in scope).
- `src/components/LoadingSpinner.tsx` imports `bitcoin-logo.png` directly — fine, just verify it's the small favicon-sized asset, not the full hero PNG.

## Verification

- `npm test -- breadcrumb` and full vitest run — all schema/snapshot tests green.
- Manual: load `/`, `/tr`, `/learn`, `/tr/ogrenin` in preview and confirm: (a) splash has no red bar, (b) only one `<h1>` per page (`document.querySelectorAll('h1').length === 1`), (c) Rich Results test on a few URLs reports zero schema errors.
- Lighthouse on `/tools` and `/calculators/btc-vs-real-estate` to confirm performance delta.
- Re-run the broken/internal-links audit script (`scripts/audit-internal-links.mjs`) to confirm orphan & one-dofollow counts dropped.

## Out of scope (will mention but not change without confirmation)

- Rewriting the entire splash screen visual design (current is acceptable once the red bar bleed is fixed).
- Migrating `og:image` from WebP → PNG sitewide (separate already-discussed task; ask before proceeding).
- Regenerating brand-new RedotPay creatives via imagegen (the existing art is reused; we only re-encode for size).
