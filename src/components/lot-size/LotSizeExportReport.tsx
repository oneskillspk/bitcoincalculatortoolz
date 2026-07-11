import React, { useState } from 'react';
import { ShareExportPanel, downloadStandardPdf, useShareExport } from '@/components/share-export';
import { LotSizeResult } from '@/services/lotSizeCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

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
  result, entryPrice, stopLossPrice, riskPercent, accountBalance, leverage, brokerName,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    setBusy(true);
    try {
      const money = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
      const rows: [string, string][] = [
        [tr ? 'Önerilen Lot Boyutu' : 'Recommended Lot Size', `${result.recommendedLotSize} lots`],
        [tr ? 'Pozisyon Boyutu' : 'Position Size', `${result.positionSizeBtc.toFixed(6)} BTC`],
        [tr ? 'Pozisyon Değeri' : 'Position Value', money(result.positionValueUsd)],
        [tr ? 'Dolar Riski' : 'Dollar Risk', money(result.dollarRisk)],
        [tr ? 'Gereken Teminat' : 'Margin Required', money(result.marginRequired)],
      ];
      if (result.riskRewardRatio) rows.push([tr ? 'Risk/Ödül' : 'Risk/Reward', `1:${result.riskRewardRatio}`]);

      await downloadStandardPdf({
        title: tr ? 'Bitcoin Lot Boyutu Raporu' : 'Bitcoin Lot Size Report',
        language,
        filename: { en: 'bitcoin-lot-size-report', tr: 'bitcoin-lot-boyutu-raporu' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/bitcoin-lot-size',
        headline: { label: tr ? 'Önerilen Lot Boyutu' : 'Recommended Lot Size', value: `${result.recommendedLotSize}`, accent: 'ember' },
        sections: [
          {
            heading: tr ? 'İşlem Girdileri' : 'Trade Inputs',
            rows: [
              [tr ? 'Hesap Bakiyesi' : 'Account Balance', money(accountBalance)],
              [tr ? 'İşlem Başına Risk' : 'Risk per Trade', `${riskPercent}%`],
              [tr ? 'Giriş Fiyatı' : 'Entry Price', money(entryPrice)],
              [tr ? 'Zarar Durdur Fiyatı' : 'Stop Loss Price', money(stopLossPrice)],
              [tr ? 'Kaldıraç' : 'Leverage', `${leverage}x`],
              [tr ? 'Broker' : 'Broker', brokerName],
            ],
          },
          { heading: tr ? 'Hesaplanan Pozisyon' : 'Calculated Position', rows },
        ],
      });
    } finally { setBusy(false); }
  };

  const { copied, copyLink } = useShareExport({
    slug: 'bitcoin-lot-size',
    headline: tr ? 'Bitcoin Lot Boyutu Hesaplayıcı' : 'Bitcoin Lot Size Calculator',
    params: { balance: accountBalance, risk: riskPercent, entry: entryPrice, stop: stopLossPrice, leverage },
  });

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: handleExport, loading: busy },
        { kind: 'copy-link', onClick: copyLink, copied },
      ]}
    />
  );
};
