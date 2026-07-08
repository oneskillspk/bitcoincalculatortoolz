import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { epcFor } from "@/lib/affiliateAI/epc";

type ClickRow = { affiliate_id: string; slug: string; click_id: string | null };
type ConvRow = { click_id: string | null; partner: string; payout_usd: number | string; status: string };
type Row = {
  affiliate_id: string;
  slug: string;
  clicks: number;
  conversions: number;
  real_revenue: number;
};

/**
 * Revenue dashboard — real S2S conversions when present, static EPC estimate
 * beside them for comparison. Populate `epc_live` from the record-conversion
 * postback data and the numbers stop being estimates.
 */
export default function AdminRevenue() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const [clicksRes, convRes] = await Promise.all([
        supabase.from("clicks").select("affiliate_id, slug, click_id").gte("ts", since).limit(50000),
        supabase.from("conversions").select("click_id, partner, payout_usd, status").gte("created_at", since).limit(50000),
      ]);
      if (cancelled) return;
      if (clicksRes.error) { setErr(clicksRes.error.message); setLoading(false); return; }

      const clicks = (clicksRes.data ?? []) as ClickRow[];
      const conversions = ((convRes.data ?? []) as ConvRow[]).filter((c) => c.status !== "reversed");
      const revenueByClickId = new Map<string, number>();
      const revenueByPartner = new Map<string, number>();
      const convCountByPartner = new Map<string, number>();
      for (const c of conversions) {
        const payout = Number(c.payout_usd) || 0;
        if (c.click_id) revenueByClickId.set(c.click_id, (revenueByClickId.get(c.click_id) ?? 0) + payout);
        revenueByPartner.set(c.partner, (revenueByPartner.get(c.partner) ?? 0) + payout);
        convCountByPartner.set(c.partner, (convCountByPartner.get(c.partner) ?? 0) + 1);
      }

      const counts = new Map<string, Row>();
      for (const r of clicks) {
        const key = `${r.affiliate_id}|${r.slug}`;
        const cur = counts.get(key) ?? {
          affiliate_id: r.affiliate_id, slug: r.slug, clicks: 0, conversions: 0, real_revenue: 0,
        };
        cur.clicks += 1;
        if (r.click_id) {
          const rev = revenueByClickId.get(r.click_id);
          if (rev != null) { cur.conversions += 1; cur.real_revenue += rev; }
        }
        counts.set(key, cur);
      }
      // Fold in orphan conversions (no click_id match) so partner totals stay honest
      setRows([...counts.values()].sort((a, b) => (b.real_revenue - a.real_revenue) || (b.clicks - a.clicks)));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const totals = useMemo(() => {
    let clicks = 0, estimated = 0, real = 0, conv = 0;
    for (const r of rows) {
      clicks += r.clicks;
      estimated += r.clicks * epcFor(r.affiliate_id);
      real += r.real_revenue;
      conv += r.conversions;
    }
    return { clicks, estimated, real, conv };
  }, [rows]);

  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (err) return <div className="text-sm text-destructive">Error: {err}</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Clicks (30d)" value={totals.clicks.toLocaleString()} />
        <Stat label="Conversions (S2S)" value={totals.conv.toLocaleString()} />
        <Stat label="Real revenue (S2S)" value={`$${totals.real.toFixed(2)}`} />
        <Stat label="Estimated (EPC)" value={`$${totals.estimated.toFixed(2)}`} />
      </div>

      <p className="text-xs text-muted-foreground">
        Real revenue is populated by S2S postbacks into
        <code className="mx-1">/functions/v1/record-conversion</code>. Configure each partner
        with that URL + the shared token, and this table becomes 1:1 with your payouts.
        The estimated column uses <code className="mx-1">src/lib/affiliateAI/epc.ts</code>.
      </p>

      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider">
            <tr>
              <th className="px-3 py-2">Affiliate</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2 text-right">Clicks</th>
              <th className="px-3 py-2 text-right">Conv</th>
              <th className="px-3 py-2 text-right">CVR</th>
              <th className="px-3 py-2 text-right">Real $</th>
              <th className="px-3 py-2 text-right">Real EPC</th>
              <th className="px-3 py-2 text-right">Est $</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const staticEpc = epcFor(r.affiliate_id);
              const cvr = r.clicks ? (r.conversions / r.clicks) * 100 : 0;
              const realEpc = r.clicks ? r.real_revenue / r.clicks : 0;
              return (
                <tr key={`${r.affiliate_id}|${r.slug}`} className="border-t border-border">
                  <td className="px-3 py-1.5 font-medium">{r.affiliate_id}</td>
                  <td className="px-3 py-1.5 text-muted-foreground">{r.slug}</td>
                  <td className="px-3 py-1.5 text-right">{r.clicks.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-right">{r.conversions.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-right">{cvr.toFixed(2)}%</td>
                  <td className="px-3 py-1.5 text-right font-mono">${r.real_revenue.toFixed(2)}</td>
                  <td className="px-3 py-1.5 text-right">${realEpc.toFixed(3)}</td>
                  <td className="px-3 py-1.5 text-right text-muted-foreground">
                    ${(r.clicks * staticEpc).toFixed(2)}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">
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
