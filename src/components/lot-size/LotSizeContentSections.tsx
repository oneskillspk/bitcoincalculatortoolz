import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeader } from './SectionHeader';

/**
 * Long-form SEO body: glossary (with DefinedTermSet schema), full "how to
 * size a BTC trade" guide, comparison sections, worked examples. Targets
 * missing high-intent queries around "bitcoin position size", "btc pip
 * calculator", "linear vs inverse", "risk 1% rule bitcoin".
 */
export const LotSizeContentSections = ({ liveBtcPrice }: { liveBtcPrice: number }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const px = liveBtcPrice > 0 ? liveBtcPrice : 118000;
  const pxDisp = px.toLocaleString(tr ? 'tr-TR' : 'en-US');

  const terms = tr ? [
    { name: 'Lot', desc: 'Standart bir işlem birimi. 1 BTC lot = 1 BTC.' },
    { name: 'Kontrat Büyüklüğü', desc: 'Bir lotun temsil ettiği BTC miktarı — çoğu MT5 aracısında 1 BTC.' },
    { name: 'Pip', desc: 'BTC/USD\'de 1 $\'lık fiyat hareketi. 1 lotta 1 pip = 1 $.' },
    { name: 'Bakım Marjı', desc: 'Pozisyonu açık tutmak için gereken minimum eşik. Aşılırsa tasfiye tetiklenir.' },
    { name: 'Tasfiye Fiyatı', desc: 'Bakım marjının tükendiği ve borsanın pozisyonu zorla kapattığı fiyat.' },
    { name: 'Finansman', desc: 'Vadeli işlem sözleşmelerinde uzun/kısa arasında ödenen 8 saatlik ücret.' },
    { name: 'R-multiple', desc: 'Kâr ÷ Risk. 3R işlem, risk edilenin 3 katını kazandırır.' },
  ] : [
    { name: 'Lot', desc: 'A standard unit of trade. 1 BTC lot = 1 BTC.' },
    { name: 'Contract Size', desc: 'Amount of BTC one lot represents — 1 BTC on most MT5 brokers.' },
    { name: 'Pip', desc: 'A $1 price move in BTC/USD. On 1 lot, 1 pip = $1.' },
    { name: 'Maintenance Margin', desc: 'Minimum equity threshold to keep a position open. Breach triggers liquidation.' },
    { name: 'Liquidation Price', desc: 'Price at which maintenance margin is exhausted and the exchange force-closes the position.' },
    { name: 'Funding', desc: 'The 8-hour fee paid between longs and shorts on perpetual futures.' },
    { name: 'R-multiple', desc: 'Profit ÷ Risk. A 3R winner earns 3× what was risked.' },
  ];

  const definedTermSet = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: tr ? 'Bitcoin Lot & Pozisyon Boyutu Sözlüğü' : 'Bitcoin Lot & Position Size Glossary',
    hasDefinedTerm: terms.map(t => ({ '@type': 'DefinedTerm', name: t.name, description: t.desc })),
  };

  return (
    <section className="container mx-auto px-6 pb-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(definedTermSet)}</script>
        </Helmet>

        {/* Full guide */}
        <article>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? 'Bir Bitcoin İşlemi Nasıl Boyutlandırılır — Tam Kılavuz' : 'How to Size a Bitcoin Trade — Full Guide'}
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {tr ? (
              <>
                <p>Doğru lot büyüklüğü, kaybetmeyi göze aldığınız dolar miktarını, stop-loss mesafenizi ve aracınızın kontrat özelliklerini birleştirir. Formül basittir: <strong>Lot = (Bakiye × Risk %) ÷ (Stop Mesafesi × Kontrat)</strong>. 10.000 $ hesap, %1 risk (100 $) ve 500 $ stop mesafesi 0,2 BTC lot verir — bugün ~${pxDisp} fiyatla yaklaşık ${(0.2 * px).toLocaleString('tr-TR')} $ değerinde bir pozisyon.</p>
                <p>Profesyonel yatırımcılar "1% kuralına" bağlı kalır: hiçbir işlemde hesabın %1'inden fazlasını riske atmayın. Bu, art arda 10 kaybın dahi hesabınızı yalnızca %10 küçültmesini sağlar — istatistiksel olarak toparlanabilir bir çekilme.</p>
                <p>Kaldıraç yalnızca gereken marjı değiştirir; risk edilen dolar miktarını değil. 10x kaldıraçlı 0,2 lot BTC pozisyonu için marj = pozisyon değeri ÷ 10. Ama stop-loss'a çarptığınızda kaybınız yine 100 $'dır.</p>
              </>
            ) : (
              <>
                <p>Correct lot size ties together the dollars you're willing to lose, your stop-loss distance, and your broker's contract specs. The formula is simple: <strong>Lot = (Balance × Risk %) ÷ (Stop Distance × Contract)</strong>. A $10,000 account, 1% risk ($100), and a $500 stop distance gives 0.2 BTC lots — a ${(0.2 * px).toLocaleString('en-US')} position at today's ~${pxDisp}.</p>
                <p>Pros anchor to the "1% rule": never risk more than 1% of the account on a single trade. That way even 10 consecutive losses only draw the account down 10% — a statistically recoverable drawdown.</p>
                <p>Leverage only changes the margin required, not the dollars at risk. A 0.2 lot BTC position at 10× leverage needs margin = position value ÷ 10. But when your stop hits, the loss is still $100.</p>
                <p>Two mistakes wreck otherwise sound trades: (1) sizing off leverage instead of stop distance — a wider stop with the same lot means a bigger loss; (2) ignoring fees and funding on perpetuals. Round-trip taker fees on Binance/Bybit run 0.08-0.11% of position value; funding at 0.01% every 8h costs another 0.03%/day. On a $50k position that's $15+ per day just to hold.</p>
              </>
            )}
          </div>
        </article>

        {/* Comparison */}
        <article>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? 'Linear vs Inverse Kontratlar' : 'Linear vs Inverse Contracts'}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {tr
              ? 'Linear (USDT-M) sözleşmeler USDT ile teminatlandırılır ve BTC cinsinden boyutlandırılır — Binance, Bybit, OKX standardı. Inverse sözleşmeler (Deribit, BitMEX XBTUSD) BTC ile teminatlandırılır ve USD cinsinden boyutlandırılır; kâr/zarar BTC olarak birikir. Linear yeni başlayanlar için daha basittir. Inverse, BTC bakiyenizi doğal olarak hedge etmek istiyorsanız daha uygundur.'
              : 'Linear (USDT-M) contracts are collateralized in USDT and sized in BTC — the Binance/Bybit/OKX standard. Inverse contracts (Deribit, BitMEX XBTUSD) are collateralized in BTC and sized in USD; P&L accrues in BTC. Linear is simpler for beginners. Inverse is preferable if you want your BTC balance to naturally hedge exposure.'}
          </p>
        </article>

        {/* Worked examples */}
        <article>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? 'Uygulamalı Örnekler (Temmuz 2026)' : 'Worked Examples (July 2026)'}
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li><strong className="text-foreground">$500 {tr ? 'hesap' : 'account'}, %1 {tr ? 'risk' : 'risk'}, $800 {tr ? 'stop' : 'stop'}:</strong> 0.006 lot BTC — {tr ? 'yaklaşık' : 'about'} ${(0.006 * px).toFixed(0)} {tr ? 'pozisyon' : 'position'}.</li>
            <li><strong className="text-foreground">$10,000, %1, $1,500:</strong> 0.067 lot — ${(0.067 * px).toFixed(0)} {tr ? 'pozisyon' : 'position'}.</li>
            <li><strong className="text-foreground">$100,000, %0.5, $2,000:</strong> 0.25 lot — ${(0.25 * px).toFixed(0)} {tr ? 'pozisyon' : 'position'}. {tr ? 'Kurumsal boyut riski.' : 'Institutional-scale risk.'}</li>
          </ul>
        </article>

        {/* Glossary */}
        <article>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? 'Sözlük' : 'Glossary'}
          </h2>
          <dl className="space-y-3">
            {terms.map(t => (
              <div key={t.name} className="border-l-2 border-primary/40 pl-4">
                <dt className="font-semibold text-foreground">{t.name}</dt>
                <dd className="text-sm text-muted-foreground">{t.desc}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </section>
  );
};
