import React from 'react';
import { Calculator, TrendingUp, PiggyBank, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const RetirementHowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Calculator, title: 'Büyüme Modelleme', description: 'Portföyünüzü bileşik yıllık büyüme oranları (BYBBO) ve düzenli alımla yatırım zaman çizelgenize göre projelendirir.' },
    { icon: TrendingUp, title: 'Para Çekme Stratejileri', description: 'İki yaklaşımı modeller: Temkinli (emeklilikte hepsini sat) ve Optimize (emeklilikte BTC tutmaya devam et).' },
    { icon: PiggyBank, title: 'Enflasyon Ayarlamaları', description: 'Tüm para çekme tutarları bugünün dolarlarıyla değerleri göstermek için satın alma gücüne göre ayarlanır.' },
  ] : [
    { icon: Calculator, title: 'Growth Modeling', description: 'Projects your portfolio using compound annual growth rates (CAGR) and dollar-cost averaging over your investment timeline.' },
    { icon: TrendingUp, title: 'Withdrawal Strategies', description: 'Models two approaches: Conservative (sell all at retirement) and Optimized (maintain Bitcoin during retirement).' },
    { icon: PiggyBank, title: 'Inflation Adjustments', description: "All withdrawal amounts are adjusted for purchasing power to show values in today's dollars for realistic planning." },
  ];

  return (
    <StepGuide
      title={tr ? 'Nasıl Çalışır' : 'How It Works'}
      lead={tr
        ? 'Bileşik büyüme ve para çekme stratejisi varsayımlarıyla gelişmiş finansal modelleme.'
        : 'Advanced financial modeling using compound growth rates and withdrawal strategy assumptions.'}
      steps={steps}
      note={{
        icon: AlertTriangle,
        title: tr ? 'Eğitim Amaçlı' : 'Educational Purpose',
        body: tr
          ? 'Bu hesaplayıcı eğitim amaçlıdır. Bitcoin oldukça volatil ve spekülatif bir varlıktır; emeklilik stratejinizi çeşitlendirin ve nitelikli bir finans uzmanına danışın.'
          : 'This calculator is for educational purposes only. Bitcoin is a highly volatile and speculative asset — diversify your retirement strategy and consult a qualified financial professional.',
      }}
    />
  );
};
