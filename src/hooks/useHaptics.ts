import { useCallback } from 'react';
import { getPerfTier } from './usePerformanceBudget';

type Pattern = 'tap' | 'select' | 'success' | 'warn';

const PATTERNS: Record<Pattern, number | number[]> = {
  tap: 8,
  select: 12,
  success: [10, 30, 18],
  warn: [22, 40, 22],
};

/**
 * Cross-platform haptic-like feedback.
 * - Mobile: navigator.vibrate (Android) — silently no-op on iOS Safari.
 * - Desktop: short visual "press" ripple via dispatching an event the
 *   <HapticButton> wrapper listens for.
 * Skipped when reduced-motion is on or perf tier is "low".
 */
export const useHaptics = () => {
  return useCallback((pattern: Pattern = 'tap') => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (getPerfTier() === 'low') return;
    const nav = navigator as Navigator & { vibrate?: (p: number | number[]) => boolean };
    try {
      nav.vibrate?.(PATTERNS[pattern]);
    } catch {
      /* ignore */
    }
  }, []);
};
