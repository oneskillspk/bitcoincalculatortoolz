import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Rocket, AlertTriangle, TrendingUp, Target, Crown } from 'lucide-react';
import type { HalvingProjectionScenario } from '@/services/halvingCountdownService';
import { useLanguage } from '@/contexts/LanguageContext';

interface HalvingProjectionProps {
  scenarios: HalvingProjectionScenario[];
  currentPrice: number;
  onPriceChange: (price: number) => void;
}

const SCENARIO_CONFIG = [
  { color: 'border-blue-500/30 bg-blue-500/5', iconColor: 'text-blue-500', icon: TrendingUp, badge: 'bg-blue-500/10 text-blue-500' },
  { color: 'border-primary/30 bg-primary/5', iconColor: 'text-primary', icon: Target, badge: 'bg-primary/10 text-primary' },
  { color: 'border-success/30 bg-success/5', iconColor: 'text-success', icon: Crown, badge: 'bg-success/10 text-success' },
];

const ROW_LABELS_EN = ['6 Months After', '1 Year After', '18 Months After', 'Peak Price'];
const ROW_LABELS_TR = ['6 Ay Sonra', '1 Yıl Sonra', '18 Ay Sonra', 'Zirve Fiyat'];

export const HalvingProjection: React.FC<HalvingProjectionProps> = ({ scenarios, currentPrice, onPriceChange }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const rowLabels = tr ? ROW_LABELS_TR : ROW_LABELS_EN;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Rocket className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">
            {tr ? 'Tarih Tekerrür Ederse — Fiyat Projeksiyonları' : 'If History Repeats — Price Projections'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="projection-price" className="text-xs text-muted-foreground whitespace-nowrap">
            {tr ? 'Başlangıç Fiyatı:' : 'Starting Price:'}
          </Label>
          <Input
            id="projection-price"
            type="number"
            value={currentPrice}
            onChange={e => onPriceChange(Number(e.target.value))}
            className="w-32 h-8 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario, idx) => {
          const config = SCENARIO_CONFIG[idx] || SCENARIO_CONFIG[0];
          const IconComp = config.icon;
          const rows = [
            { label: rowLabels[0], value: scenario.price6MonthsAfter },
            { label: rowLabels[1], value: scenario.price1YearAfter },
            { label: rowLabels[2], value: scenario.price18MonthsAfter },
            { label: rowLabels[3], value: scenario.peakPrice, highlight: true },
          ];
          return (
            <Card key={scenario.label} className={`${config.color} border`}>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.badge}`}>
                    <IconComp className="w-3 h-3" />
                    {scenario.label}
                  </div>
                  <span className="text-xs text-muted-foreground">{scenario.multiplier.toFixed(1)}x</span>
                </div>
                <p className="text-xs text-muted-foreground">{scenario.description}</p>
                <div className="space-y-2.5">
                  {rows.map((row) => (
                    <div key={row.label} className={`flex justify-between items-center text-sm ${row.highlight ? 'pt-2 border-t border-border/30' : ''}`}>
                      <span className="text-muted-foreground text-xs">{row.label}</span>
                      <span className={`font-semibold ${row.highlight ? 'text-base' : ''}`}>
                        ${Math.round(row.value).toLocaleString(getCurrentIntlLocale())}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">{tr ? 'Sorumluluk Reddi:' : 'Disclaimer:'}</strong>{' '}
          {tr
            ? 'Bu projeksiyonlar tarihsel yarılanma döngüsü performansına dayanmakta olup finansal tavsiye niteliği taşımamaktadır. Geçmiş performans gelecekteki sonuçları garanti etmez. Bitcoin değişken bir varlıktır — sorumlu yatırım yapın.'
            : 'These projections are based on historical halving cycle performance and do not constitute financial advice. Past performance does not guarantee future results. Bitcoin is a volatile asset — invest responsibly.'}
        </p>
      </div>
    </div>
  );
};
