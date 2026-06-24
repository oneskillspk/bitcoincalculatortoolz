import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useSmartZones } from "@/hooks/useSmartZones";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  resultSignals?: string[];
  /** Scroll threshold (0–100) before V2 slots activate. Default 45. */
  threshold?: number;
  className?: string;
}

/**
 * V2 drop-in migration shim.
 *
 * Legacy calculator pages mount <PreFAQPlacement /> just above their FAQ.
 * That position is, by construction, below the calculator+results — so
 * once the user has scrolled here we treat the page as result-engaged and
 * activate the full V2 Slot system:
 *
 *   • SlotB renders inline at this position (post-result intent moment)
 *   • SlotD mounts as the sticky companion (sidebar/bottom-bar)
 *   • SlotC may fire mid-content on long pages
 *
 * SlotA (pre-calc) is intentionally suppressed — by the time the user is
 * here the calculator is already behind them.
 *
 * This single shim migrates ~33 legacy pages to V2 without per-page edits.
 */
export const PreFAQPlacement = ({
  slug,
  lang,
  resultSignals,
  threshold = 45,
  className,
}: Props) => {
  const depth = useScrollDepth();
  const engaged = depth >= threshold;

  const sz = useSmartZones({
    pageSlug: slug,
    lang,
    resultSignals,
    // Position below results ≈ post-result intent. Gate on scroll so we
    // don't fire SlotD/SlotB on a user who hasn't reached this region yet.
    hasResultSignal: engaged,
    suppressZone1: true, // SlotA never relevant at this position
  });

  if (!engaged) return null;

  return (
    <>
      <div className={className ?? "container mx-auto px-6 max-w-5xl mt-8 mb-8"}>
        <hr className="border-border/40 mb-8" />
        <sz.SlotB />
        <sz.SlotC />
      </div>
      <sz.SlotD />
    </>
  );
};

export default PreFAQPlacement;
