# Codebase Cleanup Audit — Plan Mode

Ran `knip` across the project (1,052 TS/TSX files, 7.6 MB `src/`). Below is the categorized inventory of dead code, unused dependencies, and clutter, plus a safe phased execution plan.

## Findings Summary

| Category | Count | Risk |
|---|---|---|
| Unused source files | 50+ | Low (after manual verify) |
| Unused `tmp/reference-*` files | 12 | None — pure clutter |
| Unused shadcn/ui components | 26 | Low |
| Unused npm dependencies | 22 | Med (heavy bundle impact) |
| Unused exports | 105 | Low |
| Unused exported types | 81 | None |
| Duplicate `default` + named exports | 53 | None (style only) |
| Legacy placement Zone1–5 components | 5 | Low (V2 active everywhere) |

## Phase 1 — Zero-Risk Clutter (do first)

1. Delete `tmp/` directory entirely (12 stale `reference-*.tsx/.css/.ts/.html` files + i18n markdown reports, ~150 KB). Add `tmp/` to `.gitignore`.
2. Delete unused codemod/audit scripts that no CI workflow references:
   - `scripts/codemod-semantic-colors.mjs`, `codemod-semantic-colors-2.mjs`, `codemod-strip-dark.mjs`
   - `scripts/migrate-chart-tokens.ts`, `audit-chart-tokens.ts`
   - `scripts/audit-brand-casing.mjs`, `audit-cta-strings.mjs`, `audit-i18n-consistency.ts`, `audit-jsonld.mjs`, `audit-outbound-links.mjs`, `audit-tool-count.mjs`, `audit-tr-faq-parity.mjs`, `audit-tr-orphans.mjs`, `audit-tr-translation-orphans.mjs`, `audit-translations.ts`
   - (Verify each isn't referenced in `package.json` scripts or `.github/workflows/` before deleting.)
3. Delete `src/App.css` (Vite default leftover, not imported).

## Phase 2 — Unused shadcn/ui Components

Delete the following from `src/components/ui/` — none are imported anywhere:
`aspect-ratio, breadcrumb, button-group, carousel, command, context-menu, drawer, empty, field, form, hover-card, input-group, input-otp, item, kbd, menubar, navigation-menu, resizable, sidebar, spinner, toggle-group, toggle`

Also clean dead named exports inside *kept* ui files (e.g. `AlertDialogPortal`, `DialogPortal`, `Sheet*`, `Select*`, etc.) — listed in the knip report.

## Phase 3 — Unused Dependencies (bundle win)

Remove from `package.json` after Phase 2 deletes their consumers:
`@hookform/resolvers, react-hook-form, @radix-ui/react-aspect-ratio, @radix-ui/react-context-menu, @radix-ui/react-dismissable-layer, @radix-ui/react-hover-card, @radix-ui/react-menubar, @radix-ui/react-navigation-menu, @radix-ui/react-toggle, @radix-ui/react-toggle-group, @radix-ui/react-compose-refs, @radix-ui/react-context, cmdk, embla-carousel-react, input-otp, lodash-es, lottie-web, react-resizable-panels, vaul, axe-core, @types/serviceworker, @tailwindcss/typography`

Verify `react-router` removal carefully (we use `react-router-dom`). Add `lighthouse` and `chrome-launcher` as devDeps (currently unlisted, used by `scripts/lighthouse-homepage.mjs`).

## Phase 4 — Legacy Placement & Stale Feature Files

Delete confirmed-unused legacy placement layer (V2 SlotA–D is the only system referenced by `PreFAQPlacement` shim):
- `src/components/placement/Zone1SlimBanner.tsx` → `Zone5Companion.tsx`
- `src/components/placement/SmartCalculatorLayout.tsx`
- `src/components/monetization/ContextualAffiliateStrip.tsx`

Delete other unreferenced UI:
- `src/components/BitcoinStorySection.tsx`, `HowItWorksSection.tsx`, `InvestmentChart.tsx`, `LiveBitcoinPrice.tsx` (superseded by `CompactLiveBitcoinPrice`), `PurchaseComparison.tsx`, `ROIGauge.tsx`, `ResultsSection.tsx`
- `src/components/advanced/AdvancedChart.tsx`, `MonteCarloPanel.tsx`, `ProfessionalResults.tsx`, `RiskAnalysisPanel.tsx`
- `src/components/optimized/MemoizedProfessionalResults.tsx`
- `src/components/cinematic/AppComingSoonSection.tsx`, `HeroLivePriceTicker.tsx`, `ScrollZoomImage.tsx`, `WhyThisToolFAQ.tsx`
- `src/components/calculator/CalculatorPageShell.tsx`, `callout/Callout.tsx`, `comparison/ProgressBar.tsx`, `faq/FaqSection.tsx`, `layout/StickyActionBar.tsx`, `learn/ReadTheGuideCard.tsx`
- `src/components/modern/ModernDCAChart.tsx`, `ModernPurchaseComparison.tsx`
- `src/components/motion/CountUp.tsx`, `StaggerGroup.tsx`, `TiltCard.tsx`
- All `*ExportReport.tsx` listed by knip (avg-buy, bitcoin-loan, inheritance-tax, pizzaday, price-target, profit-loss, wealth) and `WealthShareCard.tsx`

Delete unused hooks:
`useFluidSpacing, useMouseParallax, usePerformanceOptimization, useReducedMotion, useResponsiveDesign, useSanitization, useScrollProgress, useTilt, useTypewriter`

Delete unused libs/utils:
`src/lib/config.server.ts`, `lib/lovable-error-reporting.ts`, `lib/motion.ts`, `utils/performance.ts`, `utils/sanitizer.ts`, `data/calculatorToArticle.ts`, `test/lottie-react-stub.tsx`

## Phase 5 — Dead Exports (no file deletion)

Strip 105 unused named/default exports and 81 unused exported types flagged by knip (purely additive removal — no behavior change). Largest hotspots:
- `services/*` calculators with unused helper exports (~25 items)
- `components/share-export/*` re-exports
- `components/charts/{formatters,theme}.ts`
- `utils/{formatCurrency,formatTRY,shareLink}.ts`

For files with both `export X` and `export default X`, drop the `default` (53 files) — keep named exports only; reduces import-pattern drift.

## Phase 6 — Supabase Edge Functions Verification

Knip flagged 14 `supabase/functions/*` as unused, but they're invoked at **runtime** (HTTP), not imported. **Do not delete**; instead add them to knip's `ignore` list to silence false positives. Verify each function still has a valid `config.toml` entry.

## Phase 7 — Public Assets

Audit `public/sw.js` — currently a cleanup-only worker. Confirm it's still registered in `index.html`; if not, delete it.

## Verification Gates

After each phase:
1. `bunx tsgo --noEmit` → 0 TS errors
2. `npm run build` → succeeds, log bundle size delta
3. `node scripts/audit-tr-coverage.mjs` → still passes
4. `node scripts/audit-legacy-placements.mjs` → still passes
5. Smoke nav (Playwright) on `/`, `/explore-calculators`, `/tr`, one calculator

## Expected Outcomes

- **~50 files deleted**, ~3000 LOC removed
- **~22 npm packages removed** → expect 200–400 KB smaller `node_modules`, measurable JS bundle drop (Radix + lottie + embla + lodash-es alone are ~150 KB gz)
- **Cleaner import graph**, faster cold builds, fewer false signals in future audits
- **One canonical export style** (named only)

## Out of Scope

- Refactoring `src/components/RelatedCalculators.tsx` (53 KB but actively used — needs separate plan)
- Splitting `translations/en.ts` / `tr.ts` (96 KB / 107 KB — needs i18n lazy-load redesign)
- Reworking `index.css` (70 KB — design-system concern, not dead code)

## Execution Order

Phase 1 → 2 → 3 → 4 → 5 → 7, with build/typecheck gate between each. Phase 6 is config-only and can run anytime. I'll batch deletes in parallel within each phase and re-run knip at the end to confirm a clean slate.
