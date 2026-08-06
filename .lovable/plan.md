# Modern Promo Cards (Bybit-style) — Affiliate Grid Rollout

## Forensic audit of what exists today

- Affiliate registry: `src/config/affiliates.config.ts` — 8 enabled partners (Ledger, Koinly, Coinbase, MEXC, Bybit, TradingView, RedotPay, Axi + Vantage), each with localized URL/CTA/description/badge and an optional `creatives[]` image list with per-creative `landing_url`.
- Decision layer: `useAffiliateAI` → context → `decisions_cache`/scoring → `resolveAffiliates()` returns `{program, url, cta, description, badge, effectiveLang}`.
- Render layer: `AffiliatePlacement` supports formats `single-card`, `two-card-strip`, `comparison`, `inline-cta`, `sidebar-widget`, `image-banner`, `html-banner`. All click/impression tracking (`mintClickId`, `appendUtm`, `trackClick`, render tracker, bandit/variant stamps) lives here.
- Slot layer: SlotA (pre-calc), SlotB (post-result, highest intent), SlotC (mid-content), SlotD (sticky), orchestrated by `useSmartZones` / `PreFAQPlacement`, with `useSlotClaim` de-duplication and A/B via `useExperiment`.

Conclusion: the plumbing is complete. The gap is purely presentational — there is no premium 3-up card grid format, and image creatives render as raw banners.

## What gets built

A new `promo-grid` **format** inside the existing engine (not a parallel ad system), so it inherits scoring, UTM, click IDs, variants, disclosure, and opt-out for free.

1. `src/components/affiliateAI/PromoCard.tsx`
   - Structure matching the reference: `rounded-2xl`, `border-border/40`, hairline shadow, card body on `bg-card`.
   - Top: 16:9 creative panel with soft tinted background (per-partner brand tint from `src/lib/brandColors.ts`), object-contain image, fixed aspect ratio so CLS is zero.
   - Badge row: pill badges — status ("Ongoing"/"Devam ediyor") plus optional emphasis badge ("Hot"/"Exclusive") from the program's `badge_en`/`badge_tr`.
   - Title: 2-line clamp, semibold, tight tracking.
   - Meta line: muted small text (offer validity or partner category), truncated.
   - Whole card is a single anchor (`rel="sponsored nofollow noopener"`, `target="_blank"`) using the same `appendUtm` + `trackClick` path as `Card`.
2. `src/components/affiliateAI/PromoGrid.tsx` — 1 column mobile, 2 tablet, 3 desktop; equal-height cards; renders 1–3 resolved items and gracefully degrades to fewer.
3. Wire `format === "promo-grid"` into `AffiliatePlacement`'s render switch and add `"promo-grid"` to the `Format` union in `src/lib/affiliateAI/types.ts`.
4. Creative selection: reuse `creativePicker` to pick the nearest square/rectangle creative (300x250 / 336x280 / 1200x628); if a partner has no image, fall back to a generated brand-tint panel with the partner name — no broken images.

## Where it goes (highest-impression areas)

- **Calculator pages — Slot B (directly below the results / calculate action).** Highest intent moment; already scroll- and result-gated. Desktop renders the 3-up grid; mobile keeps a single card to protect CLS and LCP.
- **Calculator pages — Slot C (mid-content, between content modules).** 3-up grid on desktop, 1-up on mobile.
- **Article pages — after the first H2** (mid-article) and **pre-footer band** via the existing `PreFooterEditorialBand` / `EditorialRotator` path, swapped to the grid format.
- No new slots are created and no page gets more ad units than today — this replaces existing units' visual format. Slot D (sticky) and Slot A stay as-is.

## Rollout control

- A/B via the existing `useExperiment` system: new `slot_b_format` variant `promo-grid` (weighted 50/50 against the current card) so CTR/EPC is measured, not assumed, with the variant stamp flowing into `clicks.variant_id`.
- Kill switch through the existing `AFFILIATE_ENGINE_ENABLED` / shadow-mode flags.

## Quality bar

- Full EN/TR localization for badges and meta labels (new keys in `en.ts` / `tr.ts`).
- Affiliate disclosure remains rendered above/below the grid, in `effectiveLang`.
- Accessibility: each card an accessible link name, focus-visible ring, 4.5:1 contrast on badges, no text baked into images relied on for meaning.
- Performance: `loading="lazy"` + `decoding="async"`, explicit width/height, fixed aspect-ratio wrappers → no CLS; no new dependencies.
- Tests: unit tests for grid resolution/fallback and UTM preservation, plus Playwright visual + mobile-overflow checks on one calculator and one article page.

## Technical notes

- Only additive changes to the engine: one new format string, two new components, one switch branch, one experiment variant, and slot-level format props. Existing formats keep working unchanged.
- Colors, radii and shadows come from existing semantic tokens (`--card`, `--border`, `--muted-foreground`, brand tints), so light/dark both work; no hardcoded hex in components.

## Open questions

1. Should the meta line show a real **validity date range** (like the reference) — which would require adding `valid_from`/`valid_to` to the affiliate config — or the partner category/offer summary we already have?
2. Replace the current Slot B/C card format outright, or run it as an A/B variant first (plan currently assumes A/B first)?
