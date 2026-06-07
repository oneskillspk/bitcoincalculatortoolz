import { useEffect, useRef } from 'react';

/**
 * 1px ember thread in the left gutter that grows scroll-linked.
 * Mounted on the homepage only. Hidden below 1280px via CSS.
 */
export const EmberThread = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    const compute = () => {
      rafId = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty('--ember-progress', String(0.05 + p * 0.95));
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
  }, []);

  return <div ref={ref} className="ip-ember-thread" aria-hidden="true" />;
};
