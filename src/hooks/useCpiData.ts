import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Hardcoded BLS CPI (CUUR0000SA0) annual averages, 2026 reference. Used as
// instant-render fallback while the live edge function loads or fails.
export const FALLBACK_CPI: Record<number, number> = {
  2010: 218.056,
  2011: 224.939,
  2012: 229.594,
  2013: 232.957,
  2014: 236.736,
  2015: 237.017,
  2016: 240.007,
  2017: 245.120,
  2018: 251.107,
  2019: 255.657,
  2020: 258.811,
  2021: 270.970,
  2022: 292.655,
  2023: 304.702,
  2024: 313.689,
  2025: 322.000,
  2026: 329.500,
};

export interface CpiData {
  cpi: Record<number, number>;
  latestValue: number;
  source: string;
  fetchedAt: string | null;
  isLive: boolean;
}

const FALLBACK: CpiData = {
  cpi: FALLBACK_CPI,
  latestValue: FALLBACK_CPI[2026],
  source: 'fallback_local',
  fetchedAt: null,
  isLive: false,
};

export function useCpiData() {
  return useQuery<CpiData>({
    queryKey: ['cpi-data'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('cpi-data');
        if (error || !data?.cpi) return FALLBACK;
        const cpi: Record<number, number> = {};
        for (const [k, v] of Object.entries(data.cpi as Record<string, number>)) {
          const n = Number(k);
          if (Number.isFinite(n) && typeof v === 'number') cpi[n] = v;
        }
        return {
          cpi: { ...FALLBACK_CPI, ...cpi },
          latestValue: typeof data.latest_value === 'number' ? data.latest_value : FALLBACK_CPI[2026],
          source: data.source ?? 'unknown',
          fetchedAt: data.fetched_at ?? null,
          isLive: data.source === 'bls_cuur0000sa0',
        };
      } catch {
        return FALLBACK;
      }
    },
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: FALLBACK,
  });
}
