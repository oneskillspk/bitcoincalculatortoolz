import React from 'react';
import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';

export const LotSizeHowToSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="space-y-12">

          {/* Section A */}
          <div>
            <h2 className="text-h2 font-bold text-foreground mb-4">
              {tr ? 'Bitcoin Lot Büyüklüğü Nasıl Hesaplanır' : 'How to Calculate Bitcoin Lot Size'}
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p>{tr ? 'Risk bazlı pozisyon boyutlandırma için lot büyüklüğü formülü basittir:' : 'The lot size formula for risk-based position sizing is straightforward:'}</p>
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50 my-4">
                <p className="font-mono text-sm text-foreground text-center">
                  <strong>{tr ? 'Lot Büyüklüğü = (Hesap Bakiyesi × Risk%) ÷ (USD cinsinden Stop Loss Mesafesi × Sözleşme Büyüklüğü)' : 'Lot Size = (Account Balance × Risk%) ÷ (Stop Loss Distance in USD × Contract Size)'}</strong>
                </p>
              </div>
              <p>
                {tr
                  ? <><strong>Çalışılmış örnek:</strong> 10.000 $ hesap, %2 risk (200 $), 85.000 $'da giriş, 83.000 $'da stop loss (mesafe = 2.000 $) ve lot başına 1 BTC standart sözleşme büyüklüğüyle:</>
                  : <><strong>Worked example:</strong> With a $10,000 account, 2% risk ($200), entry at $85,000, stop loss at $83,000 (distance = $2,000), and a standard contract size of 1 BTC per lot:</>}
              </p>
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50 my-4">
                <p className="font-mono text-sm text-foreground text-center">
                  {tr
                    ? 'Lot Büyüklüğü = $200 ÷ ($2.000 × 1) = <strong>0,1 lot</strong> (1 mini lot)'
                    : 'Lot Size = $200 ÷ ($2,000 × 1) = <strong>0.1 lots</strong> (1 mini lot)'}
                </p>
              </div>
              <p>
                {tr
                  ? <>Bu, 8.500 $ değerinde 0,1 BTC işlem yapacağınız anlamına gelir. Stop losunuz tetiklenirse tam olarak 200 $ — hesabınızın %2'sini — kaybedersiniz. Bu, <strong>%1 kuralının</strong> (veya %2 kuralının) eylemde olmasıdır: tek bir işlemde toplam özsermayenizin %1-2'sinden fazlasını asla riske atmayın.</>
                  : <>This means you'd trade 0.1 BTC, worth $8,500. If your stop loss hits, you lose exactly $200 — 2% of your account. This is the <strong>1% rule</strong> (or 2% rule) in action: never risk more than 1-2% of your total equity on a single trade.</>}
              </p>
              <p>
                {tr
                  ? <>Lot büyüklüğü neden giriş fiyatından daha önemlidir? Çünkü <strong>pozisyon boyutlandırma yanıldığınızda ne kadar kaybedeceğinizi belirler</strong> — ve her yatırımcı düzenli olarak yanılır. Profesyonel yatırımcılar önce risk yönetimine, ikinci olarak giriş sinyallerine odaklanır. <Link to="/calculators/leverage-liquidation" className="text-primary hover:underline">Kaldıraç Tasfiye Hesaplayıcımız</Link> pozisyonunuzu boyutlandırdıktan sonra tasfiye seviyelerini belirlemenize yardımcı olur.</>
                  : <>Why does lot size matter more than entry price? Because <strong>position sizing determines how much you lose when you're wrong</strong> — and every trader is wrong regularly. Professional traders focus on risk management first and entry signals second. Our <Link to="/calculators/leverage-liquidation" className="text-primary hover:underline">Leverage Liquidation Calculator</Link> helps you set liquidation levels after sizing your position.</>}
              </p>
            </div>
          </div>

          {/* Section C */}
          <div>
            <h2 className="text-h2 font-bold text-foreground mb-4">
              {tr ? 'Standart, Mini, Mikro ve Nano Lotlar Açıklandı' : 'Standard, Mini, Micro and Nano Lots Explained'}
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 text-foreground font-semibold">{tr ? 'Lot Türü' : 'Lot Type'}</th>
                      <th className="text-right py-2 text-foreground font-semibold">{tr ? 'Büyüklük' : 'Size'}</th>
                      <th className="text-right py-2 text-foreground font-semibold">{tr ? 'BTC Miktarı' : 'BTC Amount'}</th>
                      <th className="text-right py-2 text-foreground font-semibold">{tr ? 'Önerilen Hesap' : 'Recommended For'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/30"><td className="py-2">{tr ? 'Standart' : 'Standard'}</td><td className="text-right">1.0 lot</td><td className="text-right">1 BTC</td><td className="text-right">{tr ? '50.000 $+ hesaplar' : '$50K+ accounts'}</td></tr>
                    <tr className="border-b border-border/30"><td className="py-2">Mini</td><td className="text-right">0.1 lot</td><td className="text-right">0.1 BTC</td><td className="text-right">{tr ? '10.000 $–50.000 $ hesaplar' : '$10K–$50K accounts'}</td></tr>
                    <tr className="border-b border-border/30"><td className="py-2">Mikro</td><td className="text-right">0.01 lot</td><td className="text-right">0.01 BTC</td><td className="text-right">{tr ? '1.000 $–10.000 $ hesaplar' : '$1K–$10K accounts'}</td></tr>
                    <tr className="border-b border-border/30"><td className="py-2">Nano</td><td className="text-right">0.001 lot</td><td className="text-right">0.001 BTC</td><td className="text-right">{tr ? '1.000 $ altı / yeni başlayanlar' : 'Under $1K / beginners'}</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                {tr
                  ? "Exness ve IC Markets gibi çoğu MT4/MT5 aracısı, minimum 0,01 lot (mikro) ile standart 1 BTC lot kullanır. Binance ve Bybit gibi kripto yerel platformları 0,001 lot kadar düşük seviyelere izin verir."
                  : "Most MT4/MT5 brokers like Exness and IC Markets use a standard lot of 1 BTC with a minimum of 0.01 lots (micro). Crypto-native platforms like Binance and Bybit allow as low as 0.001 lots."}
              </p>
            </div>
          </div>

          {/* Section D */}
          <div>
            <h2 className="text-h2 font-bold text-foreground mb-4">
              {tr ? 'Aracıya Göre Lot Büyüklüğü — Exness, Binance, Bybit, Delta Exchange' : 'Lot Size by Broker — Exness, Binance, Bybit, Delta Exchange'}
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 text-foreground font-semibold">{tr ? 'Aracı' : 'Broker'}</th>
                      <th className="text-right py-2 text-foreground font-semibold">{tr ? 'Sözleşme Büyüklüğü' : 'Contract Size'}</th>
                      <th className="text-right py-2 text-foreground font-semibold">{tr ? 'Min Lot' : 'Min Lot'}</th>
                      <th className="text-right py-2 text-foreground font-semibold">{tr ? 'Max Kaldıraç' : 'Max Leverage'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/30"><td className="py-2">Exness</td><td className="text-right">1 BTC</td><td className="text-right">0.01</td><td className="text-right">1:400</td></tr>
                    <tr className="border-b border-border/30"><td className="py-2">IC Markets</td><td className="text-right">1 BTC</td><td className="text-right">0.01</td><td className="text-right">1:200</td></tr>
                    <tr className="border-b border-border/30"><td className="py-2">Bybit</td><td className="text-right">1 BTC (USD-M)</td><td className="text-right">0.001</td><td className="text-right">1:100</td></tr>
                    <tr className="border-b border-border/30"><td className="py-2">Binance</td><td className="text-right">1 BTC (BTCUSDT)</td><td className="text-right">0.001</td><td className="text-right">1:125</td></tr>
                    <tr className="border-b border-border/30"><td className="py-2">Delta Exchange</td><td className="text-right">0.001 BTC</td><td className="text-right">1 {tr ? 'sözleşme' : 'contract'}</td><td className="text-right">1:100</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                {tr
                  ? <><strong>İşlem yapmadan önce her zaman aracınızın sözleşme şartnamesini kontrol edin.</strong> Sözleşme büyüklükleri farklı ürün türleri arasında (spot ile sürekli vadeli ile çeyrek vadeli işlemler) değişebilir.</>
                  : <><strong>Always check your broker's contract specification</strong> before trading. Contract sizes can vary between different product types (spot vs perpetual vs quarterly futures).</>}
              </p>
              <p>
                {tr
                  ? <>Kaldıraçlı pozisyonlara girmeden önce risk analizi için <Link to="/calculators/leverage-liquidation" className="text-primary hover:underline">Bitcoin Tasfiye Hesaplayıcısı</Link>'nı kullanın. Gerçek ticaret performansını takip etmek için <Link to="/calculators/profit-loss" className="text-primary hover:underline">Kâr & Zarar Hesaplayıcısı</Link>'nı deneyin.</>
                  : <>For risk analysis before entering leveraged positions, use our <Link to="/calculators/leverage-liquidation" className="text-primary hover:underline">Bitcoin Liquidation Calculator</Link>. To track actual trade performance, try the <Link to="/calculators/profit-loss" className="text-primary hover:underline">Profit & Loss Calculator</Link>.</>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
