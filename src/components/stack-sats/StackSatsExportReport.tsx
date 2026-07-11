import React, { useState } from 'react';
import { ShareExportPanel, downloadStandardPdf, useShareExport } from '@/components/share-export';
import { StackSatsResult } from '@/services/stackSatsCalculator';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface StackSatsExportReportProps {
  results: StackSatsResult | null;
  currency: string;
  currentBtcHoldings: number;
  targetBtcGoal: number;
  monthlyContribution: number;
  expectedGrowthRate: number;
}

export const StackSatsExportReport = ({
  results, currency, currentBtcHoldings, targetBtcGoal, monthlyContribution, expectedGrowthRate,
}: StackSatsExportReportProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    if (!results) return;
    setBusy(true);
    try {
      await downloadStandardPdf({
        title: tr ? 'Stack Sats Hedef Raporu' : 'Stack Sats Goal Report',
        language,
        filename: { en: 'stack-sats-goal-report', tr: 'satoshi-hedef-raporu' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/stack-sats',
        headline: {
          label: tr ? 'Tamamlanma Tarihi' : 'Completion Date',
          value: format(results.projectedCompletionDate, 'PPP'),
          accent: 'ember',
        },
        sections: [
          {
            heading: tr ? 'Hedefiniz' : 'Your Goal',
            rows: [
              [tr ? 'Mevcut Bakiye' : 'Current Holdings', `${currentBtcHoldings.toFixed(8)} BTC`],
              [tr ? 'Hedef' : 'Target Goal', `${targetBtcGoal.toFixed(8)} BTC`],
              [tr ? 'Aylık Katkı' : 'Monthly Contribution', `${monthlyContribution.toLocaleString()} ${currency}`],
              [tr ? 'Beklenen Büyüme' : 'Expected Growth', `${expectedGrowthRate}% ${tr ? 'yıllık' : 'annually'}`],
            ],
          },
          {
            heading: tr ? 'Hedef Zaman Çizelgesi' : 'Timeline to Goal',
            rows: [
              [tr ? 'Hedefe Kalan' : 'Time to Goal', `${results.yearsToGoal} ${tr ? 'yıl' : 'years'} (${results.monthsToGoal} ${tr ? 'ay' : 'months'})`],
              [tr ? 'Toplam Yatırım' : 'Total Investment', `${results.totalFiatInvested.toLocaleString()} ${currency}`],
              [tr ? 'Ort. Alış Fiyatı' : 'Average Buy Price', `${results.averageBuyPrice.toLocaleString()} ${currency}`],
              [tr ? 'İlerleme' : 'Progress', `${results.currentProgress.toFixed(1)}%`],
            ],
          },
          {
            kind: 'table',
            heading: tr ? 'İlerleme Kilometre Taşları' : 'Progress Milestones',
            columns: ['%', 'BTC', tr ? 'Tahmini Tarih' : 'Estimated Date'],
            rows: results.progressMilestones.map((m) => [
              `${m.percentage}%`,
              m.btcAmount.toFixed(8),
              format(m.estimatedDate, 'MMM yyyy'),
            ]),
          },
          {
            kind: 'table',
            heading: tr ? 'Alternatif Senaryolar' : 'Alternative Scenarios',
            columns: [tr ? 'Senaryo' : 'Scenario', tr ? 'Ay' : 'Months', tr ? 'Toplam Yatırım' : 'Total Invested'],
            rows: [
              [tr ? 'Muhafazakar (10%)' : 'Conservative (10%)', String(results.alternativeScenarios.conservative.months), `${results.alternativeScenarios.conservative.totalInvested.toLocaleString()} ${currency}`],
              [tr ? 'Orta (15%)' : 'Moderate (15%)', String(results.alternativeScenarios.moderate.months), `${results.alternativeScenarios.moderate.totalInvested.toLocaleString()} ${currency}`],
              [tr ? 'İyimser (25%)' : 'Optimistic (25%)', String(results.alternativeScenarios.optimistic.months), `${results.alternativeScenarios.optimistic.totalInvested.toLocaleString()} ${currency}`],
            ],
          },
        ],
      });
    } finally { setBusy(false); }
  };

  return <ShareExportPanel actions={[{ kind: 'pdf', onClick: handleExport, loading: busy, disabled: !results }]} />;
};
