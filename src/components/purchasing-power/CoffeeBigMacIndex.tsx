import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Coffee, Home, TrendingDown } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export const CoffeeBigMacIndex = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-6 max-w-5xl space-y-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><ShoppingBag className="w-5 h-5 text-primary" /></div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'Kahve ve Big Mac Endeksi' : 'Coffee & Big Mac Index'}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            {tr 
              ? 'Satın alma gücündeki değişimi anlamanın en iyi yolu, aynı miktarda paranın (veya BTC\'nin) zaman içinde alabildiği ürün sayısına bakmaktır:'
              : 'The best way to understand the change in purchasing power is to look at how many units of the same good a fixed amount of money (or BTC) could buy over time:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border border-border/30 bg-card/50">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-destructive/10 rounded flex items-center justify-center text-destructive">$</div>
                <h3 className="font-bold text-foreground">$100 (USD)</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">2015 (20 Big Mac)</span>
                  <div className="h-2 w-32 bg-destructive/20 rounded-full overflow-hidden">
                    <div className="h-full bg-destructive w-full" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">2026 (12 Big Mac)</span>
                  <div className="h-2 w-32 bg-destructive/20 rounded-full overflow-hidden">
                    <div className="h-full bg-destructive w-[60%]" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-destructive font-medium italic">
                {tr ? 'Dolar satın alma gücü %40 düştü.' : 'Dollar purchasing power dropped by 40%.'}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/30 bg-card/50">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-success/10 rounded flex items-center justify-center text-success">₿</div>
                <h3 className="font-bold text-foreground">0.01 BTC</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">2015 (1 Big Mac)</span>
                  <div className="h-2 w-32 bg-success/20 rounded-full overflow-hidden">
                    <div className="h-full bg-success w-[5%]" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">2026 (150 Big Mac)</span>
                  <div className="h-2 w-32 bg-success/20 rounded-full overflow-hidden">
                    <div className="h-full bg-success w-full" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-success font-medium italic">
                {tr ? 'Bitcoin satın alma gücü %15.000 arttı.' : 'Bitcoin purchasing power increased by 15,000%.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
