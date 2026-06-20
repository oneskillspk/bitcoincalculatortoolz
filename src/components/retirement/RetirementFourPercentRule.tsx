import { Link } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionHeader } from "./SectionHeader";

export const RetirementFourPercentRule = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <SectionHeader
          eyebrow={tr ? 'Para Çekme Stratejisi' : 'Withdrawal Strategy'}
          title={tr ? '%4 Kuralı Bitcoin İçin İşe Yarar mı?' : 'Does the 4% Rule Work for Bitcoin?'}
        />
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            {tr
              ? <><strong className="text-foreground">%4 kuralı</strong>, portföyünüzün %4'ünü her yıl 30 yıllık emeklilik boyunca paranız bitmeden güvenli biçimde çekebileceğinizi söyleyen bir emeklilik rehberidir. Orta düzey volatiliteye sahip geleneksel hisse/tahvil portföyleri için tasarlanmıştır — Bitcoin kadar oynak bir varlık için değil.</>
              : <>The <strong className="text-foreground">4% rule</strong> is a retirement guideline suggesting you can safely withdraw 4% of your portfolio each year without running out of money over a 30-year retirement. It was designed for traditional stock-and-bond portfolios with moderate volatility — not for an asset as volatile as Bitcoin.</>}
          </p>
          <p>
            {tr
              ? <><strong className="text-foreground">%3 çekim oranı</strong> daha temkinli bir yaklaşım olarak tampon sağlar. Hesap makinemiz her iki yaklaşımı da modellemenizi sağlar: <strong className="text-foreground">Temkinli mod</strong> tüm BTC'yi emeklilikte satar ve fiat üzerinde geleneksel %4 kuralını izler, <strong className="text-foreground">Optimize mod</strong> ise sizi Bitcoin'de tutar ve mevcut portföy değerinizin her yıl %4'ünü çekmenize izin verir.</>
              : <>Because Bitcoin can swing 30–50% in a single year, some Bitcoin retirees prefer a more cautious <strong className="text-foreground">3% withdrawal rate</strong> to build in a safety margin. Our calculator lets you model both approaches: <strong className="text-foreground">Conservative mode</strong> sells all BTC at retirement and follows the traditional 4% rule on fiat, while <strong className="text-foreground">Optimized mode</strong> keeps you invested in Bitcoin, withdrawing 4% of your current portfolio value each year so your holdings can continue to grow.</>}
          </p>
          <p className="text-sm">
            {tr ? 'Bitcoin ile emeklilik planlamasına daha derin bir bakış mı istiyorsunuz?' : 'Want a deeper dive into Bitcoin withdrawal strategies?'}{' '}
            <Link to="/learn/how-to-plan-retirement-with-bitcoin" className="text-primary hover:underline font-medium">
              {tr ? 'Bitcoin ile emekliliği planlamaya dair tam rehberimizi okuyun →' : 'Read our full guide to planning retirement with Bitcoin →'}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
