import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { bitcoinApi, BitcoinMarketData } from '@/services/bitcoinApi';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface LiveBitcoinPriceProps {
  currency?: string;
}

export const LiveBitcoinPrice = ({ currency = 'USD' }: LiveBitcoinPriceProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [marketData, setMarketData] = useState<BitcoinMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchMarketData = async () => {
    try {
      const data = await bitcoinApi.getCurrentMarketData(currency);
      setMarketData(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(tr ? 'Fiyat alınamadı' : 'Failed to fetch price');
      console.error('Price fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currency]);

  const formatPrice = (value: number) => {
    const currencySymbols: Record<string, string> = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥'
    };
    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatChangePercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return tr ? `${diffInSeconds}s önce` : `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return tr ? `${Math.floor(diffInSeconds / 60)}dk önce` : `${Math.floor(diffInSeconds / 60)}m ago`;
    return tr ? `${Math.floor(diffInSeconds / 3600)}sa önce` : `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <Card className="glass-morphism-card border-border/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="text-lg">₿</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                {tr ? 'Bitcoin Fiyatı' : 'Bitcoin Price'}
              </div>
              <div className="text-xs text-foreground/60 flex items-center gap-1">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isOnline ? "bg-success animate-pulse" : "bg-destructive"
                )} />
                {tr ? 'Canlı' : 'Live'} • {currency}
              </div>
            </div>
          </div>

          <div className="text-right space-y-1">
            {loading ? (
              <div className="space-y-2">
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" />
              </div>
            ) : error ? (
              <div className="text-sm text-destructive flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                {tr ? 'Hata' : 'Error'}
              </div>
            ) : marketData ? (
              <>
                <div className="font-mono font-bold text-lg text-foreground">
                  {formatPrice(marketData.price)}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    marketData.priceChangePercentage24h >= 0
                      ? "text-success"
                      : "text-destructive"
                  )}>
                    {marketData.priceChangePercentage24h >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {formatChangePercentage(marketData.priceChangePercentage24h)}
                  </div>
                </div>
                <div className="text-xs text-foreground/50">
                  {getTimeAgo(lastUpdate)}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
