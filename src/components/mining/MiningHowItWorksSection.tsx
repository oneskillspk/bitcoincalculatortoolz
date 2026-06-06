import { Pickaxe, Zap, Calculator, TrendingUp } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const MiningHowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Pickaxe, title: 'Donanımınızı Seçin', description: 'Antminer S21 gibi popüler ASIC madencilerden seçin veya hash hızı ve güç tüketimi dahil özel spesifikasyonlar girin.' },
    { icon: Zap, title: 'İşletme Maliyetlerini Girin', description: 'Madencilik operasyonunuz için doğru maliyet projeksiyonları elde etmek amacıyla elektrik oranınızı, havuz ücretlerini ve donanım yatırımınızı girin.' },
    { icon: Calculator, title: 'Kârlılığı Hesaplayın', description: 'Algoritmamız mempool.space\'ten canlı ağ zorluğunu çeker ve doğru kâr tahminleri hesaplamak için güncel blok ödülü verilerini kullanır.' },
    { icon: TrendingUp, title: 'Projeksiyonları Analiz Edin', description: 'Zorluk artışlarını, başabaş analizini, YYG hesaplamalarını ve verimlilik metriklerini hesaba katan 12 aylık projeksiyonları görün.' },
  ] : [
    { icon: Pickaxe, title: 'Select Your Hardware', description: 'Choose from popular ASIC miners like Antminer S21 or enter custom specifications including hash rate and power consumption.' },
    { icon: Zap, title: 'Enter Operating Costs', description: 'Input your electricity rate, pool fees, and hardware investment to get accurate cost projections for your mining operation.' },
    { icon: Calculator, title: 'Calculate Profitability', description: "Our algorithm fetches live network difficulty from mempool.space and uses current block reward data to calculate accurate profit estimates." },
    { icon: TrendingUp, title: 'Analyze Projections', description: 'View 12-month projections accounting for difficulty increases, break-even analysis, ROI calculations, and efficiency metrics.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Madencilik Kârlarını 4 Kolay Adımda Hesaplayın' : 'Calculate Mining Profits in 4 Easy Steps'}
      lead={tr
        ? 'Bitcoin madencilik hesaplayıcımız, doğru kârlılık tahminleri sağlamak için gerçek ağ verilerini ve özel girdilerinizi kullanır.'
        : 'Our Bitcoin mining calculator uses real network data and your specific inputs to provide accurate profitability estimates.'}
      steps={steps}
      note={{
        icon: Pickaxe,
        title: tr ? "mempool.space'ten Canlı Ağ Verisi" : 'Live Network Data from mempool.space',
        body: tr
          ? 'Hesaplayıcımız, canlı ağ zorluğunu, hash hızını ve bir sonraki ayarlama tahminlerini doğrudan mempool.space API\'sinden çeker. Gerçekçi uzun vadeli tahminler için ayarlanabilir zorluk projeksiyonlarıyla 2024 yarılanması sonrası 3,125 BTC blok ödülünü kullanır.'
          : 'Our calculator fetches live network difficulty, hashrate, and next adjustment estimates directly from mempool.space API. It uses the post-2024 halving block reward of 3.125 BTC with adjustable difficulty projections for realistic long-term forecasts.',
      }}
    />
  );
};
