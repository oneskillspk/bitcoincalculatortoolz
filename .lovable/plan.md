# Enterprise Affiliate Revenue Audit & Growth Plan

## The hard truth first (read this before any code)

**100 clicks across 7 partners is not a monetization problem — it is a volume problem.** Your average EPC (from `src/lib/affiliateAI/epc.ts`) is ~$2. Statistically expected revenue from 100 spread clicks: **$40–$150**, and most of that gets eaten by cookie windows, geo mismatches, and partner attribution delays (30–90 days for Ledger, Koinly, exchanges).

So the plan is two-track:

1. **Fix the leaks** so every click you already earn converts harder (short-term).
2. **10× the click volume** with SEO + placement science (medium-term). Without this, no amount of "better ads" moves the needle.

---

## Phase 1 — Diagnostic Audit (findings from reading the current system)

**Placements (`src/components/placement/`):** Slots A/B/C/D + PreFooter band + PreCalc/PreFAQ wrappers exist and are well-architected. Not the bottleneck.

**Real problems found:**

1. **Attribution is broken on some partners.**
  - `kraken`, `binance`, `trezor`, `bitbox`, `cointracker`, `tokentax`, `nicehash`, `compass-mining`, `unchained` in `src/config/affiliates.ts` use **raw brand URLs with zero tracking params**. Every click sent to these = $0 forever. This is the #1 revenue leak.
  - Only Coinbase, Ledger, TradingView, RedotPay have real tracking links.
2. **Two parallel affiliate configs.** `src/config/affiliates.ts` (legacy, used by `RecommendedTools`/`AffiliateCard`) and `src/config/affiliates.config.ts` (V2 engine, 13 partners with creatives). The legacy file leaks clicks to untracked URLs.
3. **EPC table is fantasy.** `epc.ts` numbers are guesses. GA4 `value` on `affiliate_click` events is therefore fiction, and `/admin/revenue` shows made-up dollars. Can't optimize what you can't measure.
4. **No conversion feedback loop.** Nothing pulls actual commission data from Impact/Ledger/Koinly dashboards back into the scoring engine. Scoring picks winners based on *clicks*, not *dollars*.
5. **Geo targeting is weak.** Turkish traffic sees Ledger (ships to TR but expensive) instead of BTCTurk/Paribu (native, higher intent). Need to confirm segment logic in `contextEngine.ts` actually flips by locale, not just UI language.
6. **CTR ceiling on image banners.** Ledger's stock `affiliate.ledger.com/image/*` creatives are generic. Contextual native cards (calculator-specific copy: "Store the 0.42 BTC you just calculated on a Ledger") convert 3–5× better than generic banners on tool sites.
7. **Cookie-friendly funnels missing.** RedotPay/MEXC/Bybit pay best on *funded accounts*, not signups. No post-click nudges (email capture → drip → funded reminder) means one shot per visitor.
8. **Cold pages.** SEO plan already identified `/calculators/dca` as battleground. Currently that page shows the same generic ad mix as every other page. Category-specific rotation (DCA → Swan/Koinly/Ledger, Tax → Koinly/CoinLedger only) is not enforced.

---

## Phase 2 — Fix the leaks (week 1, high-ROI)

Ordered by revenue impact per hour of work:

1. **Replace every untracked URL in `src/config/affiliates.ts**` with real affiliate links (or delete the partner). For each: pull the referral URL from that partner's dashboard. If none available → mark `enabled: false` and remove from `RecommendedTools`.
2. **Kill the legacy `affiliates.ts` path** entirely — migrate `RecommendedTools` + `AffiliateCard` to read from `affiliates.config.ts` so audits and UTMs apply uniformly.
3. **Enforce UTM stamping** on 100% of outbound links (verify `src/lib/affiliateAI/utm.ts` runs on legacy path too). Use per-slot `utm_content` (slot-a/slot-b/etc.) so Impact/partner dashboards show which slot converts.
4. **Category-locked rotation.** Update `scoringEngine.ts` so tax calculators only rotate Koinly + CoinLedger, hardware/security articles only rotate Ledger + Trezor, exchange/DCA pages rotate Coinbase/Kraken/MEXC. Kill generic mixing.
5. **Turkish geo rules.** In `contextEngine.ts`, when `lang === 'tr'` OR TZ = `Europe/Istanbul`, boost `btcturk`, `paribu`, `bybit`, `mexc` scores; suppress `coinbase` (blocked in TR) and `swan_bitcoin` (US-only).

## Phase 3 — Real measurement (week 2)

1. **Manual EPC true-up.** Log into each partner dashboard, take last 90 days: `commission / clicks = real EPC`. Paste into `epc.ts`. This alone re-ranks the scoring engine to favor real earners.
2. **Postback / S2S conversion tracking.** Add an edge function `record-conversion` that accepts partner postbacks (Impact supports this out of the box for Coinbase). Store in a new `conversions` table joined with `clicks` on `click_id` (need to add `click_id` as UTM). Now `/admin/revenue` shows real $, not EPC × clicks.
3. **Weekly EPC auto-refresh.** Cron edge function reads `conversions` grouped by `affiliate_id` from last 30 days, updates a `epc_live` table, scoring engine reads it. Self-tuning system.

## Phase 4 — 10× the clicks (weeks 3–8)

Volume is the real unlock. Current 100 clicks/period × 2× conversion improvements = still small. Target: 2,000+ affiliate clicks/month.

1. **Ship the DCA counter-attack.** Per the earlier Semrush pass: rewrite `/calculators/dca` around the *dca bitcoin* / *bitcoin investment calculator* / *dollar cost averaging calculator* cluster. Add FAQ schema, cross-link from home + what-if + learn hub. Target: page 1 for 3–4 of dcabtc.com's top-10 keywords in 60 days.
2. **Own "btc calculator" (5,400/mo, currently pos 26).** Rewrite homepage H1/meta, add a "Bitcoin Calculator" hub section above fold, expand internal link anchor text.
3. **Spanish landing (`/es/calculadora-bitcoin`).** 1,600/mo, competitor at pos 25. Trivial land-grab. Ship a translated `/calculators/index` variant.
4. **Native contextual cards on result screens.** Replace generic banners in SlotB (result-adjacent) with dynamic native cards: *"Your calculated 0.42 BTC → secure it with Ledger (10% off first order)"*, *"Turn this DCA plan into automated buys on Kraken"*. Contextual result-copy is where the CTR + EV lives.
5. **Email capture on result export.** Free "email me this result as PDF" → double opt-in list → 3-email drip: (1) how to actually execute the plan (Kraken/Coinbase deep links), (2) securing coins (Ledger/Trezor), (3) taxes (Koinly). Every subscriber = 2–5 extra affiliate touches.
6. **Comparison content.** `/learn/best-bitcoin-hardware-wallet-2026`, `/learn/koinly-vs-cointracker`, `/learn/best-btc-exchange-turkey`. Comparison posts convert 5–10× calculator pages because intent is transactional.

## Phase 5 — Ongoing (monthly)

- Rotate creatives quarterly; A/B via existing `creativePicker`.
- Prune bottom-quartile EPC partners; onboard replacements (Nexo, Bitpanda, BlockFi-successors).
- Monitor `/admin/revenue` real-$ dashboard weekly; kill any (page × affiliate) combo with >200 clicks and $0.

---

## Technical scope for build mode

Files that will change (Phase 1–3 only; Phase 4 is a separate plan):

```text
src/config/affiliates.ts                     → fix/remove untracked URLs, or deprecate entire file
src/components/monetization/RecommendedTools → migrate to affiliates.config.ts
src/components/monetization/AffiliateCard    → wrap URL with UTM helper
src/lib/affiliateAI/utm.ts                   → ensure click_id param + slot utm_content
src/lib/affiliateAI/scoringEngine.ts         → category locks + TR geo boost
src/lib/affiliateAI/contextEngine.ts         → TR timezone/lang detection
src/lib/affiliateAI/epc.ts                   → paste real numbers from partner dashboards
supabase/migrations/*                        → clicks.click_id + conversions table + epc_live table
supabase/functions/record-conversion/        → new: partner S2S postback receiver
supabase/functions/refresh-epc/              → new: weekly aggregation cron
src/components/admin/AdminRevenue.tsx        → read from conversions join, not EPC×clicks
```

---

## What I need from you before build mode

Two answers unlock Phase 1 immediately:

1. If yes, paste the referral URLs (or I'll list exactly which dashboards to open). If no, I'll disable them so we stop wasting clicks.
2. **Which partners' dashboards can you access right now** to give me real 90-day clicks + commission numbers so I can rebuild `epc.ts` on truth instead of guesses?

Once I have those, I'll execute Phase 1 + 2 in a single build pass (probably 6–10 file edits) and we'll have a clean, honest, tracked system by end of day. Phase 3 (S2S conversions) I'll spec as a second plan since it involves DB migrations + a partner-side postback setup.

Do you have active affiliate accounts for Kraken, Binance, Trezor, Cointracker, Koinly, TokenTax, Nicehash? No but koinly Already intergrated check, 2. Skip the dashboards check 