import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { subDays } from 'date-fns';
import { bitcoinApi } from '@/services/bitcoinApi';

export interface LiveBitcoinData {
  price: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  lastUpdated: string;
  isLoading: boolean;
  error: Error | null;
}

export const useLiveBitcoinPrice = (currency: string = 'USD') => {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');

  const {
    data: marketData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['bitcoin-market-data', currency],
    queryFn: () => bitcoinApi.getCurrentMarketData(currency),
    refetchInterval: 10000, // 10 seconds — smooth live feed
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 8000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // 7-day-ago price for week-over-week trend
  const { data: price7dAgo } = useQuery({
    queryKey: ['bitcoin-price-7d-ago', currency],
    queryFn: () => bitcoinApi.getHistoricalPrice(subDays(new Date(), 7), currency),
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 60 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (marketData?.price && previousPrice !== null) {
      const priceDiff = marketData.price - previousPrice;
      const percentageChange = (priceDiff / previousPrice) * 100;
      
      if (percentageChange > 0.1) {
        setTrend('up');
      } else if (percentageChange < -0.1) {
        setTrend('down');
      } else {
        setTrend('neutral');
      }
    }
    
    if (marketData?.price) {
      setPreviousPrice(marketData.price);
    }
  }, [marketData?.price, previousPrice]);

  const refreshPrice = async () => {
    try {
      await refetch();
    } catch (error) {
      console.warn('Failed to refresh Bitcoin price:', error);
    }
  };

  const weekChangePercentage =
    price7dAgo && price7dAgo > 0 && marketData?.price
      ? ((marketData.price - price7dAgo) / price7dAgo) * 100
      : null;

  return {
    price: marketData?.price || 0,
    priceChange24h: marketData?.priceChange24h || 0,
    priceChangePercentage24h: marketData?.priceChangePercentage24h || 0,
    high24h: marketData?.high24h ?? null,
    low24h: marketData?.low24h ?? null,
    weekChangePercentage,
    lastUpdated: marketData?.lastUpdated || new Date().toISOString(),
    isLoading,
    error: error as Error | null,
    trend,
    refreshPrice
  };
};
