import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Coins, ArrowRightLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SatoshiQuickTabProps {
  btcPrice: number;
  selectedCurrency: string;
  currencySymbol: string;
}

const SATS_PER_BTC = 100_000_000;

export const SatoshiQuickTab: React.FC<SatoshiQuickTabProps> = ({
  btcPrice,
  selectedCurrency,
  currencySymbol,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [satsInput, setSatsInput] = useState<string>('100000');
  const [fiatInput, setFiatInput] = useState<string>('100');

  const fromSats = useMemo(() => {
    const sats = parseFloat(satsInput) || 0;
    const btc = sats / SATS_PER_BTC;
    const fiat = btc * btcPrice;
    return { btc, fiat };
  }, [satsInput, btcPrice]);

  const fromFiat = useMemo(() => {
    const fiat = parseFloat(fiatInput) || 0;
    if (btcPrice <= 0) return { btc: 0, sats: 0 };
    const btc = fiat / btcPrice;
    const sats = btc * SATS_PER_BTC;
    return { btc, sats };
  }, [fiatInput, btcPrice]);

  const formatFiat = (v: number): string => {
    if (v === 0) return `${currencySymbol}0.00`;
    if (v < 0.01) return `${currencySymbol}${v.toFixed(8).replace(/0+$/, '').replace(/\.$/, '')}`;
    if (v < 1) return `${currencySymbol}${v.toFixed(4)}`;
    return `${currencySymbol}${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatSats = (v: number): string =>
    Math.round(v).toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <Card className="bg-card border border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
          <Coins className="w-5 h-5 text-primary" />
          {tr ? 'Satoshi Hızlı Dönüştürücü' : 'Satoshi Quick Convert'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {tr
            ? `Sat biriktiriyor musunuz? Herhangi bir satoshi miktarının ${selectedCurrency} değerini tek dokunuşta öğrenin.`
            : `Stack sats? Get the ${selectedCurrency} value of any satoshi amount in one tap.`}
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sats-to-fiat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sats-to-fiat">Sats → {selectedCurrency}</TabsTrigger>
            <TabsTrigger value="fiat-to-sats">{selectedCurrency} → Sats</TabsTrigger>
          </TabsList>

          <TabsContent value="sats-to-fiat" className="space-y-4 mt-5">
            <div>
              <Label htmlFor="sats-input" className="text-sm text-muted-foreground mb-1.5 block">
                Satoshis
              </Label>
              <Input
                id="sats-input"
                type="text"
                inputMode="numeric"
                value={satsInput}
                onChange={(e) => setSatsInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="100000"
                className="font-mono text-base h-12"
              />
            </div>
            <div className="flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4 text-muted-foreground rotate-90" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="text-xs text-muted-foreground mb-1">BTC</div>
                <div className="font-mono text-sm font-semibold text-foreground break-all">
                  {fromSats.btc.toFixed(8)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-xs text-muted-foreground mb-1">{selectedCurrency}</div>
                <div className="font-mono text-sm font-semibold text-primary break-all">
                  {btcPrice > 0 ? formatFiat(fromSats.fiat) : '—'}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fiat-to-sats" className="space-y-4 mt-5">
            <div>
              <Label htmlFor="fiat-input" className="text-sm text-muted-foreground mb-1.5 block">
                {tr ? `${selectedCurrency} tutarı` : `${selectedCurrency} amount`}
              </Label>
              <Input
                id="fiat-input"
                type="text"
                inputMode="decimal"
                value={fiatInput}
                onChange={(e) => setFiatInput(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="100"
                className="font-mono text-base h-12"
              />
            </div>
            <div className="flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4 text-muted-foreground rotate-90" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-xs text-muted-foreground mb-1">Sats</div>
                <div className="font-mono text-sm font-semibold text-primary break-all">
                  {btcPrice > 0 ? formatSats(fromFiat.sats) : '—'}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="text-xs text-muted-foreground mb-1">BTC</div>
                <div className="font-mono text-sm font-semibold text-foreground break-all">
                  {fromFiat.btc.toFixed(8)}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
