import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useSmartZones } from "@/hooks/useSmartZones";
import { useOptionalPagePlacement } from "@/contexts/PlacementProvider";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  resultSignals?: string[];
  /** Scroll threshold (0–100) before V2 slots activate. Default 45. */
  threshold?: number;
  /** When true, suppresses the sticky companion (SlotD). Use on hubs/home. */
  disableSlotD?: boolean;
  className?: string;
}

/**
 * V2 drop-in migration shim.
 *
 * If a <PlacementProvider> is present higher in the tree, this shim
 * reuses the parent's orchestrator instead of spinning up a second one
 * (preventing duplicate SlotB/C state). Otherwise it falls back to a
 * local useSmartZones instance for legacy pages.
 */
export const PreFAQPlacement = ({
  slug,
  lang,
  resultSignals,
  threshold = 45,
  disableSlotD = false,
  className,
}: Props) => {
  const depth = useScrollDepth();
  const engaged = depth >= threshold;
  const parent = useOptionalPagePlacement();

  const local = useSmartZones({
    pageSlug: slug,
    lang,
    resultSignals,
    hasResultSignal: engaged,
    suppressZone1: true,
  });

  const sz = parent ?? local;
  if (!engaged) return null;

  return (
    <>
      <div className={className ?? "container mx-auto px-6 max-w-5xl mt-8 mb-8"}>
        <hr className="border-border/40 mb-8" />
        <sz.SlotB />
        <sz.SlotC />
      </div>
      {!disableSlotD && <sz.SlotD />}
    </>
  );
};

export default PreFAQPlacement;

