import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComposedChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { StrategyResult } from '@/services/hodlStrategyCalculator';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { chartLegendStyle } from '@/components/calculator/chartTokens';
import { formatCurrencyAmount } from '@/utils/formatCurrency';

interface StrategyComparisonChartProps {
  strategies: StrategyResult[];
  currency: string;
}

export const StrategyComparisonChart = ({ strategies, currency }: StrategyComparisonChartProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  if (strategies.length === 0) return null;

  const chartData = strategies[0].portfolioTimeline.map((point, index) => {
    const dataPoint: any = {
      date: format(new Date(point.date), 'MMM dd, yyyy'),
      timestamp: new Date(point.date).getTime()
    };
    strategies.forEach(strategy => {
      if (strategy.portfolioTimeline[index]) {
        dataPoint[strategy.type] = strategy.portfolioTimeline[index].value;
      }
    });
    return dataPoint;
  });

  const strategyColors: Record<string, { stroke: string; fill: string }> = {
    'hodl': { stroke: 'hsl(var(--primary))', fill: 'hsl(var(--primary))' },
    'dca-weekly': { stroke: 'hsl(var(--chart-1))', fill: 'hsl(var(--chart-1))' },
    'dca-monthly': { stroke: 'hsl(var(--chart-2))', fill: 'hsl(var(--chart-2))' },
    'buy-dip': { stroke: 'hsl(var(--chart-3))', fill: 'hsl(var(--chart-3))' },
    'rebalance': { stroke: 'hsl(var(--chart-4))', fill: 'hsl(var(--chart-4))' }
  };

  const strategyNames: Record<string, { en: string; tr: string }> = {
    'hodl': { en: 'Pure HODL', tr: 'Saf HODL' },
    'dca-weekly': { en: 'DCA Weekly', tr: 'Haftalık DCA' },
    'dca-monthly': { en: 'DCA Monthly', tr: 'Aylık DCA' },
    'buy-dip': { en: 'Buy the Dip', tr: 'Düşüşü Al' },
    'rebalance': { en: 'Rebalancing', tr: 'Dengeleme' }
  };

  const getStrategyName = (key: string) =>
    isTr ? (strategyNames[key]?.tr || key) : (strategyNames[key]?.en || key);

  const formatCurrency = (value: number) =>
    formatCurrencyAmount(value, currency, { locale: isTr ? 'tr-TR' : 'en-US' });


  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
        <p className="text-xs text-muted-foreground mb-2">{payload[0]?.payload?.date}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs">
            <span style={{ color: entry.stroke }}>{getStrategyName(entry.dataKey)}:</span>
            <span className="font-semibold">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="border-border/50 bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">
          {isTr ? 'Strateji Performansı Zaman İçinde' : 'Strategy Performance Over Time'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] sm:h-[400px] min-h-[280px] sm:min-h-[360px]">
          <PerformantResponsiveContainer width="100%" height="100%" minHeight={360}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="timestamp" type="number" domain={['dataMin', 'dataMax']}
                tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM yyyy')}
                stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}
                tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={chartLegendStyle} formatter={(value) => getStrategyName(value)} />
              {strategies.map((strategy, index) => (
                <Area key={strategy.type} type="monotone" dataKey={strategy.type}
                  stroke={strategyColors[strategy.type]?.stroke || 'hsl(var(--muted-foreground))'}
                  fill={strategyColors[strategy.type]?.fill || 'hsl(var(--muted-foreground))'}
                  fillOpacity={index === 0 ? 0.1 : 0.05}
                  strokeWidth={index === 0 ? 2 : 1.5} dot={false} />
              ))}
            </ComposedChart>
          </PerformantResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
