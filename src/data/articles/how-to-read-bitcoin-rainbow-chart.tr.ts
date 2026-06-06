import { Article } from '../articles';

/** TR counterpart of `how-to-read-bitcoin-rainbow-chart` → `/tr/ogrenin/bitcoin-gokkusagi-grafigi-nasil-okunur`. */
const article: Article = {
  slug: 'bitcoin-gokkusagi-grafigi-nasil-okunur',
  title: 'Bitcoin Gökkuşağı Grafiği ve 9 Bandı Nasıl Okunur',
  metaDescription: 'Bitcoin Gökkuşağı Grafiği\'ndeki her bandın anlamını — Yangın İndirimi\'nden Balon Bölgesi\'ne — ve uzun vadeli değerleme sinyallerini nasıl yorumlayacağınızı öğrenin.',
  category: 'Market Analysis',
  publishedDate: '2026-03-09',
  updatedDate: '2026-05-18',
  readingTime: 7,
  keywords: ['bitcoin gökkuşağı grafiği nasıl okunur', 'bitcoin rainbow chart', 'bitcoin gökkuşağı bandları', 'bitcoin logaritmik regresyon', 'bitcoin değerleme bantları'],
  relatedCalculators: ['rainbow-chart', 'dca', 'fear-greed-index', 'power-law'],
  relatedArticles: ['bitcoin-guc-yasasi-aciklamasi', 'korku-acgozluluk-endeksi-nedir', 'bitcoin-dca-vs-toplu-yatirim'],
  faqs: [
    { question: 'Bitcoin Gökkuşağı Grafiği ne kadar doğrudur?', answer: 'Gökkuşağı Grafiği 2017\'den bu yana piyasa uç noktalarını tanımlamada oldukça doğru olmuştur. 2017 zirvesini "FOMO yoğunlaşıyor" bandında ve 2018-2019 dibini "Yangın İndirimi" bölgesinde doğru şekilde tanımladı. Ancak Bitcoin son zamanlarda uç bantlarda daha az zaman geçiriyor.' },
    { question: '"Yangın İndirimi" bölgesinde Bitcoin ne anlama gelir?', answer: '"Yangın İndirimi" bandı (koyu kırmızı/menekşe) logaritmik regresyon modeline göre aşırı düşük değerlemeyi temsil eder. Tarihsel olarak Bitcoin bu bölgede nadiren birkaç aydan fazla kalmış, bu da onu mükemmel bir uzun vadeli alım fırsatı yapar. 2022 ayı piyasası Bitcoin\'i kısa süreliğine Yangın İndirimi bandına yaklaştırdı (~15.500 $).' },
    { question: 'Bitcoin Gökkuşağı Grafiği ne sıklıkla güncellenir?', answer: 'Gökkuşağı Grafiği, Bitcoin\'in fiyatı değiştikçe gerçek zamanlı güncellenir, ancak bantları tanımlayan altta yatan logaritmik regresyon modeli periyodik olarak yeniden hesaplanır. Bantların kendisi yeni fiyat verisi regresyon çizgisini uzattıkça yıllar içinde yavaşça evrilir.' },
    { question: 'Gökkuşağı Grafiği ile Güç Yasası arasındaki fark nedir?', answer: 'Her ikisi de logaritmik regresyon kullanır ancak farklı metodolojilerle. Gökkuşağı Grafiği tek bir trend çizgisi etrafında renkli bantlar oluştururken, [Bitcoin Güç Yasası](/tr/ogrenin/bitcoin-guc-yasasi-aciklamasi) destek ve direnç koridorları olan daha karmaşık bir matematiksel model kullanır.' }
  ],
  howToSteps: [
    { name: 'Logaritmik ölçeği anlayın', text: 'Gökkuşağı Grafiği her iki eksende log ölçek kullanır çünkü Bitcoin\'in büyümesi üsteldir. Doğrusal bir grafik 0,01 $\'dan 100.000 $+\'a Bitcoin\'in fiyat aralığında okunması imkânsız olur.' },
    { name: 'Mevcut fiyat bandını tanımlayın', text: 'Bitcoin\'in mevcut fiyatını grafikte bulun ve hangi renk bandını işgal ettiğini görün. Her bant "Yangın İndirimi" (koyu kırmızı) ile "Maksimum Balon Bölgesi" (koyu kırmızı) arasında farklı bir piyasa duyarlılığını temsil eder.' },
    { name: 'Renk anlamlarını yorumlayın', text: 'Soğuk renkler (mavi, yeşil) Bitcoin\'in düşük değerli ve almak için iyi olduğunu önerir. Sıcak renkler (turuncu, kırmızı) dikkat ve olası aşırı değerleme önerir.' },
    { name: 'DCA zamanlama ayarları için kullanın', text: 'Günlük ticaret için yeterince hassas olmasa da, Gökkuşağı Grafiği dolar maliyet ortalamasını optimize etmeye yardımcı olur. Mavi/yeşil bantlarda daha agresif alın, kırmızı bantlarda alımları azaltın.' },
    { name: 'Diğer göstergelerle birleştirin', text: 'Asla sadece Gökkuşağı Grafiği\'ne güvenmeyin. Kapsamlı piyasa analizi için Korku & Açgözlülük Endeksi, zincir üzeri metrikler ve Güç Yasası modeliyle birleştirin.' }
  ],
  sections: [
    {
      id: 'gokkusagi-nedir',
      heading: 'Gökkuşağı Grafiği Nedir',
      content: '**Bitcoin Gökkuşağı Grafiği**, renkli fiyat bantları spektrumu kullanarak **piyasa zirvesi ve dip sinyallerini** tanımlamaya çalışan bir [logaritmik regresyon](https://en.wikipedia.org/wiki/Logarithmic_scale) modelidir. 2014\'te Reddit kullanıcısı "azop" tarafından oluşturuldu ve [Blockchaincenter.net](https://www.blockchaincenter.net/en/bitcoin-rainbow-chart/) tarafından geliştirildi.\n\nGrafik, Bitcoin\'in fiyat tarihini farklı değerleme seviyelerini temsil eden renkli bantlarla **logaritmik ölçekte** çizer:\n\n• **Koyu Mavi/Menekşe** ("Yangın İndirimi"): Aşırı düşük değerleme, tarihsel olarak harika alım fırsatları\n• **Mavi/Yeşil** ("Biriktir"): Adil değerin altında, kademeli birikim için iyi\n• **Sarı/Turuncu** ("HODL"): Adil değer bölgesi, mevcut pozisyonları tutun\n• **Kırmızı/Koyu Kırmızı** ("FOMO/Balon"): Aşırı değerleme, kâr almayı düşünün\n\nAltta yatan teori, Bitcoin\'in uzun vadeli büyümesinin matematiksel olarak modellenebilecek **öngörülebilir üstel bir trendi** izlediğidir.\n\nGeleneksel teknik analizden farklı olarak, Gökkuşağı Grafiği **uzun vadeli yatırımcılar** için tasarlanmıştır ve ay ila yıl zaman dilimlerinde en iyi şekilde çalışır.',
      cta: { calculatorId: 'rainbow-chart', calculatorName: 'Gökkuşağı Grafiği Hesaplayıcısı', text: 'Mevcut bantlarla canlı Bitcoin Gökkuşağı Grafiği\'ni görüntüleyin', path: '/tr/hesaplayicilar/bitcoin-gokkusagi-grafigi' }
    },
    {
      id: 'bantlar-matematigi',
      heading: 'Bantların Arkasındaki Matematik',
      content: 'Bitcoin Gökkuşağı Grafiği, Bitcoin\'in 2009\'dan beri fiyat tarihinin **logaritmik regresyonu** üzerine kuruludur.\n\n**1. Logaritmik Regresyon Çizgisi:**\nMerkez trend çizgisi şu formülle hesaplanır: **log(Fiyat) = a × log(Genesis\'ten Beri Geçen Gün) + b**\n\n**2. Bant Oluşturma:**\nHer renkli bant merkezi regresyon çizgisinden bir **standart sapma** veya yüzde mesafesini temsil eder:\n\n• Yangın İndirimi: Regresyon çizgisi × 0,1-0,3\n• Biriktirme Bantları: Regresyon çizgisi × 0,5-0,8\n• Adil Değer: Regresyon çizgisi × 1,0\n• FOMO Bantları: Regresyon çizgisi × 2-5\n• Balon Bölgesi: Regresyon çizgisi × 8-15\n\n**3. Logaritmik Ölçek Neden Önemli:**\nBitcoin\'in büyümesi **üsteldir**, doğrusal değildir. 1 $\'dan 10 $\'a hareket, 10.000 $\'dan 100.000 $\'a hareket ile aynı **yüzde kazancı** (%900) temsil eder.\n\nMatematiksel zarafet, bantların **zamanla genişlemesidir** — 2013\'te 1.000 $\'da "balon" olarak kabul edilen şey 2020\'ye gelindiğinde "yangın indirimi" seviyesi haline gelir.'
    },
    {
      id: 'renk-bant-anlamlari',
      heading: 'Renk Bantlarının Anlamları',
      content: 'Gökkuşağı Grafiği\'ndeki her renk Bitcoin yatırımcıları için farklı bir **risk-ödül senaryosunu** temsil eder:\n\n| Renk Bandı | Fiyat Aralığı | Piyasa Duyarlılığı | Eylem | Tarihsel Örnekler |\n|------------|-------------|------------------|--------|-----------------|\n| **Maksimum Balon** (Koyu Kırmızı) | Trendin 10x+ üstü | Aşırı öfori | Sat/Kâr al | Hiç ulaşılmadı |\n| **FOMO Yoğunlaşıyor** (Kırmızı) | Trendin 5-10x üstü | Zirve spekülasyon | Güçlü sat sinyali | Kas 2017 (~19K$), Kas 2021 (~69K$) |\n| **FOMO** (Turuncu/Kırmızı) | Trendin 2-5x üstü | Aşırı değerleme | Satmayı düşün | Birden fazla 2017/2021 zirvesi |\n| **Bu Bir Balon mu?** (Turuncu) | Trendin 1,5-2x üstü | Pahalılaşıyor | Tut, pozisyonları kırp | 2017 başı, 1Ç 2021 |\n| **HODL!** (Sarı) | Trendin 0,8-1,5x | Adil değer | Pozisyonları tut | 2019-2020\'nin çoğu |\n| **Hâlâ Ucuz** (Yeşil) | Trendin 0,5-0,8x | Adil değerin altında | İyi alım bölgesi | 2020 başı, 2022 ortası |\n| **Biriktir** (Mavi) | Trendin 0,3-0,5x | Düşük değerli | Güçlü alım sinyali | 2018-2019 ayı piyasası |\n| **AL!** (Koyu Mavi) | Trendin 0,1-0,3x | Aşırı düşük değerleme | Maksimum alım sinyali | Mart 2020 çöküşü |\n| **Yangın İndirimi** (Menekşe) | <0,1x trend | Tarihi fırsat | Tamamen alım | Kısaca 2022\'de |\n\nKilit içgörü: Bitcoin **kırmızı bantlarda hiçbir zaman uzun süre kalmadı** ve **mavi bantlardan her zaman toparlandı**. Bu, Gökkuşağı Grafiği\'ni [Dolar Maliyet Ortalama](/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi) stratejileri için özellikle yararlı kılar.'
    },
    {
      id: 'tarihsel-dogruluk',
      heading: 'Tarihsel Doğruluk',
      content: 'Bitcoin Gökkuşağı Grafiği\'nin son on yıldaki sicili etkileyici olmuştur, özellikle **büyük piyasa dönüm noktalarını** belirlemede:\n\n**Başarılı Zirve Çağrıları:**\n• **Aralık 2017**: Bitcoin "FOMO Yoğunlaşıyor" kırmızı bandında 19.783 $\'da zirve yaptı\n• **Kasım 2021**: Bitcoin aynı kırmızı bantta 69.044 $\'da zirve yaptı\n\n**Başarılı Dip Çağrıları:**\n• **Aralık 2018**: Bitcoin mavi "Biriktir" bölgesinde ~3.200 $\'da dip yaptı\n• **Mart 2020**: COVID çöküşü Bitcoin\'i 3.800 $\'a indirdi, kısaca koyu mavi "AL!" bandına dokundu\n• **Kasım 2022**: Bitcoin\'in döngü dibi ~15.500 $ kısaca menekşe "Yangın İndirimi" bölgesine girdi\n\n**Doğruluk metrikleri:**\n• **Zirve tanımlama**: Kırmızı bölgelerde büyük zirveler için %85-90 başarı oranı\n• **Dip tanımlama**: Mavi bölgelerde büyük dipler için %95+ başarı oranı\n\nGrafiğin ana sınırlaması **zamanlama hassasiyetidir** — Bitcoin\'in aşırı veya düşük değerli olduğunu tanımlayabilir, ancak tersine dönüşlerin tam olarak ne zaman gerçekleşeceğini değil.'
    },
    {
      id: 'dca-zamanlama',
      heading: 'DCA Zamanlaması İçin Nasıl Kullanılır',
      content: 'Gökkuşağı Grafiği günlük ticaret için tasarlanmamıştır ancak **Dolar Maliyet Ortalama (DCA) stratejilerini optimize etmek** için mükemmeldir:\n\n**Gökkuşağı DCA Stratejisi:**\n\n• **Yangın İndirimi/Koyu Mavi Bantlar**: **Normal DCA tutarınızı üçe katlayın**\n• **Mavi/Yeşil Bantlar**: **DCA\'yı %50 artırın**\n• **Sarı Bant**: **Normal DCA programını koruyun**\n• **Turuncu Bantlar**: **DCA\'yı %50 azaltın**\n• **Kırmızı Bantlar**: **DCA\'yı duraklatın, kâr almayı düşünün**\n\n**Örnek Uygulama:**\nNormal DCA: 500 $/ay\n• Yangın İndirimi: 1.500 $/ay\n• Mavi/Yeşil: 750 $/ay\n• Sarı: 500 $/ay\n• Turuncu: 250 $/ay\n• Kırmızı: 0 $/ay (veya sat)\n\nTarihsel **geri test sonuçları** (2017-2026), Gökkuşağı ayarlı DCA stratejilerinin sabit DCA\'dan %20-40 daha iyi performans gösterdiğini gösteriyor.',
      cta: { calculatorId: 'dca', calculatorName: 'DCA Hesaplayıcısı', text: 'Gökkuşağı ayarlı DCA stratejinizi planlayın', path: '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' }
    },
    {
      id: 'sinirlamalar',
      heading: 'Sınırlamalar ve Uyarılar',
      content: 'Gökkuşağı Grafiği oldukça doğru olsa da, yatırımcıların anlaması gereken önemli sınırlamaları vardır:\n\n**Model Varsayımları:**\n• **Sürekli üstel büyüme varsayar**: Bitcoin\'in uzun vadeli benimseme eğrisi düzleşirse model bozulur\n• **Sınırlı veriye dayanır**: Yalnızca 17 yıllık fiyat geçmişi\n• **Ortalamaya dönüş**: Bitcoin\'in her zaman trend çizgisine döneceğini varsayar\n\n**Piyasa Yapısı Değişiklikleri:**\n• **Kurumsal benimseme**: ETF\'ler, kurumsal hazineler ve kurumsal altyapı oynaklığı azalttı\n• **Uç noktalarda daha az zaman**: Bitcoin piyasalar olgunlaştıkça kırmızı/mavi bantlarda daha az zaman geçiriyor\n\n**Teknik Sınırlamalar:**\n• **Geciken gösterge**: Tarihsel verilere dayanır, kara kuğu olaylarını öngöremez\n• **Zamanlama hassasiyeti yok**: Aşırı değerlemeyi tanımlayabilir ancak düzeltmelerin ne zaman olacağını değil\n\n**En İyi Uygulamalar:**\n• **Asla tek başına kullanmayın** — [Korku & Açgözlülük Endeksi](/tr/hesaplayicilar/bitcoin-korku-acgozluluk), zincir üzeri metrikler ve [Güç Yasası modeli](/tr/hesaplayicilar/bitcoin-guc-yasasi) ile birleştirin\n• **Kesin bantlara değil, bölgelere odaklanın**\n• **Model evrimini bekleyin**',
      cta: { calculatorId: 'rainbow-chart', calculatorName: 'Gökkuşağı Grafiği Hesaplayıcısı', text: 'Bitcoin\'in mevcut gökkuşağı konumunu analiz edin', path: '/tr/hesaplayicilar/bitcoin-gokkusagi-grafigi' }
    }
  ]
};

export default article;
