import { SlotA_PreCalcAnchor } from "@/components/placement/SlotA_PreCalcAnchor";
import { useOptionalPagePlacement } from "@/contexts/PlacementProvider";
import { usePlacementOrchestrator } from "@/hooks/usePlacementOrchestrator";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  hasResultSignal?: boolean;
  className?: string;
}

/**
 * Phase-3 revenue coverage: dedicated wrapper that renders Slot A
 * (pre-calc anchor) directly above a calculator form. Pages drop it
 * ABOVE their inputs; it self-collapses the moment a result fires
 * (orchestrator hands off to SlotB) and obeys the same fatigue +
 * cooldown rules as the rest of the V2 system.
 *
 * If a <PlacementProvider> is present higher up, this reuses the
 * shared orchestrator so we never double-arm SlotA.
 */
export const PreCalcPlacement = ({
  slug,
  lang,
  hasResultSignal = false,
  className,
}: Props) => {
  const parent = useOptionalPagePlacement();
  const local = usePlacementOrchestrator({
    pageSlug: slug,
    hasResultSignal,
  });
  const state = parent?.state ?? local;

  return (
    <div className={className ?? "container mx-auto px-6 max-w-5xl"}>
      <SlotA_PreCalcAnchor
        slug={slug}
        lang={lang}
        visible={state.slotAActive}
      />
    </div>
  );
};

export default PreCalcPlacement;
