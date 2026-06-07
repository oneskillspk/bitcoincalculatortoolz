import { RefObject, useEffect } from 'react';

interface TiltOptions {
  /** Max rotation in degrees. Default 6. */
  max?: number;
  /** Perspective in pixels. Default 800. */
  perspective?: number;
  /** Lerp factor 0-1. Default 0.18. */
  lerp?: number;
}

/**
 * Desktop-only 3D tilt on pointer move. No-ops on touch / reduced-motion.
 */
export const useTilt = (ref: RefObject<HTMLElement | null>, opts: TiltOptions = {}) => {
  const { max = 6, perspective = 800, lerp = 0.18 } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none), (max-width: 1023px)').matches) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, rafId = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      tx = (py - 0.5) * -2 * max;
      ty = (px - 0.5) * 2 * max;
      if (!rafId) loop();
    };
    const loop = () => {
      cx += (tx - cx) * lerp;
      cy += (ty - cy) * lerp;
      el.style.transform = `perspective(${perspective}px) rotateX(${cx.toFixed(2)}deg) rotateY(${cy.toFixed(2)}deg)`;
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = 0;
      }
    };
    const onLeave = () => {
      tx = 0; ty = 0;
      if (!rafId) loop();
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transform = '';
    };
  }, [ref, max, perspective, lerp]);
};
