import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Trash2 } from "lucide-react";

interface Override {
  id: string;
  slug: string;
  lang: string;
  forced_affiliate_id: string | null;
  forced_zone: string | null;
  hidden: boolean;
  expires_at: string | null;
  created_at?: string;
}

const ZONES = ["", "post-result", "inline-mid-article", "sidebar", "pre-footer", "inline", "comparison", "footer"];

export default function AdminOverrides() {
  const [rows, setRows] = useState<Override[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Override>>({ slug: "", lang: "en", hidden: false });
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("affiliate_overrides")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setLoadError(error.message);
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    }
    setRows((data as Override[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!draft.slug?.trim() || !draft.lang?.trim()) {
      toast({ title: "Slug + lang required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("affiliate_overrides").insert({
      slug: draft.slug.trim(),
      lang: draft.lang,
      forced_affiliate_id: draft.forced_affiliate_id?.trim() || null,
      forced_zone: draft.forced_zone || null,
      hidden: !!draft.hidden,
    });
    if (error) { toast({ title: "Create failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Override created" });
    setDraft({ slug: "", lang: "en", hidden: false });
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("affiliate_overrides").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Override removed" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
        <p>
          <strong className="text-foreground">Note:</strong> the runtime engine is rule-based and no
          longer reads <code>affiliate_overrides</code>. These rows are kept for upcoming admin
          tooling; they currently do not affect what visitors see.
        </p>
      </div>

      <div className="border border-border rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-sm">Add override</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-end">
          <Input placeholder="slug" value={draft.slug || ""} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          <select
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={draft.lang || "en"}
            onChange={(e) => setDraft({ ...draft, lang: e.target.value })}
          >
            <option value="en">en</option>
            <option value="tr">tr</option>
          </select>
          <Input placeholder="forced affiliate id" value={draft.forced_affiliate_id || ""} onChange={(e) => setDraft({ ...draft, forced_affiliate_id: e.target.value })} />
          <select
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={draft.forced_zone || ""}
            onChange={(e) => setDraft({ ...draft, forced_zone: e.target.value })}
          >
            {ZONES.map((z) => <option key={z} value={z}>{z || "— zone —"}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <Switch checked={!!draft.hidden} onCheckedChange={(v) => setDraft({ ...draft, hidden: v })} />
            <span className="text-sm">Hidden</span>
          </div>
          <Button onClick={create}>Add</Button>
        </div>
      </div>

      {loadError && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 text-destructive shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-destructive">Couldn't load overrides</p>
            <p className="text-xs text-muted-foreground mt-0.5">{loadError}</p>
          </div>
          <Button size="sm" variant="outline" onClick={load}>Retry</Button>
        </div>
      )}

      <div className="border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slug</TableHead>
              <TableHead>Lang</TableHead>
              <TableHead>Forced affiliate</TableHead>
              <TableHead>Forced zone</TableHead>
              <TableHead>Hidden</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-muted-foreground text-sm">Loading overrides…</TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-muted-foreground text-sm text-center py-6">
                No overrides yet. Use the form above to force a specific affiliate for a slug+lang.
              </TableCell></TableRow>
            ) : rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.slug}</TableCell>
                <TableCell className="uppercase text-xs">{r.lang}</TableCell>
                <TableCell className="text-sm font-mono">{r.forced_affiliate_id || "—"}</TableCell>
                <TableCell className="text-sm">{r.forced_zone || "—"}</TableCell>
                <TableCell>{r.hidden ? "Yes" : "No"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {r.expires_at ? new Date(r.expires_at).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-sm" onClick={() => remove(r.id)} aria-label="Delete override">
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
