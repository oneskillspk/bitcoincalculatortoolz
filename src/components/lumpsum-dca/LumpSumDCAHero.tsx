import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";

interface Props {
  language: string;
  currency: string;
}

/**
 * Page hero — matches the retirement page rhythm
 * (uppercase eyebrow pill → gradient H1 → muted lead → live BTC price chip).
 */
export const LumpSumDCAHero = ({ language, currency }: Props) => {
  const tr = language === 'tr';
  return (
    <section
      aria-labelledby="lump-sum-dca-hero-heading"
      className="container mx-auto px-6 py-16 text-center"
    >
      <span className="inline-flex items-center px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-6">
        {tr ? 'Strateji Karşılaştırma Hesaplayıcısı' : 'Strategy Comparison Calculator'}
      </span>

      <h1
        id="lump-sum-dca-hero-heading"
        className="text-h1 font-bold text-foreground mb-6 max-w-4xl mx-auto [text-wrap:balance]"
      >
        {tr ? (
          <>Bitcoin <span className="text-gradient-premium">Toplu Yatırım vs DCA</span> Hesaplayıcısı</>
        ) : (
          <>Bitcoin <span className="text-gradient-premium">Lump Sum vs DCA</span> Calculator</>
        )}
      </h1>

      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
        {tr
          ? 'Bitcoin için toplu tutar, dolar maliyet ortalaması ve dolar değer ortalaması stratejilerini karşılaştırın. Gerçek tarihsel verilerle hangi yaklaşımın daha iyi performans gösterdiğini görün.'
          : 'Compare lump sum, dollar cost averaging, and dollar value averaging strategies for Bitcoin. See which approach would have performed better with real historical data.'}
      </p>

      <div className="max-w-sm mx-auto">
        <CompactLiveBitcoinPrice currency={currency} />
      </div>
    </section>
  );
};
