import { Helmet } from "react-helmet-async";
import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { buildCalculatorSpeakable } from "@/components/seo/calculatorSpeakable";

interface RetirementSEOHeadProps {
  language: string;
}

/**
 * All <Helmet> tags + WebApplication / HowTo / FAQ / Speakable JSON-LD +
 * BreadcrumbSchema for the Bitcoin Retirement Calculator page.
 *
 * Lifted verbatim from BitcoinRetirementCalculator.tsx — no copy or schema
 * changes, just an extraction for shell readability.
 */
export const RetirementSEOHead = ({ language }: RetirementSEOHeadProps) => {
  return (
    <>
      <Helmet>
        <title>{language === 'tr' ? 'Bitcoin Emeklilik Hesaplayıcısı | FIRE ve Hedef' : 'Bitcoin Retirement Calculator'}</title>
        <meta name="description" content={language === 'tr' ? 'Bitcoin emeklilik hesaplayıcısı: emekli olmak için kaç BTC gerekir? Hedef gelirinize göre aylık birikim planı, FIRE modu ve %4 çekim kuralı dahil.' : 'How much Bitcoin do you need to retire? Enter your target income and retirement date — see how much BTC to accumulate and a monthly savings plan to get there.'} />
        <link rel="canonical" href={language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/retirement'} />

        {/* hreflang alternates emitted globally via <GlobalHreflang /> */}
        {/* Open Graph tags */}
        <meta property="og:title" content={language === 'tr' ? 'Bitcoin Emeklilik Hesaplayıcısı — FIRE ve Hedef' : 'Bitcoin Retirement Calculator'} />
        <meta property="og:description" content={language === 'tr' ? 'Bitcoin ile emekli olmak için kaç BTC gerektiğini hesaplayın. Aylık birikim planı, FIRE modu ve hedef planlayıcı ile ücretsiz.' : 'How much Bitcoin do you need to retire? Enter your target income and retirement date — see how much BTC to accumulate and a monthly savings plan to get there.'} />
        <meta property="og:url" content={language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/retirement'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={language === 'tr' ? 'Bitcoin Emeklilik Hesaplayıcısı' : 'Bitcoin Retirement Calculator'} />
        <meta name="twitter:description" content={language === 'tr' ? 'Bitcoin ile emekli olmak için kaç BTC lazım? BTC hedefinizi ve aylık birikim planınızı görün.' : 'How much Bitcoin do you need to retire? See your BTC target and a monthly savings plan.'} />
        
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />

        {language !== 'tr' && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Bitcoin Retirement Calculator",
              "description": "How much Bitcoin do you need to retire? Enter your target income and retirement date — see how much BTC to accumulate and a monthly savings plan to get there.",
              "url": "https://bitcoincalculator.tools/calculators/retirement",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Any",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
              "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
              "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
            })}
          </script>
        )}

        {language !== 'tr' && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "How to Use the Bitcoin Retirement Calculator",
              "description": "Plan your financial independence with Bitcoin using our free retirement calculator.",
              "step": [
                { "@type": "HowToStep", "position": 1, "name": "Enter Your Current Details", "text": "Input your current age, retirement age, existing Bitcoin holdings, and monthly contribution amount." },
                { "@type": "HowToStep", "position": 2, "name": "Set Growth Assumptions", "text": "Choose an expected annual Bitcoin growth rate and set your desired annual retirement income." },
                { "@type": "HowToStep", "position": 3, "name": "Choose a Withdrawal Strategy", "text": "Select between Conservative mode (sell all BTC at retirement) or Optimized mode (keep BTC invested and withdraw 4% annually)." },
                { "@type": "HowToStep", "position": 4, "name": "Review Your Projections", "text": "Analyze your projected retirement portfolio value, monthly income, and year-by-year breakdown chart." },
                { "@type": "HowToStep", "position": 5, "name": "Export or Share Results", "text": "Download a PDF report or share your retirement plan via a unique URL." }
              ]
            })}
          </script>
        )}

        {language !== 'tr' && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "url": "https://bitcoincalculator.tools/calculators/retirement",
              "mainEntity": [
                { "@type": "Question", "name": "How much Bitcoin do I need to retire?", "acceptedAnswer": { "@type": "Answer", "text": "The amount of Bitcoin needed for retirement depends on your desired lifestyle, expenses, and the future price of Bitcoin. At $500,000 per BTC, holding 1 Bitcoin generates $20,000 per year using the 4% withdrawal rule. With 5 BTC at the same price, that jumps to $100,000 per year. Use our calculator to model your specific scenario with different price targets." } },
                { "@type": "Question", "name": "Can I retire with 1 Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "It depends on the future price of Bitcoin and your annual expenses. At $100,000 per BTC, 1 Bitcoin generates just $4,000 per year using the 4% rule. At $500,000 per BTC, it generates $20,000 per year, which could work in low-cost-of-living areas. At $1,000,000 per BTC, 1 Bitcoin supports $40,000 per year." } },
                { "@type": "Question", "name": "What Bitcoin growth rate should I use for retirement planning?", "acceptedAnswer": { "@type": "Answer", "text": "We recommend running at least three scenarios: 8-12% as a conservative estimate (similar to stock market returns), 15-20% as a moderate Bitcoin-specific rate, and 25%+ as an optimistic scenario. No single number is correct — the power of the calculator is comparing outcomes across different assumptions." } },
                { "@type": "Question", "name": "How does Bitcoin DCA help with retirement planning?", "acceptedAnswer": { "@type": "Answer", "text": "Dollar-cost averaging means investing a fixed amount in Bitcoin every month regardless of price. Over long time horizons, DCA smooths out volatility and can dramatically grow your holdings through compounding. For example, $500 per month over 20 years accumulates significant Bitcoin even at today's prices." } },
                { "@type": "Question", "name": "What's the difference between conservative and optimized withdrawal strategies?", "acceptedAnswer": { "@type": "Answer", "text": "Conservative mode assumes you sell all Bitcoin at retirement and follow the 4% withdrawal rule on fiat currency. Optimized mode keeps your Bitcoin invested during retirement, withdrawing 4% annually while your remaining Bitcoin continues to potentially grow with the market." } },
                { "@type": "Question", "name": "Does the 4% withdrawal rule work for Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "The 4% rule was designed for traditional stock-and-bond portfolios. Because Bitcoin can swing 30-50% in a single year, some Bitcoin retirees prefer a more cautious 3% withdrawal rate. Our calculator lets you model both Conservative and Optimized approaches to find the right strategy for your risk tolerance." } },
                { "@type": "Question", "name": "How does this calculator account for inflation?", "acceptedAnswer": { "@type": "Answer", "text": "Inflation is built directly into our model. When you input an Inflation Rate, the calculator automatically adjusts the purchasing power of your money over time, ensuring your Annual Budget in retirement reflects real-world costs." } },
                { "@type": "Question", "name": "How do I calculate my Bitcoin FIRE number?", "acceptedAnswer": { "@type": "Answer", "text": "Your Bitcoin FIRE number is the Bitcoin price at which your holdings equal 25 times your annual expenses (the 4% rule). Formula: Required BTC Price = (Annual Expenses × 25) ÷ BTC Holdings. If you spend $60,000 per year and hold 1 BTC, your FIRE price is $1,500,000 per BTC." } },
                { "@type": "Question", "name": "Can you retire early with Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, if your Bitcoin holdings reach your FIRE number — 25 times your annual expenses. Our FIRE Mode calculator shows exactly how much BTC you need at any future price target to achieve financial independence and retire early." } },
                { "@type": "Question", "name": "Is this Bitcoin retirement calculator free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, this tool is 100% free to use with no subscriptions or hidden charges. All calculations are performed locally in your browser — we don't store any of your personal financial information." } },
                { "@type": "Question", "name": "How do taxes affect my Bitcoin retirement withdrawals?", "acceptedAnswer": { "@type": "Answer", "text": "In the United States, selling Bitcoin triggers long-term capital gains taxes if held for more than one year. Rates range from 0% to 20% depending on your taxable income, with a potential additional 3.8% NIIT for high earners. Structuring withdrawals to stay under certain income thresholds can save thousands annually." } },
                { "@type": "Question", "name": "What is sequence-of-returns risk in Bitcoin retirement?", "acceptedAnswer": { "@type": "Answer", "text": "Sequence-of-returns risk means a major market crash in the first few years of retirement can permanently damage your portfolio — even if average returns over your full retirement are positive. Mitigation strategies include maintaining a 2-year cash or stablecoin buffer and using cycle-aware withdrawal rates." } },
                { "@type": "Question", "name": "How does the FIRE Mode differ from the Forecaster?", "acceptedAnswer": { "@type": "Answer", "text": "The Forecaster projects where your current savings plan leads over time. FIRE Mode works backward — it takes your annual expenses and withdrawal rate, then calculates the exact date when your Bitcoin portfolio could sustain those expenses indefinitely across four growth scenarios." } }
              ]
            })}
          </script>
        )}

        {language === 'tr' && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org", "@type": "WebApplication",
              "name": "Bitcoin Emeklilik Hesaplayıcısı", "inLanguage": "tr",
              "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi",
              "description": "Bitcoin emeklilik hesaplayıcısı: emekli olmak için kaç Bitcoin gerektiğini öğrenin.",
              "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
              "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
              "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
            })}
          </script>
        )}

        {language === 'tr' && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "tr",
              "mainEntity": [
                { "@type": "Question", "name": "Emekli olmak için kaç Bitcoin gerekir?", "acceptedAnswer": { "@type": "Answer", "text": "İhtiyaç duyulan Bitcoin miktarı istenen yaşam standardı, harcamalar ve gelecekteki Bitcoin fiyatına bağlıdır. BTC başına 500.000 $ fiyatında 1 BTC, %4 kuralıyla yılda 20.000 $ üretir. Aynı fiyatta 5 BTC yıllık 100.000 $'a çıkar. Hesaplayıcımız farklı senaryolar için tam rakamı hesaplar." } },
                { "@type": "Question", "name": "1 Bitcoin ile emekli olabilir miyim?", "acceptedAnswer": { "@type": "Answer", "text": "Gelecekteki Bitcoin fiyatına ve yıllık harcamalarınıza bağlıdır. BTC başına 100.000 $'da 1 BTC yıllık 4.000 $, 500.000 $'da 20.000 $, 1.000.000 $'da ise 40.000 $ gelir sağlar. FIRE Modu ile 1 BTC'nin giderlerinizi tam olarak ne zaman karşılayabileceğini görebilirsiniz." } },
                { "@type": "Question", "name": "Emeklilik planlaması için hangi büyüme oranı kullanılmalı?", "acceptedAnswer": { "@type": "Answer", "text": "En az üç senaryo çalıştırmanızı öneririz: muhafazakâr (%8-12), orta (%15-20) ve iyimser (%25 ve üzeri). Tek bir sayı 'doğru' değildir; gücü, farklı varsayımlar altındaki sonuçları karşılaştırabilmektir." } },
                { "@type": "Question", "name": "Bitcoin DCA emeklilik planlamasına nasıl yardımcı olur?", "acceptedAnswer": { "@type": "Answer", "text": "Dolar maliyet ortalaması (DCA), fiyat ne olursa olsun her ay sabit bir tutarı Bitcoin'e yatırmak demektir. Uzun vadede DCA volatiliteyi yumuşatır ve bileşik büyümeyle varlıkları ciddi ölçüde artırabilir. Aylık 500 $ ile 20 yıllık DCA bugünkü fiyatlarda bile önemli miktarda BTC biriktirir." } },
                { "@type": "Question", "name": "Temkinli ve Optimize çekim stratejileri arasındaki fark nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Temkinli mod, emeklilikte tüm Bitcoin'i satıp fiat üzerinden %4 çekim kuralını uygular. Optimize mod ise Bitcoin'i tutmaya devam eder ve her yıl mevcut portföy değerinin %4'ünü çeker; varlığın büyümeye devam etmesini sağlar ama daha yüksek volatilite riski taşır." } },
                { "@type": "Question", "name": "Yüzde 4 çekim kuralı Bitcoin için işe yarar mı?", "acceptedAnswer": { "@type": "Answer", "text": "%4 kuralı geleneksel hisse-tahvil portföyleri için geliştirilmiştir. Bitcoin tek yılda %30-50 oynayabildiği için bazı Bitcoin emeklileri daha temkinli %3 çekim oranını tercih eder. Hesaplayıcımız Temkinli ve Optimize yaklaşımları modelleyerek risk toleransınıza uygun stratejiyi bulmanıza yardımcı olur." } },
                { "@type": "Question", "name": "Bu hesaplayıcı enflasyonu nasıl hesaba katıyor?", "acceptedAnswer": { "@type": "Answer", "text": "Enflasyon doğrudan modele dahildir. Enflasyon Oranı girdiğinizde hesaplayıcı paranızın satın alma gücünü zaman içinde otomatik olarak ayarlar; emeklilikteki Yıllık Bütçeniz gerçek dünya maliyetlerini yansıtır." } },
                { "@type": "Question", "name": "Bitcoin FIRE sayım nasıl hesaplanır?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin FIRE sayınız, varlıklarınızın yıllık harcamalarınızın 25 katına (%4 kuralı) eşit olduğu Bitcoin fiyatıdır. Formül: Gerekli BTC Fiyatı = (Yıllık Harcama × 25) ÷ BTC Miktarı. Yılda 60.000 $ harcayıp 1 BTC tutuyorsanız FIRE fiyatınız BTC başına 1.500.000 $'dır." } },
                { "@type": "Question", "name": "Bitcoin ile erken emekli olabilir miyim?", "acceptedAnswer": { "@type": "Answer", "text": "Evet — Bitcoin varlıklarınız FIRE sayınıza (yıllık harcamanızın 25 katı) ulaşırsa mümkündür. FIRE Modu hesaplayıcımız, finansal bağımsızlığa ulaşmak ve erken emekli olmak için herhangi bir gelecek fiyat hedefinde ne kadar BTC'ye ihtiyacınız olduğunu gösterir." } },
                { "@type": "Question", "name": "Bu Bitcoin emeklilik hesaplayıcısı ücretsiz mi?", "acceptedAnswer": { "@type": "Answer", "text": "Evet, bu araç %100 ücretsizdir, abonelik veya gizli ücret yoktur. Tüm hesaplamalar tarayıcınızda yerel olarak yapılır — kişisel finansal bilgileriniz saklanmaz." } },
                { "@type": "Question", "name": "Bitcoin emeklilik çekimlerini vergiler nasıl etkiler?", "acceptedAnswer": { "@type": "Answer", "text": "ABD'de bir yıldan uzun tutulan Bitcoin'in satışı uzun vadeli sermaye kazancı vergisi doğurur; oran gelire göre %0-20 arasında değişir, yüksek gelirler için ek %3,8 NIIT uygulanabilir. Çekimleri belirli gelir eşiklerinin altında tutmak yılda binlerce dolar tasarruf sağlayabilir." } },
                { "@type": "Question", "name": "Bitcoin emekliliğinde sıralı getiri riski nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Sıralı getiri riski, emekliliğin ilk yıllarındaki büyük bir piyasa çöküşünün — ortalama getiriler pozitif olsa bile — portföyü kalıcı olarak zedelemesidir. Azaltmak için 2 yıllık nakit/stablecoin tamponu tutmak ve döngü farkındalıklı çekim oranları kullanmak etkilidir." } },
                { "@type": "Question", "name": "FIRE Modu Tahminci'den nasıl farklıdır?", "acceptedAnswer": { "@type": "Answer", "text": "Tahminci mevcut tasarruf planınızın zaman içinde sizi nereye götüreceğini projelendirir. FIRE Modu geriye doğru çalışır — yıllık giderlerinizi ve çekim oranınızı alır, ardından Bitcoin portföyünüzün bu giderleri dört büyüme senaryosunda (Ayı, Base, Boğa, Hiper) süresiz olarak karşılayabileceği tarihi hesaplar." } }
              ]
            })}
          </script>
        )}

        <script type="application/ld+json">
          {JSON.stringify(buildCalculatorSpeakable(language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi' : 'https://bitcoincalculator.tools/calculators/retirement', language))}
        </script>
      </Helmet>

      <BreadcrumbSchema
        language={language}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Retirement Calculator", url: "https://bitcoincalculator.tools/calculators/retirement" }
        ]}
      />
    </>
  );
};
