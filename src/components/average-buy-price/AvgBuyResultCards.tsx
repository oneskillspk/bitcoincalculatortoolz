import { Scale, Bitcoin, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { AvgBuyResult } from '@/services/averageBuyPriceCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoney, formatMoneyCompact } from '@/utils/formatMoney';
import { ResultsGrid, ResultCard } from '@/components/calculator';

interface Props {
  result: AvgBuyResult | null;
}

export const AvgBuyResultCards = ({ result }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();

  const fmt = (n: number) => formatMoney(n, { tr, fxRate, decimals: 2 });
  const fmtCard = (n: number) =>
    Math.abs(tr ? n * fxRate : n) >= 100_000
      ? formatMoneyCompact(n, { tr, fxRate })
      : formatMoney(n, { tr, fxRate, decimals: 2 });
  const positive = result ? result.unrealizedPL >= 0 : true;

  return (
    <ResultsGrid cols={2}>
      <ResultCard
        icon={<Scale />}
        label={tr ? 'Ortalama Alış Fiyatı' : 'Average Buy Price'}
        value={result ? fmtCard(result.weightedAvgPrice) : '—'}
        fullValue={result ? fmt(result.weightedAvgPrice) : undefined}
        tone="primary"
      />
      <ResultCard
        icon={<Bitcoin />}
        label={tr ? 'Toplam Tutulan BTC' : 'Total BTC Held'}
        value={result ? `₿ ${result.totalBtc.toFixed(8)}` : '—'}
      />
      <ResultCard
        icon={<Wallet />}
        label={tr ? 'Güncel Portföy Değeri' : 'Current Portfolio Value'}
        value={result ? fmtCard(result.currentValue) : '—'}
        fullValue={result ? fmt(result.currentValue) : undefined}
      />
      <ResultCard
        icon={positive ? <TrendingUp /> : <TrendingDown />}
        label={tr ? 'Gerçekleşmemiş K/Z' : 'Unrealized P/L'}
        value={result ? `${positive ? '+' : ''}${fmtCard(result.unrealizedPL)}` : '—'}
        fullValue={result ? `${positive ? '+' : ''}${fmt(result.unrealizedPL)}` : undefined}
        sub={result ? `${result.roiPercent >= 0 ? '+' : ''}${result.roiPercent.toFixed(2)}% ROI` : undefined}
        tone={result ? (positive ? 'positive' : 'negative') : 'muted'}
      />
    </ResultsGrid>
  );
};
