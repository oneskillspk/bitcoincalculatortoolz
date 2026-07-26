import React from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { InputPanel } from '@/components/calculator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, DollarSign, Percent, AlertTriangle, Building, Info } from 'lucide-react';
import { exchangePresets, leveragePresets } from '@/services/leverageLiquidationCalculator';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface LeverageInputPanelProps {
  entryPrice: number;
  setEntryPrice: (value: number) => void;
  positionType: 'long' | 'short';
  setPositionType: (value: 'long' | 'short') => void;
  leverage: number;
  setLeverage: (value: number) => void;
  marginAmount: number;
  setMarginAmount: (value: number) => void;
  marginMode: 'isolated' | 'cross';
  setMarginMode: (value: 'isolated' | 'cross') => void;
  accountCollateral: number;
  setAccountCollateral: (value: number) => void;
  maintenanceMargin: number;
  setMaintenanceMargin: (value: number) => void;
  takeProfitPercent: number;
  setTakeProfitPercent: (value: number) => void;
  stopLossPercent: number;
  setStopLossPercent: (value: number) => void;
  selectedExchange: string;
  setSelectedExchange: (value: string) => void;
  liveBtcPrice: number;
  isLoadingPrice: boolean;
}

export const LeverageInputPanel: React.FC<LeverageInputPanelProps> = ({
  entryPrice,
  setEntryPrice,
  positionType,
  setPositionType,
  leverage,
  setLeverage,
  marginAmount,
  setMarginAmount,
  marginMode,
  setMarginMode,
  accountCollateral,
  setAccountCollateral,
  maintenanceMargin,
  setMaintenanceMargin,
  takeProfitPercent,
  setTakeProfitPercent,
  stopLossPercent,
  setStopLossPercent,
  selectedExchange,
  setSelectedExchange,
  liveBtcPrice,
  isLoadingPrice
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const handleExchangeChange = (exchangeId: string) => {
    setSelectedExchange(exchangeId);
    const preset = exchangePresets.find(e => e.id === exchangeId);
    if (preset) {
      setMaintenanceMargin(preset.maintenanceMargin);
      if (leverage > preset.maxLeverage) {
        setLeverage(preset.maxLeverage);
      }
    }
  };

  const handleUseLivePrice = () => {
    if (liveBtcPrice > 0) {
      setEntryPrice(liveBtcPrice);
    }
  };

  const currentExchange = exchangePresets.find(e => e.id === selectedExchange);
  const maxLeverage = currentExchange?.maxLeverage || 125;

  return (
    <InputPanel className="bg-card">
      <div className="space-y-5">
        {/* Exchange Preset */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Building className="w-4 h-4 text-primary" />
            {tr ? 'Borsa' : 'Exchange'}
          </Label>
          <Select value={selectedExchange} onValueChange={handleExchangeChange}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder={tr ? 'Borsa seçin' : 'Select exchange'} />
            </SelectTrigger>
            <SelectContent>
              {exchangePresets.map(exchange => (
                <SelectItem key={exchange.id} value={exchange.id}>
                  {exchange.name} ({tr ? 'Maks' : 'Max'} {exchange.maxLeverage}x)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Entry Price */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              {tr ? 'Giriş Fiyatı' : 'Entry Price'}
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUseLivePrice}
              disabled={isLoadingPrice || liveBtcPrice <= 0}
              className="text-xs h-7 px-2 text-primary hover:text-primary/80"
            >
              {tr ? 'Canlı Fiyat Kullan' : 'Use Live Price'}
            </Button>
          </div>
          <div className="relative" data-currency-exempt="true">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              type="number" inputMode="decimal"
              value={entryPrice}
              onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
              className="pl-7 bg-background/50"
              min={1}
              max={999999}
              aria-label={tr ? 'Giriş Fiyatı (USD)' : 'Entry Price (USD)'}
            />
          </div>
        </div>

        {/* Position Type Toggle */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">{tr ? 'Pozisyon Türü' : 'Position Type'}</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={positionType === 'long' ? 'default' : 'outline'}
              onClick={() => setPositionType('long')}
              className={cn(
                "h-12 gap-2",
                positionType === 'long' 
                  ? "bg-success hover:bg-success text-white" 
                  : "hover:border-success/50"
              )}
            >
              <TrendingUp className="w-4 h-4" />
              {tr ? 'Uzun' : 'Long'}
            </Button>
            <Button
              variant={positionType === 'short' ? 'default' : 'outline'}
              onClick={() => setPositionType('short')}
              className={cn(
                "h-12 gap-2",
                positionType === 'short' 
                  ? "bg-destructive hover:bg-destructive text-white" 
                  : "hover:border-destructive/50"
              )}
            >
              <TrendingDown className="w-4 h-4" />
              {tr ? 'Kısa' : 'Short'}
            </Button>
          </div>
        </div>

        {/* Leverage Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{tr ? 'Kaldıraç' : 'Leverage'}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number" inputMode="decimal"
                value={leverage}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setLeverage(Math.min(Math.max(val, 1), maxLeverage));
                }}
                className="w-16 h-8 text-center text-sm bg-background/50"
                min={1}
                max={maxLeverage}
                aria-label={tr ? 'Kaldıraç çarpanı' : 'Leverage multiplier'}
              />
              <span className="text-sm font-medium text-primary">x</span>
            </div>
          </div>
          <Slider
            value={[leverage]}
            onValueChange={(value) => setLeverage(value[0])}
            min={1}
            max={maxLeverage}
            step={1}
            className="py-2"
          />
          <div className="flex flex-wrap gap-1.5">
            {leveragePresets.map(preset => (
              <Button
                key={preset.value}
                variant={leverage === preset.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLeverage(preset.value)}
                disabled={preset.value > maxLeverage}
                className="text-xs h-7 px-2"
              >
                {preset.value}x
              </Button>
            ))}
          </div>
          {leverage > 10 && (
            <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-lg text-xs text-destructive">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{tr ? '10x üzerinde, küçük Bitcoin hareketleri pozisyonu hızlıca tasfiye edebilir. Sıkı stop emirleri ve küçük pozisyonlar kullanın.' : 'Above 10x, small Bitcoin moves can liquidate the position quickly. Use strict stops and smaller size.'}</span>
            </div>
          )}
        </div>

        {/* Margin Amount */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            {tr ? 'Marj (Teminat)' : 'Margin (Collateral)'}
          </Label>
          <div className="relative" data-currency-exempt="true">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              type="number" inputMode="decimal"
              value={marginAmount}
              onChange={(e) => setMarginAmount(parseFloat(e.target.value) || 0)}
              className="pl-7 bg-background/50"
              min={1}
              max={1000000}
              aria-label={tr ? 'Marj tutarı (USD)' : 'Margin amount (USD)'}
            />
          </div>
          <div className="flex flex-wrap gap-1.5" data-currency-exempt="true">
            {[100, 500, 1000, 5000, 10000].map(amount => (
              <Button
                key={amount}
                variant={marginAmount === amount ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMarginAmount(amount)}
                className="text-xs h-7 px-2"
              >
                ${formatGroupedInt(amount)}
              </Button>
            ))}
          </div>
          {tr && (
            <p className="text-xs text-muted-foreground/80">
              Türev sözleşmeleri standart olarak USD cinsinden işlem görür.
            </p>
          )}
        </div>

        {/* Margin Mode */}
        <div className="space-y-3 rounded-lg bg-muted/20 border border-border/30 p-3">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Label className="text-sm font-medium">{tr ? 'Marj Modu' : 'Margin Mode'}</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {tr
                    ? 'Bu pozisyonun yalnızca kendi marjını mı yoksa ekstra hesap teminatını mı kullanacağını seçin.'
                    : 'Choose whether this position uses only its own margin or can draw on extra account collateral.'}
                </p>
              </div>
              <span className="rounded-full border border-border/40 px-3 py-1 text-xs font-medium text-muted-foreground capitalize">
                {tr ? (marginMode === 'isolated' ? 'İzole' : 'Çapraz') : marginMode}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={tr ? 'Marj modu' : 'Margin mode'}>
              {(['isolated', 'cross'] as const).map((mode) => (
                <Button
                  key={mode}
                  type="button"
                  variant={marginMode === mode ? 'default' : 'outline'}
                  onClick={() => setMarginMode(mode)}
                  role="radio"
                  aria-checked={marginMode === mode}
                  className="h-auto min-h-16 flex-col items-start gap-1 p-3 text-left"
                >
                  <span className="text-sm font-semibold capitalize">
                    {tr ? (mode === 'isolated' ? 'İzole' : 'Çapraz') : mode}
                  </span>
                  <span className="text-xs font-normal opacity-80">
                    {mode === 'isolated'
                      ? (tr ? 'Yalnızca pozisyon marjı risk altında.' : 'Only position margin is at risk.')
                      : (tr ? 'Ekstra hesap teminatı kullanılabilir.' : 'Extra account collateral can be used.')}
                  </span>
                </Button>
              ))}
            </div>
          </div>
          {marginMode === 'cross' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-xs sm:text-sm font-medium">{tr ? 'Risk Altındaki Ekstra Hesap Teminatı' : 'Extra Account Collateral at Risk'}</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground" aria-label={tr ? 'Hesap teminatı ne anlama gelir' : 'What account collateral means'}>
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">{tr ? 'Çapraz marjda bu, borsanın pozisyonu açık tutmak için kullanabileceği ekstra hesap özkaynaklarıdır. Tasfiyeyi uzaklaştırabilir, ancak risk altındaki dolar miktarını da artırır.' : 'In cross margin, this is extra account equity the exchange may use to keep the position open. It can move liquidation farther away, but it also increases dollars at risk.'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative" data-currency-exempt="true">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number" inputMode="decimal"
                  value={accountCollateral || ''}
                  onChange={(e) => setAccountCollateral(parseFloat(e.target.value) || 0)}
                  className="pl-7 bg-background/50"
                  min={0}
                  max={1000000}
                  placeholder={tr ? 'örn. 2000' : 'e.g. 2000'}
                />
              </div>
            </div>
          )}
        </div>

        {/* Maintenance Margin */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Percent className="w-4 h-4 text-primary" />
            {tr ? 'Bakım Marjı' : 'Maintenance Margin'}
          </Label>
          <div className="relative">
            <Input
              type="number" inputMode="decimal"
              value={maintenanceMargin}
              onChange={(e) => setMaintenanceMargin(parseFloat(e.target.value) || 0.5)}
              className="pr-7 bg-background/50"
              min={0.1}
              max={5}
              step={0.1}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
          </div>
        </div>

        {/* Take Profit & Stop Loss */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-medium text-success">{tr ? 'Kâr Al %' : 'Take Profit %'}</Label>
            <div className="relative">
              <Input
                type="number" inputMode="decimal"
                value={takeProfitPercent}
                onChange={(e) => setTakeProfitPercent(parseFloat(e.target.value) || 0)}
                className="pr-7 bg-background/50 text-sm"
                min={0}
                max={1000}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-medium text-destructive">{tr ? 'Zarar Durdur %' : 'Stop Loss %'}</Label>
            <div className="relative">
              <Input
                type="number" inputMode="decimal"
                value={stopLossPercent}
                onChange={(e) => setStopLossPercent(parseFloat(e.target.value) || 0)}
                className="pr-7 bg-background/50 text-sm"
                min={0}
                max={100}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
            </div>
          </div>
        </div>
      </div>
    </InputPanel>
  );
};
