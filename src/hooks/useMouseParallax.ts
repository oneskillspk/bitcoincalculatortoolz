import { useEffect, useRef } from "react";

/**
 * Subtle mouse-parallax — sets two CSS variables (`--px`, `--py`)
 * on the target element, ranging -1 → 1 based on cursor position
 * relative to the element's bounding box.
 *
 * Children can read them with `translate3d(calc(var(--px) * 8px), ...)`.
 *
 * Throttled to one update per animation frame. No-ops on touch
 * devices and when `prefers-reduced-motion: reduce` is set.
 */
export function useMouseParallax<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip on touch or reduced motion.
    const isTouch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduced) return;

    let rafId = 0;
    let nextX = 0;
    let nextY = 0;

    const apply = () => {
      el.style.setProperty("--px", nextX.toFixed(3));
      el.style.setProperty("--py", nextY.toFixed(3));
      rafId = 0;
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Normalize to -1..1 around the element center.
      nextX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      nextY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      nextX = 0;
      nextY = 0;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return ref;
}
