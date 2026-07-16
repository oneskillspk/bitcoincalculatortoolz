import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

/**
 * Defers mounting `children` until its placeholder scrolls near the
 * viewport. Reserves height via `minHeight` to prevent CLS. Once
 * mounted, stays mounted (triggerOnce).
 *
 * Use to keep heavy but non-critical below-the-fold sections
 * (e.g. broker comparison matrix) out of the initial hydration graph.
 */
interface Props {
  minHeight: number;
  rootMargin?: string;
  children: ReactNode;
  ariaLabel?: string;
}

export const InViewMount = ({
  minHeight,
  rootMargin = '300px 0px',
  children,
  ariaLabel,
}: Props) => {
  const [ref, isVisible] = useIntersectionObserver({ rootMargin, triggerOnce: true });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      {...(ariaLabel ? { role: 'region', 'aria-label': ariaLabel, 'aria-busy': !isVisible } : {})}
      style={isVisible ? undefined : { minHeight }}
      className={isVisible ? undefined : 'w-full animate-pulse rounded-2xl bg-muted/10'}
    >
      {isVisible ? children : null}
    </div>
  );
};

export default InViewMount;
