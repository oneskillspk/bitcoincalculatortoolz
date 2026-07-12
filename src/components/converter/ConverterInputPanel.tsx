import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, TrendingUp, TrendingDown } from 'lucide-react';
import { BITCOIN_UNITS, BitcoinUnitKey, ConversionValues, calculateConversions } from '@/services/bitcoinConverterService';
import { SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { InputPanel } from '@/components/calculator';

interface ConverterInputPanelProps {
  liveBtcPrice: number;
  isLoadingPrice: boolean;
  priceChangePercentage24h: number;
  selectedCurrency: string;
  setSelectedCurrency: (c: string) => void;
}

const unitFields: { key: BitcoinUnitKey; label: string; placeholder: string }[] = [
  { key: 'btc', label: 'BTC', placeholder: '0.00000000' },
  { key: 'mbtc', label: 'mBTC', placeholder: '0.00000' },
  { key: 'bits', label: 'bits (μBTC)', placeholder: '0.00' },
  { key: 'sats', label: 'Satoshis', placeholder: '0' },
];

export const ConverterInputPanel: React.FC<ConverterInputPanelProps> = ({
  liveBtcPrice,
  isLoadingPrice,
  priceChangePercentage24h,
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [values, setValues] = useState<ConversionValues>({
    btc: '', mbtc: '', bits: '', sats: '', fiat: '',
  });
  const [useLivePrice, setUseLivePrice] = useState(true);
  const [customPrice, setCustomPrice] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);

  const effectivePrice = useLivePrice ? liveBtcPrice : (parseFloat(customPrice) || 0);

  const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === selectedCurrency);
  const currencySymbol = currencyInfo?.symbol || '$';

  useEffect(() => {
    if (activeField && effectivePrice > 0) {
      const fieldValue = activeField === 'fiat' ? values.fiat : values[activeField as BitcoinUnitKey];
      const num = parseFloat(fieldValue || '0');
      if (num > 0) {
        const newValues = calculateConversions(num, activeField as BitcoinUnitKey | 'fiat', effectivePrice);
        setValues(prev => ({
          ...newValues,
          [activeField]: prev[activeField as keyof ConversionValues],
        }));
      }
    }
  }, [effectivePrice]);

  const handleInputChange = useCallback((field: BitcoinUnitKey | 'fiat', rawValue: string) => {
    if (rawValue === '' || rawValue === '.') {
      setValues({ btc: '', mbtc: '', bits: '', sats: '', fiat: '' });
      setActiveField(field);
      return;
    }

    const num = parseFloat(rawValue);
    if (isNaN(num)) return;

    setActiveField(field);
    const newValues = calculateConversions(num, field, effectivePrice);
    newValues[field as keyof ConversionValues] = rawValue;
    setValues(newValues);
  }, [effectivePrice]);

  const handleCopy = useCallback(async (field: string, value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      toast.success(tr ? 'Panoya kopyalandı' : 'Copied to clipboard');
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error(tr ? 'Kopyalanamadı' : 'Failed to copy');
    }
  }, [tr]);

  const fiatCurrencies = SUPPORTED_CURRENCIES.filter(c => c.code !== 'BTC');

  return (
    <InputPanel title={tr ? 'Bitcoin Birimi ve Fiat Dönüştür' : 'Convert Bitcoin Units & Fiat'}>
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isLoadingPrice ? "bg-muted-foreground animate-pulse" : "bg-success animate-pulse"
            )} />
            <span className="text-sm font-medium text-foreground">
              {useLivePrice ? (tr ? 'Canlı Fiyat' : 'Live Price') : (tr ? 'Özel Fiyat' : 'Custom Price')}
            </span>
            {useLivePrice && effectivePrice > 0 && (
              <span className="text-sm font-mono text-muted-foreground">
                ${effectivePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>
          <Switch checked={useLivePrice} onCheckedChange={setUseLivePrice} />
        </div>

        {!useLivePrice && (
          <div>
            <Label className="text-sm text-muted-foreground mb-1.5 block">
              {tr ? 'Özel BTC Fiyatı (USD)' : 'Custom BTC Price (USD)'}
            </Label>
            <Input
              type="number" inputMode="decimal"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              placeholder={tr ? 'Özel BTC fiyatı girin' : 'Enter custom BTC price'}
              aria-label={tr ? 'Özel BTC Fiyatı (USD)' : 'Custom BTC Price (USD)'}
              className="font-mono"
            />
          </div>
        )}

        <div>
          <Label className="text-sm text-muted-foreground mb-1.5 block">
            {tr ? 'Fiat Para Birimi' : 'Fiat Currency'}
          </Label>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {fiatCurrencies.map((cur) => (
                <SelectItem key={cur.code} value={cur.code}>
                  <span className="flex items-center gap-2">
                    <span>{cur.flag}</span>
                    <span>{cur.code}</span>
                    <span className="text-muted-foreground text-xs">– {cur.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-border/30" />

        {unitFields.map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground flex items-center justify-between">
              <span>{label} <span className="text-muted-foreground text-xs font-normal">({BITCOIN_UNITS[key].name})</span></span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-muted-foreground hover:text-primary"
                onClick={() => handleCopy(key, values[key])}
                disabled={!values[key]}
              >
                {copiedField === key ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </Label>
            <Input
              type="text"
              inputMode="decimal"
              value={values[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              placeholder={placeholder}
              aria-label={`${label} (${BITCOIN_UNITS[key].name})`}
              className="font-mono text-base"
              onFocus={() => setActiveField(key)}
            />
          </div>
        ))}

        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-border/30" />
          <span className="text-xs text-muted-foreground font-medium">FIAT</span>
          <div className="flex-1 border-t border-border/30" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground flex items-center justify-between">
            <span>{currencyInfo?.flag} {selectedCurrency} <span className="text-muted-foreground text-xs font-normal">({currencyInfo?.name})</span></span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-muted-foreground hover:text-primary"
              onClick={() => handleCopy('fiat', values.fiat)}
              disabled={!values.fiat}
            >
              {copiedField === 'fiat' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </Label>
          <Input
            type="text"
            inputMode="decimal"
            value={values.fiat}
            onChange={(e) => handleInputChange('fiat', e.target.value)}
            placeholder="0.00"
            aria-label={`${selectedCurrency} ${currencyInfo?.name ?? ''}`.trim()}
            className="font-mono text-base"
            onFocus={() => setActiveField('fiat')}
          />
        </div>

        {useLivePrice && (
          <div className={cn(
            "flex items-center gap-2 text-sm font-medium p-2 rounded-lg",
            priceChangePercentage24h >= 0 ? "text-success bg-success/5" : "text-destructive bg-destructive/5"
          )}>
            {priceChangePercentage24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {priceChangePercentage24h >= 0 ? '+' : ''}{priceChangePercentage24h.toFixed(2)}% ({tr ? '24s' : '24h'})
          </div>
        )}
    </InputPanel>
  );
};
