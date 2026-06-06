import { Wallet, BarChart3, Trophy, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const WealthHowItWorksSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Wallet, title: 'Varlıklarınızı Girin', description: 'Canlı fiyatları kullanarak BTC, satoshi veya eşdeğer fiat değerinde ne kadar Bitcoin sahibi olduğunuzu girin.' },
    { icon: BarChart3, title: 'Yüzdelik Diliminizi Görün', description: 'Zincir üstü adres dağılımı verilerine göre Bitcoin sahiplerinin yüzde kaçını geride bıraktığınızı anında keşfedin.' },
    { icon: Trophy, title: 'Kademenizi Keşfedin', description: 'Hangi sahibi kategorisine ait olduğunuzu öğrenin (Karides, Yengeç, Balık, Yunus, Köpekbalığı veya Balina).' },
    { icon: Share2, title: 'Hedef Belirleyin ve Paylaşın', description: 'Bir sonraki kademenizi planlamak için kilometre taşı takipçisini kullanın, ardından sonucunuzu gizlilik kontrolleriyle sosyal medyada paylaşın.' },
  ] : [
    { icon: Wallet, title: 'Enter Your Holdings', description: 'Input how much Bitcoin you own in BTC, satoshis, or the equivalent fiat value using live prices.' },
    { icon: BarChart3, title: 'See Your Percentile', description: 'Instantly discover what percentage of Bitcoin holders you outrank based on on-chain address distribution data.' },
    { icon: Trophy, title: 'Explore Your Tier', description: 'Learn which holder category you belong to (Shrimp, Crab, Fish, Dolphin, Shark, or Whale) with educational context.' },
    { icon: Share2, title: 'Set Goals & Share', description: 'Use the milestone tracker to plan your next tier, then share your result on social media with privacy controls.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Bitcoin Servet Yüzdeliğiniz' : 'Discover Your Bitcoin Wealth Ranking'}
      lead={tr
        ? 'Bitcoin servet sıralamanızı dört basit adımda keşfedin.'
        : 'Discover your Bitcoin wealth ranking in four simple steps.'}
      steps={steps}
    />
  );
};
