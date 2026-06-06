import { Plus, Eye, ArrowRightLeft, Download } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const PortfolioHowToUse = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Plus, title: 'Varlıklarınızı Ekleyin', description: 'Her alımı BTC miktarı, coin başına fiyat, isteğe bağlı etiket ve tarihle ekleyin.' },
    { icon: Eye, title: 'Canlı Portföy Değerini Görüntüleyin', description: 'Toplam varlık, canlı değer, ortalama alış fiyatı ve gerçekleşmemiş kâr/zarar.' },
    { icon: ArrowRightLeft, title: 'Para Birimini Değiştirin', description: '100\'den fazla para biriminden seçin (USD, PKR, INR, GBP, EUR, AED…) — tüm değerler otomatik dönüşür.' },
    { icon: Download, title: 'Dışa Aktarın veya Planlayın', description: "Portföyü CSV indirin, farklı BTC fiyatlarında 'Ya Olsaydı' senaryoları çalıştırın." },
  ] : [
    { icon: Plus, title: 'Add Your Holdings', description: 'Enter each purchase with BTC amount, price paid, an optional label, and date.' },
    { icon: Eye, title: 'View Live Portfolio Value', description: 'Total holdings, live value, average buy price, and unrealized profit or loss.' },
    { icon: ArrowRightLeft, title: 'Switch Currency', description: 'Select from 100+ currencies (USD, PKR, INR, GBP, EUR, AED…) — all values convert automatically.' },
    { icon: Download, title: 'Export or Plan Ahead', description: "Download your portfolio as CSV and run 'What If' scenarios at different BTC prices." },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Kullanılır' : 'How to Use'}
      title={tr ? 'Bitcoin Portföy Takipçisi' : 'Bitcoin Portfolio Tracker'}
      steps={steps}
    />
  );
};
