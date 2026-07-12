import { TrendingUp, Hourglass, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StrategyResult } from '@/services/hodlStrategyCalculator';
import { useNumberCounter } from '@/hooks/useNumberCounter';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultHero, EmptyState, ResultsGrid, ResultCard } from '@/components/calculator';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface HODLResultsPanelProps {
  results: StrategyResult[] | null;
  bestStrategy: StrategyResult | null;
  currency: string;
}

export const HODLResultsPanel = ({ results, bestStrategy, currency }: HODLResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';
  const disp = (value: number) => formatCurrencyForDisplay(value, currency, { locale });

  const bestROI = useNumberCounter({
    end: bestStrategy?.roiPercentage || 0,
    duration: 1200,
    isActive: !!bestStrategy,
    decimals: 1,
  });

  if (!results || results.length === 0) {
    return (
      <ResultPanel
        aria-live="polite"
        aria-atomic="true"
        aria-label={tr ? 'Hesaplama sonucu' : 'Calculator result'}
      >
        <EmptyState
          icon={<Hourglass />}
          title={tr ? 'Karşılaştırmaya Hazır' : 'Ready to Compare'}
          description={tr ? 'Parametrelerinizi ve en az 2 stratejiyi seçerek geçmiş performansı analiz edin' : 'Select your parameters and at least 2 strategies to analyze historical performance'}
        />
      </ResultPanel>
    );
  }

  return (
    <div className="space-y-4">
      {bestStrategy && (() => {
        const fv = disp(bestStrategy.finalValue);
        return (
          <ResultPanel
            accentBar="positive"
            icon={<TrendingUp />}
            eyebrow={tr ? 'En İyi Performans Gösteren Strateji' : 'Best Performing Strategy'}
            title={bestStrategy.name}
          >
            <ResultHero
              label="ROI"
              value={<span className="text-success">+{bestROI}%</span>}
              sub={<span title={fv.full}>{tr ? 'Nihai Değer' : 'Final Value'}: {fv.display}</span>}
            />
          </ResultPanel>
        );
      })()}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {results.map((strategy) => {
          const roi = strategy.roiPercentage;
          const isPositive = roi >= 0;
          const fv = disp(strategy.finalValue);
          return (
            <ResultPanel
              key={strategy.type}
              title={strategy.name}
              description={`${strategy.numberOfPurchases} ${tr ? 'alım' : strategy.numberOfPurchases === 1 ? 'purchase' : 'purchases'}`}
              action={isPositive ? <ArrowUpRight className="h-5 w-5 text-success" /> : <ArrowDownRight className="h-5 w-5 text-destructive" />}
              accentBar={isPositive ? 'positive' : 'negative'}
            >
              <ResultCard
                label={tr ? 'Nihai Değer' : 'Final Value'}
                value={fv.display}
                fullValue={fv.full}
                tone={isPositive ? 'positive' : 'negative'}
                size="lg"
              />
              <ResultsGrid cols={2}>
                <ResultCard
                  label="ROI"
                  value={`${isPositive ? '+' : ''}${roi.toFixed(1)}%`}
                  tone={isPositive ? 'positive' : 'negative'}
                  size="sm"
                />
                <ResultCard
                  label={tr ? 'Alınan BTC' : 'BTC Acquired'}
                  value={strategy.btcAcquired.toFixed(4)}
                  sub="BTC"
                  size="sm"
                />
              </ResultsGrid>
            </ResultPanel>
          );
        })}
      </div>

      <ResultPanel title={tr ? 'Önemli İçgörüler' : 'Key Insights'}>
        <ResultsGrid cols={2}>
          <ResultCard
            label={tr ? 'Ortalama Alış Fiyatı' : 'Average Buy Price'}
            value={disp(results[0]?.averageBuyPrice || 0).display}
            fullValue={disp(results[0]?.averageBuyPrice || 0).full}
          />
          <ResultCard
            label={tr ? 'Maksimum Düşüş' : 'Max Drawdown'}
            value={`-${results[0]?.maxDrawdown.toFixed(1)}%`}
            tone="negative"
          />
        </ResultsGrid>
      </ResultPanel>
    </div>
  );
};
