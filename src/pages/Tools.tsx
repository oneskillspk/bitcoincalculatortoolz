import { Helmet } from "react-helmet-async";
import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  Shield, 
  BarChart3, 
  Globe, 
  Smartphone,
  TrendingUp,
  ArrowRight,
  HelpCircle,
  Zap,
  Users,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToolsFAQSection } from "@/components/ToolsFAQSection";
import { useLanguage } from "@/contexts/LanguageContext";


type ToolDef = {
  id: string;
  title: { en: string; tr: string };
  description: { en: string; tr: string };
  icon: typeof Wallet;
  available: boolean;
  linkTo: string | null;
};

const TOOLS: ToolDef[] = [
  {
    id: 'portfolio-tracker',
    title: { en: 'Portfolio Tracker', tr: 'Portföy Takipçisi' },
    description: {
      en: 'Track your Bitcoin holdings across multiple wallets and exchanges',
      tr: 'Birden fazla cüzdan ve borsadaki Bitcoin varlıklarınızı takip edin',
    },
    icon: Wallet,
    available: true,
    linkTo: '/calculators/portfolio-tracker',
  },
  {
    id: 'security-checker',
    title: { en: 'Security Checker', tr: 'Güvenlik Denetleyicisi' },
    description: {
      en: 'Analyze wallet security and get personalized security recommendations',
      tr: 'Cüzdan güvenliğinizi analiz edin ve kişisel güvenlik önerileri alın',
    },
    icon: Shield,
    available: false,
    linkTo: null,
  },
  {
    id: 'market-analyzer',
    title: { en: 'Market Analyzer', tr: 'Piyasa Analizcisi' },
    description: {
      en: 'Explore Bitcoin price history, ROI scenarios, and cross-asset comparisons',
      tr: 'Bitcoin fiyat geçmişini, ROI senaryolarını ve varlıklar arası karşılaştırmaları keşfedin',
    },
    icon: BarChart3,
    available: true,
    linkTo: '/calculators/what-if',
  },
  {
    id: 'network-explorer',
    title: { en: 'Transaction Fee Estimator', tr: 'İşlem Ücreti Tahmincisi' },
    description: {
      en: 'Real-time Bitcoin network fee estimation and mempool analysis',
      tr: 'Gerçek zamanlı Bitcoin ağ ücreti tahmini ve mempool analizi',
    },
    icon: Globe,
    available: true,
    linkTo: '/calculators/transaction-fees',
  },
  {
    id: 'mobile-alerts',
    title: { en: 'Price Alerts', tr: 'Fiyat Uyarıları' },
    description: {
      en: 'Get instant mobile notifications for Bitcoin price movements',
      tr: 'Bitcoin fiyat hareketleri için anlık mobil bildirimler alın',
    },
    icon: Smartphone,
    available: false,
    linkTo: null,
  },
  {
    id: 'trend-predictor',
    title: { en: 'Inflation Dashboard', tr: 'Enflasyon Paneli' },
    description: {
      en: 'Compare Bitcoin supply vs fiat money printing with real data',
      tr: 'Gerçek verilerle Bitcoin arzını fiat para basımıyla karşılaştırın',
    },
    icon: TrendingUp,
    available: true,
    linkTo: '/calculators/inflation-dashboard',
  },
];

const Tools = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const navigate = useNavigate();
  const localize = useLocalizedHref();
  const tools = TOOLS;
  
  const handleRequestTool = () => {
    navigate(localize('/contact'));
  };

  return (
    <>
  <Helmet>
    {/* Primary Meta Tags */}
    <title>{tr ? 'Bitcoin Araçları | Bitcoin Calculator Tools' : 'Bitcoin Tools | Bitcoin Calculator Tools'}</title>
    <meta name="description" content={tr ? 'Ciddi yığıcılar için ücretsiz Bitcoin araçları. Grafikler, dönüştürücüler, zincir üstü veriler, ücret hesaplayıcıları ve daha fazlası.' : 'Free Bitcoin tools for serious stackers. Charts, converters, on-chain data, fee calculators and more. Built for Bitcoin investors who want answers fast.'} />
    <link rel="canonical" href={tr ? "https://bitcoincalculator.tools/tr/araclar" : "https://bitcoincalculator.tools/tools"} />
    <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/tools" />
    <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/araclar" />
    <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/tools" />

    {/* Open Graph Meta Tags */}
    <meta property="og:title" content={tr ? 'Bitcoin Araçları | Bitcoin Calculator Tools' : 'Bitcoin Tools | Bitcoin Calculator Tools'} />
    <meta property="og:description" content={tr ? 'Ciddi yığıcılar için ücretsiz Bitcoin araçları. Grafikler, dönüştürücüler, zincir üstü veriler, ücret hesaplayıcıları ve daha fazlası. Hızlı yanıt isteyen Bitcoin yatırımcıları için yapıldı.' : 'Free Bitcoin tools for serious stackers. Charts, converters, on-chain data, fee calculators and more. Built for Bitcoin investors who want answers fast.'} />
    <meta property="og:url" content={tr ? "https://bitcoincalculator.tools/tr/araclar" : "https://bitcoincalculator.tools/tools"} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="bitcoincalculator.tools" />

    {/* Twitter Card Meta Tags */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={language==='tr'?'Bitcoin Araçları | Bitcoin Hesaplayıcı Araçları':'Bitcoin Tools | Bitcoin Calculator Tools'} />
    <meta name="twitter:description" content={language==='tr'?'Ciddi yığıcılar için ücretsiz Bitcoin araçları — grafikler, dönüştürücüler, zincir üstü veriler ve daha fazlası.':'Free Bitcoin tools for serious stackers — charts, converters, on-chain data and more.'} />
    
    <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        {/* FAQ Page Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": tr ? 'tr' : 'en',
            "mainEntity": [
              {
                "@type": "Question",
                "name": tr ? "Hangi Bitcoin araçları geliştiriliyor?" : "What Bitcoin tools are being developed?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Portföy Takipçisi, Güvenlik Denetleyicisi, Piyasa Analizcisi, Ağ Gezgini, Fiyat Uyarıları ve Trend Tahmincisi dahil Bitcoin odaklı bir araç paketi geliştiriyoruz. Bu araçlar şu anda geliştirme aşamasında. Bu arada 15+ ücretsiz Bitcoin hesaplayıcımızı keşfedin." : "We're building a suite of Bitcoin-focused tools including a Portfolio Tracker, Security Checker, Market Analyzer, Network Explorer, Price Alerts, and Trend Predictor. These tools are currently in development. In the meantime, explore our 15+ free Bitcoin calculators."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Araçlarınız normal kripto uygulamalarından nasıl farklı?" : "How do your tools differ from regular cryptocurrency apps?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Araçlarımız özellikle Bitcoin yatırımcıları için tasarlanmıştır. Binlerce token yerine yalnızca Bitcoin analizine odaklanıyoruz — zincir üstü metrikler, yatırım stratejisi modelleme ve geçmiş performans takibi dahil." : "Our tools are designed specifically for Bitcoin investors. Rather than covering thousands of tokens, we focus exclusively on Bitcoin analysis — including on-chain metrics, investment strategy modeling, and historical performance tracking."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Bu araçlar cüzdanlar ve borsalarla entegre olacak mı?" : "Will these tools integrate with wallets and exchanges?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Cüzdan ve borsa entegrasyonu gelecekteki sürümler için planlanıyor. Özel anahtarlara erişim gerektirmeyen güvenli, salt okunur bağlantıları araştırıyoruz. Geliştirme takvimi ilerledikçe duyurulacak." : "Wallet and exchange integration is planned for future releases. We're exploring secure, read-only connections that would never require access to private keys. Development timelines will be announced as they progress."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Bu Bitcoin analiz araçları ücretsiz olacak mı?" : "Will these Bitcoin analysis tools be free to use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Mevcut hesaplayıcılarımız gibi temel özellikleri tamamen ücretsiz tutmayı planlıyoruz. Gelecekte profesyonel kullanıcılar için bazı gelişmiş özellikler premium seçenekler olarak sunulabilir." : "Like our existing calculators, we plan to keep core features completely free. Some advanced features for professional users may be offered as premium options in the future."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Araçlar ne kadar güvenli olacak ve hangi verileri toplayacaksınız?" : "How secure will the tools be and what data will you collect?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Güvenlik en öncelikli konumuz. Tüm araçlar şifreli bağlantılar kullanır ve katı gizlilik protokollerini takip eder. Mevcut hesaplayıcılarımız tüm verileri tarayıcınızda yerel olarak işler — finansal veri saklanmaz veya iletilmez." : "Security is our top priority. All tools use encrypted connections and follow strict privacy protocols. Our existing calculators process all data locally in your browser — no financial data is stored or transmitted."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Araçlar gerçek zamanlı blok zinciri verisi sağlayacak mı?" : "Will the tools provide real-time blockchain data?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Gerçek zamanlı blok zinciri verisi planlanan bir özelliktir. Mevcut araçlarımızın bazıları zaten canlı veri kullanıyor — İşlem Ücreti Hesaplayıcısı gerçek zamanlı mempool verisi çekiyor ve Lightning Ağı Hesaplayıcısı canlı ağ istatistikleri kullanıyor." : "Real-time blockchain data is a planned feature. Some of our existing tools already use live data — the Transaction Fee Calculator pulls real-time mempool data, and the Lightning Network Calculator uses live network statistics."
                }
              }
            ]
          })}
        </script>

        {/* CollectionPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": tr ? "Bitcoin Araçları" : "Bitcoin Tools",
            "description": tr ? "Bitcoin analizi, portföy yönetimi ve piyasa zekâsı için gelişmiş araçlar." : "Advanced utilities for Bitcoin analysis, portfolio management, and market intelligence.",
            "url": tr ? "https://bitcoincalculator.tools/tr/araclar" : "https://bitcoincalculator.tools/tools",
            "isPartOf": {
              "@type": "WebSite",
              "url": "https://bitcoincalculator.tools"
            }
          })}
        </script>
      </Helmet>
      <HelmetOgImage slug="tools" enAlt="Bitcoin Tools | bitcoincalculator.tools" />

      <BreadcrumbSchema language={language} items={[
        { name: tr ? "Ana Sayfa" : "Home", url: "https://bitcoincalculator.tools/" },
        { name: tr ? "Araçlar" : "Tools", url: tr ? "https://bitcoincalculator.tools/tr/araclar" : "https://bitcoincalculator.tools/tools" }
      ]} />
      
      <PageBackground variant="clean">
        <Header />
        <main id="main-content" className="pt-20 relative z-10">
          {/* Breadcrumb */}
          <div className="container mx-auto px-6 pt-8">
          <Breadcrumb items={[{ label: tr ? "Araçlar" : "Tools" }]} />
          </div>

        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-h1 font-bold mb-6 text-foreground">
              Bitcoin <span className="text-gradient-premium">{tr ? 'Araçları' : 'Tools'}</span>
            </h1>
              <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              {tr ? 'Bitcoin analizi, portföy yönetimi ve piyasa zekâsı için gelişmiş araçlar' : 'Advanced utilities for Bitcoin analysis, portfolio management, and market intelligence'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              const CardWrapper = tool.available && tool.linkTo 
                ? ({ children }: { children: React.ReactNode }) => <LocalizedLink to={tool.linkTo!} className="block">{children}</LocalizedLink>
                : ({ children }: { children: React.ReactNode }) => <div aria-disabled="true" role="group" aria-label={`${tr ? tool.title.tr : tool.title.en} — ${tr ? 'yakında' : 'coming soon'}`}>{children}</div>;
              
              return (
                <CardWrapper key={tool.id}>
                  <Card 
                    className={`group relative overflow-hidden glass-morphism-card transition-all duration-500 animate-fade-in-up border-0 bg-gradient-to-br from-background/60 via-background/40 to-background/20 backdrop-blur-xl ${tool.available ? 'cursor-pointer hover:scale-[1.02]' : 'opacity-75 pointer-events-none select-none'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    
                    <div className={`absolute top-4 right-4 px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm border ${
                      tool.available 
                        ? 'bg-success/10 text-success border-success/20' 
                        : 'bg-muted/40 text-muted-foreground border-border/40'
                    }`}>
                      {tool.available ? (tr ? 'Mevcut' : 'Available') : (tr ? 'Yakında' : 'Coming Soon')}
                    </div>
                    
                    <CardContent className="relative p-8">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-primary/10 border border-primary/20 group-hover:scale-105 transition-transform duration-300">
                          <IconComponent className="w-10 h-10 text-primary group-hover:text-primary-glow transition-colors duration-300" />
                        </div>
                        
                        <div className="w-full">
                          <CardTitle className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                            {tr ? tool.title.tr : tool.title.en}
                          </CardTitle>
                          <CardDescription className="text-foreground/70 leading-relaxed text-sm mb-8 line-clamp-3">
                            {tr ? tool.description.tr : tool.description.en}
                          </CardDescription>
                          
                          {tool.available ? (
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-sm font-medium px-8 py-3 rounded-xl w-full border border-success/30 bg-success/5 hover:bg-success/10 text-success backdrop-blur-sm transition-all duration-300 group-hover:border-success/50"
                            >
                              {tr ? 'Şimdi Dene' : 'Try It Now'}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          ) : (
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={handleRequestTool}
                              aria-label={tr ? `${tool.title.tr} için bildirim al` : `Get notified about ${tool.title.en}`}
                              className="text-sm font-medium px-8 py-3 rounded-xl w-full border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary backdrop-blur-sm transition-all duration-300 pointer-events-auto"
                            >
                              {tr ? 'Mevcut Olduğunda Bildir' : 'Notify Me When Available'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardWrapper>
              );
            })}
          </div>

          <div className="text-center mt-20">
            <Card className="glass-morphism-card max-w-3xl mx-auto border-0 bg-gradient-to-br from-background/80 via-background/60 to-background/40 backdrop-blur-xl">
              <CardContent className="p-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                  <h2 className="text-h2 font-bold mb-4 text-foreground text-gradient-premium">
                  {tr ? 'Özel Bir Araç Talep Edin' : 'Request a Custom Tool'}
                </h2>
                <p className="text-foreground/70 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                  {tr ? 'Belirli bir Bitcoin analiz aracına mı ihtiyacınız var? Ne aradığınızı bize bildirin, profesyonel paketimiz için geliştirmesini önceliklendirelim.' : "Need a specific Bitcoin analysis tool? Let us know what you're looking for and we'll prioritize its development for our professional suite."}
                </p>
                <Button onClick={handleRequestTool} className="btn-premium text-base px-8 py-4 h-auto">
                  {tr ? 'Araç Talebi Gönder' : 'Submit Tool Request'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <ToolsFAQSection />
          
          {/* Tool Benefits */}
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="glass-morphism-card border-0 bg-gradient-to-br from-background/60 to-background/40 backdrop-blur-xl text-center p-6">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-foreground">{tr ? 'Gerçek Zamanlı Analiz' : 'Real-Time Analysis'}</h2>
                <p className="text-foreground/70 text-sm">{tr ? 'Canlı veri işleme ve yapay zekâ destekli piyasa analizi ile anında içgörüler alın' : 'Get instant insights with live data processing and AI-powered market analysis'}</p>
              </Card>
              
              <Card className="glass-morphism-card border-0 bg-gradient-to-br from-background/60 to-background/40 backdrop-blur-xl text-center p-6">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-foreground">{tr ? 'Profesyonel Seviye' : 'Professional Grade'}</h2>
                <p className="text-foreground/70 text-sm">{tr ? 'Kurumsal düzeyde güvenlik ve özelliklerle ciddi yatırımcılar için geliştirildi' : 'Built for serious investors with institutional-level security and features'}</p>
              </Card>
              
              <Card className="glass-morphism-card border-0 bg-gradient-to-br from-background/60 to-background/40 backdrop-blur-xl text-center p-6">
                <Star className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-foreground">{tr ? 'Kapsamlı Paket' : 'Comprehensive Suite'}</h2>
                <p className="text-foreground/70 text-sm">{tr ? 'Hesaplayıcıları, takipçileri ve analiz araçlarını bir araya getiren hepsi bir arada platform' : 'All-in-one platform combining calculators, trackers, and analysis tools'}</p>
              </Card>
            </div>
          </div>
        </div>
        </main>
        <Footer />
      </PageBackground>
    </>
  );
};

export default Tools;
