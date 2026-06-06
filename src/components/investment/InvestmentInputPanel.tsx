import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { GrowthModelSelector } from './GrowthModelSelector';
import { TIME_HORIZON_OPTIONS } from '@/services/investmentProjectionCalculator';
import { DollarSign, Calendar, Repeat, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { InputPanel } from '@/components/calculator';

interface InvestmentInputPanelProps {
  lumpSum: number;
  setLumpSum: (v: number) => void;
  monthlyContribution: number;
  setMonthlyContribution: (v: number) => void;
  timeHorizon: number;
  setTimeHorizon: (v: number) => void;
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
  customCAGR: number;
  setCustomCAGR: (v: number) => void;
  showCustom: boolean;
  setShowCustom: (v: boolean) => void;
  showInflation: boolean;
  setShowInflation: (v: boolean) => void;
  inflationRate: number;
  setInflationRate: (v: number) => void;
  useLivePrice: boolean;
  setUseLivePrice: (v: boolean) => void;
  customBtcPrice: number;
  setCustomBtcPrice: (v: number) => void;
  liveBtcPrice: number;
  targetBtcPrice: number;
  setTargetBtcPrice: (v: number) => void;
  showPriceTarget: boolean;
  setShowPriceTarget: (v: boolean) => void;
  currency?: string;
}

import { formatCurrencyAmount } from '@/utils/formatCurrency';

export const InvestmentInputPanel: React.FC<InvestmentInputPanelProps> = ({
  lumpSum, setLumpSum, monthlyContribution, setMonthlyContribution, timeHorizon, setTimeHorizon,
  selectedModels, onToggleModel, customCAGR, setCustomCAGR, showCustom, setShowCustom,
  showInflation, setShowInflation, inflationRate, setInflationRate,
  useLivePrice, setUseLivePrice, customBtcPrice, setCustomBtcPrice, liveBtcPrice,
  targetBtcPrice, setTargetBtcPrice, showPriceTarget, setShowPriceTarget, currency = 'USD',
}) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  const priceLocale = tr ? 'tr-TR' : (currency === 'TRY' ? 'tr-TR' : 'en-US');
  const currentBtcPrice = useLivePrice ? liveBtcPrice : customBtcPrice;

  return (
    <InputPanel title={tr ? 'Yatırım Parametreleri' : 'Investment Parameters'}>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="w-4 h-4 text-primary" />
            {tr?`Başlangıç Yatırımı (${currency})`:`Initial Investment (${currency})`}
          </Label>
          <Input type="number" value={lumpSum || ''} onChange={(e) => setLumpSum(Math.max(0, Number(e.target.value)))}
            placeholder={tr?'ör. 1.000':'e.g. 1,000'} className="font-mono" min={0} />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Repeat className="w-4 h-4 text-primary" />
            {tr?`Aylık Katkı (${currency})`:`Monthly Contribution (${currency})`}
          </Label>
          <Input type="number" value={monthlyContribution || ''} onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
            placeholder={tr?'ör. 100':'e.g. 100'} className="font-mono" min={0} />
          <p className="text-xs text-muted-foreground">
            {tr?'Dolar maliyet ortalama ile isteğe bağlı düzenli yatırım':'Optional recurring investment via dollar cost averaging'}
          </p>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4 text-primary" />
            {tr?'Zaman Ufku:':'Time Horizon:'} <span className="text-primary font-bold">{timeHorizon} {tr?(timeHorizon === 1 ? 'yıl' : 'yıl'):(timeHorizon === 1 ? 'year' : 'years')}</span>
          </Label>
          <Slider value={[TIME_HORIZON_OPTIONS.indexOf(timeHorizon)]}
            onValueChange={([idx]) => setTimeHorizon(TIME_HORIZON_OPTIONS[idx])}
            min={0} max={TIME_HORIZON_OPTIONS.length - 1} step={1} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {TIME_HORIZON_OPTIONS.map((y) => (
              <span key={y} className={cn(y === timeHorizon && "text-primary font-medium")}>{y}{tr?'y':'y'}</span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{tr?'Bitcoin Fiyatı':'Bitcoin Price'}</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{tr?'Canlı':'Live'}</span>
              <Switch checked={useLivePrice} onCheckedChange={setUseLivePrice} />
            </div>
          </div>
          {useLivePrice ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-mono font-medium text-foreground">
                {formatCurrencyAmount(liveBtcPrice, currency, { locale: priceLocale, decimals: 2 })}
              </span>
            </div>
          ) : (
            <Input type="number" value={customBtcPrice || ''} onChange={(e) => setCustomBtcPrice(Math.max(0, Number(e.target.value)))}
              placeholder={tr?'BTC fiyatı girin':'Enter BTC price'} className="font-mono" min={0} />
          )}
        </div>

        <GrowthModelSelector selectedModels={selectedModels} onToggleModel={onToggleModel}
          customCAGR={customCAGR} onCustomCAGRChange={setCustomCAGR} showCustom={showCustom} onToggleCustom={setShowCustom} />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">{tr?'Enflasyona göre ayarla':'Adjust for inflation'}</Label>
            <Switch checked={showInflation} onCheckedChange={setShowInflation} />
          </div>
          {showInflation && (
            <div className="flex items-center gap-2 pl-2">
              <Input type="number" value={inflationRate} onChange={(e) => setInflationRate(Math.max(0, Math.min(30, Number(e.target.value))))}
                className="w-20 text-center font-mono" min={0} max={30} step={0.1} />
              <span className="text-xs text-muted-foreground">{tr?'% yıllık':'% annual'}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="w-4 h-4" />
              {tr?'Fiyat hedefi modu':'Price target mode'}
            </Label>
            <Switch checked={showPriceTarget} onCheckedChange={setShowPriceTarget} />
          </div>
          {showPriceTarget && (
            <Input type="number" value={targetBtcPrice || ''} onChange={(e) => setTargetBtcPrice(Math.max(0, Number(e.target.value)))}
              placeholder={tr?'ör. 250.000':'e.g. 250,000'} className="font-mono" min={0} />
          )}
        </div>
    </InputPanel>
  );
};
