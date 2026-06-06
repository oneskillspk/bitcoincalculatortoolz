import React from 'react';
import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'primary' | 'positive' | 'negative' | 'warning';

interface ResultBadgeProps {
  children: React.ReactNode;
  tone?: Tone;
  icon?: React.ReactNode;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  neutral: 'border-border/60 bg-muted/40 text-muted-foreground',
  primary: 'border-primary/30 bg-primary/10 text-primary',
  positive: 'border-success/30 bg-success/10 text-success',
  negative: 'border-destructive/30 bg-destructive/10 text-destructive',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
};

/**
 * Small consistent status pill for use in result panels.
 * Matches the rounded-pill / uppercase-label visual rhythm of the calc system.
 */
export const ResultBadge: React.FC<ResultBadgeProps> = ({
  children,
  tone = 'neutral',
  icon,
  className,
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide',
      toneClasses[tone],
      className,
    )}
  >
    {icon && <span className="[&>svg]:h-3 [&>svg]:w-3" aria-hidden>{icon}</span>}
    {children}
  </span>
);

export default ResultBadge;
