import { Article } from '../articles';

/** TR counterpart of `bitcoin-vs-real-estate-sp500-gold-comparison` → `/tr/ogrenin/bitcoin-gayrimenkul-sp500-altin-karsilastirma`. */
const article: Article = {
  slug: 'bitcoin-gayrimenkul-sp500-altin-karsilastirma',
  title: 'Bitcoin vs Gayrimenkul, S&P 500 ve Altın: Tam Karşılaştırma',
  metaDescription: 'Bitcoin\'in 10 yıllık CAGR\'ı ~%72 vs gayrimenkul %5-7 ve S&P 500 %14. Getirileri, Sharpe Oranı\'nı, likiditeyi ve enflasyon korumasını ücretsiz aracımızla karşılaştırın.',
  category: 'Market Analysis',
  publishedDate: '2026-03-09',
  updatedDate: '2026-05-18',
  readingTime: 11,
  keywords: ['bitcoin vs gayrimenkul', 'bitcoin vs altın vs hisse', 'bitcoin vs s&p 500 getirileri', 'en iyi yatırım varlığı 2026', 'bitcoin gayrimenkul karşılaştırma'],
  relatedCalculators: ['btc-vs-real-estate', 'cagr', 'correlation', 'what-if'],
  relatedArticles: ['bitcoin-altin-sp500-karsilastirma', 'bitcoin-hodl-stratejisi-aciklamasi', 'bitcoin-guc-yasasi-aciklamasi'],
  faqs: [
    { question: 'Bitcoin son 10 yılda gayrimenkulü geride bıraktı mı?', answer: 'Evet, dramatik şekilde. 2016\'dan 2026\'ya Bitcoin yaklaşık %70-80 CAGR sundu, ABD konut gayrimenkulü ise (kira geliri dahil) yıllık ortalama %5-8 sundu. Ancak gayrimenkul ipotek yoluyla kaldıraç ve daha istikrarlı nakit akışı sunar.' },
    { question: 'Bitcoin ile S&P 500\'ün risk ayarlı getirileri nedir?', answer: 'Bitcoin, aşırı oynaklığına rağmen çoğu çok yıllık dönemde S&P 500\'den daha yüksek Sharpe Oranı\'na sahiptir, çünkü getirileri o kadar büyük olmuştur ki riski fazlasıyla telafi eder. 2020-2026 döneminde Bitcoin\'in Sharpe Oranı yaklaşık 1,2-1,5, S&P 500\'ünki ise 0,8-1,0 idi.' },
    { question: 'Bitcoin, hisseler, gayrimenkul ve altın arasında nasıl tahsis yapmalıyım?', answer: 'Çoğu finansal danışman risk toleransınıza bağlı olarak portföyünüzün %1-10\'unu Bitcoin\'e tahsis etmenizi önerir. Yaygın bir dengeli yaklaşım: %50-60 hisse (S&P 500), %20-30 gayrimenkul (GYO veya doğrudan), %5-10 Bitcoin ve %5-10 altın.' },
    { question: 'Bitcoin ve gayrimenkul nasıl farklı vergilendirilir?', answer: 'Bitcoin ABD\'de mülk olarak vergilendirilir — kısa vadeli kazançlar olağan gelir, uzun vadeli kazançlar tercihli oranlar alır. Gayrimenkul benzersiz avantajlar sunar: 1031 değişimleri, ipotek faiz indirimleri, amortisman düşümleri ve 250K $/500K $ birincil konut istisnası.' },
    { question: 'Emeklilik planlaması için hangi varlık en iyisi?', answer: 'Uzun vadeli emeklilik için çeşitlendirilmiş bir yaklaşım en iyi sonucu verir. S&P 500 güvenilir büyümenin en uzun sicilini sunar. Gayrimenkul enflasyona karşı korunan gelir sağlar. Bitcoin asimetrik yukarı yön sunar ancak %50-80 düşüşler için tolerans gerektirir.' }
  ],
  howToSteps: [
    { name: 'Karşılaştırma zaman dilimini tanımlayın', text: 'Varlık getirilerini karşılaştırmak için anlamlı bir dönem (5, 10 veya 15 yıl) seçin. Kısa dönemler Bitcoin\'in oynaklık döngüleri nedeniyle yanıltıcı olabilir.' },
    { name: 'Ham ve risk ayarlı getirileri karşılaştırın', text: 'Ham getiriler için CAGR ve risk ayarlı karşılaştırma için Sharpe Oranı\'nı kullanın.' },
    { name: 'Likidite ve erişilebilirliği değerlendirin', text: 'Her varlığı ne kadar hızlı satın alıp satabileceğinizi düşünün. Bitcoin 7/24 likittir, hisseler piyasa saatlerinde işlem görür, gayrimenkul haftalar ila aylar sürer.' },
    { name: 'Çeşitlendirme için korelasyonu değerlendirin', text: 'Bitcoin\'in diğer varlıklara göre nasıl hareket ettiğini görmek için Korelasyon Hesaplayıcısı\'nı kullanın.' },
    { name: 'İdeal tahsisinizi modelleyin', text: 'Risk toleransınız, zaman ufkunuz ve hedeflerinize göre her varlık sınıfına ne yüzde tahsis edeceğinizi belirleyin.' }
  ],
  sections: [
    {
      id: 'getiri-karsilastirmasi',
      heading: '10 Yıllık Getiri Karşılaştırması',
      content: 'Manşet sayıları dramatik bir hikâye anlatıyor. Ocak 2016\'da her varlık sınıfına yatırılan 10.000 $\'ın Ocak 2026\'ya kadar nasıl büyüdüğü:\n\n| Varlık | Başlangıç Yatırımı | Oca 2026 Değeri | Toplam Getiri | CAGR |\n|-------|-------------------|-------------------|-------------|------|\n| Bitcoin | 10.000 $ | ~1.900.000 $ | +%18.900 | ~%72 |\n| [S&P 500](https://en.wikipedia.org/wiki/S%26P_500) | 10.000 $ | ~32.000 $ | +%220 | ~%12,3 |\n| ABD Gayrimenkul ([Case-Shiller Endeksi](https://fred.stlouisfed.org/series/CSUSHPISA)) | 10.000 $ | ~20.500 $ | +%105 | ~%7,4 |\n| [Altın](https://en.wikipedia.org/wiki/Gold_as_an_investment) | 10.000 $ | ~24.000 $ | +%140 | ~%9,2 |\n\nBitcoin\'in **yaklaşık %72 CAGR\'ı** her geleneksel varlık sınıfını cüce bırakıyor. Ancak ham getiriler tüm hikâyeyi anlatmaz — Bitcoin yol boyunca -%84 (2018) ve -%77 (2022) düşüşler de yaşadı. Her iki çöküşte de panikle satan bir yatırımcı çok farklı sonuçlar elde ederdi.\n\nDetaylı iki varlık karşılaştırması için [Bitcoin vs Altın vs S&P 500](/tr/ogrenin/bitcoin-altin-sp500-karsilastirma) analizimize bakın.',
      cta: { calculatorId: 'cagr', calculatorName: 'CAGR Hesaplayıcısı', text: 'Herhangi bir varlık için bileşik yıllık büyüme oranını hesaplayın', path: '/tr/hesaplayicilar/bitcoin-yillik-buyume' }
    },
    {
      id: 'risk-ayarli',
      heading: 'Risk Ayarlı Getiriler ve Sharpe Oranı',
      content: 'Ham getiriler **risk** bağlamı olmadan anlamsızdır. **Sharpe Oranı**, oynaklık birimi başına ne kadar getiri kazandığınızı ölçer — daha yüksek Sharpe Oranı daha iyi risk ayarlı performans demektir.\n\n| Varlık | Yıllık Getiri | Yıllık Oynaklık | Sharpe Oranı (10Y) | Maks Düşüş |\n|-------|------------------|----------------------|-------------------|--------------|\n| Bitcoin | ~%72 | ~%65 | ~1,0-1,3 | -%84 |\n| S&P 500 | ~%12,3 | ~%16 | ~0,7-0,9 | -%34 |\n| ABD Gayrimenkul | ~%7,4 | ~%5 | ~0,8-1,1 | -%10 |\n| Altın | ~%9,2 | ~%15 | ~0,5-0,7 | -%20 |\n\nŞaşırtıcı bir şekilde, Bitcoin\'in aşırı oynaklığına rağmen (kabaca S&P 500\'ün 4 katı), Sharpe Oranı uzun zaman dilimlerinde rekabetçi veya üstündür.\n\nAncak **maksimum düşüş** Bitcoin\'in keskin şekilde ayrıldığı yerdir. %84\'lük bir düşüş, 100.000 $\'lık bir portföyün 16.000 $\'a düştüğü anlamına gelir — çoğu geleneksel yatırımcının tolere edemeyeceği psikolojik olarak yıkıcı bir deneyim. Bu nedenle uygun [pozisyon büyüklüğü](/tr/ogrenin/ne-kadar-bitcoin-sahibi-olmaliyim) kritiktir.'
    },
    {
      id: 'likidite',
      heading: 'Likidite ve Erişilebilirlik',
      content: 'Bitcoin\'in en az takdir edilen avantajlarından biri **likiditedir**:\n\n**Bitcoin**: Küresel borsalarda 7/24/365 işlem görür. Dakikalar içinde uzlaşma. Minimum yatırım yok ([satoshi](/tr/ogrenin/bitcoin-satoshi-nedir) kesirleri satın alabilirsiniz). Akredite yatırımcı gereksinimi yok. İnternet erişimi olan herhangi bir ülkeden erişilebilir.\n\n**S&P 500 (ETF\'ler aracılığıyla)**: ABD piyasa saatlerinde (Pzt-Cum 9:30-16:00 ET) işlem görür. T+1 günde uzlaşma. Kesirli hisseler için minimum yatırım 1 $\'a kadar düşük. Aracı kurum hesabı gerektirir.\n\n**Gayrimenkul**: Son derece likit değildir. Bir mülkü satmak ortalama 30-90 gün sürer ve %5-6 acente komisyonları, kapanış maliyetleri, denetimler ve yasal ücretler içerir.\n\n**Altın**: Fiziksel altın güvenli depolama gerektirir ve %3-8 alım/satım spread\'lerine sahiptir. Altın ETF\'leri (GLD gibi) piyasa saatlerinde hisse benzeri likiditeyle işlem görür. [Bitcoin işlem ücretleri](/tr/ogrenin/bitcoin-islem-ucretleri-aciklamasi) genellikle altın satıcı primlerinden düşüktür.'
    },
    {
      id: 'korelasyon',
      heading: 'Varlıklar Arası Korelasyon',
      content: 'Çeşitlendirme, varlıkların **düşük veya negatif korelasyona** sahip olduğunda en iyi şekilde çalışır — yani aynı anda aynı yönde hareket etmediklerinde.\n\n| Varlık Çifti | Korelasyon (5Y) | Çeşitlendirme Yararı |\n|-----------|-----------------|------------------------|\n| Bitcoin – S&P 500 | 0,25-0,40 | Orta |\n| Bitcoin – Altın | 0,05-0,15 | Güçlü |\n| Bitcoin – Gayrimenkul | 0,10-0,20 | Güçlü |\n| S&P 500 – Altın | -0,05-0,10 | Güçlü |\n| S&P 500 – Gayrimenkul | 0,40-0,55 | Zayıf |\n| Altın – Gayrimenkul | 0,15-0,25 | Orta |\n\nBitcoin\'in **altın ve gayrimenkulle düşük korelasyonu** onu geleneksel bir portföyde mükemmel bir çeşitlendirici yapar.\n\nÖnemli olarak, korelasyon statik değildir. Piyasa krizleri sırasında (Mart 2020 gibi), tüm risk varlıkları arasındaki korelasyonlar geçici olarak yükselme eğilimi gösterir — **"korelasyon yakınsaması"** olarak adlandırılan bir fenomen.',
      cta: { calculatorId: 'correlation', calculatorName: 'Korelasyon Hesaplayıcısı', text: 'Bitcoin ile diğer varlıklar arasındaki korelasyonu hesaplayın', path: '/tr/hesaplayicilar/bitcoin-korelasyon' }
    },
    {
      id: 'vergi',
      heading: 'Vergi İşleminde Farklar',
      content: 'Her varlık sınıfının ABD\'de farklı vergi muamelesi vardır, bu da gerçek vergi sonrası getirileri önemli ölçüde etkiler:\n\n**Bitcoin**: Mülk olarak vergilendirilir. **Kısa vadeli kazançlar** (< 1 yıl tutulan) olağan gelir olarak vergilendirilir (%10-37). **Uzun vadeli kazançlar** (> 1 yıl tutulan) tercihli oranlarda vergilendirilir (%0, %15 veya %20). Şu anda kriptoya wash sale kuralı uygulanmıyor, bu [vergi-zarar hasadı](/tr/ogrenin/bitcoin-vergi-rehberi-sermaye-kazanci) stratejilerini mümkün kılar.\n\n**S&P 500**: Bitcoin ile aynı sermaye kazançları muamelesi. Temettüler nitelikli temettü oranlarında vergilendirilir (%0-20). Vergi avantajlı hesaplar (401k, IRA) erteleme veya muafiyet sağlar.\n\n**Gayrimenkul**: En fazla vergi avantajını sunar. **1031 değişimleri** yatırım mülkleri arasında vergi ertelenmiş takaslara izin verir. **Amortisman** indirimleri vergiye tabi kira gelirini azaltır. **İpotek faizi** indirilebilir. Birincil konutlar **250K $/500K $ sermaye kazançları istisnası** alır.\n\n**Altın**: **Koleksiyon** olarak sınıflandırılır, uzun vadeli sermaye kazançları için maksimum %28 vergi alınır — hisseler ve Bitcoin için standart %20 maksimumdan yüksek.\n\nBitcoin\'e özgü vergi yükümlülüğünüzü tahmin etmek için [Sermaye Kazancı Vergi Hesaplayıcımızı](/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi) kullanın.'
    },
    {
      id: 'tahsis',
      heading: 'Portföy Tahsisi Stratejileri',
      content: 'Her varlığın getiri, risk ve korelasyon profilleri göz önüne alındığında, risk toleransına göre üç model portföy:\n\n**Tutucu Portföy** (düşük risk, istikrarlı gelir):\n• %40 S&P 500 endeks fonları\n• %30 Gayrimenkul (GYO + doğrudan)\n• %20 Tahviller/sabit gelir\n• %5 Altın\n• %5 Bitcoin\n\n**Dengeli Portföy** (orta risk, büyüme odaklı):\n• %50 S&P 500 endeks fonları\n• %20 Gayrimenkul (GYO\'lar)\n• %10 Uluslararası hisseler\n• %10 Bitcoin\n• %10 Altın\n\n**Agresif Portföy** (yüksek risk, maksimum büyüme):\n• %40 S&P 500 endeks fonları\n• %25 Bitcoin\n• %15 Gayrimenkul\n• %10 Büyüme/teknoloji hisseleri\n• %10 Alternatif kripto varlıklar\n\nFidelity ve ARK Invest araştırması, **%1-5 Bitcoin tahsisinin** bile geleneksel 60/40 portföyler için risk ayarlı getirileri tarihsel olarak iyileştirdiğini gösteriyor.\n\nDoğrudan Bitcoin\'i gayrimenkulle [BTC vs Gayrimenkul Hesaplayıcımızla](/tr/hesaplayicilar/bitcoin-gayrimenkul) karşılaştırın.'
    },
    {
      id: 'hangi-varlik',
      heading: 'Hangi Varlık Sizin İçin Doğru?',
      content: 'En iyi yatırım **zaman ufkunuza, risk toleransınıza, gelir ihtiyaçlarınıza ve vergi durumunuza** bağlıdır:\n\n• **Bitcoin\'i seçin** eğer: 5+ yıllık zaman ufkunuz varsa, %50-80 düşüşleri tolere edebiliyorsanız, en yüksek büyüme potansiyelini istiyorsanız. Bitcoin\'in [HODL stratejisi](/tr/ogrenin/bitcoin-hodl-stratejisi-aciklamasi) sabırlı sahipleri her döngüde ödüllendirdi.\n\n• **S&P 500\'ü seçin** eğer: Yönetilebilir oynaklıkla güvenilir uzun vadeli büyüme istiyorsanız, 500 şirket arasında geniş çeşitlendirme istiyorsanız.\n\n• **Gayrimenkulü seçin** eğer: (İpotekler aracılığıyla) kaldıraçlı getiriler, kiradan istikrarlı nakit akışı, önemli vergi avantajları ve somut bir varlık istiyorsanız.\n\n• **Altını seçin** eğer: Bir kriz koruması, enflasyon koruması ve hisselerle düşük korelasyon istiyorsanız.\n\n• **Dördünü de seçin** eğer: Gerçek çeşitlendirme istiyorsanız. Bu dört varlık sınıfını birleştiren bir portföy, herhangi bir tek varlıktan daha iyi risk ayarlı getiriler sağlamıştır.\n\nEn önemli karar hangi tek varlığı seçeceğiniz değil — **her birine ne kadar tahsis edileceği**.',
      cta: { calculatorId: 'btc-vs-real-estate', calculatorName: 'BTC vs Gayrimenkul Hesaplayıcısı', text: 'Bitcoin ve gayrimenkul yatırım getirilerini karşılaştırın', path: '/tr/hesaplayicilar/bitcoin-gayrimenkul' }
    }
  ]
};

export default article;
