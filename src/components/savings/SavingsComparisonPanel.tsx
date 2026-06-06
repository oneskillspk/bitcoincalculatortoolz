import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { Scale } from 'lucide-react';
import { SavingsResult } from '@/services/bitcoinSavingsCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { chartTooltipStyle } from '@/components/calculator/chartTokens';

interface SavingsComparisonPanelProps {
  results: SavingsResult;
  timeHorizonMonths: number;
  annualGrowthRate: number;
}

export const SavingsComparisonPanel = ({ results, timeHorizonMonths, annualGrowthRate }: SavingsComparisonPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const btcGrowth = results.projectedPortfolioValue - results.totalFiatInvested;
  const savingsGrowth = results.savingsAccountInterest;

  const chartData = [
    {
      name: tr ? 'Tasarruf Hesabı' : 'Savings Account',
      value: Math.round(results.savingsAccountFinalValue),
      growth: Math.round(savingsGrowth),
      color: 'hsl(var(--muted-foreground))',
    },
    {
      name: `Bitcoin (${annualGrowthRate}%)`,
      value: Math.round(results.projectedPortfolioValue),
      growth: Math.round(btcGrowth),
      color: 'hsl(var(--primary))',
    },
  ];

  return (
    <Card className="border border-border/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Scale className="w-5 h-5 text-primary" />
          {tr ? 'Bitcoin vs Tasarruf Hesabı' : 'Bitcoin vs Savings Account'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-border/30 rounded-xl p-4 space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">
              {tr ? 'Geleneksel Tasarruf' : 'Traditional Savings'}
            </h4>
            <p className="text-xs text-muted-foreground">
              {tr ? 'Toplam Yatırılan:' : 'Total Deposited:'} ${results.totalFiatInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-muted-foreground">
              {tr ? 'Kazanılan Faiz:' : 'Interest Earned:'}
              {' '}<span className="text-success font-medium">+${savingsGrowth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </p>
            <p className="text-lg font-bold text-foreground">
              ${results.savingsAccountFinalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="border border-primary/20 bg-primary/5 rounded-xl p-4 space-y-2">
            <h4 className="text-sm font-semibold text-primary">
              {tr ? 'Bitcoin Tasarrufu' : 'Bitcoin Savings'}
            </h4>
            <p className="text-xs text-muted-foreground">
              {tr ? 'Toplam Yatırılan:' : 'Total Invested:'} ${results.totalFiatInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-muted-foreground">
              {tr ? 'Büyüme:' : 'Growth:'}
              {' '}<span className={btcGrowth >= 0 ? 'text-success font-medium' : 'text-destructive font-medium'}>
                {btcGrowth >= 0 ? '+' : ''}${btcGrowth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </p>
            <p className="text-lg font-bold text-foreground">
              ${results.projectedPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[300px] h-[200px] min-h-[200px]">
            <PerformantResponsiveContainer width="100%" height="100%" minHeight={200}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, tr ? 'Son Değer' : 'Final Value']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </PerformantResponsiveContainer>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          {tr
            ? '⚠️ Bitcoin oynaklıdır ve FDIC güvencesi kapsamında değildir. Tasarruf hesapları mevduat korumasıyla garantili getiri sunar. Geçmiş performans gelecekteki sonuçları garanti etmez. Bu yalnızca eğitim amaçlıdır.'
            : '⚠️ Bitcoin is volatile and not FDIC insured. Savings accounts offer guaranteed returns with deposit protection. Past performance does not guarantee future results. This is for educational purposes only.'}
        </p>
      </CardContent>
    </Card>
  );
};
