import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Bitcoin, Percent, Target, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { DCAResult } from '@/services/dcaCalculator';
import { formatROI } from '@/utils/formatters';
import { formatCurrencyDisplay, formatBtcDisplay } from '@/utils/numberFormat';
import { differenceInDays } from 'date-fns';
import { TooltipInfo } from '@/components/ui/tooltip-info';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocale } from '@/hooks/useLocale';
import { ResultPanel, ResultHero, ResultsGrid, ResultCard } from '@/components/calculator';

interface ModernDCAResultsPanelProps {
  result: DCAResult;
  currency: string;
  startDate: Date;
  endDate: Date;
}

export const ModernDCAResultsPanel = ({ result, currency, startDate, endDate }: ModernDCAResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { intlLocale } = useLocale();
  const [showTaxImplications, setShowTaxImplications] = useState(false);
  const [animated, setAnimated] = useState({ currentValue: 0, profitLoss: 0, roiPercentage: 0, totalBitcoin: 0, totalInvested: 0 });

  const currencyData = SUPPORTED_CURRENCIES.find(c => c.code === currency);
  const symbol = currencyData?.symbol || '$';
  const isProfit = result.profitLoss >= 0;
  const daysInvested = differenceInDays(endDate, startDate);
  const numberOfPurchases = result.purchases.length;

  useEffect(() => {
    const duration = 900, steps = 40;
    let i = 0;
    const t = setInterval(() => {
      i++;
      const p = i / steps;
      const e = 1 - Math.pow(1 - p, 3);
      setAnimated({
        currentValue: result.currentValue * e,
        profitLoss: result.profitLoss * e,
        roiPercentage: result.roiPercentage * e,
        totalBitcoin: result.totalBitcoin * e,
        totalInvested: result.totalInvested * e,
      });
      if (i >= steps) {
        clearInterval(t);
        setAnimated({
          currentValue: result.currentValue,
          profitLoss: result.profitLoss,
          roiPercentage: result.roiPercentage,
          totalBitcoin: result.totalBitcoin,
          totalInvested: result.totalInvested,
        });
      }
    }, duration / steps);
    return () => clearInterval(t);
  }, [result]);

  const cur = (v: number, signed = false) => formatCurrencyDisplay(v, symbol, { signed, locale: intlLocale });
  const fmt = (v: number) => cur(v).display;
  const fmtFull = (v: number) => cur(v).full;

  const freqLabel = () => {
    if (tr) return result.purchases.length > daysInvested ? 'Günlük' : result.purchases.length > daysInvested / 7 ? 'Haftalık' : 'Aylık';
    return result.purchases.length > daysInvested ? 'Daily' : result.purchases.length > daysInvested / 7 ? 'Weekly' : 'Monthly';
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <ResultPanel icon={<BarChart3 />} title={tr ? 'DCA Sonuçları' : 'DCA Results'} accentBar={isProfit ? 'positive' : 'negative'}>
        <ResultHero
          label={tr ? 'Bugünkü Portföy Değeri' : 'Portfolio Value Today'}
          value={fmt(animated.currentValue)}
          fullValue={fmtFull(result.currentValue)}
          badge={
            <Badge
              variant={isProfit ? 'default' : 'destructive'}
              className={cn('text-xs', isProfit ? 'bg-success/10 text-success border-success/20' : '')}
            >
              {isProfit ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {formatROI(animated.roiPercentage, 1)}
            </Badge>
          }
        />

        <ResultsGrid cols={4}>
          <ResultCard
            label={tr ? 'Toplam Yatırım' : 'Total Invested'}
            value={fmt(animated.totalInvested)}
            fullValue={fmtFull(result.totalInvested)}
            icon={<DollarSign />}
          />
          <ResultCard
            label={tr ? 'Net Kâr' : 'Net Profit'}
            value={`${isProfit ? '+' : ''}${fmt(animated.profitLoss)}`}
            fullValue={fmtFull(result.profitLoss)}
            tone={isProfit ? 'positive' : 'negative'}
            icon={isProfit ? <TrendingUp /> : <TrendingDown />}
          />
          <ResultCard
            label={tr ? 'Edinilen BTC' : 'Bitcoin Acquired'}
            value={formatBtcDisplay(animated.totalBitcoin).display}
            fullValue={formatBtcDisplay(result.totalBitcoin).full}
            icon={<Bitcoin />}
            tone="primary"
          />
          <ResultCard
            label={tr ? 'Ort. Alış Fiyatı' : 'Avg. Buy Price'}
            value={fmt(result.averageBuyPrice)}
            fullValue={fmtFull(result.averageBuyPrice)}
            icon={<Target />}
          />
        </ResultsGrid>

        <ResultsGrid cols={4}>
          <ResultCard
            label={tr ? 'Süre' : 'Duration'}
            value={`${Math.round(daysInvested / 30)} ${tr ? 'ay' : 'mo'}`}
            size="sm"
          />
          <ResultCard label={tr ? 'Sıklık' : 'Frequency'} value={freqLabel()} size="sm" />
          <ResultCard
            label={tr ? 'Alım Sayısı' : 'Purchases'}
            value={numberOfPurchases}
            icon={<Hash />}
            size="sm"
          />
          <ResultCard
            label={tr ? 'Alım Başına' : 'Per Purchase'}
            value={fmt(result.totalInvested / Math.max(numberOfPurchases, 1))}
            fullValue={fmtFull(result.totalInvested / Math.max(numberOfPurchases, 1))}
            size="sm"
          />
        </ResultsGrid>
      </ResultPanel>

      {result.performanceMetrics && (
        <ResultPanel icon={<Activity />} title={tr ? 'Gelişmiş Analiz' : 'Advanced Insights'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: tr ? 'Sharpe Oranı' : 'Sharpe Ratio',
                tip: tr ? 'Riske göre ayarlanmış getiri' : 'Risk-adjusted return (>1 good, >2 excellent)',
                value: result.performanceMetrics.sharpeRatio.toFixed(2),
                progress: Math.min(Math.max(result.performanceMetrics.sharpeRatio * 25, 0), 100),
              },
              {
                label: tr ? 'Maks. Düşüş' : 'Max Drawdown',
                tip: tr ? 'Zirveden maks. düşüş' : 'Maximum decline from peak',
                value: `${(result.performanceMetrics.maxDrawdown * 100).toFixed(1)}%`,
                progress: Math.min(result.performanceMetrics.maxDrawdown * 100, 100),
              },
              {
                label: tr ? 'Oynaklık' : 'Volatility',
                tip: tr ? 'Yıllık fiyat dalgalanması' : 'Annualized price fluctuation',
                value: `${(result.performanceMetrics.volatility * 100).toFixed(1)}%`,
                progress: Math.min(result.performanceMetrics.volatility * 50, 100),
              },
              {
                label: tr ? 'Ort. Getiri' : 'Avg. Return',
                tip: tr ? 'Alım başına ortalama getiri' : 'Average return per purchase',
                value: `${(result.performanceMetrics.averageReturn * 100).toFixed(1)}%`,
                progress: Math.min(Math.max((result.performanceMetrics.averageReturn + 0.5) * 50, 0), 100),
              },
            ].map((m) => (
              <div key={m.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    {m.label}
                    <TooltipInfo content={m.tip} side="top" />
                  </span>
                  <span className="font-mono tabular-nums text-foreground">{m.value}</span>
                </div>
                <Progress value={m.progress} className="h-1.5" />
              </div>
            ))}
          </div>
        </ResultPanel>
      )}

      <ResultPanel>
        <div className="flex items-center gap-3">
          <Checkbox
            id="show-tax-implications"
            checked={showTaxImplications}
            onCheckedChange={(c) => setShowTaxImplications(c === true)}
            className="border-border/40"
          />
          <label htmlFor="show-tax-implications" className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            {tr ? 'Vergi Etkilerini Göster (ABD)' : 'Show Tax Implications (US)'}
            <TooltipInfo
              content={tr ? 'Elde tutma sürelerine göre tahmini vergi etkileri' : 'Estimated tax implications based on holding periods'}
              side="right"
            />
          </label>
        </div>
      </ResultPanel>

      {showTaxImplications && (
        <ResultPanel icon={<Percent />} title={tr ? 'Vergi Etkileri (ABD)' : 'Tax Implications (US)'}>
          <ResultsGrid cols={2}>
            <ResultCard
              label={tr ? 'Uzun Vadeli (>1 yıl)' : 'Long-term (>1 yr)'}
              value={fmt(Math.max(0, animated.profitLoss * 0.8))}
              tone="positive"
              tooltip={tr ? '%0, %15 veya %20 oranında vergilendirilir' : 'Taxed at 0%, 15%, or 20%'}
            />
            <ResultCard
              label={tr ? 'Kısa Vadeli (<1 yıl)' : 'Short-term (<1 yr)'}
              value={fmt(Math.max(0, animated.profitLoss * 0.2))}
              tone="negative"
              tooltip={tr ? 'Marjinal gelir oranınızda vergilendirilir' : 'Taxed at marginal income rate'}
            />
          </ResultsGrid>
          <p className="calc-text-small text-muted-foreground text-center">
            {tr ? 'Yalnızca bilgilendirme amaçlıdır, vergi tavsiyesi değildir.' : 'For informational purposes only — not tax advice.'}
          </p>
        </ResultPanel>
      )}
    </div>
  );
};
