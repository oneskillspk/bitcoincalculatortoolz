import { useState } from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Calculator, Coins, TrendingDown, Activity } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { InputPanel, CalculateButton } from '@/components/calculator';

interface StackSatsInputPanelProps {
  currentBtcHoldings: number;
  setCurrentBtcHoldings: (value: number) => void;
  targetBtcGoal: number;
  setTargetBtcGoal: (value: number) => void;
  monthlyContribution: number;
  setMonthlyContribution: (value: number) => void;
  currency: string;
  setCurrency: (value: string) => void;
  expectedGrowthRate: number;
  setExpectedGrowthRate: (value: number) => void;
  onCalculate: () => void;
  isCalculating: boolean;
}

const popularGoals = [
  { label: '1M Sats (0.01 BTC)', value: 0.01, description: 'Starter stack' },
  { label: '10M Sats (0.1 BTC)', value: 0.1, description: 'Serious accumulator' },
  { label: '50M Sats (0.5 BTC)', value: 0.5, description: 'Significant holder' },
  { label: '1 BTC (Whole Coiner)', value: 1.0, description: 'Rare achievement' },
  { label: '2.1 BTC (Top 1%)', value: 2.1, description: 'Elite holder' },
  { label: 'Custom Amount', value: -1, description: 'Set your own goal' }
];

const growthScenarios = [
  { label: 'Conservative (10%)', value: 10, description: 'Cautious planning', icon: TrendingDown },
  { label: 'Moderate (15%)', value: 15, description: 'Historical average', icon: Activity },
  { label: 'Optimistic (25%)', value: 25, description: 'Potential upside', icon: TrendingUp },
  { label: 'Custom Rate', value: -1, description: 'Set your own rate', icon: Calculator }
];

export const StackSatsInputPanel = ({
  currentBtcHoldings,
  setCurrentBtcHoldings,
  targetBtcGoal,
  setTargetBtcGoal,
  monthlyContribution,
  setMonthlyContribution,
  currency,
  setCurrency,
  expectedGrowthRate,
  setExpectedGrowthRate,
  onCalculate,
  isCalculating
}: StackSatsInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  const [showCustomGoal, setShowCustomGoal] = useState(false);
  const [showCustomRate, setShowCustomRate] = useState(false);

  const handleGoalSelect = (value: string) => {
    const numValue = parseFloat(value);
    if (numValue === -1) setShowCustomGoal(true); else { setShowCustomGoal(false); setTargetBtcGoal(numValue); }
  };

  const handleGrowthRateSelect = (value: string) => {
    const numValue = parseFloat(value);
    if (numValue === -1) setShowCustomRate(true); else { setShowCustomRate(false); setExpectedGrowthRate(numValue); }
  };

  return (
    <InputPanel
      title={tr ? 'Hedefinizi Belirleyin' : 'Set Your Goal'}
      onSubmit={(e) => { e.preventDefault(); if (!isCalculating && targetBtcGoal > currentBtcHoldings) onCalculate(); }}
      footer={
        <div className="space-y-2">
          <CalculateButton loading={isCalculating} disabled={targetBtcGoal <= currentBtcHoldings} fullWidth>
            {tr ? 'Hedef Zaman Çizelgesini Hesapla' : 'Calculate Goal Timeline'}
          </CalculateButton>
          {targetBtcGoal <= currentBtcHoldings && (
            <p className="text-sm text-destructive text-center">{tr ? 'Hedef, mevcut bakiyeden büyük olmalı' : 'Target goal must be greater than current holdings'}</p>
          )}
        </div>
      }
    >
        <div className="space-y-2">
          <Label htmlFor="goalPreset">{tr ? 'Hedef Kademesi' : 'Target Milestone'}</Label>
          <Select value={showCustomGoal ? '-1' : targetBtcGoal.toString()} onValueChange={handleGoalSelect}>
            <SelectTrigger id="goalPreset" className="h-11" aria-label={tr ? 'Hedef kademesi seçin' : 'Select target milestone'}>
              <SelectValue placeholder={tr ? 'Bir hedef seçin' : 'Choose a goal'} />
            </SelectTrigger>
            <SelectContent>
              {popularGoals.map((goal) => (
                <SelectItem key={goal.value} value={goal.value.toString()}>
                  <div className="flex flex-col">
                    <span className="font-medium">{tr ? (goal.value===0.01 ? '1M Sats (0.01 BTC)' : goal.value===0.1 ? '10M Sats (0.1 BTC)' : goal.value===0.5 ? '50M Sats (0.5 BTC)' : goal.value===1 ? '1 BTC (Tam Coin)' : goal.value===2.1 ? '2.1 BTC (İlk %1)' : 'Özel Tutar') : goal.label}</span>
                    <span className="text-xs text-muted-foreground">{tr ? (goal.value===0.01 ? 'Başlangıç stogu' : goal.value===0.1 ? 'Ciddi biriktirici' : goal.value===0.5 ? 'Önemli miktar' : goal.value===1 ? 'Nadir hedef' : goal.value===2.1 ? 'Seçkin seviye' : 'Kendi hedefinizi belirleyin') : goal.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showCustomGoal && (
          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="customTargetGoal">{tr ? 'Özel BTC Hedefi' : 'Custom BTC Goal'}</Label>
            <div className="relative">
              <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="customTargetGoal" type="number" inputMode="decimal" step="0.00000001" min="0" value={targetBtcGoal} onChange={(e) => setTargetBtcGoal(parseFloat(e.target.value) || 0)} className="pl-10 h-11" placeholder={tr ? 'BTC miktarı girin' : 'Enter BTC amount'} />
            </div>
            <p className="text-xs text-muted-foreground">{formatGroupedInt((targetBtcGoal * 100000000))} sats</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="currentHoldings">{tr ? 'Mevcut BTC Bakiyeniz' : 'Current BTC Holdings'}</Label>
          <div className="relative">
            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="currentHoldings" type="number" inputMode="decimal" step="0.00000001" min="0" value={currentBtcHoldings} onChange={(e) => setCurrentBtcHoldings(parseFloat(e.target.value) || 0)} className="pl-10 h-11" placeholder="0.00000000" />
          </div>
          <p className="text-xs text-muted-foreground">{formatGroupedInt((currentBtcHoldings * 100000000))} sats</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">{tr ? 'Para Birimi' : 'Currency'}</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency" className="h-11" aria-label={tr ? 'Para birimi seçin' : 'Select currency'}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_CURRENCIES.map((curr) => <SelectItem key={curr.code} value={curr.code}>{curr.symbol} {curr.code}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <Label htmlFor="monthlyContribution" className="text-sm">{tr ? 'Aylık Katkı' : 'Monthly Contribution'}</Label>
            <span className="text-sm font-medium text-primary">{formatGroupedInt(monthlyContribution)} {currency}</span>
          </div>
          <Slider id="monthlyContribution" min={10} max={10000} step={10} value={[monthlyContribution]} onValueChange={(value) => setMonthlyContribution(value[0])} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>10</span><span>10,000 {currency}</span></div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="growthScenario">{tr ? 'Beklenen Yıllık Büyüme' : 'Expected Annual Growth'}</Label>
          <Select value={showCustomRate ? '-1' : expectedGrowthRate.toString()} onValueChange={handleGrowthRateSelect}>
            <SelectTrigger id="growthScenario" className="h-11" aria-label={tr ? 'Büyüme senaryosu seçin' : 'Select growth scenario'}>
              <SelectValue placeholder={tr ? 'Senaryo seçin' : 'Choose scenario'} />
            </SelectTrigger>
            <SelectContent>
              {growthScenarios.map((scenario) => { const Icon = scenario.icon; return (<SelectItem key={scenario.value} value={scenario.value.toString()}><div className="flex items-center gap-2"><Icon className="w-4 h-4" /><div className="flex flex-col"><span className="font-medium">{tr ? (scenario.value===10 ? 'Muhafazakar (10%)' : scenario.value===15 ? 'Orta (15%)' : scenario.value===25 ? 'İyimser (25%)' : 'Özel Oran') : scenario.label}</span><span className="text-xs text-muted-foreground">{tr ? (scenario.value===10 ? 'Temkinli planlama' : scenario.value===15 ? 'Tarihsel ortalama' : scenario.value===25 ? 'Yukarı yönlü potansiyel' : 'Kendi oranınızı belirleyin') : scenario.description}</span></div></div></SelectItem>); })}
            </SelectContent>
          </Select>
        </div>

        {showCustomRate && (
          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="customGrowthRate">{tr ? 'Özel Yıllık Büyüme Oranı' : 'Custom Annual Growth Rate'}</Label>
            <div className="flex items-center gap-2">
              <Input id="customGrowthRate" type="number" inputMode="decimal" step="1" min="0" max="100" value={expectedGrowthRate} onChange={(e) => setExpectedGrowthRate(parseFloat(e.target.value) || 15)} className="flex-1 h-11" placeholder={tr ? 'Yüzde girin' : 'Enter percentage'} />
              <span className="text-sm text-muted-foreground min-w-[20px]">%</span>
            </div>
          </div>
        )}

    </InputPanel>
  );
};