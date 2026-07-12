import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { SupplySchedulePoint } from '@/services/halvingCountdownService';
import {
  ChartFrame,
  ChartTooltip,
  axisStyle,
  gridProps,
  defaultMargin,
  seriesColor,
} from '@/components/charts';

interface SupplyScheduleChartProps {
  data: SupplySchedulePoint[];
  currentYear?: number;
}

export const SupplyScheduleChart: React.FC<SupplyScheduleChartProps> = ({
  data,
  currentYear = 2026,
}) => {
  const chartData = data.map((d) => ({
    year: d.year,
    supply: d.totalSupply,
    reward: d.blockReward,
    inflation: d.annualInflationRate,
  }));

  const currentPoint = chartData.find((d) => d.year >= currentYear);

  return (
    <Card className="border-border/30 bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-lg">Bitcoin Supply Schedule (2009 – 2140)</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto -mx-2 px-2">
          <div className="min-w-[400px]">
            <ChartFrame
              height={350}
              ariaLabel="Bitcoin halving supply schedule"
              empty={chartData.length === 0}
            >
              <AreaChart data={chartData} margin={{ ...defaultMargin, right: 20, left: 10 }}>
                <defs>
                  <linearGradient id="supplyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={seriesColor('btc')} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={seriesColor('btc')} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis
                  dataKey="year"
                  {...axisStyle}
                  tickFormatter={(val) => (val % 20 === 0 || val === 2009 ? String(val) : '')}
                />
                <YAxis
                  {...axisStyle}
                  tickFormatter={(val) => `${(val / 1_000_000).toFixed(0)}M`}
                  domain={[0, 21_500_000]}
                />
                <Tooltip
                  content={
                    <ChartTooltip
                      formatter={(v) => `${(Number(v) / 1_000_000).toFixed(4)}M BTC`}
                      labelFormatter={(v) => `Year ${v}`}
                    />
                  }
                />
                <ReferenceLine
                  y={21_000_000}
                  stroke={seriesColor('btc')}
                  strokeDasharray="6 3"
                  label={{
                    value: '21M Cap',
                    position: 'right',
                    fill: seriesColor('btc'),
                    fontSize: 11,
                  }}
                />
                {currentPoint && (
                  <ReferenceDot
                    x={currentPoint.year}
                    y={currentPoint.supply}
                    r={6}
                    fill={seriesColor('btc')}
                    stroke="hsl(var(--background))"
                    strokeWidth={1.5}
                  />
                )}
                <Area
                  type="stepAfter"
                  dataKey="supply"
                  stroke={seriesColor('btc')}
                  strokeWidth={1.5}
                  fill="url(#supplyGradient)"
                />
              </AreaChart>
            </ChartFrame>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/30">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Bitcoin's supply follows a predictable issuance schedule. The block reward halves every
            210,000 blocks (~4 years), creating a disinflationary monetary policy. By 2140, all 21
            million BTC will have been mined.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
