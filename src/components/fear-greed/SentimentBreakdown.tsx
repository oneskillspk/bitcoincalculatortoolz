import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SENTIMENT_FACTORS } from '@/services/fearGreedService';
import {
  Activity,
  TrendingUp,
  MessageCircle,
  BarChart3,
  PieChart,
  Search,
  Info,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const iconMap: Record<string, React.ElementType> = {
  'activity': Activity,
  'trending-up': TrendingUp,
  'message-circle': MessageCircle,
  'bar-chart-3': BarChart3,
  'pie-chart': PieChart,
  'search': Search,
};

export const SentimentBreakdown: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <Card className="border-border/20 bg-card shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 text-foreground">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Info className="w-4 h-4 text-primary" />
          </div>
          {tr ? 'Endeks Nasıl Hesaplanır' : 'How the Index Is Calculated'}
        </CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {tr
            ? 'Korku & Açgözlülük Endeksi, 0 (Aşırı Korku) ile 100 (Aşırı Açgözlülük) arasında tek bir duyarlılık puanı üretmek için altı ağırlıklı faktörü birleştirir.'
            : 'The Fear & Greed Index combines six weighted factors to produce a single sentiment score from 0 (Extreme Fear) to 100 (Extreme Greed).'}
        </p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {SENTIMENT_FACTORS.map((factor) => {
            const Icon = iconMap[factor.icon] || Activity;
            return (
              <div
                key={factor.name}
                className="p-4 rounded-xl border border-border/20 bg-gradient-to-b from-muted/20 to-transparent space-y-3 hover:border-border/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-foreground">{factor.name}</h4>
                    <span className="text-xs text-primary font-semibold">
                      {factor.weight}% {tr ? 'ağırlık' : 'weight'}
                    </span>
                  </div>
                </div>
                <Progress value={factor.weight} className="h-1.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {factor.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
