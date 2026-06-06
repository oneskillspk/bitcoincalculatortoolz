import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-halving-explained',
  title: 'Bitcoin Halving Explained: Impact on Price & Supply',
  metaDescription: 'Bitcoin halving cuts new BTC supply every ~4 years. The 2020 halving was followed by a 560% rally. Learn how it works and when the next one happens.',
  category: 'Basics',
  publishedDate: '2026-01-18',
  updatedDate: '2026-03-10',
  readingTime: 7,
  keywords: ['bitcoin halving', 'halving explained', 'bitcoin halving 2028', 'block reward', 'bitcoin supply'],
  relatedCalculators: ['halving-countdown', 'mining-profitability', 'what-if'],
  relatedArticles: ['what-is-a-satoshi', 'bitcoin-mining-profitability-2026', 'bitcoin-transaction-fees-explained'],
  faqs: [
    { question: 'When is the next Bitcoin halving?', answer: 'The next Bitcoin halving is expected around April 2028, when the block reward will drop from 3.125 BTC to 1.5625 BTC. Use our Halving Countdown tool for an exact estimate.' },
    { question: 'Does Bitcoin halving increase price?', answer: 'Historically, Bitcoin\'s price has increased significantly within 12-18 months after each halving. However, past performance does not guarantee future results, and many factors influence price.' },
    { question: 'How many Bitcoin halvings are left?', answer: 'There will be approximately 28 more halvings until around the year 2140, when the last fraction of Bitcoin will be mined and the total supply reaches 21 million.' },
    { question: 'What happens to miners after halving?', answer: 'Miners receive half the block reward after each halving. Less efficient miners may become unprofitable and shut down, while the network adjusts difficulty to maintain ~10-minute block times.' },
  ],
  sections: [
    { id: 'what-is-halving', heading: 'What Is Bitcoin Halving?', content: 'Bitcoin halving is a pre-programmed event that occurs approximately every 210,000 blocks (roughly every 4 years). During a halving, the reward that Bitcoin miners receive for validating transactions and adding new blocks to the blockchain is cut in half.\n\nThis mechanism is hardcoded into Bitcoin\'s protocol and is one of its most important features — it creates a predictable, decreasing supply schedule that makes Bitcoin inherently deflationary. As described in the [Bitcoin whitepaper](https://bitcoin.org/bitcoin.pdf) by Satoshi Nakamoto and detailed on [Wikipedia](https://en.wikipedia.org/wiki/Bitcoin#Supply), Bitcoin\'s supply is capped at 21 million coins (or 2.1 quadrillion [satoshis](/learn/what-is-a-satoshi)), and halvings ensure that supply approaches this limit gradually.\n\nFor a broader overview of Bitcoin\'s design and economics, see the [Wikipedia Bitcoin article](https://en.wikipedia.org/wiki/Bitcoin) and [Investopedia\'s halving guide](https://www.investopedia.com/bitcoin-halving-4843769).' },
    { id: 'halving-history', heading: 'Bitcoin Halving History', content: 'There have been four Bitcoin halvings so far:\n\n• **2012 (Block 210,000):** Reward dropped from 50 BTC to 25 BTC. Price went from ~$12 to ~$1,100 within a year.\n• **2016 (Block 420,000):** Reward dropped from 25 BTC to 12.5 BTC. Price went from ~$650 to ~$19,700 within 18 months.\n• **2020 (Block 630,000):** Reward dropped from 12.5 BTC to 6.25 BTC. Price went from ~$8,700 to ~$69,000 within 18 months.\n• **2024 (Block 840,000):** Reward dropped from 6.25 BTC to 3.125 BTC. The bull cycle that followed saw prices above $100,000.\n\nEach halving has preceded a significant bull market, though the magnitude of gains has decreased with each cycle as Bitcoin\'s market cap grows larger.', cta: { calculatorId: 'halving-countdown', calculatorName: 'Bitcoin Halving Countdown', text: 'Track the exact time until the next Bitcoin halving event', path: '/calculators/halving-countdown' } },
    { id: 'why-it-matters', heading: 'Why Bitcoin Halving Matters', content: '**Supply Shock:** Halvings reduce the rate of new Bitcoin entering circulation. If demand remains constant or grows while supply growth slows, economic theory suggests prices should rise.\n\n**Miner Economics:** The halving directly impacts miner profitability. Only the most efficient miners survive, which tends to centralize mining temporarily before difficulty adjusts and new equilibrium is found.\n\n**Market Psychology:** Halvings generate significant media attention and public interest, often bringing new investors into the market and creating a self-reinforcing cycle of demand.\n\n**Stock-to-Flow:** After each halving, Bitcoin\'s stock-to-flow ratio (existing supply / annual production) doubles, making it increasingly scarce relative to gold and other commodities.' },
    { id: 'impact-on-mining', heading: 'Impact on Mining', content: 'When block rewards halve, miners\' revenue from newly minted Bitcoin drops by 50% overnight. This creates a survival-of-the-fittest dynamic:\n\n• Miners with high electricity costs become unprofitable and shut down\n• Hash rate temporarily decreases as unprofitable miners exit\n• Difficulty adjusts downward to maintain 10-minute block intervals\n• Remaining miners become more profitable due to less competition\n• Transaction fees become a larger percentage of miner revenue\n\nOver time, Bitcoin is designed to transition entirely from block rewards to transaction fees as the primary miner incentive.', cta: { calculatorId: 'mining-profitability', calculatorName: 'Mining Profitability Calculator', text: 'Calculate whether Bitcoin mining is profitable for your setup', path: '/calculators/mining-profitability' } },
    { id: 'investing-around-halvings', heading: 'Investing Around Bitcoin Halvings', content: 'While historical data shows strong post-halving performance, it\'s crucial to understand that:\n\n1. **Correlation is not causation** — many other factors drive Bitcoin\'s price\n2. **The market is more mature** — each halving occurs in a more efficient market with more institutional participation\n3. **Pre-halving rallies** — markets tend to front-run halvings, pricing in the supply reduction beforehand\n4. **Time horizon matters** — post-halving gains typically take 12-18 months to fully materialize\n\nA [DCA strategy](/learn/what-is-bitcoin-dca) through halving events has historically been one of the most effective approaches for long-term Bitcoin accumulation. For miners, understanding [mining profitability](/learn/bitcoin-mining-profitability-2026) in a post-halving environment is critical.' },
  ],
  howToSteps: [
    { name: 'Understand the cycle', text: 'Learn that Bitcoin halvings occur every ~4 years, reducing block rewards by 50%' },
    { name: 'Check the countdown', text: 'Visit our Bitcoin Halving Countdown to see when the next halving occurs' },
    { name: 'Review historical data', text: 'Study how previous halvings affected Bitcoin price and mining economics' },
    { name: 'Plan your strategy', text: 'Consider how halving events factor into your Bitcoin investment timeline' },
  ],
  speakable: true,
  expertQuote: {
    quote: 'The halving is the heartbeat of Bitcoin\'s monetary policy. Every four years the new supply is cut in half — there is no central authority that can change this.',
    author: 'Andreas M. Antonopoulos',
    role: 'Author, Mastering Bitcoin',
    source: 'https://github.com/bitcoinbook/bitcoinbook',
    sourceLabel: 'github.com/bitcoinbook',
  },
};

export default article;
