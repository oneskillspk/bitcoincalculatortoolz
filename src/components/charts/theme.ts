/**
 * Shared Recharts theme. Single source of truth for chart colors,
 * grid, axes, tooltips, legends, and animation. Every chart should pull
 * from here instead of hardcoding hex values or per-component HSL strings.
 *
 * Tokens come from `:root` / `.dark` in src/index.css — never write raw hex.
 */

export const chartPalette = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
] as const;

/** Semantic series colors for calculator domains. */
export type SeriesKind = 'btc' | 'fiat' | 'gain' | 'loss' | 'neutral' | 'accent';

const SEMANTIC: Record<SeriesKind, string> = {
  btc: 'hsl(var(--chart-1))', // brand orange
  fiat: 'hsl(var(--chart-5))', // indigo
  gain: 'hsl(142 71% 45%)', // green — intentional, no token exists yet
  loss: 'hsl(var(--destructive))',
  neutral: 'hsl(var(--muted-foreground))',
  accent: 'hsl(var(--chart-3))', // purple
};

export function seriesColor(kind: SeriesKind): string {
  return SEMANTIC[kind];
}

export const gridProps = {
  stroke: 'hsl(var(--chart-grid))',
  strokeDasharray: '2 4',
  strokeOpacity: 0.6,
  vertical: false,
} as const;

export const axisStyle = {
  stroke: 'hsl(var(--chart-axis))',
  tick: { fill: 'hsl(var(--chart-axis))', fontSize: 11 },
  tickLine: false as const,
  axisLine: { stroke: 'hsl(var(--chart-grid))', strokeOpacity: 0.6 },
} as const;

/** Thin, editorial stroke width for all line/area charts. */
export const chartStrokeWidth = 1.5;

export const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'hsl(var(--popover))',
    color: 'hsl(var(--popover-foreground))',
    border: '1px solid hsl(var(--hairline))',
    borderRadius: '14px',
    boxShadow: '0 12px 36px -18px hsl(0 0% 0% / 0.22)',
    fontSize: 12,
    padding: '10px 14px',
  },
  labelStyle: {
    color: 'hsl(var(--foreground))',
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  itemStyle: {
    color: 'hsl(var(--popover-foreground))',
  },
  cursor: { stroke: 'hsl(var(--chart-grid))', strokeWidth: 1, strokeDasharray: '2 4' },
} as const;

export const legendStyle = {
  wrapperStyle: {
    color: 'hsl(var(--muted-foreground))',
    fontSize: 12,
    paddingTop: 8,
  },
} as const;

export const defaultMargin = { top: 12, right: 16, bottom: 8, left: 8 };

/** Respect prefers-reduced-motion at runtime (SSR-safe). */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const defaultAnimation = {
  isAnimationActive: !isReducedMotion(),
  animationDuration: 600,
} as const;
