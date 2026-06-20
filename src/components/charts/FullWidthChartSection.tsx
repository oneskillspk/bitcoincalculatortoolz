import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FullWidthChartSectionProps {
  children: ReactNode;
  className?: string;
  /** Optional id for deep-linking / a11y landmarks */
  id?: string;
  /** Optional aria-label for the section landmark */
  ariaLabel?: string;
}

/**
 * Reusable full-bleed wrapper for charts/tables so they never get squeezed
 * into a sibling column. Caps at a generous max-width and applies the
 * project's responsive horizontal padding ladder.
 */
export const FullWidthChartSection = ({
  children,
  className,
  id,
  ariaLabel,
}: FullWidthChartSectionProps) => (
  <section
    id={id}
    aria-label={ariaLabel}
    className={cn(
      'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8',
      className,
    )}
  >
    {children}
  </section>
);
