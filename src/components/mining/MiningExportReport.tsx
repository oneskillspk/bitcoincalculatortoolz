import React, { useState } from 'react';
import { formatSymbolAmount } from '@/utils/numberFormat';
import { ShareExportPanel, downloadStandardPdf, useShareExport } from '@/components/share-export';
import { MiningResult, MiningParams } from '@/services/miningProfitabilityCalculator';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFileDownload } from '@/hooks/useFileDownload';
import { csvNumber, csvPercent } from '@/utils/csvExport';

interface MiningExportReportProps {
  result: MiningResult;
  params: MiningParams;
}

const money = (n: number) =>
  formatSymbolAmount(n, '$', 2, 'en-US');

export const MiningExportReport = React.memo(({ result, params }: MiningExportReportProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const { exportCsv } = useFileDownload();

  const handlePdf = async () => {
    setBusy(true);
    try {
      const isProfitable = result.dailyProfit > 0;
      await downloadStandardPdf({
        title: tr ? 'Bitcoin Madencilik Karlılık Raporu' : 'Bitcoin Mining Profitability Report',
        subtitle: isProfitable ? (tr ? 'Karlı' : 'Profitable') : (tr ? 'Karsız' : 'Unprofitable'),
        language,
        filename: { en: 'bitcoin-mining-report', tr: 'bitcoin-madencilik-raporu' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/mining-profitability',
        headline: {
          label: tr ? 'Günlük Kâr' : 'Daily Profit',
          value: money(result.dailyProfit),
          accent: isProfitable ? 'success' : 'danger',
        },
        sections: [
          {
            heading: tr ? 'Madencilik Kurulumu' : 'Mining Setup',
            rows: [
              [tr ? 'Hash Hızı' : 'Hash Rate', `${params.hashRate} TH/s`],
              [tr ? 'Güç Tüketimi' : 'Power Consumption', `${params.powerConsumption} W`],
              [tr ? 'Elektrik Maliyeti' : 'Electricity Cost', `$${params.electricityCost}/kWh`],
              [tr ? 'Havuz Ücreti' : 'Pool Fee', `${params.poolFee}%`],
              [tr ? 'Donanım Maliyeti' : 'Hardware Cost', money(params.hardwareCost)],
            ],
          },
          {
            heading: tr ? 'Piyasa Koşulları' : 'Market Conditions',
            rows: [
              [tr ? 'Bitcoin Fiyatı' : 'Bitcoin Price', money(params.bitcoinPrice)],
              [tr ? 'Blok Ödülü' : 'Block Reward', `${params.blockReward} BTC`],
              [tr ? 'Zorluk Ayarlaması' : 'Difficulty Adjustment', `${params.difficultyAdjustment}% ${tr ? 'aylık' : 'monthly'}`],
            ],
          },
          {
            kind: 'table',
            heading: tr ? 'Kâr Projeksiyonu' : 'Profit Projection',
            columns: [tr ? 'Dönem' : 'Period', tr ? 'Kâr' : 'Profit'],
            rows: [
              [tr ? 'Günlük' : 'Daily', money(result.dailyProfit)],
              [tr ? 'Aylık' : 'Monthly', money(result.monthlyProfit)],
              [tr ? 'Yıllık' : 'Yearly', money(result.yearlyProfit)],
            ],
          },
          {
            heading: tr ? 'Verimlilik Metrikleri' : 'Efficiency Metrics',
            rows: [
              [tr ? 'Günlük BTC' : 'Daily BTC', `${(result.dailyBtcMined * 100000000).toFixed(0)} sats`],
              [tr ? 'Donanım Geri Ödeme' : 'Hardware Payback', result.breakEvenDays == null ? '—' : `${result.breakEvenDays} ${tr ? 'gün' : 'days'}`],
              [tr ? 'Başabaş BTC Fiyatı' : 'Break-Even BTC Price', result.breakEvenBtcPrice == null ? '—' : money(result.breakEvenBtcPrice)],
              [tr ? 'Yıllık ROI' : 'Annual ROI', Number.isFinite(result.roiPercentage) ? `${result.roiPercentage.toFixed(1)}%` : '—'],

              [tr ? 'BTC Başına Maliyet' : 'Cost per BTC', money(result.costPerBtc)],
            ],
          },
        ],
      });
      toast({ title: tr ? 'Rapor dışa aktarıldı' : 'Report exported' });
    } catch {
      toast({ title: tr ? 'Dışa aktarma başarısız' : 'Export failed', variant: 'destructive' });
    } finally { setBusy(false); }
  };

  /** CSV mirrors the PDF's tables so both exports always agree. */
  const handleCsv = () => {
    exportCsv({
      meta: {
        calculator: tr ? 'Bitcoin Madencilik Karlılık Hesaplayıcı' : 'Bitcoin Mining Profitability Calculator',
        // Exactly the price the calculator ran with.
        btcPrice: params.bitcoinPrice,
        currency: 'USD',
        path: '/calculators/mining-profitability',
        extraRows: [
          [tr ? 'Hash hızı (TH/s)' : 'Hash rate (TH/s)', String(params.hashRate)],
          [tr ? 'Güç (W)' : 'Power (W)', String(params.powerConsumption)],
          [tr ? 'Elektrik ($/kWh)' : 'Electricity ($/kWh)', String(params.electricityCost)],
          [tr ? 'Havuz ücreti' : 'Pool fee', csvPercent(params.poolFee)],
          [tr ? 'Donanım maliyeti (USD)' : 'Hardware cost (USD)', csvNumber(params.hardwareCost)],
          [tr ? 'Blok ödülü (BTC)' : 'Block reward (BTC)', String(params.blockReward)],
        ],
      },
      filename: { en: 'bitcoin-mining-results', tr: 'bitcoin-madencilik-sonuclari' },
      columns: tr ? ['Metrik', 'Değer'] : ['Metric', 'Value'],
      rows: [
        [tr ? 'Günlük kâr (USD)' : 'Daily profit (USD)', csvNumber(result.dailyProfit)],
        [tr ? 'Aylık kâr (USD)' : 'Monthly profit (USD)', csvNumber(result.monthlyProfit)],
        [tr ? 'Yıllık kâr (USD)' : 'Yearly profit (USD)', csvNumber(result.yearlyProfit)],
        [tr ? 'Günlük gelir (USD)' : 'Daily revenue (USD)', csvNumber(result.dailyRevenue)],
        [tr ? 'Günlük elektrik maliyeti (USD)' : 'Daily electricity cost (USD)', csvNumber(result.dailyElectricityCost)],
        [tr ? 'Günlük kazılan BTC (BTC)' : 'Daily BTC mined (BTC)', result.dailyBtcMined.toFixed(8)],
        [tr ? 'BTC başına maliyet (USD)' : 'Cost per BTC (USD)', csvNumber(result.costPerBtc)],
        [tr ? 'Başabaş BTC fiyatı (USD)' : 'Break-even BTC price (USD)', result.breakEvenBtcPrice == null ? '' : csvNumber(result.breakEvenBtcPrice)],
        [tr ? 'Donanım geri ödeme (gün)' : 'Hardware payback (days)', result.breakEvenDays == null ? '' : String(result.breakEvenDays)],
        [tr ? 'Yıllık ROI' : 'Annual ROI', Number.isFinite(result.roiPercentage) ? csvPercent(result.roiPercentage, { decimals: 1 }) : ''],
      ],
    });
  };

  const { copied, copyLink } = useShareExport({
    slug: 'mining-profitability',
    headline: tr ? 'Bitcoin Madencilik Karlılık Hesaplayıcı' : 'Bitcoin Mining Profitability Calculator',
    params: {
      hashRate: params.hashRate,
      power: params.powerConsumption,
      elec: params.electricityCost,
      fee: params.poolFee,
      hw: params.hardwareCost,
    },
  });

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: handlePdf, loading: busy },
        { kind: 'csv', onClick: handleCsv },
        { kind: 'copy-link', onClick: copyLink, copied },
      ]}
    />
  );
});

MiningExportReport.displayName = 'MiningExportReport';
