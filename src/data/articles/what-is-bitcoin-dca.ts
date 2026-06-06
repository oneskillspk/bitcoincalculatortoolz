import { Article } from '../articles';

const article: Article = {
  slug: 'what-is-bitcoin-dca',
  title: 'Bitcoin DCA Explained: What It Is & How It Works',
  metaDescription: 'Learn how Bitcoin DCA works, why fixed recurring buys reduce timing risk, and how to build a simple dollar-cost averaging plan.',
  category: 'Investing',
  publishedDate: '2026-01-15',
  updatedDate: '2026-03-10',
  readingTime: 8,
  keywords: ['bitcoin dca', 'dollar cost averaging bitcoin', 'dca strategy', 'bitcoin investing', 'dca calculator'],
  relatedCalculators: ['dca', 'lump-sum-vs-dca', 'bitcoin-savings'],
  relatedArticles: ['dca-vs-lump-sum-bitcoin', 'how-to-plan-retirement-with-bitcoin', 'bitcoin-savings-plan-guide', 'how-much-bitcoin-should-i-own', 'bitcoin-dca-100-per-month-returns'],
  faqs: [
    { question: 'What does DCA mean in Bitcoin?', answer: 'DCA stands for Dollar Cost Averaging. It means investing a fixed amount of money into Bitcoin at regular intervals (weekly, monthly) regardless of price, reducing the impact of volatility on your overall purchase.' },
    { question: 'Is DCA a good strategy for Bitcoin?', answer: 'Yes. Historical data shows that DCA into Bitcoin over any 4+ year period has been profitable. It removes emotional decision-making and smooths out entry prices across market cycles.' },
    { question: 'How often should I DCA into Bitcoin?', answer: 'The most common DCA frequencies are weekly or monthly. Weekly DCA provides slightly better price averaging due to more data points, but monthly is simpler and still highly effective.' },
    { question: 'What is the minimum amount to DCA into Bitcoin?', answer: 'Most exchanges allow purchases as low as $1-$10. Bitcoin is divisible to 8 decimal places (satoshis), so you can invest any amount regardless of the current BTC price.' },
  ],
  sections: [
    {
      id: 'what-is-dca',
      heading: 'What Is Dollar Cost Averaging?',
      content: '[Dollar Cost Averaging](https://en.wikipedia.org/wiki/Dollar_cost_averaging) (DCA) is an investment strategy where you invest a fixed amount of money into an asset at regular intervals, regardless of the current price. Instead of trying to time the market with a single large purchase, DCA spreads your investment across multiple buy points over time. For a detailed explanation, see [Investopedia\'s DCA guide](https://www.investopedia.com/terms/d/dollarcostaveraging.asp).\n\nFor Bitcoin specifically, this means setting up a recurring purchase — say $100 every week or $500 every month — and sticking to that schedule whether Bitcoin is at $30,000 or $100,000. The key insight is that you buy more [satoshis](/learn/what-is-a-satoshi) when prices are low and less when prices are high, naturally optimizing your average entry price.',
    },
    {
      id: 'how-dca-works',
      heading: 'How DCA Works for Bitcoin',
      content: 'Here\'s a simplified example: Suppose you invest $100 per week into Bitcoin over 4 weeks.\n\n• Week 1: BTC at $50,000 → you buy 0.002 BTC\n• Week 2: BTC at $40,000 → you buy 0.0025 BTC\n• Week 3: BTC at $45,000 → you buy 0.00222 BTC\n• Week 4: BTC at $55,000 → you buy 0.00182 BTC\n\nTotal invested: $400. Total BTC: 0.00854 BTC. Your average price: $46,838 — lower than the simple average of $47,500. This is the mathematical advantage of DCA: it weights your purchases toward lower prices.',
      cta: { calculatorId: 'dca', calculatorName: 'Bitcoin DCA Calculator', text: 'Model your own DCA strategy with historical Bitcoin data', path: '/calculators/dca' },
    },
    {
      id: 'benefits',
      heading: 'Benefits of DCA for Bitcoin Investors',
      content: '**1. Eliminates Timing Risk:** No one can consistently predict Bitcoin\'s short-term price movements. DCA removes the pressure to find the "perfect" entry point.\n\n**2. Reduces Emotional Decision-Making:** A fixed schedule prevents panic selling during dips or FOMO buying during rallies.\n\n**3. Builds Discipline:** Regular, automated investing creates a savings habit that compounds over time.\n\n**4. Historically Profitable:** According to historical data, anyone who DCA\'d into Bitcoin for 4+ years has seen positive returns — regardless of when they started.\n\n**5. Accessible to Everyone:** You don\'t need a large lump sum to start. Even $10/week adds up significantly over time.',
    },
    {
      id: 'dca-vs-lump-sum',
      heading: 'DCA vs Lump Sum: Which Is Better?',
      content: 'In a consistently rising market, lump sum investing mathematically outperforms DCA because your money has more time in the market. However, Bitcoin is not a consistently rising market — it experiences 50-80% drawdowns regularly.\n\nDCA provides psychological comfort and risk mitigation during these volatile periods. For most retail investors without a crystal ball, DCA is the superior strategy because it prevents the catastrophic scenario of investing everything right before a major crash. For a detailed data-driven comparison, read our [DCA vs lump sum analysis](/learn/dca-vs-lump-sum-bitcoin).\n\nThe ideal approach for many investors is a hybrid: invest a portion as a lump sum immediately and DCA the remainder over 3-12 months.',
      cta: { calculatorId: 'lump-sum-vs-dca', calculatorName: 'Lump Sum vs DCA Calculator', text: 'Compare DCA and lump sum performance with real historical data', path: '/calculators/lump-sum-vs-dca' },
    },
    {
      id: 'how-to-start',
      heading: 'How to Start DCA Into Bitcoin',
      content: '**Step 1:** Choose an exchange that supports recurring purchases (Coinbase, Swan Bitcoin, River, Strike, or Cash App).\n\n**Step 2:** Decide on your investment amount and frequency. Start with what you can comfortably afford — even $25/week is a strong start.\n\n**Step 3:** Set up automatic purchases. Most exchanges offer "recurring buy" features that automate the process.\n\n**Step 4:** Consider self-custody. Once your holdings reach a meaningful amount (e.g., $1,000+), transfer to a hardware wallet for security.\n\n**Step 5:** Track your performance. Use our DCA Calculator to model different scenarios and see how your strategy would have performed historically.',
    },
    {
      id: 'common-mistakes',
      heading: 'Common DCA Mistakes to Avoid',
      content: '**Stopping during bear markets:** This is the worst time to stop DCA. Bear markets are when you accumulate the most Bitcoin per dollar.\n\n**Over-investing:** Only invest money you can afford to leave untouched for 4+ years. DCA doesn\'t protect against investing more than you should. See our guide on [how much Bitcoin you should own](/learn/how-much-bitcoin-should-i-own) for allocation frameworks.\n\n**Ignoring fees:** High [transaction fees](/learn/bitcoin-transaction-fees-explained) can eat into returns. Choose exchanges with low or no fees for recurring purchases.\n\n**Not having an exit strategy:** Decide in advance under what conditions you\'ll sell or rebalance. DCA is an entry strategy, not a complete investment plan. Consider a [HODL strategy](/learn/bitcoin-hodl-strategy-explained) for long-term holding discipline.',
    },
  ],
  howToSteps: [
    { name: 'Set your budget', text: 'Determine how much you can invest regularly (e.g., $100/week)' },
    { name: 'Choose frequency', text: 'Select weekly or monthly recurring purchases' },
    { name: 'Open our DCA Calculator', text: 'Visit the Bitcoin DCA Calculator at bitcoincalculator.tools' },
    { name: 'Enter your parameters', text: 'Input your amount, frequency, and desired time period' },
    { name: 'Analyze results', text: 'Review historical performance and projected outcomes' },
  ],
  speakable: true,
  expertQuote: {
    quote: 'Bitcoin is a savings technology. Dollar-cost averaging into it is the simplest way to opt out of the central-bank-driven destruction of your purchasing power.',
    author: 'Saifedean Ammous',
    role: 'Author, The Bitcoin Standard',
    source: 'https://saifedean.com/thebitcoinstandard',
    sourceLabel: 'saifedean.com',
  },
};

export default article;
