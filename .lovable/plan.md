# Task 1.2 & 1.3 — Corrected Plan

## Scan results before planning

**`h-screen` / `100vh` actual occurrences in `src/`:**

Full-page wrappers (safe to migrate to `dvh`):
- `src/pages/admin/AdminLogin.tsx:54` — `min-h-screen`
- `src/pages/admin/AdminDashboard.tsx:24,29,41` — `min-h-screen` (3×)
- `src/pages/Unsubscribe.tsx:100` — `min-h-screen`
- `src/pages/TurkishNotFound.tsx:21` — `min-h-screen`
- `src/pages/TurkishHome.tsx:149` — `min-h-screen`
- `src/pages/NotFound.tsx:29` — `min-h-screen`
- `src/pages/Index.tsx:122` — `min-h-screen`
- `src/pages/AffiliatePlacementQA.tsx:52,60,169` — `min-h-screen` (3×)
- `src/pages/AffiliateDisclosure.tsx:33` — `min-h-screen`
- `src/components/modern/PageBackground.tsx:23` — `min-h-screen` (shared wrapper)
- `src/index.css:423` — `min-height: 100vh` (global body/root style)

**Keep as-is (intentional / non-layout):**
- `src/components/ui/toast.tsx:17` — `max-h-screen` on the toast viewport. Radix expects viewport-relative max; `dvh` changes on scroll and causes toast jumps. **Keep.**
- `src/components/motion/HeroScrollTimeline.tsx:163` — `h-screen` on a `sticky top-0` scroll stage. Switching to `dvh` makes the sticky stage resize while the address bar collapses, which breaks the GSAP timeline math. **Keep**; the related `100vh` comment at L144 is documentation.
- `src/styles/motion-tokens.css:179` — `height: 100vh` inside a motion utility used by the same scroll stage. **Keep** for the same reason.

The audit prompt's "~30 file" estimate was high — most calculator pages render inside a single `PageBackground` wrapper, so fixing that one component covers them transitively. Total real edits: **12 files** + Tailwind config.

## Task 1.2 — Plan

1. Add to `tailwind.config.ts` under `theme.extend.height` AND `extend.minHeight`:
   ```ts
   dvh: '100dvh', svh: '100svh', lvh: '100lvh'
   ```
   (Both `height` and `minHeight` keys, so `h-dvh` and `min-h-dvh` both work.)
2. Replace `min-h-screen` → `min-h-dvh` (and any `h-screen` page wrapper → `h-dvh`) in the 12 files listed above.
3. Update `src/index.css:423` `min-height: 100vh` → `min-height: 100dvh`.
4. Leave the 3 "Keep as-is" files untouched (documented above).
5. Output a change report (file, old, new).

## Task 1.3 — Corrections to the prompt

The prompt's page list has problems I'll correct before edits:

- **Naming**: result containers live in component files, not page files. I'll target the actual result components under `src/components/<calc>/...ResultsPanel.tsx` (or equivalent) rather than the page shells.
- **Duplicates in the list**: `BitcoinLotSizeCalculator` appears twice — dedupe.
- **Non-existent / hub pages**: `BitcoinArbitrageCalculator`, `BitcoinDominanceCalculator`, `BitcoinSupplyCalculator`, `BitcoinCorrelationCalculator`, `PiToBitcoinCalculator` are info/visualization pages without an interactive result panel that toggles on `hasResult`. I'll skip these and note them in the report instead of bolting `aria-live` onto static content (which would spam SR users on every re-render).
- **Already covered (besides Retirement/DCA)**: `WhatIfResultsPanel.tsx` and `ZakatResultsPanel.tsx` already exist — I'll verify and only add `aria-live` if missing.

### Plan
1. For each calculator in the corrected list, locate the result component (grep for `hasResult`, `Results`, `ResultsPanel`, `ResultPanel`).
2. Add to the outermost result wrapper that mounts conditionally on result presence:
   ```tsx
   aria-live="polite"
   aria-atomic="true"
   aria-label="Calculator result"
   ```
3. If a result panel renders unconditionally and only its inner numbers change, place `aria-live` on the numbers wrapper, not the whole card, to avoid SR re-announcing headings.
4. Skip the 5 non-result pages above; report them as "N/A — no dynamic result panel".
5. Output: files changed, element receiving `aria-live`, total count, plus the skipped list with rationale.

## Execution order
1. Tailwind config + `index.css` token.
2. 12 wrapper file edits (parallel).
3. Locate + edit ~22 result components (parallel batches).
4. Final report.

Approve to proceed.
