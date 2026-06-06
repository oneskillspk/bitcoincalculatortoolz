import { Article } from '../articles';

/** TR counterpart of `bitcoin-tax-guide-capital-gains` → `/tr/ogrenin/bitcoin-vergi-rehberi-sermaye-kazanci`. */
const article: Article = {
  slug: 'bitcoin-vergi-rehberi-sermaye-kazanci',
  title: 'Bitcoin Sermaye Kazancı Vergisi: Oranlar, Beyan ve Hesaplama',
  metaDescription:
    'Bitcoin nasıl vergilendirilir? Kısa vadeli vs uzun vadeli sermaye kazancı oranlarını, FIFO vs LIFO maliyet bazını ve kripto vergi faturanızı nasıl hesaplayacağınızı öğrenin. Ücretsiz araç.',
  category: 'Tax',
  publishedDate: '2026-02-05',
  updatedDate: '2026-05-18',
  readingTime: 9,
  keywords: ['bitcoin vergisi', 'kripto sermaye kazancı', 'bitcoin vergi hesaplayıcı', 'kripto vergileri', 'bitcoin vergi türkiye'],
  relatedCalculators: ['capital-gains-tax', 'profit-loss', 'investment', 'bitcoin-zakat'],
  relatedArticles: ['bitcoin-kar-zarar-nasil-hesaplanir', 'bitcoin-dca-nedir', 'bitcoin-hodl-stratejisi-aciklamasi'],
  faqs: [
    { question: 'Bitcoin için vergi ödemek zorunda mıyım?', answer: 'Çoğu ülkede (ABD, İngiltere, Kanada, Avustralya) evet. Bitcoin mülk olarak değerlendirilir; satmak, takas etmek veya harcamak sermaye kazancı vergisi olayını tetikler. Türkiye\'de mevcut düzenlemeler için yerel vergi danışmanınıza başvurun.' },
    { question: 'Bitcoin kazançlarındaki vergi oranı nedir?', answer: 'ABD\'de kısa vadeli kazançlar (< 1 yıl) sıradan gelir gibi vergilendirilir (%10-37). Uzun vadeli kazançlar (> 1 yıl) tercihli oranlarda (%0, %15 veya %20) vergilendirilir.' },
    { question: 'Bitcoin tutmak vergilendirilebilir mi?', answer: 'Hayır. Sadece HODL\'lemek vergilendirilebilir bir olay değildir. Vergiler yalnızca satış, takas, harcama veya bağış yıllık istisna miktarını aştığında tetiklenir.' },
    { question: 'Bitcoin zararlarını kazançlara karşı mahsup edebilir miyim?', answer: 'Evet. Bitcoin\'den gelen sermaye zararları diğer yatırımların sermaye kazançlarını dengeleyebilir. ABD\'de yıllık sıradan gelirden 3.000$\'a kadar net sermaye zararı düşülebilir.' },
  ],
  sections: [
    {
      id: 'vergi-olaylari',
      heading: 'Hangi Bitcoin Olayları Vergilendirilebilir?',
      content: 'Her Bitcoin aktivitesi vergi tetiklemez. [IRS kripto parayı](https://www.irs.gov/individuals/international-taxpayers/frequently-asked-questions-on-virtual-currency-transactions) para birimi değil mülk olarak değerlendirir — yani sermaye kazancı kuralları geçerlidir.\n\n**Vergilendirilebilir olaylar:**\n• Bitcoin\'i fiat (USD, EUR, TRY) için satmak\n• Bitcoin\'i başka kripto ile takas etmek\n• Bitcoin\'i mal veya hizmet için harcamak\n• Bitcoin\'i iş karşılığı almak (gelir olarak)\n• Madencilik ödülleri (alındığında piyasa değeri üzerinden gelir olarak)\n\n**Vergilendirilebilir olmayan olaylar:**\n• Fiat ile Bitcoin almak\n• Bitcoin tutmak\n• Kendi cüzdanlarınız arasında transfer\n• Nitelikli hayır kurumlarına bağış\n• Yıllık istisna sınırının altında hediye etme',
    },
    {
      id: 'kisa-vs-uzun',
      heading: 'Kısa Vadeli vs Uzun Vadeli Sermaye Kazançları',
      content: 'Bu ayrım Bitcoin yatırımcıları için en etkili vergi planlama kararlarından biridir.\n\n**Kısa vadeli kazançlar (< 1 yıl tutulan):**\n• Sıradan gelir vergi oranınızda vergilendirilir\n• ABD\'de oranlar %10-37 arasında\n• Günlük trader\'lar ve sık satıcılar en yüksek oranlarla karşılaşır\n\n**Uzun vadeli kazançlar (> 1 yıl tutulan):**\n• Tercihli oranlarda vergilendirilir: %0, %15 veya %20\n• Çoğu vergi mükellefi %15 oranı için uygundur\n• Kısa vadeden %22\'ye kadar daha düşük — önemli vergi tasarrufu\n\n**Strateji:** Mümkün olduğunda Bitcoin\'i satmadan önce en az 1 yıl tutun. Bu tek karar binlerce dolar vergi tasarrufu sağlayabilir.',
      cta: { calculatorId: 'capital-gains-tax', calculatorName: 'Sermaye Kazancı Vergi Hesaplayıcısı', text: 'Bitcoin sermaye kazancı vergi yükümlülüğünüzü hesaplayın', path: '/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi' },
    },
    {
      id: 'kazanc-hesaplama',
      heading: 'Bitcoin Sermaye Kazancınızı Nasıl Hesaplarsınız?',
      content: 'Formül:\n\n**Sermaye Kazancı = Satış Fiyatı − Maliyet Bazı − Komisyonlar**\n\nMaliyet bazınız şunları içerir:\n• Bitcoin için ödediğiniz fiyat\n• Alım sırasında ödenen borsa veya işlem ücretleri\n• Edinim işleminin ağ ücretleri\n\nÖrnek:\n• Mart 2025\'te 0,5 BTC için 25.000$ + 50$ komisyon ödendi\n• Temmuz 2026\'da 0,5 BTC 45.000$ − 45$ komisyon karşılığı satıldı\n• Maliyet bazı: 25.050$\n• Net gelir: 44.955$\n• Sermaye kazancı: 19.905$\n• 1+ yıl tutuldu → uzun vadeli oran uygulanır\n\nFIFO, LIFO ve HIFO yöntemleri için ayrıntılı incelemeyi [Bitcoin kâr/zarar kılavuzumuzdan](/tr/ogrenin/bitcoin-kar-zarar-nasil-hesaplanir) okuyun.',
    },
    {
      id: 'optimizasyon',
      heading: 'Bitcoin Vergi Optimizasyon Stratejileri',
      content: '**1. Uzun vadeli oranlar için tutun:** En basit strateji — düşük oranlara erişmek için en az 1 yıl tutun.\n\n**2. Vergi zararı hasadı:** Kazançları dengelemek için zararlı pozisyonları satın. 2026 itibarıyla çoğu yargı bölgesinde kripto için "wash sale" kuralı yoktur.\n\n**3. HIFO muhasebesi kullanın:** "En Yüksek Önce Çıkar" — en pahalı lotları önce satın, vergilendirilebilir kazançları en aza indirin.\n\n**4. Değer kazanmış Bitcoin bağışlayın:** 1 yıldan fazla tutulan Bitcoin bağışı piyasa değerini düşürmenize izin verir ve sermaye kazancı vergisinden kaçınırsınız.\n\n**5. Emeklilik hesapları:** Bazı platformlar IRA içinde Bitcoin alımına izin verir; kazançlar vergi ertelemeli veya vergisiz büyür (Roth IRA).\n\n**6. Hediye etme:** ABD\'de kişi başı yılda 18.000$\'a kadar hediye edebilirsiniz.',
    },
    {
      id: 'beyan',
      heading: 'Vergilerinizde Bitcoin\'i Nasıl Beyan Edersiniz?',
      content: 'ABD\'de Bitcoin vergileri şu formlarda raporlanır:\n\n• **Form 8949:** Her kripto işlemini alış tarihi, satış tarihi, gelir, maliyet bazı ve kazanç/zarar ile listeler\n• **Schedule D:** Form 8949\'daki toplam sermaye kazançlarını ve zararlarını özetler\n• **Schedule 1:** Madencilik geliri, staking ödülleri veya ödeme olarak kazanılan kripto\n• **Form 1040:** Dijital varlıklar hakkındaki onay kutusunun doğru yanıtlanması gerekir\n\n**Kayıt tutma ipuçları:**\n• Kullandığınız her borsadan işlem geçmişini dışa aktarın\n• Cüzdan-cüzdan transferleri çift sayımdan kaçınmak için izleyin\n• Otomatik raporlama için kripto vergi yazılımları (CoinTracker, Koinly, TaxBit) kullanın\n• Kayıtları en az 7 yıl saklayın',
    },
  ],
  howToSteps: [
    { name: 'Tutma süresini belirleyin', text: 'Bitcoin\'inizi 1 yıldan az mı çok mu tuttuğunuzu kontrol edin' },
    { name: 'Maliyet bazını hesaplayın', text: 'Alış fiyatınızı ve tüm komisyonları toplayın' },
    { name: 'Vergi Hesaplayıcısını açın', text: 'Bitcoin Sermaye Kazancı Vergi Hesaplayıcımızı ziyaret edin' },
    { name: 'İşlem detaylarını girin', text: 'Alış fiyatı, satış fiyatı, tutma süresi ve gelir diliminizi girin' },
    { name: 'Vergi yükümlülüğünüzü inceleyin', text: 'Tahmini sermaye kazancı verginizi ve efektif oranınızı görün' },
  ],
  expertQuote: {
    quote: 'Kripto parayı ödediğinizden fazlasına satıyorsanız, fark bir sermaye kazancıdır — hisse veya ev gibi vergilendirilir. IRS sanal parayı para birimi değil mülk olarak değerlendirir.',
    author: 'Internal Revenue Service',
    role: 'ABD Vergi Otoritesi',
    source: 'https://www.irs.gov/businesses/small-businesses-self-employed/digital-assets',
    sourceLabel: 'irs.gov',
  },
};

export default article;
