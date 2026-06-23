import { useState, useCallback, useMemo } from "react";
import {
  usePlacementOrchestrator,
  type OrchestratorConfig,
} from "@/hooks/usePlacementOrchestrator";
import { SlotA_PreCalcAnchor } from "@/components/placement/SlotA_PreCalcAnchor";
import { SlotB_ResultAdjacent } from "@/components/placement/SlotB_ResultAdjacent";
import { SlotC_MidContent } from "@/components/placement/SlotC_MidContent";
import { SlotD_StickyCompanion } from "@/components/placement/SlotD_StickyCompanion";
import type { Lang } from "@/lib/affiliateAI/types";

interface SmartZonesOptions extends OrchestratorConfig {
  lang?: Lang;
  resultSignals?: string[];
}

/**
 * Flat-mode hook for calculator pages.
 *
 * V2 four-slot API (preferred):
 *   const sz = useSmartZones({ pageSlug, hasResultSignal });
 *   <sz.SlotA />        ← above the calculator card
 *   <Calculator />
 *   <sz.SlotB />        ← directly under the results, inside the card
 *   <sz.SlotC />        ← optional, inside long-form educational content
 *   <sz.SlotD />        ← sticky, render once outside <main>
 *
 * Backwards-compat aliases:
 *   Zone1 → SlotA   (pre-calc anchor)
 *   Zone2 → SlotB   (result adjacent)
 *   Zone3 → SlotC   (mid-content)
 *   Zone4 → ∅       (REMOVED — no more below-FAQ ads, ever)
 *   Zone5 → SlotD   (sticky companion)
 *
 * Existing pages keep working without edits; they just stop rendering the
 * old below-FAQ ad. New pages should call the SlotA..D names directly.
 */
export function useSmartZones(opts: SmartZonesOptions) {
  const { lang, resultSignals, ...config } = opts;
  const placement = usePlacementOrchestrator(config);
  const [slotDDismissed, setSlotDDismissed] = useState(false);
  const handleDismiss = useCallback(() => setSlotDDismissed(true), []);

  return useMemo(() => {
    const SlotA = () => (
      <SlotA_PreCalcAnchor
        slug={config.pageSlug}
        lang={lang}
        visible={placement.slotAActive}
      />
    );
    const SlotB = () => (
      <SlotB_ResultAdjacent
        slug={config.pageSlug}
        lang={lang}
        visible={placement.slotBActive}
        resultSignals={resultSignals}
      />
    );
    const SlotC = () => (
      <SlotC_MidContent
        slug={config.pageSlug}
        lang={lang}
        visible={placement.slotCActive}
      />
    );
    const SlotD = () => (
      <SlotD_StickyCompanion
        slug={config.pageSlug}
        lang={lang}
        visible={placement.slotDActive && !slotDDismissed}
        onDismiss={handleDismiss}
      />
    );

    // Zone4 alias — explicitly renders nothing. Below-FAQ ads were the
    // user-reported core problem; this is the structural fix.
    const Zone4 = () => null;

    return {
      placement,
      SlotA,
      SlotB,
      SlotC,
      SlotD,
      // Back-compat — calculator pages don't need editing.
      Zone1: SlotA,
      Zone2: SlotB,
      Zone3: SlotC,
      Zone4,
      Zone5: SlotD,
    };
  }, [
    placement,
    config.pageSlug,
    lang,
    resultSignals,
    slotDDismissed,
    handleDismiss,
  ]);
}
