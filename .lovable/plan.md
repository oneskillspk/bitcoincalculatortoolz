# Replace generated promo art with each partner's own native creatives

Delete all AI-generated illustrations and drive the promo card panel from the
partner's real, official creatives that already live in the affiliate config.

## What gets removed

- All 15 generated partner illustrations in `src/assets/promo/*.jpg`
  (ledger, trezor, swan_bitcoin, koinly, btcturk, kraken, coinbase, mexc,
  paribu, bybit, tradingview, coinledger, redotpay, axi, vantage).
- The 4 older category illustrations `promo-trading/security/rewards/exchange.png`.
- The `PARTNER_ILLUSTRATION` and `CATEGORY_ILLUSTRATION` maps and their imports
  in `PromoCard.tsx`.

## What replaces them

The panel image comes from the partner's own creative set in
`src/config/affiliates.config.ts` (network-hosted banners already used by the
image-banner format), plus the CDN-hosted native assets already uploaded for
RedotPay and MEXC.

Selection rule for the 16:10 card panel, in order:

1. A creative whose aspect ratio is between 1.2 and 2.0 (e.g. 300x250, 336x280,
   850x420, 900x750, 1600x900, 1200x628, 1080x1080) — closest ratio to 16:10 wins.
2. Language match first (`lang: "tr"` on Turkish pages), then any language.
3. Deterministic pick per partner so a partner always shows the same panel image
   inside one grid render (no flicker, no duplicates across cards).

Coverage today, from the config:

| Has native banner creatives | No creatives yet |
| --- | --- |
| ledger, coinbase, mexc, tradingview, redotpay, axi, vantage | trezor, swan_bitcoin, koinly, btcturk, kraken, paribu, bybit, coinledger |

## Fallback for partners with no creative

No generated artwork. Those cards render a **brandmark panel**: the partner's
`logo_color` as a soft two-stop gradient, the partner name set large in the
brand colour, and the category label underneath. Clean, on-brand, obviously not
a stock render — and it never letterboxes because nothing is being cropped.

## Fitting the images correctly

Network banners are wildly different ratios, so cropping them with
`object-cover` would cut off logos and offer text. Instead:

- Panel keeps its 16:10 box.
- Creative is rendered with `object-contain` and centred, on a padded backdrop
  tinted with the partner's `logo_color` (very low opacity) so there is never a
  visible letterbox bar — the empty space reads as brand surface.
- Wide leaderboard shapes (ratio > 3) are excluded from panel selection entirely;
  they stay in the banner formats where they belong.
- Keep `loading="lazy"`, `decoding="async"`, explicit width/height from the
  creative record, and `onError` → fall back to the brandmark panel so a dead
  network URL never leaves a broken image.

## Technical notes

- New helper `src/lib/affiliateAI/panelCreative.ts`: `pickPanelCreative(program, lang)`
  returning `{ image_url, width, height, alt } | null`, using the ratio rules above.
- `PromoCard.tsx`: drop the image imports and maps; accept the resolved panel
  creative (or resolve it internally from `affiliateId` + `lang`); add the
  brandmark fallback and the `onError` swap. Badges, CTA, spacing unchanged.
- `PromoGrid.tsx`: unchanged apart from passing `lang` through (already does).
- Tests: extend `src/components/affiliateAI/__tests__` to assert every partner
  either resolves a creative or renders the brandmark fallback, that no selected
  creative has ratio > 3, and that a 3-card grid shows three different panels.
- Verify at 1280 and 375 with Playwright on `/calculators/dca`.

## Scope

Only the promo card panel imagery and its resolution. No changes to scoring,
tracking, UTM, placement, or copy.
