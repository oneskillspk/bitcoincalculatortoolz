import { useMemo } from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { getPizzaIndexData } from '@/services/pizzaDayCalculatorService';
import { Pizza } from 'lucide-react';
import { chartTooltipStyle } from '@/components/calculator/chartTokens';

interface Props {
  currentBtcPrice: number;
}

export const PizzaIndexChart = ({ currentBtcPrice }: Props) => {
  const data = useMemo(() => getPizzaIndexData(currentBtcPrice), [currentBtcPrice]);

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Pizza className="w-5 h-5 text-primary" />
          Bitcoin Pizza Index
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How many $20 pizzas could 1 BTC buy each year?
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] sm:h-[320px] min-h-[240px] sm:min-h-[300px]">
          <PerformantResponsiveContainer width="100%" height="100%" minHeight={300}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="pizzaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toString()}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value: number) => [`${formatGroupedInt(value)} pizzas 🍕`, 'Pizzas per BTC']}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="pizzasPerBtc"
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                fill="url(#pizzaGradient)"
              />
            </AreaChart>
          </PerformantResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
