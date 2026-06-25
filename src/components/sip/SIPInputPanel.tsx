import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { SIPFrequency } from '@/services/sipCalculatorService';
import { SIPCard } from './SIPCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface SIPInputPanelProps {
  amount: number;
  setAmount: (v: number) => void;
  frequency: SIPFrequency;
  setFrequency: (v: SIPFrequency) => void;
  expectedReturn: number;
  setExpectedReturn: (v: number) => void;
  timePeriod: number;
  setTimePeriod: (v: number) => void;
  inflationEnabled: boolean;
  setInflationEnabled: (v: boolean) => void;
  inflationRate: number;
  setInflationRate: (v: number) => void;
}

const returnPresetsEn = [
  { label: 'Conservative', value: 15 },
  { label: 'Moderate', value: 30 },
  { label: 'Aggressive', value: 50 },
  { label: 'Historical', value: 60 },
];

const returnPresetsTr = [
  { label: 'Muhafazakâr', value: 15 },
  { label: 'Orta', value: 30 },
  { label: 'Agresif', value: 50 },
  { label: 'Tarihsel', value: 60 },
];

const periodPresets = [1, 3, 5, 10];

export const SIPInputPanel: React.FC<SIPInputPanelProps> = ({
  amount, setAmount,
  frequency, setFrequency,
  expectedReturn, setExpectedReturn,
  timePeriod, setTimePeriod,
  inflationEnabled, setInflationEnabled,
  inflationRate, setInflationRate,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const returnPresets = tr ? returnPresetsTr : returnPresetsEn;

  const freqLabel = (f: SIPFrequency) => {
    if (f === 'weekly') return tr ? 'Haftalık' : 'Weekly';
    if (f === 'biweekly') return tr ? 'İki Haftada Bir' : 'Biweekly';
    return tr ? 'Aylık' : 'Monthly';
  };

  return (
    <SIPCard className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">{tr ? 'DYP Parametreleri' : 'SIP Parameters'}</h2>

      <div className="space-y-3" data-currency-exempt="true">
        <Label className="text-sm font-medium text-foreground">{tr ? 'DYP Tutarı (USD)' : 'SIP Amount (USD)'}</Label>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">$</span>
          <Input
            type="number" inputMode="decimal"
            min={10}
            max={10000}
            value={amount}
            onChange={(e) => setAmount(Math.max(10, Math.min(10000, Number(e.target.value) || 10)))}
            className="font-mono"
          />
        </div>
        <Slider
          value={[amount]}
          onValueChange={([v]) => setAmount(v)}
          min={10}
          max={10000}
          step={10}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$10</span><span>$10,000</span>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">{tr ? 'Yatırım Sıklığı' : 'Investment Frequency'}</Label>
        <RadioGroup
          value={frequency}
          onValueChange={(v) => setFrequency(v as SIPFrequency)}
          className="grid grid-cols-3 gap-2"
        >
          {(['weekly', 'biweekly', 'monthly'] as SIPFrequency[]).map((f) => (
            <label
              key={f}
              className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium transition-all ${
                frequency === f
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border/40 text-muted-foreground hover:border-primary/30'
              }`}
            >
              <RadioGroupItem value={f} className="sr-only" />
              {freqLabel(f)}
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          {tr ? 'Beklenen Yıllık Getiri:' : 'Expected Annual Return:'} <span className="text-primary font-bold">{expectedReturn}%</span>
        </Label>
        <Slider
          value={[expectedReturn]}
          onValueChange={([v]) => setExpectedReturn(v)}
          min={5}
          max={100}
          step={1}
        />
        <div className="flex flex-wrap gap-2">
          {returnPresets.map((p) => (
            <Badge
              key={p.label}
              variant={expectedReturn === p.value ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => setExpectedReturn(p.value)}
            >
              {p.label} ({p.value}%)
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          {tr ? 'Süre:' : 'Time Period:'} <span className="text-primary font-bold">{timePeriod} {tr ? (timePeriod === 1 ? 'yıl' : 'yıl') : (timePeriod === 1 ? 'year' : 'years')}</span>
        </Label>
        <Slider
          value={[timePeriod]}
          onValueChange={([v]) => setTimePeriod(v)}
          min={1}
          max={20}
          step={1}
        />
        <div className="flex flex-wrap gap-2">
          {periodPresets.map((p) => (
            <Badge
              key={p}
              variant={timePeriod === p ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => setTimePeriod(p)}
            >
              {p} {tr ? (p === 1 ? 'yıl' : 'yıl') : (p === 1 ? 'year' : 'years')}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">{tr ? 'Enflasyona Göre Ayarla' : 'Adjust for Inflation'}</Label>
          <Switch checked={inflationEnabled} onCheckedChange={setInflationEnabled} />
        </div>
        {inflationEnabled && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              {tr ? 'Enflasyon Oranı:' : 'Inflation Rate:'} <span className="text-foreground font-medium">{inflationRate}%</span>
            </Label>
            <Slider
              value={[inflationRate]}
              onValueChange={([v]) => setInflationRate(v)}
              min={2}
              max={8}
              step={0.5}
            />
          </div>
        )}
      </div>
    </SIPCard>
  );
};
