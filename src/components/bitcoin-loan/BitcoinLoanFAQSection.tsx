import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: "What is a Bitcoin-backed loan?", a: "A Bitcoin-backed loan lets you borrow fiat currency (like USD) by locking your Bitcoin as collateral. You keep ownership of your BTC — the lender holds it until you repay the loan. Unlike selling, borrowing doesn't trigger a taxable capital gains event, making it a tax-efficient way to access liquidity." },
  { q: "What is LTV (Loan-to-Value) ratio?", a: "LTV is the ratio of your loan amount to the value of your Bitcoin collateral. A 50% LTV on $100,000 of BTC means you borrow $50,000. Lower LTV ratios are safer because Bitcoin's price must drop further before triggering liquidation. Most platforms offer LTV between 20% and 75%." },
  { q: "What happens if Bitcoin's price drops during my loan?", a: "If Bitcoin's price falls far enough, your LTV rises. When it reaches the margin call threshold (typically 65-80%), the platform asks you to add more collateral or repay part of the loan. If price keeps dropping to the liquidation threshold (80-90%), the platform force-sells your Bitcoin to recover the loan amount." },
  { q: "How is the liquidation price calculated?", a: "Liquidation price = (Loan Amount ÷ BTC Collateral) ÷ (Liquidation LTV ÷ 100). For example, if you borrow $50,000 against 1 BTC with an 80% liquidation LTV, your liquidation price is $62,500. Bitcoin must drop below this price to trigger liquidation." },
  { q: "Is borrowing against Bitcoin better than selling?", a: "It depends on your situation. Borrowing avoids capital gains tax (up to 23.8% federally) and lets you keep Bitcoin's upside exposure. However, you pay interest and face liquidation risk. Our calculator compares both scenarios so you can see which option costs less based on your specific numbers." },
  { q: "What interest rates do Bitcoin loan platforms charge?", a: "Rates vary widely: 4-8% for conservative, institutional-grade platforms; 8-12% for standard CeFi platforms; and 5-20%+ for DeFi protocols. Rates depend on LTV ratio, loan term, and platform. Higher LTV loans typically carry higher interest rates." },
  { q: "What custody model should I compare before choosing a Bitcoin loan platform?", a: "Compare who controls the keys while the loan is active. Full-custody lenders hold your BTC directly or through a custodian, collaborative custody usually uses multisig, and some platforms use automated collateral wallets. Custody model matters because counterparty risk, withdrawal speed, and liquidation procedures differ by setup." },
  { q: "How do LTV, margin calls, and liquidation risk connect?", a: "LTV rises when Bitcoin falls because the loan stays roughly the same while collateral value drops. A margin call is the warning zone where you may need to add BTC or repay part of the loan. Liquidation is the forced-sale zone where collateral can be sold to protect the lender." },
  { q: "Can I lose more than my collateral?", a: "On most platforms, Bitcoin-backed loans are non-recourse, meaning the lender can only seize your collateral — they can't come after your other assets. However, some platforms may have different terms, so always read the fine print before borrowing." },
  { q: "Is this Bitcoin loan calculator free?", a: "Yes — completely free, no signup required. All calculations run in your browser for privacy. It covers LTV analysis, liquidation pricing, amortization schedules, and a full borrow-vs-sell tax comparison." },
];

const faqsTr = [
  { q: "Bitcoin teminatlı kredi nedir?", a: "Bitcoin teminatlı kredi, Bitcoin'inizi teminat olarak kilitleyerek fiat para birimi (USD gibi) borçlanmanızı sağlar. BTC'nizin mülkiyetini elinde tutarsınız — borç veren, krediyi geri ödeyene kadar bunu tutar. Satışın aksine, borçlanma vergiye tabi sermaye kazancı olayını tetiklemez ve bu onu likiditeye erişmenin vergi açısından verimli bir yöntemi yapar." },
  { q: "LTV (Kredi-Değer) oranı nedir?", a: "LTV, kredi tutarınızın Bitcoin teminatınızın değerine oranıdır. 100.000 $ değerinde BTC üzerinde %50 LTV, 50.000 $ borçlandığınız anlamına gelir. Daha düşük LTV oranları daha güvenlidir çünkü tasfiyeyi tetiklemeden önce Bitcoin fiyatının daha fazla düşmesi gerekir. Çoğu platform %20 ile %75 arasında LTV sunar." },
  { q: "Kredi süresinde Bitcoin fiyatı düşerse ne olur?", a: "Bitcoin fiyatı yeterince düşerse LTV'niz yükselir. Marj çağrısı eşiğine (%65-80 genellikle) ulaştığında platform sizden daha fazla teminat eklemenizi veya kredinin bir kısmını geri ödemenizi ister. Fiyat tasfiye eşiğine (%80-90) kadar düşmeye devam ederse platform kredi tutarını geri almak için Bitcoin'inizi zorla satar." },
  { q: "Tasfiye fiyatı nasıl hesaplanır?", a: "Tasfiye fiyatı = (Kredi Tutarı ÷ BTC Teminatı) ÷ (Tasfiye LTV ÷ 100). Örneğin %80 tasfiye LTV'siyle 1 BTC karşılığında 50.000 $ borçlanırsanız tasfiye fiyatınız 62.500 $'dır. Tasfiyeyi tetiklemek için Bitcoin'in bu fiyatın altına düşmesi gerekir." },
  { q: "Bitcoin karşılığı borçlanmak satmaktan daha mı iyi?", a: "Durumunuza bağlıdır. Borçlanmak sermaye kazancı vergisinden (federal olarak %23,8'e kadar) kaçınır ve Bitcoin'in yukarı yönlü maruziyetini korumanızı sağlar. Ancak faiz ödersiniz ve tasfiye riskiyle karşı karşıya kalırsınız. Hesap makinemiz her iki senaryoyu da karşılaştırarak belirli rakamlarınıza göre hangi seçeneğin daha az maliyetli olduğunu görmenizi sağlar." },
  { q: "Bitcoin kredi platformları hangi faiz oranlarını talep eder?", a: "Oranlar büyük ölçüde farklılık gösterir: Muhafazakâr, kurumsal düzeyde platformlar için %4-8; standart CeFi platformları için %8-12; ve DeFi protokolleri için %5-20+. Oranlar LTV oranına, kredi vadesine ve platforma bağlıdır. Daha yüksek LTV'li krediler genellikle daha yüksek faiz oranları taşır." },
  { q: "Bitcoin kredi platformu seçmeden önce hangi saklama modelini karşılaştırmalıyım?", a: "Kredi aktifken anahtarları kimin kontrol ettiğini karşılaştırın. Tam saklama borç verenler BTC'nizi doğrudan veya bir saklama şirketi aracılığıyla tutar, işbirlikçi saklama genellikle çoklu imza kullanır ve bazı platformlar otomatik teminat cüzdanları kullanır. Saklama modeli, karşı taraf riski, para çekme hızı ve tasfiye prosedürleri kuruluma göre farklılık gösterdiğinden önemlidir." },
  { q: "LTV, marj çağrıları ve tasfiye riski nasıl bağlantılıdır?", a: "Kredi kabaca aynı kalırken teminat değeri düştüğünden Bitcoin düştüğünde LTV yükselir. Marj çağrısı, BTC eklemeniz veya kredinin bir kısmını geri ödemeniz gerekebileceği uyarı bölgesidir. Tasfiye ise borç vereni korumak için teminatın satılabileceği zorunlu satış bölgesidir." },
  { q: "Teminatımdan daha fazlasını kaybedebilir miyim?", a: "Çoğu platformda Bitcoin teminatlı krediler rücusuz niteliktedir; yani borç veren yalnızca teminatınıza el koyabilir — diğer varlıklarınızın peşine düşemez. Ancak bazı platformların farklı koşulları olabilir, bu yüzden borçlanmadan önce her zaman ince yazıları okuyun." },
  { q: "Bu Bitcoin kredi hesaplayıcısı ücretsiz mi?", a: "Evet — tamamen ücretsiz, kayıt gerekmez. Tüm hesaplamalar gizlilik için tarayıcınızda çalışır. LTV analizi, tasfiye fiyatlaması, amortisman planları ve tam borçlanma-satış vergisi karşılaştırmasını kapsar." },
];

export const BitcoinLoanFAQSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqs = tr ? faqsTr : faqsEn;

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
            <HelpCircle className="w-4 h-4" />
            {tr ? 'SSS' : 'FAQ'}
          </div>
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-4 bg-background/50">
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
