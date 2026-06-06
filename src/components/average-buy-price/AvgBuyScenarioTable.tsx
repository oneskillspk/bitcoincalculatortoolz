import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { AvgBuyResult } from '@/services/averageBuyPriceCalculator';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoneyCompact, formatMoney } from '@/utils/formatMoney';

interface Props {
  result: AvgBuyResult | null;
}

const TARGETS = [100_000, 150_000, 200_000, 500_000, 1_000_000];

export const AvgBuyScenarioTable = ({ result }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const fmtPrice = (n: number) => formatMoneyCompact(n, { tr, fxRate });
  const fmtFull = (n: number) => formatMoney(n, { tr, fxRate, decimals: 0 });

  if (!result) return null;

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {tr ? 'Yığınınızın Değeri…' : 'What Your Stack Is Worth At…'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {TARGETS.map(target => {
            const value = result.totalBtc * target;
            const pl = value - result.totalSpent;
            return (
              <div key={target} className="text-center p-2 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground font-medium">{fmtPrice(target)}</p>
                <p className="text-sm font-bold font-mono text-foreground mt-1">
                  {value >= 1_000_000 ? fmtPrice(value) : fmtFull(value)}
                </p>
                <p className={cn('text-xs font-medium mt-0.5', pl >= 0 ? 'text-success' : 'text-destructive')}>
                  {pl >= 0 ? '+' : ''}{pl >= 1_000_000 ? fmtPrice(pl) : fmtFull(pl)}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
