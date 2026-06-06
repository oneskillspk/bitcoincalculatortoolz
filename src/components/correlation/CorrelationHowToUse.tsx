import { Calendar, Grid3x3, LineChart, ScatterChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const CorrelationHowToUse = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Calendar, title: 'Zaman Dilimi Seçin', description: 'Farklı piyasa döngüleri için 30g, 90g, 1y veya 3y seçin.' },
    { icon: Grid3x3, title: 'Korelasyon Matrisini Okuyun', description: 'Isı haritası Pearson katsayılarını gösterir. +1 birlikte, −1 zıt, 0 ilişki yok anlamına gelir.' },
    { icon: LineChart, title: 'Değişken Korelasyonu Takip Edin', description: "Bitcoin'in her varlıkla korelasyonu dönem boyunca nasıl evrildi? Rejim değişimlerini arayın." },
    { icon: ScatterChart, title: 'Dağılım Grafiğini Keşfedin', description: 'Sıkı yukarı küme = güçlü pozitif korelasyon. Bulut şekli = düşük korelasyon — çeşitlendirme için kullanışlı.' },
  ] : [
    { icon: Calendar, title: 'Choose a Time Period', description: 'Select 30d, 90d, 1y, or 3y to see how correlations shift across market cycles.' },
    { icon: Grid3x3, title: 'Read the Correlation Matrix', description: 'The heatmap shows Pearson coefficients. +1 = move together, −1 = move opposite, 0 = no linear relationship.' },
    { icon: LineChart, title: 'Track Rolling Correlation', description: "How has Bitcoin's correlation with each asset evolved? Look for regime shifts." },
    { icon: ScatterChart, title: 'Explore the Scatter Plot', description: 'Tight upward cluster = strong positive correlation. Cloud shape = low correlation — useful for diversification.' },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Kullanılır' : 'How to Use'}
      title={tr ? 'Bitcoin Korelasyon Hesaplayıcısı' : 'Bitcoin Correlation Calculator'}
      steps={steps}
    />
  );
};
