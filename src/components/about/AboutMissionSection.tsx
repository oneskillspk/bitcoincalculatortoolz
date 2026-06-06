import { Card, CardContent } from "@/components/ui/card";
import {
  Shield, Target, Lock, GraduationCap, Heart, Globe, Database
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const getValues = (isTr: boolean) => [
  {
    icon: Target,
    title: isTr ? "Önce Doğruluk" : "Accuracy First",
    description: isTr
      ? "Her hesaplayıcı, doğrulanmış formüller ve canlı CoinGecko verisi kullanır. Sonuçları bilinen Bitcoin fiyat kilometre taşlarına göre test ederiz."
      : "Every calculator uses verified formulas and live CoinGecko data. We test results against known Bitcoin price milestones before we publish.",
    milestones: isTr
      ? "Şubat 2011'de 1 $, Kasım 2013'te 1.000 $, Aralık 2017'de 19.783 $, Kasım 2021'de 69.044 $, Mart 2024'te 73.098 $, Ocak 2025'te 108.135 $ ve Ekim 2025'te yaklaşık 126.000 $."
      : "$1 in February 2011, $1,000 in November 2013, $19,783 in December 2017, $69,044 in November 2021, $73,098 in March 2024, $108,135 in January 2025, and ~$126,000 in October 2025.",
  },
  {
    icon: Shield,
    title: isTr ? "Tam Şeffaflık" : "Full Transparency",
    description: isTr
      ? "Gizli ücret, ödeme duvarı veya gizemli formül yok. Her sayfada kullandığımız formülü sade bir dille açıklayan 'Nasıl Çalışır?' bölümü vardır."
      : "No hidden fees, no paywalls, no mystery formulas. Every page includes a 'How It Works' section that spells out the exact math in plain language.",
  },
  {
    icon: Lock,
    title: isTr ? "Tasarımda Gizlilik" : "Privacy by Design",
    description: isTr
      ? "Tüm hesaplamalar tarayıcınızda gerçekleşir. Sunucu yok, çerez yok, izleme yok. Sekmeyi kapattığınızda her şey silinir."
      : "All calculations happen in your browser. No server logs, no cookies, no tracking. Close the tab and everything is gone.",
  },
  {
    icon: GraduationCap,
    title: isTr ? "Eğitim Odaklı" : "Education Driven",
    description: isTr
      ? "Her araç, kavramları açıklayan bir rehberle birlikte gelir. 30+ makalemiz DCA, vergi, madencilik ve on-chain analizi kapsar."
      : "Every tool ships with a learning guide that explains the concept. Our library of 30+ articles covers DCA, tax, mining, and on-chain analysis.",
  },
  {
    icon: Heart,
    title: isTr ? "Topluluk Tarafından" : "Community Built",
    description: isTr
      ? "Bağımsızız. Sponsor yok, VC yok, reklam yok. 2010'dan beri Bitcoin'de olan kişiler tarafından geliştirildi."
      : "We're independent. No sponsors, no VC, no ads. Built by people who have been in Bitcoin since 2010.",
  },
  {
    icon: Globe,
    title: isTr ? "Küresel Erişim" : "Global Access",
    description: isTr
      ? "100'den fazla para birimini destekleriz. Yerel biçimlendirme ve geçerli olduğunda vergi kuralları dahildir."
      : "We support 100+ fiat currencies, with local formatting and tax rules where applicable. Bitcoin is global; our tools are too.",
  },
  {
    icon: Database,
    title: isTr ? "Doğrulanmış Veri" : "Verified Data",
    description: isTr
      ? "Canlı fiyatlar CoinGecko'dan 30 saniyede bir gelir. Madencilik verisi mempool.space'den, vergi referansları IRS ve HMRC'den alınır."
      : "Live prices stream from CoinGecko every 30s. Mining data comes from mempool.space; tax references from IRS and HMRC.",
  },
];

export const AboutMissionSection = () => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const values = getValues(isTr);

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.18em]">
              {isTr ? "Değerlerimiz" : "Our Values"}
            </span>
            <h2 className="text-[1.875rem] sm:text-[2.25rem] md:text-[2.5rem] font-light tracking-[-0.01em] leading-[1.12] mt-4 mb-5 text-foreground">
              {isTr ? "Neyin Savunucusuyuz" : "What We Stand For"}
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed text-pretty">
              {isTr
                ? "Veri kaynaklarından rehber yazımına kadar her karar bu ilkelere dayanır."
                : "Every decision — from data sources to how we write our guides — comes back to these principles."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border/40">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group rounded-none border-0 bg-card hover:bg-card/60 transition-colors duration-300 shadow-none"
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center ring-1 ring-inset ring-primary/10 group-hover:bg-primary/12 transition-colors duration-300">
                      <value.icon className="w-[18px] h-[18px] text-primary" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-[15px] font-semibold text-foreground">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-[14px] text-muted-foreground leading-[1.65] text-pretty">
                    {value.description}
                  </p>
                  {value.milestones && (
                    <p className="mt-4 pt-4 border-t border-border/50 text-[12px] text-muted-foreground/75 leading-[1.6] font-mono tracking-tight">
                      {value.milestones}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
