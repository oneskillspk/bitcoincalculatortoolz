import React from 'react';
import { FileText, Calculator, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const TaxCalculatorHowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: FileText, title: 'Vergi Ayarlarını Yapılandırın', description: 'Beyan durumu, yıllık gelir, vergi yılı ve eyaletinizi ayarlayın — federal + eyalet desteği.' },
    { icon: Calculator, title: 'Bitcoin İşlemlerini Ekleyin', description: 'Alım, satım, takas, madencilik ve staking. CSV içe aktarma ve otomatik piyasa değeri hesaplama.' },
    { icon: TrendingUp, title: 'Vergi Yükümlülüğünü Hesaplayın', description: 'Federal, eyalet ve NIIT vergileri. FIFO/LIFO/Spesifik Kimlik maliyet esası ve kısa/uzun vadeli sınıflandırma.' },
    { icon: ShieldCheck, title: 'İnceleyin ve Optimize Edin', description: 'Vergi kaybı hasadı önerileri, elde tutma süresi optimizasyonu, denetime hazır belgeler.' },
  ] : [
    { icon: FileText, title: 'Configure Tax Settings', description: 'Set filing status, annual income, tax year, and state — federal + state support.' },
    { icon: Calculator, title: 'Add Bitcoin Transactions', description: 'Buys, sells, trades, mining, and staking. CSV import and automatic fair-market-value calculation.' },
    { icon: TrendingUp, title: 'Calculate Tax Liability', description: 'Federal, state, and NIIT. FIFO / LIFO / Specific ID cost basis and short/long-term classification.' },
    { icon: ShieldCheck, title: 'Review & Optimize', description: 'Tax-loss harvesting suggestions, holding-period optimization, audit-ready documentation.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Bitcoin Vergi Hesaplayıcısı Nasıl Çalışır?' : 'How Our Bitcoin Tax Calculator Works'}
      lead={tr
        ? 'Federal ve eyalet desteğiyle profesyonel düzeyde vergi hesaplamaları ve denetime hazır raporlar.'
        : 'Professional-grade tax calculations with federal and state support, plus audit-ready reports.'}
      steps={steps}
      note={{
        icon: AlertTriangle,
        title: tr ? 'Profesyonel Vergi Sorumluluk Reddi' : 'Professional Tax Disclaimer',
        body: tr
          ? 'Bu hesaplayıcı yalnızca planlama amaçlı tahminler sunar. Vergi yasaları karmaşıktır ve yargı bölgesine göre değişir — resmi tavsiye için nitelikli bir vergi uzmanına veya CPA\'ya başvurun.'
          : 'This calculator provides estimates for planning purposes only. Tax laws are complex and vary by jurisdiction — consult a qualified tax professional or CPA for official advice.',
      }}
    />
  );
};
