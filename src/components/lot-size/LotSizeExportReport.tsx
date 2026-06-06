import React from 'react';
import { ShareExportPanel } from '@/components/share-export';
import { LotSizeResult } from '@/services/lotSizeCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';

interface LotSizeExportReportProps {
  result: LotSizeResult;
  entryPrice: number;
  stopLossPrice: number;
  riskPercent: number;
  accountBalance: number;
  leverage: number;
  brokerName: string;
}

export const LotSizeExportReport: React.FC<LotSizeExportReportProps> = ({
  result, entryPrice, stopLossPrice, riskPercent, accountBalance, leverage, brokerName
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const handleExport = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const now = new Date().toLocaleString(tr ? 'tr-TR' : 'en-US');

      doc.setFontSize(18);
      doc.text(tr ? 'Bitcoin Lot Boyutu Raporu' : 'Bitcoin Lot Size Report', 20, 25);
      doc.setFontSize(10);
      doc.setTextColor(128);
      doc.text(`${tr ? 'Oluşturuldu:' : 'Generated:'} ${now} | bitcoincalculator.tools`, 20, 33);

      doc.setTextColor(0);
      doc.setFontSize(12);
      let y = 48;
      const lines: [string, string][] = [
        [tr ? 'Hesap Bakiyesi' : 'Account Balance', `$${accountBalance.toLocaleString()}`],
        [tr ? 'İşlem Başına Risk' : 'Risk per Trade', `${riskPercent}%`],
        [tr ? 'Giriş Fiyatı' : 'Entry Price', `$${entryPrice.toLocaleString()}`],
        [tr ? 'Zarar Durdur Fiyatı' : 'Stop Loss Price', `$${stopLossPrice.toLocaleString()}`],
        [tr ? 'Kaldıraç' : 'Leverage', `${leverage}x`],
        [tr ? 'Broker' : 'Broker', brokerName],
        ['', ''],
        [tr ? 'Önerilen Lot Boyutu' : 'Recommended Lot Size', `${result.recommendedLotSize} lots`],
        [tr ? 'Pozisyon Boyutu' : 'Position Size', `${result.positionSizeBtc.toFixed(6)} BTC`],
        [tr ? 'Pozisyon Değeri' : 'Position Value', `$${result.positionValueUsd.toLocaleString()}`],
        [tr ? 'Dolar Riski' : 'Dollar Risk', `$${result.dollarRisk.toLocaleString()}`],
        [tr ? 'Gereken Teminat' : 'Margin Required', `$${result.marginRequired.toLocaleString()}`],
      ];

      if (result.riskRewardRatio) {
        lines.push([tr ? 'Risk/Ödül' : 'Risk/Reward', `1:${result.riskRewardRatio}`]);
      }

      lines.forEach(([label, value]) => {
        if (label === '') { y += 5; return; }
        doc.setFont('helvetica', 'normal');
        doc.text(label, 20, y);
        doc.setFont('helvetica', 'bold');
        doc.text(value, 120, y);
        y += 8;
      });

      doc.save(buildExportFilename({ en: 'bitcoin-lot-size-report', tr: 'bitcoin-lot-boyutu-raporu' }, 'pdf', language));
    } catch (err) {
      // silent
    }
  };

  return (
    <ShareExportPanel actions={[{ kind: 'pdf', onClick: handleExport }]} />
  );
};
