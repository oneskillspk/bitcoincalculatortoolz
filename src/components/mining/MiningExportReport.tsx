import React, { useState } from 'react';
import { ShareExportPanel, downloadStandardPdf, useShareExport } from '@/components/share-export';
import { MiningResult, MiningParams } from '@/services/miningProfitabilityCalculator';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface MiningExportReportProps {
  result: MiningResult;
  params: MiningParams;
}

const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

export const MiningExportReport = React.memo(({ result, params }: MiningExportReportProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

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
              [tr ? 'Başabaş' : 'Break-Even', result.breakEvenDays === Infinity ? (tr ? 'Hiçbir zaman' : 'Never') : `${result.breakEvenDays} ${tr ? 'gün' : 'days'}`],
              [tr ? 'Yıllık ROI' : 'Annual ROI', `${result.roiPercentage.toFixed(1)}%`],
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
        { kind: 'copy-link', onClick: copyLink, copied },
      ]}
    />
  );
});

MiningExportReport.displayName = 'MiningExportReport';
