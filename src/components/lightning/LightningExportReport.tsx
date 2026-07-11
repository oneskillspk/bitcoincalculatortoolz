import React, { useState } from 'react';
import { ShareExportPanel, downloadStandardPdf, useShareExport } from '@/components/share-export';
import { useToast } from '@/hooks/use-toast';
import {
  LightningFeeEstimate,
  LightningNetworkStats,
  formatSats,
  formatPercent,
} from '@/services/lightningFeeCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

interface LightningExportReportProps {
  feeEstimate: LightningFeeEstimate | null;
  networkStats: LightningNetworkStats | null;
  amountSats: number;
  estimatedHops: number;
  baseFeePerHop: number;
  feeRatePpm: number;
  btcPriceUsd: number;
}

export const LightningExportReport = ({
  feeEstimate, networkStats, amountSats, estimatedHops, baseFeePerHop, feeRatePpm, btcPriceUsd,
}: LightningExportReportProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const handlePdf = async () => {
    if (!feeEstimate) {
      toast({ title: tr ? 'Dışa aktarılacak veri yok' : 'No data to export', variant: 'destructive' });
      return;
    }
    setBusy(true);
    try {
      const amountUsd = (amountSats / 100_000_000) * btcPriceUsd;
      await downloadStandardPdf({
        title: tr ? 'Lightning Network Ücret Raporu' : 'Lightning Network Fee Report',
        language,
        filename: { en: 'lightning-fee-report', tr: 'lightning-ucret-raporu' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/lightning-fees',
        headline: {
          label: tr ? 'Toplam Yönlendirme Ücreti' : 'Total Routing Fee',
          value: `${formatSats(feeEstimate.totalFeeSats)} · $${feeEstimate.totalFeeUsd.toFixed(4)}`,
          accent: 'ember',
        },
        sections: [
          {
            heading: tr ? 'Girdi Parametreleri' : 'Input Parameters',
            rows: [
              [tr ? 'Ödeme Tutarı' : 'Payment Amount', `${amountSats.toLocaleString()} sats ($${amountUsd.toFixed(2)})`],
              [tr ? 'Tahmini Hop Sayısı' : 'Estimated Hops', String(estimatedHops)],
              [tr ? 'Hop Başına Temel Ücret' : 'Base Fee per Hop', `${baseFeePerHop} msat`],
              [tr ? 'Ücret Oranı' : 'Fee Rate', `${feeRatePpm} ppm`],
            ],
          },
          {
            heading: tr ? 'Ücret Tahmini' : 'Fee Estimate',
            rows: [
              [tr ? 'Temel Ücret Bileşeni' : 'Base Fee Component', formatSats(feeEstimate.baseFeeTotal)],
              [tr ? 'Oransal Ücret' : 'Proportional Fee', formatSats(feeEstimate.proportionalFeeTotal)],
              [tr ? 'Efektif Oran' : 'Effective Rate', formatPercent(feeEstimate.effectiveFeeRate)],
              [tr ? 'Tahmini Süre' : 'Estimated Time', feeEstimate.estimatedTime],
            ],
          },
          {
            heading: tr ? 'Zincir Üzeri Karşılaştırma' : 'vs On-Chain Transaction',
            rows: [
              [tr ? 'Zincir Üzeri En Hızlı' : 'On-Chain Fastest', formatSats(feeEstimate.onChainComparison.fastestFeeSats)],
              [tr ? 'Lightning Tasarrufu' : 'Lightning Savings', `${feeEstimate.onChainComparison.savingsPercent.toFixed(0)}%`],
            ],
          },
          ...(networkStats ? [{
            heading: tr ? 'Ağ İstatistikleri' : 'Network Statistics',
            rows: [
              [tr ? 'Düğümler' : 'Nodes', networkStats.nodeCount.toLocaleString()],
              [tr ? 'Kanallar' : 'Channels', networkStats.channelCount.toLocaleString()],
              [tr ? 'Toplam Kapasite' : 'Total Capacity', `${(networkStats.totalCapacitySats / 100_000_000).toFixed(0)} BTC`],
              [tr ? 'Ort. Ücret Oranı' : 'Avg Fee Rate', `${networkStats.avgFeeRate} ppm`],
            ] as [string, string][],
          }] : []),
        ],
      });
    } finally { setBusy(false); }
  };

  const handleShare = async () => {
    if (!feeEstimate) return;
    const text = tr
      ? `⚡ Lightning Network Ücret Tahmini\n\nÖdeme: ${amountSats.toLocaleString()} sats\nToplam Ücret: ${formatSats(feeEstimate.totalFeeSats)}\nTasarruf: ${feeEstimate.onChainComparison.savingsPercent.toFixed(0)}% vs zincir\n\nbitcoincalculator.tools/calculators/lightning-fees`
      : `⚡ Lightning Network Fee Estimate\n\nPayment: ${amountSats.toLocaleString()} sats\nTotal Fee: ${formatSats(feeEstimate.totalFeeSats)}\nSavings: ${feeEstimate.onChainComparison.savingsPercent.toFixed(0)}% vs on-chain\n\nbitcoincalculator.tools/calculators/lightning-fees`;
    if (navigator.share) {
      try { await navigator.share({ title: tr ? 'Lightning Ücreti' : 'Lightning Fee', text, url: window.location.href }); } catch { /* noop */ }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: tr ? 'Panoya kopyalandı!' : 'Copied to clipboard!' });
    }
  };

  if (!feeEstimate) return null;

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: handlePdf, loading: busy },
        { kind: 'copy-link', onClick: copyLink, copied },
      ]}
    />
  );
};

export default LightningExportReport;
