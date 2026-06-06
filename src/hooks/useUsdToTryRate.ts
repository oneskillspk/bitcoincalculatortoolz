import { useQuery } from '@tanstack/react-query';
import { bitcoinApi } from '@/services/bitcoinApi';

/**
 * Returns the live USD→TRY exchange rate, derived from CoinGecko's
 * BTC/USD vs BTC/TRY prices (both fetched from the same source so the
 * ratio is internally consistent).
 *
 * Fallback: when the request fails, returns a recent monthly average
 * (May 2026 ≈ 39.5 ₺/$) so calculators never render NaN. Update yearly.
 */
const FALLBACK_RATE = 39.5;

export function useUsdToTryRate(): number {
  const { data: usd } = useQuery({
    queryKey: ['btc-price', 'USD'],
    queryFn: () => bitcoinApi.getCurrentPrice('USD'),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
  const { data: try_ } = useQuery({
    queryKey: ['btc-price', 'TRY'],
    queryFn: () => bitcoinApi.getCurrentPrice('TRY'),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  if (!usd || !try_ || usd <= 0) return FALLBACK_RATE;
  return try_ / usd;
}
