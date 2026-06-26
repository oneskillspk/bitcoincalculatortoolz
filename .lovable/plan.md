# Fix Plan — Homepage Side Ad Blink + Double Splash

## Problem 1 — Side/sticky ad blinks over "Explore Calculators"

**Root cause.** `Index.tsx` renders `<PreFAQPlacement slug="home" />`, which mounts SlotB + SlotC inline **and** SlotD (the sticky companion). SlotD uses an `IntersectionObserver` against `[data-slot-d-collision]` and the Footer to auto-hide; as the user scrolls past `PremiumCalculatorCards` and the lazy below-fold section, the observer toggles `visible ↔ hidden` every few frames → the blink. The homepage doesn't need a sticky affiliate at all — it already has a dedicated inline sponsor strip.

**Fix.**
1. Add a `disableSlotD?: boolean` prop to `PreFAQPlacement` (default false).
2. When true, render only `SlotB` + `SlotC` and skip `<sz.SlotD />` entirely (no observer, no portal, no animation).
3. In `src/pages/Index.tsx` and `src/pages/TurkishHome.tsx`, pass `disableSlotD`.
4. Wrap the inline sponsor block in a fixed `min-h` container so the lazy-loaded card doesn't cause layout shift when it hydrates (kills the secondary "jump" that reads as a blink).

No other pages change — calculators keep their sticky companion behavior.

## Problem 2 — Ugly / double splash screen

**Root cause.** Three loaders can show in sequence on a cold load:
- Inline `.splash-container` in `index.html` (the real splash).
- `RouteLoadingFallback` in `App.tsx` (thin progress bar — fine).
- `LoadingSpinner fullScreen` exported from `src/components/LoadingSpinner.tsx` — still imported by some routes/Suspense boundaries, which paints a *second* full-screen "Calculating…" card right after the inline splash fades. That's the "double splash" the user sees.

Additionally the inline splash visual is dated: oversized italic-ish headline, gray pill, no logo, low contrast subtitle.

**Fix.**
1. **Single splash source.** Audit usages of `<LoadingSpinner fullScreen />` and `LoadingSpinner` as a Suspense `fallback`. Replace any route-level/full-page usages with the existing `RouteLoadingFallback` (thin top progress bar). Keep `LoadingSpinner` only for inline post-Calculate result loaders.
2. **Handoff timing.** In `src/main.tsx`, keep the `app:route-ready` trigger but shorten the fade from 420ms → 260ms and drop the second `requestAnimationFrame` (one rAF is enough now that there's no second splash competing). This removes the perceived "two screens".
3. **Polish the inline splash** in `index.html`:
   - Add the bitcoin logo mark (inline SVG, no network) next to the eyebrow.
   - Tighten title scale: `clamp(1.9rem, 7vw, 3.25rem)` and remove the muted "Calculators" half-tone (looked broken on small screens).
   - Center content on mobile, left-align ≥640px.
   - Replace gray pill with a subtle bordered chip using the brand orange dot (matches favicon).
   - Add a 3-dot loader under the subtitle so users get a "working" cue even before React mounts.
   - Keep all colors as inline literals (CSP-safe, no tokens needed pre-hydration).
4. **Guard against re-injection** is already covered by `e2e/splash-no-reinject.spec.ts` — no change needed.

## Files touched

```text
src/components/placement/PreFAQPlacement.tsx   # add disableSlotD prop
src/pages/Index.tsx                            # pass disableSlotD + min-h wrapper
src/pages/TurkishHome.tsx                      # pass disableSlotD
src/main.tsx                                   # tighter fade, single rAF
index.html                                     # restyled inline splash markup + CSS
src/components/LoadingSpinner.tsx              # default fullScreen=false (already), audit callers
src/App.tsx + any route using LoadingSpinner as Suspense fallback  # swap to RouteLoadingFallback
```

## Verification

- Manual: load `/` and `/tr`, scroll through Explore Calculators → no sticky element appears, no blink.
- Manual: hard-reload `/` on throttled 3G in DevTools → one splash, smooth fade, no second full-screen loader.
- `bunx playwright test e2e/splash-no-flash.spec.ts e2e/splash-no-reinject.spec.ts e2e/splash.spec.ts` should stay green.
- `bunx tsgo --noEmit` clean.

## Out of scope

- Calculator pages keep SlotD (revenue-relevant; their blink fix already shipped via the IntersectionObserver work).
- No changes to affiliate decision/scoring engines.
