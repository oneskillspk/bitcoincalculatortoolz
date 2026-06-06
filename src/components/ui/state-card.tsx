import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Tone-driven primitives for positive/negative/neutral state surfaces.
 *
 * Rules:
 * - Positive ROI / "best" / gains  → tone="success"
 * - Negative ROI / "worst" / loss  → tone="destructive"
 * - Caution / volatility           → tone="warning"
 * - Informational                  → tone="neutral"
 *
 * Backed by the semantic tokens declared in src/index.css
 * (`--success`, `--destructive`, `--warning`) so colors stay
 * theme-correct in both light and dark mode.
 */

type Tone = 'success' | 'destructive' | 'warning' | 'neutral';

const card = cva(
  'rounded-lg border transition-colors',
  {
    variants: {
      tone: {
        success: 'bg-success/10 border-success/30',
        destructive: 'bg-destructive/10 border-destructive/30',
        warning: 'bg-warning/10 border-warning/30',
        neutral: 'bg-muted/40 border-border/40',
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-5',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
);

const value = cva('font-bold tabular-nums', {
  variants: {
    tone: {
      success: 'text-success',
      destructive: 'text-destructive',
      warning: 'text-warning',
      neutral: 'text-foreground',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-2xl',
    },
  },
  defaultVariants: { tone: 'neutral', size: 'md' },
});

export interface StateCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof card> {
  icon?: LucideIcon;
  title?: React.ReactNode;
}

export const StateCard = React.forwardRef<HTMLDivElement, StateCardProps>(
  ({ tone, size, icon: Icon, title, className, children, ...rest }, ref) => {
    const toneText: Record<Tone, string> = {
      success: 'text-success',
      destructive: 'text-destructive',
      warning: 'text-warning',
      neutral: 'text-foreground',
    };
    return (
      <div ref={ref} className={cn(card({ tone, size }), className)} {...rest}>
        {(Icon || title) && (
          <div className="flex items-center gap-2 mb-2">
            {Icon && <Icon className={cn('w-4 h-4', toneText[tone ?? 'neutral'])} />}
            {title && <h4 className="font-semibold text-foreground text-sm">{title}</h4>}
          </div>
        )}
        <div className="space-y-1">{children}</div>
      </div>
    );
  },
);
StateCard.displayName = 'StateCard';

export interface StateValueProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof value> {}

export const StateValue = React.forwardRef<HTMLParagraphElement, StateValueProps>(
  ({ tone, size, className, ...rest }, ref) => (
    <p ref={ref} className={cn(value({ tone, size }), className)} {...rest} />
  ),
);
StateValue.displayName = 'StateValue';

export const StateLabel = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...rest }, ref) => (
  <p ref={ref} className={cn('text-sm text-foreground/80', className)} {...rest} />
));
StateLabel.displayName = 'StateLabel';

export const StateCaption = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...rest }, ref) => (
  <p ref={ref} className={cn('text-xs text-muted-foreground', className)} {...rest} />
));
StateCaption.displayName = 'StateCaption';

/** Convenience helper: pick a tone from a numeric ROI/diff. */
export function toneForValue(n: number): Tone {
  if (n > 0) return 'success';
  if (n < 0) return 'destructive';
  return 'neutral';
}
