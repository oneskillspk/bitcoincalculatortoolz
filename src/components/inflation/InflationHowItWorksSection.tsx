import { Lock, TrendingUp, Zap, Shield } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const InflationHowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Lock, title: 'Sabit Arz', description: 'Bitcoin\'in 21 milyon coin sert tavanı, değiştirilemez matematiksel kod tarafından uygulanır. Hiçbir hükümet, şirket veya birey daha fazla Bitcoin yaratamaz.' },
    { icon: TrendingUp, title: 'Fiat Genişlemesi', description: 'Merkez bankaları harcamaları finanse etmek için sınırsız miktarda para basabilir; bu mevcut paranın değerini seyrelterek zaman içinde satın alma gücünü aşındırır.' },
    { icon: Zap, title: 'Yarılanma Olayları', description: 'Bitcoin\'in arz hızı her 4 yılda bir (210.000 blok) yarıya iner; bu enflasyonu otomatik olarak 2140 yılı civarında tüm coinler madenciliği yapılana kadar azaltır.' },
    { icon: Shield, title: 'Kıtlık Primi', description: 'Artan taleple birleşen sabit arz, uzun vadeli değer artışı yaratır ve Bitcoin\'i parasal enflasyona karşı potansiyel bir koruma aracı haline getirir.' },
  ] : [
    { icon: Lock, title: 'Fixed Supply', description: 'Bitcoin has a hard cap of 21 million coins, enforced by mathematical code that cannot be changed. No government, company, or individual can create more Bitcoin.' },
    { icon: TrendingUp, title: 'Fiat Expansion', description: 'Central banks can print unlimited amounts of currency to fund spending, which dilutes the value of existing money and erodes purchasing power over time.' },
    { icon: Zap, title: 'Halving Events', description: "Bitcoin's supply rate cuts in half every 4 years (210,000 blocks), reducing inflation automatically until all coins are mined around 2140." },
    { icon: Shield, title: 'Scarcity Premium', description: 'Fixed supply combined with growing demand creates long-term value appreciation, making Bitcoin a potential hedge against monetary inflation.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Dört Temel İlke' : 'Four Key Principles'}
      lead={tr
        ? 'Bitcoin\'in sabit arzı ile fiat para biriminin sınırsız genişlemesi arasındaki temel farkı anlama.'
        : "Understanding the fundamental difference between Bitcoin's fixed supply and fiat currency's unlimited expansion."}
      steps={steps}
      note={{
        icon: Lock,
        title: tr ? 'Bu Neden Önemlidir' : 'Why This Matters',
        body: tr
          ? 'Bitcoin\'in sabit arzı ile fiat para birimi enflasyonu arasındaki farkı anlamak bilinçli finansal kararlar vermek için kritik öneme sahiptir. Bu kontrol paneli, merkez bankası politikalarının satın alma gücünüzü nasıl etkilediğini ve Bitcoin\'in paraya neden temelden farklı bir yaklaşım temsil ettiğini görselleştirir.'
          : "Understanding the difference between Bitcoin's fixed supply and fiat currency inflation is crucial for making informed financial decisions. This dashboard visualizes how central bank policies affect your purchasing power and why Bitcoin represents a fundamentally different approach to money.",
      }}
    />
  );
};
