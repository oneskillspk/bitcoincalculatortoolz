import React from 'react';
import { ArrowUpDown, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ResultPanel,
  ResultHero,
  ResultsGrid,
  ResultCard,
  ResultBadge,
  EmptyState,
} from '@/components/calculator';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';

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
  const { t, language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';
  const disp = (v: number, signed = false) =>
    formatCurrencyForDisplay(v, 'USD', { locale, signed });

  if (!results) {
    return (
      <ResultPanel
        aria-live="polite"
        aria-atomic="true"
        aria-label={tr ? 'Hesaplama sonucu' : 'Calculator result'}
        title={t('arb.results.title')}
      >
        <EmptyState
          icon={<ArrowUpDown />}
          title={tr ? 'Hesaplamaya Hazır' : 'Ready to Calculate'}
          description={t('arb.results.empty')}
        />
      </ResultPanel>
    );
  }

  const netDisp = disp(results.netProfit, true);
  const grossDisp = disp(results.grossProfit);
  const spreadDisp = disp(results.spreadAbs);
  const feeADisp = disp(results.feeACost);
  const feeBDisp = disp(results.feeBCost);
  const totalFeesDisp = disp(results.totalFees);
  const withdrawDisp = disp(results.withdrawalFeeUsd);
  const railsDisp = disp(results.settlementCostUsd);
  const slipDisp = disp(results.slippageCost);
  const combinedCosts = results.totalFees + results.totalSettlementCosts;
  const combinedDisp = disp(combinedCosts);
  const returnStr = `${results.returnOnTrade >= 0 ? '+' : ''}${results.returnOnTrade.toFixed(3)}%`;

  return (
    <ResultPanel
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? 'Hesaplama sonucu' : 'Calculator result'}
      icon={<TrendingUp />}
      eyebrow={tr ? 'Arbitraj Analizi' : 'Arbitrage Analysis'}
      title={t('arb.results.title')}
      description={t('arb.results.buySell', { buy: results.buyExchange, sell: results.sellExchange })}
      accentBar={results.isProfitable ? 'positive' : 'negative'}
      action={
        <ResultBadge
          tone={results.isProfitable ? 'positive' : 'negative'}
          icon={results.isProfitable ? <CheckCircle /> : <XCircle />}
        >
          {results.isProfitable ? t('arb.results.profitable') : t('arb.results.notProfitable')}
        </ResultBadge>
      }
      footer={<p className="calc-text-small text-muted-foreground">{t('arb.results.note')}</p>}
    >
      <ResultHero
        label={t('arb.results.netProfit')}
        value={
          <span className={results.netProfit >= 0 ? 'text-success' : 'text-destructive'}>
            {netDisp.display}
          </span>
        }
        fullValue={netDisp.full}
        sub={`${t('arb.results.returnTrade')}: ${returnStr}`}
      />

      <ResultsGrid cols={3}>
        <ResultCard
          label={t('arb.results.spread')}
          value={spreadDisp.display}
          fullValue={spreadDisp.full}
          sub={`${results.spreadPct.toFixed(3)}%`}
        />
        <ResultCard
          label={t('arb.results.gross')}
          value={grossDisp.display}
          fullValue={grossDisp.full}
          tone="primary"
        />
        <ResultCard
          label={t('arb.results.tradingSettle')}
          value={`−${combinedDisp.display}`}
          fullValue={`−${combinedDisp.full}`}
          tone="negative"
        />
      </ResultsGrid>

      <ResultsGrid cols={3}>
        <ResultCard
          label={t('arb.results.feeOn', { exchange: exchangeA })}
          value={`−${feeADisp.display}`}
          fullValue={`−${feeADisp.full}`}
          tone="negative"
          size="sm"
        />
        <ResultCard
          label={t('arb.results.feeOn', { exchange: exchangeB })}
          value={`−${feeBDisp.display}`}
          fullValue={`−${feeBDisp.full}`}
          tone="negative"
          size="sm"
        />
        <ResultCard
          label={t('arb.results.totalFees')}
          value={`−${totalFeesDisp.display}`}
          fullValue={`−${totalFeesDisp.full}`}
          tone="negative"
          size="sm"
        />
      </ResultsGrid>

      <ResultsGrid cols={3}>
        <ResultCard
          label={t('arb.results.withdrawal')}
          value={`−${withdrawDisp.display}`}
          fullValue={`−${withdrawDisp.full}`}
          tone="negative"
          size="sm"
        />
        <ResultCard
          label={t('arb.results.fiatRails')}
          value={`−${railsDisp.display}`}
          fullValue={`−${railsDisp.full}`}
          tone="negative"
          size="sm"
        />
        <ResultCard
          label={t('arb.results.estSlippage')}
          value={`−${slipDisp.display}`}
          fullValue={`−${slipDisp.full}`}
          tone="negative"
          size="sm"
        />
      </ResultsGrid>

      {/* spec-exception: bespoke cost-waterfall visualization; ResultCard/ResultsGrid cannot express per-leg progress bars. Follow-up: extract into a shared WaterfallChart primitive. */}
      <div
        className="calc-surface-subtle space-y-3 p-4"
        aria-label={t('aria.arbitrageNetProfit')}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="calc-text-label text-foreground">{t('arb.results.waterfall')}</span>
          <span className="calc-text-small text-muted-foreground">{t('arb.results.grossLess')}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs">
            <span className="w-32 text-muted-foreground truncate">{t('arb.results.grossSpread')}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-primary/20">
              <div className="h-full bg-primary" style={{ width: '100%' }} />
            </div>
            <span className="w-24 text-right calc-text-mono text-foreground" title={grossDisp.full}>
              {grossDisp.display}
            </span>
          </div>
          {results.costLegs.map((leg) => {
            const width = results.grossProfit > 0 ? Math.min(100, (leg.amount / results.grossProfit) * 100) : 100;
            const legDisp = disp(leg.amount);
            return (
              <div key={leg.label} className="flex items-center gap-3 text-xs">
                <span className="w-32 truncate text-muted-foreground">{leg.label}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-destructive/70" style={{ width: `${width}%` }} />
                </div>
                <span className="w-24 text-right calc-text-mono text-destructive" title={`−${legDisp.full}`}>
                  −{legDisp.display}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </ResultPanel>
  );
};
