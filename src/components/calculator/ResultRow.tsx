import React from 'react';
import { cn } from '@/lib/utils';
import { TooltipInfo } from '@/components/ui/tooltip-info';

type Tone = 'default' | 'primary' | 'positive' | 'negative' | 'muted';

interface ResultRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Optional secondary value rendered under the primary value. */
  sub?: React.ReactNode;
  /** Optional full-precision value, shown as the `title` attribute for hover/tap. */
  fullValue?: string;
  tooltip?: string;
  tone?: Tone;
  /** Add a top divider for visual rhythm in stacked groups. */
  divider?: boolean;
  /** Render the primary value in larger weight (used for totals). */
  emphasis?: boolean;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  positive: 'text-success',
  negative: 'text-destructive',
  muted: 'text-muted-foreground',
};

/**
 * Two-column label/value row used inside ResultPanel for summary breakdowns.
 * Right-side values wrap safely so long currency strings (PKR, INR, TRY)
 * never overflow the card or get clipped.
 */
export const ResultRow: React.FC<ResultRowProps> = ({
  label,
  value,
  sub,
  fullValue,
  tooltip,
  tone = 'default',
  divider,
  emphasis,
  className,
}) => {
  const titleAttr =
    fullValue ??
    (typeof value === 'string' || typeof value === 'number' ? String(value) : undefined);

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 py-2',
        divider && 'border-t border-border/30 pt-3',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <span
          className={cn(
            'min-w-0 leading-snug',
            emphasis ? 'calc-text-body font-semibold text-foreground' : 'calc-text-small text-muted-foreground',
          )}
        >
          {label}
        </span>
        {tooltip && <TooltipInfo content={tooltip} side="top" />}
      </div>
      <div className="min-w-0 text-right">
        <div
          title={titleAttr}
          className={cn(
            'calc-text-mono leading-tight tabular-nums break-words [overflow-wrap:anywhere]',
            emphasis ? 'text-base font-bold sm:text-lg' : 'text-sm font-semibold',
            toneClasses[tone],
          )}
        >
          {value}
        </div>
        {sub && <div className="calc-text-small text-muted-foreground mt-0.5 break-words">{sub}</div>}
      </div>
    </div>
  );
};

export default ResultRow;
