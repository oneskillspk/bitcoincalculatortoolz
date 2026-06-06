import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { ScrollableTable } from '@/components/ui/ScrollableTable';
import { ProfitLossResult } from '@/services/profitLossCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { chartTooltipStyle } from '@/components/calculator/chartTokens';

interface ProfitLossChartProps {
  result: ProfitLossResult | null;
}

const formatCurrency = (value: number): string => {
  if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

export const ProfitLossChart: React.FC<ProfitLossChartProps> = ({ result }) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  if (!result) return null;

  const chartData = result.scenarios.map(s => ({
    name: s.label,
    value: s.netProfitLoss,
    price: s.price,
    roi: s.roi,
  }));

  return (
    <Card className="bg-card border-border/50">
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-foreground mb-1">
          {isTr ? 'Satış Fiyatı Senaryoları' : 'Sell Price Scenarios'}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {isTr
            ? 'Güncel fiyata göre farklı satış fiyatlarında net K/Z'
            : 'Net P/L at different sell prices relative to current'}
        </p>

        <div className="h-[280px] sm:h-[320px] min-h-[280px]">
          <PerformantResponsiveContainer width="100%" height="100%" minHeight={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--chart-grid))" strokeOpacity={0.6} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: 'hsl(var(--chart-axis))', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fill: 'hsl(var(--chart-axis))', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value: number) => [
                  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                  isTr ? 'Net K/Z' : 'Net P/L'
                ]}
                labelFormatter={(label: string, payload: any[]) => {
                  if (payload?.[0]?.payload?.price) {
                    return `${label} — $${payload[0].payload.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
                  }
                  return label;
                }}
              />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 4" opacity={0.5} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={40}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.value >= 0 ? 'hsl(142, 71%, 45%)' : 'hsl(var(--destructive))'}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </PerformantResponsiveContainer>
        </div>

        <ScrollableTable className="mt-4 -mx-4 sm:mx-0" ariaLabel={isTr ? 'Kâr ve zarar senaryo tablosu' : 'Profit and loss scenario table'}>
          <div className="min-w-[400px] px-4 sm:px-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-border/30">
                  <th className="text-left py-1.5 font-medium">{isTr ? 'Senaryo' : 'Scenario'}</th>
                  <th className="text-right py-1.5 font-medium">{isTr ? 'Satış Fiyatı' : 'Sell Price'}</th>
                  <th className="text-right py-1.5 font-medium">{isTr ? 'Net K/Z' : 'Net P/L'}</th>
                  <th className="text-right py-1.5 font-medium">ROI</th>
                </tr>
              </thead>
              <tbody>
                {result.scenarios.map((s, i) => (
                  <tr key={i} className={`border-b border-border/20 ${s.label === 'Current' ? 'bg-primary/5' : ''}`}>
                    <td className="py-1.5 font-medium">{s.label}</td>
                    <td className="text-right py-1.5 font-mono">
                      ${s.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className={`text-right py-1.5 font-mono ${s.netProfitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {s.netProfitLoss >= 0 ? '+' : ''}${s.netProfitLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className={`text-right py-1.5 font-mono ${s.roi >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {s.roi >= 0 ? '+' : ''}{s.roi.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollableTable>
      </CardContent>
    </Card>
  );
};
