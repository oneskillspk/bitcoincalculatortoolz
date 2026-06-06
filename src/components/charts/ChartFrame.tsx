import { forwardRef, type ReactNode } from 'react';
import { ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface ChartFrameProps {
  /** Inner Recharts chart (single root element). */
  children: ReactNode;
  /** Fixed pixel height. Use either `height` or `aspectRatio`. */
  height?: number;
  /** Width / height ratio when no fixed height. */
  aspectRatio?: number;
  loading?: boolean;
  /** When true, render the empty state instead of the chart. */
  empty?: boolean;
  emptyMessage?: string;
  /** Error message — when set, renders an error callout. */
  error?: string | null;
  /** Optional figure title + description for a11y (rendered as figcaption). */
  title?: ReactNode;
  description?: ReactNode;
  /** Required for screen readers if no visible title. */
  ariaLabel?: string;
  /** Right-aligned slot above the chart (export buttons, etc.). */
  actions?: ReactNode;
  className?: string;
}

/**
 * Shared wrapper for every chart in the app. Standardises responsive
 * sizing, loading / empty / error states, and exposes a ref to the
 * <figure> for downstream PNG export.
 */
export const ChartFrame = forwardRef<HTMLElement, ChartFrameProps>(function ChartFrame(
  {
    children,
    height = 320,
    aspectRatio,
    loading,
    empty,
    emptyMessage = 'No data to display.',
    error,
    title,
    description,
    ariaLabel,
    actions,
    className,
  },
  ref,
) {
  const showHeader = Boolean(title || description || actions);
  const computedHeight = aspectRatio ? undefined : height;
  // Responsive height ladder: scales down on mobile, full size on >=sm.
  const responsiveHeight = `clamp(${Math.round(height * 0.65)}px, ${Math.round(height * 0.4)}px + 28vw, ${height}px)`;
  const wrapperStyle = aspectRatio
    ? { aspectRatio: String(aspectRatio) }
    : { height: responsiveHeight };

  return (
    <figure
      ref={ref}
      aria-label={ariaLabel ?? (typeof title === 'string' ? title : undefined)}
      className={cn('w-full', className)}
    >
      {showHeader && (
        <figcaption className="mb-3 flex items-start justify-between gap-4">
          <div>
            {title && (
              <div className="text-sm font-semibold text-foreground">{title}</div>
            )}
            {description && (
              <div className="text-xs text-muted-foreground">{description}</div>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </figcaption>
      )}

      <div className="relative w-full" style={wrapperStyle}>
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : error ? (
          <div
            role="alert"
            className="flex h-full w-full items-center justify-center rounded-md border border-destructive/30 bg-destructive/5 px-4 text-center text-sm text-destructive"
          >
            {error}
          </div>
        ) : empty ? (
          <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/30 px-4 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={computedHeight ?? '100%'}>
            {children as React.ReactElement}
          </ResponsiveContainer>
        )}
      </div>
    </figure>
  );
});
