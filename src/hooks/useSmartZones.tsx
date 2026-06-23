import { useState, useCallback, useRef } from "react";
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
 * V2 four-slot API. Component identities are STABLE across renders to
 * avoid remounting AffiliatePlacement subtrees on every orchestrator
 * tick (the previous useMemo approach caused a ~1Hz skeleton blink).
 * Stable components read latest props/state from a ref.
 *
 * Backwards-compat aliases:
 *   Zone1 → SlotA, Zone2 → SlotB, Zone3 → SlotC,
 *   Zone4 → ∅ (REMOVED — no below-FAQ ads),
 *   Zone5 → SlotD
 */
export function useSmartZones(opts: SmartZonesOptions) {
  const { lang, resultSignals, ...config } = opts;
  const placement = usePlacementOrchestrator(config);
  const [slotDDismissed, setSlotDDismissed] = useState(false);
  const handleDismiss = useCallback(() => setSlotDDismissed(true), []);

  // Latest values mirror — read inside stable component functions.
  const stateRef = useRef({
    slug: config.pageSlug,
    lang,
    resultSignals,
    placement,
    slotDDismissed,
    handleDismiss,
  });
  stateRef.current = {
    slug: config.pageSlug,
    lang,
    resultSignals,
    placement,
    slotDDismissed,
    handleDismiss,
  };

  // Stable component identities — defined once per hook instance.
  // Pages render <sz.SlotA />, which re-runs when the page re-renders
  // (the orchestrator's 1Hz tick drives that), so updates propagate
  // without React unmounting the subtree.
  const [components] = useState(() => {
    const SlotA = () => {
      const s = stateRef.current;
      return (
        <SlotA_PreCalcAnchor
          slug={s.slug}
          lang={s.lang}
          visible={s.placement.slotAActive}
        />
      );
    };
    const SlotB = () => {
      const s = stateRef.current;
      return (
        <SlotB_ResultAdjacent
          slug={s.slug}
          lang={s.lang}
          visible={s.placement.slotBActive}
          resultSignals={s.resultSignals}
        />
      );
    };
    const SlotC = () => {
      const s = stateRef.current;
      return (
        <SlotC_MidContent
          slug={s.slug}
          lang={s.lang}
          visible={s.placement.slotCActive}
        />
      );
    };
    const SlotD = () => {
      const s = stateRef.current;
      return (
        <SlotD_StickyCompanion
          slug={s.slug}
          lang={s.lang}
          visible={s.placement.slotDActive && !s.slotDDismissed}
          onDismiss={s.handleDismiss}
        />
      );
    };
    const Zone4 = () => null;
    return {
      SlotA,
      SlotB,
      SlotC,
      SlotD,
      Zone1: SlotA,
      Zone2: SlotB,
      Zone3: SlotC,
      Zone4,
      Zone5: SlotD,
    };
  });

  return { placement, ...components };
}
