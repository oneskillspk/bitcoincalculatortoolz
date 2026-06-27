/**
 * Boot-time slot-stats sync.
 *
 * Once per session, fetches aggregated impressions/clicks from the
 * `aggregate-slot-stats` edge function and hands them to
 * `publishSlotStats()` so `rankedSlotPriority()` can use observed
 * EPC × CTR instead of platform defaults. Failure is silent —
 * the orchestrator just keeps using defaults.
 */
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { publishSlotStats, type SlotStatsMap } from "@/lib/placement/slotPerformance";

const SESSION_KEY = "aff_slot_stats_synced_v1";

export function useSlotStatsSync() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1") return;
        const { data, error } = await supabase.functions.invoke<{ stats: SlotStatsMap }>(
          "aggregate-slot-stats",
        );
        if (cancelled || error || !data?.stats) return;
        publishSlotStats(data.stats);
        try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* noop */ }
      } catch {
        /* silent — defaults remain */
      }
    })();
    return () => { cancelled = true; };
  }, []);
}
