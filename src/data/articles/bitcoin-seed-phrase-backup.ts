import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-seed-phrase-backup',
  title: 'Bitcoin Seed Phrase Backup: The Right Way to Store 12/24 Words',
  metaDescription: 'Your Bitcoin seed phrase is the master key to your coins. Learn how to back it up on steel, split with Shamir or multisig, and avoid the 5 most common mistakes.',
  category: 'Basics',
  publishedDate: '2026-07-26',
  updatedDate: '2026-07-26',
  readingTime: 7,
  keywords: ['bitcoin seed phrase backup', 'seed phrase storage', 'how to back up seed phrase', '24 word seed', 'BIP-39 backup'],
  relatedCalculators: ['portfolio-tracker', 'stack-sats', 'bitcoin-converter'],
  relatedArticles: ['bitcoin-cold-storage-guide', 'bitcoin-calculator-comparison', 'how-to-buy-bitcoin-safely'],
  quickAnswer: 'A Bitcoin seed phrase is 12 or 24 words that regenerate every private key in your wallet. Back it up on fireproof and waterproof steel — never digitally. For balances above $100,000, split the seed across multiple locations using Shamir Secret Sharing or move to a 2-of-3 multisig setup where losing any single backup does not lose the coins.',
  faqs: [
    { question: 'What is a Bitcoin seed phrase?', answer: 'A seed phrase (also called a recovery phrase or mnemonic) is a human-readable list of 12 or 24 words defined by the BIP-39 standard. Those words encode the master private key that can regenerate every address, key, and balance in your wallet. Anyone with the seed phrase controls the coins — no PIN, exchange login, or hardware wallet required.' },
    { question: 'Should I store my seed phrase on paper or steel?', answer: 'Steel. Paper burns, tears, molds, and fades. Fireproof and waterproof steel plates (Cryptosteel Capsule, Blockstream Jade, Seedplate) survive house fires and floods and are the professional standard for anything above hobbyist amounts.' },
    { question: 'Is it safe to split my seed phrase in half?', answer: 'No. Splitting a 24-word seed into two halves does not double security — it halves it, because an attacker who finds one half only needs to brute-force the other 12 words. Use Shamir Secret Sharing (SLIP-39) or multisig instead. Both are cryptographically designed for safe splitting.' },
    { question: 'Can I store my seed phrase in a password manager?', answer: 'Not for meaningful amounts. Password managers are online systems with a history of breaches (LastPass 2022). They convert cold storage into hot storage. If you must digitize a seed for convenience, encrypt it with a passphrase you memorize and treat it as a hot-wallet-level risk.' },
  ],
  sections: [
    { id: 'what-is-seed', heading: 'What Your Seed Phrase Actually Represents', content: 'When you set up any modern Bitcoin wallet, the device shows you 12 or 24 English words. Those words are not a password — they are a compact encoding of the entire mathematical seed that generates your master private key. From that key, the wallet derives billions of addresses and their signing keys.\n\nBecause the seed is the root of everything, whoever holds it controls every past and future address in the wallet. Losing the seed = losing every satoshi tied to it. Copying the seed to a stranger = handing them your wallet.' },
    { id: 'backup-media', heading: 'Choosing the Right Backup Medium', content: 'Rank backup media by the threats they survive:\n\n| Medium | Fire | Water | Time | Cost |\n|---|---|---|---|---|\n| Handwritten paper | No | No | 20+ yrs (dry) | Free |\n| Laminated paper | No | Yes | 30+ yrs | $5 |\n| Steel plate (stamped) | Yes | Yes | 100+ yrs | $60–$150 |\n| Titanium (specialty) | Yes | Yes | 500+ yrs | $200+ |\n| Digital (photo, cloud) | N/A | N/A | Any breach | Free but risky |\n\nFor any balance you would not lose to a routine house fire, steel is the minimum standard. Two identical steel copies stored in two locations dominate every single-copy option.', cta: { calculatorId: 'portfolio-tracker', calculatorName: 'Bitcoin Portfolio Tracker', text: 'Confirm your backed-up wallets match your tracked balance', path: '/calculators/portfolio-tracker' } },
    { id: 'splitting-safely', heading: 'Splitting a Seed Safely (Shamir & Multisig)', content: 'For larger balances, single-location backups are risky. Two safe ways to split:\n\n**Shamir Secret Sharing (SLIP-39)** — Trezor Model T and Keystone support splitting your seed into N shares where any M can restore (e.g., 2 of 3, 3 of 5). Each share is useless alone. Store them in geographically separated locations.\n\n**Multisig (2-of-3 or 3-of-5)** — Instead of splitting one seed, create three independent seeds on three hardware wallets. Any two can sign a transaction; losing one does not lose the coins. This is the standard used by Casa, Unchained, and self-custody advocates for high-net-worth stacks. See our [cold storage guide](/learn/bitcoin-cold-storage-guide) for a complete walkthrough.' },
    { id: 'five-mistakes', heading: 'Five Backup Mistakes to Avoid', content: 'Every year, real people lose real Bitcoin to these:\n\n1. **Photographing the seed.** Cloud sync uploads it to Apple/Google/Meta servers — a permanent breach exposure.\n2. **Emailing it "just to yourself."** Email providers are online, indexed, and hackable.\n3. **Storing the seed with the hardware wallet.** A single-location theft loses everything.\n4. **Assuming the seed is enough.** If you use a BIP-39 passphrase (25th word), back that up separately and just as carefully.\n5. **Never testing recovery.** Wipe your device and restore from the backup at least once before trusting it with meaningful value.' },
  ],
  howToSteps: [
    { name: 'Generate the seed on a hardware wallet', text: 'Let the device generate 12 or 24 words offline. Never type a seed into a computer.' },
    { name: 'Write the words on paper first', text: 'Copy the words in order onto paper. Verify by re-entering them on the device before proceeding.' },
    { name: 'Transfer to a fireproof steel plate', text: 'Stamp, engrave, or slot the words into a Cryptosteel or Seedplate steel backup.' },
    { name: 'Store copies in two locations', text: 'Keep one copy at home in a safe and a second in a bank safe deposit box or trusted family member\'s safe.' },
    { name: 'Add a passphrase if the amount justifies it', text: 'A BIP-39 passphrase creates a hidden wallet. Back the passphrase up separately from the seed.' },
    { name: 'Test the recovery once', text: 'Wipe the device and restore from your backup to confirm every word is legible and correct.' },
  ],
  expertQuote: {
    quote: 'Never type your recovery phrase into any website, computer, or phone. Ever.',
    author: 'Trezor',
    role: 'Official security guidance',
    source: 'https://trezor.io/learn/a/recovery-seed-safety',
    sourceLabel: 'trezor.io security docs',
  },
  speakable: true,
};

export default article;
