## Verification results (already correct)

**Calculator coverage — PASS.** Sitemap contains 180 `<loc>` entries, 46 unique EN calculator routes — every entry in `EN_TO_TR` (src/utils/localizedRoutes.ts) is present in both EN and TR mirrors with hreflang pairs.

The earlier "missing" routes (`/calculators/mining`, `/calculators/tax`) **do not exist** in the router — those were stale slugs in `PremiumCalculatorCards.tsx` (already fixed last turn). The canonical routes are:
- `/calculators/mining-profitability` ✓ in sitemap
- `/calculators/capital-gains-tax` ✓ in sitemap
- `/calculators/rainbow-chart` ✓ in sitemap

**Lastmod — FAIL (your concern is valid).** All 180 URLs share `<lastmod>2026-06-07</lastmod>`. This is a freshness anti-pattern: Google's John Mueller has stated repeatedly that uniform/blanket lastmod dates are ignored (treated as untrustworthy) because they signal a global bump rather than real per-page edits. It can actively *reduce* crawl prioritization.

## Plan — per-page lastmod from git history + production audit

### 1. Per-page lastmod generator (the real fix)

Update `scripts/generate-sitemap.mjs` so each URL's `<lastmod>` reflects the **actual last edit date of the files that render that route**, derived from `git log -1 --format=%cs -- <files>`.

Mapping strategy:
- **Static pages** (`/`, `/about`, `/calculators`, `/tools`, `/learn`, `/contact`, `/privacy`, `/terms`, `/sitemap`) → `git log` on their page component + key shared components (e.g. `/` uses `src/pages/Index.tsx` + `src/components/Professional*`, `src/components/FAQSection.tsx`, etc.).
- **Calculator pages** → `git log` on the route's page component (resolved via `TR_CALC_ROUTES` mapping) plus its service file under `src/services/`.
- **TR mirrors** → inherit lastmod from their EN parent (same content modification window) or take max(EN file mtime, TR translation file mtime) if a TR-specific page module exists (e.g. `TurkishHome.tsx`).
- **Fallback** → if git returns nothing (new file not yet committed), use today's date.

Output guarantees:
- No two unrelated pages share a date by accident.
- Editing one calculator only bumps that calculator's lastmod on the next prebuild.
- Homepage lastmod reflects when hero/FAQ/cards components actually changed.

### 2. Wire into prebuild (already wired)

`predev` and `prebuild` in `package.json` already invoke the generator. Add a `--strict` flag that fails CI if git history is unreadable (so we never silently fall back to "today" for everything).

### 3. Production-readiness audit (run before going live)

Run these existing audit scripts in sequence and fix anything red:

| Script | What it catches |
|---|---|
| `node scripts/check-sitemap.mjs` | sitemap drift vs `EN_TO_TR` |
| `node scripts/audit-sitemap-routes.mjs` | every `<loc>` resolves to a real route + hreflang parity |
| `node scripts/audit-router-vs-sitemap.mjs` | ghosts (in sitemap, no route) and orphans (route, not in sitemap) |
| `node scripts/audit-broken-links.mjs` | internal + external linkrot |
| `node scripts/audit-canonical-hreflang.mjs` | canonical ↔ hreflang consistency |
| `node scripts/audit-tr-coverage.mjs` | TR translation completeness |
| `bunx vitest run` | full test suite (route parity, JSON-LD, OG, a11y) |

Plus one manual check: confirm `robots.txt` references `https://bitcoincalculator.tools/sitemap.xml` and not the preview domain.

### 4. Suggested best-practice additions (optional, for your call)

- **`changefreq` accuracy** — your live-data pages (halving-countdown, fear-greed, on-chain, dominance) should be `daily`; static legal pages `yearly`. Currently several inherit `weekly` blindly. The generator can derive this from a small per-route config map.
- **Drop `priority`** — Google ignores it entirely since 2017. Keeping it isn't harmful but it's noise; Bing still reads it so leaving it is fine.
- **Sitemap index** — at 180 URLs you don't need one (limit is 50,000), so skip.
- **News sitemap** — only if you start publishing time-sensitive articles, not needed now.

### Files touched

- `scripts/generate-sitemap.mjs` — add per-page git-mtime resolver + optional changefreq map.
- `package.json` — no change (predev/prebuild already wired).
- `public/sitemap.xml` — regenerated output (180 entries, per-page lastmod).

### Acceptance

- `grep -oE 'lastmod>[^<]+' public/sitemap.xml | sort -u | wc -l` returns ≥ 20 distinct dates (not 1).
- All 7 audit scripts pass.
- `vitest run` green.
