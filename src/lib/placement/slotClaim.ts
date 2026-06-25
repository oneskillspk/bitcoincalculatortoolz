/**
 * Slot claim registry — module-global dedupe for V2 placement slots.
 *
 * Multiple independent `useSmartZones(...)` instances on the same page
 * (e.g. a calculator that mounts inline `<sz.SlotB />` AND also renders
 * `<PreFAQPlacement />`, which spins up its own orchestrator) used to
 * each render their own copy of a slot, painting duplicate banners in
 * the same vertical band.
 *
 * This claim system gives every slot one and only one owner per
 * `(slug, slot)` pair. The first mounted instance wins; any later
 * mount renders `null` and (in dev) logs a one-time warning.
 *
 * Cleanup on unmount releases the claim so route transitions and
 * conditional remounts behave correctly.
 */
import { useEffect, useRef, useSyncExternalStore } from "react";

export type SlotKey = "A" | "B" | "C" | "D";

type ClaimToken = symbol;
const owners = new Map<string, ClaimToken>();
const subscribers = new Map<string, Set<() => void>>();
const warned = new Set<string>();

function notify(key: string) {
  const subs = subscribers.get(key);
  if (subs) subs.forEach((fn) => fn());
}

function subscribe(key: string, fn: () => void) {
  let set = subscribers.get(key);
  if (!set) {
    set = new Set();
    subscribers.set(key, set);
  }
  set.add(fn);
  return () => {
    set!.delete(fn);
    if (set!.size === 0) subscribers.delete(key);
  };
}

const isDev =
  typeof import.meta !== "undefined" &&
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((import.meta as any).env?.DEV ?? false);

/**
 * Returns true if THIS component instance is the active owner of the
 * given (slug, slot) pair. Components MUST render `null` when false.
 */
export function useSlotClaim(slug: string, slot: SlotKey): boolean {
  const key = `${slug}:${slot}`;
  const tokenRef = useRef<ClaimToken | null>(null);
  if (tokenRef.current === null) tokenRef.current = Symbol(key);

  // Claim during render if free. Safe under StrictMode double-invoke —
  // same token from the ref both times.
  if (!owners.has(key)) {
    owners.set(key, tokenRef.current);
  } else if (owners.get(key) !== tokenRef.current && isDev && !warned.has(key)) {
    warned.add(key);
    // eslint-disable-next-line no-console
    console.warn(
      `[placement] Duplicate slot mount suppressed for "${key}". ` +
        `Another component already owns this slot on the current page. ` +
        `Remove the redundant <PreFAQPlacement /> or inline <sz.Slot${slot} />.`
    );
  }

  // Subscribe to ownership changes so a deposed instance can re-claim
  // when the original owner unmounts (e.g. conditional rendering).
  const isOwner = useSyncExternalStore(
    (cb) => subscribe(key, cb),
    () => owners.get(key) === tokenRef.current,
    () => false
  );

  useEffect(() => {
    const myToken = tokenRef.current;
    return () => {
      if (owners.get(key) === myToken) {
        owners.delete(key);
        warned.delete(key);
        notify(key);
      }
    };
  }, [key]);

  return isOwner;
}

/** Test/dev helper — clears all claims. */
export function __resetSlotClaims() {
  owners.clear();
  warned.clear();
  subscribers.forEach((set) => set.forEach((fn) => fn()));
}
