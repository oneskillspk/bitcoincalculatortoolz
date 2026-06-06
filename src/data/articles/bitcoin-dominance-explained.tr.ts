import { Article } from '../articles';

/** TR counterpart of `bitcoin-dominance-explained` → `/tr/ogrenin/bitcoin-dominansi-aciklamasi`. */
const article: Article = {
  slug: 'bitcoin-dominansi-aciklamasi',
  title: 'Bitcoin Dominansı Açıklandı: BTC.D ve Altcoin Sezonu',
  metaDescription:
    'BTC.D = Bitcoin\'in piyasa değeri ÷ toplam kripto piyasa değeri × 100. %60\'ın altına düşüşler tarihsel olarak altcoin sezonunun habercisi olmuştur. Anlamını ve nasıl kullanılacağını öğrenin.',
  category: 'Market Analysis',
  publishedDate: '2026-03-09',
  updatedDate: '2026-05-18',
  readingTime: 8,
  keywords: ['bitcoin dominansı', 'BTC.D', 'bitcoin dominans grafiği', 'altcoin sezonu göstergesi', 'kripto pazar payı'],
  relatedCalculators: ['dominance', 'fear-greed-index', 'on-chain', 'supply'],
  relatedArticles: [
    'korku-acgozluluk-endeksi-nedir',
    'bitcoin-zincir-uzeri-metrikler-rehberi',
    'bitcoin-servet-dagilimi',
    'bitcoin-stok-akis-modeli',
  ],
  faqs: [
    {
      question: 'Sağlıklı Bitcoin dominansı nedir?',
      answer: 'Bitcoin dominansı genellikle %40-70 aralığındadır. %70 üzeri altcoinlerin aşırı satıldığını, %40 altı ise aşırı ısınmış altcoin sezonunu gösterir. %50-60 dengeli kabul edilir.',
    },
    {
      question: 'Düşen Bitcoin dominansı altseason başladığı anlamına mı gelir?',
      answer: 'Her zaman değil. Dominans iki nedenle düşebilir: 1) Bitcoin altcoinlerden hızlı düşüyor (ayı piyasası), 2) Altcoinler Bitcoin\'den hızlı yükseliyor (altseason). Gerçek altseason için toplam piyasa değeri büyürken dominans düşmelidir.',
    },
    {
      question: 'Bitcoin dominansını gerçek zamanlı nasıl izlerim?',
      answer: 'CoinMarketCap, CoinGecko, TradingView (BTC.D sembolü) veya Glassnode gibi platformlardan takip edebilirsiniz. Dominans Hesaplayıcımız da geçmiş bağlam ve trend analizi sunar.',
    },
    {
      question: 'Bitcoin dominansı hesabı stablecoin\'leri içerir mi?',
      answer: 'Veri sağlayıcısına bağlıdır. Bazı platformlar USDT ve USDC\'yi toplam piyasa değerine dahil ederek dominansı düşürür. Diğerleri yalnızca "yatırım yapılabilir" kripto pazarını göstermek için stablecoin\'leri hariç tutar.',
    },
  ],
  howToSteps: [
    { name: 'Temel hesaplamayı anlayın', text: 'Bitcoin dominansı = (Bitcoin piyasa değeri ÷ Toplam kripto piyasa değeri) × 100' },
    { name: 'Dominans trendlerini belirleyin', text: 'Yükselen dominans Bitcoin\'in altcoinlerden iyi performans gösterdiğini, düşen dominans altcoin gücünü veya Bitcoin zayıflığını işaret eder.' },
    { name: 'Piyasa zamanlaması için dominansı kullanın', text: 'Aşırı okumalar (%70 üzeri veya %40 altı) dönüm noktalarını işaret eder.' },
    { name: 'Diğer göstergelerle birleştirin', text: 'Dominansı Korku-Açgözlülük Endeksi, on-chain metrikler ve toplam piyasa değeri ile birlikte kullanın.' },
    { name: 'Hesaplayıcımızla takip edin', text: 'Bitcoin Dominans Hesaplayıcısını kullanarak gerçek zamanlı BTC.D verisini ve geçmiş grafikleri görüntüleyin.' },
  ],
  sections: [
    {
      id: 'dominans-nedir',
      heading: 'Bitcoin Dominansı Nedir?',
      content: 'Bitcoin dominansı (kısaca **BTC.D**), Bitcoin\'in [piyasa değerini](https://en.wikipedia.org/wiki/Market_capitalization) **toplam kripto para piyasa değerine** göre ölçen bir metriktir. Yüzde olarak ifade edilir:\n\n**Bitcoin Dominansı = (Bitcoin Piyasa Değeri ÷ Toplam Kripto Piyasa Değeri) × 100**\n\nÖrneğin Bitcoin\'in piyasa değeri 1,7 trilyon $ ve toplam kripto piyasa değeri 2,8 trilyon $ ise dominans yaklaşık %60,7\'dir. Bu metriği [CoinMarketCap](https://coinmarketcap.com/charts/#dominance-percentage) veya [TradingView (BTC.D)](https://www.tradingview.com/chart/?symbol=BTC.D) üzerinden canlı izleyebilirsiniz.\n\nDominans, kripto piyasa duyarlılığı ve sermaye dağılımı için bir **makro gösterge** işlevi görür. Tarihsel olarak %33 (2017-2018 altcoin balonu) ile %72 (2019 kripto kışı) arasında gezinmiştir.',
      cta: { calculatorId: 'dominance', calculatorName: 'Dominans Hesaplayıcısı', text: 'Bitcoin dominansını gerçek zamanlı takip edin', path: '/tr/hesaplayicilar/bitcoin-dominansi' },
    },
    {
      id: 'nasil-hesaplanir',
      heading: 'Bitcoin Dominansı Nasıl Hesaplanır?',
      content: 'Formül basit görünse de **metodoloji** sonucu önemli ölçüde etkiler:\n\n**Piyasa Değeri = Dolaşımdaki Arz × Güncel Fiyat**\n\n• **Dolaşımdaki Arz**: Bitcoin için ~19,8 milyon BTC. Altcoinlerde "dolaşımdaki arz" subjektif olabilir; bazı tokenlar kilitli, stake edilmiş veya vakıflarca tutuluyor olabilir.\n• **Fiyat Kaynağı**: CoinMarketCap, CoinGecko ve TradingView farklı dominans değerleri gösterebilir.\n• **Dahil Etme Kriterleri**: Bazı hesaplamalar **stablecoin\'leri** (USDT, USDC) hariç tutar. Stablecoinleri dahil etmek dominansı düşürür.\n• **Ölü/Etkisiz Coinler**: İşlem hacmi olmayan kriptoları dışlamak için kriterler değişkendir.',
    },
    {
      id: 'tarihsel-trendler',
      heading: 'Tarihsel Dominans Trendleri',
      content: 'Bitcoin dominansı 2017\'den beri farklı evrelerden geçti:\n\n| Dönem | Dominans | Piyasa Bağlamı |\n|-------|----------|----------------|\n| 2017 başı | %85-90 | Altcoin patlaması öncesi |\n| 2017 sonu | %33-38 | Altcoin manyası zirvesi |\n| 2018-2019 | %50-72 | Kripto kışı, kaliteye kaçış |\n| 2020 | %60-70 | Kurumsal benimseme |\n| 2021 H1 | %40-45 | DeFi/NFT patlaması |\n| 2022 | %40-48 | Ayı piyasası dayanıklılığı |\n| 2023-2024 | %50-58 | ETF beklentisi, toparlanma |\n| 2025-2026 | %55-62 | Kurumsal çağ olgunluğu |\n\n**2017-2018 döngüsü** klasik kalıbı oluşturdu: Bitcoin lider, altcoinler yetişir, dominans %40 altına düşer, ardından çöküş. **2024+ döngüsü** ETF\'ler sayesinde %55-62 aralığında daha stabil kalıyor.',
    },
    {
      id: 'altcoin-sezonu',
      heading: 'Bitcoin Dominansı ve Altcoin Sezonları',
      content: 'Dominans, **"altcoin sezonu"** için yaygın bir zamanlama göstergesidir.\n\nAltseason tetikleyicileri:\n• **BTC.D %50 altına düşer**: Para Bitcoin\'den alternatiflere akıyor\n• **Toplam piyasa değeri yükselir**: Yeni para girişi onaylanır\n• **Bitcoin fiyatı stabil veya yükseliyor**\n• **Korku-Açgözlülük Endeksi > 70**: Risk-on duyarlılığı\n\nUyarı işaretleri:\n• **BTC.D %40 altı**: Tarihsel olarak sürdürülemez\n• **Günlük yeni altcoin lansmanı**: Köpük göstergesi\n• **"Bitcoin öldü" anlatıları**: Aşırı rotasyon sinyali\n\nAltseason oyun planı: %60-70 dominansta kaliteli altcoin biriktirin; %40 altında profit-taking düşünün.',
    },
    {
      id: 'portfoy-tahsisi',
      heading: 'Portföy Tahsisinde Dominans Kullanımı',
      content: 'Yatırımcılar dominansı **dinamik tahsis aracı** olarak kullanır:\n\n**Dominans Yeniden Dengeleme Stratejisi:**\n• BTC.D > %65: Altcoin tahsisini artırın\n• BTC.D %45-65: Dengeli BTC/altcoin oranı koruyun\n• BTC.D < %45: Altcoin maruziyetini azaltın\n\n**Bitcoin Maksimalist Yaklaşımı:** Dominanstan bağımsız %80+ Bitcoin tutun.\n\n**Fırsatçı Yaklaşım:** Yüksek dominansta (>%65) 50/50; düşük dominansta (<%45) %80 Bitcoin (kontrarian).\n\nTemel içgörü: **Bitcoin dominansı ortalamaya geri döner.** %70 üzeri veya %40 altı uzun süreli durumlar keskin tersine dönüşlerle çözülür.',
    },
    {
      id: 'sinirlamalar',
      heading: 'Sınırlamalar ve Eleştiriler',
      content: 'Dominansın bazı sınırlamaları vardır:\n\n**Piyasa Değeri Sınırlamaları:**\n• Dolaşımdaki arz varsayımları altcoinlerde belirsiz olabilir\n• Düşük hacimli altcoinlerin fiyatı manipüle edilebilir\n• Stablecoin dahil etme dominansı sulandırır\n\n**Yapısal Değişiklikler:**\n• ETF\'ler ve kurumsal hazineler Bitcoin\'in oynaklık profilini değiştirdi\n• Bazı altcoinler artık gerçek fayda ve nakit akışına sahip\n• Lightning Ağı ve altcoin ölçeklendirme çözümleri sınırları bulanıklaştırıyor\n\n**Yanıltıcı Sinyaller:**\n• Ayı piyasasında Bitcoin altcoinlerden yavaş düştüğü için dominans düşebilir\n• Yeni coin lansmanları geçici çarpıtmalar yaratabilir\n\nEn iyi uygulama: Dominansı, Korku-Açgözlülük, on-chain metrikler ve makroekonomik faktörlerle birleştirilmiş bir analiz çerçevesinin bir girdisi olarak kullanın.',
      cta: { calculatorId: 'dominance', calculatorName: 'Dominans Hesaplayıcısı', text: 'Bitcoin dominansı trendlerini izleyin', path: '/tr/hesaplayicilar/bitcoin-dominansi' },
    },
  ],
};

export default article;
