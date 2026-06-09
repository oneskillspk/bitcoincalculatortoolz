# Enterprise Audit & Remediation Plan

Four interlinked production issues across **advertising delivery**, **social/SEO pre-rendering**, **localization**, and **share-export UX**. Each item has a forensic audit, a root-cause finding, and a phased fix with verification gates.

---

## ISSUE 1 — Ledger banner: true responsive `srcSet` per breakpoint

### Audit findings

- `src/components/affiliateAI/AffiliatePlacement.tsx` (lines 247–278) currently emits only `1x` + optional `2x` density descriptors. There is **no width-descriptor `srcSet**` and **no `<picture>` art-direction**, so a phone visiting `/` still downloads the desktop-chosen image (e.g. 728×90) and visually downscales it — wasted bytes + blurry rendering on tall phones.
- Ledger creatives in `src/config/affiliates.ts` cover 9 sizes per language. They are currently treated as **mutually exclusive choices** (one wins per zone+device) rather than an **art-direction set**.
- `creativePicker.ts` returns a single creative; the renderer can't pick at the browser layer.

### Root cause

Single-creative selection happens server-side / on first render via `pickCreative`. The browser never sees alternates, so it cannot adapt on rotation, container-query resize, or DPR changes mid-session.

### Fix (Phase A)

1. Extend `AffiliateCreative` type with an optional `responsive_group: string` (e.g. `"ledger-horizontal"`, `"ledger-square"`, `"ledger-skyscraper"`).
2. Tag all 9 Ledger EN + 9 TR creatives with one of three groups based on aspect-ratio family (horizontal ≥3:1, square 1:1–4:5, skyscraper ≤1:2).
3. Add `pickResponsiveSet(program, zone, device, lang)` that returns **one art-direction group** of creatives matched to the zone, sorted ascending by width.
4. Rewrite `ImageBanner` to render `<picture>` with `<source media="(min-width: …)" srcSet="…" width=… height=…>` per breakpoint and a default `<img>` fallback. Each `<source>` advertises native `width`/`height` so CLS stays zero.
5. Preserve the existing tracking — every `srcSet` URL still resolves to the same `r=8c4e8e87cac7` landing URL via the wrapping anchor; tests in `ledgerFinalBanners.test.tsx` are extended to assert each `<source>` size and the single anchor href.

### Verification

- Extend `ledgerFinalBanners.test.tsx` snapshots to capture the `<picture>` tree for EN and TR per zone.
- Add a Playwright check at mobile (375), tablet (768), desktop (1280) that asserts the visible `<img>` `currentSrc` matches the expected breakpoint asset.

---

## we have completly skip the Phase b AND Its fixes, dp not any changes from phase B, REPLAN and strictly do not made any changes about pre rendering or phase b.

---

## ISSUE 3 — English OG image served on Turkish pages

### Audit findings

- Static `index.html` always advertises `social-preview.webp` (EN). TR routes have no static TR fallback — so scrapers serving the static HTML show EN.
- All 112 TR Helmet blocks reuse a **single** TR OG: `bitcoin-kar-hesaplayici-og.webp`. This means every TR page (CAGR, Loan, Mining, HODL, Lot Size, Fear/Greed, Profit/Loss, Tax, etc.) shares the same generic TR card. The EN side already has per-calculator OG variants — TR has zero.
- The TR fallback URL pattern is also hard-coded in 112 places; rename = 112-file codemod.

### Root cause

TR OG was bolted on as a single generic asset via codemod; never re-audited as the calculator set grew. The static head was never localized because there's no per-route static HTML.

### Fix (Phase C)

1. **Static fallback (paired with Phase B prerender)**: write `tr/index.html` with `og:image=/bitcoin-kar-hesaplayici-og.webp` + TR `og:image:alt` + `og:locale=tr_TR`. EN gets `og:locale=en_US`.
2. **Per-calculator TR OG cards**: generate 12 high-traffic TR OG images first (DCA, Profit/Loss, CAGR, HODL, Loan, Retirement, Tax, Mining, Lot Size, Fear/Greed, Purchasing Power, Price Target). Add via `imagegen` (premium tier) into `public/og/tr/<slug>.webp` 1200×630.
3. **Centralized OG resolver**: create `src/lib/ogImage.ts` exporting `getOgImage(slug, lang)` returning `{url, alt, width, height}`. Replace the 112 inline ternaries with `<HelmetOG slug={slug} />` — a single component that emits a complete OG block. This is a codemod + cleanup.
4. **Hreflang/locale alignment**: ensure `og:locale` (`en_US` / `tr_TR`) and `og:locale:alternate` are emitted per page.
5. Mid-traffic + long-tail TR pages keep the generic TR fallback until images exist.

### Verification

- Extend `src/test/tr-og-image.test.tsx` to walk **every** TR route and assert: TR locale tag, TR alt, TR-specific image when one exists, generic TR fallback otherwise, and **never** the EN `social-preview.webp`.
- New `scripts/audit-og-coverage.mjs` listing each calculator slug × {EN, TR} and the resolved OG URL — fail CI if any TR page resolves to an EN image.
- Manual scraper validation per Issue 2's checklist for 10 TR slugs.

---

## ISSUE 4 — Duplicate / low-quality PNG export across calculator pages

### Audit findings

- **31** files in `src/components/**` export Share or Report panels. Several pages mount **two** independent panels — a `ShareCard` AND an `ExportReport` — both wired to different actions but visually adjacent, creating duplicate "Share / Copy / PNG / PDF" controls. Examples: BitcoinLoan, AverageBuyPrice, Wealth, Inheritance Tax, Pizza Day.
- PNG capture goes through `captureSnapshot` (`html2canvas`, scale 2, paper bg). Most export refs wrap **the whole calculator container**, not just the results card. On long-form calculator pages this captures the input form + ads + footer, producing oversized, cluttered PNGs.
- A few pages (Price Target, Rainbow) use `data-chart-export` selectors and capture only the chart — these look professional; they're the model.
- `html2canvas` cannot rasterize affiliate iframes/cross-origin Ledger images cleanly → many PNGs render with broken banner blocks or CORS warnings in console.
- Result: users see **two share UIs**, one that produces a clean text snippet (good) and one that produces a broken full-page screenshot (bad).

### Root cause

Two parallel share/export systems evolved independently: per-calculator `ShareCard` components (text + social) vs. `ExportReport` components (PNG/PDF via `html2canvas`). No central rule defined which captures what, so calculators mounted both.

### Fix (Phase D) — Consolidate into one professional Share & Export system

1. **Define the contract** in `src/components/share-export/README.md`:
  - Every calculator exposes exactly ONE `ShareExportPanel`.
  - That panel carries up to four actions: `twitter`, `linkedin`, `copy-text`, `download-png`, `download-pdf`.
  - PNG MUST capture a **dedicated `<ShareSnapshotCard>**` (rendered off-screen, branded, results-only) — never the live DOM.
  - PDF uses the existing `downloadStandardPdf` structured report; no html2canvas fallback for documents.
2. **Migrate every calculator** to render `<ShareSnapshotCard>` (already exists in `src/components/share-export/`) with calculator-specific stats. The card is a **purpose-built 1200×630 / 1080×1080 canvas** drawn via `drawShareCard` — guaranteed clean, branded, ad-free.
3. **Delete duplicates**: remove `*ShareCard.tsx` panels where an `ExportReport` already exists, OR vice versa. Net result per page: 1 panel, 4 actions, 1 snapshot surface.
4. **Kill DOM-snapshot exports** for any page that includes affiliate banners or charts that don't tolerate `html2canvas`. Replace with `ShareSnapshotCard` + chart-only `data-chart-export` selectors where charts must appear.
5. **Visual hierarchy**: place the consolidated panel in the results card footer with a divider above it; never adjacent to a sponsored placement.

### Migration scope (concrete file list)


| Calculator                                                                                                                            | Current state                            | Action                                           |
| ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------ |
| BitcoinLoan                                                                                                                           | ShareCard + ExportReport                 | Merge → 1 panel, ShareSnapshotCard for PNG       |
| AverageBuyPrice                                                                                                                       | ShareCard + ExportReport                 | Merge                                            |
| Wealth                                                                                                                                | ShareCard + ExportReport + ShareSnapshot | Keep ShareSnapshot, drop ShareCard               |
| Inheritance Tax                                                                                                                       | ShareCard + ExportReport                 | Merge                                            |
| Pizza Day                                                                                                                             | ShareCard + ExportReport                 | Merge                                            |
| Accumulation Score                                                                                                                    | ShareCard only                           | Add SnapshotCard, keep panel                     |
| Price Target                                                                                                                          | Both, chart-only PNG                     | Already good — only consolidate text/social      |
| Rainbow                                                                                                                               | ExportReport, chart-only PNG             | Already good                                     |
| CAGR / Volatility / Converter / TimeMachine / What-If / Profit-Loss                                                                   | ShareSnapshot present                    | Drop ad-hoc PNG, route through ShareSnapshotCard |
| Remaining (Mining, Lot Size, Lightning, Investment, Retirement, Savings, Halving, Fear-Greed, Leverage, Transaction Fees, Stack Sats) | ExportReport only                        | Add ShareSnapshotCard for PNG, keep PDF          |


### Verification

- New `src/test/share-export-singularity.test.tsx`: walks each calculator page, mounts it, asserts exactly one `[data-share-export-panel]` root and zero legacy duplicates.
- New `src/test/png-snapshot-source.test.tsx`: asserts every `download-png` action calls `drawShareCard` (not `html2canvas` on a calculator container).
- Visual regression: render every ShareSnapshotCard in a Storybook-style harness; snapshot the canvas to PNG under `src/components/share-export/__tests__/__snapshots__/snapshot-cards/`.
- Manual QA matrix: 4 calculators × {EN, TR} × {PNG, PDF, Twitter, LinkedIn, Copy} → 40 cases; capture screenshots into `docs/SHARE_EXPORT_QA.md`.

---

## EXECUTION ORDER

```text
Week 1  Phase B  Static OG fallbacks + prerender for / and /tr
Week 1  Phase A  Responsive <picture> + srcSet for Ledger
Week 2  Phase C  Localized OG resolver + 12 TR OG images + codemod
Week 2  Phase D  Share/Export consolidation (high-traffic 6 pages first)
Week 3  Phase D  Remaining 25 pages + visual regression
Week 3  All      CI gates: og-coverage, share-singularity, png-source, picture-srcset
```

## TECHNICAL DETAILS (for engineering review)

- **Types**: extend `AffiliateCreative` with `responsive_group?: string`. No DB migration — config-only.
- `**<picture>` rendering**: ordered `<source>` children largest-to-smallest, `media="(min-width: Npx)"`, each with `width`/`height` to lock layout. Default `<img>` is the smallest.
- **Prerender**: Vite plugin `vite-plugin-prerender-routes` or a custom 30-line post-build script that copies `dist/index.html` to `dist/tr/index.html` with locale string replacements. (SKIP THIS PLEASE)
- **OG resolver**: pure TS lookup table keyed by slug; codemod is `jscodeshift` or 50-line `mjs` regex pass over the 112 known Helmet blocks (pattern is identical in every page).
- **ShareSnapshotCard**: already implemented in `src/components/share-export/exporters/shareImageCanvas.ts`; only need to wire per-calculator `payload` objects.
- **CI gates**: new vitest specs + 2 audit scripts wired into existing `audit-*` lineup; failing scripts exit non-zero.

## OUT OF SCOPE

- SSR/edge rendering migration (would solve OG cleanly but is a multi-week stack change).
- Replacing `html2canvas` with `satori` for PDF cover pages.
- Generating TR OG art for every long-tail calculator (only top 12 in this phase).