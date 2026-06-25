import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Pencil, Check, X, ArrowUpDown } from 'lucide-react';
import { Holding } from './usePortfolioStorage';
import { formatDistanceToNow } from 'date-fns';
import { tr as trLocale } from 'date-fns/locale';
import { ScrollableTable } from '@/components/ui/ScrollableTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrencyAmount } from '@/utils/formatCurrency';

interface HoldingsTableProps {
  holdings: Holding[];
  livePrice: number | null;
  onUpdate: (id: string, updates: Partial<Omit<Holding, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
  currencySymbol?: string;
  currency?: string;
  exchangeRate?: number;
}

type SortKey = 'btcAmount' | 'purchasePrice' | 'currentValue' | 'pl' | 'plPercent';

export const HoldingsTable = ({ holdings, livePrice, onUpdate, onDelete, currencySymbol = '$', currency = 'USD', exchangeRate = 1 }: HoldingsTableProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const locale = isTr ? 'tr-TR' : (currency === 'TRY' ? 'tr-TR' : 'en-US');
  const fmt = (val: number) => formatCurrencyAmount(val * exchangeRate, currency, { locale, decimals: 2 });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const startEdit = (h: Holding) => {
    setEditId(h.id);
    setEditLabel(h.label);
    setEditAmount(h.btcAmount.toString());
    setEditPrice(h.purchasePrice.toString());
  };

  const saveEdit = () => {
    if (!editId) return;
    onUpdate(editId, {
      label: editLabel,
      btcAmount: parseFloat(editAmount) || 0,
      purchasePrice: parseFloat(editPrice) || 0,
    });
    setEditId(null);
  };

  const getMetrics = (h: Holding) => {
    const currentValue = livePrice ? h.btcAmount * livePrice : 0;
    const costBasis = h.btcAmount * h.purchasePrice;
    const pl = currentValue - costBasis;
    const plPercent = costBasis > 0 ? (pl / costBasis) * 100 : 0;
    return { currentValue, costBasis, pl, plPercent };
  };

  const sorted = [...holdings].sort((a, b) => {
    if (!sortKey) return 0;
    const am = getMetrics(a);
    const bm = getMetrics(b);
    const map: Record<SortKey, [number, number]> = {
      btcAmount: [a.btcAmount, b.btcAmount],
      purchasePrice: [a.purchasePrice, b.purchasePrice],
      currentValue: [am.currentValue, bm.currentValue],
      pl: [am.pl, bm.pl],
      plPercent: [am.plPercent, bm.plPercent],
    };
    const [va, vb] = map[sortKey];
    return sortAsc ? va - vb : vb - va;
  });

  const totals = holdings.reduce((acc, h) => {
    const m = getMetrics(h);
    return {
      btc: acc.btc + h.btcAmount,
      currentValue: acc.currentValue + m.currentValue,
      costBasis: acc.costBasis + m.costBasis,
      pl: acc.pl + m.pl,
    };
  }, { btc: 0, currentValue: 0, costBasis: 0, pl: 0 });

  const totalPlPercent = totals.costBasis > 0 ? (totals.pl / totals.costBasis) * 100 : 0;

  if (holdings.length === 0) {
    return (
      <Card className="border-border/40 border-dashed">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            {isTr
              ? 'Başlamak için ilk Bitcoin alımınızı ekleyin. Hesap gerekmez.'
              : 'Add your first Bitcoin purchase to get started. No account needed.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const SortBtn = ({ k, children }: { k: SortKey; children: React.ReactNode }) => (
    <button onClick={() => handleSort(k)} className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
      {children} <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  return (
    <Card className="border-border/40">
      <CardContent className="p-0">
        <ScrollableTable ariaLabel={isTr ? 'Portföy varlıkları tablosu' : 'Portfolio holdings table'}>
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">{isTr ? 'Etiket' : 'Label'}</th>
                <th className="text-right p-3"><SortBtn k="btcAmount">BTC</SortBtn></th>
                <th className="text-right p-3"><SortBtn k="purchasePrice">{isTr ? 'Alış Fiyatı' : 'Buy Price'}</SortBtn></th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">{isTr ? 'Tarih' : 'Date'}</th>
                <th className="text-right p-3"><SortBtn k="currentValue">{isTr ? 'Değer' : 'Value'}</SortBtn></th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">{isTr ? 'Maliyet' : 'Cost Basis'}</th>
                <th className="text-right p-3"><SortBtn k="pl">{isTr ? 'K&Z' : 'P&L'}</SortBtn></th>
                <th className="text-right p-3"><SortBtn k="plPercent">{isTr ? 'K&Z (%)' : 'P&L (%)'}</SortBtn></th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">{isTr ? 'İşlem' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(h => {
                const m = getMetrics(h);
                const isEditing = editId === h.id;
                return (
                  <tr key={h.id} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="p-3">
                      {isEditing
                        ? <Input value={editLabel} onChange={e => setEditLabel(e.target.value)} className="h-7 text-xs w-32" />
                        : <span className="text-foreground">{h.label}</span>}
                    </td>
                    <td className="p-3 text-right font-mono">
                      {isEditing
                        ? <Input value={editAmount} onChange={e => setEditAmount(e.target.value)} type="number" inputMode="decimal" step="0.00000001" className="h-7 text-xs w-28" />
                        : h.btcAmount.toFixed(8)}
                    </td>
                    <td className="p-3 text-right font-mono">
                      {isEditing
                        ? <Input value={editPrice} onChange={e => setEditPrice(e.target.value)} type="number" inputMode="decimal" className="h-7 text-xs w-24" />
                        : fmt(h.purchasePrice)}
                    </td>
                    <td className="p-3 text-right text-xs text-muted-foreground">
                      {h.purchaseDate
                        ? formatDistanceToNow(new Date(h.purchaseDate), { addSuffix: true, locale: isTr ? trLocale : undefined })
                        : '—'}
                    </td>
                    <td className="p-3 text-right font-mono">{fmt(m.currentValue)}</td>
                    <td className="p-3 text-right font-mono text-muted-foreground">{fmt(m.costBasis)}</td>
                    <td className={`p-3 text-right font-mono font-medium ${m.pl >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {m.pl >= 0 ? '+' : ''}{fmt(m.pl)}
                    </td>
                    <td className={`p-3 text-right font-mono font-medium ${m.plPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {m.plPercent >= 0 ? '+' : ''}{m.plPercent.toFixed(1)}%
                    </td>
                    <td className="p-3 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={saveEdit}><Check className="w-3 h-3" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditId(null)}><X className="w-3 h-3" /></Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(h)} aria-label={isTr ? 'Varlığı düzenle' : 'Edit holding'}>
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" aria-label={isTr ? 'Varlığı sil' : 'Delete holding'}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{isTr ? 'Varlık silinsin mi?' : 'Delete holding?'}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {isTr
                                    ? `"${h.label}" (${h.btcAmount} BTC) portföyünüzden kaldırılacak.`
                                    : `This will remove "${h.label}" (${h.btcAmount} BTC) from your portfolio.`}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{isTr ? 'Vazgeç' : 'Cancel'}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(h.id)}>{isTr ? 'Sil' : 'Delete'}</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border/60 font-semibold">
                <td className="p-3 text-foreground">{isTr ? 'Toplam' : 'Total'}</td>
                <td className="p-3 text-right font-mono">{totals.btc.toFixed(8)}</td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3 text-right font-mono">{fmt(totals.currentValue)}</td>
                <td className="p-3 text-right font-mono text-muted-foreground">{fmt(totals.costBasis)}</td>
                <td className={`p-3 text-right font-mono ${totals.pl >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {totals.pl >= 0 ? '+' : ''}{fmt(totals.pl)}
                </td>
                <td className={`p-3 text-right font-mono ${totalPlPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {totalPlPercent >= 0 ? '+' : ''}{totalPlPercent.toFixed(1)}%
                </td>
                <td className="p-3"></td>
              </tr>
            </tfoot>
          </table>
        </ScrollableTable>
      </CardContent>
    </Card>
  );
};
