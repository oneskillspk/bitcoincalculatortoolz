# Affiliate System Forensic Audit — Read-Only Report

Evidence base: full source sweep of `src/config/`, `src/lib/affiliateAI/`, `src/lib/placement/`, `src/components/{affiliateAI,placement,monetization}/`, `supabase/functions/`, plus live production telemetry queried from the backend on 2026-08-05. No files were modified.

---

## Executive Summary

The site runs a purpose-built, first-party affiliate engine — not a third-party ad network. There is no ad-network JavaScript, no third-party pixel, no iframe ad tag, and no data sold to programmatic buyers (`public/ads.txt` states this explicitly). All monetization is direct affiliate placement, rendered by React components, tracked through the project's own backend.

Headline numbers (live data, not estimates):

- 13 partner records in code, 8 enabled; 8 partner rows in the backend `affiliates` table, all enabled.
- 9,123 impressions and 25 clicks logged since 2026-06-07. 0 conversions recorded.
- 204 pre-generated decision rows covering 34 slugs × 2 languages × 3 segments.
- 40 calculator pages and the shared article template carry placements.
- Every affiliate anchor in the codebase carries `rel="sponsored nofollow noopener"` and `target="_blank"`, with a visible "Sponsored"/"Partner" label and a linked `/affiliate-disclosure` page.

**Verdict: presentable to affiliate managers, with four items to fix first** — see Final Verdict.

---

## Section 1 — Affiliate Inventory

Two registries exist in parallel. `src/config/affiliates.config.ts` (602 lines) is the V2 engine's source of truth. `src/config/affiliates.ts` (102 lines) is a legacy 5-partner list feeding only a sidebar "Recommended Tools" card.

Enabled partners (`affiliates.config.ts`):

| Partner | Network / tracking | ID in link | Landing URL | Cookie | Commission | Creatives |
|---|---|---|---|---|---|---|
| Ledger | Ledger Affiliate (direct `?r=`) | `8c4e8e87cac7` | `shop.ledger.com/pages/ledger-nano-s-plus/?r=…` | 30d | 10% | 23, hotlinked `affiliate.ledger.com` |
| Coinbase | Impact Radius (`sjv.io`) | partner `7283174`, campaign `9251` | `coinbase-consumer.sjv.io/c/7283174/3383210/9251` | 30d | 10% | 17, hotlinked `a.impactradius-go.com` |
| TradingView | Direct `aff_id` | `166891` | `tradingview.com/?aff_id=166891&aff_sub=creative` | 30d | 15% | 8 + 2x retina, S3-hosted |
| RedotPay | Direct `utm_uid` union | uid `15980`, `utm_id=36rgik` | `wap.redotpay.com/en/invite/affiliates-1?…` | 365d | 20% | 23, self-hosted assets |
| MEXC | Direct `shareCode` | `mexc-Btccalctool` | `mexc.com/acquisition/custom-sign-up?shareCode=…` | 60d | 40% | 12, self-hosted |
| Bybit | Direct `ref` | `160486` | `bybit.com/invite?ref=160486` | 30d | 30% | 0 (text card only) |
| Koinly | Direct `via` | `0481A637` | `koinly.io/?via=0481A637` | 30d | 25% | 0 |
| Axi | IB promocode | `4744672` | `axi.com/int/live-account?promocode=4744672` | 90d | $400 flat CPA | 14, hotlinked `axiapi2.fynxt.com` |

Disabled / wishlist (no live tracking URLs, cannot ship): Trezor, Swan Bitcoin, BTCTurk, Kraken, Paribu, CoinLedger. `scripts/audit-affiliate-links.mjs` blocks any PLACEHOLDER URL from being enabled in CI.

**Tracking method — uniform across all partners** (`src/lib/affiliateAI/utm.ts`):
- A `click_id` UUID is minted per placement render (`mintClickId`, crypto.randomUUID with fallback).
- That UUID is stamped non-destructively into `sub1`, `s1`, `subid`, and `click_id` on the outbound URL — this is the S2S join key.
- If a partner URL already owns `utm_source`, only the first-party subid `aff_sid` (`slug__zone[__creativeId]`) is appended; otherwise full `utm_source/medium/campaign/content` is stamped. This deliberately avoids clobbering partner-owned UTMs (Coinbase, TradingView, RedotPay).
- Optional `variant` param carries the A/B stamp.

**Redirect system: none.** Links are direct `<a href>` to the partner's own tracking domain — no cloaking, no interstitial, no self-hosted `/go/` redirector, so there is exactly one hop and no attribution loss.

**API / pixel / JS integrations:** no third-party pixels, no partner SDKs, no external ad JS. The only server integrations are the project's own edge functions (`log-event`, `record-conversion`, `aggregate-slot-stats`). `record-conversion` can respond as a 1×1 GIF for partners that require a pixel-style postback.

---

## Section 2 — Website Coverage

| Surface | Affiliate content? | Evidence |
|---|---|---|
| Header | No | no affiliate imports in `Header.tsx` |
| Hero | No | — |
| Footer / pre-footer | Yes — inline `image-banner` band, plus disclosure link and opt-out toggle | `Footer.tsx:30-42,85-90,255,265`; `PreFooterEditorialBand.tsx` |
| Sidebar | Yes — desktop sticky companion (Slot D), 280px | `SlotD_StickyCompanion.tsx:159-211` |
| Calculator pages | Yes — 40 pages | see Section 3 |
| Article pages | Yes — one shared template, `zone="inline-mid-article"` | `LearnArticle.tsx:252-256` |
| Comparison content | Brand mentions only, not affiliate links | `ETFContentSections.tsx`, `ProfitLossContentSections.tsx` |
| Inline / native / recommendation cards | Yes | `AffiliatePlacement.tsx`, `LotSizeAffiliateCluster.tsx` |
| Sticky mobile bar | Yes — 60px bottom bar, dismissible | `SlotD_StickyCompanion.tsx:107-158` |
| Popups | None | no modal/overlay affiliate surface exists |
| Exit intent | None | no exit-intent handler in the codebase |
| Email capture flows | None affiliate-linked | newsletter is first-party only |
| AI-generated placements | Batch job exists, output currently unused | see Section 5 |

---

## Section 3 — Ad Inventory

Rendering formats supported by the single universal renderer `AffiliatePlacement.tsx:52-59`: `single-card`, `two-card-strip`, `sidebar-widget`, `comparison`, `inline-cta`, `image-banner`, `html-banner`. All reserve `min-height` (110/90px) to prevent CLS.

Slot inventory (V2 system):

| Slot | Component | Dimensions | Trigger | Format |
|---|---|---|---|---|
| A — Pre-Calc Anchor | `SlotA_PreCalcAnchor.tsx` | 728×90 desktop / 320×50 mobile | 12s idle before any result, IO-gated | image-banner |
| B — Result Adjacent | `SlotB_ResultAdjacent.tsx` | card or banner (A/B tested) | fires on result, cooldown-exempt | experiment-driven |
| C — Mid Content | `SlotC_MidContent.tsx` | inline card | long pages only, 2s in-view dwell | single-card |
| D — Sticky Companion | `SlotD_StickyCompanion.tsx` | 280px fixed right / 60px bottom bar | post-result, dismissible, fatigue-capped | sidebar-widget |
| Pre-footer band | `PreFooterEditorialBand.tsx` | banner | every monetizable route | image-banner |
| Page-specific | `LotSizePreExportBanner.tsx`, `LotSizeAffiliateCluster.tsx`, `TradingBrokerBanner.tsx` | inline | trading-intent pages | card/banner |

**Live performance (production data, 2026-06-07 → 2026-08-05):**

| Partner | Impressions | Clicks | CTR | Conversions |
|---|---|---|---|---|
| RedotPay | 6,221 | 7 | 0.11% | 0 |
| Ledger | 2,182 | 15 | 0.69% | 0 |
| TradingView | 217 | 1 | 0.46% | 0 |
| Axi | 197 | 0 | 0% | 0 |
| Coinbase | 191 | 1 | 0.52% | 0 |
| MEXC | 68 | 0 | 0% | 0 |
| Bybit | 42 | 1 | 2.38% | 0 |
| Koinly | 5 | 0 | 0% | 0 |
| **Total** | **9,123** | **25** | **0.27%** | **0** |

Top placement slugs by impressions: `site` 3,024 · `home` 936 · `what-if` 861 · `lot-size` 647 · `wealth-percentile` 286 · `retirement` 261.

Coinbase, MEXC, Bybit, Axi, TradingView and Koinly only began logging on 2026-08-02 — they are 3 days old, so their sample is not yet meaningful.

---

## Section 4 — Rotation Engine

Live decisions are computed **client-side, synchronously, with zero network round-trip** (`decisionClient.ts:1-18` → `scoreAndPick`). Sequence:

1. **Eligibility filter** — `enabled && page match && language match && result-signal match` (`scoringEngine.ts:162-168`).
2. **Hard exclusions** — anything already shown on this page-view (`pageViewShown.ts`) and anything shown in the last hour (`localStorage["aff_seen"]`). Both gracefully widen back if the pool would empty.
3. **Additive score** (`scoreAffiliate`, `:61-120`): priority (1–10) + tier weight (4/2/1) + intent weight (3/2/1) + 5 exact slug match + 2×result-signal overlap + 2 language match + 4 banner-zone bonus + 15 hard `INTENT_MAP` boost − 3 recency penalty.
4. **Geo-ish targeting** — Turkish-language traffic gets +6 for BTCTurk/Paribu/MEXC/Bybit and −10 for Coinbase/Swan (`:92-98`). This is language-derived, **not real geo-IP**.
5. **Multipliers** — admin zone weight (`getZoneWeight`; ≤0 is a hard kill switch), adaptive CTR multiplier (Laplace-smoothed, α=1/β=40, ≥20 impressions required, clamped 0.4–2.0), and ×1.15 engagement boost once scroll ≥50% + dwell ≥15s.
6. **Weighted rotation** — roulette-wheel pick seeded by an FNV hash of `slug|lang|segment|zone|dayBucket`, so the selection is stable per user per day but rotates daily. Multi-slot placements pin the top scorer and rotate the remainder.
7. **Frequency control** — 90s click cooldown (`sessionStorage`), session fatigue flag suppressing Slot D, density cap of 3 slots desktop / 2 mobile, one-owner-per-slot claim registry (`slotClaim.ts`) preventing duplicate banners.

Segments: `returning` > `mobile` > `default`, derived from `localStorage["btc_returning_visitor"]` and viewport width. Device targeting is viewport-based. **No cookies are used** — all state is `localStorage`/`sessionStorage`, and all event logging is gated on cookie consent (`bct-consent-v1`), with pre-consent events queued rather than dropped.

Users can fully disable affiliate content via a footer opt-out toggle (`btc_affiliate_optout`).

---

## Section 5 — AI Optimization

Three distinct mechanisms, stated precisely:

1. **Deterministic rule scoring** — the live path. No model, no inference, no network. Fully auditable and reproducible.
2. **A/B testing** (`useExperiment.ts`) — deterministic FNV bucketing on a first-party `visitor_id`. Three registered experiments: `home_hero_cta`, `slot_b_format` (card vs banner), `lot_size_preexport_banner` (Axi ×2 / TradingView / Ledger / RedotPay). Variant stamps round-trip into `clicks.variant_id`; 5 stamped clicks recorded so far.
3. **Multi-armed bandit** (`useBanditVariant.ts`) — epsilon-greedy, ε=0.15, exploiting the `epc_live` weight. It requires every arm to reach 30 clicks/30d before activating; until then it degrades to an equal-split A/B. **With 25 total clicks site-wide, the bandit has never activated** — and `epc_live` currently holds 0 rows.
4. **LLM batch job** — `supabase/functions/refresh-decisions` calls Gemini via the Lovable AI Gateway nightly to pre-generate `decisions_cache` (204 rows present, regenerated 2026-08-05, covering 34 slugs). **No client code reads this table any more** (`decisionClient.ts` comment documents its removal for latency/CLS reasons). The LLM output is therefore orphaned and has zero influence on what a visitor sees.

No Bayesian optimization, no confidence scoring, no ML ranking model. There is no per-request LLM call — an important point for a partner asking "is an AI choosing where my brand appears?" The answer is no; a deterministic ruleset is.

---

## Section 6 — Coinbase Audit

**Affiliate integration.** One partner record (`affiliates.config.ts:229-281`), enabled, tier 1, priority 8, `target_pages: ["*"]`, badge "Up to $2,000". Single tracking URL for both languages: `coinbase-consumer.sjv.io/c/7283174/3383210/9251`. 17 Impact Radius creatives (728×90, 300×250 ×6, 160×600 ×4, 300×600 ×2, 320×50 ×2) served from `a.impactradius-go.com/display-ad/9251-<adid>` with matched per-creative landing URLs, plus a `creative_html` text-link fallback. A second, legacy copy of the same URL lives in `src/config/affiliates.ts:38-46` (sidebar card, "Start Buying", 🪙).

**Assets.** No Coinbase logo, image, or screenshot is self-hosted anywhere — there is no `src/assets/affiliates/coinbase/` directory. Every Coinbase visual is hotlinked from Impact Radius, i.e. served unmodified from Coinbase's own approved creative library. This is the strongest possible compliance position on branding.

**Placement reach.** Coinbase appears in the `INTENT_MAP` list of ~44 calculator slugs, always as the trailing (lowest-priority) entry — a catch-all rather than a headline pick. It is the preferred article partner for the Basics and Investing categories and rotates with MEXC for Mining (`placements.config.ts:247-251`). It holds 59 of 204 pre-generated decision rows. EPC weight 1.2 (`epc.ts:27`).

**Scoring caveat.** `scoringEngine.ts:93-97` applies `score -= 10` to Coinbase on Turkish-language traffic, deliberately steering TR visitors to locally available exchanges. Coinbase remains fully eligible on English traffic.

**Live performance.** 191 impressions, 1 click (0.52% CTR), 0 conversions — but the placement only went live 2026-08-02, so this is a 3-day sample, not a performance signal.

**Editorial mentions.** Coinbase is named in prose across ~30 content files — FAQ copy, exchange fee-comparison tables (`ProfitLossContentSections.tsx`), ETF custodian tables (`ETFContentSections.tsx`), arbitrage exchange lists, and 10+ Learn articles including `how-to-buy-bitcoin-safely.ts`. **None of these are affiliate links** — they are unlinked brand references in editorial context. The disclosure page names Coinbase explicitly as a paid partner (`AffiliateDisclosure.tsx:173`).

---

## Section 7 — Multi-Affiliate Interaction

Coinbase competes in the same auction as Ledger, RedotPay, Bybit, MEXC, TradingView, Koinly and Axi. Concretely:

- **Can multiple partners appear together?** Yes — `two-card-strip` renders two partners side by side (98 of 204 decision rows use it), and different slots on one page can hold different partners. Example live row: `bitcoin-loan / en / default → [redotpay, coinbase]`.
- **Can Coinbase be rotated out?** Yes. Because it sits last in nearly every intent list and takes a −10 penalty on TR traffic, a Turkish visitor will normally never see Coinbase. On English traffic it wins mostly where no category specialist outranks it.
- **Can competitors replace it?** Yes — Bybit and MEXC (direct exchange competitors) can and do occupy the same slots.
- **Is page context respected?** Yes, and strictly. Axi is scoped to leverage/trading slugs only; Koinly to tax slugs; Ledger to custody/accumulation slugs. Coinbase's `["*"]` scope makes it the broadest-reaching partner in the system.

A partner manager will reasonably ask whether their brand can appear adjacent to a competitor's. The honest answer: yes, in the two-card strip format.

---

## Section 8 — Compliance Findings

**Clean:**
- Every affiliate anchor uses `rel="sponsored nofollow noopener"` + `target="_blank"` — verified in `AffiliatePlacement.tsx:236`, `TradingBrokerBanner.tsx:194`, `AffiliateCard.tsx:41`, `LotSizeAffiliateCluster.tsx:128`, `LotSizePreExportBanner.tsx:196`. Sanitized third-party HTML banners have rel/target force-applied at runtime (`:450-452`). No affiliate anchor is missing `sponsored`.
- Visible "Sponsored"/"Partner" labelling on every placement, plus `aria-label="Sponsored offer"` on the sticky slot.
- Dedicated `/affiliate-disclosure` page, localized to `/tr/bagli-kurulus-aciklamasi`, linked from footer, mobile nav and bottom tab bar, naming each partner.
- No modified logos, no self-hosted partner brand assets for Coinbase/TradingView/Ledger/Axi (all hotlinked from partner CDNs = always current, never stale).
- No cloaking, no double redirect, no duplicate tracking pixel.
- Axi carries the required leveraged-trading risk disclosure ("Losses can exceed deposits").
- `ads.txt` explicitly declares no programmatic resale.
- User-level opt-out toggle available.
- CI guard (`audit-affiliate-links.mjs`) blocks PLACEHOLDER URLs from shipping.

**Findings to address:**

1. **Prompt-injection-style text stored in a translation key.** `src/translations/en.ts:185` and `tr.ts:150` — the `common.language` key contains a multi-thousand-word block of audit instructions instead of the string "Language". This is inert data, not executable, but it will render as UI text wherever that key is used and it is visible to anyone reading the bundle. This is the single most embarrassing thing a partner reviewer could stumble on. Fix before any partner review.
2. **Duplicated hardcoded partner URLs** in `TradingBrokerBanner.tsx:37-70`, `LotSizeAffiliateCluster.tsx:34-64`, `LotSizePreExportBanner.tsx:40-73` — four partner links copied verbatim into three files instead of imported from config. A tracking-ID rotation would silently miss these and send traffic to unattributed links.
3. **Two divergent registries.** `affiliates.ts` uses a different Ledger path (`shop.ledger.com/` root vs `/pages/ledger-nano-s-plus/`) and a different TradingView subid (`aff_sub=partners` vs `aff_sub=creative`). Reporting will not reconcile.
4. **Zero conversions recorded.** `record-conversion` is deployed and idempotent, but no partner postback has ever fired — meaning either no postback URL is configured on any partner dashboard, or no conversion has occurred. Until this is wired, EPC-based optimization cannot function.
5. **Stale comments** in `placements.config.ts:150-162` describe Bybit/MEXC as "future partners" and omit Axi from the enabled list — misleading to any reviewer reading the code.
6. **`vantage` referenced with no partner record** (`placementWeights.ts:28-31`) — dead config.
7. **Orphaned LLM job.** `refresh-decisions` burns AI credits nightly to write 204 rows nothing reads.
8. **`aggregate-slot-stats` uses hardcoded EPC constants** (`{A:0.35,B:0.85,C:0.25,D:0.45}`) rather than real conversion revenue, so slot-performance ranking is currently fiction dressed as data.

No misleading language, guaranteed returns, or unlicensed investment advice was found in placement copy.

---

## Section 9 — Performance Findings

- Partners: 13 defined / 8 enabled / 8 with live impressions.
- Distinct creative assets: ~97 across Ledger (23), RedotPay (23), Coinbase (17), Axi (14), MEXC (12), TradingView (8).
- Placement components: 12 (4 V2 slots + pre-footer band + 3 page-specific + 4 renderers/shims).
- Pages with placements: 40 calculators + 1 shared article template.
- Decision coverage: 34 slugs × 2 langs × 3 segments = 204 rows, all regenerated 2026-08-05.
- Top locations by volume: `site` (33%), `home` (10%), `what-if` (9%), `lot-size` (7%).
- Unused/dead: `RecommendedTools.tsx` + `AffiliateCard.tsx` (built, no page imports), `decisions_cache` (populated, unread), `epc_live` (0 rows), disabled partners (6).
- Site-wide CTR 0.27%. Ledger is the standout at 0.69% on 2,182 impressions; RedotPay carries 68% of all impressions but converts attention at 0.11% — the clearest optimization target in the system.

---

## Section 10 — Architecture

```text
  Visitor
     |
     v
[contextEngine]  slug, lang, device, returning?, opt-out?  (localStorage only)
     |
     v
[scoringEngine]  eligibility -> page-view + 1h exclusions -> additive score
     |           (+ zone weight x adaptive CTR x engagement boost)
     v
[weightedPick]   seeded by slug|lang|segment|zone|day  -> stable daily rotation
     |
     v
[usePlacementOrchestrator]  slot A/B/C/D gating: idle, result, dwell,
     |                       90s cooldown, fatigue, density cap, slot claim
     v
[AffiliatePlacement]  renders format -> appendUtm() stamps click_id/aff_sid
     |                                     |
     |                                     +--> outbound <a rel="sponsored nofollow noopener">
     v                                              -> partner tracking domain
[analyticsClient]  consent-gated, retry + localStorage queue
     |
     v
edge fn  log-event  --> impressions / clicks  (affiliate_id validated vs affiliates table)
     |
partner S2S postback (token-auth, sub1/click_id echoed back)
     |
     v
edge fn  record-conversion --> conversions (upsert on partner+external_tx_id)
     |
     v
trigger recompute_epc_weights --> epc_live.weight --> useBanditVariant (epsilon-greedy)

(dormant) cron -> refresh-decisions -> Gemini -> decisions_cache  [written, not read]
```

Click attribution is a single hop with one join key (`click_id`) echoed in four parameter names to satisfy whichever the partner supports. Conversion writes are idempotent on `(partner, external_tx_id)`.

---

## Section 11 — Risk Assessment (0–100, higher is better)

| Dimension | Score | Rationale |
|---|---|---|
| Compliance (disclosure/rel/labels) | 92 | Exemplary rel/label/disclosure discipline; only the translation-key anomaly drags it |
| Partner compliance (brand/creative) | 88 | Unmodified hotlinked creatives; risk is duplicated hardcoded links drifting |
| Security | 85 | Token-auth postback, zod validation, sanitized HTML banners, no secrets client-side |
| Maintainability | 62 | Two registries, three files of duplicated URLs, dead code, stale comments |
| Performance | 88 | Zero network on decision path, CLS reserved, IO-gated mounts, lazy slots |
| SEO | 90 | `nofollow sponsored` throughout, no cloaking, no doorway pages |
| UX | 84 | Density caps, cooldowns, dismissible sticky, user opt-out |
| Accessibility | 82 | aria-labels on sponsored regions; sticky bar needs runtime re-verification |
| Scalability | 70 | Sound architecture, but bandit/EPC layer is inert until conversions flow |
| Attribution integrity | 45 | 0 conversions ever recorded — the weakest link in the whole system |
| **Overall** | **79** | Solid, honest, well-instrumented; blocked by attribution and hygiene items |

---

## Actionable Recommendations

Priority order:

1. Restore `common.language` in `en.ts`/`tr.ts` to a normal string — highest embarrassment risk, near-zero effort.
2. Configure S2S postback URLs in each partner dashboard using `record-conversion` with the shared token, and confirm each partner echoes `sub1`/`click_id`. Nothing downstream works until this fires.
3. Collapse the two registries into one and replace the hardcoded URLs in the three lot-size/broker components with config imports.
4. Either wire `decisions_cache` back into the read path or disable the `refresh-decisions` cron; stop paying for unused inference.
5. Replace the hardcoded EPC constants in `aggregate-slot-stats` with real `conversions` revenue once postbacks land.
6. Investigate RedotPay's 0.11% CTR on 68% of inventory — likely a placement-fit or creative problem, and the largest single revenue lever available.
7. Remove dead references (`vantage`, unused `RecommendedTools`/`AffiliateCard`) and correct the stale comments in `placements.config.ts`.

---

## Final Verdict

**Conditionally ready.** The parts an affiliate manager actually scrutinizes are in good shape: correct `rel` attributes on every link, visible sponsorship labelling, a real disclosure page naming each partner, unmodified creatives served from the partner's own CDN, no cloaking or redirect chains, no competitor-brand misuse, and honest, first-party tracking with a documented postback endpoint.

Two things would go badly in a review as it stands. First, the audit-instruction text sitting in a translation key will render as UI copy and looks unprofessional. Second, with zero conversions ever recorded, a Coinbase or Ledger manager asking "what's your conversion rate?" gets no answer — and the site cannot demonstrate that its attribution actually closes the loop. Fix those two, reconcile the duplicated links, and the implementation stands up to scrutiny comfortably.

One thing worth being straight about: nothing here is broken in a way that harms a partner. The gaps are hygiene and measurement, not integrity.
