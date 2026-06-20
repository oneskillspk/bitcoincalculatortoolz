import React from 'react';
import { Wallet, Repeat, Bot, Shield, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const DCAHowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Wallet, title: 'Bütçenizi Belirleyin', description: 'Düzenli olarak yatırabileceğiniz sabit bir tutar belirleyin (ör. aylık 500 $).' },
    { icon: Repeat, title: 'Sıklık Seçin', description: 'Tercihinize göre günlük, haftalık veya aylık yatırım yapmayı seçin.' },
    { icon: Bot, title: 'Alımları Otomatikleştirin', description: 'Duyguları ortadan kaldırmak ve tutarlılığı sağlamak için otomatik alımlar kurun.' },
    { icon: Shield, title: 'Tutarlı Kalın', description: 'En iyi sonuçlar için piyasanın iniş çıkışlarında stratejinizi sürdürün.' },
  ] : [
    { icon: Wallet, title: 'Set Your Budget', description: 'Decide on a fixed amount you can invest regularly (e.g., $500/month).' },
    { icon: Repeat, title: 'Choose Frequency', description: 'Select how often to invest: daily, weekly, or monthly based on your preference.' },
    { icon: Bot, title: 'Automate Purchases', description: 'Set up automatic purchases to remove emotion and ensure consistency.' },
    { icon: Shield, title: 'Stay Consistent', description: 'Continue your strategy through market ups and downs for best results.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Nasıl Çalışır' : 'How It Works'}
      lead={tr
        ? 'Sabit miktarda parayı düzenli aralıklarla yatırarak oynaklığın etkisini azaltın.'
        : 'Reduce volatility impact by investing a fixed amount at regular intervals — regardless of price.'}
      steps={steps}
      note={{
        icon: AlertTriangle,
        title: tr ? 'Eğitim Amaçlı' : 'Educational Purpose',
        body: tr
          ? 'Bu hesaplayıcı eğitim amaçlıdır. Bitcoin oldukça volatil bir varlıktır; yalnızca kaybetmeyi göze alabileceğiniz tutarlarla plan yapın.'
          : 'This calculator is for educational purposes only. Bitcoin is highly volatile — plan only with amounts you can afford to risk.',
      }}
      className="!py-0"
    />
  );
};
