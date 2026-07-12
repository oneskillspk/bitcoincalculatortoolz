import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, TrendingUp, TrendingDown } from 'lucide-react';
import { bitcoinApi } from '@/services/bitcoinApi';
import { subDays, subMonths, subYears } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatSymbolAmount } from '@/utils/numberFormat';

interface ConverterHistoricalContextProps {
  currentPrice: number;
  selectedCurrency: string;
  currencySymbol: string;
}

interface HistoricalRow {
  labelEn: string;
  labelTr: string;
  date: Date;
}

const buildRows = (): HistoricalRow[] => [
  { labelEn: '30 days ago', labelTr: '30 gün önce', date: subDays(new Date(), 30) },
  { labelEn: '90 days ago', labelTr: '90 gün önce', date: subMonths(new Date(), 3) },
  { labelEn: '1 year ago', labelTr: '1 yıl önce', date: subYears(new Date(), 1) },
];

const fetchHistorical = async (currency: string) => {
  const rows = buildRows();
  const results = await Promise.all(
    rows.map(async (r) => {
      try {
        const price = await bitcoinApi.getHistoricalPrice(r.date, currency);
        return { ...r, price };
      } catch {
        return { ...r, price: 0 };
      }
    }),
  );
  return results;
};

const formatPrice = (v: number, sym: string): string => {
  if (v <= 0) return '—';
  return formatSymbolAmount(v, sym, 0, 'en-US');
};

export const ConverterHistoricalContext: React.FC<ConverterHistoricalContextProps> = ({
  currentPrice,
  selectedCurrency,
  currencySymbol,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const { data: history, isLoading } = useQuery({
    queryKey: ['converter-historical', selectedCurrency],
    queryFn: () => fetchHistorical(selectedCurrency),
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  return (
    <Card className="bg-card border border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          {tr ? '1 BTC O Zaman Ne Kadardı' : 'What 1 BTC Cost Back Then'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {tr
            ? `Bugüne kıyasla geçmişteki ${selectedCurrency} fiyatları — hareketin dönüşüm matematiğinizi nasıl değiştirdiğini görün.`
            : `Historical ${selectedCurrency} prices vs. today, so you can see exactly how the move changed your conversion math.`}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(history ?? buildRows().map((r) => ({ ...r, price: 0 }))).map((row) => {
            const change = currentPrice > 0 && row.price > 0
              ? ((currentPrice - row.price) / row.price) * 100
              : null;
            const isUp = (change ?? 0) >= 0;
            return (
              <div
                key={row.labelEn}
                className="p-4 rounded-lg border border-border/30 bg-muted/20"
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {tr ? row.labelTr : row.labelEn}
                </div>
                <div className="font-mono text-base font-semibold text-foreground">
                  {isLoading && row.price === 0 ? '…' : formatPrice(row.price, currencySymbol)}
                </div>
                {change !== null && (
                  <div
                    className={cn(
                      'flex items-center gap-1 text-xs font-medium mt-2',
                      isUp ? 'text-success' : 'text-destructive',
                    )}
                  >
                    {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isUp ? '+' : ''}
                    {change.toFixed(1)}% {tr ? 'bugüne kadar' : 'to today'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground/70 mt-3">
          {tr
            ? 'Geçmiş fiyatlar CoinGecko\'nun günlük kapanış verilerinden alınmaktadır. Yukarıdaki hesaplayıcıda gördüğünüz dönüşüm her zaman canlı spot fiyatını kullanır.'
            : "Historical prices come from CoinGecko's daily close. The conversion you see in the calculator above always uses the live spot price."}
        </p>
      </CardContent>
    </Card>
  );
};
