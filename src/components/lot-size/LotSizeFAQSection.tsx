import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { SectionHeader } from './SectionHeader';

/**
 * Expanded FAQ (22 Q&As EN + TR) — targets high-volume long-tail queries
 * ("btc lot size $100 account", "how much margin for 0.1 lot", "pip
 * calculator", "MT5 vs Bybit", "liquidation price bitcoin", "R multiple").
 *
 * All price examples use LIVE BTC price with a July 2026 reference
 * fallback of $118,000 — no more hardcoded $85,000.
 */
const REFERENCE_BTC_2026_07 = 118000;

const build = (px: number) => {
  const p = px.toLocaleString('en-US');
  return [
    { question: 'How to calculate lot size on BTC?', answer: `Lot Size = (Account Balance × Risk %) ÷ (Stop Loss Distance × Contract Size). Example: $10,000 account, 1% risk ($100), $500 stop distance = 0.2 lot. Our calculator handles it live.` },
    { question: 'How much is 0.01 lot size in Bitcoin?', answer: `0.01 lot = 0.01 BTC (one micro lot). At today's ~$${p}, that equals ~$${(px * 0.01).toLocaleString('en-US')}. Minimum lot on most MT5 brokers (Exness, IC Markets).` },
    { question: 'How much is 1 lot of Bitcoin?', answer: `1 standard lot = 1 BTC. At ~$${p}, 1 lot is ~$${p}. This is the MT4/MT5 standard; Deribit/BitMEX use USD-denominated inverse contracts instead.` },
    { question: 'How much is 0.001 BTC lot size in dollars?', answer: `0.001 BTC (1 nano lot) at $${p} = ~$${(px * 0.001).toFixed(2)}. Equivalent to 100,000 satoshis. Minimum on Binance and Bybit USDT-M futures.` },
    { question: 'How do I calculate my lot size?', answer: `Lot Size = Risk Amount ÷ (Stop Loss Distance × Pip Value). Risk Amount = Balance × Risk %. Example: 1% of $5,000 ($50) with $1,000 stop = 0.05 lot.` },
    { question: 'Is 0.01 a good lot size?', answer: `0.01 (micro) is right for beginners and accounts under $1,000. Pros scale lot to their account so they risk 1-2% per trade — never a fixed lot.` },
    { question: 'What lot size is $10?', answer: `At ~$${p} BTC, $10 exposure ≈ ${(10 / px).toFixed(6)} BTC / lot. Below the 0.01 minimum on most brokers — consider spot instead.` },
    { question: 'What is a pip in Bitcoin trading?', answer: `In BTC/USD forex, a pip = $1 price move. Pip value depends on lot size: 0.01 lot → $0.01/pip; 1 lot → $1/pip. Use the converter above for any lot.` },
    { question: 'What lot size for a $100 account?', answer: `On a $100 account risking 1% ($1) with a $500 BTC stop distance = 0.002 lot. Most brokers won't accept sub-0.01 lots — either grow the account or use fractional-lot exchanges like Bybit (0.001 minimum).` },
    { question: 'How much margin do I need for 0.1 lot Bitcoin?', answer: `0.1 lot = 0.1 BTC ≈ $${(px * 0.1).toLocaleString('en-US')} notional. With 10× leverage → $${(px * 0.01).toLocaleString('en-US')} margin. With 100× → $${(px * 0.001).toLocaleString('en-US')}.` },
    { question: 'How is BTC liquidation price calculated?', answer: `Long liquidation ≈ Entry × (1 − 1/Leverage + Maintenance Margin %). Short flips the sign. At 10× with 0.5% maint. margin, a $${p} long liquidates near $${(px * 0.905).toFixed(0)}. Our Liquidation & Cost card computes it live.` },
    { question: 'What is the 1% risk rule?', answer: `Never risk more than 1% of account equity on a single trade. 10 consecutive losses draws down only ~10% — statistically recoverable. Aggressive traders push to 2%; anything above is casino territory.` },
    { question: 'MT5 vs Bybit vs Binance — do they use the same lot size?', answer: `MT5 brokers (Exness, IC Markets) use 1 lot = 1 BTC with 0.01 min. Bybit & Binance USDT-M perpetuals use 0.001 BTC minimum. OKX uses 0.01 BTC contracts. Same math, different granularity — see the broker matrix above.` },
    { question: 'What is an R-multiple?', answer: `Profit ÷ Risk. If you risk $100 and win $300, that's a 3R trade. A 40% win-rate at 2R is profitable (EV = 0.4×2 − 0.6×1 = +0.2R per trade). Break-even win-rate = 1 / (1 + RR).` },
    { question: 'Linear vs inverse contracts — which for lot sizing?', answer: `Linear (USDT-M) sizes in BTC and settles USDT — simpler, use the standard formula. Inverse (Deribit, BitMEX) sizes in $ contracts and settles BTC — divide notional by contract value ($1 or $10) for lot count.` },
    { question: 'Does leverage change my risk?', answer: `No. Leverage only changes the margin you post. Risk = stop distance × lot size, independent of leverage. Higher leverage moves your liquidation closer, which can force-exit before your stop.` },
    { question: 'What lot size should I use for scalping BTC?', answer: `Scalpers use tight stops (often $50-$200) so lot size scales up. Keep risk at 0.5-1% because trade frequency multiplies fee drag: 20 round-trips/day at 0.055% each ≈ 2.2% cost.` },
    { question: 'How do fees & funding change my real risk?', answer: `Round-trip taker fees on Binance/Bybit run 0.08-0.11% of position value. Funding on perps averages 0.01% every 8h. On a $${(px * 0.5).toLocaleString('en-US')} position held 24h, add ~$${((px * 0.5) * (0.0011 + 0.0003)).toFixed(0)} to your true risk.` },
    { question: 'Can I use this calculator for gold or forex lots?', answer: `The math is identical (Balance × Risk% ÷ Stop × Contract), but contract sizes differ: gold = 100 oz, EUR/USD = 100,000 units. Use a forex-specific calculator for non-BTC pairs.` },
    { question: 'What is portfolio heat?', answer: `Sum of risk % across all open trades. Above 6% total, a correlated market move can wipe several percent from equity in one day. Cap portfolio heat at 3-5% for stability.` },
    { question: 'How do I set stop loss and take profit?', answer: `Stop below/above technical structure (swing low/high, key MA, or ATR-multiple). Take profit at the next liquidity pool or fixed R-multiple (2R or 3R). Our calculator shows RR automatically once you enter TP.` },
    { question: 'Is Bitcoin trading with leverage worth it?', answer: `Only if position size math is airtight. Undersized leverage is safe but slow; oversized burns accounts in a week. Data reviewed July 15, 2026 shows retail leverage traders lose 75-89% within 6 months across major EU brokers.` },
  ];
};

const buildTr = (px: number) => {
  const p = px.toLocaleString('tr-TR');
  return [
    { question: "BTC'de lot büyüklüğü nasıl hesaplanır?", answer: `Lot Büyüklüğü = (Hesap × Risk %) ÷ (Stop Mesafesi × Kontrat). Örnek: 10.000 $ hesap, %1 risk (100 $), 500 $ stop = 0,2 lot.` },
    { question: "0,01 lot Bitcoin ne kadar?", answer: `0,01 lot = 0,01 BTC. Bugünkü ~${p} $ fiyatla ~${(px * 0.01).toLocaleString('tr-TR')} $. MT5 aracılarında minimum lot.` },
    { question: "1 lot Bitcoin ne kadar?", answer: `1 standart lot = 1 BTC ≈ ${p} $. MT4/MT5 standardı; Deribit/BitMEX inverse USD sözleşmeleri kullanır.` },
    { question: "0,001 BTC lot dolar olarak ne kadar?", answer: `0,001 BTC (1 nano lot) ${p} $\'da ~${(px * 0.001).toFixed(2)} $. 100.000 satoshi. Binance & Bybit USDT-M vadeli minimumu.` },
    { question: "Lot büyüklüğümü nasıl hesaplarım?", answer: `Lot = Risk Tutarı ÷ (Stop Mesafesi × Pip Değeri). Risk Tutarı = Bakiye × Risk %.` },
    { question: "0,01 iyi bir lot mu?", answer: `0,01 mikro lot yeni başlayanlar ve 1.000 $ altı hesaplar için uygundur. Profesyoneller işlem başına %1-2 risk almak için lotu ölçekler.` },
    { question: "10 $ hangi lot?", answer: `~${p} $ BTC'de 10 $ ≈ ${(10 / px).toFixed(6)} BTC. Çoğu broker'ın 0,01 minimum altında — spot alım düşünün.` },
    { question: "Bitcoin işleminde pip nedir?", answer: `BTC/USD'de 1 pip = 1 $\'lık hareket. 0,01 lot → 0,01 $/pip; 1 lot → 1 $/pip. Yukarıdaki dönüştürücüyü kullanın.` },
    { question: "100 $\'lık hesap için hangi lot?", answer: `100 $\'lık hesapta %1 risk (1 $) ve 500 $ stop → 0,002 lot. Çoğu broker sub-0,01 lot kabul etmez — hesabı büyütün veya Bybit (0,001 min) kullanın.` },
    { question: "0,1 lot Bitcoin için ne kadar marj?", answer: `0,1 lot = 0,1 BTC ≈ ${(px * 0.1).toLocaleString('tr-TR')} $. 10× kaldıraç → ${(px * 0.01).toLocaleString('tr-TR')} $ marj. 100× → ${(px * 0.001).toLocaleString('tr-TR')} $.` },
    { question: "BTC tasfiye fiyatı nasıl hesaplanır?", answer: `Long tasfiye ≈ Giriş × (1 − 1/Kaldıraç + Bakım Marjı %). 10×, %0,5 bakım → ${p} $ long ~${(px * 0.905).toFixed(0)} $\'da tasfiye olur.` },
    { question: "%1 risk kuralı nedir?", answer: `Tek işlemde hesabın %1'inden fazlasını riske atmayın. Art arda 10 kayıp ~%10 çekilme — istatistiksel olarak toparlanabilir.` },
    { question: "MT5 vs Bybit vs Binance — aynı lot mu?", answer: `MT5 (Exness, IC Markets): 1 lot = 1 BTC, 0,01 min. Bybit & Binance USDT-M: 0,001 BTC min. OKX: 0,01 BTC kontrat. Aynı matematik, farklı hassasiyet.` },
    { question: "R-multiple nedir?", answer: `Kâr ÷ Risk. 100 $ riskle 300 $ kazanç = 3R. %40 win-rate + 2R kârlıdır (BEP = %33).` },
    { question: "Linear vs inverse — hangisi?", answer: `Linear (USDT-M): BTC cinsinden boyut, USDT settle — standart formül. Inverse (Deribit, BitMEX): $ kontrat, BTC settle — notional ÷ kontrat değeri.` },
    { question: "Kaldıraç riskimi değiştirir mi?", answer: `Hayır. Kaldıraç sadece marjı değiştirir. Risk = stop mesafesi × lot. Yüksek kaldıraç tasfiyeyi yaklaştırır.` },
    { question: "Scalp için hangi lot?", answer: `Scalp'te stop dar (50-200 $) olduğu için lot büyür. %0,5-1 riskle kal — 20 işlem × %0,055 komisyon = %2,2 sürtünme.` },
    { question: "Komisyon ve funding gerçek riski nasıl değiştirir?", answer: `Binance/Bybit taker %0,08-0,11. Perp funding ortalama %0,01/8s. ${(px * 0.5).toLocaleString('tr-TR')} $ pozisyon 24 saat tutulursa +${((px * 0.5) * (0.0011 + 0.0003)).toFixed(0)} $ maliyet.` },
    { question: "Altın veya forex için de kullanabilir miyim?", answer: `Formül aynı ama kontratlar farklı: altın = 100 oz, EUR/USD = 100.000 birim. BTC-dışı için forex hesaplayıcı kullanın.` },
    { question: "Portföy heat nedir?", answer: `Açık işlemlerdeki toplam risk %. %6 üzerinde korelasyonlu bir hareket günde birkaç % silebilir. %3-5 sınırında tutun.` },
    { question: "Stop-loss ve take-profit nasıl konur?", answer: `Stop teknik yapı altına/üstüne (swing low/high, MA, ATR). TP bir sonraki likidite havuzuna veya sabit R (2R/3R). TP girildiğinde hesaplayıcı RR'yi otomatik gösterir.` },
    { question: "Kaldıraçlı Bitcoin işlemi değer mi?", answer: `Sadece pozisyon boyutu matematiği sağlamsa. 15 Temmuz 2026'da incelenen veriler, retail kaldıraç yatırımcılarının 6 ay içinde büyük EU aracılarında %75-89 kayıp yaşadığını gösteriyor.` },
  ];
};

export const LotSizeFAQSection = () => {
  const { language } = useLanguage();
  const { price } = useLiveBitcoinPrice();
  const tr = language === 'tr';
  const px = price > 0 ? price : REFERENCE_BTC_2026_07;
  const faqs = tr ? buildTr(px) : build(px);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <HelpCircle className="w-4 h-4" />
            {tr ? 'SSS' : 'FAQ'}
          </div>
          <h2 className="text-h2 font-bold mb-4 text-foreground">
            {tr ? 'Bitcoin Lot Büyüklüğü Hakkında Sık Sorulan Sorular' : 'Common Bitcoin Lot Size Questions Answered'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {tr
              ? 'Bitcoin lot büyüklükleri, pozisyon boyutlandırma, tasfiye ve risk yönetimi hakkında bilmeniz gereken her şey. 15 Temmuz 2026 tarihinde güncellendi.'
              : 'Everything you need to know about Bitcoin lot sizes, position sizing, liquidation, and risk. Reviewed July 15, 2026.'}
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border/50 rounded-xl px-5">
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
