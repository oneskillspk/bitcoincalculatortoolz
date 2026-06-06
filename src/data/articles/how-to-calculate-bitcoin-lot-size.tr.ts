import { Article } from '../articles';

/** TR counterpart of `how-to-calculate-bitcoin-lot-size` → `/tr/ogrenin/bitcoin-lot-buyuklugu-nasil-hesaplanir`. */
const article: Article = {
  slug: 'bitcoin-lot-buyuklugu-nasil-hesaplanir',
  title: 'Forex ve Vadeli İşlemler için Bitcoin Lot Büyüklüğü Nasıl Hesaplanır',
  metaDescription: '1 standart Bitcoin lotu = 1 BTC. Formül: Risk ÷ Tick cinsinden Stop Loss. Standart, mini, mikro lot özellikleri, broker farkları ve sıkça yapılan hataları ücretsiz öğrenin.',
  category: 'Trading',
  publishedDate: '2026-03-11',
  updatedDate: '2026-05-18',
  readingTime: 9,
  keywords: ['bitcoin lot büyüklüğü hesaplayıcı', 'btc lot büyüklüğü', 'bitcoin pozisyon büyüklüğü', 'kripto lot büyüklüğü', 'bitcoin lot formülü'],
  relatedCalculators: ['bitcoin-lot-size', 'leverage-liquidation', 'profit-loss'],
  relatedArticles: ['bitcoin-kaldirac-ticareti-riskleri', 'bitcoin-kar-zarar-nasil-hesaplanir', 'bitcoin-volatilitesi-aciklamasi', 'bitcoin-hesaplama-formulleri'],
  speakable: true,
  faqs: [
    { question: 'Bitcoin işleminde lot nedir?', answer: 'Lot, standartlaştırılmış bir işlem büyüklüğü birimidir. Bitcoin forex/CFD ticaretinde 1 standart lot = 1 BTC. Mini lotlar (0,1 BTC), mikro lotlar (0,01 BTC) ve nano lotlar (0,001 BTC) risk yönetimi için daha küçük pozisyon büyüklüklerine olanak tanır.' },
    { question: 'Bitcoin lot büyüklüğümü nasıl hesaplarım?', answer: 'Formülü kullanın: Lot Büyüklüğü = (Hesap Bakiyesi × Risk%) ÷ (Stop Loss Mesafesi × Kontrat Büyüklüğü). Örneğin, %1 risk alan 10.000 $\'lık hesapla, 85.000 $ giriş ve 83.000 $ stop loss: Lot Büyüklüğü = 100 $ ÷ (2.000 $ × 1) = 0,05 lot.' },
    { question: 'Lot büyüklüğü ile pozisyon büyüklüğü arasındaki fark nedir?', answer: 'Lot büyüklüğü standart kontrat sayısıdır (örn. 0,1 lot). Pozisyon büyüklüğü BTC veya USD cinsinden gerçek değerdir. Lot başına 1 BTC standart kontratta, 0,1 lot = 0,1 BTC pozisyon büyüklüğü.' },
    { question: 'Kaldıraç lot büyüklüğünü nasıl değiştirir?', answer: 'Kaldıraç, risk formülünden gelen önerilen lot büyüklüğünü değiştirmez — yalnızca ne kadar marj (teminat) gerektiğini değiştirir. 10x kaldıraçta 0,1 lotluk bir pozisyon 10 kat daha az marj gerektirir ancak USD cinsinden aynı riski taşır.' },
    { question: 'Bir başlangıç tüccarı hangi lot büyüklüğünü kullanmalı?', answer: 'Yeni başlayanlar mikro lotlarla (0,01) veya nano lotlarla (0,001) başlamalı ve işlem başına %1\'den fazla risk almamalıdır. Bu, ticaret becerilerinizi geliştirirken kayıpları sınırlar.' },
    { question: 'Farklı brokerların neden farklı lot büyüklükleri var?', answer: 'Forex brokerları (Exness, IC Markets) genellikle 0,01 minimumla standart lot başına 1 BTC kullanır. Kripto borsaları (Binance, Bybit) 0,001 minimuma izin verir. Delta Exchange kontrat başına 0,001 BTC kullanır.' },
    { question: 'Bitcoin vadeli işlemleri için lot büyüklüğü hesaplayıcı kullanabilir miyim?', answer: 'Evet. Bitcoin Lot Büyüklüğü Hesaplayıcımız hem forex CFD\'leri hem de kripto vadeli işlemleri için çalışır. Doğru kontrat büyüklüğünü otomatik olarak yapılandırmak için broker ön ayarınızı seçin.' },
  ],
  sections: [
    {
      id: 'lot-nedir',
      heading: 'Bitcoin Ticaretinde Lot Nedir?',
      content: 'Bir **lot**, [forex](https://www.investopedia.com/terms/l/lot.asp) ve türev piyasalarda kullanılan standartlaştırılmış bir işlem büyüklüğü birimidir. Bitcoin ticaretinde lot büyüklükleri, işlem başına ne kadar BTC alıp sattığınızı belirler.\n\nÇoğu MT4/MT5 forex brokerinde **1 standart lot Bitcoin = 1 BTC**. Bu, kripto para CFD\'leri için uyarlanmış geleneksel döviz çiftleri için kullanılan kurallarla aynıdır.\n\nLot büyüklüklerini anlamak **pozisyon büyüklüğü belirleme** için temeldir — hesap büyüklüğünüze ve risk toleransınıza dayanarak ne kadar işlem yapacağınızı belirleme süreci. Uygun lot büyüklüğü olmadan, iyi bir ticaret stratejisi bile başarısız olur çünkü tek bir aşırı büyük kayıp haftalarca kazanımı silebilir.'
    },
    {
      id: 'lot-turleri',
      heading: 'Standart, Mini, Mikro ve Nano Lotlar',
      content: 'Bitcoin lot büyüklükleri forex ile aynı hiyerarşiyi izler:\n\n| Lot Türü | Büyüklük | BTC Miktarı | Tipik Hesap Büyüklüğü |\n|---|---|---|---|\n| Standart | 1,0 lot | 1 BTC | 50.000 $+ |\n| Mini | 0,1 lot | 0,1 BTC | 10.000-50.000 $ |\n| Mikro | 0,01 lot | 0,01 BTC | 1.000-10.000 $ |\n| Nano | 0,001 lot | 0,001 BTC | 1.000 $\'ın altında |\n\nÇoğu perakende tüccar **mikro lotları** (0,01) temel birim olarak kullanır. Profesyonel tüccarlar ve kurumlar standart lot veya daha büyük işlem yapar.\n\nBitcoin birimleri ve dönüşümleri hakkında daha derin bir anlayış için [satoshi nedir](/tr/ogrenin/bitcoin-satoshi-nedir) rehberimize bakın.',
      cta: { calculatorId: 'bitcoin-lot-size', calculatorName: 'Bitcoin Lot Büyüklüğü Hesaplayıcısı', text: 'Ücretsiz risk tabanlı hesaplayıcımızla optimal lot büyüklüğünüzü hesaplayın', path: '/tr/hesaplayicilar/bitcoin-lot-buyuklugu' }
    },
    {
      id: 'formul',
      heading: 'Lot Büyüklüğü Formülü — Adım Adım',
      content: 'Risk tabanlı lot büyüklüğü için temel formül:\n\n**Lot Büyüklüğü = (Hesap Bakiyesi × Risk%) ÷ (USD cinsinden Stop Loss Mesafesi × Kontrat Büyüklüğü)**\n\nGerçek bir örnekle parçalayalım:\n\n• **Hesap Bakiyesi:** 10.000 $\n• **İşlem Başına Risk:** %2 = 200 $\n• **Giriş Fiyatı:** 85.000 $\n• **Stop Loss:** 83.000 $ (mesafe = 2.000 $)\n• **Kontrat Büyüklüğü:** 1 BTC/lot (standart)\n\n**Lot Büyüklüğü = 200 $ ÷ (2.000 $ × 1) = 0,1 lot**\n\nBu, 0,1 BTC (8.500 $) işlem yapacağınız anlamına gelir. Stop loss\'unuz tetiklenirse tam olarak 200 $ — hesabınızın %2\'sini kaybedersiniz.\n\nBu, **%1 kuralı** (veya %2 kuralı) olarak bilinir: hesap özsermayenizin %1-2\'sinden fazlasını tek bir işlemde asla riske atmayın.\n\nFormül 1x (spot), 5x veya 50x kaldıraçla işlem yapmanızdan bağımsız çalışır — çünkü risk hesaplaması kaldıraçlı pozisyon büyüklüğüne değil **gerçek dolar riskinize** dayanır.'
    },
    {
      id: 'kaldirac-etkisi',
      heading: 'Kaldıraç Lot Büyüklüğünüzü Nasıl Değiştirir',
      content: 'Yaygın bir yanılgı kaldıracın lot büyüklüğü önerinizi değiştirdiğidir. Değiştirmez. **Kaldıraç marj gereksiniminizi değiştirir, riskinizi değil.**\n\nYukarıdaki örneğimizi kullanarak (0,1 lot, 8.500 $ pozisyon):\n\n| Kaldıraç | Gereken Marj | Dolar Risk | Lot Büyüklüğü |\n|---|---|---|---|\n| 1x (kaldıraçsız) | 8.500 $ | 200 $ | 0,1 |\n| 5x | 1.700 $ | 200 $ | 0,1 |\n| 10x | 850 $ | 200 $ | 0,1 |\n| 50x | 170 $ | 200 $ | 0,1 |\n\nLot büyüklüğü aynı kalır çünkü riskiniz (stop loss\'ta 200 $) kaldıraçla değişmez.\n\nKaldıracın tehlikesi, risk kurallarınızın izin verdiğinden daha büyük pozisyonlar açmanıza *imkân vermesidir*. 50x kaldıraçla, sadece 8.500 $ marjla 5 lot pozisyon *açabilirsiniz* — ancak 2.000 $\'lık bir fiyat hareketi size 10.000 $\'a mal olur, hesabınızı siler.\n\n**Lot büyüklüğünü her zaman önce risk parametrelerinizden hesaplayın, sonra yeterli marjınız olup olmadığını kontrol edin.** Detaylı kaldıraç riski analizi için [Kaldıraç Tasfiye Hesaplayıcımızı](/tr/hesaplayicilar/bitcoin-tasfiye) kullanın.\n\nDaha fazla kaldıraç riski için tam rehberimizi okuyun: [Bitcoin Kaldıraçlı İşlem Riskleri](/tr/ogrenin/bitcoin-kaldirac-ticareti-riskleri).'
    },
    {
      id: 'broker-ozellikleri',
      heading: 'Brokere Göre Lot Büyüklüğü (MT4/MT5 Kontrat Özellikleri)',
      content: 'Kontrat özellikleri brokerlar ve platformlar arasında değişir. BTCUSD için en yaygın yapılandırmalar:\n\n| Broker | Kontrat Büyüklüğü | Min Lot | Maks Kaldıraç | Platform |\n|---|---|---|---|---|\n| Exness | 1 BTC | 0,01 | 1:400 | MT4/MT5 |\n| IC Markets | 1 BTC | 0,01 | 1:200 | MT4/MT5 |\n| Bybit | 1 BTC (USD-M) | 0,001 | 1:100 | Tescilli |\n| Binance | 1 BTC (BTCUSDT) | 0,001 | 1:125 | Tescilli |\n| Delta Exchange | 0,001 BTC | 1 kontrat | 1:100 | Tescilli |\n\n**Önemli notlar:**\n• Bybit COIN-M kontratları farklı bir hesaplama kullanır — USD ile veya coin ile teminatlandırılan sürekli işlemler yaptığınızı her zaman kontrol edin\n• Binance kademeli bakım marjı kullanır — daha yüksek pozisyonlar daha düşük maks kaldıraç gerektirir\n• Delta Exchange Hindistan\'da popülerdir ve kontrat başına 0,001 BTC ile INR cinsinden kontratlar kullanır\n\nHesaplayıcımız tüm bu brokerlar için ön ayarlar içerir.'
    },
    {
      id: 'hatalar',
      heading: 'Yaygın Hatalar: BTC\'de Aşırı Kaldıraç Kullanma',
      content: 'Bitcoin ticaretinde en yaygın lot büyüklüğü hataları:\n\n**1. Sabit lot büyüklükleri kullanmak.** Stop loss mesafesinden bağımsız olarak her işlemde 0,1 lot işlem yapmak, riskinizin çılgınca değiştiği anlamına gelir.\n\n**2. Kontrat büyüklüğü farklılıklarını yok saymak.** Exness\'ten (1 BTC/lot) Delta Exchange\'e (0,001 BTC/kontrat) ayarlama yapmadan geçmek, pozisyonunuzun amaçlanandan 1000 kat daha küçük olduğu anlamına gelir.\n\n**3. İşlem başına çok fazla risk almak.** İşlem başına %5-10 risk almak, 3-5 ardışık kaybın (iyi stratejilerde bile yaygın) hesabınızı yarıya indirebileceği anlamına gelir. [Kelly Kriteri](https://en.wikipedia.org/wiki/Kelly_criterion) optimal bahis büyüklüğünün genellikle tüccarların beklediğinden *çok* daha küçük olduğunu önerir.\n\n**4. Lot büyüklüğünü pozisyon büyüklüğüyle karıştırmak.** 0,1 lot birim sayısıdır. 0,1 BTC pozisyon büyüklüğüdür. Sadece kontrat büyüklüğü 1 BTC olduğunda eşdeğerdirler.\n\n**5. Ücretleri ve fonlamayı hesaba katmamak.** Kaldıraçlı pozisyonlarda işlem ücretleri sadece marjınız üzerinden değil *tam pozisyon büyüklüğü üzerinden* tahsil edilir.\n\nDetaylı ticaret maliyetleri analizi için [Bitcoin işlem ücretleri](/tr/ogrenin/bitcoin-islem-ucretleri-aciklamasi) rehberimize bakın.',
      cta: { calculatorId: 'profit-loss', calculatorName: 'Kâr & Zarar Hesaplayıcısı', text: 'Ücretler ve komisyonlar dahil gerçek işlem K/Z\'nizi hesaplayın', path: '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi' }
    },
    {
      id: 'lot-vs-pozisyon',
      heading: 'Lot Büyüklüğü vs Pozisyon Büyüklüğü — Fark Nedir?',
      content: '**Lot büyüklüğü** ve **pozisyon büyüklüğü** ilişkili ancak farklı kavramlardır:\n\n• **Lot büyüklüğü** = standart kontrat sayısı (örn. 0,5 lot)\n• **Pozisyon büyüklüğü** = varlığın gerçek miktarı (örn. 0,5 BTC) veya USD değeri (42.500 $)\n\nİlişki: **Pozisyon Büyüklüğü (BTC) = Lot Büyüklüğü × Kontrat Büyüklüğü**\n\n1 lot = 1 BTC olan standart forex brokerleriyle sayılar aynıdır. Ancak standart olmayan kontrat büyüklüklerine sahip platformlarda (Delta Exchange gibi 1 kontrat = 0,001 BTC), önemli ölçüde farklılaşırlar.\n\nİşlemleri tartışırken:\n• *"0,5 lot long\'um"* = broker/platforma özgü\n• *"0,5 BTC long\'um"* = evrensel ve net\n• *"42.500 $ maruziyetim var"* = değer tabanlı, risk değerlendirmesi için en yararlı\n\nProfesyonel risk yöneticileri genellikle lot büyüklüklerinden ziyade **işlem başına dolar risk** olarak düşünür.'
    },
  ],
  howToSteps: [
    { name: 'Hesap bakiyenizi belirleyin', text: 'Toplam ticaret sermayenizi bilin — tüm pozisyon büyüklüğü hesaplamaları için temel budur' },
    { name: 'Risk yüzdenizi belirleyin', text: 'İşlem başına ne kadar hesabınızı riske atacağınıza karar verin — çoğu tüccar için %1-2 önerilir' },
    { name: 'Stop loss seviyenizi belirleyin', text: 'Lot büyüklüğünü hesaplamadan önce teknik analize dayalı stop loss fiyatınızı belirleyin' },
    { name: 'Broker\'ınızın kontrat büyüklüğünü kontrol edin', text: 'Brokerınızda 1 lot = 1 BTC, 0,1 BTC veya 0,001 BTC olup olmadığını doğrulayın' },
    { name: 'Lot büyüklüğü formülünü uygulayın', text: 'Lot Büyüklüğü = (Hesap Bakiyesi × Risk%) ÷ (Stop Loss Mesafesi × Kontrat Büyüklüğü)' },
    { name: 'Marj gereksinimlerini doğrulayın', text: 'Seçtiğiniz kaldıraç düzeyinde hesaplanan lot büyüklüğü için yeterli marjınız olduğundan emin olun' },
  ],
};

export default article;
