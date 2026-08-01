# Fix mobile bottom nav + cookie banner conflicts (WebView)

## What's wrong today

**1. Two competing navigations on mobile**
- The top bar (`FloatingNavigation`, `z-50`) shows a hamburger that opens a full side sheet with Home / Calculators / Tools / Learn / About / Contact.
- The bottom tab bar (`MobileBottomTabBar`, `z-40`) shows the *same* five destinations.
- Result in a WebView: duplicated navigation, the bottom bar floats over the open sheet's lower links, and the hamburger button competes with the tab bar for taps. The bar also auto-hides on scroll, so it appears/disappears under the user's thumb.

**2. Cookie consent banner fights the bottom bar**
- Banner is `fixed bottom-3 z-[70]` — it renders *on top of* the bottom tab bar, blocking Home/Calculators/Tools taps until dismissed.
- `body.has-consent-banner { padding-bottom: 11rem }` **replaces** the existing `padding-bottom: env(safe-area-inset-bottom) + 68px` tab-bar clearance instead of adding to it, so spacing jumps when the banner appears and disappears.
- On short screens the banner + tab bar + sticky CTA can occupy most of the viewport.

## The fix

### A. One navigation per breakpoint
- Keep the **bottom tab bar** as the primary mobile nav (native app pattern, best for WebView).
- Turn the hamburger sheet into a **secondary "More" menu**: it keeps the links the tab bar can't hold (About, Contact, Methodology, Privacy, language selector, search) and drops the five duplicates.
- Bottom bar's 5th tab ("More") opens that same sheet instead of navigating to /about, so there is exactly one overflow surface.
- While the sheet is open, hide the bottom bar (`translate-y-full`) so it never floats over sheet content.
- Stop the scroll auto-hide inside WebView/standalone display mode (`display-mode: standalone` or a `?app=1` flag) — native apps keep the tab bar pinned.

### B. Cookie banner stacking
- Lift the banner **above** the tab bar rather than over it: on `<lg`, position it at `bottom: calc(env(safe-area-inset-bottom) + 68px + 0.5rem)` so both are usable at once.
- Keep `z-[70]` (it must sit over page content) but ensure the tab bar stays reachable underneath it.
- Fix the body padding math: make `body.has-consent-banner` padding *additive* to the tab-bar clearance via a CSS custom property (`--bottom-chrome`) that both rules feed into, instead of two competing hard-coded values.
- Compact the banner on small screens: single-line copy, buttons on the same row, tighter padding, so it takes ~1 row instead of ~3.
- Sticky CTA offset (`.sticky-mobile-cta`) recalculated off the same `--bottom-chrome` variable.

### C. Verification
- Playwright at 390x844 and 768x1024: screenshot with banner visible, banner dismissed, and sheet open; assert the tab bar links are hit-testable in every state (`elementFromPoint` returns the link).
- Check no horizontal overflow and no element covers the safe-area home indicator.

## Technical notes

Files touched:
- `src/components/layout/MobileBottomTabBar.tsx` — "More" tab opens sheet, hide-when-sheet-open, WebView pin.
- `src/components/MobileNavigation.tsx` — becomes overflow menu (controlled open state, deduped links).
- `src/components/layout/FloatingNavigation.tsx` — shares sheet open state with the tab bar.
- `src/components/CookieConsentBanner.tsx` — mobile offset + compact layout.
- `src/index.css` — introduce `--bottom-chrome`, make consent padding additive, update `.sticky-mobile-cta`.
- New Playwright check under `e2e/` for mobile bottom-chrome layering.

No backend, routing, or calculator logic changes.
