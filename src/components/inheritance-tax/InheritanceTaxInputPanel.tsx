import React from 'react';
import { InputPanel, CalculateButton } from '@/components/calculator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Info, RotateCcw, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatTRY } from '@/utils/formatTRY';

export interface InheritanceTaxInputs {
  inheritedBtcAmount: number;
  dateOfDeathPrice: number;
  originalCostBasis: number;
  currentPrice: number;
  totalEstateValue: number;
  filingStatus: 'single' | 'married';
  stateOfResidence: string;
  planToSell: boolean;
}

export interface ValidationErrors {
  inheritedBtcAmount?: string;
  dateOfDeathPrice?: string;
  currentPrice?: string;
}

interface Props {
  inputs: InheritanceTaxInputs;
  onChange: (inputs: InheritanceTaxInputs) => void;
  onCalculate: () => void;
  onReset: () => void;
  validationErrors?: ValidationErrors;
}

const US_STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
  PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
  WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

const ESTATE_TAX_STATES = new Set(['CT', 'DC', 'HI', 'IL', 'ME', 'MD', 'MA', 'MN', 'NY', 'OR', 'RI', 'VT', 'WA']);
const ALL_STATES = Object.entries(US_STATE_NAMES).map(([code, name]) => ({ code, name })).sort((a, b) => a.name.localeCompare(b.name));

const InfoTip = ({ text }: { text: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help inline ml-1" />
    </TooltipTrigger>
    <TooltipContent className="max-w-xs text-xs">{text}</TooltipContent>
  </Tooltip>
);

export const InheritanceTaxInputPanel: React.FC<Props> = ({ inputs, onChange, onCalculate, onReset, validationErrors }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { price: livePrice, isLoading: priceLoading } = useLiveBitcoinPrice('USD');
  const fxRate = useUsdToTryRate();
  const tryEq = (usd: number) => usd > 0 ? `≈ ${formatTRY(usd * fxRate, 0)}` : '';

  const update = (key: keyof InheritanceTaxInputs, value: any) => {
    onChange({ ...inputs, [key]: value });
  };

  const handleAutoFillPrice = () => {
    if (livePrice > 0) update('currentPrice', Math.round(livePrice));
  };

  return (
    <InputPanel
      className="glass-morphism-card border-border/20"
      onSubmit={(e) => { e.preventDefault(); onCalculate(); }}
      title={
        <span className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          {tr ? 'Miras Detayları' : 'Inheritance Details'}
        </span>
      }
      footer={
        <div className="flex flex-col sm:flex-row gap-3">
          <CalculateButton fullWidth>
            <Calculator className="w-4 h-4 mr-2 shrink-0" />
            <span className="hidden sm:inline">{tr ? 'Miras Vergisini Hesapla' : 'Calculate Inheritance Tax'}</span>
            <span className="sm:hidden">{tr ? 'Vergiyi Hesapla' : 'Calculate Tax'}</span>
          </CalculateButton>
          <Button type="button" onClick={onReset} variant="outline" size="lg" className="w-full sm:w-auto">
            <RotateCcw className="w-4 h-4 mr-2 sm:mr-0" />
            <span className="sm:hidden">{tr ? 'Sıfırla' : 'Reset'}</span>
          </Button>
        </div>
      }
    >
        {/* Inherited BTC Amount */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">
            {tr ? 'Miras Kalan Bitcoin Miktarı (BTC)' : 'Inherited Bitcoin Amount (BTC)'}
            <InfoTip text={tr ? 'Müteveffanın mülkünden miras kalan toplam Bitcoin miktarı.' : "The total amount of Bitcoin inherited from the decedent's estate."} />
          </Label>
          <Input
            type="number" inputMode="decimal" step="0.00000001" min="0"
            value={inputs.inheritedBtcAmount || ''}
            onChange={(e) => update('inheritedBtcAmount', parseFloat(e.target.value) || 0)}
            placeholder={tr ? 'örn. 1.5' : 'e.g. 1.5'}
            className={validationErrors?.inheritedBtcAmount ? 'border-destructive' : ''}
          />
          {validationErrors?.inheritedBtcAmount && <p className="text-xs text-destructive">{validationErrors.inheritedBtcAmount}</p>}
        </div>

        {/* Date of Death Price */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">
            {tr ? 'Ölüm Tarihi İtibarıyla Gerçeğe Uygun Piyasa Değeri ($)' : 'Fair Market Value at Date of Death ($)'}
            <InfoTip text={tr ? 'Orijinal sahibin hayatını kaybettiği tarihteki Bitcoin fiyatı. IRS kuralları uyarınca bu, yeni "yükseltilmiş" maliyet bazınız olur.' : "The Bitcoin price on the date the original owner passed away. This becomes your new 'stepped-up' cost basis under IRS rules."} />
          </Label>
          <Input
            type="number" inputMode="decimal" step="0.01" min="0"
            value={inputs.dateOfDeathPrice || ''}
            onChange={(e) => update('dateOfDeathPrice', parseFloat(e.target.value) || 0)}
            placeholder={tr ? 'örn. 65000' : 'e.g. 65000'}
            className={validationErrors?.dateOfDeathPrice ? 'border-destructive' : ''}
          />
          {validationErrors?.dateOfDeathPrice && <p className="text-xs text-destructive">{validationErrors.dateOfDeathPrice}</p>}
          {tr && inputs.dateOfDeathPrice > 0 && <p className="text-xs text-muted-foreground" data-currency-exempt="true">{tryEq(inputs.dateOfDeathPrice)} TRY</p>}
        </div>

        {/* Original Cost Basis */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">
            {tr ? 'Orijinal Alış Fiyatı ($)' : 'Original Purchase Price ($)'}
            <InfoTip text={tr ? 'Müteveffanın Bitcoin için başlangıçta ödediği fiyat. Yükseltilmiş maliyet tabanı tasarruflarını karşılaştırmak için kullanılır.' : 'What the deceased originally paid per Bitcoin. Used to compare step-up basis savings vs. original cost basis.'} />
          </Label>
          <Input
            type="number" inputMode="decimal" step="0.01" min="0"
            value={inputs.originalCostBasis || ''}
            onChange={(e) => update('originalCostBasis', parseFloat(e.target.value) || 0)}
            placeholder={tr ? 'örn. 5000' : 'e.g. 5000'}
          />
          {tr && inputs.originalCostBasis > 0 && <p className="text-xs text-muted-foreground" data-currency-exempt="true">{tryEq(inputs.originalCostBasis)} TRY</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-foreground">
            {tr ? 'Güncel Bitcoin Fiyatı ($)' : 'Current Bitcoin Price ($)'}
            <InfoTip text={tr ? 'Satmayı planlıyorsanız bugünün Bitcoin fiyatı. Yükseltilmiş maliyet tabanından sermaye kazançlarını hesaplamak için kullanılır.' : "Today's Bitcoin price if you plan to sell. Used to calculate capital gains from the stepped-up basis."} />
          </Label>
          <div className="flex gap-2">
            <Input
              type="number" inputMode="decimal" step="0.01" min="0"
              value={inputs.currentPrice || ''}
              onChange={(e) => update('currentPrice', parseFloat(e.target.value) || 0)}
              placeholder={tr ? 'örn. 95000' : 'e.g. 95000'}
              className={`flex-1 ${validationErrors?.currentPrice ? 'border-destructive' : ''}`}
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAutoFillPrice}
              disabled={priceLoading || livePrice <= 0} className="shrink-0 text-xs gap-1">
              <Zap className="w-3 h-3" />
              {tr ? 'Canlı Fiyat' : 'Live Price'}
            </Button>
          </div>
          {validationErrors?.currentPrice && <p className="text-xs text-destructive">{validationErrors.currentPrice}</p>}
          {tr && inputs.currentPrice > 0 && <p className="text-xs text-muted-foreground" data-currency-exempt="true">{tryEq(inputs.currentPrice)} TRY</p>}
        </div>

        {/* Total Estate Value */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">
            {tr ? 'Toplam Miras Değeri ($)' : 'Total Estate Value ($)'}
            <InfoTip text={tr ? 'Müteveffanın tüm mülkünün toplam değeri. 2026 federal miras vergisi muafiyeti kişi başı 13,61 milyon dolar.' : "The total value of the decedent's entire estate (all assets). The 2026 federal estate tax exemption is $13.61 million per individual."} />
          </Label>
          <Input
            type="number" inputMode="decimal" step="1" min="0"
            value={inputs.totalEstateValue || ''}
            onChange={(e) => update('totalEstateValue', parseFloat(e.target.value) || 0)}
            placeholder={tr ? 'örn. 2000000' : 'e.g. 2000000'}
          />
          {tr && inputs.totalEstateValue > 0 && <p className="text-xs text-muted-foreground" data-currency-exempt="true">{tryEq(inputs.totalEstateValue)} TRY</p>}
        </div>

        {/* Filing Status */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">{tr ? 'Başvuru Durumu' : 'Filing Status'}</Label>
          <Select value={inputs.filingStatus} onValueChange={(v) => update('filingStatus', v)}>
            <SelectTrigger aria-label={tr ? 'Başvuru durumu seçin' : 'Select filing status'}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="single">{tr ? 'Bekar / Bireysel' : 'Single / Individual'}</SelectItem>
              <SelectItem value="married">{tr ? 'Evli (Hayatta Kalan Eş)' : 'Married (Surviving Spouse)'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* State */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">
            {tr ? 'Eyalet' : 'State'}
            <InfoTip text={tr ? 'Bazı eyaletlerin daha düşük muafiyet eşikleriyle kendi miras/veraset vergileri vardır.' : 'Some states have their own estate/inheritance taxes with lower exemption thresholds.'} />
          </Label>
          <Select value={inputs.stateOfResidence} onValueChange={(v) => update('stateOfResidence', v)}>
            <SelectTrigger aria-label={tr ? 'Eyalet seçin' : 'Select state'}>
              <SelectValue placeholder={tr ? 'Eyalet seçin' : 'Select state'} />
            </SelectTrigger>
            <SelectContent>
              {ALL_STATES.map(s => (
                <SelectItem key={s.code} value={s.code}>
                  {s.name}{ESTATE_TAX_STATES.has(s.code) ? (tr ? ' ⚠️ Miras Vergisi Var' : ' ⚠️ Has Estate Tax') : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
    </InputPanel>
  );
};
