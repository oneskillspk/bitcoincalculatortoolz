import { Input } from "@/components/ui/input";
import { formatCurrencyAmount } from '@/utils/formatCurrency';
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RetirementInputs } from "@/pages/BitcoinRetirementCalculator";
import { SUPPORTED_CURRENCIES } from "@/services/bitcoinApi";
import { Shield, TrendingUp, Calculator } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { InputPanel, InputField, CalculateButton } from "@/components/calculator";
import { cn } from "@/lib/utils";

interface RetirementInputsPanelProps {
  inputs: RetirementInputs;
  onChange: (inputs: RetirementInputs) => void;
  currentBtcPrice: number;
  onCalculate: () => void;
  loading?: boolean;
}

export const RetirementInputsPanel = ({ inputs, onChange, currentBtcPrice, onCalculate, loading }: RetirementInputsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const updateInput = (field: keyof RetirementInputs, value: any) => {
    onChange({ ...inputs, [field]: value });
  };

  const locale = tr ? 'tr-TR' : (inputs.currency === 'TRY' ? 'tr-TR' : 'en-US');
  const formatCurrency = (amount: number) => formatCurrencyAmount(amount, inputs.currency, { locale });

  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  const totalMonthlyContributions = inputs.monthlyContribution * yearsToRetirement * 12;
  const currentPortfolioValue = inputs.currentBtcHoldings * currentBtcPrice;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <InputPanel
      id="retirement-calc"
      onSubmit={handleSubmit}
      title={
        <span className="inline-flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Calculator className="h-4 w-4" aria-hidden />
          </span>
          {tr ? 'Emeklilik Parametreleri' : 'Retirement Parameters'}
        </span>
      }
      footer={
        <div data-calc-cta="true">
          <CalculateButton
            type="submit"
            loading={loading}
            loadingLabel={tr ? 'Hesaplanıyor…' : 'Calculating…'}
          >
            <Calculator className="h-4 w-4" aria-hidden />
            {tr ? 'Emeklilik Planını Hesapla' : 'Calculate Retirement Plan'}
          </CalculateButton>
        </div>
      }
    >
      {/* Withdrawal strategy */}
      <InputField
        label={tr ? 'Para Çekme Stratejisi' : 'Withdrawal Strategy'}
        tooltip={tr
          ? 'Temkinli: emeklilikte tüm BTC satılır, %4 kuralıyla sabit bütçe. Optimize: BTC büyümeye devam ederken yıllık çekim.'
          : 'Conservative: sell all BTC at retirement, fixed 4% rule budget. Optimized: withdraw yearly while BTC keeps growing.'}
      >
        <Tabs value={inputs.mode} onValueChange={(value) => updateInput('mode', value)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-full border border-border/40 bg-card/60 p-1 h-auto">
            {([
              { value: 'conservative', icon: <Shield className="h-3.5 w-3.5" />, label: tr ? 'Temkinli' : 'Conservative' },
              { value: 'optimized', icon: <TrendingUp className="h-3.5 w-3.5" />, label: tr ? 'Optimize' : 'Optimized' },
            ] as const).map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:text-foreground',
                  'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                )}
              >
                {t.icon}
                <span>{t.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <p className="calc-text-small text-muted-foreground mt-2">
          {tr ? 'Bu, sonuçlarınızın nasıl hesaplandığını belirler.' : 'This determines how your results are calculated.'}
        </p>
      </InputField>

      {/* Currency */}
      <InputField
        label={tr ? 'Para Birimi' : 'Currency'}
        tooltip={tr ? 'Sonuçların gösterileceği para birimi.' : 'Currency used to display results.'}
      >
        {(bag) => (
          <Select value={inputs.currency} onValueChange={(value) => updateInput('currency', value)}>
            <SelectTrigger {...bag} className="w-full focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <span className="flex items-center gap-2">
                    <span>{currency.flag}</span>
                    <span>{currency.code} - {currency.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </InputField>

      {/* Ages */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label={tr ? 'Mevcut Yaş' : 'Current Age'}
          trailingLabel={`${inputs.currentAge}`}
        >
          {(bag) => (
            <div className="space-y-2">
              <Input
                {...bag}
                type="number"
                inputMode="numeric"
                value={inputs.currentAge}
                onChange={(e) => updateInput('currentAge', parseInt(e.target.value) || 0)}
                min={18}
                max={80}
                className="text-center calc-text-mono focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
              <Slider
                value={[inputs.currentAge]}
                onValueChange={(v) => updateInput('currentAge', v[0])}
                min={18}
                max={80}
                step={1}
                aria-label={tr ? 'Mevcut yaş kaydırıcı' : 'Current age slider'}
              />
            </div>
          )}
        </InputField>
        <InputField
          label={tr ? 'Emeklilik Yaşı' : 'Retirement Age'}
          trailingLabel={`${inputs.retirementAge}`}
        >
          {(bag) => (
            <div className="space-y-2">
              <Input
                {...bag}
                type="number"
                inputMode="numeric"
                value={inputs.retirementAge}
                onChange={(e) => updateInput('retirementAge', parseInt(e.target.value) || 0)}
                min={inputs.currentAge + 1}
                max={90}
                className="text-center calc-text-mono focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
              <Slider
                value={[inputs.retirementAge]}
                onValueChange={(v) => updateInput('retirementAge', v[0])}
                min={inputs.currentAge + 1}
                max={90}
                step={1}
                aria-label={tr ? 'Emeklilik yaşı kaydırıcı' : 'Retirement age slider'}
              />
            </div>
          )}
        </InputField>
      </div>

      {/* Timeline summary */}
      <div className="calc-surface-subtle px-4 py-3 grid grid-cols-2 gap-4">
        <div>
          <div className="calc-text-label">{tr ? 'Emekliliğe Yıl' : 'Years to Retirement'}</div>
          <div className="calc-text-mono text-primary text-sm mt-1">{yearsToRetirement} {tr ? 'yıl' : 'years'}</div>
        </div>
        <div>
          <div className="calc-text-label">{tr ? 'Toplam Katkı' : 'Total Contributions'}</div>
          <div className="calc-text-mono text-primary text-sm mt-1">{formatCurrency(totalMonthlyContributions)}</div>
        </div>
      </div>

      {/* BTC holdings */}
      <InputField
        label={tr ? 'Mevcut Bitcoin Varlığı' : 'Current Bitcoin Holdings'}
        tooltip={tr ? 'Şu anda sahip olduğunuz Bitcoin miktarı.' : 'Amount of Bitcoin you currently own.'}
        trailingLabel={formatCurrency(currentPortfolioValue)}
      >
        {(bag) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                {...bag}
                type="number"
                inputMode="decimal"
                value={inputs.currentBtcHoldings}
                onChange={(e) => updateInput('currentBtcHoldings', parseFloat(e.target.value) || 0)}
                step={0.01}
                min={0}
                max={50}
                className="flex-1 text-center calc-text-mono focus-visible:ring-2 focus-visible:ring-primary/50"
                placeholder="0.00"
              />
              <Badge variant="outline" className="calc-text-mono text-xs">BTC</Badge>
            </div>
            <Slider
              value={[inputs.currentBtcHoldings]}
              onValueChange={(v) => updateInput('currentBtcHoldings', Math.round(v[0] * 100) / 100)}
              min={0}
              max={50}
              step={0.01}
              aria-label={tr ? 'BTC varlığı kaydırıcı' : 'BTC holdings slider'}
            />
          </div>
        )}
      </InputField>

      {/* Monthly contribution */}
      <InputField
        label={tr ? 'Aylık Bitcoin Alımı (DMA)' : 'Monthly Bitcoin Purchase (DCA)'}
        tooltip={tr ? 'Emekliliğe kadar her ay Bitcoin\'e yatıracağınız tutar.' : 'Amount you plan to invest in Bitcoin each month until retirement.'}
        trailingLabel={`${inputs.monthlyContribution} ${inputs.currency}`}
      >
        {(bag) => (
          <div className="space-y-2">
            <Input
              {...bag}
              type="number"
              inputMode="numeric"
              value={inputs.monthlyContribution}
              onChange={(e) => updateInput('monthlyContribution', parseInt(e.target.value) || 0)}
              step={50}
              min={0}
              max={10000}
              className="text-center calc-text-mono focus-visible:ring-2 focus-visible:ring-primary/50"
            />
            <Slider
              value={[inputs.monthlyContribution]}
              onValueChange={(v) => updateInput('monthlyContribution', v[0])}
              min={0}
              max={10000}
              step={50}
              aria-label={tr ? 'Aylık katkı kaydırıcı' : 'Monthly contribution slider'}
            />
          </div>
        )}
      </InputField>

      {/* Rates */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label={tr ? 'BTC Büyüme Oranı' : 'BTC Growth Rate'}
          tooltip={tr
            ? 'Beklenen yıllık BTC büyümesi. Tarihsel ~%50-60; emeklilik için %15-25 yaygın.'
            : 'Expected annual BTC growth. Historical ~50-60%; 15-25% is common for retirement planning.'}
          trailingLabel={`${inputs.expectedGrowthRate}%`}
        >
          {(bag) => (
            <div className="space-y-2">
              <Input
                {...bag}
                type="number"
                inputMode="numeric"
                value={inputs.expectedGrowthRate}
                onChange={(e) => updateInput('expectedGrowthRate', parseInt(e.target.value) || 0)}
                step={1}
                min={0}
                max={50}
                className="text-center calc-text-mono focus-visible:ring-2 focus-visible:ring-primary/50"
              />
              <Slider
                value={[inputs.expectedGrowthRate]}
                onValueChange={(v) => updateInput('expectedGrowthRate', v[0])}
                min={0}
                max={50}
                step={1}
                aria-label={tr ? 'Büyüme oranı kaydırıcı' : 'Growth rate slider'}
              />
            </div>
          )}
        </InputField>
        <InputField
          label={tr ? 'Enflasyon Oranı' : 'Inflation Rate'}
          tooltip={tr ? 'Satın alma gücü için beklenen yıllık enflasyon.' : 'Expected annual inflation for purchasing-power adjustments.'}
          trailingLabel={`${inputs.inflationRate}%`}
        >
          {(bag) => (
            <div className="space-y-2">
              <Input
                {...bag}
                type="number"
                inputMode="decimal"
                value={inputs.inflationRate}
                onChange={(e) => updateInput('inflationRate', parseFloat(e.target.value) || 0)}
                step={0.5}
                min={0}
                max={15}
                className="text-center calc-text-mono focus-visible:ring-2 focus-visible:ring-primary/50"
              />
              <Slider
                value={[inputs.inflationRate]}
                onValueChange={(v) => updateInput('inflationRate', v[0])}
                min={0}
                max={10}
                step={0.5}
                aria-label={tr ? 'Enflasyon kaydırıcı' : 'Inflation slider'}
              />
            </div>
          )}
        </InputField>
      </div>
    </InputPanel>
  );
};
