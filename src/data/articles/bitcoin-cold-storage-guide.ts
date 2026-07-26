import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-cold-storage-guide',
  title: 'Bitcoin Cold Storage Guide: Keep Your BTC Safe Offline (2026)',
  metaDescription: 'Cold storage keeps your Bitcoin private keys fully offline, immune to online hacks. Compare hardware wallets, air-gapped signing, and multisig setups.',
  category: 'Basics',
  publishedDate: '2026-07-26',
  updatedDate: '2026-07-26',
  readingTime: 8,
  keywords: ['bitcoin cold storage', 'cold storage explained', 'cold wallet bitcoin', 'offline bitcoin storage', 'hardware wallet setup'],
  relatedCalculators: ['portfolio-tracker', 'stack-sats', 'bitcoin-converter'],
  relatedArticles: ['ledger-vs-trezor-2026', 'bitcoin-seed-phrase-backup', 'coinbase-vs-kraken-2026'],
  quickAnswer: 'Cold storage means holding Bitcoin private keys on a device that has never touched the internet — typically a hardware wallet or an air-gapped signing device. It removes the entire remote-attack surface: even if your computer is fully compromised, an attacker cannot move the coins without physical access to the cold device and its PIN.',
  faqs: [
    { question: 'What is Bitcoin cold storage in simple terms?', answer: 'Cold storage is any Bitcoin key storage that stays offline. The keys are generated and sign transactions on a device that is never connected to the internet, so remote hackers, malware, and phishing sites cannot reach them. Hardware wallets like Ledger, Trezor, and Coldcard are the most common form.' },
    { question: 'Is a hardware wallet the same as cold storage?', answer: 'Almost. A hardware wallet is cold storage as long as the private keys never leave the device unencrypted. Devices that ask you to type the seed phrase into a computer or phone break that guarantee. True cold setups sign transactions on the device itself and only broadcast the signed transaction from a hot device.' },
    { question: 'How much Bitcoin should be in cold storage?', answer: 'A common rule: keep only the amount you plan to spend or trade within the next 30 days on exchanges or hot wallets. Everything else — long-term stack, retirement Bitcoin, inheritance BTC — belongs in cold storage. For balances above roughly $100,000, add multisig to remove single-device failure risk.' },
    { question: 'What happens to my cold storage if I die?', answer: 'Without an inheritance plan, coins in cold storage are lost. Options include: a sealed letter with recovery instructions in a bank safe deposit box, a multisig setup with a trusted co-signer, or a service like Casa Covenant or Unchained Inheritance. Test the plan with a small amount before trusting it with real value.' },
  ],
  sections: [
    { id: 'why-cold-storage', heading: 'Why Cold Storage Matters', content: 'Every year, exchange hacks, SIM swaps, and malware campaigns drain Bitcoin from investors who kept coins on hot wallets or custodial platforms. Chainalysis reported **$1.7B lost to crypto hacks in 2023 alone**, and centralized exchanges accounted for the largest single category.\n\nCold storage removes the attack surface that all of those exploits target: an internet-connected key. If the key never touches an online device, no remote attacker can reach it. The only remaining threats are physical (theft, loss, damage) — which are far easier to defend against with backups and multisig than an anonymous global attacker.' },
    { id: 'cold-storage-options', heading: 'Cold Storage Options Compared', content: 'Not all cold storage is equal. Compare the main options:\n\n| Method | Cost | Ease | Security |\n|---|---|---|---|\n| Hardware wallet (Ledger, Trezor) | $70–$200 | Easy | High |\n| Air-gapped signer (Coldcard, Passport) | $150–$300 | Medium | Very high |\n| Paper wallet | Free | Hard | Medium |\n| Steel seed backup + hardware wallet | $100–$250 | Medium | Very high |\n| Multisig (2-of-3 hardware wallets) | $200–$600 | Advanced | Highest |\n\nFor most holders, a mainstream hardware wallet paired with a steel seed backup covers 95% of realistic threats. Paper wallets are legacy — fire, water, and single-point-of-failure risks make steel plates strictly better.', cta: { calculatorId: 'portfolio-tracker', calculatorName: 'Bitcoin Portfolio Tracker', text: 'Track cold-storage balances alongside your active portfolio', path: '/calculators/portfolio-tracker' } },
    { id: 'setup-process', heading: 'Setting Up Cold Storage the Right Way', content: 'A safe cold-storage setup follows a predictable sequence:\n\n1. **Buy the device directly from the manufacturer.** Third-party listings are a documented supply-chain attack vector.\n2. **Verify the device is untampered.** Check factory seals and confirm firmware signatures on first boot.\n3. **Generate the seed phrase on the device — never online.** If any tool asks you to type your seed into a computer, stop.\n4. **Write the 24 words on paper first**, verify by re-entering, then transfer to a steel backup plate.\n5. **Set a strong PIN and (optionally) a BIP-39 passphrase** as a 25th word. The passphrase creates a hidden wallet that even someone with the seed cannot access.\n6. **Send a small test amount, then send it back** before moving any significant balance.\n\nCompare specific devices in our [Ledger vs Trezor 2026 comparison](/learn/ledger-vs-trezor-2026).' },
    { id: 'common-mistakes', heading: 'Common Cold Storage Mistakes', content: 'Avoid these failure patterns:\n\n• **Storing the seed digitally.** Photos, cloud notes, and password managers turn cold storage back into hot storage.\n• **Skipping the recovery test.** Verify you can restore the wallet on a second device before funding it heavily.\n• **Using round-number test amounts.** Attackers monitor known test transactions; use random amounts.\n• **Buying second-hand devices.** Even reset devices can be modified. Always buy new from the manufacturer.\n• **Sharing your address history publicly.** Cold storage protects keys, not privacy. Use a fresh address for every receive.\n• **Forgetting the passphrase.** A BIP-39 passphrase is not recoverable. Back it up separately from the seed.' },
  ],
  howToSteps: [
    { name: 'Buy a hardware wallet from the vendor', text: 'Order Ledger, Trezor, Coldcard, or Passport directly from the manufacturer\'s official site.' },
    { name: 'Initialize and generate a new seed', text: 'Follow the on-device setup to create a fresh 12- or 24-word seed phrase. Never import a seed from an online source.' },
    { name: 'Back the seed up on steel', text: 'Stamp or engrave the seed onto a fireproof and waterproof steel plate; store it in a separate location from the device.' },
    { name: 'Set a strong PIN and optional passphrase', text: 'Use a 6–8 digit PIN and consider adding a BIP-39 passphrase for a hidden wallet.' },
    { name: 'Test recovery before funding', text: 'Wipe the device and restore from the seed to confirm the backup works, then reinitialize.' },
    { name: 'Send a small test amount', text: 'Transfer a small amount, verify the address, then move your long-term stack.' },
  ],
  expertQuote: {
    quote: 'Not your keys, not your coins. Cold storage is how you actually own Bitcoin instead of owning an IOU from an exchange.',
    author: 'Andreas M. Antonopoulos',
    role: 'Author, Mastering Bitcoin',
    source: 'https://github.com/bitcoinbook/bitcoinbook',
    sourceLabel: 'Mastering Bitcoin (open-source)',
  },
  speakable: true,
};

export default article;
