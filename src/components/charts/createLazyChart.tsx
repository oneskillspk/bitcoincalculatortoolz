import { lazy, Suspense, ComponentType } from "react";

/**
 * Shared fallback for lazy chart components — same visual footprint as a
 * chart card so the layout doesn't shift while recharts loads.
 */
function ChartSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="w-full min-h-[280px] animate-pulse rounded-xl bg-muted/20"
    />
  );
}

/**
 * Wrap a dynamic-imported chart module (named export) in React.lazy +
 * Suspense so recharts stays in a dynamic chunk (loaded after LCP).
 *
 * Usage inside a shim file:
 *   const Loader = () => import('./CAGRChart.impl');
 *   export const CAGRChart = createLazyChart(Loader, 'CAGRChart');
 */
export function createLazyChart<TProps>(
  loader: () => Promise<Record<string, unknown>>,
  exportName: string,
): ComponentType<TProps> {
  const LazyInner = lazy(async () => {
    const mod = await loader();
    const Comp = mod[exportName] as ComponentType<TProps>;
    if (!Comp) {
      throw new Error(`createLazyChart: '${exportName}' missing from module`);
    }
    return { default: Comp };
  });

  const Wrapped = (props: TProps) => (
    <Suspense fallback={<ChartSkeleton />}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <LazyInner {...(props as any)} />
    </Suspense>
  );
  Wrapped.displayName = `LazyChart(${exportName})`;
  return Wrapped;
}
