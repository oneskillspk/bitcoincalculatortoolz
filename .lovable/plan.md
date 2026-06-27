## Why 100+ clicks ≠ revenue

Clicks are firing (we log `affiliate_click` to GA4 + Cloud), but the click → signup → funded conversion is leaking. Five concrete causes in the current code:

1. **Attribution leaks.** `appendUtm()` skips stamping when the partner URL already has `utm_source` (RedotPay, MEXC). That's fine for the network, but our **own** `sub_id` / `click_id` is never appended, so we can't tell *which page/zone* a paid signup came from inside the partner dashboard — and we have no way to optimize.
2. **Wrong offers on wrong intent.** High-intent tax pages (`capital-gains-tax`, `profit-loss`, `inheritance-tax`) currently rotate Ledger/Coinbase ahead of Koinly. Tax-software EPC is 5–10× a hardware-wallet click on those pages.
3. **Below-the-fold only.** Almost every placement is `pre-footer` / `post-result`. Google/Bing visitors who don't scroll = 0 impressions. We need a SlotA (above-result, contextual) on the top 10 traffic pages.
4. **Generic CTAs.** "Secure your BTC" on a *Profit/Loss* page converts ~0.3%. Result-aware CTAs ("Your $X gain is taxable — file it in 10 min with Koinly") convert 4–8× better.
5. **No exit-intent / sticky CTA on long pages.** Users scroll, calculate, leave. One persistent SlotD CTA per session = recovered impression.

## Plan (4 phases, ship in order)

### Phase 1 — Attribution & measurement (must ship first)

```text
utm.ts → always append sub_id = `${slug}__${zone}__${creative_id}`
       even when partner owns utm_source (use partner's own subid param:
       RedotPay=utm_s, MEXC=ref, Bybit=affiliate_id pass-through)
analyticsClient.ts → add `value` + `currency` (estimated EPC) to GA4
                     `affiliate_click` so GA4 conversions reports work
new: src/lib/affiliateAI/epc.ts — per-program estimated EPC table
new: /admin/revenue page — joins `affiliate_clicks` with EPC table to
     show estimated revenue per slug/zone/creative (catches dead zones)
```

### Phase 2 — Intent re-routing (biggest single revenue lever)

Rewrite `INTENT_MAP` in `placements.config.ts` so the **highest-EPC offer for the page's buying intent wins by default**:


| Slug family                                            | Winner      | Why                          |
| ------------------------------------------------------ | ----------- | ---------------------------- |
| capital-gains-tax, profit-loss, inheritance-tax, zakat | koinly      | Tax SaaS, $20–40 CPA         |
| dca, stack-sats, bitcoin-savings, sip, retirement      | redotpay    | Card signup + funded bonus   |
| hodl-strategy, accumulation-score, wealth-percentile   | ledger      | Self-custody intent          |
| transaction-fees, fee, mempool                         | mexc        | "Cheap fees" → exchange swap |
| volatility, rainbow, fear-greed, price-target          | tradingview | Tool-buyer intent            |
| arbitrage, comparison                                  | bybit       | Pro trader intent            |


Bump `INTENT_BOOST` from 15 → 25 so winners stop losing to wildcard `*` programs (Coinbase/TradingView currently outscore intended winners on long-tail slugs).

### Phase 3 — Placement coverage

1. **Add SlotA (above-result, contextual)** to the top 10 traffic pages — *only* shows after the first calculation so it's intent-qualified, not a banner blind. Wire through `PlacementProvider`'s claim system so it never duplicates SlotB.
2. **Pre-footer editorial band** on every page (currently only some) via the existing `PreFooterEditorialBand` — guarantees 1 impression for non-calculating visitors.
3. **SlotD sticky companion**: enable on desktop tax + DCA pages (currently mobile-only on some). One persistent CTA per session.
4. **Kill empty zones**: when `scoreAndPick` returns `null`, render the editorial fallback band instead of nothing.

### Phase 4 — Conversion-grade creative

- Result-aware CTAs: pass `resultSignals` (e.g. `gain:high`, `loss`, `long-horizon`) into `placementResolver` and pick a CTA variant from a new `cta_variants[]` field on each program. 3 variants × A/B via the existing daily-bucket seed.
- Localized creatives: Koinly + RedotPay TR localized banners (currently EN-only fallback on /tr — 30%+ of traffic).
- Trust row under each banner: "30-day cookie · 6M+ users · As seen in WSJ" — lifts CTR 15–25%.

## Files touched

```text
src/lib/affiliateAI/utm.ts            (+sub_id always)
src/lib/affiliateAI/analyticsClient.ts (+value/currency in GA4)
src/lib/affiliateAI/epc.ts            (new — EPC table)
src/lib/affiliateAI/scoringEngine.ts  (INTENT_BOOST 15→25, EPC tiebreak)
src/lib/affiliateAI/placementResolver.ts (cta_variants picker)
src/config/placements.config.ts       (INTENT_MAP rewrite, SlotA presets)
src/config/affiliates.config.ts       (cta_variants[], TR creatives)
src/contexts/PlacementProvider.tsx    (SlotA claim slot)
src/components/affiliateAI/AffiliatePlacement.tsx (trust row)
src/pages/admin/AdminRevenue.tsx      (new — revenue dashboard)
new e2e/affiliate-intent-routing.spec.ts (locks intent winners)
```

## Expected impact (rough, based on industry EPC norms)

- Attribution fix alone: unlocks optimization → +20–30% within 2 weeks of data.
- Intent re-routing: 2–4× revenue on tax/DCA pages (the biggest traffic buckets).
- SlotA above-fold on top 10 pages: +40–60% impressions.
- Result-aware CTAs: +50–100% CTR on post-result zones.

Combined realistic target: **5–10× current revenue within 30 days** of full rollout, assuming current click volume holds.

## What I need from you to start

1. Confirm I should ship Phase 1 (attribution) first — it's a prerequisite for measuring everything else and takes ~1 build. yes this one ok start with that
2. Do you have real EPC numbers from any partner dashboard (Koinly/RedotPay/Ledger)? If yes, I'll seed `epc.ts` with them; if no, I'll use conservative industry medians and let the admin page learn from actuals.