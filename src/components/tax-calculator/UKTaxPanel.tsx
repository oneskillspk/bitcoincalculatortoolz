import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calculator } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatGroupedDecimal } from '@/utils/numberFormat';
import { InputPanel, ResultPanel, ResultRow } from '@/components/calculator';

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

  const fmt = (v: number) => `£${formatGroupedDecimal(v, 2, tr ? 'tr-TR' : 'en-GB')}`;

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
      <InputPanel
        title={
          <span className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            {tr ? 'İngiltere SKV Girişleri' : 'UK CGT Inputs'}
          </span>
        }
      >
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">
              {tr ? 'Bitcoin Alış Fiyatı (£ / BTC)' : 'Bitcoin Purchase Price (£ per BTC)'}
            </Label>
            <Input type="number" inputMode="decimal" value={purchasePrice || ''} onChange={e => setPurchasePrice(Number(e.target.value))} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              {tr ? 'Bitcoin Satış Fiyatı (£ / BTC)' : 'Bitcoin Sale Price (£ per BTC)'}
            </Label>
            <Input type="number" inputMode="decimal" value={salePrice || ''} onChange={e => setSalePrice(Number(e.target.value))} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              {tr ? 'Satılan BTC Miktarı' : 'Amount of BTC Sold'}
            </Label>
            <Input type="number" inputMode="decimal" value={btcAmount || ''} onChange={e => setBtcAmount(Number(e.target.value))} step="0.0001" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              {tr ? 'Alış Ücretleri (£)' : 'Purchase Fees (£)'}
            </Label>
            <Input type="number" inputMode="decimal" value={purchaseFees || ''} onChange={e => setPurchaseFees(Number(e.target.value))} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              {tr ? 'Satış Ücretleri (£)' : 'Sale Fees (£)'}
            </Label>
            <Input type="number" inputMode="decimal" value={saleFees || ''} onChange={e => setSaleFees(Number(e.target.value))} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              {tr ? 'Gelir Vergisi Dilimi' : 'Your Income Tax Band'}
            </Label>
            <Select value={incomeBand} onValueChange={(v: 'basic' | 'higher') => setIncomeBand(v)}>
              <SelectTrigger aria-label={tr ? 'Gelir vergisi dilimi seçin' : 'Select income tax band'}><SelectValue /></SelectTrigger>
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
      </InputPanel>

      <ResultPanel
        title={tr ? 'İngiltere SKV Özeti' : 'UK CGT Summary'}
        accentBar={results.netProfit >= 0 ? 'positive' : 'negative'}
        footer={
          <p className="calc-text-small text-muted-foreground">
            {tr
              ? 'Kripto para birimleri için İngiltere SKV kuralları HMRC kılavuzuna dayanmaktadır. Birden fazla alım yaptıysanız Bölüm 104 havuzlama kuralları geçerlidir — karmaşık portföyler için bir vergi danışmanına başvurun.'
              : 'UK CGT rules for cryptocurrency are based on HMRC guidance. The Section 104 pooling rules apply if you have made multiple purchases — consult a tax adviser for complex portfolios.'}
          </p>
        }
      >
        <div className="space-y-1">
          {resultRows.map(([label, value], i) => (
            <ResultRow key={i} label={label} value={value} />
          ))}
          <ResultRow
            label={tr ? 'Vergi Sonrası Net Kâr' : 'Net Profit After Tax'}
            value={fmt(results.netProfit)}
            tone={results.netProfit >= 0 ? 'positive' : 'negative'}
            emphasis
            divider
          />
        </div>
      </ResultPanel>
    </div>
  );
};

export default UKTaxPanel;
