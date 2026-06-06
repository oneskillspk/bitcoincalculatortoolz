import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LiquidationResult } from '@/services/leverageLiquidationCalculator';
import { TrendingUp, TrendingDown, Scale, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface RiskRewardVisualizationProps {
  result: LiquidationResult | null;
  marginAmount: number;
  leverage: number;
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

export const RiskRewardVisualization: React.FC<RiskRewardVisualizationProps> = ({ result, marginAmount, leverage }) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  if (!result) return null;

  const potentialProfit = result.maxProfitAtTarget || marginAmount * leverage * 0.1;
  const potentialLoss = result.maxLossAtStopLoss || marginAmount;
  const riskRewardRatio = potentialLoss > 0 ? potentialProfit / potentialLoss : 0;
  const positionValue = marginAmount * leverage;
  const roe10Up = (result.positionSizeUsd * 0.1 / marginAmount) * 100;
  const roe10Down = (result.positionSizeUsd * 0.1 / marginAmount) * 100;

  return (
    <Card className="bg-card border-border/50" data-currency-exempt="true">
      <CardContent className="p-4 sm:p-6 space-y-6">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Scale className="w-4 h-4 text-primary" />
          {isTr ? 'Risk / Getiri Analizi' : 'Risk / Reward Analysis'}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{isTr ? 'Risk:Getiri Oranı' : 'Risk:Reward Ratio'}</span>
            <span className={cn("font-semibold",
              riskRewardRatio >= 2 ? "text-success" : riskRewardRatio >= 1 ? "text-yellow-500" : "text-destructive")}>
              1:{riskRewardRatio.toFixed(2)}
            </span>
          </div>
          <div className="relative h-8 bg-muted/30 rounded-lg overflow-hidden">
            <div className="absolute left-0 h-full bg-gradient-to-r from-destructive to-destructive flex items-center justify-end pr-2"
              style={{ width: `${Math.min(50, 50)}%` }}>
              <span className="text-xs font-medium text-white">{isTr ? 'Risk' : 'Risk'}</span>
            </div>
            <div className="absolute right-0 h-full bg-gradient-to-l from-success to-success flex items-center justify-start pl-2"
              style={{ width: `${Math.min(50 * riskRewardRatio, 50)}%` }}>
              <span className="text-xs font-medium text-white">{isTr ? 'Getiri' : 'Reward'}</span>
            </div>
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-background z-10" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{isTr ? 'Maks. Kayıp' : 'Max Loss'}: {formatCurrency(potentialLoss)}</span>
            <span>{isTr ? 'Hedef Kâr' : 'Target Profit'}: {formatCurrency(potentialProfit)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-success">
                {isTr ? 'Fiyat +%10 ise' : 'If Price +10%'}
              </span>
            </div>
            <div className="text-xl font-bold text-success">+{roe10Up.toFixed(1)}%</div>
            <div className="text-xs text-success/70 mt-1">
              {isTr ? 'Özkaynak Getirisi' : 'Return on Equity'}
            </div>
          </div>
          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <span className="text-xs font-medium text-destructive">
                {isTr ? 'Fiyat -%10 ise' : 'If Price -10%'}
              </span>
            </div>
            <div className="text-xl font-bold text-destructive">-{roe10Down.toFixed(1)}%</div>
            <div className="text-xs text-destructive/70 mt-1">
              {isTr ? 'Özkaynak Getirisi' : 'Return on Equity'}
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {isTr ? 'Pozisyon Özeti' : 'Position Summary'}
          </h4>
          <div className="space-y-2">
            {[
              { label: isTr ? 'Marjınız' : 'Your Margin', value: formatCurrency(marginAmount), cls: 'text-foreground' },
              { label: isTr ? 'Kullanılan Kaldıraç' : 'Leverage Used', value: `${leverage}x`, cls: 'text-foreground' },
              { label: isTr ? 'Toplam Maruz Kalım' : 'Total Exposure', value: formatCurrency(positionValue), cls: 'text-primary' },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className={`font-medium ${item.cls}`}>{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 border-t border-border/30">
              <span className="text-muted-foreground">{isTr ? 'Maks. Kayıp (Tasfiye)' : 'Max Loss (Liquidation)'}</span>
              <span className="font-medium text-destructive">-{formatCurrency(marginAmount)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-yellow-500/90">
            <strong>{isTr ? 'Fonlama Oranları:' : 'Funding Rates:'}</strong>{' '}
            {isTr
              ? `Sürekli vadeli işlemler her 8 saatte bir fonlama ücreti alır. Tahmini 24 saatlik maliyet: ${formatCurrency(result.fundingRateImpact)}. Gerçek oranlar piyasa koşullarına göre değişir.`
              : `Perpetual futures charge funding every 8 hours. Estimated 24h cost: ${formatCurrency(result.fundingRateImpact)}. Actual rates vary by market conditions.`}
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <strong className="text-foreground">{isTr ? 'Profesyonel İpucu:' : 'Pro Tip:'}</strong>{' '}
            {isTr
              ? 'Profesyonel trader\'ların çoğu en az 1:2 risk-getiri oranı önerir. Tek bir işlemde portföyünüzün %1-2\'sinden fazlasını riske atmayın.'
              : 'Most professional traders recommend a minimum 1:2 risk-reward ratio. Never risk more than 1-2% of your portfolio on a single trade.'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
