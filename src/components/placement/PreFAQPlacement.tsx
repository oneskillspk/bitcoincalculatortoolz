import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useSmartZones } from "@/hooks/useSmartZones";
import { useOptionalPagePlacement } from "@/contexts/PlacementProvider";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  resultSignals?: string[];
  /** Scroll threshold (0–100) before V2 SlotB/C activate. Default 45. */
  threshold?: number;
  /** When true, suppresses the sticky companion (SlotD). Use on hubs/home. */
  disableSlotD?: boolean;
  /** Phase-3: render SlotA (pre-calc anchor) when no parent provider is mounted. */
  enableSlotA?: boolean;
  className?: string;
}

/**
 * V2 drop-in migration shim.
 *
 * If a <PlacementProvider> is present higher in the tree, this shim
 * reuses the parent's orchestrator instead of spinning up a second one
 * (preventing duplicate SlotB/C state). Otherwise it falls back to a
 * local useSmartZones instance for legacy pages.
 *
 * Phase 3 (revenue coverage):
 *   - SlotD is on by default (desktop sticky companion + mobile bottom).
 *   - SlotA opt-in via `enableSlotA` so pages that drop the shim near
 *     the top of the page surface a pre-calc CTA on idle hint.
 */
export const PreFAQPlacement = ({
  slug,
  lang,
  resultSignals,
  threshold = 45,
  disableSlotD = false,
  enableSlotA = false,
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
    suppressZone1: !enableSlotA,
  });

  const sz = parent ?? local;

  return (
    <>
      {enableSlotA && !parent && <sz.SlotA />}
      {engaged && (
        <div className={className ?? "container mx-auto px-6 max-w-5xl mt-8 mb-8"}>
          <hr className="border-border/40 mb-8" />
          <sz.SlotB />
          <sz.SlotC />
        </div>
      )}
      {!disableSlotD && <sz.SlotD />}
    </>
  );
};

export default PreFAQPlacement;

