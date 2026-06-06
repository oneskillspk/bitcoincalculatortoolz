import { CalendarDays, CircleDollarSign, LineChart, Share2 } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const TimeMachineHowToUse = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: CalendarDays, title: "Tarihsel bir Bitcoin tarihi seçin", description: "Tarih seçici veya ünlü ön ayarları (Pizza Günü, COVID çöküşü, 2021 ATH, 2024 yarılanması) kullanın." },
    { icon: CircleDollarSign, title: "Yatırım tutarınızı girin", description: "100 $, 1.000 $ veya 10.000 $ gibi bir USD tutarı yazın — tarihsel fiyattaki BTC'ye dönüştürülür." },
    { icon: LineChart, title: "Canlı dönüştürülmüş sonuçları okuyun", description: "Tarihsel BTC fiyatı, satın alınan BTC, bugünün değeri, toplam kâr ve canlı fiyatla YG gösterilir." },
    { icon: Share2, title: "Karşılaştırın, dışa aktarın, paylaşın", description: "Tarihleri karşılaştırın, ünlü kilometre taşları tablosunu CSV/PDF olarak dışa aktarın ve satır bağlantılarını paylaşın." },
  ] : [
    { icon: CalendarDays, title: "Pick a historical Bitcoin date", description: "Use the date picker or famous presets — Pizza Day, the COVID crash, the 2021 ATH, the 2024 halving." },
    { icon: CircleDollarSign, title: "Enter your investment amount", description: "Type a USD amount like $100, $1,000, or $10,000 — converted into the BTC you could have bought at the historical price." },
    { icon: LineChart, title: "Read live-converted results", description: "See historical BTC price, BTC purchased, today's value, total profit, and ROI using the live Bitcoin price." },
    { icon: Share2, title: "Compare, export, share", description: "Compare dates, export the milestones table to CSV or PDF, and share row-level anchor links for specific events." },
  ];

  return (
    <StepGuide
      id="how-to-use-bitcoin-time-machine"
      title={tr
        ? "Yıla, Aya veya Tarihe Göre Bitcoin Fiyat Hesaplayıcısı"
        : "Bitcoin Price Calculator by Year, Month, or Date"}
      lead={tr
        ? "Herhangi bir tarihsel tarihteki bir Bitcoin yatırımının bugün ne değerde olacağını hesaplamak için adım adım kılavuz."
        : "A step-by-step guide for calculating what a Bitcoin investment on any historical date would be worth today."}
      steps={steps}
    />
  );
};
