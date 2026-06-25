import { useState } from 'react';
import { ZakatAssets, NisabData, SupportedCurrency, GOLD_PURITY, convertUsd, formatCurrency, CURRENCY_SYMBOLS } from '@/services/zakatCalculator';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bitcoin, Wallet, Coins, CircleDollarSign, TrendingUp, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  assets: ZakatAssets;
  onChange: (assets: ZakatAssets) => void;
  nisab: NisabData;
  currency: SupportedCurrency;
}

export const ZakatAssetInputPanel = ({ assets, onChange, nisab, currency }: Props) => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const update = (field: keyof ZakatAssets, value: number | string) => {
    onChange({ ...assets, [field]: value });
  };

  const sym = CURRENCY_SYMBOLS[currency];
  const btcValueLocal = convertUsd(assets.btcAmount * nisab.btcUsd, currency, nisab.exchangeRates);
  const goldValue = assets.goldGrams * (GOLD_PURITY[assets.goldPurity] || 1) * nisab.goldPerGramUsd;
  const goldValueLocal = convertUsd(goldValue, currency, nisab.exchangeRates);
  const silverValue = assets.silverGrams * nisab.silverPerGramUsd;
  const silverValueLocal = convertUsd(silverValue, currency, nisab.exchangeRates);

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-foreground">
        {tr ? 'Adım 3 — Varlıklarınızı Girin' : 'Step 3 — Enter Your Assets'}
      </h3>
      <Tabs defaultValue="bitcoin" className="w-full">
        <TabsList className="w-full grid grid-cols-5 h-auto">
          <TabsTrigger value="bitcoin" className="text-xs gap-1 py-2"><Bitcoin className="w-3 h-3" /> Bitcoin</TabsTrigger>
          <TabsTrigger value="cash" className="text-xs gap-1 py-2"><Wallet className="w-3 h-3" /> {tr ? 'Nakit' : 'Cash'}</TabsTrigger>
          <TabsTrigger value="gold" className="text-xs gap-1 py-2"><Coins className="w-3 h-3" /> {tr ? 'Altın' : 'Gold'}</TabsTrigger>
          <TabsTrigger value="silver" className="text-xs gap-1 py-2"><CircleDollarSign className="w-3 h-3" /> {tr ? 'Gümüş' : 'Silver'}</TabsTrigger>
          <TabsTrigger value="stocks" className="text-xs gap-1 py-2"><TrendingUp className="w-3 h-3" /> {tr ? 'Hisse' : 'Stocks'}</TabsTrigger>
        </TabsList>

        <TabsContent value="bitcoin" className="mt-4 space-y-3">
          <label className="text-sm font-medium text-foreground">
            {tr ? 'Ne kadar Bitcoin\'iniz var?' : 'How much Bitcoin do you own?'}
          </label>
          <div className="flex gap-3 items-center">
            <Input
              type="number" inputMode="decimal"
              step="0.001"
              min="0"
              value={assets.btcAmount || ''}
              onChange={e => update('btcAmount', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="max-w-[200px]"
            />
            <span className="text-sm text-muted-foreground">BTC</span>
          </div>
          {assets.btcAmount > 0 && (
            <p className="text-sm text-muted-foreground">
              {tr ? 'Anlık değer:' : 'Live value:'} <span className="font-semibold text-foreground">{formatCurrency(btcValueLocal, currency)}</span>
              {' '}({tr ? 'BTC fiyatı:' : 'BTC price:'} {formatCurrency(convertUsd(nisab.btcUsd, currency, nisab.exchangeRates), currency)})
            </p>
          )}
        </TabsContent>

        <TabsContent value="cash" className="mt-4 space-y-3">
          <label className="text-sm font-medium text-foreground">
            {tr ? `Nakit ve Tasarruf (${currency})` : `Cash & Savings (${currency})`}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{tr ? 'Eldeki nakit' : 'Cash on hand'}</p>
              <Input type="number" inputMode="decimal" min="0" value={assets.cashOnHand || ''} onChange={e => update('cashOnHand', parseFloat(e.target.value) || 0)} placeholder={`${sym}0`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{tr ? 'Banka tasarrufu' : 'Bank savings'}</p>
              <Input type="number" inputMode="decimal" min="0" value={assets.bankSavings || ''} onChange={e => update('bankSavings', parseFloat(e.target.value) || 0)} placeholder={`${sym}0`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{tr ? 'Vadeli mevduat' : 'Fixed deposits'}</p>
              <Input type="number" inputMode="decimal" min="0" value={assets.fixedDeposits || ''} onChange={e => update('fixedDeposits', parseFloat(e.target.value) || 0)} placeholder={`${sym}0`} />
            </div>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            {tr
              ? 'Bir tam Havl (ay takvimi yılı) boyunca elinizde tuttuğunuz parayı dahil edin'
              : 'Include money held for more than one Hawl (lunar year)'}
          </div>
        </TabsContent>

        <TabsContent value="gold" className="mt-4 space-y-3">
          <label className="text-sm font-medium text-foreground">{tr ? 'Altın Varlıkları' : 'Gold Holdings'}</label>
          <div className="flex gap-3 items-center">
            <Input type="number" inputMode="decimal" min="0" step="0.1" value={assets.goldGrams || ''} onChange={e => update('goldGrams', parseFloat(e.target.value) || 0)} placeholder="0" className="max-w-[150px]" />
            <span className="text-sm text-muted-foreground">{tr ? 'gram' : 'grams'}</span>
            <select
              value={assets.goldPurity}
              onChange={e => update('goldPurity', e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="24K">24K</option>
              <option value="22K">22K</option>
              <option value="21K">21K</option>
              <option value="18K">18K</option>
            </select>
          </div>
          {assets.goldGrams > 0 && (
            <p className="text-sm text-muted-foreground">{tr ? 'Değer:' : 'Value:'} <span className="font-semibold text-foreground">{formatCurrency(goldValueLocal, currency)}</span></p>
          )}
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            {tr
              ? 'Kişisel kullanım için altın takılar — âlimler Zekât yükümlülüğü konusunda farklı görüştedir. Çoğu Hanefi âlim takıların Zekâta tabi olduğunu söyler. Âliminize danışın.'
              : 'Gold jewelry for personal use — scholars disagree on zakatable status. Most Hanafi scholars say yes. Consult your scholar.'}
          </div>
        </TabsContent>

        <TabsContent value="silver" className="mt-4 space-y-3">
          <label className="text-sm font-medium text-foreground">{tr ? 'Gümüş Varlıkları' : 'Silver Holdings'}</label>
          <div className="flex gap-3 items-center">
            <Input type="number" inputMode="decimal" min="0" step="0.1" value={assets.silverGrams || ''} onChange={e => update('silverGrams', parseFloat(e.target.value) || 0)} placeholder="0" className="max-w-[150px]" />
            <span className="text-sm text-muted-foreground">{tr ? 'gram' : 'grams'}</span>
          </div>
          {assets.silverGrams > 0 && (
            <p className="text-sm text-muted-foreground">{tr ? 'Değer:' : 'Value:'} <span className="font-semibold text-foreground">{formatCurrency(silverValueLocal, currency)}</span></p>
          )}
        </TabsContent>

        <TabsContent value="stocks" className="mt-4 space-y-3">
          <label className="text-sm font-medium text-foreground">
            {tr ? `Hisse Senetleri / ETF'ler (${currency})` : `Stocks / ETFs (${currency})`}
          </label>
          <Input type="number" inputMode="decimal" min="0" value={assets.stocksValue || ''} onChange={e => update('stocksValue', parseFloat(e.target.value) || 0)} placeholder={`${sym}0`} className="max-w-[250px]" />
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            {tr
              ? 'Yaygın yöntem: Hisse değerinin %40\'ı Zekâta tabidir (likit varlık yaklaşımı). Kesin hesaplama için âliminize danışın.'
              : 'Common method: 40% of stock value is zakatable (liquid assets approach). Consult your scholar for exact calculation.'}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
