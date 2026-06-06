import { Fragment, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const [expanded, setExpanded] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { creatives: string; creative_html: string }>>({});
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("affiliates")
      .select("id,name,category,tier,priority,enabled,default_format,creatives,creative_html")
      .order("priority", { ascending: false });
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = async (id: string, patch: Partial<Row>) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    const { error } = await supabase.from("affiliates").update(patch as never).eq("id", id);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
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

  if (loading) return <p className="text-muted-foreground text-sm">Loading affiliates…</p>;
  if (rows.length === 0) return <p className="text-muted-foreground text-sm">No affiliates yet.</p>;

  return (
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
          {rows.map((r) => {
            const creativeCount = Array.isArray(r.creatives) ? r.creatives.length : 0;
            return (
              <Fragment key={r.id}>
                <TableRow>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell>{r.name}</TableCell>
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
  );
}
