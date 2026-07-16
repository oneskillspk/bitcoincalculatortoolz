import { Article } from '../articles';

const article: Article = {
  slug: 'how-to-calculate-bitcoin-profit-loss',
  title: 'How to Calculate Bitcoin Profit & Loss (Formula + Free Tool)',
  metaDescription: 'Bitcoin P&L formula: (sell price − buy price) × BTC amount − fees. Calculate realized gains, unrealized profit, ROI, and tax liability with our free calculator.',
  category: 'Trading',
  publishedDate: '2026-01-20',
  updatedDate: '2026-01-20',
  readingTime: 6,
  speakable: true,
  keywords: ['bitcoin profit calculator', 'bitcoin profit and loss', 'crypto p&l', 'bitcoin roi'],
  relatedCalculators: ['profit-loss', 'capital-gains-tax', 'investment', 'bitcoin-lot-size'],
  relatedArticles: ['bitcoin-tax-guide-capital-gains', 'bitcoin-vs-gold-sp500', 'bitcoin-leverage-trading-risks', 'bitcoin-hodl-strategy-explained', 'how-to-calculate-average-buy-price-bitcoin', 'how-to-calculate-bitcoin-lot-size'],
  faqs: [
    { question: 'How do I calculate my Bitcoin profit?', answer: 'Bitcoin profit = (Current Value - Total Cost Basis). Your cost basis includes the purchase price plus any transaction fees. If you sold, use the sale price instead of current value.' },
    { question: 'What is unrealized vs realized profit?', answer: 'Unrealized profit is the gain on Bitcoin you still hold (paper gains). Realized profit is the gain from Bitcoin you\'ve actually sold. Only realized profits trigger tax obligations.' },
    { question: 'Do I need to account for fees?', answer: 'Yes. Exchange fees, network fees, and withdrawal fees all reduce your profit. Include them in your cost basis for accurate P&L tracking and tax reporting.' },
    { question: 'How do I calculate Bitcoin ROI?', answer: 'ROI = ((Current Value - Cost Basis) / Cost Basis) × 100. For example, if you bought $1,000 of BTC now worth $3,000, your ROI is 200%.' },
  ],
  sections: [
    { id: 'basic-formula', heading: 'The Basic Bitcoin P&L Formula', content: 'Calculating Bitcoin profit and loss is straightforward at its core:\n\n**Profit/Loss = Sale Price (or Current Value) - Purchase Price - Total Fees**\n\nHowever, real-world Bitcoin P&L gets complex when you factor in:\n• Multiple purchases at different prices\n• Trading fees on both buy and sell sides\n• Network transaction fees for transfers\n• Different accounting methods (FIFO, LIFO, HIFO)\n• Tax implications for realized gains\n\nLet\'s break down each component so you can accurately track your Bitcoin performance.' },
    { id: 'cost-basis', heading: 'Understanding Cost Basis', content: 'Your cost basis is the total amount you paid to acquire Bitcoin, including all fees. This is the foundation of accurate P&L calculation.\n\n**Example:**\n• You buy 0.1 BTC for $5,000\n• Exchange fee: $25 (0.5%)\n• Your cost basis: $5,025\n• Cost basis per BTC: $50,250\n\nIf you made multiple purchases, your overall cost basis depends on which accounting method you use:\n• **FIFO (First In, First Out):** Oldest coins are sold first — most common for tax\n• **LIFO (Last In, First Out):** Newest coins sold first\n• **HIFO (Highest In, First Out):** Most expensive coins sold first — minimizes tax\n\nChoose one method and apply it consistently.', cta: { calculatorId: 'profit-loss', calculatorName: 'Bitcoin Profit & Loss Calculator', text: 'Calculate your exact Bitcoin profit including fees and multiple purchases', path: '/calculators/profit-loss' } },
    { id: 'realized-vs-unrealized', heading: 'Realized vs Unrealized Gains', content: '**Unrealized Gains (Paper Profits):**\nIf you hold 1 BTC bought at $30,000 and the current price is $80,000, your [unrealized gain](https://www.investopedia.com/terms/u/unrealizedgain.asp) is $50,000. This is not a taxable event — you haven\'t sold anything.\n\n**Realized Gains:**\nWhen you sell, trade, or spend Bitcoin, the gain becomes "realized" and typically triggers a tax obligation per [IRS guidance on digital assets](https://www.irs.gov/individuals/international-taxpayers/frequently-asked-questions-on-virtual-currency-transactions). Selling 1 BTC bought at $30,000 for $80,000 creates a $50,000 realized gain.\n\n**Important:** In most jurisdictions, swapping BTC for another cryptocurrency (e.g., BTC → ETH) is also a taxable realization event.' },
    { id: 'tracking-tools', heading: 'Tools for Tracking Bitcoin P&L', content: 'Manually tracking P&L across dozens of trades is error-prone. Here are proven approaches:\n\n**1. Spreadsheet Method:** Create columns for date, amount, price, fees, and running P&L. Works for simple buy-and-hold strategies.\n\n**2. Our Profit & Loss Calculator:** Input your purchase details and current price to instantly see your returns, ROI percentage, and break-even price.\n\n**3. Portfolio Trackers:** Apps like CoinTracker or Koinly automatically import exchange data and calculate P&L across all your wallets and exchanges.\n\n**4. Exchange Reports:** Most major exchanges provide downloadable trade history with P&L summaries.' },
    { id: 'common-mistakes', heading: 'Common P&L Calculation Mistakes', content: '**Forgetting fees:** A 0.5% fee on buy AND sell means your breakeven is already 1% above your entry price. Learn more about [how Bitcoin transaction fees work](/learn/bitcoin-transaction-fees-explained).\n\n**Ignoring transfers:** Moving Bitcoin between wallets incurs network fees that add to your cost basis.\n\n**Mixing accounting methods:** Switching between FIFO and LIFO mid-year creates tax reporting nightmares. Our [Bitcoin tax guide](/learn/bitcoin-tax-guide-capital-gains) covers the details.\n\n**Not tracking every transaction:** Even small [DCA](/learn/what-is-bitcoin-dca) purchases need to be recorded for accurate cost basis calculation.\n\n**Wrong position size on leveraged trades:** P&L math breaks if the initial position was oversized. Use our [Bitcoin lot size](/calculators/bitcoin-lot-size) calculator before entering any leveraged BTC position.\n\n**Ignoring tax-loss harvesting:** If you have losing positions, strategically selling and rebuying can offset gains from winners.', cta: { calculatorId: 'capital-gains-tax', calculatorName: 'Capital Gains Tax Calculator', text: 'Estimate your tax liability from Bitcoin profits', path: '/calculators/capital-gains-tax' } },
  ],
  howToSteps: [
    { name: 'Gather trade history', text: 'Export your complete transaction history from all exchanges and wallets' },
    { name: 'Calculate cost basis', text: 'Add up purchase prices plus all fees for each Bitcoin acquisition' },
    { name: 'Open the P&L Calculator', text: 'Visit our Bitcoin Profit & Loss Calculator tool' },
    { name: 'Enter your data', text: 'Input purchase price, amount, fees, and current/sale price' },
    { name: 'Review your results', text: 'See your total profit/loss, ROI percentage, and break-even price' },
  ],
  expertQuote: {
    quote: 'Taxpayers must report all digital asset transactions on their income tax return — gains, losses, and the cost basis used to calculate them.',
    author: 'Internal Revenue Service',
    role: 'U.S. Tax Authority',
    source: 'https://www.irs.gov/businesses/small-businesses-self-employed/digital-assets',
    sourceLabel: 'irs.gov digital assets',
  },
};

export default article;
