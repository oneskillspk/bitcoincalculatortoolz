import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { PurchaseEntry, createPurchaseEntry } from '@/services/averageBuyPriceCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoney } from '@/utils/formatMoney';
import { InputPanel } from '@/components/calculator';

interface Props {
  purchases: PurchaseEntry[];
  setPurchases: React.Dispatch<React.SetStateAction<PurchaseEntry[]>>;
  liveBtcPrice: number;
}

export const AvgBuyInputPanel = ({ purchases, setPurchases, liveBtcPrice }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const fmt = (n: number, d = 0) => formatMoney(n, { tr, fxRate, decimals: d });

  const updatePurchase = (id: string, field: keyof PurchaseEntry, value: number) => {
    setPurchases(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addRow = () => {
    if (purchases.length >= 20) return;
    setPurchases(prev => [...prev, createPurchaseEntry()]);
  };

  const removeRow = (id: string) => {
    if (purchases.length <= 1) return;
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  return (
    <InputPanel
      title={tr ? 'Bitcoin Alımlarınız' : 'Your Bitcoin Purchases'}
      description={
        <>
          {tr ? 'Canlı BTC:' : 'Live BTC:'}{' '}
          <span className="font-mono font-semibold text-foreground">{fmt(liveBtcPrice, 0)}</span>
        </>
      }
    >
      <div className="space-y-3">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs text-muted-foreground font-medium px-1">
          <span>{tr ? 'BTC Miktarı' : 'BTC Amount'}</span>
          <span>{tr ? 'BTC Başına Fiyat (₺)' : 'Price Per BTC ($)'}</span>
          <span className="w-8" />
        </div>

        {purchases.map((p) => {
          const subtotal = p.btcAmount * p.pricePerBtc;
          return (
            <div key={p.id} className="space-y-1">
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                <Input
                  type="number"
                  min={0}
                  step="0.001"
                  placeholder="0.05"
                  value={p.btcAmount || ''}
                  onChange={e => updatePurchase(p.id, 'btcAmount', parseFloat(e.target.value) || 0)}
                  className="font-mono text-sm"
                />
                <Input
                  type="number"
                  min={0}
                  step="100"
                  placeholder="30000"
                  value={p.pricePerBtc || ''}
                  onChange={e => updatePurchase(p.id, 'pricePerBtc', parseFloat(e.target.value) || 0)}
                  className="font-mono text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(p.id)}
                  disabled={purchases.length <= 1}
                  className="w-8 h-8 text-muted-foreground hover:text-destructive"
                  aria-label={tr ? 'Alımı kaldır' : 'Remove purchase'}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {subtotal > 0 && (
                <p className="text-xs text-muted-foreground pl-1">
                  {tr ? 'Harcanan:' : 'Spent:'} <span className="font-mono">{fmt(subtotal, 2)}</span>
                </p>
              )}
            </div>
          );
        })}

        <Button
          onClick={addRow}
          variant="outline"
          size="sm"
          disabled={purchases.length >= 20}
          className="w-full gap-2"
        >
          <Plus className="w-4 h-4" />
          {tr ? `Alım Ekle (${purchases.length}/20)` : `Add Purchase (${purchases.length}/20)`}
        </Button>
      </div>
    </InputPanel>
  );
};
