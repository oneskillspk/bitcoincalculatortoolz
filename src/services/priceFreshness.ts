/**
 * Tracks where the most recent price value came from, so the UI can be honest
 * about freshness when the live feed (or the backend proxy) is unavailable.
 */
export type PriceFreshness = 'live' | 'cached' | 'snapshot';

export interface PriceFreshnessState {
  freshness: PriceFreshness;
  /** ISO date/time the value refers to (snapshot date, or fetch time). */
  asOf: string;
}

let state: PriceFreshnessState = { freshness: 'live', asOf: new Date().toISOString() };
const listeners = new Set<(s: PriceFreshnessState) => void>();

export function setPriceFreshness(freshness: PriceFreshness, asOf?: string) {
  const next = { freshness, asOf: asOf ?? new Date().toISOString() };
  if (next.freshness === state.freshness && next.asOf === state.asOf) return;
  state = next;
  listeners.forEach((l) => l(state));
}

export function getPriceFreshness(): PriceFreshnessState {
  return state;
}

export function subscribePriceFreshness(listener: (s: PriceFreshnessState) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
