import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { formatGroupedInt } from '@/utils/numberFormat';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { DollarSign } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { InputPanel, InputField, CalculateButton } from "@/components/calculator";

interface CAGRInputPanelProps {
  onCalculate: (amount: number, years: number, assets: string[]) => void;
}

const ASSET_OPTIONS = [
  { ticker: 'BTC', label: 'Bitcoin', icon: '₿', defaultChecked: true },
  { ticker: 'GLD', label: 'Gold', icon: '🥇', defaultChecked: true },
  { ticker: 'SPY', label: 'S&P 500', icon: '📈', defaultChecked: true },
  { ticker: 'VNQ', label: 'Real Estate', icon: '🏠', defaultChecked: true },
];

export const CAGRInputPanel = ({ onCalculate }: CAGRInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [amount, setAmount] = useState(10000);
  const [years, setYears] = useState(5);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['BTC', 'GLD', 'SPY', 'VNQ']);

  const toggleAsset = (ticker: string) => {
    setSelectedAssets(prev =>
      prev.includes(ticker)
        ? prev.filter(t => t !== ticker)
        : [...prev, ticker]
    );
  };

  const handleCalculate = () => {
    if (amount > 0 && years > 0 && selectedAssets.length > 0) {
      onCalculate(amount, years, selectedAssets);
    }
  };

  const presetAmounts = [1000, 5000, 10000, 50000];
  const canSubmit = amount > 0 && years > 0 && selectedAssets.length > 0;

  return (
    <InputPanel
      title={tr ? 'BYBÜ Parametreleri' : 'CAGR Parameters'}
      onSubmit={(e) => { e.preventDefault(); handleCalculate(); }}
      footer={
        <CalculateButton disabled={!canSubmit} fullWidth>
          {tr ? 'BYBÜ Projeksiyonunu Hesapla' : 'Calculate CAGR Projection'}
        </CalculateButton>
      }
    >
      <InputField
        label={<span className="inline-flex items-center gap-2"><DollarSign className="w-4 h-4 text-muted-foreground" />{tr ? 'Yatırım Tutarı (USD)' : 'Investment Amount (USD)'}</span>}
        tooltip={tr ? 'Başlangıç yatırım tutarınız.' : 'Your initial investment amount.'}
      >
        {({ id }) => (
          <>
            <Input
              id={id}
              type="number" inputMode="decimal"
              min={1}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="text-base"
            />
            <div className="flex gap-2 mt-2">
              {presetAmounts.map(preset => (
                <Button
                  key={preset}
                  type="button"
                  variant={amount === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAmount(preset)}
                  className="flex-1 text-xs"
                >
                  ${formatGroupedInt(preset, getCurrentIntlLocale())}
                </Button>
              ))}
            </div>
          </>
        )}
      </InputField>

      <InputField
        label={tr ? 'Projeksiyon Süresi' : 'Projection Period'}
        trailingLabel={`${years} ${tr ? 'yıl' : (years !== 1 ? 'years' : 'year')}`}
      >
        <Slider
          value={[years]}
          onValueChange={([v]) => setYears(v)}
          min={1}
          max={20}
          step={1}
          className="w-full"
          aria-label={tr ? 'Projeksiyon süresi' : 'Projection period'}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{tr ? '1 yıl' : '1 year'}</span>
          <span>{tr ? '20 yıl' : '20 years'}</span>
        </div>
      </InputField>

      <InputField label={tr ? 'Varlıkları Karşılaştır' : 'Compare Assets'}>
        <div className="grid grid-cols-2 gap-3">
          {ASSET_OPTIONS.map(asset => (
            <label
              key={asset.ticker}
              className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedAssets.includes(asset.ticker)
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border/30 hover:border-border/50'
              }`}
            >
              <Checkbox
                checked={selectedAssets.includes(asset.ticker)}
                onCheckedChange={() => toggleAsset(asset.ticker)}
              />
              <span className="text-base">{asset.icon}</span>
              <span className="text-sm font-medium text-foreground">{asset.label}</span>
            </label>
          ))}
        </div>
      </InputField>
    </InputPanel>
  );
};
