import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-tax-guide-capital-gains',
  title: 'Bitcoin Capital Gains Tax: Rates, Filing & Calculation',
  metaDescription: 'How is Bitcoin taxed? Learn short-term vs long-term capital gains rates, FIFO vs LIFO cost basis, and how to calculate your crypto tax bill. Free tool.',
  category: 'Tax',
  publishedDate: '2026-02-05',
  updatedDate: '2026-03-10',
  readingTime: 9,
  keywords: ['bitcoin tax', 'crypto capital gains', 'bitcoin tax calculator', 'crypto taxes'],
  relatedCalculators: ['capital-gains-tax', 'profit-loss', 'investment', 'bitcoin-zakat'],
  relatedArticles: ['how-to-calculate-bitcoin-profit-loss', 'what-is-bitcoin-dca', 'bitcoin-leverage-trading-risks', 'bitcoin-hodl-strategy-explained', 'how-to-calculate-average-buy-price-bitcoin', 'zakat-on-bitcoin-guide', 'bitcoin-calculator-comparison'],
  faqs: [
    { question: 'Do I have to pay taxes on Bitcoin?', answer: 'In most countries (including the US, UK, Canada, Australia), yes. Bitcoin is treated as property, and selling, trading, or spending it triggers a capital gains tax event on any profit.' },
    { question: 'What is the tax rate on Bitcoin gains?', answer: 'In the US, short-term gains (held <1 year) are taxed as ordinary income (10-37%). Long-term gains (held >1 year) are taxed at preferential rates (0%, 15%, or 20% depending on income).' },
    { question: 'Is holding Bitcoin taxable?', answer: 'No. Simply holding (HODLing) Bitcoin is not a taxable event. Taxes are only triggered when you sell, trade, spend, or gift Bitcoin above the annual exclusion amount.' },
    { question: 'Can I offset Bitcoin losses against gains?', answer: 'Yes. Capital losses from Bitcoin can offset capital gains from other investments. In the US, you can also deduct up to $3,000 in net capital losses against ordinary income annually.' },
  ],
  sections: [
    { id: 'taxable-events', heading: 'What Bitcoin Events Are Taxable?', content: 'Not every Bitcoin activity triggers taxes. The [IRS treats cryptocurrency as property](https://www.irs.gov/individuals/international-taxpayers/frequently-asked-questions-on-virtual-currency-transactions), not currency — meaning capital gains rules apply. For a broader overview, see the [Wikipedia cryptocurrency article](https://en.wikipedia.org/wiki/Cryptocurrency#Legality) and [Investopedia\'s crypto tax guide](https://www.investopedia.com/articles/investing/040515/are-there-taxes-bitcoins.asp). Here\'s the breakdown:\n\n**Taxable events:**\n• Selling Bitcoin for fiat currency (USD, EUR, etc.)\n• Trading Bitcoin for another cryptocurrency\n• Spending Bitcoin to purchase goods or services\n• Receiving Bitcoin as payment for work (taxed as income)\n• Mining rewards (taxed as income at fair market value when received)\n\n**Non-taxable events:**\n• Buying Bitcoin with fiat currency\n• Holding Bitcoin\n• Transferring Bitcoin between your own wallets\n• Donating Bitcoin to qualified charities\n• Gifting Bitcoin (below annual exclusion limits)' },
    { id: 'short-vs-long-term', heading: 'Short-Term vs Long-Term Capital Gains', content: 'The distinction between short-term and long-term gains is one of the most impactful tax planning decisions for Bitcoin investors.\n\n**Short-term gains (held less than 1 year):**\n• Taxed at your ordinary income tax rate\n• Rates range from 10% to 37% in the US\n• Day traders and frequent sellers face the highest rates\n\n**Long-term gains (held more than 1 year):**\n• Taxed at preferential rates: 0%, 15%, or 20%\n• Most taxpayers qualify for the 15% rate\n• Significant tax savings — up to 22% lower than short-term rates\n\n**Strategy:** Whenever possible, hold Bitcoin for at least one year before selling to qualify for long-term capital gains rates. This single decision can save thousands in taxes.', cta: { calculatorId: 'capital-gains-tax', calculatorName: 'Capital Gains Tax Calculator', text: 'Calculate your Bitcoin capital gains tax liability', path: '/calculators/capital-gains-tax' } },
    { id: 'calculating-gains', heading: 'How to Calculate Your Bitcoin Capital Gains', content: 'The formula is:\n\n**Capital Gain = Sale Price - Cost Basis - Fees**\n\nYour cost basis includes:\n• The price you paid for the Bitcoin\n• Any exchange or [transaction fees](/learn/bitcoin-transaction-fees-explained) paid during purchase\n• Network fees for the acquisition transaction\n\nExample:\n• Bought 0.5 BTC for $25,000 + $50 fee in March 2025\n• Sold 0.5 BTC for $45,000 - $45 fee in July 2026\n• Cost basis: $25,050\n• Net proceeds: $44,955\n• Capital gain: $19,905\n• Held >1 year → long-term capital gains rate applies\n\nFor a detailed walkthrough including FIFO, LIFO, and HIFO methods, read our [Bitcoin profit and loss guide](/learn/how-to-calculate-bitcoin-profit-loss).' },
    { id: 'tax-strategies', heading: 'Bitcoin Tax Optimization Strategies', content: '**1. Hold for long-term rates:** The simplest strategy — hold at least 1 year to access lower tax rates.\n\n**2. Tax-loss harvesting:** Sell losing positions to realize losses that offset gains. You can rebuy immediately (no wash sale rule for crypto in most jurisdictions as of 2026).\n\n**3. Use HIFO accounting:** "Highest In, First Out" means selling your most expensive lots first, minimizing taxable gains.\n\n**4. Donate appreciated Bitcoin:** Donating Bitcoin held over 1 year lets you deduct the fair market value and avoid capital gains tax entirely.\n\n**5. Retirement accounts:** Some platforms allow Bitcoin purchases within IRAs, where gains grow tax-deferred or tax-free (Roth IRA).\n\n**6. Gifting:** In the US, you can gift up to $18,000 per person per year without triggering gift tax.' },
    { id: 'reporting', heading: 'How to Report Bitcoin on Your Taxes', content: 'In the US, Bitcoin taxes are reported on:\n\n• **Form 8949:** Lists each cryptocurrency transaction with purchase date, sale date, proceeds, cost basis, and gain/loss\n• **Schedule D:** Summarizes total capital gains and losses from Form 8949\n• **Schedule 1:** Reports mining income, staking rewards, or crypto earned as payment\n• **Form 1040:** The checkbox at the top asking about digital assets must be answered truthfully\n\n**Record-keeping tips:**\n• Export trade history from every exchange you\'ve used\n• Track wallet-to-wallet transfers to avoid double-counting\n• Use crypto tax software (CoinTracker, Koinly, TaxBit) for automated reporting\n• Keep records for at least 7 years' },
  ],
  howToSteps: [
    { name: 'Determine holding period', text: 'Check whether you held your Bitcoin for more or less than 1 year' },
    { name: 'Calculate cost basis', text: 'Add up your purchase price plus all fees' },
    { name: 'Open the Tax Calculator', text: 'Visit our Bitcoin Capital Gains Tax Calculator' },
    { name: 'Enter transaction details', text: 'Input purchase price, sale price, holding period, and your income bracket' },
    { name: 'Review tax liability', text: 'See your estimated capital gains tax and effective rate' },
  ],
  expertQuote: {
    quote: 'If you sell crypto for more than you paid, the difference is a capital gain — taxed like a stock or a house. The IRS treats virtual currency as property, not currency.',
    author: 'Internal Revenue Service',
    role: 'U.S. Tax Authority',
    source: 'https://www.irs.gov/businesses/small-businesses-self-employed/digital-assets',
    sourceLabel: 'irs.gov',
  },
};

export default article;
