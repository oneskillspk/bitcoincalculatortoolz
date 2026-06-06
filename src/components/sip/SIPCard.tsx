import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Shared wrapper for SIP calculator subcomponents.
 *
 * Guarantees identical glass-morphism styling, padding, border and radius
 * across every SIP section so the page stays visually consistent with the
 * rest of the calculators. Keep this in sync with the project standard
 * `glass-morphism-card` class.
 */
export interface SIPCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Use a tighter padding for grid items like the result tiles. */
  size?: 'default' | 'compact';
  as?: 'div' | 'section' | 'article';
}

const SIP_CARD_BASE =
  'glass-morphism-card border border-border/30 rounded-2xl';

export const SIPCard = React.forwardRef<HTMLDivElement, SIPCardProps>(
  ({ className, size = 'default', as: Tag = 'div', ...props }, ref) => {
    const padding = size === 'compact' ? 'p-4 sm:p-5' : 'p-5 sm:p-6';
    return (
      <Tag
        ref={ref as React.Ref<HTMLDivElement>}
        data-sip-card="true"
        className={cn(SIP_CARD_BASE, padding, className)}
        {...props}
      />
    );
  }
);
SIPCard.displayName = 'SIPCard';
