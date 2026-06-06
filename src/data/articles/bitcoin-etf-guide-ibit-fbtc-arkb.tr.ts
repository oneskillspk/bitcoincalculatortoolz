import { Article } from '../articles';

/** TR counterpart of `bitcoin-etf-guide-ibit-fbtc-arkb` → `/tr/ogrenin/bitcoin-etf-karsilastirma-ibit-fbtc-arkb`. */
const article: Article = {
  slug: 'bitcoin-etf-karsilastirma-ibit-fbtc-arkb',
  title: 'Bitcoin ETF Karşılaştırma 2026: IBIT vs FBTC vs ARKB',
  metaDescription: 'IBIT: 70 milyar $+ AUM, %0,25 ücret. FBTC: 17,7 milyar $, %0,25. ARKB: %0,21 en düşük ücret. Tüm spot Bitcoin ETF\'lerini saklama, IRA uygunluğu ve gider oranına göre karşılaştırın.',
  category: 'Investing',
  publishedDate: '2026-03-09',
  updatedDate: '2026-05-18',
  readingTime: 10,
  keywords: ['bitcoin etf karşılaştırma', 'IBIT vs FBTC', 'en iyi bitcoin etf', 'bitcoin etf ücretleri', 'spot bitcoin etf', 'ARKB bitcoin', 'bitcoin etf vs bitcoin alma'],
  relatedCalculators: ['etf', 'capital-gains-tax', 'investment', 'dca'],
  relatedArticles: ['bitcoin-vergi-rehberi-sermaye-kazanci', 'bitcoin-dca-vs-toplu-yatirim', 'ne-kadar-bitcoin-sahibi-olmaliyim'],
  faqs: [
    { question: 'Hangi Bitcoin ETF\'sinin gider oranı en düşük?', answer: 'Grayscale Bitcoin Mini Trust (BTC) %0,15 ile en düşük gider oranına sahiptir; ardından Bitwise BITB ve VanEck HODL %0,20 ile gelir. IBIT ve FBTC %0,25, orijinal GBTC ise %1,50 ile en pahalısıdır.' },
    { question: 'Bitcoin ETF\'si doğrudan Bitcoin almaktan daha iyi mi?', answer: 'Bitcoin ETF\'leri emeklilik hesapları (IRA), geleneksel broker yatırımcıları ve özel anahtarları yönetmeden düzenlenmiş saklama isteyenler için daha iyidir. Doğrudan Bitcoin sahipliği öz saklama savunucuları ve sürekli gider oranlarından kaçınmak isteyenler için daha iyidir.' },
    { question: 'Bitcoin ETF\'sini IRA veya 401(k)\'mde tutabilir miyim?', answer: 'Evet, IBIT, FBTC ve ARKB gibi spot Bitcoin ETF\'leri geleneksel IRA, Roth IRA ve bazı 401(k) planlarında tutulabilir. Bu, her işlemde sermaye kazancı tetiklemeden vergi avantajlı Bitcoin maruziyeti sağlar.' },
    { question: 'Bitcoin ETF\'leri temettü öder mi?', answer: 'Hayır, spot Bitcoin ETF\'leri temettü ödemez çünkü Bitcoin\'in kendisi getiri veya gelir üretmez. ETF\'ler yalnızca Bitcoin fiyatını takip eder.' },
    { question: 'Bitcoin ETF\'leri Bitcoin\'i borsada tutmaktan daha güvenli mi?', answer: 'Bitcoin ETF\'leri borsa saklama riskini ortadan kaldırır çünkü hisseler düzenlenmiş broker\'larda SIPC korumasıyla tutulur. Ancak gerçek Bitcoin\'e değil, BTC maruziyetini temsil eden hisselere sahip olursunuz. Gerçek sahiplik ve sansüre direnç için öz saklama altın standart olmaya devam eder.' },
  ],
  howToSteps: [
    { name: 'ETF gider oranlarını karşılaştırın', text: 'Her Bitcoin ETF\'sinin yıllık gider oranını inceleyin. Düşük ücretler zamanla katlanır — 50.000$\'lık yatırımda on yıl boyunca %0,15 vs %1,50 binlerce dolar tasarruf sağlayabilir.' },
    { name: 'Broker uygunluğunuzu kontrol edin', text: 'Hangi Bitcoin ETF\'lerinin broker platformunuzda mevcut olduğunu doğrulayın. IBIT ve FBTC en geniş erişime sahiptir.' },
    { name: 'Vergi avantajlı uygunluğu belirleyin', text: 'IRA veya 401(k) üzerinden yatırım yapıyorsanız planınızın Bitcoin ETF alımlarına izin verdiğini onaylayın.' },
    { name: 'Uzun vadeli ücret etkisini hesaplayın', text: 'Gider oranlarının getirilerinizi 5, 10 veya 20 yıl boyunca nasıl etkilediğini modellemek için ETF Hesaplayıcımızı kullanın.' },
  ],
  sections: [
    {
      id: 'spot-bitcoin-etf-nedir',
      heading: 'Spot Bitcoin ETF Nedir?',
      content: '**Spot Bitcoin ETF**, gerçek Bitcoin\'i saklamada tutan ve bu temel BTC\'nin sahipliğini temsil eden hisseler ihraç eden bir borsada işlem gören fondur. Vadeli ETF\'lerin (Bitcoin türevlerini takip eder) aksine spot ETF\'ler doğrudan Bitcoin satın alıp saklar ve gerçek zamanlı Bitcoin piyasasını yakından yansıtan fiyat maruziyeti sağlar.\n\n[SEC ilk ABD spot Bitcoin ETF\'lerini](https://www.sec.gov/newsroom/speeches-statements/gensler-statement-spot-bitcoin-011023) Ocak 2024\'te onayladı; **kurumsal yatırımcılara**, emeklilik hesaplarına ve daha önce uyumlu erişimi olmayan geleneksel broker müşterilerine düzenlenmiş erişim açtı.\n\nTemel özellikler: **doğrudan BTC desteği** (her hisse saklamadaki Bitcoin\'in bir kesrini temsil eder), Coinbase Prime gibi nitelikli saklayıcılar aracılığıyla **düzenlenmiş saklama** ve gerçek zamanlı fiyat keşfi ile **gün içi işlem**.',
    },
    {
      id: 'etf-karsilastirma-tablosu',
      heading: 'Yan Yana ETF Karşılaştırması',
      content: 'Başlıca spot Bitcoin ETF\'lerinin güncel gider oranları ve detaylarıyla kapsamlı karşılaştırması:\n\n| ETF | İhraçcı | Gider Oranı | Başlangıç | Saklayıcı |\n|------|---------|-------------|-----------|-----------|\n| **BTC** | Grayscale | %0,15 | Tem 2024 | Coinbase |\n| **BITB** | Bitwise | %0,20 | Oca 2024 | Coinbase |\n| **HODL** | VanEck | %0,20 | Oca 2024 | Gemini |\n| **ARKB** | ARK/21Shares | %0,21 | Oca 2024 | Coinbase |\n| **IBIT** | BlackRock | %0,25 | Oca 2024 | Coinbase |\n| **FBTC** | Fidelity | %0,25 | Oca 2024 | Fidelity |\n| **GBTC** | Grayscale | %1,50 | Eyl 2013 | Coinbase |\n\n**Gider oranı** yönetim altındaki varlıkların yüzdesi olarak yıllık ücreti temsil eder. 10.000$\'lık yatırımda %0,15 ücret yıllık 15$, %1,50 ücret 150$ maliyetlidir — uzun [tutma dönemlerinde](/tr/ogrenin/bitcoin-hodl-stratejisi-aciklamasi) önemli ölçüde katlanan 10 kat fark.',
    },
    {
      id: 'ibit-detay',
      heading: 'IBIT: BlackRock iShares Bitcoin Trust',
      content: '**IBIT** (iShares Bitcoin Trust) BlackRock\'ın amiral Bitcoin ETF\'sidir ve hızla en büyük spot Bitcoin ETF\'si haline gelmiştir. 10+ trilyon $ AUM ile dünyanın en büyük varlık yöneticisi olan BlackRock\'ın girişi Bitcoin\'i kurumsal sınıf varlık olarak meşrulaştırdı.\n\n• **Gider oranı:** %0,25 (2025 sonuna kadar ilk 5 milyar $ varlık için %0,12\'ye feragat)\n• **Saklayıcı:** Coinbase Prime\n• **İşlem hacmi:** Bitcoin ETF\'leri arasında en yüksek, dar alış-satış spread\'i sağlar\n• **Erişilebilirlik:** Fidelity, Schwab, Vanguard ve çoğu broker\'da geniş çapta mevcut\n\nIBIT\'in devasa likiditesi büyük kurumsal işlemler için idealdir.',
    },
    {
      id: 'fbtc-detay',
      heading: 'FBTC: Fidelity Wise Origin Bitcoin Fund',
      content: '**FBTC** (Wise Origin Bitcoin Fund) Fidelity\'nin spot Bitcoin ETF\'sidir; üçüncü taraf saklayıcılar yerine **Fidelity\'nin kendi saklama çözümünü** kullanmasıyla dikkat çeker. Fidelity Digital Assets 2018\'den beri Bitcoin saklamaktadır.\n\n• **Gider oranı:** Yıllık %0,25\n• **Saklayıcı:** Fidelity Digital Assets (kurum içi, Coinbase değil)\n• **Özgün avantaj:** Dikey entegre saklama karşı taraf riskini azaltır\n• **Sorunsuz entegrasyon:** Fidelity broker hesaplarında yerel destek\n\nFidelity müşterileri için FBTC, yeni hesap açma ihtiyacı olmadan Bitcoin maruziyetine en basit yoldur.',
    },
    {
      id: 'arkb-detay',
      heading: 'ARKB: ARK 21Shares Bitcoin ETF',
      content: '**ARKB** Cathie Wood\'un ARK Invest\'i ile Avrupa kripto ETP lideri 21Shares arasındaki ortak girişimdir.\n\n• **Gider oranı:** %0,21 (en düşük kalıcı oranlardan biri)\n• **Saklayıcı:** Coinbase Prime\n• **ARK sinerjisi:** ARK\'ın inovasyon odaklı yatırım felsefesini tamamlar\n• **Rekabetçi fiyat:** IBIT ve FBTC\'nin %0,04 altında\n\nARKB özellikle on yıllar süren [DCA stratejilerinde](/tr/ogrenin/bitcoin-dca-nedir) bileşik etki yaratan hafif maliyet avantajı arayan uzun vadeli tutucular için cazip.',
    },
    {
      id: 'etf-vs-dogrudan',
      heading: 'ETF vs Doğrudan Bitcoin Sahipliği',
      content: 'Bitcoin ETF\'leri ile doğrudan sahiplik arasındaki seçim önceliklerinize bağlıdır:\n\n**ETF\'leri tercih edin:**\n• Vergi avantajlı hesaplar (IRA, 401k uyumluluğu)\n• Özel anahtarları yönetmeden düzenlenmiş saklama\n• Mevcut broker portföyleriyle entegrasyon\n• Güvenlik, yedekleme veya miras planlama sorumluluğu yok\n• Kurumsal sınıf sigorta ve uyum\n\n**Doğrudan Bitcoin\'i tercih edin:**\n• Öz saklama ile gerçek sahiplik (anahtar sizde değilse coin sizde değildir)\n• Getirileri yiyen sürekli gider oranı yok\n• Bitcoin\'i para birimi veya teminat olarak kullanma\n• Gizlilik ve sansüre direnç\n\nMaliyet açısından doğrudan Bitcoin sahipliği **sıfır sürekli ücretliyken** ETF\'ler yıllık %0,15–1,50 alır. 20 yıl tutulan 100.000$\'lık pozisyonda %0,25 ücret bile binlerce dolar değer kaybına dönüşür.',
      cta: { calculatorId: 'etf', calculatorName: 'ETF Hesaplayıcısı', text: 'ETF gider oranlarının uzun vadeli Bitcoin getirilerinizi nasıl etkilediğini hesaplayın', path: '/tr/hesaplayicilar/bitcoin-etf-hesaplayicisi' },
    },
    {
      id: 'vergi-etkileri',
      heading: 'Bitcoin ETF\'lerinin Vergi Etkileri',
      content: 'Bitcoin ETF vergilendirmesi standart menkul kıymet kurallarını izler:\n\n**Vergiye tabi broker hesapları:**\n• ETF hisseleri satıldığında sermaye kazancı vergisi uygulanır\n• Kısa vadeli (< 1 yıl): Sıradan gelir gibi vergilendirilir\n• Uzun vadeli (> 1 yıl): %0, %15 veya %20 tercihli oranlar\n• "Wash sale" kuralları uygulanır (mevcut doğrudan kripto için geçerli değil)\n\n**Vergi avantajlı hesaplar (büyük fayda):**\n• **Traditional IRA:** Katkılar vergi düşülebilir; kazançlar çekime kadar vergi ertelemeli\n• **Roth IRA:** Tüm Bitcoin kazançları dahil nitelikli çekimlerde vergi yok\n• **401(k):** Bitcoin maruziyetinde işveren eşleşmesi; vergi ertelemeli büyüme\n\nBitcoin pozisyonlarınızın detaylı vergi hesaplamaları için [Sermaye Kazancı Vergi Hesaplayıcımızı](/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi) kullanın.',
      cta: { calculatorId: 'capital-gains-tax', calculatorName: 'Sermaye Kazancı Vergi Hesaplayıcısı', text: 'Bitcoin sermaye kazancı vergi yükümlülüğünüzü tahmin edin', path: '/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi' },
    },
  ],
  expertQuote: {
    quote: 'Spot Bitcoin ETP\'leri diğer emtia bazlı ETP\'lere benzer şekilde çalışır ve yatırımcılara düzenlenmiş, şeffaf bir üründe Bitcoin maruziyeti sağlar.',
    author: 'ABD Menkul Kıymetler ve Borsa Komisyonu',
    role: 'Spot Bitcoin ETP\'lerinin Onayı Açıklaması (10 Ocak 2024)',
    source: 'https://www.sec.gov/news/statement/gensler-statement-spot-bitcoin-011023',
    sourceLabel: 'sec.gov',
  },
};

export default article;
