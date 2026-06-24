/**
 * V2 Slot runtime registry.
 *
 * Lightweight, dev-only verification that calculator pages actually
 * mount the V2 Slot system (SlotB or SlotC) after migration. Helps
 * catch regressions where a calculator route ships without monetization.
 *
 * Production: registerSlot() and verifyV2Coverage() are no-ops.
 */

type SlotKey = "A" | "B" | "C" | "D";

const mounts = new Map<string, Set<SlotKey>>();

const isDev = (): boolean => {
  try {
    return import.meta.env.DEV === true;
  } catch {
    return false;
  }
};

export function registerSlot(slot: SlotKey): void {
  if (!isDev() || typeof window === "undefined") return;
  const path = window.location.pathname;
  let set = mounts.get(path);
  if (!set) {
    set = new Set();
    mounts.set(path, set);
  }
  set.add(slot);
}

/**
 * Call after route transitions. After a short delay, if the current
 * path matches a calculator route and neither SlotB nor SlotC has
 * registered a mount, emit a console warning.
 */
export function verifyV2Coverage(pathname: string): void {
  if (!isDev() || typeof window === "undefined") return;
  // Reset registry for this pathname on navigation start.
  mounts.delete(pathname);

  const isCalculator =
    /\/calculators?\//.test(pathname) ||
    /\/hesaplayicilar\//.test(pathname);
  if (!isCalculator) return;

  window.setTimeout(() => {
    const set = mounts.get(pathname);
    const hasIntentSlot = set && (set.has("B") || set.has("C"));
    if (!hasIntentSlot) {
      // eslint-disable-next-line no-console
      console.warn(
        `[V2 coverage] No SlotB/SlotC mounted on calculator route "${pathname}". ` +
          `Page is missing post-result monetization — add <PreFAQPlacement /> or useSmartZones().`
      );
    }
  }, 4000);
}
