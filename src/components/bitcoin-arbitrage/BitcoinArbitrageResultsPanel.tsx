import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpDown, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";

export interface ArbitrageResults {
  spreadAbs: number;
  spreadPct: number;
  grossProfit: number;
  feeACost: number;
  feeBCost: number;
  withdrawalFeeUsd: number;
  settlementCostUsd: number;
  slippageCost: number;
  totalFees: number;
  totalSettlementCosts: number;
  netProfit: number;
  returnOnTrade: number;
  isProfitable: boolean;
  buyExchange: string;
  sellExchange: string;
  costLegs: { label: string; amount: number }[];
}

interface Props {
  results: ArbitrageResults | null;
  exchangeA: string;
  exchangeB: string;
}

export const BitcoinArbitrageResultsPanel: React.FC<Props> = ({ results, exchangeA, exchangeB }) => {
  const { t } = useLanguage();
  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">{t('arb.results.title')}</h2>

        {results ? (
          <div className="space-y-4">
            <div className={`flex items-center gap-2 p-3 rounded-lg ${results.isProfitable ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'}`}>
              {results.isProfitable ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive" />
              )}
              <span className={`text-sm font-medium ${results.isProfitable ? 'text-success' : 'text-destructive'}`}>
                {results.isProfitable ? t('arb.results.profitable') : t('arb.results.notProfitable')}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">{t('arb.results.buySell', { buy: results.buyExchange, sell: results.sellExchange })}</p>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-sm text-muted-foreground">{t('arb.results.spread')}</span>
                <span className="text-sm font-semibold text-foreground">
                  ${results.spreadAbs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({results.spreadPct.toFixed(3)}%)
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-sm text-muted-foreground">{t('arb.results.gross')}</span>
                <span className="text-sm font-semibold text-foreground">
                  ${results.grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-sm text-muted-foreground">{t('arb.results.feeOn', { exchange: exchangeA })}</span>
                <span className="text-sm text-destructive">
                  −${results.feeACost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-sm text-muted-foreground">{t('arb.results.feeOn', { exchange: exchangeB })}</span>
                <span className="text-sm text-destructive">
                  −${results.feeBCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-sm text-muted-foreground">{t('arb.results.totalFees')}</span>
                <span className="text-sm text-destructive font-medium">
                  −${results.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="rounded-lg border border-border/30 bg-muted/20 p-3 space-y-2">
                <div className="text-sm font-medium text-foreground">{t('arb.results.settlement')}</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('arb.results.withdrawal')}</span>
                  <span className="text-destructive">−${results.withdrawalFeeUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('arb.results.fiatRails')}</span>
                  <span className="text-destructive">−${results.settlementCostUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('arb.results.estSlippage')}</span>
                  <span className="text-destructive">−${results.slippageCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border/30">
                  <span className="font-medium text-foreground">{t('arb.results.tradingSettle')}</span>
                  <span className="font-medium text-destructive">−${(results.totalFees + results.totalSettlementCosts).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="rounded-lg border border-border/30 bg-background/40 p-4 space-y-3" aria-label={t('aria.arbitrageNetProfit')}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">{t('arb.results.waterfall')}</span>
                  <span className="text-xs text-muted-foreground">{t('arb.results.grossLess')}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-32 text-muted-foreground">{t('arb.results.grossSpread')}</span>
                    <div className="h-3 flex-1 rounded-full bg-primary/20 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '100%' }} />
                    </div>
                    <span className="w-20 text-right text-foreground">${results.grossProfit.toFixed(2)}</span>
                  </div>
                  {results.costLegs.map((leg) => {
                    const width = results.grossProfit > 0 ? Math.min(100, (leg.amount / results.grossProfit) * 100) : 100;
                    return (
                      <div key={leg.label} className="flex items-center gap-3 text-xs">
                        <span className="w-32 text-muted-foreground truncate">{leg.label}</span>
                        <div className="h-3 flex-1 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-destructive/70" style={{ width: `${width}%` }} />
                        </div>
                        <span className="w-20 text-right text-destructive">−${leg.amount.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between items-center py-3 bg-muted/30 rounded-lg px-3">
                <span className="text-sm font-semibold text-foreground">{t('arb.results.netProfit')}</span>
                <span className={`text-lg font-bold ${results.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {results.netProfit >= 0 ? '+' : ''}${results.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">{t('arb.results.returnTrade')}</span>
                <span className={`text-sm font-semibold ${results.returnOnTrade >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {results.returnOnTrade >= 0 ? '+' : ''}{results.returnOnTrade.toFixed(3)}%
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              {t('arb.results.note')}
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <ArrowUpDown className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{t('arb.results.empty')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
