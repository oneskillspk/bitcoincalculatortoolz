import { User, Award, TrendingUp, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const AccumulationHowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: User, title: 'Yaşınızı Girin', description: 'Kaydırıcıyı kullanın veya mevcut yaşınızı yazın (13–83).' },
    { icon: Award, title: 'Notunuzu Görün', description: 'BTC varlıklarınıza göre yaşa uyarlanmış hedefle karşılaştırılmış harf notunuzu alın (A+\'dan F\'ye).' },
    { icon: TrendingUp, title: 'Eğriyi Keşfedin', description: 'Yaşam döngüsü çan eğrisini görüntüleyin ve birikim yolculuğunda nerede durduğunuzu görün.' },
    { icon: Calendar, title: 'DCA\'nızı Planlayın', description: 'Notunuzu iyileştirmek için gereken aylık DCA tutarını hesaplamak üzere yetişme planlayıcısını kullanın.' },
  ] : [
    { icon: User, title: 'Enter Your Age', description: 'Use the slider or type your current age (13–83).' },
    { icon: Award, title: 'See Your Grade', description: 'Get your letter grade (A+ to F) based on your BTC holdings vs age target.' },
    { icon: TrendingUp, title: 'Explore the Curve', description: 'View the lifecycle bell curve and see where you stand on the accumulation journey.' },
    { icon: Calendar, title: 'Plan Your DCA', description: 'Use the catch-up planner to calculate the monthly DCA needed to improve your grade.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Bitcoin Birikim Skoru Hesaplayıcısı Nasıl Kullanılır' : 'How to Use the Bitcoin Accumulation Score Calculator'}
      steps={steps}
    />
  );
};
