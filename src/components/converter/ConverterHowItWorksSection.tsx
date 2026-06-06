import { Globe, Keyboard, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const ConverterHowItWorksSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Globe, title: 'Para Biriminizi Seçin', description: 'Dünya genelinde 100\'den fazla fiat para birimi arasından seçin ya da varsayılan USD ile devam edin.' },
    { icon: Keyboard, title: 'Herhangi Bir Tutar Girin', description: 'BTC, mBTC, bit, satoshi veya yerel para biriminizde bir değer yazın; herhangi bir alan çalışır.' },
    { icon: Zap, title: 'Anında Sonuçları Görün', description: '30 saniyelik otomatik yenilemeyle canlı Bitcoin fiyatını kullanarak tüm dönüşümler gerçek zamanlı güncellenir.' },
  ] : [
    { icon: Globe, title: 'Select Your Currency', description: 'Choose from 100+ fiat currencies worldwide, or stick with USD as the default.' },
    { icon: Keyboard, title: 'Enter Any Amount', description: 'Type a value in BTC, mBTC, bits, satoshis, or your local currency — any field works.' },
    { icon: Zap, title: 'See Instant Results', description: 'All conversions update in real-time using the live Bitcoin price with 30-second auto-refresh.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Bitcoin Nakit Hesaplayıcı — Gerçek Zamanlı Dönüşüm' : 'Bitcoin to Cash Calculator — Real-Time Conversion'}
      lead={tr
        ? 'Tüm Bitcoin birimleri ve 100\'den fazla fiat para birimi arasında anında, çift yönlü dönüşümler'
        : 'Instant, bidirectional conversions between all Bitcoin units and 100+ fiat currencies'}
      steps={steps}
    />
  );
};
