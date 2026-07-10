import React, { useState } from 'react';
import { ShareExportPanel, downloadStandardPdf } from '@/components/share-export';
import { SavingsResult, MilestoneResult } from '@/services/bitcoinSavingsCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

interface SavingsExportReportProps {
  results: SavingsResult | null;
  milestones: MilestoneResult[];
  timeHorizonMonths: number;
  annualGrowthRate: number;
}

const money = (n: number, digits = 0) => `$${n.toLocaleString(undefined, { maximumFractionDigits: digits })}`;

export const SavingsExportReport = ({ results, milestones, timeHorizonMonths, annualGrowthRate }: SavingsExportReportProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    if (!results) return;
    setBusy(true);
    try {
      await downloadStandardPdf({
        title: tr ? 'Bitcoin Tasarruf Planı Raporu' : 'Bitcoin Savings Plan Report',
        subtitle: `${timeHorizonMonths} ${tr ? 'ay' : 'months'} · ${annualGrowthRate}% ${tr ? 'yıllık büyüme' : 'annual growth'}`,
        language,
        filename: { en: 'bitcoin-savings-plan', tr: 'bitcoin-tasarruf-plani' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/bitcoin-savings',
        headline: {
          label: tr ? 'Portföy Değeri' : 'Portfolio Value',
          value: money(results.projectedPortfolioValue),
          accent: 'ember',
        },
        sections: [
          {
            heading: tr ? 'Plan Özeti' : 'Plan Summary',
            rows: [
              [tr ? 'Aylık Tutar' : 'Monthly Amount', money(results.monthlyAmount, 2)],
              [tr ? 'Zaman Ufku' : 'Time Horizon', `${timeHorizonMonths} ${tr ? 'ay' : 'months'} (${(timeHorizonMonths / 12).toFixed(1)} ${tr ? 'yıl' : 'years'})`],
              [tr ? 'Beklenen Büyüme' : 'Expected Growth', `${annualGrowthRate}% ${tr ? 'yıllık' : 'annually'}`],
              [tr ? 'Maaş Başına Satoshi' : 'Sats per Paycheck', results.satsPerPaycheck.toLocaleString()],
            ],
          },
          {
            heading: tr ? 'Tahmini Sonuçlar' : 'Projected Results',
            rows: [
              [tr ? 'Toplam Biriktirilen BTC' : 'Total BTC Accumulated', `${results.totalBtcAccumulated.toFixed(8)} BTC`],
              [tr ? 'Toplam Satoshi' : 'Total Sats', results.totalSatsAccumulated.toLocaleString()],
              [tr ? 'Toplam Yatırım' : 'Total Invested', money(results.totalFiatInvested)],
              [tr ? 'Portföy Değeri' : 'Portfolio Value', money(results.projectedPortfolioValue)],
              [tr ? 'ROI' : 'ROI', `${results.projectedROI.toFixed(1)}%`],
            ],
          },
          {
            heading: tr ? 'Tasarruf Hesabıyla Karşılaştırma' : 'vs Savings Account',
            rows: [
              [tr ? 'Tasarruf Hesabı Son Değer' : 'Savings Account Final Value', money(results.savingsAccountFinalValue)],
              [tr ? 'Kazanılan Faiz' : 'Interest Earned', money(results.savingsAccountInterest)],
            ],
          },
          {
            kind: 'table',
            heading: tr ? 'Kilometre Taşları' : 'Milestones',
            columns: [tr ? 'Kilometre Taşı' : 'Milestone', tr ? 'Hedef BTC' : 'Target BTC', tr ? 'Süre' : 'Time'],
            rows: milestones.map((ms) => [
              `${ms.isReachable ? '✓' : '○'} ${ms.name}`,
              ms.targetBtc.toString(),
              ms.monthsToReach !== null ? `${ms.monthsToReach} ${tr ? 'ay' : 'months'}` : (tr ? 'Uzun vadeli' : 'Long-term'),
            ]),
          },
        ],
      });
    } finally { setBusy(false); }
  };

  return (
    <ShareExportPanel actions={[{ kind: 'pdf', onClick: handleExport, loading: busy, disabled: !results }]} />
  );
};
