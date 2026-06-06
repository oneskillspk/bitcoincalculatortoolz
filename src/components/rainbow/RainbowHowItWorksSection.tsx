import { Eye, MapPin, BookOpen, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const RainbowHowItWorksSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Eye, title: 'Bantları Anlayın', description: 'Grafik, mavi ("Yangından Mal Kaçırır Gibi") ile koyu kırmızı ("Maksimum Balon") arasında farklı değerleme bölgelerini temsil eden 9 renk kodlu bant oluşturmak için logaritmik regresyon kullanır.' },
    { icon: MapPin, title: 'Konumunuzu Bulun', description: "Grafikte Bitcoin'in mevcut fiyatının şu an hangi gökkuşağı bandında yer aldığını gösteren titreşen noktayı arayın." },
    { icon: BookOpen, title: 'Bölgeyi Okuyun', description: 'Her renk bandının belirli bir anlamı vardır: mavi ve yeşil bölgeler düşük değerlemeyi, sarı adil değeri, turuncu ve kırmızı ise yüksek değerlemeyi önerir.' },
    { icon: ArrowRight, title: 'Harekete Geçin', description: 'DCA, Yatırım ve Tasarruf hesaplayıcılarımıza bağlı bölgeye özgü önerileri kullanarak bilinçli kararlar verin.' },
  ] : [
    { icon: Eye, title: 'Understand the Bands', description: 'The chart uses logarithmic regression to create 9 color-coded bands from blue ("Fire Sale") to dark red ("Maximum Bubble"), each representing a different valuation zone.' },
    { icon: MapPin, title: 'Find Your Position', description: "Look for the pulsing dot on the chart showing where Bitcoin's current price sits within the rainbow bands right now." },
    { icon: BookOpen, title: 'Read the Zone', description: 'Each color band has a specific meaning: blue and green zones suggest undervaluation, yellow is fair value, and orange to red suggests overvaluation.' },
    { icon: ArrowRight, title: 'Take Action', description: 'Use the zone-specific recommendations linked to our DCA, Investment, and Savings calculators to make informed decisions.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Gökkuşağı Grafiği Nasıl Okunur' : 'How to Read the Rainbow Chart'}
      steps={steps}
    />
  );
};
