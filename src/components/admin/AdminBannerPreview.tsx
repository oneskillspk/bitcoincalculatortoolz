import { useMemo, useState } from "react";
import { AFFILIATES } from "@/config/affiliates.config";
import type { AffiliateProgram, AffiliateCreative } from "@/lib/affiliateAI/types";
import { Button } from "@/components/ui/button";

type BreakpointId = "desktop" | "tablet" | "mobile";

const BREAKPOINTS: { id: BreakpointId; label: string; width: number }[] = [
  { id: "desktop", label: "Desktop", width: 1200 },
  { id: "tablet", label: "Tablet", width: 768 },
  { id: "mobile", label: "Mobile", width: 375 },
];

const SLOT_MAX_WIDTHS: Record<string, number> = {
  header: 970,
  "mid-page": 728,
  bottom: 970,
  sidebar: 300,
};

function CreativeFrame({
  creative,
  frameWidth,
  slotLabel,
  affiliate,
}: {
  creative: AffiliateCreative;
  frameWidth: number;
  slotLabel: string;
  affiliate: AffiliateProgram;
}) {
  const slotCap = SLOT_MAX_WIDTHS[slotLabel] ?? 970;
  const containerCap = Math.min(frameWidth - 24, slotCap); // account for 12px each side padding
  const overflow = creative.width > containerCap;

  return (
    <div className="rounded-md border border-border bg-background overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1 text-[10px] text-muted-foreground bg-muted/40 border-b border-border">
        <span className="font-mono">{creative.size}</span>
        <span className={overflow ? "text-destructive font-medium" : "text-emerald-500"}>
          {overflow ? `overflow ${creative.width}>${containerCap}` : "fits"}
        </span>
      </div>
      {/* Frame simulating page viewport */}
      <div
        className="mx-auto bg-muted/10"
        style={{ width: frameWidth, maxWidth: "100%" }}
      >
        {/* Simulated slot container with page padding */}
        <div className="px-3 py-2 overflow-hidden">
          <div className="w-full max-w-full">
            <img
              src={creative.image_url}
              alt={creative.alt}
              width={creative.width}
              height={creative.height}
              loading="lazy"
              className="block h-auto max-w-full mx-auto rounded"
              style={{ aspectRatio: `${creative.width}/${creative.height}` }}
            />
          </div>
        </div>
      </div>
      <div className="px-2 py-1 text-[10px] text-muted-foreground truncate">
        {creative.alt}
      </div>
    </div>
  );
}

export default function AdminBannerPreview() {
  const [brokerId, setBrokerId] = useState<string>("axi");
  const [group, setGroup] = useState<"trade" | "reviews" | "all">("all");

  const brokers = useMemo(
    () => AFFILIATES.filter((p) => p.enabled && p.creatives?.length),
    [],
  );
  const affiliate = brokers.find((p) => p.id === brokerId);
  const creatives = useMemo(() => {
    if (!affiliate) return [];
    const list = affiliate.creatives ?? [];
    if (group === "all") return list;
    if (group === "trade") return list.filter((c) => /trade/i.test(c.alt));
    return list.filter((c) => /trustpilot|review|trader starts/i.test(c.alt));
  }, [affiliate, group]);

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-border bg-muted/30 p-4 text-sm">
        <p className="font-medium">Banner preview matrix</p>
        <p className="text-xs text-muted-foreground mt-1">
          Renders every creative for the selected broker at desktop / tablet / mobile widths so you can
          confirm nothing overflows the calculator layout before it reaches production traffic.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-muted-foreground">Broker</label>
        <select
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          value={brokerId}
          onChange={(e) => setBrokerId(e.target.value)}
        >
          {brokers.map((b) => (
            <option key={b.id} value={b.id}>{b.name} ({b.creatives?.length})</option>
          ))}
        </select>
        <div className="ml-4 flex items-center gap-1">
          {(["all", "trade", "reviews"] as const).map((g) => (
            <Button
              key={g}
              size="sm"
              variant={group === g ? "default" : "outline"}
              onClick={() => setGroup(g)}
            >
              {g[0].toUpperCase() + g.slice(1)}
            </Button>
          ))}
        </div>
        <span className="ml-auto text-xs text-muted-foreground">
          Showing <strong className="text-foreground">{creatives.length}</strong> creative(s)
        </span>
      </div>

      {creatives.map((c, i) => (
        <div key={`${c.image_url}-${i}`} className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              <span className="font-mono text-xs mr-2">#{i + 1}</span>
              {c.size} — {c.width}×{c.height}
            </h4>
            <a
              href={c.landing_url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-xs text-primary hover:underline"
            >
              Test landing →
            </a>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {BREAKPOINTS.map((bp) => (
              <div key={bp.id} className="space-y-1">
                <div className="text-[10px] text-muted-foreground font-mono">
                  {bp.label} · {bp.width}px
                </div>
                <CreativeFrame
                  creative={c}
                  frameWidth={bp.width}
                  slotLabel="mid-page"
                  affiliate={affiliate!}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
