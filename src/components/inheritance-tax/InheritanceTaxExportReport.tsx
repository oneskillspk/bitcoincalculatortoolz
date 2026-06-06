import React from 'react';
import { ShareExportPanel } from '@/components/share-export';
import { jsPDF } from 'jspdf';
import { applyLocalizedPdfFont } from '@/utils/pdfFont';
import { InheritanceTaxResult } from '@/services/inheritanceTaxCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';

interface Props {
  results: InheritanceTaxResult;
}

export const InheritanceTaxExportReport: React.FC<Props> = ({ results }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fmt = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    await applyLocalizedPdfFont(doc, language);
    const now = new Date().toLocaleDateString(tr ? 'tr-TR' : 'en-US');

    doc.setFontSize(20);
    doc.text(tr ? 'Bitcoin Miras Vergi Raporu' : 'Bitcoin Inheritance Tax Report', 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(128);
    doc.text(`${tr ? 'Oluşturuldu:' : 'Generated on'} ${now} • bitcoincalculator.tools`, 20, 33);

    doc.setDrawColor(200);
    doc.line(20, 37, 190, 37);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(tr ? 'Adım-Artış Bazı Analizi' : 'Step-Up Basis Analysis', 20, 50);

    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(`${tr ? 'Adım-Artış Bazı (BTC başına):' : 'Step-Up Basis (per BTC):'} ${fmt(results.stepUpBasis)}`, 25, 60);
    doc.text(`${tr ? 'Adım-Artış Bazı (toplam):' : 'Step-Up Basis (total):'} ${fmt(results.stepUpBasisTotal)}`, 25, 68);
    doc.text(`${tr ? 'Adım-Artıştan Vergi Tasarrufu:' : 'Tax Savings from Step-Up:'} ${fmt(results.taxSavingsFromStepUp)}`, 25, 76);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(tr ? 'Miras Vergisi' : 'Estate Tax', 20, 92);

    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(`${tr ? 'Federal Miras Vergisi:' : 'Federal Estate Tax:'} ${fmt(results.federalEstateTax)}`, 25, 102);
    doc.text(`${tr ? 'Eyalet Miras Vergisi' : 'State Estate Tax'} (${results.stateName}): ${fmt(results.stateEstateTax)}`, 25, 110);
    doc.text(`${tr ? 'Vergiye Tabi Miras:' : 'Taxable Estate:'} ${fmt(results.taxableEstate)}`, 25, 118);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(tr ? 'Sermaye Kazancı (Satılırsa)' : 'Capital Gains (If Sold)', 20, 134);

    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(`${tr ? 'Sermaye Kazancı (adım-artışla):' : 'Capital Gain (with step-up):'} ${fmt(results.capitalGainWithStepUp)}`, 25, 144);
    doc.text(`${tr ? 'Tahmini Sermaye Kazancı Vergisi:' : 'Estimated Capital Gains Tax:'} ${fmt(results.totalCapitalGainsTax)}`, 25, 152);
    doc.text(`NIIT ${tr ? 'Ek Vergisi' : 'Surtax'} (3.8%): ${fmt(results.niitTax)}`, 25, 160);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(tr ? 'Özet' : 'Summary', 20, 176);

    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(`${tr ? 'Toplam Vergi Yükümlülüğü:' : 'Total Tax Liability:'} ${fmt(results.totalTaxLiability)}`, 25, 186);
    doc.text(`${tr ? 'Net Miras Değeri:' : 'Net Inheritance Value:'} ${fmt(results.netInheritanceValue)}`, 25, 194);
    doc.text(`${tr ? 'Efektif Vergi Oranı:' : 'Effective Tax Rate:'} ${results.effectiveTaxRate.toFixed(1)}%`, 25, 202);

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      tr
        ? 'Yasal Uyarı: Bu rapor yalnızca bilgilendirme amaçlıdır ve vergi veya hukuki tavsiye niteliği taşımaz.'
        : 'Disclaimer: This report is for informational purposes only and does not constitute tax or legal advice.',
      20, 280
    );

    doc.save(buildExportFilename({ en: 'bitcoin-inheritance-tax-report', tr: 'bitcoin-veraset-vergisi-raporu' }, 'pdf', language));
  };

  return (
    <ShareExportPanel
      description={tr ? 'Miras vergisi analizinizin PDF özetini indirin.' : 'Download a PDF summary of your inheritance tax analysis.'}
      actions={[{ kind: 'pdf', onClick: handleExportPDF }]}
    />
  );
};
