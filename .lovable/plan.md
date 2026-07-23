# Revenue Plan — Power Law, SIP, What-If

## Current state (verified)

All three pages already use the generic 4-slot orchestrator (`SlotA/B/C/D` via `useSmartZones`). That system picks a winner from the enabled pool, but:

- **Axi (highest CPA, ~$400)** is **not** in `target_pages` for `power-law`, `sip`, or `what-if` in `src/config/affiliates.config.ts` — so it never renders on these pages today.
- Only ONE unit renders per slot, and the mid-body area (between results and content) has **large empty gaps** that the orchestrator doesn't fill.
- What-If has an extra `PreFooterEditorialBand`; Power Law and SIP don't.
- Eligible enabled pool: Axi (after fix), Bybit, TradingView (*), Coinbase (*), MEXC, Ledger, RedotPay (*), Koinly (Koinly only on SIP-adjacent tax intent).

## Placement strategy

Follow the pattern already proven on Lot Size / Leverage-Liquidation / DCA:

1. **Contextual text CTA** immediately after results (bandit-rotated, LCP-safe).
2. **Rotating image creative** lazy-mounted below it via `InViewMount` (zero-CLS with fixed aspect box).
3. **PreFooterEditorialBand** on Power Law + SIP (already on What-If) — proven high-scroll-depth click zone.
4. **Sidebar sticky companion** stays as-is via SlotD (no changes).

The existing `SlotA/B/C` stays; we're adding *guaranteed* Axi-tier units alongside, not replacing.

---

## Page-by-page changes

### 1. Bitcoin Power Law (`/calculators/power-law`)

Intent = trading / long-horizon valuation. Best partners: Axi (leverage BTC trading on projections), Bybit (spot/derivs), TradingView (chart the model).

| Insertion point | File:line | Component | Segment |
|---|---|---|---|
| After `PowerLawProjectionTable` (line ~306), before existing SlotB | `BitcoinPowerLawCalculator.tsx:306` | `<TradingBrokerBanner slug="power-law" segment="post-projection" />` | text CTA, Axi-biased |
| Directly below the text CTA | same block | `<InViewMount minHeight={260}><AffiliatePlacement slug="power-law" zone="inline" forceAffiliateId="axi" forceFormat="image-banner" /></InViewMount>` | rotating image |
| Between `PowerLawContentSections` and `PowerLawFAQSection` | `BitcoinPowerLawCalculator.tsx:315` (extend, not replace SlotC) | `<PreFooterEditorialBand slug="power-law" />` | editorial band |

### 2. Bitcoin SIP (`/calculators/sip`)

Intent = accumulation / DCA cadence. Best partners: MEXC (0-fee spot), Bybit (auto-invest), Ledger (cold storage for stack), Coinbase.

| Insertion point | File:line | Component | Segment |
|---|---|---|---|
| After `SIPvsLumpSum` block (line ~236), before existing SlotB | `BitcoinSIPCalculator.tsx:236` | `<TradingBrokerBanner slug="sip" segment="post-results" />` (no `forceAxi` — bandit rotates MEXC/Bybit/Ledger) | text CTA |
| Below it | same block | `<InViewMount minHeight={260}><AffiliatePlacement slug="sip" zone="inline" forceFormat="image-banner" /></InViewMount>` | image creative (bandit pick) |
| Between `SIPHowToUse` and `SIPFAQSection` | `BitcoinSIPCalculator.tsx:246` (adjacent to SlotC) | `<PreFooterEditorialBand slug="sip" />` | editorial |

### 3. Bitcoin What-If (`/calculators/what-if`)

Already has `PreFooterEditorialBand`. Fill the mid-results gap and add an image rotation.

| Insertion point | File:line | Component | Segment |
|---|---|---|---|
| Between `WhatIfScenarioInsightsPanel` (line 253) and `WhatIfShareSnapshot` | `BitcoinWhatIfCalculator.tsx:253` | `<TradingBrokerBanner slug="what-if" segment="post-scenario" />` | text CTA (peak-nostalgia moment = highest emotional click intent) |
| After `HistoricalAnalysis` (line 283), before SlotB | `BitcoinWhatIfCalculator.tsx:283` | `<InViewMount minHeight={260}><AffiliatePlacement slug="what-if" zone="inline" forceFormat="image-banner" /></InViewMount>` | image rotation |

---

## Config changes

`src/config/affiliates.config.ts` — extend Axi `target_pages` (line ~546):
- Add: `"power-law"`, `"sip"`, `"what-if"` (+ TR aliases if used: `power-law-hesaplayici`, `sip-hesaplayici`, etc. — verify against the actual TR slug list before adding).

`src/config/placements.config.ts` — `INTENT_MAP`:
- `power-law.en`: prepend `"axi"` so scoring gets the INTENT_BOOST.
- `sip` / `what-if`: leave as-is (Axi is a weaker fit here; MEXC/Ledger/Bybit stay the intent winners; Axi remains eligible via `target_pages` for the bandit-driven `AffiliatePlacement`).

## UX / performance guardrails

- Every image creative goes through `InViewMount` with fixed `minHeight` → **zero CLS** (matches Lot Size fix).
- Text CTAs render first (LCP-safe), image creatives lazy-hydrate 300–400px before viewport.
- No new units in the hero / above-the-fold — protects Core Web Vitals.
- All units keep `rel="sponsored nofollow noopener"` + `AffiliateDisclosure` (built into the shared components).
- Per-page-view dedup (`pageViewShown.ts`) already prevents the same affiliate showing in two adjacent slots — no extra work needed.

## Measurement

- Text CTA logs `impression`/`click` with `slug + variant_id` via `analyticsClient` (bandit already wired).
- Image creatives log via `renderTracker` + `AffiliatePlacement` (existing infra).
- After ship, run `scripts/audit-axi-all-calculators.py` extended with the three new routes to confirm zero horizontal overflow across desktop/tablet/mobile and that Axi actually renders on Power Law.

## Deliverables

1. Edit `src/config/affiliates.config.ts` — add 3 slugs to Axi target list.
2. Edit `src/config/placements.config.ts` — prepend Axi to `power-law.en` INTENT_MAP.
3. Edit `src/pages/BitcoinPowerLawCalculator.tsx` — mount text CTA + image `InViewMount` + `PreFooterEditorialBand`.
4. Edit `src/pages/BitcoinSIPCalculator.tsx` — mount text CTA + image `InViewMount` + `PreFooterEditorialBand`.
5. Edit `src/pages/BitcoinWhatIfCalculator.tsx` — mount text CTA (post-scenario) + image `InViewMount` (post-historical).
6. Extend `scripts/audit-axi-all-calculators.py` with the 3 new routes and re-run to verify no overflow and Axi visibility.

## Not included (call out before/after if you want them)

- Adding a **new sidebar sticky** (SlotD already covers it).
- Adding **Vantage** as a second forex broker on these pages (only Axi is live per prior decisions).
- **Interstitials, popups, or exit-intent modals** — deliberately excluded; hurts E-E-A-T and Google rankings.
- Adding **Koinly** to Power Law (tax intent is weak on projection pages).
