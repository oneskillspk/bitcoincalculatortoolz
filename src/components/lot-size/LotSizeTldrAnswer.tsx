import { useLanguage } from '@/contexts/LanguageContext';

/**
 * AI-answer optimized 40-word TL;DR block placed under H1. Structured to
 * be lifted verbatim by Google AI Overviews / ChatGPT search / Perplexity.
 */
export const LotSizeTldrAnswer = ({ liveBtcPrice }: { liveBtcPrice: number }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const px = liveBtcPrice > 0 ? liveBtcPrice.toLocaleString() : '—';

  return (
    <div className="max-w-3xl mx-auto mb-6 rounded-xl border border-primary/20 bg-primary/[0.03] p-5 text-left">
      <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">
        {tr ? 'Kısa Cevap' : 'Quick Answer'}
      </p>
      <p className="text-sm md:text-base text-foreground leading-relaxed">
        {tr ? (
          <>
            <strong>Bitcoin lot büyüklüğü = (Hesap Bakiyesi × Risk %) ÷ Stop-Loss Mesafesi.</strong>{' '}
            1 standart BTC lot = 1 BTC (bugün ~${px}). Çoğu MT5 aracısı 0,01 lot minimuma (0,01 BTC) izin verir; Binance ve Bybit vadeli işlemleri 0,001 BTC'ye iner.
            İşlem başına %1-2 riskle kalın.
          </>
        ) : (
          <>
            <strong>Bitcoin lot size = (Account Balance × Risk %) ÷ Stop-Loss Distance.</strong>{' '}
            1 standard BTC lot = 1 BTC (~${px} today). Most MT5 brokers allow 0.01 lot minimum (0.01 BTC); Binance and Bybit futures go to 0.001 BTC.
            Keep risk at 1-2% per trade.
          </>
        )}
      </p>
    </div>
  );
};
