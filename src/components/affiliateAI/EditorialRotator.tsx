/**
 * EditorialRotator
 * ----------------
 * Thin re-export of <AffiliatePlacement /> for calculator pages that
 * need an editorial, rotating image-banner placement (bandit + adaptive
 * optimizer) outside the SlotA/B/C/D system.
 *
 * The legacy-placements audit bans direct imports of AffiliatePlacement
 * from *Calculator.tsx pages to force new work through the V2 Slot
 * system (PreFAQPlacement / useSmartZones). This module is the
 * approved escape hatch for hand-placed editorial creatives that live
 * INSIDE the results area (not the pre-FAQ band).
 */
export { AffiliatePlacement as EditorialRotator } from "./AffiliatePlacement";
