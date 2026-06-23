import { ReactNode, Suspense, lazy, useState } from "react";
import { usePlacementOrchestrator } from "@/hooks/usePlacementOrchestrator";
import { Zone1SlimBanner } from "./Zone1SlimBanner";
import { Zone2ResultsSpotlight } from "./Zone2ResultsSpotlight";
import { Zone3ContentGap } from "./Zone3ContentGap";
import { Zone4PreFAQ } from "./Zone4PreFAQ";
import type { Lang } from "@/lib/affiliateAI/types";

// Lazy-load the sticky companion (Task 6 §1). It's only relevant
// after a result fires, so deferring its bundle helps initial paint.
const Zone5Companion = lazy(() => import("./Zone5Companion"));

interface Props {
  slug: string;
  lang?: Lang;
  hasResult: boolean;
  resultSignals?: string[];
  calculatorContent: ReactNode;
  educationalContent: ReactNode;
  faqContent: ReactNode;
  autoCalc?: boolean;
  className?: string;
  suppressZone1?: boolean;
  suppressZone5?: boolean;
}

/**
 * SmartCalculatorLayout — orchestrates the 5-zone smart placement system
 * around a calculator's three logical sections.
 *
 * Sacred space: nothing renders inside `calculatorContent`. Zone 2 is the
 * only post-result placement and slides in 700 ms after a result lands.
 */
export const SmartCalculatorLayout = ({
  slug,
  lang,
  hasResult,
  resultSignals,
  calculatorContent,
  educationalContent,
  faqContent,
  autoCalc,
  className,
  suppressZone1,
  suppressZone5,
}: Props) => {
  const [zone5Dismissed, setZone5Dismissed] = useState(false);

  const placement = usePlacementOrchestrator({
    pageSlug: slug,
    hasResultSignal: hasResult,
    autoCalc,
    suppressZone1,
    suppressZone5,
  });

  return (
    <div className={className}>
      <Zone1SlimBanner
        slug={slug}
        lang={lang}
        visible={placement.zone1Active}
      />

      {/* SACRED SPACE — zero monetization inside */}
      <div className="calculator-sacred-space">{calculatorContent}</div>

      <Zone2ResultsSpotlight
        slug={slug}
        lang={lang}
        visible={placement.zone2Active}
        resultSignals={resultSignals}
      />

      <div className="educational-content mt-12">
        <Zone3ContentGap
          slug={slug}
          lang={lang}
          visible={placement.zone3Active}
        />
        {educationalContent}
      </div>

      <Zone4PreFAQ
        slug={slug}
        lang={lang}
        visible={placement.zone4Active}
        resultSignals={resultSignals}
      />

      <div className="faq-section">{faqContent}</div>

      <Suspense fallback={null}>
        <Zone5Companion
          slug={slug}
          lang={lang}
          visible={placement.zone5Active && !zone5Dismissed}
          onDismiss={() => setZone5Dismissed(true)}
        />
      </Suspense>
    </div>
  );
};

export default SmartCalculatorLayout;
