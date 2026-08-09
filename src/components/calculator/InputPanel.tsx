import React from 'react';
import { cn } from '@/lib/utils';

interface InputPanelProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Slot rendered to the right of the title (e.g. mode badge). */
  action?: React.ReactNode;
  /** Persistent CTA pinned to the panel footer. */
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Wrap children in a <form> so Enter triggers onSubmit (recommended). */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Optional id used for aria-labelledby on inner form/inputs. */
  id?: string;
  'data-testid'?: string;
}

/**
 * Unified shell for every calculator input panel.
 * Provides consistent padding, focus-within ring, header, body, and footer.
 * Pass `onSubmit` so pressing Enter inside any input triggers the calculation.
 */
export const InputPanel: React.FC<InputPanelProps> = ({
  title,
  description,
  action,
  footer,
  children,
  className,
  onSubmit,
  id,
  'data-testid': testId,
}) => {
  const headerId = id ? `${id}-title` : undefined;
  const descriptionId = id ? `${id}-description` : undefined;

  const body = (
    <>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="min-w-0 space-y-1">
            {title && (
              <h2 id={headerId} className="calc-text-h2 text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <div id={descriptionId} className="calc-text-small text-muted-foreground">{description}</div>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}

      <div className="flex flex-col gap-[var(--calc-space-field)] px-5 py-5 sm:px-6 sm:py-6">
        {children}
      </div>

      {footer && (
        <footer className="border-t border-border/30 px-5 py-4 sm:px-6 sm:py-5">
          {footer}
        </footer>
      )}
    </>
  );

  return (
    <section
      data-testid={testId}
      aria-labelledby={headerId}
      className={cn(
        'calc-surface-card flex flex-col transition-shadow focus-within:shadow-[var(--calc-shadow-focus)]',
        className,
      )}
    >
      {onSubmit ? (
        <form
          onSubmit={onSubmit}
          className="contents"
          noValidate
        >
          {body}
        </form>
      ) : (
        body
      )}
    </section>
  );
};

export default InputPanel;
