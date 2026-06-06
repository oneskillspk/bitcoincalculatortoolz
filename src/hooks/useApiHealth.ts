import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type HealthStatus = 'ok' | 'degraded' | 'down' | 'timeout' | 'error';

export interface HealthRow {
  endpoint_id: string;
  endpoint_url: string;
  status: HealthStatus;
  http_status: number | null;
  latency_ms: number | null;
  error: string | null;
  checked_at: string;
}

export interface EndpointSummary {
  endpoint_id: string;
  endpoint_url: string;
  uptimePct: number;
  latencyP50: number;
  latencyP95: number;
  lastStatus: HealthStatus;
  lastCheckedAt: string;
  lastError: string | null;
  samples: number;
}

function percentile(values: number[], p: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

export function useApiHealth(windowHours = 24) {
  const [rows, setRows] = useState<HealthRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const since = new Date(Date.now() - windowHours * 3600 * 1000).toISOString();

    (async () => {
      setLoading(true);
      // Cast to any: api_health_log is created by a new migration and not yet
      // in the generated Database types.
      const { data, error } = await (supabase as any)
        .from('api_health_log')
        .select('endpoint_id,endpoint_url,status,http_status,latency_ms,error,checked_at')
        .gte('checked_at', since)
        .order('checked_at', { ascending: false })
        .limit(5000);

      if (cancelled) return;
      if (error) setError(error.message);
      else setRows((data ?? []) as HealthRow[]);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [windowHours]);

  const summaries = useMemo<EndpointSummary[]>(() => {
    const byId = new Map<string, HealthRow[]>();
    for (const r of rows) {
      const list = byId.get(r.endpoint_id) ?? [];
      list.push(r);
      byId.set(r.endpoint_id, list);
    }
    return Array.from(byId.entries())
      .map(([id, list]) => {
        const okCount = list.filter((r) => r.status === 'ok').length;
        const latencies = list
          .map((r) => r.latency_ms ?? 0)
          .filter((n) => n > 0);
        const last = list[0];
        return {
          endpoint_id: id,
          endpoint_url: last.endpoint_url,
          uptimePct: list.length ? (okCount / list.length) * 100 : 0,
          latencyP50: Math.round(percentile(latencies, 50)),
          latencyP95: Math.round(percentile(latencies, 95)),
          lastStatus: last.status,
          lastCheckedAt: last.checked_at,
          lastError: last.error,
          samples: list.length,
        };
      })
      .sort((a, b) => a.endpoint_id.localeCompare(b.endpoint_id));
  }, [rows]);

  return { summaries, rows, loading, error };
}
