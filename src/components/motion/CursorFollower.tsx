import { useEffect, useRef } from 'react';

/**
 * Custom cursor: 6px ember dot + 24px ring that expands over interactive elements.
 * Desktop only; the CSS handles hiding on touch / reduced motion.
 * Mount once at the root of <App>.
 */
export const CursorFollower = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none), (max-width: 1023px)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Start fully hidden; only reveal after the user's actual pointer enters the page.
    dot.style.opacity = '0';
    ring.style.opacity = '0';

    let mx = -9999;
    let my = -9999;
    let dx = mx, dy = my;
    let rx = mx, ry = my;
    let rafId = 0;
    let active = false;

    const tick = () => {
      dx += (mx - dx) * 0.55;
      dy += (my - dy) * 0.55;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      if (!active) {
        active = true;
        mx = e.clientX; my = e.clientY;
        dx = mx; dy = my; rx = mx; ry = my;
        dot.style.opacity = '1';
        tick();
      }
      mx = e.clientX;
      my = e.clientY;
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('a, button, [role="button"], input, textarea, [data-magnetic], [data-tilt]');
      ring.dataset.active = interactive ? 'true' : 'false';
    };
    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      ring.dataset.active = 'false';
      active = false;
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    };
    const onEnter = () => {
      if (active) dot.style.opacity = '1';
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      if (rafId) cancelAnimationFrame(rafId);
    };

  }, []);

  return (
    <>
      <div ref={ringRef} className="ip-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="ip-cursor-dot" aria-hidden="true" />
    </>
  );
};
