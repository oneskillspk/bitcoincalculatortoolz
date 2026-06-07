## Plan: Final launch QA + blocking fixes

### 1. Fix the build-blocking internal links
- Trace the five broken Turkish calculator URLs reported by `audit:internal-links`.
- Replace stale short TR slugs like `/tr/hesaplayicilar/cagr` with the canonical routes already registered in `src/App.tsx` / `src/utils/localizedRoutes.ts`.
- Add a focused guard if needed so future English-shaped TR calculator links normalize before they reach the router.

### 2. Remove the QA-page canonical warnings
- Update the schema audit allowlist so internal noindex QA pages are treated like other private/dev pages:
  - `AffiliatePlacementQA.tsx`
  - `StateCardsQA.tsx`
  - `TypographyPreview.tsx`
- Keep their existing `noindex,nofollow`; do not add public canonicals for internal QA routes.

### 3. Fix small-screen font and digit clipping
- Audit the typography utilities and global numeric guards in `src/index.css` and `tailwind.config.ts`.
- Tighten line-height, `overflow-wrap`, `min-width: 0`, tabular numeric rendering, and responsive text clamps where digits/headings can cut off at 360px.
- Patch only the affected shared primitives or global utilities first, then any specific component still clipping.

### 4. Verify share/download/copy flows at 360×800
- Use the 360×800 preview to test migrated `ShareSnapshotCard` calculators and key legacy export calculators.
- Confirm live preview images render, share buttons do not clip, PNG download works, copy-text fallback works, and no share/export panel causes horizontal overflow.
- Patch shared share/export UI if any clipping or broken-image issue appears.

### 5. Run final Lighthouse performance + accessibility audit
- Capture Lighthouse-style performance/accessibility signals for the homepage and representative calculator pages.
- Record top launch fixes by impact: LCP/CLS/INP/resource size, color contrast, labels/button names, tap targets, and mobile overflow.
- Fix only clear P0/P1 launch blockers discovered by the audit; otherwise report them as post-launch recommendations.

### 6. Update the launch audit doc
- Add a final QA section to `docs/audit-2026-06-launch.md` with:
  - build audit fixes applied
  - 360×800 share/export verification results
  - Lighthouse/accessibility findings
  - remaining top fixes before publish