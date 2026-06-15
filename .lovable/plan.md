# Audit & Fix Plan — Performance + UI/UX (EN + TR)

## Phase 1 — Triage (read-only, ~5 min)

Run in parallel and collect into `tmp/audit-2026-06.md`:

1. **Asset weight scan** — `find public src/assets -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" -o -name "*.svg" \) -size +100k -printf "%s\t%p\n" | sort -rn`. Flag anything >200 KB.
2. **Bundle weight** — inspect last `dist/` output if present, else read `vite.config.ts` manualChunks; list chunks >250 KB.
3. **Lighthouse-style runtime check** — `browser--performance_profile` on `/`, `/calculators/bitcoin-savings`, `/calculators/btc-vs-real-estate`, `/tr/`, `/tr/hesaplayicilar/bitcoin-birikim`. Capture LCP, CLS, INP, render-blocking, JS heap.
4. **Visual QA — overflow & polish** — `browser--screenshot` at 360 / 768 / 1280 viewports for the 5 routes above + 3 more high-traffic calculators. Look for: number/text overflow, clipped cards, misaligned grids, inconsistent spacing/typography, badge wrap, chart label collisions, hero CTA cramping, footer density, dark-mode contrast.
5. **Code grep for known smells** — `text-white|bg-black|bg-\[#` (hardcoded colors), `line-clamp-1` on dynamic text, missing `tabular-nums` on numeric displays, `min-w-0` missing on flex children with truncate.

Output: single ranked table (Severity × Effort) saved to `tmp/audit-2026-06.md` and summarized in chat.

## Phase 2 — Fixes (priority order)

Cap at ~8 issues this turn; defer the rest to a follow-up.

### P0 — Performance
- Convert any remaining PNG/JPG >150 KB to WebP via `lovable-assets` + rewrite references.
- Add `loading="lazy"` + `decoding="async"` to non-LCP `<img>`s missing them.
- Add `fetchpriority="high"` + `<link rel="preload">` for the actual LCP image per top route.
- Lazy-load Recharts on the 2–3 heaviest calculator pages (`React.lazy` + Suspense skeleton) if not already done.

### P1 — Overflow & numeric layout
- Add `tabular-nums`, `min-w-0`, `break-words`, and `truncate`/`line-clamp-2` guards to result cards, hero stat blocks, and any `K`/`M` formatted numbers that collide on narrow widths.
- Fix flex rows that overflow on 360 px (toolbars, badge clusters, FAQ headers).

### P2 — Modern, professional polish
- Normalize card padding (`p-5`/`p-6`), radii (`rounded-xl`), border tone (`border-border/40`), and hover lift across calculator result cards.
- Toolbars: equal-height `h-10` controls, consistent `gap-2 sm:gap-3`.
- Replace wrapping `Badge` chips with uppercase tracked captions where space is tight.
- Tighten section vertical rhythm using existing fluid spacing tokens — no new tokens introduced.

### Out of scope
- No business logic, calculator math, copy, SEO meta, or i18n string changes.
- No new routes, schema, or backend work.
- `og:image` migration stays parked.

## Verification

- Re-run `browser--screenshot` on the same routes/viewports; diff before/after in chat.
- Re-run `browser--performance_profile` on `/` + heaviest calculator; report LCP/CLS deltas.
- `bunx vitest run` for regression coverage.
- `node scripts/audit-app-readiness.mjs` to confirm sitemap/route parity untouched.

## Deliverables

- `tmp/audit-2026-06.md` — full audit table.
- Code edits limited to presentation components + asset pointers.
- Chat summary: before/after screenshots for 3 worst offenders, perf deltas, list of deferred items.
