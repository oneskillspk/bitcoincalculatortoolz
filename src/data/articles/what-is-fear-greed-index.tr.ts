import { Article } from '../articles';

const article: Article = {
  slug: 'korku-acgozluluk-endeksi-nedir',
  title: 'Bitcoin Korku ve Açgözlülük Endeksi: Nedir ve Nasıl Çalışır?',
  metaDescription: 'Bitcoin Korku ve Açgözlülük Endeksi piyasa duyarlılığını 0 (Aşırı Korku) ile 100 (Aşırı Açgözlülük) arasında ölçer. Skorun nasıl hesaplandığını ve trader\'ların nasıl kullandığını öğrenin.',
  category: 'Market Analysis',
  publishedDate: '2026-01-25',
  updatedDate: '2026-05-18',
  readingTime: 6,
  keywords: ['korku ve açgözlülük endeksi', 'bitcoin duyarlılık', 'kripto korku açgözlülük', 'piyasa duyarlılık göstergesi'],
  relatedCalculators: ['fear-greed-index', 'what-if', 'dca'],
  relatedArticles: ['bitcoin-altin-sp500-karsilastirma', 'bitcoin-dca-vs-toplu-yatirim', 'bitcoin-hodl-stratejisi-aciklamasi'],
  faqs: [
    { question: 'İyi bir Korku ve Açgözlülük skoru nedir?', answer: '25\'in altındaki skorlar "Aşırı Korku" (potansiyel iyi alım fırsatları), 75\'in üzerindeki skorlar ise "Aşırı Açgözlülük" (potansiyel aşırı ısınmış piyasa) anlamına gelir. Kontrarian yatırımcılar genelde korku döneminde alır, açgözlülük döneminde kâr realize eder.' },
    { question: 'Korku ve Açgözlülük Endeksi nasıl hesaplanır?', answer: 'Birden fazla veri kaynağını birleştirir: fiyat oynaklığı (%25), piyasa momentumu/hacmi (%25), sosyal medya duyarlılığı (%15), Bitcoin dominansı (%10) ve Google Trends (%10). Skor 0 (aşırı korku) ile 100 (aşırı açgözlülük) arasındadır.' },
    { question: 'Endeks korku gösterirken Bitcoin almalı mıyım?', answer: 'Tarihsel olarak aşırı korku dönemlerinde alım yapmak ortalamanın üzerinde getiriler üretmiştir. Ancak endeks, karar verirken kullandığınız tek faktör değil, birçok faktörden biri olmalıdır.' },
  ],
  sections: [
    { id: 'genel-bakis', heading: 'Piyasa Duyarlılığını Anlamak', content: 'Bitcoin Korku ve Açgözlülük Endeksi, kripto piyasasının genel duygusal durumunu 0–100 ölçeğinde günlük olarak ölçen bir metriktir. Geleneksel borsalar için kullanılan [CNNMoney Korku ve Açgözlülük Endeksi](https://en.wikipedia.org/wiki/Greed_and_fear)\'nden esinlenmiştir.\n\nÖncülü basit ama güçlüdür: **yatırımcılar korktuğunda piyasalar genelde değerinin altında, açgözlü olduklarında değerinin üstündedir.** Warren Buffett\'ın meşhur sözüyle: "Başkaları açgözlü olduğunda korkun, başkaları korktuğunda açgözlü olun." Bu endeks o ilkeyi Bitcoin için sayısallaştırır. Piyasa psikolojisi için [Investopedia\'nın piyasa duyarlılığı rehberine](https://www.investopedia.com/terms/m/marketsentiment.asp) ve [Alternative.me Korku ve Açgözlülük Endeksi](https://alternative.me/crypto/fear-and-greed-index/)\'ne bakabilirsiniz.' },
    { id: 'bilesenler', heading: 'Endeks Nasıl Hesaplanır', content: 'Korku ve Açgözlülük Endeksi birden fazla kaynaktan veri toplar:\n\n**Oynaklık (%25):** Mevcut Bitcoin oynaklığını ve maksimum düşüşleri 30 ve 90 günlük ortalamalarla karşılaştırır. Olağandışı oynaklık korkuyu artırır.\n\n**Piyasa Momentumu/Hacmi (%25):** Mevcut işlem hacmini tarihsel ortalamalara göre ölçer. Fiyat artışları sırasında yüksek alım hacmi açgözlülük sinyali verir.\n\n**Sosyal Medya (%15):** Twitter/X paylaşım hacmini, hashtag aktivitesini ve Bitcoin ile ilgili tartışmaların duyarlılığını analiz eder.\n\n**Bitcoin Dominansı (%10):** Yükselen BTC dominansı korkuya işaret eder (yatırımcılar altcoin\'lerden güvenliğe kaçar). Düşen dominans açgözlülüğe işaret eder (riskli altcoin\'lerde spekülasyon).\n\n**Google Trends (%10):** Bitcoin ile ilgili arama hacmini takip eder. "Bitcoin çöküşü" gibi aramalardaki ani artış korkuya, "bitcoin al" aramalarındaki artış ise açgözlülüğe işaret eder.', cta: { calculatorId: 'fear-greed-index', calculatorName: 'Bitcoin Korku ve Açgözlülük Endeksi', text: 'Bugünkü Bitcoin Korku ve Açgözlülük skorunu canlı olarak görün', path: '/tr/hesaplayicilar/bitcoin-korku-acgozluluk' } },
    { id: 'skor-araliklari', heading: 'Skor Aralıkları Açıklaması', content: '• **0–24: Aşırı Korku** — Yatırımcılar çok endişeli. Tarihsel olarak bu sıklıkla alım fırsatıdır.\n• **25–49: Korku** — Piyasa duyarlılığı temkinli. Fiyatlar adil değerin altında olabilir.\n• **50: Nötr** — Belirgin bir duygusal yön yoktur.\n• **51–74: Açgözlülük** — Yatırımcılar iyimser olmaya başlar. Piyasa adil değere yaklaşıyor veya pahalanıyor olabilir.\n• **75–100: Aşırı Açgözlülük** — Piyasa öforisi. Fiyatlar aşırı uzamış olabilir ve düzeltme olasılığı artar.\n\nEndeks tarihsel olarak en çok 30–70 aralığında kalmıştır; uç değerler (20\'nin altı veya 80\'in üstü) görece nadirdir ve genellikle önemli piyasa dönüm noktalarını işaret eder.' },
    { id: 'stratejide-kullanim', heading: 'Endeksi Stratejinizde Nasıl Kullanırsınız', content: 'Korku ve Açgözlülük Endeksi en iyi **kontrarian gösterge** ve **duygusal disiplin aracı** olarak kullanılır — bir alım/satım sinyali olarak değil.\n\n**[DCA](/tr/ogrenin/bitcoin-dca-nedir) yatırımcıları için:** Düzenli alımlarınıza veri destekli "dip alımı" eklemek için aşırı korku okumalarını kullanın.\n\n**Aktif trader\'lar için:** Aşırı açgözlülük okumaları kısmi kâr realizasyonu veya stop-loss\'u sıkılaştırma sinyali olabilir.\n\n**[HODLer\'lar için](/tr/ogrenin/bitcoin-hodl-stratejisi-aciklamasi):** Endeks, fiyatların neden hareket ettiğine bağlam sağlar. Duyarlılığı anlamak korku zirvelerinde panik satışı önlemenize yardımcı olur.\n\n**Önemli uyarı:** Endeks haftalarca, hatta aylarca uç bölgede kalabilir. "Aşırı açgözlülük" anında çöküş demek değildir, "aşırı korku" da anında ralli demek değildir.' },
  ],
  howToSteps: [
    { name: 'Korku ve Açgözlülük aracını ziyaret edin', text: 'En güncel skor için Bitcoin Korku ve Açgözlülük Endeksi sayfamızı açın' },
    { name: 'Güncel skoru kontrol edin', text: 'Bugünkü duyarlılık okumasını 0–100 ölçeğinde görün' },
    { name: 'Tarihsel bağlamı inceleyin', text: 'Bugünkü okumayı geçmiş skorlar ve fiyat hareketiyle karşılaştırın' },
    { name: 'Stratejinize katın', text: 'Duyarlılık verisini diğer analiz araçlarınızın yanında kullanın' },
  ],
  speakable: true,
};

export default article;
