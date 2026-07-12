import { PowerLawResult, DeviationResult, getDaysUntilDate } from '@/services/powerLawCalculator';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Shield, Target } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoney, formatMoneyCompact } from '@/utils/formatMoney';
import { ResultPanel, ResultsGrid, ResultCard } from '@/components/calculator';
import { formatGroupedInt } from '@/utils/numberFormat';
import { cn } from '@/lib/utils';

interface PowerLawResultsPanelProps {
  result: PowerLawResult;
  deviation: DeviationResult;
  targetDate: Date;
  currentPrice: number;
}

export const PowerLawResultsPanel = ({
  result,
  deviation,
  targetDate,
  currentPrice,
}: PowerLawResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const formatUSD = (n: number) => formatMoneyCompact(n, { tr, fxRate });
  const formatUSDFull = (n: number) => formatMoney(n, { tr, fxRate, decimals: 2 });
  const daysUntil = getDaysUntilDate(targetDate);
  const isFuture = daysUntil > 0;

  const deviationTone =
    deviation.label === 'undervalued'
      ? 'positive'
      : deviation.label === 'overvalued'
        ? 'negative'
        : 'primary';

  const deviationStyles = {
    positive: 'border-success/20 bg-success/5 text-success',
    negative: 'border-destructive/20 bg-destructive/5 text-destructive',
    primary: 'border-primary/15 bg-primary/5 text-primary',
  } as const;

  const DeviationIcon =
    deviation.label === 'undervalued' ? TrendingDown : deviation.label === 'overvalued' ? TrendingUp : Target;

  return (
    <ResultPanel
      icon={<TrendingUp />}
      eyebrow={format(targetDate, 'MMM yyyy')}
      title={tr ? 'Güç Yasası Projeksiyonu' : 'Power Law Projection'}
      accentBar="primary"
    
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? "Hesaplama sonucu" : "Calculator result"}>
      <ResultsGrid cols={2}>
        <ResultCard
          icon={<DollarSign />}
          label={tr ? 'Adil Değer' : 'Fair Value'}
          value={formatUSD(result.fairValue)}
          fullValue={formatUSDFull(result.fairValue)}
          tone="primary"
        />
        <ResultCard
          icon={<Shield />}
          label={tr ? 'Destek (Alt)' : 'Support (Lower)'}
          value={formatUSD(result.support)}
          fullValue={formatUSDFull(result.support)}
        />
        <ResultCard
          icon={<Target />}
          label={tr ? 'Direnç (Üst)' : 'Resistance (Upper)'}
          value={formatUSD(result.resistance)}
          fullValue={formatUSDFull(result.resistance)}
        />
        <ResultCard
          icon={<Calendar />}
          label={isFuture ? (tr ? 'Kalan Gün' : 'Days Until') : tr ? 'Geçen Gün' : 'Days Ago'}
          value={formatGroupedInt(isFuture ? daysUntil : Math.abs(daysUntil), tr ? 'tr-TR' : 'en-US')}
        />
      </ResultsGrid>

      <div className={cn('rounded-[var(--calc-radius-card)] border p-4', deviationStyles[deviationTone])}>
        <div className="mb-1 flex items-center gap-2">
          <DeviationIcon className="h-4 w-4" />
          <p className="calc-text-small font-semibold text-foreground">
            {tr ? 'Güncel Piyasa Sapması' : 'Current Market Deviation'}
          </p>
        </div>
        <p className="calc-text-mono text-2xl font-bold">
          {deviation.percentage >= 0 ? '+' : ''}
          {deviation.percentage.toFixed(1)}%
        </p>
        <p className="calc-text-small mt-1 text-muted-foreground">
          {tr
            ? `BTC ${formatUSD(currentPrice)} seviyesinde — modelin ${formatUSD(deviation.fairValue)} adil değerinin ${
                deviation.label === 'undervalued' ? 'altında' : deviation.label === 'overvalued' ? 'üzerinde' : 'yakınında'
              }`
            : `BTC at ${formatUSD(currentPrice)} is ${
                deviation.label === 'undervalued' ? 'below' : deviation.label === 'overvalued' ? 'above' : 'near'
              } the model's fair value of ${formatUSD(deviation.fairValue)}`}
        </p>
      </div>
    </ResultPanel>
  );
};
