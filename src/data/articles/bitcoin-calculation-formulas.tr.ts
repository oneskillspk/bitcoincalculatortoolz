import { Article } from '../articles';

/** TR counterpart of `bitcoin-calculation-formulas` → `/tr/ogrenin/bitcoin-hesaplama-formulleri`. */
const article: Article = {
  slug: 'bitcoin-hesaplama-formulleri',
  title: 'Bitcoin Hesaplama Formülleri: Her Aracın Arkasındaki Matematik',
  metaDescription: 'Bitcoin kâr, DCA, madencilik ROI, Güç Yasası, vergi ve CAGR\'ın arkasındaki tam formüller — bu sitedeki her hesaplayıcı için adım adım örneklerle.',
  category: 'Basics',
  publishedDate: '2026-03-07',
  updatedDate: '2026-05-18',
  readingTime: 10,
  keywords: ['bitcoin hesaplama formülü', 'bitcoin hesaplayıcı nedir', 'bitcoin hesaplamaları', 'kripto hesaplayıcı', 'bitcoin dolar dönüştürücü', 'bitcoin kâr formülü', 'bitcoin dca formülü'],
  relatedCalculators: ['profit-loss', 'dca', 'mining-profitability', 'power-law', 'capital-gains-tax', 'bitcoin-converter', 'bitcoin-lot-size'],
  relatedArticles: ['bitcoin-hesaplayici-karsilastirma', 'bitcoin-kar-zarar-nasil-hesaplanir', 'bitcoin-dca-nedir', 'bitcoin-madencilik-karliligi-2026', 'bitcoin-guc-yasasi-aciklamasi', 'bitcoin-vergi-rehberi-sermaye-kazanci', 'bitcoin-lot-buyuklugu-nasil-hesaplanir'],
  faqs: [
    { question: 'Bitcoin kârını hesaplamak için hangi formül kullanılır?', answer: 'Bitcoin kârı şu şekilde hesaplanır: Kâr = (Satış Fiyatı - Alış Fiyatı) × BTC Miktarı - Toplam Komisyonlar. Bu hem fiyat farkını hem de alış ve satış taraflarındaki borsa işlem komisyonlarını kapsar.' },
    { question: 'Bitcoin madencilik kârlılığı nasıl hesaplanır?', answer: 'Madencilik kârı şu şekilde hesaplanır: Günlük Kâr = (Hash Hızınız ÷ Ağ Hash Hızı) × Günlük Blok Ödülü × BTC Fiyatı - Günlük Elektrik Maliyeti. Bu, enerji giderleri sonrası net geliri verir.' },
    { question: 'Bitcoin Güç Yasası formülü nedir?', answer: 'Bitcoin Güç Yasası, uzun vadeli fiyatı şöyle modeller: Fiyat = 10^(5,84 × log₁₀(genesis\'ten sonraki günler) - 17,3). Bu regresyon formülü, Bitcoin\'in tarihsel fiyatına log-log ölçekte yüksek R² doğrulukla uyar.' },
    { question: 'Bitcoin\'i dolara nasıl çevirirsiniz?', answer: 'Bitcoin\'i USD\'ye çevirmek için: USD Değeri = BTC Miktarı × Mevcut BTC Fiyatı. Örneğin 0,5 BTC × 100.000 $/BTC = 50.000 $. Dönüştürücümüz canlı piyasa verisini kullanarak gerçek zamanlı günceller.' },
  ],
  sections: [
    {
      id: 'bitcoin-hesaplayici-nedir',
      heading: 'Bitcoin Hesaplayıcı Nedir?',
      content: 'Bitcoin hesaplayıcı, Bitcoin ile ilgili finansal hesaplamalar yapan herhangi bir araçtır — basit fiyat dönüşümlerinden karmaşık yatırım projeksiyonlarına. Bu hesaplayıcılar yatırımcılara "Bitcoin\'imin değeri ne?", "satarsam kârım ne olur?" ve "100 $ ile ne kadar Bitcoin alabilirim?" gibi soruları cevaplamasında yardımcı olur.\n\nGeleneksel finans hesaplayıcılarından farklı olarak, Bitcoin hesaplayıcıları kripto paranın kendine özgü özelliklerini hesaba katmalıdır: aşırı volatilite, 7/24 işlem, 8 ondalık basamağa kadar bölünebilirlik (satoshi) ve [21 milyon coin\'lik](https://en.wikipedia.org/wiki/Bitcoin) sabit arz tavanı. Temel matematik, [bileşik faiz](https://www.investopedia.com/terms/c/compoundinterest.asp) ve yatırım getirisi gibi standart finansal formüllerden yararlanır.\n\nAşağıda, en yaygın Bitcoin hesaplamalarının arkasındaki tam matematiksel formülleri parçalıyoruz, böylece sayıların tam olarak nasıl üretildiğini anlıyorsunuz.',
    },
    {
      id: 'kar-zarar-formulu',
      heading: 'Bitcoin Kâr/Zarar Formülü',
      content: 'En temel Bitcoin hesaplaması kâr ve zarardır:\n\n**Formül:** Kâr = (Satış Fiyatı - Alış Fiyatı) × BTC Miktarı - Toplam Komisyonlar\n\n**Örnek:** 0,5 BTC\'yi 40.000 $\'dan aldınız ve her iki tarafta %0,1 komisyonla 100.000 $\'a sattınız.\n• Alış maliyeti: 0,5 × 40.000 $ = 20.000 $ + 20 $ komisyon = 20.020 $\n• Satış geliri: 0,5 × 100.000 $ = 50.000 $ - 50 $ komisyon = 49.950 $\n• Net Kâr: 49.950 $ - 20.020 $ = **29.930 $**\n• ROI: (29.930 $ ÷ 20.020 $) × 100 = **%149,5**\n\nFarklı fiyatlardan birden fazla alım için ağırlıklı ortalama maliyet temeliniz: **Ortalama Fiyat = Toplam Harcanan USD ÷ Toplam BTC Alınan**. [Dolar maliyet ortalaması](/tr/ogrenin/bitcoin-dca-nedir) yapıyorsanız bu, doğru kâr hesabı için şarttır.',
      cta: { calculatorId: 'profit-loss', calculatorName: 'Bitcoin Kâr & Zarar Hesaplayıcı', text: 'Komisyonlar sonrası tam Bitcoin kârınızı hesaplayın', path: '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi' },
    },
    {
      id: 'dca-formulu',
      heading: 'Bitcoin DCA Hesaplama Formülü',
      content: 'Dolar maliyet ortalaması yatırımınızı zamana yayar. Temel hesaplama:\n\n**Formül:** Ortalama Alış Fiyatı = Toplam Harcanan Tutar ÷ Toplam Biriken BTC\n\nHer alım için: **Alınan BTC = Yatırım Tutarı ÷ Alım Anındaki BTC Fiyatı**\n\n**Örnek:** Aylık 500 $\'ı 3 ay boyunca yatırırsınız:\n• 1. Ay: 500 $ ÷ 50.000 $ = 0,0100 BTC\n• 2. Ay: 500 $ ÷ 40.000 $ = 0,0125 BTC\n• 3. Ay: 500 $ ÷ 60.000 $ = 0,0083 BTC\n• Toplam: 1.500 $ harcanarak 0,0308 BTC alındı\n• Ortalama fiyat: 1.500 $ ÷ 0,0308 = **48.701 $/BTC**\n\nOrtalamanın (48.701 $) üç fiyatın basit ortalamasından (50.000 $) düşük olduğuna dikkat edin. DCA\'nın avantajı budur — Bitcoin daha ucuzken otomatik olarak daha fazla alırsınız.',
      cta: { calculatorId: 'dca', calculatorName: 'Bitcoin DCA Hesaplayıcı', text: 'DCA stratejinizi tarihsel verilerle test edin', path: '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' },
    },
    {
      id: 'madencilik-formulu',
      heading: 'Bitcoin Madencilik Kârlılık Formülü',
      content: 'Madencilik kârlılığı, ağın toplam hesaplama gücündeki payınıza bağlıdır:\n\n**Formül:** Günlük Kâr = (Hash Hızınız ÷ Ağ Hash Hızı) × Günlük Blok Ödülü × BTC Fiyatı - Günlük Elektrik Maliyeti\n\nBunu parçalayalım:\n• **Günlük Blok Ödülü:** ~144 blok/gün × 3,125 BTC/blok = 450 BTC/gün (2024 yarılanması sonrası)\n• **Payınız:** 100 TH/s hashrate\'iniz varsa ve ağ 600 EH/s ise, payınız %0,0000167\'dir\n• **Günlük Kazanılan BTC:** 450 × %0,0000167 = 0,0000750 BTC\n• **Günlük Gelir:** 0,0000750 × 100.000 $ = 7,50 $\n• **Günlük Elektrik:** 3.000W × 24sa × 0,08 $/kWh = 5,76 $\n• **Günlük Kâr:** 7,50 $ - 5,76 $ = **1,74 $**\n\nYaklaşık 4 yılda bir gerçekleşen [yarılanma olayı](/tr/ogrenin/bitcoin-yarilanmasi-nedir) blok ödülünü yarıya indirir ve bu hesaplamayı doğrudan etkiler.',
      cta: { calculatorId: 'mining-profitability', calculatorName: 'Madencilik Kârlılık Hesaplayıcı', text: 'Mevcut ağ verisi ile madencilik ROI\'nizi hesaplayın', path: '/tr/hesaplayicilar/bitcoin-madencilik-hesaplayicisi' },
    },
    {
      id: 'guc-yasasi-formulu',
      heading: 'Bitcoin Güç Yasası Formülü',
      content: '[Bitcoin Güç Yasası](/tr/ogrenin/bitcoin-guc-yasasi-aciklamasi), Bitcoin\'in uzun vadeli fiyat yörüngesini tanımlayan matematiksel bir modeldir:\n\n**Formül:** Fiyat = 10^(5,84 × log₁₀(genesis\'ten beri gün sayısı) - 17,3)\n\nBu bir log-log doğrusal regresyondur:\n• **Genesis\'ten beri gün sayısı** = Bitcoin\'in ilk bloğundan (3 Ocak 2009) bu yana geçen gün sayısı\n• **log₁₀** = 10 tabanlı logaritma\n• **5,84** = regresyon çizgisinin eğimi\n• **-17,3** = y-kesişimi\n\n**Mart 2026 için örnek (~6.270 gün):**\n• log₁₀(6270) = 3,797\n• 5,84 × 3,797 = 22,174\n• 22,174 - 17,3 = 4,874\n• Fiyat = 10^4,874 = **~74.800 $** (adil değer tahmini)\n\nModelin R²\'si yaklaşık 0,95\'tir; yani log ölçekte Bitcoin\'in tarihsel fiyat varyansının %95\'ini açıklar. Ancak gerçek fiyatlar adil değer çizgisinin önemli ölçüde üstüne veya altına sapabilir.',
      cta: { calculatorId: 'power-law', calculatorName: 'Bitcoin Güç Yasası Hesaplayıcı', text: 'Mevcut Güç Yasası adil değerini ve fiyat bantlarını görün', path: '/tr/hesaplayicilar/bitcoin-guc-yasasi' },
    },
    {
      id: 'vergi-formulu',
      heading: 'Bitcoin Vergi Hesaplama Formülü',
      content: 'ABD\'de Bitcoin mülk olarak vergilendirilir. Sermaye kazancı formülü:\n\n**Formül:** Sermaye Kazancı = Satış Fiyatı - Maliyet Temeli\n\nMaliyet Temeli = Alış Fiyatı + Alış Komisyonları\n\n**Vergi Oranı** elde tutma süresine bağlıdır:\n• **Kısa vadeli** (≤ 1 yıl): Olağan gelir olarak vergilendirilir (%10 - %37)\n• **Uzun vadeli** (> 1 yıl): %0, %15 veya %20 tercihli oranlar\n\n**Örnek:** 1 BTC\'yi 30.000 $\'dan (45 $ komisyonla) aldınız ve 2 yıl sonra 100.000 $\'dan sattınız.\n• Maliyet temeli: 30.000 $ + 45 $ = 30.045 $\n• Sermaye kazancı: 100.000 $ - 30.045 $ = 69.955 $\n• Uzun vadeli vergi (%15 dilim): 69.955 $ × 0,15 = **10.493 $**\n\n[Eyalet vergileri ve beyan durumu](/tr/ogrenin/bitcoin-vergi-rehberi-sermaye-kazanci) dahil ayrıntılı vergi hesaplamaları için özel vergi hesaplayıcımızı kullanın.',
      cta: { calculatorId: 'capital-gains-tax', calculatorName: 'Bitcoin Sermaye Kazancı Vergi Hesaplayıcı', text: '2026 için Bitcoin vergi yükümlülüğünüzü tahmin edin', path: '/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi' },
    },
    {
      id: 'donusum-formulu',
      heading: 'Bitcoin\'i USD\'ye Nasıl Çevirirsiniz',
      content: 'En basit Bitcoin hesaplaması para birimi dönüşümüdür:\n\n**Formül:** USD Değeri = BTC Miktarı × Mevcut BTC Fiyatı\n\nBu her iki yönde de çalışır:\n• **BTC\'den USD\'ye:** 0,025 BTC × 100.000 $ = 2.500 $\n• **USD\'den BTC\'ye:** 500 $ ÷ 100.000 $ = 0,005 BTC\n• **Satoshi\'den USD\'ye:** 100.000 sat = 0,001 BTC × 100.000 $ = 100 $\n\nDiğer para birimleri için döviz kuru ile çarpın:\n• **BTC\'den TL\'ye:** 0,1 BTC × 100.000 $ × 35 TL/USD = 350.000 TL\n• **BTC\'den EUR\'ya:** 0,1 BTC × 100.000 $ × 0,92 EUR/USD = 9.200 €\n\n[Bitcoin dönüştürücümüz](/tr/hesaplayicilar/bitcoin-donusturucu) USD, TL, EUR, GBP, CAD, AUD ve daha fazlası dahil 100+ dünya para birimini gerçek zamanlı güncellenen canlı oranlarla destekler.',
      cta: { calculatorId: 'bitcoin-converter', calculatorName: 'Bitcoin Dönüştürücü', text: 'BTC\'yi canlı oranlarla herhangi bir para birimine çevirin', path: '/tr/hesaplayicilar/bitcoin-donusturucu' },
    },
  ],
  howToSteps: [
    { name: 'Bir hesaplama türü seçin', text: 'Ne hesaplamak istediğinizi belirleyin: kâr/zarar, DCA getirisi, madencilik geliri veya basit bir dönüşüm' },
    { name: 'Girdilerinizi toplayın', text: 'Gerekli verileri toplayın: alış fiyatları, miktarlar, tarihler, komisyonlar veya hash hızları' },
    { name: 'Formülü uygulayın', text: 'Bu rehberden uygun formülü kullanın veya anında sonuç için verilerinizi ücretsiz hesaplayıcılarımıza girin' },
    { name: 'Sonuçları yorumlayın', text: 'Hesaplanan kârınızı, ROI\'nizi, vergi yükümlülüğünüzü veya öngörülen değerinizi inceleyin ve yatırım kararlarınızı bilgilendirin' },
  ],
};

export default article;
