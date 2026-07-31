import { QuickAnswerBox } from '@/components/calculator/QuickAnswerBox';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * AI-answer optimized 40–60 word answer chunk placed under the H1.
 *
 * Renders through the shared <QuickAnswerBox> so the lot-size page uses the
 * exact same Quick Answer surface (styling, schema.org/Answer markup, aria
 * label) as every other calculator — a single block, never two.
 */
export const LotSizeTldrAnswer = ({ liveBtcPrice }: { liveBtcPrice: number }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const px = liveBtcPrice > 0 ? liveBtcPrice.toLocaleString() : '—';

  const answer = tr
    ? `Bitcoin lot büyüklüğü = (Hesap Bakiyesi × Risk %) ÷ Stop-Loss Mesafesi. 1 standart BTC lot = 1 BTC (bugün ~$${px}). Çoğu MT5 aracısı 0,01 lot minimuma (0,01 BTC) izin verir; Binance ve Bybit vadeli işlemleri 0,001 BTC'ye iner. İşlem başına riski %1–2 aralığında tutun.`
    : `Bitcoin lot size = (Account Balance × Risk %) ÷ Stop-Loss Distance. One standard BTC lot = 1 BTC (~$${px} today). Most MT5 brokers allow a 0.01 lot minimum (0.01 BTC), while Binance and Bybit futures go down to 0.001 BTC. Keep risk at 1–2% per trade.`;

  return <QuickAnswerBox answer={answer} />;
};
