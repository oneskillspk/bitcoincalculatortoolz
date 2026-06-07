import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  to: number;
  /** Animation duration in ms. */
  duration?: number;
  /** Decimal places. */
  decimals?: number;
  /** Optional prefix (e.g. "$"). */
  prefix?: string;
  /** Optional suffix (e.g. "%"). */
  suffix?: string;
  /** Locale for number formatting. */
  locale?: string;
  /** Don't animate until visible (default true). */
  whenVisible?: boolean;
  className?: string;
}

/**
 * rAF-driven count-up. Uses tabular-nums to prevent layout shift.
 * Snaps instantly if reduced motion is requested.
 */
export const CountUp = ({
  to,
  duration = 600,
  decimals = 0,
  prefix = '',
  suffix = '',
  locale,
  whenVisible = true,
  className,
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const [active, setActive] = useState(!whenVisible);

  useEffect(() => {
    if (!whenVisible) return;
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [whenVisible]);

  useEffect(() => {
    if (!active) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return;
    }
    const start = performance.now();
    const from = 0;
    let rafId = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // expo-out
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (to - from) * eased);
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, to, duration]);

  const formatted = value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
