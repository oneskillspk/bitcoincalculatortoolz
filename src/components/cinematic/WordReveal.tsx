import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useGsapScrollTrigger } from './useGsapScrollTrigger';

interface WordRevealProps {
  text: string;
  className?: string;
  /** When true, scrubs reveal across scroll. When false, plays once on enter. */
  scrub?: boolean;
  start?: string;
  end?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export const WordReveal = ({
  text,
  className,
  scrub = true,
  start = 'top 80%',
  end = 'bottom 40%',
  as: Tag = 'h2',
}: WordRevealProps) => {
  const words = useMemo(() => text.split(/(\s+)/), [text]);

  const ref = useGsapScrollTrigger<HTMLElement>(({ gsap, el }) => {
    const targets = el.querySelectorAll<HTMLElement>('[data-word]');
    if (!targets.length) return;
    gsap.set(targets, { opacity: 0.38, y: '0.18em', filter: 'blur(3px)' });
    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      ease: 'power2.out',
      stagger: 0.08,
      duration: scrub ? 1 : 0.6,
      scrollTrigger: scrub
        ? { trigger: el, start, end, scrub: 1 }
        : { trigger: el, start, toggleActions: 'play none none reverse' },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  });

  return (
    <Tag ref={ref as never} className={cn(className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) =>
          w.trim() ? (
            <span key={i} data-word className="inline-block will-change-transform">
              {w}
            </span>
          ) : (
            <span key={i}>{w}</span>
          )
        )}
      </span>
    </Tag>
  );
};
