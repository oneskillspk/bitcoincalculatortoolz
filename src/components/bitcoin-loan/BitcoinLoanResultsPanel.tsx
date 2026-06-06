import React from 'react';
import { Progress } from '@/components/ui/progress';
import { LoanResult } from '@/services/bitcoinLoanCalculator';
import {
  Shield, AlertTriangle, TrendingUp, DollarSign,
  ArrowDownUp, Percent, Clock, Landmark, Scale,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoney, formatMoneyCompact } from '@/utils/formatMoney';
import { ResultPanel, ResultsGrid, ResultCard, ResultRow, ResultBadge } from '@/components/calculator';

interface Props {
  results: LoanResult;
}

const fmtPct = (n: number) => `${n.toFixed(1)}%`;

const riskTones: Record<string, 'positive' | 'warning' | 'negative'> = {
  low: 'positive',
  medium: 'warning',
  high: 'warning',
  critical: 'negative',
};

export const BitcoinLoanResultsPanel: React.FC<Props> = ({ results }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const fmt = (n: number) => formatMoney(n, { tr, fxRate, decimals: 0 });
  const fmtFull = (n: number) => formatMoney(n, { tr, fxRate, decimals: 2 });
  // Card-safe: compact above $100k, full amount tooltips on hover.
  const fmtCard = (n: number) => (Math.abs(n) >= 100_000 ? formatMoneyCompact(n, { tr, fxRate }) : fmt(n));

  const riskLabels: Record<string, string> = tr
    ? { low: 'DÜŞÜK RİSK', medium: 'ORTA RİSK', high: 'YÜKSEK RİSK', critical: 'KRİTİK RİSK' }
    : { low: 'LOW RISK', medium: 'MEDIUM RISK', high: 'HIGH RISK', critical: 'CRITICAL RISK' };

  const accentForRisk: 'positive' | 'primary' | 'negative' =
    results.riskLevel === 'critical' ? 'negative'
    : results.riskLevel === 'low' ? 'positive'
    : 'primary';

  const healthTone =
    results.healthFactor >= 1.5 ? 'positive'
    : results.healthFactor >= 1.2 ? 'default'
    : 'negative';

  return (
    <div className="space-y-6">
      <ResultPanel
        eyebrow={tr ? 'Sağlık' : 'Health'}
        title={tr ? 'Kredi Sağlığı' : 'Loan Health'}
        icon={<Shield />}
        accentBar={accentForRisk}
        action={
          <ResultBadge tone={riskTones[results.riskLevel] ?? 'neutral'}>
            {riskLabels[results.riskLevel] || results.riskLevel.toUpperCase()}
          </ResultBadge>
        }
      >
        <div className="space-y-2">
          <div className="flex justify-between calc-text-small">
            <span className="text-muted-foreground">{tr ? 'Mevcut LTV' : 'Current LTV'}</span>
            <span className="font-semibold text-foreground calc-text-mono">{fmtPct(results.currentLtv)}</span>
          </div>
          <Progress value={Math.min(results.currentLtv, 100)} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>{tr ? 'Güvenli <50%' : 'Safe <50%'}</span>
            <span>100%</span>
          </div>
        </div>

        <ResultRow
          label={tr ? 'Sağlık Faktörü' : 'Health Factor'}
          value={results.healthFactor.toFixed(2)}
          tone={healthTone as 'positive' | 'default' | 'negative'}
          sub={
            results.healthFactor >= 1.5
              ? (tr ? 'Sağlıklı — iyi teminatlı' : 'Healthy — well-collateralized')
              : results.healthFactor >= 1.2
                ? (tr ? 'Dikkat — yakından izleyin' : 'Caution — monitor closely')
                : (tr ? 'Tehlike — tasfiyeye yakın' : 'Danger — near liquidation')
          }
          divider
        />

        <ResultsGrid cols={2}>
          <ResultCard
            label={tr ? 'Teminat Tamamlama' : 'Margin Call'}
            value={fmtCard(results.marginCallPrice)}
            fullValue={fmtFull(results.marginCallPrice)}
            sub={`-${fmtPct(results.distanceToMarginCall)} ${tr ? 'mevcut fiyattan' : 'from current'}`}
            icon={<AlertTriangle />}
            tone="negative"
          />
          <ResultCard
            label={tr ? 'Tasfiye' : 'Liquidation'}
            value={fmtCard(results.liquidationPrice)}
            fullValue={fmtFull(results.liquidationPrice)}
            sub={`-${fmtPct(results.distanceToLiquidation)} ${tr ? 'mevcut fiyattan' : 'from current'}`}
            icon={<AlertTriangle />}
            tone="negative"
          />
        </ResultsGrid>
      </ResultPanel>

      <ResultPanel
        eyebrow={tr ? 'Maliyet' : 'Cost'}
        title={tr ? 'Kredi Maliyet Dökümü' : 'Loan Cost Breakdown'}
        icon={<DollarSign />}
      >
        {[
          { label: tr ? 'Kredi Miktarı' : 'Loan Amount', value: fmtCard(results.loanAmountUsd), full: fmtFull(results.loanAmountUsd), Icon: Landmark },
          { label: tr ? 'Aylık Ödeme' : 'Monthly Payment', value: fmtCard(results.monthlyPayment), full: fmtFull(results.monthlyPayment), Icon: Clock },
          { label: tr ? 'Toplam Faiz' : 'Total Interest', value: fmtCard(results.totalInterestPaid), full: fmtFull(results.totalInterestPaid), Icon: Percent },
          { label: tr ? 'Toplam Geri Ödeme' : 'Total Repayment', value: fmtCard(results.totalRepayment), full: fmtFull(results.totalRepayment), Icon: DollarSign },
          { label: tr ? 'Efektif Yıllık Faiz' : 'Effective APR', value: fmtPct(results.effectiveApr), full: undefined, Icon: TrendingUp, emphasis: true },
        ].map(({ label, value, full, Icon, emphasis }, i) => (
          <ResultRow
            key={label}
            label={
              <span className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                {label}
              </span>
            }
            value={value}
            fullValue={full}
            divider={i > 0}
            emphasis={emphasis}
          />
        ))}
      </ResultPanel>

      <ResultPanel
        eyebrow={tr ? 'Karşılaştırma' : 'Comparison'}
        title={tr ? 'Ödünç Alma vs Satış' : 'Borrow vs. Sell'}
        icon={<Scale />}
        accentBar={results.netBorrowAdvantage > 0 ? 'positive' : 'negative'}
      >
        <ResultsGrid cols={2}>
          <ResultCard
            label={tr ? 'Ödünç Alma Maliyeti' : 'Cost to Borrow'}
            value={fmtCard(results.borrowCost)}
            fullValue={fmtFull(results.borrowCost)}
            sub={tr ? 'Ödenen toplam faiz' : 'Total interest paid'}
            tone="primary"
          />
          <ResultCard
            label={tr ? 'Satış Maliyeti' : 'Cost to Sell'}
            value={fmtCard(results.sellTaxCost)}
            fullValue={fmtFull(results.sellTaxCost)}
            sub={tr ? 'Sermaye kazanç vergisi (%23.8)' : 'Capital gains tax (23.8%)'}
            tone="negative"
          />
        </ResultsGrid>

        {results.btcAppreciationGain > 0 && (
          <ResultRow
            label={
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                {tr ? 'BTC Değer Artışı (elde tutulursa)' : 'BTC Appreciation (if held)'}
              </span>
            }
            value={fmtCard(results.btcAppreciationGain)}
            fullValue={fmtFull(results.btcAppreciationGain)}
            sub={tr ? "BTC'nizi tutarak gerçekleşmemiş kazanç" : 'Unrealized gains by keeping your BTC'}
            tone="positive"
            divider
          />
        )}

        <ResultRow
          label={tr ? 'Ödünç Almanın Net Avantajı' : 'Net Advantage of Borrowing'}
          value={`${results.netBorrowAdvantage > 0 ? '+' : ''}${fmtCard(results.netBorrowAdvantage)}`}
          fullValue={`${results.netBorrowAdvantage > 0 ? '+' : ''}${fmtFull(results.netBorrowAdvantage)}`}
          sub={
            results.netBorrowAdvantage > 0
              ? (tr ? 'Ödünç almak satışa göre daha avantajlı' : 'Borrowing saves you money vs selling')
              : (tr ? 'Satmak ödünç almaktan daha ucuz olabilir' : 'Selling may be cheaper than borrowing')
          }
          tone={results.netBorrowAdvantage > 0 ? 'positive' : 'negative'}
          emphasis
          divider
        />
      </ResultPanel>

      {results.amortizationSchedule.length > 0 && (
        <ResultPanel
          eyebrow={tr ? 'Plan' : 'Schedule'}
          title={tr ? 'Geri Ödeme Planı (Önizleme)' : 'Repayment Schedule (Preview)'}
          icon={<ArrowDownUp />}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-2 text-muted-foreground font-medium">{tr ? 'Ay' : 'Month'}</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">{tr ? 'Ödeme' : 'Payment'}</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">{tr ? 'Anapara' : 'Principal'}</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">{tr ? 'Faiz' : 'Interest'}</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">{tr ? 'Bakiye' : 'Balance'}</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">{tr ? 'Tahmini LTV' : 'Proj. LTV'}</th>
                </tr>
              </thead>
              <tbody>
                {results.amortizationSchedule.filter((_, i) => {
                  const total = results.amortizationSchedule.length;
                  if (total <= 12) return true;
                  return i < 3 || i === Math.floor(total / 2) - 1 || i >= total - 2;
                }).map(entry => (
                  <tr key={entry.month} className="border-b border-border/20">
                    <td className="py-2 font-mono">{entry.month}</td>
                    <td className="py-2 text-right font-mono">{fmt(entry.payment)}</td>
                    <td className="py-2 text-right font-mono">{fmt(entry.principal)}</td>
                    <td className="py-2 text-right font-mono">{fmt(entry.interest)}</td>
                    <td className="py-2 text-right font-mono">{fmt(entry.remainingBalance)}</td>
                    <td className="py-2 text-right font-mono">{fmtPct(entry.projectedLtv)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ResultPanel>
      )}
    </div>
  );
};
