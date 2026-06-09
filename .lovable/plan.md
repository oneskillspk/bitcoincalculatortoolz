## Audit findings — duplicated share/export panels

Pages currently mounting BOTH a results-only ShareCard/Snapshot AND a full-page `ExportReport` (the one that screenshots the whole calculator container including inputs/ads/footer):

| Page | Keep (results-only) | Remove (whole-page screenshot) |
|------|---------------------|-------------------------------|
| `BitcoinProfitLossCalculator.tsx` | `ProfitLossShareSnapshot` | `ProfitLossExportReport` |
| `BitcoinWhatIfCalculator.tsx` | `WhatIfShareSnapshot` | `ExportReportButton` |
| `BitcoinLoanCalculator.tsx` | `BitcoinLoanShareCard` | `BitcoinLoanExportReport` |
| `BitcoinPriceTargetCalculator.tsx` | `PriceTargetShareCard` | `PriceTargetExportReport` |
| `BitcoinWealthPercentile.tsx` | `WealthShareSnapshot` | `WealthShareCard` **and** `WealthExportReport` (triple-mounted today) |
| `BitcoinInheritanceTaxCalculator.tsx` | `InheritanceTaxShareCard` | `InheritanceTaxExportReport` |
| `BitcoinPizzaDayCalculator.tsx` | `PizzaShareCard` | `PizzaExportReport` |
| `BitcoinCAGRCalculator.tsx` | `CAGRShareSnapshot` | `ExportReportButton` |
| `BitcoinAverageBuyPriceCalculator.tsx` | `AvgBuyShareCard` | `AvgBuyExportReport` |

Pages with only one panel (no duplication, leave alone in this pass): DCA, Investment, Halving, ETF, FearGreed, Savings, Mining, PowerLaw, LotSize, Transaction Fee, LumpSumVsDCA, Lightning, AccumulationScore.

## Changes

### 1. Remove the duplicate `ExportReport`/`ExportReportButton` block in each page above
- Delete the JSX usage (and the surrounding wrapper if it becomes empty).
- Remove the now-unused `import` line.
- Remove any `useRef` / `reportRef` / `exportRef` declarations and prop wiring that existed only to feed the export component.
- Do not delete the underlying `*ExportReport.tsx` component files — they're imported elsewhere or may be reused after the consolidation work; this PR is a usage-level cleanup only.

After the edit, every page above will have exactly one `data-share-export-panel` mount (via the existing ShareSnapshot/ShareCard wrappers), which keeps screenshots focused on results.

### 2. New test: `src/test/helmet-no-nesting.test.tsx`

Static guard that fails the build if any React component is rendered as a child of `<Helmet>` (the root cause of the recent runtime crash). The test scans `src/pages/**/*.tsx` and `src/components/**/*.tsx`, parses each `<Helmet>…</Helmet>` block, and asserts every direct child opens with a lowercase tag (`<meta`, `<title`, `<link`, `<script`, `<html`, `<body`, `<base`, `<style`, `<noscript`) — i.e. no PascalCase component, no `{expr}` that resolves to a component.

Pseudocode:
```ts
const ALLOWED = /^<(meta|title|link|script|html|body|base|style|noscript)\b/;
for each file:
  for each Helmet block (regex /<Helmet[^>]*>([\s\S]*?)<\/Helmet>/g):
    split children, skipping whitespace, comments, raw text
    every non-empty JSX-tag child must match ALLOWED
    expression children `{...}` are allowed only if they are spreads of meta strings — flag PascalCase identifiers
```

Failure message points to file + line so future regressions are obvious.

### 3. Extend `share-export-singularity.test.tsx`

Add a page-walker case that imports the 9 audited pages above and asserts each renders **exactly one** `[data-share-export-panel]` plus zero `*ExportReport` DOM markers (look for the wrapping `data-export-report` attribute we'll add to the three legacy ExportReport components — one-line attribute add on their root `<div>`).

## Out of scope
- Migrating ExportReport-only pages (DCA, ETF, etc.) to ShareSnapshot — separate Phase D follow-up.
- Deleting unused ExportReport component files.
- Touching TR mirror pages (they don't mount the EN export components).
