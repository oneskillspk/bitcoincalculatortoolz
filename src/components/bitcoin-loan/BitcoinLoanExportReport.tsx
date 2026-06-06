import React from 'react';
import { ShareExportPanel } from '@/components/share-export';
import { jsPDF } from 'jspdf';
import { applyLocalizedPdfFont } from '@/utils/pdfFont';
import { LoanResult } from '@/services/bitcoinLoanCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';

interface Props {
  results: LoanResult;
}

export const BitcoinLoanExportReport: React.FC<Props> = ({ results }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fmt = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    await applyLocalizedPdfFont(doc, language);
    const now = new Date().toLocaleDateString(tr ? 'tr-TR' : 'en-US');

    doc.setFontSize(20);
    doc.text(tr ? 'Bitcoin Kredi & Teminat Raporu' : 'Bitcoin Loan & Collateral Report', 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(128);
    doc.text(`${tr ? 'Oluşturuldu:' : 'Generated on'} ${now} • bitcoincalculator.tools`, 20, 33);

    doc.setDrawColor(200);
    doc.line(20, 37, 190, 37);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(tr ? 'Kredi Özeti' : 'Loan Overview', 20, 50);

    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(`${tr ? 'Teminat Değeri:' : 'Collateral Value:'} ${fmt(results.collateralValueUsd)}`, 25, 60);
    doc.text(`${tr ? 'Kredi Tutarı:' : 'Loan Amount:'} ${fmt(results.loanAmountUsd)}`, 25, 68);
    doc.text(`${tr ? 'Güncel LTV:' : 'Current LTV:'} ${results.currentLtv.toFixed(1)}%`, 25, 76);
    doc.text(`${tr ? 'Risk Seviyesi:' : 'Risk Level:'} ${results.riskLevel.toUpperCase()}`, 25, 84);
    doc.text(`${tr ? 'Sağlık Faktörü:' : 'Health Factor:'} ${results.healthFactor.toFixed(2)}`, 25, 92);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(tr ? 'Likidasyon & Teminat Çağrısı' : 'Liquidation & Margin Call', 20, 108);

    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(`${tr ? 'Likidasyon Fiyatı:' : 'Liquidation Price:'} ${fmt(results.liquidationPrice)}`, 25, 118);
    doc.text(`${tr ? 'Teminat Çağrısı Fiyatı:' : 'Margin Call Price:'} ${fmt(results.marginCallPrice)}`, 25, 126);
    doc.text(`${tr ? 'Likidasyona Uzaklık:' : 'Distance to Liquidation:'} ${results.distanceToLiquidation.toFixed(1)}%`, 25, 134);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(tr ? 'Maliyetler & Geri Ödeme' : 'Costs & Repayment', 20, 150);

    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(`${tr ? 'Aylık Ödeme:' : 'Monthly Payment:'} ${fmt(results.monthlyPayment)}`, 25, 160);
    doc.text(`${tr ? 'Toplam Faiz:' : 'Total Interest:'} ${fmt(results.totalInterestPaid)}`, 25, 168);
    doc.text(`${tr ? 'Toplam Geri Ödeme:' : 'Total Repayment:'} ${fmt(results.totalRepayment)}`, 25, 176);
    doc.text(`${tr ? 'Efektif APR:' : 'Effective APR:'} ${results.effectiveApr.toFixed(2)}%`, 25, 184);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(tr ? 'Borçlanma - Satış Karşılaştırması' : 'Borrow vs. Sell Comparison', 20, 200);

    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(`${tr ? 'Borçlanma Maliyeti:' : 'Borrow Cost:'} ${fmt(results.borrowCost)}`, 25, 210);
    doc.text(`${tr ? 'Satış Vergi Maliyeti:' : 'Sell Tax Cost:'} ${fmt(results.sellTaxCost)}`, 25, 218);
    doc.text(`${tr ? 'Net Borçlanma Avantajı:' : 'Net Borrow Advantage:'} ${fmt(results.netBorrowAdvantage)}`, 25, 226);

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      tr
        ? 'Yasal Uyarı: Bu rapor yalnızca bilgilendirme amaçlıdır ve finansal tavsiye niteliği taşımaz.'
        : 'Disclaimer: This report is for informational purposes only and does not constitute financial advice.',
      20, 280
    );

    doc.save(buildExportFilename({ en: 'bitcoin-loan-collateral-report', tr: 'bitcoin-kredi-teminat-raporu' }, 'pdf', language));
  };

  return (
    <ShareExportPanel
      description={tr ? 'Bitcoin kredi analizinizin PDF özetini indirin.' : 'Download a PDF summary of your Bitcoin loan analysis.'}
      actions={[{ kind: 'pdf', onClick: handleExportPDF }]}
    />
  );
};
