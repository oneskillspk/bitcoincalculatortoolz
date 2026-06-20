## Goal
Fix two mobile UX defects: (1) tooltips don't open on tap, (2) affiliate banners pop in late after scroll.

---

## Part 1 — Mobile tooltips

### Root cause
`src/components/ui/tooltip-info.tsx` wraps Radix `Tooltip`, which is hover-only. Touch devices have no hover, so the help icons next to inputs/results are effectively dead on phones.

### Fix
Make `TooltipInfo` **tap-to-toggle on touch, hover on desktop**, without changing any caller. Keep the same props (`content`, `side`, `className`, `triggerClassName`).

Approach: convert the internal implementation to a small controlled wrapper that:
- Detects pointer capability once via `window.matchMedia('(hover: none)')`.
- On touch (`hover: none`): render a Radix `Popover` (tap opens, tap-outside / Escape closes, traps focus correctly, accessible).
- On hover-capable pointers: keep the existing Radix `Tooltip` behavior (hover + focus open, no behavior change for desktop users).
- Public API of `TooltipInfo` is unchanged — zero changes to the ~20 call sites.

Also:
- Bump the trigger hit area on mobile from 16×16 to ~24×24 (Apple HIG / Material minimum-ish without enlarging the visible icon) by adding invisible padding via `before:` pseudo, so we don't visually change the input rows.
- Add `aria-expanded` and proper `aria-controls` on the trigger when in popover mode.

### Files touched
- `src/components/ui/tooltip-info.tsx` — rewrite internals, keep export + props.
- (no other component edits — callers stay identical)

### Verification
- Manual: open `/dca-calculator` and `/lightning-network-calculator` on mobile viewport (375×812), tap several help icons → popover opens, tap outside → closes.
- Desktop hover still works at 1280+.
- `prefers-reduced-motion`: no animation regression (Popover respects it).
- Run existing test suite (no caller changes, so should pass).

---

## Part 2 — Affiliate banner late-load

### Root causes
1. `useAffiliateAI` performs `fetchDecision(ctx)` asynchronously and renders `null` while `loading=true`. No reserved space, no skeleton.
2. `ImageBanner` `<img>` has `loading="lazy"` — browser delays the fetch until it's near the viewport, *after* the decision resolves. Double waterfall on mobile.
3. On the homepage the banner sits after `<LazyBelowFoldContent>`, so the user often arrives at the slot before step 1 finishes.

### Fix

**A. Reserve space + show skeleton during decision fetch**
- In `src/components/affiliateAI/AffiliatePlacement.tsx`, when `loading=true` (and not `hidden`/`shadow`), render a placeholder div that matches the expected banner box (≈90 px tall, full width within container). Eliminates CLS and gives the slot presence so the layout is stable as soon as the user scrolls in.

**B. Eager-load image banners that are forced or above-the-fold-ish**
- In `ImageBanner`, change `loading="lazy"` → `loading="eager"` **only** when `forceAffiliateId` is set OR `zone === 'inline'` on the homepage placement (the home banner is a forced Ledger inline placement — see `src/pages/Index.tsx`). For unforced/below-fold placements keep `lazy`.
  - Implementation: thread an optional `eager?: boolean` prop from `AffiliatePlacement` → `ImageBanner`, defaulting to `true` when `forceAffiliateId` is set.
- Add `fetchpriority="high"` to the same eager `<img>` so mobile browsers prioritize it on slow links.

**C. Start the decision fetch earlier on the homepage**
- In `src/pages/Index.tsx`, lift the `useAffiliateAI`/preconnect timing so the home banner's `forceAffiliateId="ledger"` path resolves synchronously. (Already synchronous because `forceAffiliateId` short-circuits to `buildForced()` in `useAffiliateAI` — confirmed by reading the hook.) So no code change needed here; the skeleton fix in (A) + eager image in (B) is sufficient.

**D. Preconnect to the affiliate image origin**
- Add a `<link rel="preconnect">` (and `dns-prefetch` fallback) in `src/pages/Index.tsx` Helmet for the Ledger creative image origin, so mobile saves ~100–300 ms on first banner paint.

### Files touched
- `src/components/affiliateAI/AffiliatePlacement.tsx` — add skeleton during `loading`, add `eager` prop wiring on `ImageBanner`, add `fetchpriority="high"` when eager.
- `src/pages/Index.tsx` — add `preconnect`/`dns-prefetch` hint for the affiliate image CDN.

### Verification
- Throttle DevTools to "Slow 4G" + mobile 375×812. Hard reload `/`, scroll to bottom. Skeleton should be visible immediately as you arrive at the slot; image should already be decoded.
- Check Network panel: image request fires before scrolling reaches it (eager + preconnect).
- Lighthouse mobile: CLS should not regress (skeleton has same height as banner).
- Run `bunx vitest run src/lib/affiliateAI` to make sure the rendering changes don't break the snapshot tests.

---

## Out of scope
- Not changing affiliate scoring, formats, or any backend.
- Not changing tooltip *content* anywhere.
- Not touching footer, hero, or unrelated mobile bugs.

---

## Risk
- Low. Tooltip change preserves the public API and adds a touch-only branch. Affiliate change adds a skeleton + opt-in eager flag — no scoring or routing logic touched. Both are presentation-layer.
