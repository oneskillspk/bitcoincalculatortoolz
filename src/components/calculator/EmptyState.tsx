import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

/**
 * Unified empty-state block for results panels before a calculation has run.
 * Keep `description` to one short line — extra context belongs in tooltips.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  className,
}) => (
  <div
    className={cn(
      'calc-surface-subtle flex flex-col items-center justify-center gap-3 px-6 py-10 text-center',
      className,
    )}
  >
    {icon && (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>
    )}
    <h3 className="calc-text-h3 text-foreground">{title}</h3>
    {description && (
      <p className="calc-text-small text-muted-foreground max-w-sm">{description}</p>
    )}
  </div>
);

export default EmptyState;
