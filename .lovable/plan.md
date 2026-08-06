# Bybit campaign boxes — width, styling, mobile polish

## What's wrong today

- **Width mismatch**: the Bybit section uses `max-w-6xl` + its own padding, while "Live Bitcoin Calculations" uses `container mx-auto px-4 sm:px-6` with an inner `max-w-7xl`. The ads row visibly sits narrower than the section above it.
- **Badges**: "Hot" and "Ongoing" sit glued together on the left, both same size, which reads noisy.
- **Mobile carousel**: cards are 86% wide snap items with no peek rhythm, no swipe affordance, and the whole card is one big link with no explicit 44px tap surface guidance.
- **Links**: verified — the three campaign URLs in the config are exactly the ones supplied (`aff_7_160486`, `aff_61103_160486`, `aff_59843_160486`), each wrapped with UTM + click-id attribution and a click event. No change needed; the audit step will re-confirm end to end.

## Changes

### 1. Match section width
Wrap the grid in the same shell as the live-calculations section: `container mx-auto px-4 sm:px-6` with an inner `max-w-7xl`. Keep vertical rhythm (`py-12 md:py-20`) and the same header treatment so the two sections line up edge to edge.

### 2. Card styling to match the reference
- Creative panel: neutral light surface with a soft rounded inner radius, image `object-contain` (unchanged creatives/dates).
- Card: white/card background, 1px subtle border, `rounded-2xl`, restrained shadow that lifts on hover — same as the reference mockup, less orange tint bleed than now.
- Title: single strong line, truncated; date line kept in muted small text.

### 3. Badge layout
One row, `justify-between`: qualifier badge (Hot / Exclusive) on the left, green "Ongoing" pill pushed to the right. Consistent 22px pill height, same tracking, no double pill clumping.

### 4. Mobile carousel + tap targets
- Snap-scroll row with `snap-center`, ~82% card width so the next card peeks (clear swipe affordance).
- Consistent scroll padding so the first and last cards align to the gutter.
- Minimum 44px effective tap height on the card footer area; hover/active state replaced by a press state on touch.
- Optional slim progress dots under the row on mobile only (non-interactive indicator, decorative + `aria-hidden`).

### 5. Audit & tests
- Update `e2e/homepage-bybit-campaigns.spec.ts`: assert section width parity with the live-calculations container, one Ongoing pill per card, badge left/right placement, `object-contain` creatives, `rel="sponsored nofollow noopener"`, and the exact partner hostnames/campaign paths.
- Re-run visual baselines at 390 / 768 / 1280.
- Playwright pass on the live preview to confirm no console errors, no horizontal overflow on mobile, and that each card's resolved href carries the right campaign id + UTM.

## Files touched

- `src/components/affiliateAI/BybitCampaignGrid.tsx` — layout, container, badges, mobile carousel
- `src/pages/Index.tsx` (and `TurkishHome.tsx` if it mounts the grid) — wrapper alignment only
- `e2e/homepage-bybit-campaigns.spec.ts` — expanded assertions + refreshed snapshots

Creatives, titles, dates, and affiliate links stay exactly as they are.
