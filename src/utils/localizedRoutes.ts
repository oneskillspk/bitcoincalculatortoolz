/**
 * Bidirectional English ↔ Turkish URL route map.
 * Every public page registered in App.tsx that has a Turkish mirror appears here.
 *
 * Usage:
 *   getLocalizedPath('/calculators/dca', 'tr')  → '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi'
 *   getLocalizedPath('/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi', 'en') → '/calculators/dca'
 */

export const EN_TO_TR: Record<string, string> = {
  // Top-level & static pages
  '/': '/tr/',
  '/calculators': '/tr/hesaplayicilar',
  '/tools': '/tr/araclar',
  '/learn': '/tr/ogrenin',
  '/about': '/tr/hakkimizda',
  '/contact': '/tr/iletisim',
  '/terms': '/tr/kosullar',
  '/privacy': '/tr/gizlilik',
  '/affiliate-disclosure': '/tr/bagli-kurulus-aciklamasi',
  '/sitemap': '/tr/site-haritasi',
  '/methodology': '/tr/yontem',

  // Calculator pages — CRITICAL priority
  '/calculators/dca': '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi',
  '/calculators/profit-loss': '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi',
  '/calculators/investment': '/tr/hesaplayicilar/bitcoin-yatirim-hesaplayicisi',
  '/calculators/retirement': '/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi',
  '/calculators/bitcoin-accumulation-score': '/tr/hesaplayicilar/bitcoin-birikim-skoru',
  '/calculators/purchasing-power': '/tr/hesaplayicilar/bitcoin-enflasyon',
  '/calculators/bitcoin-converter': '/tr/hesaplayicilar/bitcoin-donusturucu',

  // Calculator pages — HIGH priority
  '/calculators/capital-gains-tax': '/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi',
  '/calculators/wealth-percentile': '/tr/hesaplayicilar/bitcoin-servet-yuzdesi',
  '/calculators/mining-profitability': '/tr/hesaplayicilar/bitcoin-madencilik-hesaplayicisi',
  '/calculators/rainbow-chart': '/tr/hesaplayicilar/bitcoin-gokkusagi-grafigi',
  '/calculators/price-target': '/tr/hesaplayicilar/bitcoin-fiyat-hedef',
  '/calculators/power-law': '/tr/hesaplayicilar/bitcoin-guc-yasasi',
  '/calculators/bitcoin-zakat': '/tr/hesaplayicilar/bitcoin-zekat-hesaplayicisi',
  '/calculators/halving-countdown': '/tr/hesaplayicilar/bitcoin-yarilama',
  '/calculators/average-buy-price': '/tr/hesaplayicilar/bitcoin-ortalama-alis',
  '/calculators/time-machine': '/tr/hesaplayicilar/bitcoin-zaman-makinesi',
  '/calculators/what-if': '/tr/hesaplayicilar/bitcoin-ya-olsaydi',
  '/calculators/lump-sum-vs-dca': '/tr/hesaplayicilar/bitcoin-maliyet-ortalama',

  // Calculator pages — MEDIUM priority
  '/calculators/cagr': '/tr/hesaplayicilar/bitcoin-yillik-buyume',
  '/calculators/volatility': '/tr/hesaplayicilar/bitcoin-oynaklik',
  '/calculators/correlation': '/tr/hesaplayicilar/bitcoin-korelasyon',
  '/calculators/bitcoin-arbitrage': '/tr/hesaplayicilar/bitcoin-arbitraj',
  '/calculators/bitcoin-lot-size': '/tr/hesaplayicilar/bitcoin-lot-buyuklugu',
  '/calculators/leverage-liquidation': '/tr/hesaplayicilar/bitcoin-tasfiye',
  '/calculators/transaction-fees': '/tr/hesaplayicilar/bitcoin-ag-ucreti',
  '/calculators/sip': '/tr/hesaplayicilar/bitcoin-sip-dca',
  '/calculators/etf': '/tr/hesaplayicilar/bitcoin-etf-hesaplayicisi',
  '/calculators/bitcoin-savings': '/tr/hesaplayicilar/bitcoin-birikim-hesaplayicisi',
  '/calculators/portfolio-tracker': '/tr/hesaplayicilar/bitcoin-portfoy',
  '/calculators/stack-sats': '/tr/hesaplayicilar/satoshi-biriktirme',
  '/calculators/on-chain': '/tr/hesaplayicilar/bitcoin-stok-akis',
  '/calculators/hodl-strategy': '/tr/hesaplayicilar/bitcoin-hodl-stratejisi',
  '/calculators/inflation-dashboard': '/tr/hesaplayicilar/bitcoin-enflasyon-paneli',
  '/calculators/fear-greed-index': '/tr/hesaplayicilar/bitcoin-korku-acgozluluk',
  '/calculators/staking': '/tr/hesaplayicilar/bitcoin-staking',

  // Calculator pages — LOWER priority
  '/calculators/supply': '/tr/hesaplayicilar/bitcoin-arz',
  '/calculators/dominance': '/tr/hesaplayicilar/bitcoin-dominansi',
  '/calculators/drawdown': '/tr/hesaplayicilar/bitcoin-dusus-analizi',
  '/calculators/pizza-day': '/tr/hesaplayicilar/bitcoin-pizza-gunu',
  '/calculators/btc-vs-real-estate': '/tr/hesaplayicilar/bitcoin-gayrimenkul',
  '/calculators/bitcoin-loan': '/tr/hesaplayicilar/bitcoin-kredi',
  '/calculators/inheritance-tax': '/tr/hesaplayicilar/bitcoin-miras-vergisi',
  '/calculators/pi-to-bitcoin': '/tr/hesaplayicilar/bitcoin-pi-donusturucu',
  '/calculators/lightning': '/tr/hesaplayicilar/bitcoin-lightning-ucreti',
  '/calculators/obituaries-tracker': '/tr/hesaplayicilar/bitcoin-olum-ilanlari',
  '/calculators/bitcoin-tax-india': '/tr/hesaplayicilar/bitcoin-vergi-hindistan',
  '/calculators/bitcoin-tax-uk-cgt': '/tr/hesaplayicilar/bitcoin-vergi-ingiltere-cgt',
  '/calculators/bitcoin-tax-germany': '/tr/hesaplayicilar/bitcoin-vergi-almanya',

  // Learn articles (Phase C5 — TR rollout starts here)
  '/learn/what-is-bitcoin-dca': '/tr/ogrenin/bitcoin-dca-nedir',
  '/learn/how-to-calculate-bitcoin-profit-loss': '/tr/ogrenin/bitcoin-kar-zarar-nasil-hesaplanir',
  '/learn/bitcoin-halving-explained': '/tr/ogrenin/bitcoin-yarilanmasi-nedir',
  '/learn/bitcoin-mining-profitability-2026': '/tr/ogrenin/bitcoin-madencilik-karliligi-2026',
  '/learn/bitcoin-dominance-explained': '/tr/ogrenin/bitcoin-dominansi-aciklamasi',
  '/learn/bitcoin-hodl-strategy-explained': '/tr/ogrenin/bitcoin-hodl-stratejisi-aciklamasi',
  '/learn/bitcoin-pizza-day-history': '/tr/ogrenin/bitcoin-pizza-gunu-tarihi',
  '/learn/bitcoin-tax-guide-capital-gains': '/tr/ogrenin/bitcoin-vergi-rehberi-sermaye-kazanci',
  '/learn/bitcoin-wealth-distribution': '/tr/ogrenin/bitcoin-servet-dagilimi',
  '/learn/bitcoin-vs-gold-sp500': '/tr/ogrenin/bitcoin-altin-sp500-karsilastirma',
  '/learn/dca-vs-lump-sum-bitcoin': '/tr/ogrenin/bitcoin-dca-vs-toplu-yatirim',
  '/learn/how-much-bitcoin-should-i-own': '/tr/ogrenin/ne-kadar-bitcoin-sahibi-olmaliyim',
  '/learn/what-is-fear-greed-index': '/tr/ogrenin/korku-acgozluluk-endeksi-nedir',
  '/learn/how-to-plan-retirement-with-bitcoin': '/tr/ogrenin/bitcoin-emeklilik-planlama-rehberi',
  '/learn/zakat-on-bitcoin-guide': '/tr/ogrenin/bitcoin-zekati-rehberi',
  '/learn/bitcoin-etf-guide-ibit-fbtc-arkb': '/tr/ogrenin/bitcoin-etf-karsilastirma-ibit-fbtc-arkb',
  '/learn/what-is-a-satoshi': '/tr/ogrenin/bitcoin-satoshi-nedir',
  '/learn/bitcoin-transaction-fees-explained': '/tr/ogrenin/bitcoin-islem-ucretleri-aciklamasi',
  '/learn/bitcoin-savings-plan-guide': '/tr/ogrenin/bitcoin-tasarruf-plani-rehberi',
  '/learn/bitcoin-power-law-explained': '/tr/ogrenin/bitcoin-guc-yasasi-aciklamasi',
  '/learn/bitcoin-staking-guide': '/tr/ogrenin/bitcoin-staking-rehberi',
  '/learn/bitcoin-sip-guide': '/tr/ogrenin/bitcoin-sip-rehberi',
  '/learn/bitcoin-fear-greed-index-strategy': '/tr/ogrenin/korku-acgozluluk-endeksi-stratejisi',
  '/learn/how-much-bitcoin-by-age': '/tr/ogrenin/yasa-gore-ne-kadar-bitcoin',
  '/learn/bitcoin-dca-100-per-month-returns': '/tr/ogrenin/aylik-100-dolar-bitcoin-dca-getirileri',
  '/learn/bitcoin-millionaire-calculator-guide': '/tr/ogrenin/bitcoin-milyoner-hesaplayici-rehberi',
  '/learn/how-to-calculate-average-buy-price-bitcoin': '/tr/ogrenin/bitcoin-ortalama-alis-fiyati-nasil-hesaplanir',
  '/learn/bitcoin-leverage-trading-risks': '/tr/ogrenin/bitcoin-kaldirac-ticareti-riskleri',
  '/learn/how-to-calculate-bitcoin-lot-size': '/tr/ogrenin/bitcoin-lot-buyuklugu-nasil-hesaplanir',
  '/learn/how-to-read-bitcoin-rainbow-chart': '/tr/ogrenin/bitcoin-gokkusagi-grafigi-nasil-okunur',
  '/learn/bitcoin-drawdown-history': '/tr/ogrenin/bitcoin-dusus-tarihi',
  '/learn/bitcoin-stock-to-flow-model': '/tr/ogrenin/bitcoin-stok-akis-modeli',
  '/learn/bitcoin-on-chain-metrics-guide': '/tr/ogrenin/bitcoin-zincir-uzeri-metrikler-rehberi',
  '/learn/bitcoin-vs-real-estate-sp500-gold-comparison': '/tr/ogrenin/bitcoin-gayrimenkul-sp500-altin-karsilastirma',
  '/learn/bitcoin-volatility-explained': '/tr/ogrenin/bitcoin-volatilitesi-aciklamasi',
  '/learn/cf-benchmarks-brti-explained': '/tr/ogrenin/cf-benchmarks-brti-aciklamasi',
  '/learn/bitcoin-calculation-formulas': '/tr/ogrenin/bitcoin-hesaplama-formulleri',
  '/learn/bitcoin-calculator-comparison': '/tr/ogrenin/bitcoin-hesaplayici-karsilastirma',
};

/**
 * Reverse map: Turkish path → English path.
 * Built automatically from EN_TO_TR; no manual maintenance needed.
 */
export const TR_TO_EN: Record<string, string> = {
  // Manually add /tr (no trailing slash) → /
  '/tr': '/',
  ...Object.fromEntries(
    Object.entries(EN_TO_TR).map(([en, tr]) => [tr, en])
  ),
};

/**
 * Returns the equivalent localized URL for the target language.
 * Falls back to the target language's homepage if no mapping is found.
 *
 * @param pathname   Current `location.pathname`
 * @param targetLang  'tr' or 'en'
 */
export function getLocalizedPath(pathname: string, targetLang: 'en' | 'tr'): string {
  // Strip trailing slash except for root '/'
  const norm = (p: string) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);
  const path = norm(pathname);

  if (targetLang === 'tr') {
    return EN_TO_TR[path] ?? EN_TO_TR[pathname] ?? '/tr/';
  }

  if (targetLang === 'en') {
    return TR_TO_EN[path] ?? TR_TO_EN[pathname] ?? '/';
  }

  return pathname;
}

/**
 * Convenience: given the current pathname, return the Turkish mirror URL.
 * Used to build <link rel="alternate" hrefLang="tr"> tags on calculator pages.
 */
export function getTurkishAlternate(pathname: string): string | null {
  const norm = (p: string) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);
  const path = norm(pathname);
  return EN_TO_TR[path] ?? null;
}

/**
 * Pre-built EN-slug sets, used to detect "misbuilt" TR hrefs like
 * `/tr/ogrenin/<english-slug>` or `/tr/hesaplayicilar/<english-slug>`
 * that slipped through localization. We can then forward them to the
 * correct TR mirror at runtime (interceptor + useLocalizedHref).
 */
const EN_LEARN_SLUGS = new Set(
  Object.keys(EN_TO_TR)
    .filter((p) => p.startsWith('/learn/'))
    .map((p) => p.slice('/learn/'.length)),
);
const EN_CALC_SLUGS = new Set(
  Object.keys(EN_TO_TR)
    .filter((p) => p.startsWith('/calculators/'))
    .map((p) => p.slice('/calculators/'.length)),
);

/**
 * Returns true when `slug` resolves to a registered Turkish article mirror.
 * RelatedCalculators (and similar surfaces) validate `relatedArticle.slug`
 * with this helper before rendering a link — when the mapping is missing
 * we hide the card instead of silently linking to `/tr/` (the fallback
 * inside getLocalizedPath).
 */
export function hasTurkishArticleMirror(slug: string): boolean {
  return EN_TO_TR[`/learn/${slug}`] !== undefined;
}




/**
 * "Forward-fix" a misbuilt TR href such as:
 *   /tr/ogrenin/<english-slug>        → /tr/ogrenin/<turkish-slug>
 *   /tr/hesaplayicilar/<english-slug> → /tr/hesaplayicilar/<turkish-slug>
 *   /tr/learn/<slug>                  → /tr/ogrenin/<turkish-slug>
 *   /tr/calculators/<slug>            → /tr/hesaplayicilar/<turkish-slug>
 *
 * Returns the original `pathname` when no rewrite applies, so it is safe
 * to call on every internal link.
 */
export function normalizeLocalizedPath(pathname: string): string {
  if (!pathname.startsWith('/tr/')) return pathname;

  // EN-shaped TR paths: rewrite both the segment and the slug
  const enShape = pathname.match(/^\/tr\/(learn|calculators)\/([^/?#]+)(.*)$/);
  if (enShape) {
    const [, segment, slug, rest] = enShape;
    const tr = EN_TO_TR[`/${segment}/${slug}`];
    if (tr) return tr + (rest ?? '');
  }

  const learnMatch = pathname.match(/^\/tr\/ogrenin\/([^/?#]+)(.*)$/);
  if (learnMatch) {
    const [, slug, rest] = learnMatch;
    if (EN_LEARN_SLUGS.has(slug)) {
      const tr = EN_TO_TR[`/learn/${slug}`];
      if (tr) return tr + (rest ?? '');
    }
  }

  const calcMatch = pathname.match(/^\/tr\/hesaplayicilar\/([^/?#]+)(.*)$/);
  if (calcMatch) {
    const [, slug, rest] = calcMatch;
    if (EN_CALC_SLUGS.has(slug)) {
      const tr = EN_TO_TR[`/calculators/${slug}`];
      if (tr) return tr + (rest ?? '');
    }
  }

  return pathname;
}
