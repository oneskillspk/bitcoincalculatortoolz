## Goals

1. Fix the squashed/stretched Ledger banner (and any other affiliate banners with the same defect) so every variant renders at its true aspect ratio.
2. Replace the Koinly placeholder URL with the live affiliate link and verify Koinly is wired across every page the AI engine routes to.
3. Run a pre-launch audit of every enabled affiliate so no `PLACEHOLDER` or broken creative ships when we go live.

---

## Root cause of the compressed banner

`src/config/affiliates.config.ts` groups all Ledger horizontal sizes under one `responsive_group: "ledger-horizontal"`:

```
850×420   (≈ 2.02 : 1  — billboard)
728×90    (≈ 8.09 : 1  — leaderboard)
468×60    (≈ 7.80 : 1  — banner)
320×50    (≈ 6.40 : 1  — mobile leaderboard)
250×100   (≈ 2.50 : 1  — small square-ish)
```

`ImageBanner` in `src/components/affiliateAI/AffiliatePlacement.tsx` then builds a `<picture>` from the whole group:
- `<img>` fallback uses the smallest creative (e.g. 320×50 — 6.4:1).
- The container `style.maxWidth` is set to the *chosen* creative's width.
- The inline `aspect-ratio` is also the *chosen* creative's ratio.

When a `<source media="(min-width: 850px)">` matches but the image element's intrinsic dimensions are set by a different creative, the browser stretches the image into a wrong-aspect box. That is exactly what the screenshot shows: the 850×420 artwork rendered into a ~960×140 leaderboard slot.

## Fix plan — Part 1: Aspect-ratio-clean responsive groups

Restructure Ledger creatives in `src/config/affiliates.config.ts` (EN + TR mirrored):

| Group | Sizes | Aspect | Use |
|---|---|---|---|
| `ledger-billboard` | 850×420 | 2.02 : 1 | pre-footer / hero zones desktop only |
| `ledger-leaderboard` | 728×90, 468×60, 320×50 | ≈ 8 : 1 | inline / post-result / footer |
| `ledger-small-rect` | 250×100 | 2.5 : 1 | dense inline / sidebar bottom |
| `ledger-square` | 300×250 | 1.2 : 1 | sidebar / comparison (unchanged) |
| `ledger-skyscraper` | 120×600, 160×600, 300×600 | portrait | sidebar (unchanged) |

Then harden `ImageBanner` so a wrong group can never distort again:
- Add a dev-time `console.warn` in `pickResponsiveSet` if the group contains creatives whose `width/height` ratios differ by > 5%.
- In the rendered `<picture>`, set `width`/`height` on every `<source>` AND match `<img>` fallback to the chosen creative's aspect (not the smallest's), so the layout box never mismatches the served image.
- Add `object-fit: contain` + a fixed `aspect-ratio` derived from the matched source via a one-line layout-effect hook (read `currentSrc`, find its size in the set, update inline aspect-ratio). This guarantees no compression even if a CMS later adds an off-ratio creative.

Update `ZONE_SIZE_PREFERENCE` in `src/lib/affiliateAI/creativePicker.ts` so the 850×420 only wins in `pre-footer` desktop (where the screenshot was taken) and leaderboard sizes win in `inline` / `post-result`.

## Fix plan — Part 2: Wire real Koinly link

In `src/config/affiliates.config.ts`:
- Replace both `url_en` and `url_tr` for `id: "koinly"` with `https://koinly.io/?via=0481A637&utm_source=affiliate`.
- Expand `target_pages` so the AI engine surfaces Koinly on every tax/profit page: `["capital-gains-tax", "profit-loss", "inheritance-tax", "zakat", "dca", "investment", "hodl-strategy", "average-buy-price"]`.
- Keep `language_restriction: []` (Koinly serves TR users too).

## Fix plan — Part 3: Pre-launch affiliate audit

Add `scripts/audit-affiliate-links.mjs`:
- Parse `affiliates.config.ts`.
- For every `enabled: true` partner, fail if any `url_en`/`url_tr`/`landing_url` contains `PLACEHOLDER`, is `null` while a CTA is set for that language, or is missing required tracking params (`r=`, `via=`, `?ref=`, `utm_source=affiliate`, etc.).
- Disable `coinledger` (`fpr=PLACEHOLDER`) until a real ID arrives.
- Add a corresponding Vitest (`src/lib/affiliateAI/__tests__/noPlaceholderUrls.test.ts`) so CI blocks any future placeholder leak.

Run the existing `validateCreatives.test.ts`, `ledgerPlacement.integration.test.tsx`, and `redotpayFinalBanners.test.tsx`; add three new cases:
- A 1280-wide viewport snapshot proving the home `pre-footer` Ledger picks the 850×420 and renders at exactly 850×420 CSS px (regression for the bug in the screenshot).
- A 1280-wide viewport snapshot proving an `inline` zone on a calculator page picks 728×90 — never the 850×420.
- A Koinly placement test on `capital-gains-tax` that asserts the rendered `href` contains `via=0481A637`.

## Out of scope

- New Koinly creative artwork (we keep the card/inline-CTA format Koinly already uses).
- Backfilling artwork for any other affiliate beyond Ledger.
- Changing the AI scoring/Cloud decision flow.

## Files touched

- `src/config/affiliates.config.ts` — Ledger group restructure, Koinly URL + target_pages, disable `coinledger`.
- `src/components/affiliateAI/AffiliatePlacement.tsx` — `ImageBanner` aspect-ratio hardening.
- `src/lib/affiliateAI/creativePicker.ts` — zone-size preferences + dev warn for mixed-aspect groups.
- `scripts/audit-affiliate-links.mjs` — new audit script.
- `src/lib/affiliateAI/__tests__/noPlaceholderUrls.test.ts` — new test.
- `src/lib/affiliateAI/__tests__/ledgerPlacement.integration.test.tsx` — add two zone-correctness cases.
- `package.json` — add `audit:affiliates` script.

## Validation

1. `bunx vitest run src/lib/affiliateAI` — all green, including new aspect/placeholder/Koinly cases.
2. `node scripts/audit-affiliate-links.mjs` — exits 0.
3. Manual preview on `/` (1418px), `/calculators/dca` (mobile + desktop), `/tr/hesaplayicilar/kar-zarar` — confirm: no squashed banner, Turkish creative on TR route, Koinly link contains `via=0481A637`.