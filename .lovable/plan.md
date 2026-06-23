# SmartPlacementOrchestrator — Build Plan

This is a large 6-task build. I'll split it into two shipping phases so you can verify the foundation before I touch 39 calculator pages.

## Phase 1 — Foundation (this turn)

Build the orchestration engine + all reusable pieces. Nothing in existing pages changes yet, so no risk of breakage.

**New files:**
- `src/hooks/usePlacementOrchestrator.ts` — Task 1 hook, exactly per spec (scroll + time tracking, 5-zone decision tree, frequency caps, 3s `pageReady` gate from Task 6).
- `src/hooks/useScrollDepth.ts` — Task 5 utility hook.
- `src/components/placement/Zone1SlimBanner.tsx` — fade/collapse pre-calc banner.
- `src/components/placement/Zone2ResultsSpotlight.tsx` — 700 ms delayed spring-in gold zone with "Based on your result:" header.
- `src/components/placement/Zone3ContentGap.tsx` — IntersectionObserver native card.
- `src/components/placement/Zone4PreFAQ.tsx` — pre-FAQ checkpoint with rule line.
- `src/components/placement/Zone5Companion.tsx` — desktop sticky sidebar / mobile bottom bar, dismissable, sessionStorage-persisted.
- `src/components/placement/SmartCalculatorLayout.tsx` — wrapper combining all 5 zones; lazy-loads Zone 5 in Suspense (Task 6 §1).

**Reuses existing `AffiliatePlacement`** via `forceFormat` + `zone` props — I will NOT modify `AffiliatePlacement.tsx`, `analyticsClient.ts`, or any affiliate config.

**Per your last note:** I will NOT remove any currently-rendered banners/footer placements. The new system layers on top.

## Phase 2 — Page migrations (follow-up turn, after you approve Phase 1)

- **Task 4** — Migrate the 5 top-traffic pages (`BitcoinPowerLawCalculator`, `BitcoinLotSizeCalculator`, `BitcoinWhatIfCalculator`, `BitcoinRetirementCalculator`, `BitcoinSIPCalculator`). For each I'll report: identifiable content sections, the `hasResult` boolean, and whether full-mode or flat-mode wrapping was used.
- **Task 5** — Remaining 34 calculator pages: add `useScrollDepth`-gated `<AffiliatePlacement zone="pre-faq">` directly *above* the FAQ. Per your latest instruction I will leave any existing below-FAQ / footer banners in place rather than deleting them.

## Why split

Phase 1 is mechanical and matches your spec near-verbatim — safe to ship and verify in isolation. Phase 2 requires reading 39 page files to locate sections + result booleans; doing it after Phase 1 lands keeps the diff reviewable and lets you catch any orchestrator tweaks before they're propagated.

## Out of scope (per your DO NOT list)
- No changes to calculator math, `AffiliatePlacement`, Supabase tracking, analytics, affiliate configs, or AdSense.

Approve and I'll ship Phase 1 immediately, then proceed to Phase 2.
