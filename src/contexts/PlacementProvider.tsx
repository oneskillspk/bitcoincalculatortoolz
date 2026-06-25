/**
 * PlacementProvider — single-orchestrator-per-route context.
 *
 * Two usage modes:
 *
 *  1. Owner mode (new pages):
 *       <PlacementProvider slug="..." lang={lang} hasResultSignal={...}>
 *         ...children call usePagePlacement()
 *       </PlacementProvider>
 *
 *  2. Bridge mode (existing pages that already call useSmartZones):
 *       const sz = useSmartZones({...});
 *       return (
 *         <PlacementProvider value={sz}>
 *           ...existing JSX using sz.SlotA / sz.SlotB ...
 *         </PlacementProvider>
 *       );
 *
 * Either way, descendants share the SAME orchestrator instance via
 * `usePagePlacement()` / `useOptionalPagePlacement()` — eliminating
 * the multiple-orchestrator class of bugs at the source.
 */
import { createContext, useContext, type ReactNode } from "react";
import { useSmartZones } from "@/hooks/useSmartZones";
import type { Lang } from "@/lib/affiliateAI/types";

type SmartZones = ReturnType<typeof useSmartZones>;

const PlacementContext = createContext<SmartZones | null>(null);

type OwnerProps = {
  slug: string;
  lang?: Lang;
  hasResultSignal?: boolean;
  resultSignals?: string[];
  suppressZone1?: boolean;
  value?: undefined;
  children: ReactNode;
};

type BridgeProps = {
  value: SmartZones;
  slug?: undefined;
  lang?: undefined;
  hasResultSignal?: undefined;
  resultSignals?: undefined;
  suppressZone1?: undefined;
  children: ReactNode;
};

export type PlacementProviderProps = OwnerProps | BridgeProps;

export function PlacementProvider(props: PlacementProviderProps) {
  if ("value" in props && props.value) {
    return (
      <PlacementContext.Provider value={props.value}>
        {props.children}
      </PlacementContext.Provider>
    );
  }
  return <OwnerProvider {...(props as OwnerProps)} />;
}

function OwnerProvider({
  slug,
  lang,
  hasResultSignal,
  resultSignals,
  suppressZone1,
  children,
}: OwnerProps) {
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

export function useOptionalPagePlacement(): SmartZones | null {
  return useContext(PlacementContext);
}
