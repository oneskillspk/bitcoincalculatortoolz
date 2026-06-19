import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowRight, Calculator, TrendingUp, Target, Coins, PiggyBank, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionTerminalStrip } from '@/components/cinematic/SectionTerminalStrip';
import { SectionHeading } from '@/components/calculator/SectionHeading';

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

  const flows: Record<'dca' | 'retirement' | 'profit', FlowStep[]> = {
    dca: [
      { id: 'investment', label: isTurkish ? 'Haftalık Yatırım' : 'Weekly Investment', value: '$500', icon: <Coins className="w-[18px] h-[18px]" strokeWidth={1.5} />, description: isTurkish ? 'Yatırım Tutarı' : 'Investment Amount' },
      { id: 'frequency', label: isTurkish ? 'Yatırım Dönemi' : 'Investment Period', value: isTurkish ? '2 yıl' : '2 years', icon: <BarChart3 className="w-[18px] h-[18px]" strokeWidth={1.5} />, description: isTurkish ? 'Yatırım süresi' : 'Duration of investment' },
      { id: 'average', label: isTurkish ? 'Ortalama Fiyat' : 'Average Price', value: '$58,400', icon: <TrendingUp className="w-[18px] h-[18px]" strokeWidth={1.5} />, description: isTurkish ? 'DCA Ortalama' : 'DCA Averaging' },
      { id: 'result', label: isTurkish ? 'Toplam Değer' : 'Total Value', value: '$67,890', icon: <Target className="w-[18px] h-[18px]" strokeWidth={1.5} />, description: isTurkish ? 'Nihai portföy değeri' : 'Final portfolio value' },
    ],
    retirement: [
      { id: 'goal', label: isTurkish ? 'Emeklilik Hedefi' : 'Retirement Goal', value: '$1M', icon: <PiggyBank className="w-[18px] h-[18px]" strokeWidth={1.5} />, description: isTurkish ? 'Hedef emeklilik tutarı' : 'Target retirement amount' },
      { id: 'timeline', label: isTurkish ? 'Zaman Ufku' : 'Time Horizon', value: isTurkish ? '20 yıl' : '20 years', icon: <BarChart3 className="w-[18px] h-[18px]" strokeWidth={1.5} />, description: isTurkish ? 'Emekliliğe kadar yıl' : 'Years until retirement' },
      { id: 'monthly', label: isTurkish ? 'Aylık Gerekli' : 'Monthly Needed', value: '$1,250', icon: <Calculator className="w-[18px] h-[18px]" strokeWidth={1.5} />, description: isTurkish ? 'Aylık Katkı' : 'Monthly Contribution' },
      { id: 'success', label: isTurkish ? 'Başarı Oranı' : 'Success Rate', value: '85%', icon: <Target className="w-[18px] h-[18px]" strokeWidth={1.5} />, description: isTurkish ? 'Hedef Olasılığı' : 'Goal Probability' },
    ],
    profit: [
      { id: 'buy-price', label: isTurkish ? 'Alış Fiyatı' : 'Buy Price', value: '$62,000', icon: <Coins className="w-[18px] h-[18px]" strokeWidth={1.5} />, description: isTurkish ? 'İlk alış fiyatı' : 'Initial purchase price' },
      { id: 'current-price', label: isTurkish ? 'Mevcut Fiyat' : 'Current Price', value: '$88,000', icon: <TrendingUp className="w-[18px] h-[18px]" strokeWidth={1.5} />, description: isTurkish ? 'Mevcut piyasa fiyatı' : 'Current market price' },
      { id: 'profit-amount', label: isTurkish ? 'Kâr' : 'Profit', value: '+$26,000', icon: <Calculator className="w-[18px] h-[18px]" strokeWidth={1.5} />, description: isTurkish ? 'Mutlak kâr tutarı' : 'Absolute profit amount' },
      { id: 'roi', label: 'ROI', value: '+41.9%', icon: <Target className="w-[18px] h-[18px]" strokeWidth={1.5} />, description: isTurkish ? 'Yatırım getirisi' : 'Return on investment' },
    ],
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

  const ctaLabel =
    activeFlow === 'dca' ? (isTurkish ? 'DCA HESAPLAYICISI' : 'OPEN DCA') :
    activeFlow === 'retirement' ? (isTurkish ? 'EMEKLİLİK' : 'OPEN RETIREMENT') :
    (isTurkish ? 'YA OLSAYDI' : 'OPEN WHAT-IF');

  const ctaPath =
    activeFlow === 'dca' ? dcaPath :
    activeFlow === 'retirement' ? retirementPath :
    whatIfPath;

  return (
    <section id="calculation-flow" className="relative py-12 md:py-20 border-t border-border/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow={isTurkish ? 'AKIŞ' : 'FLOW'}
            title={isTurkish ? 'Bitcoin Hesaplamaları Nasıl Çalışır' : 'How Bitcoin Calculations Work'}
            description={isTurkish
              ? 'DCA, emeklilik planlaması ve kâr hesaplamalarının adım adım açıklaması.'
              : 'Step-by-step breakdown of DCA, retirement planning, and profit calculations.'}
            className="mb-8"
          />

          <article className="bg-card border border-border/70 rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
            <SectionTerminalStrip
              moduleId="FLOW"
              context={tabLabels[activeFlow]}
              status={isTurkish ? 'SİMÜLASYON' : 'SIMULATION'}
              pulse
              className="border-t-0"
            />

            {/* Flow selector — hairline pill row */}
            <div className="px-4 sm:px-5 py-3 border-b border-border/60 bg-background/30">
              <div
                className="flex flex-wrap items-center gap-1.5"
                role="group"
                aria-label={isTurkish ? 'Hesaplama akış türü' : 'Calculation flow type'}
              >
                {(Object.keys(flows) as (keyof typeof flows)[]).map((key) => {
                  const isActive = activeFlow === key;
                  return (
                    <button
                      key={key}
                      onClick={() => { setActiveFlow(key); setAnimationStep(0); }}
                      className={`min-h-[36px] px-3 font-mono text-[10.5px] tracking-[0.14em] uppercase border rounded transition-colors ${
                        isActive
                          ? 'border-foreground/80 text-foreground bg-background'
                          : 'border-border/60 text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                      aria-pressed={isActive}
                    >
                      {tabLabels[key]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Steps grid */}
            <div className="p-4 sm:p-5 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative">
                {currentFlow.map((step, index) => {
                  const isActiveStep = index <= animationStep;
                  return (
                    <div key={step.id} className="relative">
                      <div
                        className={`relative bg-background/40 border rounded-lg p-4 sm:p-5 min-h-[160px] flex flex-col transition-colors duration-500 ${
                          isActiveStep ? 'border-border/80' : 'border-border/40 opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`font-mono text-[10.5px] tracking-[0.14em] uppercase ${isActiveStep ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                            STEP-{String(index + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${isActiveStep ? 'bg-primary' : 'bg-border'}`}
                            aria-hidden
                          />
                        </div>

                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border mb-3 transition-colors ${
                          isActiveStep ? 'border-border/70 bg-background text-foreground/80' : 'border-border/40 text-foreground/40'
                        }`}>
                          {step.icon}
                        </div>

                        <h3 className="font-semibold text-[14px] text-foreground tracking-[-0.01em] mb-1.5">
                          {step.label}
                        </h3>
                        <div className={`font-mono text-[18px] sm:text-[20px] font-semibold tracking-[-0.02em] mb-1.5 ${isActiveStep ? 'text-foreground' : 'text-foreground/40'}`}>
                          {step.value}
                        </div>
                        <p className="text-[12px] text-muted-foreground leading-relaxed mt-auto">
                          {step.description}
                        </p>
                      </div>

                      {index < currentFlow.length - 1 && (
                        <div className="hidden lg:flex absolute top-1/2 -right-2.5 transform -translate-y-1/2 z-10 items-center">
                          <ArrowRight
                            className={`w-3.5 h-3.5 transition-colors ${index < animationStep ? 'text-primary' : 'text-foreground/25'}`}
                            strokeWidth={1.75}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress ticks */}
              <div className="flex justify-center mt-5 gap-1.5">
                {currentFlow.map((_, index) => (
                  <div
                    key={index}
                    className={`h-px w-8 transition-colors duration-500 ${index <= animationStep ? 'bg-primary' : 'bg-border'}`}
                  />
                ))}
              </div>
            </div>

            {/* Footer rail */}
            <footer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3 border-t border-border/60 bg-background/30">
              <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground">
                {activeFlow === 'dca' && (isTurkish ? 'DOLAR MALİYET ORTALAMASI' : 'DOLLAR-COST AVERAGING')}
                {activeFlow === 'retirement' && (isTurkish ? 'EMEKLİLİK PLANLAMASI' : 'RETIREMENT PLANNING')}
                {activeFlow === 'profit' && (isTurkish ? 'KÂR ANALİZİ' : 'PROFIT ANALYSIS')}
              </span>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                <button
                  onClick={() => navigate(ctaPath)}
                  className="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-foreground hover:text-primary transition-colors min-h-[44px] sm:min-h-0"
                >
                  {ctaLabel}
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => navigate(allCalcPath)}
                  className="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors min-h-[44px] sm:min-h-0"
                >
                  {isTurkish ? 'TÜMÜ' : 'ALL'}
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.75} />
                </button>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
};
