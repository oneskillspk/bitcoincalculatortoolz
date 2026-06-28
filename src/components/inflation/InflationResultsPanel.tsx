import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { Lock, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { BitcoinSupplyData } from "@/services/bitcoinSupplyService";
import { FiatMoneySupplyData } from "@/services/fiatMoneySupplyService";
import { useNumberCounter } from "@/hooks/useNumberCounter";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResultPanel, ResultRow } from "@/components/calculator";
import { formatCurrencyAmount } from "@/utils/formatCurrency";

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
      <div className="space-y-4"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Calculator result">
        {[1, 2, 3].map((i) => (
          <ResultPanel key={i}>
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-8 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </ResultPanel>
        ))}
      </div>
    );
  }

  if (!bitcoinData || !fiatData) {
    return (
      <ResultPanel>
        <p className="text-center text-muted-foreground">{tr ? 'Veriler yükleniyor...' : 'Loading data...'}</p>
      </ResultPanel>
    );
  }

  const compactLocale = tr ? 'tr-TR' : 'en-US';
  const trillions = fiatSupply / 1_000_000_000_000;
  const trillionsFormatted = `${formatCurrencyAmount(trillions, fiatData.currency, { locale: compactLocale, decimals: 2 })}T`;

  return (
    <div className="space-y-4">
      <ResultPanel
        icon={<Lock />}
        title={tr ? 'Bitcoin Arzı' : 'Bitcoin Supply'}
        accentBar="primary"
      >
        <div>
          <p className="calc-text-display text-primary">{btcSupply.toLocaleString(getCurrentIntlLocale())} BTC</p>
          <p className="calc-text-small mt-1 text-muted-foreground">
            {tr ? `21.000.000 maksimumdan (${bitcoinData.percentageMined.toFixed(2)}%)` : `of 21,000,000 maximum (${bitcoinData.percentageMined.toFixed(2)}%)`}
          </p>
        </div>
        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary transition-all duration-1000"
            style={{ width: `${bitcoinData.percentageMined}%` }} />
        </div>
        <div>
          <ResultRow label={tr ? 'Kalan' : 'Remaining'} value={`${bitcoinData.remainingToMine.toLocaleString(getCurrentIntlLocale())} BTC`} />
          <ResultRow label={tr ? 'Enflasyon Oranı' : 'Inflation Rate'} value={`${bitcoinData.currentInflationRate}% → 0%`} tone="positive" divider />
        </div>
      </ResultPanel>

      <ResultPanel
        icon={<TrendingUp />}
        title={`${fiatData.currency} ${tr ? 'Para Arzı' : 'Money Supply'}`}
        accentBar="negative"
      >
        <div>
          <p className="calc-text-display text-destructive">
            {trillionsFormatted}
          </p>
          <p className="calc-text-small mt-1 text-muted-foreground">
            {tr ? 'M2 Para Arzı (sürekli genişliyor)' : 'M2 Money Supply (constantly expanding)'}
          </p>
        </div>
        <div>
          <ResultRow label={tr ? 'Yıllık Büyüme' : 'Annual Growth'} value={`+${fiatData.annualGrowthRates['2024']}%`} tone="negative" />
          <ResultRow label={tr ? 'Arz Tavanı' : 'Supply Cap'} value={tr ? '∞ Sınırsız' : '∞ Unlimited'} divider />
        </div>
      </ResultPanel>

      <ResultPanel icon={<Calendar />} title={tr ? 'Sonraki Bitcoin Yarılanması' : 'Next Bitcoin Halving'}>
        <div className="flex items-center justify-between">
          <div>
            <p className="calc-text-small text-muted-foreground">{tr ? 'Tahmini Tarih' : 'Estimated Date'}</p>
            <p className="font-semibold text-foreground">
              {new Date(bitcoinData.nextHalving.estimatedDate).toLocaleDateString(tr ? 'tr-TR' : 'en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </div>
        <ResultRow label={tr ? 'Kalan Bloklar' : 'Blocks Remaining'} value={bitcoinData.nextHalving.blocksRemaining.toLocaleString(getCurrentIntlLocale())} />
        <div className="calc-surface-subtle p-3">
          <p className="calc-text-small text-muted-foreground">
            {tr
              ? `Arz enflasyonu %${bitcoinData.currentInflationRate}'dan ~%${(bitcoinData.currentInflationRate / 2).toFixed(2)}'e düşecek`
              : `Supply inflation will drop from ${bitcoinData.currentInflationRate}% to ~${(bitcoinData.currentInflationRate / 2).toFixed(2)}%`}
          </p>
        </div>
      </ResultPanel>
    </div>
  );
};
