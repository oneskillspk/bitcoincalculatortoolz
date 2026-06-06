import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Database, ChartBar, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const NewHowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Database, title: 'Geçmiş Veriler', description: 'Seçtiğiniz tarihten güvenilir geçmiş piyasa verileri kullanarak Bitcoin\'in tam fiyatını çekiyoruz.' },
    { icon: ChartBar, title: 'Gerçek Hesaplamalar', description: 'Ne kadar Bitcoin satın alabileceğinizi ve bugünkü piyasa fiyatına göre mevcut değerini hesaplayın.' },
    { icon: TrendingUp, title: 'Performans Analizi', description: 'Detaylı YG, kâr/zarar analizi görüntüleyin ve geleneksel yatırım seçenekleriyle karşılaştırın.' },
  ] : [
    { icon: Database, title: 'Historical Data', description: 'We fetch the exact Bitcoin price from your chosen date using reliable historical market data.' },
    { icon: ChartBar, title: 'Real Calculations', description: "Calculate how much Bitcoin you could have bought and its current value based on today's market price." },
    { icon: TrendingUp, title: 'Performance Analysis', description: 'View detailed ROI calculations, profit/loss analysis, and compare with traditional investment options.' },
  ];

  const faqs = [
    { value: 'accuracy', qEn: 'How accurate is this calculator?', qTr: 'Bu hesaplayıcı ne kadar doğru?', aEn: "This calculator uses historical daily closing price data for Bitcoin to provide a highly accurate representation of a past investment's performance.", aTr: "Bu hesaplayıcı, geçmiş bir yatırımın performansını yüksek doğrulukla temsil etmek için Bitcoin'in geçmiş günlük kapanış fiyatı verilerini kullanır." },
    { value: 'fees', qEn: 'Does this calculation include trading fees?', qTr: 'Bu hesaplama işlem ücretlerini içeriyor mu?', aEn: "No, this tool calculates the raw asset growth based on market price.", aTr: "Hayır, bu araç piyasa fiyatına dayalı ham varlık büyümesini hesaplar." },
    { value: 'prediction', qEn: 'Can this calculator predict future Bitcoin prices?', qTr: 'Bu hesaplayıcı gelecekteki Bitcoin fiyatlarını tahmin edebilir mi?', aEn: 'This tool is for historical analysis only and cannot predict future performance.', aTr: 'Bu araç yalnızca geçmiş analizi içindir ve gelecekteki performansı tahmin edemez.' },
    { value: 'roi', qEn: 'What is Return on Investment (ROI)?', qTr: 'Yatırım Getirisi (ROI) nedir?', aEn: "Return on Investment (ROI) is a percentage that shows how profitable an investment was.", aTr: 'Yatırım Getirisi (YG), bir yatırımın ne kadar karlı olduğunu gösteren bir yüzdedir.' },
    { value: 'volatility', qEn: 'Why is the Bitcoin market so volatile?', qTr: 'Bitcoin piyasası neden bu kadar değişken?', aEn: "Bitcoin's price is volatile due to factors like its relatively young age, changing regulations, news events, and a fixed supply.", aTr: "Bitcoin'in fiyatı; görece genç olması, değişen düzenlemeler, haberler ve sabit arz gibi faktörler nedeniyle değişkendir." },
    { value: 'what-if-invested', qEn: 'What if I invested $100 in Bitcoin 10 years ago?', qTr: '10 yıl önce Bitcoin\'e 100 dolar yatırsaydım ne olurdu?', aEn: "A $100 investment in early 2014 would be worth approximately $18,000–$25,000 today, depending on the exact date.", aTr: "2014 yılı başında yapılan 100 dolarlık yatırım, kesin tarihe bağlı olarak bugün yaklaşık 18.000-25.000 dolar değerinde olurdu." },
    { value: 'free-to-use', qEn: "Is this calculator completely free?", qTr: "Bu hesaplayıcı tamamen ücretsiz mi?", aEn: 'Yes, this tool is 100% free with no hidden fees or subscriptions.', aTr: 'Evet, bu araç %100 ücretsizdir. Gizli ücret veya abonelik gerekmez.' },
    { value: 'losing-4-year', qEn: "Has Bitcoin ever had a losing 4-year hold?", qTr: "Bitcoin'in hiç kayıpla sonuçlanan 4 yıllık tutma süresi oldu mu?", aEn: "No. According to CoinGecko price data through 2026, every 4-year Bitcoin hold from any entry date between 2010 and 2022 has produced a positive nominal return.", aTr: "Hayır. 2026'ya kadar CoinGecko fiyat verilerine göre, 2010 ile 2022 arasındaki herhangi bir giriş tarihinden itibaren 4 yıllık her Bitcoin tutma pozitif nominal getiri sağlamıştır." },
  ];

  return (
    <>
      <StepGuide
        title={tr ? 'Bitcoin Yatırımınızın Bugün Ne Değerde Olacağını Nasıl Hesaplarız' : 'How to Calculate What Your Bitcoin Investment Would Be Worth Today'}
        lead={tr
          ? 'Hesaplayıcımız geçmiş günlük fiyat verilerini kullanarak bir Bitcoin yatırımının nasıl performans gösterdiğini gösterir.'
          : 'Our calculator uses historical daily price data to show you exactly how a past Bitcoin investment would have performed.'}
        steps={steps}
      />

      <section className="pb-20 md:pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {tr ? 'Sıkça Sorulan Sorular' : 'FAQ'}
            </span>
            <h3 className="mt-5 text-h3 font-semibold text-foreground">
              {tr ? 'Bilmeniz Gereken Her Şey' : 'Everything You Need to Know'}
            </h3>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.value}
                value={faq.value}
                className="bg-card border border-border/60 rounded-xl px-5"
              >
                <AccordionTrigger className="text-left font-medium text-foreground py-5 text-[15px] hover:no-underline">
                  {tr ? faq.qTr : faq.qEn}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                  {tr ? faq.aTr : faq.aEn}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
};
