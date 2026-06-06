import { Home, Wrench, TrendingUp, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const BtcVsRealEstateHowToUse = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Home, title: 'Mülk Ayrıntılarını Girin', description: 'Mülk fiyatını, peşinat yüzdesini, ipotek oranını, kredi vadesini ve beklenen yıllık değer artışını ayarlayın.' },
    { icon: Wrench, title: 'İşletme Maliyetlerini Ekleyin', description: 'Kira getirisini, boşluk oranını, bakım maliyetlerini, emlak vergisini ve kapanış masraflarını girin.' },
    { icon: TrendingUp, title: 'Bitcoin Büyüme Oranını Belirleyin', description: 'Beklenen yıllık BTC büyüme oranınızı seçin. Tarihsel BTC YBBO\'su ~%50; muhafazakâr tahminler %20–40 kullanır.' },
    { icon: BarChart3, title: 'Sonuçları Karşılaştırın', description: 'Yan yana YYG\'yi, maliyet dökümleri ve yıllık tabloyu inceleyin. "Aynı Nakit" ve "Tam Değer" modları arasında geçiş yapın.' },
  ] : [
    { icon: Home, title: 'Enter Property Details', description: 'Set the property price, down payment percentage, mortgage rate, loan term, and expected annual appreciation.' },
    { icon: Wrench, title: 'Add Operating Costs', description: 'Input rental yield, vacancy rate, maintenance costs, property tax, and closing costs to model realistic returns.' },
    { icon: TrendingUp, title: 'Set Bitcoin Growth Rate', description: 'Choose your expected annual BTC growth rate. Historical CAGR is ~50%; conservative estimates use 20–40%.' },
    { icon: BarChart3, title: 'Compare Results', description: "Review side-by-side ROI, cost breakdowns, and the year-by-year chart. Toggle between 'Same Cash' and 'Full Value' modes." },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Kullanılır' : 'How to Use'}
      title={tr ? 'BTC ve Gayrimenkulü Karşılaştırın' : 'Compare BTC vs. Real Estate'}
      steps={steps}
    />
  );
};
