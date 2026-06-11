import { Article } from '../articles';

/** TR counterpart of `bitcoin-power-law-explained` → `/tr/ogrenin/bitcoin-guc-yasasi-aciklamasi`. */
const article: Article = {
  slug: 'bitcoin-guc-yasasi-aciklamasi',
  title: 'Bitcoin Güç Yasası Açıklaması: Fiyat Modeli ve Adil Değer Bantları',
  metaDescription: 'Fizikçi Giovanni Santostasi\'nin Bitcoin Güç Yasası, fiyatı modellemek için log-log regresyon kullanır. Adil değer bantlarını ve alım-satım bölgelerini ücretsiz öğrenin.',
  category: 'Market Analysis',
  publishedDate: '2026-02-18',
  updatedDate: '2026-05-18',
  readingTime: 9,
  keywords: ['bitcoin güç yasası', 'bitcoin power law', 'bitcoin fiyat tahmini', 'giovanni santostasi bitcoin', 'bitcoin uzun vadeli fiyat modeli'],
  relatedCalculators: ['power-law', 'what-if', 'investment', 'price-target'],
  relatedArticles: ['cf-benchmarks-brti-aciklamasi', 'bitcoin-altin-sp500-karsilastirma', 'bitcoin-hodl-stratejisi-aciklamasi', 'bitcoin-emeklilik-planlama-rehberi'],
  faqs: [
    { question: 'Bitcoin Güç Yasası nedir?', answer: 'Bitcoin Güç Yasası, astrofizikçi Giovanni Santostasi tarafından geliştirilen matematiksel bir modeldir. Bitcoin\'in fiyatının genesis bloğundan (3 Ocak 2009) bu yana geçen zamanla güç yasası ilişkisi izlediğini gösterir. Formül: Fiyat = A × (genesis\'ten beri günler)^n; A = 10^-16,493 ve n = 5,8.' },
    { question: 'Bitcoin Güç Yasası modelini kim oluşturdu?', answer: 'Model, fizikçi ve nörobilimci Giovanni Santostasi tarafından oluşturuldu. İlk olarak 2018\'de öne sürdü ve o zamandan beri Bitcoin\'in fiyat, benimsenme ve ağ etkilerinin güç yasası ölçeklemesi izlediğini gösteren kapsamlı araştırmalar yayınladı.' },
    { question: 'Bitcoin Güç Yasası tarihsel olarak ne kadar doğru?', answer: 'Bitcoin\'in 15+ yıllık tarihinde fiyat, Güç Yasası destek ve direnç bantları içinde yaklaşık %95 oranında kaldı. Her büyük boğa zirvesi direnç bandının altında, her ayı dibi alt bantta destek bulmuştur. Ancak geçmiş doğruluk gelecek sonuçları garanti etmez.' },
    { question: 'Güç Yasası\'nda Destek ve Direnç bantları nedir?', answer: 'Model üç koridor tanımlar: Adil Değer çizgisi (medyan regresyon), Destek bandı (Adil Değer ÷ 3, tarihsel olarak ucuz seviyeler) ve Direnç bandı (Adil Değer × 3, tarihsel olarak pahalı seviyeler). Destek altındaki fiyatlar tarihsel olarak en iyi uzun vadeli alım fırsatları olmuştur.' },
    { question: 'Bitcoin Güç Yasası modelinin sınırlamaları nelerdir?', answer: 'Model geçmiş davranışı geleceğe ekstrapole eder; kara kuğu olayları, düzenleyici değişiklikler, teknolojik bozulmalar veya Bitcoin\'in geçersiz hale gelmesini hesaba katamaz. Bitcoin\'in benimsenme eğrisinin tarihsel yörüngesini sürdüreceğini varsayar. Büyüme oranı (üs n) varlık olgunlaştıkça zamanla azalabilir. Birçok girdiden biri olarak kullanılmalı, kesin tahmin olarak değil.' },
  ],
  sections: [
    {
      id: 'guc-yasasi-nedir',
      heading: 'Bitcoin Güç Yasası Nedir?',
      content: 'Bitcoin Güç Yasası, fizikçi **Giovanni Santostasi** tarafından geliştirilen uzun vadeli bir fiyat modelidir ve Bitcoin\'in fiyatını zamanın matematiksel bir fonksiyonu olarak tanımlar. Orijinal araştırma [Harvard DASH deposunda](https://dash.harvard.edu/handle/1/37373907) yayınlandı.\n\nKazanç veya nakit akışı kullanan geleneksel değerleme modellerinin aksine, Güç Yasası Bitcoin\'i fiziksel veya biyolojik bir sistem gibi modeller — fiyat, ağ büyüklüğü ve benimsenmenin tümünün **güç yasası ölçekleme** izlediğini gösterir.\n\nTemel içgörü, Bitcoin\'in büyümesinin ne rastgele ne de üstel olduğudur. Tahmin edilebilir bir yavaşlama deseni izler: her büyüklük derecesindeki fiyat büyümesi bir öncekinden daha uzun sürer. Bu özellik — ölçek değişmezliği — galaksi oluşumundan şehir nüfus büyümesine kadar doğal sistemlerde yaygındır.\n\n2009\'dan bu yana Bitcoin\'in fiyatı modelin öngörülen koridorlarında yaklaşık %95 oranında kalmıştır.',
      cta: { calculatorId: 'power-law', calculatorName: 'Bitcoin Güç Yasası Hesaplayıcısı', text: 'Güç Yasası modelini kullanarak gelecekteki herhangi bir tarihte Bitcoin fiyatını projelendirin', path: '/tr/hesaplayicilar/bitcoin-guc-yasasi' },
    },
    {
      id: 'formul',
      heading: 'Güç Yasası Formülü Açıklaması',
      content: 'Modelin matematiksel omurgası basittir:\n\n**Fiyat = A × (Genesis\'ten Beri Günler)^n**\n\nBurada:\n• **A** = 10^(-16,493) — tarihsel regresyondan türetilen sabit\n• **n** = 5,8 — büyüme üssü (fiyatın zamanla ne kadar dik büyüdüğü)\n• **Genesis\'ten Beri Günler** = 3 Ocak 2009\'dan bu yana geçen günler\n\nBu, herhangi bir tarih için üç temel fiyat seviyesi üretir:\n\n**Adil Değer** — medyan regresyon çizgisi; tarihsel verilere dayalı "beklenen" fiyatı temsil eder.\n\n**Destek Bandı** — Adil Değer\'in yaklaşık 3\'e bölümü. Bitcoin tarihsel olarak yalnızca en derin ayı dibi anlarında kısa süre bu seviyenin altında işlem görmüştür.\n\n**Direnç Bandı** — Adil Değer\'in yaklaşık 3 ile çarpımı. Bitcoin tarihsel olarak boğa zirvelerinde bu seviyenin yakınında veya altında zirve yapmıştır.\n\nGüç yasalarının logaritmik doğası, bu bantların herhangi bir anda destek ile direnç arasında yaklaşık **bir büyüklük derecesi** (10x) kapsadığı anlamına gelir.',
    },
    {
      id: 'tarihsel-dogruluk',
      heading: 'Tarihsel Doğruluk ve Sicil',
      content: 'Güç Yasası\'nın en çekici özelliği tarihsel uyumdur. Her büyük Bitcoin fiyat olayı modele temiz biçimde oturur:\n\n**2013 Boğa Piyasası:** Zirve ~1.100$ — direnç bandı içinde\n**2017 Boğa Piyasası:** Zirve ~20.000$ — direnç bandına dokundu ama önemli ölçüde aşmadı\n**2018–2019 Ayı Piyasası:** Destek bandı yakınında dip\n**2021 Boğa Piyasası:** Zirve ~69.000$ — direnç bandı içinde kaldı\n**2022 Ayı Piyasası:** Dip ~15.500$ — destek bandına kısa süre dokundu\n**2024–2025 Boğa Piyasası:** 100.000$+\'a ulaştı — model yörüngesiyle tutarlı\n\nÖnemli olarak, **Bitcoin tarihindeki hiçbir büyük fiyat seviyesi Güç Yasası koridorlarının dışına kalıcı olarak kırılmamıştır.**\n\nAncak Bitcoin olgunlaştıkça ve piyasa değeri büyüdükçe büyüme üssü (n=5,8) düşebilir. Bazı analistler üssün 2030\'larda kademeli olarak 4–5\'e düşeceğini projeklendiriyor.',
    },
    {
      id: 'nasil-kullanilir',
      heading: 'Yatırım Kararları için Güç Yasası Nasıl Kullanılır?',
      content: 'Güç Yasası kısa vadeli işlem sinyali olarak değil **uzun vadeli konumlandırma aracı** olarak en iyi şekilde kullanılır:\n\n**Mevcut Sapmayı Kontrol Etme:**\nMevcut BTC fiyatının modelin Adil Değer\'inden ne kadar uzakta olduğunu hesaplayın. Bitcoin Adil Değer\'in %50 altında işlem görüyorsa, tarihsel olarak güçlü uzun vadeli giriş noktası olmuştur.\n\n**Uzun Vadeli Fiyat Hedefleri Belirleme:**\nModel kullanılarak Ocak 2030 için Adil Değer yaklaşık 500.000$–800.000$ projelendirilir; destek 150.000$–250.000$, direnç 1,5M$–2,5M$.\n\n**Portföy Yeniden Dengeleme:**\nBazı yatırımcılar Güç Yasası bantlarını yeniden dengeleme tetikleyicisi olarak kullanır — fiyat dirence yaklaştığında Bitcoin tahsisini azaltır, desteğe yakın olduğunda ekler.\n\n**Diğer Modellerle Birleştirme:**\nGüç Yasası, [geleneksel varlıklarla CAGR karşılaştırması](/tr/ogrenin/bitcoin-altin-sp500-karsilastirma) ve [HODL stratejisi](/tr/ogrenin/bitcoin-hodl-stratejisi-aciklamasi) gibi diğer çerçevelerle en iyi şekilde çalışır.',
      cta: { calculatorId: 'power-law', calculatorName: 'Bitcoin Güç Yasası Hesaplayıcısı', text: 'Bugünkü sapmayı kontrol edin ve hedef yıl fiyatınızı projelendirin', path: '/tr/hesaplayicilar/bitcoin-guc-yasasi' },
    },
    {
      id: 'diger-modellerle',
      heading: 'Güç Yasası vs Diğer Bitcoin Fiyat Modelleri',
      content: 'Birkaç uzun vadeli Bitcoin modeli vardır — Güç Yasası nasıl karşılaştırılır:\n\n| Model | Temel | Doğruluk | Sınırlama |\n|---|---|---|---|\n| Güç Yasası | Zaman regresyonu | Çok yüksek (%95+ bant içi) | Tarihsel desenin devam ettiğini varsayar |\n| Stock-to-Flow | Arz kıtlığı | Karışık — 2021 sonrası bozuldu | Talep tarafını hesaba katmaz |\n| Gökkuşağı Grafiği | Log regresyon | Güç Yasası\'na benzer | Daha az matematiksel olarak sıkı |\n| CAGR Projeksiyonu | Tarihsel getiriler | Başlangıç tarihine bağlı | Yavaşlayan büyümeyi göz ardı eder |\n\nGüç Yasası genellikle istatistiksel olarak en sağlam uzun vadeli Bitcoin modeli kabul edilir çünkü Bitcoin\'in yavaşlayan büyüme oranını hesaba katar.',
    },
    {
      id: 'sinirlamalar',
      heading: 'Sınırlamalar ve Riskler',
      content: 'Güç Yasası güçlü bir araçtır, ancak her yatırımcının anlaması gereken önemli sınırlamaları vardır:\n\n**1. Tahmin değil model.** Hiçbir matematiksel model gelecek fiyatları güvenilir biçimde tahmin edemez.\n\n**2. Döngüler içindeki zamanlamayı tahmin edemez.** Model size Bitcoin\'in nerede "olması gerektiğini" söyler, ne zaman oraya geleceğini değil.\n\n**3. Kara kuğu olayları fiyatlandırılmaz.** Düzenleyici yasaklar, protokol arızaları, kuantum bilişim tehditleri zaman bazlı regresyonda yer almaz.\n\n**4. Büyüme üssü düşebilir.** Bitcoin\'in piyasa değeri on trilyonlarca dolara büyüdükçe 5,8\'lik güç yasası büyümesini sürdürmek fiziksel olarak zorlaşır.\n\n**5. Çeşitlendirmenin yerini almaz.** Güç Yasası tutsa bile Bitcoin\'in %70+ düşüşleri çoğu yatırımcının çeşitlendirilmiş portföy içinde [pozisyonunu uygun şekilde boyutlandırmasını](/tr/ogrenin/ne-kadar-bitcoin-sahibi-olmaliyim) gerektirir.',
    },
    {
      id: 'cikarimlar',
      heading: 'Temel Çıkarımlar',
      content: '1. **Güç Yasası, Bitcoin\'in fiyatının zamanla tahmin edilebilir biçimde büyüdüğünü gösterir** — rastgelelikle değil, benimsenme ve ağ etkilerine bağlı matematiksel bir desenle.\n\n2. **Üç fiyat koridoru önemlidir:** Destek (Adil Değer ÷ 3), Adil Değer ve Direnç (Adil Değer × 3). Bitcoin tarihinin ~%95\'inde bu bantlar içinde kalmıştır.\n\n3. **Mevcut sapma en eyleme dönüştürülebilir sinyaldir.** Adil Değer\'e karşı önemli düşük değerleme tarihsel olarak en iyi uzun vadeli alım sinyallerinden biri olmuştur.\n\n4. **Diğer çerçevelerle birleştirin.** [Yarılanma döngüleri](/tr/ogrenin/bitcoin-yarilanmasi-nedir) ve portföy tahsis ilkeleriyle birlikte kullanın. Bitcoin\'in bileşik büyümesinin altın ve S&P 500 ile nasıl karşılaştırıldığını [bu rehberde](/tr/ogrenin/bitcoin-altin-sp500-karsilastirma) görün.\n\n5. **Uzun zaman ufukları riski azaltır.** Güç Yasası\'nın doğruluğu daha uzun vadelerde artar. Kısa vadeli ticaret aracı değil — çok yıllık yatırımcılar için tasarlanmıştır.',
    },
  ],
  howToSteps: [
    { name: 'Güç Yasası Hesaplayıcısını açın', text: 'Bitcoin Güç Yasası Hesaplayıcı aracına gidin' },
    { name: 'Hedef tarih seçin', text: 'Gelecek bir tarih seçin veya bir ön ayar kullanın (2026, 2028, 2030, 2035)' },
    { name: 'Projeksiyonlu fiyat aralığını inceleyin', text: 'Seçtiğiniz tarihte Adil Değer, Destek ve Direnç fiyat seviyelerini görün' },
    { name: 'Mevcut sapmayı kontrol edin', text: 'Bugünün Bitcoin fiyatının modelin Adil Değer\'inden ne kadar uzak olduğunu görün' },
    { name: 'Grafiği yorumlayın', text: 'Döngünün neresinde olduğumuzu anlamak için tam tarihsel koridor grafiğini görüntüleyin' },
  ],
  expertQuote: {
    quote: 'Bitcoin\'in fiyat büyümesi log-log uzayında uzun vadeli bir güç yasası yörüngesi izler ve bu koridor on yılı aşkın süredir birden fazla piyasa döngüsünde geçerliliğini korumuştur.',
    author: 'Giovanni Santostasi',
    role: 'Fizikçi & Güç Yasası modelinin yazarı',
    source: 'https://giovannisantostasi.medium.com/the-bitcoin-power-law-theory-962dfaf99ee9',
    sourceLabel: 'medium.com/@giovannisantostasi',
  },
};

export default article;
