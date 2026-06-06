import React from 'react';
import { Badge } from '@/components/ui/badge';
import { type ProjectionResult, formatCurrency, formatPercentage, type AssetComparisonResult } from '@/services/investmentProjectionCalculator';
import { DollarSign, Bitcoin, ArrowUpRight, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultsGrid, ResultCard, EmptyState } from '@/components/calculator';

interface InvestmentResultsPanelProps {
  results: ProjectionResult[];
  showInflation: boolean;
  priceTargetResult?: {
    portfolioValue: number;
    profit: number;
    roi: number;
    btcHoldings: number;
  } | null;
  targetBtcPrice: number;
  assetComparisons: AssetComparisonResult[];
  currency?: string;
}

import { formatCurrencyAmount, formatCurrencyForDisplay } from '@/utils/formatCurrency';

export const InvestmentResultsPanel: React.FC<InvestmentResultsPanelProps> = ({
  results, showInflation, priceTargetResult, targetBtcPrice, assetComparisons, currency = 'USD',
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : (currency === 'TRY' ? 'tr-TR' : 'en-US');
  const fmt = (v: number) => formatCurrency(v, currency);
  const fmtPrice = (v: number) => formatCurrencyAmount(v, currency, { locale });
  const disp = (v: number, signed = false) => formatCurrencyForDisplay(v, currency, { locale, signed });

  if (results.length === 0) {
    return (
      <ResultPanel>
        <EmptyState
          icon={<DollarSign />}
          title={tr ? 'Hesaplamaya hazır' : 'Ready to calculate'}
          description={tr ? 'Projeksiyon görmek için yatırım tutarı girin ve en az bir büyüme modeli seçin.' : 'Enter an investment amount and select at least one growth model to see projections.'}
        />
      </ResultPanel>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <ResultPanel
          key={result.modelId}
          title={
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: result.color }} />
              {result.modelName}
            </span>
          }
          action={<Badge variant="outline" className="text-xs font-mono">{formatPercentage(result.projectedROI)} ROI</Badge>}
        >
          {(() => {
            const fv = disp(result.finalValue);
            const fr = disp(result.finalRealValue);
            const pp = disp(result.projectedProfit, true);
            const ti = disp(result.totalInvested);
            return (
          <ResultsGrid cols={2}>
            <ResultCard
              label={tr ? 'Tahmini Değer' : 'Projected Value'}
              value={fv.display}
              fullValue={fv.full}
              sub={showInflation ? `${tr ? 'Reel:' : 'Real:'} ${fr.display}` : undefined}
              size="lg"
            />
            <ResultCard
              label={tr ? 'Tahmini Kâr' : 'Projected Profit'}
              value={pp.display}
              fullValue={pp.full}
              tone={result.projectedProfit >= 0 ? 'positive' : 'negative'}
              size="lg"
            />
            <ResultCard
              label={tr ? 'Toplam Yatırım' : 'Total Invested'}
              value={ti.display}
              fullValue={ti.full}
              size="sm"
            />
            <ResultCard
              icon={<Bitcoin />}
              label={tr ? 'Tahmini BTC Varlığı' : 'Est. BTC Holdings'}
              value={result.estimatedBtcHoldings.toFixed(6)}
              size="sm"
              tone="primary"
            />
          </ResultsGrid>
            );
          })()}
        </ResultPanel>
      ))}

      {priceTargetResult && targetBtcPrice > 0 && (
        <ResultPanel
          icon={<Target />}
          title={`${tr ? 'Fiyat Hedefi:' : 'Price Target:'} ${fmtPrice(targetBtcPrice)}`}
          accentBar="primary"
        >
          {(() => {
            const pv = disp(priceTargetResult.portfolioValue);
            const pf = disp(priceTargetResult.profit, true);
            return (
          <ResultsGrid cols={2}>
            <ResultCard label={tr ? 'Portföy Değeri' : 'Portfolio Value'} value={pv.display} fullValue={pv.full} tone="primary" size="lg" />
            <ResultCard label="ROI" value={formatPercentage(priceTargetResult.roi)} tone="positive" size="lg" />
            <ResultCard label={tr ? 'Kâr' : 'Profit'} value={pf.display} fullValue={pf.full} tone="positive" size="sm" />
            <ResultCard label={tr ? 'Tahmini BTC' : 'Est. BTC'} value={`${priceTargetResult.btcHoldings.toFixed(6)} BTC`} size="sm" />
          </ResultsGrid>
            );
          })()}
        </ResultPanel>
      )}

      {assetComparisons.length > 0 && (
        <ResultPanel icon={<ArrowUpRight />} title={tr ? 'Aynı Yatırım...' : 'Same Investment In...'}>
          <div className="space-y-1">
            {assetComparisons.map((asset) => (
              <div key={asset.assetId} className={cn('flex items-center justify-between py-2 border-b border-border/20 last:border-b-0')}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: asset.color }} />
                  <span className="text-sm text-foreground">{asset.assetName}</span>
                </div>
                <div className="text-right">
                  <p className="calc-text-mono text-sm font-medium text-foreground">{fmt(asset.finalValue)}</p>
                  <p className="calc-text-small text-muted-foreground">{formatPercentage(asset.roi)}</p>
                </div>
              </div>
            ))}
          </div>
        </ResultPanel>
      )}
    </div>
  );
};
