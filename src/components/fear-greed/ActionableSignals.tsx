import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from "@/components/LocalizedLink";
import { getColor, getClassification } from '@/services/fearGreedService';
import {
  ShieldAlert,
  TrendingUp,
  BarChart3,
  Shield,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ActionableSignalsProps {
  value: number;
}

interface SignalConfig {
  icon: React.ElementType;
  message: { en: string; tr: string };
  recommendation: { en: string; tr: string };
  links: { label: { en: string; tr: string }; to: string }[];
  intensity: string;
}

function getSignalConfig(value: number): SignalConfig {
  if (value <= 20) {
    return {
      icon: ShieldAlert,
      message: { en: 'Markets are in Extreme Fear', tr: 'Piyasalar Aşırı Korku İçinde' },
      recommendation: {
        en: 'Historically, extreme fear periods have been strong buying opportunities for long-term investors. This could be a good time to start or increase your Bitcoin position through dollar-cost averaging.',
        tr: 'Tarihsel olarak, aşırı korku dönemleri uzun vadeli yatırımcılar için güçlü alım fırsatları olmuştur. Dolar maliyet ortalaması yöntemiyle Bitcoin pozisyonunuza başlamak veya artırmak için iyi bir zaman olabilir.',
      },
      links: [
        { label: { en: 'Start DCA Strategy', tr: 'DCA Stratejisi Başlat' }, to: '/calculators/dca' },
        { label: { en: 'Plan Your Savings', tr: 'Tasarruflarını Planla' }, to: '/calculators/bitcoin-savings' },
      ],
      intensity: 'high-fear',
    };
  }
  if (value <= 40) {
    return {
      icon: TrendingUp,
      message: { en: 'Market sentiment is fearful', tr: 'Piyasa Duyarlılığı Korkutucu' },
      recommendation: {
        en: 'Fear in the market often precedes recovery. Consider gradual accumulation through dollar-cost averaging or a structured investment plan to take advantage of lower prices.',
        tr: 'Piyasadaki korku genellikle toparlanmayı önceler. Düşük fiyatlardan yararlanmak için dolar maliyet ortalaması veya yapılandırılmış bir yatırım planıyla kademeli birikim yapmayı değerlendirin.',
      },
      links: [
        { label: { en: 'Investment Calculator', tr: 'Yatırım Hesaplayıcı' }, to: '/calculators/investment' },
        { label: { en: 'DCA Calculator', tr: 'DCA Hesaplayıcı' }, to: '/calculators/dca' },
      ],
      intensity: 'fear',
    };
  }
  if (value <= 60) {
    return {
      icon: BarChart3,
      message: { en: 'Sentiment is balanced and neutral', tr: 'Duyarlılık Dengeli ve Nötr' },
      recommendation: {
        en: 'A neutral market is a good time to review your portfolio strategy, rebalance holdings, and make calculated decisions without the pressure of extreme emotion.',
        tr: 'Nötr bir piyasa, portföy stratejinizi gözden geçirmek, varlıklarınızı yeniden dengelemek ve aşırı duygu baskısı olmadan hesaplı kararlar almak için iyi bir zamandır.',
      },
      links: [
        { label: { en: 'HODL Strategy', tr: 'HODL Stratejisi' }, to: '/calculators/hodl-strategy' },
        { label: { en: 'Check Profit/Loss', tr: 'Kâr/Zarar Kontrol Et' }, to: '/calculators/profit-loss' },
      ],
      intensity: 'neutral',
    };
  }
  if (value <= 80) {
    return {
      icon: Shield,
      message: { en: 'Market sentiment is greedy', tr: 'Piyasa Duyarlılığı Açgözlü' },
      recommendation: {
        en: 'When greed dominates, exercise caution with large new purchases. Consider taking partial profits, reviewing your risk exposure, and preparing for potential pullbacks.',
        tr: 'Açgözlülük hâkim olduğunda, büyük yeni alımlarda dikkatli olun. Kısmi kâr realizasyonu yapmayı, risk maruziyetinizi gözden geçirmeyi ve olası geri çekilmelere hazırlanmayı değerlendirin.',
      },
      links: [
        { label: { en: 'Profit & Loss Check', tr: 'Kâr & Zarar Kontrol' }, to: '/calculators/profit-loss' },
        { label: { en: 'Capital Gains Tax', tr: 'Sermaye Kazancı Vergisi' }, to: '/calculators/capital-gains-tax' },
      ],
      intensity: 'greed',
    };
  }
  return {
    icon: AlertTriangle,
    message: { en: 'Markets show Extreme Greed', tr: 'Piyasalar Aşırı Açgözlülük Gösteriyor' },
    recommendation: {
      en: 'Extreme greed has historically preceded corrections. Consider de-risking, checking leveraged positions, securing profits, and reviewing your exit strategy.',
      tr: 'Aşırı açgözlülük tarihsel olarak düzeltmeleri önceler. Riskinizi azaltmayı, kaldıraçlı pozisyonları kontrol etmeyi, kârları güvenceye almayı ve çıkış stratejinizi gözden geçirmeyi düşünün.',
    },
    links: [
      { label: { en: 'Check Your Risk', tr: 'Riskinizi Kontrol Edin' }, to: '/calculators/leverage-liquidation' },
      { label: { en: 'Capital Gains Tax', tr: 'Sermaye Kazancı Vergisi' }, to: '/calculators/capital-gains-tax' },
    ],
    intensity: 'high-greed',
  };
}

export const ActionableSignals: React.FC<ActionableSignalsProps> = ({ value }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const config = getSignalConfig(value);
  const color = getColor(value);
  const classification = getClassification(value);
  const Icon = config.icon;

  return (
    <Card className="border-border/20 bg-card shadow-lg overflow-hidden group">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div
            className="w-full sm:w-1.5 h-1.5 sm:h-auto flex-shrink-0 transition-all"
            style={{ backgroundColor: color }}
          />
          <div className="p-5 sm:p-6 flex-1 space-y-4">
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-foreground text-base">{tr ? config.message.tr : config.message.en}</h3>
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}25` }}
                  >
                    {value}/100
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {tr ? 'İşlem Yapılabilir Sinyal' : 'Actionable Signal'} • {classification}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {tr ? config.recommendation.tr : config.recommendation.en}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {config.links.map((link) => (
                <Button
                  key={link.to}
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs font-medium hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
                >
                  <Link to={link.to}>
                    {tr ? link.label.tr : link.label.en}
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
