# Premium promo card artwork: unique per partner, Bybit-grade quality

Two problems to fix in the promo cards:

1. The panel art looks AI-generated and generic — not the ultra-clean, hyperreal,
   studio-lit 3D look of the Bybit reference creatives.
2. Two different partners can show the exact same image, because art is picked by
   *category*, not by partner. There are only 4 art files (trading, security,
   rewards, exchange) shared across 14 partners — so Coinbase, Kraken, MEXC,
   Paribu, BTCTurk, Swan all resolve to the same exchange image.

## What changes

### 1. One unique illustration per partner

Replace the 4 category images with a per-partner art map keyed on the affiliate
id (ledger, trezor, swan_bitcoin, koinly, btcturk, kraken, coinbase, mexc,
paribu, bybit, tradingview, coinledger, redotpay, axi). Category art stays only
as a last-resort fallback for a partner with no dedicated file, and the fallback
picker de-duplicates within a rendered grid so two visible cards never repeat
the same image even in the fallback path.

### 2. Bybit-grade art direction

Each image is generated at premium quality, 1600x1000 (16:10, full-bleed so
`object-cover` never crops meaningfully), following one fixed art bible:

- Studio product-photography look: soft white/light-grey seamless backdrop with
  a subtle gradient floor, gentle contact shadow, no busy scenery.
- Hero object rendered in brushed metal / glass / matte plastic with realistic
  reflections and soft global illumination — the Cybertruck-showroom and
  metallic-gift-box references, not flat vector cartoons.
- Exactly one accent colour per image, taken from that partner's `logo_color`
  (e.g. Coinbase blue, Axi red, Bybit amber, RedotPay pink), everything else
  neutral silver/white/graphite.
- Zero text, zero logos, zero wordmarks inside the art (the card already
  overlays the partner name chip; baked-in text would look like a banner ad and
  can misrepresent the brand).
- Subject placed left-of-centre with clean headroom so the top gradient scrim
  and the name chip never sit on top of the subject.

Per-partner subjects, all in that same studio language:

| Partner | Subject |
| --- | --- |
| ledger / trezor | metallic hardware wallet device on a pedestal, one glowing key motif |
| swan_bitcoin / kraken / coinbase / mexc / paribu / btcturk | distinct coin/vault/orb compositions, differentiated by object and accent colour |
| koinly / coinledger | chrome document + calculator forms, ledger sheets |
| bybit / tradingview / axi | glass candlestick and arrow sculptures on a chrome plinth |
| redotpay | floating brushed-metal payment card with light ribbon |

### 3. Weight and performance

Current PNGs are ~1 MB each; 14 of them is unacceptable on a Core Web Vitals
page. All new art ships as compressed WebP (target under 90 KB each), lazily
loaded, with `width`/`height` set as today. Old PNGs are removed.

## Technical notes

- `src/components/affiliateAI/PromoCard.tsx`: swap `CATEGORY_ILLUSTRATION` for
  `PARTNER_ILLUSTRATION` keyed by `affiliateId`, keeping the category map as
  fallback; accept an optional `artIndex` used by the grid to rotate fallback
  art so duplicates cannot appear side by side.
- `src/components/affiliateAI/PromoGrid.tsx`: pass the index and, before render,
  assert the chosen art of each card is distinct.
- New assets under `src/assets/promo/` as `<partner>.webp`.
- `src/components/affiliateAI/__tests__/PromoGrid.test.tsx`: add a test that a
  3-card grid renders three different `src` values, and that every partner id in
  `affiliates.config.ts` has a mapped image.
- Verify at 1280 and 375 with Playwright screenshots after the swap.

## Scope

Only the promo card imagery and its mapping. No changes to scoring, tracking,
UTM, placement, or copy.
