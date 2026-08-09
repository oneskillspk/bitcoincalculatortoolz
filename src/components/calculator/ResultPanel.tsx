import React from 'react';
import { cn } from '@/lib/utils';

interface ResultPanelProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Optional eyebrow / kicker label rendered above the title (uppercase). */
  eyebrow?: React.ReactNode;
  /** Panel title — short and descriptive. */
  title?: React.ReactNode;
  /** Optional supporting copy under the title. Keep to one line. */
  description?: React.ReactNode;
  /** Optional icon rendered in a soft tinted square next to the title. */
  icon?: React.ReactNode;
  /** Slot rendered to the right of the title (badge, status pill, etc). */
  action?: React.ReactNode;
  /** Optional thin accent bar shown at the very top of the panel. */
  accentBar?: 'primary' | 'positive' | 'negative' | 'none';
  /** Optional footer slot (disclaimers, secondary CTAs). */
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  id?: string;
  'data-testid'?: string;
}

const accentClasses: Record<NonNullable<ResultPanelProps['accentBar']>, string> = {
  primary: 'bg-gradient-to-r from-primary/40 via-primary to-primary/40',
  positive: 'bg-gradient-to-r from-success/40 via-success to-success/40',
  negative: 'bg-gradient-to-r from-destructive/40 via-destructive to-destructive/40',
  none: '',
};

/**
 * Unified shell for every calculator result panel — mirrors InputPanel.
 * Provides consistent padding, header (eyebrow/title/description/icon/action),
 * body, and footer rhythm using the calc-* design tokens.
 */
export const ResultPanel: React.FC<ResultPanelProps> = ({
  eyebrow,
  title,
  description,
  icon,
  action,
  accentBar = 'none',
  footer,
  children,
  className,
  id,
  'data-testid': testId,
  ...rest
}) => {
  const headerId = id ? `${id}-title` : undefined;
  const descriptionId = id ? `${id}-description` : undefined;
  const showHeader = Boolean(eyebrow || title || description || icon || action);
  const hasAriaLabel = 'aria-label' in rest || 'aria-labelledby' in rest;
  const describedBy = hasAriaLabel ? undefined : descriptionId;

  return (
    <section
      id={id}
      data-testid={testId}
      aria-labelledby={hasAriaLabel ? undefined : headerId}
      aria-describedby={describedBy}
      {...rest}
      className={cn('calc-surface-card relative flex flex-col overflow-hidden', className)}
    >
      {accentBar !== 'none' && (
        <div className={cn('absolute inset-x-0 top-0 h-[3px]', accentClasses[accentBar])} aria-hidden />
      )}

      {showHeader && (
        <header className="flex flex-col gap-3 px-4 pt-5 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:pt-6">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--calc-radius-input)] bg-primary/10 text-primary [&>svg]:h-4 [&>svg]:w-4"
                aria-hidden
              >
                {icon}
              </span>
            )}
            <div className="min-w-0 space-y-1">
              {eyebrow && <p className="calc-text-label text-muted-foreground">{eyebrow}</p>}
              {title && (
                <h2 id={headerId} className="calc-text-h2 text-foreground break-words">
                  {title}
                </h2>
              )}
              {description && <p id={descriptionId} className="calc-text-small text-muted-foreground break-words">{description}</p>}
            </div>
          </div>
          {action && <div className="sm:shrink-0">{action}</div>}
        </header>
      )}

      <div className="flex flex-col gap-[var(--calc-space-card)] px-4 py-5 sm:px-6 sm:py-6">
        {children}
      </div>

      {footer && (
        <footer className="border-t border-border/30 bg-muted/20 px-4 py-3.5 sm:px-6 sm:py-4">
          {footer}
        </footer>
      )}
    </section>
  );
};

export default ResultPanel;
