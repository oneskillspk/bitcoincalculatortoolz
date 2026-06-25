export const EXCHANGES = ['Binance', 'Coinbase', 'Kraken', 'Bybit', 'OKX', 'KuCoin', 'Gemini', 'Custom'];

export const FEE_PRESETS = {
  conservative: { label: 'Conservative', maker: 0.1, taker: 0.2, withdrawal: 18, settlement: 12, slippage: 0.25 },
  standard: { label: 'Standard', maker: 0.08, taker: 0.12, withdrawal: 10, settlement: 8, slippage: 0.15 },
  pro: { label: 'Pro / pre-funded', maker: 0.02, taker: 0.06, withdrawal: 4, settlement: 3, slippage: 0.05 },
} as const;

export type FeePresetKey = keyof typeof FEE_PRESETS;

export const faqsEn = [
  { q: "What is Bitcoin arbitrage?", a: "Bitcoin arbitrage is the practice of buying Bitcoin on one exchange where the price is lower and simultaneously selling it on another exchange where the price is higher, capturing the price difference as profit. The profit must exceed all trading fees, withdrawal fees, and transfer costs to be worthwhile." },
  { q: "How do I calculate Bitcoin arbitrage profit?", a: "Bitcoin arbitrage profit = (Price on Exchange B − Price on Exchange A) × BTC amount − trading fees on both exchanges. For example, buying 0.1 BTC at $84,900 on Exchange A and selling at $85,200 on Exchange B gives a gross profit of $30, minus fees on both sides. Use the calculator above to find the net profit for any price difference and fee combination." },
  { q: "What fees reduce Bitcoin arbitrage profit?", a: "The main fees that reduce Bitcoin arbitrage profit are trading fees on both the buy and sell side (typically 0.1% to 0.5% per trade), withdrawal fees to transfer Bitcoin between exchanges (fixed fee per transaction), and network transaction fees. Most apparent arbitrage opportunities disappear once these fees are deducted." },
  { q: "How much price difference do you need for Bitcoin arbitrage?", a: "The minimum price difference needed for profitable Bitcoin arbitrage depends on your combined fees. If Exchange A charges 0.1% and Exchange B charges 0.5%, your total fee load is approximately 0.6%. You need a price spread larger than 0.6% to profit. At $85,000 per BTC, that means you need at least a $510 price difference between exchanges to break even." },
];

export const faqsTr = [
  { q: "Bitcoin arbitrajı nedir?", a: "Bitcoin arbitrajı, Bitcoin'i fiyatın daha düşük olduğu bir borsadan alıp eş zamanlı olarak fiyatın daha yüksek olduğu başka bir borsada satarak fiyat farkını kâr olarak elde etme uygulamasıdır. Kârın anlamlı olabilmesi için tüm işlem ücretlerini, çekim ücretlerini ve transfer maliyetlerini aşması gerekir." },
  { q: "Bitcoin arbitraj kârını nasıl hesaplarım?", a: "Bitcoin arbitraj kârı = (B Borsasındaki Fiyat − A Borsasındaki Fiyat) × BTC miktarı − her iki borsadaki işlem ücretleri. Örneğin A Borsasından 84.900 dolardan 0,1 BTC alıp B Borsasında 85.200 dolardan satmak 30 dolar brüt kâr verir; iki tarafın ücretleri bu rakamdan düşülür. Herhangi bir fiyat farkı ve ücret kombinasyonu için net kârı bulmak üzere yukarıdaki hesaplayıcıyı kullanın." },
  { q: "Bitcoin arbitraj kârını hangi ücretler azaltır?", a: "Bitcoin arbitraj kârını azaltan temel ücretler, alım ve satım tarafındaki işlem ücretleri (genellikle işlem başına %0,1–0,5), Bitcoin'i borsalar arasında transfer etme çekim ücretleri (işlem başına sabit ücret) ve ağ işlem ücretleridir. Görünür arbitraj fırsatlarının çoğu, bu ücretler düşüldüğünde ortadan kalkar." },
  { q: "Bitcoin arbitrajı için ne kadar fiyat farkı gerekir?", a: "Kârlı bir Bitcoin arbitrajı için gereken minimum fiyat farkı, toplam ücretlerinize bağlıdır. A Borsası %0,1, B Borsası %0,5 alırsa toplam ücret yükünüz yaklaşık %0,6 olur. Kâr edebilmek için %0,6'dan büyük bir spread'e ihtiyacınız vardır. BTC başına 85.000 dolardan, bu başabaş için borsalar arasında en az 510 dolar fark gerekir demektir." },
];
