import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, Target, Shield, DollarSign, AlertCircle, Clock } from 'lucide-react';
import { LiquidationResult, LeverageComparison } from '@/services/leverageLiquidationCalculator';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultHero, ResultsGrid, ResultCard, EmptyState } from '@/components/calculator';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface LeverageResultsPanelProps {
  result: LiquidationResult | null;
  leverageComparison: LeverageComparison[];
  entryPrice: number;
  currentPrice: number;
  positionType: 'long' | 'short';
  isLoading?: boolean;
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

const disp = (value: number) => formatCurrencyForDisplay(value, 'USD');

const formatBtc = (value: number): string => value.toFixed(8) + ' BTC';
const formatPercent = (value: number): string => value.toFixed(2) + '%';

const getRiskColor = (score: string): string => {
  switch (score) {
    case 'low': return 'bg-success/10 text-success border-success/30';
    case 'medium': return 'bg-warning/$3 text-warning border-warning/30';
    case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
    case 'extreme': return 'bg-destructive/10 text-destructive border-destructive/30';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const LeverageResultsPanel: React.FC<LeverageResultsPanelProps> = ({
  result, leverageComparison, isLoading = false,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const getRiskLabel = (score: string): string => {
    if (tr) {
      switch (score) {
        case 'low': return 'Düşük Risk';
        case 'medium': return 'Orta Risk';
        case 'high': return 'Yüksek Risk';
        case 'extreme': return 'Aşırı Risk';
        default: return 'Bilinmiyor';
      }
    }
    switch (score) {
      case 'low': return 'Low Risk';
      case 'medium': return 'Medium Risk';
      case 'high': return 'High Risk';
      case 'extreme': return 'Extreme Risk';
      default: return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <ResultPanel>
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded w-2/3" />
          <div className="h-24 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </ResultPanel>
    );
  }

  if (!result) {
    return (
      <ResultPanel>
        <EmptyState
          icon={<AlertCircle />}
          title={tr ? 'Hesaplamaya hazır' : 'Ready to calculate'}
          description={tr ? 'Tasfiye analizini görmek için pozisyon detaylarını girin' : 'Enter position details to see liquidation analysis'}
        />
      </ResultPanel>
    );
  }

  return (
    <div className="space-y-4">
      <ResultPanel
        icon={<AlertTriangle />}
        title={tr ? 'Tasfiye Analizi' : 'Liquidation Analysis'}
        accentBar="negative"
      >
        <ResultHero
          label={tr ? 'Tasfiye Fiyatı' : 'Liquidation Price'}
          value={disp(result.liquidationPrice).display}
          fullValue={disp(result.liquidationPrice).full}
          sub={
            <span>
              {tr ? `Mevcut fiyattan %${formatPercent(result.distanceToLiquidation)} uzakta` : `${formatPercent(result.distanceToLiquidation)} from current price`}
              {' · '}
              {disp(result.distanceToLiquidationUsd).display} {tr ? 'uzakta' : 'away'}
            </span>
          }
          badge={
            <Badge variant="outline" className={cn('px-4 py-2 text-sm font-medium border', getRiskColor(result.riskScore))}>
              <Shield className="w-4 h-4 mr-2" />
              {getRiskLabel(result.riskScore)}
            </Badge>
          }
        />

        <div className="calc-surface-subtle p-4 space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{tr ? 'Marj modu' : 'Margin mode'}</span>
            <span className="font-semibold text-foreground capitalize">
              {tr ? (result.marginMode === 'isolated' ? 'İzole' : 'Çapraz') : result.marginMode}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm min-w-0">
            <span className="text-muted-foreground shrink-0">{tr ? 'Risk altındaki toplam teminat' : 'Total collateral at risk'}</span>
            <span className="calc-text-mono font-semibold text-foreground break-words [overflow-wrap:anywhere] text-right tabular-nums" title={formatCurrency(result.totalCollateralAtRisk)}>{disp(result.totalCollateralAtRisk).display}</span>
          </div>
          {result.marginMode === 'cross' && (
            <p className="calc-text-small text-muted-foreground">
              {tr
                ? 'Çapraz marj, ekstra hesap teminatı kullanarak daha fazla tasfiye tamponu sağlar, ancak bu ekstra teminat da kaybedilebilir.'
                : 'Cross margin gives more liquidation buffer by using extra account collateral, but that extra collateral can also be lost.'}
            </p>
          )}
        </div>

        <ResultsGrid cols={2}>
          <ResultCard
            icon={<DollarSign />}
            label={tr ? 'Pozisyon Büyüklüğü' : 'Position Size'}
            value={disp(result.positionSizeUsd).display}
            fullValue={disp(result.positionSizeUsd).full}
            sub={formatBtc(result.positionSizeBtc)}
          />
          <ResultCard
            icon={<AlertCircle />}
            label={tr ? 'Teminat Tamamlama' : 'Margin Call'}
            value={disp(result.marginCallPrice).display}
            fullValue={disp(result.marginCallPrice).full}
            sub={tr ? 'Uyarı seviyesi' : 'Warning level'}
            tone="negative"
          />
          <ResultCard
            icon={<Target />}
            label={tr ? 'Başabaş Noktası' : 'Break-Even'}
            value={disp(result.breakEvenPrice).display}
            fullValue={disp(result.breakEvenPrice).full}
            sub={tr ? 'Ücretler dahil' : 'Including fees'}
          />
          <ResultCard
            icon={<Clock />}
            label={tr ? '24s Fonlama' : '24h Funding'}
            value={`~${disp(result.fundingRateImpact).display}`}
            fullValue={`~${disp(result.fundingRateImpact).full}`}
            sub={tr ? 'Tahmini maliyet' : 'Estimated cost'}
            tone="negative"
          />
        </ResultsGrid>

        {(result.takeProfitPrice || result.stopLossPrice) && (
          <ResultsGrid cols={2}>
            {result.takeProfitPrice && (
              <ResultCard
                icon={<TrendingUp />}
                label={tr ? 'Kâr Al' : 'Take Profit'}
                value={disp(result.takeProfitPrice).display}
                fullValue={disp(result.takeProfitPrice).full}
                sub={`${tr ? 'Kâr' : 'Profit'}: ${disp(result.maxProfitAtTarget).display}`}
                tone="positive"
              />
            )}
            {result.stopLossPrice && (
              <ResultCard
                icon={<TrendingDown />}
                label={tr ? 'Zarar Durdur' : 'Stop Loss'}
                value={disp(result.stopLossPrice).display}
                fullValue={disp(result.stopLossPrice).full}
                sub={`${tr ? 'Zarar' : 'Loss'}: ${disp(result.maxLossAtStopLoss).display}`}
                tone="negative"
              />
            )}
          </ResultsGrid>
        )}
      </ResultPanel>

      <ResultPanel
        title={tr ? 'Kaldıraç Karşılaştırması' : 'Leverage Comparison'}
        footer={
          <p className="calc-text-small text-muted-foreground">
            {tr ? '* Kâr/Zarar hesaplamaları giriş fiyatından %10\'luk bir fiyat hareketini varsayar' : '* Profit/Loss calculations assume a 10% price movement from entry'}
          </p>
        }
      >
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[500px] px-4 sm:px-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border/30">
                  <th className="text-left py-2 font-medium">{tr ? 'Kaldıraç' : 'Leverage'}</th>
                  <th className="text-right py-2 font-medium">{tr ? 'Tas. Fiyatı' : 'Liq. Price'}</th>
                  <th className="text-right py-2 font-medium">{tr ? 'Mesafe' : 'Distance'}</th>
                  <th className="text-right py-2 font-medium">{tr ? '+%10 Hareket' : '+10% Move'}</th>
                  <th className="text-right py-2 font-medium">{tr ? '-%10 Hareket' : '-10% Move'}</th>
                  <th className="text-center py-2 font-medium">{tr ? 'Risk' : 'Risk'}</th>
                </tr>
              </thead>
              <tbody>
                {leverageComparison.map((row) => (
                  <tr
                    key={row.leverage}
                    className={cn('border-b border-border/20 hover:bg-muted/30 transition-colors', row.leverage === result.effectiveLeverage && 'bg-primary/5')}
                  >
                    <td className="py-2.5 font-medium">
                      {row.leverage}x
                      {row.leverage === result.effectiveLeverage && (
                        <Badge variant="outline" className="ml-2 text-[10px] py-0 px-1">{tr ? 'Mevcut' : 'Current'}</Badge>
                      )}
                    </td>
                    <td className="text-right py-2.5 font-mono text-xs">{formatCurrency(row.liquidationPrice)}</td>
                    <td className="text-right py-2.5">{formatPercent(row.distancePercent)}</td>
                    <td className="text-right py-2.5 text-success font-mono text-xs">+{formatCurrency(row.maxProfit10)}</td>
                    <td className="text-right py-2.5 text-destructive font-mono text-xs">-{formatCurrency(row.maxLoss10)}</td>
                    <td className="text-center py-2.5">
                      <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0.5', getRiskColor(row.riskScore))}>
                        {getRiskLabel(row.riskScore)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ResultPanel>
    </div>
  );
};
