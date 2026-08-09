import { Input } from "@/components/ui/input";
import { formatCurrencyAmount } from '@/utils/formatCurrency';
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SUPPORTED_CURRENCIES } from "@/services/bitcoinApi";
import { Flame } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { InputPanel, InputField, CalculateButton } from "@/components/calculator";

export interface FireModeInputs {
  currentAge: number;
  currentBtcHoldings: number;
  monthlyContribution: number;
  annualExpenses: number;
  withdrawalRate: number;
  currency: string;
}

interface FireModeInputsPanelProps {
  inputs: FireModeInputs;
  onChange: (inputs: FireModeInputs) => void;
  currentBtcPrice: number;
  onCalculate: () => void;
  loading?: boolean;
}

export const FireModeInputsPanel = ({ inputs, onChange, currentBtcPrice, onCalculate, loading }: FireModeInputsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const updateInput = (field: keyof FireModeInputs, value: any) => onChange({ ...inputs, [field]: value });

  const locale = tr ? 'tr-TR' : (inputs.currency === 'TRY' ? 'tr-TR' : 'en-US');
  const formatCurrency = (amount: number) => formatCurrencyAmount(amount, inputs.currency, { locale });
  const currentPortfolioValue = inputs.currentBtcHoldings * currentBtcPrice;
  const fireTarget = inputs.annualExpenses / (inputs.withdrawalRate / 100);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <InputPanel
      id="fire-mode"
      onSubmit={handleSubmit}
      title={
        <span className="inline-flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/$2 text-warning">
            <Flame className="h-4 w-4" aria-hidden />
          </span>
          {tr ? 'FIRE Parametreleri' : 'FIRE Parameters'}
        </span>
      }
      footer={
        <div data-calc-cta="true">
          <CalculateButton type="submit" loading={loading} loadingLabel={tr ? 'Hesaplanıyor…' : 'Calculating…'}>
            <Flame className="h-4 w-4" aria-hidden />
            {tr ? 'FIRE Tarihini Hesapla' : 'Calculate FIRE Date'}
          </CalculateButton>
        </div>
      }
    >
      <InputField label={tr ? 'Para Birimi' : 'Currency'}>
        {({ id }) => (
          <Select value={inputs.currency} onValueChange={(v) => updateInput('currency', v)}>
            <SelectTrigger id={id} className="w-full" aria-label={tr ? 'Para birimi seçin' : 'Select currency'}><SelectValue /></SelectTrigger>
            <SelectContent>
              {SUPPORTED_CURRENCIES.map(c => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="flex items-center gap-2"><span>{c.flag}</span><span>{c.code} - {c.name}</span></span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </InputField>

      <InputField label={tr ? 'Mevcut Yaş' : 'Current Age'} trailingLabel={inputs.currentAge}>
        {({ id }) => (
          <div className="space-y-2">
            <Input id={id} type="number" inputMode="numeric" value={inputs.currentAge}
              onChange={(e) => updateInput('currentAge', parseInt(e.target.value) || 0)}
              min={18} max={80} className="text-center font-mono" />
            <Slider value={[inputs.currentAge]} onValueChange={(v) => updateInput('currentAge', v[0])}
              min={18} max={80} step={1} aria-label={tr ? 'Yaş' : 'Age'} />
          </div>
        )}
      </InputField>

      <InputField
        label={tr ? 'Mevcut BTC' : 'Current BTC Holdings'}
        tooltip={tr ? 'Şu anda sahip olduğunuz toplam BTC.' : 'Total BTC you currently own.'}
        trailingLabel={formatCurrency(currentPortfolioValue)}
      >
        {({ id }) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input id={id} type="number" inputMode="decimal" value={inputs.currentBtcHoldings}
                onChange={(e) => updateInput('currentBtcHoldings', parseFloat(e.target.value) || 0)}
                step={0.01} min={0} max={50} className="flex-1 text-center font-mono" />
              <Badge variant="outline" className="font-mono text-xs shrink-0">BTC</Badge>
            </div>
            <Slider value={[inputs.currentBtcHoldings]} onValueChange={(v) => updateInput('currentBtcHoldings', Math.round(v[0] * 100) / 100)}
              min={0} max={10} step={0.01} aria-label={tr ? 'BTC' : 'BTC'} />
          </div>
        )}
      </InputField>

      <InputField label={tr ? 'Aylık DCA' : 'Monthly DCA'} trailingLabel={formatCurrency(inputs.monthlyContribution)}>
        {({ id }) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input id={id} type="number" inputMode="numeric" value={inputs.monthlyContribution}
                onChange={(e) => updateInput('monthlyContribution', parseInt(e.target.value) || 0)}
                step={50} min={0} max={10000} className="flex-1 text-center font-mono" />
              <Badge variant="outline" className="font-mono text-xs shrink-0">{inputs.currency}</Badge>
            </div>
            <Slider value={[inputs.monthlyContribution]} onValueChange={(v) => updateInput('monthlyContribution', v[0])}
              min={0} max={5000} step={50} aria-label={tr ? 'Aylık katkı' : 'Monthly contribution'} />
          </div>
        )}
      </InputField>

      <InputField
        label={tr ? 'Yıllık Giderler' : 'Annual Expenses'}
        tooltip={tr ? 'Emeklilikte hedeflediğiniz yıllık harcama (bugünün dolarlarıyla).' : 'Target annual spending in retirement (today\'s dollars).'}
        trailingLabel={formatCurrency(inputs.annualExpenses)}
      >
        {({ id }) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input id={id} type="number" inputMode="numeric" value={inputs.annualExpenses}
                onChange={(e) => updateInput('annualExpenses', parseInt(e.target.value) || 0)}
                step={1000} min={10000} max={500000} className="flex-1 text-center font-mono" />
              <Badge variant="outline" className="font-mono text-xs shrink-0">{inputs.currency}/{tr ? 'yıl' : 'yr'}</Badge>
            </div>
            <Slider value={[inputs.annualExpenses]} onValueChange={(v) => updateInput('annualExpenses', v[0])}
              min={10000} max={300000} step={5000} aria-label={tr ? 'Yıllık giderler' : 'Annual expenses'} />
          </div>
        )}
      </InputField>

      <InputField
        label={tr ? 'Güvenli Çekim Oranı' : 'Safe Withdrawal Rate'}
        tooltip={tr
          ? 'Portföyden yıllık çekilen yüzde. %4 kuralı yaygındır; FIRE için sıkça %3-3,5 kullanılır.'
          : 'Annual withdrawal %. The 4% rule is common; FIRE often uses 3-3.5% for longer retirements.'}
        trailingLabel={`${inputs.withdrawalRate}%`}
      >
        {({ id }) => (
          <div className="space-y-2">
            <Input id={id} type="number" inputMode="decimal" value={inputs.withdrawalRate}
              onChange={(e) => updateInput('withdrawalRate', parseFloat(e.target.value) || 0)}
              step={0.25} min={2} max={6} className="text-center font-mono" />
            <Slider value={[inputs.withdrawalRate]} onValueChange={(v) => updateInput('withdrawalRate', v[0])}
              min={2} max={6} step={0.25} aria-label={tr ? 'SWR' : 'SWR'} />
          </div>
        )}
      </InputField>

      <div className="calc-surface-subtle p-4">
        <div className="calc-text-label mb-1">
          {tr ? `FIRE Hedefi (%${inputs.withdrawalRate} SWR)` : `FIRE Target (${inputs.withdrawalRate}% SWR)`}
        </div>
        <div className="calc-text-mono text-xl font-bold text-foreground">{formatCurrency(fireTarget)}</div>
        <div className="calc-text-small text-muted-foreground mt-1">
          {tr ? `${formatCurrency(inputs.annualExpenses)}/yıl karşılamak için` : `To cover ${formatCurrency(inputs.annualExpenses)}/yr`}
        </div>
      </div>
    </InputPanel>
  );
};
