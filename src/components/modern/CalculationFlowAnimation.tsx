import React, { useState, useEffect } from 'react';
import { ArrowRight, Calculator, TrendingUp, Target, Coins, PiggyBank, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface FlowStep {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

export const CalculationFlowAnimation = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isTurkish = language === 'tr';
  const [activeFlow, setActiveFlow] = useState<'dca' | 'retirement' | 'profit'>('dca');
  const [animationStep, setAnimationStep] = useState(0);

  const flows = {
    dca: [
      {
        id: 'investment',
        label: isTurkish ? 'Haftalık Yatırım' : 'Weekly Investment',
        value: '$500',
        icon: <Coins className="w-6 h-6" />,
        description: isTurkish ? 'Yatırım Tutarı' : 'Investment Amount'
      },
      {
        id: 'frequency',
        label: isTurkish ? 'Yatırım Dönemi' : 'Investment Period',
        value: isTurkish ? '2 yıl' : '2 years',
        icon: <BarChart3 className="w-6 h-6" />,
        description: isTurkish ? 'Yatırım süresi' : 'Duration of investment'
      },
      {
        id: 'average',
        label: isTurkish ? 'Ortalama Fiyat' : 'Average Price',
        value: '$58,400',
        icon: <TrendingUp className="w-6 h-6" />,
        description: isTurkish ? 'DCA Ortalama' : 'DCA Averaging'
      },
      {
        id: 'result',
        label: isTurkish ? 'Toplam Değer' : 'Total Value',
        value: '$67,890',
        icon: <Target className="w-6 h-6" />,
        description: isTurkish ? 'Nihai portföy değeri' : 'Final portfolio value'
      }
    ],
    retirement: [
      {
        id: 'goal',
        label: isTurkish ? 'Emeklilik Hedefi' : 'Retirement Goal',
        value: '$1M',
        icon: <PiggyBank className="w-6 h-6" />,
        description: isTurkish ? 'Hedef emeklilik tutarı' : 'Target retirement amount'
      },
      {
        id: 'timeline',
        label: isTurkish ? 'Zaman Ufku' : 'Time Horizon',
        value: isTurkish ? '20 yıl' : '20 years',
        icon: <BarChart3 className="w-6 h-6" />,
        description: isTurkish ? 'Emekliliğe kadar yıl' : 'Years until retirement'
      },
      {
        id: 'monthly',
        label: isTurkish ? 'Aylık Gerekli' : 'Monthly Needed',
        value: '$1,250',
        icon: <Calculator className="w-6 h-6" />,
        description: isTurkish ? 'Aylık Katkı' : 'Monthly Contribution'
      },
      {
        id: 'success',
        label: isTurkish ? 'Başarı Oranı' : 'Success Rate',
        value: '85%',
        icon: <Target className="w-6 h-6" />,
        description: isTurkish ? 'Hedef Olasılığı' : 'Goal Probability'
      }
    ],
    profit: [
      {
        id: 'buy-price',
        label: isTurkish ? 'Alış Fiyatı' : 'Buy Price',
        value: '$62,000',
        icon: <Coins className="w-6 h-6" />,
        description: isTurkish ? 'İlk alış fiyatı' : 'Initial purchase price'
      },
      {
        id: 'current-price',
        label: isTurkish ? 'Mevcut Fiyat' : 'Current Price',
        value: '$88,000',
        icon: <TrendingUp className="w-6 h-6" />,
        description: isTurkish ? 'Mevcut piyasa fiyatı' : 'Current market price'
      },
      {
        id: 'profit-amount',
        label: isTurkish ? 'Kâr' : 'Profit',
        value: '+$26,000',
        icon: <Calculator className="w-6 h-6" />,
        description: isTurkish ? 'Mutlak kâr tutarı' : 'Absolute profit amount'
      },
      {
        id: 'roi',
        label: 'ROI',
        value: '+41.9%',
        icon: <Target className="w-6 h-6" />,
        description: isTurkish ? 'Yatırım getirisi' : 'Return on investment'
      }
    ]
  };

  const tabLabels: Record<string, string> = isTurkish
    ? { dca: 'DCA', retirement: 'EMEKLİLİK', profit: 'KÂR' }
    : { dca: 'DCA', retirement: 'RETIREMENT', profit: 'PROFIT' };

  const dcaPath = isTurkish ? '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' : '/calculators/dca';
  const retirementPath = isTurkish ? '/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi' : '/calculators/retirement';
  const whatIfPath = isTurkish ? '/tr/hesaplayicilar/bitcoin-ya-olsaydi' : '/calculators/what-if';
  const allCalcPath = isTurkish ? '/tr/hesaplayicilar' : '/calculators';

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % flows[activeFlow].length);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeFlow]);

  useEffect(() => {
    const flowInterval = setInterval(() => {
      const flowTypes: (keyof typeof flows)[] = ['dca', 'retirement', 'profit'];
      setActiveFlow(prev => {
        const currentIndex = flowTypes.indexOf(prev);
        return flowTypes[(currentIndex + 1) % flowTypes.length];
      });
      setAnimationStep(0);
    }, 8000);

    return () => clearInterval(flowInterval);
  }, []);

  const currentFlow = flows[activeFlow];

  return (
    <section id="calculation-flow" className="py-8 sm:py-10 md:py-12 relative overflow-hidden bg-gradient-to-br from-primary/2 via-background to-accent/2 bg-grid-subtle">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-h2 font-display text-foreground mb-2 sm:mb-3 animate-fade-in">
            {isTurkish ? 'Bitcoin Hesaplamaları Nasıl Çalışır' : 'How Bitcoin Calculations Work'}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-foreground/70 max-w-xl mx-auto animate-fade-in animate-stagger-2 px-2">
            {isTurkish
              ? 'DCA, emeklilik planlaması ve kâr hesaplamalarının adım adım açıklaması'
              : 'Step-by-step breakdown of DCA, retirement planning, and profit calculations'}
          </p>
        </div>

        {/* Flow Type Selector */}
        <div className="flex justify-center mb-6 sm:mb-8 px-2">
          <div className="relative max-w-full">
            <div
              className="bg-background/80 backdrop-blur-sm rounded-xl p-1 border border-border/50 shadow-md overflow-x-auto flex max-w-full snap-x snap-mandatory scroll-px-1"
              style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
              role="group"
              aria-label={isTurkish ? 'Hesaplama akış türü' : 'Calculation flow type'}
            >
              {(Object.keys(flows) as (keyof typeof flows)[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveFlow(key);
                    setAnimationStep(0);
                  }}
                  className={`snap-start shrink-0 min-h-[44px] px-4 py-2 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm whitespace-nowrap touch-manipulation ${
                    activeFlow === key
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground/70 hover:text-foreground hover:bg-primary/10'
                  }`}
                  aria-pressed={activeFlow === key}
                >
                  {tabLabels[key]}
                </button>
              ))}
            </div>
            <div
              aria-hidden="true"
              className="sm:hidden pointer-events-none absolute inset-y-1 right-1 w-8 rounded-r-xl bg-gradient-to-l from-background/95 to-transparent"
            />
          </div>
        </div>

        {/* Calculation Flow Visualization */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 p-4 sm:p-5 md:p-6 shadow-lg">
            {/* Flow Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative">
              {currentFlow.map((step, index) => (
                <div key={step.id} className="relative">
                  <div
                    className={`relative bg-background/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border transition-all duration-700 min-h-[140px] sm:h-[150px] flex flex-col justify-center shadow-sm ${
                      index <= animationStep
                        ? 'border-primary/30 shadow-lg bg-background/80'
                        : 'border-border/20 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2.5 sm:mb-3 mx-auto transition-all duration-500 shadow-sm ${
                        index <= animationStep
                          ? 'bg-gradient-to-br from-primary/15 to-primary/25 text-primary border border-primary/20'
                          : 'bg-foreground/5 text-foreground/40 border border-border/10'
                      }`}
                    >
                      {step.icon}
                    </div>

                    <div className="text-center">
                      <h3 className="font-semibold text-foreground mb-1.5 sm:mb-2 text-[13px] sm:text-sm tracking-wide">{step.label}</h3>
                      <div
                        className={`text-lg sm:text-xl md:text-2xl font-bold font-mono mb-1.5 sm:mb-2 transition-all duration-500 ${
                          index <= animationStep
                            ? 'text-primary animate-number-count drop-shadow-sm'
                            : 'text-foreground/40'
                        }`}
                      >
                        {step.value}
                      </div>
                      <p className="text-xs sm:text-xs text-foreground/60 leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  {index < currentFlow.length - 1 && (
                    <>
                      <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <div className="flex items-center">
                          <div className={`w-3 h-0.5 transition-all duration-500 ${
                            index < animationStep ? 'bg-primary' : 'bg-foreground/20'
                          }`} />
                          <ArrowRight
                            className={`w-4 h-4 ml-1 transition-all duration-500 ${
                              index < animationStep ? 'text-primary' : 'text-foreground/20'
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex lg:hidden justify-center py-2">
                        <div className={`w-0.5 h-6 rounded-full transition-all duration-500 ${
                          index < animationStep ? 'bg-primary' : 'bg-foreground/20'
                        }`} />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {currentFlow.map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-1 rounded-full transition-all duration-500 ${
                      index <= animationStep ? 'bg-primary' : 'bg-foreground/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Flow Description */}
            <div className="text-center mt-5 sm:mt-6">
              <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                {activeFlow === 'dca' && (isTurkish ? 'Dolar Maliyet Ortalaması' : 'Dollar-Cost Averaging')}
                {activeFlow === 'retirement' && (isTurkish ? 'Emeklilik Planlaması' : 'Retirement Planning')}
                {activeFlow === 'profit' && (isTurkish ? 'Kâr Analizi' : 'Profit Analysis')}
              </h4>
              <p className="text-foreground/70 max-w-xl mx-auto mb-5 sm:mb-6 text-[13px] sm:text-sm px-2">
                {activeFlow === 'dca' && (isTurkish
                  ? 'Düzenli yatırımlar, alımları zamana yayarak dalgalanma etkisini azaltır.'
                  : 'Regular investments reduce volatility impact by spreading purchases over time.')}
                {activeFlow === 'retirement' && (isTurkish
                  ? 'Hedeflerinizden geriye doğru çalışarak emeklilik için gereken Bitcoin miktarını hesaplayın.'
                  : 'Calculate Bitcoin needed for retirement by working backwards from your goals.')}
                {activeFlow === 'profit' && (isTurkish
                  ? 'Gerçek zamanlı kâr hesaplamalarıyla yatırım performansını takip edin.'
                  : 'Track investment performance with real-time profit calculations.')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate(
                    activeFlow === 'dca' ? dcaPath :
                    activeFlow === 'retirement' ? retirementPath :
                    whatIfPath
                  )}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 font-medium rounded-lg"
                >
                  {activeFlow === 'dca' && (isTurkish ? 'DCA Hesaplayıcısını Dene' : 'Try DCA Calculator')}
                  {activeFlow === 'retirement' && (isTurkish ? 'Emeklilik Planla' : 'Plan Retirement')}
                  {activeFlow === 'profit' && (isTurkish ? 'Kârları Hesapla' : 'Calculate Profits')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(allCalcPath)}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 font-medium rounded-lg"
                >
                  {isTurkish ? 'Tüm Hesaplayıcılar' : 'All Calculators'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
