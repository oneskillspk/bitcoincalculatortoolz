# Enterprise Launch Audit — Multi-Round Plan

Goal: ship a site that reads as a $100M SaaS — consistent design system, zero overflow, branded share images, and a clean homepage/hero. Executed in 4 focused rounds so each one is reviewable.

## Round 1 — Audit report + design-system baseline

Deliverable: a written audit (`docs/audit-2026-06-launch.md`) plus surgical token fixes. No feature work yet.

1. **Static design-system sweep** across every page and shared component:
   - Token violations (hard-coded hex / Tailwind color literals instead of `hsl(var(--token))`).
   - Font usage vs. the Roboto / Libre Caslon / Roboto Mono trio — flag stray families.
   - Spacing rhythm: section padding (`py-10 sm:py-14`), container width (`max-w-6xl`), card padding (`p-5 sm:p-6`).
   - Border, radius, shadow drift across cards.
2. **Homepage + hero pass** (`src/pages/Index.tsx`, hero, story, FAQ, newsletter sections): catalog spacing/typography/CTA inconsistencies, headline scale, eyebrow style, animation feel.
3. **Header / nav consistency** — `FloatingNavigation`, mobile nav, language selector, skip-link.
4. **Dark mode reality check** — grep `dark:` usage across components, verify `.dark` token coverage in `index.css`, list components that break in dark. **Decision rule:** if ≥90% of public pages render cleanly in dark, add a header toggle (next round); otherwise defer with a one-line note in the report.
5. Output: severity-tagged findings (P0 blockers / P1 polish / P2 nice-to-have), each with the file + line. P0/P1 land in Rounds 2-3.

## Round 2 — Homepage, hero, header, design tokens

Implement P0 + P1 findings from Round 1:

- Hero: unified type scale, eyebrow, CTA hierarchy, breathing room, motion timing.
- Homepage sections: standardize section shell, eyebrow, headline, supporting copy, card grid, and CTA stripe.
- Header: align desktop + mobile, fix focus states, plus dark-mode toggle **only if** Round 1 decision was "ship it".
- Replace token violations flagged in the audit. No new components — only normalize what exists.

## Round 3 — Unified share-as-image canvas (matches retirement/DCA pattern)

Build one canonical "results-only" share card the way `RetirementExportReport` already does it, then roll every calculator onto it.

1. **New shared primitive** `src/components/share-export/exporters/ShareImageCanvas.tsx`:
   - Fixed 1280×720 off-screen wrapper (absolute, `left: -99999px`), branded frame: logo, calculator name, key metric row, secondary stats, footer URL + date.
   - Honors current theme: light frame by default, dark frame when `document.documentElement.classList.contains('dark')`.
   - Wraps existing `captureSnapshot` from `pngSnapshot.ts` with `scale: 2` → 2560×1440 PNG.
2. **Adapter API** so each calculator passes a typed `{ title, metrics: [{label, value, tone?}], footnote? }` payload — no per-calculator html2canvas calls.
3. **Migration sweep**: replace all 12 `*ShareCard` / `*ExportReport` PNG calls that currently rasterize `document.body` or a section with the new canvas. List from the audit:
   `BitcoinPriceTargetCalculator`, `BitcoinLoanCalculator`, `BitcoinPizzaDayCalculator`, `BitcoinInheritanceTaxCalculator`, `BitcoinWealthPercentile`, `BitcoinAccumulationScoreCalculator`, `BitcoinAverageBuyPriceCalculator`, `ExportReportButton` (used by What-If, DCA, others), plus any others surfaced in Round 1.
4. Keep `RetirementExportReport` as the reference; refactor it last to use the new primitive without changing its output.
5. PDF export path is left untouched — only PNG share is unified.

## Round 4 — 360px overflow + pre-launch QA

1. **360-wide sweep** (Android baseline): walk every calculator + homepage + article + admin-public page at 360×800.
   - Fix digit/number truncation (tabular-nums, `min-w-0`, `truncate`, responsive font scale, `text-balance`).
   - Fix CTA wrap, table horizontal scroll affordance, sticky-header collisions.
2. **Child-component consistency pass**: per the audit, normalize repeated patterns (result cards, stat tiles, comparison tables, FAQ accordions) to a single variant.
3. **Final QA**:
   - Run existing Playwright splash test + add a 360-px smoke that visits the top 8 calculators and asserts no horizontal scroll and no clipped numbers.
   - `bun run build` clean, Lighthouse mobile spot-check on homepage + 2 calculators.
   - Re-run security scan, confirm no regressions.

## What I will NOT do without asking again

- No backend/schema changes.
- No new calculators or copy rewrites.
- No new fonts or palette — only enforce the existing ones.
- No square 1080×1080 social variant (you chose 1280×720 only).

## Technical notes

- Share canvas lives off-screen in light theme by default; theme is read once at capture time, not snapshotted live, so the user's current UI theme doesn't flash.
- `captureSnapshot` already uses `PAPER_BACKGROUND` — extend it to accept `'paper' | 'ink'` so dark cards render on `#0f0f0f` ink, not white.
- All token fixes go through `src/index.css` / `tailwind.config.ts`; components only use semantic classes.
- Round 1 audit doc is the single source of truth for Rounds 2-4 — no scope creep beyond what's listed there.

Approve this plan and I'll start with Round 1 (audit report + token sweep).