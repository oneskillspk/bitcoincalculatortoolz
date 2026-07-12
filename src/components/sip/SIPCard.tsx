import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Shared wrapper for SIP calculator subcomponents.
 *
 * Uses the standard `calc-surface-card` token so SIP sections match the
 * unified `ResultPanel` shell used by every other calculator. Padding
 * still tracks the SIP-specific `size` variants.
 */
export interface SIPCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Use a tighter padding for grid items like the result tiles. */
  size?: 'default' | 'compact';
  as?: 'div' | 'section' | 'article';
}

const SIP_CARD_BASE = 'calc-surface-card';

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
