import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calculator, PiggyBank, TrendingUp, TrendingDown, BarChart3, DollarSign, Target, Scale, Skull, Shield, LineChart, Wallet, Pickaxe, Wifi, Zap, CircleDollarSign, ArrowUpDown, ChartLine, Timer, Banknote, Gauge, Rainbow, Crown, BookOpen, Landmark, Activity, Coins, Clock, ArrowDown, Home, FileText, Ruler, Moon } from "lucide-react";
import { Link } from "@/components/LocalizedLink";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedPath, hasTurkishArticleMirror } from "@/utils/localizedRoutes";

const calculatorArticleMap: Record<string, { slug: string; title: string; teaser: string; slugTr?: string; titleTr?: string; teaserTr?: string }> = {
  'dca': { slug: 'what-is-bitcoin-dca', title: 'What Is Bitcoin DCA and How Does It Work?', teaser: 'Learn how dollar cost averaging reduces risk and builds wealth over time', titleTr: 'Bitcoin DCA Nedir ve Nasıl Çalışır?', teaserTr: 'Dolar maliyet ortalamasının riski nasıl azalttığını ve zamanla servet oluşturduğunu öğrenin' },
  'lump-sum-vs-dca': { slug: 'dca-vs-lump-sum-bitcoin', title: 'DCA vs Lump Sum: Which Strategy Wins?', teaser: 'Data-backed comparison of both strategies with historical Bitcoin performance', titleTr: 'DCA mı Toplu Yatırım mı: Hangi Strateji Kazanır?', teaserTr: 'Geçmiş Bitcoin performansıyla desteklenen her iki stratejinin veri odaklı karşılaştırması' },
  'halving-countdown': { slug: 'bitcoin-halving-explained', title: 'Bitcoin Halving Explained: What Happens and Why It Matters', teaser: 'Understand halving events, their impact on price, mining rewards, and supply', titleTr: 'Bitcoin Yarılanması Açıklandı: Ne Olur ve Neden Önemli', teaserTr: 'Yarılanma olaylarını, fiyata, madencilik ödüllerine ve arza etkisini anlayın' },
  'profit-loss': { slug: 'how-to-calculate-bitcoin-profit-loss', title: 'How to Calculate Bitcoin Profit and Loss', teaser: 'Step-by-step guide to calculating your Bitcoin P&L including fees and taxes', titleTr: 'Bitcoin Kâr ve Zarar Nasıl Hesaplanır', teaserTr: 'Ücretler ve vergiler dahil Bitcoin K/Z hesaplama adım adım kılavuzu' },
  'what-if': { slug: 'bitcoin-vs-gold-sp500', title: 'Bitcoin vs Gold vs S&P 500: 10-Year Comparison', teaser: 'Compare returns, risk, and volatility across three major asset classes', titleTr: 'Bitcoin vs Altın vs S&P 500: 10 Yıllık Karşılaştırma', teaserTr: 'Üç büyük varlık sınıfı arasında getiri, risk ve oynaklık karşılaştırması' },
  'fear-greed-index': { slug: 'what-is-fear-greed-index', title: 'What Is the Bitcoin Fear and Greed Index?', teaser: 'Discover how sentiment scores work and how to use them for smarter investing', titleTr: 'Bitcoin Korku ve Açgözlülük Endeksi Nedir?', teaserTr: 'Duygu puanlarının nasıl çalıştığını ve daha akıllı yatırım için nasıl kullanılacağını keşfedin' },
  'retirement': { slug: 'how-to-plan-retirement-with-bitcoin', title: 'How to Plan Retirement With Bitcoin', teaser: 'Allocation strategies, risk management, and withdrawal planning for Bitcoin retirement', titleTr: 'Bitcoin ile Emeklilik Nasıl Planlanır', teaserTr: 'Bitcoin emekliliği için tahsis stratejileri, risk yönetimi ve çekim planlaması' },
  'mining-profitability': { slug: 'bitcoin-mining-profitability-2026', title: 'Bitcoin Mining Profitability in 2026', teaser: 'Analyze electricity costs, hash rates, and hardware ROI for mining in 2026', titleTr: '2026\'da Bitcoin Madenciliği Kârlılığı', teaserTr: '2026\'da madencilik için elektrik maliyetlerini, hash oranlarını ve donanım YG\'sini analiz edin' },
  'bitcoin-converter': { slug: 'what-is-a-satoshi', title: 'What Is a Satoshi? Bitcoin Units Explained', teaser: 'Learn how Bitcoin units work and convert between BTC, mBTC, bits, and sats', titleTr: 'Satoshi Nedir? Bitcoin Birimleri Açıklandı', teaserTr: 'Bitcoin birimlerinin nasıl çalıştığını ve BTC, mBTC, bits ve sat\'lar arasında dönüştürmeyi öğrenin' },
  'capital-gains-tax': { slug: 'bitcoin-tax-guide-capital-gains', title: 'Bitcoin Tax Guide: Capital Gains Explained', teaser: 'Understand short-term vs long-term rates and how to calculate your crypto tax liability', titleTr: 'Bitcoin Vergi Rehberi: Sermaye Kazançları Açıklandı', teaserTr: 'Kısa vadeli ve uzun vadeli oranları ve kripto vergi yükümlülüğünüzü nasıl hesaplayacağınızı anlayın' },
  'investment': { slug: 'how-much-bitcoin-should-i-own', title: 'How Much Bitcoin Should I Own in 2026?', teaser: 'Portfolio allocation frameworks based on your income, risk tolerance, and goals', titleTr: '2026\'da Ne Kadar Bitcoin Sahibi Olmalıyım?', teaserTr: 'Gelirinize, risk toleransınıza ve hedeflerinize göre portföy tahsis çerçeveleri' },
  'hodl-strategy': { slug: 'bitcoin-hodl-strategy-explained', title: 'Bitcoin HODL Strategy Explained', teaser: 'Why long-term holders outperform traders — backed by historical data', titleTr: 'Bitcoin HODL Stratejisi Açıklandı', teaserTr: 'Uzun vadeli sahiplerin neden yatırımcıları geride bıraktığı — geçmiş verilerle desteklendi' },
  'transaction-fees': { slug: 'bitcoin-transaction-fees-explained', title: 'Bitcoin Transaction Fees Explained', teaser: 'How fees work, what determines cost, and practical tips to save on every transaction', titleTr: 'Bitcoin İşlem Ücretleri Açıklandı', teaserTr: 'Ücretlerin nasıl çalıştığı, maliyeti neyin belirlediği ve her işlemde tasarruf için pratik ipuçları' },
  'bitcoin-savings': { slug: 'bitcoin-savings-plan-guide', title: 'How to Create a Bitcoin Savings Plan', teaser: 'Set goals, automate purchases, and grow your Bitcoin savings systematically', titleTr: 'Bitcoin Tasarruf Planı Nasıl Oluşturulur', teaserTr: 'Hedefler belirleyin, satın almaları otomatikleştirin ve Bitcoin tasarruflarınızı sistematik olarak büyütün' },
  'leverage-liquidation': { slug: 'bitcoin-leverage-trading-risks', title: 'Bitcoin Leverage Trading Risks', teaser: 'Understand liquidation, margin calls, and why most leveraged traders lose money', titleTr: 'Bitcoin Kaldıraçlı İşlem Riskleri', teaserTr: 'Tasfiyeyi, teminat çağrılarını ve kaldıraçlı işlemcilerin neden para kaybettiğini anlayın' },
  'bitcoin-lot-size': { slug: 'how-to-calculate-bitcoin-lot-size', title: 'How to Calculate Bitcoin Lot Size', teaser: 'Learn the lot size formula, standard vs micro lots, and broker-specific contract sizes', titleTr: 'Bitcoin Lot Büyüklüğü Nasıl Hesaplanır', teaserTr: 'Lot büyüklüğü formülünü, standart ve mikro lotları ve aracıya özgü sözleşme boyutlarını öğrenin' },
  'stack-sats': { slug: 'what-is-a-satoshi', title: 'What Is a Satoshi? Bitcoin Units Explained', teaser: 'Learn what satoshis are and why "stacking sats" is the foundation of Bitcoin saving', titleTr: 'Satoshi Nedir? Bitcoin Birimleri Açıklandı', teaserTr: 'Satoshi\'nin ne olduğunu ve "sat biriktirmenin" neden Bitcoin tasarrufunun temeli olduğunu öğrenin' },
  'wealth-percentile': { slug: 'how-much-bitcoin-should-i-own', title: 'How Much Bitcoin Should I Own?', teaser: 'See how your holdings compare globally and find the right allocation for you', titleTr: 'Ne Kadar Bitcoin Sahibi Olmalıyım?', teaserTr: 'Varlıklarınızın küresel ölçekte nasıl karşılaştırıldığını görün ve sizin için doğru tahsisi bulun' },
  'bitcoin-accumulation-score': { slug: 'how-much-bitcoin-by-age', title: 'How Much Bitcoin Should You Have by Age?', teaser: 'Age-adjusted BTC targets, lifecycle phases, and the grading system explained in full', titleTr: 'Yaşa Göre Ne Kadar Bitcoin Sahibi Olmalısınız?', teaserTr: 'Yaşa göre ayarlanmış BTC hedefleri, yaşam döngüsü aşamaları ve derecelendirme sistemi tam açıklandı' },
  'power-law': { slug: 'bitcoin-power-law-explained', title: 'Bitcoin Power Law Explained', teaser: 'Understand the Power Law model, how it projects long-term Bitcoin prices, and its limitations', titleTr: 'Bitcoin Güç Yasası Açıklandı', teaserTr: 'Güç Yasası modelini, uzun vadeli Bitcoin fiyatlarını nasıl öngördüğünü ve sınırlamalarını anlayın' },
  'cagr': { slug: 'bitcoin-vs-gold-sp500', title: 'Bitcoin vs Gold vs S&P 500', teaser: 'Compare returns, risk, and volatility across three major asset classes over 10 years', titleTr: 'Bitcoin vs Altın vs S&P 500', teaserTr: '10 yıl boyunca üç büyük varlık sınıfı arasında getiri, risk ve oynaklık karşılaştırması' },
  'staking': { slug: 'bitcoin-staking-guide', title: 'Bitcoin Staking Guide 2026', teaser: 'Everything you need to know about Babylon, Lido wBTC, and Binance Earn staking', titleTr: 'Bitcoin Staking Rehberi 2026', teaserTr: 'Babylon, Lido wBTC ve Binance Earn staking hakkında bilmeniz gereken her şey' },
  'on-chain': { slug: 'bitcoin-on-chain-metrics-guide', title: 'Bitcoin On-Chain Metrics Guide 2026', teaser: 'How to read MVRV ratio, Stock-to-Flow, hash rate, and active addresses to gauge Bitcoin cycles', titleTr: 'Bitcoin Zincir Üstü Metrikler Rehberi 2026', teaserTr: 'Bitcoin döngülerini ölçmek için MVRV oranını, Stok/Akış\'ı, hash oranını ve aktif adresleri nasıl okuyacağınız' },
  'sip': { slug: 'bitcoin-sip-guide', title: 'Bitcoin SIP Guide: Systematic Investment Plans for Crypto', teaser: 'Learn how Bitcoin SIPs work, compare SIP vs DCA vs lump sum, and calculate projected returns', titleTr: 'Bitcoin SYP Rehberi: Kripto için Sistematik Yatırım Planları', teaserTr: 'Bitcoin SYP\'lerin nasıl çalıştığını öğrenin, SYP ve DCA ve toplu yatırımı karşılaştırın' },
  'pizza-day': { slug: 'bitcoin-pizza-day-history', title: 'The Bitcoin Pizza Day Story: From $41 to Billions', teaser: 'The complete history of the 10,000 BTC pizza transaction and what it teaches us about opportunity cost', titleTr: 'Bitcoin Pizza Günü Hikayesi: 41 Dolardan Milyarlara', teaserTr: '10.000 BTC\'lik pizza işleminin tam tarihi ve fırsat maliyeti hakkında bize ne öğrettiği' },
  'average-buy-price': { slug: 'how-to-calculate-average-buy-price-bitcoin', title: 'How to Calculate Your Bitcoin Average Buy Price', teaser: 'Learn FIFO, LIFO, HIFO, and weighted average cost basis methods for Bitcoin', titleTr: 'Bitcoin Ortalama Alış Fiyatınızı Nasıl Hesaplarsınız', teaserTr: 'Bitcoin için FIFO, LIFO, HIFO ve ağırlıklı ortalama maliyet esası yöntemlerini öğrenin' },
  'price-target': { slug: 'bitcoin-millionaire-calculator-guide', title: 'Bitcoin Millionaire Calculator: How Much BTC Do You Need?', teaser: 'Find out how much BTC you need to reach $1M with our interactive millionaire calculator', titleTr: 'Bitcoin Milyoner Hesaplayıcısı: Ne Kadar BTC Gerekiyor?', teaserTr: '1 milyon dolara ulaşmak için ne kadar BTC gerektiğini milyoner hesaplayıcımızla öğrenin' },
  'bitcoin-loan': { slug: 'bitcoin-leverage-trading-risks', title: 'Bitcoin Leverage Trading Risks', teaser: 'Understand liquidation, collateral, and why borrowing against BTC requires careful risk management', titleTr: 'Bitcoin Kaldıraçlı İşlem Riskleri', teaserTr: 'Tasfiyeyi, teminatı ve BTC\'ye karşı borçlanmanın neden dikkatli risk yönetimi gerektirdiğini anlayın' },
  'time-machine': { slug: 'bitcoin-pizza-day-history', title: 'The Bitcoin Pizza Day Story: From $41 to Billions', teaser: "Explore Bitcoin's historical price journey and what early investments would be worth today", titleTr: 'Bitcoin Pizza Günü Hikayesi', teaserTr: "Bitcoin'in tarihsel fiyat yolculuğunu ve erken yatırımların bugün ne kadar değerli olacağını keşfedin" },
  'drawdown': { slug: 'bitcoin-drawdown-history', title: 'Bitcoin Drawdown History: Major Crashes and Recoveries', teaser: 'Analyze every major Bitcoin correction and how the market recovered each time', titleTr: 'Bitcoin Düşüş Tarihi: Büyük Çöküşler ve Toparlanmalar', teaserTr: 'Her büyük Bitcoin düzeltmesini ve piyasanın her seferinde nasıl toparlandığını analiz edin' },
  'dominance': { slug: 'bitcoin-dominance-explained', title: 'Bitcoin Dominance Explained: What It Means for Your Portfolio', teaser: 'Learn how Bitcoin market share affects altcoin cycles and portfolio strategy', titleTr: 'Bitcoin Dominansı Açıklandı', teaserTr: 'Bitcoin pazar payının altcoin döngülerini ve portföy stratejisini nasıl etkilediğini öğrenin' },
  'rainbow-chart': { slug: 'how-to-read-bitcoin-rainbow-chart', title: 'How to Read the Bitcoin Rainbow Chart', teaser: 'Understand the logarithmic regression bands and what they signal about valuation', titleTr: 'Bitcoin Gökkuşağı Grafiği Nasıl Okunur', teaserTr: 'Logaritmik regresyon bantlarını ve değerleme hakkında ne sinyallediğini anlayın' },
  'volatility': { slug: 'bitcoin-volatility-explained', title: 'Bitcoin Volatility Explained: What It Is and Why It Matters', teaser: 'Understand realized vs implied vol, DVOL/BVX indices, and how to use volatility for trading', titleTr: 'Bitcoin Oynaklığı Açıklandı', teaserTr: 'Gerçekleşen ve zımni oynaklık, DVOL/BVX endeksleri ve işlem için oynaklığı nasıl kullanacağınızı anlayın' },
  'supply': { slug: 'bitcoin-halving-explained', title: 'Bitcoin Halving Explained: Supply Scarcity Impact', teaser: "Understand how halvings reduce supply and drive Bitcoin's deflationary model", titleTr: 'Bitcoin Yarılanması Açıklandı: Arz Kıtlığı Etkisi', teaserTr: "Yarılanmaların arzı nasıl azalttığını ve Bitcoin'in deflasyonist modelini nasıl yönlendirdiğini anlayın" },
  'btc-vs-real-estate': { slug: 'bitcoin-vs-real-estate-sp500-gold-comparison', title: 'Bitcoin vs Real Estate vs S&P 500 vs Gold', teaser: 'Compare long-term returns across asset classes including property, stocks, and Bitcoin', titleTr: 'Bitcoin vs Gayrimenkul vs S&P 500 vs Altın', teaserTr: 'Mülk, hisse senetleri ve Bitcoin dahil varlık sınıfları arasında uzun vadeli getiri karşılaştırması' },
  'lightning': { slug: 'bitcoin-transaction-fees-explained', title: 'Bitcoin Transaction Fees Explained', teaser: 'Understand Layer 1 fees and how Lightning Network provides near-zero cost transfers', titleTr: 'Bitcoin İşlem Ücretleri Açıklandı', teaserTr: 'Katman 1 ücretlerini ve Lightning Ağı\'nın neredeyse sıfır maliyetli transferleri nasıl sağladığını anlayın' },
  'correlation': { slug: 'bitcoin-vs-gold-sp500', title: 'Bitcoin vs Gold vs S&P 500: Correlation Analysis', teaser: 'See how Bitcoin correlates with traditional assets over different timeframes', titleTr: 'Bitcoin vs Altın vs S&P 500: Korelasyon Analizi', teaserTr: "Bitcoin'in farklı zaman dilimlerinde geleneksel varlıklarla nasıl korelasyon gösterdiğini görün" },
  'etf': { slug: 'bitcoin-etf-guide-ibit-fbtc-arkb', title: 'Bitcoin ETF Guide: IBIT vs FBTC vs ARKB', teaser: 'Compare expense ratios, custody, and which Bitcoin ETF is best for your portfolio', titleTr: 'Bitcoin ETF Rehberi: IBIT vs FBTC vs ARKB', teaserTr: 'Gider oranlarını, saklama hizmetini ve hangi Bitcoin ETF\'sinin portföyünüz için en iyi olduğunu karşılaştırın' },
  'inflation-dashboard': { slug: 'bitcoin-halving-explained', title: 'Bitcoin vs Fiat Inflation', teaser: "Compare Bitcoin's fixed supply model against central bank monetary expansion", titleTr: 'Bitcoin vs Fiat Enflasyon', teaserTr: "Bitcoin'in sabit arz modelini merkez bankası para genişlemesine karşı karşılaştırın" },
  'purchasing-power': { slug: 'bitcoin-halving-explained', title: 'Bitcoin Purchasing Power Over Time', teaser: "Track how Bitcoin's value preserves purchasing power against inflationary currencies", titleTr: 'Zaman İçinde Bitcoin Satın Alma Gücü', teaserTr: "Bitcoin'in değerinin enflasyonist para birimlerine karşı satın alma gücünü nasıl koruduğunu izleyin" },
  'bitcoin-zakat': { slug: 'zakat-on-bitcoin-guide', title: 'Zakat on Bitcoin — Complete Guide 2026', teaser: 'Learn if Bitcoin is zakatable, Nisab thresholds, Hawl rules, and how to calculate your obligation', titleTr: 'Bitcoin\'de Zekat — Tam Rehber 2026', teaserTr: 'Bitcoin\'in zekata tabi olup olmadığını, Nisab eşiklerini, Havl kurallarını ve yükümlülüğünüzü nasıl hesaplayacağınızı öğrenin' },
  'bitcoin-arbitrage': { slug: 'bitcoin-calculation-formulas', title: 'Bitcoin Calculation Formulas', teaser: 'Learn the exact formulas behind arbitrage, profit, and conversion calculations', titleTr: 'Bitcoin Hesaplama Formülleri', teaserTr: 'Arbitraj, kâr ve dönüşüm hesaplamalarının arkasındaki kesin formülleri öğrenin' },
  'pi-to-bitcoin': { slug: 'what-is-a-satoshi', title: 'What Is a Satoshi? Bitcoin Units Explained', teaser: 'Understand Bitcoin units and how to convert between BTC, sats, and other currencies', titleTr: 'Satoshi Nedir? Bitcoin Birimleri Açıklandı', teaserTr: 'Bitcoin birimlerini ve BTC, sat ve diğer para birimleri arasında nasıl dönüştürüleceğini anlayın' },
  'portfolio-tracker': { slug: 'how-much-bitcoin-should-i-own', title: 'How Much Bitcoin Should I Own?', teaser: 'Portfolio allocation frameworks for Bitcoin at different risk tolerances and wealth levels', titleTr: 'Ne Kadar Bitcoin Sahibi Olmalıyım?', teaserTr: 'Farklı risk toleransları ve servet düzeylerinde Bitcoin için portföy tahsis çerçeveleri' },
};

const trPathFor = (enPath: string) => getLocalizedPath(enPath, 'tr');

const allCalculators = [
  { id: "what-if", path: "/calculators/what-if", title: "What If Calculator", titleTr: "Ya Olsaydı Hesaplayıcısı", description: "See historical investment returns and analyze past Bitcoin performance", descriptionTr: "Geçmiş yatırım getirilerini görün ve Bitcoin'in geçmiş performansını analiz edin", icon: TrendingUp, color: "border-primary/20 hover:border-primary/40", iconBg: "bg-primary/10", iconColor: "text-primary", related: ["investment", "dca", "profit-loss", "pizza-day", "average-buy-price", "time-machine", "bitcoin-arbitrage", "portfolio-tracker"] },
  { id: "dca", path: "/calculators/dca", title: "DCA Calculator", titleTr: "DCA Hesaplayıcısı", description: "Model your dollar cost averaging strategy with detailed analysis", descriptionTr: "Dolar maliyet ortalama stratejinizi ayrıntılı analizle modelleyin", icon: BarChart3, color: "border-blue-500/20 hover:border-blue-500/40", iconBg: "bg-blue-500/10", iconColor: "text-blue-500", related: ["investment", "lump-sum-vs-dca", "bitcoin-savings", "fear-greed-index", "sip", "average-buy-price", "staking"] },
  { id: "retirement", path: "/calculators/retirement", title: "Retirement Planning", titleTr: "Emeklilik Planlaması", description: "Calculate your Bitcoin retirement strategy with detailed projections", descriptionTr: "Ayrıntılı projeksiyonlarla Bitcoin emeklilik stratejinizi hesaplayın", icon: PiggyBank, color: "border-success/20 hover:border-success/40", iconBg: "bg-success/10", iconColor: "text-success", related: ["investment", "bitcoin-savings", "hodl-strategy", "volatility", "price-target", "inheritance-tax", "bitcoin-accumulation-score"] },
  { id: "lump-sum-vs-dca", path: "/calculators/lump-sum-vs-dca", title: "Lump Sum vs DCA", titleTr: "Toplu Yatırım vs DCA", description: "Compare lump sum investing versus dollar cost averaging strategies", descriptionTr: "Toplu yatırımı dolar maliyet ortalama stratejileriyle karşılaştırın", icon: Scale, color: "border-violet-500/20 hover:border-violet-500/40", iconBg: "bg-violet-500/10", iconColor: "text-violet-500", related: ["dca", "investment", "hodl-strategy"] },
  { id: "capital-gains-tax", path: "/calculators/capital-gains-tax", title: "Capital Gains Tax", titleTr: "Sermaye Kazancı Vergisi", description: "Estimate potential capital gains tax owed on Bitcoin sales", descriptionTr: "Bitcoin satışlarında ödenecek tahmini sermaye kazancı vergisini hesaplayın", icon: DollarSign, color: "border-amber-500/20 hover:border-amber-500/40", iconBg: "bg-amber-500/10", iconColor: "text-amber-500", related: ["profit-loss", "average-buy-price", "etf", "what-if", "retirement", "inheritance-tax", "bitcoin-zakat"] },
  { id: "stack-sats", path: "/calculators/stack-sats", title: "Stack Sats Goal", titleTr: "Sat Biriktirme Hedefi", description: "Calculate how long to reach your Bitcoin accumulation goals", descriptionTr: "Bitcoin birikim hedeflerinize ulaşmak için ne kadar süreceğini hesaplayın", icon: Target, color: "border-orange-500/20 hover:border-orange-500/40", iconBg: "bg-orange-500/10", iconColor: "text-orange-500", related: ["investment", "bitcoin-savings", "bitcoin-converter", "sip", "price-target"] },
  { id: "hodl-strategy", path: "/calculators/hodl-strategy", title: "HODL Strategy", titleTr: "HODL Stratejisi", description: "Compare different Bitcoin holding strategies and their performance", descriptionTr: "Farklı Bitcoin tutma stratejilerini ve performanslarını karşılaştırın", icon: Shield, color: "border-cyan-500/20 hover:border-cyan-500/40", iconBg: "bg-cyan-500/10", iconColor: "text-cyan-500", related: ["investment", "halving-countdown", "profit-loss", "fear-greed-index", "rainbow-chart", "drawdown"] },
  { id: "purchasing-power", path: "/calculators/purchasing-power", title: "Purchasing Power", titleTr: "Satın Alma Gücü", description: "Compare Bitcoin's historical purchasing power across time periods", descriptionTr: "Bitcoin'in zaman dilimlerindeki geçmiş satın alma gücünü karşılaştırın", icon: Wallet, color: "border-rose-500/20 hover:border-rose-500/40", iconBg: "bg-rose-500/10", iconColor: "text-rose-500", related: ["inflation-dashboard", "what-if", "hodl-strategy", "supply"] },
  { id: "inflation-dashboard", path: "/calculators/inflation-dashboard", title: "Inflation Dashboard", titleTr: "Enflasyon Paneli", description: "Compare Bitcoin's fixed supply against expanding fiat currencies", descriptionTr: "Bitcoin'in sabit arzını genişleyen fiat para birimlerine karşı karşılaştırın", icon: LineChart, color: "border-indigo-500/20 hover:border-indigo-500/40", iconBg: "bg-indigo-500/10", iconColor: "text-indigo-500", related: ["purchasing-power", "halving-countdown", "hodl-strategy", "supply"] },
  { id: "obituaries-tracker", path: "/calculators/obituaries-tracker", title: "Obituaries Tracker", titleTr: "Ölüm İlanları Takipçisi", description: "Track every time Bitcoin was declared 'dead' and its performance since", descriptionTr: "Bitcoin'in her 'ölü' ilan edilişini ve o tarihten bu yana performansını takip edin", icon: Skull, color: "border-muted-foreground/20 hover:border-muted-foreground/40", iconBg: "bg-muted/30", iconColor: "text-muted-foreground", related: ["what-if", "hodl-strategy", "purchasing-power", "drawdown"] },
  { id: "mining-profitability", path: "/calculators/mining-profitability", title: "Mining Profitability", titleTr: "Madencilik Kârlılığı", description: "Calculate Bitcoin mining profits based on hardware and electricity costs", descriptionTr: "Donanım ve elektrik maliyetlerine göre Bitcoin madenciliği kârlarını hesaplayın", icon: Pickaxe, color: "border-primary/20 hover:border-primary/40", iconBg: "bg-primary/10", iconColor: "text-primary", related: ["halving-countdown", "what-if", "transaction-fees", "staking"] },
  { id: "transaction-fees", path: "/calculators/transaction-fees", title: "Transaction Fee Calculator", titleTr: "İşlem Ücreti Hesaplayıcısı", description: "Estimate optimal Bitcoin transaction fees with real-time mempool data", descriptionTr: "Gerçek zamanlı mempool verileriyle en uygun Bitcoin işlem ücretlerini tahmin edin", icon: Wifi, color: "border-cyan-500/20 hover:border-cyan-500/40", iconBg: "bg-cyan-500/10", iconColor: "text-cyan-500", related: ["lightning", "mining-profitability", "stack-sats"] },
  { id: "lightning", path: "/calculators/lightning", title: "Lightning Network Fees", titleTr: "Lightning Ağı Ücretleri", description: "Calculate Lightning Network routing fees for instant Bitcoin payments", descriptionTr: "Anlık Bitcoin ödemeleri için Lightning Ağı yönlendirme ücretlerini hesaplayın", icon: Zap, color: "border-yellow-500/20 hover:border-yellow-500/40", iconBg: "bg-yellow-500/10", iconColor: "text-yellow-500", related: ["transaction-fees", "stack-sats", "dca", "purchasing-power"] },
  { id: "leverage-liquidation", path: "/calculators/leverage-liquidation", title: "Leverage & Liquidation", titleTr: "Kaldıraç ve Tasfiye", description: "Calculate liquidation prices for leveraged Bitcoin positions", descriptionTr: "Kaldıraçlı Bitcoin pozisyonları için tasfiye fiyatlarını hesaplayın", icon: TrendingDown, color: "border-destructive/20 hover:border-destructive/40", iconBg: "bg-destructive/10", iconColor: "text-destructive", related: ["transaction-fees", "profit-loss", "dca", "fear-greed-index", "bitcoin-loan", "bitcoin-lot-size"] },
  { id: "profit-loss", path: "/calculators/profit-loss", title: "Profit & Loss", titleTr: "Kâr & Zarar", description: "Calculate your real Bitcoin profit or loss after exchange fees with cost basis tracking", descriptionTr: "Borsa ücretleri sonrası gerçek Bitcoin kâr veya zararınızı maliyet esası takibiyle hesaplayın", icon: CircleDollarSign, color: "border-success/20 hover:border-success/40", iconBg: "bg-success/10", iconColor: "text-success", related: ["portfolio-tracker", "average-buy-price", "investment", "capital-gains-tax", "bitcoin-converter", "bitcoin-lot-size", "bitcoin-arbitrage"] },
  { id: "bitcoin-converter", path: "/calculators/bitcoin-converter", title: "Bitcoin Converter", titleTr: "Bitcoin Dönüştürücü", description: "Convert between BTC, satoshis, mBTC, and 100+ fiat currencies with live prices", descriptionTr: "BTC, satoshi, mBTC ve 100'den fazla fiat para birimi arasında canlı fiyatlarla dönüştürün", icon: ArrowUpDown, color: "border-primary/20 hover:border-primary/40", iconBg: "bg-primary/10", iconColor: "text-primary", related: ["profit-loss", "stack-sats", "investment", "wealth-percentile", "bitcoin-zakat", "pi-to-bitcoin"] },
  { id: "investment", path: "/calculators/investment", title: "Investment Calculator", titleTr: "Yatırım Hesaplayıcısı", description: "See how much your Bitcoin investment could be worth in 1-20 years with multiple growth scenarios", descriptionTr: "Bitcoin yatırımınızın birden fazla büyüme senaryosunda 1-20 yılda ne kadar değer kazanabileceğini görün", icon: ChartLine, color: "border-success/20 hover:border-success/40", iconBg: "bg-success/10", iconColor: "text-success", related: ["etf", "dca", "retirement", "bitcoin-savings", "sip", "bitcoin-zakat", "portfolio-tracker"] },
  { id: "halving-countdown", path: "/calculators/halving-countdown", title: "Halving Countdown", titleTr: "Yarılanma Geri Sayımı", description: "Live countdown to the next Bitcoin halving with historical impact analysis and price projections", descriptionTr: "Geçmiş etki analizi ve fiyat projeksiyonlarıyla sonraki Bitcoin yarılanmasına canlı geri sayım", icon: Timer, color: "border-primary/20 hover:border-primary/40", iconBg: "bg-primary/10", iconColor: "text-primary", related: ["mining-profitability", "inflation-dashboard", "investment"] },
  { id: "bitcoin-savings", path: "/calculators/bitcoin-savings", title: "Bitcoin Savings", titleTr: "Bitcoin Tasarrufu", description: "See how much Bitcoin you can buy from your paycheck with income-based savings planning", descriptionTr: "Gelir bazlı tasarruf planlamasıyla maaşınızdan ne kadar Bitcoin alabileceğinizi görün", icon: Banknote, color: "border-success/20 hover:border-success/40", iconBg: "bg-success/10", iconColor: "text-success", related: ["dca", "investment", "stack-sats", "sip"] },
  { id: "fear-greed-index", path: "/calculators/fear-greed-index", title: "Fear & Greed Index", titleTr: "Korku & Açgözlülük Endeksi", description: "Live Bitcoin market sentiment indicator with historical analysis and actionable signals", descriptionTr: "Geçmiş analiz ve uygulanabilir sinyallerle canlı Bitcoin piyasa duygu göstergesi", icon: Gauge, color: "border-amber-500/20 hover:border-amber-500/40", iconBg: "bg-amber-500/10", iconColor: "text-amber-500", related: ["dca", "investment", "obituaries-tracker", "hodl-strategy", "rainbow-chart", "on-chain"] },
  { id: "rainbow-chart", path: "/calculators/rainbow-chart", title: "Rainbow Price Chart", titleTr: "Gökkuşağı Fiyat Grafiği", description: "Live Bitcoin Rainbow Chart with logarithmic regression bands showing if Bitcoin is cheap or expensive", descriptionTr: "Bitcoin'in ucuz mu pahalı mı olduğunu gösteren logaritmik regresyon bantlı canlı Bitcoin Gökkuşağı Grafiği", icon: Rainbow, color: "border-violet-500/20 hover:border-violet-500/40", iconBg: "bg-violet-500/10", iconColor: "text-violet-500", related: ["dca", "investment", "fear-greed-index", "hodl-strategy", "on-chain"] },
  { id: "wealth-percentile", path: "/calculators/wealth-percentile", title: "Wealth Percentile", titleTr: "Servet Yüzdelik Dilimi", description: "Find out what percentage of Bitcoin holders you outrank based on on-chain address distribution", descriptionTr: "Zincir üstü adres dağılımına göre Bitcoin sahiplerinin yüzde kaçını geride bıraktığınızı öğrenin", icon: Crown, color: "border-amber-500/20 hover:border-amber-500/40", iconBg: "bg-amber-500/10", iconColor: "text-amber-500", related: ["portfolio-tracker", "etf", "bitcoin-converter", "dca", "stack-sats", "investment", "price-target", "bitcoin-accumulation-score"] },
  { id: "etf", path: "/calculators/etf", title: "ETF Calculator", titleTr: "ETF Hesaplayıcısı", description: "Compare IBIT, FBTC, ARKB and all spot Bitcoin ETFs — calculate expense ratio costs vs direct BTC", descriptionTr: "IBIT, FBTC, ARKB ve tüm spot Bitcoin ETF'lerini karşılaştırın — gider oranı maliyetlerini doğrudan BTC'ye karşı hesaplayın", icon: Landmark, color: "border-blue-500/20 hover:border-blue-500/40", iconBg: "bg-blue-500/10", iconColor: "text-blue-500", related: ["investment", "capital-gains-tax", "profit-loss", "dca", "btc-vs-real-estate"] },
  { id: "power-law", path: "/calculators/power-law", title: "Power Law Calculator", titleTr: "Güç Yasası Hesaplayıcısı", description: "Project future Bitcoin prices using the Power Law regression model with confidence corridors", descriptionTr: "Güven koridorlarıyla Güç Yasası regresyon modelini kullanarak gelecekteki Bitcoin fiyatlarını tahmin edin", icon: TrendingUp, color: "border-primary/20 hover:border-primary/40", iconBg: "bg-primary/10", iconColor: "text-primary", related: ["rainbow-chart", "investment", "hodl-strategy", "halving-countdown", "on-chain", "volatility", "price-target"] },
  { id: "cagr", path: "/calculators/cagr", title: "CAGR Calculator", titleTr: "YBBO Hesaplayıcısı", description: "Compare Bitcoin's compound annual growth rate against Gold, S&P 500, and Real Estate", descriptionTr: "Bitcoin'in bileşik yıllık büyüme oranını Altın, S&P 500 ve Gayrimenkul'e karşı karşılaştırın", icon: BarChart3, color: "border-success/20 hover:border-success/40", iconBg: "bg-success/10", iconColor: "text-success", related: ["investment", "what-if", "power-law", "hodl-strategy", "correlation", "btc-vs-real-estate"] },
  { id: "staking", path: "/calculators/staking", title: "Bitcoin Staking Calculator", titleTr: "Bitcoin Staking Hesaplayıcısı", description: "Calculate BTC staking rewards for Babylon, Lido wBTC, and Binance Earn with compounding", descriptionTr: "Babylon, Lido wBTC ve Binance Earn için bileşik faizle BTC staking ödüllerini hesaplayın", icon: TrendingUp, color: "border-primary/20 hover:border-primary/40", iconBg: "bg-primary/10", iconColor: "text-primary", related: ["investment", "dca", "hodl-strategy", "cagr", "bitcoin-savings"] },
  { id: "on-chain", path: "/calculators/on-chain", title: "On-Chain Metrics Dashboard", titleTr: "Zincir Üstü Metrikler Paneli", description: "Live MVRV ratio, Stock-to-Flow model, hash rate, and active addresses for Bitcoin cycle analysis", descriptionTr: "Bitcoin döngü analizi için canlı MVRV oranı, Stok/Akış modeli, hash oranı ve aktif adresler", icon: Activity, color: "border-violet-500/20 hover:border-violet-500/40", iconBg: "bg-violet-500/10", iconColor: "text-violet-500", related: ["dominance", "fear-greed-index", "rainbow-chart", "power-law", "volatility", "hodl-strategy"] },
  { id: "volatility", path: "/calculators/volatility", title: "Volatility Calculator", titleTr: "Oynaklık Hesaplayıcısı", description: "Live 30/60/90-day rolling annualized Bitcoin volatility with regime indicator and asset comparison", descriptionTr: "Rejim göstergesi ve varlık karşılaştırmasıyla canlı 30/60/90 günlük kayan yıllık Bitcoin oynaklığı", icon: Activity, color: "border-destructive/20 hover:border-destructive/40", iconBg: "bg-destructive/10", iconColor: "text-destructive", related: ["drawdown", "correlation", "bitcoin-lot-size", "fear-greed-index", "on-chain", "leverage-liquidation"] },
  { id: "supply", path: "/calculators/supply", title: "Supply & Scarcity", titleTr: "Arz ve Kıtlık", description: "Live circulating supply, lost BTC estimates, supply schedule, and your stack as % of total", descriptionTr: "Canlı dolaşımdaki arz, kayıp BTC tahminleri, arz takvimi ve toplam içindeki yığınınızın yüzdesi", icon: Coins, color: "border-amber-500/20 hover:border-amber-500/40", iconBg: "bg-amber-500/10", iconColor: "text-amber-500", related: ["dominance", "halving-countdown", "on-chain", "wealth-percentile", "inflation-dashboard"] },
  { id: "dominance", path: "/calculators/dominance", title: "Dominance Calculator", titleTr: "Dominans Hesaplayıcısı", description: "Live BTC dominance tracker with price scenario modeler and historical trends", descriptionTr: "Fiyat senaryo modelleyici ve geçmiş trendlerle canlı BTC dominans takipçisi", icon: Crown, color: "border-primary/20 hover:border-primary/40", iconBg: "bg-primary/10", iconColor: "text-primary", related: ["fear-greed-index", "on-chain", "investment", "rainbow-chart", "correlation"] },
  { id: "time-machine", path: "/calculators/time-machine", title: "Time Machine", titleTr: "Zaman Makinesi", description: "See what your Bitcoin investment would be worth today from any historical date", descriptionTr: "Herhangi bir geçmiş tarihten Bitcoin yatırımınızın bugün ne kadar değer taşıyacağını görün", icon: Clock, color: "border-violet-500/20 hover:border-violet-500/40", iconBg: "bg-violet-500/10", iconColor: "text-violet-500", related: ["what-if", "dca", "hodl-strategy", "pizza-day", "drawdown"] },
  { id: "drawdown", path: "/calculators/drawdown", title: "Drawdown Calculator", titleTr: "Düşüş Analizi Hesaplayıcısı", description: "Analyze Bitcoin's worst crashes, recovery times, and current drawdown from ATH", descriptionTr: "Bitcoin'in en kötü çöküşlerini, toparlanma sürelerini ve ATH'dan mevcut düşüşü analiz edin", icon: ArrowDown, color: "border-destructive/20 hover:border-destructive/40", iconBg: "bg-destructive/10", iconColor: "text-destructive", related: ["obituaries-tracker", "fear-greed-index", "hodl-strategy", "volatility", "time-machine"] },
  { id: "sip", path: "/calculators/sip", title: "SIP Calculator", titleTr: "SYP Hesaplayıcısı", description: "Plan your Bitcoin Systematic Investment Plan with forward-looking projections and SIP vs Lump Sum comparison", descriptionTr: "İleriye dönük projeksiyonlar ve SYP ile Toplu Yatırım karşılaştırmasıyla Bitcoin Sistematik Yatırım Planınızı planlayın", icon: TrendingUp, color: "border-success/20 hover:border-success/40", iconBg: "bg-success/10", iconColor: "text-success", related: ["dca", "lump-sum-vs-dca", "investment", "bitcoin-savings", "stack-sats"] },
  { id: "pizza-day", path: "/calculators/pizza-day", title: "Pizza Day Calculator", titleTr: "Pizza Günü Hesaplayıcısı", description: "Track the 10,000 BTC pizza opportunity cost with live value and historical milestones", descriptionTr: "10.000 BTC'lik pizza fırsat maliyetini canlı değer ve geçmiş kilometre taşlarıyla takip edin", icon: TrendingUp, color: "border-amber-500/20 hover:border-amber-500/40", iconBg: "bg-amber-500/10", iconColor: "text-amber-500", related: ["what-if", "time-machine", "hodl-strategy", "dca", "investment"] },
  { id: "average-buy-price", path: "/calculators/average-buy-price", title: "Average Buy Price", titleTr: "Ortalama Alış Fiyatı", description: "Calculate your average Bitcoin purchase price and breakeven point across multiple buys", descriptionTr: "Birden fazla alım arasında ortalama Bitcoin alış fiyatınızı ve başa baş noktanızı hesaplayın", icon: TrendingUp, color: "border-primary/20 hover:border-primary/40", iconBg: "bg-primary/10", iconColor: "text-primary", related: ["profit-loss", "capital-gains-tax", "investment", "dca", "stack-sats"] },
  { id: "price-target", path: "/calculators/price-target", title: "Price Target Calculator", titleTr: "Fiyat Hedefi Hesaplayıcısı", description: "Calculate BTC price needed to reach your wealth goals and moon scenarios", descriptionTr: "Servet hedeflerinize ve moon senaryolarına ulaşmak için gereken BTC fiyatını hesaplayın", icon: Moon, color: "border-primary/20 hover:border-primary/40", iconBg: "bg-primary/10", iconColor: "text-primary", related: ["power-law", "retirement", "stack-sats", "wealth-percentile", "average-buy-price"] },
  { id: "inheritance-tax", path: "/calculators/inheritance-tax", title: "Inheritance & Estate Tax", titleTr: "Miras ve Emlak Vergisi", description: "Calculate federal estate tax on Bitcoin holdings with exemption thresholds and state-level analysis", descriptionTr: "Muafiyet eşikleri ve eyalet düzeyinde analizle Bitcoin varlıklarındaki federal emlak vergisini hesaplayın", icon: FileText, color: "border-rose-500/20 hover:border-rose-500/40", iconBg: "bg-rose-500/10", iconColor: "text-rose-500", related: ["capital-gains-tax", "bitcoin-loan", "retirement", "hodl-strategy", "wealth-percentile"] },
  { id: "bitcoin-loan", path: "/calculators/bitcoin-loan", title: "Bitcoin Loan Calculator", titleTr: "Bitcoin Kredi Hesaplayıcısı", description: "Calculate LTV ratios, liquidation prices, and compare borrowing against Bitcoin vs. selling", descriptionTr: "LTV oranlarını, tasfiye fiyatlarını hesaplayın ve Bitcoin'e karşı borçlanmayı satmakla karşılaştırın", icon: Landmark, color: "border-success/20 hover:border-success/40", iconBg: "bg-success/10", iconColor: "text-success", related: ["leverage-liquidation", "capital-gains-tax", "inheritance-tax", "profit-loss", "hodl-strategy", "bitcoin-lot-size"] },
  { id: "correlation", path: "/calculators/correlation", title: "Correlation Calculator", titleTr: "Korelasyon Hesaplayıcısı", description: "See how Bitcoin correlates with the S&P 500, Gold, Nasdaq, and US Dollar across multiple time periods", descriptionTr: "Bitcoin'in S&P 500, Altın, Nasdaq ve ABD Doları ile birden fazla zaman diliminde nasıl korelasyon gösterdiğini görün", icon: Activity, color: "border-cyan-500/20 hover:border-cyan-500/40", iconBg: "bg-cyan-500/10", iconColor: "text-cyan-500", related: ["volatility", "dominance", "power-law", "cagr", "drawdown"] },
  { id: "btc-vs-real-estate", path: "/calculators/btc-vs-real-estate", title: "BTC vs Real Estate", titleTr: "BTC vs Gayrimenkul", description: "Compare Bitcoin investment returns against real estate with mortgage leverage, rental income, and appreciation modeling", descriptionTr: "Bitcoin yatırım getirilerini ipotek kaldıracı, kira geliri ve değer artışı modellemesiyle gayrimenkule karşı karşılaştırın", icon: Home, color: "border-indigo-500/20 hover:border-indigo-500/40", iconBg: "bg-indigo-500/10", iconColor: "text-indigo-500", related: ["what-if", "investment", "cagr", "correlation", "bitcoin-loan"] },
  { id: "bitcoin-lot-size", path: "/calculators/bitcoin-lot-size", title: "Lot Size Calculator", titleTr: "Lot Büyüklüğü Hesaplayıcısı", description: "Calculate the right BTC lot size for your trade based on account balance, risk %, and stop loss", descriptionTr: "Hesap bakiyesi, risk % ve stop loss'a göre işleminiz için doğru BTC lot büyüklüğünü hesaplayın", icon: Ruler, color: "border-primary/20 hover:border-primary/40", iconBg: "bg-primary/10", iconColor: "text-primary", related: ["leverage-liquidation", "profit-loss", "bitcoin-loan", "correlation", "bitcoin-converter"] },
  { id: "bitcoin-zakat", path: "/calculators/bitcoin-zakat", title: "Bitcoin Zakat Calculator", titleTr: "Bitcoin Zekat Hesaplayıcısı", description: "Calculate Zakat on Bitcoin, gold, cash and savings with live Nisab in PKR, INR, USD, AED", descriptionTr: "Bitcoin, altın, nakit ve tasarruflar üzerindeki Zekatı PKR, INR, USD, AED cinsinden canlı Nisab ile hesaplayın", icon: Moon, color: "border-success/20 hover:border-success/40", iconBg: "bg-success/10", iconColor: "text-success", related: ["bitcoin-converter", "wealth-percentile", "capital-gains-tax", "investment", "hodl-strategy"] },
  { id: "bitcoin-arbitrage", path: "/calculators/bitcoin-arbitrage", title: "Arbitrage Calculator", titleTr: "Arbitraj Hesaplayıcısı", description: "Calculate Bitcoin arbitrage profit between exchanges with fee comparison and net profit analysis", descriptionTr: "Ücret karşılaştırması ve net kâr analiziyle borsalar arasındaki Bitcoin arbitraj kârını hesaplayın", icon: ArrowUpDown, color: "border-cyan-500/20 hover:border-cyan-500/40", iconBg: "bg-cyan-500/10", iconColor: "text-cyan-500", related: ["profit-loss", "bitcoin-lot-size", "transaction-fees", "bitcoin-converter"] },
  { id: "pi-to-bitcoin", path: "/calculators/pi-to-bitcoin", title: "Pi to Bitcoin Calculator", titleTr: "Pi'den Bitcoin'e Hesaplayıcı", description: "Convert Pi Network coins to Bitcoin and USD at live market prices", descriptionTr: "Pi Network coin'lerini canlı piyasa fiyatlarıyla Bitcoin ve USD'ye dönüştürün", icon: Coins, color: "border-violet-500/20 hover:border-violet-500/40", iconBg: "bg-violet-500/10", iconColor: "text-violet-500", related: ["bitcoin-converter", "profit-loss", "bitcoin-arbitrage", "pi-to-bitcoin"] },
  { id: "portfolio-tracker", path: "/calculators/portfolio-tracker", title: "Portfolio Tracker", titleTr: "Portföy Takipçisi", description: "Track all your Bitcoin holdings in one place — live value, cost basis, profit/loss. No signup needed.", descriptionTr: "Tüm Bitcoin varlıklarınızı tek bir yerde takip edin — canlı değer, maliyet esası, kâr/zarar. Kayıt gerekmez.", icon: Wallet, color: "border-primary/20 hover:border-primary/40", iconBg: "bg-primary/10", iconColor: "text-primary", related: ["profit-loss", "average-buy-price", "wealth-percentile", "price-target", "what-if", "investment"] },
  { id: "bitcoin-accumulation-score", path: "/calculators/bitcoin-accumulation-score", title: "Accumulation Score", titleTr: "Birikim Skoru", description: "Grade your Bitcoin stack by age — get an A+ to F score based on the lifecycle accumulation model", descriptionTr: "Bitcoin yığınınızı yaşa göre derecelendirin — yaşam döngüsü birikim modeline göre A+'dan F'ye puan alın", icon: Crown, color: "border-amber-500/20 hover:border-amber-500/40", iconBg: "bg-amber-500/10", iconColor: "text-amber-500", related: ["wealth-percentile", "retirement", "dca", "power-law", "stack-sats", "investment"] },
  { id: "bitcoin-tax-india", path: "/calculators/bitcoin-tax-india", title: "Bitcoin Tax — India", titleTr: "Bitcoin Vergi — Hindistan", description: "India Section 115BBH: flat 30% on Bitcoin gains + 4% cess + 1% TDS on proceeds", descriptionTr: "Hindistan 115BBH Bölümü: Bitcoin kazancında sabit %30 + %4 cess + %1 TDS", icon: FileText, color: "border-amber-500/20 hover:border-amber-500/40", iconBg: "bg-amber-500/10", iconColor: "text-amber-500", related: ["bitcoin-tax-uk-cgt", "bitcoin-tax-germany", "capital-gains-tax", "profit-loss", "bitcoin-zakat", "inheritance-tax"] },
  { id: "bitcoin-tax-uk-cgt", path: "/calculators/bitcoin-tax-uk-cgt", title: "Bitcoin CGT — UK", titleTr: "Bitcoin CGT — İngiltere", description: "UK 2026/27: £3,000 allowance, 18% basic / 24% higher CGT rate", descriptionTr: "İngiltere 2026/27: £3.000 muafiyet, %18 temel / %24 üst CGT oranı", icon: FileText, color: "border-primary/20 hover:border-primary/40", iconBg: "bg-primary/10", iconColor: "text-primary", related: ["bitcoin-tax-india", "bitcoin-tax-germany", "capital-gains-tax", "inheritance-tax", "profit-loss", "average-buy-price"] },
  { id: "bitcoin-tax-germany", path: "/calculators/bitcoin-tax-germany", title: "Bitcoin Tax — Germany", titleTr: "Bitcoin Vergi — Almanya", description: "Section 23 EStG: 0% after 12 months, marginal rate within 12 months, €1,000 Freigrenze", descriptionTr: "Section 23 EStG: 12 ay sonra %0, 12 ay içinde marjinal oran, €1.000 Freigrenze", icon: FileText, color: "border-success/20 hover:border-success/40", iconBg: "bg-success/10", iconColor: "text-success", related: ["bitcoin-tax-uk-cgt", "bitcoin-tax-india", "capital-gains-tax", "hodl-strategy", "retirement", "inheritance-tax"] },
];

const defaultCalculators = ["what-if", "dca", "retirement"];

const RelatedCalculators = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const tr = language === 'tr';

  const relatedCalcs = useMemo(() => {
    const currentCalc = allCalculators.find(calc => {
      const trPath = trPathFor(calc.path);
      return (
        location.pathname === calc.path ||
        location.pathname === trPath ||
        location.pathname.includes(calc.id)
      );
    });

    if (currentCalc) {
      return currentCalc.related
        .map(id => allCalculators.find(calc => calc.id === id))
        .filter(Boolean)
        .slice(0, 3) as typeof allCalculators;
    }

    return defaultCalculators
      .map(id => allCalculators.find(calc => calc.id === id))
      .filter(Boolean) as typeof allCalculators;
  }, [location.pathname]);

  const relatedArticle = useMemo(() => {
    const currentCalc = allCalculators.find(calc => {
      const trPath = trPathFor(calc.path);
      return (
        location.pathname === calc.path ||
        location.pathname === trPath ||
        location.pathname.includes(calc.id)
      );
    });
    if (currentCalc) return calculatorArticleMap[currentCalc.id] || null;
    return null;
  }, [location.pathname]);

  if (location.pathname === "/calculators" || location.pathname === "/tr/hesaplayicilar") {
    return null;
  }

  const calcHubPath = tr ? '/tr/hesaplayicilar' : '/calculators';

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto space-y-12">

          {relatedArticle && (() => {
            // Validator — on /tr we only render the article card when the
            // slug has a registered Turkish mirror AND localized title/teaser
            // copy. This prevents silently linking to `/tr/` (the
            // getLocalizedPath fallback) when an EN-only article slug leaks
            // into calculatorArticleMap.
            if (tr) {
              if (!hasTurkishArticleMirror(relatedArticle.slug)) {
                if (typeof console !== 'undefined') {
                  console.warn(
                    `[RelatedCalculators] Skipping article card — '${relatedArticle.slug}' has no Turkish mirror in EN_TO_TR.`,
                  );
                }
                return null;
              }
              if (!relatedArticle.titleTr || !relatedArticle.teaserTr) {
                if (typeof console !== 'undefined') {
                  console.warn(
                    `[RelatedCalculators] Skipping article card — '${relatedArticle.slug}' is missing titleTr/teaserTr.`,
                  );
                }
                return null;
              }
            }

            const enArticlePath = `/learn/${relatedArticle.slug}`;
            const articleHref = tr ? getLocalizedPath(enArticlePath, 'tr') : enArticlePath;
            return (
              <Link
                to={articleHref}
                aria-label={`${tr ? 'Makaleyi oku' : 'Read article'}: ${tr && relatedArticle.titleTr ? relatedArticle.titleTr : relatedArticle.title}`}
                className="group block rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary uppercase tracking-wider mb-0.5">
                      {tr ? 'Makaleyi Oku' : 'Read Article'}
                    </p>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {tr && relatedArticle.titleTr ? relatedArticle.titleTr : relatedArticle.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                      {tr && relatedArticle.teaserTr ? relatedArticle.teaserTr : relatedArticle.teaser}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary/60 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                </div>
              </Link>
            );
          })()}

          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
              <Calculator className="w-4 h-4" />
              {tr ? 'İlgili Araçlar' : 'Related Tools'}
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr
                ? <>Daha Fazla <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Bitcoin Hesaplayıcısı</span> Keşfedin</>
                : <>Explore More <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Bitcoin Calculators</span></>}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {tr
                ? 'Bu ilgili profesyonel düzeyde Bitcoin yatırım araçlarıyla analizinize devam edin'
                : 'Continue your analysis with these related professional-grade Bitcoin investment tools'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedCalcs.map((calc, index) => {
              const targetPath = tr ? trPathFor(calc.path) : calc.path;
              const displayTitle = tr ? (calc.titleTr || calc.title) : calc.title;
              const displayDesc = tr ? (calc.descriptionTr || calc.description) : calc.description;
              return (
                <Link
                  key={calc.path}
                  to={targetPath}
                  className="group block"
                >
                  <div className={`
                    relative p-6 bg-card border-2 ${calc.color}
                    rounded-xl transition-all duration-300 h-full
                    hover:shadow-sm hover:-translate-y-1
                    animate-fade-in
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`
                      w-12 h-12 mb-4 rounded-lg ${calc.iconBg}
                      flex items-center justify-center
                      group-hover:scale-110 transition-transform duration-300
                    `}>
                      <calc.icon className={`w-6 h-6 ${calc.iconColor}`} />
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {displayTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {displayDesc}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm font-medium text-primary/80 group-hover:text-primary transition-colors duration-300">
                        {tr ? 'Hesaplayıcıyı Başlat' : 'Launch Calculator'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary/60 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              to={calcHubPath}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {tr ? 'Tüm hesaplayıcıları görüntüle' : 'View all calculators'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedCalculators;
