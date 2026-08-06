# Promo Cards — Placement, Imagery and Polish Fixes

Three real problems on the DCA pilot, fixed in one pass before any rollout.

## 1. Placement is too far down

Verified: on `src/pages/BitcoinDCACalculator.tsx` the promo grid sits at the very bottom of the results block — after the chart panel, the purchases table, the export/report block and the `TradingBrokerBanner`. That is several screens below the "Calculate DCA Returns" button, so it misses the highest-intent moment.

Fix:

- Move the promo grid to render **immediately after the results summary card** that appears under the Calculate button, above the chart panel — the first thing a user sees after calculating.
- Keep it inside the `dcaResult && priceData` guard so it only appears post-calculation, and keep the `InViewMount` wrapper (with a reduced `rootMargin`) so LCP is still protected.
- Remove the now-duplicated bottom placement and the stray empty `Suspense` wrapper further down the page, so the page has exactly one promo grid.
- Keep `TradingBrokerBanner` where it is (below results) so the two units never stack.

## 2. Banner images do not look clean or fit the card

Verified: `PromoGrid` picks any creative sized `1200x628 / 336x280 / 300x250 / 250x250 / 200x200` and `PromoCard` renders it `object-contain` inside a 16:9 tinted panel. Partner creatives are third-party ad banners (e.g. TradingView leaderboards) with their own baked-in text, borders and background colours — dropped into a 16:9 panel they letterbox, clash with the tint, and look like ad slots rather than Bybit-style product cards.

Fix:

- **Stop rendering third-party banner creatives inside the promo card.** The card's visual panel uses only our own art direction.
- Panel content becomes: the partner logo mark (from the existing config) centred on a soft brand-tinted gradient, plus the category illustration as a subtle right-side motif — one consistent composition for every partner.
- Only use a partner creative when it is a square/near-square logo or product render (an explicit allowlist per partner in config), otherwise fall back to our illustration. Never a stretched or letterboxed banner.
- Switch the panel to `object-cover` with a fixed 16:10 aspect and internal padding for illustrations, so every card in the row is pixel-identical in height with no letterboxing.
- Explicit width/height plus `loading="lazy"` retained → no CLS.

## 3. Badge, CTA and card polish

- **Badges**: smaller, softer pills — single status pill ("Ongoing" / "Devam ediyor") in muted tone, plus at most one emphasis pill ("Hot" / "Exclusive") in the accent tone. Never more than two. Consistent height, 999px radius, uppercase 10px with tighter tracking than today.
- **CTA**: full-width solid button pinned to the card bottom (not the current small inline pill), consistent height across all three cards, arrow icon that nudges on hover, high-contrast token pair so it reads as a real button.
- **Card**: tighter internal rhythm (single padding scale), fixed 2-line title clamp and 2-line description clamp so all three cards align row-by-row, hairline border, shadow only on hover, no per-card tint bleeding into the text area.
- **Grid**: equal-height cards enforced via `items-stretch`, consistent gap, 1 / 2 / 3 columns unchanged.

## Verification

- Playwright at 1280 and 375: screenshot the DCA page after a calculation; assert the grid appears above the chart, three equal-height cards, no letterboxed images, no horizontal overflow.
- Existing affiliate/PromoGrid tests must stay green; add a test asserting banner-shaped creatives are rejected by the panel picker.
- No rollout to other calculators until these pass.

## Technical notes

- Changes confined to `PromoCard.tsx`, `PromoGrid.tsx`, the DCA page's placement position, and a small per-partner "card-safe creative" flag in the affiliate config.
- Semantic tokens only — no hardcoded colours; brand tint stays an inline alpha of the existing `logo_color`.
- Tracking, UTM, click IDs, disclosure and the decision engine are untouched.

KEEP NOTE: ONE THINGS WE NEED TO CLEAR THESES ADS BOXES ALREDY SHOWS ALWAYS, WITHOUT TOUCHING OR TAKING ACTIONS, LIKE IN SOME CASES WHEN USER CLICK ON CALCULATION BUTTON THERE IS AFTER ADS SHOWS, WRONG, USER CLICK THE CALUCTIONS ACTION OR NOT ADS ALWAYS SHOWS BELOW THE CTA SECTION, IN SOME CALS THEERE IS MANY SECTIONS BELOW THE CALCUATIONS, LIKE RESULTS PANEL, THERE IS NO NEED TO PUSH ADS BOXES BELOW THE RESULTS ALWAYS ADS BELOW THE CALCUATION BUTTONS, HOPE YOU UNDERSTAND, ASK ME ANYTHINGS IF YOU THINK OR NEED ANY CLEARITY