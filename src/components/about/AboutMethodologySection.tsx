import { useLanguage } from "@/contexts/LanguageContext";

const getSteps = (isTr: boolean) => [
  {
    title: isTr ? 'Gerçek Geçmiş Veriler' : 'Real Historical Data',
    text: isTr
      ? "Geçmiş Bitcoin fiyatları kullanan her hesaplayıcı, 2010'a kadar uzanan doğrulanmış fiyat verilerini sağlayan CoinGecko genel API'sinden veri çeker. Her veri noktası o tarihte kaydedilmiş gerçek bir piyasa fiyatına karşılık gelir."
      : "Every calculator using historical Bitcoin prices pulls from the CoinGecko public API, with verified data going back to 2010. No estimates — every data point is a real market price recorded on that date.",
  },
  {
    title: isTr ? 'Bilinen Sonuçlara Göre Test Edildi' : 'Tested Against Known Outcomes',
    text: isTr
      ? "Herhangi bir hesaplayıcıyı yayımlamadan önce, bilinen Bitcoin fiyat kilometre taşlarına göre test ederiz: Şubat 2011'de 1 $, Kasım 2013'te 1.000 $, Aralık 2017'de 19.783 $, Kasım 2021'de 69.044 $, Mart 2024'te 73.098 $, Ocak 2025'te 108.135 $ ve Ekim 2025'te yaklaşık 126.000 $. Bir hesaplayıcının çıktısı gerçekte yaşananlarla eşleşmiyorsa yayına girmez."
      : "Before we publish any calculator, we test it against known Bitcoin price milestones: $1 in February 2011, $1,000 in November 2013, $19,783 in December 2017, $69,044 in November 2021, $73,098 in March 2024, $108,135 in January 2025, and ~$126,000 in October 2025. If a calculator's output doesn't match what actually happened, it doesn't go live.",
  },
  {
    title: isTr ? 'Belgelenmiş Formüller' : 'Documented Formulas',
    text: isTr
      ? "Her hesaplayıcı sayfası, kullanılan tam formülü gösteren bir 'Nasıl Çalışır?' bölümü içerir. Yayımlanan metodolojiyi kullanarak her sonucu kendiniz yeniden üretebilirsiniz."
      : "Every calculator page includes a 'How It Works' section that spells out the exact formula. You can reproduce any result on your own using the published methodology.",
  },
  {
    title: isTr ? 'İstemci Taraflı İşlem' : 'Client-Side Processing',
    text: isTr
      ? "Tüm hesaplamalar tamamen tarayıcınızda çalışır. Hiçbir finansal veri sunucuya gönderilmez. Sekmeyi kapattığınızda girişleriniz silinir."
      : "All calculations run entirely in your browser. No financial data is sent to any server. When you close the tab, your inputs are gone.",
  },
];

export const AboutMethodologySection = () => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const steps = getSteps(isTr);

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.18em]">
              {isTr ? "Sürecimiz" : "Our Process"}
            </span>
            <h2 className="mt-4 mb-5 text-[1.875rem] sm:text-[2.25rem] md:text-[2.5rem] font-light tracking-[-0.01em] leading-[1.12] text-foreground">
              {isTr ? "Hesaplayıcılarımızı Nasıl İnşa Ediyoruz" : "How We Build Our Calculators"}
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed text-pretty">
              {isTr
                ? "Her araç, size ulaşmadan önce dikkatli bir geliştirme ve test sürecinden geçer."
                : "Every tool goes through a careful development and testing process before it reaches you."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border/40">
            {steps.map((step, i) => (
              <div key={i} className="bg-card p-8">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-mono text-[12px] text-primary tracking-tight">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-[15px] font-semibold text-foreground">
                    {step.title}
                  </h3>
                </div>
                <p className="text-[14px] text-muted-foreground leading-[1.65] text-pretty">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
