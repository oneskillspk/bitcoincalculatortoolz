import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CurrentBandResult, getBandAction } from '@/services/rainbowChartService';
import { localizeBandName } from '@/components/rainbow/bandLabels';
import { useLanguage } from '@/contexts/LanguageContext';

interface CurrentZoneIndicatorProps {
  currentBand: CurrentBandResult;
  currentPrice: number;
  isLoading: boolean;
}

export const CurrentZoneIndicator: React.FC<CurrentZoneIndicatorProps> = ({
  currentBand,
  currentPrice,
  isLoading,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  if (isLoading) {
    return (
      <Card className="border-border/20 bg-card animate-pulse shadow-card">
        <CardContent className="p-6 sm:p-8">
          <div className="h-32 bg-muted rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const action = getBandAction(currentBand.bandIndex);
  const isBullish = currentBand.bandIndex <= 4;
  const isBearish = currentBand.bandIndex >= 7;

  const priceLabels = tr
    ? [
        { label: 'Alt Sınır', value: currentBand.lowerPrice },
        { label: 'Üst Sınır', value: currentBand.upperPrice },
        { label: 'Güncel Fiyat', value: currentPrice },
      ]
    : [
        { label: 'Band Floor', value: currentBand.lowerPrice },
        { label: 'Band Ceiling', value: currentBand.upperPrice },
        { label: 'Current Price', value: currentPrice },
      ];

  return (
    <Card className="border-border/20 bg-card shadow-card overflow-hidden relative group transition-all duration-300 hover:shadow-lift">
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
        style={{ backgroundColor: currentBand.color }}
      />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top, ${currentBand.color}, transparent 70%)` }}
      />

      <CardContent className="p-5 sm:p-8 relative">
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundColor: `${currentBand.color}20`,
                  boxShadow: `0 4px 14px ${currentBand.color}25`,
                }}
              >
                <MapPin className="w-5 h-5" style={{ color: currentBand.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-h3 font-bold text-foreground">
                    {localizeBandName(currentBand.name, tr)}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-xs font-semibold"
                    style={{
                      borderColor: currentBand.color,
                      color: currentBand.color,
                      backgroundColor: `${currentBand.color}10`,
                    }}
                  >
                    {tr ? 'Bant' : 'Band'} {currentBand.bandIndex}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  📍 {tr ? 'Bulunduğunuz Yer' : 'You Are Here'}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentBand.description}
            </p>

            <div className="flex flex-wrap gap-2.5">
              {priceLabels.map(item => (
                <div
                  key={item.label}
                  className="bg-muted/40 backdrop-blur-sm rounded-lg px-3.5 py-2.5 border border-border/10"
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5 font-medium">
                    {item.label}
                  </p>
                  <p className="text-sm font-bold text-foreground font-mono tabular-nums">
                    ${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center sm:min-w-[140px]">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-105"
              style={{
                backgroundColor: `${currentBand.color}12`,
                border: `2px solid ${currentBand.color}30`,
                boxShadow: `0 8px 24px ${currentBand.color}15`,
              }}
            >
              {isBullish ? (
                <TrendingUp className="w-10 h-10" style={{ color: currentBand.color }} />
              ) : isBearish ? (
                <TrendingDown className="w-10 h-10" style={{ color: currentBand.color }} />
              ) : (
                <Minus className="w-10 h-10" style={{ color: currentBand.color }} />
              )}
            </div>
            <span
              className="text-sm font-bold tracking-wide uppercase"
              style={{ color: currentBand.color }}
            >
              {action}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
