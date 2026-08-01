import { useSyncExternalStore } from "react";

/**
 * Tiny external store for the single mobile overflow ("More") menu.
 *
 * Both the bottom tab bar and the header need to control the same sheet,
 * so the open state lives outside the React tree instead of being lifted
 * into a shared provider.
 */
let open = false;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const setMobileMenuOpen = (next: boolean) => {
  if (open === next) return;
  open = next;
  emit();
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

const getSnapshot = () => open;

export const useMobileMenuOpen = () =>
  useSyncExternalStore(subscribe, getSnapshot, () => false);
