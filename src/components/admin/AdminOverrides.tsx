import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface Override {
  id: string;
  slug: string;
  lang: string;
  forced_affiliate_id: string | null;
  forced_zone: string | null;
  hidden: boolean;
  expires_at: string | null;
}

export default function AdminOverrides() {
  const [rows, setRows] = useState<Override[]>([]);
  const [draft, setDraft] = useState<Partial<Override>>({ slug: "", lang: "en", hidden: false });
  const { toast } = useToast();

  const load = async () => {
    const { data, error } = await supabase
      .from("affiliate_overrides")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setRows((data as Override[]) ?? []);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!draft.slug || !draft.lang) {
      toast({ title: "Slug + lang required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("affiliate_overrides").insert({
      slug: draft.slug,
      lang: draft.lang,
      forced_affiliate_id: draft.forced_affiliate_id || null,
      forced_zone: draft.forced_zone || null,
      hidden: !!draft.hidden,
    });
    if (error) { toast({ title: "Create failed", description: error.message, variant: "destructive" }); return; }
    setDraft({ slug: "", lang: "en", hidden: false });
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("affiliate_overrides").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="border border-border rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-sm">Add override</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-end">
          <Input placeholder="slug" value={draft.slug || ""} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          <Input placeholder="lang (en/tr)" value={draft.lang || ""} onChange={(e) => setDraft({ ...draft, lang: e.target.value })} />
          <Input placeholder="forced affiliate id" value={draft.forced_affiliate_id || ""} onChange={(e) => setDraft({ ...draft, forced_affiliate_id: e.target.value })} />
          <Input placeholder="forced zone" value={draft.forced_zone || ""} onChange={(e) => setDraft({ ...draft, forced_zone: e.target.value })} />
          <div className="flex items-center gap-2">
            <Switch checked={!!draft.hidden} onCheckedChange={(v) => setDraft({ ...draft, hidden: v })} />
            <span className="text-sm">Hidden</span>
          </div>
          <Button onClick={create}>Add</Button>
        </div>
      </div>

      <div className="border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slug</TableHead>
              <TableHead>Lang</TableHead>
              <TableHead>Forced affiliate</TableHead>
              <TableHead>Forced zone</TableHead>
              <TableHead>Hidden</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-muted-foreground text-sm">No overrides.</TableCell></TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.slug}</TableCell>
                <TableCell>{r.lang}</TableCell>
                <TableCell className="text-sm">{r.forced_affiliate_id || "—"}</TableCell>
                <TableCell className="text-sm">{r.forced_zone || "—"}</TableCell>
                <TableCell>{r.hidden ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-sm" onClick={() => remove(r.id)}>
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
