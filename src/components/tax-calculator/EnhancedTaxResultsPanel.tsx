import React from 'react';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Info,
  FileText,
} from 'lucide-react';
import { EnhancedTaxCalculation, TaxConfiguration, EnhancedTaxCalculatorService } from '@/services/enhancedTaxCalculator';
import { TaxExportShare } from '@/components/tax-calculator/TaxExportShare';
import { TaxCalculationBreakdown } from './TaxCalculationBreakdown';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultsGrid, ResultCard, ResultHero, ResultRow } from '@/components/calculator';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface EnhancedTaxResultsPanelProps {
  results: EnhancedTaxCalculation;
  config: TaxConfiguration;
}

export const EnhancedTaxResultsPanel = ({ results, config }: EnhancedTaxResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const { federalTax, stateTax, totalTaxLiability, netProceedsAfterTax, optimizationSuggestions, summary } = results;

  const formatCurrency = (amount: number) => EnhancedTaxCalculatorService.formatCurrency(amount);
  const formatPercentage = (value: number) => EnhancedTaxCalculatorService.formatPercentage(value);
  const disp = (n: number) => formatCurrencyForDisplay(n, 'USD');

  const isGain = federalTax.netCapitalGains >= 0;

  return (
    <div className="space-y-6">
      <ResultPanel
        eyebrow={tr ? 'Vergi özeti' : 'Tax summary'}
        title={tr ? 'Vergi Yükümlülüğü Özeti' : 'Tax Liability Summary'}
        icon={<Calculator />}
        accentBar="primary"
      >
        <ResultHero
          label={tr ? `Toplam Ödenecek Vergi (${config.taxYear})` : `Total Tax Owed (${config.taxYear})`}
          value={disp(totalTaxLiability).display}
          fullValue={formatCurrency(totalTaxLiability)}
          sub={
            <>
              {tr ? 'Efektif Oran: ' : 'Effective Rate: '}
              {formatPercentage((totalTaxLiability / Math.max(federalTax.totalGains, 1)) * 100)}
            </>
          }
        />

        <Separator />

        <ResultsGrid cols={2}>
          <div className="space-y-1 calc-surface-subtle p-4">
            <ResultRow label={tr ? 'Federal Vergi' : 'Federal Tax'} value={disp(federalTax.totalTaxOwed).display} fullValue={formatCurrency(federalTax.totalTaxOwed)} emphasis />
            {federalTax.niitTax > 0 && (
              <ResultRow label="+ NIIT (3.8%)" value={disp(federalTax.niitTax).display} fullValue={formatCurrency(federalTax.niitTax)} />
            )}
            <ResultRow label={tr ? 'Efektif Oran' : 'Effective Rate'} value={formatPercentage(federalTax.effectiveTaxRate)} tone="muted" />
          </div>

          {stateTax && (
            <div className="space-y-1 calc-surface-subtle p-4">
              <ResultRow label={tr ? `Eyalet Vergisi (${config.state})` : `State Tax (${config.state})`} value={disp(stateTax.totalTaxOwed).display} fullValue={formatCurrency(stateTax.totalTaxOwed)} emphasis />
              <ResultRow label={tr ? 'Efektif Oran' : 'Effective Rate'} value={formatPercentage(stateTax.effectiveTaxRate)} tone="muted" />
            </div>
          )}
        </ResultsGrid>
      </ResultPanel>

      <ResultPanel
        eyebrow={tr ? 'Kazanç/kayıp' : 'Gains/losses'}
        title={tr ? 'Sermaye Kazançları ve Kayıpları' : 'Capital Gains & Losses'}
        icon={isGain ? <TrendingUp /> : <TrendingDown />}
        accentBar={isGain ? 'positive' : 'negative'}
      >
        <ResultHero
          label={tr ? 'Net Sermaye Kazancı/Kaybı' : 'Net Capital Gains/Losses'}
          value={disp(federalTax.netCapitalGains).display}
          fullValue={formatCurrency(federalTax.netCapitalGains)}
        />

        <ResultsGrid cols={2}>
          <div className="calc-surface-subtle p-4">
            <h4 className="font-semibold text-foreground mb-2">{tr ? 'Kısa Vadeli (≤ 1 yıl)' : 'Short-term (≤ 1 year)'}</h4>
            <ResultRow label={tr ? 'Kazançlar' : 'Gains'} value={disp(federalTax.shortTermGains).display} fullValue={formatCurrency(federalTax.shortTermGains)} tone="positive" />
            <ResultRow label={tr ? 'Kayıplar' : 'Losses'} value={`-${disp(federalTax.shortTermLosses).display}`} fullValue={`-${formatCurrency(federalTax.shortTermLosses)}`} tone="negative" />
            <ResultRow
              label={tr ? 'Net Kısa Vadeli' : 'Net Short-term'}
              value={disp(federalTax.shortTermGains - federalTax.shortTermLosses).display}
              fullValue={formatCurrency(federalTax.shortTermGains - federalTax.shortTermLosses)}
              tone={federalTax.shortTermGains - federalTax.shortTermLosses >= 0 ? 'positive' : 'negative'}
              emphasis
              divider
            />
          </div>
          <div className="calc-surface-subtle p-4">
            <h4 className="font-semibold text-foreground mb-2">{tr ? 'Uzun Vadeli (> 1 yıl)' : 'Long-term (> 1 year)'}</h4>
            <ResultRow label={tr ? 'Kazançlar' : 'Gains'} value={disp(federalTax.longTermGains).display} fullValue={formatCurrency(federalTax.longTermGains)} tone="positive" />
            <ResultRow label={tr ? 'Kayıplar' : 'Losses'} value={`-${disp(federalTax.longTermLosses).display}`} fullValue={`-${formatCurrency(federalTax.longTermLosses)}`} tone="negative" />
            <ResultRow
              label={tr ? 'Net Uzun Vadeli' : 'Net Long-term'}
              value={disp(federalTax.longTermGains - federalTax.longTermLosses).display}
              fullValue={formatCurrency(federalTax.longTermGains - federalTax.longTermLosses)}
              tone={federalTax.longTermGains - federalTax.longTermLosses >= 0 ? 'positive' : 'negative'}
              emphasis
              divider
            />
          </div>
        </ResultsGrid>
      </ResultPanel>

      <ResultPanel
        eyebrow={tr ? 'Performans' : 'Performance'}
        title={tr ? 'Portföy Performansı' : 'Portfolio Performance'}
        icon={<DollarSign />}
      >
        <ResultsGrid cols={4}>
          <ResultCard label={tr ? 'Toplam İşlem' : 'Total Transactions'} value={summary.totalTransactions} size="sm" />
          <ResultCard label={tr ? 'İşlem Gören Bitcoin' : 'Bitcoin Traded'} value={`${summary.totalBitcoinTraded.toFixed(4)} BTC`} size="sm" />
          <ResultCard label={tr ? 'Ort. Elde Tutma' : 'Avg Holding Period'} value={`${Math.round(summary.averageHoldingPeriod)} ${tr ? 'gün' : 'd'}`} size="sm" />
          <ResultCard label={tr ? 'Vergi Sonrası Net' : 'Net After Tax'} value={disp(netProceedsAfterTax).display} fullValue={formatCurrency(netProceedsAfterTax)} tone="primary" size="sm" />
        </ResultsGrid>
      </ResultPanel>

      <TaxCalculationBreakdown calculation={results} config={config} />

      <TaxExportShare results={results} config={config} />

      {optimizationSuggestions.length > 0 && (
        <ResultPanel
          eyebrow={tr ? 'Öneriler' : 'Suggestions'}
          title={tr ? 'Vergi Optimizasyon Önerileri' : 'Tax Optimization Suggestions'}
          icon={<Info />}
        >
          <div className="space-y-3">
            {optimizationSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-[var(--calc-radius-input)] bg-primary/5 border border-primary/10">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">{suggestion}</p>
              </div>
            ))}
          </div>
        </ResultPanel>
      )}

      {summary.washSaleWarnings > 0 && (
        <ResultPanel
          eyebrow={tr ? 'Uyarı' : 'Warning'}
          title={tr ? 'Wash Sale Uyarısı' : 'Wash Sale Warning'}
          icon={<AlertTriangle />}
          accentBar="negative"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tr
              ? `${summary.washSaleWarnings} olası wash sale tespit edildi. Doğru işlem için bir vergi uzmanına danışın.`
              : `${summary.washSaleWarnings} potential wash sale(s) detected. Consult a tax professional for proper handling.`}
          </p>
        </ResultPanel>
      )}

      <ResultPanel
        eyebrow={tr ? 'Yasal' : 'Legal'}
        title={tr ? 'Önemli Vergi Sorumluluk Reddi' : 'Important Tax Disclaimer'}
        icon={<FileText />}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {tr
            ? 'Bu hesaplayıcı yalnızca tahmin amaçlıdır ve profesyonel vergi tavsiyesinin yerini tutmamalıdır. Vergi yasaları karmaşıktır ve yargı bölgesine göre değişir. Doğru vergi planlaması ve resmi vergi beyannamesi hazırlığı için her zaman nitelikli bir vergi uzmanı veya CPA ile görüşün.'
            : 'This calculator provides estimates only and should not be used as a substitute for professional tax advice. Tax laws are complex and vary by jurisdiction. Always consult with a qualified tax professional or CPA for accurate tax planning and official tax return preparation.'}
        </p>
      </ResultPanel>
    </div>
  );
};
