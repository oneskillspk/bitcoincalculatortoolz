import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw, Save } from "lucide-react";
import {
  PLACEMENT_SLOTS,
  TUNABLE_BROKERS,
  loadPlacementWeights,
  savePlacementWeights,
  resetPlacementWeights,
  type PlacementSlot,
  type WeightMap,
} from "@/config/placementWeights";

const SLOT_HINTS: Record<PlacementSlot, string> = {
  header: "Above-the-fold banner (highest visibility, lowest intent).",
  sidebar: "Sticky/side rail companion CTA on desktop.",
  "mid-page": "Post-result, mid-article and comparison zones (peak intent).",
  bottom: "Pre-footer / footer clusters (secondary conversion path).",
};

export default function AdminPlacements() {
  const { toast } = useToast();
  const [weights, setWeights] = useState<WeightMap>(() => loadPlacementWeights());
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const onChange = () => setWeights(loadPlacementWeights());
    window.addEventListener("placement-weights:changed", onChange);
    return () => window.removeEventListener("placement-weights:changed", onChange);
  }, []);

  const setWeight = (brokerId: string, slot: PlacementSlot, value: number) => {
    setWeights((prev) => ({
      ...prev,
      [brokerId]: { ...(prev[brokerId] ?? {}), [slot]: value },
    }));
    setDirty(true);
  };

  const save = () => {
    savePlacementWeights(weights);
    setDirty(false);
    toast({ title: "Placement weights saved", description: "Bandit will pick them up on the next impression." });
  };

  const reset = () => {
    resetPlacementWeights();
    setWeights(loadPlacementWeights());
    setDirty(false);
    toast({ title: "Reset to defaults" });
  };

  const totals = useMemo(() => {
    const out: Record<string, number> = {};
    for (const b of TUNABLE_BROKERS) {
      out[b.id] = PLACEMENT_SLOTS.reduce((sum, s) => sum + (weights[b.id]?.[s] ?? 0), 0);
    }
    return out;
  }, [weights]);

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-border bg-muted/30 p-4 text-sm">
        <p className="font-medium">Placement weights</p>
        <p className="text-xs text-muted-foreground mt-1">
          Multiplier applied to each broker's bandit score in the selected slot.
          <strong> 0 disables</strong> the broker in that slot, <strong>1 = default</strong>,
          higher = more likely to be shown. Persisted to the operator's browser (localStorage).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {TUNABLE_BROKERS.map((broker) => (
          <div key={broker.id} className="rounded-lg border border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{broker.name}</h3>
              <span className="text-xs text-muted-foreground">
                Σ weight: <strong className="text-foreground">{totals[broker.id].toFixed(1)}</strong>
              </span>
            </div>
            <div className="space-y-4">
              {PLACEMENT_SLOTS.map((slot) => {
                const value = weights[broker.id]?.[slot] ?? 1;
                return (
                  <div key={slot} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium capitalize">{slot.replace("-", " ")}</span>
                        <span className="text-muted-foreground ml-2">{SLOT_HINTS[slot]}</span>
                      </div>
                      <span className="font-mono tabular-nums">{value.toFixed(2)}×</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([v]) => setWeight(broker.id, slot, v)}
                      min={0}
                      max={3}
                      step={0.05}
                      aria-label={`${broker.name} ${slot} weight`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={save} disabled={!dirty}>
          <Save className="h-4 w-4 mr-1.5" /> Save weights
        </Button>
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="h-4 w-4 mr-1.5" /> Reset to defaults
        </Button>
        {dirty && <span className="text-xs text-amber-500">Unsaved changes</span>}
      </div>
    </div>
  );
}
