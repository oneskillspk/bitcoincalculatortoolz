import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HalvingHistoricalImpact } from '@/services/halvingCountdownService';
import { chartTooltipStyle } from '@/components/calculator/chartTokens';

interface HalvingImpactChartProps {
  impactData: HalvingHistoricalImpact[];
}

const HALVING_COLORS = ['hsl(var(--warning))', 'hsl(var(--chart-2))', 'hsl(var(--success))', 'hsl(var(--chart-3))'];
const PERIODS = ['1 Month', '3 Months', '6 Months', '1 Year', '18 Months'];

export const HalvingImpactChart: React.FC<HalvingImpactChartProps> = ({ impactData }) => {
  const [viewMode, setViewMode] = useState<'percentage' | 'absolute'>('percentage');

  const chartData = PERIODS.map((period, idx) => {
    const point: Record<string, string | number | null> = { period };
    impactData.forEach(halving => {
      const ret = halving.returns[idx];
      if (viewMode === 'percentage') {
        point[`Halving ${halving.halvingNumber}`] = ret?.returnPct != null ? Math.round(ret.returnPct) : null;
      } else {
        point[`Halving ${halving.halvingNumber}`] = ret?.price ?? null;
      }
    });
    return point;
  });

  return (
    <Card className="border-border/30 bg-card">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-lg">Post-Halving Price Performance</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === 'percentage' ? 'default' : 'outline'}
              onClick={() => setViewMode('percentage')}
              className="text-xs h-8"
            >
              % Change
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'absolute' ? 'default' : 'outline'}
              onClick={() => setViewMode('absolute')}
              className="text-xs h-8"
            >
              Price
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto -mx-2 px-2">
          <div className="min-w-[400px]">
            <PerformantResponsiveContainer width="100%" height={350} minHeight={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} className="opacity-30" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  tickFormatter={val =>
                    viewMode === 'percentage'
                      ? `${val}%`
                      : val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`
                  }
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value: number, name: string) => [
                    viewMode === 'percentage'
                      ? `${value?.toFixed(1)}%`
                      : `$${value?.toLocaleString(getCurrentIntlLocale())}`,
                    name,
                  ]}
                />
                <Legend />
                {impactData.map((halving, i) => (
                  <Line
                    key={halving.halvingNumber}
                    type="monotone"
                    dataKey={`Halving ${halving.halvingNumber}`}
                    stroke={HALVING_COLORS[i % HALVING_COLORS.length]}
                    strokeWidth={1.5}
                    dot={{ r: 4 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </PerformantResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
