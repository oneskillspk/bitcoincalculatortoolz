# Homepage audit — fix plan

Findings from the last audit, grouped by priority. Combined score today: **8.3 / 10** (Desktop 7.8, Mobile 8.8).

## P0 — Desktop blank gap (blocker)

**Symptom:** ~1500px of empty cream between "Explore all tools" and the affiliate strip / footer when the page is rendered in one pass (slow connections, full-page screenshots, prerendered HTML).

**Cause:** `EagerSection` in `src/components/optimized/LazyBelowFoldContent.tsx` was double-gated — `useAfterLCP` AND IntersectionObserver. The LCP gate was already relaxed in the previous turn; the first below-fold section is now `immediate` and the rest use a 1200px IO margin.

**Action**
- Verify with `e2e/homepage-desktop-belowfold-mount.spec.ts` (already added).
- If gap still shows in CI screenshots, drop the IO entirely for `UltraModernAssetComparison` + `FAQSection` and let `lazyWithRetry` + `Suspense` handle the deferral.

## P1 — Manifesto contrast tuning

**Symptom:** Pre-reveal manifesto text borderline at small sizes.

**Action**
- Already lifted opacity 0.12 → 0.38 in `WordReveal.tsx` and caption to `text-foreground/80`.
- Add `e2e/homepage-lazy-and-manifesto.spec.ts` contrast test to CI required checks so regressions fail PRs.

## P2 — Footer balance after "Read the guide" removal

**Action**
- Already rebalanced columns and icon spacing.
- Keep `e2e/footer-responsive-visual.spec.ts` snapshots updated for 390/768/1366 widths.

## P3 — Newsletter checkbox

**Action**
- Sizing fix shipped; consent submit covered by `src/test/newsletter-consent.test.tsx`.
- No further work unless a regression appears.

## P4 — Nice-to-have polish

- **Live BTC sparkline:** gradient fill already deepened (0.38 → 0.02). Optional: add a 1px highlight stroke on the latest data point.
- **Mobile page length:** consider collapsing the "all 46 tools" grid behind a "Show more" toggle (saves ~6 screenfuls on mobile). Behind a feature flag first.
- **`useAfterLCP` cleanup:** now unused by `LazyBelowFoldContent`. Audit other call sites; delete the hook if nothing else imports it.

## Suggested order

1. Run the new `homepage-desktop-belowfold-mount.spec.ts` in CI; confirm green at 1366×900.
2. Promote the manifesto contrast spec and the footer responsive spec to required checks.
3. Sweep `useAfterLCP` usages; remove if orphaned.
4. Spike the mobile "Show more" toggle behind a flag, measure scroll depth before rolling out.

## Technical notes

- Files in scope:
  - `src/components/optimized/LazyBelowFoldContent.tsx`
  - `src/hooks/useAfterLCP.ts` (deletion candidate)
  - `src/components/cinematic/WordReveal.tsx`, `EditorialStatement.tsx`
  - `src/components/Footer.tsx`, `NewsletterSection.tsx`
- Tests:
  - `e2e/homepage-desktop-belowfold-mount.spec.ts` (new)
  - `e2e/homepage-lazy-and-manifesto.spec.ts`
  - `e2e/footer-responsive-visual.spec.ts`
  - `src/test/newsletter-consent.test.tsx`
- Risk: lowering the IO margin or making sections `immediate` increases initial JS execution; keep CalculatorGrid as the only `immediate` section and rely on IO + Suspense for the rest.
