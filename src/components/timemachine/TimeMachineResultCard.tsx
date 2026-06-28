import { TrendingUp, Coins, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { useNumberCounter } from '@/hooks/useNumberCounter';
import type { TimeMachineResult } from '@/services/timeMachineService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoney, formatMoneyCompact } from '@/utils/formatMoney';
import { ResultPanel, ResultHero, ResultsGrid, ResultCard, ResultBadge } from '@/components/calculator';

interface Props {
  result: TimeMachineResult;
  dateLabel: string;
}

export const TimeMachineResultCard = ({ result, dateLabel }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const isPositive = result.roi >= 0;

  const cur = (n: number) => formatMoney(n, { tr, fxRate, decimals: 0 });
  const cur2 = (n: number) => formatMoney(n, { tr, fxRate, decimals: 2 });

  const animatedValue = useNumberCounter({ end: result.currentValue, duration: 1200, decimals: 0 });
  const animatedRoi = useNumberCounter({ end: result.roi, duration: 1200, decimals: 1 });
  const animatedBtc = useNumberCounter({ end: result.btcAmount, duration: 1200, decimals: 4 });
  const animatedProfit = useNumberCounter({ end: Math.abs(result.profit), duration: 1200, decimals: 0 });

  const bigLabel = (v: number) => formatMoneyCompact(v, { tr, fxRate });

  const roiLabel = (roi: number) => {
    if (roi >= 100_000) return tr ? 'Nesiller arası servet bölgesi' : 'Generational wealth territory';
    if (roi >= 10_000) return tr ? 'Hayat değiştiren getiri' : 'Life-changing return';
    return tr ? 'Muazzam getiri' : 'Massive return';
  };

  return (
    <ResultPanel
      eyebrow={tr ? `${cur(result.investment)} yatırsaydınız` : `If you invested ${cur(result.investment)}`}
      title={dateLabel}
      description={tr ? `BTC ${cur2(result.priceOnDate)} iken` : `When BTC was ${cur2(result.priceOnDate)}`}
      accentBar={isPositive ? 'positive' : 'negative'}
      aria-live="polite"
      aria-atomic="true"
      aria-label="Calculator result">
      <ResultsGrid cols={2}>
        <ResultCard
          icon={<Coins />}
          label={tr ? 'Satın Alınan BTC' : 'BTC Purchased'}
          value={animatedBtc.toFixed(4)}
          tone="primary"
        />
        <ResultCard
          icon={<DollarSign />}
          label={tr ? 'Bugünkü BTC Fiyatı' : 'BTC Price Today'}
          value={bigLabel(result.currentPrice)}
          fullValue={cur2(result.currentPrice)}
          tone="primary"
        />
      </ResultsGrid>

      <ResultHero
        label={tr ? 'Yatırımınızın bugünkü değeri' : 'Your investment would be worth'}
        value={bigLabel(animatedValue)}
        fullValue={cur(result.currentValue)}
        sub={
          <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <ResultBadge tone={isPositive ? 'positive' : 'negative'} icon={isPositive ? <ArrowUp /> : <ArrowDown />}>
              {isPositive ? '+' : ''}
              {animatedRoi.toFixed(1)}% ROI
            </ResultBadge>
            <span className="calc-text-mono calc-text-small text-muted-foreground" title={cur(Math.abs(result.profit))}>
              ({isPositive ? '+' : '−'}{bigLabel(animatedProfit)})
            </span>
          </span>
        }
        badge={isPositive && result.roi > 1000 ? (
          <ResultBadge tone="primary" icon={<TrendingUp />}>{roiLabel(result.roi)}</ResultBadge>
        ) : undefined}
      />
    </ResultPanel>
  );
};
