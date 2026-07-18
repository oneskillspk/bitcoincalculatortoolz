/**
 * Placement weights (admin-controlled).
 *
 * Lets the operator route more or less bandit budget to each broker per
 * on-page slot. Persisted in localStorage so admins can tune revenue without
 * a deploy. The runtime bandit reads getPlacementWeight(brokerId, slot) and
 * multiplies its score by that weight (0 disables the broker in that slot,
 * 1 = default, 2 = 2× more likely to be shown).
 *
 * Slots are user-visible page zones, not the internal AffiliateAI Zone enum
 * (which is finer-grained). The mapping to Zone lives in SLOT_TO_ZONES.
 */
import type { Zone } from "@/lib/affiliateAI/types";

export type PlacementSlot = "header" | "sidebar" | "mid-page" | "bottom";

export const PLACEMENT_SLOTS: PlacementSlot[] = ["header", "sidebar", "mid-page", "bottom"];

/** Slot → underlying AffiliateAI zones that live in that visual region. */
export const SLOT_TO_ZONES: Record<PlacementSlot, Zone[]> = {
  header: ["inline"],
  sidebar: ["sidebar"],
  "mid-page": ["inline-mid-article", "post-result", "comparison"],
  bottom: ["pre-footer", "footer"],
};

/** Brokers that are currently tunable from the admin. */
export const TUNABLE_BROKERS = [
  { id: "axi", name: "Axi" },
  { id: "vantage", name: "Vantage" },
] as const;

export type TunableBrokerId = (typeof TUNABLE_BROKERS)[number]["id"];

export type WeightMap = Record<string, Partial<Record<PlacementSlot, number>>>;

const LS_KEY = "affiliateAI.placementWeights.v1";

const DEFAULT_WEIGHTS: WeightMap = {
  // Seed max-revenue defaults: Axi already has creatives; bias toward
  // mid-page + bottom where lot-size / liquidation intent is highest.
  axi: { header: 0.5, sidebar: 1, "mid-page": 1.5, bottom: 1.5 },
  vantage: { header: 0.5, sidebar: 1, "mid-page": 1, bottom: 1 },
};

export function loadPlacementWeights(): WeightMap {
  if (typeof window === "undefined") return DEFAULT_WEIGHTS;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_WEIGHTS;
    const parsed = JSON.parse(raw) as WeightMap;
    return { ...DEFAULT_WEIGHTS, ...parsed };
  } catch {
    return DEFAULT_WEIGHTS;
  }
}

export function savePlacementWeights(next: WeightMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("placement-weights:changed", { detail: next }));
  } catch {
    /* quota / private mode — silently ignore */
  }
}

export function resetPlacementWeights(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LS_KEY);
  window.dispatchEvent(new CustomEvent("placement-weights:changed", { detail: DEFAULT_WEIGHTS }));
}

export function getPlacementWeight(brokerId: string, slot: PlacementSlot): number {
  const map = loadPlacementWeights();
  const w = map[brokerId]?.[slot];
  return typeof w === "number" ? w : 1;
}

export function getZoneWeight(brokerId: string, zone: Zone): number {
  const slot = (Object.keys(SLOT_TO_ZONES) as PlacementSlot[]).find((s) =>
    SLOT_TO_ZONES[s].includes(zone),
  );
  return slot ? getPlacementWeight(brokerId, slot) : 1;
}

export const PLACEMENT_WEIGHTS_DEFAULTS = DEFAULT_WEIGHTS;
