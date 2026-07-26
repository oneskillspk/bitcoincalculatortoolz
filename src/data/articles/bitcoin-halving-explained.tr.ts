import { Article } from '../articles';

/**
 * Turkish counterpart of `bitcoin-halving-explained`.
 * Mounted at `/tr/ogrenin/bitcoin-yarilanmasi-nedir`. EN↔TR slug mapping
 * lives in `src/utils/localizedRoutes.ts`.
 */
const article: Article = {
  slug: 'bitcoin-yarilanmasi-nedir',
  title: 'Bitcoin Yarılanması Nedir? Fiyat ve Arza Etkisi',
  metaDescription:
    'Bitcoin yarılanması yaklaşık 4 yılda bir yeni BTC arzını yarıya indirir. 2020 yarılanmasının ardından %560\'lık ralli yaşandı. Nasıl çalıştığını ve bir sonrakinin ne zaman olacağını öğrenin.',
  category: 'Basics',
  publishedDate: '2026-01-18',
  updatedDate: '2026-05-18',
  readingTime: 7,
  quickAnswer: "Bitcoin halving'i her yaklaşık 4 yılda bir (210.000 blokta bir) blok ödülünü yarıya indirir ve yeni BTC arzını sıkılaştırır. Bir sonraki halving Nisan 2028'de bekleniyor; ödül blok başına 3.125 BTC'den 1.5625 BTC'ye düşecek. Tarihsel olarak fiyat, her halving'den sonraki 12–18 ayda yükseliş eğilimi gösterdi.",
  keywords: [
    'bitcoin yarılanması',
    'bitcoin halving nedir',
    'bitcoin yarılanma 2028',
    'blok ödülü',
    'bitcoin arzı',
  ],
  relatedCalculators: ['halving-countdown', 'mining-profitability', 'what-if'],
  relatedArticles: [
    'bitcoin-madencilik-karliligi-2026',
    'bitcoin-islem-ucretleri-aciklamasi',
    'bitcoin-satoshi-nedir',
  ],
  faqs: [
    {
      question: 'Bir sonraki Bitcoin yarılanması ne zaman?',
      answer:
        'Bir sonraki Bitcoin yarılanması Nisan 2028 civarında bekleniyor; blok ödülü 3,125 BTC\'den 1,5625 BTC\'ye düşecek. Tam tahmin için Yarılanma Geri Sayım aracımızı kullanabilirsiniz.',
    },
    {
      question: 'Bitcoin yarılanması fiyatı artırır mı?',
      answer:
        'Tarihsel olarak Bitcoin fiyatı her yarılanmanın ardından 12-18 ay içinde önemli ölçüde yükselmiştir. Ancak geçmiş performans gelecekteki sonuçları garanti etmez ve fiyatı etkileyen birçok faktör vardır.',
    },
    {
      question: 'Kaç Bitcoin yarılanması kaldı?',
      answer:
        'Yaklaşık 2140 yılına kadar 28 yarılanma daha olacak; o tarihte son Bitcoin parçası madenlenecek ve toplam arz 21 milyona ulaşacak.',
    },
    {
      question: 'Yarılanmadan sonra madencilere ne olur?',
      answer:
        'Madenciler her yarılanmadan sonra yarı blok ödülü alır. Daha az verimli madenciler kârsız hale gelip kapanabilir; ağ, ~10 dakikalık blok sürelerini korumak için zorluğu ayarlar.',
    },
  ],
  sections: [
    {
      id: 'yarilama-nedir',
      heading: 'Bitcoin Yarılanması Nedir?',
      content:
        'Bitcoin yarılanması, yaklaşık her 210.000 blokta bir (kabaca her 4 yılda bir) gerçekleşen önceden programlanmış bir olaydır. Yarılanma sırasında, madencilerin işlemleri doğrulamak ve zincire yeni blok eklemek karşılığında aldıkları ödül yarıya indirilir.\n\nBu mekanizma Bitcoin protokolünde sabit kodlanmıştır ve onun en önemli özelliklerinden biridir — öngörülebilir, azalan bir arz programı yaratarak Bitcoin\'i doğası gereği deflasyonist kılar. Satoshi Nakamoto\'nun [Bitcoin teknik raporunda](https://bitcoin.org/bitcoin.pdf) açıklandığı ve [Wikipedia](https://en.wikipedia.org/wiki/Bitcoin#Supply) üzerinde ayrıntılı olarak yer aldığı üzere, Bitcoin arzı 21 milyon coin (veya 2,1 katrilyon [satoshi](/tr/ogrenin/bitcoin-dca-nedir)) ile sınırlıdır ve yarılanmalar bu sınıra kademeli yaklaşılmasını sağlar.',
    },
    {
      id: 'yarilama-tarihi',
      heading: 'Bitcoin Yarılanma Tarihçesi',
      content:
        'Bugüne kadar dört Bitcoin yarılanması gerçekleşti:\n\n• **2012 (Blok 210.000):** Ödül 50 BTC\'den 25 BTC\'ye düştü. Fiyat bir yıl içinde ~12$\'dan ~1.100$\'a çıktı.\n• **2016 (Blok 420.000):** Ödül 25 BTC\'den 12,5 BTC\'ye düştü. Fiyat 18 ay içinde ~650$\'dan ~19.700$\'a çıktı.\n• **2020 (Blok 630.000):** Ödül 12,5 BTC\'den 6,25 BTC\'ye düştü. Fiyat 18 ay içinde ~8.700$\'dan ~69.000$\'a çıktı.\n• **2024 (Blok 840.000):** Ödül 6,25 BTC\'den 3,125 BTC\'ye düştü. Takip eden boğa döngüsünde fiyatlar 100.000$\'ın üzerine çıktı.\n\nHer yarılanma önemli bir boğa piyasasının öncüsü olmuştur; ancak Bitcoin\'in piyasa değeri büyüdükçe kazanç oranı her döngüde azalmıştır.',
      cta: {
        calculatorId: 'halving-countdown',
        calculatorName: 'Bitcoin Yarılanma Geri Sayımı',
        text: 'Bir sonraki Bitcoin yarılanmasına ne kadar kaldığını takip edin',
        path: '/tr/hesaplayicilar/bitcoin-yarilama',
      },
    },
    {
      id: 'neden-onemli',
      heading: 'Bitcoin Yarılanması Neden Önemli?',
      content:
        '**Arz Şoku:** Yarılanmalar yeni Bitcoin\'in dolaşıma girme hızını azaltır. Talep sabit kalır veya artarken arz yavaşlarsa, ekonomik teori fiyatların yükselmesi gerektiğini söyler.\n\n**Madenci Ekonomisi:** Yarılanma madenci kârlılığını doğrudan etkiler. Yalnızca en verimli madenciler hayatta kalır; bu da zorluk ayarlanıp yeni bir denge bulunana kadar madenciliği geçici olarak merkezileştirme eğilimindedir.\n\n**Piyasa Psikolojisi:** Yarılanmalar medya ilgisi yaratır, yeni yatırımcıları piyasaya çeker ve talebi kendi kendini güçlendiren bir döngü oluşturur.\n\n**Stok-Akış Oranı:** Her yarılanmadan sonra Bitcoin\'in stok-akış oranı (mevcut arz / yıllık üretim) iki katına çıkar; bu da onu altın ve diğer emtialara kıyasla giderek daha kıt hale getirir.',
    },
    {
      id: 'madencilige-etkisi',
      heading: 'Madenciliğe Etkisi',
      content:
        'Blok ödülleri yarıya indiğinde, madencilerin yeni basılan Bitcoin\'den elde ettiği gelir bir gecede %50 düşer. Bu, doğal seçilim benzeri bir dinamik yaratır:\n\n• Yüksek elektrik maliyetine sahip madenciler kârsız hale gelir ve kapanır\n• Verimsiz madenciler çıkarken hash oranı geçici olarak azalır\n• 10 dakikalık blok aralığını korumak için zorluk aşağı doğru ayarlanır\n• Geriye kalan madenciler rekabet azaldığı için daha kârlı hale gelir\n• İşlem ücretleri madenci gelirinde daha büyük bir paya sahip olur\n\nBitcoin uzun vadede, birincil madenci teşviki olarak blok ödüllerinden tamamen işlem ücretlerine geçiş yapacak şekilde tasarlanmıştır.',
      cta: {
        calculatorId: 'mining-profitability',
        calculatorName: 'Madencilik Kârlılık Hesaplayıcısı',
        text: 'Kurulumunuz için Bitcoin madenciliğinin kârlı olup olmadığını hesaplayın',
        path: '/tr/hesaplayicilar/bitcoin-madencilik-hesaplayicisi',
      },
    },
    {
      id: 'yatirim-stratejisi',
      heading: 'Yarılanma Etrafında Yatırım Yapmak',
      content:
        'Tarihsel veriler güçlü yarılanma sonrası performansı gösterse de şunları anlamak çok önemlidir:\n\n1. **Korelasyon nedensellik değildir** — Bitcoin fiyatını birçok başka faktör de yönlendirir\n2. **Piyasa daha olgun** — Her yarılanma, daha verimli ve daha çok kurumsal katılımı olan bir piyasada gerçekleşir\n3. **Yarılanma öncesi ralliler** — Piyasalar arz azalmasını önceden fiyatlama eğilimindedir\n4. **Zaman ufku önemlidir** — Yarılanma sonrası kazançların tam olarak ortaya çıkması genellikle 12-18 ay sürer\n\nYarılanma döngüleri boyunca uygulanan bir [DCA stratejisi](/tr/ogrenin/bitcoin-dca-nedir), uzun vadeli Bitcoin birikimi için tarihsel olarak en etkili yaklaşımlardan biri olmuştur.',
    },
  ],
  howToSteps: [
    { name: 'Döngüyü anlayın', text: 'Bitcoin yarılanmalarının yaklaşık 4 yılda bir gerçekleştiğini ve blok ödüllerini %50 azalttığını öğrenin' },
    { name: 'Geri sayımı kontrol edin', text: 'Bir sonraki yarılanmanın ne zaman olacağını görmek için Yarılanma Geri Sayım aracımızı ziyaret edin' },
    { name: 'Tarihsel verileri inceleyin', text: 'Önceki yarılanmaların Bitcoin fiyatını ve madencilik ekonomisini nasıl etkilediğini çalışın' },
    { name: 'Stratejinizi planlayın', text: 'Yarılanma olaylarının Bitcoin yatırım zaman çizelgenize nasıl uyduğunu düşünün' },
  ],
  speakable: true,
  expertQuote: {
    quote: 'Yarılanma, Bitcoin\'in para politikasının kalp atışıdır. Her dört yılda bir yeni arz yarıya iner — bunu değiştirebilecek merkezi bir otorite yoktur.',
    author: 'Andreas M. Antonopoulos',
    role: 'Mastering Bitcoin yazarı',
    source: 'https://github.com/bitcoinbook/bitcoinbook',
    sourceLabel: 'github.com/bitcoinbook',
  },
};

export default article;
