import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeader } from '@/components/what-if/SectionHeader';

export const WhatIfRealExamples = () => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const examples = tr ? [
    {
      year: 'Ocak 2015',
      invested: '1.000 $',
      btcPrice: '314 $',
      btcAmount: '3,18 BTC',
      currentValue: '220.000 $+',
      roi: '%22.000+',
      context: 'Bitcoin, Mt. Gox çöküşünden toparlanıyordu ve yatırımcıların çoğu onu bitmiş saymıştı.',
    },
    {
      year: 'Ocak 2017',
      invested: '1.000 $',
      btcPrice: '998 $',
      btcAmount: '1,00 BTC',
      currentValue: '69.000 $+',
      roi: '%6.800+',
      context: 'İlk büyük perakende kripto boomının yılıydı — ancak çoğu kişi Aralık\'a kadar bekledi.',
    },
    {
      year: 'Ocak 2020',
      invested: '1.000 $',
      btcPrice: '7.200 $',
      btcAmount: '0,139 BTC',
      currentValue: '9.600 $+',
      roi: '%860+',
      context: 'COVID çöküşünün hemen öncesiydi — fiyatlar 3.800 $\'a indi. Ama tutanlar ödüllendirilen taraftaydı.',
    },
  ] : [
    {
      year: 'January 2015',
      invested: '$1,000',
      btcPrice: '$314',
      btcAmount: '3.18 BTC',
      currentValue: '$220,000+',
      roi: '22,000%+',
      context: 'Bitcoin was recovering from the Mt. Gox crash, and most investors had written it off as dead.',
    },
    {
      year: 'January 2017',
      invested: '$1,000',
      btcPrice: '$998',
      btcAmount: '1.00 BTC',
      currentValue: '$69,000+',
      roi: '6,800%+',
      context: 'The year of the first major retail crypto boom — yet most people waited until December to buy.',
    },
    {
      year: 'January 2020',
      invested: '$1,000',
      btcPrice: '$7,200',
      btcAmount: '0.139 BTC',
      currentValue: '$9,600+',
      roi: '860%+',
      context: 'Right before the COVID crash sent prices to $3,800 — but holders who stayed were rewarded.',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 mb-12 md:mb-16">
      <div>

        <SectionHeader
          title={tr ? '1.000 $ Yatırsaydınız?' : 'What If You Invested $1,000?'}
          lead={tr
            ? 'Bitcoin tarihinin farklı noktalarında yapılan 1.000 $\'lık tek bir yatırımın performansı.'
            : "A single $1,000 investment at different points in Bitcoin's history."}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 items-stretch">
          {examples.map((ex) => (
            <Card key={ex.year} className="bg-card border border-border/50 rounded-2xl overflow-hidden h-full">
              <CardContent className="p-6 sm:p-7 md:p-8 space-y-5 h-full flex flex-col">
                <div className="flex items-center gap-2 text-primary text-base font-semibold tracking-tight">
                  <Calendar className="w-4 h-4 shrink-0" />
                  {ex.year}
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between gap-3 text-sm md:text-[15px]">
                    <span className="text-muted-foreground">{tr ? 'Yatırılan' : 'Invested'}</span>
                    <span className="font-medium text-foreground tabular-nums">{ex.invested}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-sm md:text-[15px]">
                    <span className="text-muted-foreground">{tr ? 'BTC Fiyatı' : 'BTC Price'}</span>
                    <span className="font-medium text-foreground tabular-nums">{ex.btcPrice}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-sm md:text-[15px]">
                    <span className="text-muted-foreground">{tr ? 'Alınan BTC' : 'BTC Bought'}</span>
                    <span className="font-medium text-foreground tabular-nums">{ex.btcAmount}</span>
                  </div>
                  <div className="border-t border-border/50 pt-3 mt-3 space-y-2.5">
                    <div className="flex justify-between gap-3 text-base md:text-lg">
                      <span className="text-muted-foreground">{tr ? 'Bugünkü Değeri' : 'Value Today'}</span>
                      <span className="font-bold text-success tabular-nums">{ex.currentValue}</span>
                    </div>
                    <div className="flex justify-between gap-3 text-base md:text-lg">
                      <span className="text-muted-foreground">ROI</span>
                      <span className="font-bold text-success tabular-nums">{ex.roi}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground/80 leading-relaxed mt-auto pt-1">
                  {ex.context}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>


        <p className="text-base text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto mt-6 italic">
          {tr
            ? 'Fiyatlar yaklaşık olup günlük kapanış verilerine dayanmaktadır. Belirli tarih ve tutarınıza göre kesin rakamlar için yukarıdaki hesap makinesini kullanın.'
            : 'Prices are approximate and based on daily closing data. Use the calculator above for exact figures based on your specific date and amount.'}
        </p>
      </div>
    </div>
  );

};
