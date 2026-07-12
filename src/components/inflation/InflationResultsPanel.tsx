import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { Lock, TrendingUp, Calendar } from 'lucide-react';
import { BitcoinSupplyData } from '@/services/bitcoinSupplyService';
import { FiatMoneySupplyData } from '@/services/fiatMoneySupplyService';
import { useNumberCounter } from '@/hooks/useNumberCounter';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultHero, ResultsGrid, ResultCard, EmptyState } from '@/components/calculator';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface InflationResultsPanelProps {
  bitcoinData: BitcoinSupplyData | null;
  fiatData: FiatMoneySupplyData | null;
  loading: boolean;
}

export const InflationResultsPanel = ({ bitcoinData, fiatData, loading }: InflationResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const btcSupply = useNumberCounter({ end: bitcoinData?.currentSupply || 0, duration: 2000 });
  const fiatSupply = useNumberCounter({ end: fiatData?.currentM2 || 0, duration: 2000 });

  if (loading) {
    return (
      <div
        className="space-y-4"
        aria-live="polite"
        aria-atomic="true"
        aria-busy="true"
        aria-label={tr ? 'Hesaplama sonucu' : 'Calculator result'}
      >
        {[1, 2, 3].map((i) => (
          <ResultPanel key={i}>
            <div className="space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </ResultPanel>
        ))}
      </div>
    );
  }

  if (!bitcoinData || !fiatData) {
    return (
      <ResultPanel
        accentBar="negative"
        aria-live="polite"
        aria-atomic="true"
        aria-label={tr ? 'Hesaplama sonucu' : 'Calculator result'}
      >
        <EmptyState
          icon={<AlertTriangle />}
          title={tr ? 'Veriler kullanılamıyor' : 'Data unavailable'}
          description={tr ? 'Bitcoin veya fiat arz verisi şu anda yüklenemedi. Lütfen daha sonra tekrar deneyin.' : 'Bitcoin or fiat supply data could not be loaded right now. Please try again shortly.'}
        />
      </ResultPanel>
    );
  }

  const compactLocale = tr ? 'tr-TR' : 'en-US';
  const numberLocale = getCurrentIntlLocale();
  const compactNum = (n: number) =>
    new Intl.NumberFormat(compactLocale, { notation: 'compact', maximumFractionDigits: 2 }).format(n);
  const fullNum = (n: number) => n.toLocaleString(numberLocale);
  const pct = (n: number, digits = 2) =>
    new Intl.NumberFormat(compactLocale, { minimumFractionDigits: 0, maximumFractionDigits: digits }).format(n);
  const fiatDisp = formatCurrencyForDisplay(fiatSupply, fiatData.currency, { locale: compactLocale });
  const latestGrowthYear = Object.keys(fiatData.annualGrowthRates)
    .filter((y) => Number.isFinite(Number(y)))
    .sort()
    .pop();
  const latestGrowthRate = latestGrowthYear ? fiatData.annualGrowthRates[latestGrowthYear] : undefined;
  const halvingDate = new Date(bitcoinData.nextHalving.estimatedDate).toLocaleDateString(tr ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-4">
      <ResultPanel
        icon={<Lock />}
        title={tr ? 'Bitcoin Arzı' : 'Bitcoin Supply'}
        accentBar="primary"
      >
        <ResultHero
          label={tr ? 'Dolaşımdaki Arz' : 'Circulating Supply'}
          value={<span className="text-primary">{compactNum(btcSupply)} BTC</span>}
          fullValue={`${fullNum(btcSupply)} BTC`}
          sub={tr ? `21.000.000 maksimumdan (${pct(bitcoinData.percentageMined, 2)}%)` : `of 21,000,000 maximum (${pct(bitcoinData.percentageMined, 2)}%)`}
        />
        <div
          className="h-2 overflow-hidden rounded-full bg-muted/50"
          role="progressbar"
          aria-label={tr ? 'Madenlenen Bitcoin yüzdesi' : 'Bitcoin mined percentage'}
          aria-valuenow={Math.round(bitcoinData.percentageMined)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${pct(bitcoinData.percentageMined)}%`}
        >
          <div
            className="h-full bg-gradient-to-r from-primary to-primary transition-all duration-1000"
            style={{ width: `${bitcoinData.percentageMined}%` }}
          />
        </div>
        <ResultsGrid cols={2}>
          <ResultCard
            label={tr ? 'Kalan' : 'Remaining'}
            value={`${compactNum(bitcoinData.remainingToMine)} BTC`}
            fullValue={`${fullNum(bitcoinData.remainingToMine)} BTC`}
          />
          <ResultCard
            label={tr ? 'Enflasyon Oranı' : 'Inflation Rate'}
            value={`${pct(bitcoinData.currentInflationRate)}% → 0%`}
            tone="positive"
          />
        </ResultsGrid>
      </ResultPanel>

      <ResultPanel
        icon={<TrendingUp />}
        title={`${fiatData.currency} ${tr ? 'Para Arzı' : 'Money Supply'}`}
        accentBar="negative"
      >
        <ResultHero
          label={tr ? 'M2 Para Arzı' : 'M2 Money Supply'}
          value={<span className="text-destructive">{fiatDisp.display}</span>}
          fullValue={fiatDisp.full}
          sub={tr ? 'sürekli genişliyor' : 'constantly expanding'}
        />
        <ResultsGrid cols={2}>
          <ResultCard
            label={tr ? 'Yıllık Büyüme' : 'Annual Growth'}
            value={latestGrowthRate !== undefined ? `+${pct(latestGrowthRate)}%` : '—'}
            sub={latestGrowthYear}
            tone="negative"
          />
          <ResultCard
            label={tr ? 'Arz Tavanı' : 'Supply Cap'}
            value={tr ? '∞ Sınırsız' : '∞ Unlimited'}
            tone="negative"
          />
        </ResultsGrid>
      </ResultPanel>

      <ResultPanel icon={<Calendar />} title={tr ? 'Sonraki Bitcoin Yarılanması' : 'Next Bitcoin Halving'} accentBar="primary">
        <ResultsGrid cols={3}>
          <ResultCard
            label={tr ? 'Tahmini Tarih' : 'Estimated Date'}
            value={halvingDate}
            tone="primary"
          />
          <ResultCard
            label={tr ? 'Kalan Bloklar' : 'Blocks Remaining'}
            value={compactNum(bitcoinData.nextHalving.blocksRemaining)}
            fullValue={fullNum(bitcoinData.nextHalving.blocksRemaining)}
          />
          <ResultCard
            label={tr ? 'Yeni Enflasyon Oranı' : 'New Inflation Rate'}
            value={`~${pct(bitcoinData.currentInflationRate / 2)}%`}
            sub={tr ? `%${pct(bitcoinData.currentInflationRate)}'dan` : `from ${pct(bitcoinData.currentInflationRate)}%`}
            tone="positive"
          />
        </ResultsGrid>
      </ResultPanel>
    </div>
  );
};
