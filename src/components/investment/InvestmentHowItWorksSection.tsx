import { DollarSign, SlidersHorizontal, Calendar, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const InvestmentHowItWorksSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: DollarSign, title: 'Yatırımınızı Girin', description: 'Tek seferlik tutar, aylık düzenli tutar veya her ikisini girin. Hesap makinesi gerçek yatırım planınıza uyacak şekilde herhangi bir kombinasyonu işler.' },
    { icon: SlidersHorizontal, title: 'Büyüme Modeli Seçin', description: 'Muhafazakâr (%10), Orta (%25), Agresif (%50) seçin ya da kendi özel yıllık büyüme oranınızı (BYBBO) belirleyin.' },
    { icon: Calendar, title: 'Zaman Ufkunuzu Belirleyin', description: '1 yıldan 20 yıla kadar projeksiyonlar görün. Daha uzun vadeler, tutarlı yatırımın bileşik etkisini ortaya koyar.' },
    { icon: BarChart3, title: 'Karşılaştırın ve Karar Verin', description: 'Tahmini Bitcoin getirilerinizi S&P 500, Altın ve tasarruf hesaplarıyla yan yana görerek bilinçli bir karar alın.' },
  ] : [
    { icon: DollarSign, title: 'Enter Your Investment', description: 'Input a lump sum, a recurring monthly amount, or both. Our calculator handles any combination to match your real investment plan.' },
    { icon: SlidersHorizontal, title: 'Choose a Growth Model', description: 'Select Conservative (10%), Moderate (25%), Aggressive (50%), or define your own custom annual growth rate (CAGR).' },
    { icon: Calendar, title: 'Set Your Time Horizon', description: 'See projections from 1 to 20 years into the future. Longer horizons show the compounding effect of consistent investing.' },
    { icon: BarChart3, title: 'Compare and Decide', description: 'View your projected Bitcoin returns vs. S&P 500, Gold, and savings accounts side-by-side to make an informed decision.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Bitcoin ROI Hesaplayıcı — Getirilerinizi Hesaplayın' : 'Bitcoin ROI Calculator — Calculate Your Returns'}
      lead={tr ? 'Bitcoin yatırımınızı dört basit adımda modelleyin.' : 'Model your Bitcoin investment in four simple steps.'}
      steps={steps}
    />
  );
};
