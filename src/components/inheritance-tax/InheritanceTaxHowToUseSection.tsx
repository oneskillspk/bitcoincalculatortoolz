import React from 'react';
import { FileText, Shield, TrendingUp, Calculator, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const InheritanceTaxHowToUseSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: FileText, title: 'Miras Ayrıntılarını Girin', description: "Miras alınan BTC miktarını ve vefat tarihindeki gerçeğe uygun piyasa değerini girin — bu yeni yükseltilmiş maliyet tabanınızdır." },
    { icon: Shield, title: 'Yükseltilmiş Maliyet Tabanını Anlayın', description: 'Maliyet tabanınız vefat tarihi değerine sıfırlanır — onlarca yıllık gerçekleşmemiş kazançları vergi yükünüzden silebilir.' },
    { icon: TrendingUp, title: 'Sermaye Kazancı Etkisini İnceleyin', description: 'Tahmini sermaye kazancı verginizi yükseltilmiş ve yükseltilmemiş tabana göre yan yana karşılaştırın.' },
    { icon: Calculator, title: 'Veraset Vergisi Maruziyetini Kontrol Edin', description: 'Federal muafiyet 13,61 milyon $ — 13 eyalet + DC daha düşük eşiklerle ayrı veraset vergileri uygular.' },
  ] : [
    { icon: FileText, title: 'Enter Inheritance Details', description: 'Enter the inherited BTC amount and the fair market value on the date of death — your new stepped-up cost basis.' },
    { icon: Shield, title: 'Understand the Step-Up Basis', description: 'Your cost basis resets to the date-of-death value — eliminating decades of unrealized gains from your tax liability.' },
    { icon: TrendingUp, title: 'Review Capital Gains Impact', description: 'Compare estimated capital gains tax with vs. without the stepped-up basis side by side.' },
    { icon: Calculator, title: 'Check Estate Tax Exposure', description: 'Federal exemption is $13.61M — 13 states + DC apply separate estate taxes with much lower thresholds.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Bitcoin Miras Vergisi Hesaplayıcısı' : 'Bitcoin Inheritance Tax Calculator'}
      lead={tr
        ? 'Yükseltilmiş maliyet tabanı kurallarını anlayın, sermaye kazançlarını tahmin edin ve veraset vergisi maruziyetini kontrol edin.'
        : 'Understand step-up basis rules, estimate capital gains, and check estate tax exposure — all in one free tool.'}
      steps={steps}
      note={{
        icon: AlertTriangle,
        title: tr ? 'Profesyonel Vergi Sorumluluk Reddi' : 'Professional Tax Disclaimer',
        body: tr
          ? 'Bu hesaplayıcı yalnızca eğitim ve planlama amaçlı tahminler sunar. Miras ve veraset vergisi yasaları karmaşıktır ve sık değişir — nitelikli bir miras planlama avukatı veya CPA ile görüşün.'
          : 'This calculator provides estimates for educational and planning purposes only. Estate and inheritance tax laws are complex and change frequently — always consult a qualified estate planning attorney or CPA.',
      }}
    />
  );
};
