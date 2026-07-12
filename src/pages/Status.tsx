import { Helmet } from 'react-helmet-async';
import { useApiHealth, type HealthStatus } from '@/hooks/useApiHealth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_VARIANT: Record<HealthStatus, { label: string; className: string }> = {
  ok: { label: 'Operational', className: 'bg-success/$3 text-success border-success/30' },
  degraded: { label: 'Degraded', className: 'bg-warning/$3 text-warning border-warning/30' },
  down: { label: 'Down', className: 'bg-destructive/15 text-destructive border-destructive/30' },
  timeout: { label: 'Timeout', className: 'bg-destructive/15 text-destructive border-destructive/30' },
  error: { label: 'Error', className: 'bg-destructive/15 text-destructive border-destructive/30' },
};

function fmtAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.round(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}

export default function Status() {
  const { summaries, loading, error } = useApiHealth(24);
  const allOk = summaries.length > 0 && summaries.every((s) => s.lastStatus === 'ok');

  return (
    <main className="container mx-auto max-w-5xl px-4 py-16 md:py-20" aria-labelledby="status-heading">
      <Helmet>
        <title>API Status — bitcoincalculator.tools</title>
        <meta
          name="description"
          content="Live uptime and latency of the upstream data sources powering the Bitcoin calculators."
        />
        <link rel="canonical" href="https://bitcoincalculator.tools/status" />
      </Helmet>

      <header className="mb-8">
        <h1 id="status-heading" className="text-h1 font-bold">System status</h1>
        <p className="mt-2 text-muted-foreground">
          Live health of the data feeds powering every calculator. Checked every 5 minutes.
        </p>
        {!loading && !error && (
          <div className="mt-4">
            <Badge
              variant="outline"
              className={
                allOk
                  ? 'bg-success/$3 text-success border-success/30'
                  : 'bg-warning/$3 text-warning border-warning/30'
              }
            >
              {allOk ? 'All systems operational' : 'Some systems impacted'}
            </Badge>
          </div>
        )}
      </header>

      {error && (
        <Card>
          <CardContent className="py-6 text-destructive">Failed to load: {error}</CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : summaries.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No health data yet. Checks run every 5 minutes — please come back shortly.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {summaries.map((s) => {
            const variant = STATUS_VARIANT[s.lastStatus];
            return (
              <Card key={s.endpoint_id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-base">{s.endpoint_id}</CardTitle>
                    <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                      {s.endpoint_url}
                    </p>
                  </div>
                  <Badge variant="outline" className={variant.className}>
                    {variant.label}
                  </Badge>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 pt-0 text-sm sm:grid-cols-4">
                  <Metric label="24h uptime" value={`${s.uptimePct.toFixed(2)}%`} />
                  <Metric label="p50 latency" value={`${s.latencyP50} ms`} />
                  <Metric label="p95 latency" value={`${s.latencyP95} ms`} />
                  <Metric label="Last check" value={fmtAgo(s.lastCheckedAt)} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold tabular-nums">{value}</div>
    </div>
  );
}
