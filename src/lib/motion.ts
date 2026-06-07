/**
 * Shared motion constants for the Instrument Panel homepage system.
 * Keep in lockstep with src/styles/motion-tokens.css.
 */

export const DURATIONS = {
  tap: 0.12,
  ui: 0.22,
  reveal: 0.42,
  hero: 0.72,
  cinematic: 1.2,
} as const;

export const EASE = {
  expoOut: [0.22, 1, 0.36, 1] as const,
  expoInOut: [0.83, 0, 0.17, 1] as const,
  outSoft: [0.16, 1, 0.3, 1] as const,
};

export const SPRING = {
  default: { type: 'spring' as const, stiffness: 260, damping: 30, mass: 0.9 },
  soft: { type: 'spring' as const, stiffness: 180, damping: 26, mass: 1 },
  snappy: { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.7 },
};

export const STAGGER = {
  tight: 0.04,
  base: 0.06,
  loose: 0.1,
} as const;

/** Test if we're on a non-touch desktop viewport (≥1024px). */
export const isDesktopPointer = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (min-width: 1024px)').matches;
};

/** Test if user prefers reduced motion. */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/** Test if Save-Data is on. */
export const prefersSaveData = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  // @ts-ignore
  return Boolean(navigator.connection?.saveData);
};
