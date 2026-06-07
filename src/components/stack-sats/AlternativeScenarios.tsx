import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { StackSatsResult } from "@/services/stackSatsCalculator";
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrencyAmount } from "@/utils/formatCurrency";

interface AlternativeScenariosProps {
  results: StackSatsResult | null;
  currency: string;
}

export const AlternativeScenarios = ({ results, currency }: AlternativeScenariosProps) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  if (!results) return null;

  const scenarios = [
    { name: tr ? 'Muhafazakar' : 'Conservative', icon: TrendingDown, data: results.alternativeScenarios.conservative, color: 'text-warning', bgColor: 'bg-warning-soft', description: tr ? '%10 yıllık büyüme' : '10% annual growth' },
    { name: tr ? 'Orta' : 'Moderate', icon: Minus, data: results.alternativeScenarios.moderate, color: 'text-blue-600', bgColor: 'bg-blue-50', description: tr ? '%15 yıllık büyüme' : '15% annual growth' },
    { name: tr ? 'İyimser' : 'Optimistic', icon: TrendingUp, data: results.alternativeScenarios.optimistic, color: 'text-success', bgColor: 'bg-success/10', description: tr ? '%25 yıllık büyüme' : '25% annual growth' }
  ];

  return (
    <Card className="glass-morphism-card border-border/20">
      <CardHeader>
        <CardTitle>{tr ? 'Alternatif Büyüme Senaryoları' : 'Alternative Growth Scenarios'}</CardTitle>
        <p className="text-sm text-muted-foreground">{tr ? 'Farklı Bitcoin fiyat büyüme varsayımlarını karşılaştırın' : 'Compare different Bitcoin price growth assumptions'}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scenario) => {
            const IconComponent = scenario.icon;
            const fmt = (v: number) => formatCurrencyAmount(v, currency, { locale: tr ? 'tr-TR' : 'en-US' });
            return (
              <div key={scenario.name} className="p-4 rounded-xl border border-border/20 hover:border-border transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg ${scenario.bgColor}`}><IconComponent className={`w-4 h-4 ${scenario.color}`} /></div>
                  <div>
                    <h4 className="font-semibold text-sm">{scenario.name}</h4>
                    <p className="text-xs text-muted-foreground">{scenario.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div><p className="text-xs text-muted-foreground">{tr ? 'Hedefe Kalan Süre' : 'Time to Goal'}</p><p className="text-2xl font-bold">{scenario.data.months < 12 ? `${scenario.data.months}${tr ? 'ay' : 'mo'}` : `${(scenario.data.months / 12).toFixed(1)}${tr ? 'yıl' : 'yr'}`}</p></div>
                  <div><p className="text-xs text-muted-foreground">{tr ? 'Toplam Yatırım' : 'Total Investment'}</p><p className="font-semibold">{fmt(scenario.data.totalInvested)}</p></div>
                  <div><p className="text-xs text-muted-foreground">{tr ? 'Ort. Alış Fiyatı' : 'Avg Buy Price'}</p><p className="font-semibold text-sm">{fmt(scenario.data.averageBuyPrice)}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};