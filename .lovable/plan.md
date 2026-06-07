## Goal

Rebuild the homepage hero — and lightly refine the floating header — to match the selected **Enterprise Swiss Minimalist v5** direction: paper-cream canvas, oversized Sora headline with muted "Calculators" middle word, live BTC card with a 4-up metric strip (Market Cap · Hash Rate · Difficulty · 24h Vol) above the sparkline, a Sats/$1 tile, a warm Halving Countdown tile, and a horizontal Quick Access pill bar.

All existing content, data sources, routes, i18n keys, and tests stay intact. This is a frontend/presentation change only.

## Scope

### 1. `src/components/ProfessionalHeroSection.tsx` (rebuild)
Restructure into the v5 two-column layout while keeping every existing data hook and translation key:

- Keep: `useLiveBitcoinPrice`, `useIntersectionAnimation`, parallax effect, `LocalizedLink`s for DCA/Profit/Halving/Retirement, all `t()` keys.
- Left column:
  - Pill: green pulse dot + "LIVE BITCOIN WORKSPACE" eyebrow (existing translation).
  - H1: three-line headline with the middle word ("Calculators" / Turkish equivalent) rendered at `text-ink/30` for the muted-word effect.
  - Subcopy (existing key).
  - Primary CTA: black pill "Start Free Calculations" with arrow, hover lift.
  - Trust row: stacked avatar circles + "Trusted by 50k+ hodlers" (new microcopy with TR translation).
- Right column ("workspace"):
  - **Price card** — BTC/USD eyebrow, `$price` in JetBrains Mono, decimals muted, +%change chip; below it a 4-up metric strip (Market Cap, Hash Rate, Difficulty, 24h Vol) bounded by hairlines; sparkline (reuse existing SPARK series rendered as the v5 SVG line + soft gradient fill); footer row "Network status healthy" + "Updated Xs ago".
  - **Sats per $1 tile** — mono number + "Tick" chip + thin progress hairline.
  - **Halving Countdown tile** — warm `#FFF9F2` background, days remaining + progress bar + % (wired to the existing halving data path; if not already imported, derive from `useHalvingCountdown` if present, otherwise show static keyed copy until wired).
  - **Quick Access pill bar** — horizontal row of three pill buttons linking to DCA / Profit-Loss / Retirement.

### 2. `src/components/layout/FloatingNavigation.tsx` (refinement only)
- Tighten to match v5 header: paper/80 + backdrop-blur, hairline bottom border, logo lockup (orange square + two-line wordmark), nav with active-dot indicator under "Home", search pill showing `⌘K` kbd, locale switcher. Keep all existing nav links, routes, search behavior, and language switching — only restyle.

### 3. Translations
Add the small new strings to `src/translations/index.ts`:
- `hero.trustedBy` ("Trusted by 50k+ hodlers" / TR).
- `hero.networkHealthy`, `hero.updatedAgo`.
- `hero.marketCap`, `hero.hashRate`, `hero.difficulty`, `hero.vol24h`.
- `hero.tickDown`, `hero.halvingCountdown`, `hero.days`.

### 4. Visual tokens
Use the existing `brand.*` paper/ink palette (already Paper & Ink). Where the prototype uses `#F3F2F0`, map to `brand.paper`; ember orange already exists. No new global token files needed.

### 5. Out of scope
- No backend, no data-source swaps, no route changes.
- No changes to affiliate code, tests, or anything below the hero.
- Mobile breakpoint follows the same single-column stack the current hero already uses.

## Verification

- Visual check at desktop (1440) and mobile (375) preview.
- `bunx vitest run` to confirm existing snapshots/tests still pass (hero isn't snapshot-tested but JSON-LD snapshot references hero copy — adjust only if a key changes; new keys are additive).
- Confirm live price still ticks and links route to localized paths.

## Files touched
- `src/components/ProfessionalHeroSection.tsx` (rewrite)
- `src/components/layout/FloatingNavigation.tsx` (restyle)
- `src/translations/index.ts` (additive keys)
