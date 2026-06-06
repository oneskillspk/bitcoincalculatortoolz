import { Article } from '../articles';

/**
 * Turkish counterpart of `how-to-calculate-bitcoin-profit-loss`.
 *
 * Registered under the Turkish slug `bitcoin-kar-zarar-nasil-hesaplanir`
 * so it can be loaded from `/tr/ogrenin/bitcoin-kar-zarar-nasil-hesaplanir`.
 * EN↔TR slug mapping lives in `src/utils/localizedRoutes.ts`. `category`
 * stays in English (it is an enum used by the EN hub).
 *
 * Number/date conventions follow `docs/TR_TRANSLATION_GUIDELINES.md`:
 * `1.234,56` for decimals, `%99,9` for percentages, `₺` / `TL` for currency,
 * `25 Ocak 2026` for dates.
 */
const article: Article = {
  slug: 'bitcoin-kar-zarar-nasil-hesaplanir',
  title: 'Bitcoin Kâr/Zarar Nasıl Hesaplanır? (Formül + Ücretsiz Araç)',
  metaDescription:
    'Bitcoin kâr/zarar formülü: (satış fiyatı − alış fiyatı) × BTC miktarı − komisyonlar. Gerçekleşmiş kazanç, gerçekleşmemiş kâr, ROI ve vergi yükümlülüğünü ücretsiz hesaplayıcımızla bulun.',
  category: 'Trading',
  publishedDate: '2026-01-20',
  updatedDate: '2026-05-18',
  readingTime: 6,
  keywords: [
    'bitcoin kâr hesaplama',
    'bitcoin kar zarar',
    'bitcoin kâr/zarar hesaplayıcı',
    'kripto roi',
    'bitcoin roi',
    'bitcoin maliyet bazı',
  ],
  relatedCalculators: ['profit-loss', 'capital-gains-tax', 'investment', 'bitcoin-lot-size'],
  relatedArticles: [
    'bitcoin-vergi-rehberi-sermaye-kazanci',
    'bitcoin-altin-sp500-karsilastirma',
    'bitcoin-kaldirac-ticareti-riskleri',
    'bitcoin-hodl-stratejisi-aciklamasi',
    'bitcoin-ortalama-alis-fiyati-nasil-hesaplanir',
    'bitcoin-lot-buyuklugu-nasil-hesaplanir',
  ],
  faqs: [
    {
      question: 'Bitcoin kârımı nasıl hesaplarım?',
      answer:
        'Bitcoin kârı = (Güncel Değer − Toplam Maliyet Bazı). Maliyet bazınız, alış fiyatınıza ek olarak tüm işlem komisyonlarını içerir. Eğer sattıysanız, güncel değer yerine satış fiyatını kullanın.',
    },
    {
      question: 'Gerçekleşmemiş ve gerçekleşmiş kâr arasındaki fark nedir?',
      answer:
        'Gerçekleşmemiş kâr, hâlâ elinizde tuttuğunuz Bitcoin üzerindeki kazançtır (kâğıt üstü kâr). Gerçekleşmiş kâr ise sattığınız Bitcoin\'den elde ettiğiniz fiilî kazançtır. Vergi yükümlülüğü yalnızca gerçekleşmiş kârda doğar.',
    },
    {
      question: 'Komisyonları hesaba katmam gerekir mi?',
      answer:
        'Evet. Borsa komisyonları, ağ ücretleri ve çekim ücretleri kârınızı azaltır. Doğru bir kâr/zarar takibi ve vergi raporlaması için bunları maliyet bazınıza dahil edin.',
    },
    {
      question: 'Bitcoin ROI\'sini nasıl hesaplarım?',
      answer:
        'ROI = ((Güncel Değer − Maliyet Bazı) / Maliyet Bazı) × 100. Örneğin 50.000 TL\'ye aldığınız Bitcoin şu anda 150.000 TL ediyorsa ROI\'niz %200\'dür.',
    },
    {
      question: 'Türkiye\'de Bitcoin satışından elde edilen kâr nasıl vergilendirilir?',
      answer:
        'Türkiye\'de bireysel kripto kazançlarına ilişkin vergilendirme çerçevesi gelişmeye devam ediyor. Güncel duruma göre kâr/zarar kayıtlarınızı tarih, alış fiyatı, satış fiyatı ve komisyon ayrımıyla tutmanız önerilir. Kesin yükümlülük için bir mali müşavire danışın; ilgili hesaplamayı [Sermaye Kazancı Vergisi Hesaplayıcımız](/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi) ile modelleyebilirsiniz.',
    },
  ],
  sections: [
    {
      id: 'basic-formula',
      heading: 'Temel Bitcoin Kâr/Zarar Formülü',
      content:
        'Bitcoin kâr/zararını hesaplamak özünde basittir:\n\n**Kâr/Zarar = Satış Fiyatı (veya Güncel Değer) − Alış Fiyatı − Toplam Komisyonlar**\n\nAncak gerçek dünyada Bitcoin kâr/zararı şu durumlarda karmaşıklaşır:\n• Farklı fiyatlardan yapılan birden fazla alım\n• Hem alış hem satış tarafındaki işlem komisyonları\n• Transferlerdeki ağ ücretleri\n• Farklı muhasebe yöntemleri (FIFO, LIFO, HIFO)\n• Gerçekleşmiş kazançlar için vergi etkileri\n\nHer bileşeni tek tek ele alarak Bitcoin performansınızı doğru takip etmeyi öğrenelim.',
    },
    {
      id: 'cost-basis',
      heading: 'Maliyet Bazını Anlamak',
      content:
        'Maliyet bazınız, tüm komisyonlar dahil olmak üzere Bitcoin edinmek için ödediğiniz toplam tutardır. Doğru kâr/zarar hesabının temelidir.\n\n**Örnek:**\n• 0,1 BTC için 500.000 TL ödediniz\n• Borsa komisyonu: 2.500 TL (%0,5)\n• Maliyet bazınız: 502.500 TL\n• BTC başına maliyet: 5.025.000 TL\n\nBirden fazla alım yaptıysanız, toplam maliyet bazınız hangi muhasebe yöntemini kullandığınıza bağlıdır:\n• **FIFO (İlk Giren İlk Çıkar):** En eski coinler önce satılır — vergide en yaygın yöntem\n• **LIFO (Son Giren İlk Çıkar):** En yeni coinler önce satılır\n• **HIFO (En Pahalı Önce Çıkar):** En pahalı coinler önce satılır — vergiyi en aza indirir\n\nBir yöntem seçin ve tutarlı şekilde uygulayın. Detay için [ortalama alış fiyatı rehberimize](/tr/ogrenin/bitcoin-ortalama-alis-fiyati-nasil-hesaplanir) bakın.',
      cta: {
        calculatorId: 'profit-loss',
        calculatorName: 'Bitcoin Kâr/Zarar Hesaplayıcısı',
        text: 'Komisyonlar ve birden fazla alım dahil olmak üzere tam Bitcoin kârınızı hesaplayın',
        path: '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi',
      },
    },
    {
      id: 'realized-vs-unrealized',
      heading: 'Gerçekleşmiş ve Gerçekleşmemiş Kazançlar',
      content:
        '**Gerçekleşmemiş Kazançlar (Kâğıt Üstü Kâr):**\n800.000 TL\'ye aldığınız 1 BTC\'nin güncel fiyatı 2.300.000 TL ise [gerçekleşmemiş kazancınız](https://www.investopedia.com/terms/u/unrealizedgain.asp) 1.500.000 TL\'dir. Henüz bir şey satmadığınız için bu vergiyi tetiklemez.\n\n**Gerçekleşmiş Kazançlar:**\nBitcoin\'i sattığınızda, takas ettiğinizde veya harcadığınızda kazanç "gerçekleşmiş" sayılır ve genellikle bir vergi yükümlülüğü doğurur (örneğin ABD\'de [IRS dijital varlık rehberi](https://www.irs.gov/individuals/international-taxpayers/frequently-asked-questions-on-virtual-currency-transactions)). 800.000 TL\'ye alınan 1 BTC\'nin 2.300.000 TL\'ye satılması 1.500.000 TL gerçekleşmiş kazanç oluşturur.\n\n**Önemli:** Çoğu yargı bölgesinde BTC\'yi başka bir kripto paraya (örn. BTC → ETH) çevirmek de gerçekleşme olayı sayılır.',
    },
    {
      id: 'tracking-tools',
      heading: 'Bitcoin Kâr/Zararını Takip Etmek İçin Araçlar',
      content:
        'Onlarca işlemi manuel takip etmek hata yapmaya açıktır. İşte denenmiş yaklaşımlar:\n\n**1. E-tablo Yöntemi:** Tarih, miktar, fiyat, komisyon ve kümülatif kâr/zarar için sütunlar oluşturun. Basit "al ve tut" stratejileri için iş görür.\n\n**2. Kâr/Zarar Hesaplayıcımız:** Alım bilgilerinizi ve güncel fiyatı girin; getirinizi, ROI yüzdesini ve başabaş fiyatını anında görün.\n\n**3. Portföy Takipçileri:** CoinTracker veya Koinly gibi uygulamalar borsa verilerini otomatik içeri aktarır ve tüm cüzdan/borsalarınızda kâr/zarar hesaplar.\n\n**4. Borsa Raporları:** Çoğu büyük borsa kâr/zarar özetleriyle birlikte indirilebilir işlem geçmişi sunar.',
    },
    {
      id: 'common-mistakes',
      heading: 'Sık Yapılan Kâr/Zarar Hataları',
      content:
        '**Komisyonları unutmak:** Alımda VE satışta %0,5 komisyon, başabaş noktanızın giriş fiyatınızın zaten %1 üzerinde olması anlamına gelir. Detay için [Bitcoin işlem ücretleri rehberimizi](/tr/ogrenin/bitcoin-islem-ucretleri-aciklamasi) okuyun.\n\n**Transferleri yok saymak:** Bitcoin\'i cüzdanlar arasında taşımak, maliyet bazınıza eklenen ağ ücretleri oluşturur.\n\n**Muhasebe yöntemlerini karıştırmak:** Yıl ortasında FIFO ve LIFO arasında geçiş yapmak vergi raporlamasını kâbusa çevirir. Ayrıntılar için [Bitcoin vergi rehberimize](/tr/ogrenin/bitcoin-vergi-rehberi-sermaye-kazanci) bakın.\n\n**Her işlemi kaydetmemek:** Küçük [DCA](/tr/ogrenin/bitcoin-dca-nedir) alımları bile doğru maliyet bazı hesabı için kaydedilmelidir.\n\n**Vergi zararı hasadını ihmal etmek:** Zararda olan pozisyonlarınız varsa, stratejik şekilde satıp yeniden alarak kazançlı pozisyonların vergi yükünü azaltabilirsiniz.',
      cta: {
        calculatorId: 'capital-gains-tax',
        calculatorName: 'Sermaye Kazancı Vergisi Hesaplayıcısı',
        text: 'Bitcoin kârlarınızdan doğacak vergi yükümlülüğünüzü tahmin edin',
        path: '/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi',
      },
    },
  ],
  howToSteps: [
    { name: 'İşlem geçmişini toplayın', text: 'Tüm borsa ve cüzdanlardan tam işlem geçmişinizi dışa aktarın' },
    { name: 'Maliyet bazını hesaplayın', text: 'Her Bitcoin alımı için alış fiyatlarını ve tüm komisyonları toplayın' },
    { name: 'Kâr/Zarar Hesaplayıcısını açın', text: 'Bitcoin Kâr/Zarar Hesaplayıcımızı ziyaret edin' },
    { name: 'Verilerinizi girin', text: 'Alış fiyatı, miktar, komisyonlar ve güncel/satış fiyatını girin' },
    { name: 'Sonuçlarınızı inceleyin', text: 'Toplam kâr/zararınızı, ROI yüzdenizi ve başabaş fiyatınızı görün' },
  ],
  speakable: true,
  expertQuote: {
    quote:
      'Mükellefler tüm dijital varlık işlemlerini — kazançlar, zararlar ve bunların hesaplanmasında kullanılan maliyet bazı dahil — gelir vergisi beyannamelerinde bildirmek zorundadır.',
    author: 'Internal Revenue Service',
    role: 'ABD Vergi İdaresi',
    source: 'https://www.irs.gov/businesses/small-businesses-self-employed/digital-assets',
    sourceLabel: 'irs.gov dijital varlıklar',
  },
};

export default article;
