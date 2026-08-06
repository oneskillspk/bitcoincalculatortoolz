# Promo Cards (Bybit-style) — Pilot on the DCA Calculator

Confirmed decisions: pilot page = Bitcoin DCA calculator; promo grid **replaces** the current Slot B card outright (no A/B); meta line = partner category / offer summary; missing imagery = generated 3D-style illustrations.

## Verified current state

- `src/lib/affiliateAI/types.ts` defines `Format` with 7 variants — there is no `promo-grid` format today.
- `src/components/affiliateAI/AffiliatePlacement.tsx` renders formats through a single conditional chain (lines ~168-178) and owns all click/impression tracking, UTM, click IDs and disclosure.
- `src/components/placement/SlotB_ResultAdjacent.tsx` picks its format from the `slot_b_format` experiment on desktop and forces `single-card` on mobile.
- `src/pages/BitcoinDCACalculator.tsx` currently uses `EditorialRotator` (aliased as `AffiliatePlacement`, line 70/351) plus `PreFAQPlacement slug="dca"` (line 392).
- Partner data with localized CTA/description/badge and optional `creatives[]` lives in `src/config/affiliates.config.ts`; `src/lib/affiliateAI/creativePicker.ts` already selects creatives by size.

Conclusion: the decision, tracking and slot plumbing already exist. This is a new presentational format plugged into that engine — no parallel ad system.

## What gets built (pilot scope only)

1. **New format** `promo-grid` added to the `Format` union in `src/lib/affiliateAI/types.ts`.
2. **`src/components/affiliateAI/PromoCard.tsx`** — single card matching the reference:
   - `rounded-2xl`, hairline `border-border/40`, `bg-card`, soft shadow on hover only.
   - Fixed-aspect (16:9) illustration panel with a per-partner brand tint, `loading="lazy"`, `decoding="async"`, explicit dimensions → zero CLS.
   - Pill badges: status ("Ongoing"/"Devam ediyor") plus the partner's emphasis badge ("Hot"/"Exclusive") from `badge_en`/`badge_tr`.
   - Title (2-line clamp, semibold) and a muted meta line showing partner category / short offer summary.
   - Prominent CTA button, whole card is one accessible anchor with `rel="sponsored nofollow noopener"`, `target="_blank"`.
3. **`src/components/affiliateAI/PromoGrid.tsx`** — 1 column mobile / 2 tablet / 3 desktop, equal-height cards, degrades gracefully to 1-2 resolved offers.
4. **Wire into `AffiliatePlacement`** as one new branch so the grid inherits UTM, click IDs, bandit/variant stamps, disclosure and opt-out unchanged.
5. **Illustrations** — generate three 3D-style isometric illustrations (broker/trading, wallet/security, exchange/rewards) as project assets, mapped by partner category and used whenever a partner has no suitable image creative. Never a broken image.
6. **Placement on the DCA page** — Slot B, directly below the results/calculate output (the existing highest-intent unit). `SlotB_ResultAdjacent` gets `promo-grid` as its format on desktop and tablet; mobile renders the same grid collapsed to one card to protect LCP. No new ad units are added to the page.
7. **Localization** — new EN/TR keys for status badges and meta labels in `src/translations/en.ts` and `tr.ts`.

## Verification gate before any second page

- Unit tests: grid resolution with 3/2/1 offers, fallback illustration selection, UTM + click-ID preservation on card clicks.
- Playwright: desktop (1280) and mobile (375) screenshots of `/calculators/dca` after a calculation, checking no horizontal overflow, correct card count, and one visible disclosure.
- Console/network check for zero errors and a fired impression event.
- Full typecheck + existing affiliate test suite green.

Only after these pass do we roll the format to the next pages (lot size, profit-loss, then remaining calculators and article mid-content), in small batches.

## Technical notes

- Additive only: one format string, two components, one render branch, one slot format prop. All existing formats keep working.
- No hardcoded colors — semantic tokens (`--card`, `--border`, `--muted-foreground`) plus existing brand tints, so light and dark both work.
- No new dependencies.
- The `slot_b_format` experiment stays in place but the DCA pilot pins the format, per the "replace outright" decision.
