import { usePerformanceBudget } from '@/hooks/usePerformanceBudget';

/**
 * Mount once at app root. Renders nothing — sets `data-perf` on <html>
 * and continuously adjusts based on FPS sampling.
 */
export const PerformanceBudget = () => {
  usePerformanceBudget();
  return null;
};
