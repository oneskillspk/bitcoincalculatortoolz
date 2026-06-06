import { Eye, DollarSign, Pizza, Clock, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const PizzaDayHowToUse = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Eye, title: "Ünlü Pizza İşlemini Keşfedin", description: "Hero kart, Laszlo Hanyecz'in 22 Mayıs 2010'da iki pizza için harcadığı 10.000 BTC'nin gerçek zamanlı değerini gösterir." },
    { icon: DollarSign, title: "Kendi Fırsat Maliyetinizi Hesaplayın", description: "Harcadığınız miktarı, tarihi ve isteğe bağlı ürün adını girin — alternatif BTC alımı ve bugünkü değeri görün." },
    { icon: Pizza, title: "Pizza Endeksi Grafiğine Göz Atın", description: "Bir Bitcoin'in her yıl kaç 20 $'lık pizza satın alabileceğini gösteren alan grafiği." },
    { icon: Clock, title: "Pizza Günü Zaman Çizelgesi", description: "Laszlo'nun 2010 forum gönderisinden 2025'te BTC'nin 100K $'ı aşmasına kadar tam hikaye." },
    { icon: Lightbulb, title: "Pizza Günü Neden Önemli", description: "İlk bilinen ticari Bitcoin işleminin yıl dönümü — fırsat maliyeti dersini kendi kararlarınıza uygulayın." },
  ] : [
    { icon: Eye, title: "Explore the Famous Pizza Transaction", description: "The hero card shows the real-time value of the original 10,000 BTC Laszlo Hanyecz spent on two pizzas on May 22, 2010." },
    { icon: DollarSign, title: "Calculate Your Own Opportunity Cost", description: "Enter your amount, date, and an optional item name — see the alternative BTC purchase and what it would be worth today." },
    { icon: Pizza, title: "Browse the Pizza Index Chart", description: "An area chart showing how many $20 pizzas one Bitcoin could buy each year." },
    { icon: Clock, title: "Follow the Pizza Day Timeline", description: "The complete story — from Laszlo's 2010 BitcoinTalk post through Bitcoin surpassing $100,000 in 2025." },
    { icon: Lightbulb, title: "Why Pizza Day Matters", description: "The anniversary of the first known commercial Bitcoin transaction — apply the opportunity cost lesson to your own decisions." },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Kullanılır' : 'How to Use'}
      title={tr ? 'Bitcoin Pizza Günü Hesaplayıcısı' : 'Bitcoin Pizza Day Calculator'}
      steps={steps}
      columns={4}
    />
  );
};
