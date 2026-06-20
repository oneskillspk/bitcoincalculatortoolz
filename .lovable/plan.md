# Bitcoin Retirement Calculator — Phase-by-Phase Fix Plan

Source of truth: `retirement-page-implementation-plan.md` (attached). This plan mirrors that 8-phase order exactly. Each phase ships as its own message — wait for verification before sending the next. Scope is locked to `src/pages/BitcoinRetirementCalculator.tsx` and `src/components/retirement/*`; no other calculator pages or global tokens are touched (Phase 1 adds one new file only).

---

## Phase 1 — Shared layout primitive `<PageSection>`

Create `src/components/calculator/PageSection.tsx` and export from `src/components/calculator/index.ts`.

Props:
- `tone?: 'default' | 'subtle' | 'dark'` → bg = white / `hsl(var(--muted))` / `hsl(var(--foreground))` (auto `text-background` on dark)
- `width?: 'wide' | 'prose'` → `max-w-6xl` / `max-w-3xl`
- `spacing?: 'tight' | 'default' | 'loose'` → `py-12` / `py-16 md:py-20` / `py-20 md:py-28`
- `eyebrow?: string` → rendered with existing `calc-text-label`
- Wrapper: `<section><div class="container mx-auto px-6 max-w-*">...`

Not applied to any page yet. Verify all 3 tones × 2 widths × 3 spacings render cleanly in isolation.

## Phase 2 — Visual zone architecture

In `BitcoinRetirementCalculator.tsx`, wrap post-calculator sections into 4 zones using `<PageSection>`. No copy or logic edits.

- **Zone 1** Hero + Tabs/calculator grid → unchanged.
- **Zone 2** `tone="subtle" width="wide" spacing="default" eyebrow="By the Numbers"` → wraps `RetirementComparisonTable` + `RetirementBtcScenariosTable`.
- **Zone 3** `tone="default" width="wide" spacing="loose" eyebrow="How It Works"` → wraps the SEO H2 block, `RetirementContentSections`, `RetirementFourPercentRule`, `RetirementThreeModes`, `RetirementHowItWorksSection`.
- **AffiliatePlacement** stays outside any zone, unchanged.
- **Zone 4** `tone="dark" width="wide" spacing="loose" eyebrow="Questions & Sources"` → wraps `RetirementFAQSection`, `MethodologyBlock`, `RelatedCalculators`, final Disclaimer.

Flag (don't silently fix) any child that hardcodes light-bg-only colors and would go low-contrast in Zone 4.

Verify on `/calculators/retirement` and `/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi`.

## Phase 3 — Kill content redundancy

- Keep table #2 ("How Much Bitcoin Do You Need to Retire?" — annual + monthly).
- Delete `RetirementBtcScenariosTable` content (#1) and the 1/5/10 BTC table (#3) inside `RetirementContentSections`, including headings and lead-ins. Remove orphan imports/files.
- Add a new **"Bitcoin Retirement vs. Traditional 60/40 Portfolio"** comparison (required portfolio size, withdrawal sustainability, historical volatility, same $60K/yr @ 4%). Mark figures clearly illustrative, matching existing `MethodologyBlock` disclaimer tone.
- Delete the TR-only end-of-page duplicate block ("FIRE Hareketi ve Bitcoin" / "Güvenli Çekim Oranı ve Bitcoin") before `RelatedCalculators`.

## Phase 4 — Confirmed bugs (4)

Fix in `src/components/retirement/RetirementInputsPanel.tsx`:
- Current BTC Holdings slider `max` 10 → **50**
- Monthly DCA slider `max` 5000 → **10000**
- BTC Growth Rate slider `max` 30 → **50**

Fix in `src/components/retirement/RetirementResults.tsx`:
- Replace `<span className="capitalize">{inputs.mode}</span>` with localized label map (`forecaster|planner|fire` → EN/TR strings, e.g. TR "Tahminci" / "Hedef Planlayıcı" / "FIRE Modu").

Fix TR FAQ schema parity in `BitcoinRetirementCalculator.tsx`:
- Translate the missing 8 EN FAQ items into TR JSON-LD so EN/TR are 13/13. Confirm `RetirementFAQSection.tsx` TR branch also renders 13.

Report before/after for each bug.

## Phase 5 — Input panel polish (surgical)

In `RetirementInputsPanel.tsx` only:
1. Add a muted microcopy line under the Withdrawal Strategy toggle using `calc-text-small text-muted-foreground` — EN "This determines how your results are calculated" / TR "Bu, sonuçlarınızın nasıl hesaplandığını belirler."
2. Tint per-tab empty-state icon backgrounds:
   - Forecaster → `bg-primary/10 text-primary` (unchanged)
   - Goal Planner → `bg-blue-soft text-blue-accent` (fall back to `bg-[hsl(var(--blue-accent)/0.1)] text-[hsl(var(--blue-accent))]` if utility classes don't resolve)
   - FIRE → `bg-warning/10 text-warning`

No structural or copy changes beyond the above.

## Phase 6 — Results panel: honest progress metric

In `RetirementResults.tsx`:
- Remove the `* 0.1` benchmark. New formula:
  `retirementProgress = Math.min(100, (currentPortfolioValue / metrics.totalFiatValueAtRetirement) * 100)`
- Rename heading: EN "Current Holdings vs. Target" / TR "Mevcut Varlık vs. Hedef".
- Update tooltip: EN "What percentage of your final retirement fund you already hold in Bitcoin today." / TR "Bugün zaten elinizde tuttuğunuz Bitcoin'in, nihai emeklilik fonunuzun yüzde kaçına denk geldiği."

Sanity-test with: age 30, 0.5 BTC, $500/mo, 15% growth, retire @ 65.

## Phase 7 — Contextual internal links (3)

Use the existing "Read our full guide…" callout pattern + `useLocalizedHref` (never hardcode EN paths).

1. End of Tax Implications section → callout to Capital Gains Tax Calculator (`/calculators/capital-gains-tax`, TR `/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi`).
2. After "Use the Forecaster tab above to model your own DCA scenario" → callout to DCA Calculator (`/calculators/dca`, TR `/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi`).
3. Under the new 60/40 comparison table → callout to `/calculators/btc-vs-real-estate` only if topically defensible; otherwise skip rather than force an irrelevant link.

Click-test each on both locales.

## Phase 8 — Final QA pass

On `/calculators/retirement` and `/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi`:
1. 4 zones render with clean backgrounds, no low-contrast text in Zone 4, no shift across the 3 tabs.
2. Exactly one BTC-income scenario table; new 60/40 table renders.
3. TR-only duplicate end-of-page block is gone.
4. All 4 Phase 4 bugs remain fixed (sliders, Investment Mode, FAQ 13/13).
5. Renamed "Current Holdings vs. Target" shows sensible % for the test case.
6. All 3 Phase 7 links route to locale-correct destinations.
7. Full top-to-bottom walk EN + TR; report anything not covered above.

Final summary confirms the page is template-ready.

## After Phase 8

Separate conversation: extract the proven patterns (PageSection zones, spacing/width presets, slider↔input parity rule, honest progress metric) into a written template spec to drive one-at-a-time redesigns of the remaining 44 calculators.

---

## Execution rules

- One phase = one message. Wait for verification before sending the next.
- Phases 1, 4, 6, 7 are independently revertible; Phases 2, 3, 5 touch overlapping JSX so keep them strictly sequential.
- No other calculator pages or global `index.css` tokens are modified during these 8 phases.
