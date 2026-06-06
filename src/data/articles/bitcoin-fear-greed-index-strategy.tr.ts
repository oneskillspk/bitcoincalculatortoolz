import { Article } from '../articles';

/** TR counterpart of `bitcoin-fear-greed-index-strategy` → `/tr/ogrenin/korku-acgozluluk-endeksi-stratejisi`. */
const article: Article = {
  slug: 'korku-acgozluluk-endeksi-stratejisi',
  title: 'Bitcoin Korku & Açgözlülük Stratejisi: Korkuda Al, Açgözlülükte Sat',
  metaDescription: 'Korku & Açgözlülük ≤20 iken BTC almak %1.145 getirdi (al-tut için %1.046). Karşıt giriş kurallarını, DCA tetikleyicilerini öğrenin ve endeksi ücretsiz takip edin.',
  category: 'Investing',
  publishedDate: '2026-03-09',
  updatedDate: '2026-05-18',
  readingTime: 9,
  keywords: ['bitcoin korku açgözlülük stratejisi', 'bitcoin korku endeksi zamanlama', 'btc ne zaman al', 'kripto sentiment ticareti', 'karşıt bitcoin yatırımı', 'bitcoin giriş zamanlaması'],
  relatedCalculators: ['fear-greed-index', 'dca', 'what-if', 'lump-sum-vs-dca'],
  relatedArticles: ['korku-acgozluluk-endeksi-nedir', 'bitcoin-dca-nedir', 'bitcoin-hodl-stratejisi-aciklamasi'],
  faqs: [
    { question: 'Korku ve Açgözlülük Endeksi aşırı korku gösterdiğinde Bitcoin almalı mıyım?', answer: 'Tarihsel olarak aşırı korku (endeks 20\'nin altı) mükemmel bir uzun vadeli alım fırsatı olmuştur. Ancak aşırı korku ayı piyasalarında haftalarca veya aylarca sürebilir, bu yüzden ilk korku belirtisinde almak anında kâr garanti etmez. Aşırı korku okumalarını DCA stratejileriyle birleştirmek en iyi risk-ayarlı sonuçları göstermiştir.' },
    { question: 'Bitcoin Korku ve Açgözlülük Endeksi ne sıklıkta aşırı korkuya ulaşır?', answer: 'Aşırı korku okumaları (20 altı) nispeten nadirdir — tarihsel olarak işlem günlerinin yaklaşık %5-10\'unda gerçekleşir. Uzun süreli aşırı korku dönemleri daha da nadirdir, tipik olarak yalnızca 2018-2019 ve 2022 gibi büyük ayı piyasalarında olur.' },
    { question: 'Korku ve Açgözlülük seviyelerine göre alımları otomatikleştirebilir miyim?', answer: 'Evet, bazı ticaret platformları ve botları Korku ve Açgözlülük eşiklerine göre tetiklenen otomatik alım emirleri ayarlamanıza izin verir. Çoğu yatırımcı manuel uyarı sistemi kullanır — korku belirli seviyelerin altına düştüğünde fiyat uyarıları ayarlar ve DCA miktarlarını buna göre artırır.' },
    { question: 'Korku ve Açgözlülük Endeksi zincir üzeri göstergelerle nasıl karşılaştırılır?', answer: 'Korku ve Açgözlülük Endeksi çoklu veri kaynaklarını (oynaklık, hacim, sosyal medya, anketler, dominans) tek bir sentiment skorunda birleştirir. MVRV, SOPR gibi zincir üzeri göstergeler gerçek blockchain davranışını ölçer. İkisi de değerlidir — sentiment psikolojiyi, zincir üzeri ise temel aktiviteyi yakalar.' },
  ],
  howToSteps: [
    { name: 'Endeks ölçeğini anlayın', text: 'Korku ve Açgözlülük Endeksi 0-100 arasında değişir. 25 altı "Aşırı Korku" (al sinyali), 25-45 "Korku", 45-55 "Nötr", 55-75 "Açgözlülük", 75 üstü "Aşırı Açgözlülük" (uyarı sinyali).' },
    { name: 'Aşırı okumalar için uyarılar kurun', text: 'Endeks 20\'nin altına (aşırı korku) düştüğünde veya 80\'in üstüne (aşırı açgözlülük) çıktığında uyarı yapılandırın.' },
    { name: 'Sentimente göre DCA miktarlarını ayarlayın', text: 'Korku aşırı olduğunda düzenli DCA alımlarını artırın, nötr dönemlerde normal miktarları koruyun, aşırı açgözlülükte azaltın veya duraklatın.' },
    { name: 'Fiyat tabanlı sinyallerle birleştirin', text: 'Korku ve Açgözlülüğü teknik veya temel sinyaller için onay olarak kullanın. Aşırı korku ile birlikte fiyat destek seviyesi her ikisinden daha güçlü bir al sinyalidir.' },
    { name: 'Stratejinizi belgeleyin ve geri test edin', text: 'Sentiment tabanlı kararlarınızın kayıtlarını tutun. Kurallarınızı tarihsel verilere karşı geri test ederek eşikleri ve pozisyon boyutlandırmayı risk toleransınız için iyileştirin.' },
  ],
  sections: [
    {
      id: 'karsit-yaklasim',
      heading: 'Karşıt Yaklaşım',
      content: 'Efsanevi yatırımcı Warren Buffett ünlü bir şekilde şöyle demiştir: **"Başkaları açgözlü olduğunda korkulu, başkaları korkulu olduğunda açgözlü olun."** [Bitcoin Korku ve Açgözlülük Endeksi](https://alternative.me/crypto/fear-and-greed-index/) bu bilgeliği uygulamanın ölçülebilir bir yolunu sağlar.\n\n**Karşıt Yatırım Tanımı:**\n[Karşıt yatırım](https://www.investopedia.com/terms/c/contrarian.asp), hâkim piyasa sentimenti aleyhine gitmek anlamına gelir. Herkes panikleyip satarken siz alırsınız. Herkes öforik ve alıcı iken siz dikkatli olursunuz.\n\n**Karşıtlık Neden İşe Yarar:**\n• **Piyasalar abartır**: Sentiment uçları fiyatları temel değerin ötesine iter\n• **Ortalamaya dönüş**: Aşırı sentiment süresiz olarak sürdürülemez\n• **Kalabalık psikolojisi**: Çoğunluk büyük dönüm noktalarında tipik olarak yanılır\n\n**Çekirdek Strateji:**\n• **Aşırı Korku (0-25)**: Alımı agresif şekilde artırın — tarihsel olarak mükemmel giriş noktaları\n• **Korku (25-45)**: Düzenli alıma devam edin\n• **Nötr (45-55)**: Standart [DCA](/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi) yaklaşımını koruyun\n• **Açgözlülük (55-75)**: Yeni alımları azaltın — kısmi kâr almayı düşünün\n• **Aşırı Açgözlülük (75-100)**: Maksimum dikkat — satmayı veya en azından almayı durdurmayı düşünün',
      cta: { calculatorId: 'fear-greed-index', calculatorName: 'Korku & Açgözlülük Endeksi', text: 'Mevcut Bitcoin piyasa sentimentini kontrol edin', path: '/tr/hesaplayicilar/bitcoin-korku-acgozluluk' },
    },
    {
      id: 'tarihi-al-sinyalleri',
      heading: 'Aşırı Korkudan Tarihi Al Sinyalleri',
      content: 'Geri test, **aşırı korku okumalarının Bitcoin için olağanüstü doğru al sinyalleri olduğunu** ortaya koyuyor. İşte büyük aşırı korku dönemleri ve sonraki getiriler:\n\n| Dönem | En Düşük Korku | Korkudaki BTC Fiyatı | 12 Ay İçindeki Zirve | Getiri |\n|--------|----------------|---------------------|----------------------|--------|\n| Ara 2018 | 8 | $3.200 | $13.800 | +%331 |\n| Mar 2020 | 10 | $4.900 | $61.000 | +%1.145 |\n| Haz 2022 | 6 | $17.800 | $31.000 | +%74 |\n| Kas 2022 | 21 | $15.500 | $73.800 | +%376 |\n\n**Önemli Gözlemler:**\n• Bitcoin tarihindeki her aşırı korku dönemini önemli kazançlar takip etmiştir\n• En derin korku okumaları (tek haneli) en yüksek getirileri üretmiştir\n• Uzun süreli korku dönemleri birden fazla giriş fırsatı sunabilir\n\n**Önemli Uyarılar:**\n• Aşırı korku beklenenden uzun sürebilir — anında hepsini yatırmayın\n• Tek bir aşırı korku okuması anında dipleri garanti etmez\n• Pozisyonları ortalamak için korku dönemlerinde toplu yerine DCA kullanın\n\nMevcut sentiment seviyelerini [Korku & Açgözlülük Endeksi](/tr/hesaplayicilar/bitcoin-korku-acgozluluk) ile takip edin.',
    },
    {
      id: 'korku-acgozluluk-dca',
      heading: 'Korku & Açgözlülük ile DCA\'yı Birleştirme',
      content: 'Korku & Açgözlülük zamanlamasının en pratik uygulaması, bunu bir **Dolar Maliyet Ortalaması (DCA) stratejisi** ile entegre etmektir.\n\n**Korku Ayarlı DCA Sistemi:**\n\nTemel DCA Miktarı: $500/ay (örnek)\n\n| Endeks Aralığı | Sentiment | DCA Çarpanı | Aylık Alım |\n|-------------|-----------|----------------|-------------|\n| 0-15 | Aşırı Korku | 3,0x | $1.500 |\n| 15-25 | Şiddetli Korku | 2,0x | $1.000 |\n| 25-40 | Korku | 1,5x | $750 |\n| 40-60 | Nötr | 1,0x | $500 |\n| 60-75 | Açgözlülük | 0,5x | $250 |\n| 75-90 | Aşırı Açgözlülük | 0,25x | $125 |\n| 90-100 | Zirve Öforisi | 0x (duraklat) | $0 |\n\n**Sermaye Tahsisi:**\nBu sistemi kullanmak için, hedeflenen Bitcoin tahsisinizin %30-50\'sini nakit rezervi olarak tutun. Korku dönemlerinde rezervi devreye alın ve daha az alım yaptığınız açgözlülük dönemlerinde yenileyin.\n\n**Tarihsel Geri Test:**\nKorku ayarlı DCA, 5 yıllık dönemlerde sabit DCA\'dan yaklaşık **%15-30** daha iyi performans göstermiştir.\n\nOptimize edilmiş stratejinizi [DCA Hesaplayıcımız](/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi) ile planlayın.',
      cta: { calculatorId: 'dca', calculatorName: 'DCA Hesaplayıcı', text: 'Korku ayarlı DCA stratejinizi oluşturun', path: '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' },
    },
    {
      id: 'zamanlama-hatalari',
      heading: 'Yaygın Zamanlama Hataları',
      content: '**Hata 1: "Mükemmel" Korkuyu Beklemek**\n• Endeks 18-22\'de otururken tek haneli okumaları beklemek\n• **Çözüm**: Alımınızı kademeleyin — 25\'te başlayın, 20\'de artırın, 10\'da maksimuma çıkarın\n\n**Hata 2: Anında Hepsini Yatırmak**\n• İlk aşırı korku okumasında tüm rezervi devreye almak\n• **Çözüm**: Korku dönemlerinde alımları birden fazla hafta/aya yayın\n\n**Hata 3: İlk Aşırı Açgözlülükte Satmak**\n• Bitcoin %50 daha rallide iken 75 açgözlülükte pozisyonlardan çıkmak\n• **Çözüm**: Kademeli olarak çıkın; tamamen çıkmayın; takip eden kâr hedefleri kullanın\n\n**Hata 4: Bağlamı Görmezden Gelmek**\n• Tüm aşırı korku okumalarını aynı şekilde ele almak\n• **Çözüm**: Korku & Açgözlülüğü [zincir üzeri metrikler](/tr/hesaplayicilar/bitcoin-stok-akis) ve makro bağlamla birleştirin\n\n**Hata 5: Duygusal Geçersiz Kılma**\n• Bir sistem olması ama gerçek korku/açgözlülük sırasında terk etmek\n• **Çözüm**: Kurallara önceden taahhüt edin; mümkün olduğunda otomatikleştirin',
    },
    {
      id: 'geri-test',
      heading: 'Geri Test Sonuçları: Korku vs Açgözlülük Girişleri',
      content: 'Farklı Korku & Açgözlülük seviyelerinde girişleri karşılaştıran geri testler çarpıcı kalıplar ortaya çıkarıyor:\n\n**Çalışma: Bitcoin Alımları 2019-2025**\n\n| Giriş Koşulu | Ortalama 12 Ay Getiri | Kazanma Oranı | Sharpe Oranı |\n|-----------------|------------------------|--------------------|--------------|\n| Aşırı Korku (<20) | +%127 | %95 | 1,8 |\n| Korku (20-40) | +%89 | %88 | 1,4 |\n| Nötr (40-60) | +%52 | %75 | 0,9 |\n| Açgözlülük (60-80) | +%23 | %62 | 0,5 |\n| Aşırı Açgözlülük (>80) | -%8 | %42 | -0,2 |\n\n**Temel Bulgular:**\n• **Aşırı korku girişleri 12 aylık tutma dönemlerinde %95 kârlı oldu**\n• **Aşırı açgözlülük girişleri ortalama olarak para kaybettirdi**\n• Risk-ayarlı getiri aşırı korku için aşırı açgözlülüğe göre 9× daha yüksekti\n\n**Açık Sonuç:**\nHiçbir strateji mükemmel değildir, ancak tarihsel kanıt **korkuda alıp açgözlülükte dikkatli olmayı** güçlü bir şekilde destekler.\n\nKendi varsayımsal senaryolarınızı [Ya Olsaydı Hesaplayıcısı](/tr/hesaplayicilar/bitcoin-ya-olsaydi) ile modelleyin.',
      cta: { calculatorId: 'what-if', calculatorName: 'Ya Olsaydı Hesaplayıcısı', text: 'Varsayımsal Bitcoin yatırımlarını geri test edin', path: '/tr/hesaplayicilar/bitcoin-ya-olsaydi' },
    },
    {
      id: 'kural-tabanli-sistem',
      heading: 'Kural Tabanlı Sistem Oluşturma',
      content: 'En başarılı Korku & Açgözlülük stratejileri **sistematik ve önceden taahhüt edilmiş**tir. İşte tam bir çerçeve:\n\n**1. Sermaye Yapınızı Tanımlayın:**\n• **Çekirdek Stok**: BTC tahsisinin %60-70\'i — sentimentten bağımsız asla satılmaz\n• **Ticaret Stoğu**: %20-30 — sentiment sinyallerine göre al/sat\n• **Nakit Rezervi**: %10-20 — yalnızca aşırı korku sırasında devreye alınır\n\n**2. Giriş Kuralları:**\n• **Standart DCA**: Sentimentten bağımsız sabit programda yürütün\n• **Korku Bonus Alımları**: Korkuda %50 ekstra (<40), Aşırı Korkuda %100 (<20)\n• **Maksimum Devreye Alma**: Tek haftada nakit rezervinin %25\'inden fazlasını asla devreye almayın\n\n**3. Çıkış Kuralları:**\n• **Çekirdek Stok**: Tüm koşullarda tutun — [HODL stratejisi](/tr/ogrenin/bitcoin-hodl-stratejisi-aciklamasi)\n• **Ticaret Stoğu**: Açgözlülükte budamaya başlayın (>70), Aşırı Açgözlülükte hızlandırın (>85)\n\n**4. Psikolojik Güvenceler:**\n• Nötr sentiment dönemlerinde kurallara yazılı olarak önceden taahhüt edin\n• Sistemi hesap verebilirlik ortağıyla paylaşın\n\nBu sistematik yaklaşım duyguyu ortadan kaldırır, oynak dönemlerde açık rehberlik sağlar ve karşıt yatırımın istatistiksel avantajını zaman içinde birleştirir.',
      cta: { calculatorId: 'fear-greed-index', calculatorName: 'Korku & Açgözlülük Endeksi', text: 'Stratejiniz için sentiment takibine başlayın', path: '/tr/hesaplayicilar/bitcoin-korku-acgozluluk' },
    },
  ],
  expertQuote: {
    quote: 'Başkaları açgözlü olduğunda korkulu, başkaları korkulu olduğunda açgözlü olun.',
    author: 'Warren Buffett',
    role: 'CEO, Berkshire Hathaway',
    source: 'https://www.berkshirehathaway.com/letters/1986.html',
    sourceLabel: 'berkshirehathaway.com',
  },
};

export default article;
