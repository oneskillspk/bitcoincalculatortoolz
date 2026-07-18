# Vantage + Axi IB — Page Selection & Placement Plan

Goal: deploy the two IB partners only where trading intent is high, in slots that convert, without polluting the spot/tax/retirement pages.

---

## 1. Tier-A pages (ship here first — highest intent)

These are the "user is about to place a leveraged trade" pages. Both Vantage and Axi belong here.

| # | Page | Slug | Why it fits |
|---|------|------|-------------|
| 1 | Bitcoin Lot Size Calculator | `/calculators/bitcoin-lot-size` | Direct broker intent — already has broker matrix. **Flagship.** |
| 2 | Bitcoin Liquidation Calculator | `/calculators/bitcoin-tasfiye` (+EN twin if present) | User is sizing leverage → needs a broker. |
| 3 | Bitcoin Leverage Calculator | `/calculators/bitcoin-leverage` | Same intent as lot size. |
| 4 | Bitcoin Profit/Loss Calculator | `/calculators/bitcoin-profit-loss` | Active traders modeling P&L. |
| 5 | Bitcoin Risk/Reward Calculator | `/calculators/bitcoin-risk-reward` | Setup planning → execution. |
| 6 | Bitcoin Pip Value (section of Lot Size) | inline slot | Forex-flavored intent = perfect for Axi/Vantage. |

## 2. Tier-B pages (contextual, single-partner only)

Use **one** IB (rotate weekly via bandit), not both, to keep signal clean.

| Page | Placement | Partner bias |
|------|-----------|--------------|
| DCA vs Lump Sum | below results only | Vantage (broader) |
| Volatility Calculator | below results only | Axi (spread-focused pitch) |
| Rainbow Chart | sidebar card | Vantage |

## 3. Excluded pages (do NOT place)

Tax, Retirement, Inheritance, Zakat, Pizza Day, Halving, Wealth Percentile, Purchasing Power, What-If, Loan, Savings, Real Estate, Obituaries. Wrong intent → hurts EEAT + AdSense trust.

---

## 4. Placement slots (per Tier-A page)

Ordered by expected CTR × EPC:

1. **Post-result cluster** (highest CTR — user just committed to a trade)
   → Reuse `LotSizeAffiliateCluster` pattern. Add Vantage + Axi as first two cards on Tier-A pages.
2. **Pre-export banner** (already exists on Lot Size)
   → Add Vantage + Axi to the bandit rotation via `useBanditVariant` (`lot_size_preexport_banner` experiment). Extend the same experiment to Liquidation / Leverage / P&L / R:R pages.
3. **Sticky companion (SlotD)**
   → Broker-biased creative when `leverage ≥ 10x` OR `hasLiquidationRisk === true`.
4. **In-content "Recommended broker" callout** inside the FAQ answer for "which broker should I use" — one line, one CTA. Highest converting non-cluster slot.
5. **Sidebar / Related Tools card** — lowest priority, brand reinforcement.

## 5. Copy angles (kept factual, no returns claims)

- **Vantage**: "Trade BTC CFDs with tight spreads. Regulated. Free demo."
- **Axi**: "MT4/MT5 crypto CFDs. Micro lots supported. Fast withdrawals."

Both must ship in EN + TR, with `rel="nofollow sponsored"` and the standard `AffiliateDisclosure` component already used by the Lot Size cluster.

---

## 6. Engine wiring

- Register both partners in `src/config/affiliates.config.ts` with `enabled: false` until tracking URLs arrive (audit script will block PLACEHOLDER).
- Add `vantage` and `axi` EPC entries (start at $8.0 — IB payouts are ~5–10× exchange bonuses) in `src/lib/affiliateAI/epc.ts`.
- Extend `experiments.config.ts` — new experiments:
  - `broker_cluster_v1` (post-result cluster on Tier-A pages)
  - `broker_inline_faq_v1` (in-content callout)
  - `broker_sticky_v1` (SlotD trigger on high-leverage state)
- Bandit: epsilon-greedy over live EPC (already implemented) — pool = `[vantage, axi, tradingview]` on Tier-A, `[vantage_or_axi, ledger, tradingview]` on Tier-B.
- S2S postback: `/functions/v1/record-conversion?partner=vantage|axi&sub_id={click_id}` — reuse existing `record-conversion` edge fn. No schema change needed.

## 7. Compliance & safety

- FTC disclosure above every broker cluster (component exists).
- Risk disclosure line under every broker CTA on Tier-A pages: "CFDs are complex instruments — most retail accounts lose money."
- Geo-block from TR if either partner is not licensed there — add a `regionAllowlist` field per partner and skip render when `language === 'tr'` and TR not allowed. You'll tell me per partner.

## 8. Delivery phases

- **Phase 1** (immediate, no secrets needed): register partners disabled, wire copy + slot registry + experiment configs, ship the cluster component reused across all 5 Tier-A pages. Nothing renders yet.
- **Phase 2** (after you paste tracking URLs via add_secret / config): flip `enabled: true`, audit script confirms no PLACEHOLDER, bandit starts learning.
- **Phase 3** (after 7 days of clicks): read `slotPerformance` + `AI Gateway logs`, prune the weaker partner from Tier-B, keep both on Tier-A.
- **Phase 4**: add localized Turkish creative once you confirm TR licensing.

## 9. Revenue model (illustrative)

Assuming Tier-A pages hit ~8k combined monthly sessions post-rollout:
- 8,000 × 3.5% CTR × 1.8% funded-conversion × $400 IB payout ≈ **$2,000/mo** from broker line alone.
- Bandit compounding + Tier-B expansion → **$3–4k/mo** ceiling within 90 days.

## 10. What I need from you next

1. Vantage IB tracking URL (EN + TR if separate).
2. Axi IB tracking URL (EN + TR if separate).
3. Confirmation whether either is TR-licensed (drives geo gate).
4. Approve Phase 1 so I can build the plumbing now with `enabled: false`.

Reply "approved" and I ship Phase 1 in one pass.
