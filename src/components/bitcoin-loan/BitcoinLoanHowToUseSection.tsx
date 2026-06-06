import React from 'react';
import { Bitcoin, Settings2, Percent, ShieldAlert, Scale } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const BitcoinLoanHowToUseSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Bitcoin, title: 'Bitcoin Teminatınızı Girin', description: 'Teminat olarak kullanacağınız BTC miktarını girin. Canlı fiyatı otomatik doldurun veya senaryo planlaması için özel fiyat kullanın.' },
    { icon: Settings2, title: 'Platform Ön Ayarı Seçin', description: 'Muhafazakâr (%50 LTV), Standart (%60) veya Agresif (%75) ön ayarlardan birini seçin ya da özel ayarlar kullanın.' },
    { icon: Percent, title: 'Kredi Koşullarını Yapılandırın', description: 'İstediğiniz kredi tutarını, yıllık faiz oranını (%1–25 APR) ve kredi vadesini (3–60 ay) belirleyin.' },
    { icon: ShieldAlert, title: 'Tasfiye Riskini İnceleyin', description: 'Tam tasfiye fiyatınızı, marj çağrısı fiyatını ve sağlık faktörünü görüntüleyin.' },
    { icon: Scale, title: 'Borçlanmayı vs. Satmayı Karşılaştırın', description: 'Borçlanma faizini Bitcoin satışının sermaye kazancı vergisiyle karşılaştırın — vergi açısından hangisi avantajlı?' },
  ] : [
    { icon: Bitcoin, title: 'Enter Your Bitcoin Collateral', description: 'Enter the BTC you want to use as collateral. Auto-fill the live price or set a custom price for scenario planning.' },
    { icon: Settings2, title: 'Choose a Platform Preset', description: 'Select Conservative (50% LTV), Standard (60%), or Aggressive (75%) — or use custom settings.' },
    { icon: Percent, title: 'Configure Loan Terms', description: 'Set your desired loan amount, annual interest rate (1–25% APR), and loan term (3–60 months).' },
    { icon: ShieldAlert, title: 'Review Liquidation Risk', description: 'View your exact liquidation price, margin call price, and health factor.' },
    { icon: Scale, title: 'Compare Borrow vs. Sell', description: 'Compare loan interest against capital gains tax from selling — which is more tax-efficient?' },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Kullanılır' : 'How to Use'}
      title={tr ? 'Bitcoin Kredi ve Teminat Hesaplayıcısı' : 'Bitcoin Loan & Collateral Calculator'}
      lead={tr
        ? "Bitcoin'inizi satmadan borçlanın. LTV oranlarını, tasfiye risklerini ve vergi avantajlarını anlayın."
        : 'Borrow against your Bitcoin without selling. Understand LTV ratios, liquidation risk, and tax advantages.'}
      steps={steps}
      columns={4}
    />
  );
};
