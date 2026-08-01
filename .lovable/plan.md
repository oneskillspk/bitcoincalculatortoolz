# Download & Export Audit — bitcoincalculator.tools

Audit of every CSV / PDF / image download path in the codebase, followed by a fix plan.

## What exists today

- **PDF**: one shared renderer (`renderStandardPdf`, jsPDF, A4) used by ~24 calculators through `ShareExportPanel`. Fully client-side, lazy-loaded, branded header with title, generated date and canonical URL.
- **PNG**: 7 calculators (snapshot cards).
- **CSV**: only **5** ad-hoc implementations — Retirement, DCA purchases table, Time Machine, Portfolio tracker, Drawdown correction. No shared CSV utility.
- **Hosting**: no custom CSP / `Content-Disposition` headers; all downloads are blob + `download` attribute, so nothing is server-blocked.

## Findings

### High

| # | Area | Pages affected | Issue | Fix |
|---|---|---|---|---|
| H1 | CSV coverage | Profit/Loss, Mining, Investment, Lump-sum vs DCA, Savings, Stack Sats, Leverage, Lot Size, Tax (UK/DE/IN/US), Halving, Fees, Rainbow, Price Target | Tabular results with no CSV export at all — only PDF/PNG | Add a shared `csv` action to `ShareExportPanel` for every calculator with row data |
| H2 | CSV encoding | all 5 existing CSVs | No UTF-8 BOM. Windows Excel renders `₺`, `é`, `–`, Turkish characters as mojibake | Prepend `\uFEFF` in one shared `downloadCsv()` helper |
| H3 | CSV metadata | all 5 | No BTC price used, no generation timestamp, no units in headers, no source URL row | Standard preamble rows: `Generated`, `BTC price (USD)`, `Source: https://bitcoincalculator.tools/<slug>` |
| H4 | Price parity | Portfolio, DCA table, Drawdown | Exports read component state that can lag the live-price hook; no assertion that export price == UI price | Pass the same `price` object used for rendering into the export payload; add unit tests |
| H5 | Mobile download | iOS Safari (all CSV paths) | `link.click()` without appending to DOM (Time Machine, Portfolio) fails in some iOS/WebView contexts; blob URL revoked synchronously in Time Machine can abort the download | Shared helper: append → click → `setTimeout(revoke, 4000)` → remove |

### Medium

| # | Area | Pages | Issue | Fix |
|---|---|---|---|---|
| M1 | Filenames | Portfolio, DCA table, Drawdown | Bypass `buildExportFilename`, so Turkish users get English names; Drawdown name has no date | Route all downloads through `buildExportFilename` |
| M2 | Paper size | every PDF | Hard-coded A4 210mm with 20mm margins. US Letter (216×279mm) is wider but **shorter** — bottom keep-out of 30mm is safe, so nothing clips, but the footer sits ~18mm high on Letter | Keep A4 (safe on both), document it; optionally add a Letter toggle |
| M3 | Fallback | all downloads | No "click here if the download didn't start" affordance when a browser blocks the programmatic click | Toast with a manual `<a href={blobUrl} download>` retry link, auto-revoked after 60s |
| M4 | Button labels | `ShareExportPanel` | Labels are `PDF report` / `CSV data` — no verb, ambiguous vs "view" | Rename to `Download PDF` / `Download CSV` (EN) and `PDF indir` / `CSV indir` (TR) |
| M5 | Tap targets | all export buttons | `h-9` = 36px, below the 44px minimum | `min-h-11` on mobile breakpoints |
| M6 | Percent formatting | Retirement, Drawdown, DCA CSVs | Percent values exported as raw decimals/plain numbers | Export as `12.5%` strings via the shared formatter |

### Low

| # | Issue | Fix |
|---|---|---|
| L1 | Only 4 of ~24 PDF exporters fire a success toast; CSV paths mostly silent | Emit "Your file is downloading" toast from the shared helpers |
| L2 | Only 2 PDFs pass `metaRows` (BTC price / currency); the rest omit the price used | Make `metaRows` mandatory in the PDF payload builder |
| L3 | No loading state on CSV buttons (instant today, but large tables block the main thread) | Reuse the existing `loading` prop |

## Fix plan

**Phase 1 — shared plumbing**
1. `src/utils/downloadFile.ts` — `downloadBlob()` with DOM-appended anchor, delayed revoke, iOS/WebView safe path, and a returned URL for the fallback link.
2. `src/utils/csvExport.ts` — `buildCsv({ meta, columns, rows })` emitting BOM + preamble (generated timestamp, BTC price, source URL) + RFC-4180 escaping + percent/decimal formatters.
3. Toast + manual-retry fallback wired into both helpers.

**Phase 2 — migrate the 5 existing CSVs** to the helpers (fixes H2, H3, H5, M1, M6).

**Phase 3 — add CSV to the tabular calculators** in H1, starting with Profit/Loss, Mining, Lump-sum vs DCA and Portfolio.

**Phase 4 — polish**: label rename (M4), 44px tap targets (M5), mandatory `metaRows` in PDFs (L2), success toasts (L1).

**Phase 5 — verification**: unit tests for BOM/escaping/percent/price-parity, a Playwright download test on Chrome-Android and iOS-Safari emulation for one CSV and one PDF, and a snapshot check that every PDF footer stays inside both A4 and Letter bounds.

## Technical notes

- No CSP or `Content-Disposition` changes are needed — downloads are same-origin blobs with the HTML5 `download` attribute, which Chrome Android and iOS Safari 13+ both honour (iOS routes them to the Files app).
- jsPDF stays lazy-imported so bundle size is unaffected.
