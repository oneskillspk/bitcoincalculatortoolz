import { Article } from '../articles';

/** TR counterpart of `bitcoin-wealth-distribution` → `/tr/ogrenin/bitcoin-servet-dagilimi`. */
const article: Article = {
  slug: 'bitcoin-servet-dagilimi',
  title: 'Bitcoin Servet Dağılımı: Küresel Sıralamada Neredesiniz?',
  metaDescription:
    'Bitcoin adreslerinin %0,03\'ü 100+ BTC tutar — ama arzın %60+\'sını kontrol eder. Balinaları, ETF\'leri ve kurumsalları karşılaştırın ve küresel sıralamadaki yerinizi bulun.',
  category: 'Market Analysis',
  publishedDate: '2026-03-09',
  updatedDate: '2026-05-18',
  readingTime: 9,
  keywords: ['bitcoin servet dağılımı', 'en çok bitcoin kim sahip', 'bitcoin balina cüzdanları', 'bitcoin zenginler listesi', 'bitcoin sahiplik istatistikleri 2026'],
  relatedCalculators: ['wealth-percentile', 'supply', 'dominance'],
  relatedArticles: [
    'yasa-gore-ne-kadar-bitcoin',
    'ne-kadar-bitcoin-sahibi-olmaliyim',
    'bitcoin-dominansi-aciklamasi',
    'bitcoin-satoshi-nedir',
  ],
  faqs: [
    { question: 'Kaç kişi en az 1 tam Bitcoin\'e sahip?', answer: '2026 başı itibarıyla yaklaşık 1,1 milyon Bitcoin adresi 1 BTC veya daha fazla tutuyor. Ancak gerçek kişi sayısı muhtemelen daha düşüktür çünkü bir kişi birden fazla adres kontrol edebilir.' },
    { question: '2026\'da en çok Bitcoin\'e kim sahip?', answer: 'En büyük bilinen tutucu, hiç hareket etmemiş tahmini 1,1 milyon BTC ile Satoshi Nakamoto\'dur. Kurumlar arasında BlackRock\'ın IBIT\'i 550.000+ BTC, MicroStrategy ~450.000 BTC tutar.' },
    { question: 'Ne kadar Bitcoin kalıcı olarak kayboldu?', answer: 'Araştırmalar 3-4 milyon BTC\'nin unutulan şifreler, kaybolan donanım cüzdanları ve hareket etmeyen erken madencilik coinleri nedeniyle kalıcı olarak kaybolduğunu gösteriyor — toplam arzın yaklaşık %15-20\'si.' },
    { question: 'Hangi Bitcoin servet yüzdelik diliminde olurum?', answer: 'Sadece 0,01 BTC sahibi olmak küresel tüm Bitcoin tutucularının yaklaşık ilk %20\'sine yerleştirir. 0,1 BTC ilk %5\'e, 1 tam BTC ise ilk %1\'e yerleştirir.' },
  ],
  howToSteps: [
    { name: 'Toplam BTC tutuşlarınızı kontrol edin', text: 'Borsa, donanım cüzdanı ve yazılım cüzdanlarındaki tüm Bitcoin\'i toplayın' },
    { name: 'Adres dağılım kademelerini anlayın', text: 'Bitcoin adresleri karides (<1 BTC), yengeç (1-10), balık (10-100), köpekbalığı (100-1.000) ve balina (1.000+) kategorilere ayrılır' },
    { name: 'Servet Yüzdelik Hesaplayıcısını kullanın', text: 'Toplam BTC tutuşlarınızı girerek küresel sıralamanızı görün' },
    { name: 'Küresel sahiplik verisiyle karşılaştırın', text: 'Glassnode ve BitInfoCharts gibi kaynaklardan on-chain verileri inceleyin' },
    { name: 'Kayıp ve likit olmayan arzı hesaba katın', text: '3-4 milyon BTC\'nin kalıcı olarak kayıp olduğunu hatırlayın; etkin arz daha küçüktür' },
  ],
  sections: [
    {
      id: 'kuresel-sahiplik',
      heading: 'Küresel Bitcoin Sahiplik Genel Bakış',
      content: '2026 başı itibarıyla **460 milyondan fazla Bitcoin adresi** bir noktada BTC almıştır, ancak yalnızca **50 milyon adres** sıfır olmayan bakiye tutar. Veriyi [BitInfoCharts](https://bitinfocharts.com/top-100-richest-bitcoin-addresses.html) ve [Glassnode](https://glassnode.com/) üzerinde inceleyebilirsiniz.\n\nKüresel Bitcoin benimsenmesi tahmini **300-400 milyon kişi**, yani dünya nüfusunun %4-5\'i. Ancak sahiplik son derece yoğunlaşmış: Adreslerin ilk %2\'si tüm Bitcoin\'in yaklaşık **%95\'ini** kontrol ediyor.\n\nBu yoğunlaşma biraz yanıltıcıdır. Büyük adreslerin çoğu Coinbase, Binance, Kraken gibi **borsalara** aittir; milyonlarca bireysel kullanıcı adına coin tutarlar.',
    },
    {
      id: 'adres-dagilimi',
      heading: 'Adres Dağılımı Dökümü',
      content: '2026 başı on-chain verilerine göre tier dağılımı:\n\n| Kademe | Bakiye | Adresler | % Toplam | BTC | % Arz |\n|--------|--------|----------|----------|-----|-------|\n| Plankton | < 0,001 BTC | ~30M | %60 | ~8.000 | %0,04 |\n| Karides | 0,001 – 1 BTC | ~16M | %32 | ~1,8M | %9,1 |\n| Yengeç | 1 – 10 BTC | ~900K | %1,8 | ~2,8M | %14,2 |\n| Balık | 10 – 100 BTC | ~150K | %0,3 | ~4,5M | %22,8 |\n| Köpekbalığı | 100 – 1.000 BTC | ~15K | %0,03 | ~4,2M | %21,3 |\n| Balina | 1.000 – 10.000 BTC | ~2.100 | %0,004 | ~4,8M | %24,3 |\n| Mega Balina | > 10.000 BTC | ~120 | %0,0002 | ~1,6M | %8,1 |\n\nVeri çarpıcı bir gerçeği ortaya koyuyor: **1 BTC\'den az tutan adresler tüm adreslerin %92\'sini temsil ediyor ancak yalnızca %9\'unu kontrol ediyor**. Bu arada 1.000+ BTC tutan ~2.200 balina adresi tüm Bitcoin\'in **%32\'sinden fazlasını** kontrol ediyor.',
      cta: { calculatorId: 'wealth-percentile', calculatorName: 'Servet Yüzdelik Hesaplayıcısı', text: 'Bitcoin servet yüzdelik diliminizi öğrenin', path: '/tr/hesaplayicilar/bitcoin-servet-yuzdesi' },
    },
    {
      id: 'en-buyuk-tutucular',
      heading: 'En Büyük Bitcoin Tutucular: Satoshi, Şirketler ve ETF\'ler',
      content: 'En büyük tutucuların kimliği Ocak 2024\'te spot Bitcoin ETF\'lerinin lansmanından bu yana dramatik biçimde değişti. 2026 başı itibarıyla:\n\n**Bireysel/Pseudonymous:**\n• **Satoshi Nakamoto**: ~1,1 milyon BTC (tahmini, hiç hareket etmedi)\n• **Winklevoss İkizleri**: ~70.000 BTC\n• **Tim Draper**: ~29.000 BTC\n\n**Kurumsal:**\n• **MicroStrategy (MSTR)**: ~450.000 BTC — Michael Saylor liderliğinde en büyük kurumsal tutucu\n• **Tesla**: ~9.700 BTC\n• **Block (eski Square)**: ~8.000 BTC\n\n**ETF\'ler ve Fonlar:**\n• **BlackRock IBIT**: ~550.000 BTC\n• **Fidelity FBTC**: ~210.000 BTC\n• **Grayscale GBTC**: ~190.000 BTC\n• **ARK 21Shares ARKB**: ~55.000 BTC\n\n**Hükümetler:**\n• **ABD**: ~200.000 BTC (Silk Road el koymalarından)\n• **Çin**: ~190.000 BTC (PlusToken Ponzi el koyması)\n• **El Salvador**: ~6.000 BTC (ulusal hazine alımları)',
    },
    {
      id: 'balina-vs-perakende',
      heading: 'Balina vs Perakende Analizi',
      content: '**Balina davranışı** en yakından izlenen on-chain metriklerden biridir. Balinalar biriktirdiğinde, gelecekteki yüksek fiyatlara olan güveni işaret eder. Dağıttıklarında düzeltmelerden önce gelebilir.\n\n2025-2026 gözlemleri:\n\n• **Balina birikimi** 2024 yarılanmasından sonra hızlandı; 1.000+ BTC tutan adresler Q3-Q4 2025\'te ~200.000 BTC ekledi\n• **Perakende katılım** (< 1 BTC adresleri) yıl bazında %15 büyüdü\n• **Borsa bakiyeleri** 2018\'den bu yana en düşük seviye olan 2 milyon BTC\'nin altına düştü — daha fazla tutucu self-custody\'ye geçiyor\n\n**Balina-perakende oranı** piyasa döngüsü konumu hakkında içgörü sağlar.',
    },
    {
      id: 'kayip-bitcoin',
      heading: 'Kayıp Bitcoin\'in Kıtlık Üzerindeki Etkisi',
      content: 'Bitcoin\'in **21 milyon coin sabit tavanı** iyi biliniyor, ancak etkin arz önemli ölçüde daha küçüktür. Chainalysis ve Glassnode araştırmaları **3-4 milyon BTC\'nin kalıcı olarak kayıp** olduğunu tahmin ediyor.\n\nKayıp Bitcoin kaynakları:\n\n• **Satoshi\'nin coinleri**: ~1,1 milyon BTC hiç hareket etmedi\n• **Erken madenci coinleri**: Pek çok erken madenci bilgisayarlarını formatladı. James Howells\'in Galler çöplüğünde 8.000 BTC kaybetmesi tek örnek\n• **Unutulan cüzdanlar**: 2013 öncesi küçük miktarlarda Bitcoin alan kullanıcılar genellikle erişimi kaybetti\n• **Yakım adresleri**: Bazı BTC kasıtlı olarak harcanamaz adreslere gönderildi\n\nKayıp coinleri çıkardığınızda **etkin dolaşımdaki arz yaklaşık 15,8-16,8 milyon BTC\'ye** düşer.',
      cta: { calculatorId: 'supply', calculatorName: 'Arz ve Kıtlık Hesaplayıcısı', text: 'Bitcoin arz ve kıtlık metriklerini keşfedin', path: '/tr/hesaplayicilar/bitcoin-arz' },
    },
    {
      id: 'nerede-siralanirsiniz',
      heading: 'Siz Nerede Sıralanıyorsunuz?',
      content: 'Bitcoin servetinin aşırı yoğunlaşması ve önemli miktarda kayıp arz göz önüne alındığında, mütevazı tutuşlar bile sizi beklediğinizden daha yükseğe yerleştirir:\n\n• **0,001 BTC** (~85$): Tüm sıfır olmayan adreslerin ilk %40\'ı\n• **0,01 BTC** (~850$): Tutucuların ilk %20\'si\n• **0,1 BTC** (~8.500$): Tüm Bitcoin adreslerinin ilk %5\'i\n• **0,28 BTC**: Toplam arzın 1 milyonda birinden fazlasına sahipsiniz\n• **1 BTC** (~85.000$): İlk %1 — 1,1 milyondan az adres bu kadar tutuyor\n• **6,15 BTC**: Etkin arzın 1 milyonda birinden fazla\n• **10 BTC**: İlk %0,3 — "balık" kademesi ve üstü\n\nKüresel benimsenme hâlâ %5\'in altında. Bitcoin kullanıcı tabanı 400 milyondan 1 milyar+\'a büyüdükçe küçük tutuşlardaki kıtlık primi bile dramatik biçimde artacak.',
    },
  ],
};

export default article;
