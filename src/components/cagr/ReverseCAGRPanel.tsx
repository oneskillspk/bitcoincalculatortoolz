import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Calculator, Clock } from 'lucide-react';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { useLanguage } from '@/contexts/LanguageContext';

const fmt = (v: number, dec = 2) => v.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });

export const ReverseCAGRPanel: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { price: liveBtcPrice } = useLiveBitcoinPrice();
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [targetPrice, setTargetPrice] = useState<string>('500000');
  const [years, setYears] = useState<string>('5');

  const effectiveCurrentPrice = parseFloat(currentPrice) || liveBtcPrice;

  const result = useMemo(() => {
    const cp = effectiveCurrentPrice;
    const tp = parseFloat(targetPrice) || 0;
    const y = parseFloat(years) || 0;
    if (cp <= 0 || tp <= 0 || y <= 0) return null;

    const cagr = Math.pow(tp / cp, 1 / y) - 1;
    const monthlyRate = Math.pow(1 + cagr, 1 / 12) - 1;
    const doublingTime = cagr > 0 ? Math.log(2) / Math.log(1 + cagr) : Infinity;

    return { cagr, monthlyRate, doublingTime };
  }, [effectiveCurrentPrice, targetPrice, years]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-morphism-card border-border/20 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              {tr ? 'Ters BYBÜ Girdileri' : 'Reverse CAGR Inputs'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {tr
                ? "Bitcoin'in hedefinize ulaşması için gereken yıllık büyüme oranını bulun."
                : 'Find the annual growth rate Bitcoin needs to reach your target.'}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {tr ? 'Güncel Bitcoin Fiyatı (USD)' : 'Current Bitcoin Price (USD)'}
              </Label>
              <Input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder={liveBtcPrice > 0 ? `${fmt(liveBtcPrice, 0)} (${tr ? 'canlı' : 'live'})` : '85000'}
                className="font-mono text-base"
              />
              {!currentPrice && liveBtcPrice > 0 && (
                <p className="text-xs text-muted-foreground">
                  {tr ? `Canlı fiyat kullanılıyor: $${fmt(liveBtcPrice, 0)}` : `Using live price: $${fmt(liveBtcPrice, 0)}`}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {tr ? 'Hedef Bitcoin Fiyatı (USD)' : 'Target Bitcoin Price (USD)'}
              </Label>
              <Input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="500000"
                className="font-mono text-base"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {[200_000, 500_000, 1_000_000, 2_000_000, 5_000_000].map((v) => (
                  <button
                    key={v}
                    onClick={() => setTargetPrice(v.toString())}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      targetPrice === v.toString()
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/50 text-muted-foreground border-border/50 hover:border-primary/50'
                    }`}
                  >
                    ${v >= 1_000_000 ? `${v / 1_000_000}M` : `${v / 1_000}K`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {tr ? 'Zaman Ufku (Yıl)' : 'Time Horizon (Years)'}
              </Label>
              <Input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="5"
                className="font-mono text-base"
                min="1"
                max="30"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {[2, 3, 5, 10, 15].map((v) => (
                  <button
                    key={v}
                    onClick={() => setYears(v.toString())}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      years === v.toString()
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/50 text-muted-foreground border-border/50 hover:border-primary/50'
                    }`}
                  >
                    {v}{tr ? 'y' : 'y'}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {result ? (
            <>
              <Card className="glass-morphism-card border-primary/20 shadow-sm bg-primary/5">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {tr ? 'Gerekli Yıllık Büyüme Oranı' : 'Required Annual Growth Rate'}
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-foreground font-mono">
                    {(result.cagr * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tr ? 'yıllık (BYBÜ)' : 'per year (CAGR)'}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="glass-morphism-card border-border/20 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <p className="text-xs text-muted-foreground">
                        {tr ? 'Aylık Büyüme Oranı' : 'Monthly Growth Rate'}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-foreground font-mono">
                      {(result.monthlyRate * 100).toFixed(2)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tr ? 'aylık' : 'per month'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-morphism-card border-border/20 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-primary" />
                      <p className="text-xs text-muted-foreground">
                        {tr ? 'İkiye Katlanma Süresi' : 'Doubling Time'}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-foreground font-mono">
                      {result.doublingTime === Infinity ? '∞' : `${result.doublingTime.toFixed(1)}y`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tr ? "Bitcoin her bu sürede ikiye katlanıyor" : 'Bitcoin doubles every'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {tr
                      ? `Karşılaştırma olarak, Bitcoin'in 2013'ten bu yana tarihsel BYBÜ'sü yılda yaklaşık %60'tır. ${result.cagr > 0.6 ? 'Gerekli büyüme oranı, Bitcoin\'in tarihsel ortalamasını aşıyor.' : 'Gerekli büyüme oranı, Bitcoin\'in tarihsel aralığı içindedir.'}`
                      : `For comparison, Bitcoin's historical CAGR since 2013 is approximately `}
                    {!tr && <span className="font-semibold text-foreground">60% per year</span>}
                    {!tr && (result.cagr > 0.6
                      ? " The required growth rate exceeds Bitcoin's historical average."
                      : " The required growth rate is within Bitcoin's historical range.")}
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="glass-morphism-card border-border/20 shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {tr ? 'Ters BYBÜ Hesaplayıcı' : 'Reverse CAGR Calculator'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {tr
                    ? 'Gerekli büyüme oranını görmek için bir hedef fiyat ve süre girin'
                    : 'Enter a target price and timeframe to see the required growth rate'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
