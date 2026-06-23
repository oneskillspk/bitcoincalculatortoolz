import { useState, useCallback, useMemo } from "react";
import {
  usePlacementOrchestrator,
  type OrchestratorConfig,
} from "@/hooks/usePlacementOrchestrator";
import { Zone1SlimBanner } from "@/components/placement/Zone1SlimBanner";
import { Zone2ResultsSpotlight } from "@/components/placement/Zone2ResultsSpotlight";
import { Zone3ContentGap } from "@/components/placement/Zone3ContentGap";
import { Zone4PreFAQ } from "@/components/placement/Zone4PreFAQ";
import Zone5Companion from "@/components/placement/Zone5Companion";
import type { Lang } from "@/lib/affiliateAI/types";

interface SmartZonesOptions extends OrchestratorConfig {
  lang?: Lang;
  resultSignals?: string[];
}

/**
 * Flat-mode hook for calculator pages that aren't structured around
 * SmartCalculatorLayout's three-slot API. Drop the returned slot
 * components inline wherever you want each zone to render.
 *
 * Example:
 *   const sz = useSmartZones({ pageSlug: 'power-law', hasResultSignal: !!result });
 *   ...
 *   <sz.Zone1 />
 *   <Calculator />
 *   <sz.Zone2 />
 *   ...
 *   <sz.Zone4 />
 *   <FAQ />
 *   <sz.Zone5 />
 */
export function useSmartZones(opts: SmartZonesOptions) {
  const { lang, resultSignals, ...config } = opts;
  const placement = usePlacementOrchestrator(config);
  const [zone5Dismissed, setZone5Dismissed] = useState(false);
  const handleDismiss = useCallback(() => setZone5Dismissed(true), []);

  return useMemo(
    () => ({
      placement,
      Zone1: () => (
        <Zone1SlimBanner
          slug={config.pageSlug}
          lang={lang}
          visible={placement.zone1Active}
        />
      ),
      Zone2: () => (
        <Zone2ResultsSpotlight
          slug={config.pageSlug}
          lang={lang}
          visible={placement.zone2Active}
          resultSignals={resultSignals}
        />
      ),
      Zone3: () => (
        <Zone3ContentGap
          slug={config.pageSlug}
          lang={lang}
          visible={placement.zone3Active}
        />
      ),
      Zone4: () => (
        <Zone4PreFAQ
          slug={config.pageSlug}
          lang={lang}
          visible={placement.zone4Active}
          resultSignals={resultSignals}
        />
      ),
      Zone5: () => (
        <Zone5Companion
          slug={config.pageSlug}
          lang={lang}
          visible={placement.zone5Active && !zone5Dismissed}
          onDismiss={handleDismiss}
        />
      ),
    }),
    [
      placement,
      config.pageSlug,
      lang,
      resultSignals,
      zone5Dismissed,
      handleDismiss,
    ]
  );
}
