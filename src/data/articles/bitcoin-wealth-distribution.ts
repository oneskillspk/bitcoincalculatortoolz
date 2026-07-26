import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-wealth-distribution',
  title: 'Bitcoin Wealth Distribution: Where Do You Rank Globally?',
  metaDescription: '0.03% of Bitcoin addresses hold 100+ BTC — but control 60%+ of the supply. See how whales, ETFs, and corporates compare, and find where you rank globally.',
  quickAnswer: 'Owning just 0.1 BTC (~10 million sats) puts you in the top ~5% of Bitcoin holders globally. 1 BTC puts you in the top ~1%. Only ~50 million people worldwide own any BTC, and with 21 million coins hard-capped, mathematically fewer than 3% of adults can ever own a whole Bitcoin.',
  category: 'Market Analysis',
  publishedDate: '2026-03-09',
  updatedDate: '2026-03-09',
  readingTime: 9,
  keywords: ['bitcoin wealth distribution', 'who owns the most bitcoin', 'bitcoin whale wallets', 'bitcoin rich list', 'bitcoin address distribution', 'bitcoin ownership statistics 2026', 'top bitcoin holders'],
  relatedCalculators: ['wealth-percentile', 'supply', 'dominance'],
  relatedArticles: ['how-much-bitcoin-should-i-own', 'bitcoin-on-chain-metrics-guide', 'how-much-bitcoin-by-age'],
  faqs: [
    {
      question: 'How many people own at least 1 full Bitcoin?',
      answer: 'As of early 2026, approximately 1.1 million Bitcoin addresses hold 1 BTC or more. However, the actual number of individuals is likely lower because one person can control multiple addresses, and many addresses belong to exchanges holding coins on behalf of millions of users.'
    },
    {
      question: 'Who owns the most Bitcoin in 2026?',
      answer: 'The largest known Bitcoin holder is Satoshi Nakamoto, the pseudonymous creator of Bitcoin, with an estimated 1.1 million BTC that have never moved. Among entities, BlackRock\'s iShares Bitcoin Trust (IBIT) holds over 550,000 BTC, followed by MicroStrategy with approximately 450,000 BTC. Governments including the US, China, and El Salvador also hold significant reserves.'
    },
    {
      question: 'How much Bitcoin is permanently lost?',
      answer: 'Research estimates suggest between 3 million and 4 million BTC are permanently lost due to forgotten passwords, lost hardware wallets, and early mining coins that were never moved. This represents roughly 15-20% of the total 21 million supply, making the effective circulating supply significantly smaller than the total mined supply.'
    },
    {
      question: 'What Bitcoin wealth percentile am I in?',
      answer: 'Owning just 0.01 BTC places you in approximately the top 20% of all Bitcoin holders globally. Holding 0.1 BTC puts you in the top 5%, and owning 1 full BTC places you in roughly the top 1% of all Bitcoin addresses. Use our Wealth Percentile Calculator to find your exact ranking.'
    }
  ],
  howToSteps: [
    { name: 'Check your total BTC holdings', text: 'Add up all Bitcoin you hold across exchanges, hardware wallets, and software wallets to get your total BTC balance.' },
    { name: 'Understand address distribution tiers', text: 'Bitcoin addresses are categorized into tiers: shrimp (<1 BTC), crab (1-10 BTC), fish (10-100 BTC), shark (100-1,000 BTC), and whale (1,000+ BTC).' },
    { name: 'Use the Wealth Percentile Calculator', text: 'Enter your total BTC holdings into the Bitcoin Wealth Percentile Calculator to see what percentage of holders you rank above globally.' },
    { name: 'Compare against global ownership data', text: 'Review on-chain data from sources like Glassnode and BitInfoCharts to see how address balances are distributed across the network.' },
    { name: 'Factor in lost and illiquid supply', text: 'Remember that 3-4 million BTC are estimated to be permanently lost, which means the effective supply is smaller and your relative position is stronger than raw numbers suggest.' }
  ],
  sections: [
    {
      id: 'global-ownership',
      heading: 'Global Bitcoin Ownership Overview',
      content: 'As of early 2026, there are over **460 million Bitcoin addresses** that have received BTC at some point, but only about **50 million addresses** hold a non-zero balance. The distinction matters: most addresses are empty because Bitcoin was spent or transferred to new addresses over time. You can explore address distribution data on [BitInfoCharts](https://bitinfocharts.com/top-100-richest-bitcoin-addresses.html) and [Glassnode](https://glassnode.com/).\n\nGlobal Bitcoin adoption is estimated at **300-400 million people**, or roughly 4-5% of the world\'s population. However, ownership is extremely concentrated. The top 2% of addresses control approximately **95% of all Bitcoin**, making it one of the most unequally distributed assets in history.\n\nThis concentration is somewhat misleading, though. Many large addresses belong to **cryptocurrency exchanges** like Coinbase, Binance, and Kraken, which hold coins on behalf of millions of individual users. A single exchange address holding 100,000 BTC might represent 500,000 individual accounts. When exchange custody is factored in, the distribution is more even — but still heavily skewed toward early adopters and institutional holders.\n\nUnderstanding where you fall in this distribution is key to setting realistic [accumulation goals](/learn/how-much-bitcoin-should-i-own).'
    },
    {
      id: 'address-distribution',
      heading: 'Address Distribution Breakdown',
      content: 'Bitcoin addresses are commonly grouped into tiers based on their balance. Here is the current distribution based on **on-chain data** from early 2026:\n\n| Tier | Balance Range | Addresses | % of Total | BTC Held | % of Supply |\n|------|-------------|-----------|-----------|----------|-------------|\n| Plankton | < 0.001 BTC | ~30M | 60% | ~8,000 BTC | 0.04% |\n| Shrimp | 0.001 – 1 BTC | ~16M | 32% | ~1.8M BTC | 9.1% |\n| Crab | 1 – 10 BTC | ~900K | 1.8% | ~2.8M BTC | 14.2% |\n| Fish | 10 – 100 BTC | ~150K | 0.3% | ~4.5M BTC | 22.8% |\n| Shark | 100 – 1,000 BTC | ~15K | 0.03% | ~4.2M BTC | 21.3% |\n| Whale | 1,000 – 10,000 BTC | ~2,100 | 0.004% | ~4.8M BTC | 24.3% |\n| Mega Whale | > 10,000 BTC | ~120 | 0.0002% | ~1.6M BTC | 8.1% |\n\nThe data reveals a stark reality: **addresses holding less than 1 BTC represent 92% of all addresses but control only 9% of the supply**. Meanwhile, the roughly 2,200 whale addresses holding 1,000+ BTC control over **32% of all Bitcoin in existence**.\n\nTrack where you stand with our [Wealth Percentile Calculator](/calculators/wealth-percentile).',
      cta: {
        calculatorId: 'wealth-percentile',
        calculatorName: 'Wealth Percentile Calculator',
        text: 'Find out your Bitcoin wealth percentile',
        path: '/calculators/wealth-percentile'
      }
    },
    {
      id: 'top-holders',
      heading: 'Top Bitcoin Holders: Satoshi, Companies, and ETFs',
      content: 'The identity of Bitcoin\'s largest holders has shifted dramatically since the launch of **spot Bitcoin ETFs** in January 2024. Here are the top known holders as of early 2026:\n\n**Individual/Pseudonymous:**\n• **Satoshi Nakamoto**: ~1.1 million BTC (estimated, never moved)\n• **Winklevoss Twins**: ~70,000 BTC\n• **Tim Draper**: ~29,000 BTC (purchased from US Marshals auction)\n\n**Corporate:**\n• **MicroStrategy (MSTR)**: ~450,000 BTC — the largest corporate holder, led by Michael Saylor\n• **Tesla**: ~9,700 BTC (partially sold in 2022, remainder held)\n• **Block (formerly Square)**: ~8,000 BTC\n\n**ETFs and Funds:**\n• **BlackRock IBIT**: ~550,000 BTC — became the largest Bitcoin fund within 18 months of launch\n• **Fidelity FBTC**: ~210,000 BTC\n• **Grayscale GBTC**: ~190,000 BTC (down from 620K after ETF conversion outflows)\n• **ARK 21Shares ARKB**: ~55,000 BTC\n\n**Governments:**\n• **United States**: ~200,000 BTC (seized from Silk Road and other operations)\n• **China**: ~190,000 BTC (seized from PlusToken Ponzi)\n• **El Salvador**: ~6,000 BTC (national treasury purchases)\n\nThe rise of ETFs has reshaped Bitcoin\'s ownership structure. Learn more in our [Bitcoin ETF Guide](/learn/bitcoin-etf-guide-ibit-fbtc-arkb).'
    },
    {
      id: 'whale-vs-retail',
      heading: 'Whale vs Retail Analysis',
      content: '**Whale behavior** is one of the most closely watched [on-chain metrics](/learn/bitcoin-on-chain-metrics-guide) in Bitcoin analysis. When whales accumulate, it often signals confidence in higher future prices. When they distribute, it can precede corrections.\n\nKey patterns observed in 2025-2026:\n\n• **Whale accumulation** accelerated after the 2024 halving, with addresses holding 1,000+ BTC adding approximately 200,000 BTC during Q3-Q4 2025\n• **Retail participation** (addresses < 1 BTC) grew by 15% year-over-year, indicating broader adoption\n• **Exchange balances** continued declining, falling to under 2 million BTC — the lowest since 2018 — suggesting more holders are moving to self-custody\n\nThe **whale-to-retail ratio** provides insight into market cycle positioning. Historically, when whales are accumulating while retail is selling (high ratio), it has been a strong **buy signal**. The reverse — whales distributing while retail buys — has preceded major corrections.\n\nYou can track Bitcoin\'s overall market health through our [On-Chain Metrics Dashboard](/calculators/on-chain) and monitor sentiment via the [Fear & Greed Index](/calculators/fear-greed-index).'
    },
    {
      id: 'lost-bitcoin',
      heading: 'Lost Bitcoin Impact on Scarcity',
      content: 'Bitcoin\'s **hard cap of 21 million coins** is well known, but the effective supply is significantly smaller. Research from Chainalysis, Glassnode, and independent analysts estimates that **3 to 4 million BTC are permanently lost**.\n\nSources of lost Bitcoin include:\n\n• **Satoshi\'s coins**: ~1.1 million BTC mined in Bitcoin\'s earliest days have never moved. While not provably lost, they are widely considered dormant and possibly inaccessible.\n• **Early miner coins**: Many early miners used computers that were later discarded or reformatted before Bitcoin had significant value. The famous case of James Howells, who lost 8,000 BTC on a hard drive in a Welsh landfill, is just one example.\n• **Forgotten wallets**: Users who bought small amounts of Bitcoin before 2013 often lost access to their wallets, passwords, or seed phrases.\n• **Burn addresses**: Some BTC was intentionally sent to provably unspendable addresses.\n\nWhen you subtract lost coins from the total mined supply (~19.8 million as of 2026), the **effective circulating supply drops to approximately 15.8-16.8 million BTC**. This means scarcity is even more extreme than the 21 million cap suggests.\n\nExplore Bitcoin\'s supply dynamics with our [Supply & Scarcity Calculator](/calculators/supply).',
      cta: {
        calculatorId: 'supply',
        calculatorName: 'Supply & Scarcity Calculator',
        text: 'Explore Bitcoin supply and scarcity metrics',
        path: '/calculators/supply'
      }
    },
    {
      id: 'where-do-you-rank',
      heading: 'Where Do You Rank?',
      content: 'Given the extreme concentration of Bitcoin wealth and the significant amount of lost supply, even modest holdings place you higher in the global distribution than you might expect:\n\n• **0.001 BTC** (~$85 at current prices): Top 40% of all non-zero addresses\n• **0.01 BTC** (~$850): Top 20% of holders\n• **0.1 BTC** (~$8,500): Top 5% of all Bitcoin addresses\n• **0.28 BTC**: You own more than 1 millionth of the total supply\n• **1 BTC** (~$85,000): Top 1% — fewer than 1.1 million addresses hold this much\n• **6.15 BTC**: You own more than 1 in every 3.4 million BTC (one-millionth of effective supply when accounting for lost coins)\n• **10 BTC**: Top 0.3% — you are in the "fish" tier and above\n\nThese numbers become even more striking when you consider that global adoption is still under 5%. As Bitcoin\'s user base grows from 400 million toward 1 billion+, the scarcity premium on even small holdings will increase dramatically.\n\nNot sure how much Bitcoin you should target? Read our guide on [How Much Bitcoin Should I Own](/learn/how-much-bitcoin-should-i-own) and use the [Wealth Percentile Calculator](/calculators/wealth-percentile) to see exactly where your stack ranks in the global distribution.'
    }
  ]
};

export default article;
