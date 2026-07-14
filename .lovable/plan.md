
# What If Calculator → Retirement Template Migration

Bring `src/pages/BitcoinWhatIfCalculator.tsx` and `src/components/what-if/*` in line with `docs/CALCULATOR_TEMPLATE_SPEC.md`, matching the Bitcoin Retirement Calculator pass exactly.

## Current state (audit)

The page today has:
- Hero with eyebrow pill + gradient H1 + `CompactLiveBitcoinPrice` ✅ (mostly template-conforming)
- Input + Results grid ✅
- 5+ result blocks stacked without zone architecture: `ModernChart`, `ModernCrossAssetComparison`, `WhatIfScenarioInsightsPanel`, `WhatIfShareSnapshot`, `HistoricalAnalysis`
- Editorial blocks (`WhatIfContentSections`, `WhatIfWhyBitcoinGrew`, `WhatIfKeyDates`, `WhatIfRealExamples`, `NewHowItWorksSection`) each rendering their own `<section className="py-16/py-20">` with bespoke containers — no `PageSection`
- Ad-hoc SEO H2 block after SlotB (duplicates content in `WhatIfContentSections`)
- Slots A + B present; SlotC and SlotD / `PreFooterEditorialBand` missing
- No FAQ + Sources zone
- Language handled per-component with `useLanguage`; some strings inline (`language==='tr'?...:...`) rather than through `t()`
- Tables inside `WhatIfContentSections`, `WhatIfRealExamples`, `HistoricalAnalysis` do not follow the retirement mobile-card pattern uniformly

## Target architecture (matches retirement)

```text
<PlacementProvider>
  <WhatIfSeoHead />
  <PageBackground>
    <Header />
    <main id="main-content" pt-20 pb-28 md:pb-20>
      Breadcrumb
      Hero (eyebrow pill + H1 + lead + CompactLiveBitcoinPrice)
      SectionHeader H2 (calculator intro)
      InputPanel + ResultsPanel grid
      Result blocks (chart, cross-asset, insights, share)
      SlotB
      Zone 2 — By the Numbers   (tone=subtle,   wide, default)
        - WhatIfRealExamples (as table)
        - WhatIfKeyDates
      SlotC
      Zone 3 — How It Works     (tone=default,  wide, loose)
        - WhatIfContentSections (deduped)
        - WhatIfWhyBitcoinGrew
      PreFooterEditorialBand
      Zone 4 — Questions & Sources (tone=dark, wide, loose)
        - FAQ (new, JSON-LD parity EN=TR)
        - Methodology + sources
        - RelatedCalculators
        - Disclaimer
    </main>
    <Footer />
    <SlotD />
</PlacementProvider>
```

## Phase plan (one message per phase)

**Phase 1 — Prep.** No shared-primitive changes needed; `PageSection`, `SectionHeader`, `InputPanel`, `ResultPanel`, `useSmartZones` all exist. Add a shared `whatIf/SectionHeader.tsx` mirroring `retirement/SectionHeader.tsx` and a `WhatIfZoneTwo/Three/Four.tsx` skeleton (empty wrappers). No JSX moves yet.

**Phase 2 — Zone wrapping.** Wrap existing post-calculator sections into the 4 `PageSection` zones with the fixed vocabulary (tone/width/spacing/eyebrow). Add missing `SlotC` between Zone 2 and Zone 3, and `PreFooterEditorialBand` before Zone 4, and `SlotD` after Footer. Delete the ad-hoc `<section className="py-16/py-20">` wrappers inside child components; the child now renders raw content and `PageSection` provides the shell. No copy or logic edits.

**Phase 3 — Redundancy kill.** Delete duplicates:
- Remove the inline SEO H2 block (lines ~305–340) — content already lives in `WhatIfContentSections`.
- If `WhatIfContentSections` has a "Famous scenarios" block that overlaps `WhatIfRealExamples`, keep one (favor `WhatIfRealExamples` as the canonical table).
- Remove `NewHowItWorksSection` if it duplicates methodology already in Zone 3.
- Delete any TR-only end-of-page duplicate blocks and the corresponding orphan imports.
- Add at most one new comparison asset only if there is no head-to-head framing (likely skip — the page already has `ModernCrossAssetComparison`).

**Phase 4 — Confirmed bugs.**
- Hero: TR string uses escaped `\'` — verify no double-encoding in rendered output.
- FAQ parity: currently no FAQ. Add one (see Phase 4b) with equal EN/TR item counts and matching JSON-LD.
- All internal links routed through `useLocalizedHref` (audit `WhatIfWhyBitcoinGrew`, `WhatIfContentSections`, `WhatIfKeyDates`).
- No `capitalize` over raw mode keys (audit input mode label rendering in `WhatIfInputPanel` → `ModernInputPanel`).

**Phase 5 — Input panel polish.** `WhatIfInputPanel` currently just wraps `ModernInputPanel`. Reshell it in `InputPanel`:
- Title/description in header, mode toggle in `action`, `CalculateButton` in `footer`.
- Numeric slider parity (amount, date-range): slider `max` matches input's realistic bound; step values sane.
- Mode-tinted empty state icon bgs (fiat = `bg-primary/10 text-primary`, btc = `bg-blue-soft text-blue-accent`).
- Every visible string via `t()` — no inline `language==='tr'?...:...`.

**Phase 6 — Results panel: honest metric.** Add a "% to goal" progress metric only if meaningful (for this calculator, replace it with a "vs benchmark" ratio — e.g. `resultValue / benchmarkValue * 100` where benchmark = same-date S&P 500 already in `ModernCrossAssetComparison`). Tooltip literally names both sides, EN + TR. Record a sanity test case in the pass notes.

**Phase 7 — Contextual internal links.** Add up to 3 "Read our full guide…" callouts via `useLocalizedHref`, only where topically defensible (e.g. → halving-countdown from "why Bitcoin grew"; → DCA calculator from "lump sum vs DCA"; → retirement calculator from "long-term hold"). Skip any that don't fit.

**Phase 8 — Final QA.** Walk `/calculators/what-if` and `/tr/hesaplayicilar/ya-olsaydi` (verify TR slug) top-to-bottom against the Section 9 checklist. Run:
- `scripts/audit-schema.mjs`
- `e2e/retirement-mobile-audit.spec.ts` replicated as `e2e/what-if-mobile-audit.spec.ts`
- `e2e/retirement-page-visual.spec.ts` replicated as `e2e/what-if-page-visual.spec.ts`

Report before/after screenshots + any residual template deviations back, not silently skipped.

## Files touched (expected)

Page:
- `src/pages/BitcoinWhatIfCalculator.tsx`

New:
- `src/components/what-if/SectionHeader.tsx`
- `src/components/what-if/WhatIfZoneTwo.tsx`
- `src/components/what-if/WhatIfZoneThree.tsx`
- `src/components/what-if/WhatIfZoneFour.tsx` (contains FAQ + sources + related + disclaimer)
- `e2e/what-if-mobile-audit.spec.ts`
- `e2e/what-if-page-visual.spec.ts`

Edited (mostly to strip outer `<section>` wrappers and hardcoded padding):
- `src/components/what-if/WhatIfInputPanel.tsx` (Phase 5 reshell)
- `src/components/what-if/WhatIfRealExamples.tsx`
- `src/components/what-if/WhatIfKeyDates.tsx`
- `src/components/what-if/WhatIfWhyBitcoinGrew.tsx`
- `src/components/what-if/WhatIfContentSections.tsx` (dedupe)

Unchanged: `WhatIfSeoHead`, `WhatIfResultsPanel`, `WhatIfShareSnapshot`, `WhatIfScenarioInsightsPanel`, all affiliate/slot code.

## Non-goals

- No changes to `ModernInputPanel`, `ModernChart`, `ModernCrossAssetComparison`, or shared primitives — those are separate phases per spec Section 0.
- No calculation-logic changes.
- No global `index.css` token changes.

Confirm and I'll start with Phase 1.
