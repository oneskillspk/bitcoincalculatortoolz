import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import type { Lang } from "@/lib/affiliateAI/types";

interface Props {
  slug: string;
  lang?: Lang;
  resultSignals?: string[];
  /** Scroll threshold (0–100) before this placement renders. Default 55. */
  threshold?: number;
  className?: string;
}

/**
 * Task 5 helper — drop-in pre-FAQ placement gated on scroll depth.
 *
 * Use directly above any FAQ section on a calculator page that hasn't
 * been migrated to SmartCalculatorLayout. Replaces nothing; existing
 * AffiliatePlacement calls below the FAQ stay where they are.
 */
export const PreFAQPlacement = ({
  slug,
  lang,
  resultSignals,
  threshold = 55,
  className,
}: Props) => {
  const depth = useScrollDepth();
  if (depth < threshold) return null;
  return (
    <div className={className ?? "container mx-auto px-6 max-w-5xl mt-8 mb-8"}>
      <hr className="border-border/40 mb-8" />
      <AffiliatePlacement
        slug={slug}
        lang={lang}
        zone="pre-footer"
        resultSignals={resultSignals}
      />
    </div>
  );
};

export default PreFAQPlacement;
