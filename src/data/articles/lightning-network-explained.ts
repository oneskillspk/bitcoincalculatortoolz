import { Article } from '../articles';

const article: Article = {
  slug: 'lightning-network-explained',
  title: 'Lightning Network Explained: Instant Bitcoin Payments in 2026',
  metaDescription: 'The Lightning Network is a Bitcoin layer-2 that settles payments in under a second for fractions of a cent. Learn how channels, routing, and liquidity work.',
  category: 'Basics',
  publishedDate: '2026-07-26',
  updatedDate: '2026-07-26',
  readingTime: 7,
  keywords: ['lightning network explained', 'what is lightning network', 'bitcoin layer 2', 'lightning payments', 'lightning channels'],
  relatedCalculators: ['lightning', 'transaction-fees', 'bitcoin-converter'],
  relatedArticles: ['bitcoin-transaction-fees-explained', 'what-is-a-satoshi', 'bitcoin-halving-explained'],
  quickAnswer: 'The Lightning Network is a Bitcoin layer-2 protocol that moves payments off-chain through pre-funded payment channels. It settles transfers in under a second for sub-cent fees, then anchors the final balance back to the base chain — giving Bitcoin the throughput needed for everyday spending without changing the base layer.',
  faqs: [
    { question: 'What is the Lightning Network in simple terms?', answer: 'The Lightning Network is a payment layer built on top of Bitcoin. Two parties open a shared "channel" funded with on-chain BTC, then exchange unlimited instant payments off-chain. Only the opening and closing transactions touch the main blockchain, so fees stay near zero and confirmations feel instant.' },
    { question: 'Is Lightning safer than on-chain Bitcoin?', answer: 'Lightning inherits Bitcoin\'s base-layer security but adds channel-management risk: you must stay online (or use a watchtower) to detect a counterparty broadcasting an old channel state. For amounts you\'d normally hold in cash, this trade-off is acceptable. For life-savings, keep them on-chain in cold storage.' },
    { question: 'How much does a Lightning payment cost?', answer: 'Routing fees are typically 1 satoshi + 0.01% of the amount — often well under $0.01 for a $100 payment. Opening or closing a channel still requires a normal on-chain fee, so Lightning is cheapest when you keep a channel open and reuse it.' },
    { question: 'Do I need to run my own Lightning node?', answer: 'No. Custodial wallets (Wallet of Satoshi, Cash App) hide the complexity. Non-custodial mobile wallets (Phoenix, Muun, Breez) run a light node for you. Full sovereignty requires running your own node (Umbrel, Start9, Voltage), which also lets you earn routing fees.' },
  ],
  sections: [
    { id: 'how-lightning-works', heading: 'How the Lightning Network Works', content: 'Lightning uses **payment channels** — 2-of-2 multisig addresses funded on-chain by two participants. Once open, both parties sign updated balance states off-chain; each new signature invalidates the previous one. Because either party can broadcast the latest state to the blockchain at any time, the channel is trustless.\n\nWhen you pay a stranger, your payment is **routed** through connected channels until it reaches the recipient. Hashed Time-Locked Contracts (HTLCs) guarantee that either the full payment succeeds or every hop refunds — no intermediate node can steal funds.\n\nAs of mid-2026, the public Lightning Network has ~5,300 BTC of routable capacity across ~50,000 channels — enough for the vast majority of retail payments.' },
    { id: 'fees-and-speed', heading: 'Fees, Speed & Real-World Use', content: 'A typical Lightning payment settles in **under one second** and costs **a few sats** — often less than 1/1000th of an on-chain fee. Compare a $50 coffee-shop payment:\n\n| Layer | Fee | Confirmation |\n|---|---|---|\n| On-chain BTC (fast) | $2–$8 | 10–30 minutes |\n| On-chain BTC (economy) | $0.50–$2 | 1–24 hours |\n| Lightning | < $0.01 | < 1 second |\n\nEl Salvador\'s Chivo wallet, Strike, and Cash App all use Lightning for cross-border remittances. A $200 transfer from the US to a family member in Latin America costs pennies on Lightning versus $10–$20 through Western Union.', cta: { calculatorId: 'lightning', calculatorName: 'Lightning vs On-Chain Fee Calculator', text: 'Compare Lightning fees to on-chain Bitcoin fees for any amount', path: '/calculators/lightning' } },
    { id: 'channels-liquidity', heading: 'Channels, Liquidity & Inbound Capacity', content: 'A channel has two sides: your **outbound liquidity** (what you can send) and your **inbound liquidity** (what you can receive). New wallets usually have zero inbound liquidity — you cannot be paid until someone opens a channel to you or you buy inbound capacity from a service like Lightning Loop or Amboss Magma.\n\nModern wallets (Phoenix, Breez) automate this by opening a channel the first time you receive a payment, deducting the on-chain fee from the incoming amount. Advanced users manage liquidity manually to earn routing fees or lower spending costs.' },
    { id: 'risks-and-limits', heading: 'Risks, Trade-Offs & What Lightning Is Not', content: 'Lightning is not a replacement for on-chain Bitcoin — it complements it. Key trade-offs to understand:\n\n• **Online requirement.** You (or a watchtower) must be online to punish a cheating counterparty. Sleeping funds are safer on-chain.\n• **Channel capacity limits.** A channel can\'t route more than its balance in one direction. Very large payments still prefer on-chain.\n• **Custodial risk on easy wallets.** Wallet of Satoshi and Cash App hold your keys — they can freeze funds. Use them for spending money only.\n• **Routing failures.** Payments occasionally fail to route through the graph, especially for uncommon amounts or destinations with thin liquidity.\n\nFor everyday coffee, tips, and remittances, Lightning is production-ready. For your long-term stack, cold storage on-chain remains the standard.' },
  ],
  howToSteps: [
    { name: 'Choose a Lightning wallet', text: 'Pick a non-custodial wallet like Phoenix, Breez, or Muun for a balance of ease and self-custody.' },
    { name: 'Fund the wallet', text: 'Send on-chain BTC to the wallet\'s deposit address. The wallet auto-opens a Lightning channel on first use.' },
    { name: 'Receive or scan an invoice', text: 'Every Lightning payment uses a one-time invoice (BOLT11) or a static Lightning Address (user@domain.com).' },
    { name: 'Confirm and settle', text: 'The payment routes through the network and settles in under a second. No confirmations required.' },
    { name: 'Manage liquidity as you grow', text: 'For large recurring receives, add inbound liquidity via Loop, Magma, or a paid channel from your wallet provider.' },
  ],
  expertQuote: {
    quote: 'The Lightning Network is the answer to Bitcoin\'s scaling question — not by making the base layer bigger, but by moving small payments off it.',
    author: 'Elizabeth Stark',
    role: 'CEO, Lightning Labs',
    source: 'https://lightning.engineering/posts/2018-03-15-lnd-0.4-beta/',
    sourceLabel: 'Lightning Labs release notes',
  },
  speakable: true,
};

export default article;
