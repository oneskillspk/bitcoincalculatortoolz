import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DCAPurchase } from '@/services/dcaCalculator';
import { format } from 'date-fns';
import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrencyAmount } from '@/utils/formatCurrency';

interface DCAPurchasesTableProps {
  purchases: DCAPurchase[];
  currency: string;
}

export const DCAPurchasesTable: React.FC<DCAPurchasesTableProps> = ({ purchases, currency }) => {
  const { language } = useLanguage();
  const locale = language === 'tr' ? 'tr-TR' : (currency === 'TRY' ? 'tr-TR' : 'en-US');
  const fmt = (v: number) => formatCurrencyAmount(v, currency, { locale });
  const fmtSigned = (v: number) => formatCurrencyAmount(v, currency, { locale, signed: true });
  const [showAll, setShowAll] = React.useState(false);
  const displayedPurchases = showAll ? purchases : purchases.slice(0, 10);

  const exportToCsv = () => {
    const headers = language==='tr'
      ? ['Tarih', 'Yatırılan Tutar', 'Bitcoin Fiyatı', 'Satın Alınan Bitcoin', 'Toplam BTC', 'Toplam Yatırım', 'Güncel Değer', 'Gerçekleşmemiş K/Z']
      : ['Date', 'Amount Invested', 'Bitcoin Price', 'Bitcoin Purchased', 'Total BTC', 'Total Invested', 'Current Value', 'Unrealized P&L'];
    const csvContent = [
      headers.join(','),
      ...purchases.map(purchase => [
        purchase.date,
        purchase.amount.toFixed(2),
        purchase.bitcoinPrice.toFixed(2),
        purchase.bitcoinAmount.toFixed(8),
        purchase.totalBitcoin.toFixed(8),
        purchase.totalInvested.toFixed(2),
        purchase.currentValue.toFixed(2),
        purchase.unrealizedPL.toFixed(2)
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bitcoin-dca-purchases-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {language==='tr'?'Alım Geçmişi':'Purchase History'}
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <Badge variant="outline" className="text-xs">
              {purchases.length} {language==='tr'?'Alım':'Purchases'}
            </Badge>
            <Button variant="outline" size="sm" onClick={exportToCsv} className="text-xs w-full sm:w-auto">
              <Download className="h-3 w-3 mr-1" />
              {language==='tr'?'CSV İndir':'Export CSV'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold text-foreground/80 min-w-[100px]">{language==='tr'?'Tarih':'Date'}</TableHead>
                  <TableHead className="font-semibold text-foreground/80 min-w-[80px]">{language==='tr'?'Tutar':'Amount'}</TableHead>
                  <TableHead className="font-semibold text-foreground/80 min-w-[90px]">{language==='tr'?'BTC Fiyatı':'BTC Price'}</TableHead>
                  <TableHead className="font-semibold text-foreground/80 min-w-[100px]">{language==='tr'?'Alınan BTC':'BTC Bought'}</TableHead>
                  <TableHead className="font-semibold text-foreground/80 min-w-[100px]">{language==='tr'?'Toplam BTC':'Total BTC'}</TableHead>
                  <TableHead className="font-semibold text-foreground/80 min-w-[100px]">{language==='tr'?'Güncel Değer':'Current Value'}</TableHead>
                  <TableHead className="font-semibold text-foreground/80 min-w-[100px]">{language==='tr'?'K/Z':'P&L'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPurchases.map((purchase, index) => (
                  <TableRow key={`${purchase.date}-${index}`} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{format(new Date(purchase.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{fmt(purchase.amount)}</TableCell>
                    <TableCell>{fmt(purchase.bitcoinPrice)}</TableCell>
                    <TableCell className="font-mono text-sm">{purchase.bitcoinAmount.toFixed(8)}</TableCell>
                    <TableCell className="font-mono text-sm font-medium">{purchase.totalBitcoin.toFixed(8)}</TableCell>
                    <TableCell>{fmt(purchase.currentValue)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {purchase.unrealizedPL >= 0
                          ? <TrendingUp className="h-3 w-3 text-success" />
                          : <TrendingDown className="h-3 w-3 text-destructive" />}
                        <span className={`font-medium ${purchase.unrealizedPL >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {fmtSigned(purchase.unrealizedPL)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {purchases.length > 10 && (
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => setShowAll(!showAll)} className="text-sm">
              {showAll
                ? (language==='tr'?'Daha Az Göster':'Show Less')
                : (language==='tr'?`Tüm ${purchases.length} Alımı Göster`:`Show All ${purchases.length} Purchases`)}
            </Button>
          </div>
        )}

        {purchases.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{language==='tr'?'Görüntülenecek alım yok':'No purchases to display'}</p>
            <p className="text-sm">{language==='tr'?'Alım geçmişinizi görmek için DCA hesaplaması yapın':'Complete a DCA calculation to see your purchase history'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
