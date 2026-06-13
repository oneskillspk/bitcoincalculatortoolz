# Next Phase — Close Remaining Audit Items

Three items from the previous audit plan are still open. og:image is explicitly skipped.

## 1. Add `/tr/tr` → `/tr` redirect (5 min)

The audit flagged `/tr/tr` as an orphan URL with one dofollow link. Source emits the duplicate prefix somewhere.

**Changes:**
- `src/App.tsx` — add `<Route path="/tr/tr" element={<Navigate to="/tr" replace />} />` and `<Route path="/tr/tr/*" element={<Navigate to="/tr" replace />} />` near the other TR routes.
- Grep `rg -n '"/tr/tr"|/tr/\$\{`'`tr`'`'` to find the source that emits the malformed link, fix it at the source so the redirect is belt-and-suspenders only.

## 2. Convert `image_11_1920x1004.png` to WebP

Same RedotPay banner class as the three already converted (>1 MB PNG).

**Changes:**
- Re-encode locally at quality 85 → `image_11_1920x1004.webp`.
- `lovable-assets create` → new `.webp.asset.json` pointer.
- `src/config/affiliates.config.ts` line 23: swap import to `.webp.asset.json`.
- Delete old `image_11_1920x1004.png.asset.json` via `delete_asset`.
- Re-run snapshot test `redotpayFinalBanners.test.tsx` with `-u`.

## 3. Lazy-load slow pages

Audit flagged these as slow:

- `/tools` — `src/pages/Tools.tsx`
- `/calculators/btc-vs-real-estate` — `src/pages/BtcVsRealEstateCalculator.tsx`
- `/tr/hesaplayicilar/bitcoin-kredi` — TR loan calculator
- `/tr/ogrenin/bitcoin-gayrimenkul-sp500-altin-karsilastirma` — TR comparison article (heavy charts)
- `/tr/404` — TurkishNotFound

**Approach (per page):**

1. **Identify heavy children** with `rg -n "from ['\"]recharts|from ['\"].*\.json'"` inside each route file.
2. **Wrap each heavy chart card** in `React.lazy()` and render only after `useIntersectionObserver` reports the card is near viewport. Add a `min-height` skeleton placeholder so layout doesn't jump.
3. **`/tr/404`**: open `src/pages/TurkishNotFound.tsx` and strip any non-essential imports (recharts, services). The page should pull only Helmet + a static layout. If it imports a shared TR layout that drags recharts, inline a minimal layout instead.
4. **Below-fold `<img>`**: add `loading="lazy"` + explicit `width`/`height`. Already added on most pages — grep for stragglers in the five target files.
5. Verify with `npm run build` and confirm initial JS chunk for each route stays within budget (no regression).

## Technical Notes

- `useIntersectionObserver` hook already exists at `src/hooks/useIntersectionObserver.ts` — reuse it.
- `lazyWithRetry` utility at `src/utils/lazyWithRetry.ts` should wrap each `React.lazy()` call (project pattern).
- Snapshot test re-run command: `bunx vitest run -u src/lib/affiliateAI/__tests__/redotpayFinalBanners.test.tsx`.

## Verification

- `node scripts/audit-internal-links.mjs` — `/tr/tr` should drop out of orphan list.
- `node scripts/audit-app-readiness.mjs` — must stay green.
- Manual: load each slow page in preview, check Network tab for image_11 served as `.webp`, and Performance tab for the lazy chart firing on scroll.
- `bunx vitest run` — full suite green (excluding the pre-existing sitemap/SEO consistency failures already documented).

## Out of scope (per user)

- `og:image` PNG migration.
- Regenerating any creative artwork.
