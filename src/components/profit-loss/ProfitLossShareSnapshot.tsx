/**
 * Profit/Loss share card — Round 3 migration to the shared `ShareSnapshotCard`.
 * Drops the previous custom dark canvas painter (#0a0a0a / #10b981 / #ef4444)
 * in favour of the brand-token 1280×720 layout.
 */
import type { ProfitLossResult } from '@/services/profitLossCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShareSnapshotCard } from '@/components/share-export';
import type { ShareCardPayload } from '@/components/share-export';
import { useFileDownload } from '@/hooks/useFileDownload';
import { csvNumber, csvBtc, csvPercent } from '@/utils/csvExport';

interface Props {
  result: ProfitLossResult;
}

function fmtCurrency(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export const ProfitLossShareSnapshot = ({ result }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { exportCsv } = useFileDownload();
  const isProfit = result.netProfitLoss >= 0;
  const tone = isProfit ? 'success' : 'destructive';
  const sign = isProfit ? '+' : '';

  const payload: ShareCardPayload = {
    calculatorLabel: tr ? 'Kâr / Zarar' : 'Profit & Loss',
    eyebrow: tr
      ? (isProfit ? 'Net kâr (ücretler sonrası)' : 'Net zarar (ücretler sonrası)')
      : (isProfit ? 'Net profit after fees' : 'Net loss after fees'),
    headline: tr ? 'Pozisyon sonucu' : 'Position outcome',
    headlineValue: `${sign}${fmtCurrency(result.netProfitLoss)}`,
    headlineTone: tone,
    badge: { label: `${sign}${result.roiPercent.toFixed(1)}% ROI`, tone },
    subline: tr
      ? `Satış ${fmtCurrency(result.sellPrice)} · Ücretler ${fmtCurrency(result.totalFeesPaid)} · Brüt ${fmtCurrency(result.grossProfitLoss)}`
      : `Sell ${fmtCurrency(result.sellPrice)} · Fees ${fmtCurrency(result.totalFeesPaid)} · Gross ${fmtCurrency(result.grossProfitLoss)}`,
    stats: [
      { label: tr ? 'Toplam yatırım' : 'Total invested', value: fmtCurrency(result.totalInvested), tone: 'ink' },
      { label: tr ? 'BTC bakiyesi' : 'BTC held', value: `${result.totalBtcHeld.toFixed(4)} BTC`, tone: 'ember' },
      { label: tr ? 'Ort. maliyet' : 'Avg cost basis', value: fmtCurrency(result.weightedAvgCostBasis), tone: 'ink' },
      { label: tr ? 'Başabaş fiyatı' : 'Break-even price', value: fmtCurrency(result.breakevenPrice), tone: 'ember' },
    ],
    footerLeft: tr
      ? 'bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi'
      : 'bitcoincalculator.tools/calculators/profit-loss',
    footerRight: tr ? 'Yalnızca tahmin · Vergi tavsiyesi değildir' : 'Estimates only · Not tax advice',
  };

  const direction = tr ? (isProfit ? 'artıda' : 'zararda') : (isProfit ? 'up' : 'down');
  const shareText = tr
    ? `BTC pozisyonum ücretler sonrası %${result.roiPercent.toFixed(1)} ${direction} (${sign}${fmtCurrency(result.netProfitLoss)} net) — ${payload.footerLeft}`
    : `My BTC position is ${direction} ${result.roiPercent.toFixed(1)}% (${sign}${fmtCurrency(result.netProfitLoss)} net) after fees — ${payload.footerLeft}`;

  /**
   * CSV of the same numbers the results panel shows — uses `result.sellPrice`,
   * the exact price the calculation ran with, so export and UI can't diverge.
   */
  const handleCsv = () => {
    exportCsv({
      meta: {
        calculator: tr ? 'Bitcoin Kâr / Zarar Hesaplayıcısı' : 'Bitcoin Profit & Loss Calculator',
        btcPrice: result.sellPrice,
        currency: 'USD',
        path: tr ? '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi' : '/calculators/profit-loss',
      },
      filename: { en: 'bitcoin-profit-loss-results', tr: 'bitcoin-kar-zarar-sonuclari' },
      columns: tr ? ['Metrik', 'Değer'] : ['Metric', 'Value'],
      rows: [
        [tr ? 'Toplam yatırım (USD)' : 'Total invested (USD)', csvNumber(result.totalInvested)],
        [tr ? 'Tutulan BTC (BTC)' : 'BTC held (BTC)', csvBtc(result.totalBtcHeld)],
        [tr ? 'Ağırlıklı ort. maliyet (USD)' : 'Weighted avg cost basis (USD)', csvNumber(result.weightedAvgCostBasis)],
        [tr ? 'Satış fiyatı (USD)' : 'Sell price (USD)', csvNumber(result.sellPrice)],
        [tr ? 'Brüt K/Z (USD)' : 'Gross P/L (USD)', csvNumber(result.grossProfitLoss)],
        [tr ? 'Ödenen toplam ücret (USD)' : 'Total fees paid (USD)', csvNumber(result.totalFeesPaid)],
        [tr ? 'Net K/Z (USD)' : 'Net P/L (USD)', csvNumber(result.netProfitLoss)],
        ['ROI', csvPercent(result.roiPercent)],
        [tr ? 'Başabaş fiyatı (USD)' : 'Break-even price (USD)', csvNumber(result.breakevenPrice)],
      ],
    });
  };

  return (
    <ShareSnapshotCard
      extraActions={[{ kind: 'csv', onClick: handleCsv }]}
      payload={payload}
      filename={{ en: 'bitcoin-profit-loss', tr: 'bitcoin-kar-zarar' }}
      shareText={shareText}
      shareTitle={tr ? 'Bitcoin K/Z Anlık Görüntüsü' : 'Bitcoin P/L Snapshot'}
    />
  );
};
