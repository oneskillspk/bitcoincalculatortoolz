import type { Article } from '../articles';

/** TR counterpart of `bitcoin-volatility-explained` → `/tr/ogrenin/bitcoin-volatilitesi-aciklamasi`. */
const article: Article = {
  slug: 'bitcoin-volatilitesi-aciklamasi',
  title: 'Bitcoin Volatilitesi Açıklaması: Nasıl Ölçülür ve Kullanılır',
  metaDescription: "DVOL ÷ 20 = Bitcoin'in beklenen günlük hareketi. DVOL Şubat 2026'da %90'ı gördü — bir dip sinyali. Gerçekleşen vs zımni volatiliteyi öğrenin.",
  category: 'Market Analysis',
  publishedDate: '2026-03-12',
  updatedDate: '2026-05-20',
  readingTime: 10,
  keywords: [
    'bitcoin volatilitesi', 'bitcoin oynaklığı', 'btc volatilite hesaplayıcı',
    'bitcoin volatilite endeksi', 'DVOL', 'BVX', 'gerçekleşen volatilite', 'zımni volatilite',
    'bitcoin volatilitesi vs altın', 'bitcoin volatilitesi vs s&p 500', 'bitcoin için vix var mı',
    'bitcoin volatilitesi nasıl hesaplanır', 'bitcoin günlük oynaklık',
  ],
  relatedCalculators: ['volatility', 'correlation', 'drawdown', 'bitcoin-lot-size'],
  relatedArticles: ['bitcoin-gayrimenkul-sp500-altin-karsilastirma', 'bitcoin-dusus-tarihi', 'bitcoin-lot-buyuklugu-nasil-hesaplanir'],
  speakable: true,
  faqs: [
    { question: 'Bitcoin volatilitesi nedir?', answer: 'Bitcoin volatilitesi, BTC fiyatının zaman içinde ne kadar dalgalandığını ölçer. Günlük logaritmik getirilerin yıllıklandırılmış standart sapması olarak hesaplanır. Daha yüksek volatilite, daha büyük ve daha sık fiyat hareketleri anlamına gelir.' },
    { question: 'Bitcoin volatilitesi nasıl hesaplanır?', answer: 'Gerçekleşen volatilite, seçilen bir pencere (örn. 30 gün) üzerindeki günlük log getirilerin (ln(Pₜ/Pₜ₋₁)) standart sapması alınarak ve √365 ile çarpılarak yıllıklandırılır. Bitcoin her gün işlem gördüğü için √365 kullanılır; hisseler ~252 işlem günü ile √252 kullanır.' },
    { question: 'Gerçekleşen ve zımni volatilite arasındaki fark nedir?', answer: 'Gerçekleşen (tarihsel) volatilite geriye dönüktür ve gerçek verilerden geçmiş dalgalanmaları ölçer. Zımni volatilite ileriye dönüktür ve opsiyon piyasası fiyatlarından türetilir. DVOL ve BVX, Bitcoin için zımni volatilite endeksleridir.' },
    { question: 'Bitcoin için bir VIX var mı?', answer: 'Evet. DVOL (Deribit Volatilite Endeksi) ve BVX (CME CF Bitcoin Volatilite Endeksi, Nisan 2024\'te başlatıldı) Bitcoin\'in borsa VIX karşılıklarıdır. Her ikisi de 30 günlük ileriye dönük zımni volatiliteyi ölçer.' },
    { question: 'Bitcoin\'in ortalama volatilitesi nedir?', answer: 'Bitcoin\'in uzun vadeli ortalama yıllıklandırılmış volatilitesi %50–80 aralığındadır. 2026 2. çeyrek itibarıyla 30 günlük gerçekleşmiş volatilite yüksek-40\'lar ile düşük-50\'ler arasında seyrediyor; ETF akışları ve kurumsal piyasa yapıcılığı likiditeyi derinleştirdikçe Bitcoin\'in erken yıllarındaki (2011–2014) üç haneli seviyelerden yapısal düşüş sürmektedir.' },
    { question: 'Bitcoin hisselerden daha mı volatil?', answer: 'Bitcoin, S&P 500 endeksinden (yıllıklandırılmış ~%12–16) 3–4 kat daha volatildir. Ancak NVIDIA (~%50) ve Tesla (~%55) gibi bireysel teknoloji hisseleri Bitcoin\'in volatilitesini eşitleyebilir veya aşabilir.' },
    { question: 'Bitcoin ne zaman en volatildir?', answer: 'Bitcoin en volatil 08:00–10:00 UTC penceresinde (Londra/NY çakışması) işlem görür. Pazartesi ve Salı hafta sonlarından daha volatildir. Volatilite ayrıca halving olayları, FOMC kararları ve TÜFE açıklamaları çevresinde yükselir.' },
    { question: 'Düşük Bitcoin volatilitesi ne anlama gelir?', answer: 'Düşük volatilite (Bitcoin için yıllıklandırılmış %40\'ın altı) tarihsel olarak nadirdir ve genellikle iki yönden birine büyük bir hareket habercisidir. Trader\'lar uzun süreli düşük vol dönemlerini şiddetli bir patlamaya hazırlanan "sıkışmış yay" olarak yorumlar.' },
    { question: 'Bitcoin volatilitesini ticarette nasıl kullanırım?', answer: 'Trader\'lar volatiliteyi pozisyon boyutlandırma (vol yüksekken daha düşük lot), stop loss belirleme (yüksek vol ortamlarında daha geniş stoplar) ve rejim değişikliklerini tanımlamak için kullanır. BTC\'nin günlük %2–3\'lük ortalama hareketleri göz önüne alındığında %1 kuralı — bir işlemde hesabın %1\'inden fazlasını riske atmama — özellikle önemlidir.' },
  ],
  howToSteps: [
    { name: 'Volatilitenin ne ölçtüğünü anlayın', text: 'Volatilite, fiyat dalgalanma büyüklüğünü ölçer. Daha yüksek volatilite, yüzde olarak daha büyük günlük hareketler demektir.' },
    { name: 'Formülü öğrenin', text: 'Gerçekleşen vol = StdSapma(günlük log getiri) × √365. Log getiri = ln(bugünün fiyatı ÷ dünün fiyatı).' },
    { name: 'Zaman pencerenizi seçin', text: 'Yaygın pencereler 7 gün (kısa vadeli), 30 gün (standart), 60, 90 ve 1 yıldır. Kısa pencereler son hareketlere daha hızlı tepki verir.' },
    { name: 'Karşılaştırma kıstaslarına bakın', text: 'Bitcoin\'in vol\'ü genelde %40–80 aralığındadır. Bağlam için Altın (~%15), S&P 500 (~%14) ve bireysel hisselerle karşılaştırın.' },
    { name: 'Stratejinize uygulayın', text: 'Volatiliteyi pozisyon boyutlandırma, stop loss yerleşimi ve düşük-vol birikim bölgeleri vs yüksek-vol risk dönemlerini tanımlamak için kullanın.' },
  ],
  sections: [
    {
      id: 'bitcoin-volatilitesi-nedir',
      heading: 'Bitcoin Volatilitesi Nedir?',
      content: `Volatilite, bir varlığın fiyatının zaman içinde ne kadar değiştiğinin istatistiksel ölçüsüdür. Bitcoin için volatilite, günlük fiyat dalgalanmalarının büyüklüğünü — hem yukarı hem aşağı — yakalar.

Finansal analistler "Bitcoin\'in 30 günlük volatilitesi %55" dediğinde, son 30 günlük fiyat verisine göre BTC\'nin yıllıklandırılmış %55 oranında dalgalandığını kasteder. Pratikte bu **yaklaşık ±%2,9\'luk beklenen günlük hareket** anlamına gelir (%55 ÷ √365).

Bitcoin meşhur şekilde volatildir. Tek bir günde BTC %5–10 hareket edebilir — S&P 500\'ün haftalar veya aylar süreceği bir şey. Bu volatilite, Bitcoin\'i bir varlık sınıfı olarak tanımlayan hem risk hem fırsattır.

**Önemli ayrım:** Volatilite risk ile aynı şey değildir. Yükseliş trendindeki volatil bir varlık (tarihsel olarak Bitcoin gibi) hem yüksek volatil olabilir hem de olağanüstü uzun vadeli getiri sağlayabilir. Volatilite belirsizliği ölçer, yönü değil.`,
    },
    {
      id: 'volatilite-nasil-hesaplanir',
      heading: 'Volatilite Nasıl Hesaplanır — Formül',
      content: `Bitcoin\'in gerçekleşen volatilitesini hesaplamanın standart yöntemi:

**Adım 1:** Seçilen pencereniz için (örn. 30 gün) günlük kapanış fiyatlarını toplayın.

**Adım 2:** Her gün için günlük logaritmik getiriyi hesaplayın:
- Log getiri = ln(Fiyat_bugün ÷ Fiyat_dün)

**Adım 3:** Tüm log getirilerin standart sapmasını hesaplayın.

**Adım 4:** √365 ile çarparak yıllıklandırın.
- Bitcoin yılda 365 gün işlem görür (hisseler ~252 işlem günü için √252 kullanır)

**Formül:** σ = StdSapma(ln(Pₜ/Pₜ₋₁)) × √365

**Neden log getiri?** Logaritmik getiriler zaman dilimleri arasında toplanabilirdir ve simetriktir (+%10 ardından -%10 basit getirilerde sıfırlanmaz; log getiriler bunu doğru yönetir). Bu, [kurumsal analistlerin](https://en.wikipedia.org/wiki/Volatility_%28finance%29) ve dünya çapındaki risk yönetimi çerçevelerinin standardıdır.

**Örnek:** 30 günlük günlük log getirilerin standart sapması 0,029 (%2,9) ise yıllıklandırılmış vol = 0,029 × √365 = 0,029 × 19,1 ≈ **%55,4**.`,
      cta: { calculatorId: 'volatility', calculatorName: 'Bitcoin Volatilite Hesaplayıcı', text: 'Canlı Bitcoin volatilitesini şimdi hesaplayın', path: '/tr/hesaplayicilar/bitcoin-oynaklik' },
    },
    {
      id: 'gerceklesen-vs-zimni-volatilite',
      heading: 'Gerçekleşen vs Zımni Volatilite — Temel Fark',
      content: `Her Bitcoin trader\'ının anlaması gereken iki temelde farklı volatilite türü vardır:

**Gerçekleşen (Tarihsel) Volatilite** geriye dönüktür. *Gerçekten ne olduğunu* ölçer — belirli bir penceredeki geçmiş günlük getirilerin standart sapması. "Bitcoin\'in 30 günlük vol\'ü %52" dediğimizde bu gerçekleşen volatilitedir.

**Zımni Volatilite** ileriye dönüktür. Opsiyon piyasası fiyatlarından türetilir ve piyasanın gelecek 30 gün için *beklediği* volatiliteyi temsil eder. Opsiyon trader\'larından gelen bir uzlaşı tahmini olarak düşünün.

**Bu ayrım neden önemli:**
- Zımni vol > gerçekleşen vol → piyasa ilerideki *daha fazla* volatilite bekliyor (opsiyonlar "pahalı")
- Zımni vol < gerçekleşen vol → piyasa *daha sakin* koşullar bekliyor (opsiyonlar "ucuz")
- Bu farka **volatilite risk primi** denir ve opsiyon trader\'ları için temel bir sinyaldir

Bitcoin\'in zımni volatilitesi [Deribit DVOL endeksi](https://www.deribit.com/), [CME BVX endeksi](https://www.cmegroup.com/) ve [Volmex BVIV endeksi](https://volmex.finance/) tarafından izlenir. 2026 başı itibarıyla BTC\'nin zımni vol\'ü genelde %50–55 civarında gezinir.

**Gelecek Volatilite** — gerçekte ne olacağı — bilinemez. Ancak opsiyondan türetilen zımni vol, piyasanın en iyi toplu tahminidir.`,
    },
    {
      id: 'bitcoin-volatilite-tarihi',
      heading: 'Bitcoin Volatilite Tarihi — 2013\'ten 2026\'ya',
      content: `Bitcoin\'in volatilitesi erken yıllarından bu yana **yapısal düşüş** trendindedir:

| Dönem | Yıllıklandırılmış Vol | Önemli Olaylar |
|--------|---------------|----------------|
| 2011–2013 | %100–200+ | Erken benimseme, Mt. Gox dönemi, küçük piyasa |
| 2014–2015 | %70–100 | Mt. Gox çöküşü sonrası, ayı piyasası |
| 2017 | %80–120 | ICO patlaması, 20.000 $ ATH, sonraki çöküş |
| 2018–2019 | %50–80 | Kripto kışı, kademeli olgunlaşma |
| 2020 | %60–90 | COVID çöküşü (Mart), toparlanma rallisi |
| 2021 | %60–80 | Kurumsal benimseme, 69.000 $ ATH |
| 2022 | %55–75 | Luna/FTX çöküşleri, ayı piyasası |
| 2023–2024 | %40–60 | ETF onayı, halving, toparlanma |
| 2025–2026 | %35–55 | Olgun piyasa, kurumsal hâkimiyet |

Düşen trend şu etkenlerden kaynaklanır: **artan piyasa değeri** (1,5 trilyon $\'lık varlığı hareket ettirmek zor), **kurumsal saklama** (daha az panik satışı), **düzenlenmiş vadeli işlemler ve ETF\'ler** (daha fazla hedge aracı) ve küresel borsalarda **daha derin likidite**.

[BlackRock iShares araştırması](https://www.ishares.com/), Bitcoin\'in volatilitesinin artık bireysel mega-cap teknoloji hisseleriyle karşılaştırılabilir olduğunu belirtmiştir — "yatırım yapılamayacak kadar volatil"den "herhangi bir büyüme varlığı kadar volatil"e bir anlatı değişimi.`,
      cta: { calculatorId: 'drawdown', calculatorName: 'Bitcoin Düşüş Hesaplayıcı', text: 'Tarihsel Bitcoin çöküşlerini ve toparlanmalarını görün', path: '/tr/hesaplayicilar/bitcoin-dusus-analizi' },
    },
    {
      id: 'bitcoin-neden-volatil',
      heading: 'Bitcoin Neden Volatil (ve Neden Azalıyor)',
      content: `Bitcoin\'in volatilitesi birkaç yapısal etkenden kaynaklanır:

**1. Sabit Arz + Değişken Talep:** Bitcoin mükemmel şekilde esnek olmayan bir arza sahiptir (21 milyon tavan). Talep arttığında, arz cevap veremez — fiyat tüm baskıyı emmek zorundadır. Bu, her iki yöndeki hareketleri büyütür.

**2. 7/24 Küresel İşlem:** Hisselerden farklı olarak (devre kesicileri ve gece boşlukları vardır), Bitcoin her zaman diliminde sürekli işlem görür. Bu, volatilitenin duraksamadan birikebilmesi anlamına gelir.

**3. Kripto Piyasalarındaki Kaldıraç:** Kripto türev piyasaları 50–125× kaldıraç sunar. Büyük tasfiye kademeleri (kaldıraçlı pozisyonların zorla kapatılması) fiyat hareketlerini büyütür.

**4. Anlatı Odaklı Piyasa:** Bitcoin fiyatı düzenleyici haberlerden, ETF akışlarından, halving döngülerinden ve makroekonomik politikadan büyük ölçüde etkilenir. Her anlatı değişimi hızlı yeniden fiyatlamaya neden olabilir.

**5. Görece Küçük Piyasa:** 1,5 trilyon $ piyasa değerinde bile Bitcoin küresel tahvillere (130T $), hisselere (100T+ $) ve gayrimenkule (300T+ $) göre küçüktür. BTC fiyatını önemli ölçüde hareket ettirmek daha az sermaye gerektirir.

**Neden azalıyor:** Her halving döngüsü daha büyük kurumlar, daha derin likidite, daha fazla hedge aracı (vadeli, opsiyon, ETF) ve daha geniş mülkiyet dağıtımı getirir. Bu yapısal değişiklikler zaman içinde panik kaynaklı hareketlerin büyüklüğünü azaltır.`,
    },
    {
      id: 'btc-vs-diger-varliklar',
      heading: 'BTC Volatilitesi vs Altın, Hisseler ve Ethereum',
      content: `Bitcoin\'in volatilitesinin başlıca varlık sınıflarıyla karşılaştırması (yaklaşık 2025 Q1 değerleri):

| Varlık | 30 Günlük Vol | 1 Yıllık Vol | BTC\'ye göre |
|-------|-----------|-----------|-----------|
| **Bitcoin** | ~%52 | ~%50 | Temel |
| **Ethereum** | ~%65 | ~%63 | 1,3× daha volatil |
| **NVIDIA** | ~%50 | ~%49 | Benzer |
| **Tesla** | ~%55 | ~%54 | Benzer veya daha yüksek |
| **S&P 500** | ~%14 | ~%16 | 3,4× daha az volatil |
| **Altın** | ~%15 | ~%15,5 | 3,4× daha az volatil |

**Önemli içgörü:** Bitcoin, **S&P 500\'deki en popüler bireysel hisselerin bazılarından daha volatil değildir**. NVIDIA veya Tesla\'da yoğun pozisyon tutan yatırımcılar bir Bitcoin sahibine benzer volatilite riski alıyor.

Fark **korelasyondadır.** Bitcoin\'in geleneksel varlıklarla korelasyonu düşüktür (S&P 500\'e karşı genelde 0,1–0,3); küçük bir Bitcoin tahsisini çeşitlendirilmiş bir portföye eklemek — Bitcoin\'in kendisi volatil olsa da — çeşitlendirme yoluyla genel portföy riskini *azaltabilir*.`,
      cta: { calculatorId: 'correlation', calculatorName: 'Bitcoin Korelasyon Hesaplayıcı', text: 'BTC\'nin hisselere ve altına korelasyonunu kontrol edin', path: '/tr/hesaplayicilar/bitcoin-korelasyon' },
    },
    {
      id: 'bitcoin-icin-vix',
      heading: 'Bitcoin için VIX Var mı? DVOL ve BVX Açıklaması',
      content: `Evet — Bitcoin\'in borsa VIX\'ine benzer birden fazla volatilite endeksi vardır:

**DVOL (Deribit Volatilite Endeksi):** Kripto trader\'ları arasında en yaygın kullanılan. Opsiyon hacmine göre en büyük kripto türev borsası [Deribit](https://www.deribit.com/) üzerindeki Bitcoin opsiyonlarından 30 günlük ileriye dönük zımni volatiliteyi ölçer. "Bitcoin için VIX" olarak düşünün.

**BVX (CME CF Bitcoin Volatilite Endeksi):** **9 Nisan 2024\'te** başlatılan, ilk resmi olarak düzenlenmiş Bitcoin volatilite kıyaslamasıdır. [CME Group](https://www.cmegroup.com/) tarafından CME Bitcoin opsiyon verileri kullanılarak inşa edilmiştir; orijinal VIX\'i model alan kurumsal düzey metodoloji izler.

**BVIV (Volmex Bitcoin Zımni Volatilite):** [Volmex Finance](https://volmex.finance/) tarafından sunulan 30 günlük sabit vade zımni volatilite endeksi; hem gerçek zamanlı hem tarihsel formatlarda mevcuttur.

**Borsa VIX\'inden temel fark:** Geleneksel VIX, hisse volatilitesinin genelde çöküşlerde yükselmesi nedeniyle "korku göstergesi" olarak adlandırılır. Bitcoin\'in volatilite endeksi daha çok bir **"aksiyon göstergesi"** olarak tanımlanır — büyük BTC hareketleri patlayıcı ralliler kadar çöküşler de olabilir. Yüksek DVOL mutlaka düşüş anlamına gelmez.

**Hızlı dönüşüm:** Beklenen günlük hareket ≈ DVOL ÷ 20. DVOL = %60 ise yaklaşık ±%3 günlük hareketler bekleyin.`,
    },
    {
      id: 'volatilite-nasil-kullanilir',
      heading: 'Trader veya Yatırımcı Olarak Volatiliteyi Nasıl Kullanırsınız',
      content: `**Trader\'lar için:**

1. **Pozisyon boyutlandırma:** Yüksek-vol ortamlarında (>%65) lot büyüklüğünüzü azaltın. [Bitcoin Lot Büyüklüğü Hesaplayıcısı](/tr/hesaplayicilar/bitcoin-lot-buyuklugu) hesap bakiyesi ve stop loss mesafesine göre pozisyon boyutlandırmaya yardımcı olur.

2. **Stop loss yerleşimi:** Yüksek-vol dönemlerinde daha geniş stoplar, düşük-vol\'de daha sıkı. Mevcut volatiliteye ölçeklenmiş ATR (Average True Range) göstergesini kullanın.

3. **Rejim tespiti:** Düşük-vol rejimleri (<%40) genelde kırılmalardan önce gelir. Birçok trader düşük-vol dönemlerinde pozisyon boyutunu azaltır ama giriş sayısını artırır, genişlemeyi bekler.

4. **Volatilite ortalamaya dönüş:** Aşırı volatilite (>%90) ortalamaya dönme eğilimindedir. Bu, opsiyon piyasalarında fırsat yaratır (vol yükselişlerinde aşırı fiyatlı opsiyonların satılması).

**Uzun Vadeli Yatırımcılar için:**

1. **Düşük-vol dönemlerde DCA:** Tarihsel olarak düşük volatilite rejimlerinde birikim, ortalamanın üstünde getiri sağlamıştır çünkü bu dönemler büyük yukarı yönlü hareketlerden önce gelir.

2. **Yeniden dengeleme tetikleyicileri:** Volatilite seviyelerini portföy yeniden dengeleme sinyali olarak kullanın. BTC\'nin vol\'ü %30\'un altına düşerse portföyünüzde az tahsisli olabilir.

3. **Risk bütçeleme:** Hedef portföy volatiliteniz %15 ve Bitcoin\'in vol\'ü %50 ise, BTC maksimum tahsisiniz yaklaşık %30\'dur (%15 ÷ %50).`,
      cta: { calculatorId: 'bitcoin-lot-size', calculatorName: 'Bitcoin Lot Büyüklüğü Hesaplayıcı', text: 'Volatiliteye göre Bitcoin pozisyonunuzu boyutlandırın', path: '/tr/hesaplayicilar/bitcoin-lot-buyuklugu' },
    },
    {
      id: 'yuzde-bir-kurali',
      heading: '%1 Kuralı ve Yüksek Volatilitede Pozisyon Boyutlandırma',
      content: `**%1 kuralı** Bitcoin trader\'ları için en önemli risk yönetim ilkesidir: tek bir işlemde toplam hesabınızın %1\'inden fazlasını asla riske atmayın.

**Neden %1?** Bitcoin\'in günlük %2–3\'lük ortalama volatilitesiyle hesabınızın %5\'ini riske atan bir pozisyon normal bir günlük hareketle silinebilir. %1 kuralı, kayıp serisinden felaket düşüş olmadan kurtulmanızı sağlar.

**Nasıl uygulanır:**

1. Hesap bakiyenizi belirleyin (örn. $10.000)
2. Maksimum işlem başına riskinizi hesaplayın: $10.000 × %1 = **$100**
3. Stop loss mesafenizi belirleyin (örn. giriş altı $2.000)
4. Pozisyon boyutunu hesaplayın: $100 ÷ $2.000 = **0,05 BTC**

Bu, lot boyutunuzun (1 lot = 1 BTC standart broker\'da) 0,05 lot olması gerektiği anlamına gelir. Otomatikleştirmek için [Lot Büyüklüğü Hesaplayıcısı](/tr/hesaplayicilar/bitcoin-lot-buyuklugu) kullanın.

**Yıkım matematiği:** İşlem başına %1 riskle hesabınızı kaybetmek için 100 ardışık kayıp gerekir — neredeyse imkansız. İşlem başına %5 riskle yalnızca 20 ardışık kayıp yeterlidir — volatil bir dönemde çok daha olası.

Kaldıraçlı trader\'lar için %1 kuralı daha da kritik hale gelir. Volatilitenin kaldıraçlı pozisyonlarla nasıl etkileştiğini anlamak için [Kaldıraç Tasfiye Hesaplayıcısına](/tr/hesaplayicilar/bitcoin-tasfiye) bakın.`,
    },
  ],
  expertQuote: {
    quote: 'Bitcoin\'in gerçekleşen volatilitesi varlık olgunlaştıkça düşüş eğilimine girmiştir, ancak başlıca hisse endekslerinin yaklaşık dört katı olmaya devam etmektedir.',
    author: 'Fidelity Digital Assets',
    role: 'Kurumsal araştırma',
    source: 'https://www.fidelitydigitalassets.com/research-and-insights',
    sourceLabel: 'fidelitydigitalassets.com',
  },
};

export default article;
