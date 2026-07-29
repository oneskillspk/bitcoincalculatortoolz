import { Article } from '../articles';

/** TR counterpart of `how-much-bitcoin-by-age` → `/tr/ogrenin/yasa-gore-ne-kadar-bitcoin`. */
const article: Article = {
  slug: 'yasa-gore-ne-kadar-bitcoin',
  title: 'Yaşa Göre Ne Kadar Bitcoin Sahibi Olmalısınız? (2026 Karşılaştırmaları)',
  metaDescription: '18-65 yaş için Bitcoin hedeflerini görün, BTC stoğunuzu derecelendirin ve Yaşam Döngüsü Birikim Modeli ile DCA yakalama planı yapın.',
  category: 'Investing',
  publishedDate: '2026-04-10',
  updatedDate: '2026-05-18',
  readingTime: 11,
  speakable: true,
  keywords: ['yaşa göre ne kadar bitcoin', 'yaşa göre bitcoin birikim hedefi', 'yaşa göre bitcoin karşılaştırması', 'yaşa göre bitcoin emeklilik', 'bitcoin yaşam döngüsü birikim modeli'],
  relatedCalculators: ['bitcoin-accumulation-score', 'retirement', 'dca', 'wealth-percentile', 'power-law', 'investment'],
  relatedArticles: ['ne-kadar-bitcoin-sahibi-olmaliyim', 'bitcoin-emeklilik-planlama-rehberi', 'bitcoin-dca-nedir', 'bitcoin-servet-dagilimi', 'bitcoin-dca-vs-toplu-yatirim', 'bitcoin-guc-yasasi-aciklamasi'],
  faqs: [
    { question: '18 yaşında biri ne kadar Bitcoin\'e sahip olmalı?', answer: 'Yaşam döngüsü modeli 18 yaşındaki birinin hedefini 0,102 BTC olarak belirler. Bu yaşta Genç Yetişkin aşamasındasınız ve küçük, tutarlı alımlar bile on yıllar boyunca dramatik bir şekilde birikir.' },
    { question: '25 yaşında biri ne kadar Bitcoin\'e sahip olmalı?', answer: '25 yaşındaki birinin birikim hedefi 2,45 BTC\'dir. Bu, kazanma gücünün arttığı ve Bitcoin\'in öngörülen büyümesinin lehinize on yıllarca bileşik olmaya devam edeceği Birincil Biriktirici aşamasıdır.' },
    { question: '30 yaşında biri ne kadar Bitcoin\'e sahip olmalı?', answer: 'Model 30 yaşındaki biri için 13,59 BTC hedefler. Gelirin zirve yaptığı ve agresif birikim için pencerenin en geniş olduğu Zirve Yapıcı aşamasına giriyorsunuz. Tam derecenizi [Bitcoin Birikim Skoru Hesaplayıcısı](/tr/hesaplayicilar/bitcoin-birikim-skoru) ile kontrol edin.' },
    { question: '40 yaşında biri ne kadar Bitcoin\'e sahip olmalı?', answer: '40 yaşında, yaşam döngüsü hedefi yaklaşık 144 BTC ile zirve yapar. Bu, ömür boyu kazanma kapasitesi ve Bitcoin\'in Güç Yasası yörüngesinin maksimumda kesiştiği çan eğrisinin tepe noktasıdır.' },
    { question: '50 yaşında Bitcoin almak için çok mu geç?', answer: 'Hayır. 50 yaşındaki birinin önünde hâlâ 15+ yıllık potansiyel takdir vardır. DCA yakalama stratejisi açığı sistematik olarak kapatmanızı sağlar. Bütçenize uygun aylık alım miktarlarını modellemek için [DCA Hesaplayıcısı](/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi)\'nı kullanın.' },
    { question: 'İyi bir Bitcoin birikim skoru nedir?', answer: 'B+ veya üstü, yaşa göre ayarlanmış hedefinizin en az %90\'ını tuttuğunuz anlamına gelir. A+ notu %150 veya daha fazla gerektirir. Çoğu insan ilk kontrolünde C\'nin altında puan alır, bu normaldir ve tutarlı bir DCA planıyla düzeltilebilir.' },
    { question: 'Bitcoin birikim notu nasıl hesaplanır?', answer: 'Mevcut BTC varlıklarınızı yaşınızın hedefine bölün. Bu oran bir harf notuna eşlenir: %150+ A+, %110-150 A, %90-110 B+, %75-90 B, %50-75 C, %25-50 D ve %25 altı F\'dir.' },
    { question: 'Bu bir Bitcoin emeklilik hesaplayıcısından nasıl farklıdır?', answer: 'Birikim Skoru, stoğunuzu şu anda bir yaş karşılaştırmasına karşı derecelendirir. [Emeklilik hesaplayıcısı](/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi) Bitcoin\'inizin yaşam giderlerini ne zaman finanse edebileceğini tahmin etmek için ileri doğru projeksiyon yapar.' },
  ],
  sections: [
    {
      id: 'genel-bakis',
      heading: 'Yaşa Göre Ne Kadar Bitcoin\'e Sahip Olmalısınız?',
      content: '"Yolumda mıyım?" Bu tek soru, herhangi bir fiyat çöküşünden daha fazla Bitcoin endişesine neden olur.\n\nSorun şu ki, çoğu Bitcoin tavsiyesi yaşı tamamen göz ardı eder. 22 yaşındaki bir barista ve 45 yaşındaki bir cerrah aynı genel "sadece sat biriktir" rehberliğini alır. Bu yardımcı değildir.\n\n**Bitcoin Yaşam Döngüsü Birikim Modeli** bunu düzeltir. İki gücü birleştirir: Bitcoin\'in uzun vadeli fiyat yörüngesi ([Güç Yasası modeli](/tr/ogrenin/bitcoin-guc-yasasi-aciklamasi) tabanlı) ve ömür boyu kazançların iyi belgelenmiş çan eğrisi.\n\nDerecenizi anında görmek ister misiniz? [Bitcoin Birikim Skoru Hesaplayıcısı](/tr/hesaplayicilar/bitcoin-birikim-skoru) yaşınızı ve varlıklarınızı alır, ardından A+\'dan F\'ye kadar bir harf notu döndürür.',
    },
    {
      id: 'yasam-dongusu-modeli',
      heading: 'Bitcoin Yaşam Döngüsü Birikim Modeli Açıklaması',
      content: 'Model birlikte çarpan iki eğriye dayanır.\n\n**Eğri 1: Bitcoin\'in Güç Yasası takdiri.** Fizikçi Giovanni Santostasi, Bitcoin\'in fiyatının zamanla güç yasası ilişkisi izlediğini gösterdi. 20 yaşında yatırılan bir dolar, 55 yaşında yatırılan bir dolardan çok daha fazla gelecekteki satın alma gücü satın alır.\n\n**Eğri 2: Ömür boyu gelir dağılımı.** ABD İstatistik Bürosu verileri, reel kazançların 35-50 yaşları arasında zirve yaptığını gösterir.\n\nİki eğriyi çarptığınızda, yirmili yaşların başından dik bir şekilde yükselen, 40 yaş civarında zirve yapan ve emekliliğe doğru azalan çan şeklinde bir birikim hedefi elde edersiniz.\n\nModel sekiz yaşam aşaması tanımlar:\n- **Genç (13-17):** Minimum gelir, maksimum zaman avantajı\n- **Genç Yetişkin (18-22):** İlk gerçek gelir. Hedefler 0,1 BTC\'den 0,5 BTC\'ye çıkar\n- **Birincil Biriktirici (23-27):** Kariyer kazançları hızlanır. Hedefler 1\'den 5 BTC\'ye atlar\n- **Zirve Yapıcı (28-40):** Altın pencere. Hedefler 8\'den 144 BTC\'ye\n- **Geçiş (41-44):** Birikim yavaşlar\n- **Tadını Çıkar Aşaması (45-59):** Model "daha fazla birikiri"den "sahip olduğunuzu koruyun"a kayar\n- **Emeklilik (60-74):** Drawdown planlama ve servet koruma\n- **Miras (75-83):** Miras düşünceleri\n\nAnahtar yaşlardaki belirli BTC hedefleri:\n\n| Yaş | Hedef BTC | Yaşam Aşaması |\n|---|---|---|\n| 18 | 0,102 | Genç Yetişkin |\n| 20 | 0,238 | Genç Yetişkin |\n| 25 | 2,451 | Birincil Biriktirici |\n| 28 | 8,277 | Zirve Yapıcı |\n| 30 | 13,59 | Zirve Yapıcı |\n| 35 | 62,39 | Zirve Yapıcı |\n| 40 | 144,00 | Zirve Yapıcı |\n| 45 | 97,07 | Tadını Çıkar |\n| 50 | 46,30 | Tadını Çıkar |\n| 55 | 15,51 | Tadını Çıkar |\n| 60 | 5,50 | Emeklilik |\n| 65 | 2,00 | Emeklilik |\n| 70 | 0,75 | Emeklilik |\n| 75 | 0,30 | Miras |',
    },
    {
      id: 'yas-karsilastirmalari',
      heading: 'Yaşa Göre Bitcoin Hedefleri: Anahtar Kilometre Taşları',
      content: '**Yaş 18: 0,102 BTC**\n18 yaşındasınız, muhtemelen asgari ücret kazanıyorsunuz veya hâlâ okuldasınız. Hedef bilerek düşük. Ama önemli olan matematik: Eğer Bitcoin önümüzdeki 20 yıl boyunca Güç Yasası modelini izlerse, bugün satın alınan bu 0,102 BTC 38 yaşınıza geldiğinizde önemli satın alma gücünü temsil edebilir.\n\n**Yaş 25: 2,45 BTC**\nÇoğu 25 yaşındaki ilk istikrarlı gelirine, minimum aile giderlerine ve önünde on yıllara sahiptir. 3-4 yıl boyunca aylık $300-500 disiplinli DCA mevcut fiyatlarda sizi oraya götürür.\n\n**Yaş 30: 13,59 BTC**\n25 ila 30 yaşları arasında 2,45\'ten 13,59\'a sıçrama iki şeyi yansıtır: beş daha fazla yıl kazanma gücü ve Bitcoin\'in azalan gelecekteki getirilerinin aciliyeti.\n\n**Yaş 35: 62,39 BTC**\nZirve kazanma yıllarıyla hâlâ önemli bir Bitcoin büyüme pisti buluşur. Bu hedef, birinin on yıldan fazla süredir biriktirdiğini varsayar.\n\n**Yaş 40: 144 BTC**\nÇan eğrisinin zirvesi. Bu, modelin teorik maksimum birikim hedefidir.\n\nTam olarak nerede olduğunuzu görmek ister misiniz? Sayılarınızı [Bitcoin Birikim Skoru Hesaplayıcısı](/tr/hesaplayicilar/bitcoin-birikim-skoru)\'na takın ve kişisel notunuzu alın.',
      cta: { calculatorId: 'bitcoin-accumulation-score', calculatorName: 'Bitcoin Birikim Skoru Hesaplayıcısı', text: 'Birikim notunuzu anında kontrol edin', path: '/tr/hesaplayicilar/bitcoin-birikim-skoru' },
    },
    {
      id: 'derecelendirme-sistemi',
      heading: 'Birikim Notunuzu Anlamak (A+\'dan F\'ye)',
      content: 'Notunuz basitçe varlıklarınızın yaşınız için hedefe bölünmüş halidir.\n\n| Not | Hedefe Oran | Etiket | Anlamı |\n|---|---|---|---|\n| A+ | %150+ | Balina Statüsü | Çok ilerdesiniz. Çeşitlendirme ve güvenlik yükseltmelerini düşünün. |\n| A | %110-150 | Aşırı Başarı | Programın ilerisinde. Rotayı koruyun. |\n| B+ | %90-110 | Yolunda | Modelin beklediği yerde. Sağlam pozisyon. |\n| B | %75-90 | Neredeyse Orada | Yakın. DCA\'da küçük bir itme açığı kapatır. |\n| C | %50-75 | Başlangıç | Temeliniz var. Alım sıklığını artırma zamanı. |\n| D | %25-50 | Geride | Anlamlı açık, ama 2-3 yıllık odaklanmış DCA planıyla kurtarılabilir. |\n| F | %25 altı | Stoklama Başla! | Panik yapmayın. Çoğu insan burada başlar. |\n\nNot, *yaşınıza* görelidir, diğer insanlara değil. Model ayrıca Bitcoin\'in mevcut fiyatını hesaba katmaz.',
    },
    {
      id: 'geç-baslayanlar',
      heading: 'Geride iseniz? DCA Yakalama Stratejisi',
      content: 'D veya F almak başarısız olduğunuz anlamına gelmez. Boşluk üzerinde netlik kazandığınız ve onu kapatmak için basit bir yolunuz olduğu anlamına gelir.\n\nDCA yakalama yaklaşımı dört adımda çalışır:\n\n1. Notunuzu kontrol edin ve varlıklarınız ile yaş hedefiniz arasındaki BTC boşluğunu not edin\n2. Bir zaman çizelgesi seçin: 6 ay, 1 yıl, 2 yıl veya 5 yıl\n3. Boşluğu ay sayısına bölün. Mevcut BTC fiyatıyla çarpın. Bu aylık DCA miktarınızdır.\n4. Otomatik alımları kurun ve piyasayı zamanlamayı unutun\n\n**Çalışılmış örnek:** Diyelim ki 30 yaşındasınız ve 1 BTC\'niz var. Hedefiniz 13,59 BTC. Boşluk: 12,59 BTC. BTC başına $100.000\'de:\n• 1 yıllık yakalama: ~$104.917/ay\n• 3 yıllık yakalama: ~$34.972/ay\n• 5 yıllık yakalama: ~$20.983/ay\n\nNokta tam hedefi bir gecede vurmak değil. Her 12-18 ayda notunuzu bir harf yukarı taşımaktır.\n\nBelirli aylık miktarları modellemek için [DCA Hesaplayıcısı](/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi)\'nı kullanın.',
      cta: { calculatorId: 'dca', calculatorName: 'Bitcoin DCA Hesaplayıcısı', text: 'Aylık DCA yakalama planınızı modelleyin', path: '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' },
    },
    {
      id: 'metodoloji',
      heading: 'Veri Kaynakları ve Metodoloji',
      content: '**Bitcoin Fiyat Modeli:** Giovanni Santostasi tarafından geliştirilen Güç Yasası modeli (2024\'te yayınlandı). Model, Temmuz 2010\'dan bugüne kadar günlük BTC fiyat verilerine log-log regresyon kullanır.\n\n**Gelir Verileri:** ABD İstatistik Bürosu (BLS), yaş grubuna göre medyan haftalık kazançlar. Çan eğrisi 35-50 yaşları arasında zirve yapar.\n\n**Zincir Üzeri Demografi:** Glassnode ve Chainalysis raporları, Bitcoin sahibi yaş dağılımı ve birikim davranışı üzerine.\n\n**Hedef Hesaplaması:** Her yaş için model, Güç Yasası\'nın öngörülen gelecekteki takdir faktörünü o yaş için gelir eğrisi ağırlığıyla çarpar. Sonuç, zirve (40 yaş) maksimum uygulanabilir birikimi temsil edecek şekilde normalleştirilir.\n\nBu model eğiticidir. Erken yetişkinlikten itibaren tutarlı DCA davranışını varsayar. Notunuz eylemi motive etmelidir, umutsuzluk değil.',
    },
    {
      id: 'eylem-plani',
      heading: 'Bitcoin Birikim Eylem Planınız',
      content: '**Adım 1: Notunuzu kontrol edin.** [Bitcoin Birikim Skoru Hesaplayıcısı](/tr/hesaplayicilar/bitcoin-birikim-skoru)\'na gidin. Yaşınızı ve BTC varlıklarınızı girin.\n\n**Adım 2: Aşamanızı anlayın.** Agresif alımın maksimum etkiye sahip olduğu Birincil Biriktirici penceresinde (23-27) misiniz? Yoksa korumanın birikimden daha önemli olduğu Tadını Çıkar Aşamasında (45-59) mısınız?\n\n**Adım 3: DCA planı belirleyin.** B+\'nın altındaysanız, 12 ay içinde bir harf notu kapatmak için gereken aylık alım miktarını hesaplayın. Otomatikleştirin. Düşüşleri zamanlamaya çalışmayın. [DCA Hesaplayıcısı](/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi) matematiği yapar.\n\n**Adım 4: Üç ayda bir takip edin.** Her üç ayda bir geri gelin ve notunuzu tekrar kontrol edin. Hedef değişmez, ancak varlıklarınız tırmanmalıdır.\n\nHedef ilerleme, mükemmellik değildir.',
      cta: { calculatorId: 'bitcoin-accumulation-score', calculatorName: 'Bitcoin Birikim Skoru Hesaplayıcısı', text: 'Birikim notunuzu şimdi alın', path: '/tr/hesaplayicilar/bitcoin-birikim-skoru' },
    },
  ],
  howToSteps: [
    { name: 'Mevcut yaşınızı girin', text: 'Bitcoin Birikim Skoru Hesaplayıcısı\'na yaş kaydırıcısını kullanın veya yaşınızı (13-83) yazın.' },
    { name: 'Bitcoin varlıklarınızı girin', text: 'Tüm cüzdanlar ve borsalardaki toplam BTC\'nizi girin.' },
    { name: 'Birikim notunuzu görün', text: 'Hesaplayıcı varlıklarınız ile yaşa göre ayarlanmış hedefe oranla bir harf notu (A+\'dan F\'ye) döndürür.' },
    { name: 'Yaşam döngüsü çan eğrisini inceleyin', text: 'Tüm yaş spektrumunda birikim ve tadını çıkar bölgelerini gösteren etkileşimli grafiği keşfedin.' },
    { name: 'DCA yakalama stratejinizi planlayın', text: 'Boşluğunuzu 6 ay ile 5 yıl arasında kapatmak için gereken aylık alım miktarını hesaplamak için DCA yakalama panelini kullanın.' },
  ],
};

export default article;
