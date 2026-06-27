import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { epcFor } from "@/lib/affiliateAI/epc";

type Row = { affiliate_id: string; slug: string; clicks: number };

/**
 * Revenue estimate dashboard.
 *
 * Joins click counts (last 30 days) with the static EPC table to surface
 * which (affiliate, slug) combinations are pulling weight and which are
 * burning impressions. Estimated only — replace EPC numbers in
 * src/lib/affiliateAI/epc.ts once real partner-dashboard EPCs arrive.
 */
export default function AdminRevenue() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("clicks")
        .select("affiliate_id, slug")
        .gte("ts", since)
        .limit(50000);
      if (cancelled) return;
      if (error) {
        setErr(error.message);
        setLoading(false);
        return;
      }
      const counts = new Map<string, Row>();
      for (const r of data ?? []) {
        const key = `${r.affiliate_id}|${r.slug}`;
        const cur = counts.get(key) ?? {
          affiliate_id: r.affiliate_id,
          slug: r.slug,
          clicks: 0,
        };
        cur.clicks += 1;
        counts.set(key, cur);
      }
      setRows([...counts.values()].sort((a, b) => b.clicks - a.clicks));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totals = useMemo(() => {
    let clicks = 0;
    let revenue = 0;
    for (const r of rows) {
      clicks += r.clicks;
      revenue += r.clicks * epcFor(r.affiliate_id);
    }
    return { clicks, revenue };
  }, [rows]);

  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (err) return <div className="text-sm text-destructive">Error: {err}</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Clicks (30d)" value={totals.clicks.toLocaleString()} />
        <Stat
          label="Estimated revenue (30d)"
          value={`$${totals.revenue.toFixed(2)}`}
        />
        <Stat
          label="Avg EPC"
          value={`$${
            totals.clicks ? (totals.revenue / totals.clicks).toFixed(2) : "0.00"
          }`}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Revenue is estimated by multiplying clicks by per-partner EPCs in
        <code className="mx-1">src/lib/affiliateAI/epc.ts</code>. Replace
        those with real partner-dashboard EPCs once available.
      </p>

      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider">
            <tr>
              <th className="px-3 py-2">Affiliate</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2 text-right">Clicks</th>
              <th className="px-3 py-2 text-right">EPC</th>
              <th className="px-3 py-2 text-right">Est. revenue</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const epc = epcFor(r.affiliate_id);
              return (
                <tr key={`${r.affiliate_id}|${r.slug}`} className="border-t border-border">
                  <td className="px-3 py-1.5 font-medium">{r.affiliate_id}</td>
                  <td className="px-3 py-1.5 text-muted-foreground">{r.slug}</td>
                  <td className="px-3 py-1.5 text-right">{r.clicks.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-right">${epc.toFixed(2)}</td>
                  <td className="px-3 py-1.5 text-right font-mono">
                    ${(r.clicks * epc).toFixed(2)}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                  No clicks in the last 30 days.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}
