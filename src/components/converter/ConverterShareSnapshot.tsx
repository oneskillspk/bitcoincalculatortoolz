/**
 * Converter share card — Round 3 migration. The 9-currency grid mini-cards
 * collapse to four stat tiles (active fiat + three highest-liquidity peers);
 * the full grid stays in the live calculator UI and is not part of the social
 * image any more.
 */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShareSnapshotCard } from '@/components/share-export';
import type { ShareCardPayload, ShareCardStat } from '@/components/share-export';

interface Props {
  liveBtcPrice: number;
  selectedCurrency: string;
  currencySymbol: string;
}

const PEER_CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
];

interface SnapshotData {
  prices: Record<string, number>;
  changes: Record<string, number>;
}

const fetchSnapshotPrices = async (): Promise<SnapshotData> => {
  const vsCurrencies = PEER_CURRENCIES.map((c) => c.code.toLowerCase()).join(',');
  const { data } = await axios.get<{ bitcoin: Record<string, number> }>(
    'https://api.coingecko.com/api/v3/simple/price',
    { params: { ids: 'bitcoin', vs_currencies: vsCurrencies, include_24hr_change: 'true' }, timeout: 8000 },
  );
  const raw = data.bitcoin || {};
  const prices: Record<string, number> = {};
  const changes: Record<string, number> = {};
  Object.keys(raw).forEach((key) => {
    if (key.endsWith('_24h_change')) changes[key.replace('_24h_change', '')] = raw[key];
    else prices[key] = raw[key];
  });
  return { prices, changes };
};

function fmt(value: number, sym: string): string {
  if (!value || value <= 0) return '—';
  return `${sym}${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export const ConverterShareSnapshot = ({ liveBtcPrice, selectedCurrency, currencySymbol }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const { data: snapshot } = useQuery({
    queryKey: ['converter-snapshot-prices'],
    queryFn: fetchSnapshotPrices,
    refetchInterval: 60_000,
    staleTime: 50_000,
    retry: 2,
  });

  const prices = snapshot?.prices ?? {};
  const changes = snapshot?.changes ?? {};

  const peerStats: ShareCardStat[] = PEER_CURRENCIES.filter((c) => c.code !== selectedCurrency)
    .slice(0, 3)
    .map((c) => {
      const price = prices[c.code.toLowerCase()] ?? (c.code === 'USD' ? liveBtcPrice : 0);
      const change = changes[c.code.toLowerCase()];
      const arrow = typeof change === 'number' ? (change >= 0 ? '▲' : '▼') : '';
      const sub = typeof change === 'number'
        ? `${arrow} ${Math.abs(change).toFixed(2)}% 24h`
        : tr ? 'canlı kur' : 'live rate';
      return {
        label: c.code,
        value: fmt(price, c.symbol),
        sub,
        tone: typeof change === 'number' ? (change >= 0 ? 'success' : 'destructive') : 'ink',
      };
    });

  const heroLabel = liveBtcPrice > 0 ? fmt(liveBtcPrice, currencySymbol) : '—';

  const payload: ShareCardPayload = {
    calculatorLabel: tr ? 'Canlı BTC Dönüştürücü' : 'Live BTC Converter',
    eyebrow: tr ? `1 Bitcoin (${selectedCurrency})` : `1 Bitcoin in ${selectedCurrency}`,
    headline: tr ? 'Şu anki fiyatı' : 'Trading right now',
    headlineValue: heroLabel,
    headlineTone: 'ember',
    subline: tr ? 'Büyük fiat para birimleri arasında canlı' : 'Live across the major fiat pairs',
    stats: [
      { label: selectedCurrency, value: heroLabel, sub: tr ? 'seçili para birimi' : 'selected pair', tone: 'ember' },
      ...peerStats,
    ],
    footerLeft: tr
      ? 'bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-donusturucu'
      : 'bitcoincalculator.tools/calculators/bitcoin-converter',
    footerRight: tr ? 'CoinGecko · 30 sn yenileme' : 'CoinGecko · refreshed 30s',
  };

  const shareText = liveBtcPrice > 0
    ? (tr
        ? `1 BTC şu anda ${heroLabel} (${selectedCurrency}). Canlı kurlar için: ${payload.footerLeft}`
        : `1 BTC is ${heroLabel} (${selectedCurrency}) right now — live rates: ${payload.footerLeft}`)
    : (tr
        ? `9 büyük para birimi cinsinden canlı Bitcoin fiyatı — ${payload.footerLeft}`
        : `Live Bitcoin price across 9 major currencies — ${payload.footerLeft}`);

  return (
    <ShareSnapshotCard
      payload={payload}
      filename={{ en: 'bitcoin-converter', tr: 'bitcoin-donusturucu' }}
      shareText={shareText}
      shareTitle={tr ? 'Bitcoin Dönüştürücü' : 'Bitcoin Converter Snapshot'}
    />
  );
};
