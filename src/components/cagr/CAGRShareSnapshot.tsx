/**
 * CAGR share card — Round 3 migration to the shared `ShareSnapshotCard`.
 *
 * The full asset-comparison bar chart stays in the live calculator UI; the
 * social card highlights the top four CAGR results as stat tiles so the
 * shared 1280×720 layout stays consistent across the suite.
 */
import type { CAGRResult } from '@/services/cagrCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShareSnapshotCard } from '@/components/share-export';
import type { ShareCardPayload, ShareCardStat, ShareCardTone } from '@/components/share-export';

interface Props {
  result: CAGRResult;
}

function fmtCurrency(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

function toneFor(cagr: number, isBtc: boolean): ShareCardTone {
  if (isBtc) return 'ember';
  if (cagr >= 0) return 'success';
  return 'destructive';
}

export const CAGRShareSnapshot = ({ result }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const sorted = [...result.assets].sort((a, b) => b.cagr - a.cagr);
  const top = sorted.slice(0, 4);
  const stats: ShareCardStat[] = top.map((asset) => {
    const proj = result.projectedValues.find((p) => p.asset === asset.name);
    const isBtc = asset.ticker === 'BTC';
    return {
      label: `${asset.icon} ${asset.ticker}`,
      value: `${asset.cagr.toFixed(1)}%`,
      sub: proj ? `${tr ? 'tahmini' : 'projected'} ${fmtCurrency(proj.finalValue)}` : asset.name,
      tone: toneFor(asset.cagr, isBtc),
    };
  });

  const btc = result.assets.find((a) => a.ticker === 'BTC');
  const btcProj = result.projectedValues.find((p) => p.asset === btc?.name);

  const payload: ShareCardPayload = {
    calculatorLabel: tr ? 'Yıllık Bileşik Büyüme (CAGR)' : 'CAGR Comparison',
    eyebrow: tr
      ? `${fmtCurrency(result.investmentAmount)} · ${result.years} yıl`
      : `${fmtCurrency(result.investmentAmount)} compounded for ${result.years} years`,
    headline: tr ? "Bitcoin'in CAGR'ı" : "Bitcoin's CAGR",
    headlineValue: btc ? `${btc.cagr.toFixed(1)}%` : '—',
    headlineTone: 'ember',
    subline: btcProj
      ? (tr
          ? `${fmtCurrency(result.investmentAmount)} bugün ${fmtCurrency(btcProj.finalValue)} olurdu`
          : `${fmtCurrency(result.investmentAmount)} would compound to ${fmtCurrency(btcProj.finalValue)}`)
      : undefined,
    stats,
    footerLeft: tr
      ? 'bitcoincalculator.tools/tr/hesaplayicilar/cagr'
      : 'bitcoincalculator.tools/calculators/cagr',
    footerRight: tr ? 'Tarihsel veri · Ocak 2016 – Ocak 2026' : 'Historical data · Jan 2016 – Jan 2026',
  };

  const shareText = btc
    ? (tr
        ? `Bitcoin'in 10 yıllık CAGR'ı: %${btc.cagr.toFixed(1)} — bu anlık görüntüdeki geleneksel varlıklara karşı. ${payload.footerLeft}`
        : `Bitcoin's 10-year CAGR: ${btc.cagr.toFixed(1)}% — versus traditional assets in this snapshot. ${payload.footerLeft}`)
    : (tr
        ? `Bitcoin CAGR karşılaştırması — ${payload.footerLeft}`
        : `Bitcoin CAGR comparison — ${payload.footerLeft}`);

  return (
    <ShareSnapshotCard
      payload={payload}
      filename={{ en: 'bitcoin-cagr', tr: 'bitcoin-yillik-buyume' }}
      shareText={shareText}
      shareTitle={tr ? 'Bitcoin CAGR Anlık Görüntüsü' : 'Bitcoin CAGR Snapshot'}
    />
  );
};
