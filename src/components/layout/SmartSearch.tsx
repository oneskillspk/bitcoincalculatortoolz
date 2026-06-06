import { useState, useRef, useEffect } from 'react';
import { Search, Calculator, TrendingUp, TrendingDown, PiggyBank, Receipt, GitCompare, X, Target, ShoppingCart, Activity, Skull, Hourglass, Pickaxe, Wifi, Zap, ArrowLeftRight, DollarSign, Clock, BarChart3, Flame, Rainbow, Crown, Briefcase, LineChart, Coins, PieChart, Timer, Pizza, Crosshair, Gauge, BookOpen, Home } from 'lucide-react';
import { Link } from "@/components/LocalizedLink";
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedPath } from '@/utils/localizedRoutes';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  category: string;
  keywords: string[];
  /** Optional Turkish overrides — when present, displayed on /tr routes. */
  titleTr?: string;
  descriptionTr?: string;
  keywordsTr?: string[];
}

const CATEGORY_TR: Record<string, string> = {
  Calculator: 'Hesaplayıcı',
  Strategy: 'Strateji',
  Planning: 'Planlama',
  Tax: 'Vergi',
  Comparison: 'Karşılaştırma',
  Goal: 'Hedef',
  Analysis: 'Analiz',
  Dashboard: 'Panel',
  Tracker: 'Takipçi',
  Mining: 'Madencilik',
  Network: 'Ağ',
  Risk: 'Risk',
  Tool: 'Araç',
  'Market Analysis': 'Piyasa Analizi',
  Historical: 'Tarihsel',
  Learn: 'Öğren',
};


const searchData: SearchResult[] = [
  {
    id: 'portfolio-tracker',
    title: 'Bitcoin Portfolio Tracker',
    description: 'Track your Bitcoin holdings with no signup — cost basis, profit/loss, live value in 100+ currencies',
    icon: <Calculator className="w-5 h-5" />,
    href: '/calculators/portfolio-tracker',
    category: 'Calculator',
    keywords: ['portfolio', 'tracker', 'holdings', 'cost basis', 'profit', 'loss', 'no signup', 'private', 'free', 'track', 'wallet'],
    titleTr: 'Bitcoin Portföy Takipçisi',
    descriptionTr: 'Üyelik gerektirmeden Bitcoin varlıklarınızı izleyin — maliyet, kâr/zarar, 100+ para biriminde canlı değer'
  },
  {
    id: 'what-if',
    title: 'Bitcoin What If Calculator',
    description: 'Calculate potential profits and losses for Bitcoin investments',
    icon: <Calculator className="w-5 h-5" />,
    href: '/calculators/what-if',
    category: 'Calculator',
    keywords: ['profit', 'loss', 'gains', 'investment', 'portfolio', 'what if', 'returns'],
    titleTr: 'Bitcoin Ya Olsaydı Hesaplayıcısı',
    descriptionTr: 'Bitcoin yatırımları için olası kâr ve zararı hesaplayın'
  },
  {
    id: 'dca',
    title: 'Dollar Cost Averaging Calculator',
    description: 'Optimize your DCA strategy with advanced analytics',
    icon: <TrendingUp className="w-5 h-5" />,
    href: '/calculators/dca',
    category: 'Strategy',
    keywords: ['dca', 'dollar cost averaging', 'strategy', 'recurring', 'schedule'],
    titleTr: 'Dolar Maliyet Ortalaması (DCA) Hesaplayıcısı',
    descriptionTr: 'Gelişmiş analizlerle DCA stratejinizi optimize edin'
  },
  {
    id: 'retirement',
    title: 'Bitcoin Retirement Planner',
    description: 'Plan your Bitcoin retirement with detailed projections',
    icon: <PiggyBank className="w-5 h-5" />,
    href: '/calculators/retirement',
    category: 'Planning',
    keywords: ['retirement', 'planning', 'future', 'savings', 'goals', 'long term'],
    titleTr: 'Bitcoin Emeklilik Planlayıcısı',
    descriptionTr: 'Detaylı projeksiyonlarla Bitcoin emekliliğinizi planlayın'
  },
  {
    id: 'tax',
    title: 'Capital Gains Tax Calculator',
    description: 'Calculate Bitcoin capital gains tax obligations',
    icon: <Receipt className="w-5 h-5" />,
    href: '/calculators/capital-gains-tax',
    category: 'Tax',
    keywords: ['tax', 'capital gains', 'obligations', 'irs', 'filing', 'crypto tax'],
    titleTr: 'Sermaye Kazancı Vergisi Hesaplayıcısı',
    descriptionTr: 'Bitcoin sermaye kazancı vergi yükümlülüklerinizi hesaplayın'
  },
  {
    id: 'inheritance-tax',
    title: 'Inheritance & Estate Tax Calculator',
    description: 'Calculate step-up basis, estate tax, and capital gains on inherited Bitcoin',
    icon: <Receipt className="w-5 h-5" />,
    href: '/calculators/inheritance-tax',
    category: 'Tax',
    keywords: ['inheritance', 'estate tax', 'step-up basis', 'inherited bitcoin', 'estate planning'],
    titleTr: 'Miras ve Veraset Vergisi Hesaplayıcısı',
    descriptionTr: 'Miras kalan Bitcoin için maliyet sıfırlama, veraset vergisi ve sermaye kazancını hesaplayın'
  },
  {
    id: 'bitcoin-loan',
    title: 'Bitcoin Loan & Collateral Calculator',
    description: 'Calculate LTV ratios, liquidation prices, and compare borrowing vs selling Bitcoin',
    icon: <Receipt className="w-5 h-5" />,
    href: '/calculators/bitcoin-loan',
    category: 'Strategy',
    keywords: ['loan', 'collateral', 'ltv', 'borrow', 'liquidation', 'bitcoin loan', 'borrow against bitcoin'],
    titleTr: 'Bitcoin Kredi ve Teminat Hesaplayıcısı',
    descriptionTr: 'LTV oranlarını, tasfiye fiyatlarını hesaplayın ve Bitcoin için kredi vs satış karşılaştırması yapın'
  },
  {
    id: 'correlation',
    title: 'Bitcoin Correlation Calculator',
    description: 'See how Bitcoin correlates with S&P 500, Gold, Nasdaq, and US Dollar',
    icon: <GitCompare className="w-5 h-5" />,
    href: '/calculators/correlation',
    category: 'Market Analysis',
    keywords: ['correlation', 'diversification', 'portfolio', 'sp500', 'gold', 'nasdaq', 'dxy', 'dollar', 'pearson', 'hedge'],
    titleTr: 'Bitcoin Korelasyon Hesaplayıcısı',
    descriptionTr: 'Bitcoin ile S&P 500, Altın, Nasdaq ve Dolar arasındaki korelasyonu görün'
  },
  {
    id: 'lump-sum-vs-dca',
    title: 'Lump Sum vs DCA Comparison',
    description: 'Compare lump sum vs dollar cost averaging strategies',
    icon: <GitCompare className="w-5 h-5" />,
    href: '/calculators/lump-sum-vs-dca',
    category: 'Comparison',
    keywords: ['lump sum', 'dca', 'comparison', 'strategy', 'analysis', 'vs'],
    titleTr: 'Toplu Yatırım ile DCA Karşılaştırması',
    descriptionTr: 'Toplu yatırım ve dolar maliyet ortalaması stratejilerini karşılaştırın'
  },
  {
    id: 'stack-sats',
    title: 'Stack Sats Goal Calculator',
    description: 'Set and track your Bitcoin accumulation goals',
    icon: <Target className="w-5 h-5" />,
    href: '/calculators/stack-sats',
    category: 'Goal',
    keywords: ['stack', 'sats', 'satoshi', 'accumulation', 'goal', 'target', 'savings'],
    titleTr: 'Satoshi Biriktirme Hedefi Hesaplayıcısı',
    descriptionTr: 'Bitcoin biriktirme hedeflerinizi belirleyin ve takip edin'
  },
  {
    id: 'purchasing-power',
    title: 'Purchasing Power Calculator',
    description: 'See how Bitcoin preserves purchasing power vs fiat',
    icon: <ShoppingCart className="w-5 h-5" />,
    href: '/calculators/purchasing-power',
    category: 'Analysis',
    keywords: ['purchasing power', 'inflation', 'fiat', 'dollar', 'value', 'hedge'],
    titleTr: 'Satın Alma Gücü Hesaplayıcısı',
    descriptionTr: 'Bitcoin\'in fiat paraya karşı satın alma gücünü nasıl koruduğunu görün'
  },
  {
    id: 'inflation-dashboard',
    title: 'Bitcoin Inflation Dashboard',
    description: 'Compare Bitcoin vs fiat money supply and inflation',
    icon: <Activity className="w-5 h-5" />,
    href: '/calculators/inflation-dashboard',
    category: 'Dashboard',
    keywords: ['inflation', 'money supply', 'fiat', 'm2', 'fed', 'monetary policy'],
    titleTr: 'Bitcoin Enflasyon Paneli',
    descriptionTr: 'Bitcoin\'i fiat para arzı ve enflasyonla karşılaştırın'
  },
  {
    id: 'obituaries-tracker',
    title: 'Bitcoin Obituaries Tracker',
    description: 'Track every time Bitcoin was declared dead',
    icon: <Skull className="w-5 h-5" />,
    href: '/calculators/obituaries-tracker',
    category: 'Tracker',
    keywords: ['obituaries', 'dead', 'deaths', 'media', 'fud', 'predictions', 'wrong'],
    titleTr: 'Bitcoin Ölüm İlanları Takipçisi',
    descriptionTr: 'Bitcoin\'in öldüğünün ilan edildiği her zamanı takip edin'
  },
  {
    id: 'hodl-strategy',
    title: 'HODL Strategy Calculator',
    description: 'Analyze long-term holding vs trading strategies',
    icon: <Hourglass className="w-5 h-5" />,
    href: '/calculators/hodl-strategy',
    category: 'Strategy',
    keywords: ['hodl', 'hold', 'long term', 'strategy', 'trading', 'comparison'],
    titleTr: 'HODL Strateji Hesaplayıcısı',
    descriptionTr: 'Uzun vadeli tutma ile işlem stratejilerini analiz edin'
  },
  {
    id: 'mining-profitability',
    title: 'Bitcoin Mining Profitability Calculator',
    description: 'Calculate mining profits, ROI, and break-even time',
    icon: <Pickaxe className="w-5 h-5" />,
    href: '/calculators/mining-profitability',
    category: 'Mining',
    keywords: ['mining', 'profitability', 'asic', 'hash rate', 'electricity', 'roi', 'break even', 'miner'],
    titleTr: 'Bitcoin Madencilik Kârlılığı Hesaplayıcısı',
    descriptionTr: 'Madencilik kârlarını, ROI\'yi ve başabaş süresini hesaplayın'
  },
  {
    id: 'transaction-fees',
    title: 'Bitcoin Transaction Fee Calculator',
    description: 'Real-time Bitcoin network fee estimation for optimal transaction timing',
    icon: <Wifi className="w-5 h-5" />,
    href: '/calculators/transaction-fees',
    category: 'Network',
    keywords: ['fee', 'transaction', 'mempool', 'sat/vbyte', 'network', 'confirmation', 'priority', 'segwit', 'taproot'],
    titleTr: 'Bitcoin İşlem Ücreti Hesaplayıcısı',
    descriptionTr: 'Optimal işlem zamanlaması için gerçek zamanlı Bitcoin ağ ücreti tahmini'
  },
  {
    id: 'lightning',
    title: 'Lightning Network Fee Calculator',
    description: 'Calculate routing fees for instant Lightning Network payments',
    icon: <Zap className="w-5 h-5" />,
    href: '/calculators/lightning',
    category: 'Network',
    keywords: ['lightning', 'routing', 'fees', 'instant', 'payments', 'channels', 'nodes', 'ppm', 'layer 2'],
    titleTr: 'Lightning Ağı Ücret Hesaplayıcısı',
    descriptionTr: 'Anlık Lightning Ağı ödemeleri için yönlendirme ücretlerini hesaplayın'
  },
  {
    id: 'leverage-liquidation',
    title: 'Bitcoin Leverage & Liquidation Calculator',
    description: 'Calculate liquidation prices for leveraged positions',
    icon: <TrendingDown className="w-5 h-5" />,
    href: '/calculators/leverage-liquidation',
    category: 'Risk',
    keywords: ['leverage', 'liquidation', 'margin', 'trading', 'position', 'risk', 'long', 'short', 'futures'],
    titleTr: 'Bitcoin Kaldıraç ve Tasfiye Hesaplayıcısı',
    descriptionTr: 'Kaldıraçlı pozisyonlar için tasfiye fiyatlarını hesaplayın'
  },
  {
    id: 'profit-loss',
    title: 'Bitcoin Profit & Loss Calculator',
    description: 'Calculate your Bitcoin profit or loss from buy and sell prices',
    icon: <DollarSign className="w-5 h-5" />,
    href: '/calculators/profit-loss',
    category: 'Calculator',
    keywords: ['profit', 'loss', 'pnl', 'buy', 'sell', 'returns', 'gains'],
    titleTr: 'Bitcoin Kâr ve Zarar Hesaplayıcısı',
    descriptionTr: 'Alış ve satış fiyatlarınızdan Bitcoin kâr veya zararınızı hesaplayın'
  },
  {
    id: 'bitcoin-converter',
    title: 'Bitcoin Unit Converter',
    description: 'Convert between BTC, satoshis, mBTC, and fiat currencies',
    icon: <ArrowLeftRight className="w-5 h-5" />,
    href: '/calculators/bitcoin-converter',
    category: 'Tool',
    keywords: ['converter', 'satoshi', 'btc', 'mbtc', 'fiat', 'usd', 'convert', 'units'],
    titleTr: 'Bitcoin Birim Dönüştürücü',
    descriptionTr: 'BTC, satoshi, mBTC ve fiat para birimleri arasında dönüştürün'
  },
  {
    id: 'investment',
    title: 'Bitcoin Investment Calculator',
    description: 'Project your Bitcoin investment growth over time',
    icon: <LineChart className="w-5 h-5" />,
    href: '/calculators/investment',
    category: 'Calculator',
    keywords: ['investment', 'growth', 'returns', 'projection', 'portfolio', 'compound'],
    titleTr: 'Bitcoin Yatırım Hesaplayıcısı',
    descriptionTr: 'Bitcoin yatırımınızın zaman içindeki büyümesini projekte edin'
  },
  {
    id: 'halving-countdown',
    title: 'Bitcoin Halving Countdown',
    description: 'Track the next Bitcoin halving event and its market impact',
    icon: <Clock className="w-5 h-5" />,
    href: '/calculators/halving-countdown',
    category: 'Tracker',
    keywords: ['halving', 'countdown', 'block reward', 'supply', 'event', '2028'],
    titleTr: 'Bitcoin Yarılama Geri Sayımı',
    descriptionTr: 'Bir sonraki Bitcoin yarılama olayını ve piyasa etkisini takip edin'
  },
  {
    id: 'bitcoin-savings',
    title: 'Bitcoin Savings Calculator',
    description: 'Plan your Bitcoin savings strategy with regular contributions',
    icon: <PiggyBank className="w-5 h-5" />,
    href: '/calculators/bitcoin-savings',
    category: 'Planning',
    keywords: ['savings', 'plan', 'regular', 'contributions', 'accumulate', 'budget'],
    titleTr: 'Bitcoin Birikim Hesaplayıcısı',
    descriptionTr: 'Düzenli katkılarla Bitcoin birikim stratejinizi planlayın'
  },
  {
    id: 'fear-greed-index',
    title: 'Bitcoin Fear & Greed Index',
    description: 'Real-time market sentiment analysis for Bitcoin',
    icon: <Gauge className="w-5 h-5" />,
    href: '/calculators/fear-greed-index',
    category: 'Dashboard',
    keywords: ['fear', 'greed', 'sentiment', 'market', 'index', 'emotion', 'mood'],
    titleTr: 'Bitcoin Korku ve Açgözlülük Endeksi',
    descriptionTr: 'Bitcoin için gerçek zamanlı piyasa duyarlılığı analizi'
  },
  {
    id: 'rainbow-chart',
    title: 'Bitcoin Rainbow Chart',
    description: 'Visualize Bitcoin price history with logarithmic growth bands',
    icon: <Rainbow className="w-5 h-5" />,
    href: '/calculators/rainbow-chart',
    category: 'Analysis',
    keywords: ['rainbow', 'chart', 'logarithmic', 'growth', 'bands', 'valuation', 'history'],
    titleTr: 'Bitcoin Gökkuşağı Grafiği',
    descriptionTr: 'Logaritmik büyüme bantlarıyla Bitcoin fiyat geçmişini görselleştirin'
  },
  {
    id: 'wealth-percentile',
    title: 'Bitcoin Wealth Percentile',
    description: 'See where you rank among global Bitcoin holders',
    icon: <Crown className="w-5 h-5" />,
    href: '/calculators/wealth-percentile',
    category: 'Analysis',
    keywords: ['wealth', 'percentile', 'rank', 'holders', 'distribution', 'rich list', 'top'],
    titleTr: 'Bitcoin Servet Yüzdesi',
    descriptionTr: 'Küresel Bitcoin sahipleri arasında nerede olduğunuzu görün'
  },
  {
    id: 'etf',
    title: 'Bitcoin ETF Calculator',
    description: 'Compare Bitcoin ETFs — IBIT, FBTC, ARKB and expense ratios',
    icon: <Briefcase className="w-5 h-5" />,
    href: '/calculators/etf',
    category: 'Calculator',
    keywords: ['etf', 'ibit', 'fbtc', 'arkb', 'expense ratio', 'spot', 'fund'],
    titleTr: 'Bitcoin ETF Hesaplayıcısı',
    descriptionTr: 'Bitcoin ETF\'lerini karşılaştırın — IBIT, FBTC, ARKB ve gider oranları'
  },
  {
    id: 'power-law',
    title: 'Bitcoin Power Law Calculator',
    description: 'Model Bitcoin price using the power law growth corridor',
    icon: <LineChart className="w-5 h-5" />,
    href: '/calculators/power-law',
    category: 'Analysis',
    keywords: ['power law', 'model', 'corridor', 'prediction', 'logarithmic', 'regression'],
    titleTr: 'Bitcoin Güç Yasası Hesaplayıcısı',
    descriptionTr: 'Güç yasası büyüme koridoruyla Bitcoin fiyatını modelleyin'
  },
  {
    id: 'cagr',
    title: 'Bitcoin CAGR Calculator',
    description: 'Calculate compound annual growth rate for Bitcoin',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/calculators/cagr',
    category: 'Calculator',
    keywords: ['cagr', 'compound', 'annual', 'growth', 'rate', 'performance', 'return'],
    titleTr: 'Bitcoin CAGR Hesaplayıcısı',
    descriptionTr: 'Bitcoin için bileşik yıllık büyüme oranını hesaplayın'
  },
  {
    id: 'staking',
    title: 'Bitcoin Staking Calculator',
    description: 'Estimate staking rewards and yield for wrapped Bitcoin',
    icon: <Coins className="w-5 h-5" />,
    href: '/calculators/staking',
    category: 'Calculator',
    keywords: ['staking', 'yield', 'rewards', 'apy', 'wrapped', 'wbtc', 'defi'],
    titleTr: 'Bitcoin Staking Hesaplayıcısı',
    descriptionTr: 'Sarmalanmış Bitcoin için staking ödüllerini ve getirisini tahmin edin'
  },
  {
    id: 'on-chain',
    title: 'Bitcoin On-Chain Dashboard',
    description: 'Explore key on-chain metrics and network health indicators',
    icon: <Activity className="w-5 h-5" />,
    href: '/calculators/on-chain',
    category: 'Dashboard',
    keywords: ['on-chain', 'metrics', 'network', 'hash rate', 'addresses', 'transactions', 'utxo'],
    titleTr: 'Bitcoin Zincir Üstü Paneli',
    descriptionTr: 'Önemli zincir üstü metrikleri ve ağ sağlığı göstergelerini keşfedin'
  },
  {
    id: 'volatility',
    title: 'Bitcoin Volatility Calculator',
    description: 'Measure Bitcoin price volatility across different timeframes',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/calculators/volatility',
    category: 'Analysis',
    keywords: ['volatility', 'risk', 'standard deviation', 'variance', 'price swings'],
    titleTr: 'Bitcoin Oynaklık Hesaplayıcısı',
    descriptionTr: 'Farklı zaman dilimlerinde Bitcoin fiyat oynaklığını ölçün'
  },
  {
    id: 'supply',
    title: 'Bitcoin Supply Calculator',
    description: 'Track total, circulating, and lost Bitcoin supply metrics',
    icon: <PieChart className="w-5 h-5" />,
    href: '/calculators/supply',
    category: 'Tracker',
    keywords: ['supply', 'circulating', 'lost', 'coins', 'scarcity', '21 million', 'total'],
    titleTr: 'Bitcoin Arz Hesaplayıcısı',
    descriptionTr: 'Toplam, dolaşımdaki ve kayıp Bitcoin arz metriklerini takip edin'
  },
  {
    id: 'dominance',
    title: 'Bitcoin Dominance Calculator',
    description: 'Live Bitcoin dominance percentage with price scenario modeler',
    icon: <PieChart className="w-5 h-5" />,
    href: '/calculators/dominance',
    category: 'Dashboard',
    keywords: ['dominance', 'market cap', 'market share', 'altcoin', 'crypto'],
    titleTr: 'Bitcoin Dominans Hesaplayıcısı',
    descriptionTr: 'Fiyat senaryosu modelleyicisiyle canlı Bitcoin dominans yüzdesi'
  },
  {
    id: 'time-machine',
    title: 'Bitcoin Time Machine',
    description: 'See what your investment would be worth if you bought earlier',
    icon: <Timer className="w-5 h-5" />,
    href: '/calculators/time-machine',
    category: 'Historical',
    keywords: ['time machine', 'historical', 'past', 'what if', 'regret', 'hindsight'],
    titleTr: 'Bitcoin Zaman Makinesi',
    descriptionTr: 'Daha önce alsaydınız yatırımınızın bugün ne kadar olacağını görün'
  },
  {
    id: 'drawdown',
    title: 'Bitcoin Drawdown Calculator',
    description: 'Analyze Bitcoin max drawdowns and crash recovery periods',
    icon: <TrendingDown className="w-5 h-5" />,
    href: '/calculators/drawdown',
    category: 'Risk',
    keywords: ['drawdown', 'crash', 'correction', 'recovery', 'bear market', 'decline', 'max drawdown'],
    titleTr: 'Bitcoin Düşüş Analizi',
    descriptionTr: 'Bitcoin maksimum düşüşlerini ve toparlanma sürelerini analiz edin'
  },
  {
    id: 'sip',
    title: 'Bitcoin SIP Calculator',
    description: 'Systematic Investment Plan calculator for Bitcoin',
    icon: <TrendingUp className="w-5 h-5" />,
    href: '/calculators/sip',
    category: 'Strategy',
    keywords: ['sip', 'systematic', 'investment', 'plan', 'monthly', 'recurring', 'india'],
    titleTr: 'Bitcoin SIP Hesaplayıcısı',
    descriptionTr: 'Bitcoin için Sistematik Yatırım Planı hesaplayıcısı'
  },
  {
    id: 'pizza-day',
    title: 'Bitcoin Pizza Day Calculator',
    description: 'Calculate the value of the famous 10,000 BTC pizza purchase',
    icon: <Pizza className="w-5 h-5" />,
    href: '/calculators/pizza-day',
    category: 'Historical',
    keywords: ['pizza', 'pizza day', '10000 btc', 'laszlo', 'historical', 'fun'],
    titleTr: 'Bitcoin Pizza Günü Hesaplayıcısı',
    descriptionTr: 'Ünlü 10.000 BTC pizza alımının değerini hesaplayın'
  },
  {
    id: 'average-buy-price',
    title: 'Bitcoin Average Buy Price Calculator',
    description: 'Calculate your average cost basis across multiple purchases',
    icon: <Calculator className="w-5 h-5" />,
    href: '/calculators/average-buy-price',
    category: 'Calculator',
    keywords: ['average', 'buy price', 'cost basis', 'dca', 'mean', 'purchases'],
    titleTr: 'Bitcoin Ortalama Alış Fiyatı Hesaplayıcısı',
    descriptionTr: 'Birden fazla alımdaki ortalama maliyetinizi hesaplayın'
  },
  {
    id: 'price-target',
    title: 'Bitcoin Price Target Calculator',
    description: 'Set and track Bitcoin price targets with alerts',
    icon: <Crosshair className="w-5 h-5" />,
    href: '/calculators/price-target',
    category: 'Tool',
    keywords: ['price target', 'target', 'goal', 'alert', 'prediction', 'forecast'],
    titleTr: 'Bitcoin Fiyat Hedefi Hesaplayıcısı',
    descriptionTr: 'Uyarılarla Bitcoin fiyat hedefleri belirleyin ve takip edin'
  },
  {
    id: 'btc-vs-real-estate',
    title: 'Bitcoin vs Real Estate Calculator',
    description: 'Compare Bitcoin vs property returns with mortgage leverage and rental income',
    icon: <Home className="w-5 h-5" />,
    href: '/calculators/btc-vs-real-estate',
    category: 'Calculator',
    keywords: ['real estate', 'property', 'house', 'mortgage', 'comparison', 'btc vs', 'housing'],
    titleTr: 'Bitcoin ile Gayrimenkul Hesaplayıcısı',
    descriptionTr: 'İpotek kaldıracı ve kira geliriyle Bitcoin ve mülk getirilerini karşılaştırın'
  },
  {
    id: 'bitcoin-lot-size',
    title: 'Bitcoin Lot Size Calculator',
    description: 'Calculate optimal position sizes for Bitcoin trading',
    icon: <Calculator className="w-5 h-5" />,
    href: '/calculators/bitcoin-lot-size',
    category: 'Calculator',
    keywords: ['lot size', 'position size', 'trading', 'forex', 'pips'],
    titleTr: 'Bitcoin Lot Büyüklüğü Hesaplayıcısı',
    descriptionTr: 'Bitcoin işlemleri için optimal pozisyon büyüklüklerini hesaplayın'
  },
  {
    id: 'bitcoin-zakat',
    title: 'Bitcoin Zakat Calculator',
    description: 'Calculate Zakat obligations on your Bitcoin holdings',
    icon: <Calculator className="w-5 h-5" />,
    href: '/calculators/bitcoin-zakat',
    category: 'Calculator',
    keywords: ['zakat', 'islamic', 'halal', 'nisab', 'obligation', 'muslim'],
    titleTr: 'Bitcoin Zekât Hesaplayıcısı',
    descriptionTr: 'Bitcoin varlıklarınız üzerindeki Zekât yükümlülüklerini hesaplayın'
  },
  {
    id: 'bitcoin-arbitrage',
    title: 'Bitcoin Arbitrage Calculator',
    description: 'Find arbitrage opportunities across exchanges',
    icon: <ArrowLeftRight className="w-5 h-5" />,
    href: '/calculators/bitcoin-arbitrage',
    category: 'Calculator',
    keywords: ['arbitrage', 'exchange', 'spread', 'opportunity', 'profit'],
    titleTr: 'Bitcoin Arbitraj Hesaplayıcısı',
    descriptionTr: 'Borsalar arası arbitraj fırsatlarını bulun'
  },
  {
    id: 'pi-to-bitcoin',
    title: 'Pi to Bitcoin Calculator',
    description: 'Convert Pi Network coins to Bitcoin equivalent',
    icon: <ArrowLeftRight className="w-5 h-5" />,
    href: '/calculators/pi-to-bitcoin',
    category: 'Calculator',
    keywords: ['pi', 'pi network', 'convert', 'exchange', 'pi coin'],
    titleTr: 'Pi\'den Bitcoin\'e Hesaplayıcı',
    descriptionTr: 'Pi Network coinlerini Bitcoin karşılığına dönüştürün'
  },
  // --- Learn Articles ---
  { id: 'article-what-is-bitcoin-dca', title: 'What Is Bitcoin DCA and How Does It Work?', description: 'Learn what Dollar Cost Averaging is and why it reduces risk.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/what-is-bitcoin-dca', category: 'Learn', keywords: ['dca', 'dollar cost averaging', 'strategy', 'guide'] },
  { id: 'article-halving-explained', title: 'Bitcoin Halving Explained', description: 'Understand halving events, their impact on price, mining rewards, and supply.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-halving-explained', category: 'Learn', keywords: ['halving', 'explained', 'block reward', 'supply'] },
  { id: 'article-profit-loss', title: 'How to Calculate Bitcoin Profit and Loss', description: 'Step-by-step guide to calculating your Bitcoin P&L including fees and taxes.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/how-to-calculate-bitcoin-profit-loss', category: 'Learn', keywords: ['profit', 'loss', 'calculate', 'p&l', 'guide'] },
  { id: 'article-btc-vs-gold', title: 'Bitcoin vs Gold vs S&P 500', description: 'Compare Bitcoin, Gold, and S&P 500 returns over 10 years.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-vs-gold-sp500', category: 'Learn', keywords: ['gold', 's&p 500', 'comparison', 'returns', 'cagr'] },
  { id: 'article-fear-greed', title: 'What Is the Bitcoin Fear and Greed Index?', description: 'How the Fear and Greed Index works and how to use it for investing.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/what-is-fear-greed-index', category: 'Learn', keywords: ['fear', 'greed', 'index', 'sentiment'] },
  { id: 'article-retirement', title: 'How to Plan Retirement With Bitcoin', description: 'Incorporate Bitcoin into your retirement plan with allocation strategies.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/how-to-plan-retirement-with-bitcoin', category: 'Learn', keywords: ['retirement', 'plan', 'allocation', 'long term'] },
  { id: 'article-mining-2026', title: 'Bitcoin Mining Profitability in 2026', description: 'Is mining still profitable? Analyze electricity costs, hash rates, and ROI.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-mining-profitability-2026', category: 'Learn', keywords: ['mining', 'profitability', '2026', 'electricity'] },
  { id: 'article-satoshi', title: 'What Is a Satoshi?', description: 'Learn what a Satoshi is, how Bitcoin units work, and how to convert.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/what-is-a-satoshi', category: 'Learn', keywords: ['satoshi', 'units', 'sats', 'convert'] },
  { id: 'article-tax-guide', title: 'Bitcoin Tax Guide', description: 'How Bitcoin capital gains taxes work, short-term vs long-term rates.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-tax-guide-capital-gains', category: 'Learn', keywords: ['tax', 'capital gains', 'guide', 'filing'] },
  { id: 'article-dca-vs-lump', title: 'DCA vs Lump Sum Bitcoin', description: 'Which strategy wins? Data-backed comparison with historical analysis.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/dca-vs-lump-sum-bitcoin', category: 'Learn', keywords: ['dca', 'lump sum', 'comparison', 'strategy'] },
  { id: 'article-how-much', title: 'How Much Bitcoin Should I Own in 2026?', description: 'How much Bitcoin to own based on income, risk tolerance, and goals.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/how-much-bitcoin-should-i-own', category: 'Learn', keywords: ['how much', 'allocation', 'portfolio', 'own'] },
  { id: 'article-hodl', title: 'Bitcoin HODL Strategy Explained', description: 'Why long-term holders outperform traders and how to build a HODL strategy.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-hodl-strategy-explained', category: 'Learn', keywords: ['hodl', 'hold', 'strategy', 'long term'] },
  { id: 'article-tx-fees', title: 'Bitcoin Transaction Fees Explained', description: 'How transaction fees work, what determines cost, and how to save.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-transaction-fees-explained', category: 'Learn', keywords: ['transaction', 'fees', 'explained', 'mempool'] },
  { id: 'article-savings', title: 'Bitcoin Savings Plan Guide', description: 'Build a Bitcoin savings plan with regular contributions.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-savings-plan-guide', category: 'Learn', keywords: ['savings', 'plan', 'guide', 'contributions'] },
  { id: 'article-leverage', title: 'Bitcoin Leverage Trading Risks', description: 'Risks of leverage trading, how liquidation works, and why most traders lose.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-leverage-trading-risks', category: 'Learn', keywords: ['leverage', 'trading', 'risks', 'liquidation'] },
  { id: 'article-power-law', title: 'Bitcoin Power Law Explained', description: 'The Power Law predicts long-term price using mathematical regression.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-power-law-explained', category: 'Learn', keywords: ['power law', 'regression', 'prediction', 'model'] },
  { id: 'article-on-chain', title: 'Bitcoin On-Chain Metrics Guide 2026', description: 'Read on-chain metrics: MVRV ratio, Stock-to-Flow, hash rate, and more.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-on-chain-metrics-guide', category: 'Learn', keywords: ['on-chain', 'mvrv', 'stock to flow', 'metrics'] },
  { id: 'article-staking', title: 'Bitcoin Staking Guide 2026', description: 'Earn yield on Bitcoin with Babylon Protocol, Lido wBTC, and Binance Earn.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-staking-guide', category: 'Learn', keywords: ['staking', 'yield', 'babylon', 'apy'] },
  { id: 'article-sip', title: 'Bitcoin SIP Guide', description: 'How Systematic Investment Plans work for crypto.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-sip-guide', category: 'Learn', keywords: ['sip', 'systematic', 'investment plan'] },
  { id: 'article-pizza', title: 'The Bitcoin Pizza Day Story', description: 'How 10,000 BTC bought two pizzas in 2010 and what it teaches us.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-pizza-day-history', category: 'Learn', keywords: ['pizza day', '10000 btc', 'laszlo', 'history'] },
  { id: 'article-millionaire', title: 'Bitcoin Millionaire Calculator Guide', description: 'How much BTC do you need to reach $1M? Explore price targets.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-millionaire-calculator-guide', category: 'Learn', keywords: ['millionaire', 'calculator', 'how much', 'target'] },
  { id: 'article-formulas', title: 'Bitcoin Calculation Formulas Explained', description: 'Learn the math behind every Bitcoin calculator — profit, DCA, mining, Power Law.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-calculation-formulas', category: 'Learn', keywords: ['formula', 'calculation', 'math', 'how it works', 'crypto calculator'] },
  // --- Phase 1-4 Articles ---
  { id: 'article-avg-buy-price', title: 'How to Calculate Average Buy Price for Bitcoin', description: 'Calculate your cost basis and average buy price with this step-by-step guide.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/how-to-calculate-average-buy-price-bitcoin', category: 'Learn', keywords: ['average buy price', 'cost basis', 'dca', 'calculate'] },
  { id: 'article-wealth-distribution', title: 'Bitcoin Wealth Distribution Explained', description: 'How Bitcoin is distributed among holders and what it means for the network.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-wealth-distribution', category: 'Learn', keywords: ['wealth', 'distribution', 'holders', 'whales', 'percentile'] },
  { id: 'article-btc-vs-assets', title: 'Bitcoin vs Real Estate, S&P 500, and Gold', description: 'Compare Bitcoin returns against real estate, stocks, and gold over 10+ years.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-vs-real-estate-sp500-gold-comparison', category: 'Learn', keywords: ['real estate', 's&p 500', 'gold', 'comparison', 'returns'] },
  { id: 'article-dominance', title: 'Bitcoin Dominance Explained', description: 'Understand Bitcoin market dominance, how it\'s calculated, and what it signals.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-dominance-explained', category: 'Learn', keywords: ['dominance', 'market cap', 'altcoin', 'market share'] },
  { id: 'article-rainbow-chart', title: 'How to Read the Bitcoin Rainbow Chart', description: 'Learn to interpret the Rainbow Chart for valuation and market timing.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/how-to-read-bitcoin-rainbow-chart', category: 'Learn', keywords: ['rainbow', 'chart', 'valuation', 'bands', 'timing'] },
  { id: 'article-drawdown', title: 'Bitcoin Drawdown History', description: 'Complete history of Bitcoin crashes, max drawdowns, and recovery times.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-drawdown-history', category: 'Learn', keywords: ['drawdown', 'crash', 'correction', 'recovery', 'bear market'] },
  { id: 'article-s2f', title: 'Bitcoin Stock-to-Flow Model Explained', description: 'How the Stock-to-Flow model works and its accuracy in predicting Bitcoin price.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-stock-to-flow-model', category: 'Learn', keywords: ['stock to flow', 's2f', 'planb', 'model', 'scarcity'] },
  { id: 'article-fear-greed-strategy', title: 'Bitcoin Fear & Greed Index Strategy', description: 'Use the Fear & Greed Index to time your Bitcoin buys and sells.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-fear-greed-index-strategy', category: 'Learn', keywords: ['fear', 'greed', 'index', 'strategy', 'timing'] },
  { id: 'article-etf-guide', title: 'Bitcoin ETF Guide: IBIT vs FBTC vs ARKB', description: 'Compare spot Bitcoin ETFs by expense ratio, custodian, and IRA eligibility.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-etf-guide-ibit-fbtc-arkb', category: 'Learn', keywords: ['etf', 'ibit', 'fbtc', 'arkb', 'expense ratio', 'ira'] },
  { id: 'article-dca-returns', title: '$100/Month Bitcoin DCA Returns', description: 'Historical year-by-year returns for a $100/month Bitcoin DCA strategy.', icon: <BookOpen className="w-5 h-5" />, href: '/learn/bitcoin-dca-100-per-month-returns', category: 'Learn', keywords: ['dca', '$100', 'returns', 'historical', 'monthly'] },
];

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartSearch = ({ isOpen, onClose }: SmartSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  const isTurkish = language === 'tr';

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // On TR routes, hide entries that have no Turkish mirror (avoid 404 fallbacks)
    const pool = isTurkish
      ? searchData.filter((it) => {
          if (it.href === '/') return true;
          const tr = getLocalizedPath(it.href, 'tr');
          return tr !== '/tr/' || it.href === '/';
        })
      : searchData;

    if (!query.trim()) {
      setResults(pool.slice(0, 3));
      return;
    }

    const searchTerm = query.toLowerCase();
    const filteredResults = pool.filter(item => {
      const trTitle = (item.titleTr || '').toLowerCase();
      const trDesc = (item.descriptionTr || '').toLowerCase();
      return (
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        trTitle.includes(searchTerm) ||
        trDesc.includes(searchTerm) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
        (item.keywordsTr || []).some(keyword => keyword.toLowerCase().includes(searchTerm))
      );
    });

    setResults(filteredResults);
  }, [query, isTurkish]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto p-4 z-50">
        <Card className="p-6 shadow-sm border border-border/60 bg-card/95 backdrop-blur-xl">
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={isTurkish ? 'Hesaplayıcılar, araçlar ve özelliklerde ara...' : 'Search calculators, tools, and features...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 md:pl-12 pr-12 md:pr-12 h-12 text-lg bg-background/50 border-border/30 focus:border-primary/50"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          {!query && (
            <div className="mb-6">
              <p className="text-sm text-foreground/60 mb-3 font-medium">{isTurkish ? 'Hızlı İşlemler' : 'Quick Actions'}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">
                  {isTurkish ? 'Popüler Hesaplayıcılar' : 'Popular Calculators'}
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">
                  {isTurkish ? 'Strateji Araçları' : 'Strategy Tools'}
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">
                  {isTurkish ? 'Vergi Planlama' : 'Tax Planning'}
                </Badge>
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="space-y-2">
            {results.length > 0 ? (
              <>
                <p className="text-sm text-foreground/60 mb-3 font-medium">
                  {query ? (isTurkish ? `${results.length} sonuç bulundu` : `${results.length} result${results.length !== 1 ? 's' : ''} found`) : (isTurkish ? 'Popüler Hesaplayıcılar' : 'Popular Calculators')}
                </p>
                {results.map((result) => (
                  <Link
                    key={result.id}
                    to={isTurkish ? getLocalizedPath(result.href, 'tr') : result.href}
                    onClick={onClose}
                    className="block group"
                  >
                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 transition-colors duration-200">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-200">
                        {result.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {isTurkish ? (result.titleTr ?? result.title) : result.title}
                        </h3>
                        <p className="text-sm text-foreground/60 truncate">
                          {isTurkish ? (result.descriptionTr ?? result.description) : result.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {isTurkish ? (CATEGORY_TR[result.category] ?? result.category) : result.category}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-foreground/30 mx-auto mb-3" />
                <p className="text-foreground/60">{isTurkish ? `"${query}" için sonuç bulunamadı` : `No results found for "${query}"`}</p>
                <p className="text-sm text-foreground/40 mt-1">
                  {isTurkish ? 'DCA, emeklilik veya vergi gibi terimler deneyin' : 'Try searching for "DCA", "retirement", or "tax"'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border/20">
            <div className="flex items-center justify-between text-xs text-foreground/50">
              <span>{isTurkish ? 'Kapatmak için ESC' : 'Press ESC to close'}</span>
              <span>{isTurkish ? 'Gezinmek için ↑ ↓ • Seçmek için ↵' : '↑ ↓ to navigate • ↵ to select'}</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};