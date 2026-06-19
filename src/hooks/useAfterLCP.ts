import { useEffect, useState } from 'react';

/**
 * Returns `true` once the browser is idle AFTER the LCP window has settled.
 *
 * Used to gate non-critical visual effects (scroll-linked threads, FPS
 * samplers, section nav rails) so they don't compete with the main thread
 * during the LCP measurement window or contribute to long tasks before
 * the page is interactive.
 *
 * Order of preference:
 *   1. Wait for the LCP entry via PerformanceObserver, then idle.
 *   2. If PO unsupported, fall back to a 2.5s timer + idle.
 *   3. SSR / very old browsers: returns true immediately.
 */
export function useAfterLCP(extraDelayMs = 200): boolean {
  const [ready, setReady] = useState(() => typeof window === 'undefined');

  useEffect(() => {
    if (ready) return;
    let cancelled = false;
    let idleHandle = 0 as number | ReturnType<typeof setTimeout>;
    const idle = (window as any).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    const cancelIdle = (window as any).cancelIdleCallback ?? clearTimeout;

    const fire = () => {
      if (cancelled) return;
      idleHandle = idle(() => !cancelled && setReady(true), { timeout: 1500 });
    };

    let po: PerformanceObserver | null = null;
    const fallback = window.setTimeout(fire, 2500 + extraDelayMs);

    try {
      po = new PerformanceObserver(() => {
        window.setTimeout(fire, extraDelayMs);
        po?.disconnect();
        po = null;
        window.clearTimeout(fallback);
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      // PerformanceObserver unavailable — fallback timer handles it.
    }

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      if (idleHandle) cancelIdle(idleHandle as number);
      po?.disconnect();
    };
  }, [extraDelayMs, ready]);

  return ready;
}
