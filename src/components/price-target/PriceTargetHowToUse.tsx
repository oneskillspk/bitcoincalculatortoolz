import React from 'react';
import { ToggleLeft, Keyboard, Eye, Table2, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const PriceTargetHowToUse: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: ToggleLeft, title: 'Modunuzu Seçin', description: 'İleri Mod: varlıklarınız hedef fiyatta ne değer eder? Ters Mod: bir hedef net değer için ne kadar BTC gerekir?' },
    { icon: Keyboard, title: 'Sayılarınızı Girin', description: 'BTC tutarınızı ve hedef fiyatı (veya hedef net değer + beklenen fiyatı) girin. Sonuçlar siz yazarken güncellenir.' },
    { icon: Eye, title: 'Sonuçlarınızı Okuyun', description: 'Projeksiyonlu portföy değerini, dolar kazancını, yüzde kazancını ve para çarpanını anında görün.' },
    { icon: Table2, title: 'Senaryo Tablosunu Keşfedin', description: '$200K, $500K, $1M, $2M, $5M, $10M fiyat hedeflerinde portföy değerinizi görün. Canlı fiyata en yakın satır vurgulanır.' },
    { icon: Share2, title: 'Raporunuzu Paylaşın', description: 'Doğrudan sosyal medyada paylaşın veya PNG/PDF olarak dışa aktarın.' },
  ] : [
    { icon: ToggleLeft, title: 'Choose Your Mode', description: 'Forward Mode: what will my stack be worth at a target price? Reverse Mode: how much BTC do I need for a target net worth?' },
    { icon: Keyboard, title: 'Enter Your Numbers', description: 'Enter your BTC amount and a target price (or target net worth + expected price). Results update as you type.' },
    { icon: Eye, title: 'Read Your Results', description: 'See projected portfolio value, dollar gain, percentage gain, and money multiplier instantly.' },
    { icon: Table2, title: 'Explore the Scenario Table', description: 'See your portfolio value at $200K, $500K, $1M, $2M, $5M, $10M targets. The row closest to live price is highlighted.' },
    { icon: Share2, title: 'Share or Export Your Report', description: 'Post directly to Twitter/X, LinkedIn, or Reddit — or export as PNG or PDF.' },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Kullanılır' : 'How to Use'}
      title={tr ? 'Bitcoin Fiyat Hedefi Hesaplayıcısı' : 'Bitcoin Price Target Calculator'}
      steps={steps}
      columns={4}
    />
  );
};
