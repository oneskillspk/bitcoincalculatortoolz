import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: "What is a Bitcoin drawdown?", a: "A drawdown is the peak-to-trough decline in Bitcoin's price before a new high is reached. It measures how much value is lost from a previous all-time high during a correction or crash. A 50% drawdown means Bitcoin's price fell by half from its peak." },
  { q: "What was Bitcoin's worst crash?", a: "Bitcoin's worst crash was approximately 93% in 2011 when the price fell from around $32 to under $2. However, even this devastating drawdown eventually recovered to new all-time highs. More recent corrections have been less severe as the market matures." },
  { q: "Has Bitcoin always recovered from crashes?", a: "Yes. Historically, every completed Bitcoin drawdown has eventually recovered to reach new all-time highs. However, recovery times vary significantly — from weeks for minor corrections to over two years for major bear markets. Past recovery is not a guarantee of future recovery." },
  { q: "Should I buy during a drawdown?", a: "Historically, buying during deep drawdowns (especially above 50%) has been extremely profitable over multi-year time horizons. However, timing the exact bottom is nearly impossible. Dollar-cost averaging (DCA) during drawdown periods is generally considered a lower-risk strategy than trying to time a lump-sum purchase." },
  { q: "How is current drawdown from ATH calculated?", a: "Current drawdown is calculated as ((ATH Price − Current Price) / ATH Price) × 100%. Bitcoin's most recent all-time high is $126,287 set on October 6, 2025, so a price of $82,000 today implies a drawdown of about 35%. The metric is updated in real-time using live CoinGecko price data, with CryptoCompare and a bundled snapshot as fallbacks." },
  { q: "How many times has Bitcoin dropped more than 80%?", a: "Four times. Bitcoin fell more than 80% from its all-time high in 2011 (-93%), late 2013 to 2015 (-85%), 2017 to 2018 (-84%), and 2021 to 2022 (-77%). Each crash was triggered by a different catalyst, from exchange failures to regulatory crackdowns, but Bitcoin recovered to new all-time highs after every single one." },
  { q: "What was Bitcoin's worst drawdown ever?", a: "The worst drawdown was approximately 93% in 2011. Bitcoin dropped from around $32 to under $2 in about five months. At the time, it looked like the end of the experiment. Within 18 months, the price surpassed its previous peak and continued climbing past $1,000 by late 2013." },
  { q: "How long did Bitcoin take to recover from each crash?", a: "Recovery times range from 6 months to 3 years. The April 2013 flash crash recovered in about 6 months. The 2014 Mt. Gox bear market took roughly 36 months. The 2018 crash also needed about 36 months. The 2022 drawdown recovered in approximately 24 months, with BTC reclaiming $69,000 in March 2024 and pushing on to a new $126,287 ATH on October 6, 2025." },
  { q: "Is the 2025–26 correction worse than 2022?", a: "Not so far. After topping at $126,287 on October 6, 2025, Bitcoin has corrected roughly 35% into mid-2026 — well short of the 2022 cycle's -77%. Spot ETF inflows, the April 2024 halving, and corporate treasuries appear to be holding a higher floor than previous cycles." },
  { q: "Has Bitcoin ever not recovered from a major crash?", a: "Every completed Bitcoin drawdown has eventually recovered to a new all-time high. The drawdown from the October 6, 2025 ATH of $126,287 is still open as of May 2026. Past recovery does not guarantee future recovery — each cycle carried real risk that prices might not return." },
];

const faqsTr = [
  { q: "Bitcoin düşüşü nedir?", a: "Düşüş, yeni bir yüksek seviyeye ulaşılmadan önce Bitcoin'in fiyatındaki zirve-dip gerilemesidir. Düzeltme veya çöküş sırasında önceki tüm zamanlar yüksekten ne kadar değer kaybedildiğini ölçer. %50'lik bir düşüş, Bitcoin'in fiyatının zirvesinden yarıya indiği anlamına gelir." },
  { q: "Bitcoin'in en kötü çöküşü neydi?", a: "Bitcoin'in en kötü çöküşü, fiyatın yaklaşık 32 dolardan 2 doların altına düştüğü 2011'de yaşanan yaklaşık %93'lük düşüştü. Ancak bu yıkıcı düşüş bile eninde sonunda yeni tüm zamanlar yükseklerine kurtarıldı. Piyasa olgunlaştıkça daha yakın tarihli düzeltmeler daha az şiddetli olmuştur." },
  { q: "Bitcoin her zaman çöküşlerden kurtuldu mu?", a: "Evet. Tarihsel olarak tamamlanan her Bitcoin düşüşü eninde sonunda yeni tüm zamanlar yükseğine ulaşmak için kurtarıldı. Ancak kurtarma süreleri önemli ölçüde farklılık gösterir — küçük düzeltmeler için haftalar, büyük ayı piyasaları için iki yıldan fazla. Geçmişteki kurtarma, gelecekteki kurtarmanın garantisi değildir." },
  { q: "Düşüş sırasında almalı mıyım?", a: "Tarihsel olarak, derin düşüşler sırasında (özellikle %50'nin üzerinde) alım yapmak çok yıllı zaman dilimlerinde son derece kârlı olmuştur. Ancak kesin dipteki zamanlamayı yakalamak neredeyse imkânsızdır. Düşüş dönemlerinde dolar maliyeti ortalama (DMA) yapmak, toplu alım zamanlaması yapmaya çalışmaktan genel olarak daha düşük riskli bir strateji olarak kabul edilir." },
  { q: "ATH'den mevcut düşüş nasıl hesaplanır?", a: "Güncel düşüş şu formülle hesaplanır: ((ATH Fiyatı − Güncel Fiyat) / ATH Fiyatı) × %100. Bitcoin'in en yeni ATH'si 6 Ekim 2025'te kaydedilen 126.287 $; bugün 82.000 $ fiyat yaklaşık %35 düşüşe karşılık gelir. Veriler canlı CoinGecko fiyatından alınır; CryptoCompare ve yerel anlık görüntü yedek olarak çalışır." },
  { q: "Bitcoin kaç kez %80'den fazla düştü?", a: "Dört kez. Bitcoin tüm zamanlar yüksekten 2011'de (-%93), 2013 sonundan 2015'e (-%85), 2017'den 2018'e (-%84) ve 2021'den 2022'ye (-%77) %80'den fazla düştü. Her çöküş borsa başarısızlıklarından düzenleyici baskılara kadar farklı bir katalizörden tetiklendi; ancak Bitcoin her birinden yeni tüm zamanlar yükseklerine kurtarıldı." },
  { q: "Bitcoin'in tüm zamanların en kötü düşüşü neydi?", a: "En kötü düşüş, 2011'deki yaklaşık %93'lük düşüştü. Bitcoin yaklaşık beş ayda yaklaşık 32 dolardan 2 doların altına düştü. O dönemde deneyin sonu gibi görünüyordu. 18 ay içinde fiyat önceki zirvesini aştı ve 2013 sonunda 1.000 doların üzerine tırmanmaya devam etti." },
  { q: "Bitcoin her çöküşten kurtulmak için ne kadar zaman harcadı?", a: "Kurtarma süreleri 6 aydan 3 yıla kadar değişmektedir. Nisan 2013 flash çöküşü yaklaşık 6 ayda kurtarıldı. 2014 Mt. Gox ayı piyasası yaklaşık 36 ay sürdü. 2018 çöküşü de yaklaşık 36 aya ihtiyaç duydu. 2022 düşüşü, BTC'nin Mart 2024'te 69.000 doları geri kazanmasıyla yaklaşık 24 ayda kurtarıldı; ardından 6 Ekim 2025'te yeni 126.287 $ ATH'sine ulaştı." },
  { q: "2025–26 düzeltmesi 2022'den daha kötü mü?", a: "Henüz değil. Bitcoin 6 Ekim 2025'te 126.287 $ ile zirve yaptıktan sonra 2026 ortasına kadar yaklaşık %35 düştü — 2022 döngüsündeki -%77'nin oldukça altında. Spot ETF girişleri, Nisan 2024 halving'i ve kurumsal hazineler bu döngüde önceki döngülere göre daha yüksek bir taban tutuyor görünüyor." },
  { q: "Bitcoin hiç büyük bir çöküşten kurtarılamadı mı?", a: "Tamamlanan her Bitcoin düşüşü eninde sonunda yeni bir tüm zamanlar yüksek belirlemek için kurtarıldı. 6 Ekim 2025 ATH'si 126.287 $'dan başlayan düşüş, Mayıs 2026 itibarıyla hâlâ açık. Geçmişteki kurtarma gelecekteki kurtarmayı garanti etmez." },
];

export const DrawdownFAQSection = () => {
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
              ? 'Bitcoin çöküşleri, kurtarmalar ve düşüş analizi hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about Bitcoin crashes, recoveries, and drawdown analysis'}
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
