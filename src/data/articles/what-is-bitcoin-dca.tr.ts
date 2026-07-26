import { Article } from '../articles';

/**
 * Turkish counterpart of `what-is-bitcoin-dca`.
 *
 * Registered under the Turkish slug `bitcoin-dca-nedir` so it can be
 * loaded from `/tr/ogrenin/bitcoin-dca-nedir`. The English article keeps
 * `what-is-bitcoin-dca`. EN↔TR slug mapping lives in `src/utils/localizedRoutes.ts`.
 *
 * The `category` value stays in English (it is an enum used by the EN hub),
 * but every user-facing string in this object is Turkish. `ArticleSchema`
 * picks up `inLanguage: "tr"` from the route language and the TR canonical
 * is wired through `canonicalUrl` in `LearnArticle.tsx`.
 */
const article: Article = {
  slug: 'bitcoin-dca-nedir',
  title: 'Bitcoin DCA Nedir? Dolar Maliyet Ortalaması Stratejisi Açıklandı',
  metaDescription:
    'Bitcoin DCA stratejisinin nasıl çalıştığını öğrenin. Sabit aralıklarla yapılan alımların volatilite riskini nasıl azalttığını ve basit bir DCA planının nasıl kurulduğunu adım adım anlatıyoruz.',
  category: 'Investing',
  publishedDate: '2026-01-15',
  updatedDate: '2026-05-16',
  readingTime: 8,
  quickAnswer: "Bitcoin dolar maliyet ortalaması (DCA), fiyata bakmaksızın sabit bir dolar tutarını sabit bir programda BTC olarak almak demektir — genellikle haftalık veya aylık 50–500 $. Zamanlama endişesini ortadan kaldırır, girişinizi döngüler boyunca düzeltir ve tarihsel olarak dönen 4 yıllık pencerelerin %90+'ında nakit tutmayı geçer.",
  keywords: [
    'bitcoin dca',
    'bitcoin dca nedir',
    'dolar maliyet ortalaması',
    'dca stratejisi',
    'bitcoin yatırım',
    'bitcoin birikim',
    'bitcoin dca hesaplayıcısı',
  ],
  relatedCalculators: ['dca', 'lump-sum-vs-dca', 'bitcoin-savings'],
  relatedArticles: [
    'bitcoin-dca-vs-toplu-yatirim',
    'korku-acgozluluk-endeksi-stratejisi',
    'bitcoin-hesaplayici-karsilastirma',
    'bitcoin-emeklilik-planlama-rehberi',
    'bitcoin-tasarruf-plani-rehberi',
    'ne-kadar-bitcoin-sahibi-olmaliyim',
    'aylik-100-dolar-bitcoin-dca-getirileri',
  ],
  faqs: [
    {
      question: 'Bitcoin DCA ne anlama gelir?',
      answer:
        'DCA, "Dollar Cost Averaging" yani Dolar Maliyet Ortalaması anlamına gelir. Fiyattan bağımsız olarak, düzenli aralıklarla (haftalık ya da aylık) sabit bir tutarın Bitcoin alımına ayrılmasıdır. Bu yöntem volatilitenin ortalama maliyetiniz üzerindeki etkisini azaltır.',
    },
    {
      question: 'Bitcoin için DCA iyi bir strateji midir?',
      answer:
        'Evet. Tarihsel veriler, 4 yıl ve üzeri herhangi bir dönem boyunca Bitcoin\'e DCA yapan yatırımcıların artıda kapattığını gösteriyor. DCA, duygusal karar vermeyi ortadan kaldırır ve giriş fiyatlarınızı farklı piyasa döngülerine yayar.',
    },
    {
      question: 'Bitcoin\'e ne sıklıkla DCA yapmalıyım?',
      answer:
        'En yaygın frekanslar haftalık ve aylık alımdır. Haftalık DCA, daha çok veri noktası sağladığı için ortalama fiyatı bir miktar daha iyi düzler; aylık DCA ise daha sade olmasına rağmen yine oldukça etkilidir.',
    },
    {
      question: 'Bitcoin DCA için minimum ne kadar gerekir?',
      answer:
        'Birçok borsa 1–10 TL civarı küçük miktarlarda alım yapılmasına izin verir. Bitcoin 8 ondalık basamağa kadar (satoshi) bölünebildiği için, güncel BTC fiyatından bağımsız olarak istediğiniz tutarı yatırabilirsiniz.',
    },
    {
      question: 'Türkiye\'de DCA yaparken TRY volatilitesini nasıl yönetmeliyim?',
      answer:
        'TL\'deki yüksek enflasyon, sabit TL tutarınızın zaman içinde aşınmasına yol açar. Birçok yatırımcı DCA tutarını yıllık olarak güncel TÜFE oranı kadar artırarak reel alım gücünü korur. Bitcoin DCA Hesaplayıcımızda farklı tutar ve dönemleri test edebilirsiniz.',
    },
  ],
  sections: [
    {
      id: 'what-is-dca',
      heading: 'Dolar Maliyet Ortalaması (DCA) Nedir?',
      content:
        '[Dolar Maliyet Ortalaması](https://en.wikipedia.org/wiki/Dollar_cost_averaging) (DCA), bir varlığa düzenli aralıklarla ve mevcut fiyattan bağımsız olarak sabit bir tutar yatırmayı esas alan bir yatırım stratejisidir. Tek bir büyük alımla piyasayı zamanlamaya çalışmak yerine, yatırımınızı zaman içine yayarak birden fazla giriş noktasına dağıtırsınız.\n\nBitcoin için bu, örneğin haftada 500 TL ya da ayda 5.000 TL\'lik tekrarlayan bir alım kurmak ve fiyat 1.500.000 TL\'ye çıksa da 800.000 TL\'ye düşse de bu plana sadık kalmak anlamına gelir. Temel fikir basittir: fiyat düşükken daha çok [satoshi](/tr/ogrenin/bitcoin-satoshi-nedir) alır, fiyat yüksekken daha az alırsınız ve böylece ortalama giriş fiyatınız doğal olarak optimize olur.',
    },
    {
      id: 'how-dca-works',
      heading: 'Bitcoin İçin DCA Nasıl Çalışır?',
      content:
        'Basit bir örnek: 4 hafta boyunca her hafta 2.000 TL\'lik Bitcoin alımı yaptığınızı varsayalım.\n\n• Hafta 1: BTC 1.600.000 TL → 0,00125 BTC alırsınız\n• Hafta 2: BTC 1.300.000 TL → 0,00154 BTC alırsınız\n• Hafta 3: BTC 1.450.000 TL → 0,00138 BTC alırsınız\n• Hafta 4: BTC 1.800.000 TL → 0,00111 BTC alırsınız\n\nToplam yatırım: 8.000 TL. Toplam BTC: 0,00528 BTC. Ortalama maliyetiniz yaklaşık 1.515.000 TL — basit ortalama olan 1.537.500 TL\'nin altında. DCA\'nın matematiksel avantajı tam olarak budur: alımlarınızı doğal olarak düşük fiyatlara doğru ağırlıklandırır.',
      cta: {
        calculatorId: 'dca',
        calculatorName: 'Bitcoin DCA Hesaplayıcısı',
        text: 'Kendi DCA stratejinizi gerçek tarihsel Bitcoin verisi ile modelleyin',
        path: '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi',
      },
    },
    {
      id: 'benefits',
      heading: 'Bitcoin Yatırımcısı İçin DCA\'nın Faydaları',
      content:
        '**1. Zamanlama Riskini Ortadan Kaldırır:** Hiç kimse Bitcoin\'in kısa vadeli hareketlerini tutarlı şekilde tahmin edemez. DCA, "mükemmel" giriş noktasını bulma baskısını kaldırır.\n\n**2. Duygusal Kararları Azaltır:** Sabit bir program, düşüşlerde panik satışı ve yükselişlerde FOMO alımını engeller.\n\n**3. Disiplin Kazandırır:** Düzenli ve otomatik yatırım, zamanla katlanan bir tasarruf alışkanlığına dönüşür.\n\n**4. Tarihsel Olarak Kârlıdır:** Tarihsel verilere göre, 4 yıl ve üzeri herhangi bir dönemde DCA yapan yatırımcılar — ne zaman başlamış olurlarsa olsunlar — pozitif getiri görmüştür.\n\n**5. Herkese Açıktır:** Başlamak için büyük bir sermayeye ihtiyacınız yoktur. Haftada 200 TL bile zaman içinde anlamlı bir birikime dönüşür.',
    },
    {
      id: 'dca-vs-lump-sum',
      heading: 'DCA mı, Toplu Tutar mı: Hangisi Daha İyi?',
      content:
        'Sürekli yükselen bir piyasada toplu tutar (lump sum) yatırımı, paranızın piyasada daha uzun süre kalması nedeniyle matematiksel olarak DCA\'yı geçer. Ancak Bitcoin sürekli yükselen bir varlık değildir — düzenli olarak %50–80 arası geri çekilmeler yaşar.\n\nDCA, bu volatil dönemlerde psikolojik rahatlık ve risk azaltma sağlar. Kristal küresi olmayan çoğu bireysel yatırımcı için DCA, "tüm paranızı büyük bir düşüşten hemen önce yatırma" felaket senaryosunu önlediği için daha üstün bir stratejidir. Detaylı veri karşılaştırması için [DCA vs toplu tutar analizimizi](/tr/ogrenin/bitcoin-dca-vs-toplu-yatirim) okuyun.\n\nBirçok yatırımcı için ideal yaklaşım hibrit bir modeldir: bir kısmı hemen toplu tutar olarak yatırılır, geri kalan 3–12 ay boyunca DCA ile dağıtılır.',
      cta: {
        calculatorId: 'lump-sum-vs-dca',
        calculatorName: 'Toplu Tutar vs DCA Hesaplayıcısı',
        text: 'DCA ve toplu tutar performansını gerçek tarihsel veri ile karşılaştırın',
        path: '/tr/hesaplayicilar/bitcoin-maliyet-ortalama',
      },
    },
    {
      id: 'how-to-start',
      heading: 'Bitcoin\'e DCA Yapmaya Nasıl Başlanır?',
      content:
        '**Adım 1:** Tekrarlayan alımı destekleyen bir borsa veya platform seçin (Binance TR, BtcTurk, Paribu, ya da uluslararası platformlardan Coinbase, River, Strike).\n\n**Adım 2:** Yatırım tutarınızı ve frekansınızı belirleyin. Rahatça ayırabileceğiniz bir tutarla başlayın — haftada 500 TL bile güçlü bir başlangıçtır.\n\n**Adım 3:** Otomatik alımı kurun. Çoğu platform "tekrarlayan alım" özelliği sunar; bu, sürecin tamamını otomatikleştirir.\n\n**Adım 4:** Öz saklama (self-custody) düşünün. Bakiyeniz anlamlı bir seviyeye (örn. 30.000–50.000 TL üzeri) ulaştığında, güvenlik için bir donanım cüzdanına aktarın.\n\n**Adım 5:** Performansınızı takip edin. Bitcoin DCA Hesaplayıcımız ile farklı senaryoları modelleyin ve stratejinizin tarihsel olarak nasıl performans göstereceğini görün.',
    },
    {
      id: 'common-mistakes',
      heading: 'Sık Yapılan DCA Hataları',
      content:
        '**Ayı piyasasında durmak:** DCA\'yı bırakmak için en kötü zaman budur. Ayı piyasaları, dolar (ya da TL) başına en çok Bitcoin biriktirdiğiniz dönemlerdir.\n\n**Aşırı yatırım:** Yalnızca 4+ yıl boyunca dokunmadan bırakabileceğiniz parayı yatırın. DCA, yatırmamanız gereken tutarı yatırmaya karşı sizi korumaz. Tahsis çerçeveleri için [ne kadar Bitcoin\'iniz olmalı](/tr/ogrenin/ne-kadar-bitcoin-sahibi-olmaliyim) rehberimizi inceleyin.\n\n**Komisyonları yok saymak:** Yüksek [işlem ücretleri](/tr/ogrenin/bitcoin-islem-ucretleri-aciklamasi) getirilerinizi aşındırır. Tekrarlayan alımlar için düşük komisyonlu platformları tercih edin.\n\n**Çıkış stratejisi olmaması:** Hangi koşullarda satacağınıza ya da yeniden dengeleme yapacağınıza önceden karar verin. DCA bir giriş stratejisidir; tam bir yatırım planı değildir. Uzun vadeli disiplin için bir [HODL stratejisi](/tr/ogrenin/bitcoin-hodl-stratejisi-aciklamasi) düşünün.',
    },
  ],
  howToSteps: [
    { name: 'Bütçenizi belirleyin', text: 'Düzenli olarak yatırabileceğiniz tutarı belirleyin (örn. haftada 500 TL)' },
    { name: 'Frekans seçin', text: 'Haftalık veya aylık tekrarlayan alımı tercih edin' },
    { name: 'Bitcoin DCA Hesaplayıcımızı açın', text: 'bitcoincalculator.tools üzerindeki Bitcoin DCA Hesaplayıcısına gidin' },
    { name: 'Parametrelerinizi girin', text: 'Tutarınızı, frekansınızı ve istediğiniz dönemi girin' },
    { name: 'Sonuçları analiz edin', text: 'Tarihsel performansı ve projeksiyonları inceleyin' },
  ],
  speakable: true,
  expertQuote: {
    quote:
      'Bitcoin bir tasarruf teknolojisidir. Dolar maliyet ortalaması yapmak, merkez bankası kaynaklı satın alma gücü kaybından çıkmanın en sade yoludur.',
    author: 'Saifedean Ammous',
    role: 'Yazar, The Bitcoin Standard',
    source: 'https://saifedean.com/thebitcoinstandard',
    sourceLabel: 'saifedean.com',
  },
};

export default article;
