import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface CalculationProgressStagesProps {
  stage: 'fetching-current' | 'fetching-historical' | 'fetching-range' | 'calculating' | 'complete';
  progress?: number;
  className?: string;
}

export const CalculationProgressStages = ({
  stage,
  progress = 0,
  className
}: CalculationProgressStagesProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const getStageText = () => {
    switch (stage) {
      case 'fetching-current':
        return tr ? 'Güncel fiyat alınıyor...' : 'Getting current price...';
      case 'fetching-historical':
        return tr ? 'Geçmiş veriler yükleniyor...' : 'Loading historical data...';
      case 'fetching-range':
        return tr ? 'Grafik verileri hazırlanıyor...' : 'Preparing chart data...';
      case 'calculating':
        return tr ? 'Getiriler hesaplanıyor...' : 'Computing returns...';
      case 'complete':
        return tr ? 'Tamamlandı!' : 'Complete!';
      default:
        return tr ? 'İşleniyor...' : 'Processing...';
    }
  };

  return (
    <Card className={cn("glass-morphism-card border-border/30", className)}>
      <CardContent className="p-8 text-center">
        <div className="space-y-4">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-primary rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <p className="text-sm text-foreground/70">{getStageText()}</p>
            <div className="w-full bg-background/50 rounded-full h-1.5">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
