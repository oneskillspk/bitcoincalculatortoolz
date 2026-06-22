/**
 * Shared display metadata for calculator slugs used in article internal-linking
 * surfaces (sidebar + in-flow RelatedLinksSection). EN/TR names live here so
 * both consumers stay in sync.
 *
 * The path is built via getLocalizedPath(`/calculators/${slug}`, language) at
 * render time — do not hard-code TR routes in this map.
 */
export interface CalculatorMeta {
  /** EN display name */
  name: string;
  /** TR display name (falls back to `name` when omitted) */
  nameTr?: string;
}

export const calculatorMeta: Record<string, CalculatorMeta> = {
  'dca': { name: 'DCA Calculator', nameTr: 'DCA Hesaplayıcı' },
  'lump-sum-vs-dca': { name: 'Lump Sum vs DCA', nameTr: 'Toplu Yatırım vs DCA' },
  'bitcoin-savings': { name: 'Bitcoin Savings', nameTr: 'Bitcoin Tasarruf' },
  'halving-countdown': { name: 'Halving Countdown', nameTr: 'Yarılanma Sayacı' },
  'mining-profitability': { name: 'Mining Profitability', nameTr: 'Madencilik Kârlılığı' },
  'what-if': { name: 'What If Calculator', nameTr: 'Olsaydı Hesaplayıcı' },
  'profit-loss': { name: 'Profit & Loss', nameTr: 'Kâr/Zarar' },
  'capital-gains-tax': { name: 'Capital Gains Tax', nameTr: 'Sermaye Kazancı Vergisi' },
  'investment': { name: 'Investment Calculator', nameTr: 'Yatırım Hesaplayıcı' },
  'fear-greed-index': { name: 'Fear & Greed Index', nameTr: 'Korku ve Açgözlülük Endeksi' },
  'retirement': { name: 'Retirement Planner', nameTr: 'Emeklilik Planlayıcı' },
  'bitcoin-converter': { name: 'Bitcoin Converter', nameTr: 'Bitcoin Dönüştürücü' },
  'stack-sats': { name: 'Stack Sats Goal', nameTr: 'Sat Biriktirme Hedefi' },
  'hodl-strategy': { name: 'HODL Strategy', nameTr: 'HODL Stratejisi' },
  'transaction-fees': { name: 'Transaction Fees', nameTr: 'İşlem Ücretleri' },
  'purchasing-power': { name: 'Purchasing Power', nameTr: 'Satın Alma Gücü' },
  'average-buy-price': { name: 'Average Buy Price', nameTr: 'Ortalama Alış Fiyatı' },
  'wealth-percentile': { name: 'Wealth Percentile', nameTr: 'Servet Yüzdesi' },
  'btc-vs-assets': { name: 'BTC vs Assets', nameTr: 'BTC vs Varlıklar' },
  'btc-vs-real-estate': { name: 'BTC vs Real Estate', nameTr: 'BTC vs Gayrimenkul' },
  'dominance': { name: 'BTC Dominance Tracker', nameTr: 'BTC Dominans Takipçisi' },
  'rainbow-chart': { name: 'Rainbow Chart', nameTr: 'Gökkuşağı Grafiği' },
  'drawdown': { name: 'Drawdown Calculator', nameTr: 'Düşüş Hesaplayıcı' },
  'volatility': { name: 'Volatility Calculator', nameTr: 'Oynaklık Hesaplayıcı' },
  'power-law': { name: 'Power Law Calculator', nameTr: 'Güç Yasası Hesaplayıcı' },
  'stock-to-flow': { name: 'Stock-to-Flow Model', nameTr: 'Stok/Akış Modeli' },
  'supply': { name: 'Supply Tracker', nameTr: 'Arz Takipçisi' },
  'on-chain': { name: 'On-Chain Metrics', nameTr: 'Zincir Üstü Metrikler' },
  'lightning': { name: 'Lightning Calculator', nameTr: 'Lightning Hesaplayıcı' },
  'etf': { name: 'ETF Comparison', nameTr: 'ETF Karşılaştırma' },
  'sip': { name: 'SIP Calculator', nameTr: 'SYP Hesaplayıcı' },
  'pizza-day': { name: 'Pizza Day Calculator', nameTr: 'Pizza Günü Hesaplayıcı' },
  'millionaire': { name: 'Millionaire Calculator', nameTr: 'Milyoner Hesaplayıcı' },
  'staking': { name: 'Staking Calculator', nameTr: 'Staking Hesaplayıcı' },
  'liquidation': { name: 'Liquidation Calculator', nameTr: 'Tasfiye Hesaplayıcı' },
  'leverage-liquidation': { name: 'Leverage & Liquidation', nameTr: 'Kaldıraç ve Tasfiye' },
  'obituaries-tracker': { name: 'Obituaries Tracker', nameTr: 'Bitcoin Ölüm İlanları' },
  'bitcoin-accumulation-score': { name: 'Accumulation Score', nameTr: 'Birikim Skoru' },
  'bitcoin-lot-size': { name: 'Lot Size Calculator', nameTr: 'Lot Büyüklüğü Hesaplayıcı' },
  'bitcoin-zakat': { name: 'Bitcoin Zakat Calculator', nameTr: 'Bitcoin Zekât Hesaplayıcı' },
  'cagr': { name: 'CAGR Calculator', nameTr: 'CAGR Hesaplayıcı' },
  'price-target': { name: 'Price Target', nameTr: 'Fiyat Hedefi' },
  'bitcoin-tax-india': { name: 'India Crypto Tax (30%)', nameTr: 'Hindistan Kripto Vergisi (%30)' },
  'bitcoin-tax-uk-cgt': { name: 'UK Bitcoin CGT', nameTr: 'İngiltere Bitcoin CGT' },
  'bitcoin-tax-germany': { name: 'Germany §23 EStG', nameTr: 'Almanya §23 EStG' },
};

export function getCalculatorName(slug: string, language: 'en' | 'tr'): string {
  const meta = calculatorMeta[slug];
  if (!meta) return slug;
  return language === 'tr' ? meta.nameTr ?? meta.name : meta.name;
}

/** Stable list of all known calculator slugs, used by audits. */
export const KNOWN_CALCULATOR_SLUGS: ReadonlyArray<string> = Object.keys(calculatorMeta);
