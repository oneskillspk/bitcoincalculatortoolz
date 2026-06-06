import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { TrendingUp } from 'lucide-react';
import { AccumulationDataPoint } from '@/services/bitcoinSavingsCalculator';
import { chartTooltipStyle, chartLegendStyle } from '@/components/calculator/chartTokens';

interface SavingsAccumulationChartProps {
  data: AccumulationDataPoint[];
}

export const SavingsAccumulationChart = ({ data }: SavingsAccumulationChartProps) => {
  if (!data.length) return null;

  const chartData = data.map((d) => ({
    month: d.month,
    label: d.month <= 12 ? `M${d.month}` : `Y${(d.month / 12).toFixed(1)}`,
    btcHoldings: parseFloat(d.cumulativeBtc.toFixed(8)),
    fiatInvested: Math.round(d.cumulativeFiat),
    portfolioValue: Math.round(d.portfolioValue),
  }));

  return (
    <Card className="border border-border/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          Accumulation Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[500px] h-[300px] sm:h-[350px] min-h-[300px]">
            <PerformantResponsiveContainer width="100%" height="100%" minHeight={300}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fiatGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  interval={Math.max(0, Math.floor(chartData.length / 8))}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value: number, name: string) => {
                    const label = name === 'portfolioValue' ? 'Portfolio Value' : 'Fiat Invested';
                    return [`$${value.toLocaleString()}`, label];
                  }}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Legend
                  formatter={(value) => value === 'portfolioValue' ? 'Portfolio Value' : 'Fiat Invested'}
                  wrapperStyle={chartLegendStyle}
                />
                <Area
                  type="monotone"
                  dataKey="fiatInvested"
                  stroke="hsl(var(--muted-foreground))"
                  fill="url(#fiatGradient)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
                <Area
                  type="monotone"
                  dataKey="portfolioValue"
                  stroke="hsl(var(--primary))"
                  fill="url(#portfolioGradient)"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </PerformantResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
