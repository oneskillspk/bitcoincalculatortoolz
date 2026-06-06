import { Search, BarChart2, AlertCircle, BookOpen } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const OnChainHowToUse = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Search, title: 'Canlı Metrikleri Görüntüleyin', description: "Kontrol paneli canlı MVRV oranını, S2F sapmasını, hash hızını ve aktif adres verilerini CoinGecko'dan otomatik yükler." },
    { icon: BarChart2, title: 'MVRV Ölçeğini Okuyun', description: "1,0'ın altı tarihsel olarak değersiz. 3,5'in üstü tarihsel olarak döngü zirvelerine yakın aşırı değerleme." },
    { icon: AlertCircle, title: 'S2F Sapmasını Kontrol Edin', description: 'Fiyat S2F model fiyatının üzerindeyse aşırı ısınmaya işaret edebilir. Model altı = potansiyel değer bölgesi.' },
    { icon: BookOpen, title: 'Tek Sinyal Olarak Kullanın', description: 'Zincir üstü metrikler bir girdi, kristal küre değil. Korku & Açgözlülük ve Gökkuşağı ile birleştirin.' },
  ] : [
    { icon: Search, title: 'View Live Metrics', description: "The dashboard auto-loads live MVRV ratio, Stock-to-Flow deviation, hash rate, and active address data from CoinGecko." },
    { icon: BarChart2, title: 'Read the MVRV Gauge', description: "Below 1.0 = historically undervalued. Above 3.5 = historically extreme overvaluation near cycle tops." },
    { icon: AlertCircle, title: 'Check S2F Deviation', description: 'If the price is above the S2F model, it may signal overheating. Below model = potential value zone.' },
    { icon: BookOpen, title: 'Use as One Signal', description: 'On-chain metrics are one input — combine with the Fear & Greed Index and Rainbow Chart for a fuller picture.' },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Okunur' : 'How to Read'}
      title={tr ? 'Zincir Üstü Kontrol Paneli' : 'On-Chain Dashboard'}
      lead={tr ? 'Zincir üstü verileri bir profesyonel gibi yorumlamak için dört adım.' : 'Four steps to interpret on-chain data like a pro.'}
      steps={steps}
      columns={4}
    />
  );
};
