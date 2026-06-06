import { Article } from '../articles';

const article: Article = {
  slug: 'cf-benchmarks-brti-explained',
  title: 'CF Benchmarks BRTI: Bitcoin Reference Rate for CME Futures',
  metaDescription: 'Learn how CF Benchmarks BRTI prices CME Bitcoin futures in real time, how it is built, and why it can differ from spot BTC prices.',
  category: 'Market Analysis',
  publishedDate: '2026-03-16',
  updatedDate: '2026-03-16',
  readingTime: 9,
  keywords: [
    'CF Benchmarks BRTI',
    'Bitcoin Real-Time Index',
    'CME Bitcoin futures',
    'Bitcoin reference rate',
    'BRR',
    'Bitcoin benchmark price',
    'BRTI vs BRR',
    'Bitcoin ETF pricing',
    'bitcoin institutional price'
  ],
  relatedCalculators: ['etf', 'price-target', 'investment'],
  relatedArticles: ['bitcoin-etf-guide-ibit-fbtc-arkb', 'bitcoin-volatility-explained', 'bitcoin-on-chain-metrics-guide'],
  faqs: [
    {
      question: 'What is the CF Benchmarks Bitcoin Real-Time Index (BRTI)?',
      answer: 'BRTI is a regulated, once-per-second Bitcoin price benchmark calculated by CF Benchmarks Ltd using a volume-weighted median across major exchanges including Bitstamp, Coinbase, Gemini, itBit, and Kraken. It is the real-time companion to the CME CF Bitcoin Reference Rate (BRR).'
    },
    {
      question: 'How does BRTI differ from exchange spot prices?',
      answer: 'BRTI aggregates prices across multiple constituent exchanges using a volume-weighted median, making it more resistant to manipulation than any single exchange price. The difference is typically less than 0.1% but can widen during high volatility.'
    },
    {
      question: 'What is the difference between BRTI and BRR?',
      answer: 'BRTI is calculated once per second throughout the trading day — it is the real-time benchmark. BRR (Bitcoin Reference Rate) is calculated once per day at 4:00 PM London time using a 1-hour observation window and is used to settle CME Bitcoin futures at expiry.'
    },
    {
      question: 'Why does BRTI matter for Bitcoin ETF investors?',
      answer: 'Bitcoin ETFs like BlackRock\'s IBIT and Fidelity\'s FBTC reference CME-based pricing derived from BRTI/BRR for NAV calculations. Understanding the benchmark helps investors interpret ETF pricing and any premium/discount to spot prices.'
    }
  ],
  howToSteps: [
    { name: 'Understand BRTI basics', text: 'Learn that BRTI is a once-per-second regulated Bitcoin price benchmark calculated across major exchanges.' },
    { name: 'Review the methodology', text: 'BRTI uses volume-weighted median pricing from Bitstamp, Coinbase, Gemini, itBit, and Kraken.' },
    { name: 'Compare BRTI vs BRR', text: 'BRTI is real-time; BRR is daily at 4 PM London time. CME futures settle against BRR.' },
    { name: 'Apply to your investments', text: 'Use this knowledge to understand ETF NAV calculations, futures basis, and institutional pricing.' }
  ],
  sections: [
    {
      id: 'introduction',
      heading: 'Introduction',
      content: 'The CF Benchmarks Bitcoin Real-Time Index (BRTI) is the most widely referenced Bitcoin price benchmark in institutional finance. It underpins CME Bitcoin futures, options contracts, and is used by ETF providers, index funds, and trading desks worldwide. Understanding how BRTI is calculated helps investors interpret futures pricing, track basis, and understand why the CME price sometimes differs from exchange spot prices.'
    },
    {
      id: 'what-is-brti',
      heading: 'What Is the CF Benchmarks Bitcoin Real-Time Index (BRTI)?',
      content: 'The CF Benchmarks Bitcoin Real-Time Index is a real-time price benchmark for Bitcoin calculated and published by CF Benchmarks Ltd, a UK-based regulated benchmark administrator. BRTI provides a once-per-second Bitcoin price derived from multiple major cryptocurrency exchanges, designed to be manipulation-resistant and compliant with EU Benchmarks Regulation (BMR).\n\nBRTI is the real-time companion to the CME CF Bitcoin Reference Rate (BRR), which is published once daily at 4:00 PM London time and is used to settle CME Bitcoin futures contracts at expiry.'
    },
    {
      id: 'how-calculated',
      heading: 'How Is BRTI Calculated?',
      content: 'BRTI uses a volume-weighted median price methodology across a defined set of constituent exchanges. The calculation follows these steps:\n\n**Step 1 — Data collection:** CF Benchmarks collects real-time trade data from constituent exchanges. As of 2026, constituent exchanges include Bitstamp, Coinbase, Gemini, itBit (Paxos), and Kraken. Only USD-denominated BTC spot trades are included.\n\n**Step 2 — Partition interval:** All trades within a short rolling time window are collected.\n\n**Step 3 — Volume weighting:** Each trade is weighted by its volume. Larger trades have proportionally more influence on the calculated price.\n\n**Step 4 — Median calculation:** A volume-weighted median is calculated rather than a simple average. The median is used instead of mean specifically because it is more resistant to outlier trades or wash trading — a single large anomalous trade cannot move the median as easily as it could move an average.\n\n**Step 5 — Real-time publication:** The resulting price is published once per second, continuously during active trading hours.'
    },
    {
      id: 'differs-from-spot',
      heading: 'How Does BRTI Differ From Exchange Spot Prices?',
      content: 'BRTI will often differ slightly from any individual exchange\'s spot price for several reasons. First, it aggregates prices across multiple exchanges, so it represents a consensus price rather than any single venue\'s price. Second, the volume-weighted median methodology naturally smooths out brief price spikes caused by large individual orders. Third, BRTI only includes trades from its designated constituent exchanges — prices on Binance, OKX, or other non-constituent exchanges are not included in the calculation.\n\nFor most investors, the difference is minor — typically less than 0.1% from major exchange prices. However, during high volatility periods, basis between BRTI and specific exchanges can widen temporarily.'
    },
    {
      id: 'why-it-matters',
      heading: 'Why Does BRTI Matter for Bitcoin Investors?',
      content: 'Understanding BRTI matters for four groups of investors.\n\n**Futures traders:** CME Bitcoin futures are cash-settled against the BRR (the daily version of BRTI), so understanding the methodology helps traders anticipate settlement prices.\n\n**ETF holders:** Bitcoin ETFs like BlackRock\'s IBIT and Fidelity\'s FBTC reference CME-based pricing for NAV calculations.\n\n**Institutional investors:** BRTI is the standard reference price in most institutional Bitcoin OTC trading agreements.\n\n**Arbitrage traders:** Differences between BRTI and exchange spot prices create arbitrage opportunities that professional trading firms exploit continuously.',
      cta: {
        calculatorId: 'etf',
        calculatorName: 'Bitcoin ETF Calculator',
        text: 'Compare ETF performance against direct BTC ownership',
        path: '/calculators/etf'
      }
    },
    {
      id: 'brti-vs-brr',
      heading: 'BRTI vs BRR — What Is the Difference?',
      content: 'CF Benchmarks publishes two related Bitcoin benchmarks.\n\n**BRTI (Bitcoin Real-Time Index)** is calculated and published once per second throughout the trading day — it is the real-time benchmark.\n\n**BRR (Bitcoin Reference Rate)** is calculated once per day at 4:00 PM London time using a 1-hour observation window from 3:00 PM to 4:00 PM London time — it is the daily settlement benchmark used by CME futures.\n\nWhen CME Bitcoin futures expire, the final settlement price is the BRR from that day, not the BRTI. Traders holding futures to expiry need to understand this distinction.'
    },
    {
      id: 'conclusion',
      heading: 'Conclusion',
      content: 'For most retail Bitcoin investors, BRTI is background infrastructure — it operates invisibly behind ETFs, futures, and institutional pricing. Understanding its methodology gives investors confidence that the prices underpinning regulated Bitcoin financial products are calculated using a robust, manipulation-resistant, and regulated process.\n\nUse our [Bitcoin ETF Calculator](/calculators/etf) to compare ETF performance against direct BTC ownership, or use the [Bitcoin Price Target Calculator](/calculators/price-target) to model future price scenarios.'
    }
  ]
};

export default article;
