import { RefObject, useEffect, useState } from 'react';

/**
 * Returns scroll progress (0-1) for how far `ref` has traveled through the viewport.
 * 0 = section bottom just touched viewport bottom; 1 = section top just passed viewport top.
 * Uses a single rAF tick driven by scroll events to stay cheap.
 */
export const useScrollProgress = (ref: RefObject<HTMLElement | null>): number => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    const compute = () => {
      rafId = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      const p = Math.max(0, Math.min(1, traveled / total));
      setProgress(p);
    };
    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(compute);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ref]);

  return progress;
};
