import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, CalendarDays } from 'lucide-react';
import { calculateOpportunityCost } from '@/services/pizzaDayCalculatorService';
import { staticDataService } from '@/services/staticDataService';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatGroupedInt } from '@/utils/numberFormat';

interface Props {
  currentBtcPrice: number;
}

export const OpportunityCostPanel = ({ currentBtcPrice }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [amount, setAmount] = useState(100);
  const [itemName, setItemName] = useState('');
  const [dateStr, setDateStr] = useState('2015-01-01');
  const [frequency, setFrequency] = useState<'once' | 'weekly' | 'monthly'>('once');

  const presets = [
    { label: tr ? 'Kahve' : 'Coffee', amount: 5, item: tr ? 'günlük kahve' : 'daily coffee', date: '2017-01-01' },
    { label: tr ? 'Öğle Yemeği' : 'Lunch', amount: 15, item: tr ? 'hafta içi öğle yemeği' : 'weekday lunch', date: '2018-01-01' },
    { label: 'Netflix', amount: 15, item: tr ? 'yayın aboneliği' : 'streaming subscription', date: '2016-01-01' },
    { label: tr ? 'Pizza' : 'Pizza', amount: 25, item: tr ? 'pizza gecesi' : 'pizza night', date: '2015-05-22' },
    { label: tr ? 'Spor Salonu' : 'Gym', amount: 50, item: tr ? 'spor salonu üyeliği' : 'gym membership', date: '2019-01-01' },
  ];

  const { data: historicalPrice } = useQuery({
    queryKey: ['historical-price-pizza', dateStr],
    queryFn: async () => {
      const date = new Date(dateStr);
      return staticDataService.getHistoricalPrice(date);
    },
    enabled: !!dateStr,
  });

  const result = useMemo(() => {
    if (!historicalPrice || historicalPrice <= 0) return null;
    const start = new Date(dateStr);
    const now = new Date();
    const months = Math.max(1, (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth());
    const frequencyMultiplier = frequency === 'weekly' ? Math.max(1, Math.floor(months * 4.345)) : frequency === 'monthly' ? months : 1;
    return calculateOpportunityCost({
      amountSpent: amount * frequencyMultiplier,
      purchaseDate: new Date(dateStr),
      itemName: itemName || undefined,
      currentBtcPrice,
      historicalBtcPrice: historicalPrice,
    });
  }, [amount, dateStr, frequency, itemName, currentBtcPrice, historicalPrice]);

  const formatValue = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${formatGroupedInt(n, 'en-US')}`;
    return `$${n.toFixed(2)}`;
  };

  const freqLabel = (f: 'once' | 'weekly' | 'monthly') => {
    if (f === 'once') return tr ? 'Bir Kez' : 'Once';
    if (f === 'weekly') return tr ? 'Haftalık' : 'Weekly';
    return tr ? 'Aylık' : 'Monthly';
  };

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          {tr ? 'Fırsat Maliyeti Hesaplayıcısı' : 'Your Opportunity Cost Calculator'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {tr ? 'O satın alma yerine Bitcoin alsaydınız ne olurdu?' : "What if you'd bought Bitcoin instead of that purchase?"}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              type="button"
              variant="outline"
              size="sm"
              className="min-h-11"
              onClick={() => { setAmount(preset.amount); setItemName(preset.item); setDateStr(preset.date); }}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">{tr ? 'Harcanan Tutar ($)' : 'Amount Spent ($)'}</Label>
            <Input id="amount" type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))} min={1} max={1000000} />
            <Slider value={[amount]} onValueChange={([v]) => setAmount(v)} min={1} max={10000} step={10} className="mt-2" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">{tr ? 'Satın Alma Tarihi' : 'Purchase Date'}</Label>
            <Input id="date" type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} min="2010-07-17" max={new Date().toISOString().split('T')[0]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="item" className="text-sm font-medium">{tr ? 'Ürün Adı (isteğe bağlı)' : 'Item Name (optional)'}</Label>
            <Input id="item" type="text" inputMode="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder={tr ? 'örn. Kahve, Ayakkabı, PS5' : 'e.g., Coffee, Shoes, PS5'} />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            {tr ? 'Harcama Sıklığı' : 'Spending Frequency'}
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {(['once', 'weekly', 'monthly'] as const).map((option) => (
              <Button
                key={option}
                type="button"
                variant={frequency === option ? 'default' : 'outline'}
                className="min-h-11"
                onClick={() => setFrequency(option)}
              >
                {freqLabel(option)}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {tr
              ? 'Haftalık ve aylık modlar, seçilen tarihten bugüne tekrarlayan harcamayı hesaplar, ardından o toplam ile başlangıç fiyatından tek seferlik BTC alımını karşılaştırır.'
              : 'Weekly and monthly modes estimate repeated spending from the selected date through today, then compare that total against buying BTC once at the starting price.'}
          </p>
        </div>

        {result && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <p className="text-sm text-muted-foreground mb-3">
              {tr
                ? <>{dateStr} tarihinde <span className="font-semibold text-foreground">{result.itemName}</span> yerine Bitcoin alsaydınız <span className="text-xs">({frequency === 'once' ? 'tek seferlik satın alma' : `${freqLabel(frequency).toLowerCase()} alışkanlık`})</span>:</>
                : <>If you'd bought Bitcoin instead of <span className="font-semibold text-foreground">{result.itemName}</span> on <span className="font-semibold text-foreground">{dateStr}</span> <span className="text-xs">({frequency === 'once' ? 'one-time purchase' : `${frequency} habit`})</span>:</>}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">{tr ? 'Harcadığınız' : 'You Spent'}</p>
                <p className="text-lg font-bold text-foreground">{formatValue(result.amountSpent)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{tr ? 'Sahip Olacağınız BTC' : "BTC You'd Own"}</p>
                <p className="text-lg font-bold text-primary font-mono">
                  {result.btcCouldHaveBought < 1
                    ? `${formatGroupedInt(Math.round(result.btcCouldHaveBought * 100_000_000), 'en-US')} sats`
                    : `${result.btcCouldHaveBought.toFixed(4)} BTC`}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{tr ? 'Bugün Değeri' : 'Worth Today'}</p>
                <p className="text-lg font-bold text-success">{formatValue(result.currentValue)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{tr ? 'Çarpan' : 'Multiplier'}</p>
                <Badge variant="outline" className="border-primary/30 text-primary text-base font-bold px-3 py-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {result.multiplier.toFixed(1)}x
                </Badge>
              </div>
            </div>
          </div>
        )}

        {!result && historicalPrice === null && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            {tr ? 'O tarih için geçmiş fiyat verisi yok. Temmuz 2010 sonrası bir tarih deneyin.' : 'No historical price data available for that date. Try a date after July 2010.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
