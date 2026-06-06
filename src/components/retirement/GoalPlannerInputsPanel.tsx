import { Label } from "@/components/ui/label";
import { formatCurrencyAmount } from '@/utils/formatCurrency';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SUPPORTED_CURRENCIES } from "@/services/bitcoinApi";
import { Target, Calculator } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { InputPanel, InputField, CalculateButton } from "@/components/calculator";

export interface GoalPlannerInputs {
  currentAge: number;
  desiredRetirementAge: number;
  desiredAnnualBudget: number;
  currentBtcHoldings: number;
  expectedGrowthRate: number;
  inflationRate: number;
  currency: string;
}

interface GoalPlannerInputsPanelProps {
  inputs: GoalPlannerInputs;
  onChange: (inputs: GoalPlannerInputs) => void;
  currentBtcPrice: number;
  onCalculate: () => void;
  loading?: boolean;
}

export const GoalPlannerInputsPanel = ({ inputs, onChange, currentBtcPrice, onCalculate, loading }: GoalPlannerInputsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const updateInput = (field: keyof GoalPlannerInputs, value: any) => {
    onChange({ ...inputs, [field]: value });
  };

  const locale = tr ? 'tr-TR' : (inputs.currency === 'TRY' ? 'tr-TR' : 'en-US');
  const formatCurrency = (amount: number) => formatCurrencyAmount(amount, inputs.currency, { locale });

  const yearsToRetirement = inputs.desiredRetirementAge - inputs.currentAge;
  const currentPortfolioValue = inputs.currentBtcHoldings * currentBtcPrice;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <InputPanel
      id="goal-planner"
      onSubmit={handleSubmit}
      title={
        <span className="inline-flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Target className="h-4 w-4" aria-hidden />
          </span>
          {tr ? 'Emeklilik Hedef Planlayıcısı' : 'Retirement Goal Planner'}
        </span>
      }
      footer={
        <div data-calc-cta="true">
          <CalculateButton type="submit" loading={loading} loadingLabel={tr ? 'Hesaplanıyor…' : 'Calculating…'}>
            <Calculator className="h-4 w-4" aria-hidden />
            {tr ? 'Hedefimi Hesapla' : 'Calculate My Goal'}
          </CalculateButton>
        </div>
      }
    >
      <InputField label={tr ? 'Para Birimi' : 'Currency'}>
        {({ id }) => (
          <Select value={inputs.currency} onValueChange={(v) => updateInput('currency', v)}>
            <SelectTrigger id={id} className="w-full"><SelectValue /></SelectTrigger>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--calc-space-field)]">
        <InputField label={tr ? 'Mevcut Yaşım' : 'Current Age'} trailingLabel={inputs.currentAge}>
          {({ id }) => (
            <div className="space-y-2">
              <Input id={id} type="number" inputMode="numeric" value={inputs.currentAge}
                onChange={(e) => updateInput('currentAge', parseInt(e.target.value) || 0)}
                min={18} max={80} className="text-center font-mono" />
              <Slider value={[inputs.currentAge]} onValueChange={(v) => updateInput('currentAge', v[0])}
                min={18} max={80} step={1} aria-label={tr ? 'Mevcut yaş' : 'Current age'} />
            </div>
          )}
        </InputField>

        <InputField label={tr ? 'Emeklilik Yaşı' : 'Retirement Age'} trailingLabel={inputs.desiredRetirementAge}>
          {({ id }) => (
            <div className="space-y-2">
              <Input id={id} type="number" inputMode="numeric" value={inputs.desiredRetirementAge}
                onChange={(e) => updateInput('desiredRetirementAge', parseInt(e.target.value) || 0)}
                min={inputs.currentAge + 1} max={90} className="text-center font-mono" />
              <Slider value={[inputs.desiredRetirementAge]} onValueChange={(v) => updateInput('desiredRetirementAge', v[0])}
                min={inputs.currentAge + 1} max={90} step={1} aria-label={tr ? 'Emeklilik yaşı' : 'Retirement age'} />
            </div>
          )}
        </InputField>
      </div>

      <InputField
        label={tr ? 'Yıllık Bütçe (bugünün parasıyla)' : 'Annual Budget (today\'s money)'}
        tooltip={tr
          ? 'Emeklilikte yıllık ne kadar harcamak istiyorsunuz, bugünün satın alma gücüyle?'
          : 'How much do you want to spend annually in retirement, in today\'s purchasing power?'}
        trailingLabel={`${tr ? 'Aylık' : 'Monthly'}: ${formatCurrency(inputs.desiredAnnualBudget / 12)}`}
      >
        {({ id }) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input id={id} type="number" inputMode="numeric" value={inputs.desiredAnnualBudget}
                onChange={(e) => updateInput('desiredAnnualBudget', parseInt(e.target.value) || 0)}
                step={1000} min={0} max={1000000} className="flex-1 text-center font-mono" />
              <Badge variant="outline" className="font-mono text-xs shrink-0">{inputs.currency}</Badge>
            </div>
            <Slider value={[inputs.desiredAnnualBudget]} onValueChange={(v) => updateInput('desiredAnnualBudget', v[0])}
              min={0} max={500000} step={5000} aria-label={tr ? 'Yıllık bütçe' : 'Annual budget'} />
          </div>
        )}
      </InputField>

      <InputField
        label={tr ? 'Mevcut BTC' : 'Current BTC Holdings'}
        tooltip={tr ? 'Şu anda sahip olduğunuz Bitcoin miktarı.' : 'Bitcoin you currently own.'}
        trailingLabel={formatCurrency(currentPortfolioValue)}
      >
        {({ id }) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input id={id} type="number" inputMode="decimal" value={inputs.currentBtcHoldings}
                onChange={(e) => updateInput('currentBtcHoldings', parseFloat(e.target.value) || 0)}
                step={0.01} min={0} max={50} className="flex-1 text-center font-mono" placeholder="0.00" />
              <Badge variant="outline" className="font-mono text-xs shrink-0">BTC</Badge>
            </div>
            <Slider value={[inputs.currentBtcHoldings]} onValueChange={(v) => updateInput('currentBtcHoldings', Math.round(v[0] * 100) / 100)}
              min={0} max={10} step={0.01} aria-label={tr ? 'BTC varlığı' : 'BTC holdings'} />
          </div>
        )}
      </InputField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--calc-space-field)]">
        <InputField
          label={tr ? 'BTC Büyüme' : 'BTC Growth'}
          tooltip={tr
            ? 'Beklenen yıllık BTC fiyat büyümesi. Tarihsel ortalama %50-60, temkinli planlama için %15-25 önerilir.'
            : 'Expected annual BTC price growth. Historical average ~50-60%; 15-25% recommended for conservative planning.'}
          trailingLabel={`${inputs.expectedGrowthRate}%`}
        >
          {({ id }) => (
            <div className="space-y-2">
              <Input id={id} type="number" inputMode="numeric" value={inputs.expectedGrowthRate}
                onChange={(e) => updateInput('expectedGrowthRate', parseInt(e.target.value) || 0)}
                step={1} min={0} max={50} className="text-center font-mono" />
              <Slider value={[inputs.expectedGrowthRate]} onValueChange={(v) => updateInput('expectedGrowthRate', v[0])}
                min={0} max={30} step={1} aria-label={tr ? 'Büyüme oranı' : 'Growth rate'} />
            </div>
          )}
        </InputField>

        <InputField
          label={tr ? 'Enflasyon' : 'Inflation'}
          tooltip={tr
            ? 'Beklenen yıllık enflasyon oranı; bugünün satın alma gücüne göre düzeltir.'
            : 'Expected annual inflation; adjusts purchasing power into today\'s dollars.'}
          trailingLabel={`${inputs.inflationRate}%`}
        >
          {({ id }) => (
            <div className="space-y-2">
              <Input id={id} type="number" inputMode="decimal" value={inputs.inflationRate}
                onChange={(e) => updateInput('inflationRate', parseFloat(e.target.value) || 0)}
                step={0.5} min={0} max={15} className="text-center font-mono" />
              <Slider value={[inputs.inflationRate]} onValueChange={(v) => updateInput('inflationRate', v[0])}
                min={0} max={10} step={0.5} aria-label={tr ? 'Enflasyon' : 'Inflation'} />
            </div>
          )}
        </InputField>
      </div>

      <div className="calc-surface-subtle p-4 grid grid-cols-2 gap-4">
        <div>
          <div className="calc-text-label mb-1">{tr ? 'Kalan Yıl' : 'Years Left'}</div>
          <div className="calc-text-mono text-base font-semibold text-primary">{yearsToRetirement} {tr ? 'yıl' : 'years'}</div>
        </div>
        <div>
          <div className="calc-text-label mb-1">{tr ? 'Aylık Hedef' : 'Monthly Target'}</div>
          <div className="calc-text-mono text-base font-semibold text-primary">{formatCurrency(inputs.desiredAnnualBudget / 12)}</div>
        </div>
      </div>
    </InputPanel>
  );
};
