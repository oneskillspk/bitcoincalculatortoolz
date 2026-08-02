import React, { useState } from 'react';
import { formatGroupedDecimal } from '@/utils/numberFormat';
import { ShareExportPanel, downloadStandardPdf, useShareExport } from '@/components/share-export';
import { LotSizeResult } from '@/services/lotSizeCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFileDownload } from '@/hooks/useFileDownload';
import { csvNumber, csvPercent } from '@/utils/csvExport';

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
  const { exportCsv } = useFileDownload();

  const handleExport = async () => {
    setBusy(true);
    try {
      const money = (n: number) => `$${formatGroupedDecimal(n, 2, 'en-US')}`;
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

  /** CSV mirrors the PDF's position rows so both exports always agree. */
  const handleCsv = () => {
    exportCsv({
      meta: {
        calculator: tr ? 'Bitcoin Lot Boyutu Hesaplayıcı' : 'Bitcoin Lot Size Calculator',
        currency: 'USD',
        path: '/calculators/bitcoin-lot-size',
        extraRows: [
          [tr ? 'Hesap bakiyesi (USD)' : 'Account balance (USD)', csvNumber(accountBalance)],
          [tr ? 'İşlem başına risk' : 'Risk per trade', csvPercent(riskPercent)],
          [tr ? 'Giriş fiyatı (USD)' : 'Entry price (USD)', csvNumber(entryPrice)],
          [tr ? 'Zarar durdur fiyatı (USD)' : 'Stop loss price (USD)', csvNumber(stopLossPrice)],
          [tr ? 'Kaldıraç' : 'Leverage', `${leverage}x`],
          [tr ? 'Broker' : 'Broker', brokerName],
        ],
      },
      filename: { en: 'bitcoin-lot-size-results', tr: 'bitcoin-lot-boyutu-sonuclari' },
      columns: tr ? ['Metrik', 'Değer'] : ['Metric', 'Value'],
      rows: [
        [tr ? 'Önerilen lot boyutu (lot)' : 'Recommended lot size (lots)', String(result.recommendedLotSize)],
        [tr ? 'Pozisyon boyutu (BTC)' : 'Position size (BTC)', result.positionSizeBtc.toFixed(8)],
        [tr ? 'Pozisyon değeri (USD)' : 'Position value (USD)', csvNumber(result.positionValueUsd)],
        [tr ? 'Dolar riski (USD)' : 'Dollar risk (USD)', csvNumber(result.dollarRisk)],
        [tr ? 'Gereken teminat (USD)' : 'Margin required (USD)', csvNumber(result.marginRequired)],
        ...(result.riskRewardRatio ? [[tr ? 'Risk/Ödül' : 'Risk/Reward', `1:${result.riskRewardRatio}`]] : []),
      ],
    });
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
        { kind: 'csv', onClick: handleCsv },
        { kind: 'copy-link', onClick: copyLink, copied },
      ]}
    />
  );
};
