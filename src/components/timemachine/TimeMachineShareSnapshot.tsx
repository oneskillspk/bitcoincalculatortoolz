/**
 * Time-Machine share card — Round 3 migration to the shared `ShareSnapshotCard`.
 */
import type { TimeMachineResult } from '@/services/timeMachineService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { ShareSnapshotCard } from '@/components/share-export';
import type { ShareCardPayload } from '@/components/share-export';
import { formatROI } from '@/utils/formatters';


interface Props {
  result: TimeMachineResult;
  dateLabel: string;
}

function makeFmtCurrency(tr: boolean, fxRate: number) {
  return (usd: number): string => {
    if (!Number.isFinite(usd)) return '—';
    const v = tr ? usd * fxRate : usd;
    const sym = tr ? '₺' : '$';
    if (v >= 1_000_000_000) return `${sym}${(v / 1_000_000_000).toFixed(2)}B`;
    if (v >= 1_000_000) return `${sym}${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `${sym}${(v / 1_000).toFixed(1)}K`;
    return `${sym}${v.toFixed(0)}`;
  };
}


export const TimeMachineShareSnapshot = ({ result, dateLabel }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const fmtCurrency = makeFmtCurrency(tr, fxRate);
  const isPositive = result.roi >= 0;
  const tone = isPositive ? 'success' : 'destructive';
  const btcAmountLabel = Number.isFinite(result.btcAmount) ? `${result.btcAmount.toFixed(4)} BTC` : '—';
  const roiLabel = formatROI(result.roi, 1);

  const payload: ShareCardPayload = {
    calculatorLabel: tr ? 'Zaman Makinesi' : 'Time Machine',
    eyebrow: tr ? `${dateLabel} tarihinde ${fmtCurrency(result.investment)} yatırılsaydı` : `If you invested ${fmtCurrency(result.investment)} on ${dateLabel}`,
    headline: tr ? 'Bugünkü değer' : 'Worth today',
    headlineValue: fmtCurrency(result.currentValue),
    headlineTone: tone,
    badge: { label: `${roiLabel} ROI`, tone },
    subline: tr
      ? `${btcAmountLabel} · ${fmtCurrency(result.priceOnDate)} → ${fmtCurrency(result.currentPrice)}`
      : `${btcAmountLabel} · ${fmtCurrency(result.priceOnDate)} → ${fmtCurrency(result.currentPrice)}`,
    stats: [
      { label: tr ? 'Satın alınan BTC' : 'BTC purchased', value: btcAmountLabel, tone: 'ember' },
      { label: tr ? 'O günkü fiyat' : 'Price then', value: fmtCurrency(result.priceOnDate), tone: 'ink' },
      { label: tr ? 'Bugünkü fiyat' : 'Price today', value: fmtCurrency(result.currentPrice), tone: 'ember' },
    ],
    footerLeft: tr
      ? 'bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-zaman-makinesi'
      : 'bitcoincalculator.tools/calculators/time-machine',
    footerRight: tr ? 'Tarihsel veri · CoinGecko' : 'Historical data · CoinGecko',
  };

  const shareText = tr
    ? `${dateLabel} tarihinde Bitcoin'e ${fmtCurrency(result.investment)} yatırsaydım, bugün ${fmtCurrency(result.currentValue)} ederdi (${roiLabel} ROI). ${payload.footerLeft}`
    : `If I'd invested ${fmtCurrency(result.investment)} in Bitcoin on ${dateLabel}, it would be worth ${fmtCurrency(result.currentValue)} today (${roiLabel} ROI). ${payload.footerLeft}`;


  return (
    <ShareSnapshotCard
      payload={payload}
      filename={{ en: 'bitcoin-time-machine', tr: 'bitcoin-zaman-makinesi' }}
      shareText={shareText}
      shareTitle={tr ? 'Bitcoin Zaman Makinesi' : 'Bitcoin Time Machine'}
    />
  );
};
