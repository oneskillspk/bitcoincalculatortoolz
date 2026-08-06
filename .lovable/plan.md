# Promo card artwork: cutout (transparent) approach

Two options you asked about, compared honestly, plus the recommended path.

## Option A — Native partner creatives with background removed

Take each partner's own banner, strip the background, and place the cutout subject on our own brand-tinted panel.

What works:
- Real product/brand imagery (actual Ledger device, real exchange UI), so nothing looks "AI".
- Subject can be scaled/positioned freely, so cards fit perfectly with no letterboxing.

What breaks:
- Most native banners are *composed layouts*, not product shots: they already contain baked-in headlines, logos, legal text, and bonus numbers. Removing the background leaves that text floating, or the cutout keeps a rectangular text block — worse than today.
- A large share of creatives are remote hotlinked URLs (e.g. Ledger's affiliate image server). Those can't be pre-processed at build time; we'd have to download, edit, and re-host them, which changes the partner's approved creative — a terms-of-service risk with several IB/affiliate programs (Axi, Vantage especially).
- Quality is uneven: 320x50 and 960x150 strips have no usable subject at all.

Realistic outcome: works well for maybe 4–6 partners that have a clean product/device/card shot; fails for the rest.

## Option B — AI-generated imagery with background removed

Generate one hero object per partner (hardware wallet, card, phone with chart, coin stack), transparent PNG, then place it on our brand panel.

What works:
- Perfect, uniform fit by construction: one subject, no baked text, transparent edges, consistent lighting and scale across all 15 partners.
- No duplicate-image problem, no ToS issue, full control over crop and size.

What breaks:
- It's still generated art. That's the exact objection from last round — though the previous attempt failed mostly because of *full-scene* images with backgrounds, gradients, and fake UI. Single isolated objects on transparency read far more like real product photography and are much harder to spot as generated.
- Generic objects can't show a partner's actual product (a generated "hardware wallet" is not a Ledger).

## Recommendation — hybrid, per-partner

1. **Cutout native where the creative is a real product shot and locally hosted.** Ledger devices, Trezor, RedotPay card, phone-in-hand shots. Background removed, subject placed on our panel. Keep the partner's own product intact.
2. **AI cutout object where no usable native product shot exists.** Brokers and exchanges (Axi, Vantage, MEXC, Kraken, BTCTurk, Paribu, TradingView) get a neutral isolated object (candlestick block, card, terminal) with the partner logo overlaid by us — never a fake product.
3. **Brandmark panel stays as final fallback** for anything that fails both.

This is the only path where every card looks intentional and no card looks generated *or* letterboxed.

## What we'd build

- `src/lib/affiliateAI/panelCreative.ts`: add a per-partner `panelArt` resolution order — cutout asset → native contain → brandmark.
- New `src/assets/promo-cutouts/<partner>.png` (transparent), one per partner, plus a manifest with subject anchor and safe scale so every card composes identically.
- `PromoCard.tsx`: cutout mode renders subject at fixed bottom-right anchor on the brand gradient, with partner logo top-left. No `object-contain` box, no scrim needed.
- Keep remote-hosted partner banners untouched for their existing full-banner placements; cutouts are only for the promo grid.
- Tests: extend the existing panelCreative + PromoCard suites to assert cutout mode, anchor, and no-duplicate-subject across a 3-up grid; Playwright screenshot check on the DCA grid at mobile/desktop.

## Rollout

Pilot on the DCA calculator grid with 3 partners (one cutout-native, one AI-cutout, one brandmark) so you can compare all three modes side by side before we produce the remaining assets.
