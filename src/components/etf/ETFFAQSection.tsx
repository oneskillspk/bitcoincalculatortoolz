import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: "What is a Bitcoin ETF?", a: "A Bitcoin ETF (Exchange-Traded Fund) is a regulated investment vehicle that tracks the price of Bitcoin. It allows investors to gain Bitcoin exposure through a traditional brokerage account without directly buying, storing, or securing cryptocurrency." },
  { q: "What is an expense ratio and how does it affect my returns?", a: "An expense ratio is the annual fee charged by the ETF provider, expressed as a percentage of your investment. For example, IBIT charges 0.25% per year. While this seems small, the fee compounds over time — on a $10,000 investment held for 10 years, it can cost hundreds of dollars in lost returns." },
  { q: "Which Bitcoin ETF has the lowest fees?", a: "As of 2026, Grayscale's Bitcoin Mini Trust (BTC) at 0.15% and Bitwise's BITB at 0.20% have the lowest expense ratios among major spot Bitcoin ETFs. Both are significantly cheaper than the legacy Grayscale GBTC at 1.50%." },
  { q: "Is buying a Bitcoin ETF the same as owning Bitcoin?", a: "No. When you buy a Bitcoin ETF, you own shares of a fund that holds Bitcoin — you do not directly own Bitcoin. This means you cannot send, receive, or self-custody the underlying BTC. You also pay ongoing management fees that direct Bitcoin holders do not." },
  { q: "Should I buy a Bitcoin ETF or buy Bitcoin directly?", a: "It depends on your priorities. ETFs offer convenience, regulatory protections, and tax-advantaged accounts (IRA/401k). Direct Bitcoin ownership gives you self-custody, no ongoing fees, and true ownership. This calculator helps you compare the cost difference between both approaches." },
  { q: "What is the cheapest Bitcoin ETF in 2026?", a: "Grayscale's Bitcoin Mini Trust (ticker: BTC) is the cheapest at 0.15% annually. BITB from Bitwise is second at 0.20%, followed by ARKB at 0.21%. IBIT and FBTC both charge 0.25%. The legacy GBTC remains the most expensive at 1.50%, roughly 10x the cheapest competitor." },
  { q: "Is IBIT or FBTC better?", a: "Both IBIT (BlackRock) and FBTC (Fidelity) charge identical 0.25% expense ratios and hold real Bitcoin in cold storage. The functional difference is brand and custodian: IBIT uses Coinbase Custody, FBTC uses Fidelity Digital Assets. IBIT has higher AUM and tighter bid-ask spreads, but for a long-term hold the two are essentially interchangeable." },
  { q: "How much do Bitcoin ETF fees cost over 10 years?", a: "On a $10,000 investment with BTC averaging 25% annual returns, a 0.25% expense ratio (IBIT/FBTC) costs about $2,316 over 10 years. The 0.15% Bitcoin Mini Trust costs $1,395 over the same period. Grayscale's 1.50% GBTC bleeds roughly $13,200 — over 5x more than the cheapest options." },
  { q: "Can I hold a Bitcoin ETF in my IRA or 401k?", a: "Yes. Spot Bitcoin ETFs can be held in any standard brokerage IRA, Roth IRA, or 401k that allows ETFs. This is one of the biggest advantages of ETFs over direct Bitcoin: gains inside a Roth IRA grow completely tax-free. Check with your plan administrator, since some 401k plans restrict the available ETF list." },
  { q: "What happens to my ETF shares if BlackRock or Fidelity goes bankrupt?", a: "The Bitcoin held by the ETF is segregated at a third-party custodian (Coinbase Custody or Fidelity Digital Assets) and legally belongs to shareholders, not the issuer. If BlackRock or Fidelity went bankrupt, the underlying BTC would be transferred to a new fund manager." },
  { q: "How much Bitcoin does one IBIT share represent?", a: "Each BlackRock IBIT share represents approximately 0.00095 BTC as of March 2026. This ratio decreases slightly over time as the 0.25% annual management fee is deducted from the fund's Bitcoin holdings." },
  { q: "What is the difference between owning IBIT and owning Bitcoin directly?", a: "IBIT holders have indirect exposure to Bitcoin through a regulated fund structure. Direct Bitcoin ownership gives you full custody and no management fees, but requires a wallet and private key management. IBIT charges 0.25% annually and involves no custody responsibility. Direct Bitcoin ownership has no ongoing fees and cannot be frozen by a custodian." },
];

const faqsTr = [
  { q: "Bitcoin ETF'i nedir?", a: "Bitcoin ETF'i (Borsa Yatırım Fonu), Bitcoin fiyatını takip eden düzenlenmiş bir yatırım aracıdır. Yatırımcıların, kripto parayı doğrudan satın almadan, depolamadan veya güvence altına almadan geleneksel bir aracı kurum hesabı aracılığıyla Bitcoin'e maruz kalmasına olanak tanır." },
  { q: "Gider oranı nedir ve getirilerimi nasıl etkiler?", a: "Gider oranı, ETF sağlayıcısının yatırımınızın yüzdesi olarak ifade edilen yıllık ücretidir. Örneğin IBIT yılda %0,25 ücret alır. Küçük görünse de ücret zamanla bileşik büyür — 10 yıl boyunca elde tutulan 10.000 $'lık bir yatırımda, yüzlerce dolar kayıp getiriye mal olabilir." },
  { q: "En düşük ücretli Bitcoin ETF'i hangisi?", a: "2026 itibarıyla, Grayscale'in Bitcoin Mini Trust'ı (BTC) %0,15 ve Bitwise'ın BITB'i %0,20 ile büyük spot Bitcoin ETF'leri arasında en düşük gider oranlarına sahiptir. Her ikisi de eski Grayscale GBTC'nin %1,50 oranından önemli ölçüde daha ucuzdur." },
  { q: "Bitcoin ETF'i satın almak, Bitcoin'e sahip olmakla aynı şey mi?", a: "Hayır. Bir Bitcoin ETF'i satın aldığınızda, Bitcoin tutan bir fonun hisselerine sahip olursunuz — doğrudan Bitcoin'e sahip olmazsınız. Bu, temel BTC'yi gönderemeyeceğiniz, alamayacağınız veya kendi saklama yerinizde tutamayacağınız anlamına gelir. Ayrıca doğrudan Bitcoin sahiplerinin ödemediği devam eden yönetim ücretleri ödersiniz." },
  { q: "Bitcoin ETF'i mi satın almalıyım yoksa doğrudan Bitcoin mi?", a: "Önceliklerinize bağlıdır. ETF'ler kolaylık, düzenleyici korumalar ve vergi avantajlı hesaplar (IRA/401k) sunar. Doğrudan Bitcoin sahipliği size öz saklama, devam eden ücret olmaması ve gerçek sahiplik sağlar. Bu hesap makinesi her iki yaklaşım arasındaki maliyet farkını karşılaştırmanıza yardımcı olur." },
  { q: "2026'da en ucuz Bitcoin ETF'i hangisi?", a: "Grayscale'in Bitcoin Mini Trust'ı (hisse kodu: BTC) yıllık %0,15 ile en ucuzudur. Bitwise'ın BITB'i %0,20 ile ikinci, ardından ARKB %0,21 ile gelir. IBIT ve FBTC her ikisi de %0,25 talep eder. Eski GBTC, en ucuz rakibinden yaklaşık 10 kat daha pahalı olan %1,50 ile en pahalı olmaya devam etmektedir." },
  { q: "IBIT mi FBTC mi daha iyi?", a: "Hem IBIT (BlackRock) hem de FBTC (Fidelity) aynı %0,25 gider oranı alır ve gerçek Bitcoin'i soğuk depoda tutar. İşlevsel fark marka ve saklama kurumunda yatar: IBIT, Coinbase Custody kullanır, FBTC ise Fidelity Digital Assets kullanır. IBIT daha yüksek AUM ve daha dar alış-satış spread'lerine sahiptir, ancak uzun vadeli bir tutma için ikisi özünde birbirinin yerini tutabilir." },
  { q: "Bitcoin ETF ücretleri 10 yılda ne kadara mal olur?", a: "BTC'nin yıllık ortalama %25 getiriyle 10.000 $'lık bir yatırımda, %0,25 gider oranı (IBIT/FBTC) 10 yılda yaklaşık 2.316 $'a mal olur. %0,15 Bitcoin Mini Trust aynı dönemde 1.395 $'a mal olur. Grayscale'in %1,50 GBTC'si yaklaşık 13.200 $'lık kayba neden olur — en ucuz seçeneklerden 5 kat fazla." },
  { q: "Bitcoin ETF'imi IRA veya 401k'da tutabilir miyim?", a: "Evet. Spot Bitcoin ETF'leri, ETF'lere izin veren herhangi bir standart aracı kurum IRA'sı, Roth IRA'sı veya 401k'sında tutulabilir. Bu, ETF'lerin doğrudan Bitcoin'e göre en büyük avantajlarından biridir: Roth IRA içindeki kazançlar ne kadar yükselirse yükselsin tamamen vergisiz büyür." },
  { q: "BlackRock veya Fidelity iflas ederse ETF hisselerime ne olur?", a: "ETF tarafından tutulan Bitcoin, üçüncü taraf bir saklama kurumunda (Coinbase Custody veya Fidelity Digital Assets) ayrıştırılmış durumdadır ve yasal olarak ihraççıya değil, hissedarlara aittir. BlackRock veya Fidelity iflas etse bile temel BTC yeni bir fon yöneticisine devredilirdi." },
  { q: "Bir IBIT hissesi ne kadar Bitcoin temsil eder?", a: "Her BlackRock IBIT hissesi, Mart 2026 itibarıyla yaklaşık 0,00095 BTC temsil etmektedir. Bu oran, %0,25 yıllık yönetim ücreti fonun Bitcoin varlıklarından düşüldüğü için zamanla hafifçe azalır." },
  { q: "IBIT'e sahip olmak ile doğrudan Bitcoin'e sahip olmak arasındaki fark nedir?", a: "IBIT sahipleri, düzenlenmiş bir fon yapısı aracılığıyla Bitcoin'e dolaylı maruz kalır. Doğrudan Bitcoin sahipliği, tam saklama ve yönetim ücreti olmaksızın size gerçek sahiplik sağlar, ancak cüzdan ve özel anahtar yönetimi gerektirir. IBIT yıllık %0,25 ücret alır. Doğrudan Bitcoin sahipliğinde devam eden ücret yoktur ve bir saklama kurumu tarafından dondurulamamaktadır." },
];

export const ETFFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqs = tr ? faqsTr : faqsEn;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <HelpCircle className="w-4 h-4" />
            {tr ? 'SSS' : 'FAQ'}
          </div>
          <h2 className="text-h2 font-bold mb-4 text-foreground">
            {tr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {tr
              ? 'Bitcoin ETF\'leri ve ücret karşılaştırmaları hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about Bitcoin ETFs and fee comparisons'}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border/50 rounded-xl px-6">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5 text-base">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
