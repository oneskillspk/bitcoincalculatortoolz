import { Activity, Sliders, LineChart, PieChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const DominanceHowToUse = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Activity, title: 'Canlı Hakimiyeti Görüntüleyin', description: "Bitcoin'in güncel hakimiyet yüzdesini, piyasa değerini ve fiyatını CoinGecko'dan otomatik yükler." },
    { icon: Sliders, title: 'Fiyat Senaryolarını Modelleyin', description: 'Toplam kripto piyasa değerini ve BTC hakimiyetini ayarlamak için kaydırıcıları kullanın; öngörülen fiyatı görün.' },
    { icon: LineChart, title: 'Tarihsel Eğilimleri İnceleyin', description: 'BTC hakimiyetinin 2020\'den bu yana nasıl değiştiğini görün. Yükselen hakimiyet altcoin "riskten kaçış" dönemleriyle ilişkilidir.' },
    { icon: PieChart, title: 'Tahsisinizi Bilgilendirin', description: 'BTC vs altcoin portföy tahsisine karar verirken Korku & Açgözlülük ve Gökkuşağı ile birlikte kullanın.' },
  ] : [
    { icon: Activity, title: 'View Live Dominance', description: "Auto-loads Bitcoin's current dominance percentage, market cap, and price from CoinGecko." },
    { icon: Sliders, title: 'Model Price Scenarios', description: 'Use the sliders to set a hypothetical total crypto market cap and BTC dominance; see the implied price.' },
    { icon: LineChart, title: 'Study Historical Trends', description: 'See how BTC dominance has shifted since 2020 — rising dominance often correlates with "risk-off" periods in altcoins.' },
    { icon: PieChart, title: 'Inform Your Allocation', description: 'Use dominance data alongside the Fear & Greed Index and Rainbow Chart to decide on BTC vs altcoin allocation.' },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Kullanılır' : 'How to Use'}
      title={tr ? 'Bitcoin Hakimiyet Hesaplayıcısı' : 'Bitcoin Dominance Calculator'}
      steps={steps}
    />
  );
};
