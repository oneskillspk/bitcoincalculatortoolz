import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, Legend } from 'recharts';
import { type ProjectionResult, formatCurrency, COMPARISON_ASSETS } from '@/services/investmentProjectionCalculator';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ChartFrame,
  axisStyle,
  gridProps,
  legendStyle,
  defaultMargin,
} from '@/components/charts';

interface InvestmentProjectionChartProps {
  results: ProjectionResult[];
  showInflation: boolean;
  showAssetComparison: boolean;
  lumpSum: number;
  monthlyContribution: number;
  timeHorizon: number;
  currency?: string;
}

import { formatCurrencyAmount } from '@/utils/formatCurrency';

export const InvestmentProjectionChart: React.FC<InvestmentProjectionChartProps> = ({
  results,
  showInflation,
  showAssetComparison,
  lumpSum,
  monthlyContribution,
  timeHorizon,
  currency = 'USD',
}) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const locale = isTr ? 'tr-TR' : 'en-US';

  if (results.length === 0) return null;

  const maxYears = Math.max(...results.map(r => r.projections.length));
  const chartData = [];

  for (let i = 0; i < maxYears; i++) {
    const point: Record<string, number | string> = {
      year: isTr ? `Yıl ${i}` : `Year ${i}`,
      yearNum: i,
      invested: results[0]?.projections[i]?.totalInvested || 0,
    };

    results.forEach((result) => {
      const proj = result.projections[i];
      if (proj) {
        point[result.modelId] = showInflation ? proj.realValue : proj.nominalValue;
      }
    });

    if (showAssetComparison) {
      COMPARISON_ASSETS.forEach((asset) => {
        const fvLump = lumpSum * Math.pow(1 + asset.annualRate, i);
        const monthlyRate = asset.annualRate / 12;
        const totalMonths = i * 12;
        const fvDCA = monthlyRate > 0
          ? monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
          : monthlyContribution * totalMonths;
        point[asset.id] = fvLump + fvDCA;
      });
    }

    chartData.push(point);
  }

  const formatYAxis = (value: number): string =>
    formatCurrencyAmount(value, currency, { compact: value >= 1000, locale, decimals: value >= 1_000_000 ? 1 : 0 });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-mono font-medium text-foreground">
              {formatCurrency(entry.value, currency)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="border border-border/30 bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          {isTr ? 'Büyüme Projeksiyonu' : 'Growth Projection'}
          {showInflation && (
            <span className="text-xs text-muted-foreground font-normal">
              {isTr ? '(enflasyona göre düzeltilmiş)' : '(inflation-adjusted)'}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartFrame
          height={400}
          ariaLabel={isTr ? 'Yatırım projeksiyon grafiği' : 'Investment projection chart'}
          empty={chartData.length === 0}
        >
          <AreaChart data={chartData} margin={{ ...defaultMargin, left: 0, right: 10 }}>
            <CartesianGrid {...gridProps} />
            <XAxis
              dataKey="year"
              {...axisStyle}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--chart-grid))' }}
            />
            <YAxis
              {...axisStyle}
              tickFormatter={formatYAxis}
              tickLine={false}
              axisLine={false}
              width={65}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} {...legendStyle} />
            <Area
              type="monotone"
              dataKey="invested"
              name={isTr ? 'Yatırılan' : 'Invested'}
              stroke="hsl(var(--muted-foreground))"
              fill="hsl(var(--muted-foreground))"
              fillOpacity={0.05}
              strokeDasharray="5 5"
              strokeWidth={1.5}
            />
            {results.map((result) => (
              <Area
                key={result.modelId}
                type="monotone"
                dataKey={result.modelId}
                name={result.modelName}
                stroke={result.color}
                fill={result.color}
                fillOpacity={0.08}
                strokeWidth={1.5}
              />
            ))}
            {showAssetComparison &&
              COMPARISON_ASSETS.map((asset) => (
                <Line
                  key={asset.id}
                  type="monotone"
                  dataKey={asset.id}
                  name={asset.name}
                  stroke={asset.color}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              ))}
          </AreaChart>
        </ChartFrame>
      </CardContent>
    </Card>
  );
};
