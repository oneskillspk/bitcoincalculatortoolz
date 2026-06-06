import { Bitcoin, Search, Calculator, Share2 } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const PurchasingPowerHowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Bitcoin, title: 'Bitcoin Miktarınızı Girin', description: 'Gerçek zamanlı dönüşümle BTC varlıklarınızı veya eşdeğer fiat değerinizi girin.' },
    { icon: Search, title: 'Para Biriminizi Seçin', description: 'Doğru bölgesel fiyatlandırma için tercih ettiğiniz para birimini seçin.' },
    { icon: Calculator, title: 'Satın Alma Gücünü Hesaplayın', description: 'Kategoriler genelinde hangi ürünleri satın alabileceğinizin anında hesaplanmasını alın.' },
    { icon: Share2, title: 'Keşfet ve Filtrele', description: 'Kategoriye göre göz atın, ürünleri arayın ve Bitcoin\'inizin gerçek değerini anlayın.' },
  ] : [
    { icon: Bitcoin, title: 'Enter Your Bitcoin Amount', description: 'Input your BTC holdings or equivalent fiat value with real-time conversion.' },
    { icon: Search, title: 'Select Your Currency', description: 'Choose your preferred currency for accurate regional pricing.' },
    { icon: Calculator, title: 'Calculate Purchasing Power', description: 'Get instant calculation of what items you can purchase across categories.' },
    { icon: Share2, title: 'Explore & Filter', description: "Browse by category, search items, and understand your Bitcoin's real value." },
  ];

  return (
    <StepGuide
      title={tr ? 'Dört Basit Adım' : 'Four Simple Steps'}
      lead={tr
        ? 'Bitcoin\'inizin gerçek dünya satın alma gücünü hesaplayıcımızla anlamak kolaydır.'
        : "Understanding your Bitcoin's real-world purchasing power is easy with our calculator."}
      steps={steps}
      note={{
        icon: Bitcoin,
        title: tr ? 'Satın Alma Gücü Neden Önemlidir' : 'Why Purchasing Power Matters',
        body: tr
          ? 'Bitcoin\'in satın alma gücünü anlamak, varlıklarınızın gerçekte ne satın alabileceğini göstererek bilinçli kararlar almanıza yardımcı olur. Bu hesap makinesi soyut sayıları somut mal ve hizmetlere çevirerek Bitcoin yatırımlarınızın gerçek dünya değerini kavramayı kolaylaştırır.'
          : "Understanding Bitcoin's purchasing power helps you make informed decisions by showing what your holdings can actually buy. This calculator translates abstract numbers into tangible goods and services, making it easier to grasp the real-world value of your Bitcoin investments.",
      }}
    />
  );
};
