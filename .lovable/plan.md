# Next Phase — Lazy-load Heavy Charts + Run Audit Scripts

## Part A — Per-page chart lazy-loading

The slow pages flagged by the audit each have exactly one chart child component that imports `recharts`. Lazy-load that one component behind `useIntersectionObserver` so recharts (~80 KB gz) only loads when the chart scrolls into view.

### A1. `/calculators/btc-vs-real-estate`
- `BtcVsRealEstateChart.tsx` is the only recharts importer on this page.
- In `src/pages/BtcVsRealEstateCalculator.tsx`:
  - Replace static `import { BtcVsRealEstateChart }` with `const BtcVsRealEstateChart = lazyWithRetry(() => import("@/components/btc-vs-real-estate/BtcVsRealEstateChart").then(m => ({ default: m.BtcVsRealEstateChart })))`.
  - Wrap usage in `<Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>`.
  - Wrap the Suspense in a div with `useIntersectionObserver({ rootMargin: '300px' })` so the chunk fetch only fires when the user scrolls near it. Render the fallback skeleton until intersecting.

### A2. `/calculators/btc-loan` (TR: `/tr/hesaplayicilar/bitcoin-kredi`)
- `src/components/bitcoin-loan/BitcoinLoanResultsPanel.tsx` doesn't import recharts directly — verify with a deeper grep before changing. If a sub-component does (e.g. an amortization chart), apply the same lazy + intersection wrapper there. If no chart exists, the slowness is from `services/bitcoinLoanCalculator` payload — convert any large constant arrays to a `fetch('/data/...json')` call gated by intersection.

### A3. `/tr/ogrenin/bitcoin-gayrimenkul-sp500-altin-karsilastirma`
- This is a TR article. Articles render via `LearnArticle.tsx` which dynamically picks the slug; the heavy bit is the embedded comparison chart component. Locate the component (`rg -l "asset_prices_v1" src/components`), apply same lazy + intersection treatment, and ensure the article keeps a skeleton placeholder so CLS stays at 0.

### A4. `/tools` and `/tr/404`
- `/tools` doesn't import recharts at all — slowness is bundle weight from `ToolsFAQSection` + many `LocalizedLink`s. Skip chart treatment; instead verify all below-fold images on Tools have `loading="lazy"` + explicit width/height (small low-risk patch).
- `/tr/404`: TurkishNotFound is already minimal (Helmet + Button + Link + Lucide icons). Cannot make smaller. The audit report may be measuring TTI on the cold lazy chunk — no action needed beyond confirming.

### Pattern (reused for A1, A2, A3)

```tsx
import { useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { lazyWithRetry } from "@/utils/lazyWithRetry";

const LazyChart = lazyWithRetry(() =>
  import("@/components/.../FooChart").then(m => ({ default: m.FooChart }))
);

// inside the component
const chartRef = useRef<HTMLDivElement>(null);
const visible = useIntersectionObserver(chartRef, { rootMargin: "300px" });

return (
  <div ref={chartRef} className="min-h-[400px]">
    {visible ? (
      <Suspense fallback={<div className="h-[400px]" />}>
        <LazyChart {...props} />
      </Suspense>
    ) : null}
  </div>
);
```

## Part B — Run audit scripts and capture deltas

After Part A changes are in place, run the existing audit scripts and report results to the user:

1. `node scripts/audit-internal-links.mjs` — confirm `/tr/tr` no longer appears as an orphan.
2. `node scripts/audit-app-readiness.mjs` — must remain green.
3. `node scripts/audit-tr-links.mjs` — TR-specific nofollow/internal-link audit.
4. `node scripts/audit-sitemap-report.mjs` — sitemap consistency.
5. `node scripts/audit-broken-links.mjs` — broken-link survey.

Capture each script's exit code and key output lines, then summarize the deltas (e.g. orphan count before vs. after, broken-link delta). If any script newly fails because of these changes, fix in the same pass.

## Verification

- Targeted vitest: `bunx vitest run -u src/lib/affiliateAI/__tests__/redotpayFinalBanners.test.tsx` to refresh snapshots that referenced the just-migrated PNG → WebP URLs.
- Manual preview: open `/calculators/btc-vs-real-estate`, scroll the chart into view, confirm recharts chunk loads on demand (Network tab).
- `npm run build` must stay green (harness will run automatically).

## Out of scope

- og:image migration (user said skip).
- New chart components or visual redesigns.
- Replacing the splash screen.
