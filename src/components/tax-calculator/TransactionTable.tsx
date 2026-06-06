import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, FileSpreadsheet } from 'lucide-react';
import { TaxTransaction, EnhancedTaxCalculation } from '@/services/enhancedTaxCalculator';
import { EnhancedTaxCalculatorService } from '@/services/enhancedTaxCalculator';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface TransactionTableProps {
  transactions: TaxTransaction[];
  taxResults: EnhancedTaxCalculation | null;
  onTransactionsUpdate: (transactions: TaxTransaction[]) => void;
}

export const TransactionTable = ({
  transactions,
  taxResults,
  onTransactionsUpdate
}: TransactionTableProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const removeTransaction = (id: string) => {
    onTransactionsUpdate(transactions.filter(t => t.id !== id));
  };

  const getTransactionTaxInfo = (transactionId: string) => {
    if (!taxResults) return null;
    return taxResults.taxableEvents.find(e => e.transactionId === transactionId);
  };

  if (transactions.length === 0) {
    return (
      <Card className="glass-morphism-card border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            {tr ? 'İşlem Geçmişi' : 'Transaction History'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{tr ? 'Henüz işlem eklenmedi' : 'No transactions added yet'}</p>
            <p className="text-sm">
              {tr ? 'Başlamak için giriş panelini kullanarak işlem ekleyin' : 'Add transactions using the input panel to get started'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism-card border-border/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <FileSpreadsheet className="w-5 h-5 text-primary" />
          {tr ? `İşlem Geçmişi (${transactions.length} işlem)` : `Transaction History (${transactions.length} transactions)`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tr ? 'Tarih' : 'Date'}</TableHead>
                <TableHead>{tr ? 'Tür' : 'Type'}</TableHead>
                <TableHead>{tr ? 'Miktar (BTC)' : 'Amount (BTC)'}</TableHead>
                <TableHead>{tr ? 'Fiyat' : 'Price'}</TableHead>
                <TableHead>{tr ? 'Toplam Değer' : 'Total Value'}</TableHead>
                <TableHead>{tr ? 'Vergi Etkisi' : 'Tax Impact'}</TableHead>
                <TableHead>{tr ? 'İşlemler' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const taxInfo = getTransactionTaxInfo(transaction.id);
                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        transaction.type === 'buy' ? 'default' :
                        transaction.type === 'sell' ? 'destructive' :
                        transaction.type === 'mining' ? 'secondary' : 'outline'
                      }>
                        {transaction.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {transaction.amount.toFixed(8)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {EnhancedTaxCalculatorService.formatCurrency(transaction.price)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {EnhancedTaxCalculatorService.formatCurrency(transaction.fiatAmount)}
                    </TableCell>
                    <TableCell>
                      {taxInfo ? (
                        <div className="space-y-1">
                          <div className={`text-sm font-medium ${taxInfo.gainLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {taxInfo.gainLoss >= 0 ? '+' : ''}
                            {EnhancedTaxCalculatorService.formatCurrency(taxInfo.gainLoss)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {taxInfo.isLongTerm ? (tr ? 'Uzun vadeli' : 'Long-term') : (tr ? 'Kısa vadeli' : 'Short-term')}
                          </div>
                          <div className="text-xs font-medium">
                            {tr ? 'Vergi:' : 'Tax:'} {EnhancedTaxCalculatorService.formatCurrency(taxInfo.taxOwed)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {transaction.type === 'buy'
                            ? (tr ? 'Maliyet esası' : 'Cost basis')
                            : (tr ? 'Hesaplama gerekli' : 'Calculate needed')}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTransaction(transaction.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {taxResults && (
          <div className="mt-6 p-4 bg-background/50 rounded-lg border border-border/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">{tr ? 'Toplam Kazanç' : 'Total Gains'}</span>
                <div className="font-medium text-success">
                  {EnhancedTaxCalculatorService.formatCurrency(taxResults.federalTax.totalGains)}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">{tr ? 'Toplam Kayıp' : 'Total Losses'}</span>
                <div className="font-medium text-destructive">
                  {EnhancedTaxCalculatorService.formatCurrency(taxResults.federalTax.totalLosses)}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">{tr ? 'Net Kazanç' : 'Net Gains'}</span>
                <div className={`font-medium ${taxResults.federalTax.netCapitalGains >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {EnhancedTaxCalculatorService.formatCurrency(taxResults.federalTax.netCapitalGains)}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">{tr ? 'Ödenecek Vergi' : 'Tax Owed'}</span>
                <div className="font-medium text-foreground">
                  {EnhancedTaxCalculatorService.formatCurrency(taxResults.totalTaxLiability)}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
