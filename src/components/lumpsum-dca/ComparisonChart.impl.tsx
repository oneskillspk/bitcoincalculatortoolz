import React from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { ComparisonResult } from '@/services/lumpSumDcaComparator';
import { format } from 'date-fns';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { chartLegendStyle } from '@/components/calculator/chartTokens';

interface ComparisonChartProps {
  result: ComparisonResult;
}

export const ComparisonChart = ({ result }: ComparisonChartProps) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  const formatCurrency = (amount: number) => {
    return `$${formatGroupedInt(amount, 'en-US')}`;
  };

  const hasDva = !!result.dva;

  const chartData = React.useMemo(() => {
    const lumpSumPurchases = result.lumpSum.purchases;
    const dcaPurchases = result.dca.purchases;
    const dvaPurchases = result.dva?.purchases || [];
    
    const allDates = new Set([
      ...lumpSumPurchases.map(p => p.date),
      ...dcaPurchases.map(p => p.date),
      ...dvaPurchases.map(p => p.date)
    ]);
    
    const sortedDates = Array.from(allDates).sort();
    
    return sortedDates.map(date => {
      const lumpSumPurchase = lumpSumPurchases.find(p => p.date === date);
      
      const lumpSumValue = lumpSumPurchase?.currentValue || 
        (new Date(date) >= new Date(lumpSumPurchases[0]?.date) ? 
          lumpSumPurchases[0]?.currentValue : 0);
      
      const latestDcaPurchase = dcaPurchases
        .filter(p => new Date(p.date) <= new Date(date))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      const dcaValue = latestDcaPurchase?.currentValue || 0;

      const latestDvaPurchase = dvaPurchases
        .filter(p => new Date(p.date) <= new Date(date))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      const dvaValue = latestDvaPurchase?.currentValue || 0;
      
      return {
        date,
        dateFormatted: format(new Date(date), 'MMM dd, yyyy'),
        lumpSumValue,
        dcaValue,
        ...(hasDva ? { dvaValue } : {}),
        lumpSumInvested: lumpSumPurchase?.totalInvested || 
          (new Date(date) >= new Date(lumpSumPurchases[0]?.date) ? 
            lumpSumPurchases[0]?.totalInvested : 0),
        dcaInvested: latestDcaPurchase?.totalInvested || 0,
        dvaInvested: latestDvaPurchase?.totalInvested || 0
      };
    });
  }, [result, hasDva]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border/20 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{data.dateFormatted}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-3">
              <span className="flex items-center gap-2 text-foreground">
                <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'hsl(var(--chart-2))' }} />
                {tr ? 'Toplu Yatırım:' : 'Lump Sum:'}
              </span>
              <span className="font-medium">{formatCurrency(data.lumpSumValue)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="flex items-center gap-2 text-foreground">
                <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-success" />
                DCA:
              </span>
              <span className="font-medium">{formatCurrency(data.dcaValue)}</span>
            </div>
            {hasDva && (
              <div className="flex justify-between gap-3">
                <span className="flex items-center gap-2 text-foreground">
                  <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'hsl(var(--info))' }} />
                  DVA:
                </span>
                <span className="font-medium">{formatCurrency(data.dvaValue)}</span>
              </div>
            )}
            <div className="border-t border-border/20 pt-1 mt-2">
              <div className="flex justify-between gap-3 text-sm text-muted-foreground">
                <span>{tr ? 'Toplam Yatırılan:' : 'LS Invested:'}</span>
                <span>{formatCurrency(data.lumpSumInvested)}</span>
              </div>
              <div className="flex justify-between gap-3 text-sm text-muted-foreground">
                <span>{tr ? 'DCA Yatırılan:' : 'DCA Invested:'}</span>
                <span>{formatCurrency(data.dcaInvested)}</span>
              </div>
              {hasDva && (
                <div className="flex justify-between gap-3 text-sm text-muted-foreground">
                  <span>{tr ? 'DVA Yatırılan:' : 'DVA Invested:'}</span>
                  <span>{formatCurrency(data.dvaInvested)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-morphism-card border-border/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              {tr ? 'Portföy Değeri Karşılaştırması' : 'Portfolio Value Comparison'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {tr ? `${hasDva ? 'üç' : 'iki'} stratejinin zaman içindeki performansını izleyin` : `Track how ${hasDva ? 'all three' : 'both'} strategies performed over time`}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[280px] sm:h-96 w-full min-h-[260px] sm:min-h-[360px]">
          <PerformantResponsiveContainer width="100%" height="100%" minHeight={360}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} className="opacity-30" />
              <XAxis 
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), 'MMM yy')}
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={chartLegendStyle} />
              <Line
                type="monotone"
                dataKey="lumpSumValue"
                stroke="hsl(var(--chart-2))"
                strokeWidth={1.5}
                dot={false}
                name="Lump Sum"
                activeDot={{ r: 6, fill: "hsl(var(--chart-2))" }}
              />
              <Line
                type="monotone"
                dataKey="dcaValue"
                stroke="hsl(var(--success))"
                strokeWidth={1.5}
                dot={false}
                name="DCA"
                activeDot={{ r: 6, fill: "hsl(var(--success))" }}
              />
              {hasDva && (
                <Line
                  type="monotone"
                  dataKey="dvaValue"
                  stroke="hsl(var(--info))"
                  strokeWidth={1.5}
                  dot={false}
                  name="DVA"
                  activeDot={{ r: 6, fill: "hsl(var(--info))" }}
                />
              )}
            </LineChart>
          </PerformantResponsiveContainer>
        </div>
        
        {/* Chart Legend */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]"></div>
            <span className="text-muted-foreground">{tr ? 'Toplu Yatırım Portföyü' : 'Lump Sum Portfolio'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-muted-foreground">{tr ? 'DCA Portföyü' : 'DCA Portfolio'}</span>
          </div>
          {hasDva && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--info))]"></div>
              <span className="text-muted-foreground">{tr ? 'DVA Portföyü' : 'DVA Portfolio'}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
