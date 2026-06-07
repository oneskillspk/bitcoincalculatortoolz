/**
 * Time-Machine share card — Round 3 migration to the shared `ShareSnapshotCard`.
 */
import type { TimeMachineResult } from '@/services/timeMachineService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { ShareSnapshotCard } from '@/components/share-export';
import type { ShareCardPayload } from '@/components/share-export';

interface Props {
  result: TimeMachineResult;
  dateLabel: string;
}

function makeFmtCurrency(tr: boolean, fxRate: number) {
  return (usd: number): string => {
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

  const payload: ShareCardPayload = {
    calculatorLabel: tr ? 'Zaman Makinesi' : 'Time Machine',
    eyebrow: tr ? `${dateLabel} tarihinde ${fmtCurrency(result.investment)} yatırılsaydı` : `If you invested ${fmtCurrency(result.investment)} on ${dateLabel}`,
    headline: tr ? 'Bugünkü değer' : 'Worth today',
    headlineValue: fmtCurrency(result.currentValue),
    headlineTone: tone,
    badge: { label: `${isPositive ? '+' : ''}${result.roi.toFixed(1)}% ROI`, tone },
    subline: tr
      ? `${result.btcAmount.toFixed(4)} BTC · ${fmtCurrency(result.priceOnDate)} → ${fmtCurrency(result.currentPrice)}`
      : `${result.btcAmount.toFixed(4)} BTC · ${fmtCurrency(result.priceOnDate)} → ${fmtCurrency(result.currentPrice)}`,
    stats: [
      { label: tr ? 'Satın alınan BTC' : 'BTC purchased', value: `${result.btcAmount.toFixed(4)} BTC`, tone: 'ember' },
      { label: tr ? 'O günkü fiyat' : 'Price then', value: fmtCurrency(result.priceOnDate), tone: 'ink' },
      { label: tr ? 'Bugünkü fiyat' : 'Price today', value: fmtCurrency(result.currentPrice), tone: 'ember' },
    ],
    footerLeft: tr
      ? 'bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-zaman-makinesi'
      : 'bitcoincalculator.tools/calculators/time-machine',
    footerRight: tr ? 'Tarihsel veri · CoinGecko' : 'Historical data · CoinGecko',
  };

  const shareText = tr
    ? `${dateLabel} tarihinde Bitcoin'e ${fmtCurrency(result.investment)} yatırsaydım, bugün ${fmtCurrency(result.currentValue)} ederdi (${isPositive ? '+' : ''}${result.roi.toFixed(1)}% ROI). ${payload.footerLeft}`
    : `If I'd invested ${fmtCurrency(result.investment)} in Bitcoin on ${dateLabel}, it would be worth ${fmtCurrency(result.currentValue)} today (${isPositive ? '+' : ''}${result.roi.toFixed(1)}% ROI). ${payload.footerLeft}`;

  return (
    <ShareSnapshotCard
      payload={payload}
      filename={{ en: 'bitcoin-time-machine', tr: 'bitcoin-zaman-makinesi' }}
      shareText={shareText}
      shareTitle={tr ? 'Bitcoin Zaman Makinesi' : 'Bitcoin Time Machine'}
    />
  );
};
