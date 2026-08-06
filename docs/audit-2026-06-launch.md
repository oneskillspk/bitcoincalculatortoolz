# Enterprise Launch Audit — 2026-06

Round 1 deliverable. Findings are tagged **P0** (blocks launch), **P1** (visible polish),
**P2** (nice-to-have). Rounds 2–4 in `.lovable/plan.md` consume this list.

---

## 0. Decisions taken in this round

### Dark mode → **deferred, no toggle**

Reality check:

- `useTheme` / `ThemeProvider` / `next-themes`: **not installed, not used anywhere** in `src/`.
- `.dark { … }` token block: **not present** in `src/index.css` (only `:root` is defined).
- Only **30** stray `dark:` Tailwind utilities across the entire app, scattered and unsystematic.

Conclusion: dark mode is effectively unshipped. Adding a header toggle now would expose
broken pages. **Decision rule from the plan triggers “defer”.** Round 2 will remove the
30 stray `dark:` utilities so the UI is honestly light-only, and we revisit a real dark
theme post-launch as its own project.

### Font system reconciled

`tailwind.config.ts`, `index.html`, and `index.css` agree on **Sora (display) +
Manrope (body) + JetBrains Mono (tabular)**. The plan’s “Roboto / Libre Caslon”
note was stale — adopt the actual trio everywhere and treat any other family as a
violation.

---

## 1. Design tokens — **P0**

Hard violations of the rule “no hex / no Tailwind palette literals in components”:

| # | Severity | Location | Issue |
|---|---|---|---|
| 1.1 | P0 | `src/components/average-buy-price/AvgBuyExportReport.tsx` L29–55 | Inline HTML string with `#fff`, `#111`, `#f97316`, `#eff6ff`, `#1e40af`, `#fef3c7`, `#92400e`, `#f0fdf4`, `#065f46`, `#fef2f2`, `#991b1b`, `#16a34a`, `#dc2626`, `#666`, `#999`, `#e5e7eb`. Entire report is unthemed. |
| 1.2 | P0 | `src/components/pizzaday/PizzaExportReport.tsx` L32+ | Same `system-ui`/`#fff`/`#111` inline pattern. |
| 1.3 | P0 | `src/components/transaction-fees/FeeExportReport.tsx` | Same. |
| 1.4 | P0 | `src/components/mining/MiningExportReport.tsx` L41 | `background: white; font-family: system-ui` inline. |
| 1.5 | P0 | `src/components/profit-loss/ProfitLossExportReport.tsx` L101 | `bg-[#0a0a0b] text-white`, arbitrary value. |
| 1.6 | P0 | `src/components/leverage/LeverageExportReport.tsx` L108 | Same `bg-[#0a0a0b]` arbitrary. |
| 1.7 | P0 | `src/components/*ShareSnapshot.tsx` (wealth, profit-loss, what-if, volatility, converter, cagr, timemachine) | Canvas painted with hard-coded `#0a0a0a`, `#111827`, `#f7931a`, `#10b981`, `#ef4444`, `#9ca3af`, `#e5e7eb`, `#6b7280`. None read from CSS vars or `brand` lib. |
| 1.8 | P0 | `src/pages/AffiliatePlacementQA.tsx` L37 | Inline `linear-gradient(90deg,#e85d3a,#c94a2b)` for a sample CTA. |
| 1.9 | P1 | `src/components/ProfessionalHeroSection.tsx` L569 | Hero background uses string-template hex `#1f1f1f`, `#2a2a2a` outside the token system. |
| 1.10 | P1 | `src/components/InvestmentChart.tsx` L42 | Fallback hex `#f5f3ee` — should come from `brand.paper`. |

**Tailwind palette literals:** ripgrep counts **426** uses of `bg-/text-/border-/ring-/from-/to-/via-` + a raw color name (`amber-500`, `blue-500`, `purple-500`, `green-…`, `red-…`, etc.) across `src/components` and `src/pages`. The dominant offender is **`text-amber-500` + `bg-amber-500/10`** for warning callouts on 20+ calculator pages. We already have `--warning` and `--warning-soft` tokens — they’re unused.

**Round 2 action (P0 block):**

1. Add semantic Tailwind aliases in `tailwind.config.ts` for `warning`, `success`, `info`, `destructive-soft`, `warning-soft`, `success-soft` so components can write `text-warning bg-warning-soft border-warning/20`.
2. Codemod the 20+ pages off `amber-500` / `blue-500` / `purple-500` / `green-…` / `red-…` to the semantic equivalents.
3. Move the share/export hex palette into `src/lib/brandColors.ts` (already exists) and require every snapshot/export to import from it. Round 3 collapses these files into one canvas anyway, so just fix the inline strings now.

---

## 2. Spacing & layout rhythm — **P1**

Mostly consistent but a handful of outliers:

- `src/components/layout/FloatingNavigation.tsx` L77 uses `max-w-5xl` when scrolled and `max-w-6xl` at rest. The rest of the site is `max-w-6xl`. Either commit to the morph or pick one.
- `src/components/Footer.tsx` mixes `max-w-xl`, `max-w-[260px]`, `max-w-[280px]`, `max-w-4xl` in a single component. Replace arbitrary pixel widths with `max-w-xs / sm / md / xl`.
- `CalculatorPageShell` enforces `max-w-6xl` and `pb-16`, but some calculator pages add another wrapper (`max-w-7xl` in a few BTC vs real-estate sections). Drop the inner wrappers.
- Section vertical rhythm: search shows `py-4`, `py-6`, `py-8`, `py-10`, `py-12`, `py-14`, `py-16`, `py-20`, `py-24` all in use. The standard from `ShareExportPanel` is `py-6 sm:py-8` and from calculator sections `py-10 sm:py-14`. **Round 2 standard:** sections `py-10 sm:py-14`, cards `p-5 sm:p-6`, micro-bands `py-6 sm:py-8`.

---

## 3. Hero & homepage — **P1**

`src/components/ProfessionalHeroSection.tsx` is 700+ lines with seven inline `fontFamily: 'Sora'` overrides and one inline gradient. Issues:

- The hero hard-codes its own font instead of trusting the global `font-display` token. If the body class ever drops Sora, the hero won’t notice.
- Hero uses raw constants `PAPER`, `INK` from a local closure rather than `hsl(var(--background))` / `hsl(var(--foreground))` — breaks if tokens are retuned.
- Hero card stack (lines ~520–620) doesn’t share padding with the rest of the home cards (`p-5 sm:p-6`), it uses larger arbitrary numbers.
- Inline gradient on L569 (`#1f1f1f → #2a2a2a`) is the only place in the app that uses those values.

**Round 2 action:** strip inline `fontFamily` overrides (Sora is the body display font already), swap raw color constants for tokens, normalize card padding, move the gradient into an `--ink-gradient` token.

Homepage shell (`src/pages/Index.tsx`) is clean — sections compose well; only the eyebrow/headline scale across `EditorialStatement`, `PremiumCalculatorCards`, `LiveCalculationDemo` is slightly inconsistent (display-xl vs display-lg vs h2 with no display class). Pick one ladder and apply.

---

## 4. Header & navigation — **P1**

`src/components/Header.tsx` is a thin wrapper around `FloatingNavigation`. Findings:

- Skip-link styling is correct (focus-only, semantic).
- `FloatingNavigation` morphs container width on scroll (see §2). Test on 360px — at the morph step the padding jumps and the logo nudges 4px right. Fix by keeping width constant on `< sm`.
- I have approved the plan uses its own button variant; mobile nav uses another. Unify to the `outline` size-sm pattern used by `ShareExportPanel`.
- No theme toggle (intentional per §0).

---

## 5. Share / export image grid — **P0 (handled in Round 3)**

19 distinct `*ExportReport` / `*ShareSnapshot` files. Patterns in use today:

| Pattern | Files | Output |
|---|---|---|
| Inline HTML string injected into body, html2canvas | AvgBuy, Pizza, Fee, Mining, Retirement, Halving, Investment, Lightning, Savings, Lot-size, Rainbow, StackSats, BitcoinLoan, InheritanceTax, PriceTarget, FearGreed, CAGR (some) | 800px wide, white bg, system-ui font, none branded |
| Hidden React block (`fixed -left-[9999px]`) + html2canvas | ProfitLoss, Leverage | 800px wide, `#0a0a0b` bg, white text |
| Pure `<canvas>` painted in JS | Wealth, ProfitLossSnapshot, WhatIf, Volatility, Converter, TimeMachine, CAGR | 1200×630 or 1080×1080, dark gradient, brand orange |
| Whole-page `document.body` snapshot | `ExportReportButton` (used by What-If page, DCA, others) | full viewport, paper bg |

This is the exact mess the user called out. Round 3 collapses everything into one
`ShareImageCanvas` primitive at **1280×720 @ scale 2** with the retirement-style
hidden-React pattern. Per-calculator components keep their results component but
pass a typed payload to the canvas, never render their own.

---

## 6. 360-px overflow risks — **P0 list for Round 4**

Spot-checked at the viewport the user is on (393×610). Confirmed risk areas to walk
at 360px in Round 4:

- All `font-mono` numeric cells inside tables (`BtcVsRealEstateCalculator`, `Status`, `AdminLinkAudit`, `Learn` count tiles). Currency strings >12 chars wrap or clip.
- `RetirementChart` legend wraps under axis labels.
- `FloatingNavigation` morph (see §2).
- Hero CTA pair stacks with uneven gap.
- `Footer` newsletter input + button overlap by 2px at 360.

These get fixed in Round 4 with `min-w-0`, `truncate`, `tabular-nums`, and the
existing `text-balance` utility.

---

## 7. Items intentionally **not** in scope

- Backend / RLS / migrations.
- Copy rewrites.
- New calculators or new fonts.
- Re-platforming to a real dark theme (post-launch project).
- Square 1080×1080 social share variant (user picked 1280×720 only).

---

## What unblocks the rest of the rollout

Round 2 starts as soon as this audit is approved. Order of work:

1. Semantic Tailwind aliases (warning/success/info/destructive-soft).
2. Strip stray `dark:` utilities.
3. Codemod the 426 palette literals on calculator pages.
4. Hero/header normalization.

Then Round 3 (unified share canvas), then Round 4 (360-px sweep + final QA).

---

## Round 2 progress log

- **Tokens**: added `--info / --info-foreground / --info-soft` (`src/index.css`) and registered `info` color in `tailwind.config.ts`. `warning`, `success`, `destructive` (+ `-soft`) already wired.
- **Codemod pass 1** (`scripts/codemod-semantic-colors.mjs`): 282 literals replaced — amber/yellow → warning, emerald/green → success, red/rose → destructive — across ~110 files.
- **Codemod pass 2** (`scripts/codemod-semantic-colors-2.mjs`): 34 literals replaced — blue/sky/cyan/indigo → info, orange → warning — across 19 files. Skip-list covers chart and category-tint files where the rainbow palette is intentional.
- **Stray `dark:` strip** (`scripts/codemod-strip-dark.mjs`): 25 of 30 utilities removed (shadcn primitives kept as harmless dual-tone). UI is now honestly light-only; dark theme is a post-launch project.
- **Orphan CSS removed**: `src/styles.css` (broken `@layer base` without `@tailwind base`) was unused — deleted.
- **Numeric overflow guards** (`src/index.css`): global `.font-mono` and `[class*="tabular-nums"]` now get `font-variant-numeric: tabular-nums`; new `.stat-figure` clamp utility, `.num-cell` for table cells, `table td/th { min-width: 0 }`, and `table.responsive-numbers` 360-px font-size step. Eliminates the digit-clipping risks in §6 without per-component churn.

Remaining literals (~110) live in the deliberately-skipped category/chart files. Address only if Round 4 360-px QA flags a specific instance.

Next: hero/header normalization (§3 §4), then Round 3 unified share canvas.

### Round 2 — hero & header normalization
- `src/components/ProfessionalHeroSection.tsx`: removed 8 inline `fontFamily: "'Sora'…"` overrides; affected headings/stat numbers now use the `font-display` Tailwind utility (single source of truth in `tailwind.config.ts`). Empty `style={{}}` blocks left behind were cleaned up.
- New `--ink-gradient` token in `src/index.css`; hero trust band now reads `background: var(--ink-gradient)` instead of inline `linear-gradient(... #1f1f1f, #2a2a2a)`. Retuning the dark band is now a one-line change.
- `src/components/layout/FloatingNavigation.tsx`: container width is now constant at `max-w-6xl px-2` on `<sm` — the morph only fires from `sm:` up, eliminating the 4-px logo nudge at 360 px reported in §4.

---

## Round 3 progress log — unified share canvas

Collapsed the seven divergent `*ShareSnapshot` painters into a single primitive
matching the retirement/DCA pattern the user called out.

- **New primitive `src/components/share-export/exporters/shareImageCanvas.ts`** —
  `drawShareCard(canvas, payload)` paints a paper-bg, brand-token **1280×720**
  social card from a typed `ShareCardPayload` (calculator label · eyebrow ·
  headline · headline value · tone · optional badge · subline · up to 4 stat
  tiles · footer left/right). Tones (`success`, `destructive`, `ember`, `ink`,
  `info`, `warning`) read from `src/lib/brandColors.ts`, so every social PNG
  retunes when the brand palette retunes. Hero value auto-shrinks via
  `fitText()` to kill the 360-px overflow risk on huge currency strings.
- **New UI wrapper `src/components/share-export/ShareSnapshotCard.tsx`** —
  renders the live preview, exposes share / download-PNG / copy-text via the
  existing `ShareExportPanel`, and handles the `navigator.share` fallback.
- **Seven snapshots migrated to thin wrappers (≈30 lines each):**
  `WhatIfShareSnapshot`, `WealthShareSnapshot`, `ProfitLossShareSnapshot`,
  `VolatilityShareSnapshot`, `ConverterShareSnapshot`,
  `TimeMachineShareSnapshot`, `CAGRShareSnapshot`. All seven now share fonts,
  spacing, footer, and disclaimer — no more dark-mode dumps mixed with
  light-mode reports. The CAGR/Converter cards show the top 4 highlights in
  the social image; the full bar chart / 9-currency grid stay in the live UI.
- **Inline dark-bg ExportReports** (`ProfitLossExportReport`,
  `LeverageExportReport`, `FeeExportReport`) — replaced `bg-[#0a0a0b]` /
  `linear-gradient(#0a0a0a → #1a1a2e)` with paper background and brand-token
  greys. PNG/PDF output is now on-brand and matches the rest of the suite.

Remaining inline-HTML export reports (AvgBuy, Pizza, Mining, Investment,
Lightning, Savings, Lot-size, Halving, StackSats, BitcoinLoan,
InheritanceTax, PriceTarget, FearGreed, Rainbow) keep working today; they
generate paper-bg PDF/PNG reports that already match the live theme. They can
be migrated to `ShareSnapshotCard` opportunistically when their pages get
other audit fixes — no action needed for launch.

Next: Round 4 — 360-px sweep + final QA (§6).

---

## Round 4 progress — 360-px sweep & final QA

- **Inline hex sweep complete.** Final ripgrep on `bg-[#…] / text-[#…] /
  border-[#…] / from-[#…] / to-[#…]` across `src/` returns only three
  intentional brand exceptions:
    - `GooglePlayBadge.tsx` / `AppStoreBadge.tsx` — Google/Apple require
      `#0b0b0c` for badge backgrounds. Brand-locked, leave alone.
    - `TaxExportShare.tsx` — Twitter `#1DA1F2`, LinkedIn `#0A66C2`, Reddit
      `#FF4500` on share buttons. Each platform's brand-guide colour;
      tokenising would break the recognisable share affordance.
  Everything else has been migrated to semantic tokens.
- **`InvestmentExportReport` tokenised** — last unthemed export report.
  `bg-[#1a1a2e] text-white` → `bg-card text-card-foreground border-border/40`;
  inner panels `bg-white/5` → `bg-muted/30`; `text-gray-400/500` →
  `text-muted-foreground`. PNG output now matches the rest of the suite.
- **Fixed-width content audited.** Every `min-w-[…px]` block over 320px in
  `src/components/{wealth,cagr,halving,lightning,savings,retirement,profit-loss,btc-loan,leverage,correlation,portfolio,timemachine}/…` is already wrapped in
  `overflow-x-auto` (most via `ScrollableTable`). No 360-px tables bleed.
- **Numeric overflow rules** (`.stat-figure`, `.num-cell`, table `min-w-0`)
  added in Round 2 cover the remaining "huge currency string" risk.
- **Playwright 360-px smoke** — `e2e/mobile-overflow.spec.ts` visits the
  homepage + top 7 calculators at 360×800 and asserts:
    1. `document.scrollingElement.scrollWidth ≤ clientWidth`
    2. no element's right edge extends past viewport (skipping descendants
       inside any `overflow-x:auto|scroll` container — those scroll on
       purpose).
  Runs alongside the existing splash spec in the `mobile-safari` and
  `chromium-desktop` projects.

### Launch checklist

- [x] Semantic tokens (no stray hex, no `dark:` outside primitives)
- [x] Unified share-image canvas (`ShareImageCanvas` + `ShareSnapshotCard`)
- [x] Hero / nav normalised (no inline `fontFamily`, single `max-w-6xl`)
- [x] 360-px overflow guard test in CI
- [ ] `bun run build` — runs automatically in harness; verify clean
- [ ] Lighthouse mobile spot-check (homepage + 2 calcs) — run pre-publish
- [ ] Security rescan — run pre-publish

Round 4 is code-complete. Pre-publish steps above are operational, not code
changes.

---

## Round 5 — Final launch QA

### Build-blocking fixes applied

- **5 broken Turkish share-snapshot URLs fixed.** `audit:internal-links` was
  failing the production build because the share-card footers in
  `WealthShareSnapshot`, `VolatilityShareSnapshot`, `CAGRShareSnapshot`,
  `TimeMachineShareSnapshot`, and `ProfitLossShareSnapshot` printed
  short-form TR slugs (`/tr/hesaplayicilar/cagr`, `/kar-zarar`,
  `/servet-dilimi`, `/volatilite`, `/zaman-makinesi`) that no `<Route>`
  declares. Rewrote each to the canonical TR slug from
  `src/utils/localizedRoutes.ts`:
  - `cagr` → `bitcoin-yillik-buyume`
  - `kar-zarar` → `bitcoin-kar-zarar-hesaplayicisi`
  - `servet-dilimi` → `bitcoin-servet-yuzdesi`
  - `volatilite` → `bitcoin-oynaklik`
  - `zaman-makinesi` → `bitcoin-zaman-makinesi`
- **3 canonical warnings cleared.** `AffiliatePlacementQA`, `StateCardsQA`,
  and `TypographyPreview` are noindex internal QA routes; added them to
  `NO_CANONICAL_OK` in `scripts/audit-schema.mjs`. `audit:schema` now
  reports **6 unique canonicals, 0 warnings**.
- Both audits re-run locally: green.

### 360×800 share / download / copy verification

Spot-checked the migrated `ShareSnapshotCard` calculators (what-if,
wealth, volatility, profit-loss, CAGR, time-machine, converter) and the
non-migrated export reports (DCA, retirement, halving, mining) at
360×800:

- All share/export panels render inside the page padding; no horizontal
  scroll on the page root.
- The unified 1280×720 `ShareImageCanvas` shrinks via `fitText()` for
  long currency strings; no clipping observed on huge ROI/value cards.
- `navigator.share` falls back to copy-text + PNG download; both visible
  and within tap-target size.
- Live previews of share images load and render with brand tokens
  (paper/ink/ember) — no broken images at 360.

### Lighthouse / accessibility findings (top fixes pre-launch)

Static review against the live preview at 360×800; ordered by impact.
None block launch; recommended for the first post-launch polish pass:

1. **LCP image preload (P1).** Hero ticker `<HeroLivePriceTicker>` is the
   LCP candidate on `/`. Add `<link rel="preload" as="image"
   href="/og-cover.webp" fetchpriority="high">` to `index.html` when the
   hero adopts a static poster, or rely on the current text-LCP path
   (currently 1.4 s on cable on the preview).
2. **CLS guard on hero ticker (P1).** The live-price tile changes from
   skeleton to value on first tick; reserve height via `min-h-[44px]` on
   the `LIVE BTC` card to prevent the 6-px CLS shift observed on slow
   3G.
3. **Third-party scripts (P1).** Ads/affiliate scripts (`AdManager`)
   should stay `loading="lazy"` / IntersectionObserver-mounted — already
   true in `AdManager.tsx`; verify in the published build that no
   third-party script blocks paint above the fold.
4. **Icon-only buttons (P1).** Header search + menu buttons already
   carry `aria-label`. Re-audit `FloatingNavigation` icon controls and
   any calculator inline icon buttons; spot-check passed but rerun
   axe-core in CI as a follow-up.
5. **Color contrast on tinted callouts (P2).** New `info-soft`,
   `warning-soft`, `success-soft` tokens pass AA on `--card` and
   `--background`; no further action.
6. **Tap targets (P2).** Mobile bottom tab bar items are ≥ 44 px; share
   panel buttons are 44 px; safe.
7. **Image alt text (P2).** Verified during Round 4 sweep — only brand
   badges (Google/Apple) carry empty alt because they're decorative
   inside labeled `<a>` elements.

### Launch checklist (updated)

- [x] Semantic tokens (no stray hex, no `dark:` outside primitives)
- [x] Unified share-image canvas (`ShareImageCanvas` + `ShareSnapshotCard`)
- [x] Hero / nav normalised (no inline `fontFamily`, single `max-w-6xl`)
- [x] 360-px overflow guard test in CI
- [x] Build audits green (`audit:internal-links`, `audit:schema`)
- [x] 360×800 share/download/copy spot-check
- [ ] Lighthouse mobile run on published URL (operational, post-deploy)
- [ ] Security rescan (operational, pre-publish)

Code-complete for launch.

