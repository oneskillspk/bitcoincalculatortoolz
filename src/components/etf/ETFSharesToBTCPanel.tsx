import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bitcoin, Building2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatGroupedDecimal } from '@/utils/numberFormat';
import { InputPanel, ResultPanel, ResultHero, ResultsGrid, ResultCard } from '@/components/calculator';

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
  const locale = tr ? 'tr-TR' : 'en-US';

  const [selectedETF, setSelectedETF] = useState('IBIT');
  const [shares, setShares] = useState(100);
  const [sharePrice, setSharePrice] = useState<string>('');
  const [mstrShares, setMstrShares] = useState(100);

  const etf = ETF_DATA.find(e => e.id === selectedETF) || ETF_DATA[0];

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
        <InputPanel
          title={
            <span className="flex items-center gap-2">
              <Bitcoin className="w-5 h-5 text-primary" />
              {tr ? 'ETF Hisseleri → BTC Dönüştürücü' : 'ETF Shares → BTC Converter'}
            </span>
          }
          description={tr
            ? 'ETF hisselerinizi yaklaşık BTC eşdeğerine dönüştürün.'
            : 'Convert your ETF shares into approximate BTC equivalent.'}
        >
          <div className="space-y-5">
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
          </div>
        </InputPanel>

        <ResultPanel
          icon={<Bitcoin />}
          title={tr
            ? `${shares} adet ${selectedETF} hisseniz`
            : `Your ${shares} ${selectedETF} shares`}
          accentBar="primary"
          footer={
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
              <p className="calc-text-small text-muted-foreground">
                {tr
                  ? 'Hisse başına BTC oranı yaklaşıktır ve yönetim ücretleri nedeniyle zamanla hafifçe azalır. Kesin oranı brokerınızın izahnamesinde doğrulayın.'
                  : "BTC per share ratio is approximate and decreases slightly over time due to management fees. Verify the exact ratio in your broker's prospectus."}
              </p>
            </div>
          }
        >
          <ResultHero
            label={tr ? 'yaklaşık olarak' : 'represent approximately'}
            value={<span className="text-primary">{result.btcEquivalent.toFixed(5)} BTC</span>}
            sub={tr
              ? `Güncel USD değeri: $${fmt(result.usdValue, 0, locale)} · Tam BTC'nin %${(result.fractionOfWhole * 100).toFixed(3)}'i`
              : `Current USD value: $${fmt(result.usdValue, 0, locale)} · ${(result.fractionOfWhole * 100).toFixed(3)}% of a whole Bitcoin`}
          />
          <ResultCard
            label={tr ? 'Hisse başına BTC oranı' : 'BTC per share ratio'}
            value={String(etf.btcPerShare)}
            sub={tr ? 'yaklaşık, Mart 2026' : 'approximate, March 2026'}
            size="sm"
          />
        </ResultPanel>
      </div>

      <ResultPanel
        icon={<Building2 />}
        title={tr ? 'MicroStrategy (MSTR) Bitcoin Maruziyeti' : 'MicroStrategy (MSTR) Bitcoin Exposure'}
        footer={
          <p className="calc-text-small text-muted-foreground">
            {tr
              ? `Her MSTR hissesi, MicroStrategy'nin bildirilen ~450K BTC varlığı ÷ ~180M dolaşımdaki hisse sayısına göre yaklaşık ${MSTR_BTC_PER_SHARE} BTC dolaylı Bitcoin maruziyeti temsil eder. Bu, net varlık değerine prim/iskonto içeren dolaylı bir maruziyet olup MSTR bir ETF değildir.`
              : `Each MSTR share represents approximately ${MSTR_BTC_PER_SHARE} BTC of indirect Bitcoin exposure based on MicroStrategy's reported ~450K BTC holdings ÷ ~180M shares outstanding. This is indirect exposure subject to premium/discount to NAV. MSTR is not an ETF.`}
          </p>
        }
      >
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
          <ResultCard
            label={tr ? 'Yaklaşık BTC Maruziyeti' : 'Approximate BTC Exposure'}
            value={`${(mstrShares * MSTR_BTC_PER_SHARE).toFixed(4)} BTC`}
            size="sm"
          />
          <ResultCard
            label={tr ? 'Güncel Fiyattaki BTC Değeri' : 'BTC Value at Current Price'}
            value={`$${fmt(mstrResult.btcValue, 0, locale)}`}
            size="sm"
            tone="primary"
          />
        </div>
      </ResultPanel>
    </div>
  );
};
