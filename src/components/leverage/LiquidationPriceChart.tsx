import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LiquidationResult } from '@/services/leverageLiquidationCalculator';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface LiquidationPriceChartProps {
  result: LiquidationResult | null;
  entryPrice: number;
  currentPrice: number;
  positionType: 'long' | 'short';
}

interface PriceLevel {
  labelEn: string;
  labelTr: string;
  price: number;
  color: string;
  bgColor: string;
  type: 'entry' | 'current' | 'tp' | 'sl' | 'margin' | 'liquidation';
}

const formatPrice = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

export const LiquidationPriceChart: React.FC<LiquidationPriceChartProps> = ({
  result, entryPrice, currentPrice, positionType
}) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const priceLevels = useMemo<PriceLevel[]>(() => {
    if (!result) return [];
    const levels: PriceLevel[] = [
      { labelEn: 'Entry Price', labelTr: 'Giriş Fiyatı', price: entryPrice, color: 'text-blue-500', bgColor: 'bg-blue-500', type: 'entry' },
      { labelEn: 'Current Price', labelTr: 'Güncel Fiyat', price: currentPrice, color: 'text-primary', bgColor: 'bg-primary', type: 'current' },
      { labelEn: 'Margin Call', labelTr: 'Marj Çağrısı', price: result.marginCallPrice, color: 'text-orange-500', bgColor: 'bg-orange-500', type: 'margin' },
      { labelEn: 'Liquidation', labelTr: 'Tasfiye', price: result.liquidationPrice, color: 'text-destructive', bgColor: 'bg-destructive', type: 'liquidation' },
    ];
    if (result.takeProfitPrice) levels.push({ labelEn: 'Take Profit', labelTr: 'Kâr Al', price: result.takeProfitPrice, color: 'text-success', bgColor: 'bg-success', type: 'tp' });
    if (result.stopLossPrice) levels.push({ labelEn: 'Stop Loss', labelTr: 'Stop Loss', price: result.stopLossPrice, color: 'text-warning', bgColor: 'bg-yellow-500', type: 'sl' });
    return levels.sort((a, b) => b.price - a.price);
  }, [result, entryPrice, currentPrice]);

  if (!result) return null;

  const prices = priceLevels.map(l => l.price);
  const minPrice = Math.min(...prices) * 0.95;
  const maxPrice = Math.max(...prices) * 1.05;
  const priceRange = maxPrice - minPrice;

  const getPositionPercent = (price: number): number => ((maxPrice - price) / priceRange) * 100;
  const profitZoneEnd = getPositionPercent(entryPrice);
  const dangerZoneStart = getPositionPercent(result.marginCallPrice);

  return (
    <Card className="bg-card border-border/50" data-currency-exempt="true">
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          {isTr ? 'Fiyat Seviyesi Görselleştirmesi' : 'Price Level Visualization'}
        </h3>
        <div className="relative h-[300px] sm:h-[400px] bg-gradient-to-b from-background to-muted/20 rounded-lg border border-border/30 overflow-hidden">
          <div className="absolute inset-x-0 bg-gradient-to-b from-success/10 to-success/5" style={{ top: 0, height: `${profitZoneEnd}%` }} />
          <div className="absolute inset-x-0 bg-gradient-to-b from-destructive/5 to-destructive/20" style={{ top: `${dangerZoneStart}%`, bottom: 0 }} />

          {priceLevels.map((level) => {
            const topPercent = getPositionPercent(level.price);
            return (
              <div key={level.type} className="absolute left-0 right-0 flex items-center" style={{ top: `${topPercent}%` }}>
                <div className={cn("absolute inset-x-0 h-0.5", level.bgColor, level.type === 'liquidation' ? 'opacity-100' : 'opacity-60')}
                  style={{ backgroundImage: level.type === 'liquidation' ? 'repeating-linear-gradient(90deg, transparent, transparent 4px, currentColor 4px, currentColor 8px)' : undefined }} />
                <div className="absolute left-2 sm:left-4 -translate-y-1/2 z-10">
                  <div className={cn("px-2 py-1 rounded text-xs font-medium", level.bgColor + '/20', level.color)}>
                    {isTr ? level.labelTr : level.labelEn}
                  </div>
                </div>
                <div className="absolute right-2 sm:right-4 -translate-y-1/2 z-10">
                  <div className={cn("px-2 py-1 rounded text-xs font-mono font-semibold", level.bgColor + '/20', level.color)}>
                    {formatPrice(level.price)}
                  </div>
                </div>
                {level.type === 'current' && (
                  <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className={cn("w-4 h-4 rounded-full border-2 border-background", level.bgColor, "animate-pulse")} />
                  </div>
                )}
              </div>
            );
          })}

          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-success/20 rounded-full text-xs text-success font-medium">
            {positionType === 'long'
              ? (isTr ? 'Kâr Bölgesi ↑' : 'Profit Zone ↑')
              : (isTr ? 'Kâr Bölgesi ↓' : 'Profit Zone ↓')}
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-destructive/20 rounded-full text-xs text-destructive font-medium">
            {isTr ? 'Tehlike Bölgesi' : 'Danger Zone'}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {[
            { color: 'bg-primary', label: isTr ? 'Güncel' : 'Current' },
            { color: 'bg-blue-500', label: isTr ? 'Giriş' : 'Entry' },
            { color: 'bg-success', label: isTr ? 'Kâr Al' : 'Take Profit' },
            { color: 'bg-orange-500', label: isTr ? 'Marj Çağrısı' : 'Margin Call' },
            { color: 'bg-destructive', label: isTr ? 'Tasfiye' : 'Liquidation' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-3 h-0.5 ${item.color}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
