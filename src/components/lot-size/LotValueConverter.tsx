import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowDown } from 'lucide-react';
import { lotSizeCalculator } from '@/services/lotSizeCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

interface LotValueConverterProps {
  liveBtcPrice: number;
  contractSize: number;
}

export const LotValueConverter: React.FC<LotValueConverterProps> = ({ liveBtcPrice, contractSize }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [lotInput, setLotInput] = useState<number>(0.01);

  const converted = useMemo(() => {
    if (!liveBtcPrice || lotInput <= 0) return null;
    return lotSizeCalculator.convertLotValue(lotInput, liveBtcPrice, contractSize);
  }, [lotInput, liveBtcPrice, contractSize]);

  const referenceTable = useMemo(() => {
    if (!liveBtcPrice) return [];
    return lotSizeCalculator.generateReferenceTable(liveBtcPrice, contractSize);
  }, [liveBtcPrice, contractSize]);

  return (
    <div className="space-y-8">
      <Card className="border-border/50 bg-card shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            {tr ? 'Anlık Lot → USD Dönüştürücü' : 'Instant Lot → USD Converter'}
          </h3>

          <div className="space-y-2">
            <Label htmlFor="lot-input">{tr ? 'Lot Büyüklüğü Girin' : 'Enter Lot Size'}</Label>
            <Input
              id="lot-input"
              type="number"
              value={lotInput || ''}
              onChange={e => setLotInput(parseFloat(e.target.value) || 0)}
              placeholder="0.01"
              min={0}
              step={0.001}
            />
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </div>

          {converted && (
            <div className="text-center py-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-sm text-muted-foreground mb-1">
                {lotInput} {tr ? 'lot =' : 'lots ='}
              </p>
              <p className="text-2xl font-bold text-foreground">{converted.btcAmount} BTC</p>
              <p className="text-xl font-semibold text-primary">${converted.usdValue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {tr ? `BTC başına $${liveBtcPrice.toLocaleString()} fiyatıyla` : `at $${liveBtcPrice.toLocaleString()} per BTC`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {tr ? 'BTC Lot Büyüklüğünden USD\'ye — Hızlı Referans' : 'BTC Lot Size to USD — Quick Reference'}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            {tr
              ? `Gerçek zamanlı BTC fiyatıyla canlı güncellendi ($${liveBtcPrice.toLocaleString()})`
              : `Updated live with real-time BTC price ($${liveBtcPrice.toLocaleString()})`}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 text-muted-foreground font-medium">{tr ? 'Lot Büyüklüğü' : 'Lot Size'}</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">{tr ? 'Tür' : 'Type'}</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">BTC</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">{tr ? 'USD Değeri' : 'USD Value'}</th>
                </tr>
              </thead>
              <tbody>
                {referenceTable.map(row => (
                  <tr key={row.lotSize} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 font-semibold text-foreground">{row.lotSize} {tr ? 'lot' : 'lots'}</td>
                    <td className="py-2.5 text-muted-foreground">{row.label}</td>
                    <td className="py-2.5 text-right text-foreground">{row.btcAmount} BTC</td>
                    <td className="py-2.5 text-right font-semibold text-foreground">${row.usdValue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
