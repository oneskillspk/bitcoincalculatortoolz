import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Shield, HelpCircle, Info } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export const FearGreedContentSections = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-6 max-w-5xl space-y-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><HelpCircle className="w-5 h-5 text-primary" /></div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'Bitcoin Korku ve Açgözlülük Endeksi Nedir?' : 'What is the Bitcoin Fear & Greed Index?'}
            </h2>
          </div>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              {tr 
                ? 'Bitcoin Korku ve Açgözlülük Endeksi, kripto para piyasasının mevcut duygusal durumunu 0 ile 100 arasında bir puanla özetleyen bir duyarlılık göstergesidir. Piyasa katılımcıları aşırı açgözlü hale geldiğinde (FOMO), bu genellikle bir düzeltme sinyali olabilir. Aksine, yaygın korku olduğunda, bu genellikle stratejik yatırımcılar için bir alım fırsatı sunar.'
                : 'The Bitcoin Fear & Greed Index is a sentiment indicator that summarizes the current emotional state of the crypto market on a scale from 0 to 100. When market participants become overly greedy (FOMO), it can often signal a pending correction. Conversely, when widespread fear is present, it often presents a buying opportunity for strategic investors.'}
            </p>
            <p>
              {tr
                ? 'Endeks altı temel faktörü birleştirir: Oynaklık (%25), Piyasa Momentumu/Hacmi (%25), Sosyal Medya Duyarlılığı (%15), Anketler (%15), Bitcoin Hakimiyeti (%10) ve Google Trends verileri (%10). Bu ağırlıklı yaklaşım, piyasa psikolojisinin tekil fiyat hareketlerinden daha derin bir analizini sunar.'
                : 'The index combines six key factors: Volatility (25%), Market Momentum/Volume (25%), Social Media Sentiment (15%), Surveys (15%), Bitcoin Dominance (10%), and Google Trends data (10%). This weighted approach provides a deeper analysis of market psychology than price action alone.'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg"><TrendingUp className="w-5 h-5 text-success" /></div>
              <h3 className="text-xl font-bold text-foreground">
                {tr ? 'Aşırı Korku (0-25)' : 'Extreme Fear (0-25)'}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {tr 
                ? 'Yatırımcıların aşırı endişeli olduğu dönemlerdir. Tarihsel olarak bu, piyasanın dip yaptığı ve "kanlı" bir ortamın stratejik uzun vadeli girişler için en iyi risk/ödül oranını sunduğu bir "alım" bölgesidir.'
                : 'Periods where investors are overly anxious. Historically, this is a "buy" zone where the market may be bottoming out, and "blood in the streets" provides the best risk-to-reward ratio for strategic long-term entries.'}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-destructive" /></div>
              <h3 className="text-xl font-bold text-foreground">
                {tr ? 'Aşırı Açgözlülük (75-100)' : 'Extreme Greed (75-100)'}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {tr 
                ? 'Piyasanın aşırı ısındığı ve FOMO\'nun zirve yaptığı dönemlerdir. Bu okuma, piyasanın bir düzeltme için olgunlaştığını ve kâr almayı düşünmek veya yeni girişlerde temkinli olmak gerektiğini gösterebilir.'
                : 'Periods where the market is overheated and FOMO (Fear Of Missing Out) peaks. This reading can indicate the market is due for a correction, suggesting it may be time to take profits or be cautious with new entries.'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Shield className="w-5 h-5 text-primary" /></div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'Yatırım Stratejinizde Nasıl Kullanılır?' : 'How to Use it in Your Investment Strategy'}
            </h2>
          </div>
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p>
              {tr 
                ? 'Başarılı yatırımcılar bu endeksi genellikle kontreryan (tersine) bir sinyal olarak kullanır. Baron Rothschild\'in ünlü sözündeki gibi: "Sokaklarda kan varken alım yapın." Endeks Aşırı Korku bölgesindeyken DCA (Dolar Maliyeti Ortalaması) miktarınızı artırmak, Aşırı Açgözlülük bölgesindeyken ise nakit biriktirmek tarihsel olarak üstün getiriler sağlamıştır.'
                : 'Successful investors often use this index as a contrarian signal. As Baron Rothschild famously said: "Buy when there is blood in the streets." Increasing your DCA (Dollar-Cost Averaging) amount when the index is in Extreme Fear and accumulating cash during Extreme Greed has historically yielded superior returns.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
