import React from 'react';
import { Calendar, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeader } from '@/components/what-if/SectionHeader';

export const WhatIfKeyDates = () => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const keyDates = tr ? [
    { date: '22 Mayıs 2010', label: 'Bitcoin Pizza Günü', price: '$0.003', description: '10.000 BTC iki pizza için harcandı — ilk gerçek dünya Bitcoin işlemi.' },
    { date: '28 Kas 2013', label: 'İlk 1.000 $ kilometre taşı', price: '$1.000', description: 'Bitcoin ilk kez dört haneli rakamı kırdı; geçici bir trend olmadığını kanıtladı.' },
    { date: '17 Ara 2017', label: '2017 tüm zamanların en yükseği', price: '$19.783', description: 'İlk büyük perakende kripto boomunun zirvesi — ardından %84 çöküş geldi.' },
    { date: '12 Mar 2020', label: 'COVID-19 çöküşü', price: '$3.858', description: 'Küresel panik Bitcoin\'i tek günde %50 düşürdü — yıllardaki en iyi alım fırsatı.' },
    { date: '10 Kas 2021', label: '2021 zirvesi', price: '$68.789', description: 'Kurumsal benimseme ve teşvik likiditesinin etkisiyle önceki döngü zirvesi.' },
    { date: '11 Oca 2024', label: 'Spot ETF onayı', price: '$46.000', description: 'SEC spot Bitcoin ETF\'lerini onayladı; ana akım kurumsal yatırıma kapı açıldı.' },
    { date: '19 Nis 2024', label: 'Dördüncü yarılanma', price: '$63.800', description: 'Blok ödülü 3,125 BTC\'ye indi; yeni arz yaklaşık %50 daraldı ve 2024–2025 boğa döngüsünün önünü açtı.' },
    { date: '6 Eki 2025', label: 'Tüm zamanların en yükseği', price: '$126.198', description: 'Bitcoin 126 bin $\'ın üzerinde yeni bir zirveye ulaştı — ETF birikimi ve yarılanma sonrası arz sıkışıklığının birleşimi.' },
  ] : [
    { date: 'May 22, 2010', label: 'Bitcoin Pizza Day', price: '$0.003', description: '10,000 BTC were spent on two pizzas — the first real-world Bitcoin transaction.' },
    { date: 'Nov 28, 2013', label: 'First $1,000 milestone', price: '$1,000', description: 'Bitcoin broke four digits for the first time, proving it was more than a passing trend.' },
    { date: 'Dec 17, 2017', label: '2017 all-time high', price: '$19,783', description: 'The peak of the first major retail crypto boom — followed by an 84% crash.' },
    { date: 'Mar 12, 2020', label: 'COVID-19 crash', price: '$3,858', description: 'Global panic drove Bitcoin down 50% in a single day — the best buying opportunity in years.' },
    { date: 'Nov 10, 2021', label: '2021 cycle peak', price: '$68,789', description: 'Previous-cycle top, fueled by institutional adoption and stimulus liquidity.' },
    { date: 'Jan 11, 2024', label: 'Spot ETF approved', price: '$46,000', description: 'The SEC approved spot Bitcoin ETFs, opening the door to mainstream institutional investment.' },
    { date: 'Apr 19, 2024', label: 'Fourth halving', price: '$63,800', description: 'Block reward cut to 3.125 BTC — new-supply issuance dropped ~50%, setting up the 2024–2025 bull run.' },
    { date: 'Oct 4, 2025', label: 'All-time high', price: '$122,260', description: 'Bitcoin printed a new record above $122K, powered by relentless ETF accumulation and post-halving supply tightness.' },
  ];

  const scrollToCalculator = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <div>

        <SectionHeader
          title={tr ? 'Önemli Bitcoin Tarihleri' : 'Key Bitcoin Dates'}
          lead={tr
            ? 'Bitcoin tarihindeki önemli anlar. Herhangi bir tarihi seçip hesap makinesinde deneyin.'
            : "Significant moments in Bitcoin's history. Pick any date and try it in the calculator."}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {keyDates.map((item) => (
            <button
              key={item.date}
              onClick={scrollToCalculator}
              className="text-left p-5 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </div>
                  <p className="font-semibold text-foreground text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  <p className="text-xs font-medium text-primary">{tr ? 'BTC Fiyatı:' : 'BTC Price:'} {item.price}</p>
                </div>
                <ArrowUp className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

};
