import React from 'react';
import { Calculator, BarChart3, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const LumpSumDCAHowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Calculator, title: 'Stratejilerinizi Yapılandırın', description: 'Toplu tutarı ve tarihi belirleyin, ardından DCA tutarı, sıklık ve süreyi yapılandırın. İsteğe bağlı olarak DVA\'yı etkinleştirin.' },
    { icon: BarChart3, title: 'Tarihsel Veri Analizi', description: 'Belirttiğiniz dönemler için gerçek Bitcoin fiyat verileri çekilir ve kesin performans hesaplanır.' },
    { icon: TrendingUp, title: 'Yan Yana Karşılaştırma', description: 'Nihai değerleri, ROI yüzdelerini ve risk metriklerini yan yana karşılaştırın.' },
    { icon: Shield, title: 'İçgörüler ve Analiz', description: 'Zamanlama riski, volatilite etkisi ve durumunuza uygun stratejik öneriler hakkında ayrıntılı içgörüler.' },
  ] : [
    { icon: Calculator, title: 'Configure Your Strategies', description: 'Set your lump-sum amount and date, then configure DCA amount, frequency, and time period. Optionally enable DVA.' },
    { icon: BarChart3, title: 'Historical Data Analysis', description: 'Real Bitcoin price data is fetched for your specified periods to calculate exact performance.' },
    { icon: TrendingUp, title: 'Side-by-Side Comparison', description: 'Compare final values, ROI percentages, and risk metrics side by side.' },
    { icon: Shield, title: 'Insights & Analysis', description: 'Get detailed insights about timing risk, volatility impact, and strategic recommendations for your situation.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Hesaplayıcı Nasıl Çalışır' : 'How the Calculator Works'}
      lead={tr
        ? 'Girdilerinizden geriye dönük teste kadar dört basit adım — toplu yatırım, DCA ve DVA yan yana.'
        : 'Four simple steps from your inputs to the backtest — lump sum, DCA, and DVA side by side.'}
      steps={steps}
      note={{
        icon: AlertTriangle,
        title: tr ? 'Eğitim Amaçlı' : 'Educational Purpose',
        body: tr
          ? 'Bu araç yalnızca tarihsel geri test sunar. Bitcoin oldukça oynak bir varlıktır; geçmiş performans gelecekteki getirileri garanti etmez ve tahsis kararları vermeden önce yetkin bir mali danışmana danışın.'
          : 'This tool provides historical backtesting only. Bitcoin is highly volatile; past performance does not guarantee future returns, and you should consult a qualified financial advisor before making allocation decisions.',
      }}
    />
  );
};

