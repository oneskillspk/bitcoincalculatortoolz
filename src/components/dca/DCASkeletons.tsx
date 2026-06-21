import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Lightweight placeholder shown while the DCA results panel is either
 * Suspense-pending (lazy chunk loading) or the underlying price query is
 * fetching. Mirrors the rough silhouette of `ModernDCAResultsPanel` so the
 * layout doesn't jump when the real component swaps in.
 */
export const DCAResultsSkeleton = () => (
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
);

/**
 * Skeleton matching the proportions of `DCAChartPanel` — header line,
 * a tall chart area, and a small legend row. Keeps perceived performance
 * smooth between price-fetch and chart-mount.
 */
export const DCAChartSkeleton = () => (
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
);

/** Generic section skeleton (FAQ / How It Works / Comparison Table). */
export const DCASectionSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div className="mx-auto w-full max-w-4xl space-y-3 px-4 sm:px-6 py-8">
    <Skeleton className="h-6 w-1/3 mx-auto" />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-14 w-full rounded-lg" />
    ))}
  </div>
);
