import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bitcoin, DollarSign, ArrowLeftRight } from 'lucide-react';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoney } from '@/utils/formatMoney';
import { InputPanel } from '@/components/calculator';

interface WealthInputPanelProps {
  btcAmount: number;
  onBtcAmountChange: (amount: number) => void;
}

const BTC_PRESETS = [0.001, 0.01, 0.1, 0.5, 1.0, 2.1, 5.0, 10.0];
const FIAT_PRESETS = [100, 500, 1_000, 5_000, 10_000, 50_000, 100_000];

export const WealthInputPanel: React.FC<WealthInputPanelProps> = ({ btcAmount, onBtcAmountChange }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();

  const [inputMode, setInputMode] = useState<'btc' | 'fiat'>('btc');
  const [inputValue, setInputValue] = useState<string>('0.1');
  const { price: btcPrice, isLoading: isPriceLoading } = useLiveBitcoinPrice();

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) {
      onBtcAmountChange(0);
      return;
    }
    if (inputMode === 'btc') {
      onBtcAmountChange(Math.min(numericValue, 21_000_000));
    } else if (btcPrice > 0) {
      onBtcAmountChange(Math.min(numericValue / btcPrice, 21_000_000));
    }
  }, [inputMode, btcPrice, onBtcAmountChange]);

  const handlePresetClick = useCallback((value: number) => {
    setInputValue(value.toString());
    if (inputMode === 'btc') {
      onBtcAmountChange(value);
    } else if (btcPrice > 0) {
      onBtcAmountChange(value / btcPrice);
    }
  }, [inputMode, btcPrice, onBtcAmountChange]);

  const toggleMode = useCallback(() => {
    const newMode = inputMode === 'btc' ? 'fiat' : 'btc';
    setInputMode(newMode);
    if (newMode === 'fiat' && btcPrice > 0) {
      setInputValue(Math.round(btcAmount * btcPrice).toString());
    } else {
      setInputValue(btcAmount > 0 ? btcAmount.toString() : '0');
    }
  }, [inputMode, btcAmount, btcPrice]);

  const presets = inputMode === 'btc' ? BTC_PRESETS : FIAT_PRESETS;

  return (
    <InputPanel
      title={tr ? 'Ne kadar Bitcoin sahibisiniz?' : 'How much Bitcoin do you own?'}
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleMode}
          className="gap-1.5 text-xs"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          {inputMode === 'btc'
            ? (tr ? "USD'ye Geç" : 'Switch to USD')
            : (tr ? "BTC'ye Geç" : 'Switch to BTC')}
        </Button>
      }
    >

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            {inputMode === 'btc' ? (
              <Bitcoin className="w-5 h-5 text-primary" />
            ) : (
              <DollarSign className="w-5 h-5 text-primary" />
            )}
          </div>
          <Input
            type="number"
            inputMode="decimal"
            min="0"
            max={inputMode === 'btc' ? 21_000_000 : undefined}
            step={inputMode === 'btc' ? '0.001' : '1'}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={inputMode === 'btc'
              ? (tr ? 'BTC miktarı girin' : 'Enter BTC amount')
              : (tr ? 'USD miktarı girin' : 'Enter USD amount')}
            className="pl-10 text-lg h-12 font-mono tabular-nums"
          />
        </div>

        {btcAmount > 0 && btcPrice > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="tabular-nums">
              {inputMode === 'btc'
                ? `≈ ${formatMoney(btcAmount * btcPrice, { tr, fxRate, decimals: 2 })}`
                : `≈ ${btcAmount.toFixed(8)} BTC`}
            </span>
            <span className="text-xs">
              ({(btcAmount * 100_000_000).toLocaleString(getCurrentIntlLocale())} sats)
            </span>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {tr ? 'Hızlı Seçim' : 'Quick Select'}
          </Label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {presets.map((value) => (
              <Button
                key={value}
                variant="outline"
                size="sm"
                onClick={() => handlePresetClick(value)}
                className={cn(
                  'text-xs font-mono tabular-nums min-h-[40px] transition-all',
                  ((inputMode === 'btc' && btcAmount === value) ||
                    (inputMode === 'fiat' && btcPrice > 0 && Math.abs(btcAmount * btcPrice - value) < 1))
                    ? 'border-primary bg-primary/10 text-primary'
                    : ''
                )}
              >
                {inputMode === 'btc'
                  ? value >= 1 ? `${value}` : `${value}`
                  : tr
                    ? `${formatMoney(value, { tr, fxRate, decimals: 0 })}`
                    : `$${value >= 1000 ? `${value / 1000}k` : value}`}
              </Button>
            ))}
          </div>
        </div>

        {btcPrice > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/20">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              {tr ? 'Canlı BTC Fiyatı' : 'Live BTC Price'}
            </span>
            <span className="font-mono tabular-nums font-medium text-foreground">
              {formatMoney(btcPrice, { tr, fxRate, decimals: 2 })}
            </span>
          </div>
        )}
    </InputPanel>
  );
};
