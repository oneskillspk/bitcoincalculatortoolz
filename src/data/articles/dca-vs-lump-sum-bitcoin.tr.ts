import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-dca-vs-toplu-yatirim',
  title: 'Bitcoin DCA vs Toplu Yatırım: Hangisi Kazanıyor? (Verilerle)',
  metaDescription: 'Bitcoin DCA ile toplu (lump sum) yatırımı tarihsel veriler, risk dengeleri ve gerçek BTC piyasa döngülerinden örneklerle karşılaştırın.',
  category: 'Investing',
  publishedDate: '2026-02-07',
  updatedDate: '2026-05-18',
  readingTime: 8,
  keywords: ['dca vs toplu yatırım', 'lump sum bitcoin', 'bitcoin yatırım stratejisi', 'bitcoin dca karşılaştırma'],
  relatedCalculators: ['lump-sum-vs-dca', 'dca', 'what-if'],
  relatedArticles: ['bitcoin-dca-nedir', 'bitcoin-hodl-stratejisi-aciklamasi', 'aylik-100-dolar-bitcoin-dca-getirileri', 'bitcoin-sip-rehberi'],
  faqs: [
    { question: 'Bitcoin için DCA mı toplu yatırım mı daha iyi performans gösterir?', answer: 'Tarihsel veriler, yükselen piyasalarda toplu yatırımın yaklaşık %65 oranında DCA\'yı geçtiğini gösteriyor. Ancak büyük bir çöküşten hemen önce yatırım yaptığınızda DCA belirgin biçimde daha iyi performans verir ki bu Bitcoin\'de yaklaşık %35 oranında yaşanır.' },
    { question: 'DCA, Bitcoin için toplu yatırımdan daha mı güvenli?', answer: 'Evet. DCA, tüm sermayenizi piyasanın tepesinde yatırma riskini azaltır. DCA ile en kötü senaryonuz, toplu yatırımdaki en kötü senaryodan belirgin biçimde daha iyidir.' },
    { question: 'Bitcoin için en iyi DCA süresi nedir?', answer: 'Araştırmalar, 6–12 ay boyunca haftalık DCA yapmanın en iyi risk/ödül dengesini sunduğunu gösteriyor. Daha kısa süreler toplu yatırıma yaklaşır; daha uzun süreler ise paranın çok uzun süre nakitte kalmasına yol açabilir.' },
  ],
  sections: [
    { id: 'tartisma', heading: 'Büyük Bitcoin Yatırım Tartışması', content: 'Bitcoin\'e yatırmak için 100.000 TL\'niz var. Hepsini bugün mü yatırmalısınız ([toplu yatırım / lump sum](https://corporate.vanguard.com/content/dam/corp/research/pdf/cost_averaging_invest_now_or_temporarily_hold_your_cash.pdf)) yoksa haftalara ya da aylara mı yaymalısınız (DCA)? Bu, Bitcoin yatırımında en sık sorulan sorulardan biridir ve cevabı çoğu insanın sandığından daha katmanlıdır. [Vanguard araştırması](https://investor.vanguard.com/investor-resources-education/online-trading/dollar-cost-averaging-vs-lump-sum), geleneksel piyasalarda toplu yatırımın DCA\'yı yaklaşık üçte iki oranında geçtiğini gösteriyor — ancak Bitcoin\'in aşırı oynaklığı denklemi değiştirir.\n\n**Toplu yatırım**, tüm sermayeyi anında piyasaya sürmek demektir. Mantığı: piyasada geçirilen süre, piyasayı zamanlamayı yener.\n\n**Dolar maliyet ortalaması (DCA)**, düzenli aralıklarla sabit tutarlar yatırmak demektir. Mantığı: zamanlama riskini azaltır ve giriş fiyatınızı yumuşatır.\n\nHer iki stratejinin tutkulu savunucuları vardır ancak veriler daha bütünlüklü bir hikâye anlatır.' },
    { id: 'tarihsel-veri', heading: 'Tarihsel Veriler Ne Diyor?', content: 'Bitcoin\'in tarihindeki olası her başlangıç noktası analiz edildiğinde:\n\n**Toplu yatırım vakaların ~%65\'inde kazanır.** Bitcoin gibi uzun vadeli yükseliş trendi olan bir piyasada, paranın daha erken yatırılması daha fazla bileşik büyüme süresi anlamına gelir.\n\n**Ama DCA kazandığında büyük kazanır.** DCA\'nın üstün geldiği %35\'lik vakalar genelde en acı senaryolardır — 2018 ve 2022 gibi büyük çöküşlerden hemen önce yatırım yapmak. Bu durumlarda DCA, toplu yatırımı %30–50 oranında geçebilir.\n\n**Ortalama üstün performans:**\n• Toplu yatırım kazandığında: DCA\'dan ortalama +%12 daha iyi\n• DCA kazandığında: toplu yatırımdan ortalama +%28 daha iyi\n\nBu asimetri önemlidir — DCA\'nın kazançları kayıplarından daha büyüktür ve bu da onu çoğu yatırımcı için risk-ayarlı olarak daha iyi bir tercih yapar.', cta: { calculatorId: 'lump-sum-vs-dca', calculatorName: 'Toplu Yatırım vs DCA Hesaplayıcısı', text: 'Herhangi bir tarihsel dönem için DCA ve toplu yatırım performansını karşılaştırın', path: '/tr/hesaplayicilar/bitcoin-maliyet-ortalama' } },
    { id: 'psikoloji', heading: 'Psikoloji Faktörü', content: 'Verilerin yanı sıra yatırımcı psikolojisi de kritik rol oynar:\n\n**Pişmanlık minimizasyonu:** Tepede toplu yatırım yaptıktan sonra fiyat %50 düşerse pozisyonu tutabilir misiniz? Çoğu yatırımcı en kötü zamanda panikle satar. DCA bu felaket sonucu önler.\n\n**Bağlanma yanlılığı:** DCA, ruh halinizden bağımsız çalışan bir sistem oluşturur. Karar felci olmaz, "düşüş bekleyeyim" diye başlayan ama hiç yatırım yapmamayla sonuçlanan döngüye girmezsiniz.\n\n**Rahat uyuma faktörü:** %50\'lik gerçekleşmemiş bir kayıp ciddi stres yaratacaksa, beklenen getiriden bağımsız olarak DCA daha iyi seçimdir.\n\n**En büyük risk hangi stratejiyi seçtiğiniz değil — hiçbirini seçmeyip piyasa sizsiz hareket ederken nakitte oturmaktır.**' },
    { id: 'hibrit', heading: 'Hibrit Yaklaşım', content: 'Birçok deneyimli yatırımcı iki yaklaşımı birleştirir:\n\n**%50/%50 ayrımı:** Yarısını hemen yatırın, kalanını 3–6 ay boyunca DCA yapın. Bu, toplu yatırımın piyasada geçirilen süre avantajının çoğunu yakalarken DCA\'nın aşağı yön korumasını da sağlar.\n\n**Değer ortalaması:** Sabit tutarlar yerine, piyasanın hareketine göre DCA alımlarını ayarlayın. Fiyat düştüğünde daha çok, yükseldiğinde daha az alın.\n\n**Tetikleyici tabanlı DCA:** Düzenli alımlar kurun ama anlamlı düşüşlerde (örn. son zirvelerden %10+ geri çekilme) ekstra ekleyin.\n\n**Temel ilke:** Tutarlı şekilde uygulanan herhangi bir sistematik strateji, hiç stratejisiz hareket etmekten daha iyidir. Mükemmel, iyinin düşmanı olmasın.' },
    { id: 'hangi-strateji', heading: 'Hangi Stratejiyi Seçmelisiniz?', content: '**Toplu yatırımı seçin eğer:**\n• Bitcoin\'in uzun vadeli yönüne dair yüksek inancınız varsa\n• Alımdan hemen sonra %50+ bir düşüşe duygusal olarak dayanabilirseniz\n• 5+ yıllık yatırım ufkunuz varsa\n• Para şu anda bir mevduat hesabında enflasyona yenilir durumdaysa\n\n**DCA\'yı seçin eğer:**\n• Bitcoin\'de yeniyseniz ve inancınızı hâlâ inşa ediyorsanız\n• Yatırımdan hemen sonra büyük bir çöküş yüzünden uyku kaçırırsanız\n• Toplu paranız yoksa — yatırılabilir paranız düzenli gelirden geliyorsa\n• "Kur ve unut" yaklaşımı istiyorsanız — başlamak için [tam DCA rehberimizi](/tr/ogrenin/bitcoin-dca-nedir) okuyun\n\n**Hibrit\'i seçin eğer:**\n• Her iki dünyanın en iyisini istiyorsanız\n• Orta risk toleransınız varsa\n• Bir güvenlik ağı korurken sermayeyi verimli kullanmak istiyorsanız', cta: { calculatorId: 'dca', calculatorName: 'Bitcoin DCA Hesaplayıcısı', text: 'İdeal DCA programınızı gerçek tarihsel Bitcoin verisi ile modelleyin', path: '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' } },
  ],
  howToSteps: [
    { name: 'Yatırım tutarınızı belirleyin', text: 'Bitcoin\'e yatırmak istediğiniz sermayeyi belirleyin' },
    { name: 'Karşılaştırma hesaplayıcısını açın', text: 'Toplu Yatırım vs DCA Hesaplayıcımızı ziyaret edin' },
    { name: 'Zaman dilimini ayarlayın', text: 'İki stratejiyi karşılaştırmak için tarihsel bir dönem seçin' },
    { name: 'Sonuçları karşılaştırın', text: 'Toplu yatırım ile DCA\'nın yan yana getirilerini görün' },
    { name: 'Yaklaşımınızı seçin', text: 'Risk toleransınıza göre toplu, DCA veya hibrit seçeneği belirleyin' },
  ],
  expertQuote: {
    quote: 'Piyasada geçirilen süre, piyasayı zamanlamayı yener. Bitcoin\'in oynaklığında, dolar maliyet ortalaması çoğu yatırımcıya saf toplu yatırımın sağlayamayacağı psikolojik bir avantaj verir.',
    author: 'Lyn Alden',
    role: 'Makroekonomist ve Yazar',
    source: 'https://www.lynalden.com/invest-in-bitcoin/',
    sourceLabel: 'lynalden.com',
  },
};

export default article;
