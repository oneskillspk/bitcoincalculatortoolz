# Promo Card Image Asset Plan + Illustration Style Guide

Goal: every promo card panel reads as one coherent, ultra high-end Bybit-like
illustration set — not stock 3D renders, not AI-looking photoreal product shots.
One unique illustration per partner, all sharing a single art bible.

## Art direction (the bible)

**Style**: stylized 3D illustration — soft-shaded volumes with clean silhouettes
and subtle line accents. Not photoreal, not flat vector. Think Bybit campaign
art: a single hero object, generous air, one accent colour, calm studio light.

**Rules that apply to every asset**

| Rule | Value |
| --- | --- |
| Canvas | 1600 x 1000 px (matches the 16:10 card panel) |
| Subject placement | Hero object left-of-centre, occupying ~45-55% width |
| Safe zone | Right ~35% kept empty (card overlays the partner name pill top-left) |
| Background | Seamless soft gradient, near-white to pale grey; no scene, no props, no floor line |
| Lighting | Soft top-left key, gentle fill, single soft contact shadow |
| Materials | Matte ceramic, brushed metal, frosted glass — soft roll-off highlights, no chrome mirror-ball |
| Palette | Neutral greys + exactly ONE partner accent colour |
| Detail budget | 1 hero object + max 2 small satellites (coin, sphere, chip) |
| Forbidden | Text, numbers, logos, brand marks, people, hands, cityscapes, keyboards, screens with UI, neon glow, dark cyberpunk, lens flare, busy particle fields |
| Format | JPG, quality ~85, target under 180 KB each |

**Accent colour per partner** comes from `logo_color` in
`src/config/affiliates.config.ts`, so the panel tint gradient in `PromoCard`
and the illustration accent always agree.

## Per-partner asset matrix

Each partner gets a distinct hero object so no two cards in a grid ever read
as the same picture, even at a glance.

| Asset | Partner | Hero object | Accent |
| --- | --- | --- | --- |
| `ledger.jpg` | Ledger | Hardware wallet on a low plinth | Ledger black/grey |
| `trezor.jpg` | Trezor | Rounded vault cube, keyhole notch | Silver-grey |
| `swan_bitcoin.jpg` | Swan | Curved swan-neck arc + single coin | Warm orange |
| `koinly.jpg` | Koinly | Folded report sheet + calculator block | Violet |
| `btcturk.jpg` | BtcTurk | Sphere balanced in a ring cradle | Royal blue |
| `kraken.jpg` | Kraken | Single curling tentacle around a coin | Indigo |
| `coinbase.jpg` | Coinbase | Upright phone + rising step blocks | Cobalt |
| `mexc.jpg` | MEXC | Stacked floating discs | Azure |
| `paribu.jpg` | Paribu | Savings capsule with coin slot | Amber |
| `bybit.jpg` | Bybit | Candlestick cluster on a disc | Orange |
| `tradingview.jpg` | TradingView | Glass panel with a rising line ribbon | Sky blue |
| `coinledger.jpg` | CoinLedger | Ledger sheet + checkmark | Emerald |
| `redotpay.jpg` | RedotPay | Card floating over a contactless arc | Crimson |
| `axi.jpg` | Axi | Upward arrow through a ring | Charcoal + orange |
| `vantage.jpg` | Vantage (add) | Layered prism steps | Deep blue |

Fallback: any partner without a bespoke asset falls back to the existing
category art, so the grid never renders an empty panel.

## Prompt template

Every generation uses the same skeleton — only the bracketed parts change:

```text
Stylized 3D illustration for a premium fintech promo card: [HERO OBJECT],
soft-shaded matte and frosted-glass materials with subtle line detailing.
Seamless pale grey-to-white gradient backdrop, soft top-left key light,
one gentle contact shadow, no floor line. Single accent colour: [ACCENT].
Subject sits left of centre, right third of the frame left empty.
Clean, modern, minimal, premium commercial illustration.
No text, no numbers, no logos, no people, no glow, no clutter.
```

Negative direction to hold: photoreal product photography, mirror chrome,
neon, dark backgrounds, stock-render look.

## Acceptance checklist per asset

1. Reads clearly at 380 px wide (the real card width on desktop 3-up).
2. Nothing important in the right third or under the top-left name pill.
3. Background blends with card surface — no visible rectangle edge.
4. Accent matches partner `logo_color` within a reasonable hue distance.
5. Cropping at 16:10 `object-cover` loses nothing meaningful.
6. Side-by-side with the other 13: distinct silhouette, same family.

## Work order

1. Regenerate all 14 existing assets against the illustration bible (current
   set is photoreal-chrome, which is off-style).
2. Add `vantage.jpg` and register it in the partner map.
3. Compress each to JPG q85 and confirm each is under 180 KB.
4. Extend `PARTNER_ILLUSTRATION` in
   `src/components/affiliateAI/PromoCard.tsx` with the vantage entry.
5. Visual pass: render a 3-up desktop grid and a 1-up mobile card, confirm
   no repeats, no letterboxing, name pill legible on every panel.

## Technical notes

- `PromoCard` already resolves art by `affiliateId` first and category second;
  this plan only changes the artwork and adds one map entry.
- Panel tint keeps using `item.program.logo_color`, so accent consistency is
  automatic once the illustrations follow the accent column above.
- Assets stay as regular imports under `src/assets/promo/` (bundled, hashed),
  not CDN pointers, so no reference rewriting is needed.
