import { Article } from '../articles';

/** TR counterpart of `bitcoin-vs-gold-sp500` → `/tr/ogrenin/bitcoin-altin-sp500-karsilastirma`. */
const article: Article = {
  slug: 'bitcoin-altin-sp500-karsilastirma',
  title: 'Bitcoin vs Altın vs S&P 500: 10 Yıllık Getiri Karşılaştırması',
  metaDescription:
    'Kim kazandı — Bitcoin, Altın, yoksa S&P 500? 10 yıllık CAGR, oynaklık, düşüşler ve Sharpe oranlarını gerçek veri ve ücretsiz karşılaştırma hesaplayıcısıyla karşılaştırın.',
  category: 'Market Analysis',
  publishedDate: '2026-01-22',
  updatedDate: '2026-05-18',
  readingTime: 9,
  keywords: ['bitcoin vs altın', 'bitcoin vs s&p 500', 'bitcoin karşılaştırma', 'bitcoin cagr', 'bitcoin yıllık büyüme'],
  relatedCalculators: ['cagr', 'what-if', 'investment'],
  relatedArticles: ['bitcoin-dca-nedir', 'bitcoin-hodl-stratejisi-aciklamasi', 'bitcoin-dominansi-aciklamasi'],
  faqs: [
    { question: 'Bitcoin son 10 yılda Altın\'ı geçti mi?', answer: 'Evet, dramatik biçimde. 2016\'dan 2026\'ya Bitcoin %10.000\'in üzerinde getiri sağladı; Altın yaklaşık %80 verdi. Ancak Bitcoin çok daha yüksek oynaklık ve birden fazla %50+ düşüş yaşadı.' },
    { question: 'Bitcoin\'in CAGR\'ı S&P 500\'e göre nedir?', answer: 'Ocak 2016 - Ocak 2026 arasında Bitcoin\'in Bileşik Yıllık Büyüme Oranı (CAGR) yaklaşık %66 iken S&P 500\'ün %11, Altın\'ın %6 idi. Bitcoin en yüksek getirili büyük varlık sınıfıdır.' },
    { question: 'Bitcoin S&P 500\'den daha mı riskli?', answer: 'Bitcoin\'in oynaklığı S&P 500\'den çok daha yüksektir (~%70 vs ~%15 yıllık). Ancak 5+ yıllık dönemlerde risk ayarlı bazda Bitcoin\'in Sharpe oranı rekabetçi olmuştur.' },
    { question: 'Hisse senedi yerine Bitcoin\'e mi yatırım yapmalıyım?', answer: 'Çoğu finans danışmanı Bitcoin\'i çeşitlendirilmiş bir portföyde küçük tahsis (%1-10) olarak önerir, hisse senedi yerine değil. Optimum tahsis risk toleransınıza ve zaman ufkunuza bağlıdır.' },
    { question: 'Bitcoin Güç Yasası uzun vadeli getirileri öngörür mü?', answer: 'Fizikçi Giovanni Santostasi tarafından geliştirilen Bitcoin Güç Yasası modeli, uzun vadeli fiyat yörüngelerini benimseme eğrilerine göre yansıtır. Güçlü tarihsel doğruluk gösterse de bir modeldir, garanti değildir.' },
  ],
  sections: [
    {
      id: 'performans-genel',
      heading: '10 Yıllık Performans Genel Bakış',
      content: 'Son on yılda (2016-2026) üç büyük varlık sınıfı çok farklı getiriler sağladı:\n\n• **Bitcoin:** ~%12.000 toplam getiri (~%66 [CAGR](https://www.investopedia.com/terms/c/cagr.asp) yıllıklaştırılmış)\n• **[S&P 500](https://en.wikipedia.org/wiki/S%26P_500):** ~%180 toplam getiri (~%11 CAGR)\n• **[Altın](https://en.wikipedia.org/wiki/Gold_as_an_investment):** ~%80 toplam getiri (~%6 CAGR)\n\nBu rakamlar Bitcoin için zorlayıcı bir hikâye anlatıyor ancak tam resmi yakalamıyor. O getirilere giden yolculuk dramatik biçimde farklı risk profilleri ve düşüşler içeriyordu.',
      cta: { calculatorId: 'cagr', calculatorName: 'Bitcoin CAGR Hesaplayıcısı', text: 'Bitcoin\'in büyüme oranını Altın, S&P 500 ve Gayrimenkul ile karşılaştırın', path: '/tr/hesaplayicilar/bitcoin-yillik-buyume' },
    },
    {
      id: 'oynaklik',
      heading: 'Oynaklık ve Risk Karşılaştırması',
      content: '**Bitcoin Oynaklığı:**\n• Yıllık oynaklık: ~%65-80\n• Maksimum düşüş: -%77 (Kasım 2021 - Kasım 2022)\n• 10 yıldaki %30+ düşüş sayısı: 6\n\n**S&P 500 Oynaklığı:**\n• Yıllık oynaklık: ~%15-18\n• Maksimum düşüş: -%34 (Şubat-Mart 2020, COVID çöküşü)\n• 10 yıldaki %30+ düşüş sayısı: 1\n\n**Altın Oynaklığı:**\n• Yıllık oynaklık: ~%12-15\n• Maksimum düşüş: -%18 (2020-2022)\n• 10 yıldaki %30+ düşüş sayısı: 0\n\nBitcoin\'in oynaklığı abartılı getirilerinin bedelidir. %50-80 düşüşlere dayanabilen yatırımcılar çok yıllı dönemlerde zengin ödüllendirildi.',
    },
    {
      id: 'enflasyon-koruma',
      heading: 'Enflasyon Koruması Karşılaştırması',
      content: 'Üç varlık da enflasyon koruması olarak tartışılır ancak farklı davranır:\n\n**Altın:** Geleneksel enflasyon koruması. Yüzyıllardır satın alma gücünü korudu ancak mütevazı reel getiriler sunar. 2021-2023 enflasyon yükselişinde önce düşük performans gösterdi, sonra 2024-2025\'te güçlü ralli yaptı.\n\n**S&P 500:** Hisse senetleri genellikle uzun dönemde enflasyonun önündedir çünkü şirket gelirleri fiyatlarla büyür. Ancak stagflasyonist ortamlarda zarar görebilir.\n\n**Bitcoin:** Sıklıkla "dijital altın" olarak adlandırılan Bitcoin, herhangi bir varlıkla M2 para arzı genişlemesi arasında en güçlü korelasyonu gösterdi. Sabit [21 milyon coin arz](/tr/ogrenin/bitcoin-dca-nedir) tavanı teorik olarak en saf enflasyon koruması olmasını sağlar.',
    },
    {
      id: 'cagr-detay',
      heading: 'CAGR Detayı: Farkı Bileşik Hale Getirmek',
      content: 'CAGR (Bileşik Yıllık Büyüme Oranı), farklı zaman ufuklarında yatırım performansını karşılaştırmak için en kullanışlı metriktir. Bitcoin\'in ~%66 CAGR\'ı ile S&P 500\'ün ~%11\'i arasındaki fark zamanla dramatik biçimde bileşik hale gelir.\n\n10 yıllık dönemde her CAGR\'da **10.000$ yatırım**:\n\n| Varlık | CAGR | 10 Yıl Sonra Değer |\n|---|---|---|\n| Bitcoin | ~%66 | ~1.200.000$ |\n| S&P 500 | ~%11 | ~28.394$ |\n| Altın | ~%6 | ~17.908$ |\n| Gayrimenkul | ~%8 | ~21.589$ |\n\nTemel içgörü: Daha yüksek CAGR\'lı bir varlığa küçük bir yüzdelik tahsis bile bileşik etkisi nedeniyle uzun vadeli portföy sonuçlarını dramatik biçimde değiştirir.',
      cta: { calculatorId: 'cagr', calculatorName: 'Bitcoin CAGR Hesaplayıcısı', text: 'Kendi yatırım tutarınızı dört varlık arasında ayarlanabilir zaman ufuklarıyla modelleyin', path: '/tr/hesaplayicilar/bitcoin-yillik-buyume' },
    },
    {
      id: 'portfoy-tahsisi',
      heading: 'Optimum Portföy Tahsisi',
      content: 'Fidelity, ARK Invest ve akademik araştırmalar şunu öneriyor:\n\n• **%1-5 Bitcoin tahsisi** minimum ek portföy oynaklığıyla risk ayarlı getirileri iyileştirir\n• **%5-10 tahsis** orta riskli portföyler için Sharpe oranını maksimize eder\n• **%10 üzeri** tahsisler portföy oynaklığını önemli ölçüde artırır ve yalnızca yüksek risk toleranslı yatırımcılar için uygundur\n\n"Doğru" tahsis şunlara bağlıdır:\n1. Zaman ufku (daha uzun = daha fazla Bitcoin tolere edilebilir)\n2. Risk toleransı (-%70\'e dayanabilir misiniz?)\n3. Genel finansal durum (acil fon, borç)\n4. Bitcoin\'in uzun vadeli tezine inanç',
    },
    {
      id: 'temel-cikarimlar',
      heading: 'Temel Çıkarımlar',
      content: '1. **Bitcoin dramatik biçimde** Altın\'ı ve S&P 500\'ü geçti — ~%66 CAGR vs %11 ve %6 — ancak önemli ölçüde daha yüksek riskle.\n\n2. **Oynaklık bedeldir.** Bitcoin yatırımcıları geleneksel piyasalarda yıkıcı olacak %50+ düşüşlere hazırlıklı olmalıdır.\n\n3. **Zaman ufku her şeydir.** Bitcoin hiçbir 4 yıllık tutma döneminde negatif getiri üretmedi; sabırlı yatırımcılar için cazip. [HODL stratejisi](/tr/ogrenin/bitcoin-hodl-stratejisi-aciklamasi) hakkında daha fazlasını öğrenin.\n\n4. **Bileşikleşme CAGR farkını büyütür.** %66 vs %11\'de küçük tahsis bile uzun vadeli sonuçları büyük ölçüde değiştirir.\n\n5. **Güç Yasası tamamlayıcı çerçeve sunar.** Uzun vadeli yatırımcılar için matematiksel temelli destek ve direnç koridorları.\n\n6. **Geçmiş performans garanti değildir.** Bitcoin\'in getirileri her [yarılanma](/tr/ogrenin/bitcoin-yarilanmasi-nedir) döngüsünde varlık olgunlaştıkça azaldı.',
    },
  ],
  howToSteps: [
    { name: 'CAGR Hesaplayıcısını açın', text: 'Büyüme oranlarını karşılaştırmak için Bitcoin CAGR Hesaplayıcımızı ziyaret edin' },
    { name: 'Yatırım tutarınızı girin', text: 'Modellemek istediğiniz tutarı girin (örn. 10.000$)' },
    { name: 'Zaman ufkunuzu ayarlayın', text: 'Yatırım planınıza uyacak şekilde 1-20 yıl arası kaydırıcıyı ayarlayın' },
    { name: 'Varlıkları açıp kapatın', text: 'Bitcoin vs Altın, S&P 500 ve Gayrimenkul\'u yan yana karşılaştırın' },
    { name: 'Projeksiyon grafiğini inceleyin', text: 'Her varlığın yatırımınızı zamanla nasıl bileşik hale getirdiğini görün' },
  ],
  expertQuote: {
    quote: 'Bitcoin dijital altındır. Kendisinden önce gelen herhangi bir paradan daha sert, daha hızlı, daha akıllı ve daha güçlüdür.',
    author: 'Michael Saylor',
    role: 'Strategy Yönetim Kurulu Başkanı',
    source: 'https://www.michael.com/bitcoin',
    sourceLabel: 'michael.com',
  },
};

export default article;
