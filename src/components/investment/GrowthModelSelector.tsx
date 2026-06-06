import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { GROWTH_MODELS, type GrowthModel } from '@/services/investmentProjectionCalculator';
import { TrendingUp, Gauge, Rocket, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface GrowthModelSelectorProps {
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
  customCAGR: number;
  onCustomCAGRChange: (value: number) => void;
  showCustom: boolean;
  onToggleCustom: (show: boolean) => void;
}

const MODEL_ICONS: Record<string, React.ReactNode> = {
  conservative: <Gauge className="w-4 h-4" />,
  moderate: <TrendingUp className="w-4 h-4" />,
  aggressive: <Rocket className="w-4 h-4" />,
};

export const GrowthModelSelector: React.FC<GrowthModelSelectorProps> = ({
  selectedModels,
  onToggleModel,
  customCAGR,
  onCustomCAGRChange,
  showCustom,
  onToggleCustom,
}) => {
  const { language } = useLanguage();
  const tr = language==='tr';

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground">
        {tr?'Büyüme Senaryoları':'Growth Scenarios'}
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {GROWTH_MODELS.map((model) => {
          const isSelected = selectedModels.includes(model.id);
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onToggleModel(model.id)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 text-center",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/40 bg-card hover:border-border hover:bg-muted/30"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {MODEL_ICONS[model.id]}
              </div>
              <span className="text-sm font-medium text-foreground">{model.name}</span>
              <span className="text-xs text-muted-foreground">{(model.annualRate * 100).toFixed(0)}% CAGR</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <Label htmlFor="custom-cagr-toggle" className="text-sm text-muted-foreground cursor-pointer">
            {tr?'Özel büyüme oranı':'Custom growth rate'}
          </Label>
        </div>
        <Switch
          id="custom-cagr-toggle"
          checked={showCustom}
          onCheckedChange={onToggleCustom}
        />
      </div>

      {showCustom && (
        <div className="flex items-center gap-2 pl-6">
          <Input
            type="number"
            value={customCAGR}
            onChange={(e) => onCustomCAGRChange(Math.max(0, Math.min(500, Number(e.target.value))))}
            className="w-24 text-center font-mono"
            min={0}
            max={500}
            step={1}
          />
          <span className="text-sm text-muted-foreground">{tr?'% yıllık':'% annual'}</span>
        </div>
      )}
    </div>
  );
};
