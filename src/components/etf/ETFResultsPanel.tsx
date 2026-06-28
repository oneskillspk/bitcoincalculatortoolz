import { ETFCalculationResult } from '@/services/etfData';
import { TrendingUp, DollarSign, Percent, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultsGrid, ResultCard } from '@/components/calculator';
import { formatCurrencyAmount, formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface ETFResultsPanelProps {
  result: ETFCalculationResult;
}

const formatUSD = (n: number) => formatCurrencyAmount(n, 'USD', { decimals: 2 });
const dispUSD = (n: number) => formatCurrencyForDisplay(n, 'USD', { fullDecimals: 2 });

export const ETFResultsPanel = ({ result }: ETFResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const totalReturn = ((result.valueAfterFees - result.investmentAmount) / result.investmentAmount) * 100;
  const positive = totalReturn >= 0;

  return (
    <ResultPanel
      icon={<TrendingUp />}
      eyebrow={`${result.etf.ticker} · ${result.holdingPeriodYears}${tr ? ' Yıl' : 'yr'} ${tr ? 'Elde Tutma' : 'Hold'}`}
      title={tr ? 'ETF Sonuçları' : 'ETF Results'}
      accentBar="primary"
      footer={
        <p className="calc-text-small text-muted-foreground">
          {tr
            ? `BTC'yi doğrudan tutmak (ücret yok) ${formatUSD(result.directBtcValue)} değerinde olurdu — bu, ${result.holdingPeriodYears} yıl boyunca bileşik %${(result.etf.expenseRatio * 100).toFixed(2)} yıllık gider oranı nedeniyle ${result.etf.ticker}'dan ${formatUSD(result.totalFeesPaid)} daha fazladır.`
            : `Holding BTC directly (no fees) would be worth ${formatUSD(result.directBtcValue)} — that's ${formatUSD(result.totalFeesPaid)} more than ${result.etf.ticker} due to the ${(result.etf.expenseRatio * 100).toFixed(2)}% annual expense ratio compounding over ${result.holdingPeriodYears} years.`}
        </p>
      }
    
      aria-live="polite"
      aria-atomic="true"
      aria-label="Calculator result">
      <ResultsGrid cols={3}>
        {(() => { const d = dispUSD(result.investmentAmount); return (
        <ResultCard
          icon={<DollarSign />}
          label={tr ? 'Yatırım' : 'Investment'}
          value={d.display}
          fullValue={d.full}
        />); })()}
        <ResultCard
          icon={<TrendingUp />}
          label={tr ? 'BTC Maruziyeti' : 'BTC Exposure'}
          value={`${result.btcExposure.toFixed(6)} BTC`}
        />
        {(() => { const d = dispUSD(result.valueAfterFees); return (
        <ResultCard
          icon={<DollarSign />}
          label={tr ? 'Ücret Sonrası Değer' : 'Value After Fees'}
          value={d.display}
          fullValue={d.full}
          tone="primary"
        />); })()}
        <ResultCard
          icon={<Percent />}
          label={tr ? 'Toplam Getiri' : 'Total Return'}
          value={`${positive ? '+' : ''}${totalReturn.toFixed(1)}%`}
          tone={positive ? 'positive' : 'negative'}
        />
        {(() => { const d = dispUSD(result.totalFeesPaid); return (
        <ResultCard
          icon={<AlertTriangle />}
          label={tr ? 'Ödenen Toplam Ücret' : 'Total Fees Paid'}
          value={d.display}
          fullValue={d.full}
          tone="negative"
        />); })()}
        <ResultCard
          icon={<Percent />}
          label={tr ? 'Ücret Etkisi' : 'Fee Impact'}
          value={`-${result.feeImpactOnReturns.toFixed(2)}%`}
          tone="negative"
        />
      </ResultsGrid>
    </ResultPanel>
  );
};
