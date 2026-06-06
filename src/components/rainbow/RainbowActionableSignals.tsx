import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from "@/components/LocalizedLink";
import { ArrowRight, TrendingUp, Shield, AlertTriangle, CircleAlert } from 'lucide-react';
import { CurrentBandResult } from '@/services/rainbowChartService';
import { useLanguage } from '@/contexts/LanguageContext';

interface RainbowActionableSignalsProps {
  currentBand: CurrentBandResult;
}

interface SignalConfig {
  icon: React.ElementType;
  title: string;
  message: string;
  links: { label: string; path: string }[];
}

function getSignalConfig(bandIndex: number, tr: boolean): SignalConfig {
  if (bandIndex <= 2) {
    return {
      icon: TrendingUp,
      title: tr ? 'Güçlü Alım Fırsatı' : 'Strong Buying Opportunity',
      message: tr
        ? 'Gökkuşağı Grafiği Bitcoin\'in önemli ölçüde düşük değerlendirildiğini gösteriyor. Tarihsel olarak bu bölgede alım, en yüksek uzun vadeli getirileri sağlamıştır.'
        : 'The Rainbow Chart suggests Bitcoin is significantly undervalued. Historically, buying in this zone has yielded the highest long-term returns.',
      links: [
        { label: tr ? 'DCA\'ya Başla' : 'Start Dollar-Cost Averaging', path: tr ? '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' : '/calculators/dca' },
        { label: tr ? 'Tasarruf Planı Oluştur' : 'Begin Your Savings Plan', path: tr ? '/tr/hesaplayicilar/bitcoin-birikim-hesaplayicisi' : '/calculators/bitcoin-savings' },
      ],
    };
  }
  if (bandIndex <= 4) {
    return {
      icon: TrendingUp,
      title: tr ? 'Birikim Bölgesi' : 'Accumulation Zone',
      message: tr
        ? 'Bitcoin uzun vadeli büyüme ortalamasının altında veya yakınında. Pozisyonunuzu korumak veya kademeli olarak biriktirmeye devam etmek için iyi bir zaman.'
        : 'Bitcoin is below or near its long-term growth average. A good time to hold your position or continue accumulating gradually.',
      links: [
        { label: tr ? 'Büyümeyi Öngör' : 'Project Your Growth', path: tr ? '/tr/hesaplayicilar/bitcoin-yatirim-hesaplayicisi' : '/calculators/investment' },
        { label: tr ? 'HODL Stratejisini İncele' : 'Review HODL Strategy', path: tr ? '/tr/hesaplayicilar/bitcoin-hodl-stratejisi' : '/calculators/hodl-strategy' },
      ],
    };
  }
  if (bandIndex <= 5) {
    return {
      icon: Shield,
      title: tr ? 'Orta Aralık — Tut ve İzle' : 'Mid-Range — Hold & Monitor',
      message: tr
        ? 'Bitcoin Gökkuşağı Grafiğine göre adil değerinde. Mevcut stratejinizi sürdürün ve değişiklikler için izleyin.'
        : 'Bitcoin is at fair value according to the Rainbow Chart. Continue your existing strategy and monitor for changes.',
      links: [
        { label: tr ? 'Piyasa Duyarlılığını Kontrol Et' : 'Check Market Sentiment', path: tr ? '/tr/hesaplayicilar/bitcoin-korku-acgozluluk' : '/calculators/fear-greed-index' },
        { label: tr ? 'Stratejini Gözden Geçir' : 'Review Your Strategy', path: tr ? '/tr/hesaplayicilar/bitcoin-hodl-stratejisi' : '/calculators/hodl-strategy' },
      ],
    };
  }
  if (bandIndex <= 7) {
    return {
      icon: AlertTriangle,
      title: tr ? 'Dikkatli Olun' : 'Exercise Caution',
      message: tr
        ? 'Bitcoin üst bantlara giriyor. Büyük yeni alımlarda dikkatli olun. Kısmi kar almayı değerlendirin.'
        : 'Bitcoin is entering the upper bands. Exercise caution with large new purchases. Consider taking partial profits.',
      links: [
        { label: tr ? 'Kazançlarını Kontrol Et' : 'Check Your Gains', path: tr ? '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi' : '/calculators/profit-loss' },
        { label: tr ? 'Piyasa Duyarlılığını Kontrol Et' : 'Check Market Sentiment', path: tr ? '/tr/hesaplayicilar/bitcoin-korku-acgozluluk' : '/calculators/fear-greed-index' },
      ],
    };
  }
  return {
    icon: CircleAlert,
    title: tr ? 'Aşırı Aşırı Değerleme' : 'Extreme Overvaluation',
    message: tr
      ? 'Gökkuşağı Grafiği Bitcoin\'in aşırı üst bantlarda olduğunu gösteriyor. Tarihsel olarak bu, önemli düzeltmelerin habercisi olmuştur. Kar almayı güçlü biçimde düşünün.'
      : 'The Rainbow Chart shows Bitcoin in the extreme upper bands. Historically, this has preceded significant corrections. Strongly consider taking profits.',
    links: [
      { label: tr ? 'Riskinizi Kontrol Edin' : 'Check Your Risk', path: tr ? '/tr/hesaplayicilar/bitcoin-tasfiye' : '/calculators/leverage-liquidation' },
      { label: tr ? 'Kar & Zarar Hesapla' : 'Calculate Profit & Loss', path: tr ? '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi' : '/calculators/profit-loss' },
    ],
  };
}

export const RainbowActionableSignals: React.FC<RainbowActionableSignalsProps> = ({ currentBand }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const signal = getSignalConfig(currentBand.bandIndex, tr);
  const Icon = signal.icon;

  return (
    <Card
      className="border-border/20 overflow-hidden relative bg-card shadow-card transition-all duration-300 hover:shadow-lift"
      style={{ backgroundColor: `${currentBand.color}05` }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: currentBand.color }} />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ background: `radial-gradient(ellipse at left, ${currentBand.color}, transparent 60%)` }} />

      <CardContent className="p-5 sm:p-6 relative">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ backgroundColor: `${currentBand.color}12`, boxShadow: `0 4px 14px ${currentBand.color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: currentBand.color }} />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-h3 font-bold text-foreground mb-1">{signal.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{signal.message}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {signal.links.map(link => (
                <Button key={link.path} asChild variant="outline" size="sm" className="text-xs h-8 hover:bg-primary/5 transition-all duration-200">
                  <Link to={link.path}>
                    {link.label}
                    <ArrowRight className="w-3 h-3 ml-1.5" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
