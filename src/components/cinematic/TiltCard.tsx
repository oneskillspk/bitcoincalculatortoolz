import { ReactNode, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. Default 8. */
  max?: number;
  /** Add subtle highlight glare. Default true. */
  glare?: boolean;
}

/**
 * Lightweight 3D tilt on hover. Pure CSS perspective + rAF transform.
 * Disabled on touch devices and reduced motion.
 */
export const TiltCard = ({ children, className, max = 8, glare = true }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let rafId = 0;
    let rx = 0,
      ry = 0,
      tx = 0,
      ty = 0,
      gx = 50,
      gy = 50;

    const apply = () => {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      if (glare) {
        el.style.setProperty('--glare-x', `${gx}%`);
        el.style.setProperty('--glare-y', `${gy}%`);
      }
      if (Math.abs(tx - rx) > 0.05 || Math.abs(ty - ry) > 0.05) {
        rafId = requestAnimationFrame(apply);
      } else {
        rafId = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ty = (px - 0.5) * max * 2;
      tx = -(py - 0.5) * max * 2;
      gx = px * 100;
      gy = py * 100;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transform = '';
    };
  }, [max, glare]);

  return (
    <div
      ref={ref}
      className={cn('tilt-card relative', className)}
      style={
        glare
          ? ({
              '--glare-x': '50%',
              '--glare-y': '50%',
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
      {glare && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background:
              'radial-gradient(circle at var(--glare-x) var(--glare-y), hsl(var(--foreground) / 0.08), transparent 45%)',
          }}
        />
      )}
    </div>
  );
};
