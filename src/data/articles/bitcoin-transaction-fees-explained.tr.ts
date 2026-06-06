import { Article } from '../articles';

/** TR counterpart of `bitcoin-transaction-fees-explained` → `/tr/ogrenin/bitcoin-islem-ucretleri-aciklamasi`. */
const article: Article = {
  slug: 'bitcoin-islem-ucretleri-aciklamasi',
  title: 'Bitcoin İşlem Ücretleri Açıklaması: Nasıl Daha Az Ödenir',
  metaDescription: 'Bitcoin ücretleri ağ yoğunluğu ve byte boyutuna göre belirlenir. SegWit ücretleri %40\'a kadar azaltır. Hafta sonu işlemleri daha ucuzdur. Ücretinizi ücretsiz tahmin edin.',
  category: 'Basics',
  publishedDate: '2026-02-09',
  updatedDate: '2026-05-18',
  readingTime: 6,
  keywords: ['bitcoin işlem ücreti', 'btc komisyon', 'bitcoin ağ ücreti', 'bitcoin komisyon hesaplama', 'bitcoin ücret düşürme'],
  relatedCalculators: ['transaction-fees', 'lightning', 'bitcoin-converter'],
  relatedArticles: ['bitcoin-satoshi-nedir', 'bitcoin-yarilanmasi-nedir', 'bitcoin-madencilik-karliligi-2026'],
  faqs: [
    { question: 'Bitcoin işlem ücreti ne kadardır?', answer: 'Bitcoin ücretleri ağ yoğunluğuna göre değişir. 2026\'da standart işlemler için tipik ücretler 0,50$–5$, düşük öncelikli işlemler için 0,10$–1$ arasındadır. Yüksek yoğunlukta 20$+\'a çıkabilir. Gerçek zamanlı tahminler için ücret tahmincimizi kullanın.' },
    { question: 'Bitcoin ücretleri neden bazen yüksek?', answer: 'Bitcoin ücretleri blok alanı için arz ve talep tarafından belirlenir. Her blok yaklaşık 4MB kapasiteye sahiptir. Birçok kullanıcı eş zamanlı işlem yapmak istediğinde, daha hızlı dahil edilmek için daha yüksek ücret teklif ederler ve ücretler yükselir.' },
    { question: 'Bitcoin işlem ücretlerini nasıl azaltabilirim?', answer: 'SegWit veya Taproot adresleri kullanın, işlemleri toplu yapın, yoğun olmayan saatlerde (hafta sonları, erken UTC sabahları) işlem yapın, küçük ödemeler için Lightning Network kullanın ve acil olmayan transferlerde özel ücret oranı belirleyin.' },
    { question: 'Bitcoin ücretleri madencilere mi gidiyor?', answer: 'Evet. İşlem ücretleri tamamen işleminizi bir bloka dahil eden madenciye gider. Yarılanmalar blok ödülünü azalttıkça ücretler madenci gelirinin giderek daha önemli bir parçası haline gelir.' },
  ],
  sections: [
    {
      id: 'nasil-calisir',
      heading: 'Bitcoin İşlem Ücretleri Nasıl Çalışır?',
      content: 'Her Bitcoin işlemi, bir bloka dahil etmek için madencilere ödenen bir ücret gerektirir. Yüzde alan geleneksel ödeme işlemcilerinin aksine, **Bitcoin ücretleri işlem değerine değil veri boyutuna bağlıdır.**\n\n10$ veya 10.000.000$ Bitcoin göndermek aynı ücrete mal olur — yalnızca işleminizin ne kadar blok alanı kapladığına (sanal byte veya vByte cinsinden) bağlıdır.\n\nBir işlem yayınladığınızda, onaylanmamış işlemlerin bekleme odası olan **mempool**\'a girer. Madenciler daha yüksek ücret oranlı (sat/vByte) işlemleri önceliklendirir. Sakin dönemlerde 1 sat/vByte bile yeterli olabilir. Boğa koşularında hızlı onay için 50+ sat/vByte gerekebilir.',
    },
    {
      id: 'ucret-faktorleri',
      heading: 'Ücretinizi Belirleyen Faktörler',
      content: 'Birkaç faktör ne kadar ödeyeceğinizi etkiler:\n\n• **İşlem boyutu (vByte):** Daha fazla input ve output = daha büyük işlem = daha yüksek ücret. Basit bir gönderim 140 vByte; çok sayıda küçük UTXO\'yu birleştiren işlem 500+ vByte olabilir.\n• **Ağ yoğunluğu:** Mempool derinliği rekabetçi ücret oranlarını belirler.\n• **Adres türü:** SegWit (bc1q...) ve Taproot (bc1p...) adresleri legacy adreslerden (1...) daha az blok alanı kullanır ve ücretleri %30–40 azaltır.\n• **Onay hızı:** Daha yavaş onay için daha az ödeyebilirsiniz.\n\n| Öncelik | Tipik Bekleme | Ücret Aralığı (2026) |\n|---|---|---|\n| Yüksek (sonraki blok) | ~10 dakika | 20–100+ sat/vB |\n| Orta (1–3 blok) | 10–30 dakika | 5–20 sat/vB |\n| Düşük (6+ blok) | 1–6 saat | 1–5 sat/vB |\n| Ekonomi | Saatler–günler | 1–2 sat/vB |',
      cta: { calculatorId: 'transaction-fees', calculatorName: 'Bitcoin İşlem Ücreti Tahmincisi', text: 'Mevcut ağ koşullarına göre işlem ücretinizi tahmin edin', path: '/tr/hesaplayicilar/bitcoin-ag-ucreti' },
    },
    {
      id: 'ucretleri-azaltma',
      heading: 'Bitcoin Ücretlerinizi Nasıl Azaltırsınız',
      content: 'Ödediğinizi en aza indirmek için pratik stratejiler:\n\n• **SegWit/Taproot adresleri kullanın.** Legacy (1...) yerine yerel SegWit (bc1q...) veya Taproot (bc1p...) kullanmak ücretleri %30–40 azaltır.\n• **İşlemlerinizi zamanlayın.** Ücretler hafta sonları ve Asya/Avrupa gece saatlerinde (yaklaşık 00:00–08:00 UTC) en düşüktür. Fiyat pump\'ları veya çöküşlerinde işlem yapmayın.\n• **İşlemleri toplu yapın.** Birden fazla alıcıya gönderiyorsanız tek işlemde toplayın. Bu toplam ücreti %50–80 azaltır.\n• **Küçük ödemeler için Lightning kullanın.** Lightning Network, bir sentin küçük kesirleriyle neredeyse anlık transferler sağlar. 1.000$ altındaki tutarlar için idealdir.\n• **Özel ücret oranı belirleyin.** Varsayılan "hızlı" ayarını kullanmayın.',
      cta: { calculatorId: 'lightning', calculatorName: 'Lightning Network Hesaplayıcısı', text: 'Zincir üstü ücretleri Lightning Network maliyetleriyle karşılaştırın', path: '/tr/hesaplayicilar/bitcoin-lightning-ucreti' },
    },
    {
      id: 'ucretler-ve-yarilanma',
      heading: 'Ücretler ve Bitcoin Yarılanması',
      content: 'Bitcoin\'in blok ödülü yaklaşık her 4 yılda bir yarılanır. Sübvansiyon azaldıkça **işlem ücretleri madenci gelirinin daha büyük bir payı haline gelir.** 2024 yarılanmasından sonra blok sübvansiyonu 3,125 BTC\'ye düştü. 2028\'de 1,5625 BTC\'ye düşecek.\n\nBu, uzun vadeli ücret trendlerinin muhtemelen **yukarı yönlü** olduğu anlamına gelir çünkü:\n1. Benimsenme blok alanı talebini artırır\n2. Madenciler kârlı kalmak için ücret geliri gerektirir — [madencilik kârlılığı analizimize](/tr/ogrenin/bitcoin-madencilik-karliligi-2026) bakın\n3. Katman-2 çözümleri küçük işlemleri üstlenirken zincir üstü yüksek değerli mutabakat için kalır\n\nDaha fazla bilgi için [Bitcoin yarılanması açıklamamızı](/tr/ogrenin/bitcoin-yarilanmasi-nedir) okuyun.',
    },
    {
      id: 'mitler',
      heading: 'Yaygın Ücret Mitleri Çürütüldü',
      content: '• **Mit: "Bitcoin ücretleri her zaman pahalıdır."** Gerçek: 2026\'da medyan zincir üstü ücretler tipik olarak 0,50$–2$\'dır. Lightning ücretleri 0,01$\'ın altındadır.\n• **Mit: "Daha yüksek ücret = daha hızlı onay."** Gerçek: Yalnızca diğer mempool işlemlerinden daha yüksek teklif vermeniz gerekir. Fazla ödeme sonraki bloktan (~10 dk) önceye hızlandırmaz.\n• **Mit: "Ücretler kredi kartları gibi yüzde bazlıdır."** Gerçek: 1 milyon $ Bitcoin transferi, 100$ transferiyle aynı ücrete mal olur — veri boyutuna bağlıdır.\n• **Mit: "Ücretler boşa harcanan paradır."** Gerçek: Ücretler madencileri teşvik ederek ağı güvene alır. Tarihteki en güvenli, merkeziyetsiz parasal ağı kullanmanın bedelidir.',
    },
  ],
  howToSteps: [
    { name: 'Ücret yapısını anlayın', text: 'Bitcoin ücretlerinin gönderilen miktara değil işlem veri boyutuna (vByte) bağlı olduğunu öğrenin' },
    { name: 'Güncel ücret oranlarını kontrol edin', text: 'Farklı öncelik düzeyleri için gerçek zamanlı tahminleri görmek üzere İşlem Ücreti Tahmincimizi ziyaret edin' },
    { name: 'Doğru adres türünü seçin', text: 'Legacy adreslere göre %30–40 ücret tasarrufu için SegWit (bc1q) veya Taproot (bc1p) adresleri kullanın' },
    { name: 'Önceliğinizi seçin', text: 'Onay aciliyetinize göre yüksek, orta veya düşük öncelik seçin' },
    { name: 'Küçük tutarlar için Lightning düşünün', text: '1.000$ altındaki işlemler için neredeyse sıfır ücretle Lightning Network kullanın' },
  ],
};

export default article;
