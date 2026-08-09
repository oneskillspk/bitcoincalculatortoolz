import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BITCOIN_ETFS, BitcoinETF } from "@/services/etfData";
import { DollarSign, Clock, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { InputPanel, CalculateButton } from "@/components/calculator";

interface ETFInputPanelProps {
  onCalculate: (params: {
    investmentAmount: number;
    selectedETF: BitcoinETF;
    holdingPeriodYears: number;
    expectedReturn: number;
  }) => void;
  loading?: boolean;
}

export const ETFInputPanel = ({ onCalculate, loading }: ETFInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [selectedTicker, setSelectedTicker] = useState('IBIT');
  const [holdingPeriodYears, setHoldingPeriodYears] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(30);

  const selectedETF = BITCOIN_ETFS.find(e => e.ticker === selectedTicker) || BITCOIN_ETFS[0];

  const handleSubmit = () => {
    onCalculate({
      investmentAmount,
      selectedETF,
      holdingPeriodYears,
      expectedReturn: expectedReturn / 100,
    });
  };

  return (
    <InputPanel
      title={tr ? 'ETF Parametreleri' : 'ETF Parameters'}
      onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
      footer={
        <CalculateButton loading={loading} disabled={investmentAmount < 100} fullWidth>
          {tr ? 'ETF Getirilerini Hesapla' : 'Calculate ETF Returns'}
        </CalculateButton>
      }
    >

        {/* Investment Amount */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            {tr ? 'Yatırım Miktarı (USD)' : 'Investment Amount (USD)'}
          </Label>
          <Input
            type="number" inputMode="decimal"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
            min={100}
            step={100}
            className="bg-background/50 border-border/30"
          />
        </div>

        {/* ETF Selection */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">{tr ? 'Bitcoin ETF Seçin' : 'Select Bitcoin ETF'}</Label>
          <Select value={selectedTicker} onValueChange={setSelectedTicker}>
            <SelectTrigger className="bg-background/50 border-border/30" aria-label={tr ? 'Bitcoin ETF seçin' : 'Select Bitcoin ETF'}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BITCOIN_ETFS.map(etf => (
                <SelectItem key={etf.ticker} value={etf.ticker}>
                  <span className="font-medium">{etf.ticker}</span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    — {etf.issuer} ({(etf.expenseRatio * 100).toFixed(2)}% {tr ? 'ücret' : 'fee'})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {selectedETF.name} • {tr ? 'Gider oranı' : 'Expense ratio'}: {(selectedETF.expenseRatio * 100).toFixed(2)}%
          </p>
        </div>

        {/* Holding Period */}
        <div className="space-y-3">
          <Label className="text-sm text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            {tr ? `Elde Tutma Süresi: ${holdingPeriodYears} ${holdingPeriodYears === 1 ? 'yıl' : 'yıl'}` : `Holding Period: ${holdingPeriodYears} ${holdingPeriodYears === 1 ? 'year' : 'years'}`}
          </Label>
          <Slider
            value={[holdingPeriodYears]}
            onValueChange={([v]) => setHoldingPeriodYears(v)}
            min={1}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 {tr ? 'yıl' : 'yr'}</span>
            <span>10 {tr ? 'yıl' : 'yr'}</span>
            <span>20 {tr ? 'yıl' : 'yr'}</span>
          </div>
        </div>

        {/* Expected Annual Return */}
        <div className="space-y-3">
          <Label className="text-sm text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            {tr ? `Beklenen Yıllık BTC Getirisi: ${expectedReturn}%` : `Expected Annual BTC Return: ${expectedReturn}%`}
          </Label>
          <Slider
            value={[expectedReturn]}
            onValueChange={([v]) => setExpectedReturn(v)}
            min={-20}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>-20%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

    </InputPanel>
  );
};
