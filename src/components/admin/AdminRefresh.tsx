import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

export default function AdminRefresh() {
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("refresh-decisions", { body: {} });
    setBusy(false);
    if (error) {
      toast({ title: "Refresh failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Decisions refreshed",
      description: `${data?.written ?? 0} cells written, ${data?.failures ?? 0} failures.`,
    });
  };

  return (
    <Button size="sm" onClick={handleRefresh} disabled={busy}>
      <RefreshCw className={busy ? "animate-spin" : ""} />
      {busy ? "Refreshing…" : "Refresh now"}
    </Button>
  );
}
