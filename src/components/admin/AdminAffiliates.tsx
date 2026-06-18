import { Fragment, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Row {
  id: string;
  name: string;
  category: string;
  tier: number;
  priority: number;
  enabled: boolean;
  default_format: string | null;
  creatives: unknown;
  creative_html: string | null;
}

const FORMAT_OPTIONS = [
  "", "single-card", "two-card-strip", "image-banner", "html-banner",
  "sidebar-widget", "comparison", "inline-cta",
];

export default function AdminAffiliates() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { creatives: string; creative_html: string }>>({});
  const [filter, setFilter] = useState("");
  const [showDisabled, setShowDisabled] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("affiliates")
      .select("id,name,category,tier,priority,enabled,default_format,creatives,creative_html")
      .order("priority", { ascending: false });
    if (error) {
      setLoadError(error.message);
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    }
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = async (id: string, patch: Partial<Row>) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    const { error } = await supabase.from("affiliates").update(patch as never).eq("id", id);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      load(); // re-sync on failure
    }
  };

  const startEdit = (row: Row) => {
    setExpanded(row.id);
    setDrafts((d) => ({
      ...d,
      [row.id]: {
        creatives: JSON.stringify(row.creatives ?? [], null, 2),
        creative_html: row.creative_html ?? "",
      },
    }));
  };

  const saveCreatives = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    let parsed: unknown;
    try {
      parsed = draft.creatives.trim() ? JSON.parse(draft.creatives) : [];
    } catch (e) {
      toast({ title: "Invalid JSON", description: (e as Error).message, variant: "destructive" });
      return;
    }
    await update(id, { creatives: parsed, creative_html: draft.creative_html || null });
    toast({ title: "Saved", description: "Creatives updated." });
    setExpanded(null);
  };

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return rows.filter((r) => {
      if (!showDisabled && !r.enabled) return false;
      if (!q) return true;
      return (
        r.id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    });
  }, [rows, filter, showDisabled]);

  const enabledCount = useMemo(() => rows.filter((r) => r.enabled).length, [rows]);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted/40 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {loadError && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 text-destructive shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-destructive">Couldn't load affiliates</p>
            <p className="text-xs text-muted-foreground mt-0.5">{loadError}</p>
          </div>
          <Button size="sm" variant="outline" onClick={load}>
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Filter id, name, category…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-8 max-w-xs"
        />
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Switch checked={showDisabled} onCheckedChange={setShowDisabled} />
          Show disabled
        </label>
        <div className="ml-auto text-xs text-muted-foreground">
          {enabledCount} enabled · {rows.length} total
          {filter && ` · ${filtered.length} match`}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground text-sm p-6 text-center border border-dashed rounded-lg">
          No affiliates in the registry yet.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm p-6 text-center border border-dashed rounded-lg">
          No affiliates match the current filter.
        </p>
      ) : (
        <div className="border border-border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-24">Tier</TableHead>
                <TableHead className="w-28">Priority</TableHead>
                <TableHead className="w-40">Default format</TableHead>
                <TableHead className="w-24">Enabled</TableHead>
                <TableHead className="w-32">Creatives</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => {
                const creativeCount = Array.isArray(r.creatives) ? r.creatives.length : 0;
                return (
                  <Fragment key={r.id}>
                    <TableRow data-enabled={r.enabled}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell className={r.enabled ? "" : "text-muted-foreground"}>{r.name}</TableCell>
                      <TableCell>
                        <Input type="number" min={1} max={3} value={r.tier}
                          onChange={(e) => update(r.id, { tier: Number(e.target.value) })} className="h-8 w-16" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min={1} max={10} value={r.priority}
                          onChange={(e) => update(r.id, { priority: Number(e.target.value) })} className="h-8 w-16" />
                      </TableCell>
                      <TableCell>
                        <select
                          className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                          value={r.default_format ?? ""}
                          onChange={(e) => update(r.id, { default_format: e.target.value || null })}
                        >
                          {FORMAT_OPTIONS.map((f) => (
                            <option key={f} value={f}>{f || "auto"}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <Switch checked={r.enabled} onCheckedChange={(v) => update(r.id, { enabled: v })} />
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline"
                          onClick={() => expanded === r.id ? setExpanded(null) : startEdit(r)}>
                          {creativeCount} · {expanded === r.id ? "Close" : "Edit"}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expanded === r.id && drafts[r.id] && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-muted/30">
                          <div className="space-y-3 p-2">
                            <div>
                              <label className="text-xs font-semibold uppercase text-muted-foreground">Creatives (JSON array)</label>
                              <Textarea
                                rows={10}
                                className="font-mono text-xs mt-1"
                                value={drafts[r.id].creatives}
                                onChange={(e) => setDrafts((d) => ({ ...d, [r.id]: { ...d[r.id], creatives: e.target.value } }))}
                              />
                              <p className="text-[10px] text-muted-foreground mt-1">
                                Schema: {`[{ "size":"728x90","width":728,"height":90,"image_url":"…","image_url_2x":"…","alt":"…","lang":"en" }]`}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs font-semibold uppercase text-muted-foreground">HTML snippet (optional)</label>
                              <Textarea
                                rows={4}
                                className="font-mono text-xs mt-1"
                                placeholder="<a href=…><img src=… /></a>"
                                value={drafts[r.id].creative_html}
                                onChange={(e) => setDrafts((d) => ({ ...d, [r.id]: { ...d[r.id], creative_html: e.target.value } }))}
                              />
                            </div>
                            <Button size="sm" onClick={() => saveCreatives(r.id)}>Save creatives</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
