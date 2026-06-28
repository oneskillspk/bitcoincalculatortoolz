import React from 'react';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, Percent, Layers } from 'lucide-react';
import type { ForwardResult, ReverseResult } from '@/services/priceTargetCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoney, formatMoneyCompact } from '@/utils/formatMoney';
import { ResultsGrid, ResultCard } from '@/components/calculator';

const fmt = (v: number, dec = 2) => v.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });

interface ForwardProps { mode: 'forward'; result: ForwardResult }
interface ReverseProps { mode: 'reverse'; result: ReverseResult; liveBtcPrice: number }

type Props = ForwardProps | ReverseProps;

export const PriceTargetResultCards: React.FC<Props> = (props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const money = (v: number, dec = 0) => formatMoney(v, { tr, fxRate, decimals: dec });
  const moneyCard = (v: number) =>
    Math.abs(tr ? v * fxRate : v) >= 100_000
      ? formatMoneyCompact(v, { tr, fxRate })
      : formatMoney(v, { tr, fxRate, decimals: 0 });

  if (props.mode === 'forward') {
    const { portfolioValue, gainFromToday, gainPercent, multiplier } = props.result;
    const gainTone = gainFromToday >= 0 ? 'positive' : 'negative';
    return (
      <ResultsGrid cols={2}
      aria-live="polite"
      aria-atomic="true"
      aria-label="Calculator result">
        <ResultCard icon={<DollarSign />} label={tr ? 'Portföy Değeri' : 'Portfolio Value'} value={moneyCard(portfolioValue)} fullValue={money(portfolioValue)} tone="primary" />
        <ResultCard icon={<TrendingUp />} label={tr ? 'Bugünden Kazanç' : 'Gain from Today'} value={moneyCard(gainFromToday)} fullValue={money(gainFromToday)} tone={gainTone} />
        <ResultCard icon={<Percent />} label={tr ? 'Kazanç %' : 'Gain %'} value={`${gainPercent >= 0 ? '+' : ''}${fmt(gainPercent)}%`} tone={gainTone} />
        <ResultCard icon={<Layers />} label={tr ? 'Para Çarpanı' : 'Money Multiplier'} value={`${fmt(multiplier, 1)}x`} tone="primary" />
      </ResultsGrid>
    );
  }

  const { btcNeeded, costToday, progressPercent } = props.result;
  return (
    <div className="space-y-3">
      <ResultsGrid cols={2}>
        <ResultCard icon={<DollarSign />} label={tr ? 'Gerekli BTC' : 'BTC Needed'} value={fmt(btcNeeded, 4)} tone="primary" />
        <ResultCard icon={<TrendingUp />} label={tr ? 'Bugün Alım Maliyeti' : 'Cost to Buy Today'} value={moneyCard(costToday)} fullValue={money(costToday)} tone="primary" />
      </ResultsGrid>
      <div className="calc-surface-subtle p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="calc-text-small font-medium text-foreground">{tr ? 'İlerlemeniz' : 'Your Progress'}</p>
          <p className="calc-text-mono text-sm font-bold text-primary">{fmt(progressPercent, 1)}%</p>
        </div>
        <Progress value={progressPercent} className="h-3" />
        <p className="calc-text-small mt-2 text-muted-foreground">
          {progressPercent >= 100
            ? (tr ? 'Hedefinize çoktan ulaştınız.' : "You've already reached your goal.")
            : (tr ? `Hedefinizin %${fmt(progressPercent, 1)} yolundasınız` : `You are ${fmt(progressPercent, 1)}% of the way there`)}
        </p>
      </div>
    </div>
  );
};
