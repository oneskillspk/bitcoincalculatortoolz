import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatSymbolAmount } from '@/utils/numberFormat';

interface ConverterMultiCurrencyGridProps {
  liveUsdPrice: number;
  selectedCurrency: string;
  onSelectCurrency?: (code: string) => void;
}

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
];

interface MultiPriceResponse {
  bitcoin: Record<string, number>;
}

const fetchMultiPrices = async (): Promise<Record<string, number>> => {
  const vsCurrencies = CURRENCIES.map((c) => c.code.toLowerCase()).join(',');
  const { data } = await axios.get<MultiPriceResponse>(
    'https://api.coingecko.com/api/v3/simple/price',
    { params: { ids: 'bitcoin', vs_currencies: vsCurrencies }, timeout: 8000 }
  );
  return data.bitcoin || {};
};

const formatPrice = (v: number, sym: string, _code: string): string => {
  if (v <= 0) return '—';
  return formatSymbolAmount(v, sym, 0, 'en-US');
};

export const ConverterMultiCurrencyGrid: React.FC<ConverterMultiCurrencyGridProps> = ({ liveUsdPrice, selectedCurrency, onSelectCurrency }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const { data: prices, isLoading, isError } = useQuery({
    queryKey: ['converter-multi-currency'],
    queryFn: fetchMultiPrices,
    refetchInterval: 60_000,
    staleTime: 50_000,
    retry: 2,
  });

  const getPrice = (code: string): number => {
    if (prices?.[code.toLowerCase()]) return prices[code.toLowerCase()]!;
    if (code === 'USD') return liveUsdPrice;
    return 0;
  };

  return (
    <Card className="bg-card border border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-primary" />
          {tr ? '9 Büyük Para Biriminde 1 BTC' : '1 BTC in 9 Major Currencies'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {tr
            ? 'Dünyanın en çok aranan fiat çiftlerinde canlı anlık görüntü. Dönüştürücünüzü değiştirmek için bir karta dokunun.'
            : "Live snapshot across the world's most-searched fiat pairs. Tap a card to switch your converter."}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CURRENCIES.map((cur) => {
            const price = getPrice(cur.code);
            const isActive = cur.code === selectedCurrency;
            return (
              <button
                type="button"
                key={cur.code}
                onClick={() => onSelectCurrency?.(cur.code)}
                className={cn(
                  'min-h-[88px] text-left p-3 rounded-lg border transition-all',
                  'hover:border-primary/40 hover:bg-primary/5',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive ? 'border-primary/50 bg-primary/10' : 'border-border/30 bg-muted/20',
                )}
                aria-label={`${tr ? 'Dönüştürücüyü şu para biriminde göster:' : 'Show converter in'} ${cur.name}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">{cur.flag}</span>
                  <span className="text-xs font-semibold text-foreground">{cur.code}</span>
                </div>
                <div className="font-mono text-sm font-semibold text-foreground break-all">
                  {isLoading && !price ? '…' : formatPrice(price, cur.symbol, cur.code)}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">{cur.name}</div>
              </button>
            );
          })}
        </div>
        {isError && (
          <p className="text-xs text-muted-foreground mt-3">
            {tr
              ? 'Canlı çok para birimi beslemesi geçici olarak kullanılamıyor. Ana beslemeden USD gösteriliyor.'
              : 'Live multi-currency feed temporarily unavailable. Showing USD from the main feed.'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
