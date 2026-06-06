import { DollarSign, TrendingUp, Calculator, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const LeverageHowItWorksSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: DollarSign, title: 'Pozisyon Ayrıntılarını Girin', description: 'Analizinize başlamak için giriş fiyatınızı, pozisyon türünüzü (long/short) ve marj tutarınızı belirleyin.' },
    { icon: TrendingUp, title: 'Kaldıraç Seviyesini Seçin', description: 'Risk toleransınıza göre hızlı hazır ayarları veya özel girişi kullanarak 1x\'den 125x\'e kadar kaldıracınızı seçin.' },
    { icon: Calculator, title: 'Tasfiyeyi Hesaplayın', description: 'Gerçek piyasa formülleri kullanarak tasfiye fiyatınızı, tasfiyeye mesafeyi ve pozisyon büyüklüğünü anında görün.' },
    { icon: Shield, title: 'Riskinizi Yönetin', description: 'İsteğe bağlı kâr al ve stop-loss seviyeleri belirleyin, risk puanınızı inceleyin ve analizinizi dışa aktarın.' },
  ] : [
    { icon: DollarSign, title: 'Enter Position Details', description: 'Set your entry price, position type (long/short), and margin amount to begin your analysis.' },
    { icon: TrendingUp, title: 'Select Leverage Level', description: 'Choose your leverage from 1x to 125x using quick presets or custom input based on your risk tolerance.' },
    { icon: Calculator, title: 'Calculate Liquidation', description: 'Instantly see your liquidation price, distance to liquidation, and position size using real market formulas.' },
    { icon: Shield, title: 'Manage Your Risk', description: 'Set optional take profit and stop loss levels, review your risk score, and export your analysis.' },
  ];

  return (
    <>
      <StepGuide
        title={tr ? '4 Adımda Tasfiye Riskinizi Hesaplayın' : 'Calculate Your Liquidation Risk in 4 Steps'}
        lead={tr
          ? 'Büyük borsalar tarafından kullanılan sektör standardı formülleriyle kaldıraç pozisyonunuzu anlayın.'
          : 'Understand your leverage position with industry-standard formulas used by major exchanges.'}
        steps={steps}
      />

      <section className="pb-20 md:pb-24 -mt-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 text-center uppercase tracking-[0.18em]">
              {tr ? 'Tasfiye Fiyatı Formülleri' : 'Liquidation Price Formulas'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border/60 bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-foreground/70" />
                  <span className="text-sm font-medium text-foreground">{tr ? 'Long Pozisyon' : 'Long Position'}</span>
                </div>
                <code className="text-sm text-foreground/80 font-mono block">
                  Liq. Price = Entry × (1 - 1/Leverage + MM%)
                </code>
                <p className="text-xs text-muted-foreground mt-2">
                  {tr ? 'Fiyat bu seviyenin altına düştüğünde tasfiye edilir' : 'Liquidated when price drops below this level'}
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border/60 bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-foreground/70 rotate-180" />
                  <span className="text-sm font-medium text-foreground">{tr ? 'Short Pozisyon' : 'Short Position'}</span>
                </div>
                <code className="text-sm text-foreground/80 font-mono block">
                  Liq. Price = Entry × (1 + 1/Leverage - MM%)
                </code>
                <p className="text-xs text-muted-foreground mt-2">
                  {tr ? 'Fiyat bu seviyenin üzerine çıktığında tasfiye edilir' : 'Liquidated when price rises above this level'}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              {tr
                ? 'MM% = Bakım Marjı Yüzdesi (borsaya göre değişir, genellikle %0,5 - %1)'
                : 'MM% = Maintenance Margin Percentage (varies by exchange, typically 0.5% - 1%)'}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
