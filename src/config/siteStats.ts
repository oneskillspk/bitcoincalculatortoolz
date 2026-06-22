/**
 * Site-wide statistics — single source of truth.
 *
 * Updated whenever a new calculator route ships. The CI guard at
 * `scripts/audit-tool-count.mjs` fails the build if user-visible copy
 * advertises a different number than `LIVE_CALCULATOR_COUNT`.
 *
 * Counted from src/utils/localizedRoutes.ts EN_TO_TR calculator slugs
 * on 2026-06-16 → 46 live calculators.
 */
export const LIVE_CALCULATOR_COUNT = 49;

/** Human-friendly display, e.g. "46+ tools" stays accurate as we ship more. */
export const LIVE_CALCULATOR_COUNT_DISPLAY = `${LIVE_CALCULATOR_COUNT}+`;
