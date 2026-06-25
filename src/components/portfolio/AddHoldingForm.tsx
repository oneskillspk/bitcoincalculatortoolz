import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { Holding } from './usePortfolioStorage';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddHoldingFormProps {
  onAdd: (holding: Omit<Holding, 'id' | 'createdAt'>) => void;
  livePrice: number | null;
}

const QUICK_AMOUNTS = [0.001, 0.01, 0.1, 0.5, 1.0];

export const AddHoldingForm = ({ onAdd, livePrice }: AddHoldingFormProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [label, setLabel] = useState('');
  const [btcAmount, setBtcAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(btcAmount);
    const price = parseFloat(purchasePrice);
    if (isNaN(amount) || amount <= 0 || isNaN(price) || price <= 0) return;

    onAdd({
      label: label.trim() || (tr
        ? `Alım ${format(new Date(), 'dd MMM yyyy')}`
        : `Purchase ${format(new Date(), 'MMM d, yyyy')}`),
      btcAmount: amount,
      purchasePrice: price,
      purchaseDate: purchaseDate ? purchaseDate.toISOString() : null,
    });

    setLabel('');
    setBtcAmount('');
    setPurchasePrice('');
    setPurchaseDate(undefined);
  };

  const handleQuickAdd = (amount: number) => {
    if (!livePrice) return;
    setBtcAmount(amount.toString());
    setPurchasePrice(Math.round(livePrice).toString());
  };

  return (
    <Card className="border-border/40">
      <CardContent className="p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {tr ? 'Varlık Ekle' : 'Add Holding'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="label" className="text-xs text-muted-foreground">
                {tr ? 'Etiket (isteğe bağlı)' : 'Label (optional)'}
              </Label>
              <Input
                id="label"
                placeholder={tr ? 'örn. Coinbase alımı' : 'e.g. Coinbase purchase'}
                value={label}
                onChange={e => setLabel(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="btcAmount" className="text-xs text-muted-foreground">
                {tr ? 'BTC Miktarı' : 'BTC Amount'}
              </Label>
              <Input
                id="btcAmount"
                type="number" inputMode="decimal"
                step="0.00000001"
                min="0"
                placeholder="0.00000000"
                value={btcAmount}
                onChange={e => setBtcAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="purchasePrice" className="text-xs text-muted-foreground">
                {tr ? 'Alım Fiyatı (BTC başına USD)' : 'Purchase Price (USD per BTC)'}
              </Label>
              <Input
                id="purchasePrice"
                type="number" inputMode="decimal"
                step="0.01"
                min="0"
                placeholder={tr ? 'örn. 45000' : 'e.g. 45000'}
                value={purchasePrice}
                onChange={e => setPurchasePrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                {tr ? 'Alım Tarihi (isteğe bağlı)' : 'Purchase Date (optional)'}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full justify-start text-left font-normal', !purchaseDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {purchaseDate ? format(purchaseDate, 'PPP') : (tr ? 'Tarih seç' : 'Pick a date')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={purchaseDate}
                    onSelect={setPurchaseDate}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {tr ? 'Mevcut fiyattan hızlı ekle:' : 'Quick add at current price:'}
            </span>
            {QUICK_AMOUNTS.map(amount => (
              <Button
                key={amount}
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => handleQuickAdd(amount)}
                disabled={!livePrice}
              >
                {amount} BTC
              </Button>
            ))}
          </div>

          <Button type="submit" className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-1" />
            {tr ? 'Portföye Ekle' : 'Add to Portfolio'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
