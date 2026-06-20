/**
 * Shared minimalist chart styling tokens.
 *
 * Every Recharts <Tooltip /> and <Legend /> in calculator panels
 * MUST consume these constants instead of inlining a `contentStyle`
 * or `wrapperStyle` object. Series colors MUST also come from
 * `chartSeries` / `chartSeriesOrdered` — no hex literals in chart files.
 *
 * Run `bun scripts/audit-chart-tokens.ts` to lint the codebase.
 */

import type { CSSProperties } from 'react';

/** Card-style tooltip surface — matches ResultPanel borders & radius. */
export const chartTooltipStyle: CSSProperties = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '12px',
  boxShadow: '0 8px 24px -12px hsl(var(--foreground) / 0.18)',
  fontSize: '12px',
  color: 'hsl(var(--foreground))',
  padding: '10px 12px',
};

/** Tooltip item label color (sub-text inside the card). */
export const chartTooltipLabelStyle: CSSProperties = {
  color: 'hsl(var(--muted-foreground))',
  fontSize: '12px',
  fontWeight: 500,
  marginBottom: 4,
};

/** Tooltip item value style (numeric values per series). */
export const chartTooltipItemStyle: CSSProperties = {
  color: 'hsl(var(--foreground))',
  fontSize: '12px',
  fontWeight: 600,
};

/** Minimalist legend — small caps, muted color, generous padding above. */
export const chartLegendStyle: CSSProperties = {
  fontSize: '12px',
  color: 'hsl(var(--muted-foreground))',
  paddingTop: '12px',
  letterSpacing: '0.02em',
};

/** Axis tick + grid tokens for consistent chart chrome. */
export const chartAxisTick = {
  fontSize: 11,
  fill: 'hsl(var(--muted-foreground))',
} as const;

export const chartGridStroke = 'hsl(var(--border))';

/**
 * Brand-aligned chart series palette.
 *
 * Use semantic keys whenever the series carries meaning:
 *   - `primary`      → BTC, the protagonist line
 *   - `success`      → profit / positive / above-baseline
 *   - `destructive`  → loss / drawdown / below-baseline
 *   - `warning`      → caution / fee spikes / neutral-warning
 *
 * Use `chartSeriesOrdered` for comparison charts where you just need
 * N distinct, harmonious colors (asset comparisons, multi-line plots).
 */
export const chartSeries = {
  primary: 'hsl(var(--chart-1))',      // brand orange
  secondary: 'hsl(var(--chart-2))',    // teal
  tertiary: 'hsl(var(--chart-3))',     // purple
  quaternary: 'hsl(var(--chart-4))',   // amber
  quinary: 'hsl(var(--chart-5))',      // indigo
  success: 'hsl(var(--success))',
  destructive: 'hsl(var(--destructive))',
  warning: 'hsl(var(--warning))',
  muted: 'hsl(var(--muted-foreground))',
} as const;

export const chartSeriesOrdered = [
  chartSeries.primary,
  chartSeries.secondary,
  chartSeries.tertiary,
  chartSeries.quaternary,
  chartSeries.quinary,
] as const;

/** Fear & Greed band colors mapped to semantic tokens. */
export const fearGreedScale = {
  extremeFear: 'hsl(var(--destructive))',
  fear: 'hsl(var(--warning))',
  neutral: 'hsl(var(--muted-foreground))',
  greed: 'hsl(var(--success) / 0.8)',
  extremeGreed: 'hsl(var(--success))',
} as const;
