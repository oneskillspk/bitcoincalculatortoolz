import { useLocale } from '@/hooks/useLocale';
import { tooltipStyle } from './theme';
import { getFormatter, type ChartFormatterKind } from './formatters';

interface PayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string;
  payload?: Record<string, unknown>;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string | number;
  /** Formatter kind to apply to numeric values. Default 'usd'. */
  formatter?: ChartFormatterKind | ((v: number | string, item: PayloadItem) => string);
  /** Optional formatter for the X label (date / category). */
  labelFormatter?: ChartFormatterKind | ((v: string | number) => string);
  /** Hide rows whose dataKey is in this list. */
  hideKeys?: string[];
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatter = 'usd',
  labelFormatter,
  hideKeys,
}: ChartTooltipProps) {
  const { intlLocale } = useLocale();
  if (!active || !payload || payload.length === 0) return null;

  const valueFn =
    typeof formatter === 'function'
      ? formatter
      : (v: number | string) => getFormatter(formatter, intlLocale)(v);

  const labelFn =
    typeof labelFormatter === 'function'
      ? labelFormatter
      : labelFormatter
        ? (v: string | number) => getFormatter(labelFormatter, intlLocale)(v)
        : (v: string | number) => String(v ?? '');

  const rows = hideKeys
    ? payload.filter((p) => !p.dataKey || !hideKeys.includes(p.dataKey))
    : payload;

  return (
    <div style={tooltipStyle.contentStyle as React.CSSProperties} className="min-w-[140px]">
      {label !== undefined && (
        <div style={tooltipStyle.labelStyle as React.CSSProperties} className="mb-1">
          {labelFn(label)}
        </div>
      )}
      <div className="space-y-1">
        {rows.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: p.color ?? 'hsl(var(--muted-foreground))' }}
              />
              <span className="text-muted-foreground">{p.name ?? p.dataKey}</span>
            </span>
            <span className="font-medium tabular-nums">
              {p.value !== undefined ? valueFn(p.value, p) : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
