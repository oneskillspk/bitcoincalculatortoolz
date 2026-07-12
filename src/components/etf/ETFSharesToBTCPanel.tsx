import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bitcoin, Building2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatGroupedDecimal } from '@/utils/numberFormat';

const ETF_DATA = [
  { id: 'IBIT', name: 'BlackRock iShares (IBIT)', btcPerShare: 0.00095, defaultPrice: 58 },
  { id: 'FBTC', name: 'Fidelity Wise Origin (FBTC)', btcPerShare: 0.00090, defaultPrice: 82 },
  { id: 'ARKB', name: 'ARK 21Shares (ARKB)', btcPerShare: 0.00095, defaultPrice: 90 },
  { id: 'BITB', name: 'Bitwise (BITB)', btcPerShare: 0.00092, defaultPrice: 52 },
];

const MSTR_BTC_PER_SHARE = 0.0025;

const fmt = (v: number, dec = 2, locale = 'en-US') => formatGroupedDecimal(v, dec, locale);

interface ETFSharesToBTCPanelProps {
  currentBtcPrice: number;
}

export const ETFSharesToBTCPanel: React.FC<ETFSharesToBTCPanelProps> = ({ currentBtcPrice }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [selectedETF, setSelectedETF] = useState('IBIT');
  const [shares, setShares] = useState(100);
  const [sharePrice, setSharePrice] = useState<string>('');
  const [mstrShares, setMstrShares] = useState(100);

  const etf = ETF_DATA.find(e => e.id === selectedETF) || ETF_DATA[0];
  const effectiveSharePrice = parseFloat(sharePrice) || etf.defaultPrice;

  const result = useMemo(() => {
    const btcEquivalent = shares * etf.btcPerShare;
    const usdValue = btcEquivalent * currentBtcPrice;
    const fractionOfWhole = btcEquivalent;
    return { btcEquivalent, usdValue, fractionOfWhole };
  }, [shares, etf, currentBtcPrice]);

  const mstrResult = useMemo(() => {
    const btcExposure = mstrShares * MSTR_BTC_PER_SHARE;
    const btcValue = btcExposure * currentBtcPrice;
    return { btcExposure, btcValue };
  }, [mstrShares, currentBtcPrice]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ETF Inputs */}
        <Card className="glass-morphism-card border-border/20 shadow-sm" data-currency-exempt="true">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Bitcoin className="w-5 h-5 text-primary" />
              {tr ? 'ETF Hisseleri → BTC Dönüştürücü' : 'ETF Shares → BTC Converter'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {tr
                ? 'ETF hisselerinizi yaklaşık BTC eşdeğerine dönüştürün.'
                : 'Convert your ETF shares into approximate BTC equivalent.'}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">{tr ? 'ETF Seçin' : 'Select ETF'}</Label>
              <Select value={selectedETF} onValueChange={setSelectedETF}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ETF_DATA.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.id} — {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">{tr ? 'Hisse Sayısı' : 'Number of Shares'}</Label>
              <Input
                type="number" inputMode="decimal"
                value={shares || ''}
                onChange={(e) => setShares(parseFloat(e.target.value) || 0)}
                placeholder="100"
                className="font-mono text-base"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {tr ? 'Hisse Fiyatı (USD, isteğe bağlı)' : 'Share Price (USD, optional)'}
              </Label>
              <Input
                type="number" inputMode="decimal"
                value={sharePrice}
                onChange={(e) => setSharePrice(e.target.value)}
                placeholder={`$${etf.defaultPrice} (${tr ? 'yaklaşık' : 'approx'})`}
                className="font-mono text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <Card className="glass-morphism-card border-primary/20 shadow-sm bg-primary/5" data-currency-exempt="true">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                {tr
                  ? `${shares} adet ${selectedETF} hisseniz yaklaşık olarak şuna eşdeğer:`
                  : `Your ${shares} ${selectedETF} shares represent approximately`}
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-foreground font-mono">
                {result.btcEquivalent.toFixed(5)} BTC
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {tr ? 'Güncel USD değeri:' : 'Current USD value:'}{' '}
                <span className="font-semibold text-foreground">${fmt(result.usdValue, 0)}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {tr ? 'Tam Bitcoin\'in' : 'Equivalent to owning'}{' '}
                <span className="font-semibold text-foreground">{(result.fractionOfWhole * 100).toFixed(3)}%</span>
                {tr ? "'ine sahip olmakla eşdeğer" : ' of a whole Bitcoin'}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-morphism-card border-border/20 shadow-sm" data-currency-exempt="true">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">
                {tr ? 'Hisse başına BTC oranı:' : 'BTC per share ratio:'}{' '}
                <span className="font-mono font-semibold">{etf.btcPerShare}</span>{' '}
                ({tr ? 'yaklaşık, Mart 2026' : 'approximate, March 2026'})
              </p>
            </CardContent>
          </Card>

          <div className="p-3 rounded-lg bg-warning/$3 border border-warning/10">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                {tr
                  ? 'Hisse başına BTC oranı yaklaşıktır ve yönetim ücretleri nedeniyle zamanla hafifçe azalır. Kesin oranı brokerınızın izahnamesinde doğrulayın.'
                  : "BTC per share ratio is approximate and decreases slightly over time due to management fees. Verify the exact ratio in your broker's prospectus."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MSTR Section */}
      <Card className="glass-morphism-card border-border/20 shadow-sm" data-currency-exempt="true">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {tr ? 'MicroStrategy (MSTR) Bitcoin Maruziyeti' : 'MicroStrategy (MSTR) Bitcoin Exposure'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">{tr ? 'MSTR Hisse Sayısı' : 'MSTR Shares'}</Label>
              <Input
                type="number" inputMode="decimal"
                value={mstrShares || ''}
                onChange={(e) => setMstrShares(parseFloat(e.target.value) || 0)}
                placeholder="100"
                className="font-mono text-base"
              />
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs text-muted-foreground">{tr ? 'Yaklaşık BTC Maruziyeti' : 'Approximate BTC Exposure'}</p>
              <p className="text-lg font-bold text-foreground font-mono">{(mstrShares * MSTR_BTC_PER_SHARE).toFixed(4)} BTC</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs text-muted-foreground">{tr ? 'Güncel Fiyattaki BTC Değeri' : 'BTC Value at Current Price'}</p>
              <p className="text-lg font-bold text-foreground font-mono">${fmt(mstrResult.btcValue, 0)}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {tr
              ? `Her MSTR hissesi, MicroStrategy'nin bildirilen ~450K BTC varlığı ÷ ~180M dolaşımdaki hisse sayısına göre yaklaşık ${MSTR_BTC_PER_SHARE} BTC dolaylı Bitcoin maruziyeti temsil eder. Bu, net varlık değerine prim/iskonto içeren dolaylı bir maruziyet olup MSTR bir ETF değildir.`
              : `Each MSTR share represents approximately ${MSTR_BTC_PER_SHARE} BTC of indirect Bitcoin exposure based on MicroStrategy's reported ~450K BTC holdings ÷ ~180M shares outstanding. This is indirect exposure subject to premium/discount to NAV. MSTR is not an ETF.`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
