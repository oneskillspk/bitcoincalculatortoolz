import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoanResult } from '@/services/bitcoinLoanCalculator';
import { LoanFormInputs } from './BitcoinLoanInputPanel';

interface Props {
  inputs: LoanFormInputs;
  results: LoanResult;
  drawdownScenario: number;
  setDrawdownScenario: (n: number) => void;
}

export const BitcoinLoanDrawdownStress: React.FC<Props> = ({
  inputs,
  results,
  drawdownScenario,
  setDrawdownScenario,
}) => {
  const { t } = useLanguage();

  const stressedPrice = inputs.btcPrice * (1 - drawdownScenario / 100);
  const stressedCollateralValue = inputs.btcCollateral * stressedPrice;
  const stressedLtv = stressedCollateralValue > 0
    ? (results.loanAmountUsd / stressedCollateralValue) * 100
    : 0;
  const status = stressedLtv >= inputs.liquidationLtv
    ? 'Liquidation zone'
    : stressedLtv >= inputs.marginCallLtv
      ? 'Margin call zone'
      : 'Healthy buffer';
  const collateralNeededForMargin = results.loanAmountUsd / (inputs.marginCallLtv / 100);
  const collateralNeededForLiquidation = results.loanAmountUsd / (inputs.liquidationLtv / 100);
  const marginGap = stressedCollateralValue - collateralNeededForMargin;
  const liquidationGap = stressedCollateralValue - collateralNeededForLiquidation;

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm mt-8">
      <CardContent className="p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{t('loan.drawdown.title')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('loan.drawdown.desc')}</p>
          </div>
          <div className="rounded-lg border border-border/30 bg-muted/20 px-4 py-3 text-center min-w-36">
            <div className="text-xs text-muted-foreground">{t('loan.drawdown.scenarioLabel')}</div>
            <div className="text-2xl font-bold text-foreground">-{drawdownScenario}%</div>
          </div>
        </div>

        <div className="space-y-2" aria-label={t('aria.drawdownSlider')}>
          <Slider
            value={[drawdownScenario]}
            min={0}
            max={80}
            step={5}
            onValueChange={(value) => setDrawdownScenario(value[0])}
            className="py-3"
            aria-label={t('aria.drawdownPercentage')}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>40%</span>
            <span>80%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { label: t('loan.drawdown.stressedPrice'), value: `$${stressedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
            { label: t('loan.drawdown.scenarioLtv'), value: `${stressedLtv.toFixed(1)}%` },
            { label: t('loan.drawdown.marginLevel'), value: `${inputs.marginCallLtv}% LTV` },
            { label: t('loan.drawdown.liquidationLevel'), value: `${inputs.liquidationLtv}% LTV` },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border/30 bg-background/40 p-4">
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="text-lg font-semibold text-foreground mt-1">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border/30 bg-muted/20 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-foreground">{status}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p className="text-muted-foreground">
              {t('loan.drawdown.marginBuffer')} <span className={marginGap >= 0 ? 'text-success' : 'text-destructive'}>{marginGap >= 0 ? '+' : ''}${marginGap.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </p>
            <p className="text-muted-foreground">
              {t('loan.drawdown.liquidationBuffer')} <span className={liquidationGap >= 0 ? 'text-success' : 'text-destructive'}>{liquidationGap >= 0 ? '+' : ''}${liquidationGap.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{t('loan.drawdown.note')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          {[
            { label: t('loan.gauges.currentLtv'), value: results.currentLtv, tone: 'bg-primary' },
            { label: t('loan.gauges.marginCall'), value: inputs.marginCallLtv, tone: 'bg-amber-500' },
            { label: t('loan.gauges.liquidation'), value: inputs.liquidationLtv, tone: 'bg-destructive' },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border/30 bg-background/40 p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">{item.value.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full ${item.tone}`} style={{ width: `${Math.min(100, item.value)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BitcoinLoanDrawdownStress;
