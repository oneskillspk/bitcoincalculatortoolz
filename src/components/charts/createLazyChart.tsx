import { lazy, Suspense, ComponentType } from "react";

/**
 * User-visible fallback rendered while a lazy chart's recharts chunk
 * downloads and parses. Reserves the height of the real chart so the
 * layout doesn't shift when the chart swaps in, and shows a soft pulsing
 * "Loading chart…" label + shimmer bars so the space never looks blank.
 *
 * `minHeight` is passed by each shim (falling back to 320px, the average
 * chart height across the suite) so tall charts like the retirement
 * projection don't get a too-short placeholder.
 */
function ChartSkeleton({ minHeight = 320, label = "Loading chart…" }: { minHeight?: number; label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="relative w-full overflow-hidden rounded-xl border border-border/20 bg-muted/10"
      style={{ minHeight, height: minHeight, contain: "layout paint" }}
    >
      {/* Fake axis / bars — visual weight matches a chart card */}
      <div className="absolute inset-4 flex items-end gap-2 opacity-40">
        {[45, 62, 38, 78, 55, 88, 42, 70, 60, 85, 50, 75].map((h, i) => (
          <div
            key={i}
            className="flex-1 animate-pulse rounded-sm bg-muted-foreground/20"
            style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
      {/* Centered label — always visible to the user */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="rounded-full bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
          {label}
        </span>
      </div>
    </div>
  );
}

/**
 * Wrap a dynamic-imported chart module (named export) in React.lazy +
 * Suspense so recharts stays in a dynamic chunk (loaded after LCP).
 *
 * Usage inside a shim file:
 *   export const CAGRChart = createLazyChart(() => import('./CAGRChart.impl'), 'CAGRChart');
 *   // or with an explicit reserved height matching the real chart:
 *   export const RetirementChart = createLazyChart(loader, 'RetirementChart', { minHeight: 400 });
 */
export function createLazyChart<TProps extends Record<string, unknown> = Record<string, unknown>>(
  loader: () => Promise<Record<string, unknown>>,
  exportName: string,
  options: { minHeight?: number; label?: string } = {},
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
    <Suspense fallback={<ChartSkeleton minHeight={options.minHeight} label={options.label} />}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <LazyInner {...(props as any)} />
    </Suspense>
  );
  Wrapped.displayName = `LazyChart(${exportName})`;
  return Wrapped as ComponentType<TProps>;
}
