/**
 * HowTo step content for step-based calculators, keyed by EN slug.
 * Auto-emitted as schema.org/HowTo JSON-LD by `HowToSchema.tsx` on
 * matching `/calculators/<slug>` and TR mirror routes.
 *
 * Keep steps to ≤6 items, each 1–2 short sentences, written so an AI
 * voice surface can read them aloud verbatim.
 */
export interface HowToStep {
  name: string;
  text: string;
}

export interface CalculatorHowTo {
  /** EN HowTo name + steps */
  en: { name: string; steps: HowToStep[] };
  /** TR HowTo name + steps */
  tr: { name: string; steps: HowToStep[] };
}

export const calculatorHowTo: Record<string, CalculatorHowTo> = {
  dca: {
    en: {
      name: "How to Use the Bitcoin DCA Calculator",
      steps: [
        { name: "Choose your investment amount", text: "Enter how much you would invest in Bitcoin on each interval — weekly, monthly, or custom." },
        { name: "Pick a start and end date", text: "Select the historical window. The calculator pulls real BTC/USD prices for that range." },
        { name: "Select your interval", text: "Daily, weekly, bi-weekly, or monthly. The tool simulates a buy at the closing price for each interval." },
        { name: "Review your DCA result", text: "Compare total invested, total BTC accumulated, current value, and ROI versus a lump-sum buy at day one." },
      ],
    },
    tr: {
      name: "Bitcoin DCA Hesaplayıcı Nasıl Kullanılır",
      steps: [
        { name: "Yatırım tutarınızı seçin", text: "Her aralıkta Bitcoin'e ne kadar yatıracağınızı girin — haftalık, aylık veya özel." },
        { name: "Başlangıç ve bitiş tarihini seçin", text: "Tarihsel pencereyi belirleyin. Hesaplayıcı bu aralık için gerçek BTC/USD fiyatlarını çeker." },
        { name: "Aralığı seçin", text: "Günlük, haftalık, iki haftalık veya aylık. Araç her aralık için kapanış fiyatından bir alım simüle eder." },
        { name: "Sonucu inceleyin", text: "Toplam yatırım, biriken toplam BTC, güncel değer ve toplu alıma karşı ROI'yi karşılaştırın." },
      ],
    },
  },
  retirement: {
    en: {
      name: "How to Use the Bitcoin Retirement Calculator",
      steps: [
        { name: "Enter your current age and target retirement age", text: "Set the horizon over which Bitcoin should compound." },
        { name: "Set your monthly Bitcoin allocation", text: "How much of your savings flows into BTC each month." },
        { name: "Choose a CAGR assumption", text: "Pick a conservative, moderate, or aggressive Bitcoin growth rate." },
        { name: "Review the projected nest egg", text: "See the BTC stack and fiat-equivalent purchasing power at retirement." },
      ],
    },
    tr: {
      name: "Bitcoin Emeklilik Hesaplayıcı Nasıl Kullanılır",
      steps: [
        { name: "Yaşınızı ve emeklilik yaşınızı girin", text: "Bitcoin'in birikmesi için zaman ufkunu belirleyin." },
        { name: "Aylık Bitcoin tahsisinizi ayarlayın", text: "Her ay BTC'ye ne kadar tasarruf akıyor." },
        { name: "Bir CAGR varsayımı seçin", text: "Muhafazakâr, ılımlı veya agresif Bitcoin büyüme oranı." },
        { name: "Tahmini birikiminizi inceleyin", text: "Emeklilikte BTC yığınınızı ve fiat eşdeğeri satın alma gücünü görün." },
      ],
    },
  },
  "profit-loss": {
    en: {
      name: "How to Calculate Your Bitcoin Profit or Loss",
      steps: [
        { name: "Enter your buy price", text: "The average price you paid per Bitcoin in USD." },
        { name: "Enter the amount of BTC", text: "Total Bitcoin held — full units or satoshis." },
        { name: "Enter your sell price", text: "Either the current market price or your target exit price." },
        { name: "Review P&L breakdown", text: "See absolute USD profit, percentage return, and break-even price." },
      ],
    },
    tr: {
      name: "Bitcoin Kâr veya Zararınızı Nasıl Hesaplarsınız",
      steps: [
        { name: "Alış fiyatınızı girin", text: "Bitcoin başına USD cinsinden ödediğiniz ortalama fiyat." },
        { name: "BTC miktarını girin", text: "Elinizdeki toplam Bitcoin — tam birim veya satoshi olarak." },
        { name: "Satış fiyatınızı girin", text: "Güncel piyasa fiyatı veya hedef çıkış fiyatınız." },
        { name: "Kâr/zarar dökümünü inceleyin", text: "Mutlak USD kârı, yüzde getiri ve başabaş fiyatını görün." },
      ],
    },
  },
  "stack-sats": {
    en: {
      name: "How to Set a Stack Sats Goal",
      steps: [
        { name: "Set a target sat amount", text: "Decide how many sats — 1M, 5M, 21M — you want to accumulate." },
        { name: "Enter your weekly or monthly budget", text: "How much fiat you can convert to sats on schedule." },
        { name: "Pick a price assumption", text: "Current price, average price, or a custom forecast." },
        { name: "Review your time-to-goal", text: "See estimated months until you hit the target stack." },
      ],
    },
    tr: {
      name: "Sat Biriktirme Hedefi Nasıl Belirlenir",
      steps: [
        { name: "Hedef sat miktarı belirleyin", text: "Biriktirmek istediğiniz sat miktarına karar verin — 1M, 5M, 21M." },
        { name: "Haftalık veya aylık bütçenizi girin", text: "Düzenli olarak sat'a ne kadar fiat dönüştürebilirsiniz." },
        { name: "Bir fiyat varsayımı seçin", text: "Güncel fiyat, ortalama fiyat veya özel tahmin." },
        { name: "Hedefe ulaşma sürenizi inceleyin", text: "Hedef yığına ulaşana kadar tahmini ay sayısını görün." },
      ],
    },
  },
  sip: {
    en: {
      name: "How to Use the Bitcoin SIP Calculator",
      steps: [
        { name: "Enter your monthly SIP amount", text: "The fixed installment you commit to each month." },
        { name: "Set the investment duration", text: "Number of years you plan to keep contributing." },
        { name: "Pick a CAGR assumption", text: "Expected annualised Bitcoin return." },
        { name: "Review projected wealth", text: "Total contributions, projected value, and effective yield." },
      ],
    },
    tr: {
      name: "Bitcoin SYP Hesaplayıcı Nasıl Kullanılır",
      steps: [
        { name: "Aylık SYP tutarınızı girin", text: "Her ay taahhüt ettiğiniz sabit taksit." },
        { name: "Yatırım süresini ayarlayın", text: "Katkıya devam etmeyi planladığınız yıl sayısı." },
        { name: "Bir CAGR varsayımı seçin", text: "Beklenen yıllıklandırılmış Bitcoin getirisi." },
        { name: "Tahmini serveti inceleyin", text: "Toplam katkı, tahmini değer ve etkin verim." },
      ],
    },
  },
  etf: {
    en: {
      name: "How to Compare Spot Bitcoin ETFs",
      steps: [
        { name: "Select two or more ETFs", text: "Pick IBIT, FBTC, ARKB, BITB or others from the list." },
        { name: "Set the investment amount", text: "Hypothetical USD allocation to compare across funds." },
        { name: "Choose a holding period", text: "1 year, 3 years, or custom — drives the fee drag math." },
        { name: "Review the comparison table", text: "See expense-ratio cost, AUM, and tracking versus spot BTC." },
      ],
    },
    tr: {
      name: "Spot Bitcoin ETF'lerini Nasıl Karşılaştırırsınız",
      steps: [
        { name: "İki veya daha fazla ETF seçin", text: "Listeden IBIT, FBTC, ARKB, BITB veya diğerlerini seçin." },
        { name: "Yatırım tutarını ayarlayın", text: "Fonlar arasında karşılaştırmak için varsayımsal USD tahsisi." },
        { name: "Tutma süresini seçin", text: "1 yıl, 3 yıl veya özel — komisyon etkisini belirler." },
        { name: "Karşılaştırma tablosunu inceleyin", text: "Gider oranı maliyeti, AUM ve spot BTC'ye karşı izleme." },
      ],
    },
  },
};
