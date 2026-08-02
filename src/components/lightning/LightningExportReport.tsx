import React, { useState } from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { ShareExportPanel, downloadStandardPdf, useShareExport } from '@/components/share-export';
import { useToast } from '@/hooks/use-toast';
import {
  LightningFeeEstimate,
  LightningNetworkStats,
  formatSats,
  formatPercent,
} from '@/services/lightningFeeCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFileDownload } from '@/hooks/useFileDownload';
import { csvNumber, csvPercent } from '@/utils/csvExport';

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
  const { exportCsv } = useFileDownload();

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
        canonicalUrl: 'bitcoincalculator.tools/calculators/lightning',
        headline: {
          label: tr ? 'Toplam Yönlendirme Ücreti' : 'Total Routing Fee',
          value: `${formatSats(feeEstimate.totalFeeSats)} · $${feeEstimate.totalFeeUsd.toFixed(4)}`,
          accent: 'ember',
        },
        sections: [
          {
            heading: tr ? 'Girdi Parametreleri' : 'Input Parameters',
            rows: [
              [tr ? 'Ödeme Tutarı' : 'Payment Amount', `${formatGroupedInt(amountSats)} sats ($${amountUsd.toFixed(2)})`],
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
              [tr ? 'Düğümler' : 'Nodes', formatGroupedInt(networkStats.nodeCount)],
              [tr ? 'Kanallar' : 'Channels', formatGroupedInt(networkStats.channelCount)],
              [tr ? 'Toplam Kapasite' : 'Total Capacity', `${(networkStats.totalCapacitySats / 100_000_000).toFixed(0)} BTC`],
              [tr ? 'Ort. Ücret Oranı' : 'Avg Fee Rate', `${networkStats.avgFeeRate} ppm`],
            ] as [string, string][],
          }] : []),
        ],
      });
    } finally { setBusy(false); }
  };

  /** CSV mirrors the PDF's fee rows so both exports always agree. */
  const handleCsv = () => {
    if (!feeEstimate) return;
    exportCsv({
      meta: {
        calculator: tr ? 'Lightning Network Ücret Hesaplayıcı' : 'Lightning Network Fee Calculator',
        btcPrice: btcPriceUsd,
        currency: 'USD',
        path: '/calculators/lightning',
        extraRows: [
          [tr ? 'Ödeme tutarı (sats)' : 'Payment amount (sats)', String(amountSats)],
          [tr ? 'Tahmini hop sayısı' : 'Estimated hops', String(estimatedHops)],
          [tr ? 'Hop başına temel ücret (msat)' : 'Base fee per hop (msat)', String(baseFeePerHop)],
          [tr ? 'Ücret oranı (ppm)' : 'Fee rate (ppm)', String(feeRatePpm)],
        ],
      },
      filename: { en: 'lightning-fee-estimate', tr: 'lightning-ucret-tahmini' },
      columns: tr ? ['Metrik', 'Değer'] : ['Metric', 'Value'],
      rows: [
        [tr ? 'Toplam ücret (sats)' : 'Total fee (sats)', csvNumber(feeEstimate.totalFeeSats, 3)],
        [tr ? 'Toplam ücret (USD)' : 'Total fee (USD)', csvNumber(feeEstimate.totalFeeUsd, 6)],
        [tr ? 'Temel ücret bileşeni (sats)' : 'Base fee component (sats)', csvNumber(feeEstimate.baseFeeTotal, 3)],
        [tr ? 'Oransal ücret (sats)' : 'Proportional fee (sats)', csvNumber(feeEstimate.proportionalFeeTotal, 3)],
        [tr ? 'Efektif ücret oranı' : 'Effective fee rate', csvPercent(feeEstimate.effectiveFeeRate, { decimals: 4 })],
        [tr ? 'Tahmini süre' : 'Estimated time', feeEstimate.estimatedTime],
        [tr ? 'Zincir üzeri en hızlı (sats)' : 'On-chain fastest (sats)', csvNumber(feeEstimate.onChainComparison.fastestFeeSats, 0)],
        [tr ? 'Lightning tasarrufu' : 'Lightning savings', csvPercent(feeEstimate.onChainComparison.savingsPercent, { decimals: 1 })],
        ...(networkStats ? [
          [tr ? 'Ağ düğüm sayısı' : 'Network nodes', String(networkStats.nodeCount)],
          [tr ? 'Ağ kanal sayısı' : 'Network channels', String(networkStats.channelCount)],
          [tr ? 'Toplam kapasite (BTC)' : 'Total capacity (BTC)', csvNumber(networkStats.totalCapacitySats / 100_000_000, 2)],
          [tr ? 'Ortalama ücret oranı (ppm)' : 'Average fee rate (ppm)', String(networkStats.avgFeeRate)],
        ] : []),
      ],
    });
  };

  const handleShare = async () => {
    if (!feeEstimate) return;
    const text = tr
      ? `⚡ Lightning Network Ücret Tahmini\n\nÖdeme: ${formatGroupedInt(amountSats)} sats\nToplam Ücret: ${formatSats(feeEstimate.totalFeeSats)}\nTasarruf: ${feeEstimate.onChainComparison.savingsPercent.toFixed(0)}% vs zincir\n\nbitcoincalculator.tools/calculators/lightning`
      : `⚡ Lightning Network Fee Estimate\n\nPayment: ${formatGroupedInt(amountSats)} sats\nTotal Fee: ${formatSats(feeEstimate.totalFeeSats)}\nSavings: ${feeEstimate.onChainComparison.savingsPercent.toFixed(0)}% vs on-chain\n\nbitcoincalculator.tools/calculators/lightning`;
    if (navigator.share) {
      try { await navigator.share({ title: tr ? 'Lightning Ücreti' : 'Lightning Fee', text, url: window.location.href }); } catch { /* noop */ }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: tr ? 'Panoya kopyalandı!' : 'Copied to clipboard!' });
    }
  };

  const { copied, copyLink } = useShareExport({
    slug: 'lightning',
    headline: tr ? 'Bitcoin Lightning Ücreti' : 'Bitcoin Lightning Fees',
    params: { amount: amountSats, hops: estimatedHops, base: baseFeePerHop, rate: feeRatePpm },
  });

  if (!feeEstimate) return null;

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: handlePdf, loading: busy },
        { kind: 'csv', onClick: handleCsv },
        { kind: 'copy-link', onClick: copyLink, copied },
      ]}
    />
  );
};

export default LightningExportReport;
