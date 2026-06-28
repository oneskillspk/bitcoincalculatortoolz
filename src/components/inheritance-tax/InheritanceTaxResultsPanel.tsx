import React from 'react';
import { InheritanceTaxResult } from '@/services/inheritanceTaxCalculator';
import { DollarSign, TrendingUp, Shield, AlertTriangle, CheckCircle, PieChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoney } from '@/utils/formatMoney';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';
import { ResultPanel, ResultsGrid, ResultCard, ResultRow, ResultBadge } from '@/components/calculator';

interface Props {
  results: InheritanceTaxResult;
}

export const InheritanceTaxResultsPanel: React.FC<Props> = ({ results }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const formatUSD = (value: number) => formatMoney(value, { tr, fxRate, decimals: 0 });
  const dispCard = (value: number) => {
    const v = tr ? value * (fxRate || 1) : value;
    const code = tr ? 'TRY' : 'USD';
    return formatCurrencyForDisplay(v, code, { fullDecimals: 2, locale: tr ? 'tr-TR' : 'en-US' });
  };

  return (
    <div className="space-y-6"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Calculator result">
      <ResultPanel
        eyebrow={tr ? 'Özet' : 'Summary'}
        title={tr ? 'Toplam Vergi Özeti' : 'Total Tax Summary'}
        icon={<PieChart />}
        accentBar={results.totalTaxLiability > 0 ? 'negative' : 'positive'}
      >
        <ResultsGrid cols={2}>
          {(() => { const d = dispCard(results.bitcoinValue); return (
          <ResultCard
            label={tr ? 'Miras Kalan BTC Değeri' : 'Inherited BTC Value'}
            value={d.display}
            fullValue={d.full}
          />); })()}
          {(() => { const d = dispCard(results.netInheritanceValue); return (
          <ResultCard
            label={tr ? 'Tüm Vergilerden Sonra Net' : 'Net After All Taxes'}
            value={d.display}
            fullValue={d.full}
            tone="positive"
          />); })()}
        </ResultsGrid>

        <div className="space-y-1 pt-2">
          <ResultRow label={tr ? 'Sermaye Kazanç Vergisi (UZÜV)' : 'Capital Gains Tax (LTCG)'} value={formatUSD(results.estimatedCapitalGainsTax)} />
          {results.niitTax > 0 && (
            <ResultRow label={`NIIT ${tr ? 'Ek Vergisi' : 'Surtax'} (3.8%)`} value={formatUSD(results.niitTax)} />
          )}
          {results.proportionalEstateTax > 0 && (
            <ResultRow label={tr ? 'Miras Vergisi (BTC payı)' : 'Estate Tax (BTC share)'} value={formatUSD(results.proportionalEstateTax)} />
          )}
          <ResultRow
            label={tr ? 'Toplam Vergi Yükümlülüğü' : 'Total Tax Liability'}
            value={formatUSD(results.totalTaxLiability)}
            tone={results.totalTaxLiability > 0 ? 'negative' : 'positive'}
            emphasis
            divider
          />
          <ResultRow
            label={tr ? 'Efektif Vergi Oranı' : 'Effective Tax Rate'}
            value={`${results.effectiveTaxRate.toFixed(1)}%`}
            tone="muted"
          />
        </div>
      </ResultPanel>

      <ResultPanel
        eyebrow={tr ? 'Avantaj' : 'Benefit'}
        title={tr ? 'Yükseltilmiş Maliyet Tabanı Faydası' : 'Step-Up Basis Benefit'}
        icon={<Shield />}
        accentBar="positive"
      >
        <ResultsGrid cols={2}>
          {(() => { const d = dispCard(results.stepUpBasis); return (
          <ResultCard
            label={tr ? 'Yükseltilmiş Maliyet Tabanınız' : 'Your Stepped-Up Basis'}
            value={d.display}
            fullValue={d.full}
            sub={tr ? 'BTC başına' : 'per BTC'}
          />); })()}
          {(() => { const d = dispCard(results.taxSavingsFromStepUp); return (
          <ResultCard
            label={tr ? 'Yükseltmeden Vergi Tasarrufu' : 'Tax Savings from Step-Up'}
            value={d.display}
            fullValue={d.full}
            sub={tr ? 'orijinal maliyet tabanına göre' : 'vs. original cost basis'}
            tone="positive"
          />); })()}
        </ResultsGrid>
        <ResultRow label={tr ? 'Sermaye Kazancı (yükseltme ile)' : 'Capital Gain (with step-up)'} value={formatUSD(results.capitalGainWithStepUp)} divider />
        <ResultRow label={tr ? 'Sermaye Kazancı (yükseltme olmadan)' : 'Capital Gain (without step-up)'} value={formatUSD(results.capitalGainWithoutStepUp)} />
      </ResultPanel>

      <ResultPanel
        eyebrow={tr ? 'Vergi' : 'Tax'}
        title={tr ? 'Sermaye Kazanç Vergisi (Bugün Satılırsa)' : 'Capital Gains Tax (If Sold Today)'}
        icon={<DollarSign />}
      >
        <ResultRow label={tr ? 'Uzun Vadeli Sermaye Kazanç Vergisi' : 'Long-Term Capital Gains Tax'} value={formatUSD(results.estimatedCapitalGainsTax)} />
        {results.niitTax > 0 && (
          <ResultRow label={tr ? 'Net Yatırım Geliri Vergisi (3.8%)' : 'Net Investment Income Tax (3.8%)'} value={formatUSD(results.niitTax)} />
        )}
        <ResultRow label={tr ? 'Toplam Sermaye Kazanç Vergisi' : 'Total Capital Gains Tax'} value={formatUSD(results.totalCapitalGainsTax)} emphasis divider />
      </ResultPanel>

      <ResultPanel
        eyebrow="Federal"
        title={tr ? 'Federal Miras Vergisi' : 'Federal Estate Tax'}
        icon={<TrendingUp />}
        action={
          results.federalEstateTax === 0 ? (
            <ResultBadge tone="positive" icon={<CheckCircle />}>
              {tr ? 'Muafiyet altında' : 'Below exemption'}
            </ResultBadge>
          ) : undefined
        }
      >
        <ResultRow label={tr ? 'Federal Muafiyet (2026)' : 'Federal Exemption (2026)'} value={formatUSD(results.federalExemption)} />
        <ResultRow label={tr ? 'Vergilendirilebilir Miras Miktarı' : 'Taxable Estate Amount'} value={formatUSD(results.taxableEstate)} />
        <ResultRow
          label={tr ? 'Federal Miras Vergisi' : 'Federal Estate Tax'}
          value={results.federalEstateTax > 0 ? formatUSD(results.federalEstateTax) : formatUSD(0)}
          tone={results.federalEstateTax > 0 ? 'negative' : 'positive'}
          emphasis
          divider
        />
      </ResultPanel>

      {results.hasStateEstateTax && (
        <ResultPanel
          eyebrow={tr ? 'Eyalet' : 'State'}
          title={`${results.stateName} ${tr ? 'Eyalet Miras Vergisi' : 'State Estate Tax'}`}
          icon={<AlertTriangle />}
          accentBar={results.stateEstateTax > 0 ? 'negative' : 'none'}
        >
          <ResultRow label={tr ? 'Eyalet Muafiyeti' : 'State Exemption'} value={formatUSD(results.stateExemption)} />
          <ResultRow
            label={tr ? 'Eyalet Miras Vergisi' : 'State Estate Tax'}
            value={results.stateEstateTax > 0 ? formatUSD(results.stateEstateTax) : formatUSD(0)}
            tone={results.stateEstateTax > 0 ? 'negative' : 'positive'}
            emphasis
            divider
          />
        </ResultPanel>
      )}
    </div>
  );
};
