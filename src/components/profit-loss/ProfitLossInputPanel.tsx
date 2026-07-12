import React from 'react';
import { formatGroupedDecimal, formatGroupedInt } from '@/utils/numberFormat';
import { InputPanel } from '@/components/calculator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Plus, Trash2, Building, Percent, Zap } from 'lucide-react';
import { exchangeFeePresets, Purchase, createPurchase } from '@/services/profitLossCalculator';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfitLossInputPanelProps {
  purchases: Purchase[];
  setPurchases: (purchases: Purchase[]) => void;
  sellPrice: number;
  setSellPrice: (price: number) => void;
  sellFeePercent: number;
  setSellFeePercent: (fee: number) => void;
  selectedExchange: string;
  setSelectedExchange: (exchange: string) => void;
  useLivePrice: boolean;
  setUseLivePrice: (use: boolean) => void;
  liveBtcPrice: number;
  isLoadingPrice: boolean;
  customBuyFee: number;
  setCustomBuyFee: (fee: number) => void;
  customSellFee: number;
  setCustomSellFee: (fee: number) => void;
  sellPriceSeededFromLive?: boolean;
}

export const ProfitLossInputPanel: React.FC<ProfitLossInputPanelProps> = ({
  purchases, setPurchases, sellPrice, setSellPrice, sellFeePercent, setSellFeePercent,
  selectedExchange, setSelectedExchange, useLivePrice, setUseLivePrice,
  liveBtcPrice, isLoadingPrice, customBuyFee, setCustomBuyFee, customSellFee, setCustomSellFee,
  sellPriceSeededFromLive = false,
}) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  const currentPreset = exchangeFeePresets.find(e => e.id === selectedExchange);
  const buyFee = selectedExchange === 'custom' ? customBuyFee : (currentPreset?.buyFeePercent || 0);

  const handleExchangeChange = (exchangeId: string) => {
    setSelectedExchange(exchangeId);
    const preset = exchangeFeePresets.find(e => e.id === exchangeId);
    if (preset && exchangeId !== 'custom') {
      setSellFeePercent(preset.sellFeePercent);
      const updated = purchases.map(p => createPurchase(p.amount, p.pricePerBtc, preset.buyFeePercent));
      setPurchases(updated);
    }
  };

  const handleAddPurchase = () => {
    const newPurchase = createPurchase(100, liveBtcPrice > 0 ? liveBtcPrice : 50000, buyFee);
    setPurchases([...purchases, newPurchase]);
  };

  const handleRemovePurchase = (id: string) => {
    if (purchases.length <= 1) return;
    setPurchases(purchases.filter(p => p.id !== id));
  };

  const handleUpdatePurchase = (id: string, field: 'amount' | 'pricePerBtc', value: number) => {
    const updated = purchases.map(p => {
      if (p.id !== id) return p;
      const amount = field === 'amount' ? value : p.amount;
      const price = field === 'pricePerBtc' ? value : p.pricePerBtc;
      return createPurchase(amount, price, buyFee);
    });
    setPurchases(updated);
  };

  return (
    <InputPanel className="bg-card">
      <div className="space-y-5">
        {/* */}
        {/* Exchange Preset */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Building className="w-4 h-4 text-primary" />
            {tr?'Borsa':'Exchange'}
          </Label>
          <Select value={selectedExchange} onValueChange={handleExchangeChange}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder={tr?'Borsa seçin':'Select exchange'} />
            </SelectTrigger>
            <SelectContent>
              {exchangeFeePresets.map(exchange => (
                <SelectItem key={exchange.id} value={exchange.id}>
                  {exchange.name} {exchange.id !== 'custom' && `(${exchange.buyFeePercent}% / ${exchange.sellFeePercent}%)`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentPreset && selectedExchange !== 'custom' && (
            <p className="text-xs text-muted-foreground">{currentPreset.description}</p>
          )}
        </div>

        {/* Custom Fees */}
        {selectedExchange === 'custom' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Percent className="w-3 h-3 text-primary" />
                {tr?'Alım Ücreti %':'Buy Fee %'}
              </Label>
              <Input type="number" inputMode="decimal" value={customBuyFee}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setCustomBuyFee(val);
                  const updated = purchases.map(p => createPurchase(p.amount, p.pricePerBtc, val));
                  setPurchases(updated);
                }}
                className="bg-background/50 text-sm" min={0} max={10} step={0.01} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Percent className="w-3 h-3 text-primary" />
                {tr?'Satım Ücreti %':'Sell Fee %'}
              </Label>
              <Input type="number" inputMode="decimal" value={customSellFee}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setCustomSellFee(val);
                  setSellFeePercent(val);
                }}
                className="bg-background/50 text-sm" min={0} max={10} step={0.01} />
            </div>
          </div>
        )}

        {/* Purchases */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              {tr?'Alımlarınız':'Your Purchases'}
            </Label>
            <Button variant="ghost" size="sm" onClick={handleAddPurchase}
              className="text-xs h-7 px-2 text-primary hover:text-primary/80 gap-1">
              <Plus className="w-3 h-3" />
              {tr?'Alım Ekle':'Add Purchase'}
            </Button>
          </div>

          <div className="space-y-3">
            {purchases.map((purchase, index) => (
              <div key={purchase.id} className="p-3 bg-background/50 rounded-lg border border-border/30 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {tr?`Alım #${index + 1}`:`Purchase #${index + 1}`}
                  </span>
                  {purchases.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => handleRemovePurchase(purchase.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{tr?'Tutar (USD)':'Amount (USD)'}</Label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                      <Input type="number" inputMode="decimal" value={purchase.amount || ''}
                        onChange={(e) => handleUpdatePurchase(purchase.id, 'amount', parseFloat(e.target.value) || 0)}
                        className="pl-6 bg-background/50 text-sm h-9" min={1} placeholder="1000" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{tr?'Alış Fiyatı (USD)':'Buy Price (USD)'}</Label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                      <Input type="number" inputMode="decimal" value={purchase.pricePerBtc || ''}
                        onChange={(e) => handleUpdatePurchase(purchase.id, 'pricePerBtc', parseFloat(e.target.value) || 0)}
                        className="pl-6 bg-background/50 text-sm h-9" min={1} placeholder="50000" />
                    </div>
                  </div>
                </div>
                {purchase.btcAmount > 0 && (
                  <div className="text-xs text-muted-foreground flex justify-between pt-1 border-t border-border/20">
                    <span>{tr?'Alınan BTC:':'BTC received:'}</span>
                    <span className="font-mono text-foreground">{purchase.btcAmount.toFixed(8)} BTC</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[100, 500, 1000, 5000, 10000].map(amount => (
              <Button key={amount} variant="outline" size="sm"
                onClick={() => {
                  if (purchases.length === 1 && purchases[0].amount === 0) {
                    const updated = [createPurchase(amount, purchases[0].pricePerBtc || liveBtcPrice || 50000, buyFee)];
                    setPurchases(updated);
                  } else {
                    const newPurchase = createPurchase(amount, liveBtcPrice || 50000, buyFee);
                    setPurchases([...purchases, newPurchase]);
                  }
                }}
                className="text-xs h-7 px-2">
                ${formatGroupedInt(amount)}
              </Button>
            ))}
          </div>
        </div>

        {/* Sell Price */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              {tr?'Satış Fiyatı':'Sell Price'}
            </Label>
            <div className="flex items-center gap-2">
              <Label htmlFor="live-price-toggle" className="text-xs text-muted-foreground cursor-pointer">
                {tr?'Canlı Fiyat':'Use Live Price'}
              </Label>
              <Switch id="live-price-toggle" checked={useLivePrice} onCheckedChange={setUseLivePrice} />
            </div>
          </div>

          {useLivePrice ? (
            <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground font-mono">
                ${formatGroupedDecimal(liveBtcPrice, 2, 'en-US')}
              </span>
              <span className="text-xs text-muted-foreground">
                {isLoadingPrice ? (tr?'(yükleniyor...)':'(loading...)') : (tr?'(canlı)':'(live)')}
              </span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input type="number" inputMode="decimal" value={sellPrice || ''}
                  onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                  className="pl-7 bg-background/50" min={1} placeholder="100000"
                  aria-describedby={sellPriceSeededFromLive ? "sell-price-seed-hint" : undefined} />
              </div>
              {sellPriceSeededFromLive && (
                <p id="sell-price-seed-hint" className="text-xs text-muted-foreground leading-snug">
                  {tr?'Canlı fiyattan alındı. Gerçek çıkışınızı modellemek için düzenleyin.':'Seeded from live price. Edit to model your actual exit.'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </InputPanel>
  );
};
