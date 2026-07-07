/**
 * Legacy affiliate list — used by the "Recommended Tools" side card
 * and its <AffiliateCard>.
 *
 * ONLY partners with real, verified tracking URLs live here. Anything
 * without a working referral link was removed on 2026-07-05 because
 * clicks to raw brand URLs (kraken.com, binance.com, trezor.io, …)
 * earn $0 forever. See docs/AFFILIATE_ENGINE.md.
 *
 * The V2 engine (src/config/affiliates.config.ts) is the source of
 * truth for slot-based placements; this file only backs the sidebar
 * card. If you add a partner here, add a real tracking URL.
 */
export type AffiliateCategory =
  | 'exchange'
  | 'wallet'
  | 'hardware'
  | 'education'
  | 'tax-software'
  | 'trading-tools'
  | 'mining'
  | 'card';

export interface AffiliatePartner {
  id: string;
  name: string;
  description: string;
  url: string;
  cta: string;
  category: AffiliateCategory;
  icon: string;
  featured?: boolean;
}

const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  // Exchanges — only tracked links
  {
    id: 'coinbase',
    name: 'Coinbase',
    description: 'Buy Bitcoin with auto-recurring purchases and earn rewards.',
    url: 'https://coinbase-consumer.sjv.io/c/7283174/3383210/9251',
    cta: 'Start Buying',
    category: 'exchange',
    icon: '🪙',
    featured: true,
  },

  // Hardware Wallets — only tracked links
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

  // Tax Software — Koinly is our integrated partner
  {
    id: 'koinly',
    name: 'Koinly',
    description: 'Generate crypto tax reports in minutes. Supports 20+ countries.',
    url: 'https://koinly.io/?via=0481A637&utm_source=affiliate',
    cta: 'Calculate Taxes',
    category: 'tax-software',
    icon: '🧾',
    featured: true,
  },

  // Trading Tools
  {
    id: 'tradingview',
    name: 'TradingView',
    description: 'Professional charting and analysis for crypto markets.',
    url: 'https://www.tradingview.com/?aff_id=166891&aff_sub=partners&utm_source=bitcoincalculator&utm_medium=referral&utm_campaign=partners_en',
    cta: 'View Charts',
    category: 'trading-tools',
    icon: '📈',
    featured: true,
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

export function getAffiliatesByCategory(
  category: AffiliateCategory,
  limit = 3,
): AffiliatePartner[] {
  return AFFILIATE_PARTNERS.filter((p) => p.category === category).slice(0, limit);
}
