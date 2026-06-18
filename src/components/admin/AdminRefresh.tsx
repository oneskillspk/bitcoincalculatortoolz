import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      description: `${data?.written ?? 0} cells written, ${data?.failures ?? 0} failures. (Runtime is rule-based; this only repopulates the cache.)`,
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="outline" onClick={handleRefresh} disabled={busy}>
            <RefreshCw className={busy ? "animate-spin" : ""} />
            {busy ? "Refreshing…" : "Refresh cache"}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          Repopulates <code>decisions_cache</code>. The runtime engine is rule-based and does not
          read this cache; refreshing only affects future tooling.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
