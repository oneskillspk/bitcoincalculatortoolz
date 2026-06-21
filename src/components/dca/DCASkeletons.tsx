import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * All DCA skeletons share the same a11y contract:
 *   - role="status" + aria-busy="true" so AT users know the region is
 *     loading rather than empty.
 *   - aria-live="polite" so the eventual content swap is announced once.
 *   - A visually-hidden <span> carries the human label (overridable per
 *     skeleton) — screen readers read this instead of an empty container.
 *   - `tabIndex={-1}` keeps the placeholder out of the tab order; focus
 *     management for the swap-in is owned by the real component.
 */
type LoadingShellProps = {
  label: string;
  className?: string;
  testId?: string;
  children: React.ReactNode;
};

const LoadingShell = ({ label, className, testId, children }: LoadingShellProps) => (
  <div
    role="status"
    aria-busy="true"
    aria-live="polite"
    tabIndex={-1}
    data-testid={testId}
    className={className}
  >
    <span className="sr-only">{label}</span>
    <div aria-hidden="true">{children}</div>
  </div>
);


export const DCAResultsSkeleton = ({
  label = "Loading DCA results",
}: { label?: string } = {}) => (
  <LoadingShell label={label} testId="dca-results-skeleton">
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6 space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </CardContent>
    </Card>
  </LoadingShell>
);

export const DCAChartSkeleton = ({
  label = "Loading DCA chart",
}: { label?: string } = {}) => (
  <LoadingShell label={label} testId="dca-chart-skeleton">
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-64 sm:h-80 w-full rounded-lg" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  </LoadingShell>
);

export const DCASectionSkeleton = ({
  rows = 4,
  label = "Loading section",
}: { rows?: number; label?: string } = {}) => (
  <LoadingShell
    label={label}
    testId="dca-section-skeleton"
    className="mx-auto w-full max-w-4xl space-y-3 px-4 sm:px-6 py-8"
  >
    <Skeleton className="h-6 w-1/3 mx-auto" />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-14 w-full rounded-lg" />
    ))}
  </LoadingShell>
);

