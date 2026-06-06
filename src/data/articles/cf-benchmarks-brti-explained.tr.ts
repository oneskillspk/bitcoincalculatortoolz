import { Article } from '../articles';

/** TR counterpart of `cf-benchmarks-brti-explained` → `/tr/ogrenin/cf-benchmarks-brti-aciklamasi`. */
const article: Article = {
  slug: 'cf-benchmarks-brti-aciklamasi',
  title: 'CF Benchmarks BRTI: CME Bitcoin Vadelileri için Referans Oranı',
  metaDescription: 'CF Benchmarks BRTI\'nin CME Bitcoin vadelilerini gerçek zamanlı nasıl fiyatladığını, nasıl oluşturulduğunu ve spot BTC fiyatlarından neden farklı olabileceğini öğrenin.',
  category: 'Market Analysis',
  publishedDate: '2026-03-16',
  updatedDate: '2026-05-18',
  readingTime: 9,
  keywords: [
    'CF Benchmarks BRTI',
    'Bitcoin Gerçek Zamanlı Endeks',
    'CME Bitcoin vadeli',
    'Bitcoin referans oranı',
    'BRR',
    'Bitcoin benchmark fiyatı',
    'BRTI vs BRR',
    'Bitcoin ETF fiyatlama',
    'bitcoin kurumsal fiyat'
  ],
  relatedCalculators: ['etf', 'price-target', 'volatility', 'profit-loss'],
  relatedArticles: [
    'bitcoin-etf-karsilastirma-ibit-fbtc-arkb',
    'bitcoin-volatilitesi-aciklamasi',
    'bitcoin-hesaplama-formulleri',
  ],
  faqs: [
    {
      question: 'CF Benchmarks Bitcoin Gerçek Zamanlı Endeksi (BRTI) nedir?',
      answer: 'BRTI, CF Benchmarks Ltd tarafından Bitstamp, Coinbase, Gemini, itBit ve Kraken dahil başlıca borsalarda hacim ağırlıklı medyan kullanılarak hesaplanan, saniyede bir yayımlanan düzenlenmiş bir Bitcoin fiyat kıyaslamasıdır. CME CF Bitcoin Referans Oranı\'nın (BRR) gerçek zamanlı karşılığıdır.'
    },
    {
      question: 'BRTI borsa spot fiyatlarından nasıl farklıdır?',
      answer: 'BRTI birden fazla borsadaki fiyatları hacim ağırlıklı medyan kullanarak toplar; bu da onu herhangi bir tek borsa fiyatından manipülasyona daha dirençli kılar. Fark genelde %0,1\'den azdır ancak yüksek volatilite dönemlerinde genişleyebilir.'
    },
    {
      question: 'BRTI ile BRR arasındaki fark nedir?',
      answer: 'BRTI işlem günü boyunca saniyede bir hesaplanır — gerçek zamanlı kıyaslamadır. BRR (Bitcoin Referans Oranı) Londra saatiyle 16:00\'da 1 saatlik gözlem penceresi kullanılarak günde bir kez hesaplanır ve CME Bitcoin vadelilerini vade sonunda nakit uzlaştırmak için kullanılır.'
    },
    {
      question: 'BRTI Bitcoin ETF yatırımcıları için neden önemli?',
      answer: 'BlackRock\'ın IBIT ve Fidelity\'nin FBTC gibi Bitcoin ETF\'leri, NAV hesaplamaları için BRTI/BRR\'den türetilen CME tabanlı fiyatlamayı referans alır. Kıyaslamayı anlamak, yatırımcıların ETF fiyatlamasını ve spota karşı herhangi bir prim/iskontoyu yorumlamasına yardımcı olur.'
    }
  ],
  howToSteps: [
    { name: 'BRTI temellerini anlayın', text: 'BRTI\'nin başlıca borsalar arasında hesaplanan, saniyede bir düzenlenmiş bir Bitcoin fiyat kıyaslaması olduğunu öğrenin.' },
    { name: 'Metodolojiyi inceleyin', text: 'BRTI, Bitstamp, Coinbase, Gemini, itBit ve Kraken\'den hacim ağırlıklı medyan fiyatlama kullanır.' },
    { name: 'BRTI vs BRR karşılaştırın', text: 'BRTI gerçek zamanlıdır; BRR Londra saatiyle 16:00\'da günlüktür. CME vadelileri BRR\'ye karşı uzlaştırılır.' },
    { name: 'Yatırımlarınıza uygulayın', text: 'Bu bilgiyi ETF NAV hesaplamalarını, vadeli baz farkını ve kurumsal fiyatlamayı anlamak için kullanın.' }
  ],
  sections: [
    {
      id: 'giris',
      heading: 'Giriş',
      content: 'CF Benchmarks Bitcoin Gerçek Zamanlı Endeksi (BRTI), kurumsal finansta en yaygın referans alınan Bitcoin fiyat kıyaslamasıdır. CME Bitcoin vadelilerini, opsiyon sözleşmelerini destekler ve ETF sağlayıcıları, endeks fonları ve dünya çapındaki ticaret masaları tarafından kullanılır. BRTI\'nin nasıl hesaplandığını anlamak, yatırımcıların vadeli fiyatlamayı yorumlamasına, baz farkını izlemesine ve CME fiyatının bazen borsa spot fiyatlarından neden farklı olduğunu anlamasına yardımcı olur.'
    },
    {
      id: 'brti-nedir',
      heading: 'CF Benchmarks Bitcoin Gerçek Zamanlı Endeksi (BRTI) Nedir?',
      content: 'CF Benchmarks Bitcoin Gerçek Zamanlı Endeksi, Birleşik Krallık merkezli düzenlenmiş kıyaslama yöneticisi CF Benchmarks Ltd tarafından hesaplanan ve yayımlanan Bitcoin için gerçek zamanlı bir fiyat kıyaslamasıdır. BRTI, manipülasyona dirençli ve AB Kıyaslama Yönetmeliği (BMR) ile uyumlu olacak şekilde tasarlanmış, birden fazla başlıca kripto para borsasından türetilen, saniyede bir Bitcoin fiyatı sağlar.\n\nBRTI, Londra saatiyle 16:00\'da günde bir yayımlanan ve CME Bitcoin vadeli sözleşmelerini vade sonunda uzlaştırmak için kullanılan CME CF Bitcoin Referans Oranı\'nın (BRR) gerçek zamanlı karşılığıdır.'
    },
    {
      id: 'nasil-hesaplanir',
      heading: 'BRTI Nasıl Hesaplanır?',
      content: 'BRTI, tanımlı bir bileşen borsa kümesinde hacim ağırlıklı medyan fiyat metodolojisi kullanır. Hesaplama şu adımları izler:\n\n**Adım 1 — Veri toplama:** CF Benchmarks bileşen borsalardan gerçek zamanlı işlem verisi toplar. 2026 itibarıyla bileşen borsalar Bitstamp, Coinbase, Gemini, itBit (Paxos) ve Kraken\'dir. Yalnızca USD denomineli BTC spot işlemleri dahil edilir.\n\n**Adım 2 — Bölme aralığı:** Kısa bir kayan zaman penceresindeki tüm işlemler toplanır.\n\n**Adım 3 — Hacim ağırlıklandırma:** Her işlem hacmiyle ağırlıklandırılır. Daha büyük işlemler hesaplanan fiyat üzerinde orantılı olarak daha fazla etkiye sahiptir.\n\n**Adım 4 — Medyan hesaplama:** Basit ortalama yerine hacim ağırlıklı medyan hesaplanır. Medyan, aykırı işlemlere veya wash trading\'e karşı daha dayanıklı olduğu için ortalama yerine kullanılır — tek bir büyük anormal işlem medyanı bir ortalamayı hareket ettirdiği kadar kolay hareket ettiremez.\n\n**Adım 5 — Gerçek zamanlı yayın:** Sonuç fiyat aktif işlem saatleri boyunca saniyede bir sürekli olarak yayımlanır.'
    },
    {
      id: 'spot-farki',
      heading: 'BRTI Borsa Spot Fiyatlarından Nasıl Farklıdır?',
      content: 'BRTI birkaç nedenden ötürü herhangi bir bireysel borsa spot fiyatından biraz farklı olabilir. İlk olarak, birden fazla borsadaki fiyatları toplar, dolayısıyla tek bir mekan fiyatı yerine bir uzlaşı fiyatını temsil eder. İkinci olarak, hacim ağırlıklı medyan metodolojisi büyük bireysel emirler nedeniyle oluşan kısa fiyat sıçramalarını doğal olarak yumuşatır. Üçüncü olarak, BRTI yalnızca atanmış bileşen borsalarından gelen işlemleri içerir — Binance, OKX veya diğer bileşen olmayan borsalardaki fiyatlar hesaba katılmaz.\n\nÇoğu yatırımcı için fark küçüktür — genelde büyük borsa fiyatlarından %0,1\'den az. Ancak yüksek volatilite dönemlerinde BRTI ile belirli borsalar arasındaki baz farkı geçici olarak genişleyebilir.'
    },
    {
      id: 'neden-onemli',
      heading: 'BRTI Bitcoin Yatırımcıları için Neden Önemli?',
      content: 'BRTI\'yi anlamak dört yatırımcı grubu için önemlidir.\n\n**Vadeli işlem trader\'ları:** CME Bitcoin vadelileri BRR\'ye (BRTI\'nin günlük versiyonu) karşı nakit uzlaştırılır, dolayısıyla metodolojiyi anlamak trader\'ların uzlaşma fiyatlarını öngörmesine yardımcı olur.\n\n**ETF sahipleri:** BlackRock\'ın IBIT ve Fidelity\'nin FBTC gibi Bitcoin ETF\'leri NAV hesaplamaları için CME tabanlı fiyatlamayı referans alır.\n\n**Kurumsal yatırımcılar:** BRTI, kurumsal Bitcoin OTC ticaret anlaşmalarının çoğunda standart referans fiyattır.\n\n**Arbitraj trader\'ları:** BRTI ile borsa spot fiyatları arasındaki farklar, profesyonel ticaret firmalarının sürekli istismar ettiği arbitraj fırsatları yaratır.',
      cta: {
        calculatorId: 'etf',
        calculatorName: 'Bitcoin ETF Hesaplayıcı',
        text: 'ETF performansını doğrudan BTC sahipliği ile karşılaştırın',
        path: '/tr/hesaplayicilar/bitcoin-etf-hesaplayicisi'
      }
    },
    {
      id: 'brti-vs-brr',
      heading: 'BRTI vs BRR — Fark Nedir?',
      content: 'CF Benchmarks ilgili iki Bitcoin kıyaslaması yayımlar.\n\n**BRTI (Bitcoin Gerçek Zamanlı Endeks)** işlem günü boyunca saniyede bir hesaplanır ve yayımlanır — gerçek zamanlı kıyaslamadır.\n\n**BRR (Bitcoin Referans Oranı)** Londra saatiyle 16:00\'da, 15:00\'tan 16:00\'a uzanan 1 saatlik gözlem penceresi kullanılarak günde bir kez hesaplanır — CME vadelileri tarafından kullanılan günlük uzlaşma kıyaslamasıdır.\n\nCME Bitcoin vadelileri sona erdiğinde, nihai uzlaşma fiyatı o günün BRR\'sidir, BRTI değil. Vadelileri vadeye kadar tutan trader\'ların bu ayrımı anlaması gerekir.'
    },
    {
      id: 'sonuc',
      heading: 'Sonuç',
      content: 'Çoğu bireysel Bitcoin yatırımcısı için BRTI arka plan altyapısıdır — ETF\'lerin, vadelilerin ve kurumsal fiyatlamanın arkasında görünmeden çalışır. Metodolojisini anlamak, yatırımcılara düzenlenmiş Bitcoin finansal ürünlerini destekleyen fiyatların sağlam, manipülasyona dirençli ve düzenlenmiş bir süreçle hesaplandığına dair güven verir.\n\nETF performansını doğrudan BTC sahipliğiyle karşılaştırmak için [Bitcoin ETF Hesaplayıcımızı](/tr/hesaplayicilar/bitcoin-etf-hesaplayicisi), gelecekteki fiyat senaryolarını modellemek için [Bitcoin Fiyat Hedefi Hesaplayıcımızı](/tr/hesaplayicilar/bitcoin-fiyat-hedef) kullanın.'
    }
  ]
};

export default article;
