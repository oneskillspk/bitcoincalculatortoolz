import React, { useState } from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { ShareExportPanel, downloadStandardPdf, useShareExport } from '@/components/share-export';
import { SavingsResult, MilestoneResult } from '@/services/bitcoinSavingsCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFileDownload } from '@/hooks/useFileDownload';
import { csvNumber, csvPercent } from '@/utils/csvExport';

interface SavingsExportReportProps {
  results: SavingsResult | null;
  milestones: MilestoneResult[];
  timeHorizonMonths: number;
  annualGrowthRate: number;
}

const money = (n: number, digits = 0) => `$${formatGroupedInt(n, 'en-US')}`;

export const SavingsExportReport = ({ results, milestones, timeHorizonMonths, annualGrowthRate }: SavingsExportReportProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState(false);
  const { exportCsv } = useFileDownload();

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
              [tr ? 'Zaman Ufku' : 'Time Horizon', (() => {
                const yrs = timeHorizonMonths / 12;
                const mLbl = tr ? 'ay' : (timeHorizonMonths === 1 ? 'month' : 'months');
                const yLbl = tr ? 'yıl' : (Math.abs(yrs - 1) < 1e-9 ? 'year' : 'years');
                return `${timeHorizonMonths} ${mLbl} (${yrs.toFixed(1)} ${yLbl})`;
              })()],
              [tr ? 'Beklenen Büyüme' : 'Expected Growth', `${annualGrowthRate}% ${tr ? 'yıllık' : 'annually'}`],
              [tr ? 'Maaş Başına Satoshi' : 'Sats per Paycheck', formatGroupedInt(results.satsPerPaycheck)],
            ],
          },
          {
            heading: tr ? 'Tahmini Sonuçlar' : 'Projected Results',
            rows: [
              [tr ? 'Toplam Biriktirilen BTC' : 'Total BTC Accumulated', `${results.totalBtcAccumulated.toFixed(8)} BTC`],
              [tr ? 'Toplam Satoshi' : 'Total Sats', formatGroupedInt(results.totalSatsAccumulated)],
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
              ms.monthsToReach !== null ? `${ms.monthsToReach} ${tr ? 'ay' : (ms.monthsToReach === 1 ? 'month' : 'months')}` : (tr ? 'Uzun vadeli' : 'Long-term'),
            ]),
          },
        ],
      });
    } finally { setBusy(false); }
  };

  /** CSV mirrors the PDF's summary + milestones so both exports always agree. */
  const handleCsv = () => {
    if (!results) return;
    exportCsv({
      meta: {
        calculator: tr ? 'Bitcoin Tasarruf Planı Hesaplayıcı' : 'Bitcoin Savings Plan Calculator',
        currency: 'USD',
        path: '/calculators/bitcoin-savings',
        extraRows: [
          [tr ? 'Zaman ufku (ay)' : 'Time horizon (months)', String(timeHorizonMonths)],
          [tr ? 'Yıllık büyüme' : 'Annual growth', csvPercent(annualGrowthRate)],
          [tr ? 'Aylık tutar (USD)' : 'Monthly amount (USD)', csvNumber(results.monthlyAmount)],
        ],
      },
      filename: { en: 'bitcoin-savings-plan', tr: 'bitcoin-tasarruf-plani' },
      columns: tr ? ['Metrik', 'Değer'] : ['Metric', 'Value'],
      rows: [
        [tr ? 'Toplam biriktirilen BTC (BTC)' : 'Total BTC accumulated (BTC)', results.totalBtcAccumulated.toFixed(8)],
        [tr ? 'Toplam satoshi (sats)' : 'Total sats (sats)', String(Math.round(results.totalSatsAccumulated))],
        [tr ? 'Maaş başına satoshi (sats)' : 'Sats per paycheck (sats)', String(Math.round(results.satsPerPaycheck))],
        [tr ? 'Toplam yatırım (USD)' : 'Total invested (USD)', csvNumber(results.totalFiatInvested)],
        [tr ? 'Portföy değeri (USD)' : 'Portfolio value (USD)', csvNumber(results.projectedPortfolioValue)],
        [tr ? 'ROI' : 'ROI', csvPercent(results.projectedROI, { decimals: 1 })],
        [tr ? 'Tasarruf hesabı son değeri (USD)' : 'Savings account final value (USD)', csvNumber(results.savingsAccountFinalValue)],
        [tr ? 'Kazanılan faiz (USD)' : 'Interest earned (USD)', csvNumber(results.savingsAccountInterest)],
        ...milestones.map((ms) => [
          `${tr ? 'Kilometre taşı' : 'Milestone'}: ${ms.name} (${ms.targetBtc} BTC)`,
          ms.monthsToReach !== null ? `${ms.monthsToReach} ${tr ? 'ay' : 'months'}` : (tr ? 'Uzun vadeli' : 'Long-term'),
        ]),
      ],
    });
  };

  const { copied, copyLink } = useShareExport({
    slug: 'bitcoin-savings',
    headline: tr ? 'Bitcoin Tasarruf Planı' : 'Bitcoin Savings Plan',
    params: { months: timeHorizonMonths, growth: annualGrowthRate },
  });

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: handleExport, loading: busy, disabled: !results },
        { kind: 'csv', onClick: handleCsv, disabled: !results },
        { kind: 'copy-link', onClick: copyLink, copied },
      ]}
    />
  );
};
