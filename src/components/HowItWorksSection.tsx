import { Calculator, Database, TrendingUp, Shield, Clock, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "@/components/LocalizedLink";
import { StepGuide } from "@/components/step-guide";

export const HowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Calculator, title: "Yatırım Detaylarını Girin", description: "Tutarınızı girin, 150'den fazla para birimi arasından seçim yapın ve analiz etmek istediğiniz geçmiş tarihi belirleyin." },
    { icon: Database, title: "Piyasa Verisini Al", description: "Doğru hesaplamalar için CoinGecko API'sinden gerçek geçmiş Bitcoin fiyatlarını çekiyoruz." },
    { icon: TrendingUp, title: "Performansı Hesapla", description: "Geçmiş fiyatla satın alınan BTC miktarını, güncel değeri, YG yüzdesini ve kâr/zararı 8 ondalık hassasiyetle hesaplayın." },
    { icon: Shield, title: "Analiz Et ve Dışa Aktar", description: "Sonuçları grafikler ve karşılaştırmalarla görüntüleyin; raporları PDF/PNG olarak dışa aktarın." },
  ] : [
    { icon: Calculator, title: "Enter Investment Details", description: "Input your amount, select from 150+ currencies, and choose any historical date to analyze." },
    { icon: Database, title: "Retrieve Market Data", description: "We fetch authentic historical Bitcoin prices from CoinGecko API for accurate calculations." },
    { icon: TrendingUp, title: "Calculate Performance", description: "Calculate BTC bought at historical price, current value, ROI percentage, and profit/loss with 8-decimal precision." },
    { icon: Shield, title: "Analyze & Export", description: "View results with charts and comparisons, and export reports as PDF/PNG." },
  ];

  const trust = tr ? [
    { icon: Clock, title: "Gerçek Zamanlı Veri", description: "CoinGecko'dan her 5 dakikada güncellenen canlı Bitcoin fiyatları." },
    { icon: Zap, title: "Yıldırım Hızında", description: "Anlık sonuçlar için optimize edilmiş önbellekleme ve hata yönetimi." },
    { icon: Shield, title: "Doğru Hesaplamalar", description: "8 ondalık basamak hassasiyetiyle kesin geçmiş veriler." },
  ] : [
    { icon: Clock, title: "Real-time Data", description: "Live Bitcoin prices updated every 5 minutes from CoinGecko." },
    { icon: Zap, title: "Lightning Fast", description: "Optimized caching and error handling for instant results." },
    { icon: Shield, title: "Accurate Calculations", description: "Precise historical data with 8 decimal place accuracy." },
  ];

  const faqItems = tr ? [
    { q: "Hesaplamalar ne kadar doğru?", a: "CoinGecko API'sinden 8 ondalık hassasiyetle gerçek geçmiş Bitcoin fiyatlarını kullanıyoruz." },
    { q: "Hangi para birimleri destekleniyor?", a: "USD, EUR, GBP, JPY, CNY, INR ve daha fazlası dahil 150'den fazla global para birimi." },
    { q: "Hangi tarih aralığını analiz edebilirim?", a: "Bitcoin'in 3 Ocak 2009'daki ilk kayıtlı fiyatından bugüne kadar." },
    { q: "Sonuçlarımı dışa aktarabilir miyim?", a: "Evet — ayrıntılı raporları PDF veya yüksek kaliteli PNG olarak dışa aktarın." },
    { q: "YG yüzdesi ne anlama geliyor?", a: "Yatırım Getirisi, kârınızı/zararınızı yüzde olarak gösterir." },
    { q: "Ücretler hesaplamalara dahil mi?", a: "Hayır, hesaplamalar borsa ücretleri, vergiler veya işlem maliyetleri olmadan teorik getirileri gösterir." },
  ] : [
    { q: "How accurate are the calculations?", a: "We use real historical Bitcoin prices from CoinGecko API with 8-decimal precision." },
    { q: "Which currencies are supported?", a: "Over 150 global currencies including USD, EUR, GBP, JPY, CNY, INR, and many more." },
    { q: "What date range can I analyze?", a: "From Bitcoin's first recorded price on January 3, 2009, to today." },
    { q: "Can I export my results?", a: "Yes — export detailed reports as PDF or high-quality PNG images." },
    { q: "What does ROI percentage mean?", a: "Return on Investment shows your profit/loss as a percentage." },
    { q: "Are fees included in calculations?", a: "No, calculations show theoretical returns without exchange fees, taxes, or transaction costs." },
  ];

  const calcPath = tr ? '/tr/hesaplayicilar/bitcoin-ya-olsaydi' : '/calculators/what-if';

  return (
    <>
      <StepGuide
        title={tr ? 'Bitcoin Yatırım Yolculuğunuzu Anlayın' : 'Understand Your Bitcoin Investment Journey'}
        lead={tr
          ? 'Gerçek piyasa verisi kullanarak yatırımınızın nasıl performans gösterdiğini görün.'
          : 'See exactly how your Bitcoin investment would have performed using real market data.'}
        steps={steps}
      />

      <section className="pb-20 md:pb-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/50 rounded-xl overflow-hidden border border-border/60 mb-14">
            {trust.map((t, i) => (
              <div key={i} className="bg-card p-6 flex items-start gap-4">
                <span className="w-10 h-10 rounded-md border border-border/60 bg-muted/40 flex items-center justify-center shrink-0">
                  <t.icon className="w-[18px] h-[18px] text-foreground/70" strokeWidth={1.75} />
                </span>
                <div className="space-y-1">
                  <h3 className="text-[15px] font-semibold text-foreground">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-10">
            <h3 className="text-h3 font-semibold text-foreground">
              {tr ? 'Sık Sorulan Sorular' : 'Frequently Asked Questions'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/50 rounded-xl overflow-hidden border border-border/60">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-card p-6">
                <h4 className="text-[15px] font-semibold text-foreground mb-2">{item.q}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to={calcPath} className="text-sm font-medium text-foreground hover:text-primary underline-offset-4 hover:underline">
              {t('common.launchCalculator')} →
            </Link>

          </div>
        </div>
      </section>
    </>
  );
};
