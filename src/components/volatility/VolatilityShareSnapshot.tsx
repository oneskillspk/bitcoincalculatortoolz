/**
 * Volatility share card — Round 3 migration to the shared `ShareSnapshotCard`.
 */
import type { VolatilityData } from '@/services/volatilityService';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShareSnapshotCard } from '@/components/share-export';
import type { ShareCardPayload, ShareCardTone } from '@/components/share-export';

interface Props {
  data: VolatilityData;
}

const regimeMeta: Record<VolatilityData['regime'], { en: string; tr: string; tone: ShareCardTone; accentEn: string; accentTr: string }> = {
  low:     { en: 'Low',     tr: 'Düşük',  tone: 'success',     accentEn: 'Coiled spring',    accentTr: 'Sıkışmış yay' },
  normal:  { en: 'Normal',  tr: 'Normal', tone: 'info',        accentEn: 'Steady cadence',   accentTr: 'Düzenli temp.' },
  high:    { en: 'High',    tr: 'Yüksek', tone: 'warning',     accentEn: 'Heated tape',      accentTr: 'Isınmış tape' },
  extreme: { en: 'Extreme', tr: 'Aşırı',  tone: 'destructive', accentEn: 'Liquidation zone', accentTr: 'Likidasyon bölg.' },
};

export const VolatilityShareSnapshot = ({ data }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const meta = regimeMeta[data.regime];
  const expectedUsd = Math.round((data.currentPrice * data.expectedDailyMove) / 100);

  const payload: ShareCardPayload = {
    calculatorLabel: tr ? 'Volatilite Anlık Görüntüsü' : 'Volatility Snapshot',
    eyebrow: tr ? 'BTC 30 günlük gerçekleşen volatilite' : 'BTC 30-day realized volatility',
    headline: tr ? 'Yıllıklandırılmış' : 'Annualized',
    headlineValue: `${data.vol30d.toFixed(1)}%`,
    headlineTone: meta.tone,
    subline: tr
      ? `${tr ? meta.tr : meta.en} rejim · ${meta.accentTr}`
      : `${meta.en} regime · ${meta.accentEn}`,
    badge: { label: tr ? `${data.volatilityPercentile}. dilim` : `${data.volatilityPercentile}th pct`, tone: meta.tone },
    stats: [
      { label: tr ? 'Rejim' : 'Regime', value: tr ? meta.tr : meta.en, sub: tr ? meta.accentTr : meta.accentEn, tone: meta.tone },
      {
        label: tr ? '1Y dilim' : '1Y percentile',
        value: tr ? `${data.volatilityPercentile}.` : `${data.volatilityPercentile}th`,
        sub: data.volatilityPercentile >= 75 ? (tr ? 'Üst çeyrek' : 'Top quartile')
          : data.volatilityPercentile <= 25 ? (tr ? 'Alt çeyrek' : 'Bottom quartile')
          : (tr ? 'Orta aralık' : 'Mid range'),
        tone: 'ink',
      },
      {
        label: tr ? 'Beklenen günlük hareket' : 'Expected daily move',
        value: `±${data.expectedDailyMove.toFixed(2)}%`,
        sub: `±$${expectedUsd.toLocaleString()}`,
        tone: 'ember',
      },
    ],
    footerLeft: tr
      ? 'bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-oynaklik'
      : 'bitcoincalculator.tools/calculators/volatility',
    footerRight: tr ? 'Log getiriler · √365 ile yıllıklandırılmış' : 'Log returns · annualized × √365',
  };

  const shareText = tr
    ? `BTC 30 günlük oynaklık: %${data.vol30d.toFixed(1)} (${meta.tr} rejimi, 1 yılın ${data.volatilityPercentile}. diliminde) — ${payload.footerLeft}`
    : `BTC 30d volatility: ${data.vol30d.toFixed(1)}% (${meta.en} regime, ${data.volatilityPercentile}th percentile vs 1y) — ${payload.footerLeft}`;

  return (
    <ShareSnapshotCard
      payload={payload}
      filename={{ en: 'bitcoin-volatility', tr: 'bitcoin-volatilite' }}
      shareText={shareText}
      shareTitle={tr ? 'Bitcoin Oynaklık Anlık Görüntüsü' : 'Bitcoin Volatility Snapshot'}
    />
  );
};
