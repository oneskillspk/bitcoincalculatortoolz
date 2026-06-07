import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Row { day: string; impressions: number; clicks: number; }
interface BreakdownRow {
  key: string;
  affiliate_id: string;
  slug: string;
  lang: string;
  impressions: number;
  clicks: number;
  ctr: number;
}

function bucketByDay(rows: { ts: string }[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) {
    const d = new Date(r.ts).toISOString().slice(0, 10);
    out[d] = (out[d] || 0) + 1;
  }
  return out;
}

function ctrBand(ctr: number): string {
  if (ctr >= 3) return "text-success";
  if (ctr >= 1) return "text-warning";
  return "text-destructive";
}

export default function AdminAnalytics() {
  const [data, setData] = useState<Row[]>([]);
  const [totals, setTotals] = useState({ imp: 0, clk: 0 });
  const [loading, setLoading] = useState(true);
  const [topAffiliates, setTopAffiliates] = useState<{ affiliate_id: string; clicks: number }[]>([]);
  const [breakdown, setBreakdown] = useState<BreakdownRow[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 14 * 86400_000).toISOString();
      const [imp, clk] = await Promise.all([
        supabase.from("impressions").select("ts,affiliate_id,slug,lang").gte("ts", since).limit(10000),
        supabase.from("clicks").select("ts,affiliate_id,slug,lang").gte("ts", since).limit(10000),
      ]);
      const impRows = (imp.data ?? []) as { ts: string; affiliate_id: string; slug: string; lang: string }[];
      const clkRows = (clk.data ?? []) as { ts: string; affiliate_id: string; slug: string; lang: string }[];
      const ib = bucketByDay(impRows);
      const cb = bucketByDay(clkRows);
      const days = new Set([...Object.keys(ib), ...Object.keys(cb)]);
      const merged = [...days].sort().map((d) => ({ day: d.slice(5), impressions: ib[d] || 0, clicks: cb[d] || 0 }));
      setData(merged);
      setTotals({ imp: impRows.length, clk: clkRows.length });

      const counts: Record<string, number> = {};
      for (const c of clkRows) counts[c.affiliate_id] = (counts[c.affiliate_id] || 0) + 1;
      setTopAffiliates(
        Object.entries(counts).map(([affiliate_id, clicks]) => ({ affiliate_id, clicks }))
          .sort((a, b) => b.clicks - a.clicks).slice(0, 10)
      );

      // Breakdown: affiliate × slug × lang
      const map = new Map<string, BreakdownRow>();
      const key = (r: { affiliate_id: string; slug: string; lang: string }) =>
        `${r.affiliate_id}|${r.slug}|${r.lang}`;
      for (const r of impRows) {
        const k = key(r);
        const ex = map.get(k);
        if (ex) ex.impressions++;
        else map.set(k, { key: k, affiliate_id: r.affiliate_id, slug: r.slug, lang: r.lang, impressions: 1, clicks: 0, ctr: 0 });
      }
      for (const r of clkRows) {
        const k = key(r);
        const ex = map.get(k);
        if (ex) ex.clicks++;
        else map.set(k, { key: k, affiliate_id: r.affiliate_id, slug: r.slug, lang: r.lang, impressions: 0, clicks: 1, ctr: 0 });
      }
      const rows = [...map.values()].map((r) => {
        r.ctr = r.impressions ? (r.clicks / r.impressions) * 100 : 0;
        return r;
      }).sort((a, b) => b.impressions - a.impressions);
      setBreakdown(rows);

      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-muted-foreground text-sm">Loading analytics…</p>;

  const ctr = totals.imp ? ((totals.clk / totals.imp) * 100).toFixed(2) : "0.00";
  const f = filter.trim().toLowerCase();
  const filtered = f
    ? breakdown.filter((r) =>
        r.affiliate_id.toLowerCase().includes(f) ||
        r.slug.toLowerCase().includes(f) ||
        r.lang.toLowerCase().includes(f)
      )
    : breakdown;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Impressions (14d)" value={totals.imp.toLocaleString()} />
        <Stat label="Clicks (14d)" value={totals.clk.toLocaleString()} />
        <Stat label="CTR" value={`${ctr}%`} />
      </div>

      <div className="border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium mb-4">Daily volume</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
              />
              <Bar dataKey="impressions" fill="hsl(var(--muted-foreground))" />
              <Bar dataKey="clicks" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium mb-4">Top affiliates by clicks (14d)</h3>
        {topAffiliates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No clicks yet.</p>
        ) : (
          <ul className="space-y-2">
            {topAffiliates.map((t) => (
              <li key={t.affiliate_id} className="flex justify-between text-sm">
                <span className="font-mono">{t.affiliate_id}</span>
                <span className="text-muted-foreground">{t.clicks}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4 gap-3">
          <h3 className="text-sm font-medium">CTR breakdown · affiliate × page × language</h3>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter…"
            className="text-xs px-2 py-1 rounded border border-border bg-background w-48"
          />
        </div>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data.</p>
        ) : (
          <div className="overflow-x-auto max-h-[480px]">
            <table className="w-full text-xs">
              <thead className="text-muted-foreground sticky top-0 bg-card">
                <tr className="text-left border-b border-border">
                  <th className="py-2 pr-3 font-medium">Affiliate</th>
                  <th className="py-2 pr-3 font-medium">Page</th>
                  <th className="py-2 pr-3 font-medium">Lang</th>
                  <th className="py-2 pr-3 font-medium text-right">Impr.</th>
                  <th className="py-2 pr-3 font-medium text-right">Clicks</th>
                  <th className="py-2 pr-0 font-medium text-right">CTR</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 500).map((r) => (
                  <tr key={r.key} className="border-b border-border/50">
                    <td className="py-1.5 pr-3 font-mono">{r.affiliate_id}</td>
                    <td className="py-1.5 pr-3 font-mono text-muted-foreground">{r.slug}</td>
                    <td className="py-1.5 pr-3 uppercase">{r.lang}</td>
                    <td className="py-1.5 pr-3 text-right tabular-nums">{r.impressions}</td>
                    <td className="py-1.5 pr-3 text-right tabular-nums">{r.clicks}</td>
                    <td className={`py-1.5 pr-0 text-right tabular-nums font-medium ${ctrBand(r.ctr)}`}>
                      {r.ctr.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 500 && (
              <p className="text-[11px] text-muted-foreground mt-2">
                Showing first 500 of {filtered.length} rows. Refine the filter to narrow.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border rounded-lg p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
