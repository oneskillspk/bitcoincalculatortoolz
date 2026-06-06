import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-transaction-fees-explained',
  title: 'Bitcoin Transaction Fees Explained: How to Pay Less',
  metaDescription: 'Bitcoin fees are set by network congestion and byte size. SegWit cuts fees by up to 40%. Transacting on weekends costs less. Estimate your fee free.',
  category: 'Basics',
  publishedDate: '2026-02-09',
  updatedDate: '2026-02-09',
  readingTime: 6,
  keywords: ['bitcoin transaction fees', 'btc fees', 'bitcoin fees how much', 'bitcoin network fee', 'bitcoin fee calculator', 'how to reduce bitcoin fees'],
  relatedCalculators: ['transaction-fees', 'lightning', 'bitcoin-converter'],
  relatedArticles: ['what-is-a-satoshi', 'bitcoin-halving-explained', 'bitcoin-mining-profitability-2026'],
  faqs: [
    { question: 'How much is a Bitcoin transaction fee?', answer: 'Bitcoin fees vary based on network congestion. In 2026, typical fees range from $0.50-$5 for standard transactions and $0.10-$1 for low-priority transactions. During high congestion, fees can spike to $20+. Use our fee estimator for real-time estimates.' },
    { question: 'Why are Bitcoin fees so high sometimes?', answer: 'Bitcoin fees are determined by supply and demand for block space. Each block has limited capacity (~4MB). When many users want to transact simultaneously, they bid higher fees to get included faster, causing fee spikes.' },
    { question: 'How can I reduce Bitcoin transaction fees?', answer: 'Use SegWit or Taproot addresses, batch transactions, transact during off-peak hours (weekends, early UTC mornings), use the Lightning Network for small payments, and set a custom fee rate during low-urgency transfers.' },
    { question: 'Do Bitcoin fees go to miners?', answer: 'Yes. Transaction fees go entirely to the miner who includes your transaction in a block. Fees are an increasingly important part of miner revenue, especially after each halving reduces the block subsidy.' },
  ],
  sections: [
    {
      id: 'how-fees-work',
      heading: 'How Bitcoin Transaction Fees Work',
      content: 'Every Bitcoin transaction requires a fee paid to miners for including it in a block. Unlike traditional payment processors that charge a percentage, **Bitcoin fees are based on data size, not transaction value.**\n\nSending $10 or $10,000,000 in Bitcoin costs the same fee — it depends only on how much block space your transaction occupies (measured in virtual bytes, or vBytes).\n\nWhen you broadcast a transaction, it enters the **mempool** — a waiting room of unconfirmed transactions. Miners prioritize transactions with higher fee rates (sats/vByte). During quiet periods, even 1 sat/vByte may suffice. During bull runs, you might need 50+ sats/vByte for fast confirmation.'
    },
    {
      id: 'fee-factors',
      heading: 'What Determines Your Fee',
      content: 'Several factors affect how much you pay:\n\n• **Transaction size (vBytes):** More inputs and outputs = larger transaction = higher fee. A simple send might be 140 vBytes; a transaction consolidating many small UTXOs could be 500+ vBytes.\n• **Network congestion:** The mempool depth determines competitive fee rates. When blocks are full, fees rise.\n• **Address type:** SegWit (bc1q...) and Taproot (bc1p...) addresses use less block space than legacy addresses (1...), reducing fees by 30-40%.\n• **Confirmation speed:** You can pay less for slower confirmation. A transaction with a low fee may take hours or days but will eventually confirm when congestion drops.\n\n| Priority | Typical Wait | Fee Range (2026) |\n|---|---|---|\n| High (next block) | ~10 minutes | 20-100+ sats/vB |\n| Medium (1-3 blocks) | 10-30 minutes | 5-20 sats/vB |\n| Low (6+ blocks) | 1-6 hours | 1-5 sats/vB |\n| Economy | Hours to days | 1-2 sats/vB |',
      cta: { calculatorId: 'transaction-fees', calculatorName: 'Bitcoin Transaction Fee Estimator', text: 'Estimate your transaction fee based on current network conditions', path: '/calculators/transaction-fees' }
    },
    {
      id: 'reduce-fees',
      heading: 'How to Reduce Your Bitcoin Fees',
      content: 'Practical strategies to minimize what you pay:\n\n• **Use SegWit/Taproot addresses.** Switching from legacy (1...) to native SegWit (bc1q...) or Taproot (bc1p...) reduces fees by 30-40%. Most modern wallets use these by default.\n• **Time your transactions.** Fees are lowest on weekends and during Asian/European night hours (roughly 00:00-08:00 UTC). Avoid transacting during price pumps or crashes.\n• **Batch transactions.** If sending to multiple recipients, batch them into a single transaction. This shares the overhead and reduces total fees by 50-80%.\n• **Use Lightning for small payments.** The Lightning Network enables near-instant transfers for fractions of a cent. Ideal for amounts under $1,000.\n• **Set custom fee rates.** Don\'t use the default "fast" setting. For non-urgent transfers, manually set a lower fee rate and wait.',
      cta: { calculatorId: 'lightning', calculatorName: 'Lightning Network Calculator', text: 'Compare on-chain fees vs Lightning Network costs', path: '/calculators/lightning' }
    },
    {
      id: 'fees-and-halving',
      heading: 'Fees and the Bitcoin Halving',
      content: 'Bitcoin\'s block reward halves roughly every 4 years. As the subsidy decreases, **transaction fees become a larger share of miner revenue.** After the 2024 halving, the block subsidy dropped to 3.125 BTC. By 2028, it will drop to 1.5625 BTC.\n\nThis means long-term fee trends are likely **upward** as:\n1. Adoption increases demand for block space\n2. Miners require fee revenue to remain profitable — see our [mining profitability analysis](/learn/bitcoin-mining-profitability-2026)\n3. Layer-2 solutions handle small transactions, leaving on-chain for high-value settlement\n\nUnderstanding this trend helps you plan: use on-chain for large, important transactions and Lightning or other layer-2 solutions for everyday payments. For more on how halvings affect the Bitcoin ecosystem, read our [Bitcoin halving explainer](/learn/bitcoin-halving-explained).'
    },
    {
      id: 'fee-myths',
      heading: 'Common Fee Myths Debunked',
      content: '• **Myth: "Bitcoin fees are always expensive."** Reality: Median on-chain fees in 2026 are typically $0.50-$2. Lightning fees are under $0.01. Bitcoin is one of the cheapest ways to send large amounts of money globally.\n• **Myth: "Higher fees = faster confirmation."** Reality: You only need to outbid other mempool transactions. Overpaying doesn\'t speed things up beyond the next block (~10 min).\n• **Myth: "Fees are percentage-based like credit cards."** Reality: A $1 million Bitcoin transfer costs the same fee as a $100 transfer — it\'s based on data size, not value.\n• **Myth: "Fees are wasted money."** Reality: Fees secure the network by incentivizing miners. They\'re the cost of using the most secure, decentralized monetary network in history.'
    },
  ],
  howToSteps: [
    { name: 'Understand fee structure', text: 'Learn that Bitcoin fees are based on transaction data size (vBytes), not the amount being sent' },
    { name: 'Check current fee rates', text: 'Visit our Transaction Fee Estimator to see real-time fee estimates for different priority levels' },
    { name: 'Choose the right address type', text: 'Use SegWit (bc1q) or Taproot (bc1p) addresses for 30-40% fee savings over legacy addresses' },
    { name: 'Select your priority', text: 'Choose high, medium, or low priority based on how urgently you need confirmation' },
    { name: 'Consider Lightning for small amounts', text: 'For transactions under $1,000, use the Lightning Network for near-zero fees' },
  ],
};

export default article;
