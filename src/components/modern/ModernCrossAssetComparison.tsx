import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { assetComparisonService, AssetComparison } from '@/services/assetComparisonService';
import { CalculationResult } from '@/services/bitcoinApi';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatSymbolAmount } from '@/utils/numberFormat';

interface ModernCrossAssetComparisonProps {
  result: CalculationResult;
}

export const ModernCrossAssetComparison = React.memo(({ result }: ModernCrossAssetComparisonProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const { data: comparisons, isLoading, error } = useQuery<AssetComparison[]>({
    queryKey: ['asset-comparison', result.investmentAmount, result.startDate, result.roiPercentage],
    queryFn: () => assetComparisonService.compareAssets(
      result.investmentAmount, new Date(result.startDate), result.roiPercentage, result.currency
    ),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  });

  const formatCurrency = (amount: number) =>
    formatSymbolAmount(amount, result.currency, 0, isTr ? 'tr-TR' : 'en-US');

  const formatROI = (roi: number) => `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`;
  const formatROIDifference = (diff: number) => `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;

  if (isLoading) {
    return (
      <Card className="glass-morphism-card border-border/20">
        <CardContent className="p-8 flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error || !comparisons) return null;

  return (
    <Card className="border border-border/40 bg-card shadow-[0_1px_0_0_hsl(var(--border)/0.6)_inset,0_24px_60px_-30px_hsl(var(--foreground)/0.18)] animate-on-scroll">
      <CardHeader className="pb-6 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
              {isTr ? 'Bitcoin ve Geleneksel Varlıklar' : 'Bitcoin vs Traditional Assets'}
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isTr
                ? `${formatCurrency(result.investmentAmount)} yatırımınızı farklı seçeneklerle karşılaştırın`
                : `Compare your ${formatCurrency(result.investmentAmount)} across different investment options`}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative p-5 pt-9 calc-surface-featured calc-surface-interactive">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <Badge variant="default"
              className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground border-0 shadow-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase">
              {isTr ? 'En İyi' : 'Best'}
            </Badge>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-sm">
                ₿
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-tight text-foreground">Bitcoin</h4>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">BTC</p>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-baseline text-xs sm:text-sm">
                <span className="text-muted-foreground">{isTr ? 'Değer' : 'Value'}</span>
                <span className="metric-value text-sm font-semibold tabular-nums text-foreground">{formatCurrency(result.currentValue)}</span>
              </div>
              <div className="flex justify-between items-baseline text-xs sm:text-sm">
                <span className="text-muted-foreground">{isTr ? 'Getiri' : 'Return'}</span>
                <span className={`font-bold tabular-nums ${result.roiPercentage >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatROI(result.roiPercentage)}
                </span>
              </div>
            </div>
          </div>

          {comparisons.map((comparison) => (
            <div key={comparison.symbol}
              className="relative p-5 pt-9 calc-surface-interactive group">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-muted ring-1 ring-border/60 flex items-center justify-center text-base">
                  {comparison.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold tracking-tight text-foreground leading-tight truncate">{comparison.asset}</h4>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{comparison.symbol}</p>
                </div>
                {comparison.roiDifference >= 0
                  ? <TrendingUp className="w-4 h-4 text-success" />
                  : <TrendingDown className="w-4 h-4 text-destructive" />}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs sm:text-sm">
                  <span className="text-muted-foreground">{isTr ? 'Değer' : 'Value'}</span>
                  <span className="metric-value text-sm font-semibold tabular-nums text-foreground">{formatCurrency(comparison.currentValue)}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs sm:text-sm">
                  <span className="text-muted-foreground">{isTr ? 'Getiri' : 'Return'}</span>
                  <span className={`font-bold tabular-nums ${comparison.roi >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatROI(comparison.roi)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs sm:text-sm pt-2 mt-1 border-t border-border/30">
                  <span className="text-muted-foreground">{isTr ? 'BTC\'ye karşı' : 'vs Bitcoin'}</span>
                  <span className={`font-semibold tabular-nums ${comparison.roiDifference >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatROIDifference(comparison.roiDifference)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 calc-surface-card">
          <div className="text-center space-y-2">
            <div className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              {isTr
                ? <>Bitcoin, {comparisons.length} geleneksel varlıktan{' '}
                    <span className="text-primary font-bold">{comparisons.filter(c => c.roiDifference < 0).length}</span>
                    {' '}tanesini geride bıraktı</>
                : <>Bitcoin outperformed{' '}
                    <span className="text-primary font-bold">{comparisons.filter(c => c.roiDifference < 0).length}</span>
                    {' '}out of {comparisons.length} traditional assets</>
              }
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <span className="tabular-nums">{new Date(result.startDate).toLocaleDateString()} – {isTr ? 'Bugün' : 'Today'}</span>
              <span className="hidden sm:inline opacity-40">•</span>
              <span>{isTr ? 'Yatırım:' : 'Investment:'} <span className="tabular-nums text-foreground/80">{formatCurrency(result.investmentAmount)}</span></span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ModernCrossAssetComparison.displayName = 'ModernCrossAssetComparison';
