import { Article } from '../articles';

/** TR counterpart of `bitcoin-on-chain-metrics-guide` → `/tr/ogrenin/bitcoin-zincir-uzeri-metrikler-rehberi`. */
const article: Article = {
  slug: 'bitcoin-zincir-uzeri-metrikler-rehberi',
  title: 'Bitcoin Zincir Üzeri Metrikler Rehberi: MVRV, SOPR ve NVT (2026)',
  metaDescription: 'MVRV 3,7\'nin üzerinde = aşırı değerli. 1\'in altında = tarihsel olarak güçlü alım bölgesi. Piyasa döngüsü zirvelerini ve diplerini okumak için MVRV, SOPR, NVT ve hash oranını öğrenin.',
  category: 'Market Analysis',
  publishedDate: '2026-02-20',
  updatedDate: '2026-05-18',
  readingTime: 10,
  keywords: ['bitcoin zincir üzeri metrikler', 'bitcoin MVRV oranı', 'bitcoin stok akış', 'bitcoin hash oranı', 'bitcoin aktif adresler', 'bitcoin döngü göstergesi 2026'],
  relatedCalculators: ['on-chain', 'fear-greed-index', 'rainbow-chart', 'power-law'],
  relatedArticles: ['bitcoin-guc-yasasi-aciklamasi', 'korku-acgozluluk-endeksi-nedir', 'bitcoin-hodl-stratejisi-aciklamasi', 'bitcoin-stok-akis-modeli', 'bitcoin-servet-dagilimi', 'bitcoin-dominansi-aciklamasi'],
  faqs: [
    { question: 'Bitcoin\'de MVRV oranı nedir?', answer: 'MVRV (Piyasa Değeri / Gerçekleşen Değer) Bitcoin\'in toplam piyasa değerini "gerçekleşen piyasa değeri" ile karşılaştırır — tüm BTC\'lerin son zincir üzeri hareket fiyatlarındaki toplamı. 1,0\'ın altında MVRV tarihsel olarak döngü diplerini, 3,5\'in üzerinde MVRV ise döngü zirvelerini işaret etmiştir.' },
    { question: 'Bitcoin için Stok-Akış modeli nedir?', answer: 'Stok-Akış (S2F) Bitcoin\'in kıtlığını toplam dolaşımdaki arzı ("stok") yıllık yeni ihraç ("akış") ile bölerek ölçer. Nisan 2024\'teki 4. yarılanmadan sonra Bitcoin\'in yıllık akışı yaklaşık 164.250 BTC/yıla düştü ve S2F oranı 120\'nin üzerine çıktı.' },
    { question: 'Hash oranı bize Bitcoin hakkında ne anlatır?', answer: 'Hash oranı, madencilerin Bitcoin ağını güvence altına almaya adadıkları toplam hesaplama gücünü ölçer. Yükselen hash oranı, madencilerin Bitcoin\'in gelecekteki kârlılığına güvendiklerini gösterir. 2026 itibarıyla Bitcoin\'in hash oranı 800 EH/s\'yi aşıyor.' },
    { question: 'Bitcoin aktif adresleri nedir?', answer: 'Aktif adresler belirli bir günde BTC gönderen veya alan benzersiz Bitcoin cüzdan adreslerini sayar. Bitcoin ağındaki gerçek ekonomik aktivite için en güvenilir göstergelerden biridir.' },
    { question: 'Zincir üzeri metrikler Bitcoin döngülerini tahmin etmede ne kadar doğrudur?', answer: 'Zincir üzeri metrikler tarihsel desen araçlarıdır, kristal küre değildir. MVRV 2011\'den beri çoğu büyük döngü zirvesini ve dibini doğru tanımlamıştır. Birlikte kullanıldığında bu metrikler kesinlik değil olasılıklı bir çerçeve sağlar.' }
  ],
  sections: [
    {
      id: 'zincir-uzeri-nedir',
      heading: 'Bitcoin Zincir Üzeri Metrikleri Nedir?',
      content: 'Bitcoin\'in blockchain\'i tamamen halka açık bir defterdir. Her işlem, cüzdan bakiyesi ve coin hareketi kaydedilir ve dünyadaki herkes tarafından doğrulanabilir. **Zincir üzeri metrikler**, bu blockchain verisinden doğrudan türetilen analitiklerdir.\n\n[Glassnode](https://glassnode.com), [IntoTheBlock](https://www.intotheblock.com) ve [CoinMetrics](https://coinmetrics.io) gibi platformlar profesyonel düzeyde zincir üzeri analitik sağlar. Verilerin çoğunun tescilli veya gecikmeli olduğu hisse senedi piyasalarının aksine, Bitcoin\'in zincir üzeri verileri ücretsiz, gerçek zamanlı ve sahte yapılamaz.\n\nEn yaygın takip edilen dört zincir üzeri metrik:\n\n1. **MVRV Oranı** — Bitcoin sahiplerin ödediği fiyata göre aşırı mı yoksa düşük mü değerli?\n2. **Stok-Akış (S2F)** — Bitcoin ne kadar kıt ve fiyat kıtlık modelini takip ediyor mu?\n3. **Hash Oranı** — Ağ ne kadar güvenli ve madenciler ne kadar güvenli?\n4. **Aktif Adresler** — Zincir üzerinde ne kadar gerçek ekonomik aktivite gerçekleşiyor?\n\nHer metrik hikâyenin farklı bir parçasını anlatır. Birleştiğinde, Bitcoin\'in piyasa döngüsünde nerede olduğunu değerlendirmek için güçlü bir çerçeve oluştururlar.',
      cta: { calculatorId: 'on-chain', calculatorName: 'Bitcoin Zincir Üzeri Metrik Paneli', text: 'Tek bir panelde dört canlı zincir üzeri metriği görüntüleyin', path: '/tr/hesaplayicilar/bitcoin-stok-akis' }
    },
    {
      id: 'mvrv-orani',
      heading: 'MVRV Oranı: Bitcoin\'in En İyi Döngü Göstergesi',
      content: '**Piyasa Değeri / Gerçekleşen Değer (MVRV) oranı**, var olan en güçlü Bitcoin döngü göstergesidir. Murad Mahmudov ve David Puell tarafından geliştirildi:\n\n**Piyasa Değeri** — mevcut fiyat × dolaşımdaki arz. Piyasanın *şu anda* tüm Bitcoin için ödemeye razı olduğu şeyi temsil eder.\n\n**Gerçekleşen Değer** — her coin\'in son zincir üzeri hareket fiyatındaki değeri. Tüm Bitcoin sahiplerinin toplam maliyet temelini — esasen toplu olarak ne ödediklerini — temsil eder.\n\nPiyasa Değeri ÷ Gerçekleşen Değer oranı MVRV\'yi verir:\n\n- **MVRV < 1,0:** Piyasa değeri gerçekleşen değerin altında — yani ortalama olarak tüm Bitcoin sahipleri zararda. Tarihsel olarak bu bölge en derin ayı piyasası diplerini (2015, 2019, 2022) işaretledi.\n- **MVRV 1,0-2,0:** Nötr bölge. Bitcoin maliyet temeline göre adil değerlidir.\n- **MVRV 2,0-3,5:** Yükselmiş. Ortalama sahipler kârlıdır ancak piyasa tarihi öforiye ulaşmadı.\n- **MVRV > 3,5:** Tehlike bölgesi. Ortalama sahipler 3,5x kazançta oturuyor, yoğun kâr alma baskısı yaratıyor. Tüm büyük Bitcoin döngü zirveleri (2013, 2017, 2021) 3,5\'in üzerinde MVRV ile oluştu.',
      cta: { calculatorId: 'on-chain', calculatorName: 'Canlı MVRV Göstergesi', text: 'Bugünkü MVRV oranını ve Bitcoin\'in hangi bölgede olduğunu kontrol edin', path: '/tr/hesaplayicilar/bitcoin-stok-akis' }
    },
    {
      id: 'stok-akis',
      heading: 'Stok-Akış: Bitcoin\'in Kıtlık Modeli',
      content: '**Stok-Akış (S2F) modeli**, PlanB tarafından popülerleştirildi ve Bitcoin\'in kıtlığını mevcut üretim hızında mevcut arzı üretmek için kaç yıl gerektireceğini ölçerek niceliklendirir:\n\n**S2F Oranı = Dolaşımdaki Arz ÷ Yıllık Yeni İhraç**\n\nNisan 2024\'teki Bitcoin\'in 4. yarılanmasından sonra blok ödülü 3,125 BTC\'ye düştü. ~144 günlük blokla, yıllık yeni ihraç yaklaşık **164.250 BTC/yıla** düştü. Dolaşımdaki ~19,85M BTC ile Bitcoin\'in S2F oranı artık **120\'yi** aşıyor — altından (yaklaşık 60) yüksek.\n\nPlanB\'nin güç yasası formülü bu orandan bir model fiyat öngörür: ne kadar yüksek S2F, o kadar yüksek ima edilen model fiyat. 4. yarılanmadan sonra S2F model fiyatı, kullanılan tam formüle bağlı olarak **150.000-600.000 $** aralığındadır.\n\n**S2F Sapması** temel eylem sinyalidir:\n- **Model fiyatın önemli ölçüde altında:** Bitcoin kıtlık modeline göre indirimde işlem görüyor — tarihsel olarak olumlu birikim sinyali.\n- **Model fiyatına yakın:** S2F çerçevesine göre adil değerli.\n- **Model fiyatın önemli ölçüde üzerinde:** Bitcoin kıtlık modeline göre primli işlem görüyor — tarihsel olarak döngü zirvelerine yakın uyarı sinyali.\n\n**Önemli uyarı:** Bitcoin 2021 S2F fiyat hedefi olan 288.000 $\'a ulaşamadığı için S2F modeli önemli eleştiri aldı.'
    },
    {
      id: 'hash-orani',
      heading: 'Hash Oranı: Ağ Sağlığı Göstergesi',
      content: 'Bitcoin\'in **hash oranı**, dünyadaki madencilerin Bitcoin\'in iş kanıtı bulmacasını çözmek için uyguladığı toplam hesaplama gücünü (saniyede exahash, EH/s cinsinden) ölçer. 2026 itibarıyla Bitcoin\'in hash oranı **820 EH/s\'yi** aşıyor.\n\n**Hash oranı yatırımcılar için neden önemli:**\n\n**1. Madenci güven göstergesi.** Madenciler donanım ve elektrikte milyonlar yatıran ekonomik aktörlerdir. Yalnızca Bitcoin\'in gelecekteki fiyatının maliyeti haklı çıkardığına inanırlarsa zararına madencilik yaparlar. Sürdürülen veya yükselen hash oranı madencilerin Bitcoin\'in düşük değerli olduğuna inandıklarını gösterir.\n\n**2. Ağ güvenliği.** Daha yüksek bir hash oranı Bitcoin ağına %51 saldırıyı üstel olarak daha pahalı ve pratikte imkânsız hale getirir.\n\n**3. Hash oranı vs fiyat ayrışması.** Hash oranı fiyattan önemli ölçüde daha hızlı yükselirse, madencilerin biriktirdiğini ve güvende olduğunu gösterebilir. **Hash ribbons** — 30 günlük ve 60 günlük hash oranı hareketli ortalamaları karşılaştıran teknik gösterge — tarihsel olarak madenci kapitülasyonundan sonra hash oranı toparlandığında güvenilir alım sinyalleri üretti.',
      cta: { calculatorId: 'on-chain', calculatorName: 'Zincir Üzeri Metrik Paneli', text: 'Panelde canlı hash oranını ve 30 günlük trendi takip edin', path: '/tr/hesaplayicilar/bitcoin-stok-akis' }
    },
    {
      id: 'aktif-adresler',
      heading: 'Aktif Adresler: Gerçek Benimsemenin Ölçümü',
      content: '**Aktif adresler** metriği, belirli bir günde en az bir zincir üzeri işleme katılan benzersiz Bitcoin cüzdan adreslerinin sayısını sayar. Bitcoin ağındaki gerçek ekonomik aktivite için en güvenilir göstergelerden biri olarak hizmet eder.\n\n2026 itibarıyla yaklaşık **900.000-950.000 benzersiz adres** günlük aktif, Bitcoin\'in küresel benimseme ölçeğini yansıtıyor.\n\n**Aktif adresleri nasıl yorumlanır:**\n\n**Ayrışma sinyalleri:** Bitcoin\'in fiyatı keskin şekilde yükseldiğinde ancak aktif adresler düz kalır veya düşerse, hareketin zincir üzeri aktivite yerine borsalardaki spekülasyondan kaynaklandığını gösterir — potansiyel bir uyarı işareti.\n\n**Ağ Metcalfe Yasası:** Bazı analistler Bitcoin aktif adreslerine Metcalfe Yasası\'nı (ağ değeri ∝ n²) uygular. Piyasa değeri n²\'den daha hızlı büyüdüğünde, ağ gerçek kullanımına göre aşırı değerli olabilir.\n\n**Uzun vadeli trend:** Kısa vadeli oynaklığa rağmen, Bitcoin\'in aktif adres sayısı 2009\'dan bu yana her çok yıllık dönemde yukarı doğru trend göstermiştir.'
    },
    {
      id: 'birlestirme',
      heading: 'Zincir Üzeri Sinyalleri Nasıl Birleştirilir',
      content: 'Hiçbir tek zincir üzeri metrik tüm hikâyeyi anlatmaz. En etkili yaklaşım, döngü konumunun daha yüksek güvenli bir görünümü için birden fazla sinyali birleştirir:\n\n**Yükseliş yakınsaması (birden fazla sinyalin hizalanması):**\n- MVRV < 1,5 (gerçekleşen değere göre düşük değerli)\n- Fiyat S2F model fiyatının önemli ölçüde altında\n- Hash oranı tüm zamanların en yüksek seviyelerinde veya yakınında (madenci güveni)\n- Aktif adresler yükseliyor (organik talep)\n\n**Düşüş yakınsaması:**\n- MVRV > 3,5 (aşırı kâr bölgesi)\n- Fiyat S2F model fiyatının önemli ölçüde üzerinde\n- Yüksek fiyatlara rağmen hash oranı duruyor (madenciler dağıtıyor)\n- Aktif adresler fiyat büyümesine ayak uyduramıyor\n\n**Duyarlılık ve döngü araçlarıyla tamamlayın:**\n\nMVRV yükseldiğinde (3,0+) VE [Korku & Açgözlülük Endeksi](/tr/hesaplayicilar/bitcoin-korku-acgozluluk) aşırı açgözlülük gösteriyor VE [Gökkuşağı Grafiği](/tr/hesaplayicilar/bitcoin-gokkusagi-grafigi) Bitcoin\'i "Maksimum Balon" veya "Sat" bölgelerinde gösteriyor — bu çoklu metrik hizalaması tarihsel olarak büyük döngü zirvelerini işaretledi.\n\nBenzer şekilde, aşırı korku (Korku & Açgözlülük < 20) ve Bitcoin\'in Gökkuşağı Grafiği\'nin mavi/yeşil bölgelerinde olduğu MVRV 1,5\'in altında tarihsel olarak en iyi uzun vadeli giriş pencerelerinden biri olmuştur.',
      cta: { calculatorId: 'on-chain', calculatorName: 'Bitcoin Zincir Üzeri Metrik Paneli', text: 'Tüm canlı zincir üzeri sinyalleri ve döngü göstergelerini tek yerde görüntüleyin', path: '/tr/hesaplayicilar/bitcoin-stok-akis' }
    },
    {
      id: 'sinirlamalar',
      heading: 'Zincir Üzeri Analiz Sınırlamaları',
      content: 'Zincir üzeri metrikler güçlü ancak kusursuz değildir:\n\n**1. Borsa saklaması veriyi bozar.** Milyonlarca kullanıcı Coinbase veya Binance\'de Bitcoin tuttuğunda, tüm bu coinler milyonlarca bireysel adres değil az sayıda borsa cüzdan adresi olarak zincirde görünür.\n\n**2. Modeller yeni koşullarda bozulabilir.** S2F modelinin 2021 başarısızlığı, iyi doğrulanmış modellerin bile piyasa yapısı değiştiğinde başarısız olabileceğini gösterdi.\n\n**3. Gerçekleşen değer yaklaşımı.** Gerçek gerçekleşen değer her UTXO\'nun tam fiyatını bilmeyi gerektirir — hesaplama açısından yoğun.\n\n**4. Geciken sinyaller.** Zincir üzeri verileri, davranışın geç bir göstergesidir. MVRV uç seviyelere ulaştığında piyasa zaten önemli ölçüde hareket etmiştir.\n\n**5. Araştırma yerine geçmez.** Zincir üzeri metrikler birçok girdiden biridir. Makro koşullar, düzenleyici ortam, teknolojik değişiklikler ve Bitcoin\'e özgü gelişmeler (ETF girişleri, kurumsal benimseme) önemlidir ve zincir üzeri verilerinde yakalanmaz.'
    },
    {
      id: 'cikarimlar',
      heading: 'Temel Çıkarımlar',
      content: '1. **MVRV < 1,0 = tarihsel olarak düşük değerli.** Her zaman Bitcoin\'in MVRV\'si 1,0\'ın altına düştüğünde, nesilden nesile aktarılan bir alım fırsatı olduğunu kanıtladı. 3,5\'in üzerinde = tarihsel olarak aşırı risk.\n\n2. **S2F sapması kıtlık modeline karşı değerleme sinyali verir.** Model fiyatın önemli ölçüde altında = birikim bölgesi. Önemli ölçüde üzerinde = dikkat. Ancak S2F\'yi tek bir sinyal olarak değerlendirin.\n\n3. **Yükselen hash oranı = madenci güveni.** Madenciler uzun vadeli Bitcoin inançlarına göre donanıma yatırım yapar.\n\n4. **Aktif adresler organik benimsemeyi onaylar.** Yükselen fiyat ile birlikte yükselen aktif adresler = sağlıklı boğa piyasası.\n\n5. **Duyarlılık araçlarıyla birleştirin.** Bitcoin\'in piyasa döngüsü konumunun çok boyutlu görünümü için zincir üzeri metrikleri [Korku & Açgözlülük Endeksi](/tr/hesaplayicilar/bitcoin-korku-acgozluluk) ve [Gökkuşağı Grafiği](/tr/hesaplayicilar/bitcoin-gokkusagi-grafigi) yanında kullanın.'
    }
  ],
  howToSteps: [
    { name: 'Zincir Üzeri Paneli açın', text: 'Canlı verileri yüklemek için Bitcoin Zincir Üzeri Metrik Paneline gidin' },
    { name: 'MVRV Göstergesini kontrol edin', text: 'Mevcut MVRV bölgesini okuyun — 1,5\'in altı tarihsel olarak olumlu, 3,5\'in üzeri tarihsel olarak risklidir' },
    { name: 'S2F Sapmasını gözden geçirin', text: 'Mevcut fiyatın PlanB S2F model fiyatından ne kadar uzakta olduğunu görün' },
    { name: 'Hash Oranı Trendini kontrol edin', text: 'Hash oranının yükseldiğini (madenci güveni) veya düştüğünü (madenci kapitülasyonu) onaylayın' },
    { name: 'Sinyalleri birleştirin', text: 'Çok göstergeli döngü analizi için zincir üzeri verileri Korku & Açgözlülük ve Gökkuşağı Grafiği yanında kullanın' }
  ],
  expertQuote: {
    quote: 'Zincir üzeri veriler yatırımcılara geleneksel varlık sınıfları için var olmayan şeffaf, gerçek zamanlı bir ağ aktivitesi görünümü sağlar.',
    author: 'Glassnode',
    role: 'Zincir üzeri piyasa istihbaratı',
    source: 'https://insights.glassnode.com/',
    sourceLabel: 'Glassnode Insights',
  },
};

export default article;
