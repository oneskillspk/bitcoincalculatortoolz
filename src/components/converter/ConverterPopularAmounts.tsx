import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ConverterPopularAmountsProps {
  btcPrice: number;
  selectedCurrency: string;
  currencySymbol: string;
}

const FIAT_AMOUNTS = [1, 5, 10, 50, 100, 500, 1_000, 10_000, 100_000];
const BTC_AMOUNTS = [0.001, 0.01, 0.1, 0.25, 0.5, 1];
const SATS_PER_BTC = 100_000_000;

const formatFiat = (v: number, sym: string): string => {
  if (v <= 0) return '—';
  if (v < 0.01) return `${sym}${v.toFixed(8).replace(/0+$/, '').replace(/\.$/, '')}`;
  if (v < 1) return `${sym}${v.toFixed(4)}`;
  return `${sym}${v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const formatBtc = (v: number): string => {
  if (v >= 1) return v.toFixed(4);
  return v.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
};

const formatSats = (v: number): string => Math.round(v).toLocaleString('en-US');

export const ConverterPopularAmounts: React.FC<ConverterPopularAmountsProps> = ({ btcPrice, selectedCurrency, currencySymbol }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <Card className="bg-card border border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          {tr ? 'Popüler Miktarlar' : 'Popular Amounts'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {tr
            ? `İnsanların en çok aradığı dönüşümler, ${selectedCurrency} cinsinden canlı güncellenmektedir.`
            : `The exact conversions people search for most, refreshed live in ${selectedCurrency}.`}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fiat to BTC/Sats */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            {selectedCurrency} → BTC {tr ? 've' : 'and'} Sats
          </h3>
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{selectedCurrency} {tr ? 'miktarı' : 'amount'}</TableHead>
                  <TableHead className="text-right">BTC</TableHead>
                  <TableHead className="text-right">Sats</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {FIAT_AMOUNTS.map((amt) => {
                  const btc = btcPrice > 0 ? amt / btcPrice : 0;
                  const sats = btc * SATS_PER_BTC;
                  return (
                    <TableRow key={amt}>
                      <TableCell className="font-medium">{formatFiat(amt, currencySymbol)}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">
                        {btcPrice > 0 ? formatBtc(btc) : '—'}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-foreground">
                        {btcPrice > 0 ? formatSats(sats) : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="sm:hidden grid grid-cols-2 gap-2.5">
            {FIAT_AMOUNTS.map((amt) => {
              const btc = btcPrice > 0 ? amt / btcPrice : 0;
              const sats = btc * SATS_PER_BTC;
              return (
                <div key={amt} className="p-3 rounded-lg bg-muted/20 border border-border/30">
                  <div className="text-xs text-foreground font-semibold">{formatFiat(amt, currencySymbol)}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{btcPrice > 0 ? `${formatBtc(btc)} BTC` : '—'}</div>
                  <div className="text-xs text-primary font-mono mt-0.5">{btcPrice > 0 ? `${formatSats(sats)} sats` : '—'}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BTC to Fiat */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            BTC → {selectedCurrency}
          </h3>
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BTC {tr ? 'miktarı' : 'amount'}</TableHead>
                  <TableHead className="text-right">Sats</TableHead>
                  <TableHead className="text-right">{selectedCurrency} {tr ? 'değeri' : 'value'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BTC_AMOUNTS.map((amt) => {
                  const sats = amt * SATS_PER_BTC;
                  const fiat = amt * btcPrice;
                  return (
                    <TableRow key={amt}>
                      <TableCell className="font-medium font-mono">{formatBtc(amt)}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">{formatSats(sats)}</TableCell>
                      <TableCell className="text-right font-mono text-sm font-medium text-foreground">
                        {btcPrice > 0 ? formatFiat(fiat, currencySymbol) : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="sm:hidden grid grid-cols-2 gap-2.5">
            {BTC_AMOUNTS.map((amt) => {
              const fiat = amt * btcPrice;
              return (
                <div key={amt} className="p-3 rounded-lg bg-muted/20 border border-border/30">
                  <div className="text-xs text-foreground font-semibold font-mono">{formatBtc(amt)} BTC</div>
                  <div className="text-xs text-primary font-mono mt-0.5">{btcPrice > 0 ? formatFiat(fiat, currencySymbol) : '—'}</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
