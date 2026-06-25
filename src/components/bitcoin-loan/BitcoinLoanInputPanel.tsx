import React from 'react';
import { InputPanel, CalculateButton } from '@/components/calculator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calculator, RotateCcw, Zap, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { PLATFORM_PRESETS } from '@/services/bitcoinLoanCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoney } from '@/utils/formatMoney';
import { formatTRY } from '@/utils/formatTRY';

export interface LoanFormInputs {
  btcCollateral: number;
  btcPrice: number;
  loanAmountUsd: number;
  interestRateAnnual: number;
  loanTermMonths: number;
  initialLtv: number;
  marginCallLtv: number;
  liquidationLtv: number;
  expectedBtcGrowthRate: number;
  platform: string;
}

export interface LoanValidationErrors {
  btcCollateral?: string;
  btcPrice?: string;
  loanAmountUsd?: string;
  interestRateAnnual?: string;
}

interface Props {
  inputs: LoanFormInputs;
  onChange: (inputs: LoanFormInputs) => void;
  onCalculate: () => void;
  onReset: () => void;
  validationErrors?: LoanValidationErrors;
}

export const BitcoinLoanInputPanel: React.FC<Props> = ({ inputs, onChange, onCalculate, onReset, validationErrors = {} }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { price: livePrice } = useLiveBitcoinPrice();
  const fxRate = useUsdToTryRate();
  const fmtMoney = (usd: number) => formatMoney(usd, { tr, fxRate, decimals: 0 });
  const tryEq = (usd: number) => usd > 0 ? `≈ ${formatTRY(usd * fxRate, 0)}` : '';
  const updateField = <K extends keyof LoanFormInputs>(field: K, value: LoanFormInputs[K]) => {
    onChange({ ...inputs, [field]: value });
  };

  const handlePlatformChange = (platformId: string) => {
    const preset = PLATFORM_PRESETS.find(p => p.id === platformId);
    if (preset && platformId !== 'custom') {
      onChange({
        ...inputs,
        platform: platformId,
        initialLtv: preset.maxLtv,
        marginCallLtv: preset.marginCallLtv,
        liquidationLtv: preset.liquidationLtv,
      });
    } else {
      updateField('platform', platformId);
    }
  };

  const handleUseLivePrice = () => {
    if (livePrice > 0) {
      updateField('btcPrice', Math.round(livePrice));
    }
  };

  const maxLoan = inputs.btcCollateral * inputs.btcPrice * (inputs.initialLtv / 100);

  return (
    <InputPanel
      className="glass-morphism-card border-border/20"
      onSubmit={(e) => { e.preventDefault(); onCalculate(); }}
      title={
        <span className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          {tr ? 'Kredi Parametreleri' : 'Loan Parameters'}
        </span>
      }
      footer={
        <div className="flex flex-col sm:flex-row gap-3">
          <CalculateButton fullWidth>
            <Calculator className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{tr ? 'Kredi Detaylarını Hesapla' : 'Calculate Loan Details'}</span>
            <span className="sm:hidden">{tr ? 'Hesapla' : 'Calculate'}</span>
          </CalculateButton>
          <Button type="button" variant="outline" onClick={onReset} className="gap-2 sm:w-auto">
            <RotateCcw className="w-4 h-4" />
            {tr ? 'Sıfırla' : 'Reset'}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Platform Preset */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{tr ? 'Platform Türü' : 'Platform Type'}</Label>
          <Select value={inputs.platform} onValueChange={handlePlatformChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PLATFORM_PRESETS.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} ({tr ? 'maks' : 'max'} {p.maxLtv}% LTV, {p.interestRange})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* BTC Collateral */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-1">
            {tr ? 'BTC Teminat Miktarı' : 'BTC Collateral Amount'}
            <Tooltip><TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent><p className="max-w-xs text-xs">{tr ? 'Kredi için kilitleyeceğiniz Bitcoin miktarı' : 'Amount of Bitcoin you\'ll lock as collateral for the loan'}</p></TooltipContent>
            </Tooltip>
          </Label>
          <Input
            type="number" inputMode="decimal"
            step="0.01"
            min="0"
            value={inputs.btcCollateral || ''}
            onChange={e => updateField('btcCollateral', parseFloat(e.target.value) || 0)}
            placeholder={tr ? 'örn. 1.5' : 'e.g. 1.5'}
            className={validationErrors.btcCollateral ? 'border-destructive' : ''}
          />
          {validationErrors.btcCollateral && <p className="text-xs text-destructive">{validationErrors.btcCollateral}</p>}
        </div>

        {/* BTC Price */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{tr ? 'Bitcoin Fiyatı (USD)' : 'Bitcoin Price (USD)'}</Label>
          <div className="flex gap-2">
            <Input
              type="number" inputMode="decimal"
              min="0"
              value={inputs.btcPrice || ''}
              onChange={e => updateField('btcPrice', parseFloat(e.target.value) || 0)}
              placeholder={tr ? 'örn. 95000' : 'e.g. 95000'}
              className={`flex-1 ${validationErrors.btcPrice ? 'border-destructive' : ''}`}
            />
            <Button type="button" variant="outline" size="sm" onClick={handleUseLivePrice} className="shrink-0 gap-1">
              <Zap className="w-3.5 h-3.5" /> {tr ? 'Canlı' : 'Live'}
            </Button>
          </div>
          {validationErrors.btcPrice && <p className="text-xs text-destructive">{validationErrors.btcPrice}</p>}
          {tr && inputs.btcPrice > 0 && <p className="text-xs text-muted-foreground" data-currency-exempt="true">{tryEq(inputs.btcPrice)} TRY · 1$ ≈ {formatTRY(fxRate, 2)}</p>}
        </div>

        {/* Collateral Value Display */}
        {inputs.btcCollateral > 0 && inputs.btcPrice > 0 && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{tr ? 'Teminat Değeri' : 'Collateral Value'}</span>
              <span className="font-semibold text-foreground">{fmtMoney(inputs.btcCollateral * inputs.btcPrice)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">{tr ? 'Maks. Kredi' : 'Max Loan'} ({inputs.initialLtv}% LTV)</span>
              <span className="font-semibold text-primary">{fmtMoney(maxLoan)}</span>
            </div>
          </div>
        )}

        {/* Loan Amount */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-1">
            {tr ? 'Kredi Miktarı (USD)' : 'Loan Amount (USD)'}
            <Tooltip><TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent><p className="max-w-xs text-xs">{tr ? 'Bitcoin teminatınıza karşı almak istediğiniz borç miktarı (USD denominasyonlu kredi).' : 'How much you want to borrow against your Bitcoin collateral'}</p></TooltipContent>
            </Tooltip>
          </Label>
          <Input
            type="number" inputMode="decimal"
            min="0"
            value={inputs.loanAmountUsd || ''}
            onChange={e => updateField('loanAmountUsd', parseFloat(e.target.value) || 0)}
            placeholder={tr ? 'örn. 50000' : 'e.g. 50000'}
            className={validationErrors.loanAmountUsd ? 'border-destructive' : ''}
          />
          {validationErrors.loanAmountUsd && <p className="text-xs text-destructive">{validationErrors.loanAmountUsd}</p>}
          {tr && inputs.loanAmountUsd > 0 && <p className="text-xs text-muted-foreground" data-currency-exempt="true">{tryEq(inputs.loanAmountUsd)} TRY</p>}
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{tr ? 'Yıllık Faiz Oranı (%)' : 'Annual Interest Rate (%)'}</Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[inputs.interestRateAnnual]}
              onValueChange={([v]) => updateField('interestRateAnnual', v)}
              min={1}
              max={25}
              step={0.5}
              className="flex-1"
            />
            <Input
              type="number" inputMode="decimal"
              min="0"
              max="50"
              step="0.5"
              value={inputs.interestRateAnnual}
              onChange={e => updateField('interestRateAnnual', parseFloat(e.target.value) || 0)}
              className="w-20 text-center"
            />
          </div>
        </div>

        {/* Loan Term */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{tr ? 'Kredi Vadesi (Ay)' : 'Loan Term (Months)'}</Label>
          <Select value={String(inputs.loanTermMonths)} onValueChange={v => updateField('loanTermMonths', parseInt(v))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {[3, 6, 12, 18, 24, 36, 48, 60].map(m => (
                <SelectItem key={m} value={String(m)}>{m} {tr ? 'ay' : 'months'} ({(m / 12).toFixed(1)} {tr ? 'yıl' : 'yr'})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* LTV Settings (only for custom) */}
        {inputs.platform === 'custom' && (
          <div className="space-y-4 p-3 rounded-lg bg-muted/20 border border-border/30">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{tr ? 'Özel LTV Ayarları' : 'Custom LTV Settings'}</p>
            <div className="space-y-2">
              <Label className="text-sm">{tr ? 'Başlangıç LTV (%)' : 'Initial LTV (%)'}</Label>
              <Slider value={[inputs.initialLtv]} onValueChange={([v]) => updateField('initialLtv', v)} min={10} max={90} step={5} />
              <span className="text-xs text-muted-foreground">{inputs.initialLtv}%</span>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">{tr ? 'Teminat Tamamlama LTV (%)' : 'Margin Call LTV (%)'}</Label>
              <Slider value={[inputs.marginCallLtv]} onValueChange={([v]) => updateField('marginCallLtv', v)} min={50} max={95} step={5} />
              <span className="text-xs text-muted-foreground">{inputs.marginCallLtv}%</span>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">{tr ? 'Tasfiye LTV (%)' : 'Liquidation LTV (%)'}</Label>
              <Slider value={[inputs.liquidationLtv]} onValueChange={([v]) => updateField('liquidationLtv', v)} min={60} max={100} step={5} />
              <span className="text-xs text-muted-foreground">{inputs.liquidationLtv}%</span>
            </div>
          </div>
        )}

        {/* Expected BTC Growth */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-1">
            {tr ? 'Beklenen BTC Yıllık Büyüme (%)' : 'Expected BTC Annual Growth (%)'}
            <Tooltip><TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent><p className="max-w-xs text-xs">{tr ? 'Ödünç alma ile satış karşılaştırması için kullanılır. Tarihsel BTC CAGR %50+\'dır, ancak muhafazakar tahminler %20-30 arasındadır.' : 'Used for the borrow-vs-sell comparison. Historical BTC CAGR is ~50%+, but conservative estimates are 20-30%.'}</p></TooltipContent>
            </Tooltip>
          </Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[inputs.expectedBtcGrowthRate]}
              onValueChange={([v]) => updateField('expectedBtcGrowthRate', v)}
              min={-20}
              max={100}
              step={5}
              className="flex-1"
            />
            <Input
              type="number" inputMode="decimal"
              value={inputs.expectedBtcGrowthRate}
              onChange={e => updateField('expectedBtcGrowthRate', parseFloat(e.target.value) || 0)}
              className="w-20 text-center"
            />
          </div>
        </div>
      </div>
    </InputPanel>
  );
};
