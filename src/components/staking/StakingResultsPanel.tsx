import { Shield, TrendingUp } from 'lucide-react';
import { type StakingResult, formatBTC, RATES_LAST_UPDATED } from '@/services/stakingCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultsGrid, ResultCard, ResultBadge, ResultRow } from '@/components/calculator';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';

const dispUSD = (n: number) => formatCurrencyForDisplay(n, 'USD', { fullDecimals: 2 });

interface StakingResultsPanelProps {
  result: StakingResult;
}

const TYPE_LABEL_EN: Record<string, string> = {
  native: 'Native BTC',
  wrapped: 'Wrapped BTC (DeFi)',
  custodial: 'Custodial',
};
const TYPE_LABEL_TR: Record<string, string> = {
  native: 'Yerel BTC',
  wrapped: 'Sarılı BTC (DeFi)',
  custodial: 'Saklama',
};

export const StakingResultsPanel = ({ result }: StakingResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const {
    protocol,
    btcAmount,
    finalBtcBalance,
    btcRewards,
    usdRewardsAtCurrentPrice,
    usdFinalValueAtCurrentPrice,
    effectiveAPY,
    yearlyBreakdown,
  } = result;

  const RISK_LABEL: Record<string, string> = {
    low: tr ? 'Düşük Risk' : 'Low Risk',
    medium: tr ? 'Orta Risk' : 'Medium Risk',
    high: tr ? 'Yüksek Risk (Saklama)' : 'High Risk (Custodial)',
  };

  const riskTone = protocol.riskLevel === 'low' ? 'positive' : protocol.riskLevel === 'medium' ? 'warning' : 'negative';

  return (
    <ResultPanel
      icon={<TrendingUp style={{ color: protocol.color }} />}
      eyebrow={`${tr ? TYPE_LABEL_TR[protocol.type] : TYPE_LABEL_EN[protocol.type]} · ${protocol.lockPeriod} ${tr ? 'kilit' : 'lock'}`}
      title={protocol.name}
      action={
        <div className="flex flex-col items-end gap-1">
          <ResultBadge tone="primary">{(protocol.apy * 100).toFixed(1)}% APY</ResultBadge>
          <ResultBadge tone={riskTone as 'positive' | 'warning' | 'negative'}>{RISK_LABEL[protocol.riskLevel]}</ResultBadge>
        </div>
      }
      accentBar="primary"
      footer={
        <div className="flex items-start gap-2">
          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p className="calc-text-small text-muted-foreground">
            {tr
              ? `APY, ${RATES_LAST_UPDATED} tarihi itibarıyla kamuya açık oranlara dayanmaktadır. Oranlar sık değişir — staking yapmadan önce protokolün resmi sitesinde doğrulayın.`
              : `APY based on publicly published rates as of ${RATES_LAST_UPDATED}. Rates change frequently — always verify on the protocol's official site before staking.`}
          </p>
        </div>
      }
    
      aria-live="polite"
      aria-atomic="true"
      aria-label="Calculator result">
      <ResultsGrid cols={2}>
        {(() => { const r = dispUSD(usdRewardsAtCurrentPrice); return (
        <ResultCard
          label={tr ? 'Kazanılan BTC Ödülü' : 'BTC Rewards Earned'}
          value={formatBTC(btcRewards)}
          sub={r.display}
          tone="positive"
        />); })()}
        {(() => { const r = dispUSD(usdFinalValueAtCurrentPrice); return (
        <ResultCard
          label={tr ? 'Nihai BTC Bakiyesi' : 'Final BTC Balance'}
          value={formatBTC(finalBtcBalance)}
          sub={r.display}
          tone="primary"
        />); })()}
        {(() => { const r = dispUSD(usdRewardsAtCurrentPrice); return (
        <ResultCard
          label={tr ? 'USD Ödülü (güncel fiyatla)' : 'USD Rewards (at current price)'}
          value={r.display}
          fullValue={r.full}
          sub={`${tr ? 'kaynak' : 'from'} ${formatBTC(btcRewards)}`}
        />); })()}
        <ResultCard
          label={tr ? 'Efektif Yıllık Getiri' : 'Effective APY'}
          value={`${effectiveAPY.toFixed(2)}%`}
          sub={`${yearlyBreakdown.length} ${tr ? 'yıl boyunca' : `year${yearlyBreakdown.length !== 1 ? 's' : ''}`}`}
          tone="primary"
        />
      </ResultsGrid>

      <div className="calc-surface-subtle px-4 py-2">
        <ResultRow label={tr ? 'Anapara' : 'Principal'} value={formatBTC(btcAmount)} emphasis />
      </div>
    </ResultPanel>
  );
};
