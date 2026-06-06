import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Zap } from 'lucide-react';
import { QUICK_REFERENCE_AMOUNTS, toBtc, btcToFiat } from '@/services/bitcoinConverterService';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrencyAmount } from '@/utils/formatCurrency';

interface QuickReferenceTableProps {
  btcPrice: number;
  selectedCurrency: string;
}

export const QuickReferenceTable: React.FC<QuickReferenceTableProps> = ({
  btcPrice,
  selectedCurrency,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : (selectedCurrency === 'TRY' ? 'tr-TR' : 'en-US');

  const formatFiat = (value: number): string => {
    if (value < 1) {
      return formatCurrencyAmount(value, selectedCurrency, { locale, decimals: value < 0.01 ? 6 : 4 });
    }
    return formatCurrencyAmount(value, selectedCurrency, { locale, decimals: 2 });
  };

  return (
    <Card className="bg-card border border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          {tr ? 'Hızlı Başvuru' : 'Quick Reference'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {tr
            ? `Canlı ${selectedCurrency} değerleriyle yaygın satoshi miktarları`
            : `Common satoshi amounts with live ${selectedCurrency} values`}
        </p>
      </CardHeader>

      <CardContent>
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tr ? 'Miktar' : 'Amount'}</TableHead>
                <TableHead className="text-right">BTC</TableHead>
                <TableHead className="text-right">{selectedCurrency} {tr ? 'Değeri' : 'Value'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {QUICK_REFERENCE_AMOUNTS.map(({ sats, label }) => {
                const btcValue = toBtc(sats, 'sats');
                const fiatValue = btcToFiat(btcValue, btcPrice);
                return (
                  <TableRow key={sats}>
                    <TableCell className="font-medium">{label}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                      {btcValue.toFixed(8)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-foreground">
                      {btcPrice > 0 ? formatFiat(fiatValue) : '—'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="sm:hidden grid grid-cols-2 gap-3">
          {QUICK_REFERENCE_AMOUNTS.map(({ sats, label }) => {
            const btcValue = toBtc(sats, 'sats');
            const fiatValue = btcToFiat(btcValue, btcPrice);
            return (
              <div
                key={sats}
                className="p-3 bg-muted/20 rounded-lg border border-border/20"
              >
                <span className="text-sm font-medium text-foreground block">{label}</span>
                <span className="text-sm font-mono text-primary font-semibold block mt-1">
                  {btcPrice > 0 ? formatFiat(fiatValue) : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
