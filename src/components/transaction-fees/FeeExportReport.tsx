import React, { useState } from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { ShareExportPanel, downloadStandardPdf, useShareExport } from '@/components/share-export';
import { useToast } from '@/hooks/use-toast';
import type { FeeEstimate, AllFeeEstimates, AddressType, Priority } from '@/services/transactionFeeCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeeExportReportProps {
  selectedEstimate: FeeEstimate | null;
  allEstimates: AllFeeEstimates | null;
  addressType: AddressType;
  priority: Priority;
  inputCount: number;
  outputCount: number;
  btcPrice: number;
}

const ADDRESS_LABEL: Record<AddressType, string> = {
  'legacy': 'Legacy (P2PKH)',
  'segwit': 'SegWit (P2SH-P2WPKH)',
  'native-segwit': 'Native SegWit (P2WPKH)',
  'taproot': 'Taproot (P2TR)',
};

const priorityLabel = (p: Priority, tr: boolean): string => {
  const en: Record<Priority, string> = {
    fastest: 'Fastest (~10 min)', halfHour: '30 Minutes', hour: '1 Hour', economy: 'Economy (4+ hours)',
  };
  const trMap: Record<Priority, string> = {
    fastest: 'En Hızlı (~10 dk)', halfHour: '30 Dakika', hour: '1 Saat', economy: 'Ekonomik (4+ saat)',
  };
  return tr ? trMap[p] : en[p];
};

export const FeeExportReport = ({
  selectedEstimate, allEstimates, addressType, priority, inputCount, outputCount, btcPrice,
}: FeeExportReportProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!selectedEstimate) return;
    setBusy(true);
    try {
      await downloadStandardPdf({
        title: tr ? 'Bitcoin İşlem Ücreti Raporu' : 'Bitcoin Transaction Fee Report',
        language,
        filename: { en: 'bitcoin-fee-report', tr: 'bitcoin-ucret-raporu' },
        canonicalUrl: 'bitcoincalculator.tools/calculators/transaction-fees',
        metaRows: [`${tr ? 'BTC Fiyatı' : 'BTC Price'}: $${formatGroupedInt(btcPrice)}`],
        headline: {
          label: tr ? 'Seçilen Ücret' : 'Selected Fee',
          value: `${selectedEstimate.satsPerVbyte} sat/vB · ${formatGroupedInt(selectedEstimate.totalFeeSats)} sats · $${selectedEstimate.totalFeeUsd.toFixed(4)}`,
          accent: 'ember',
        },
        sections: [
          {
            heading: tr ? 'İşlem Parametreleri' : 'Transaction Parameters',
            rows: [
              [tr ? 'Adres Türü' : 'Address Type', ADDRESS_LABEL[addressType]],
              [tr ? 'Girdi' : 'Inputs', String(inputCount)],
              [tr ? 'Çıktı' : 'Outputs', String(outputCount)],
              [tr ? 'TX Boyutu' : 'TX Size', `${selectedEstimate.estimatedSize} vBytes`],
              [tr ? 'Seçilen Öncelik' : 'Selected Priority', priorityLabel(priority, tr)],
            ],
          },
          ...(allEstimates ? [{
            kind: 'table' as const,
            heading: tr ? 'Tüm Ücret Seçenekleri' : 'All Fee Options',
            columns: [tr ? 'Öncelik' : 'Priority', tr ? 'Oran' : 'Rate', tr ? 'Toplam (sats)' : 'Total (sats)', 'USD', tr ? 'Süre' : 'Time'],
            rows: Object.entries(allEstimates).map(([key, est]) => [
              priorityLabel(key as Priority, tr),
              `${est.satsPerVbyte} sat/vB`,
              formatGroupedInt(est.totalFeeSats),
              `$${est.totalFeeUsd.toFixed(4)}`,
              est.confirmationTime,
            ]),
          }] : []),
        ],
        disclaimer: tr
          ? ['Bu, mevcut ağ koşullarına dayanan bir tahmindir. Gerçek ücretler farklılık gösterebilir.']
          : ['This is an estimate based on current network conditions. Actual fees may vary.'],
      });
      toast({ title: tr ? 'Rapor dışa aktarıldı!' : 'Report exported!' });
    } catch {
      toast({ title: tr ? 'Dışa aktarma başarısız' : 'Export failed', variant: 'destructive' });
    } finally { setBusy(false); }
  };

  const { copied, copyLink } = useShareExport({
    slug: 'transaction-fees',
    headline: tr ? 'Bitcoin İşlem Ücreti Hesaplayıcı' : 'Bitcoin Transaction Fee Calculator',
    params: { addressType, priority, inputs: inputCount, outputs: outputCount },
  });

  return (
    <ShareExportPanel
      actions={[
        { kind: 'pdf', onClick: handleExport, loading: busy, disabled: !selectedEstimate },
        { kind: 'copy-link', onClick: copyLink, copied },
      ]}
    />
  );
};
