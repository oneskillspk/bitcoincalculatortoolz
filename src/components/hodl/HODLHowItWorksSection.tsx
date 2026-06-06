import { DollarSign, Filter, BarChart3, TrendingUp, Hourglass } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const HODLHowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = [
    { icon: DollarSign, title: tr ? 'Yatırım Tutarını Belirle' : 'Set Investment Amount', description: tr ? 'Toplam yatırımınızı seçin, zaman aralığını belirleyin ve para birimini seçin.' : 'Choose your total investment, select time period, and pick your currency.' },
    { icon: Filter, title: tr ? 'Stratejileri Seç' : 'Select Strategies', description: tr ? 'HODL, haftalık/aylık DCA, düşüşten alım veya dengeleme yaklaşımlarından birini seçin.' : 'Pick from HODL, DCA weekly/monthly, Buy the Dip, or Rebalancing approaches.' },
    { icon: BarChart3, title: tr ? 'Performansı Analiz Et' : 'Analyze Performance', description: tr ? 'Tarihsel getirileri karşılaştırın, portföy büyümesini görün ve risk metriklerini değerlendirin.' : 'Compare historical returns, view portfolio growth, and assess risk metrics.' },
    { icon: TrendingUp, title: tr ? 'Stratejiyi Optimize Et' : 'Optimize Strategy', description: tr ? 'En iyi yaklaşımı belirleyin, ödünleri anlayın ve gelecekteki yatırımları planlayın.' : 'Identify the best approach, understand trade-offs, and plan future investments.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Bitcoin Alım Satım Simülatörü' : 'Bitcoin Buy & Sell Simulator'}
      lead={tr ? 'Bitcoin yatırım stratejilerini dört basit adımda karşılaştırın.' : 'Compare Bitcoin investment strategies in four simple steps.'}
      steps={steps}
      note={{
        icon: Hourglass,
        title: tr ? 'Neden Stratejileri Karşılaştırmalı?' : 'Why Compare Strategies?',
        body: tr
          ? 'Farklı stratejiler farklı yatırımcı profillerine uygundur. Tarihsel performansı anlamak, risk toleransınıza ve hedeflerinize uygun bir yaklaşım seçmenize yardımcı olur.'
          : "Different strategies suit different investor profiles. Understanding historical performance helps you choose an approach matching your risk tolerance and goals.",
      }}
    />
  );
};
