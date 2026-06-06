import { Bitcoin, SlidersHorizontal, Calculator, FileText } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const StakingHowToUse = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Bitcoin, title: 'BTC Miktarınızı Girin', description: 'Bitcoin anaparanızı yazın veya hızlı hazır ayarları (0,1 / 0,5 / 1 / 5 BTC) kullanın.' },
    { icon: SlidersHorizontal, title: 'Stake Etme Protokolü Seçin', description: 'Babylon (yerel, saklı olmayan), Lido wBTC (DeFi) veya Binance Earn arasından seçin. Her kart canlı APY ve risk seviyesini gösterir.' },
    { icon: Calculator, title: 'Süre ve Bileşimi Belirleyin', description: 'Süreyi 1–10 yıl arasında ayarlayın. Yıllık Bileşik ve Basit Faiz arasında geçiş yapın.' },
    { icon: FileText, title: 'Ödülleri İnceleyin ve Karşılaştırın', description: 'Kazanılan BTC, son bakiye ve USD değerini okuyun; tüm protokolleri tabloda karşılaştırın.' },
  ] : [
    { icon: Bitcoin, title: 'Enter Your BTC Amount', description: 'Type your Bitcoin principal or use the quick presets — 0.1, 0.5, 1, or 5 BTC.' },
    { icon: SlidersHorizontal, title: 'Choose a Staking Protocol', description: 'Select Babylon (native, non-custodial), Lido wBTC (DeFi), or Binance Earn. Each card shows live APY and risk level.' },
    { icon: Calculator, title: 'Set Duration & Compounding', description: 'Slide the duration from 1 to 10 years. Toggle between Annual Compound and Simple Interest.' },
    { icon: FileText, title: 'Review Rewards & Compare', description: 'Read the rewards breakdown — BTC earned, final balance, USD value — and compare protocols side-by-side.' },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Kullanılır' : 'How to Use'}
      title={tr ? 'Stake Ödüllerinizi 4 Adımda Hesaplayın' : 'Calculate Your Staking Rewards in 4 Steps'}
      lead={tr
        ? 'Kayıt gerekmez. Kamuya doğrulanmış APY verileriyle tamamen tarayıcınızda çalışır.'
        : 'No sign-up required. Runs entirely in your browser using publicly verified APY data.'}
      steps={steps}
      columns={4}
    />
  );
};
