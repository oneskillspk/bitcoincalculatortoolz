import { Gauge, BarChart3, History, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const FearGreedHowItWorksSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Gauge, title: 'Duyguyu Kontrol Edin', description: 'Canlı göstergemiz, Aşırı Korku\'dan Aşırı Açgözlülük\'e gerçek zamanlı sınıflandırmayla bugünün Korku & Açgözlülük Endeksi değerini (0-100) gösterir.' },
    { icon: BarChart3, title: 'Trendi İnceleyin', description: '7 gün, 30 gün veya 1 yıl boyunca duygunun fiyat hareketleriyle nasıl ilişkilendiğini görmek için Bitcoin fiyat katmanıyla geçmiş grafiği inceleyin.' },
    { icon: History, title: 'Sonuçları Analiz Edin', description: 'Bitcoin\'in fiyatına benzer Korku & Açgözlülük seviyelerine ulaşmasından 7, 30 ve 90 gün sonra tarihsel olarak ne olduğunu görün.' },
    { icon: Lightbulb, title: 'Harekete Geçin', description: 'DCA, Yatırım ve Tasarruf hesaplayıcılarınıza bağlı bağlamsal önerilerimizi kullanarak bilinçli kararlar verin.' },
  ] : [
    { icon: Gauge, title: 'Check the Sentiment', description: "Our live gauge shows today's Fear & Greed Index value (0-100) with real-time classification from Extreme Fear to Extreme Greed." },
    { icon: BarChart3, title: 'Study the Trend', description: 'Review the historical chart with Bitcoin price overlay to see how sentiment correlates with price movements over 7 days, 30 days, or 1 year.' },
    { icon: History, title: 'Analyze Outcomes', description: "See what historically happened to Bitcoin's price 7, 30, and 90 days after reaching similar Fear & Greed levels." },
    { icon: Lightbulb, title: 'Take Action', description: 'Use our contextual recommendations linked to your DCA, Investment, and Savings calculators to make informed decisions.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Korku & Açgözlülük Endeksi Nasıl Kullanılır' : 'How to Use the Fear & Greed Index'}
      lead={tr
        ? 'Bitcoin stratejinizi bilgilendirmek için Korku & Açgözlülük Endeksini dört basit adımda kullanın.'
        : 'Use the Fear & Greed Index in four simple steps to inform your Bitcoin strategy.'}
      steps={steps}
    />
  );
};
