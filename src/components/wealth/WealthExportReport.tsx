import React, { useCallback, useState } from 'react';
import { ShareExportPanel, downloadStandardPdf } from '@/components/share-export';
import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { PercentileResult, formatPercentile, MilestoneInfo } from '@/services/wealthPercentileService';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { useLanguage } from '@/contexts/LanguageContext';

interface WealthExportReportProps {
  result: PercentileResult;
  milestone: MilestoneInfo;
}

export const WealthExportReport: React.FC<WealthExportReportProps> = ({ result, milestone }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { price: btcPrice } = useLiveBitcoinPrice();
  const [busy, setBusy] = useState(false);

  const handlePDF = useCallback(async () => {
    setBusy(true);
    try {
      const intl = getCurrentIntlLocale();
      const rows: Array<[string, string]> = [
        [tr ? 'BTC Varlığınız' : 'BTC Holdings', `${result.btcAmount.toFixed(8)} BTC`],
      ];
      if (btcPrice > 0) {
        rows.push([tr ? 'Fiat Değeri' : 'Fiat Value', `$${(result.btcAmount * btcPrice).toLocaleString(intl, { maximumFractionDigits: 2 })}`]);
      }
      rows.push(
        [tr ? 'Arz Payı' : 'Supply Share', `${result.supplyPercentage.toFixed(8)}%`],
        [tr ? 'Altınızdaki Adresler' : 'Addresses Below You', result.addressesBelow.toLocaleString(intl)],
        [tr ? 'Üstünüzdeki Adresler' : 'Addresses Above You', result.addressesAbove.toLocaleString(intl)],
        [tr ? 'Kademe' : 'Tier', `${result.tier.tierEmoji} ${result.tier.tierName}`],
      );

      const sections = [
        { heading: tr ? 'Servet Diliminiz' : 'Your Wealth Percentile', rows },
      ];
      if (milestone.nextTier) {
        sections.push({
          heading: tr ? 'Sonraki Kilometre Taşı' : 'Next Milestone',
          rows: [
            [tr ? 'Sonraki Kademe' : 'Next Tier', `${milestone.nextTier.tierEmoji} ${milestone.nextTier.tierName}`],
            [tr ? 'Gerekli BTC' : 'BTC Needed', `${milestone.btcNeeded.toFixed(4)} BTC`],
            [tr ? 'İlerleme' : 'Progress', `${milestone.currentProgress.toFixed(1)}%`],
          ],
        });
      }
      await downloadStandardPdf({
        title: tr ? 'Bitcoin Servet Dilimi Raporu' : 'Bitcoin Wealth Percentile Report',
        language,
        filename: { en: 'bitcoin-wealth-percentile-report', tr: 'bitcoin-servet-dilimi-raporu' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/wealth-percentile',
        headline: { label: tr ? 'Servet Diliminiz' : 'Your Wealth Percentile', value: formatPercentile(result.percentile) },
        sections,
      });
    } finally { setBusy(false); }
  }, [result, milestone, btcPrice, language, tr]);

  if (result.btcAmount <= 0) return null;

  return (
    <ShareExportPanel
      actions={[{ kind: 'pdf', onClick: handlePDF, loading: busy }]}
    />
  );
};
