export type AffiliateCategory = 'exchange' | 'wallet' | 'hardware' | 'education' | 'tax-software' | 'trading-tools' | 'mining' | 'card';

export interface AffiliatePartner {
  id: string;
  name: string;
  description: string;
  url: string;
  cta: string;
  category: AffiliateCategory;
  icon: string; // emoji or icon key
  featured?: boolean;
}

export const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  // Exchanges
  {
    id: 'coinbase',
    name: 'Coinbase',
    description: 'Buy Bitcoin with auto-recurring purchases and earn rewards.',
    url: 'https://www.coinbase.com/',
    cta: 'Start Buying',
    category: 'exchange',
    icon: '🪙',
    featured: true,
  },
  {
    id: 'kraken',
    name: 'Kraken',
    description: 'Advanced trading with low fees and DCA automation.',
    url: 'https://www.kraken.com/',
    cta: 'Trade Now',
    category: 'exchange',
    icon: '🐙',
  },
  {
    id: 'binance',
    name: 'Binance',
    description: 'World\'s largest exchange with 350+ cryptocurrencies.',
    url: 'https://www.binance.com/',
    cta: 'Open Account',
    category: 'exchange',
    icon: '💹',
  },

  // Hardware Wallets
  {
    id: 'ledger',
    name: 'Ledger',
    description: 'Industry-leading hardware wallet for secure cold storage.',
    url: 'https://shop.ledger.com/?r=8c4e8e87cac7',
    cta: 'Secure Your BTC',
    category: 'hardware',
    icon: '🔐',
    featured: true,
  },
  {
    id: 'trezor',
    name: 'Trezor',
    description: 'Open-source hardware wallet trusted since 2013.',
    url: 'https://trezor.io/',
    cta: 'Get Trezor',
    category: 'hardware',
    icon: '🛡️',
  },
  {
    id: 'bitbox',
    name: 'BitBox02',
    description: 'Swiss-made minimalist hardware wallet with backup on microSD.',
    url: 'https://shiftcrypto.ch/',
    cta: 'Learn More',
    category: 'hardware',
    icon: '🇨🇭',
  },

  // Tax Software
  {
    id: 'cointracker',
    name: 'CoinTracker',
    description: 'Automatic crypto tax reports for 10,000+ currencies.',
    url: 'https://www.cointracker.io/',
    cta: 'Try Free',
    category: 'tax-software',
    icon: '📊',
    featured: true,
  },
  {
    id: 'koinly',
    name: 'Koinly',
    description: 'Generate tax reports in minutes. Supports 20+ countries.',
    url: 'https://koinly.io/',
    cta: 'Calculate Taxes',
    category: 'tax-software',
    icon: '🧾',
  },
  {
    id: 'tokentax',
    name: 'TokenTax',
    description: 'Full-service crypto tax software with CPA support.',
    url: 'https://tokentax.co/',
    cta: 'Get Started',
    category: 'tax-software',
    icon: '💼',
  },

  // Trading Tools
  {
    id: 'tradingview',
    name: 'TradingView',
    description: 'Professional charting and analysis for crypto markets.',
    url: 'https://www.tradingview.com/',
    cta: 'View Charts',
    category: 'trading-tools',
    icon: '📈',
    featured: true,
  },

  // Mining
  {
    id: 'nicehash',
    name: 'NiceHash',
    description: 'Mine Bitcoin easily with your existing hardware.',
    url: 'https://www.nicehash.com/',
    cta: 'Start Mining',
    category: 'mining',
    icon: '⛏️',
  },
  {
    id: 'compass-mining',
    name: 'Compass Mining',
    description: 'Hosted Bitcoin mining with no hardware hassle.',
    url: 'https://compassmining.io/',
    cta: 'Explore Plans',
    category: 'mining',
    icon: '🧭',
  },

  // Education
  {
    id: 'unchained',
    name: 'Unchained',
    description: 'Bitcoin-native financial services and multisig vaults.',
    url: 'https://unchained.com/',
    cta: 'Learn More',
    category: 'education',
    icon: '🔗',
  },

  // Crypto Cards
  {
    id: 'redotpay',
    name: 'RedotPay',
    description: 'Spend crypto like fiat with a Visa card — Apple Pay & Google Pay supported. Get $5 to start.',
    url: 'https://wap.redotpay.com/en/invite/affiliates-1?utm_id=36rgik&utm_source=union&utm_uid=15980&utm_s=f29a110dc987f17ad366813652572664712174e0',
    cta: 'Get $5 free',
    category: 'card',
    icon: '💳',
    featured: true,
  },
];

/** Calculator slug → relevant affiliate categories */
export const CALCULATOR_AFFILIATE_MAP: Record<string, AffiliateCategory[]> = {
  'dca': ['exchange'],
  'lump-sum-vs-dca': ['exchange'],
  'bitcoin-savings': ['exchange', 'hardware'],
  'investment': ['exchange'],
  'profit-loss': ['exchange', 'tax-software'],
  'capital-gains-tax': ['tax-software'],
  'mining-profitability': ['mining'],
  'retirement': ['exchange', 'hardware'],
  'stack-sats': ['exchange'],
  'hodl-strategy': ['exchange', 'hardware'],
  'what-if': ['exchange'],
  'average-buy-price': ['exchange'],
  'sip': ['exchange'],
  'millionaire': ['exchange'],
  'staking': ['exchange'],
  'liquidation': ['exchange', 'trading-tools'],
  'volatility': ['trading-tools'],
  'drawdown': ['trading-tools'],
  'fear-greed-index': ['trading-tools'],
  'rainbow-chart': ['trading-tools'],
  'power-law': ['trading-tools'],
  'stock-to-flow': ['trading-tools'],
  'bitcoin-converter': ['exchange', 'card'],
  'purchasing-power': ['exchange', 'card'],
  'wealth-percentile': ['exchange'],
  'btc-vs-assets': ['exchange'],
  'btc-vs-real-estate': ['exchange'],
  'transaction-fees': ['exchange', 'card'],
  'lightning': ['exchange', 'card'],
  'etf': ['exchange'],
  'pizza-day': ['exchange', 'card'],
  'supply': ['trading-tools'],
  'on-chain': ['trading-tools'],
  'dominance': ['trading-tools'],
  'halving-countdown': ['exchange'],
  'obituaries-tracker': ['exchange'],
  'bitcoin-accumulation-score': ['exchange'],
};

export function getAffiliatesForCalculator(slug: string, limit = 3): AffiliatePartner[] {
  const categories = CALCULATOR_AFFILIATE_MAP[slug] || ['exchange'];
  const matching = AFFILIATE_PARTNERS.filter(p => categories.includes(p.category));
  // Featured first, then shuffle rest
  const sorted = [...matching].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  return sorted.slice(0, limit);
}

export function getAffiliatesByCategory(category: AffiliateCategory, limit = 3): AffiliatePartner[] {
  return AFFILIATE_PARTNERS.filter(p => p.category === category).slice(0, limit);
}
