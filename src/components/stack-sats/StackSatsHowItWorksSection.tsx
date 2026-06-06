import { Target, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const StackSatsHowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Target, title: 'Satoshi Hedefinizi Belirleyin', description: '0.01, 0.1 veya 1.0 BTC gibi popüler kademelerden birini seçin ya da finansal hedeflerinize uygun özel bir hedef belirleyin.' },
    { icon: DollarSign, title: 'Mevcut Bakiyeyi ve Aylık Bütçeyi Girin', description: 'Mevcut BTC bakiyenizi ve her ay DCA ile ne kadar düzenli yatırım yapabileceğinizi girin.' },
    { icon: TrendingUp, title: 'BTC Büyüme Senaryolarını Modelleyin', description: 'Muhafazakar (10%), orta (15%) veya iyimser (25%) zaman çizelgesi projeksiyonlarını görmek için beklenen büyüme oranını ayarlayın.' },
    { icon: BarChart3, title: 'İlerlemenizi Takip Edin ve Ayarlayın', description: 'Tahmini tamamlanma tarihini, kilometre taşı noktalarını görün ve kişiselleştirilmiş birikim planınızı dışa aktarın.' },
  ] : [
    { icon: Target, title: 'Set Your Sat Goal', description: 'Choose from popular milestones (0.01, 0.1, 1.0 BTC) or set a custom target that aligns with your financial objectives.' },
    { icon: DollarSign, title: 'Enter Current Holdings & Monthly Budget', description: 'Input your current BTC stack and how much you can consistently invest each month through dollar-cost averaging.' },
    { icon: TrendingUp, title: 'Model BTC Growth Scenarios', description: 'Adjust expected growth rate to see conservative (10%), moderate (15%), or optimistic (25%) timeline projections.' },
    { icon: BarChart3, title: 'Track Progress & Adjust', description: 'View your projected completion date, milestone checkpoints, and export your personalized accumulation plan.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Bitcoin Yolculuğunuzu Planlayın' : 'Plan Your Bitcoin Journey'}
      lead={tr
        ? 'Bitcoin birikim hedeflerinizi hassasiyetle hesaplamak ve takip etmek için dört basit adım.'
        : 'Four simple steps to calculate and track your Bitcoin accumulation goals with precision.'}
      steps={steps}
    />
  );
};
