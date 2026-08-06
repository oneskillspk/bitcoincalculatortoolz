import { useEffect, useState } from "react";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { useExperiment } from "@/hooks/useExperiment";
import type { SlotFormatPayload } from "@/config/experiments.config";
import { registerSlot } from "@/lib/placement/v2Registry";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  visible: boolean;
  resultSignals?: string[];
}

/**
 * Slot B — Result Adjacent.
 * Highest-intent ad moment. A/B tests format via `slot_b_format`
 * experiment: card vs banner. Variant stamp round-trips into
 * clicks.variant_id for CVR analysis.
 */
export const SlotB_ResultAdjacent = ({
  slug,
  lang,
  visible,
  resultSignals,
}: Props) => {
  const isMobile = useIsMobile();
  const ctxLang = useSafeLanguage();
  const effectiveLang = lang ?? ctxLang;
  const experiment = useExperiment<SlotFormatPayload>("slot_b_format");
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    registerSlot("B");
  }, []);

  useEffect(() => {
    const noAnim =
      typeof window !== "undefined" &&
      (window as unknown as { __TEST_NO_ANIM__?: boolean }).__TEST_NO_ANIM__ === true;
    if (visible) {
      if (noAnim) { setShouldRender(true); setIsAnimating(true); return; }
      const delay = setTimeout(() => {
        setShouldRender(true);
        requestAnimationFrame(() => setIsAnimating(true));
      }, 200);
      return () => clearTimeout(delay);
    }
    setIsAnimating(false);
    if (noAnim) { setShouldRender(false); return; }
    const t = setTimeout(() => setShouldRender(false), 250);
    return () => clearTimeout(t);
  }, [visible]);

  if (!shouldRender) return null;

  // Variant format only overrides on desktop — mobile stays single-card
  // for viewport reasons. Both variants still land in variant_id so we
  // measure card-vs-banner cleanly at the desktop segment.
  // Promo grid is the standard result-adjacent format. Mobile renders the
  // same grid collapsed to a single card inside PromoGrid (LCP protection).
  const format = "promo-grid" as const;

  return (
    <div
      data-slot="B"
      data-experiment={experiment.stamp}
      style={{
        transform: isAnimating ? "translateY(0)" : "translateY(12px)",
        opacity: isAnimating ? 1 : 0,
        transition:
          "transform 250ms cubic-bezier(0.22,1,0.36,1), opacity 200ms ease",
        marginTop: 16,
      }}
    >
      <AffiliatePlacement
        slug={slug}
        lang={effectiveLang}
        zone="post-result"
        resultSignals={resultSignals}
        forceFormat={format}
        maxAffiliates={isMobile ? 1 : 3}
        variantId={experiment.stamp}
      />
    </div>
  );
};

export default SlotB_ResultAdjacent;

