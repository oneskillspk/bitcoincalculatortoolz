import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TrendingDown, AlertTriangle, History, Table as TableIcon, Download, Copy, Check } from 'lucide-react';
import type { DrawdownPeriod } from '@/services/drawdownService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { readShareParams, buildCanonicalShareUrl } from '@/utils/shareLink';
import { toast } from 'sonner';

interface DrawdownCorrectionCalculatorProps {
  currentPrice: number;
  periods: DrawdownPeriod[];
}

const PRESETS = [10, 20, 30, 40, 50, 70, 80] as const;

const fmt = (v: number, dec = 2) => v.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });

export const DrawdownCorrectionCalculator: React.FC<DrawdownCorrectionCalculatorProps> = ({ currentPrice, periods }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  // Read prefilled params from share URL on first render.
  const initial = useMemo(() => {
    if (typeof window === 'undefined') return { correction: 30, btc: 1.0 };
    const p = readShareParams();
    const c = p.number('correction');
    const b = p.number('btc');
    return {
      correction: typeof c === 'number' && c >= 1 && c <= 95 ? c : 30,
      btc: typeof b === 'number' && b > 0 ? b : 1.0,
    };
  }, []);

  const [correctionPct, setCorrectionPct] = useState(initial.correction);
  const [btcHoldings, setBtcHoldings] = useState(initial.btc);

  // Smooth-scroll to this section if the share link landed here.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = readShareParams();
    if (p.has('correction') || p.has('btc')) {
      const el = document.getElementById('correction-scenario');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const calc = (correctionPctVal: number, holdings: number) => {
    const correction = correctionPctVal / 100;
    const newPrice = currentPrice * (1 - correction);
    const currentValue = holdings * currentPrice;
    const newValue = holdings * newPrice;
    const dollarLoss = currentValue - newValue;
    const recoveryNeeded = (correction / (1 - correction)) * 100;
    const historicalCount = periods.filter(p => Math.abs(p.drawdownPercent) >= correctionPctVal).length;
    return { newPrice, currentValue, newValue, dollarLoss, recoveryNeeded, historicalCount };
  };

  const result = useMemo(() => calc(correctionPct, btcHoldings), [correctionPct, btcHoldings, currentPrice, periods]);

  const comparisonRows = useMemo(
    () => PRESETS.map(pct => ({ pct, ...calc(pct, btcHoldings) })),
    [btcHoldings, currentPrice, periods]
  );

  const permalink = useMemo(
    () => buildCanonicalShareUrl('drawdown', { correction: correctionPct, btc: btcHoldings }),
    [correctionPct, btcHoldings]
  );

  const [copied, setCopied] = useState(false);

  const handleCopyPermalink = async () => {
    try {
      await navigator.clipboard.writeText(permalink);
      setCopied(true);
      toast.success(tr ? 'Paylaşım bağlantısı kopyalandı' : 'Share link copied', {
        description: permalink,
        duration: 4000,
      });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error(tr ? 'Kopyalanamadı' : 'Could not copy', {
        description: tr ? 'Tarayıcın pano erişimini engelledi.' : 'Your browser blocked clipboard access.',
      });
    }
  };

  const handleDownloadCsv = () => {
    const headers = tr
      ? ['Düzeltme %', 'Yeni Fiyat (USD)', 'Portföy Değeri (USD)', 'Dolar Kaybı (USD)', 'Gereken Toparlanma %', 'Tarihte Olay Sayısı']
      : ['Correction %', 'New Price (USD)', 'Portfolio Value (USD)', 'Dollar Loss (USD)', 'Recovery Needed %', 'Historical Occurrences'];
    const lines = [
      `# Bitcoin Correction Scenarios — ${fmt(btcHoldings, 4)} BTC @ $${fmt(currentPrice, 2)}`,
      `# Generated ${new Date().toISOString()} — ${permalink}`,
      headers.join(','),
      ...comparisonRows.map(r =>
        [
          r.pct,
          r.newPrice.toFixed(2),
          r.newValue.toFixed(2),
          r.dollarLoss.toFixed(2),
          r.recoveryNeeded.toFixed(2),
          r.historicalCount,
        ].join(',')
      ),
    ];
    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `btc-correction-scenarios-${btcHoldings}btc.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(tr ? 'CSV indirildi' : 'CSV downloaded', {
      description: tr
        ? `${comparisonRows.length} senaryo dışa aktarıldı.`
        : `Exported ${comparisonRows.length} scenarios.`,
    });
  };

  return (
    <Card id="correction-scenario" className="glass-morphism-card border-border/20 shadow-sm scroll-mt-24">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-primary" />
          {tr ? 'Düzeltme Senaryo Hesaplayıcısı' : 'Correction Scenario Calculator'}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {tr ? 'Herhangi bir fiyat düzeltmesinin portföyünüze etkisini modelleyin.' : 'Model the impact of any price correction on your portfolio.'}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-5">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">
                {tr ? 'Düzeltme Yüzdesi:' : 'Correction Percentage:'}{' '}
                <span className="text-primary font-mono">{correctionPct}%</span>
              </Label>
              <Slider
                value={[correctionPct]}
                onValueChange={([v]) => setCorrectionPct(v)}
                min={10} max={95} step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10%</span><span>50%</span><span>95%</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setCorrectionPct(v)}
                    aria-label={`${v}% correction preset`}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      correctionPct === v
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/50 text-muted-foreground border-border/50 hover:border-primary/50'
                    }`}
                  >
                    −{v}% {tr ? 'düzeltme' : 'correction'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {tr ? 'Bitcoin Varlıklarınız (BTC)' : 'Your Bitcoin Holdings (BTC)'}
              </Label>
              <Input
                type="number"
                value={btcHoldings || ''}
                onChange={(e) => setBtcHoldings(parseFloat(e.target.value) || 0)}
                placeholder="1.0"
                className="font-mono text-base"
                step="0.1"
                min="0.00000001"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
              <p className="text-xs text-muted-foreground mb-1">
                {tr
                  ? `Bitcoin %${correctionPct} düşerse ($${fmt(currentPrice, 0)}'dan):`
                  : `If Bitcoin drops ${correctionPct}% from $${fmt(currentPrice, 0)}:`}
              </p>
              <p className="text-lg font-bold text-foreground font-mono">
                {tr ? 'Yeni Fiyat:' : 'New Price:'} ${fmt(result.newPrice, 0)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-xs text-muted-foreground">{tr ? 'Portföy Değeri' : 'Portfolio Value'}</p>
                <p className="text-sm font-bold text-foreground font-mono">${fmt(result.newValue, 0)}</p>
                <p className="text-xs text-muted-foreground">
                  {tr ? `${fmt(result.currentValue, 0)}$'dan düşüş` : `down from $${fmt(result.currentValue, 0)}`}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <p className="text-xs text-muted-foreground">{tr ? 'Dolar Kaybı' : 'Dollar Loss'}</p>
                <p className="text-sm font-bold text-destructive font-mono">−${fmt(result.dollarLoss, 0)}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <p className="text-xs text-muted-foreground">{tr ? 'Gereken Toparlanma' : 'Recovery Needed'}</p>
              </div>
              <p className="text-sm font-bold text-foreground">
                {tr
                  ? <>Bitcoin bugünkü fiyata geri dönmek için dipten <span className="text-primary font-mono">%{fmt(result.recoveryNeeded, 1)}</span> artmalıdır</>
                  : <>Bitcoin must rise <span className="text-primary font-mono">{fmt(result.recoveryNeeded, 1)}%</span> from the bottom to return to today's price</>}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <div className="flex items-center gap-2 mb-1">
                <History className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs text-muted-foreground">{tr ? 'Tarihsel Bağlam' : 'Historical Context'}</p>
              </div>
              <p className="text-sm text-foreground">
                {tr
                  ? <>%{correctionPct}+ düzeltme Bitcoin tarihinde <span className="font-bold text-primary">{result.historicalCount} kez</span> yaşandı</>
                  : <>A {correctionPct}%+ correction has happened <span className="font-bold text-primary">{result.historicalCount} time{result.historicalCount !== 1 ? 's' : ''}</span> in Bitcoin's history</>}
              </p>
            </div>
          </div>
        </div>

        {/* Permalink + CSV export */}
        <div className="pt-4 border-t border-border/30 space-y-3">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {tr ? 'Bu senaryo için kalıcı bağlantı' : 'Permalink for this scenario'}
          </Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              readOnly
              value={permalink}
              onFocus={(e) => e.currentTarget.select()}
              className="font-mono text-xs bg-muted/30 flex-1"
              aria-label={tr ? 'Paylaşım bağlantısı' : 'Share permalink'}
            />
            <div className="flex gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyPermalink}
                className="gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? (tr ? 'Kopyalandı' : 'Copied') : (tr ? 'Bağlantıyı kopyala' : 'Copy link')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadCsv}
                className="gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                {tr ? 'CSV indir' : 'Download CSV'}
              </Button>
            </div>
          </div>
        </div>

        {/* Side-by-side scenario comparison */}
        <div className="pt-4 border-t border-border/30">
          <div className="flex items-center gap-2 mb-3">
            <TableIcon className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              {tr ? 'Senaryo Karşılaştırma Tablosu' : 'Scenario Comparison Table'}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {tr
              ? `${fmt(btcHoldings, 4)} BTC için her düzeltme seviyesinde ne olacağını tek bakışta görün. Etkin satır: −%${correctionPct}.`
              : `See what happens to ${fmt(btcHoldings, 4)} BTC at every correction level, side by side. Active row: −${correctionPct}%.`}
          </p>
          <div className="overflow-x-auto rounded-lg border border-border/40">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="text-left font-medium px-3 py-2">
                    {tr ? 'Düzeltme' : 'Correction'}
                  </th>
                  <th scope="col" className="text-right font-medium px-3 py-2">
                    {tr ? 'Yeni Fiyat' : 'New Price'}
                  </th>
                  <th scope="col" className="text-right font-medium px-3 py-2">
                    {tr ? 'Portföy' : 'Portfolio'}
                  </th>
                  <th scope="col" className="text-right font-medium px-3 py-2">
                    {tr ? 'Kayıp' : 'Loss'}
                  </th>
                  <th scope="col" className="text-right font-medium px-3 py-2">
                    {tr ? 'Toparlanma' : 'Recovery'}
                  </th>
                  <th scope="col" className="text-right font-medium px-3 py-2 hidden sm:table-cell">
                    {tr ? 'Tarihte' : 'Historically'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {comparisonRows.map((row) => {
                  const isActive = row.pct === correctionPct;
                  return (
                    <tr
                      key={row.pct}
                      onClick={() => setCorrectionPct(row.pct)}
                      className={`cursor-pointer transition-colors ${
                        isActive ? 'bg-primary/10' : 'hover:bg-muted/30'
                      }`}
                    >
                      <td className="px-3 py-2 font-semibold text-foreground">
                        −{row.pct}%
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-foreground">
                        ${fmt(row.newPrice, 0)}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-foreground">
                        ${fmt(row.newValue, 0)}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-destructive">
                        −${fmt(row.dollarLoss, 0)}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-primary">
                        +{fmt(row.recoveryNeeded, 1)}%
                      </td>
                      <td className="px-3 py-2 text-right text-muted-foreground hidden sm:table-cell">
                        {row.historicalCount}× {tr ? '' : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {tr ? 'Bir satıra tıklayarak o senaryoyu yukarıda yükleyin.' : 'Click any row to load that scenario above.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
