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
  const pct = (n: number, digits = 1) =>
    new Intl.NumberFormat(locale, { minimumFractionDigits: 0, maximumFractionDigits: digits }).format(n);
  const intFmt = new Intl.NumberFormat(locale);

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
    <div
      className="space-y-4"
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? 'Hesaplama sonucu' : 'Calculator result'}
    >
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
              label={tr ? 'Getiri' : 'ROI'}
              value={<span className="text-success">+{bestROI}%</span>}
              sub={<span title={fv.full}>{tr ? 'Nihai Değer' : 'Final Value'}: {fv.display}</span>}
            />
          </ResultPanel>
        );
      })()}

      <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
        {results.map((strategy) => {
          const roi = strategy.roiPercentage;
          const isPositive = roi >= 0;
          const fv = disp(strategy.finalValue);
          return (
            <li key={strategy.type}>
              <ResultPanel
                title={strategy.name}
                description={tr ? `${intFmt.format(strategy.numberOfPurchases)} alım` : `${intFmt.format(strategy.numberOfPurchases)} ${strategy.numberOfPurchases === 1 ? 'purchase' : 'purchases'}`}
                action={isPositive ? <ArrowUpRight className="h-5 w-5 text-success" aria-label={tr ? 'Kâr' : 'Gain'} /> : <ArrowDownRight className="h-5 w-5 text-destructive" aria-label={tr ? 'Zarar' : 'Loss'} />}
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
                    label={tr ? 'Getiri' : 'ROI'}
                    value={`${isPositive ? '+' : ''}${pct(roi)}%`}
                    tone={isPositive ? 'positive' : 'negative'}
                    size="sm"
                  />
                  <ResultCard
                    label={tr ? 'Alınan BTC' : 'BTC Acquired'}
                    value={strategy.btcAcquired.toLocaleString(locale, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                    fullValue={`${strategy.btcAcquired.toLocaleString(locale, { minimumFractionDigits: 8, maximumFractionDigits: 8 })} BTC`}
                    sub="BTC"
                    size="sm"
                  />
                </ResultsGrid>
              </ResultPanel>
            </li>
          );
        })}
      </ul>

      <ResultPanel title={tr ? 'Önemli İçgörüler' : 'Key Insights'}>
        <ResultsGrid cols={2}>
          <ResultCard
            label={tr ? 'Ortalama Alış Fiyatı' : 'Average Buy Price'}
            value={disp(results[0]?.averageBuyPrice || 0).display}
            fullValue={disp(results[0]?.averageBuyPrice || 0).full}
          />
          <ResultCard
            label={tr ? 'Maksimum Düşüş' : 'Max Drawdown'}
            value={`${pct(-Math.abs(results[0]?.maxDrawdown ?? 0))}%`}
            tone="negative"
          />
        </ResultsGrid>
      </ResultPanel>
    </div>
  );
};
