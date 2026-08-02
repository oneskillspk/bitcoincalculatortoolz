import React, { useState } from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { ShareExportPanel, downloadStandardPdf } from '@/components/share-export';
import { useToast } from '@/hooks/use-toast';
import { EnhancedTaxCalculation, TaxConfiguration, EnhancedTaxCalculatorService } from '@/services/enhancedTaxCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFileDownload } from '@/hooks/useFileDownload';
import { csvNumber, csvPercent } from '@/utils/csvExport';

interface TaxExportShareProps {
  results: EnhancedTaxCalculation;
  config: TaxConfiguration;
}

const pageUrl = 'https://bitcoincalculator.tools/calculators/capital-gains-tax';
const money = (n: number) => `$${formatGroupedInt(n, 'en-US')}`;

export const TaxExportShare: React.FC<TaxExportShareProps> = ({ results, config }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState<'pdf' | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { exportCsv } = useFileDownload();

  const report = EnhancedTaxCalculatorService.generateTaxReport(results, config);

  const exportPDF = async () => {
    setBusy('pdf');
    try {
      await downloadStandardPdf({
        title: report.title,
        subtitle: `${report.jurisdiction}${report.state ? ` · ${report.state}` : ''} · ${report.filingStatus} · ${report.taxYear}`,
        language,
        filename: { en: 'bitcoin-tax-report', tr: 'bitcoin-vergi-raporu' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/capital-gains-tax',
        headline: {
          label: tr ? 'Toplam Vergi Yükümlülüğü' : 'Total Tax Liability',
          value: report.totalTaxLiability,
          accent: 'danger',
        },
        sections: [
          {
            heading: tr ? 'Federal Özet' : 'Federal Summary',
            rows: [
              [tr ? 'Toplam Kazanç' : 'Total Gains', report.federalSummary.totalGains],
              [tr ? 'Toplam Kayıp' : 'Total Losses', report.federalSummary.totalLosses],
              [tr ? 'Net Sermaye Kazancı' : 'Net Capital Gains', report.federalSummary.netCapitalGains],
              [tr ? 'Federal Vergi' : 'Federal Tax Owed', report.federalSummary.federalTaxOwed],
              ['NIIT', report.federalSummary.niitTax],
              [tr ? 'Efektif Oran' : 'Effective Rate', report.federalSummary.effectiveTaxRate],
            ],
          },
          ...(report.stateSummary ? [{
            heading: tr ? 'Eyalet Özeti' : 'State Summary',
            rows: [
              [tr ? 'Eyalet Vergisi' : 'State Tax Owed', report.stateSummary.stateTaxOwed],
              [tr ? 'Eyalet Efektif Oran' : 'State Effective Rate', report.stateSummary.effectiveTaxRate],
            ] as [string, string][],
          }] : []),
          {
            heading: tr ? 'Toplamlar' : 'Totals',
            rows: [
              [tr ? 'Toplam Vergi' : 'Total Tax Liability', report.totalTaxLiability],
              [tr ? 'Vergi Sonrası Net' : 'Net Proceeds After Tax', report.netProceedsAfterTax],
            ],
          },
          {
            kind: 'table',
            heading: tr ? 'Dağılım' : 'Breakdown',
            columns: [tr ? 'Süre' : 'Term', tr ? 'Kazanç' : 'Gains', tr ? 'Kayıp' : 'Losses'],
            rows: [
              [tr ? 'Kısa vadeli' : 'Short-term', report.breakdown.shortTerm.gains, report.breakdown.shortTerm.losses],
              [tr ? 'Uzun vadeli' : 'Long-term', report.breakdown.longTerm.gains, report.breakdown.longTerm.losses],
            ],
          },
          ...(report.optimizationSuggestions.length ? [{
            kind: 'note' as const,
            heading: tr ? 'Optimizasyon Önerileri' : 'Optimization Suggestions',
            body: report.optimizationSuggestions.map((s: string) => `• ${s}`).join('\n'),
          }] : []),
        ],
        disclaimer: tr
          ? ['Bu rapor yalnızca bilgilendirme amaçlıdır; vergi tavsiyesi değildir. Bir vergi uzmanına danışın.']
          : ['This report is for informational purposes only and is not tax advice. Consult a tax professional.'],
      });
    } finally { setBusy(null); }
  };

  /** CSV mirrors the PDF's federal/state summary so both exports always agree. */
  const exportCSV = () => {
    exportCsv({
      meta: {
        calculator: tr ? 'Bitcoin Sermaye Kazancı Vergi Hesaplayıcı' : 'Bitcoin Capital Gains Tax Calculator',
        currency: 'USD',
        path: '/calculators/capital-gains-tax',
        extraRows: [
          [tr ? 'Vergi yılı' : 'Tax year', String(config.taxYear)],
          [tr ? 'Yetki alanı' : 'Jurisdiction', report.jurisdiction],
          ...(report.state ? [[tr ? 'Eyalet' : 'State', report.state] as [string, string]] : []),
          [tr ? 'Beyan durumu' : 'Filing status', report.filingStatus],
        ],
      },
      filename: { en: 'bitcoin-tax-report', tr: 'bitcoin-vergi-raporu' },
      columns: tr ? ['Metrik', 'Değer'] : ['Metric', 'Value'],
      rows: [
        [tr ? 'Kısa vadeli kazanç (USD)' : 'Short-term gains (USD)', csvNumber(results.shortTermGains)],
        [tr ? 'Uzun vadeli kazanç (USD)' : 'Long-term gains (USD)', csvNumber(results.longTermGains)],
        [tr ? 'Net sermaye kazancı (USD)' : 'Net capital gains (USD)', csvNumber(results.netCapitalGains)],
        [tr ? 'Federal vergi (USD)' : 'Federal tax (USD)', csvNumber(results.federalTax.totalTax)],
        [tr ? 'Eyalet vergisi (USD)' : 'State tax (USD)', csvNumber(results.stateTax?.totalTax ?? 0)],
        [tr ? 'Toplam vergi yükümlülüğü (USD)' : 'Total tax liability (USD)', csvNumber(results.totalTaxLiability)],
        [tr ? 'Federal efektif oran' : 'Federal effective rate', csvPercent(results.federalTax.effectiveTaxRate, { asRatio: true })],
        [tr ? 'Vergi sonrası net (USD)' : 'Net proceeds after tax (USD)', csvNumber(results.netProceedsAfterTax)],
      ],
    });
  };

  const shareText = tr
    ? `📊 Bitcoin Sermaye Kazancı Vergi Raporu (${config.taxYear}): Toplam Vergi ${money(results.totalTaxLiability)} · Efektif Oran ${(results.federalTax.effectiveTaxRate * 100).toFixed(1)}% · Net ${money(results.netProceedsAfterTax)}\n\n${pageUrl}`
    : `📊 Bitcoin Capital Gains Tax Report (${config.taxYear}): Total Tax ${money(results.totalTaxLiability)} · Effective Rate ${(results.federalTax.effectiveTaxRate * 100).toFixed(1)}% · Net Proceeds ${money(results.netProceedsAfterTax)}\n\n${pageUrl}`;

  const shareToTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  const shareToLinkedin = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, '_blank');
  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({ title: tr ? 'Kopyalandı!' : 'Copied!' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: tr ? 'Hata' : 'Error', variant: 'destructive' });
    }
  };

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: exportPDF, loading: busy === 'pdf' },
        { kind: 'csv', onClick: exportCSV },
        { kind: 'copy-link', onClick: copyShareText, copied },
        { kind: 'twitter', onClick: shareToTwitter },
        { kind: 'linkedin', onClick: shareToLinkedin },
      ]}
    />
  );
};
