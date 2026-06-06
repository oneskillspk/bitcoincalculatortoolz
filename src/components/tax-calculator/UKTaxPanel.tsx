import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calculator, PoundSterling } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const UKTaxPanel: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [purchasePrice, setPurchasePrice] = useState<number>(30000);
  const [salePrice, setSalePrice] = useState<number>(60000);
  const [btcAmount, setBtcAmount] = useState<number>(0.5);
  const [purchaseFees, setPurchaseFees] = useState<number>(0);
  const [saleFees, setSaleFees] = useState<number>(0);
  const [incomeBand, setIncomeBand] = useState<'basic' | 'higher'>('basic');
  const [cgtAllowanceUsed, setCgtAllowanceUsed] = useState(false);

  const results = useMemo(() => {
    const proceeds = salePrice * btcAmount - saleFees;
    const allowableCost = purchasePrice * btcAmount + purchaseFees;
    const grossGain = proceeds - allowableCost;

    if (grossGain <= 0) {
      return { proceeds, allowableCost, grossGain, allowance: 0, taxableGain: 0, cgtRate: 0, cgtDue: 0, netProfit: grossGain };
    }

    const allowance = cgtAllowanceUsed ? 0 : 3000;
    const taxableGain = Math.max(0, grossGain - allowance);
    const cgtRate = incomeBand === 'basic' ? 18 : 24;
    const cgtDue = taxableGain * (cgtRate / 100);
    const netProfit = grossGain - cgtDue;

    return { proceeds, allowableCost, grossGain, allowance, taxableGain, cgtRate, cgtDue, netProfit };
  }, [purchasePrice, salePrice, btcAmount, purchaseFees, saleFees, incomeBand, cgtAllowanceUsed]);

  const fmt = (v: number) => `£${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const resultRows: [string, string][] = [
    [tr ? 'Satış Hasılatı' : 'Proceeds', fmt(results.proceeds)],
    [tr ? 'İzin Verilen Maliyet' : 'Allowable Cost', fmt(results.allowableCost)],
    [tr ? 'Brüt Kazanç' : 'Gross Gain', fmt(results.grossGain)],
    [tr ? 'SKV Yıllık Muafiyeti' : 'CGT Annual Allowance', results.allowance > 0 ? `−${fmt(results.allowance)}` : (tr ? '£0 (zaten kullanıldı)' : '£0 (already used)')],
    [tr ? 'Vergilendirilebilir Kazanç' : 'Taxable Gain', fmt(results.taxableGain)],
    [tr ? 'SKV Oranı' : 'CGT Rate', `${results.cgtRate}% (${incomeBand === 'basic' ? (tr ? 'Temel' : 'Basic') : (tr ? 'Üst' : 'Higher')})`],
    [tr ? 'Ödenecek SKV' : 'CGT Due', fmt(results.cgtDue)],
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Inputs */}
      <Card className="glass-morphism-card border-border/20 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            {tr ? 'İngiltere SKV Girişleri' : 'UK CGT Inputs'}
          </h3>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">
                {tr ? 'Bitcoin Alış Fiyatı (£ / BTC)' : 'Bitcoin Purchase Price (£ per BTC)'}
              </Label>
              <Input type="number" value={purchasePrice || ''} onChange={e => setPurchasePrice(Number(e.target.value))} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                {tr ? 'Bitcoin Satış Fiyatı (£ / BTC)' : 'Bitcoin Sale Price (£ per BTC)'}
              </Label>
              <Input type="number" value={salePrice || ''} onChange={e => setSalePrice(Number(e.target.value))} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                {tr ? 'Satılan BTC Miktarı' : 'Amount of BTC Sold'}
              </Label>
              <Input type="number" value={btcAmount || ''} onChange={e => setBtcAmount(Number(e.target.value))} step="0.0001" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                {tr ? 'Alış Ücretleri (£)' : 'Purchase Fees (£)'}
              </Label>
              <Input type="number" value={purchaseFees || ''} onChange={e => setPurchaseFees(Number(e.target.value))} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                {tr ? 'Satış Ücretleri (£)' : 'Sale Fees (£)'}
              </Label>
              <Input type="number" value={saleFees || ''} onChange={e => setSaleFees(Number(e.target.value))} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                {tr ? 'Gelir Vergisi Dilimi' : 'Your Income Tax Band'}
              </Label>
              <Select value={incomeBand} onValueChange={(v: 'basic' | 'higher') => setIncomeBand(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">
                    {tr ? 'Temel Oran (£50.270\'e kadar)' : 'Basic Rate (up to £50,270)'}
                  </SelectItem>
                  <SelectItem value="higher">
                    {tr ? 'Üst Oran (£50.270 üzeri)' : 'Higher Rate (above £50,270)'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                {tr ? 'Bu yıl SKV muafiyeti zaten kullanıldı mı?' : 'CGT allowance already used this year?'}
              </Label>
              <Switch checked={cgtAllowanceUsed} onCheckedChange={setCgtAllowanceUsed} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="glass-morphism-card border-border/20 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            {tr ? 'İngiltere SKV Özeti' : 'UK CGT Summary'}
          </h3>
          <div className="space-y-3">
            {resultRows.map(([label, value], i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold text-foreground">{value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-3 bg-muted/30 rounded-lg px-3 mt-2">
              <span className="text-sm font-semibold text-foreground">
                {tr ? 'Vergi Sonrası Net Kâr' : 'Net Profit After Tax'}
              </span>
              <span className={`text-lg font-bold ${results.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {fmt(results.netProfit)}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {tr
              ? 'Kripto para birimleri için İngiltere SKV kuralları HMRC kılavuzuna dayanmaktadır. Birden fazla alım yaptıysanız Bölüm 104 havuzlama kuralları geçerlidir — karmaşık portföyler için bir vergi danışmanına başvurun.'
              : 'UK CGT rules for cryptocurrency are based on HMRC guidance. The Section 104 pooling rules apply if you have made multiple purchases — consult a tax adviser for complex portfolios.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UKTaxPanel;
