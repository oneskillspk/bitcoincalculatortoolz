import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useGsapScrollTrigger } from './useGsapScrollTrigger';

interface ScrollSceneProps {
  children: ReactNode;
  className?: string;
  /** Reveal animation type. Default 'fade-up'. */
  reveal?: 'fade-up' | 'fade' | 'stagger-children' | 'none';
  /** Stagger child selector when reveal='stagger-children'. */
  childSelector?: string;
  /** Pin section while scrubbing children timeline. */
  pin?: boolean;
  /** Scrub speed (true = tied to scroll). */
  scrub?: boolean | number;
  start?: string;
  end?: string;
  desktopOnly?: boolean;
  as?: 'div' | 'section';
}

/**
 * Declarative ScrollTrigger wrapper. Lazy-loads GSAP only when used.
 */
export const ScrollScene = ({
  children,
  className,
  reveal = 'fade-up',
  childSelector,
  pin = false,
  scrub = false,
  start = 'top 85%',
  end = 'bottom 20%',
  desktopOnly = false,
  as: Tag = 'div',
}: ScrollSceneProps) => {
  const ref = useGsapScrollTrigger<HTMLDivElement>(
    ({ gsap, ScrollTrigger, el }) => {
      const triggers: ScrollTrigger[] = [];

      if (reveal === 'stagger-children' && childSelector) {
        const targets = el.querySelectorAll(childSelector);
        if (targets.length) {
          gsap.set(targets, { opacity: 0, y: 24, filter: 'blur(8px)' });
          const tween = gsap.to(targets, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start, toggleActions: 'play none none reverse' },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }
      } else if (reveal === 'fade-up') {
        gsap.set(el, { opacity: 0, y: 32 });
        const tween = gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start, toggleActions: 'play none none reverse' },
        });
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      } else if (reveal === 'fade') {
        gsap.set(el, { opacity: 0 });
        const tween = gsap.to(el, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start, toggleActions: 'play none none reverse' },
        });
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      }

      if (pin) {
        const st = ScrollTrigger.create({
          trigger: el,
          start,
          end,
          pin: true,
          scrub: scrub === true ? 1 : (scrub as number | boolean),
        });
        triggers.push(st);
      }

      return () => triggers.forEach((t) => t.kill());
    },
    [],
    { desktopOnly }
  );

  return (
    <Tag ref={ref as never} data-scroll-scene className={cn(className)}>
      {children}
    </Tag>
  );
};
