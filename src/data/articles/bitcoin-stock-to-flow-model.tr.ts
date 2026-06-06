import { Article } from '../articles';

/** TR counterpart of `bitcoin-stock-to-flow-model` → `/tr/ogrenin/bitcoin-stok-akis-modeli`. */
const article: Article = {
  slug: 'bitcoin-stok-akis-modeli',
  title: 'Bitcoin Stok-Akış (S2F) Modeli: Nasıl Çalışır ve Sınırları',
  metaDescription: 'S2F modeli 2015-2021 arası Bitcoin\'i doğru tahmin etti, sonra 2022\'de BTC 100K $\'a ulaşması gerekirken çöktüğünde başarısız oldu. Formülü ve sınırlarını öğrenin.',
  category: 'Market Analysis',
  publishedDate: '2026-03-09',
  updatedDate: '2026-05-18',
  readingTime: 9,
  keywords: ['bitcoin stok akış', 'bitcoin S2F modeli', 'PlanB bitcoin modeli', 'bitcoin kıtlık modeli', 'bitcoin yarılama stok akış'],
  relatedCalculators: ['on-chain', 'halving-countdown', 'power-law', 'supply'],
  relatedArticles: ['bitcoin-zincir-uzeri-metrikler-rehberi', 'bitcoin-guc-yasasi-aciklamasi', 'bitcoin-yarilanmasi-nedir'],
  faqs: [
    { question: 'Bitcoin\'in mevcut Stok-Akış oranı nedir?', answer: '2026 itibarıyla Bitcoin\'in S2F oranı yaklaşık 118\'dir, dolaşımdaki arzı (~19,8M BTC) yıllık yeni arza (~168.000 BTC) bölerek hesaplanır. 2024 yarılaması blok ödülünü 3,125 BTC\'ye indirdikten sonra, Bitcoin\'in S2F oranı artık altını (~60) aşıyor.' },
    { question: 'Stok-Akış modeli Bitcoin\'in fiyatını doğru tahmin eder mi?', answer: 'S2F modeli tartışmalı olmuştur. 2021\'e kadar Bitcoin\'in fiyatının genel yönünü doğru tahmin etti, ancak 2022 ayı piyasasında fiyatları %75-80 abarttı. Eleştirmenler modelin hatalı olduğunu savunurken, destekçiler S2F\'nin uzun vadeli zaman dilimlerinde kıtlık ilişkisini iyi yakaladığını belirtiyor.' },
    { question: 'Stok-Akış, Güç Yasası modeliyle nasıl karşılaştırılır?', answer: 'Her ikisi de logaritmik modellerdir ancak metodolojide farklıdırlar. S2F fiyat hedefleri türetmek için kıtlık oranlarını kullanırken, Güç Yasası modeli zaman tabanlı regresyon kullanır. Güç Yasası son yıllarda daha fazla hassasiyet gösterdi, ancak S2F kıtlık dinamiklerini anlamak için değerlidir.' },
    { question: 'Stok-Akış modeli yarılanmalardan sonra doğru muydu?', answer: 'S2F 2012 ve 2016 yarılanmalarından sonra yönlü fiyat hareketlerini doğru yakaladı. 2020 yarılanması daha karışık sonuçlar gösterdi — Bitcoin model tahminine göre yeni tüm zamanların en yüksek seviyelerine ulaştı ancak orijinal S2F modelinin 100K $+ fiyat hedeflerinin önemli ölçüde altında kaldı.' }
  ],
  howToSteps: [
    { name: 'Stok vs akışı anlayın', text: 'Stok bir varlığın toplam mevcut arzıdır. Akış yıllık üretilen yeni arzdır. Bitcoin için stok ~19,8M BTC ve akış 2024 yarılanmasından sonra ~168.000 BTC/yıldır.' },
    { name: 'S2F oranını hesaplayın', text: 'Stoğu akışa bölün. Bitcoin\'in mevcut S2F oranı ~118, mevcut hızda mevcut arzı iki katına çıkarmak için 118 yıllık madencilik gerekeceği anlamına gelir.' },
    { name: 'Diğer varlıklarla karşılaştırın', text: 'Altın S2F ~60, Gümüş ~22. Bitcoin artık altını aşıyor, onu bu metriğe göre en kıt varlık yapıyor.' },
    { name: 'Fiyat modelini uygulayın', text: 'Orijinal S2F modeli regresyon kullanır: ln(Fiyat) = a × ln(S2F) + b. Bu kıtlığa dayalı bir fiyat hedefi üretir.' },
    { name: 'Model doğruluğunu değerlendirin', text: 'Gerçek fiyatı S2F tahminleriyle karşılaştırın. Modelin sınırlamaları olduğunu ve Güç Yasası ve zincir üzeri metrikler gibi diğer göstergelerle birleştirilmesi gerektiğini anlayın.' }
  ],
  sections: [
    {
      id: 's2f-nedir',
      heading: 'Stok-Akış Nedir',
      content: '**Stok-Akış (S2F) modeli**, bir varlığın kıtlığını mevcut arzını (stok) yıllık üretim oranıyla (akış) karşılaştırarak ölçen niceliksel bir çerçevedir:\n\n**S2F Oranı = Stok ÷ Akış**\n\nBitcoin için:\n• **Stok** = Toplam dolaşımdaki arz (2026 itibarıyla ~19,8 milyon BTC)\n• **Akış** = Yıllık madenciliği yapılan yeni Bitcoin (2024 yarılanmasından sonra ~168.000 BTC)\n• **S2F Oranı** = 19,8M ÷ 0,168M = **~118**\n\nDaha yüksek bir S2F oranı, bir varlığın şişirilmesinin daha zor olduğu anlamına gelir. Bu kavram, altın ve gümüş gibi **kıymetli metalleri** analiz etmek için onlarca yıldır kullanılmıştır.\n\nModel, **PlanB** isimli takma adlı analist tarafından 2019\'da Bitcoin için uyarlandı. PlanB, Bitcoin\'in matematiksel olarak garanti edilen arz programının onu S2F analizine benzersiz şekilde uygun kıldığını savundu. Altının aksine, [yarılanma mekanizması](/tr/ogrenin/bitcoin-yarilanmasi-nedir) yeni arzın fiyattan bağımsız olarak her dört yılda bir öngörülebilir şekilde azaldığını sağlar.',
      cta: { calculatorId: 'supply', calculatorName: 'Arz ve Kıtlık Hesaplayıcısı', text: 'Bitcoin\'in arz dinamiklerini ve kıtlık metriklerini keşfedin', path: '/tr/hesaplayicilar/bitcoin-arz' }
    },
    {
      id: 's2f-formul',
      heading: 'S2F Formülü Açıklandı',
      content: 'PlanB\'nin **Stok-Akış fiyat modeli** sadece oranı hesaplamanın ötesine geçer — kıtlığa dayalı fiyat hedefleri türetmek için regresyon analizi kullanır:\n\n**ln(Piyasa Değeri) = a × ln(S2F) + b**\n\nDaha basit terimlerle: **Fiyat = e^(a × ln(S2F) + b)**\n\nBurada:\n• **ln** = doğal logaritma\n• **a** (eğim) ≈ tarihsel regresyona göre 3,0-3,3\n• **b** (kesim noktası) ≈ tarihsel veri uyumu ile belirlenir\n• **e** = Euler sayısı (~2,718)\n\n**Model Evrimi:**\n\n**S2F (Orijinal, 2019)**: Aylık aralıklarla sadece Bitcoin\'in veri noktalarını kullandı. 2020 yarılanmasından sonra ~55.000 $ tahmin etti.\n\n**S2FX (Çapraz Varlık, 2020)**: Altın ve gümüş veri noktalarını dahil etti. 2021 sonuna kadar 100K-288K $ daha yüksek hedefler öngördü.\n\n**Zaman İçinde S2F Oranını Hesaplama:**\n\n| Yarılanma | Tarih | Blok Ödülü | Yıllık Akış | S2F Oranı |\n|---------|------|--------------|-------------|------------|\n| Yarılanma öncesi | 2009-2012 | 50 BTC | 2,6M | ~3-7 |\n| 1. yarılanma | 2012 | 25 BTC | 1,3M | ~10 |\n| 2. yarılanma | 2016 | 12,5 BTC | 657K | ~25 |\n| 3. yarılanma | 2020 | 6,25 BTC | 328K | ~54 |\n| 4. yarılanma | 2024 | 3,125 BTC | 164K | ~118 |\n| 5. yarılanma | 2028 (tahmini) | 1,5625 BTC | 82K | ~240 |\n\nHer yarılanmanın S2F oranını yaklaşık olarak **iki katına çıkardığına** dikkat edin.',
      cta: { calculatorId: 'halving-countdown', calculatorName: 'Yarılanma Geri Sayımı', text: 'Bir sonraki Bitcoin yarılanma olayını takip edin', path: '/tr/hesaplayicilar/bitcoin-yarilama' }
    },
    {
      id: 's2f-karsilastirma',
      heading: 'Bitcoin vs Altın vs Gümüş S2F',
      content: 'Varlıklar arasında S2F oranlarını karşılaştırmak Bitcoin\'in neden sıklıkla **"dijital altın"** olarak adlandırıldığını ortaya koyar:\n\n| Varlık | Stok | Yıllık Akış | S2F Oranı | Kıtlık Yorumu |\n|-------|-------|-------------|-----------|------------------------|\n| **Bitcoin** | 19,8M BTC | 168K BTC | **~118** | Şimdiye kadarki en kıt varlık |\n| **Altın** | 210.000 ton | 3.500 ton | **~60** | Tarihi değer saklayıcısı |\n| **Gümüş** | 1,6M ton | 27.000 ton | **~22** | Endüstriyel + parasal |\n| **Platin** | 10.000 ton | 200 ton | **~50** | Endüstriyel odak |\n| **ABD Doları** | Sınırsız | ~1T $+/yıl | **~0** | Kıtlık yok |\n\n**Temel İçgörüler:**\n\n• **Bitcoin artık altının S2F oranını aşıyor** — 2024 yarılanmasından sonra Bitcoin bu metriğe göre matematiksel olarak en kıt varlıktır\n• **Altının S2F\'si binlerce yıldır istikrarlı** — madencilik çıktısı yavaşça artar ve mücevher/endüstriyel talebi kabaca karşılar\n• **Bitcoin\'in S2F\'si artmaya devam edecek** — her yarılanma oranı iki katına çıkarırken altınınki kabaca sabit kalır\n\n**S2F Hipotezi:**\nPiyasalar kıtlığı varlıklar arasında tutarlı şekilde değerlendirirse ve Bitcoin altına benzer piyasa kabulü elde ederse (12-15 trilyon $ piyasa değeri), Bitcoin\'in fiyatı S2F oranının ima ettiği değerlemelere yaklaşmalıdır.\n\nAltın paritesinde (~12T $ piyasa değeri), Bitcoin yaklaşık olarak **BTC başına 600.000 $** değerinde olur. S2F savunucuları bunun kaçınılmaz olduğunu savunur; eleştirmenler modelin aşırı basit olduğunu savunur.'
    },
    {
      id: 'planb-tahminleri',
      heading: 'PlanB\'nin Modeli ve Tahminleri',
      content: '**PlanB**, Mart 2019\'da Bitcoin Stok-Akış modelini popülerleştiren takma adlı Hollandalı kurumsal yatırımcıdır.\n\n**Yapılan Temel Tahminler:**\n\n• **Mart 2019**: PlanB Bitcoin\'in orijinal S2F modeline dayalı olarak 2020 yarılanmasından sonra ~55.000 $\'a ulaşacağını öngördü\n• **Nisan 2020**: S2FX (çapraz varlık) modeli 2021 sonuna kadar 100.000-288.000 $ öngördü\n• **Floor Model**: PlanB daha sonra aylık fiyat minimumlarını öngören bir "en kötü durum" floor modeli oluşturdu\n\n**Sonuçlar:**\n\n✅ **Bitcoin Kasım 2021\'de 69.000 $\'a ulaştı** — 55K $ orijinal S2F tahminini aştı\n\n❌ **Bitcoin 2021 döngüsünde hiç 100.000 $\'a ulaşmadı** — S2FX tahminlerinin altında kaldı\n\n❌ **Bitcoin 2022\'de 15.500 $\'a düştü** — Floor modelinin tahminlerini bir yıldan fazla süreyle kırdı\n\n**PlanB\'nin Mevcut Tutumu (2024-2026):**\nPlanB modelin sınırlamalarını kabul etti ancak S2F\'nin **uzun vadeli ilişkiyi** yakaladığını savunuyor:\n• Kısa vadeli sapmalar gürültüdür\n• Modelin doğruluğu aylık değil tam döngüler üzerinde değerlendirilmelidir\n• Dış faktörler (Fed politikası, düzenleme) geçici sapmalara neden olabilir\n• Bitcoin\'in S2F > altının S2F sonunda fiyatlarda yansıtılacaktır\n\n**Mevcut Döngü için S2F Fiyat Etkileri (2024-2028):**\n~118 S2F oranıyla model, **100.000-200.000 $ aralığında** adil değer öneriyor.'
    },
    {
      id: 's2f-2024-sonrasi',
      heading: '2024 Yarılanması Sonrası S2F',
      content: '**Nisan 2024 yarılanması** Bitcoin\'in blok ödülünü 6,25\'ten 3,125 BTC\'ye düşürdü, S2F oranını yaklaşık **118**\'e itti — altının oranının neredeyse iki katı.\n\n**Arz Matematiği:**\n• **Yeni günlük Bitcoin**: ~450 BTC (yarılanma öncesi ~900\'den düştü)\n• **Yeni yıllık Bitcoin**: ~164.000 BTC (~328.000\'den düştü)\n• **S2F oranı**: ~118 (~57\'den yükseldi)\n• **Enflasyon oranı**: yıllık ~%0,85 (~%1,7\'den düştü)\n\n**Tarihsel Yarılanma Sonrası Performans:**\n\n| Yarılanma | Sonraki S2F Oranı | Zirve Fiyatı (Döngü) | Zirveye Süre |\n|---------|-----------------|-------------------|-------------|\n| 2012 (1.) | ~10 | 1.163 $ | 365 gün |\n| 2016 (2.) | ~25 | 19.783 $ | 526 gün |\n| 2020 (3.) | ~54 | 69.044 $ | 546 gün |\n| 2024 (4.) | ~118 | ~108.000 $ (şimdiye kadar) | ~240+ gün |\n\n**Mevcut Döngü Gözlemleri:**\n• Bitcoin 2024 yarılanmasından aylar sonra yeni tüm zamanların en yüksek seviyelerine ulaştı — önceki döngülerden daha hızlı\n• [Bitcoin ETF\'lerinin](/tr/ogrenin/bitcoin-etf-karsilastirma-ibit-fbtc-arkb) varlığı talep dinamiklerini temelden değiştirdi\n• Fiyat aksiyonu önceki yarılanma sonrası rallilerinden daha az volatil olmuştur\n\n**S2F Model Beklentileri:**\n118 S2F oranına göre, model Bitcoin\'in "adil değerinin" bu döngünün sonuna kadar **150.000-250.000 $ aralığında** olduğunu öneriyor. Ancak modelin belirli fiyat hedefleri konusundaki sicili karışıktır.'
    },
    {
      id: 'elestiri-sinirlamalar',
      heading: 'Eleştiriler ve Sınırlamalar',
      content: 'Stok-Akış modeli ekonomistler, tüccarlar ve hatta diğer Bitcoin analistlerinden önemli eleştiriler aldı.\n\n**Temel Eleştiriler:**\n\n• **Talep göz ardı edilir**: S2F sadece arz kıtlığını modeller, ancak fiyat arz VE talep tarafından belirlenir. Talebi olmayan kıt bir varlık değersizdir.\n• **Döngüsel mantık**: Model kıtlık → değer varsayar, ancak bu ilişki dijital varlıklar için otomatik değildir\n• **Karşılaştırılabilir varlık yok**: Altının S2F-fiyat ilişkisini geliştirmesi binlerce yıl aldı\n• **Sonsuza gidemez**: Model sonsuza dek üstel artan fiyatları ima eder, bu matematiksel olarak imkânsızdır\n\n**İstatistiksel Eleştiriler:**\n\n• **Eş bütünleşme sorunları**: Hem S2F hem de fiyat için zaman serisi verileri durağan değildir, bu da regresyonu potansiyel olarak sahte yapar\n• **Aşırı uyum**: Model sınırlı tarihsel verilere uyduruldu ve gelecekteki koşullara genellenmeyebilir\n• **Model seçimi yanlılığı**: Diğer modeller ([Güç Yasası](/tr/hesaplayicilar/bitcoin-guc-yasasi) gibi) farklı teorik temellerle benzer veya daha iyi uyumlar gösterir\n\n**Pratik Başarısızlıklar:**\n\n• **2022 başarısızlığı**: Bitcoin 12 aydan fazla süreyle S2F model tahminlerinin altında kaldı\n• **Floor model geçersiz kılındı**: PlanB\'nin floor modeli uzun süreler ihlal edildi\n\n**Savunucuların Yanıtı:**\n\n• S2F uzun vadeli bir modeldir; kısa vadeli sapmalar beklenir\n• Dış şoklar (Fed politikası, FTX çöküşü) geçici çıkmalara neden oldu\n• Model birden fazla döngüde genel yönü doğru tanımladı\n\n**En İyi Uygulama:**\n\nS2F\'yi kesin fiyat tahmincisi olarak değil **birçok girdiden biri** olarak kullanın. Şunlarla birleştirin:\n• Zaman tabanlı regresyon için [Güç Yasası modeli](/tr/hesaplayicilar/bitcoin-guc-yasasi)\n• Talep tarafı sinyalleri için zincir üzeri metrikler\n• Duyarlılık bağlamı için [Korku & Açgözlülük Endeksi](/tr/hesaplayicilar/bitcoin-korku-acgozluluk)\n\nS2F modelinin değeri tam fiyat tahminlerinden ziyade **kıtlığın kavramsal anlayışında** yatar.',
      cta: { calculatorId: 'on-chain', calculatorName: 'Zincir Üzeri Metrik Paneli', text: 'Bitcoin zincir üzeri verilerini ve piyasa göstergelerini takip edin', path: '/tr/hesaplayicilar/bitcoin-stok-akis' }
    }
  ],
  expertQuote: {
    quote: 'Stok-akış kıtlığı tanımlar ve kıtlık değeri yönlendirir. Model Bitcoin\'in yarılama kaynaklı arz şokunu yakaladı — ancak hiçbir model her piyasayla temasta hayatta kalmaz.',
    author: 'PlanB',
    role: 'Takma adlı analist ve S2F yaratıcısı',
    source: 'https://medium.com/@100trillionUSD/modeling-bitcoins-value-with-scarcity-91fa0fc03e25',
    sourceLabel: 'medium.com/@100trillionUSD',
  },
};

export default article;
