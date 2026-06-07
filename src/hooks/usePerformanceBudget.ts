import { useEffect, useState } from 'react';

export type PerfTier = 'high' | 'mid' | 'low';

interface State {
  tier: PerfTier;
  fps: number;
}

/**
 * Continuously samples FPS and reports a performance tier.
 * Writes `data-perf="<tier>"` on <html> so any CSS can gate effects via
 * `:root[data-perf="low"] .my-effect { animation: none; }`.
 *
 * Initial tier is derived from device hints (hardwareConcurrency, deviceMemory,
 * connection, prefers-reduced-motion, save-data, touch) so we degrade BEFORE
 * the first frame instead of waiting for jank.
 */
const initialTier = (): PerfTier => {
  if (typeof window === 'undefined') return 'high';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'low';
  const nav = navigator as Navigator & {
    hardwareConcurrency?: number;
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.connection?.saveData) return 'low';
  const cores = nav.hardwareConcurrency ?? 8;
  const mem = nav.deviceMemory ?? 8;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const slowNet = nav.connection?.effectiveType && /^(slow-2g|2g|3g)$/.test(nav.connection.effectiveType);
  if (slowNet) return 'low';
  if (cores <= 4 && (isMobile || mem <= 4)) return 'low';
  if (cores <= 6 || mem <= 4 || isMobile) return 'mid';
  return 'high';
};

let listeners = 0;
let started = false;

export const usePerformanceBudget = (): State => {
  const [state, setState] = useState<State>(() => ({ tier: initialTier(), fps: 60 }));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.setAttribute('data-perf', state.tier);

    listeners += 1;
    let rafId = 0;
    let frames = 0;
    let last = performance.now();
    let rolling: number[] = [];
    let currentTier: PerfTier = state.tier;
    let stopped = false;

    const tick = (now: number) => {
      frames += 1;
      const dt = now - last;
      if (dt >= 1000) {
        const fps = Math.round((frames * 1000) / dt);
        rolling.push(fps);
        if (rolling.length > 5) rolling.shift();
        const avg = rolling.reduce((a, b) => a + b, 0) / rolling.length;
        let nextTier: PerfTier = currentTier;
        // Downgrade aggressively, upgrade slowly.
        if (avg < 35) nextTier = 'low';
        else if (avg < 50) nextTier = currentTier === 'high' ? 'mid' : currentTier;
        else if (avg >= 56 && currentTier === 'low' && rolling.length >= 4) nextTier = 'mid';
        else if (avg >= 58 && currentTier === 'mid' && rolling.length >= 5) nextTier = 'high';
        if (nextTier !== currentTier) {
          currentTier = nextTier;
          document.documentElement.setAttribute('data-perf', nextTier);
          setState({ tier: nextTier, fps });
        } else {
          setState((s) => (s.fps === fps ? s : { ...s, fps }));
        }
        frames = 0;
        last = now;
      }
      if (!stopped) rafId = requestAnimationFrame(tick);
    };

    if (!started) {
      started = true;
      rafId = requestAnimationFrame(tick);
    }

    // Pause sampling when tab hidden — avoids false "low fps" reading on resume.
    const onVis = () => {
      if (document.hidden) {
        stopped = true;
        if (rafId) cancelAnimationFrame(rafId);
      } else {
        stopped = false;
        last = performance.now();
        frames = 0;
        rafId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      stopped = true;
      listeners -= 1;
      if (listeners <= 0) started = false;
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};

/** Lightweight reader for non-component code. */
export const getPerfTier = (): PerfTier => {
  if (typeof document === 'undefined') return 'high';
  return (document.documentElement.getAttribute('data-perf') as PerfTier) || 'high';
};
