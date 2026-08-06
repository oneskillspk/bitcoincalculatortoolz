# Homepage Bybit Promo Boxes

Add one clean, Bybit-only promo section to the homepage — three campaign cards in the same visual style as the calculator promo cards, using Bybit's own campaign creatives, badges and campaign dates.

## What gets built

A dedicated homepage section: heading + a 3-card row (1-up mobile snap-scroll, 2-up tablet, 3-up desktop), each card showing:

- Bybit's native campaign creative (the three uploaded banners), contained on a light panel, rounded corners
- Badge row: `Hot` + `Ongoing`, `Ongoing`, `Exclusive` + `Ongoing`
- Campaign title (clamped to one line with ellipsis, same as the reference)
- Campaign window in muted small text (UTC), e.g. `2023-02-20 21:30 – 2027-12-31 21:30 (UTC)`
- Whole card is one sponsored link (`rel="sponsored noopener"`, opens in new tab) with the campaign's own affiliate URL

### The three campaigns

| # | Title | Badges | Window (UTC) | Link |
|---|---|---|---|---|
| 1 | $30,100 Deposit Blast-Off + $5,040 TradFi Rewards | Hot, Ongoing | 2023-02-20 21:30 → 2027-12-31 21:30 | aff_7_160486 |
| 2 | Stock Earnings Season — Trade. Predict. Win a Cybertruck | Ongoing | 2026-07-21 14:43 → 2026-08-30 10:43 | aff_61103_160486 |
| 3 | Q3 2026 — Deposit 100 USDT, get 20 USDT | Exclusive, Ongoing | 2026-07-09 12:46 → 2026-09-30 00:00 | aff_59843_160486 |

Cards whose window has ended are hidden automatically, so the section never shows a dead campaign.

## Placement (high CTR, still clean)

One placement only, directly **after the Live Calculation Demo** and before the editorial statement. That is the first point on the homepage where a visitor has seen a real BTC number — the highest-intent moment above the tool grid — and it keeps the hero and the calculator grid uncluttered. No second placement on the homepage; the existing pre-FAQ slot stays as-is.

Section framing stays understated: small "Partner offers" eyebrow, a one-line "Advertising disclosure" note, generous whitespace, no loud background.

## Technical notes

- New `src/config/bybitCampaigns.ts` — typed list of the 3 campaigns (title EN/TR, badges, start/end ISO, url, image asset).
- Upload the three creatives via `lovable-assets` and import the pointer JSON (no binaries committed).
- New `src/components/affiliateAI/BybitCampaignGrid.tsx` reusing the existing promo-card visual language (panel, badge pills, equal heights, snap-scroll on mobile) but campaign-driven rather than partner-driven, so the existing `PromoGrid`/scoring engine is untouched.
- Badge colors use existing tokens: `Ongoing` → success-soft green, `Hot` → warning/danger-soft, `Exclusive` → amber-soft. No hardcoded hex.
- Clicks route through the same tracking helper used by promo cards (UTM + click id) so attribution and reporting stay consistent.
- Mounted in `src/pages/Index.tsx` inside the existing `SectionTransition` rhythm, lazy/below-fold friendly; TR copy provided for both labels and titles.
- Adds a small visual regression spec for the homepage grid (mobile/tablet/desktop) in the existing e2e pattern.
