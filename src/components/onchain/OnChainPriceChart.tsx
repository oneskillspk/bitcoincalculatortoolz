import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { MetricHistoryPoint } from "@/services/onChainMetricsService";
import { chartTooltipStyle, chartTooltipLabelStyle, chartTooltipItemStyle } from '@/components/calculator/chartTokens';

interface OnChainPriceChartProps {
  data: MetricHistoryPoint[];
  s2fModelPrice?: number;
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={chartTooltipStyle}>
      <p style={chartTooltipLabelStyle}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={chartTooltipItemStyle}>
          {p.dataKey === 'value' ? 'BTC Price' : 'S2F Model'}: ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(p.value)}
        </p>
      ))}
    </div>
  );
};

export const OnChainPriceChart = ({ data, s2fModelPrice, loading }: OnChainPriceChartProps) => {
  const chartData = data.map((d) => ({
    ...d,
    s2fModel: s2fModelPrice,
  }));

  if (loading) {
    return (
      <Card className="glass-morphism-card border-border/20 shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse h-64 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!data.length) return null;

  const minVal = Math.min(...data.map((d) => d.value)) * 0.95;
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.05;

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Bitcoin Price vs S2F Model (90 Days)
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Orange line = live BTC price · Dashed line = PlanB S2F model price
        </p>
      </CardHeader>
      <CardContent>
        <div style={{ height: "clamp(182px, 112px + 28vw, 280px)" }}><ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border) / 0.2)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(v: string) => {
                const d = new Date(v);
                return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
              }}
              interval={13}
            />
            <YAxis
              domain={[minVal, maxVal]}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />
            {s2fModelPrice && (
              <ReferenceLine
                y={s2fModelPrice}
                stroke="hsl(var(--chart-2))"
                strokeDasharray="5 5"
                strokeWidth={1.5}
                label={{ value: 'S2F', position: 'insideRight', fontSize: 10, fill: 'hsl(var(--chart-2))' }}
              />
            )}
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer></div>
      </CardContent>
    </Card>
  );
};
