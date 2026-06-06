import { ReactNode, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** Max pull in pixels. Default 14. */
  strength?: number;
  /** Activation radius in pixels. Default 120. */
  radius?: number;
}

/**
 * Desktop-only magnetic wrapper. Disabled on mobile/touch and reduced motion.
 * Wrap any clickable element (Button, Link) inside.
 */
export const MagneticButton = ({
  children,
  className,
  strength = 14,
  radius = 120,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none), (max-width: 1023px)').matches) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        const pull = (1 - dist / radius) * strength;
        targetX = (dx / dist) * pull;
        targetY = (dy / dist) * pull;
      } else {
        targetX = 0;
        targetY = 0;
      }
      if (!rafId) loop();
    };

    const loop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = 0;
      }
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!rafId) loop();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transform = '';
    };
  }, [strength, radius]);

  return (
    <div ref={ref} data-magnetic className={cn('inline-block will-change-transform transform-gpu', className)}>
      {children}
    </div>
  );
};
