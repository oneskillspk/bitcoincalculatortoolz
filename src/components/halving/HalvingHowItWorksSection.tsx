import { Clock, BarChart3, Rocket, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const HalvingHowItWorksSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Clock, title: 'Geri Sayımı Takip Edin', description: 'Canlı geri sayımımız, 1.050.000 blokta 5. yarılanmaya kadar kalan tam blok sayısını hesaplayarak Bitcoin ağından her 60 saniyede mevcut blok yüksekliğini çeker.' },
    { icon: BarChart3, title: 'Kalıbı İnceleyin', description: 'Önceki 4 yarılanmanın her birinden sonra Bitcoin\'in fiyatının nasıl performans gösterdiğini interaktif grafikler ve ayrıntılı performans tabloları ile inceleyin.' },
    { icon: Rocket, title: 'Projeksiyonları Keşfedin', description: 'Geçmiş döngülerden muhafazakâr, ortalama ve iyimser yarılanma sonrası getirilere dayalı "Tarih Tekerrür Ederse" senaryolarını görün.' },
    { icon: Activity, title: 'Arzı İzleyin', description: 'Toplam madencilik yapılan, kalan arz, mevcut enflasyon oranı ve 2140\'a kadar ihraç takvimi dahil Bitcoin\'in gerçek zamanlı arz metriklerini takip edin.' },
  ] : [
    { icon: Clock, title: 'Track the Countdown', description: 'Our live countdown fetches the current block height from the Bitcoin network every 60 seconds, calculating the exact blocks remaining until halving #5 at block 1,050,000.' },
    { icon: BarChart3, title: 'Study the Pattern', description: "Review how Bitcoin's price performed after each of the 4 previous halvings with interactive charts and detailed performance tables." },
    { icon: Rocket, title: 'Explore Projections', description: 'See "If History Repeats" scenarios based on conservative, average, and optimistic post-halving returns from past cycles.' },
    { icon: Activity, title: 'Monitor Supply', description: "Track Bitcoin's real-time supply metrics including total mined, remaining supply, current inflation rate, and the issuance schedule through 2140." },
  ];

  return (
    <StepGuide
      title={tr ? 'Bitcoin Yarılanma Hesaplayıcısı Nasıl Kullanılır' : 'How the Bitcoin Halving Countdown Works'}
      lead={tr
        ? 'Bitcoin\'in yarılanma döngüsünü ve olası etkisini anlamak için dört adım'
        : "Four steps to understanding Bitcoin's halving cycle and its potential impact"}
      steps={steps}
    />
  );
};
