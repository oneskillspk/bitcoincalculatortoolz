import { ReactNode, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxLayerProps {
  /** 0 = static, 0.5 = half scroll speed, negative = reverse. */
  speed?: number;
  className?: string;
  children: ReactNode;
  /** Disable on mobile <768px. Default true. */
  desktopOnly?: boolean;
  ariaHidden?: boolean;
}

/**
 * GPU-accelerated parallax layer. rAF-driven transform updates only while
 * the element is in view, throttled by IntersectionObserver.
 */
export const ParallaxLayer = ({
  speed = 0.3,
  className,
  children,
  desktopOnly = true,
  ariaHidden,
}: ParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (desktopOnly && window.matchMedia('(max-width: 767px)').matches) return;

    let inView = false;
    let rafId = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const offset = -center * speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      rafId = inView ? window.requestAnimationFrame(update) : 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !rafId) rafId = window.requestAnimationFrame(update);
      },
      { rootMargin: '100px' }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transform = '';
    };
  }, [speed, desktopOnly]);

  return (
    <div
      ref={ref}
      aria-hidden={ariaHidden}
      className={cn('will-change-transform transform-gpu', className)}
    >
      {children}
    </div>
  );
};
