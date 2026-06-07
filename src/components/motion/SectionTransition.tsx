import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
  /** Visual variant of the curtain transition. */
  variant?: 'curtain' | 'rise' | 'fade';
  /** Disable per-section. */
  disabled?: boolean;
}

/**
 * Cinematic between-section transition.
 *  - "curtain": ember-toned panel sweeps up past content (Apple-style)
 *  - "rise":    content slides up + blurs in
 *  - "fade":    soft cross-fade
 *
 * Reduced-motion / low-perf → renders children with a plain fade-only entry.
 */
export const SectionTransition = ({ children, className, variant = 'rise', disabled }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<'idle' | 'in'>('idle');
  const [mode, setMode] = useState<'full' | 'lite' | 'off'>('full');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const perf = document.documentElement.getAttribute('data-perf');
    if (reduced) setMode('lite');
    else if (perf === 'low') setMode('lite');
    else setMode('full');
  }, []);

  useEffect(() => {
    if (disabled) {
      setState('in');
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setState('in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '-10% 0px -10% 0px', threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [disabled]);

  const effectiveVariant = mode === 'lite' ? 'fade' : variant;

  return (
    <div
      ref={ref}
      data-section-transition={effectiveVariant}
      data-state={state}
      className={cn('section-transition', className)}
    >
      {effectiveVariant === 'curtain' && mode === 'full' && (
        <span aria-hidden className="section-transition-curtain" />
      )}
      <div className="section-transition-inner">{children}</div>
    </div>
  );
};
