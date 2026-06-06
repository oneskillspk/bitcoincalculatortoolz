import React, { useId } from 'react';
import { cn } from '@/lib/utils';
import { TooltipInfo } from '@/components/ui/tooltip-info';

interface InputFieldProps {
  label: React.ReactNode;
  /** Tooltip replaces inline helper text — keep it short and useful. */
  tooltip?: string;
  /** Optional value displayed to the right of the label (e.g. slider value). */
  trailingLabel?: React.ReactNode;
  /** Inline error message. Triggers aria-invalid on the rendered control. */
  error?: React.ReactNode;
  /** Render-prop receives `id` and aria attributes for the underlying control. */
  children:
    | React.ReactNode
    | ((bag: {
        id: string;
        'aria-describedby'?: string;
        'aria-invalid'?: boolean;
      }) => React.ReactNode);
  className?: string;
  /** Override the auto-generated id (rarely needed). */
  htmlFor?: string;
}

/**
 * Label + control + optional tooltip-driven help.
 * Always render exactly one focusable control inside.
 */
export const InputField: React.FC<InputFieldProps> = ({
  label,
  tooltip,
  trailingLabel,
  error,
  children,
  className,
  htmlFor,
}) => {
  const reactId = useId();
  const id = htmlFor ?? `field-${reactId}`;
  const errorId = error ? `${id}-error` : undefined;

  const controlBag = {
    id,
    'aria-describedby': errorId,
    'aria-invalid': error ? true : undefined,
  };

  return (
    <div className={cn('flex flex-col gap-2 min-w-0', className)}>
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="inline-flex items-center gap-1.5 min-w-0">
          <label
            htmlFor={id}
            className="calc-text-label inline-flex items-center gap-1.5 min-w-0 truncate"
          >
            <span className="truncate">{label}</span>
          </label>
          {tooltip && <TooltipInfo content={tooltip} side="top" />}
        </div>
        {trailingLabel && (
          <span className="calc-text-mono text-sm text-foreground/80 shrink-0">
            {trailingLabel}
          </span>
        )}
      </div>

      {typeof children === 'function' ? children(controlBag) : children}

      {error && (
        <p id={errorId} role="alert" className="calc-text-small text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
