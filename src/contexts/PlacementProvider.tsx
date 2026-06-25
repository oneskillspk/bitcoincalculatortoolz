/**
 * PlacementProvider — optional shared-orchestrator context (P3).
 *
 * Today, every `useSmartZones(...)` call instantiates its own
 * orchestrator. Two callers on the same page → two orchestrators with
 * independent state. The slot-claim registry in
 * `src/lib/placement/slotClaim.ts` is the safety net that prevents
 * duplicate rendering at the DOM level.
 *
 * This provider is the *structural* fix. New pages or layouts can wrap
 * their route subtree in <PlacementProvider slug="..."> and any
 * descendant that calls `usePagePlacement()` receives the SAME
 * orchestrator output — guaranteeing single-source-of-truth slot state
 * for SlotA/B/C/D, dismiss tracking, click cooldown, and density caps.
 *
 * Existing pages continue to work unchanged via useSmartZones().
 */
import { createContext, useContext, type ReactNode } from "react";
import { useSmartZones } from "@/hooks/useSmartZones";
import type { Lang } from "@/lib/affiliateAI/types";

type SmartZones = ReturnType<typeof useSmartZones>;

const PlacementContext = createContext<SmartZones | null>(null);

interface PlacementProviderProps {
  slug: string;
  lang?: Lang;
  hasResultSignal?: boolean;
  resultSignals?: string[];
  suppressZone1?: boolean;
  children: ReactNode;
}

export function PlacementProvider({
  slug,
  lang,
  hasResultSignal,
  resultSignals,
  suppressZone1,
  children,
}: PlacementProviderProps) {
  const sz = useSmartZones({
    pageSlug: slug,
    lang,
    hasResultSignal,
    resultSignals,
    suppressZone1,
  });
  return (
    <PlacementContext.Provider value={sz}>{children}</PlacementContext.Provider>
  );
}

/**
 * Returns the placement object provided by the nearest
 * <PlacementProvider>. Throws in dev if no provider is present to
 * surface integration mistakes early.
 */
export function usePagePlacement(): SmartZones {
  const ctx = useContext(PlacementContext);
  if (!ctx) {
    throw new Error(
      "usePagePlacement() must be used inside <PlacementProvider>. " +
        "Either wrap the page or fall back to useSmartZones() directly."
    );
  }
  return ctx;
}

/** Non-throwing variant for components that may render outside a provider. */
export function useOptionalPagePlacement(): SmartZones | null {
  return useContext(PlacementContext);
}
