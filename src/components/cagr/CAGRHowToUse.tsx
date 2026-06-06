import { DollarSign, BarChart3, TrendingUp, Download } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const CAGRHowToUse = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: DollarSign, title: 'Yatırımınızı Belirleyin', description: 'Yatırım tutarınızı girin ve projeksiyon dönemini (1–20 yıl) seçin.' },
    { icon: BarChart3, title: 'Karşılaştırılacak Varlıkları Seçin', description: 'Bitcoin, Altın, S&P 500 ve Gayrimenkul arasından seçin — istediğiniz kombinasyonu açıp kapatın.' },
    { icon: TrendingUp, title: 'BYBBO ve Projeksiyonları İnceleyin', description: "Her varlığın tarihsel BYBBO'sunu, tahmini değerini, toplam getiriyi, volatiliteyi ve maksimum düşüşü görün." },
    { icon: Download, title: 'Raporunuzu Dışa Aktarın', description: 'BYBBO analizinizi paylaşmak veya saklamak için PNG/PDF rapor indirin.' },
  ] : [
    { icon: DollarSign, title: 'Set Your Investment', description: 'Enter your investment amount and select the projection period (1–20 years).' },
    { icon: BarChart3, title: 'Choose Assets to Compare', description: 'Select Bitcoin, Gold, S&P 500, and Real Estate. Toggle any combination.' },
    { icon: TrendingUp, title: 'Review CAGR & Projections', description: "See each asset's historical CAGR, projected value, total return, volatility, and max drawdown." },
    { icon: Download, title: 'Export Your Report', description: 'Download a PNG or PDF report of your CAGR analysis.' },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Kullanılır' : 'How to Use'}
      title={tr ? 'BYBBO Hesaplayıcısı' : 'CAGR Calculator'}
      steps={steps}
    />
  );
};
