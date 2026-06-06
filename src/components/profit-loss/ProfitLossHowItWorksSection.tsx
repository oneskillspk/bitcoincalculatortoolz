import { DollarSign, Building, Target, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const ProfitLossHowItWorksSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: DollarSign, title: 'Alımlarınızı Girin', description: 'Ne kadar yatırdığınızı ve hangi fiyattan aldığınızı girin. Doğru maliyet bazı takibi için birden fazla alım ekleyin.' },
    { icon: Building, title: 'Borsa Ücretlerini Ayarlayın', description: 'Borsa önayarınızı (Binance, Coinbase, Kraken vb.) seçin veya özel alım/satım ücreti yüzdesi girin.' },
    { icon: Target, title: 'Satış Fiyatınızı Seçin', description: 'Farklı senaryoları modellemek için canlı Bitcoin fiyatı geçişini kullanın veya özel hedef satış fiyatı belirleyin.' },
    { icon: BarChart3, title: 'Gerçek K/Z\'nizi Görün', description: 'Tüm ücretler sonrası net kâr/zarar, başabaş fiyatı, ROI yüzdesi ve çok senaryolu analizinizi görün.' },
  ] : [
    { icon: DollarSign, title: 'Enter Your Purchases', description: 'Input how much you invested and at what price. Add multiple purchases for accurate cost basis tracking.' },
    { icon: Building, title: 'Set Exchange Fees', description: 'Choose your exchange preset (Binance, Coinbase, Kraken, etc.) or enter custom buy/sell fee percentages.' },
    { icon: Target, title: 'Choose Your Sell Price', description: 'Use the live Bitcoin price toggle or set a custom target sell price to model different scenarios.' },
    { icon: BarChart3, title: 'See Your Real P/L', description: 'View net profit/loss after all fees, breakeven price, ROI percentage, and multi-scenario analysis.' },
  ];

  return (
    <>
      <StepGuide
        title={tr ? '4 Adımda Gerçek Kârınızı Hesaplayın' : 'Calculate Your Real Profit in 4 Steps'}
        lead={tr
          ? 'Borsa ücretleri, çok alımlı maliyet bazı ve başabaş analiziyle doğru kâr/zarar hesaplamaları alın.'
          : 'Get accurate profit/loss calculations with exchange fees, multi-purchase cost basis, and breakeven analysis.'}
        steps={steps}
      />

      <section className="pb-20 md:pb-24 -mt-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 text-center uppercase tracking-[0.18em]">
              {tr ? 'Temel Formüller' : 'Key Formulas'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border/60 bg-muted/30">
                <span className="text-sm font-medium text-foreground">
                  {tr ? 'Maliyet Bazı (BTC başına)' : 'Cost Basis (per BTC)'}
                </span>
                <code className="text-sm text-foreground/80 font-mono block mt-1">
                  {tr ? 'Toplam Yatırım ÷ Tutulan BTC' : 'Total Invested ÷ Total BTC Held'}
                </code>
                <p className="text-xs text-muted-foreground mt-2">
                  {tr ? 'Tüm alımlara göre ağırlıklı ortalama' : 'Weighted average across all purchases'}
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border/60 bg-muted/30">
                <span className="text-sm font-medium text-foreground">{tr ? 'Net K/Z' : 'Net P/L'}</span>
                <code className="text-sm text-foreground/80 font-mono block mt-1">
                  (BTC × {tr ? 'Satış Fiyatı' : 'Sell Price'} × (1 - {tr ? 'Ücret%' : 'Fee%'})) - {tr ? 'Yatırım' : 'Invested'}
                </code>
                <p className="text-xs text-muted-foreground mt-2">
                  {tr ? 'Tüm alım ve satım ücretleri sonrası' : 'After all buy and sell fees'}
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border/60 bg-muted/30">
                <span className="text-sm font-medium text-foreground">
                  {tr ? 'Başabaş Fiyatı' : 'Breakeven Price'}
                </span>
                <code className="text-sm text-foreground/80 font-mono block mt-1">
                  {tr ? 'Yatırım' : 'Invested'} ÷ (BTC × (1 - {tr ? 'Satım Ücreti%' : 'Sell Fee%'}))
                </code>
                <p className="text-xs text-muted-foreground mt-2">
                  {tr ? 'Zarar etmemek için gereken minimum satış fiyatı' : 'Minimum sell price to avoid loss'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
