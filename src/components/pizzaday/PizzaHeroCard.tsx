import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pizza, DollarSign, TrendingUp, Coins } from 'lucide-react';
import { calculatePizzaHeroData, PIZZA_TRANSACTION } from '@/services/pizzaDayCalculatorService';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatGroupedInt } from '@/utils/numberFormat';

interface Props {
  currentBtcPrice: number;
  isLoading: boolean;
}

export const PizzaHeroCard = ({ currentBtcPrice, isLoading }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const data = useMemo(() => calculatePizzaHeroData(currentBtcPrice), [currentBtcPrice]);

  const formatLargeNumber = (n: number) => {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    return `$${formatGroupedInt(n, tr ? 'tr-TR' : 'en-US')}`;
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card overflow-hidden" data-currency-exempt="true">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">🍕</div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {tr ? 'Ünlü Bitcoin Pizzası' : 'The Famous Bitcoin Pizza'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {tr ? '22 Mayıs 2010' : 'May 22, 2010'} — {PIZZA_TRANSACTION.buyer}
            </p>
          </div>
        </div>

        <div className="text-center py-6 space-y-2">
          <p className="text-sm text-muted-foreground">
            {tr ? '2 pizza için harcanan 10.000 BTC şu an' : '10,000 BTC spent on 2 pizzas is now worth'}
          </p>
          <p className={cn(
            "text-4xl sm:text-5xl lg:text-6xl font-bold text-primary font-mono transition-opacity",
            isLoading && "opacity-50 animate-pulse"
          )}>
            {formatLargeNumber(data.currentValue)}
          </p>
          <Badge variant="outline" className="border-primary/30 text-primary">
            <TrendingUp className="w-3 h-3 mr-1" />
            {formatGroupedInt(data.multiplier, tr ? 'tr-TR' : 'en-US')}x {tr ? 'getiri' : 'return'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-background/50">
            <Pizza className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">{tr ? 'Orijinal Maliyet' : 'Original Cost'}</p>
            <p className="text-sm font-bold text-foreground">${PIZZA_TRANSACTION.usdValue}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <Coins className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">{tr ? 'Harcanan BTC' : 'BTC Spent'}</p>
            <p className="text-sm font-bold text-foreground">10,000 BTC</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <DollarSign className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">{tr ? 'Pizza Başına Maliyet' : 'Cost Per Pizza'}</p>
            <p className="text-sm font-bold text-foreground">{formatLargeNumber(data.costPerPizza)}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">{tr ? 'Alınan Pizza' : 'Pizzas Bought'}</p>
            <p className="text-sm font-bold text-foreground">2 🍕</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
