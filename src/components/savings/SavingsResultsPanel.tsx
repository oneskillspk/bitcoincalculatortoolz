import { TrendingUp, TrendingDown, Coins, DollarSign, Target, BarChart3, PiggyBank, Percent } from 'lucide-react';
import { SavingsResult } from '@/services/bitcoinSavingsCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultsGrid, ResultCard } from '@/components/calculator';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface SavingsResultsPanelProps {
  results: SavingsResult;
}

export const SavingsResultsPanel = ({ results }: SavingsResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const isPositive = results.projectedGainLoss >= 0;
  const disp = (v: number, signed = false) =>
    formatCurrencyForDisplay(v, 'USD', { locale: tr ? 'tr-TR' : 'en-US', signed });
  const fiat = disp(results.totalFiatInvested);
  const portfolio = disp(results.projectedPortfolioValue);
  const gainLoss = disp(results.projectedGainLoss, true);

  return (
    <ResultPanel
      icon={<PiggyBank />}
      title={tr ? 'Tasarruf Planınız' : 'Your Savings Plan'}
      description={
        <>
          {tr ? 'Güncel fiyatta' : 'At current price'}:{' '}
          <span className="font-semibold text-foreground">
            1 USD = {Math.round(results.satsPerDollar).toLocaleString()} sats
          </span>
        </>
      }
      accentBar="primary"
    >
      <ResultsGrid cols={2}>
        <ResultCard
          icon={<Coins />}
          label={tr ? 'Maaş Başına Satoshi' : 'Sats Per Paycheck'}
          value={results.satsPerPaycheck.toLocaleString()}
          sub="sats"
          tone="primary"
        />
        <ResultCard
          icon={<Target />}
          label={tr ? 'Maaş Başına BTC' : 'BTC Per Paycheck'}
          value={results.btcPerPaycheck.toFixed(8)}
          sub="BTC"
        />
        <ResultCard
          icon={<Coins />}
          label={tr ? 'Toplam Biriktirilen Satoshi' : 'Total Sats Accumulated'}
          value={results.totalSatsAccumulated.toLocaleString()}
          sub="sats"
          tone="primary"
        />
        <ResultCard
          icon={<Target />}
          label={tr ? 'Toplam Biriktirilen BTC' : 'Total BTC Accumulated'}
          value={results.totalBtcAccumulated.toFixed(8)}
          sub="BTC"
        />
        <ResultCard
          icon={<DollarSign />}
          label={tr ? 'Toplam Yatırılan Fiat' : 'Total Fiat Invested'}
          value={fiat.display}
          fullValue={fiat.full}
        />
        <ResultCard
          icon={<BarChart3 />}
          label={tr ? 'Tahmini Portföy Değeri' : 'Projected Portfolio Value'}
          value={portfolio.display}
          fullValue={portfolio.full}
          tone="primary"
        />
        <ResultCard
          icon={isPositive ? <TrendingUp /> : <TrendingDown />}
          label={tr ? 'Tahmini Kazanç/Kayıp' : 'Projected Gain/Loss'}
          value={gainLoss.display}
          fullValue={gainLoss.full}
          tone={isPositive ? 'positive' : 'negative'}
        />
        <ResultCard
          icon={<Percent />}
          label={tr ? 'Tahmini YG' : 'Projected ROI'}
          value={`${isPositive ? '+' : ''}${results.projectedROI.toFixed(1)}%`}
          tone={isPositive ? 'positive' : 'negative'}
        />
      </ResultsGrid>
    </ResultPanel>
  );
};
