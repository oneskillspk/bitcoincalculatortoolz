export interface ArticleSection {
  id: string;
  heading: string;
  content: string;
  cta?: {
    calculatorId: string;
    calculatorName: string;
    text: string;
    path: string;
  };
}

export interface ArticleFAQ {
  question: string;
  answer: string;
}

export interface Article {
  slug: string;
  title: string;
  metaDescription: string;
  category: 'Investing' | 'Trading' | 'Mining' | 'Basics' | 'Tax' | 'Market Analysis';
  publishedDate: string;
  updatedDate: string;
  readingTime: number;
  keywords: string[];
  relatedCalculators: string[];
  relatedArticles: string[];
  faqs: ArticleFAQ[];
  sections: ArticleSection[];
  howToSteps: { name: string; text: string }[];
  /**
   * Optional 40–60 word direct answer rendered above the article body and
   * added to Article schema as `abstract`. Powers featured snippets and
   * AI-answer surfacing (Google SGE, Perplexity, ChatGPT search).
   */
  quickAnswer?: string;
  /** Enable SpeakableSpecification schema for voice search (top articles only) */
  speakable?: boolean;
  /**
   * Optional verifiable expert quote rendered inside the article body.
   * Per the April 2026 GEO audit, attributed citations boost AI answer-engine
   * surfacing by ~37%. Quotes MUST link to a public source — never fabricate.
   */
  expertQuote?: {
    quote: string;
    author: string;
    role: string;
    source: string;
    sourceLabel: string;
    /** Section id after which to render the quote. Defaults to the first section. */
    afterSectionId?: string;
  };
}

export const ARTICLE_CATEGORIES = [
  'All',
  'Investing',
  'Trading',
  'Mining',
  'Basics',
  'Tax',
  'Market Analysis',
] as const;

// Lazy import registry
const articleModules: Record<string, () => Promise<{ default: Article }>> = {
  'what-is-bitcoin-dca': () => import('./articles/what-is-bitcoin-dca'),
  'bitcoin-halving-explained': () => import('./articles/bitcoin-halving-explained'),
  'how-to-calculate-bitcoin-profit-loss': () => import('./articles/how-to-calculate-bitcoin-profit-loss'),
  'bitcoin-vs-gold-sp500': () => import('./articles/bitcoin-vs-gold-sp500'),
  'what-is-fear-greed-index': () => import('./articles/what-is-fear-greed-index'),
  'how-to-plan-retirement-with-bitcoin': () => import('./articles/how-to-plan-retirement-with-bitcoin'),
  'bitcoin-mining-profitability-2026': () => import('./articles/bitcoin-mining-profitability-2026'),
  'what-is-a-satoshi': () => import('./articles/what-is-a-satoshi'),
  'bitcoin-tax-guide-capital-gains': () => import('./articles/bitcoin-tax-guide-capital-gains'),
  'dca-vs-lump-sum-bitcoin': () => import('./articles/dca-vs-lump-sum-bitcoin'),
  'how-much-bitcoin-should-i-own': () => import('./articles/how-much-bitcoin-should-i-own'),
  'bitcoin-hodl-strategy-explained': () => import('./articles/bitcoin-hodl-strategy-explained'),
  'bitcoin-transaction-fees-explained': () => import('./articles/bitcoin-transaction-fees-explained'),
  'bitcoin-savings-plan-guide': () => import('./articles/bitcoin-savings-plan-guide'),
  'bitcoin-leverage-trading-risks': () => import('./articles/bitcoin-leverage-trading-risks'),
  'bitcoin-power-law-explained': () => import('./articles/bitcoin-power-law-explained'),
  'bitcoin-on-chain-metrics-guide': () => import('./articles/bitcoin-on-chain-metrics-guide'),
  'bitcoin-staking-guide': () => import('./articles/bitcoin-staking-guide'),
  'bitcoin-sip-guide': () => import('./articles/bitcoin-sip-guide'),
  'bitcoin-pizza-day-history': () => import('./articles/bitcoin-pizza-day-history'),
  'bitcoin-millionaire-calculator-guide': () => import('./articles/bitcoin-millionaire-calculator-guide'),
  'bitcoin-calculation-formulas': () => import('./articles/bitcoin-calculation-formulas'),
  // Phase 4: 10 new articles
  'how-to-calculate-average-buy-price-bitcoin': () => import('./articles/how-to-calculate-average-buy-price-bitcoin'),
  'bitcoin-wealth-distribution': () => import('./articles/bitcoin-wealth-distribution'),
  'bitcoin-vs-real-estate-sp500-gold-comparison': () => import('./articles/bitcoin-vs-real-estate-sp500-gold-comparison'),
  'bitcoin-dominance-explained': () => import('./articles/bitcoin-dominance-explained'),
  'how-to-read-bitcoin-rainbow-chart': () => import('./articles/how-to-read-bitcoin-rainbow-chart'),
  'bitcoin-drawdown-history': () => import('./articles/bitcoin-drawdown-history'),
  'bitcoin-stock-to-flow-model': () => import('./articles/bitcoin-stock-to-flow-model'),
  'bitcoin-fear-greed-index-strategy': () => import('./articles/bitcoin-fear-greed-index-strategy'),
  'bitcoin-etf-guide-ibit-fbtc-arkb': () => import('./articles/bitcoin-etf-guide-ibit-fbtc-arkb'),
  'bitcoin-dca-100-per-month-returns': () => import('./articles/bitcoin-dca-100-per-month-returns'),
  'how-to-calculate-bitcoin-lot-size': () => import('./articles/how-to-calculate-bitcoin-lot-size'),
  'bitcoin-volatility-explained': () => import('./articles/bitcoin-volatility-explained'),
  'zakat-on-bitcoin-guide': () => import('./articles/zakat-on-bitcoin-guide'),
  'cf-benchmarks-brti-explained': () => import('./articles/cf-benchmarks-brti-explained'),
  'bitcoin-calculator-comparison': () => import('./articles/bitcoin-calculator-comparison'),
  'how-much-bitcoin-by-age': () => import('./articles/how-much-bitcoin-by-age'),

  // Turkish articles (Phase C5+). Registered under their TR slug so
  // /tr/ogrenin/<tr-slug> resolves through getArticleBySlug.
  'bitcoin-dca-nedir': () => import('./articles/what-is-bitcoin-dca.tr'),
  'bitcoin-kar-zarar-nasil-hesaplanir': () => import('./articles/how-to-calculate-bitcoin-profit-loss.tr'),
  'bitcoin-yarilanmasi-nedir': () => import('./articles/bitcoin-halving-explained.tr'),
  'bitcoin-madencilik-karliligi-2026': () => import('./articles/bitcoin-mining-profitability-2026.tr'),
  'bitcoin-dominansi-aciklamasi': () => import('./articles/bitcoin-dominance-explained.tr'),
  'bitcoin-hodl-stratejisi-aciklamasi': () => import('./articles/bitcoin-hodl-strategy-explained.tr'),
  'bitcoin-pizza-gunu-tarihi': () => import('./articles/bitcoin-pizza-day-history.tr'),
  'bitcoin-vergi-rehberi-sermaye-kazanci': () => import('./articles/bitcoin-tax-guide-capital-gains.tr'),
  'bitcoin-servet-dagilimi': () => import('./articles/bitcoin-wealth-distribution.tr'),
  'bitcoin-altin-sp500-karsilastirma': () => import('./articles/bitcoin-vs-gold-sp500.tr'),
  'bitcoin-dca-vs-toplu-yatirim': () => import('./articles/dca-vs-lump-sum-bitcoin.tr'),
  'ne-kadar-bitcoin-sahibi-olmaliyim': () => import('./articles/how-much-bitcoin-should-i-own.tr'),
  'korku-acgozluluk-endeksi-nedir': () => import('./articles/what-is-fear-greed-index.tr'),
  'bitcoin-emeklilik-planlama-rehberi': () => import('./articles/how-to-plan-retirement-with-bitcoin.tr'),
  'bitcoin-zekati-rehberi': () => import('./articles/zakat-on-bitcoin-guide.tr'),
  'bitcoin-etf-karsilastirma-ibit-fbtc-arkb': () => import('./articles/bitcoin-etf-guide-ibit-fbtc-arkb.tr'),
  'bitcoin-satoshi-nedir': () => import('./articles/what-is-a-satoshi.tr'),
  'bitcoin-islem-ucretleri-aciklamasi': () => import('./articles/bitcoin-transaction-fees-explained.tr'),
  'bitcoin-tasarruf-plani-rehberi': () => import('./articles/bitcoin-savings-plan-guide.tr'),
  'bitcoin-guc-yasasi-aciklamasi': () => import('./articles/bitcoin-power-law-explained.tr'),
  'bitcoin-staking-rehberi': () => import('./articles/bitcoin-staking-guide.tr'),
  'bitcoin-sip-rehberi': () => import('./articles/bitcoin-sip-guide.tr'),
  'korku-acgozluluk-endeksi-stratejisi': () => import('./articles/bitcoin-fear-greed-index-strategy.tr'),
  'yasa-gore-ne-kadar-bitcoin': () => import('./articles/how-much-bitcoin-by-age.tr'),
  'aylik-100-dolar-bitcoin-dca-getirileri': () => import('./articles/bitcoin-dca-100-per-month-returns.tr'),
  'bitcoin-milyoner-hesaplayici-rehberi': () => import('./articles/bitcoin-millionaire-calculator-guide.tr'),
  'bitcoin-ortalama-alis-fiyati-nasil-hesaplanir': () => import('./articles/how-to-calculate-average-buy-price-bitcoin.tr'),
  'bitcoin-kaldirac-ticareti-riskleri': () => import('./articles/bitcoin-leverage-trading-risks.tr'),
  'bitcoin-lot-buyuklugu-nasil-hesaplanir': () => import('./articles/how-to-calculate-bitcoin-lot-size.tr'),
  'bitcoin-gokkusagi-grafigi-nasil-okunur': () => import('./articles/how-to-read-bitcoin-rainbow-chart.tr'),
  'bitcoin-dusus-tarihi': () => import('./articles/bitcoin-drawdown-history.tr'),
  'bitcoin-stok-akis-modeli': () => import('./articles/bitcoin-stock-to-flow-model.tr'),
  'bitcoin-zincir-uzeri-metrikler-rehberi': () => import('./articles/bitcoin-on-chain-metrics-guide.tr'),
  'bitcoin-gayrimenkul-sp500-altin-karsilastirma': () => import('./articles/bitcoin-vs-real-estate-sp500-gold-comparison.tr'),
  'bitcoin-volatilitesi-aciklamasi': () => import('./articles/bitcoin-volatility-explained.tr'),
  'cf-benchmarks-brti-aciklamasi': () => import('./articles/cf-benchmarks-brti-explained.tr'),
  'bitcoin-hesaplama-formulleri': () => import('./articles/bitcoin-calculation-formulas.tr'),
  'bitcoin-hesaplayici-karsilastirma': () => import('./articles/bitcoin-calculator-comparison.tr'),
};

// Metadata for the hub page (no need to load full article content)
export interface ArticleMeta {
  slug: string;
  title: string;
  metaDescription: string;
  category: Article['category'];
  publishedDate: string;
  updatedDate: string;
  readingTime: number;
  keywords: string[];
  /** Article language. Defaults to 'en' when omitted. */
  language?: 'en' | 'tr';
}

export const articlesMeta: ArticleMeta[] = [
  { slug: 'what-is-bitcoin-dca', title: 'Bitcoin DCA Explained: What It Is & How It Works', metaDescription: 'Learn how Bitcoin DCA works, why fixed recurring buys reduce timing risk, and how to build a simple dollar-cost averaging plan.', category: 'Investing', publishedDate: '2026-01-15', updatedDate: '2026-02-10', readingTime: 8, keywords: ['bitcoin dca', 'dollar cost averaging bitcoin', 'dca strategy'] },
  { slug: 'bitcoin-halving-explained', title: 'Bitcoin Halving Explained: Impact on Price & Supply', metaDescription: 'Bitcoin halving cuts new BTC supply every ~4 years. The 2020 halving was followed by a 560% rally. Learn how it works and when the next one happens.', category: 'Basics', publishedDate: '2026-01-18', updatedDate: '2026-02-10', readingTime: 7, keywords: ['bitcoin halving', 'halving explained', 'bitcoin halving 2028'] },
  { slug: 'how-to-calculate-bitcoin-profit-loss', title: 'How to Calculate Bitcoin Profit & Loss (Formula + Free Tool)', metaDescription: 'Bitcoin P&L formula: (sell price − buy price) × BTC amount − fees. Calculate realized gains, unrealized profit, ROI, and tax liability with our free calculator.', category: 'Trading', publishedDate: '2026-01-20', updatedDate: '2026-02-10', readingTime: 6, keywords: ['bitcoin profit calculator', 'bitcoin profit and loss', 'crypto p&l'] },
  { slug: 'bitcoin-vs-gold-sp500', title: 'Bitcoin vs Gold vs S&P 500: 10-Year Return Comparison', metaDescription: 'Who wins — Bitcoin, Gold, or the S&P 500? Compare 10-year CAGR, volatility, drawdowns, and Sharpe Ratios with real data and a free comparison calculator.', category: 'Market Analysis', publishedDate: '2026-01-22', updatedDate: '2026-02-18', readingTime: 9, keywords: ['bitcoin vs gold', 'bitcoin vs s&p 500', 'bitcoin comparison', 'bitcoin cagr'] },
  { slug: 'what-is-fear-greed-index', title: 'Bitcoin Fear and Greed Index: What It Is & How It Works', metaDescription: 'The Bitcoin Fear & Greed Index scores sentiment 0 (Extreme Fear) to 100 (Extreme Greed). Learn what drives the score and how traders use it to time entries.', category: 'Market Analysis', publishedDate: '2026-01-25', updatedDate: '2026-02-10', readingTime: 6, keywords: ['fear and greed index', 'bitcoin sentiment', 'crypto fear greed'] },
  { slug: 'how-to-plan-retirement-with-bitcoin', title: 'Bitcoin Retirement Planning: Strategies & Allocation Guide', metaDescription: "Fidelity's research: a 2% Bitcoin allocation increases retirement income by 1–4%. Learn BTC allocation strategies, Crypto IRA options, and withdrawal planning.", category: 'Investing', publishedDate: '2026-01-28', updatedDate: '2026-02-10', readingTime: 10, keywords: ['bitcoin retirement', 'retire with bitcoin', 'bitcoin retirement calculator'] },
  { slug: 'bitcoin-mining-profitability-2026', title: 'Is Bitcoin Mining Profitable in 2026? ROI & Breakeven Guide', metaDescription: 'Bitcoin mining is profitable in 2026 only below $0.10/kWh with efficient ASICs. The 2024 halving cut rewards to 3.125 BTC. Calculate your exact breakeven free.', category: 'Mining', publishedDate: '2026-02-01', updatedDate: '2026-02-10', readingTime: 8, keywords: ['bitcoin mining profitability', 'mining calculator', 'is mining profitable'] },
  { slug: 'what-is-a-satoshi', title: "What Is a Satoshi? Bitcoin's Smallest Unit Explained", metaDescription: "A Satoshi (sat) is 0.00000001 BTC — Bitcoin's smallest unit. Learn how BTC, mBTC, bits, and sats compare, with exact conversion examples and a free tool.", category: 'Basics', publishedDate: '2026-02-03', updatedDate: '2026-02-10', readingTime: 5, keywords: ['what is a satoshi', 'satoshi to usd', 'bitcoin units'] },
  { slug: 'bitcoin-tax-guide-capital-gains', title: 'Bitcoin Capital Gains Tax: Rates, Filing & Calculation', metaDescription: 'How is Bitcoin taxed? Learn short-term vs long-term capital gains rates, FIFO vs LIFO cost basis, and how to calculate your crypto tax bill. Free tool.', category: 'Tax', publishedDate: '2026-02-05', updatedDate: '2026-02-10', readingTime: 9, keywords: ['bitcoin tax', 'crypto capital gains', 'bitcoin tax calculator'] },
  { slug: 'dca-vs-lump-sum-bitcoin', title: 'Bitcoin DCA vs Lump Sum: Which Strategy Wins? (With Data)', metaDescription: 'Compare Bitcoin DCA vs lump sum investing with historical data, risk tradeoffs, and examples using real BTC market cycles.', category: 'Investing', publishedDate: '2026-02-07', updatedDate: '2026-02-10', readingTime: 8, keywords: ['dca vs lump sum', 'dollar cost averaging vs lump sum', 'bitcoin investment strategy'] },
  { slug: 'how-much-bitcoin-should-i-own', title: 'How Much Bitcoin Should You Own in 2026?', metaDescription: 'Most experts suggest 1–5% Bitcoin in a diversified portfolio. Find the right allocation for your income, risk tolerance, and goals with our free calculator.', category: 'Investing', publishedDate: '2026-02-08', updatedDate: '2026-02-10', readingTime: 7, keywords: ['how much bitcoin should i own', 'how much bitcoin to buy', 'bitcoin allocation'] },
  { slug: 'bitcoin-hodl-strategy-explained', title: 'Bitcoin HODL Strategy: Why HODLers Outperform Traders', metaDescription: 'HODL means holding Bitcoin through dips instead of trading. HODLers have historically outperformed traders. Build your HODL strategy with our free calculator.', category: 'Trading', publishedDate: '2026-02-08', updatedDate: '2026-02-10', readingTime: 7, keywords: ['hodl meaning', 'bitcoin hodl strategy', 'hodl bitcoin'] },
  { slug: 'bitcoin-transaction-fees-explained', title: 'Bitcoin Transaction Fees Explained: How to Pay Less', metaDescription: 'Bitcoin fees are set by network congestion and byte size. SegWit cuts fees by up to 40%. Transacting on weekends costs less. Estimate your fee free.', category: 'Basics', publishedDate: '2026-02-09', updatedDate: '2026-02-10', readingTime: 6, keywords: ['bitcoin transaction fees', 'btc fees', 'bitcoin fees how much'] },
  { slug: 'bitcoin-savings-plan-guide', title: 'Bitcoin Savings Plan: Build Your BTC Stack Step by Step', metaDescription: 'Build a Bitcoin savings plan: set monthly buy amounts, automate purchases, choose the right platform, and track your stack over time. Free savings calculator.', category: 'Investing', publishedDate: '2026-02-09', updatedDate: '2026-02-10', readingTime: 8, keywords: ['bitcoin savings plan', 'save in bitcoin', 'bitcoin savings account'] },
  { slug: 'bitcoin-leverage-trading-risks', title: 'Bitcoin Leverage Trading: Why 95% of Traders Lose Money', metaDescription: 'In October 2025, $19B in Bitcoin leverage positions were liquidated in 24 hours. A 10x position needs just a 10% drop to lose everything. Know how it works.', category: 'Trading', publishedDate: '2026-02-09', updatedDate: '2026-02-10', readingTime: 7, keywords: ['bitcoin leverage trading', 'bitcoin margin trading', 'bitcoin liquidation'] },
  { slug: 'bitcoin-power-law-explained', title: 'Bitcoin Power Law Explained: Price Model & Fair Value Bands', metaDescription: "Physicist Giovanni Santostasi's Bitcoin Power Law uses log-log regression to model price. Learn the fair value bands and how to spot buy and sell zones free.", category: 'Market Analysis', publishedDate: '2026-02-18', updatedDate: '2026-02-18', readingTime: 9, keywords: ['bitcoin power law', 'bitcoin power law calculator', 'bitcoin price prediction', 'giovanni santostasi bitcoin'] },
  { slug: 'bitcoin-on-chain-metrics-guide', title: 'Bitcoin On-Chain Metrics Guide: MVRV, SOPR & NVT (2026)', metaDescription: 'MVRV above 3.7 = overvalued. Below 1 = historically strong buy zone. Learn MVRV, SOPR, NVT, and hash rate to read Bitcoin market cycle tops and bottoms.', category: 'Market Analysis', publishedDate: '2026-02-20', updatedDate: '2026-02-20', readingTime: 10, keywords: ['bitcoin on-chain metrics', 'bitcoin MVRV ratio', 'bitcoin stock to flow', 'bitcoin hash rate', 'bitcoin active addresses', 'bitcoin cycle indicator 2026'] },
  { slug: 'bitcoin-staking-guide', title: 'Bitcoin Staking Guide 2026: How to Earn Yield on Your BTC', metaDescription: 'Can you stake Bitcoin? Yes — via Babylon Protocol, Lido wBTC, and Binance Earn. Compare real APYs, lock-up periods, risks, and compounding strategies for 2026.', category: 'Investing', publishedDate: '2026-02-20', updatedDate: '2026-02-20', readingTime: 10, keywords: ['bitcoin staking', 'bitcoin yield', 'babylon protocol staking', 'lido wbtc staking', 'binance earn bitcoin', 'bitcoin APY 2026', 'bitcoin staking calculator'] },
  { slug: 'bitcoin-sip-guide', title: 'Bitcoin SIP (Systematic Investment Plan) Guide 2026', metaDescription: 'A Bitcoin SIP buys fixed coin amounts at intervals — unlike DCA which invests fixed fiat. Compare SIP vs DCA, choose your frequency, and project returns free.', category: 'Investing', publishedDate: '2026-03-02', updatedDate: '2026-03-02', readingTime: 9, keywords: ['bitcoin sip', 'bitcoin systematic investment plan', 'crypto sip calculator', 'bitcoin sip vs dca'] },
  { slug: 'bitcoin-pizza-day-history', title: 'Bitcoin Pizza Day: The Story of 10,000 BTC and Two Pizzas', metaDescription: "On May 22, 2010, Laszlo Hanyecz paid 10,000 BTC (worth $1B+ today) for two Papa John's pizzas — Bitcoin's first real-world purchase. The full story.", category: 'Basics', publishedDate: '2026-03-02', updatedDate: '2026-03-02', readingTime: 9, keywords: ['bitcoin pizza day', 'bitcoin pizza day history', '10000 btc pizza', 'laszlo hanyecz pizza'] },
  { slug: 'bitcoin-millionaire-calculator-guide', title: 'How Much Bitcoin Do You Need to Become a Millionaire?', metaDescription: 'See how much BTC you need to reach $1M at future Bitcoin prices, with examples for $250K, $500K, and $1M targets.', category: 'Investing', publishedDate: '2026-03-03', updatedDate: '2026-03-03', readingTime: 10, keywords: ['how much bitcoin to be a millionaire', 'how much bitcoin to become a millionaire', 'how many bitcoin do i need', 'bitcoin millionaire target'] },
  { slug: 'bitcoin-calculation-formulas', title: 'Bitcoin Calculation Formulas: The Math Behind Every Tool', metaDescription: 'Exact formulas behind Bitcoin profit, DCA, mining ROI, Power Law, tax, and CAGR — with step-by-step worked examples for every calculator on this site.', category: 'Basics', publishedDate: '2026-03-07', updatedDate: '2026-03-07', readingTime: 10, keywords: ['bitcoin calculation formula', 'what is bitcoin calculator', 'crypto calculator', 'bitcoin converter to usd'] },
  // Phase 4: 10 new articles
  { slug: 'how-to-calculate-average-buy-price-bitcoin', title: 'How to Calculate Your Bitcoin Average Buy Price', metaDescription: 'FIFO is the IRS default for Bitcoin cost basis. Since Jan 2025, per-wallet tracking is required. Learn FIFO, LIFO, HIFO, and weighted average methods free.', category: 'Investing', publishedDate: '2026-03-09', updatedDate: '2026-03-09', readingTime: 8, keywords: ['bitcoin average buy price', 'bitcoin cost basis calculator', 'weighted average price bitcoin'] },
  { slug: 'bitcoin-wealth-distribution', title: 'Bitcoin Wealth Distribution: Where Do You Rank Globally?', metaDescription: '0.03% of Bitcoin addresses hold 100+ BTC — but control 60%+ of the supply. See how whales, ETFs, and corporates compare, and find where you rank globally.', category: 'Market Analysis', publishedDate: '2026-03-09', updatedDate: '2026-03-09', readingTime: 9, keywords: ['bitcoin wealth distribution', 'who owns the most bitcoin', 'bitcoin whale wallets'] },
  { slug: 'bitcoin-vs-real-estate-sp500-gold-comparison', title: 'Bitcoin vs Real Estate, S&P 500 & Gold: Full Comparison', metaDescription: "Bitcoin's 10-year CAGR is ~72% vs real estate's 5–7% and S&P 500's 14%. Compare returns, Sharpe Ratio, liquidity, and inflation hedge with our free tool.", category: 'Market Analysis', publishedDate: '2026-03-09', updatedDate: '2026-03-09', readingTime: 11, keywords: ['bitcoin vs real estate', 'bitcoin vs gold vs stocks', 'bitcoin vs s&p 500 returns'] },
  { slug: 'bitcoin-dominance-explained', title: 'Bitcoin Dominance Explained: BTC.D & Altcoin Season', metaDescription: "BTC.D = Bitcoin's market cap ÷ total crypto market cap × 100. A fall below 60% has historically signaled altcoin season. Learn what it means and how to use it.", category: 'Market Analysis', publishedDate: '2026-03-09', updatedDate: '2026-03-09', readingTime: 8, keywords: ['bitcoin dominance', 'BTC.D', 'bitcoin dominance chart', 'altcoin season indicator'] },
  { slug: 'how-to-read-bitcoin-rainbow-chart', title: 'How to Read the Bitcoin Rainbow Chart and Its 9 Bands', metaDescription: 'Learn what each Bitcoin Rainbow Chart band means, from Fire Sale to Bubble Territory, and how to interpret long-term valuation signals.', category: 'Market Analysis', publishedDate: '2026-03-09', updatedDate: '2026-03-09', readingTime: 7, keywords: ['how to read bitcoin rainbow chart', 'bitcoin rainbow chart explained', 'bitcoin rainbow bands'] },
  { slug: 'bitcoin-drawdown-history', title: 'Bitcoin Drawdown History: Every Major Crash & Recovery', metaDescription: 'Bitcoin has crashed 80%+ four times and recovered every time. The 3 biggest took ~3 years to recover. Every crash, cause, and timeline from 2011 to 2025.', category: 'Market Analysis', publishedDate: '2026-03-09', updatedDate: '2026-03-09', readingTime: 10, keywords: ['bitcoin drawdown history', 'bitcoin crash history', 'bitcoin biggest crashes'] },
  { slug: 'bitcoin-stock-to-flow-model', title: 'Bitcoin Stock-to-Flow (S2F) Model: How It Works & Its Limits', metaDescription: 'The S2F model predicted Bitcoin accurately from 2015–2021, then failed in 2022 when BTC should have hit $100K but crashed. Learn the formula and its limits.', category: 'Market Analysis', publishedDate: '2026-03-09', updatedDate: '2026-03-09', readingTime: 9, keywords: ['bitcoin stock to flow', 'bitcoin S2F model', 'PlanB bitcoin model'] },
  { slug: 'bitcoin-fear-greed-index-strategy', title: 'Bitcoin Fear & Greed Strategy: Buy Fear, Sell Greed', metaDescription: 'Buying BTC at Fear & Greed ≤20 returned 1,145% vs 1,046% for buy-and-hold. Learn the contrarian entry rules, DCA triggers, and track the index free.', category: 'Investing', publishedDate: '2026-03-09', updatedDate: '2026-03-09', readingTime: 9, keywords: ['bitcoin fear and greed index strategy', 'bitcoin fear greed timing', 'contrarian bitcoin investing'] },
  { slug: 'bitcoin-etf-guide-ibit-fbtc-arkb', title: 'Bitcoin ETF Comparison 2026: IBIT vs FBTC vs ARKB', metaDescription: 'IBIT: $70B+ AUM, 0.25% fee. FBTC: $17.7B, 0.25%. ARKB: 0.21% lowest fee. Compare all spot Bitcoin ETFs by custody, IRA eligibility, and expense ratio.', category: 'Investing', publishedDate: '2026-03-09', updatedDate: '2026-03-09', readingTime: 10, keywords: ['bitcoin ETF comparison', 'IBIT vs FBTC', 'best bitcoin ETF', 'bitcoin ETF fees'] },
  { slug: 'bitcoin-dca-100-per-month-returns', title: '$100/Month Bitcoin DCA: Exact Returns Since 2013', metaDescription: 'What if you invested $100/month in Bitcoin since 2013? Real ROI tables for every starting year from 2013–2024. Year-by-year data, no estimates.', category: 'Investing', publishedDate: '2026-03-09', updatedDate: '2026-03-09', readingTime: 10, keywords: ['$100 per month bitcoin', 'bitcoin DCA returns', 'bitcoin DCA every year'] },
  { slug: 'how-to-calculate-bitcoin-lot-size', title: 'How to Calculate Bitcoin Lot Size for Forex & Futures', metaDescription: '1 standard Bitcoin lot = 1 BTC. Formula: Risk ÷ Stop Loss in ticks. Learn standard, mini, micro lot specs, broker differences, and sizing mistakes free.', category: 'Trading', publishedDate: '2026-03-11', updatedDate: '2026-03-11', readingTime: 9, keywords: ['bitcoin lot size calculator', 'btc lot size', 'bitcoin position size', 'crypto lot size'] },
  { slug: 'bitcoin-volatility-explained', title: 'Bitcoin Volatility Explained: How to Measure & Use It', metaDescription: "Divide DVOL by 20 = Bitcoin's expected daily move. DVOL hit 90% in Feb 2026 — a bottom signal. Learn realized vs implied volatility and how traders use it.", category: 'Market Analysis', publishedDate: '2026-03-12', updatedDate: '2026-03-12', readingTime: 10, keywords: ['bitcoin volatility', 'bitcoin volatility explained', 'btc volatility calculator', 'DVOL', 'BVX'] },
  { slug: 'zakat-on-bitcoin-guide', title: 'Zakat on Bitcoin 2026: Nisab, Hawl & 2.5% Calculation', metaDescription: "Bitcoin is Maal (wealth) under leading Shariah rulings — Zakat is 2.5% of total value after Hawl. Most scholars use the Silver Nisab. Calculate yours free.", category: 'Investing', publishedDate: '2026-03-13', updatedDate: '2026-03-13', readingTime: 10, keywords: ['bitcoin zakat', 'zakat on bitcoin', 'crypto zakat calculator', 'bitcoin zakat calculator PKR', 'zakat on gold calculator'] },
  { slug: 'cf-benchmarks-brti-explained', title: 'CF Benchmarks BRTI: Bitcoin Reference Rate for CME Futures', metaDescription: 'Learn how CF Benchmarks BRTI prices CME Bitcoin futures in real time, how it is built, and why it can differ from spot BTC prices.', category: 'Market Analysis', publishedDate: '2026-03-16', updatedDate: '2026-03-16', readingTime: 9, keywords: ['CF Benchmarks BRTI', 'Bitcoin Real-Time Index', 'CME Bitcoin futures', 'Bitcoin reference rate'] },
  { slug: 'bitcoin-calculator-comparison', title: 'Best Bitcoin Calculators Compared: 2026 Tool Roundup', metaDescription: 'Honest comparison of bitcoincalculator.tools vs Binance, Coinbase, and Kraken. Which is best for DCA, P&L, and tax in 2026? Feature-by-feature breakdown. Free.', category: 'Market Analysis', publishedDate: '2026-03-17', updatedDate: '2026-03-17', readingTime: 8, keywords: ['bitcoin calculator comparison', 'best bitcoin calculator', 'binance calculator', 'coinbase calculator'] },
  { slug: 'how-much-bitcoin-by-age', title: 'How Much Bitcoin Should You Have by Age? (2026 Benchmarks)', metaDescription: 'See Bitcoin targets by age from 18-65, grade your BTC stack, and plan a DCA catch-up using the Lifecycle Accumulation Model.', category: 'Investing', publishedDate: '2026-04-10', updatedDate: '2026-04-10', readingTime: 11, keywords: ['how much bitcoin by age', 'bitcoin accumulation target', 'bitcoin benchmark by age', 'bitcoin accumulation score'] },

  // ── Turkish articles ─────────────────────────────────────────────
  { slug: 'bitcoin-dca-nedir', language: 'tr', title: 'Bitcoin DCA Nedir? Dolar Maliyet Ortalaması Stratejisi Açıklandı', metaDescription: 'Bitcoin DCA stratejisinin nasıl çalıştığını öğrenin. Sabit aralıklarla yapılan alımların volatilite riskini nasıl azalttığını ve basit bir DCA planının nasıl kurulduğunu adım adım anlatıyoruz.', category: 'Investing', publishedDate: '2026-01-15', updatedDate: '2026-05-16', readingTime: 8, keywords: ['bitcoin dca', 'bitcoin dca nedir', 'dolar maliyet ortalaması', 'dca stratejisi', 'bitcoin yatırım'] },
  { slug: 'bitcoin-kar-zarar-nasil-hesaplanir', language: 'tr', title: 'Bitcoin Kâr/Zarar Nasıl Hesaplanır? (Formül + Ücretsiz Araç)', metaDescription: 'Bitcoin kâr/zarar formülü: (satış fiyatı − alış fiyatı) × BTC miktarı − komisyonlar. Gerçekleşmiş kazanç, gerçekleşmemiş kâr, ROI ve vergi yükümlülüğünü ücretsiz hesaplayıcımızla bulun.', category: 'Trading', publishedDate: '2026-01-20', updatedDate: '2026-05-18', readingTime: 6, keywords: ['bitcoin kâr hesaplama', 'bitcoin kar zarar', 'bitcoin roi', 'kripto roi', 'bitcoin maliyet bazı'] },
  { slug: 'bitcoin-yarilanmasi-nedir', language: 'tr', title: 'Bitcoin Yarılanması Nedir? Fiyat ve Arza Etkisi', metaDescription: 'Bitcoin yarılanması yaklaşık 4 yılda bir yeni BTC arzını yarıya indirir. 2020 yarılanmasının ardından %560\'lık ralli yaşandı. Nasıl çalıştığını ve bir sonrakinin ne zaman olacağını öğrenin.', category: 'Basics', publishedDate: '2026-01-18', updatedDate: '2026-05-18', readingTime: 7, keywords: ['bitcoin yarılanması', 'bitcoin halving nedir', 'bitcoin yarılanma 2028', 'blok ödülü', 'bitcoin arzı'] },
  { slug: 'bitcoin-madencilik-karliligi-2026', language: 'tr', title: 'Bitcoin Madenciliği 2026\'da Kârlı mı? ROI ve Başabaş Rehberi', metaDescription: 'Bitcoin madenciliği 2026\'da yalnızca verimli ASIC\'lerle 0,10$/kWh\'in altında kârlıdır. 2024 yarılanması ödülleri 3,125 BTC\'ye düşürdü. Başabaş noktanızı ücretsiz hesaplayın.', category: 'Mining', publishedDate: '2026-02-01', updatedDate: '2026-05-18', readingTime: 8, keywords: ['bitcoin madencilik kârlılığı', 'bitcoin madencilik hesaplayıcı', 'madencilik kârlı mı', 'bitcoin madencilik 2026', 'asic madenci'] },
  { slug: 'bitcoin-dominansi-aciklamasi', language: 'tr', title: 'Bitcoin Dominansı Açıklandı: BTC.D ve Altcoin Sezonu', metaDescription: 'BTC.D = Bitcoin\'in piyasa değeri ÷ toplam kripto piyasa değeri × 100. %60\'ın altına düşüşler tarihsel olarak altcoin sezonunun habercisi olmuştur. Anlamını ve nasıl kullanılacağını öğrenin.', category: 'Market Analysis', publishedDate: '2026-03-09', updatedDate: '2026-05-18', readingTime: 8, keywords: ['bitcoin dominansı', 'BTC.D', 'bitcoin dominans grafiği', 'altcoin sezonu göstergesi', 'kripto pazar payı'] },
  { slug: 'bitcoin-hodl-stratejisi-aciklamasi', language: 'tr', title: 'Bitcoin HODL Stratejisi: HODLer\'lar Trader\'ları Neden Yener?', metaDescription: 'HODL, Bitcoin\'i düşüşlerde satmak yerine tutmak demektir. HODLer\'lar tarihsel olarak trader\'lardan daha iyi performans göstermiştir. Ücretsiz hesaplayıcımızla HODL stratejinizi kurun.', category: 'Trading', publishedDate: '2026-02-08', updatedDate: '2026-05-18', readingTime: 7, keywords: ['hodl ne demek', 'bitcoin hodl stratejisi', 'bitcoin uzun vadeli', 'bitcoin tutma stratejisi'] },
  { slug: 'bitcoin-pizza-gunu-tarihi', language: 'tr', title: 'Bitcoin Pizza Günü: 10.000 BTC ve İki Pizzanın Hikâyesi', metaDescription: '22 Mayıs 2010\'da Laszlo Hanyecz iki Papa John\'s pizzası için 10.000 BTC (bugün 1 milyar $+ değerinde) ödedi — Bitcoin\'in gerçek dünyadaki ilk alımı. Tüm hikâye.', category: 'Basics', publishedDate: '2026-03-02', updatedDate: '2026-05-18', readingTime: 9, keywords: ['bitcoin pizza günü', 'bitcoin pizza tarihi', '10000 btc pizza', 'laszlo hanyecz'] },
  { slug: 'bitcoin-vergi-rehberi-sermaye-kazanci', language: 'tr', title: 'Bitcoin Sermaye Kazancı Vergisi: Oranlar, Beyan ve Hesaplama', metaDescription: 'Bitcoin nasıl vergilendirilir? Kısa vadeli vs uzun vadeli sermaye kazancı oranlarını, FIFO vs LIFO maliyet bazını ve kripto vergi faturanızı nasıl hesaplayacağınızı öğrenin. Ücretsiz araç.', category: 'Tax', publishedDate: '2026-02-05', updatedDate: '2026-05-18', readingTime: 9, keywords: ['bitcoin vergisi', 'kripto sermaye kazancı', 'bitcoin vergi hesaplayıcı', 'kripto vergileri'] },
  { slug: 'bitcoin-servet-dagilimi', language: 'tr', title: 'Bitcoin Servet Dağılımı: Küresel Sıralamada Neredesiniz?', metaDescription: 'Bitcoin adreslerinin %0,03\'ü 100+ BTC tutar — ama arzın %60+\'sını kontrol eder. Balinaları, ETF\'leri ve kurumsalları karşılaştırın ve küresel sıralamadaki yerinizi bulun.', category: 'Market Analysis', publishedDate: '2026-03-09', updatedDate: '2026-05-18', readingTime: 9, keywords: ['bitcoin servet dağılımı', 'bitcoin balina cüzdanları', 'bitcoin zenginler listesi', 'bitcoin sahiplik istatistikleri'] },
  { slug: 'bitcoin-altin-sp500-karsilastirma', language: 'tr', title: 'Bitcoin vs Altın vs S&P 500: 10 Yıllık Getiri Karşılaştırması', metaDescription: 'Kim kazandı — Bitcoin, Altın, yoksa S&P 500? 10 yıllık CAGR, oynaklık, düşüşler ve Sharpe oranlarını gerçek veri ve ücretsiz karşılaştırma hesaplayıcısıyla karşılaştırın.', category: 'Market Analysis', publishedDate: '2026-01-22', updatedDate: '2026-05-18', readingTime: 9, keywords: ['bitcoin vs altın', 'bitcoin vs s&p 500', 'bitcoin karşılaştırma', 'bitcoin cagr'] },
  { slug: 'bitcoin-dca-vs-toplu-yatirim', language: 'tr', title: 'Bitcoin DCA vs Toplu Yatırım: Hangisi Kazanıyor? (Verilerle)', metaDescription: 'Bitcoin DCA ile toplu (lump sum) yatırımı tarihsel veriler, risk dengeleri ve gerçek BTC piyasa döngülerinden örneklerle karşılaştırın.', category: 'Investing', publishedDate: '2026-02-07', updatedDate: '2026-05-18', readingTime: 8, keywords: ['dca vs toplu yatırım', 'lump sum bitcoin', 'bitcoin yatırım stratejisi', 'bitcoin dca karşılaştırma'] },
  { slug: 'ne-kadar-bitcoin-sahibi-olmaliyim', language: 'tr', title: '2026\'da Ne Kadar Bitcoin Sahibi Olmalısınız?', metaDescription: 'Uzmanların çoğu çeşitlendirilmiş bir portföyde %1–5 Bitcoin önerir. Geliriniz, risk toleransınız ve hedeflerinize göre doğru tahsisi ücretsiz hesaplayıcımızla bulun.', category: 'Investing', publishedDate: '2026-02-08', updatedDate: '2026-05-18', readingTime: 7, keywords: ['ne kadar bitcoin almalıyım', 'bitcoin tahsisi', 'bitcoin portföy yüzdesi', 'ne kadar btc'] },
  { slug: 'korku-acgozluluk-endeksi-nedir', language: 'tr', title: 'Bitcoin Korku ve Açgözlülük Endeksi: Nedir ve Nasıl Çalışır?', metaDescription: 'Bitcoin Korku ve Açgözlülük Endeksi piyasa duyarlılığını 0 (Aşırı Korku) ile 100 (Aşırı Açgözlülük) arasında ölçer. Skorun nasıl hesaplandığını ve trader\'ların nasıl kullandığını öğrenin.', category: 'Market Analysis', publishedDate: '2026-01-25', updatedDate: '2026-05-18', readingTime: 6, keywords: ['korku ve açgözlülük endeksi', 'bitcoin duyarlılık', 'kripto korku açgözlülük', 'piyasa duyarlılık göstergesi'] },
  { slug: 'bitcoin-emeklilik-planlama-rehberi', language: 'tr', title: 'Bitcoin ile Emeklilik Planlaması: Stratejiler ve Tahsis Rehberi', metaDescription: 'Fidelity araştırması: %2\'lik Bitcoin tahsisi emeklilik gelirini %1–4 artırıyor. BTC tahsis stratejilerini, Kripto IRA seçeneklerini ve para çekme planlamasını öğrenin.', category: 'Investing', publishedDate: '2026-01-28', updatedDate: '2026-05-18', readingTime: 10, keywords: ['bitcoin emeklilik', 'bitcoin ile emeklilik', 'bitcoin emeklilik hesaplayıcı', 'bitcoin emeklilik planı'] },
  { slug: 'bitcoin-zekati-rehberi', language: 'tr', title: 'Bitcoin Zekâtı 2026: Nisap, Havl ve %2,5 Hesaplama', metaDescription: 'Bitcoin önde gelen Şer\'i görüşlere göre Mal\'dır — Havl sonrası toplam değerin %2,5\'i Zekât olarak verilir. Çoğu âlim Gümüş Nisabı esas alır. Ücretsiz hesaplayın.', category: 'Investing', publishedDate: '2026-03-13', updatedDate: '2026-05-18', readingTime: 10, keywords: ['bitcoin zekâtı', 'bitcoin zekat', 'kripto zekât hesaplayıcı', 'bitcoin nisap', 'bitcoin havl'] },
  { slug: 'bitcoin-etf-karsilastirma-ibit-fbtc-arkb', language: 'tr', title: 'Bitcoin ETF Karşılaştırma 2026: IBIT vs FBTC vs ARKB', metaDescription: 'IBIT: 70 milyar $+ AUM, %0,25 ücret. FBTC: 17,7 milyar $, %0,25. ARKB: %0,21 en düşük ücret. Tüm spot Bitcoin ETF\'lerini saklama, IRA uygunluğu ve gider oranına göre karşılaştırın.', category: 'Investing', publishedDate: '2026-03-09', updatedDate: '2026-05-18', readingTime: 10, keywords: ['bitcoin etf karşılaştırma', 'IBIT vs FBTC', 'en iyi bitcoin etf', 'bitcoin etf ücretleri', 'spot bitcoin etf'] },
  { slug: 'bitcoin-satoshi-nedir', language: 'tr', title: 'Satoshi Nedir? Bitcoin\'in En Küçük Birimi Açıklandı', metaDescription: 'Satoshi (sat) 0,00000001 BTC\'dir — Bitcoin\'in en küçük birimi. BTC, mBTC, bit ve sat karşılaştırmaları, tam dönüşüm örnekleri ve ücretsiz dönüştürücü.', category: 'Basics', publishedDate: '2026-02-03', updatedDate: '2026-05-18', readingTime: 5, keywords: ['satoshi nedir', 'satoshi kaç tl', 'bitcoin birimleri', 'sats', 'sat biriktirme'] },
  { slug: 'bitcoin-islem-ucretleri-aciklamasi', language: 'tr', title: 'Bitcoin İşlem Ücretleri Açıklaması: Nasıl Daha Az Ödenir', metaDescription: 'Bitcoin ücretleri ağ yoğunluğu ve byte boyutuna göre belirlenir. SegWit ücretleri %40\'a kadar azaltır. Hafta sonu işlemleri daha ucuzdur. Ücretinizi ücretsiz tahmin edin.', category: 'Basics', publishedDate: '2026-02-09', updatedDate: '2026-05-18', readingTime: 6, keywords: ['bitcoin işlem ücreti', 'btc komisyon', 'bitcoin ağ ücreti', 'bitcoin komisyon hesaplama'] },
  { slug: 'bitcoin-tasarruf-plani-rehberi', language: 'tr', title: 'Bitcoin Tasarruf Planı: BTC Stoğunuzu Adım Adım Oluşturun', metaDescription: 'Bitcoin tasarruf planı oluşturun: aylık alım miktarı belirleyin, alımları otomatikleştirin, doğru platformu seçin ve stoğunuzu takip edin. Ücretsiz birikim hesaplayıcı.', category: 'Investing', publishedDate: '2026-02-09', updatedDate: '2026-05-18', readingTime: 8, keywords: ['bitcoin tasarruf planı', 'bitcoin biriktirme', 'bitcoin birikim hesabı', 'bitcoin tasarruf stratejisi'] },
  { slug: 'bitcoin-guc-yasasi-aciklamasi', language: 'tr', title: 'Bitcoin Güç Yasası Açıklaması: Fiyat Modeli ve Adil Değer Bantları', metaDescription: 'Fizikçi Giovanni Santostasi\'nin Bitcoin Güç Yasası, fiyatı modellemek için log-log regresyon kullanır. Adil değer bantlarını ve alım-satım bölgelerini ücretsiz öğrenin.', category: 'Market Analysis', publishedDate: '2026-02-18', updatedDate: '2026-05-18', readingTime: 9, keywords: ['bitcoin güç yasası', 'bitcoin power law', 'bitcoin fiyat tahmini', 'giovanni santostasi bitcoin'] },
  { slug: 'bitcoin-staking-rehberi', language: 'tr', title: 'Bitcoin Staking Rehberi 2026: BTC\'nizden Getiri Nasıl Kazanılır', metaDescription: 'Bitcoin stake edilebilir mi? Evet — Babylon Protocol, Lido wBTC ve Binance Earn ile. 2026 için gerçek APY\'leri, kilit sürelerini, riskleri ve bileşik stratejileri karşılaştırın.', category: 'Investing', publishedDate: '2026-02-20', updatedDate: '2026-05-18', readingTime: 10, keywords: ['bitcoin staking', 'bitcoin getiri', 'babylon protocol staking', 'lido wbtc staking', 'binance earn bitcoin'] },
  { slug: 'bitcoin-sip-rehberi', language: 'tr', title: 'Bitcoin SIP (Sistematik Yatırım Planı) Rehberi 2026', metaDescription: 'Bitcoin SIP, aralıklarla sabit coin miktarı satın alır — sabit fiat yatıran DCA\'dan farklı. SIP vs DCA karşılaştırın, sıklığınızı seçin, getirileri ücretsiz projelendirin.', category: 'Investing', publishedDate: '2026-03-02', updatedDate: '2026-05-18', readingTime: 9, keywords: ['bitcoin sip', 'bitcoin sistematik yatırım planı', 'bitcoin sip vs dca', 'bitcoin aylık yatırım'] },
  { slug: 'korku-acgozluluk-endeksi-stratejisi', language: 'tr', title: 'Bitcoin Korku & Açgözlülük Stratejisi: Korkuda Al, Açgözlülükte Sat', metaDescription: 'Korku & Açgözlülük ≤20 iken BTC almak %1.145 getirdi (al-tut için %1.046). Karşıt giriş kurallarını, DCA tetikleyicilerini öğrenin ve endeksi ücretsiz takip edin.', category: 'Investing', publishedDate: '2026-03-09', updatedDate: '2026-05-18', readingTime: 9, keywords: ['bitcoin korku açgözlülük stratejisi', 'bitcoin korku endeksi zamanlama', 'karşıt bitcoin yatırımı'] },
  { slug: 'yasa-gore-ne-kadar-bitcoin', language: 'tr', title: 'Yaşa Göre Ne Kadar Bitcoin Sahibi Olmalısınız? (2026 Karşılaştırmaları)', metaDescription: '18-65 yaş için Bitcoin hedeflerini görün, BTC stoğunuzu derecelendirin ve Yaşam Döngüsü Birikim Modeli ile DCA yakalama planı yapın.', category: 'Investing', publishedDate: '2026-04-10', updatedDate: '2026-05-18', readingTime: 11, keywords: ['yaşa göre ne kadar bitcoin', 'bitcoin birikim hedefi', 'bitcoin birikim skoru', 'bitcoin yaşam döngüsü modeli'] },
  { slug: 'aylik-100-dolar-bitcoin-dca-getirileri', language: 'tr', title: 'Aylık $100 Bitcoin DCA: 2013\'ten Beri Tam Getiriler', metaDescription: '2013\'ten beri Bitcoin\'e ayda $100 yatırsaydınız? 2013-2024 her başlangıç yılı için gerçek ROI tabloları. Yıl-yıl veriler, tahmin yok.', category: 'Investing', publishedDate: '2026-03-09', updatedDate: '2026-05-18', readingTime: 10, keywords: ['ayda 100 dolar bitcoin', 'bitcoin dca getirileri', 'bitcoin aylık yatırım', 'bitcoin dca hesaplayıcı'] },
  { slug: 'bitcoin-milyoner-hesaplayici-rehberi', language: 'tr', title: 'Milyoner Olmak için Ne Kadar Bitcoin Gerekir?', metaDescription: 'Gelecek Bitcoin fiyatlarında $1M\'a ulaşmak için ne kadar BTC gerektiğini görün, $250K, $500K ve $1M hedefleri için örnekler.', category: 'Investing', publishedDate: '2026-03-03', updatedDate: '2026-05-18', readingTime: 10, keywords: ['milyoner olmak için ne kadar bitcoin', 'bitcoin 1 milyon olursa', 'bitcoin milyoner hedefi'] },
  { slug: 'bitcoin-ortalama-alis-fiyati-nasil-hesaplanir', language: 'tr', title: 'Bitcoin Ortalama Alış Fiyatınızı Nasıl Hesaplarsınız', metaDescription: 'FIFO, Bitcoin maliyet temeli için IRS varsayılanıdır. Ocak 2025\'ten beri cüzdan başına takip gereklidir. FIFO, LIFO, HIFO ve ağırlıklı ortalama yöntemlerini ücretsiz öğrenin.', category: 'Investing', publishedDate: '2026-03-09', updatedDate: '2026-05-18', readingTime: 8, keywords: ['bitcoin ortalama alış fiyatı', 'bitcoin maliyet temeli', 'fifo lifo bitcoin', 'bitcoin başabaş fiyatı'] },
  { slug: 'bitcoin-kaldirac-ticareti-riskleri', language: 'tr', title: 'Bitcoin Kaldıraçlı İşlem: Tüccarların %95\'i Neden Para Kaybeder', metaDescription: 'Ekim 2025\'te 24 saatte 19 milyar $ Bitcoin kaldıraçlı pozisyonu tasfiye edildi. 10x pozisyon yalnızca %10\'luk bir düşüşle her şeyi kaybeder. Riskleri öğrenin.', category: 'Trading', publishedDate: '2026-02-09', updatedDate: '2026-05-18', readingTime: 7, keywords: ['bitcoin kaldıraçlı işlem', 'bitcoin marjin ticareti', 'bitcoin tasfiye', 'kripto kaldıraç riskleri'] },
  { slug: 'bitcoin-lot-buyuklugu-nasil-hesaplanir', language: 'tr', title: 'Forex ve Vadeli İşlemler için Bitcoin Lot Büyüklüğü Nasıl Hesaplanır', metaDescription: '1 standart Bitcoin lotu = 1 BTC. Formül: Risk ÷ Tick cinsinden Stop Loss. Standart, mini, mikro lot özellikleri, broker farkları ve sıkça yapılan hataları ücretsiz öğrenin.', category: 'Trading', publishedDate: '2026-03-11', updatedDate: '2026-05-18', readingTime: 9, keywords: ['bitcoin lot büyüklüğü', 'btc lot büyüklüğü', 'bitcoin pozisyon büyüklüğü', 'kripto lot büyüklüğü'] },
  { slug: 'bitcoin-gokkusagi-grafigi-nasil-okunur', language: 'tr', title: 'Bitcoin Gökkuşağı Grafiği ve 9 Bandı Nasıl Okunur', metaDescription: 'Bitcoin Gökkuşağı Grafiği\'ndeki her bandın anlamını — Yangın İndirimi\'nden Balon Bölgesi\'ne — ve uzun vadeli değerleme sinyallerini nasıl yorumlayacağınızı öğrenin.', category: 'Market Analysis', publishedDate: '2026-03-09', updatedDate: '2026-05-18', readingTime: 7, keywords: ['bitcoin gökkuşağı grafiği', 'bitcoin rainbow chart', 'bitcoin gökkuşağı bandları', 'bitcoin değerleme bantları'] },
  { slug: 'bitcoin-dusus-tarihi', language: 'tr', title: 'Bitcoin Düşüş Tarihi: Her Büyük Çöküş ve Toparlanma', metaDescription: 'Bitcoin dört kez %80+ çöktü ve her seferinde toparlandı. En büyük 3\'ü ~3 yılda toparlandı. 2011\'den 2025\'e her çöküş, neden ve zaman çizelgesi.', category: 'Market Analysis', publishedDate: '2026-03-09', updatedDate: '2026-05-18', readingTime: 10, keywords: ['bitcoin düşüş tarihi', 'bitcoin çöküş tarihi', 'bitcoin en büyük çöküşler', 'bitcoin ayı piyasası'] },
  { slug: 'bitcoin-stok-akis-modeli', language: 'tr', title: 'Bitcoin Stok-Akış (S2F) Modeli: Nasıl Çalışır ve Sınırları', metaDescription: 'S2F modeli 2015-2021 arası Bitcoin\'i doğru tahmin etti, sonra 2022\'de BTC 100K $\'a ulaşması gerekirken çöktüğünde başarısız oldu. Formülü ve sınırlarını öğrenin.', category: 'Market Analysis', publishedDate: '2026-03-09', updatedDate: '2026-05-18', readingTime: 9, keywords: ['bitcoin stok akış', 'bitcoin S2F modeli', 'PlanB bitcoin modeli', 'bitcoin kıtlık modeli'] },
  { slug: 'bitcoin-zincir-uzeri-metrikler-rehberi', language: 'tr', title: 'Bitcoin Zincir Üzeri Metrikler Rehberi: MVRV, SOPR ve NVT (2026)', metaDescription: 'MVRV 3,7\'nin üzerinde = aşırı değerli. 1\'in altında = tarihsel olarak güçlü alım bölgesi. Piyasa döngüsü zirvelerini ve diplerini okumak için MVRV, SOPR, NVT ve hash oranını öğrenin.', category: 'Market Analysis', publishedDate: '2026-02-20', updatedDate: '2026-05-18', readingTime: 10, keywords: ['bitcoin zincir üzeri metrikler', 'bitcoin MVRV oranı', 'bitcoin hash oranı', 'bitcoin aktif adresler'] },
  { slug: 'bitcoin-gayrimenkul-sp500-altin-karsilastirma', language: 'tr', title: 'Bitcoin vs Gayrimenkul, S&P 500 ve Altın: Tam Karşılaştırma', metaDescription: 'Bitcoin\'in 10 yıllık CAGR\'ı ~%72 vs gayrimenkul %5-7 ve S&P 500 %14. Getirileri, Sharpe Oranı\'nı, likiditeyi ve enflasyon korumasını ücretsiz aracımızla karşılaştırın.', category: 'Market Analysis', publishedDate: '2026-03-09', updatedDate: '2026-05-18', readingTime: 11, keywords: ['bitcoin vs gayrimenkul', 'bitcoin vs altın vs hisse', 'bitcoin vs s&p 500 getirileri'] },
  { slug: 'bitcoin-volatilitesi-aciklamasi', language: 'tr', title: 'Bitcoin Volatilitesi Açıklaması: Nasıl Ölçülür ve Kullanılır', metaDescription: 'DVOL ÷ 20 = Bitcoin\'in beklenen günlük hareketi. DVOL Şubat 2026\'da %90\'a ulaştı — bir dip sinyali. Gerçekleşmiş ve örtük volatiliteyi öğrenin ve trader\'ların nasıl kullandığını keşfedin.', category: 'Market Analysis', publishedDate: '2026-03-12', updatedDate: '2026-05-18', readingTime: 10, keywords: ['bitcoin volatilitesi', 'bitcoin oynaklığı', 'btc volatilite hesaplayıcı', 'DVOL', 'BVX'] },
  { slug: 'cf-benchmarks-brti-aciklamasi', language: 'tr', title: 'CF Benchmarks BRTI: CME Bitcoin Vadelileri için Referans Oranı', metaDescription: 'CF Benchmarks BRTI\'nin CME Bitcoin vadelilerini gerçek zamanlı nasıl fiyatladığını, nasıl oluşturulduğunu ve spot BTC fiyatlarından neden farklı olabileceğini öğrenin.', category: 'Market Analysis', publishedDate: '2026-03-16', updatedDate: '2026-05-18', readingTime: 9, keywords: ['CF Benchmarks BRTI', 'Bitcoin Gerçek Zamanlı Endeks', 'CME Bitcoin vadeli', 'Bitcoin referans oranı'] },
  { slug: 'bitcoin-hesaplama-formulleri', language: 'tr', title: 'Bitcoin Hesaplama Formülleri: Her Aracın Arkasındaki Matematik', metaDescription: 'Bitcoin kâr, DCA, madencilik ROI, Güç Yasası, vergi ve CAGR\'ın arkasındaki tam formüller — bu sitedeki her hesaplayıcı için adım adım örneklerle.', category: 'Basics', publishedDate: '2026-03-07', updatedDate: '2026-05-18', readingTime: 10, keywords: ['bitcoin hesaplama formülü', 'bitcoin hesaplayıcı nedir', 'kripto hesaplayıcı', 'bitcoin dolar dönüştürücü'] },
  { slug: 'bitcoin-hesaplayici-karsilastirma', language: 'tr', title: 'En İyi Bitcoin Hesaplayıcıları Karşılaştırması: 2026 Araç Listesi', metaDescription: 'bitcoincalculator.tools\'un Binance, Coinbase ve Kraken ile dürüst karşılaştırması. 2026\'da DCA, K&Z ve vergi için hangisi en iyi? Özellik karşılaştırması. Ücretsiz.', category: 'Market Analysis', publishedDate: '2026-03-17', updatedDate: '2026-05-18', readingTime: 8, keywords: ['bitcoin hesaplayıcı karşılaştırma', 'en iyi bitcoin hesaplayıcı', 'binance hesaplayıcı', 'coinbase hesaplayıcı'] },
];

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const loader = articleModules[slug];
  if (!loader) return null;
  try {
    const mod = await loader();
    return mod.default;
  } catch {
    return null;
  }
}

export function getArticleMetaBySlug(slug: string): ArticleMeta | undefined {
  return articlesMeta.find(a => a.slug === slug);
}
