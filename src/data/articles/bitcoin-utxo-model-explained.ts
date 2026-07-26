import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-utxo-model-explained',
  title: 'Bitcoin UTXO Model Explained: Why BTC Isn\'t Like a Bank Balance',
  metaDescription: 'Bitcoin doesn\'t use account balances — it uses UTXOs (Unspent Transaction Outputs). Learn how UTXOs work, why they matter for fees, privacy, and coin control.',
  category: 'Basics',
  publishedDate: '2026-07-26',
  updatedDate: '2026-07-26',
  readingTime: 7,
  keywords: ['bitcoin utxo model', 'utxo explained', 'what is a utxo', 'unspent transaction output', 'bitcoin coin control'],
  relatedCalculators: ['transaction-fees', 'lightning', 'bitcoin-converter'],
  relatedArticles: ['bitcoin-transaction-fees-explained', 'what-is-a-satoshi', 'lightning-network-explained'],
  quickAnswer: 'Bitcoin uses the UTXO (Unspent Transaction Output) model instead of account balances. Your wallet balance is really the sum of individual coin fragments you received in past transactions. Every send consumes whole UTXOs and creates new ones as outputs, which is why Bitcoin fees depend on the number and size of UTXOs, not on the dollar amount you send.',
  faqs: [
    { question: 'What is a UTXO in Bitcoin?', answer: 'A UTXO is an Unspent Transaction Output — a discrete chunk of Bitcoin received in a previous transaction and not yet spent. Your wallet balance is the sum of every UTXO your addresses control. When you send BTC, the wallet consumes whole UTXOs as inputs and creates new UTXOs as outputs, including a "change" UTXO back to yourself.' },
    { question: 'Why does Bitcoin use UTXOs instead of account balances?', answer: 'The UTXO model is trivially parallelizable, easy to verify, and preserves strong privacy properties. Each transaction is fully self-contained and provable without global state, which is why Bitcoin can be independently validated by every full node without a central database.' },
    { question: 'How do UTXOs affect Bitcoin transaction fees?', answer: 'Fees depend on transaction size in vBytes, and every UTXO you spend adds ~68–148 vBytes to the transaction. A wallet with 30 tiny UTXOs pays much more to consolidate than a wallet with 3 large UTXOs, even for the same total amount. That is why coin control and UTXO management matter for cost-conscious users.' },
    { question: 'What is UTXO consolidation and when should I do it?', answer: 'Consolidation combines many small UTXOs into one large UTXO by sending them to yourself in a single transaction. Do it when fees are very low (evenings/weekends at 1–3 sats/vB) — it prevents you from paying huge fees during the next fee spike when you actually need to send.' },
  ],
  sections: [
    { id: 'what-is-utxo', heading: 'What a UTXO Actually Is', content: 'In the Ethereum model, an account has a balance stored in global state: "Alice: 3.5 ETH." Bitcoin does not work that way. Instead, every Bitcoin transaction produces one or more **outputs** — chunks of BTC assigned to specific addresses. Those outputs sit on the blockchain waiting to be spent. Once spent, they are gone forever and new outputs take their place.\n\nYour "balance" is not a number stored anywhere. It is the sum of every UTXO your wallet\'s addresses control. If someone paid you 0.3 BTC last month and another 0.2 BTC last week, your wallet holds two UTXOs (0.3 and 0.2) that together display as 0.5 BTC.' },
    { id: 'how-sends-work', heading: 'How a Send Actually Works', content: 'Say you have three UTXOs — 0.10, 0.05, and 0.02 BTC — and you want to send 0.12 BTC. Your wallet must consume **whole** UTXOs. It picks the 0.10 + 0.05 = 0.15 BTC, sends 0.12 to the recipient, and creates a **change UTXO** of 0.03 BTC back to a fresh address you control. The 0.02 BTC UTXO stays untouched.\n\n| Field | Value |\n|---|---|\n| Inputs (UTXOs consumed) | 0.10 + 0.05 = 0.15 BTC |\n| Output to recipient | 0.12 BTC |\n| Change output | 0.03 BTC − fee |\n| Fee | Depends on vBytes, not dollars |\n\nThis is why Bitcoin transactions have "change addresses" — the protocol has no concept of partial spending. See our [transaction fees guide](/learn/bitcoin-transaction-fees-explained) for how vBytes translate into cost.', cta: { calculatorId: 'transaction-fees', calculatorName: 'Bitcoin Transaction Fee Estimator', text: 'Estimate the cost of consolidating or sending your UTXOs', path: '/calculators/transaction-fees' } },
    { id: 'utxos-and-fees', heading: 'UTXOs, Fees & Coin Control', content: 'Each spent UTXO adds bytes to your transaction. Rough sizes:\n\n• **Legacy input (P2PKH):** ~148 vBytes\n• **SegWit input (P2WPKH):** ~68 vBytes\n• **Taproot input (P2TR):** ~57 vBytes\n\nA send that consumes 20 SegWit UTXOs is ~20× larger than a send consuming a single UTXO. During a fee spike (100 sats/vB), that difference can turn a $2 send into a $40 send.\n\n**Coin control** — the ability to hand-pick which UTXOs a transaction spends — is a power feature in wallets like Sparrow, Electrum, and Wasabi. It lets you avoid mixing labeled UTXOs (privacy), spend dust before a fee spike (economy), or preserve large UTXOs for future use.' },
    { id: 'privacy-implications', heading: 'UTXOs and Privacy', content: 'The UTXO model is public: every input and output is visible on-chain forever. Chain-analysis firms cluster addresses by identifying UTXOs that were spent together in the same transaction — a heuristic called **common-input ownership**.\n\nBest practices to keep UTXOs private:\n\n• **Never merge UTXOs from different sources** unless you accept they will be linked.\n• **Use a fresh address for every receive** — modern wallets do this by default.\n• **Consider CoinJoin (Wasabi, Samourai/JoinMarket)** for mixing large UTXOs, understanding the trade-offs.\n• **Move small spends to Lightning** — see our [Lightning Network guide](/learn/lightning-network-explained) — where individual amounts are not chain-visible.\n\nUnderstanding UTXOs is the difference between casually using Bitcoin and actually controlling how your coins move.' },
  ],
  howToSteps: [
    { name: 'Open a wallet that shows UTXOs', text: 'Sparrow, Electrum, Bitcoin Core, and BlueWallet expose the individual UTXOs your wallet controls.' },
    { name: 'Label each incoming UTXO', text: 'Tag UTXOs by source (exchange withdrawal, salary, gift) to avoid accidentally linking them in a future transaction.' },
    { name: 'Check UTXO count before a big send', text: 'If you have many tiny UTXOs, expect a larger transaction size and higher fee.' },
    { name: 'Consolidate during low-fee periods', text: 'When mempool fees drop to 1–3 sats/vB (typically weekends), combine small UTXOs into one large output.' },
    { name: 'Use coin control for privacy or economy', text: 'Manually select which UTXOs to spend based on privacy, cost, or purpose.' },
  ],
  expertQuote: {
    quote: 'Bitcoin\'s UTXO model is one of its most underappreciated design choices — it makes verification cheap, scaling parallel, and privacy at least defensible.',
    author: 'Pieter Wuille',
    role: 'Bitcoin Core developer',
    source: 'https://bitcoinops.org/en/topics/utxo-set/',
    sourceLabel: 'Bitcoin Optech UTXO topic',
  },
  speakable: true,
};

export default article;
