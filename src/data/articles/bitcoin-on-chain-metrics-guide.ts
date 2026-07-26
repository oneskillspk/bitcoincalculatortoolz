import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-on-chain-metrics-guide',
  title: 'Bitcoin On-Chain Metrics Guide: MVRV, SOPR & NVT (2026)',
  metaDescription: 'MVRV above 3.7 = overvalued. Below 1 = historically strong buy zone. Learn MVRV, SOPR, NVT, and hash rate to read Bitcoin market cycle tops and bottoms.',
  quickAnswer: 'The three on-chain metrics that matter most are MVRV (market cap ÷ realized cap — above 3.5 signals overvaluation, below 1 signals accumulation), SOPR (profit ratio of coins moved — resetting to 1 marks bull-market support), and NVT (network value ÷ daily transaction volume — high NVT warns of price outpacing usage). Together they beat price-only charts for cycle timing.',
  category: 'Market Analysis',
  publishedDate: '2026-02-20',
  updatedDate: '2026-02-20',
  readingTime: 10,
  keywords: [
    'bitcoin on-chain metrics',
    'bitcoin MVRV ratio',
    'bitcoin stock to flow',
    'bitcoin hash rate',
    'bitcoin active addresses',
    'bitcoin cycle indicator 2026',
    'on-chain analysis bitcoin',
  ],
  relatedCalculators: ['on-chain', 'fear-greed-index', 'rainbow-chart', 'power-law'],
  relatedArticles: ['bitcoin-power-law-explained', 'what-is-fear-greed-index', 'bitcoin-hodl-strategy-explained', 'bitcoin-stock-to-flow-model', 'bitcoin-wealth-distribution', 'bitcoin-dominance-explained'],
  faqs: [
    {
      question: 'What is the MVRV ratio in Bitcoin?',
      answer: 'MVRV (Market Value to Realized Value) compares Bitcoin\'s total market capitalization to its "realized cap" — the sum of all BTC valued at the price they last moved on-chain. An MVRV below 1.0 has historically marked cycle bottoms (extreme undervaluation), while MVRV above 3.5 has historically coincided with cycle tops (extreme overvaluation).',
    },
    {
      question: 'What is the Stock-to-Flow model for Bitcoin?',
      answer: 'Stock-to-Flow (S2F) measures Bitcoin\'s scarcity by dividing the total circulating supply ("stock") by the annual new issuance ("flow"). After the 4th halving in April 2024, Bitcoin\'s annual flow fell to approximately 164,250 BTC/year, giving it an S2F ratio above 120 — comparable to gold. PlanB\'s power law formula uses this ratio to project a model price.',
    },
    {
      question: 'What does hash rate tell us about Bitcoin?',
      answer: 'Hash rate measures the total computational power that miners are dedicating to securing the Bitcoin network. A rising hash rate signals that miners are confident in Bitcoin\'s future profitability — they\'re investing in hardware. Sustained high hash rate is a positive indicator of network health and miner confidence. As of 2026, Bitcoin\'s hash rate exceeds 800 EH/s, an all-time high.',
    },
    {
      question: 'What are Bitcoin active addresses?',
      answer: 'Active addresses count the unique Bitcoin wallet addresses that sent or received BTC in a given day. It\'s one of the most reliable proxies for real economic activity on the Bitcoin network. Rising active addresses alongside rising price suggests organic demand — not just speculation. Falling active addresses during a price surge may indicate weaker conviction.',
    },
    {
      question: 'How accurate are on-chain metrics at predicting Bitcoin cycles?',
      answer: 'On-chain metrics are historical pattern tools, not crystal balls. MVRV has correctly identified most major cycle tops and bottoms since 2011. S2F has predicted multi-year price trajectories but broke down during the 2021-2022 cycle. Hash rate is more useful for assessing network health than price direction. Used together, these metrics provide a probabilistic framework — not certainty.',
    },
  ],
  sections: [
    {
      id: 'what-are-on-chain-metrics',
      heading: 'What Are Bitcoin On-Chain Metrics?',
      content: 'Bitcoin\'s blockchain is a fully public ledger. Every transaction, wallet balance, and coin movement is recorded and verifiable by anyone in the world. **On-chain metrics** are analytics derived directly from this blockchain data — giving investors a unique window into Bitcoin\'s actual network activity that is impossible to access with traditional financial assets.\n\nPlatforms like [Glassnode](https://glassnode.com), [IntoTheBlock](https://www.intotheblock.com), and [CoinMetrics](https://coinmetrics.io) provide professional-grade on-chain analytics. Unlike stock markets where most data is proprietary or delayed, Bitcoin\'s on-chain data is free, real-time, and cannot be falsified. This makes it one of the most powerful toolsets available to Bitcoin investors.\n\nThe four most widely tracked on-chain metrics are:\n\n1. **MVRV Ratio** — Is Bitcoin overvalued or undervalued vs. the price holders paid?\n2. **Stock-to-Flow (S2F)** — How scarce is Bitcoin and does price track its scarcity model?\n3. **Hash Rate** — How secure is the network and how confident are miners?\n4. **Active Addresses** — How much real economic activity is happening on-chain?\n\nEach metric tells a different piece of the story. Combined, they form a powerful framework for assessing where Bitcoin is in its market cycle.',
      cta: {
        calculatorId: 'on-chain',
        calculatorName: 'Bitcoin On-Chain Metrics Dashboard',
        text: 'View all four live on-chain metrics in one dashboard',
        path: '/calculators/on-chain',
      },
    },
    {
      id: 'mvrv-ratio-explained',
      heading: 'MVRV Ratio: Bitcoin\'s Best Cycle Indicator',
      content: 'The **Market Value to Realized Value (MVRV) ratio** is arguably the most powerful Bitcoin cycle indicator in existence. Developed by Murad Mahmudov and David Puell, it compares two different ways of measuring Bitcoin\'s total value:\n\n**Market Cap** — the current price × circulating supply. This represents what the market is willing to pay for all Bitcoin *right now*.\n\n**Realized Cap** — each coin valued at the price it last moved on-chain. This represents the aggregate cost basis of all Bitcoin holders — essentially what they collectively paid.\n\nThe ratio of Market Cap ÷ Realized Cap gives the MVRV:\n\n- **MVRV < 1.0:** Market cap is below realized cap — meaning on average, all Bitcoin holders are in a loss. Historically, this zone has marked the deepest bear market bottoms (2015, 2019, 2022). It is considered the most reliable long-term "buy" signal.\n- **MVRV 1.0–2.0:** Neutral territory. Bitcoin is fairly valued relative to its cost basis. Most of the time Bitcoin spends in accumulation phases falls here.\n- **MVRV 2.0–3.5:** Elevated. Average holders are profitable, but the market hasn\'t reached historic euphoria. Often corresponds to mid-cycle bull run territory.\n- **MVRV > 3.5:** Danger zone. Average holders are sitting on 3.5x gains, creating intense profit-taking pressure. All major Bitcoin cycle tops (2013, 2017, 2021) occurred with MVRV above 3.5.\n\nThe current MVRV reading, along with its historical context, is shown live on our [On-Chain Metrics Dashboard](/calculators/on-chain).',
      cta: {
        calculatorId: 'on-chain',
        calculatorName: 'Live MVRV Gauge',
        text: 'Check today\'s MVRV ratio and see which zone Bitcoin is in',
        path: '/calculators/on-chain',
      },
    },
    {
      id: 'stock-to-flow-model',
      heading: 'Stock-to-Flow: Bitcoin\'s Scarcity Model',
      content: 'The **Stock-to-Flow (S2F) model**, popularized by pseudonymous analyst PlanB, quantifies Bitcoin\'s scarcity by measuring how many years of current production it would take to produce the existing supply:\n\n**S2F Ratio = Circulating Supply ÷ Annual New Issuance**\n\nAfter Bitcoin\'s 4th halving in April 2024, the block reward dropped to 3.125 BTC. With ~144 blocks per day, annual new issuance fell to approximately **164,250 BTC/year**. With ~19.85M BTC in circulation, Bitcoin\'s S2F ratio now exceeds **120** — higher than gold (approximately 60).\n\nPlanB\'s power law formula projects a model price from this ratio: the higher the S2F, the higher the implied model price. After the 4th halving, the S2F model price is in the range of **$150,000–$600,000**, depending on the exact formula used.\n\n**S2F Deviation** is the key actionable signal:\n- **Significantly below model price:** Bitcoin is trading at a discount to its scarcity model — historically a favorable accumulation signal.\n- **Near model price:** Fairly valued according to the S2F framework.\n- **Significantly above model price:** Bitcoin is trading at a premium to its scarcity model — historically a caution signal near cycle tops.\n\n**Important caveat:** The S2F model faced significant criticism after Bitcoin failed to reach its 2021 S2F price target of $288,000. The model\'s predictions should be treated as one data point, not a guarantee. Supply-based models don\'t account for demand shocks, macro conditions, or regulatory changes.',
    },
    {
      id: 'hash-rate-analysis',
      heading: 'Hash Rate: The Network Health Indicator',
      content: 'Bitcoin\'s **hash rate** measures the total computational power (in exahashes per second, EH/s) that miners worldwide are applying to solve Bitcoin\'s proof-of-work puzzle. As of 2026, Bitcoin\'s hash rate surpasses **820 EH/s** — an all-time high that reflects massive capital investment in mining infrastructure.\n\n**Why hash rate matters for investors:**\n\n**1. Miner confidence proxy.** Miners are economic actors who invest millions in hardware and electricity. They only mine at a loss if they believe Bitcoin\'s future price justifies the cost. Sustained or rising hash rate signals that miners believe Bitcoin is undervalued — they\'re betting on higher future prices with their capital.\n\n**2. Network security.** A higher hash rate makes a 51% attack on the Bitcoin network exponentially more expensive and practically impossible. At 820 EH/s, a successful attack would require more computational power than exists in the world today.\n\n**3. Hash rate vs. price divergence.** When hash rate rises significantly faster than price, it may signal that miners are accumulating and confident. When price rises much faster than hash rate, it may indicate speculation outpacing fundamentals. **Hash ribbons** — a technical indicator comparing 30-day and 60-day hash rate moving averages — have historically produced reliable buy signals when hash rate recovers after miner capitulation.',
      cta: {
        calculatorId: 'on-chain',
        calculatorName: 'On-Chain Metrics Dashboard',
        text: 'Track live hash rate and 30-day trend on the dashboard',
        path: '/calculators/on-chain',
      },
    },
    {
      id: 'active-addresses',
      heading: 'Active Addresses: Measuring Real Adoption',
      content: 'The **active addresses** metric counts the number of unique Bitcoin wallet addresses that participated in at least one on-chain transaction on a given day. It serves as one of the most reliable proxies for real economic activity on the Bitcoin network — separating organic adoption from pure speculation.\n\nAs of 2026, approximately **900,000–950,000 unique addresses** are active daily, reflecting the scale of Bitcoin\'s global adoption.\n\n**How to interpret active addresses:**\n\n**Divergence signals:** When Bitcoin\'s price rises sharply but active addresses remain flat or fall, it suggests the move is driven by speculation on exchanges rather than on-chain activity — a potential warning sign. Conversely, when active addresses lead price higher, it suggests genuine adoption demand.\n\n**Network Metcalfe\'s Law:** Some analysts apply Metcalfe\'s Law (network value ∝ n²) to Bitcoin active addresses. When market cap grows faster than n², the network may be overvalued relative to its actual usage. This forms the basis of several valuation models.\n\n**Long-term trend:** Despite short-term volatility, Bitcoin\'s active address count has trended upward over every multi-year period since 2009. This sustained growth in usage is a fundamental bullish signal for Bitcoin\'s long-term value.',
    },
    {
      id: 'combining-metrics',
      heading: 'How to Combine On-Chain Signals',
      content: 'No single on-chain metric tells the whole story. The most effective approach combines multiple signals for a higher-confidence view of cycle position:\n\n**Bullish confluence (multiple signals aligning):**\n- MVRV < 1.5 (undervalued vs. realized cap)\n- Price significantly below S2F model price\n- Hash rate at or near all-time highs (miner confidence)\n- Active addresses rising (organic demand)\n\n**Bearish confluence:**\n- MVRV > 3.5 (extreme profit territory)\n- Price significantly above S2F model price\n- Hash rate stalling despite high prices (miners distributing)\n- Active addresses not keeping pace with price growth\n\n**Complement with sentiment and cycle tools:**\n\nOn-chain metrics are most powerful when combined with market sentiment indicators. If MVRV is elevated (3.0+) AND the [Fear & Greed Index](/calculators/fear-greed-index) shows extreme greed AND the [Rainbow Chart](/calculators/rainbow-chart) shows Bitcoin in the "Maximum Bubble" or "Sell" zones — that multi-metric alignment has historically marked major cycle tops.\n\nSimilarly, MVRV below 1.5 alongside extreme fear (Fear & Greed < 20) and Bitcoin in the Rainbow Chart\'s blue/green zones has historically been among the best long-term entry windows. For a longer-term structural view, the [Power Law model](/calculators/power-law) and [CAGR comparison](/calculators/cagr) provide additional context.',
      cta: {
        calculatorId: 'on-chain',
        calculatorName: 'Bitcoin On-Chain Metrics Dashboard',
        text: 'View all live on-chain signals and cycle indicators in one place',
        path: '/calculators/on-chain',
      },
    },
    {
      id: 'limitations',
      heading: 'Limitations of On-Chain Analysis',
      content: 'On-chain metrics are powerful but imperfect. Every investor using them should understand their key limitations:\n\n**1. Exchange custody distorts data.** When millions of users hold Bitcoin on Coinbase or Binance, all those coins appear as a small number of exchange wallet addresses on-chain — not millions of individual addresses. This compresses active address counts and can distort MVRV calculations.\n\n**2. Models may break in new conditions.** The S2F model\'s 2021 breakdown demonstrated that even well-validated models can fail when market structure changes. Bitcoin maturing from a niche asset to a macro asset class may change how these metrics behave.\n\n**3. Realized cap approximation.** True realized cap requires knowing the exact price of every UTXO — computationally intensive. Many implementations use approximation methods, which can introduce error in MVRV calculations.\n\n**4. Lagging signals.** On-chain data is a trailing indicator of behavior. By the time MVRV hits extreme levels, the market has already moved significantly.\n\n**5. Not a replacement for research.** On-chain metrics are one input among many. Macro conditions, regulatory environment, technological changes, and Bitcoin-specific developments (ETF inflows, corporate adoption) all matter and are not captured in on-chain data alone.',
    },
    {
      id: 'key-takeaways',
      heading: 'Key Takeaways',
      content: '1. **MVRV < 1.0 = historically undervalued.** Every time Bitcoin\'s MVRV fell below 1.0, it proved to be a generational buying opportunity. Above 3.5 = historically extreme risk.\n\n2. **S2F deviation signals valuation vs. scarcity model.** Significantly below model price = accumulation zone per S2F. Significantly above = caution. But treat S2F as one signal, not gospel.\n\n3. **Rising hash rate = miner confidence.** Miners invest in hardware based on long-term Bitcoin conviction. All-time high hash rates alongside depressed prices is a classic "buy" signal.\n\n4. **Active addresses confirm organic adoption.** Rising active addresses alongside rising price = healthy bull market. Divergence (price rising, addresses flat) = speculative risk.\n\n5. **Combine with sentiment tools.** Use on-chain metrics alongside the [Fear & Greed Index](/calculators/fear-greed-index) and [Rainbow Chart](/calculators/rainbow-chart) for a multi-dimensional view of Bitcoin\'s market cycle position.',
    },
  ],
  howToSteps: [
    { name: 'Open the On-Chain Dashboard', text: 'Navigate to the Bitcoin On-Chain Metrics Dashboard to load live data' },
    { name: 'Check the MVRV Gauge', text: 'Read the current MVRV zone — below 1.5 is historically favorable, above 3.5 is historically risky' },
    { name: 'Review S2F Deviation', text: 'See how far current price sits from the PlanB S2F model price' },
    { name: 'Check Hash Rate Trend', text: 'Confirm whether hash rate is rising (miner confidence) or falling (miner capitulation)' },
    { name: 'Combine Signals', text: 'Use on-chain data alongside Fear & Greed and Rainbow Chart for multi-indicator cycle analysis' },
  ],
  expertQuote: {
    quote: 'On-chain data gives investors a transparent, real-time view of network activity that simply does not exist for traditional asset classes.',
    author: 'Glassnode',
    role: 'On-chain market intelligence',
    source: 'https://insights.glassnode.com/',
    sourceLabel: 'Glassnode Insights',
  },
};

export default article;
