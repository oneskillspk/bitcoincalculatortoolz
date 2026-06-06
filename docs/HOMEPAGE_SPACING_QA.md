# Homepage Spacing QA — Hero → EST. 2024 → FAQ

Manual visual QA checklist for the cinematic homepage rhythm. Run after any
change to `ProfessionalHeroSection.tsx`, `EditorialStatement.tsx`, or
`FAQSection.tsx`.

## How to run

1. Open `/` (EN) and `/tr` (TR) in the preview.
2. Toggle light AND dark mode for each breakpoint.
3. Use the device picker above the preview, or browser devtools, to test:
   - **Mobile**: 375 × 812 (iPhone), 390 × 844, 414 × 896
   - **Tablet**: 768 × 1024, 820 × 1180
   - **Desktop**: 1280 × 720, 1440 × 900, 1920 × 1080
4. For each viewport, walk top → bottom and tick the items below.

## Hero (top of page)

- [ ] Live BTC ticker badge is visible directly under the navbar
- [ ] Ticker shows price OR loading skeleton OR error state — never empty
- [ ] Headline is fully on screen above the fold at ≥768 px height
- [ ] No horizontal scroll at any width
- [ ] CTA button is tappable (≥44 px target) on mobile

## Hero ↔ "EST. 2024 · 45 TOOLS · LIVE BTC" strip

- [ ] Visual gap between the CTA and the editorial eyebrow feels intentional
      (not cramped, not a vacuum)
- [ ] On mobile (≤640 px): gap reads as ~24–48 px
- [ ] On tablet (641–1023 px): gap reads as ~40–64 px
- [ ] On desktop (≥1024 px): gap reads as ~48–80 px
- [ ] Editorial eyebrow horizontal hairline aligns with container padding
- [ ] Serif statement does not overflow horizontally on 320 px width

## "EST. 2024" strip ↔ FAQ section

- [ ] FAQ "Frequently Asked Questions" eyebrow is clearly separated from
      the editorial caption above
- [ ] On mobile, the FAQ collapses to single column (no orphaned left rail)
- [ ] On desktop, two-column layout: left editorial rail + right list
- [ ] First FAQ item is visible without excess blank space above it

## Cross-cutting

- [ ] `prefers-reduced-motion: reduce` — no parallax, no scrub, no
      magnetic-button drift; layout still complete
- [ ] Keyboard tab order: nav → ticker (if interactive) → CTA → FAQ items
- [ ] Focus-visible rings appear on CTA and FAQ summary elements
- [ ] No layout shift (CLS) when the BTC ticker resolves from skeleton
- [ ] Footer top border is a single hairline, not a hard slab; matches
      site background in both light and dark mode

## Sign-off

| Viewport       | Light | Dark | Notes |
|----------------|-------|------|-------|
| 375 × 812      |       |      |       |
| 390 × 844      |       |      |       |
| 768 × 1024     |       |      |       |
| 1280 × 720     |       |      |       |
| 1440 × 900     |       |      |       |
| 1920 × 1080    |       |      |       |
