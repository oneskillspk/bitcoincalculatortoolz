import { Wallet, SlidersHorizontal, Calendar, Trophy } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const SavingsHowItWorksSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Wallet, title: 'Gelirinizi Girin', description: 'Maaş veya gelir tutarınızı girin ve ne sıklıkla maaş aldığınızı seçin: haftalık, iki haftada bir veya aylık.' },
    { icon: SlidersHorizontal, title: 'Tasarruf Tutarını Belirleyin', description: 'Bitcoin tasarrufu için sabit bir dolar tutarı veya gelirinizin bir yüzdesi seçin.' },
    { icon: Calendar, title: 'Zaman Ufkunuzu Seçin', description: '6 aydan 5 yıla kadar muhafazakâr, orta ve iyimser büyüme senaryolarıyla projeksiyonları görün.' },
    { icon: Trophy, title: 'Kilometre Taşlarını Takip Edin', description: 'Tahmini Bitcoin birikimini görüntüleyin, geleneksel tasarruflarla karşılaştırın ve temel sahiplik kilometre taşlarını takip edin.' },
  ] : [
    { icon: Wallet, title: 'Enter Your Income', description: 'Input your salary or income amount and select how often you get paid — weekly, biweekly, or monthly.' },
    { icon: SlidersHorizontal, title: 'Set Your Savings Amount', description: 'Choose a fixed dollar amount or a percentage of your income to allocate to Bitcoin savings.' },
    { icon: Calendar, title: 'Choose Your Time Horizon', description: 'See projections from 6 months to 5 years with conservative, moderate, or optimistic growth scenarios.' },
    { icon: Trophy, title: 'Track Your Milestones', description: 'View your projected Bitcoin accumulation, compare with traditional savings, and track key ownership milestones.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Bitcoin Tasarruf Planlayıcısı' : 'Plan Your Bitcoin Savings'}
      lead={tr
        ? 'Bitcoin tasarrufunuzu dört basit adımda planlayın.'
        : 'Plan your Bitcoin savings in four simple steps.'}
      steps={steps}
    />
  );
};
