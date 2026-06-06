import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { RollingCorrelation } from '@/services/correlationService';
import { useLanguage } from '@/contexts/LanguageContext';
import { chartTooltipStyle, chartLegendStyle } from '@/components/calculator/chartTokens';

interface RollingCorrelationChartProps {
  data: RollingCorrelation[];
  loading?: boolean;
}

export const RollingCorrelationChart: React.FC<RollingCorrelationChartProps> = ({ data, loading }) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  if (loading) {
    return (
      <Card className="glass-morphism-card border-border/20">
        <CardHeader>
          <CardTitle className="text-foreground">
            {isTr ? 'Hareketli 30 Günlük Korelasyon' : 'Rolling 30-Day Correlation'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.length > 500
    ? data.filter((_, i) => i % Math.ceil(data.length / 500) === 0)
    : data;

  return (
    <Card className="glass-morphism-card border-border/20">
      <CardHeader>
        <CardTitle className="text-foreground">
          {isTr ? 'Bitcoin ile Hareketli 30 Günlük Korelasyon' : 'Rolling 30-Day Correlation vs Bitcoin'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isTr
            ? "Bitcoin'in her varlıkla korelasyonunun zaman içinde nasıl değiştiği"
            : "How Bitcoin's correlation with each asset changes over time"}
        </p>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 350, minHeight: 300 }}>
          <PerformantResponsiveContainer width="100%" height="100%" minHeight={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border) / 0.3)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(v: string) => v.slice(5)}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[-1, 1]}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(v: number) => v.toFixed(1)}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value: number) => [value?.toFixed(3) ?? '—', '']}
                labelFormatter={(label: string) => `${isTr ? 'Tarih' : 'Date'}: ${label}`}
              />
              <Legend wrapperStyle={chartLegendStyle} />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground) / 0.5)" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="sp500" name="S&P 500" stroke="hsl(217, 91%, 60%)" dot={false} strokeWidth={1.5} connectNulls />
              <Line type="monotone" dataKey="gold" name={isTr ? 'Altın' : 'Gold'} stroke="hsl(45, 93%, 47%)" dot={false} strokeWidth={1.5} connectNulls />
              <Line type="monotone" dataKey="nasdaq" name="Nasdaq" stroke="hsl(142, 71%, 45%)" dot={false} strokeWidth={1.5} connectNulls />
              <Line type="monotone" dataKey="dxy" name="DXY" stroke="hsl(0, 84%, 60%)" dot={false} strokeWidth={1.5} connectNulls />
            </LineChart>
          </PerformantResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
