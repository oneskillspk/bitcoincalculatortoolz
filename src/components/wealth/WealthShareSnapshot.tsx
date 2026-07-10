/**
 * Wealth-percentile share card — Round 3 migration to the shared
 * `ShareSnapshotCard`. Replaces the hand-rolled dark canvas painter so this
 * surface ships with brand paper/ink/ember tokens and the unified 1280×720
 * social layout.
 */
import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import type { PercentileResult } from '@/services/wealthPercentileService';
import { btcToSats } from '@/services/wealthPercentileService';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShareSnapshotCard } from '@/components/share-export';
import type { ShareCardPayload } from '@/components/share-export';

interface Props {
  result: PercentileResult;
}

export const WealthShareSnapshot = ({ result }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const sats = btcToSats(result.btcAmount);
  const locale = getCurrentIntlLocale();

  const payload: ShareCardPayload = {
    calculatorLabel: tr ? 'Servet Dilimi' : 'Wealth Percentile',
    eyebrow: `${result.tier.tierEmoji}  ${result.tier.tierName}`,
    headline: tr ? 'Tüm BTC sahiplerinin' : 'Out of every BTC holder',
    headlineValue: `${result.percentile.toFixed(1)}%`,
    headlineTone: 'ember',
    subline: tr ? 'üst diliminde yer alıyorsun' : "you're ranked above",
    stats: [
      {
        label: tr ? 'BTC bakiyesi' : 'BTC holdings',
        value: `${result.btcAmount.toFixed(4)} BTC`,
        sub: `${sats.toLocaleString(locale)} sats`,
        tone: 'ink',
      },
      {
        label: tr ? 'Arz payı' : 'Supply share',
        value: `${result.supplyPercentage.toFixed(4)}%`,
        sub: tr ? 'toplam arzdan' : 'of total supply',
        tone: 'ember',
      },
      {
        label: tr ? 'Altındaki adres' : 'Addresses below',
        value: result.addressesAbove.toLocaleString(locale),
        sub: tr ? 'daha az BTC ile' : 'with less BTC',
        tone: 'ink',
      },
    ],
    footerLeft: tr
      ? 'bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-servet-yuzdesi'
      : 'bitcoincalculator.tools/calculators/wealth-percentile',
    footerRight: tr ? 'Zincir verisi · BitInfoCharts' : 'On-chain data · BitInfoCharts',
  };

  // Append the canonical URL so the copied text is a shareable backlink,
  // not just prose. Locale-aware — TR readers land on /tr/hesaplayicilar/…
  const shareUrl = tr
    ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-servet-yuzdesi'
    : 'https://bitcoincalculator.tools/calculators/wealth-percentile';
  const shareText = tr
    ? `${result.tier.tierEmoji} ${result.tier.tierName} olarak ${result.btcAmount} BTC ile tüm Bitcoin sahiplerinin %${result.percentile.toFixed(1)} servet diliminindeyim. Siz neredesiniz?\n\n${shareUrl}`
    : `I'm in the top ${result.percentile.toFixed(1)}% of Bitcoin holders as a ${result.tier.tierEmoji} ${result.tier.tierName} with ${result.btcAmount} BTC. What's your rank?\n\n${shareUrl}`;

  return (
    <ShareSnapshotCard
      payload={payload}
      filename={{ en: 'bitcoin-wealth', tr: 'bitcoin-servet' }}
      shareText={shareText}
      shareTitle={tr ? 'Bitcoin Servet Dilimim' : 'My Bitcoin Wealth Percentile'}
    />
  );
};
