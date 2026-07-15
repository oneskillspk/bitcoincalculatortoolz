import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ComparisonResult } from '@/services/lumpSumDcaComparator';
import { Trophy, DollarSign, Target, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultHero, ResultsGrid, ResultCard, ResultBadge } from '@/components/calculator';
import { cn } from '@/lib/utils';
import { formatCurrencyAmount, formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface ComparisonResultsPanelProps {
  result: ComparisonResult;
  /** ISO 4217 currency code chosen by the user (e.g. USD, PKR, INR). */
  currency?: string;
}

type StatTone = 'default' | 'positive' | 'negative';

interface Stat {
  label: string;
  value: string;
  fullValue?: string;
  tone?: StatTone;
  hero?: boolean;
}

const toneText: Record<StatTone, string> = {
  default: 'text-foreground',
  positive: 'text-success',
  negative: 'text-destructive',
};

const StatStack: React.FC<{ stats: Stat[] }> = ({ stats }) => (
  <dl className="flex flex-col">
    {stats.map((s, i) => (
      <div
        key={s.label}
        className={cn(
          'flex flex-col gap-1',
          i === 0 ? 'pb-3' : 'border-t border-border/30 py-3',
          i === stats.length - 1 && 'pb-0',
        )}
      >
        <dt className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {s.label}
        </dt>
        <dd
          title={s.fullValue ?? undefined}
          className={cn(
            'calc-text-mono tabular-nums leading-tight break-words',
            s.hero ? 'text-xl font-bold sm:text-2xl' : 'text-base font-semibold',
            toneText[s.tone ?? 'default'],
          )}
        >
          {s.value}
        </dd>
      </div>
    ))}
  </dl>
);

export const ComparisonResultsPanel = ({ result, currency = 'USD' }: ComparisonResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';

  const fmt = (amount: number) => formatCurrencyAmount(amount, currency, { locale });
  const fmtFull = (amount: number) => formatCurrencyAmount(amount, currency, { locale, decimals: 2 });
  // Card-safe: compact display + full tooltip value so long currencies
  // (PKR, INR, TRY) never get clipped inside narrow KPI cards.
  const fmtSmart = (amount: number) => {
    const d = formatCurrencyForDisplay(amount, currency, { locale, compactAbove: 100_000 });
    return { value: d.display, fullValue: d.isCompact ? d.full : undefined };
  };
  const fmtSigned = (amount: number) => {
    const smart = fmtSmart(Math.abs(amount));
    const sign = amount > 0 ? '+' : amount < 0 ? '-' : '';
    return { value: `${sign}${smart.value}`, fullValue: smart.fullValue ? `${sign}${smart.fullValue}` : undefined };
  };
  const formatROI = (roi: number) => `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`;


  const winnerData =
    result.winner === 'lump-sum' ? result.lumpSum :
    result.winner === 'dca' ? result.dca :
    result.winner === 'dva' ? result.dva : null;

  const hasDva = !!result.dva;

  const renderStrategy = (
    strategy: typeof result.lumpSum,
    label: string,
    winnerKey: string,
    icon: React.ReactNode,
  ) => {
    const isWinner = result.winner === winnerKey;
    const currentValue = fmtSmart(strategy.currentValue);
    const profit = fmtSigned(strategy.profitLoss);

    const stats: Stat[] = [
      { label: tr ? 'Güncel Değer' : 'Current Value', value: currentValue.value, fullValue: currentValue.fullValue, hero: true },
      { label: tr ? 'Toplam Yatırım' : 'Total Invested', value: fmt(strategy.totalInvested) },
      {
        label: tr ? 'Kâr / Zarar' : 'Profit / Loss',
        value: profit.value,
        fullValue: profit.fullValue,
        tone: strategy.profitLoss >= 0 ? 'positive' : 'negative',
      },
      { label: 'ROI', value: formatROI(strategy.roiPercentage), tone: strategy.roiPercentage >= 0 ? 'positive' : 'negative' },
      { label: 'Bitcoin', value: `₿${strategy.totalBitcoin.toFixed(6)}` },
      {
        label: strategy.strategy === 'lump-sum' ? (tr ? 'Alış Fiyatı' : 'Buy Price') : (tr ? 'Ort. Alış' : 'Avg Buy'),
        value: fmt(strategy.averageBuyPrice),
      },
    ];

    return (
      <ResultPanel
        icon={icon}
        title={
          <span className="flex flex-col gap-1.5">
            <span className="text-base font-bold leading-tight">{label}</span>
            {isWinner && (
              <Badge className="self-start bg-primary/15 text-primary border border-primary/30 text-[10px] uppercase tracking-wider">
                <Trophy className="w-3 h-3 mr-1" />
                {tr ? 'Kazanan' : 'Winner'}
              </Badge>
            )}
          </span>
        }
        accentBar={isWinner ? 'primary' : 'none'}
      
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? "Hesaplama sonucu" : "Calculator result"}>
        <StatStack stats={stats} />
      </ResultPanel>
    );
  };

  return (
    <div className="space-y-5">
      <ResultHero
        label={tr ? 'Kazanan Strateji' : 'Winning Strategy'}
        value={result.winner === 'tie' ? (tr ? 'Beraberlik' : 'Tie') : result.summary.betterStrategy}
        sub={
          result.winner === 'tie'
            ? (tr ? 'Tüm stratejiler eşit performans gösterdi' : 'All strategies performed equally')
            : `${tr ? 'Şu kadar daha iyi performans' : 'Outperformed by'} ${result.summary.winMargin.toFixed(1)}%`
        }
        badge={
          winnerData && (
            <Badge className="bg-primary text-primary-foreground border-transparent px-3 py-1 text-sm font-semibold tabular-nums shadow-sm hover:bg-primary">
              <Trophy className="w-3.5 h-3.5 mr-1.5" />
              {fmt(winnerData.currentValue)} · {formatROI(winnerData.roiPercentage)}
            </Badge>
          )
        }
      />

      <div className={cn('grid grid-cols-1 gap-4', hasDva ? 'lg:grid-cols-3' : 'sm:grid-cols-2')}>
        {renderStrategy(result.lumpSum, tr ? 'Toplu Yatırım' : 'Lump Sum', 'lump-sum', <DollarSign />)}
        {renderStrategy(result.dca, tr ? 'DCA' : 'Dollar Cost Averaging', 'dca', <BarChart3 />)}
        {result.dva && renderStrategy(result.dva, tr ? 'DVA' : 'Dollar Value Averaging', 'dva', <Target />)}
      </div>

      <ResultPanel icon={<Target />} title={tr ? 'Performans Karşılaştırması' : 'Performance Metrics'}>
        {(() => {
          const diffVal = fmtSmart(result.difference.absoluteValue);
          const diffProfit = fmtSmart(result.difference.profitDifference);
          return (
            <ResultsGrid cols={3}>
              <ResultCard
                label={tr ? 'Değer Farkı' : 'Value Difference'}
                value={diffVal.value}
                fullValue={diffVal.fullValue ?? fmtFull(result.difference.absoluteValue)}
              />
              <ResultCard label={tr ? 'Performans Farkı' : 'Performance Gap'} value={`${result.difference.percentageDifference.toFixed(1)}%`} />
              <ResultCard
                label={tr ? 'Kâr Farkı' : 'Profit Difference'}
                value={diffProfit.value}
                fullValue={diffProfit.fullValue ?? fmtFull(result.difference.profitDifference)}
              />
            </ResultsGrid>
          );
        })()}
      </ResultPanel>

      <ResultPanel title={tr ? 'Strateji Analizi' : 'Strategy Analysis'}>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.summary.riskAnalysis.recommendation}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {(['lumpSumRisk', 'dcaRisk', 'dvaRisk'] as const).map((key) => {
            const risk = result.summary.riskAnalysis[key];
            if (!risk) return null;
            const labels: Record<typeof key, string> = {
              lumpSumRisk: tr ? 'Toplu Risk' : 'Lump Sum Risk',
              dcaRisk: tr ? 'DCA Risk' : 'DCA Risk',
              dvaRisk: tr ? 'DVA Risk' : 'DVA Risk',
            };
            const tone =
              risk === 'low' ? 'text-success border-success/30' :
              risk === 'medium' ? 'text-warning border-warning/30' :
              'text-destructive border-destructive/30';
            return (
              <Badge key={key} variant="outline" className={cn('font-medium capitalize', tone)}>
                {labels[key]}: {risk}
              </Badge>
            );
          })}
        </div>
      </ResultPanel>
    </div>
  );
};
