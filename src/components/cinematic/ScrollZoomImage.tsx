import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useGsapScrollTrigger } from './useGsapScrollTrigger';

interface ScrollZoomProps {
  children: ReactNode;
  className?: string;
  /** Scale at scroll start. Default 1. */
  fromScale?: number;
  /** Scale at scroll end. Default 1.18. */
  toScale?: number;
  /** Opacity at end. Default 0.6. */
  toOpacity?: number;
  start?: string;
  end?: string;
}

/**
 * Scrubs scale + opacity of a container as the viewport scrolls past.
 * Lazy-loads GSAP. Used for hero scroll-zoom effects.
 */
export const ScrollZoomImage = ({
  children,
  className,
  fromScale = 1,
  toScale = 1.18,
  toOpacity = 0.55,
  start = 'top top',
  end = 'bottom top',
}: ScrollZoomProps) => {
  const ref = useGsapScrollTrigger<HTMLDivElement>(({ gsap, el }) => {
    const tween = gsap.fromTo(
      el,
      { scale: fromScale, opacity: 1 },
      {
        scale: toScale,
        opacity: toOpacity,
        ease: 'none',
        scrollTrigger: { trigger: el, start, end, scrub: true },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  });

  return (
    <div ref={ref} className={cn('will-change-transform transform-gpu origin-center', className)}>
      {children}
    </div>
  );
};
