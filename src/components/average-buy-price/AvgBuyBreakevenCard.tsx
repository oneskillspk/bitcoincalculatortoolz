import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import { AvgBuyResult } from '@/services/averageBuyPriceCalculator';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoney } from '@/utils/formatMoney';

interface Props {
  result: AvgBuyResult | null;
  liveBtcPrice: number;
}

export const AvgBuyBreakevenCard = ({ result, liveBtcPrice }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();

  if (!result) return null;

  const { breakEvenPrice, breakEvenDistancePercent, isAboveBreakEven } = result;
  const distAbs = Math.abs(breakEvenDistancePercent);

  return (
    <Card className={cn(
      'border-2',
      isAboveBreakEven ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          {tr ? 'Başabaş Analizi' : 'Break-Even Analysis'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{tr ? 'Başabaş Fiyatınız' : 'Your Break-Even Price'}</p>
            <p className="text-2xl font-bold font-mono text-foreground">
              {formatMoney(breakEvenPrice, { tr, fxRate, decimals: 0 })}
            </p>
          </div>
          <div className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold',
            isAboveBreakEven ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          )}>
            {isAboveBreakEven ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {distAbs.toFixed(1)}% {isAboveBreakEven ? (tr ? 'üstünde' : 'above') : (tr ? 'altında' : 'below')}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{tr ? 'Başabaş' : 'Break-Even'}</span>
            <span>{tr ? 'Canlı Fiyat' : 'Live Price'}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                isAboveBreakEven ? 'bg-success' : 'bg-destructive'
              )}
              style={{ width: `${Math.min(100, isAboveBreakEven ? 50 + distAbs * 0.5 : 50 - distAbs * 0.5)}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {isAboveBreakEven
            ? (tr
                ? `BTC, ortalama alış fiyatınızın %${distAbs.toFixed(1)} üzerinde işlem görüyor. Kârdасınız.`
                : `BTC is trading ${distAbs.toFixed(1)}% above your average buy price. You're in profit.`)
            : (tr
                ? `BTC'nin ortalama alış fiyatınıza ulaşması için %${distAbs.toFixed(1)} yükselmesi gerekiyor.`
                : `BTC needs to rise ${distAbs.toFixed(1)}% to reach your average buy price.`)}
        </p>
      </CardContent>
    </Card>
  );
};
