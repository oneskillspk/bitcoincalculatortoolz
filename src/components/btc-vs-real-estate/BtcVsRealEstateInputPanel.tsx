import { InputPanel, CalculateButton } from "@/components/calculator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { BtcVsRealEstateInputs } from "@/services/btcVsRealEstateCalculator";
import { Home, Bitcoin, RotateCcw, Calculator, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUsdToTryRate } from "@/hooks/useUsdToTryRate";
import { formatTRY } from "@/utils/formatTRY";

interface Props {
  inputs: BtcVsRealEstateInputs;
  onChange: (inputs: BtcVsRealEstateInputs) => void;
  onCalculate: () => void;
  onReset: () => void;
}

export const BtcVsRealEstateInputPanel = ({ inputs, onChange, onCalculate, onReset }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();

  const update = (key: keyof BtcVsRealEstateInputs, value: number | string) => {
    onChange({ ...inputs, [key]: value });
  };

  const cityPresets = tr
    ? [
        { name: 'İstanbul', price: Math.round(7_500_000 / fxRate), appreciation: 4.5, rent: 4.0, tax: 0.2 },
        { name: 'Ankara',   price: Math.round(4_200_000 / fxRate), appreciation: 3.5, rent: 4.5, tax: 0.2 },
        { name: 'İzmir',    price: Math.round(5_500_000 / fxRate), appreciation: 4.0, rent: 4.2, tax: 0.2 },
        { name: 'Antalya',  price: Math.round(6_000_000 / fxRate), appreciation: 5.0, rent: 5.0, tax: 0.2 },
        { name: 'Bursa',    price: Math.round(3_800_000 / fxRate), appreciation: 3.8, rent: 4.4, tax: 0.2 },
        { name: 'Dubai',    price: 550000, appreciation: 4.8, rent: 6.5, tax: 0.0 },
      ]
    : [
        { name: 'US median', price: 420000, appreciation: 3.5, rent: 5.0, tax: 1.1 },
        { name: 'NYC', price: 850000, appreciation: 3.0, rent: 3.2, tax: 0.9 },
        { name: 'LA', price: 900000, appreciation: 4.0, rent: 3.4, tax: 1.0 },
        { name: 'Miami', price: 620000, appreciation: 5.0, rent: 4.8, tax: 1.0 },
        { name: 'Austin', price: 520000, appreciation: 4.5, rent: 4.2, tax: 1.8 },
        { name: 'London', price: 780000, appreciation: 3.2, rent: 3.6, tax: 0.8 },
        { name: 'Toronto', price: 760000, appreciation: 3.8, rent: 3.7, tax: 0.7 },
        { name: 'Sydney', price: 900000, appreciation: 4.0, rent: 3.5, tax: 0.6 },
        { name: 'Dubai', price: 550000, appreciation: 4.8, rent: 6.5, tax: 0.0 },
        { name: 'Singapore', price: 1100000, appreciation: 3.0, rent: 3.0, tax: 0.4 },
      ];

  const applyCityPreset = (preset: typeof cityPresets[number]) => {
    onChange({ ...inputs, propertyPrice: preset.price, annualAppreciation: preset.appreciation, annualRentalYield: preset.rent, propertyTaxPercent: preset.tax });
  };

  const numField = (label: string, key: keyof BtcVsRealEstateInputs, suffix = '', min = 0, max = 100, step = 0.1) => (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="relative">
        <Input
          type="number"
          value={inputs[key] as number}
          onChange={e => update(key, parseFloat(e.target.value) || 0)}
          min={min} max={max} step={step}
          className="pr-8 text-sm"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Real Estate Inputs */}
      <InputPanel
        title={
          <span className="flex items-center gap-2 text-base">
            <Home className="w-4 h-4 text-blue-500" />
            {tr ? 'Gayrimenkul Girdileri' : 'Real Estate Inputs'}
          </span>
        }
      >
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {tr ? 'Örnek Şehir Ön Ayarları' : 'Example City Presets'}
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {cityPresets.map((preset) => (
                <Button
                  key={preset.name}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="min-h-11 text-xs"
                  onClick={() => applyCityPreset(preset)}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {tr ? 'Ön ayarlar tahmini varsayımlardır; her alanı kendi piyasanıza göre düzenleyin.' : 'Presets are illustrative assumptions; edit every field for your market.'}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{tr ? 'Mülk Fiyatı (₺)' : 'Property Price ($)'}</Label>
            <Input
              type="number"
              value={tr ? Math.round(inputs.propertyPrice * fxRate) : inputs.propertyPrice}
              onChange={e => {
                const raw = parseFloat(e.target.value) || 0;
                update('propertyPrice', tr ? raw / fxRate : raw);
              }}
              min={tr ? 100000 : 10000} step={tr ? 100000 : 10000}
              className="text-sm"
            />
            {tr && inputs.propertyPrice > 0 && (
              <p className="text-xs text-muted-foreground" data-currency-exempt="true">
                ≈ ${Math.round(inputs.propertyPrice).toLocaleString('en-US')} USD · 1$ ≈ {formatTRY(fxRate, 2)}
              </p>
            )}
          </div>
          {numField(tr ? 'Peşinat' : 'Down Payment', 'downPaymentPercent', '%', 0, 100, 1)}
          {numField(tr ? 'Mortgage Oranı' : 'Mortgage Rate', 'mortgageRate', '%', 0, 20, 0.1)}
          {numField(tr ? 'Kredi Vadesi' : 'Loan Term', 'loanTermYears', tr ? 'yıl' : 'yr', 5, 40, 1)}
          {numField(tr ? 'Yıllık Değer Artışı' : 'Annual Appreciation', 'annualAppreciation', '%', -5, 20, 0.5)}
          {numField(tr ? 'Kira Getirisi' : 'Rental Yield', 'annualRentalYield', '%', 0, 15, 0.5)}
          {numField(tr ? 'Boşluk Oranı' : 'Vacancy Rate', 'vacancyRate', '%', 0, 30, 1)}
          {numField(tr ? 'Bakım + Sigorta' : 'Maintenance + Insurance', 'maintenancePercent', '%', 0, 5, 0.1)}
          {numField(tr ? 'Mülk Vergisi' : 'Property Tax', 'propertyTaxPercent', '%', 0, 5, 0.1)}
          {numField(tr ? 'Kapanış Maliyetleri (alım ve satım)' : 'Closing Costs (buy & sell)', 'closingCostPercent', '%', 0, 10, 0.5)}
      </InputPanel>

      {/* Bitcoin Inputs + Controls */}
      <InputPanel
        onSubmit={(e) => { e.preventDefault(); onCalculate(); }}
        title={
          <span className="flex items-center gap-2 text-base">
            <Bitcoin className="w-4 h-4 text-primary" />
            {tr ? 'Bitcoin ve Karşılaştırma Ayarları' : 'Bitcoin & Comparison Settings'}
          </span>
        }
        footer={
          <div className="flex gap-3">
            <CalculateButton fullWidth>
              <Calculator className="w-4 h-4 mr-2" />
              {tr ? 'Hesapla' : 'Calculate'}
            </CalculateButton>
            <Button type="button" variant="outline" onClick={onReset} size="icon" className="h-12 w-12 shrink-0">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        }
      >
          {numField(tr ? 'Beklenen BTC Yıllık Büyümesi' : 'Expected BTC Annual Growth', 'btcGrowthRate', '%', -20, 100, 1)}

          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">
              {tr ? `Yatırım Ufku: ${inputs.horizonYears} yıl` : `Investment Horizon: ${inputs.horizonYears} years`}
            </Label>
            <Slider
              value={[inputs.horizonYears]}
              onValueChange={([v]) => update('horizonYears', v)}
              min={1} max={20} step={1}
            />
            <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
              <span>1 {tr ? 'yıl' : 'yr'}</span><span>10 {tr ? 'yıl' : 'yr'}</span><span>20 {tr ? 'yıl' : 'yr'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">{tr ? 'Karşılaştırma Modu' : 'Comparison Mode'}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={inputs.comparisonMode === 'same-cash' ? 'default' : 'outline'}
                size="sm"
                onClick={() => update('comparisonMode', 'same-cash')}
                className="text-xs"
              >
                {tr ? 'Aynı Nakit Yatırım' : 'Same Cash Invested'}
              </Button>
              <Button
                variant={inputs.comparisonMode === 'full-value' ? 'default' : 'outline'}
                size="sm"
                onClick={() => update('comparisonMode', 'full-value')}
                className="text-xs"
              >
                {tr ? 'Tam Mülk Değeri' : 'Full Property Value'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {inputs.comparisonMode === 'same-cash'
                ? (tr ? 'Peşinat + kapanış maliyetlerini BTC\'ye yatırmayı mülk almakla karşılaştırır.' : 'Compares the down payment + closing costs invested in BTC vs. used to buy the property.')
                : (tr ? 'Tam mülk fiyatını BTC\'ye koysaydınız ne olurdu? Gayrimenkul kaldıraç etkisini gösterir.' : 'What if you put the full property price into BTC instead? Shows real estate leverage effect.')}
            </p>
          </div>
      </InputPanel>
    </div>
  );
};
