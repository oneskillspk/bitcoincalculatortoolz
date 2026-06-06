import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPPORTED_CURRENCIES } from "@/services/bitcoinApi";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { InputPanel, CalculateButton } from "@/components/calculator";

interface PurchasingPowerInputPanelProps {
  btcAmount: number;
  fiatAmount: number;
  currency: string;
  useLivePrice: boolean;
  currentBtcPrice: number;
  onBtcAmountChange: (value: number) => void;
  onFiatAmountChange: (value: number) => void;
  onCurrencyChange: (value: string) => void;
  onLivePriceToggle: (value: boolean) => void;
  onCalculate: () => void;
  loading?: boolean;
}

export const PurchasingPowerInputPanel = ({
  btcAmount,
  fiatAmount,
  currency,
  useLivePrice,
  currentBtcPrice,
  onBtcAmountChange,
  onFiatAmountChange,
  onCurrencyChange,
  onLivePriceToggle,
  onCalculate,
  loading = false
}: PurchasingPowerInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const currencySymbol = SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  const handleBtcChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    onBtcAmountChange(numValue);
    if (useLivePrice && currentBtcPrice > 0) {
      onFiatAmountChange(numValue * currentBtcPrice);
    }
  };

  const handleFiatChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    onFiatAmountChange(numValue);
    if (useLivePrice && currentBtcPrice > 0) {
      onBtcAmountChange(numValue / currentBtcPrice);
    }
  };

  return (
    <InputPanel
      title={tr ? 'Miktar Girin' : 'Input Amount'}
      onSubmit={(e) => { e.preventDefault(); onCalculate(); }}
      footer={
        <CalculateButton
          loading={loading}
          loadingLabel={tr ? 'Hesaplanıyor...' : 'Calculating...'}
          disabled={btcAmount <= 0 && fiatAmount <= 0}
          fullWidth
        >
          {tr ? 'Hesapla' : 'Calculate'}
        </CalculateButton>
      }
    >
        {/* Bitcoin Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="btc-amount" className="text-sm font-medium">
            {tr ? 'Bitcoin Miktarı' : 'Bitcoin Amount'}
          </Label>
          <div className="relative">
            <Input
              id="btc-amount"
              type="number"
              step="0.001"
              min="0"
              value={btcAmount || ''}
              onChange={(e) => handleBtcChange(e.target.value)}
              placeholder="0.5"
              className="pr-12 h-11"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
              BTC
            </div>
          </div>
        </div>

        {/* OR Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-2 text-muted-foreground">{tr ? 'VEYA' : 'OR'}</span>
          </div>
        </div>

        {/* Fiat Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="fiat-amount" className="text-sm font-medium">
            {tr ? 'Fiat Miktarı' : 'Fiat Amount'}
          </Label>
          <div className="relative">
            <Input
              id="fiat-amount"
              type="number"
              step="100"
              min="0"
              value={fiatAmount || ''}
              onChange={(e) => handleFiatChange(e.target.value)}
              placeholder="50000"
              className="pr-12 h-11"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
              {currencySymbol}
            </div>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="space-y-2">
          <Label htmlFor="currency" className="text-sm font-medium">
            {tr ? 'Para Birimi' : 'Currency'}
          </Label>
          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger id="currency" className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_CURRENCIES.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Live Price Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
          <div className="space-y-0.5">
            <Label htmlFor="live-price" className="text-sm font-medium">
              {tr ? 'Miktarları otomatik eşitle' : 'Auto-sync amounts'}
            </Label>
            <p className="text-xs text-muted-foreground">
              {tr ? 'Canlı BTC fiyatı kullan' : 'Use live BTC price'}
            </p>
          </div>
          <Switch
            id="live-price"
            checked={useLivePrice}
            onCheckedChange={onLivePriceToggle}
          />
        </div>

        {/* Current Price Display */}
        {useLivePrice && currentBtcPrice > 0 && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-1">{tr ? 'Güncel BTC Fiyatı' : 'Current BTC Price'}</p>
            <p className="text-base font-semibold text-foreground">
              {currencySymbol}{currentBtcPrice.toLocaleString(getCurrentIntlLocale())}
            </p>
          </div>
        )}

    </InputPanel>
  );
};
