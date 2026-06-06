import { useEffect, useRef } from 'react';

type GsapModule = typeof import('gsap');
type ScrollTriggerCtor = typeof import('gsap/ScrollTrigger').ScrollTrigger;

type SceneFn = (ctx: {
  gsap: GsapModule['gsap'];
  ScrollTrigger: ScrollTriggerCtor;
  el: HTMLElement;
}) => void | (() => void);

interface Options {
  /** Disable on mobile (<768px). Default false. */
  desktopOnly?: boolean;
  /** Skip when prefers-reduced-motion. Default true. */
  respectReducedMotion?: boolean;
  /** Skip on low-end devices (≤4 cores AND mobile). Default true. */
  skipLowEnd?: boolean;
}

let gsapPromise: Promise<{ gsap: GsapModule['gsap']; ScrollTrigger: ScrollTriggerCtor }> | null = null;

function loadGsap() {
  if (!gsapPromise) {
    gsapPromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([g, st]) => {
        g.gsap.registerPlugin(st.ScrollTrigger);
        return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
      }
    );
  }
  return gsapPromise;
}

/**
 * Lazy-loads GSAP + ScrollTrigger and runs the supplied scene factory once
 * the target element is mounted. Returns a ref to attach to the element.
 */
export function useGsapScrollTrigger<T extends HTMLElement = HTMLDivElement>(
  scene: SceneFn,
  deps: React.DependencyList = [],
  opts: Options = {}
) {
  const { desktopOnly = false, respectReducedMotion = true, skipLowEnd = true } = opts;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;

    if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    if (desktopOnly && window.matchMedia('(max-width: 767px)').matches) {
      return;
    }
    if (skipLowEnd) {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const cores = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 8;
      const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      // Skip GSAP scenes on mobile with weak CPU/RAM — content stays visible via CSS fallback.
      if (isMobile && (cores <= 4 || mem <= 2)) return;
    }

    let cleanup: void | (() => void);
    let cancelled = false;

    loadGsap().then((ctx) => {
      if (cancelled || !ref.current) return;
      cleanup = scene({ gsap: ctx.gsap, ScrollTrigger: ctx.ScrollTrigger, el: ref.current });
    });

    return () => {
      cancelled = true;
      if (typeof cleanup === 'function') cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
