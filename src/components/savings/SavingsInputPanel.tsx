import { useState } from 'react';
import { InputPanel } from '@/components/calculator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, DollarSign, Percent, TrendingUp } from 'lucide-react';
import {
  PayFrequency,
  SavingsMode,
  FREQUENCY_LABELS,
  QUICK_PRESETS,
  PERCENTAGE_PRESETS,
  GROWTH_PRESETS,
  TIME_PRESETS,
  calculateSatsPerDollar,
  normalizeToMonthly,
} from '@/services/bitcoinSavingsCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

interface SavingsInputPanelProps {
  income: number;
  setIncome: (v: number) => void;
  frequency: PayFrequency;
  setFrequency: (v: PayFrequency) => void;
  savingsMode: SavingsMode;
  setSavingsMode: (v: SavingsMode) => void;
  fixedAmount: number;
  setFixedAmount: (v: number) => void;
  savingsPercentage: number;
  setSavingsPercentage: (v: number) => void;
  annualGrowthRate: number;
  setAnnualGrowthRate: (v: number) => void;
  timeHorizonMonths: number;
  setTimeHorizonMonths: (v: number) => void;
  savingsAccountAPY: number;
  setSavingsAccountAPY: (v: number) => void;
  useLivePrice: boolean;
  setUseLivePrice: (v: boolean) => void;
  customBtcPrice: number;
  setCustomBtcPrice: (v: number) => void;
  liveBtcPrice: number;
}

export const SavingsInputPanel = ({
  income, setIncome,
  frequency, setFrequency,
  savingsMode, setSavingsMode,
  fixedAmount, setFixedAmount,
  savingsPercentage, setSavingsPercentage,
  annualGrowthRate, setAnnualGrowthRate,
  timeHorizonMonths, setTimeHorizonMonths,
  savingsAccountAPY, setSavingsAccountAPY,
  useLivePrice, setUseLivePrice,
  customBtcPrice, setCustomBtcPrice,
  liveBtcPrice,
}: SavingsInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const currentPrice = useLivePrice ? liveBtcPrice : customBtcPrice;
  const satsPerDollar = calculateSatsPerDollar(currentPrice);

  const effectiveAmount = savingsMode === 'fixed' ? fixedAmount : income * (savingsPercentage / 100);
  const monthlyEquivalent = normalizeToMonthly(effectiveAmount, frequency);

  const handleQuickPreset = (amount: number, freq: PayFrequency) => {
    setSavingsMode('fixed');
    setFixedAmount(amount);
    setFrequency(freq);
  };

  const freqLabel = (freq: PayFrequency) => {
    if (!tr) return FREQUENCY_LABELS[freq];
    const map: Record<PayFrequency, string> = {
      weekly: 'Haftalık',
      biweekly: '2 Haftada Bir',
      semimonthly: 'Ayda 2 Kez',
      monthly: 'Aylık',
      annually: 'Yıllık',
    };
    return map[freq] ?? FREQUENCY_LABELS[freq];
  };

  const freqSingular = (freq: PayFrequency) => {
    if (!tr) return FREQUENCY_LABELS[freq].split(' ')[0].toLowerCase();
    const map: Record<PayFrequency, string> = {
      weekly: 'hafta',
      biweekly: '2 haftada bir',
      semimonthly: 'ayda 2 kez',
      monthly: 'ay',
      annually: 'yıl',
    };
    return map[freq] ?? freq;
  };

  return (
    <InputPanel
      className="glass-morphism-card"
      title={
        <span className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          {tr ? 'Tasarrufunuzu Planlayın' : 'Plan Your Savings'}
        </span>
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="income">{tr ? 'Gelir Tutarı' : 'Income Amount'}</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="income"
              type="number"
              min={0}
              value={income}
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              className="pl-10 h-11"
              placeholder="5000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">{tr ? 'Maaş Sıklığı' : 'Pay Frequency'}</Label>
          <Select value={frequency} onValueChange={(v) => setFrequency(v as PayFrequency)}>
            <SelectTrigger id="frequency" className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(FREQUENCY_LABELS) as PayFrequency[]).map((f) => (
                <SelectItem key={f} value={f}>{freqLabel(f)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>{tr ? 'Tasarruf Modu' : 'Savings Mode'}</Label>
          <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-1">
            <button
              onClick={() => setSavingsMode('fixed')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                savingsMode === 'fixed'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <DollarSign className="w-4 h-4 inline mr-1" />
              {tr ? 'Sabit Tutar' : 'Fixed Amount'}
            </button>
            <button
              onClick={() => setSavingsMode('percentage')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                savingsMode === 'percentage'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Percent className="w-4 h-4 inline mr-1" />
              {tr ? '% Gelir' : '% of Income'}
            </button>
          </div>
        </div>

        {savingsMode === 'fixed' && (
          <div className="space-y-3 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="fixedAmount">
                {tr
                  ? `${freqSingular(frequency)} başına tasarruf`
                  : `Savings per ${freqSingular(frequency)}`}
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fixedAmount"
                  type="number"
                  min={0}
                  value={fixedAmount}
                  onChange={(e) => setFixedAmount(parseFloat(e.target.value) || 0)}
                  className="pl-10 h-11"
                  placeholder="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                {tr ? 'Hızlı Ön Ayarlar' : 'Quick Presets'}
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QUICK_PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPreset(preset.amount, preset.frequency)}
                    className="text-xs h-9"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {income > 0 && (
              <p className="text-xs text-muted-foreground">
                ≈ {((effectiveAmount / income) * 100).toFixed(1)}%{' '}
                {tr ? `${freqSingular(frequency)} gelirinizin` : `of your ${frequency} income`}
              </p>
            )}
          </div>
        )}

        {savingsMode === 'percentage' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex justify-between items-center">
              <Label>{tr ? 'Tasarruf Yüzdesi' : 'Savings Percentage'}</Label>
              <span className="text-sm font-medium text-primary">{savingsPercentage}%</span>
            </div>
            <Slider
              min={1}
              max={50}
              step={1}
              value={[savingsPercentage]}
              onValueChange={(v) => setSavingsPercentage(v[0])}
            />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {PERCENTAGE_PRESETS.map((p) => (
                <Button
                  key={p}
                  variant={savingsPercentage === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSavingsPercentage(p)}
                  className="text-xs h-8"
                >
                  {p}%
                </Button>
              ))}
            </div>
            {income > 0 && (
              <p className="text-xs text-muted-foreground">
                = ${effectiveAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                {tr ? `${freqSingular(frequency)} başına` : `per ${frequency === 'annually' ? 'year' : frequency.replace('ly', '')}`}
              </p>
            )}
          </div>
        )}

        {monthlyEquivalent > 0 && (
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-center">
            <span className="text-xs text-muted-foreground">
              {tr ? 'Aylık Eşdeğer: ' : 'Monthly Equivalent: '}
            </span>
            <span className="text-sm font-semibold text-foreground">
              ${monthlyEquivalent.toLocaleString(undefined, { maximumFractionDigits: 2 })}/mo
            </span>
          </div>
        )}

        <div className="space-y-3">
          <Label>{tr ? 'Zaman Ufku' : 'Time Horizon'}</Label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {TIME_PRESETS.map((t) => (
              <Button
                key={t.months}
                variant={timeHorizonMonths === t.months ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeHorizonMonths(t.months)}
                className="text-xs h-9"
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>{tr ? 'Beklenen Yıllık Büyüme' : 'Expected Annual Growth'}</Label>
            <span className="text-sm font-medium text-primary">{annualGrowthRate}%</span>
          </div>
          <Slider
            min={0}
            max={50}
            step={1}
            value={[annualGrowthRate]}
            onValueChange={(v) => setAnnualGrowthRate(v[0])}
          />
          <div className="grid grid-cols-2 gap-2">
            {GROWTH_PRESETS.map((g) => (
              <Button
                key={g.value}
                variant={annualGrowthRate === g.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAnnualGrowthRate(g.value)}
                className="text-xs h-9 whitespace-nowrap"
              >
                {g.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t border-border/30 pt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="live-price-toggle" className="text-sm cursor-pointer">
              {tr ? 'Canlı BTC Fiyatını Kullan' : 'Use Live BTC Price'}
            </Label>
            <Switch
              id="live-price-toggle"
              checked={useLivePrice}
              onCheckedChange={setUseLivePrice}
            />
          </div>

          {!useLivePrice && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="customPrice">{tr ? 'Özel BTC Fiyatı' : 'Custom BTC Price'}</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="customPrice"
                  type="number"
                  min={1}
                  value={customBtcPrice}
                  onChange={(e) => setCustomBtcPrice(parseFloat(e.target.value) || 100000)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
          )}

          {currentPrice > 0 && (
            <p className="text-xs text-muted-foreground">
              1 USD = {Math.round(satsPerDollar).toLocaleString()} sats
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>
              {tr ? 'Tasarruf Hesabı APY (karşılaştırma için)' : 'Savings Account APY (for comparison)'}
            </Label>
            <span className="text-xs text-muted-foreground">{(savingsAccountAPY * 100).toFixed(1)}%</span>
          </div>
          <Slider
            min={0}
            max={10}
            step={0.1}
            value={[savingsAccountAPY * 100]}
            onValueChange={(v) => setSavingsAccountAPY(v[0] / 100)}
          />
        </div>
      </div>
    </InputPanel>
  );
};
