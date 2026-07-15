import React from 'react';
import { ComparisonResult } from '@/services/lumpSumDcaComparator';
import { TrendingUp, Shield, Zap, Target, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ResultPanel,
  ResultsGrid,
  ResultCard,
  ResultBadge,
} from '@/components/calculator';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface StrategyComparisonProps {
  result: ComparisonResult;
  currency?: string;
}

export const StrategyComparison = ({ result, currency = 'USD' }: StrategyComparisonProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';

  const fmt = (v: number) => {
    if (!Number.isFinite(v)) return { value: '—', fullValue: undefined as string | undefined };
    const d = formatCurrencyForDisplay(v, currency, { locale, compactAbove: 100_000 });
    return { value: d.display, fullValue: d.isCompact ? d.full : undefined };
  };
  const fmtPct = (v: number) => (Number.isFinite(v) ? `${v >= 0 ? '+' : ''}${v.toFixed(1)}%` : '—');
  const fmtPctPlain = (v: number) => (Number.isFinite(v) ? `${(v * 100).toFixed(1)}%` : '—');

  const hasDva = !!result.dva;

  const strategies = [
    {
      key: 'lump-sum' as const,
      label: tr ? 'Toplu Yatırım Stratejisi' : 'Lump Sum Strategy',
      icon: <Zap />,
      data: result.lumpSum,
      advantages: [
        tr ? 'Anında tam piyasa maruziyeti' : 'Immediate full market exposure',
        tr ? 'Boğa piyasalarında maksimum kazanç potansiyeli' : 'Maximum gain potential in bull markets',
        tr ? 'Daha basit uygulama — tek işlem' : 'Simpler execution — one transaction',
      ],
      considerations: [
        tr ? 'Yüksek zamanlama riski — zirveden alabilirsiniz' : 'High timing risk — could buy at peak',
        tr ? 'Peşin büyük sermaye gerektirir' : 'Requires large capital upfront',
        tr ? 'Piyasa düşüşlerine maksimum maruziyet' : 'Maximum exposure to market downturns',
      ],
    },
    {
      key: 'dca' as const,
      label: tr ? 'DCA Stratejisi' : 'DCA Strategy',
      icon: <BarChart3 />,
      data: result.dca,
      advantages: [
        tr ? 'Ortalamayla zamanlama riskini azaltır' : 'Reduces timing risk through averaging',
        tr ? 'Piyasa oynaklığını yumuşatır' : 'Smooths out market volatility',
        tr ? 'Disiplinli yatırım yaklaşımı' : 'Disciplined investment approach',
      ],
      considerations: [
        tr ? 'Erken kazançları kaçırabilir' : 'May miss out on early gains',
        tr ? 'İşlem maliyetleri birikebilir' : 'Transaction costs can accumulate',
        tr ? 'Tutarlı uygulama gerektirir' : 'Requires consistent execution',
      ],
    },
    ...(hasDva && result.dva ? [{
      key: 'dva' as const,
      label: tr ? 'DVA Stratejisi' : 'DVA Strategy',
      icon: <Target />,
      data: result.dva,
      advantages: [
        tr ? 'Tutarlı portföy büyümesini hedefler' : 'Targets consistent portfolio growth',
        tr ? 'Fiyatlar düşükken daha fazla alır' : 'Buys more when prices are low',
        tr ? 'Sistematik yeniden dengeleme yaklaşımı' : 'Systematic rebalancing approach',
      ],
      considerations: [
        tr ? 'Değişken nakit akışı gerektirir' : 'Variable cash flow requirements',
        tr ? 'Manuel uygulaması daha karmaşıktır' : 'More complex to execute manually',
        tr ? 'Boğa koşularında çok az yatırım yapabilir' : 'May invest very little in bull runs',
      ],
    }] : []),
  ];

  const winMarginPct = Number.isFinite(result.summary.winMargin) ? result.summary.winMargin : 0;

  return (
    <div className="space-y-4">
      {/* Strategy Breakdown */}
      <div className={`grid grid-cols-1 ${hasDva ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4`}>
        {strategies.map((strategy) => {
          const isWinner = result.winner === strategy.key;
          const finalValue = fmt(strategy.data.currentValue);
          const supplementalLabel = strategy.key === 'lump-sum'
            ? (tr ? 'Maksimum Düşüş' : 'Max Drawdown')
            : (tr ? 'Toplam Alım' : 'Total Purchases');
          const supplementalValue = strategy.key === 'lump-sum'
            ? fmtPctPlain(strategy.data.performanceMetrics.maxDrawdown)
            : String(strategy.data.purchases.length);

          return (
            <ResultPanel
              key={strategy.key}
              icon={strategy.icon}
              title={strategy.label}
              accentBar={isWinner ? 'primary' : 'none'}
              action={isWinner ? (
                <ResultBadge tone="primary">{tr ? 'Kazanan' : 'Winner'}</ResultBadge>
              ) : undefined}
              aria-live="polite"
              aria-atomic="true"
              aria-label={tr ? 'Strateji sonucu' : 'Strategy result'}
            >
              <ResultsGrid cols={2}>
                <ResultCard
                  label={tr ? 'Nihai Değer' : 'Final Value'}
                  value={finalValue.value}
                  fullValue={finalValue.fullValue}
                  tone={isWinner ? 'primary' : 'default'}
                  size="lg"
                />
                <ResultCard
                  label="ROI"
                  value={fmtPct(strategy.data.roiPercentage)}
                  tone={strategy.data.roiPercentage >= 0 ? 'positive' : 'negative'}
                  size="lg"
                />
              </ResultsGrid>

              <div className="space-y-3">
                <div>
                  <h3 className="calc-text-label text-foreground mb-2">{tr ? 'Avantajlar' : 'Advantages'}</h3>
                  <ul className="space-y-1.5">
                    {strategy.advantages.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="calc-text-label text-foreground mb-2">{tr ? 'Dikkat Edilecekler' : 'Considerations'}</h3>
                  <ul className="space-y-1.5">
                    {strategy.considerations.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="calc-surface-subtle p-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{supplementalLabel}</span>
                <span className="font-medium text-foreground tabular-nums">{supplementalValue}</span>
              </div>
            </ResultPanel>
          );
        })}
      </div>

      {/* Summary Insights */}
      <ResultPanel
        icon={<TrendingUp />}
        title={tr ? 'Temel İçgörüler' : 'Key Insights'}
        aria-live="polite"
        aria-atomic="true"
        aria-label={tr ? 'Temel içgörüler' : 'Key insights'}
      >
        <ResultsGrid cols={3}>
          <ResultCard
            icon={<Shield />}
            label={result.winner === 'tie' ? (tr ? 'Eşit Performans' : 'Equal Performance') : (tr ? 'Daha İyi Strateji' : 'Better Strategy')}
            value={result.winner === 'tie'
              ? (tr ? 'Beraberlik' : 'Tie')
              : `${result.summary.betterStrategy}${winMarginPct ? ` · ${winMarginPct.toFixed(1)}%` : ''}`}
            tone="primary"
            size="md"
          />
          <ResultCard
            icon={<TrendingUp />}
            label={tr ? 'Mutlak Fark' : 'Absolute Difference'}
            value={fmt(result.difference.absoluteValue).value}
            fullValue={fmt(result.difference.absoluteValue).fullValue}
          />
          <ResultCard
            icon={<Target />}
            label={tr ? 'Performans Farkı' : 'Performance Gap'}
            value={`${result.difference.percentageDifference.toFixed(1)}%`}
          />
        </ResultsGrid>

        <div className="calc-surface-subtle p-4 mt-2">
          <p className="text-sm text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
            {result.summary.riskAnalysis.recommendation}
          </p>
        </div>
      </ResultPanel>
    </div>
  );
};
