import { TrendingUp, Hourglass, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StrategyResult } from '@/services/hodlStrategyCalculator';
import { useNumberCounter } from '@/hooks/useNumberCounter';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultHero, EmptyState, ResultRow } from '@/components/calculator';
import { formatCurrencyAmount, formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface HODLResultsPanelProps {
  results: StrategyResult[] | null;
  bestStrategy: StrategyResult | null;
  currency: string;
}

export const HODLResultsPanel = ({ results, bestStrategy, currency }: HODLResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';
  const formatCurrency = (value: number) => formatCurrencyAmount(value, currency, { locale });
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
      aria-label="Calculator result">
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
        <ResultPanel accentBar="positive" icon={<TrendingUp />} eyebrow={tr ? 'En İyi Performans Gösteren Strateji' : 'Best Performing Strategy'} title={bestStrategy.name}>
          <ResultHero
            label="ROI"
            value={<span className="text-success">+{bestROI}%</span>}
            sub={<span title={fv.full}>{tr ? 'Nihai Değer' : 'Final Value'}: {fv.display}</span>}
          />
        </ResultPanel>
        );
      })()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((strategy) => {
          const roi = strategy.roiPercentage;
          const isPositive = roi >= 0;
          return (
            <ResultPanel
              key={strategy.type}
              title={strategy.name}
              description={`${strategy.numberOfPurchases} ${tr ? 'alım' : strategy.numberOfPurchases === 1 ? 'purchase' : 'purchases'}`}
              action={isPositive ? <ArrowUpRight className="w-5 h-5 text-success" /> : <ArrowDownRight className="w-5 h-5 text-destructive" />}
            >
              <div>
                <p className="calc-text-label">{tr ? 'Nihai Değer' : 'Final Value'}</p>
                <p className="calc-text-mono mt-1 text-xl font-bold text-foreground [overflow-wrap:anywhere]" title={disp(strategy.finalValue).full}>{disp(strategy.finalValue).display}</p>
              </div>
              <div>
                <ResultRow label="ROI" value={`${isPositive ? '+' : ''}${roi.toFixed(1)}%`} tone={isPositive ? 'positive' : 'negative'} divider />
                <ResultRow label={tr ? 'Alınan BTC' : 'BTC Acquired'} value={strategy.btcAcquired.toFixed(4)} divider />
              </div>
            </ResultPanel>
          );
        })}
      </div>

      <ResultPanel title={tr ? 'Önemli İçgörüler' : 'Key Insights'}>
        <div className="grid grid-cols-2 gap-3">
          <div className="calc-surface-subtle p-3 min-w-0">
            <p className="calc-text-label">{tr ? 'Ortalama Alış Fiyatı' : 'Average Buy Price'}</p>
            <p className="calc-text-mono mt-1 text-sm font-semibold text-foreground [overflow-wrap:anywhere]" title={disp(results[0]?.averageBuyPrice || 0).full}>{disp(results[0]?.averageBuyPrice || 0).display}</p>
          </div>
          <div className="calc-surface-subtle p-3">
            <p className="calc-text-label">{tr ? 'Maksimum Düşüş' : 'Max Drawdown'}</p>
            <p className="calc-text-mono mt-1 text-sm font-semibold text-destructive">-{results[0]?.maxDrawdown.toFixed(1)}%</p>
          </div>
        </div>
      </ResultPanel>
    </div>
  );
};
