import { Article } from '../articles';

/** TR counterpart of `how-to-calculate-average-buy-price-bitcoin` → `/tr/ogrenin/bitcoin-ortalama-alis-fiyati-nasil-hesaplanir`. */
const article: Article = {
  slug: 'bitcoin-ortalama-alis-fiyati-nasil-hesaplanir',
  title: 'Bitcoin Ortalama Alış Fiyatınızı Nasıl Hesaplarsınız',
  metaDescription: 'FIFO, Bitcoin maliyet temeli için IRS varsayılanıdır. Ocak 2025\'ten beri cüzdan başına takip gereklidir. FIFO, LIFO, HIFO ve ağırlıklı ortalama yöntemlerini ücretsiz öğrenin.',
  category: 'Investing',
  publishedDate: '2026-03-09',
  updatedDate: '2026-05-18',
  readingTime: 8,
  keywords: ['bitcoin ortalama alış fiyatı', 'bitcoin maliyet temeli hesaplayıcı', 'ağırlıklı ortalama fiyat bitcoin', 'btc ortalama satın alma fiyatı', 'kripto maliyet temeli', 'fifo lifo bitcoin', 'bitcoin başabaş fiyatı'],
  relatedCalculators: ['average-buy-price', 'capital-gains-tax', 'profit-loss'],
  relatedArticles: ['bitcoin-kar-zarar-nasil-hesaplanir', 'bitcoin-vergi-rehberi-sermaye-kazanci', 'bitcoin-dca-nedir', 'bitcoin-hesaplama-formulleri'],
  faqs: [
    { question: 'Bitcoin için ortalama alış fiyatı nedir?', answer: 'Ortalama alış fiyatı (maliyet temeli olarak da adlandırılır), tüm alımlarınızda BTC başına ödediğiniz ağırlıklı ortalama fiyattır. Hem alınan BTC miktarını hem de her işlemde ödenen fiyatı hesaba katar ve kâr veya zararı ölçmek için tek bir referans fiyat verir.' },
    { question: 'Bitcoin ortalama alış fiyatımı nasıl hesaplarım?', answer: 'Toplam harcanan miktarı (ücretler dahil) alınan toplam Bitcoin miktarına bölün. Örneğin, üç alımda $5.000 harcayıp toplam 0,08 BTC aldıysanız, ortalama alış fiyatınız $5.000 ÷ 0,08 = BTC başına $62.500\'dür.' },
    { question: 'Bitcoin maliyet temelimi hesaplarken ücretleri dahil etmeli miyim?', answer: 'Evet. İşlem ücretleri, borsa ücretleri ve ağ ücretleri toplam maliyetinize dahil edilmelidir. IRS ve çoğu vergi otoritesi ücretleri maliyet temelinizin bir parçası olarak kabul eder, bu da sonunda sattığınızda vergilendirilebilir kazancınızı azaltır.' },
    { question: 'Bitcoin için FIFO ve ağırlıklı ortalama arasındaki fark nedir?', answer: 'FIFO (İlk Giren İlk Çıkar) en eski coinleri ilk sattığınızı varsayar. Ağırlıklı ortalama tüm alımları tek bir maliyet temeline karıştırır. FIFO birçok yargı bölgesinde vergi raporlama için gereklidir.' },
  ],
  howToSteps: [
    { name: 'Alım geçmişinizi toplayın', text: 'Tarih, satın alınan BTC miktarı, BTC başına fiyat ve ödenen ücretler dahil tüm Bitcoin alım işlemlerini toplayın.' },
    { name: 'Toplam maliyeti hesaplayın', text: 'Her alım emri için işlem ücretleri ve borsa ücretleri dahil tüm alımlarda harcanan toplam USD\'yi (veya fiat) toplayın.' },
    { name: 'Alınan toplam BTC\'yi hesaplayın', text: 'Tüm alımlarda alınan toplam Bitcoin\'i toplayın. Çekim ücretlerinden sonra net miktarı kullandığınızdan emin olun.' },
    { name: 'Toplam maliyeti toplam BTC\'ye bölün', text: 'Ortalama alış fiyatınız toplam maliyetin toplam BTC\'ye bölümüne eşittir. Örneğin: $10.000 toplam harcanan ÷ 0,15 BTC = $66.666,67 ortalama alış fiyatı.' },
    { name: 'Doğruluk için hesaplayıcıyı kullanın', text: 'İşlemlerinizi Bitcoin Ortalama Alış Fiyatı Hesaplayıcısı\'na girerek tüm ücretleri ve değişen alım boyutlarını hesaba katan anında, doğru bir ağırlıklı ortalama elde edin.' },
  ],
  sections: [
    {
      id: 'ortalama-alis-fiyati-nedir',
      heading: 'Bitcoin için Ortalama Alış Fiyatı Nedir?',
      content: 'Bitcoin **ortalama alış fiyatınız** — **[maliyet temeli](https://www.investopedia.com/terms/c/costbasis.asp)** olarak da bilinen — tüm alımlarınızda BTC başına ödediğiniz [ağırlıklı ortalama](https://en.wikipedia.org/wiki/Weighted_arithmetic_mean) fiyattır. Her işlemi eşit ele alan basit bir ortalamanın aksine, ağırlıklı ortalama her fiyat noktasında ne kadar Bitcoin satın aldığınızı hesaba katar.\n\nÖrneğin, $40.000\'de 0,05 BTC ve $70.000\'de 0,10 BTC aldıysanız, ortalama alış fiyatınız basitçe $55.000 değildir. $70.000\'deki daha büyük alım daha fazla ağırlık taşır ve gerçek ortalamanızı $60.000\'a çeker. Bu sayıyı anlamak, **gerçekleşmemiş kâr veya zararı** ölçmek, satış hedefleri belirlemek ve doğru [vergi raporları](/tr/ogrenin/bitcoin-vergi-rehberi-sermaye-kazanci) hazırlamak için kritiktir.\n\nÇoğu borsa coin başına ortalama maliyetinizi gösterir, ancak birden fazla platformda alım yapıyorsanız veya öz-saklama cüzdanları kullanıyorsanız manuel olarak hesaplamanız gerekir — veya [Ortalama Alış Fiyatı Hesaplayıcımızı](/tr/hesaplayicilar/bitcoin-ortalama-alis) anında kullanın.',
    },
    {
      id: 'agirlikli-ortalama-formulu',
      heading: 'Ağırlıklı Ortalama Formülü',
      content: 'Bitcoin için **ağırlıklı ortalama fiyat formülü** basittir:\n\n**Ortalama Alış Fiyatı = Harcanan Toplam Miktar ÷ Alınan Toplam BTC**\n\nİşte matematik adım adım:\n\n• **Harcanan Toplam Miktar** = Her alım için (Fiyat × Miktar + Ücretler) toplamı\n• **Alınan Toplam BTC** = Satın alınan tüm BTC miktarlarının toplamı\n\nBu formül kaç işleminiz olursa olsun çalışır. Daha büyük alımlara doğal olarak daha fazla ağırlık verir, bu nedenle basit aritmetik ortalama yerine **ağırlıklı ortalama** olarak adlandırılır.\n\n[Dolar Maliyet Ortalaması (DCA)](/tr/ogrenin/bitcoin-dca-nedir) kullanan yatırımcılar için bu formül, fiyatlar düşükken daha fazla ve fiyatlar yüksekken daha az BTC satın almanın faydasını otomatik olarak yakalar.',
    },
    {
      id: 'adim-adim-ornek',
      heading: 'Adım Adım Hesaplama Örneği',
      content: 'Üç alımla gerçek dünya örneği üzerinden gidelim:\n\n| Alım | Tarih | BTC Miktarı | BTC Başına Fiyat | Ücretler | Toplam Maliyet |\n|----------|------|-----------|--------------|------|------------|\n| 1 | Oca 2025 | 0,02 BTC | $42.000 | $5 | $845 |\n| 2 | Nis 2025 | 0,05 BTC | $58.000 | $12 | $2.912 |\n| 3 | Eyl 2025 | 0,03 BTC | $71.000 | $8 | $2.138 |\n\n**Adım 1**: Toplam Maliyet = $845 + $2.912 + $2.138 = **$5.895**\n\n**Adım 2**: Toplam BTC = 0,02 + 0,05 + 0,03 = **0,10 BTC**\n\n**Adım 3**: Ortalama Alış Fiyatı = $5.895 ÷ 0,10 = **BTC başına $58.950**\n\nBitcoin şu anda $85.000\'de işlem görüyorsa, **gerçekleşmemiş kârınız** ($85.000 − $58.950) × 0,10 = **$2.605**\'tir. Bunu [Kâr & Zarar Hesaplayıcımız](/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi) ile anında doğrulayabilirsiniz.',
      cta: { calculatorId: 'average-buy-price', calculatorName: 'Ortalama Alış Fiyatı Hesaplayıcısı', text: 'Tam Bitcoin ortalama alış fiyatınızı hesaplayın', path: '/tr/hesaplayicilar/bitcoin-ortalama-alis' },
    },
    {
      id: 'fifo-lifo-agirlikli',
      heading: 'FIFO vs LIFO vs Ağırlıklı Ortalama',
      content: '**Bitcoin maliyet temeli muhasebesi** söz konusu olduğunda, üç birincil yöntem vardır:\n\n**FIFO (İlk Giren İlk Çıkar)** en eski Bitcoin\'inizi ilk sattığınızı varsayar. Erken alımlarınız daha düşük fiyatlardaysa, FIFO genellikle daha yüksek sermaye kazançlarıyla sonuçlanır. Bu, ABD\'de kripto vergi raporlama için **IRS tarafından gereken varsayılan yöntemdir**.\n\n**LIFO (Son Giren İlk Çıkar)** en son satın alınan Bitcoin\'inizi ilk sattığınızı varsayar. Yükselen bir piyasada LIFO, vergilendirilebilir kazancınızı azaltabilir.\n\n**Ağırlıklı Ortalama** tüm alımları tek bir maliyet temeline karıştırır. Takip için en basit yöntemdir.\n\n| Yöntem | En İyisi | Vergi Etkisi | Kabul Edenler |\n|--------|----------|-----------|-------------|\n| FIFO | ABD vergi mükellefleri | Boğa piyasalarında daha yüksek kazançlar | IRS, çoğu yargı bölgesi |\n| LIFO | Vergi optimizasyonu | Yükselen piyasalarda daha düşük kazançlar | Seçili yargı bölgeleri |\n| Ağırlıklı Ortalama | Basit takip | Orta yol | İngiltere, Avustralya, diğerleri |\n\nYöntem ne olursa olsun, doğru kayıt tutma esastır. [Sermaye Kazancı Vergi Hesaplayıcımız](/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi) üç yöntemi de destekler.',
    },
    {
      id: 'maliyet-temeli-vergi',
      heading: 'Maliyet Temeli Vergiler için Neden Önemlidir',
      content: '**Bitcoin maliyet temeliniz**, sattığınızda ne kadar **sermaye kazancı vergisi** borçlu olduğunuzu doğrudan belirler. Formül basittir: **Vergilendirilebilir Kazanç = Satış Fiyatı − Maliyet Temeli**. Daha yüksek bir maliyet temeli daha düşük vergilendirilebilir kazançlar anlamına gelir.\n\nMaliyet temelinizi doğru almanın neden önemli olduğu:\n\n• **Kısa vadeli vs uzun vadeli oranlar**: Bir yıldan az tutulan Bitcoin sıradan gelir olarak vergilendirilir (ABD\'de %37\'ye kadar). Bir yılı aşan varlıklar **uzun vadeli sermaye kazancı oranlarına** (%0, %15 veya %20) hak kazanır.\n\n• **Vergi-zarar hasadı**: Ortalama alış fiyatınız mevcut piyasa fiyatının üzerindeyse, bir **gerçekleşmemiş zararınız** vardır. Satıp tekrar almak (hukuki olduğunda) diğer kazançları dengeleyebilir.\n\n• **Denetim koruması**: IRS, maliyet temelinizi Form 8949\'da raporlamanızı gerektirir. Yanlış maliyet temeli raporlaması en yaygın kripto vergi denetim tetikleyicilerinden biridir.',
      cta: { calculatorId: 'capital-gains-tax', calculatorName: 'Sermaye Kazancı Vergi Hesaplayıcısı', text: 'Bitcoin sermaye kazancı vergisini tahmin edin', path: '/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi' },
    },
    {
      id: 'yaygin-hatalar',
      heading: 'Kaçınılması Gereken Yaygın Hatalar',
      content: 'Bitcoin **ortalama alış fiyatınızı** hesaplamak basit görünür, ancak bu hatalar yanlış sonuçlara ve vergi sorunlarına yol açabilir:\n\n• **Ücretleri yok saymak**: Borsa ücretleri, ağ ücretleri ve spread maliyetleri maliyet temelinizin bir parçasıdır. Bunları hariç tutmak, gerçek satın alma fiyatınızı az gösterir ve vergilendirilebilir kazancınızı abartır.\n\n• **Borsa ve cüzdan verilerini karıştırmak**: Birden fazla borsada alım yapıp donanım cüzdanına aktarırsanız, orijinal satın alma fiyatını izlemeniz gerekir — transfer fiyatını değil.\n\n• **Ağırlıklı ortalama yerine basit ortalama kullanmak**: Alım fiyatlarınızın basit bir ortalaması pozisyon boyutunu yok sayar. $40.000\'de $100 ve $70.000\'de $10.000 aldıysanız, basit ortalama ($55.000) gerçek maliyet temelinizi ($69.703) önemli ölçüde az gösterir.\n\n• **Hediye edilen veya kazanılan Bitcoin\'i unutmak**: Hediye, madencilik ödülleri veya ödeme olarak alınan Bitcoin, alma anındaki **adil piyasa değerine** eşit bir maliyet temeline sahiptir.\n\n• **Satışlardan sonra güncellememe**: BTC\'nizin bir kısmını sattığınızda, kalan maliyet temeliniz FIFO, LIFO veya ağırlıklı ortalama kullanmanıza bağlı olarak değişir.\n\nTüm bu hatalardan ücretleri, çoklu işlemleri ve yöntem seçimini otomatik olarak ele alan [Ortalama Alış Fiyatı Hesaplayıcımızı](/tr/hesaplayicilar/bitcoin-ortalama-alis) kullanarak kaçının.',
    },
  ],
};

export default article;
