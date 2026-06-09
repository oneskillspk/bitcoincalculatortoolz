# Share & Export — single-system contract

Every calculator exposes **exactly one** share/export surface. Mounting a
`ShareCard` + an `ExportReport` side-by-side is a regression; the codebase
ships one consolidated UI per results section.

## Rules

1. **One panel per calculator.** Mount a single `<ShareExportPanel>` (or a
   single `<ShareSnapshotCard>` wrapper) inside the results section. Never
   render two stacked panels.

2. **PNG capture must use `ShareSnapshotCard` / `drawShareCard`** — a
   purpose-built off-screen canvas (1200×630 or 1080×1080) drawn from
   calculator stats. Do **not** call `captureSnapshot(exportRef.current)`
   on a live DOM node that contains the full page, inputs, or affiliate
   banners — those PNGs ship with broken/cropped chrome and CORS-tainted
   ad pixels.

3. **PDF uses `downloadStandardPdf`** (structured PDF report) for tabular
   exports. `html2canvas`-based PDFs are only acceptable for chart-only
   exports where the captured node is gated by a `data-chart-export="..."`
   selector wrapping a single chart container.

4. **Layout:** the panel sits in the results card footer with a divider
   above it. Never adjacent to a sponsored placement — one logical zone
   per visual column.

5. **Single source of truth for share text.** Build the share text inline
   in the consumer with the stats already in scope; pass it to
   `ShareExportPanel`. Don't fork the text generation across a `ShareCard`
   and the export panel.

## Allowed actions

A panel may carry: `twitter`, `linkedin`, `copy-link`, `copy-text`,
`download-png`, `download-pdf`. Pick the subset that matches the
calculator's deliverable; never mount duplicates.

## Migration status

See `docs/SHARE_EXPORT_QA.md` for the per-calculator audit and migration
checklist. Pages migrated to the consolidated pattern carry the data
attribute `data-share-export-panel` on the panel root, which the
singularity test (`src/test/share-export-singularity.test.tsx`) asserts is
present at most once per rendered page.
