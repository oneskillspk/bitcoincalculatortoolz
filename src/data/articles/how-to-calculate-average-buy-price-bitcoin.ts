import { Article } from '../articles';

const article: Article = {
  slug: 'how-to-calculate-average-buy-price-bitcoin',
  title: 'How to Calculate Your Bitcoin Average Buy Price',
  metaDescription: 'FIFO is the IRS default for Bitcoin cost basis. Since Jan 2025, per-wallet tracking is required. Learn FIFO, LIFO, HIFO, and weighted average methods free.',
  quickAnswer: 'Average buy price = total USD spent ÷ total BTC acquired. Example: three buys of $1,000 at $60K, $80K, and $100K give you 0.01667 + 0.0125 + 0.01 = 0.03917 BTC for $3,000 — average price $76,600. This is your true cost basis for tax and profit/loss reporting, not the price on your last buy.',
  category: 'Investing',
  publishedDate: '2026-03-09',
  updatedDate: '2026-03-09',
  readingTime: 8,
  keywords: ['bitcoin average buy price', 'bitcoin cost basis calculator', 'weighted average price bitcoin', 'average purchase price BTC', 'crypto cost basis', 'FIFO LIFO bitcoin', 'bitcoin break even price'],
  relatedCalculators: ['average-buy-price', 'capital-gains-tax', 'profit-loss'],
  relatedArticles: ['how-to-calculate-bitcoin-profit-loss', 'bitcoin-tax-guide-capital-gains', 'bitcoin-calculation-formulas'],
  faqs: [
    {
      question: 'What is the average buy price for Bitcoin?',
      answer: 'The average buy price (also called cost basis) is the weighted average price you paid per Bitcoin across all your purchases. It accounts for both the amount of BTC bought and the price paid in each transaction, giving you a single reference price to measure profit or loss.'
    },
    {
      question: 'How do I calculate my Bitcoin average buy price?',
      answer: 'Divide your total amount spent (including fees) by the total amount of Bitcoin received. For example, if you spent $5,000 across three purchases and received 0.08 BTC total, your average buy price is $5,000 ÷ 0.08 = $62,500 per BTC. Use our free average buy price calculator for instant results.'
    },
    {
      question: 'Should I include fees when calculating my Bitcoin cost basis?',
      answer: 'Yes. Transaction fees, exchange fees, and network fees should all be included in your total cost. The IRS and most tax authorities consider fees part of your cost basis, which reduces your taxable gain when you eventually sell.'
    },
    {
      question: 'What is the difference between FIFO and weighted average for Bitcoin?',
      answer: 'FIFO (First In, First Out) assumes you sell the oldest coins first, which can result in higher or lower gains depending on price trends. Weighted average blends all purchases into a single cost basis. FIFO is required for tax reporting in many jurisdictions, while weighted average is simpler for personal tracking.'
    }
  ],
  howToSteps: [
    { name: 'Gather your purchase history', text: 'Collect all Bitcoin buy transactions including date, amount of BTC purchased, price per BTC, and any fees paid. Export this from your exchange or wallet.' },
    { name: 'Calculate total cost', text: 'Add up the total USD (or fiat) spent across all purchases, including transaction fees and exchange fees for each buy order.' },
    { name: 'Calculate total BTC received', text: 'Sum the total Bitcoin received across all purchases. Make sure to use the net amount after any withdrawal fees.' },
    { name: 'Divide total cost by total BTC', text: 'Your average buy price equals total cost divided by total BTC. For example: $10,000 total spent ÷ 0.15 BTC = $66,666.67 average buy price.' },
    { name: 'Use the calculator for accuracy', text: 'Enter your transactions into the Bitcoin Average Buy Price Calculator to get an instant, accurate weighted average that accounts for all fees and varying purchase sizes.' }
  ],
  sections: [
    {
      id: 'what-is-average-buy-price',
      heading: 'What Is Average Buy Price for Bitcoin?',
      content: 'Your **Bitcoin average buy price** — also known as your **[cost basis](https://www.investopedia.com/terms/c/costbasis.asp)** — is the [weighted average](https://en.wikipedia.org/wiki/Weighted_arithmetic_mean) price you paid per BTC across all your purchases. Unlike a simple average that treats every transaction equally, the weighted average accounts for how much Bitcoin you bought at each price point.\n\nFor example, if you bought 0.05 BTC at $40,000 and 0.10 BTC at $70,000, your average buy price is not simply $55,000. The larger purchase at $70,000 carries more weight, pulling your true average to $60,000. Understanding this number is critical for measuring your **unrealized profit or loss**, setting sell targets, and preparing accurate [tax reports](/learn/bitcoin-tax-guide-capital-gains).\n\nMost exchanges show your average cost per coin, but if you buy across multiple platforms or use self-custody wallets, you need to calculate it manually — or use our [Average Buy Price Calculator](/calculators/average-buy-price) to do it instantly.'
    },
    {
      id: 'weighted-average-formula',
      heading: 'The Weighted Average Formula',
      content: 'The **weighted average price formula** for Bitcoin is straightforward:\n\n**Average Buy Price = Total Amount Spent ÷ Total BTC Received**\n\nHere is the math broken down:\n\n• **Total Amount Spent** = Sum of (Price × Quantity + Fees) for each purchase\n• **Total BTC Received** = Sum of all BTC quantities purchased\n\nThis formula works regardless of how many transactions you have. It naturally gives more weight to larger purchases, which is why it is called a **weighted average** rather than a simple arithmetic mean.\n\nFor investors using [Dollar Cost Averaging (DCA)](/learn/what-is-bitcoin-dca), this formula automatically captures the benefit of buying more BTC when prices are low and less when prices are high — smoothing your cost basis over time.'
    },
    {
      id: 'step-by-step-example',
      heading: 'Step-by-Step Calculation Example',
      content: 'Let us walk through a real-world example with three purchases:\n\n| Purchase | Date | BTC Amount | Price per BTC | Fees | Total Cost |\n|----------|------|-----------|--------------|------|------------|\n| 1 | Jan 2025 | 0.02 BTC | $42,000 | $5 | $845 |\n| 2 | Apr 2025 | 0.05 BTC | $58,000 | $12 | $2,912 |\n| 3 | Sep 2025 | 0.03 BTC | $71,000 | $8 | $2,138 |\n\n**Step 1**: Total Cost = $845 + $2,912 + $2,138 = **$5,895**\n\n**Step 2**: Total BTC = 0.02 + 0.05 + 0.03 = **0.10 BTC**\n\n**Step 3**: Average Buy Price = $5,895 ÷ 0.10 = **$58,950 per BTC**\n\nIf Bitcoin is currently trading at $85,000, your **unrealized profit** is ($85,000 − $58,950) × 0.10 = **$2,605**. You can verify this instantly with our [Profit & Loss Calculator](/calculators/profit-loss).',
      cta: {
        calculatorId: 'average-buy-price',
        calculatorName: 'Average Buy Price Calculator',
        text: 'Calculate your exact Bitcoin average buy price',
        path: '/calculators/average-buy-price'
      }
    },
    {
      id: 'fifo-lifo-weighted',
      heading: 'FIFO vs LIFO vs Weighted Average',
      content: 'When it comes to **Bitcoin cost basis accounting**, there are three primary methods:\n\n**FIFO (First In, First Out)** assumes you sell your oldest Bitcoin first. If your early purchases were at lower prices, FIFO typically results in higher capital gains. This is the **default method required by the IRS** for crypto tax reporting in the United States.\n\n**LIFO (Last In, First Out)** assumes you sell your most recently purchased Bitcoin first. In a rising market, LIFO can reduce your taxable gain because recent purchases may be at higher prices. However, LIFO is not accepted by all tax jurisdictions.\n\n**Weighted Average** blends all purchases into a single cost basis. It is the simplest method for tracking and is accepted in some countries (like the UK for pooled assets).\n\n| Method | Best For | Tax Impact | Accepted By |\n|--------|----------|-----------|-------------|\n| FIFO | US taxpayers | Higher gains in bull markets | IRS, most jurisdictions |\n| LIFO | Tax optimization | Lower gains in rising markets | Select jurisdictions |\n| Weighted Average | Simple tracking | Middle ground | UK, Australia, others |\n\nRegardless of method, accurate record-keeping is essential. Our [Capital Gains Tax Calculator](/calculators/capital-gains-tax) supports all three methods.'
    },
    {
      id: 'cost-basis-taxes',
      heading: 'Why Cost Basis Matters for Taxes',
      content: 'Your **Bitcoin cost basis** directly determines how much **capital gains tax** you owe when you sell. The formula is simple: **Taxable Gain = Selling Price − Cost Basis**. A higher cost basis means lower taxable gains.\n\nHere is why getting your cost basis right matters:\n\n• **Short-term vs long-term rates**: Bitcoin held for less than one year is taxed as ordinary income (up to 37% in the US). Holdings over one year qualify for **long-term capital gains rates** (0%, 15%, or 20%). Your cost basis determines whether your gain crosses key tax brackets.\n\n• **Tax-loss harvesting**: If your average buy price is above the current market price, you have an **unrealized loss**. Selling and repurchasing (where legal) can offset other gains. Read our full [Bitcoin Tax Guide](/learn/bitcoin-tax-guide-capital-gains) for strategies.\n\n• **Audit protection**: The IRS requires you to report your cost basis on Form 8949. Inaccurate cost basis reporting is one of the most common crypto tax audit triggers.\n\nUse our [Bitcoin calculation formulas guide](/learn/bitcoin-calculation-formulas) to understand the exact math behind profit, loss, and tax calculations.',
      cta: {
        calculatorId: 'capital-gains-tax',
        calculatorName: 'Capital Gains Tax Calculator',
        text: 'Estimate your Bitcoin capital gains tax',
        path: '/calculators/capital-gains-tax'
      }
    },
    {
      id: 'common-mistakes',
      heading: 'Common Mistakes to Avoid',
      content: 'Calculating your **Bitcoin average buy price** seems simple, but these mistakes can lead to inaccurate results and tax problems:\n\n• **Ignoring fees**: Exchange fees, network fees, and spread costs are part of your cost basis. Excluding them understates your true purchase price and overstates your taxable gain.\n\n• **Mixing exchange and wallet data**: If you buy on multiple exchanges and transfer to a hardware wallet, you need to track the original purchase price — not the transfer price. Blockchain transactions do not record your cost basis.\n\n• **Using simple average instead of weighted average**: A simple average of your purchase prices ignores position sizing. If you bought $100 at $40,000 and $10,000 at $70,000, the simple average ($55,000) drastically understates your true cost basis ($69,703).\n\n• **Forgetting gifted or earned Bitcoin**: Bitcoin received as gifts, mining rewards, or payment has a cost basis equal to its **fair market value** at the time of receipt. This is often missed.\n\n• **Not updating after sells**: When you sell a portion of your BTC, your remaining cost basis changes depending on whether you use FIFO, LIFO, or weighted average. Always recalculate after partial sells.\n\nAvoid all these errors by using our [Average Buy Price Calculator](/calculators/average-buy-price), which handles fees, multiple transactions, and method selection automatically.'
    }
  ]
};

export default article;
