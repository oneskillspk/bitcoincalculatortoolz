import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalculationResult } from '@/services/bitcoinApi';
import { Smartphone, Car, Coffee, Laptop, Plane, Pizza, ShoppingBag, Share, ArrowUpDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ModernPurchaseComparisonProps {
  result: CalculationResult;
}

interface ComparisonItem {
  nameEn: string;
  nameTr: string;
  icon: React.ElementType;
  priceUSD: number;
  color: string;
  popular: boolean;
}

const COMPARISON_ITEMS: ComparisonItem[] = [
  { nameEn: 'Smartphones', nameTr: 'Akıllı Telefon', icon: Smartphone, priceUSD: 800, color: 'bg-blue-500/10 text-blue-600', popular: true },
  { nameEn: 'Laptops', nameTr: 'Dizüstü Bilgisayar', icon: Laptop, priceUSD: 1200, color: 'bg-indigo-500/10 text-indigo-600', popular: true },
  { nameEn: 'Cars', nameTr: 'Araba', icon: Car, priceUSD: 30000, color: 'bg-muted text-muted-foreground', popular: true },
  { nameEn: 'Flight Tickets', nameTr: 'Uçak Bileti', icon: Plane, priceUSD: 400, color: 'bg-sky-500/10 text-sky-600', popular: true },
  { nameEn: 'Coffee Orders', nameTr: 'Kahve', icon: Coffee, priceUSD: 5, color: 'bg-amber-500/10 text-amber-600', popular: true },
  { nameEn: 'Pizza Orders', nameTr: 'Pizza', icon: Pizza, priceUSD: 25, color: 'bg-destructive/10 text-destructive', popular: true },
  { nameEn: 'Shopping Sprees', nameTr: 'Alışveriş Turu', icon: ShoppingBag, priceUSD: 300, color: 'bg-purple-400/10 text-purple-500', popular: false },
];

export const ModernPurchaseComparison = React.memo(({ result }: ModernPurchaseComparisonProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const [sortBy, setSortBy] = useState<'quantity' | 'price'>('quantity');

  const comparisons = useMemo(() => {
    const currentValue = result.currentValue;
    let filtered = COMPARISON_ITEMS.map(item => ({
      ...item,
      quantity: Math.floor(currentValue / item.priceUSD),
      adjustedPrice: item.priceUSD
    })).filter(item => item.quantity > 0);
    filtered.sort((a, b) => sortBy === 'quantity' ? b.quantity - a.quantity : a.adjustedPrice - b.adjustedPrice);
    return filtered.slice(0, 6);
  }, [result.currentValue, sortBy]);

  const formatQuantity = (quantity: number) => {
    if (quantity >= 1000000) return `${(quantity / 1000000).toFixed(1)}M`;
    if (quantity >= 1000) return `${(quantity / 1000).toFixed(1)}K`;
    return quantity.toLocaleString();
  };

  const handleShare = async (item: any) => {
    const name = isTr ? item.nameTr : item.nameEn;
    const text = isTr
      ? `Bitcoin yatırımımla ${formatQuantity(item.quantity)}× ${name} alabilirdim! 🚀`
      : `I could have bought ${formatQuantity(item.quantity)}× ${item.nameEn} with my Bitcoin investment! 🚀`;
    try {
      if (navigator.share && navigator.canShare?.({ text })) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      try { await navigator.clipboard.writeText(text); } catch {}
    }
  };

  return (
    <Card className="glass-morphism-card border-border/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                {isTr ? 'Bugün Neler Alabilirsiniz' : 'What You Could Buy Today'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {isTr ? `${result.currency}${result.currentValue.toLocaleString()} ile` : `With ${result.currency}${result.currentValue.toLocaleString()}`}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {comparisons.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.nameEn}
                className="p-4 rounded-xl bg-gradient-to-br from-background to-background/50 border border-border/20 hover:border-border/40 transition-all duration-300 group hover:scale-[1.02]">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground font-mono">{formatQuantity(item.quantity)}×</div>
                    <div className="text-sm font-medium text-foreground/80 leading-tight">
                      {isTr ? item.nameTr : item.nameEn}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

ModernPurchaseComparison.displayName = 'ModernPurchaseComparison';
