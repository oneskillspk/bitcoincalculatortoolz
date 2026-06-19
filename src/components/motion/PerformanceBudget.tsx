import { usePerformanceBudget } from '@/hooks/usePerformanceBudget';
import { useAfterLCP } from '@/hooks/useAfterLCP';

const Sampler = () => {
  usePerformanceBudget();
  return null;
};

/**
 * Mount once at app root. Renders nothing — sets `data-perf` on <html>
 * and continuously adjusts based on FPS sampling.
 *
 * Sampler start is deferred until after LCP so the per-frame `requestAnimationFrame`
 * loop never contends with paint during the LCP window.
 */
export const PerformanceBudget = () => {
  const ready = useAfterLCP(500);
  return ready ? <Sampler /> : null;
};

