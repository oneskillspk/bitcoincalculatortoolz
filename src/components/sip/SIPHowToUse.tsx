import React from 'react';
import { Wallet, Repeat, TrendingUp, Scale, Gauge } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const SIPHowToUse: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Wallet, title: 'Aylık SIP Tutarınızı Belirleyin', description: 'Dönem başına yatırım tutarını ayarlayın ($10–$10.000). Başarının anahtarı tutarlılık.' },
    { icon: Repeat, title: 'Sıklığınızı Seçin', description: 'Haftalık, iki haftada bir veya aylık. Haftalık SIP volatiliteyi daha çok yumuşatır; aylık daha kolay yönetilir.' },
    { icon: TrendingUp, title: 'Getiri ve Süre Seçin', description: 'Beklenen yıllık getiri (%15 Muhafazakâr ile %60 Tarihsel arası) ve zaman ufkunuzu (1–10 yıl) belirleyin.' },
    { icon: Scale, title: 'SIP ile Toplu Yatırımı Karşılaştırın', description: "Yükselen piyasada toplu genelde üstündür; SIP zamanlama riskini ve duygusal stresi azaltır." },
    { icon: Gauge, title: 'Enflasyon İçin Düzeltin', description: 'Gerçek satın alma gücünü görmek için %2–8 arasında enflasyon düzeltmesini açın.' },
  ] : [
    { icon: Wallet, title: 'Set Your Monthly SIP Amount', description: 'Set the per-period amount ($10–$10,000). Consistency is the key to a successful Bitcoin SIP.' },
    { icon: Repeat, title: 'Choose Your Frequency', description: 'Weekly, biweekly, or monthly. Weekly smooths volatility further; monthly is simpler to manage.' },
    { icon: TrendingUp, title: 'Select Return & Time Period', description: 'Set expected annual return (15% Conservative to 60% Historical) and your time horizon (1–10 years).' },
    { icon: Scale, title: 'Compare SIP vs Lump Sum', description: 'In a rising market lump sum often outperforms; SIP reduces timing risk and emotional stress.' },
    { icon: Gauge, title: 'Adjust for Inflation', description: 'Toggle inflation adjustment (2–8%) to see your returns in real purchasing-power terms.' },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Kullanılır' : 'How to Use'}
      title={tr ? 'Bitcoin SIP Hesaplayıcısı' : 'Bitcoin SIP Calculator'}
      lead={tr
        ? 'Sistematik Yatırım Planı (SIP) — düzenli aralıklarla sabit miktarda yatırımla disiplinli birikim.'
        : 'A Systematic Investment Plan — disciplined accumulation by committing a fixed amount at regular intervals.'}
      steps={steps}
      columns={4}
    />
  );
};
