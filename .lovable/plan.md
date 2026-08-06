# Promo Card Cleanup — Ship-Ready Pass

Goal: promo cards look clean, professional and uncluttered, with a truthful offer-status pill.

## 1. Offer status pill (Ongoing = green)

Add optional offer window fields to each partner in the affiliate config:

- `offer_start` (optional, `YYYY-MM-DD`)
- `offer_end` (optional, `YYYY-MM-DD`)

Rules used by the card:

- No dates at all -> "Ongoing", green pill (evergreen offer).
- Today inside the window -> "Ongoing", green pill; if it ends within 14 days, show "Ends <date>" in amber instead.
- Today after `offer_end` -> offer treated as expired: pill hidden and the partner's badge is suppressed (no stale "8,000 USDT" claims).
- Today before `offer_start` -> pill hidden.

Green uses the existing `success` token (same tone system as `ResultBadge`), never a hardcoded colour. Turkish label: "Devam ediyor".

## 2. Remove duplicate branding

Today the panel shows a name chip on top of a creative that already contains the partner logo, and the card body repeats the name.

- Drop the overlay name chip on the image panel entirely.
- Keep the partner name only once, as the card heading.
- Keep the brandmark fallback panel as-is (that panel is the only place the name appears twice by design — heading will be hidden there instead of the panel text, so still one name).

## 3. Trim card content

Current card stacks: status pill + badge pill + name + description + category line + CTA. New order, tighter:

- Status pill (green) and offer badge on one row, offer badge shortened to a single value (e.g. "Up to $30,000" — drop everything after the bullet).
- Partner name (single line, truncated).
- Description clamped to 2 lines and sourced from the short copy; anything longer is cut at the sentence.
- Remove the category caption line ("Exchange", "Trading platform", "Crypto card", …) — it adds no value and pushes the CTA down.
- CTA button unchanged (full-width, solid primary).

Result: 4 content rows instead of 6, equal heights hold better across a 3-up grid.

## 4. Pre-ship checks

- Cards stay equal height at 1-up / 2-up / 3-up.
- No badge overflow at 320px width.
- Turkish copy present for every pill and badge shown.
- Update the existing promo-card Vitest suite and re-run the Playwright DCA grid check.

## Technical notes

- Files: `src/config/affiliates.config.ts` (date fields + shortened badges), `src/lib/affiliateAI/types.ts` (types), `src/components/affiliateAI/PromoCard.tsx` (pill logic, layout trim, chip removal), placement resolver passes the new fields through.
- Status/expiry logic lives in a small pure helper (`offerStatus.ts`) so it is unit-testable and reusable by other formats later.
- No changes to URL building, UTM, or click tracking.
