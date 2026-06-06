import React from 'react';
import { BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const BitcoinUnitExplainer: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const units = [
    {
      name: 'Bitcoin (BTC)',
      value: '1',
      color: 'bg-primary text-primary-foreground',
      description: tr ? 'Bitcoin\'in temel birimi' : 'The base unit of Bitcoin',
    },
    {
      name: 'Millibitcoin (mBTC)',
      value: '1,000',
      color: 'bg-amber-500 text-white',
      description: tr ? '1 BTC = 1.000 mBTC' : '1 BTC = 1,000 mBTC',
    },
    {
      name: 'Microbitcoin (bits)',
      value: '1,000,000',
      color: 'bg-success text-white',
      description: tr ? '1 BTC = 1.000.000 bits' : '1 BTC = 1,000,000 bits',
    },
    {
      name: 'Satoshi (sats)',
      value: '100,000,000',
      color: 'bg-violet-500 text-white',
      description: tr ? '1 BTC = 100.000.000 sats' : '1 BTC = 100,000,000 sats',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            {tr ? 'Öğren' : 'Learn'}
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr
              ? <><span className="text-primary">Satoshi</span> Nedir?</>
              : <>What is a <span className="text-primary">Satoshi</span>?</>}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {tr
              ? <>Satoshi, anonim yaratıcısı Satoshi Nakamoto'nun adını taşıyan Bitcoin'in en küçük birimidir. Tıpkı bir doların 100 sente bölünmesi gibi, <strong>1 Bitcoin 100.000.000 satoshi'ye bölünür</strong>.</>
              : <>A satoshi is the smallest unit of Bitcoin, named after its pseudonymous creator, Satoshi Nakamoto. Just like a dollar is divided into 100 cents, <strong>1 Bitcoin is divided into 100,000,000 satoshis</strong>.</>}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {units.map((unit, index) => (
              <div
                key={unit.name}
                className="relative flex items-center gap-4 p-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-all duration-300"
              >
                {index < units.length - 1 && (
                  <div className="absolute left-8 top-full w-0.5 h-4 bg-border/50 z-0" />
                )}
                <div className={`w-12 h-12 rounded-xl ${unit.color} flex items-center justify-center text-lg font-bold shrink-0`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base">{unit.name}</h3>
                  <p className="text-sm text-muted-foreground">{unit.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-mono font-bold text-foreground">{unit.value}</span>
                  <span className="text-xs text-muted-foreground block">{tr ? 'BTC başına' : 'per BTC'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 p-6 bg-card border border-border/50 rounded-xl max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            {tr ? 'Satoshiler Neden Önemli' : 'Why Satoshis Matter'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p>
                <strong className="text-foreground">{tr ? 'Kısmi Sahiplik:' : 'Fractional Ownership:'}</strong>{' '}
                {tr
                  ? 'Bütün bir Bitcoin satın almanıza gerek yok. 1 satoshi (0,00000001 BTC) kadar az alabilirsiniz.'
                  : "You don't need to buy a whole Bitcoin. You can buy as little as 1 satoshi (0.00000001 BTC)."}
              </p>
              <p>
                <strong className="text-foreground">{tr ? 'Lightning Network:' : 'Lightning Network:'}</strong>{' '}
                {tr
                  ? 'Bitcoin\'in 2. katman ödeme ağı, hızlı ve düşük maliyetli işlemler için standart birim olarak satoshi kullanır.'
                  : "Bitcoin's Layer 2 payment network uses satoshis as the standard unit for fast, low-cost transactions."}
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <strong className="text-foreground">{tr ? 'Sat Biriktirmek:' : 'Stacking Sats:'}</strong>{' '}
                {tr
                  ? 'Satoshi cinsinden ölçülen küçük miktarlarda Bitcoin\'i düzenli olarak biriktirme pratiği.'
                  : 'The popular practice of regularly accumulating small amounts of Bitcoin, measured in satoshis.'}
              </p>
              <p>
                <strong className="text-foreground">{tr ? 'Birim Önyargısı:' : 'Unit Bias:'}</strong>{' '}
                {tr
                  ? 'Pek çok yeni kullanıcı, Bitcoin\'in 8 ondalık basamağa kadar bölünebileceğini fark etmediği için çok pahalı olduğunu düşünür.'
                  : "Many newcomers think Bitcoin is too expensive because they don't realize it's divisible to 8 decimal places."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
