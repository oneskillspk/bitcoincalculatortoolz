import { Article } from '../articles';

const article: Article = {
  slug: 'what-is-a-satoshi',
  title: "What Is a Satoshi? Bitcoin's Smallest Unit Explained",
  metaDescription: "A Satoshi (sat) is 0.00000001 BTC — Bitcoin's smallest unit. Learn how BTC, mBTC, bits, and sats compare, with exact conversion examples and a free tool.",
  quickAnswer: 'A satoshi is the smallest unit of Bitcoin: 0.00000001 BTC (one hundred-millionth). One BTC = 100,000,000 satoshis. Named after creator Satoshi Nakamoto, satoshis are how small on-chain and Lightning payments are denominated. At $100,000/BTC, one satoshi is worth $0.001 (a tenth of a cent).',
  category: 'Basics',
  publishedDate: '2026-02-03',
  updatedDate: '2026-03-10',
  readingTime: 5,
  keywords: ['what is a satoshi', 'satoshi to usd', 'bitcoin units', 'satoshi explained', 'sats'],
  relatedCalculators: ['bitcoin-converter', 'stack-sats', 'purchasing-power'],
  relatedArticles: ['bitcoin-halving-explained', 'what-is-bitcoin-dca', 'bitcoin-transaction-fees-explained', 'bitcoin-savings-plan-guide'],
  faqs: [
    { question: 'How many satoshis are in 1 Bitcoin?', answer: '1 Bitcoin = 100,000,000 satoshis (100 million sats). A satoshi is the smallest unit of Bitcoin on the base layer.' },
    { question: 'What is the dollar value of a single satoshi today?', answer: 'The USD value of a satoshi depends on the current Bitcoin price. At $100,000 per BTC, 1 satoshi = $0.001 (one-tenth of a cent). Use our converter for the live rate.' },
    { question: 'Why is it called a satoshi?', answer: 'The unit is named after Satoshi Nakamoto, the pseudonymous creator of Bitcoin who published the Bitcoin whitepaper in 2008 and mined the first block in January 2009.' },
    { question: 'Can you buy less than 1 satoshi?', answer: 'On the Bitcoin base layer, a satoshi is the smallest unit. However, the Lightning Network supports millisatoshis (1/1000th of a satoshi) for micropayments.' },
  ],
  sections: [
    { id: 'what-is-satoshi', heading: 'What Is a Satoshi?', content: 'A satoshi (often abbreviated as "sat" or "sats") is the smallest unit of Bitcoin. Just as a dollar is divided into 100 cents, one Bitcoin is divided into 100,000,000 satoshis.\n\nThe unit is named after **[Satoshi Nakamoto](https://en.wikipedia.org/wiki/Satoshi_Nakamoto)**, the anonymous creator of Bitcoin who published the [Bitcoin whitepaper](https://bitcoin.org/bitcoin.pdf) in 2008. Using satoshis makes it easier to express small amounts of Bitcoin, especially as the price of a whole Bitcoin continues to rise.\n\nFor example, instead of saying "I own 0.00050000 BTC," you can simply say "I own 50,000 sats." This is more intuitive and helps people understand they can own meaningful amounts of Bitcoin without buying a whole coin.' },
    { id: 'bitcoin-units', heading: 'Bitcoin Unit Hierarchy', content: 'Bitcoin can be expressed in several denominations:\n\n• **1 BTC** = 1 Bitcoin (the base unit)\n• **1 mBTC** (millibitcoin) = 0.001 BTC = 100,000 sats\n• **1 μBTC / 1 bit** (microbitcoin) = 0.000001 BTC = 100 sats\n• **1 sat** (satoshi) = 0.00000001 BTC\n\nThe community has increasingly adopted **"sats"** as the everyday unit because:\n1. Whole numbers are psychologically easier to work with\n2. It removes the perception that Bitcoin is "too expensive"\n3. Lightning Network transactions are denominated in sats\n4. "Stacking sats" has become the rallying cry for regular Bitcoin accumulators', cta: { calculatorId: 'bitcoin-converter', calculatorName: 'Bitcoin & Satoshi Converter', text: 'Convert between BTC, sats, and 100+ fiat currencies instantly', path: '/calculators/bitcoin-converter' } },
    { id: 'satoshi-value', heading: 'What Is a Satoshi Worth?', content: 'The value of a satoshi depends entirely on Bitcoin\'s price:\n\n| BTC Price | 1 Sat Value | 10,000 Sats Value |\n|-----------|-------------|-------------------|\n| $50,000 | $0.0005 | $5.00 |\n| $100,000 | $0.001 | $10.00 |\n| $250,000 | $0.0025 | $25.00 |\n| $500,000 | $0.005 | $50.00 |\n| $1,000,000 | $0.01 | $100.00 |\n\nAt $1,000,000 per BTC, 1 satoshi would equal 1 cent — achieving "sat-cent parity," a milestone the Bitcoin community watches closely.' },
    { id: 'stacking-sats', heading: 'What Does "Stacking Sats" Mean?', content: '"Stacking sats" refers to the practice of regularly accumulating satoshis through [DCA](/learn/what-is-bitcoin-dca) or earning Bitcoin. It\'s the philosophy that you don\'t need to buy a whole Bitcoin — every sat matters.\n\nPopular ways to stack sats:\n\n• **DCA purchases:** Automatic recurring buys of small amounts — learn [how DCA works for Bitcoin](/learn/what-is-bitcoin-dca)\n• **Cashback apps:** Services like Fold, Lolli, and Satsback give Bitcoin rewards for purchases\n• **Lightning tips:** Earning sats for content creation on platforms like Nostr and Stacker News\n• **Round-up savings:** Apps that round up purchases and invest the difference in Bitcoin\n• **Mining:** Even small-scale [mining](/learn/bitcoin-mining-profitability-2026) contributes sats to your stack\n\nFor a complete plan on building your sat stack over time, read our [Bitcoin savings plan guide](/learn/bitcoin-savings-plan-guide).', cta: { calculatorId: 'stack-sats', calculatorName: 'Stack Sats Goal Calculator', text: 'Set a satoshi stacking goal and track your progress', path: '/calculators/stack-sats' } },
    { id: 'lightning-network', heading: 'Satoshis on the Lightning Network', content: 'The Lightning Network, Bitcoin\'s layer-2 scaling solution, uses satoshis as its native unit. Lightning enables:\n\n• **Instant payments** of as little as 1 satoshi\n• **Micropayments** for content (pay-per-article, streaming sats)\n• **Cross-border transfers** for fractions of a cent\n• **Millisatoshis** (msat) — 1/1000 of a satoshi for internal Lightning routing\n\nLightning has made satoshis practical as everyday money. You can tip a content creator 100 sats (~$0.10 at current prices) with near-zero fees and instant settlement.' },
  ],
  howToSteps: [
    { name: 'Understand the units', text: 'Learn that 1 BTC = 100,000,000 satoshis' },
    { name: 'Open the Bitcoin Converter', text: 'Visit our Bitcoin & Satoshi Converter tool' },
    { name: 'Enter an amount', text: 'Input any amount in BTC, sats, or fiat currency' },
    { name: 'See the conversion', text: 'Instantly see equivalent values across all Bitcoin units and currencies' },
  ],
  expertQuote: {
    quote: 'It would have been nice to give it [the unit] a different name, but like so many things, the name has stuck.',
    author: 'Hal Finney',
    role: 'Bitcoin pioneer & first transaction recipient',
    source: 'https://bitcointalk.org/index.php?topic=8000.0',
    sourceLabel: 'bitcointalk.org thread (2010)',
  },
  speakable: true,
};

export default article;
