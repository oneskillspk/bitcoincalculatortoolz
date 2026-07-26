import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-soguk-cuzdan-rehberi',
  title: 'Bitcoin Soğuk Cüzdan Rehberi: BTC\'nizi Çevrimdışı Güvende Tutun (2026)',
  metaDescription: 'Soğuk depolama, Bitcoin özel anahtarlarınızı tamamen çevrimdışı tutar ve çevrimiçi saldırılardan bağışıktır. Donanım cüzdanları, hava aralıklı imzalama ve çoklu imza kurulumlarını karşılaştırın.',
  category: 'Basics',
  publishedDate: '2026-07-26',
  updatedDate: '2026-07-26',
  readingTime: 8,
  keywords: ['bitcoin soğuk cüzdan', 'soğuk depolama nedir', 'bitcoin çevrimdışı saklama', 'donanım cüzdanı kurulumu', 'cold wallet bitcoin'],
  relatedCalculators: ['portfolio-tracker', 'stack-sats', 'bitcoin-converter'],
  relatedArticles: ['bitcoin-hesaplayici-karsilastirma', 'bitcoin-seed-phrase-yedekleme', 'bitcoin-nasil-guvenli-alinir'],
  quickAnswer: 'Soğuk depolama, Bitcoin özel anahtarlarını internete hiç bağlanmamış bir cihazda tutmak demektir — genellikle bir donanım cüzdanı veya hava aralıklı bir imzalama cihazı. Tüm uzaktan saldırı yüzeyini ortadan kaldırır: bilgisayarınız tamamen ele geçirilse bile saldırgan, cihaza ve PIN\'e fiziksel erişim olmadan coin\'leri hareket ettiremez.',
  faqs: [
    { question: 'Bitcoin soğuk depolama nedir?', answer: 'Soğuk depolama, çevrimdışı kalan her türlü Bitcoin anahtar saklama yöntemidir. Anahtarlar internete hiç bağlanmamış bir cihazda oluşturulur ve işlemleri imzalar; böylece uzaktaki hacker\'lar, kötü amaçlı yazılımlar ve kimlik avı siteleri onlara ulaşamaz. Ledger, Trezor ve Coldcard gibi donanım cüzdanları en yaygın biçimdir.' },
    { question: 'Donanım cüzdanı soğuk depolamayla aynı şey mi?', answer: 'Neredeyse. Özel anahtarlar cihazdan şifresiz olarak çıkmadığı sürece bir donanım cüzdanı soğuk depolamadır. Seed cümlenizi bir bilgisayara veya telefona yazmanızı isteyen cihazlar bu garantiyi bozar. Gerçek soğuk kurulumlar işlemleri cihazın kendisinde imzalar.' },
    { question: 'Ne kadar Bitcoin soğuk cüzdanda olmalı?', answer: 'Yaygın bir kural: sonraki 30 gün içinde harcamayı veya işlem yapmayı planladığınız tutarı borsalarda veya sıcak cüzdanlarda tutun. Uzun vadeli stok, emeklilik Bitcoin\'i, miras BTC dahil geri kalan her şey soğuk depolamada olmalıdır. Yaklaşık 100.000 $\'ın üzerindeki bakiyeler için tek cihaz arıza riskini ortadan kaldırmak için çoklu imza ekleyin.' },
    { question: 'Öldüğümde soğuk cüzdanıma ne olur?', answer: 'Miras planı olmadan soğuk depolamadaki coin\'ler kaybolur. Seçenekler: banka kiralık kasada mühürlü kurtarma talimatları, güvenilir bir ortak imzacıyla çoklu imza kurulumu veya Casa Covenant ya da Unchained Inheritance gibi bir hizmet. Planı gerçek değerle güvenmeden önce küçük bir tutarla test edin.' },
  ],
  sections: [
    { id: 'neden-soguk', heading: 'Soğuk Depolama Neden Önemli', content: 'Her yıl borsa hack\'leri, SIM takasları ve kötü amaçlı yazılım kampanyaları sıcak cüzdanlarda veya emanet platformlarında coin tutan yatırımcılardan Bitcoin çalar. Chainalysis, **yalnızca 2023\'te kripto hack\'lerinden 1,7 milyar $ kayıp** olduğunu bildirdi.\n\nSoğuk depolama, tüm bu istismarların hedeflediği saldırı yüzeyini ortadan kaldırır: internete bağlı bir anahtar. Anahtar hiç çevrimiçi bir cihaza dokunmuyorsa hiçbir uzaktan saldırgan ona ulaşamaz. Kalan tek tehditler fiziksel olanlardır (hırsızlık, kayıp, hasar) — bunlara karşı savunma yedekleme ve çoklu imzayla çok daha kolaydır.' },
    { id: 'secenekler', heading: 'Soğuk Depolama Seçenekleri Karşılaştırması', content: 'Tüm soğuk depolamalar eşit değildir. Ana seçenekleri karşılaştırın:\n\n| Yöntem | Maliyet | Kolaylık | Güvenlik |\n|---|---|---|---|\n| Donanım cüzdanı (Ledger, Trezor) | 70–200 $ | Kolay | Yüksek |\n| Hava aralıklı imzacı (Coldcard, Passport) | 150–300 $ | Orta | Çok yüksek |\n| Kâğıt cüzdan | Ücretsiz | Zor | Orta |\n| Çelik seed yedek + donanım cüzdanı | 100–250 $ | Orta | Çok yüksek |\n| Çoklu imza (2/3 donanım cüzdanı) | 200–600 $ | İleri | En yüksek |\n\nÇoğu sahip için çelik seed yedeğiyle eşleştirilmiş ana akım bir donanım cüzdanı gerçekçi tehditlerin %95\'ini karşılar.', cta: { calculatorId: 'portfolio-tracker', calculatorName: 'Bitcoin Portföy Takipçisi', text: 'Soğuk depolama bakiyelerini aktif portföyünüzle birlikte takip edin', path: '/calculators/portfolio-tracker' } },
    { id: 'kurulum', heading: 'Soğuk Depolamayı Doğru Şekilde Kurma', content: 'Güvenli bir soğuk depolama kurulumu öngörülebilir bir sırayı izler:\n\n1. **Cihazı doğrudan üreticiden satın alın.** Üçüncü taraf satıcılar belgelenmiş bir tedarik zinciri saldırı vektörüdür.\n2. **Cihazın kurcalanmadığını doğrulayın.** Fabrika mühürlerini kontrol edin ve ilk açılışta firmware imzalarını onaylayın.\n3. **Seed cümlesini cihazda oluşturun — asla çevrimiçi değil.** Herhangi bir araç seed\'i bilgisayara yazmanızı isterse durun.\n4. **24 kelimeyi önce kâğıda yazın**, yeniden girerek doğrulayın, sonra çelik yedek plakaya aktarın.\n5. **Güçlü bir PIN ve isteğe bağlı olarak 25. kelime olarak bir BIP-39 parola** ayarlayın.\n6. **Küçük bir test tutarı gönderin, sonra geri gönderin** — sonra önemli bakiye taşıyın.' },
    { id: 'yaygin-hatalar', heading: 'Yaygın Soğuk Depolama Hataları', content: 'Şu başarısızlık örüntülerinden kaçının:\n\n• **Seed\'i dijital olarak saklama.** Fotoğraflar, bulut notları ve şifre yöneticileri soğuk depolamayı tekrar sıcaklaştırır.\n• **Kurtarma testini atlama.** Fonlamadan önce ikinci bir cihazda geri yüklenebildiğini doğrulayın.\n• **Yuvarlak sayılı test tutarları kullanma.** Saldırganlar bilinen test işlemlerini izler.\n• **İkinci el cihaz satın alma.** Sıfırlanmış cihazlar bile değiştirilmiş olabilir.\n• **Adres geçmişini herkese açık paylaşma.** Soğuk depolama anahtarları korur, gizliliği değil.\n• **Parolayı unutma.** BIP-39 parolası kurtarılamaz.' },
  ],
  howToSteps: [
    { name: 'Satıcıdan donanım cüzdanı satın alın', text: 'Ledger, Trezor, Coldcard veya Passport\'u doğrudan üreticinin resmi sitesinden sipariş edin.' },
    { name: 'Başlatın ve yeni bir seed oluşturun', text: '12 veya 24 kelimelik yeni bir seed cümlesi oluşturmak için cihaz üzerindeki kurulumu takip edin.' },
    { name: 'Seed\'i çelik üzerine yedekleyin', text: 'Seed\'i yangın ve suya dayanıklı bir çelik plaka üzerine damgalayın; cihazdan ayrı bir yerde saklayın.' },
    { name: 'Güçlü bir PIN ve isteğe bağlı parola ayarlayın', text: '6–8 haneli bir PIN kullanın ve gizli bir cüzdan için BIP-39 parolası eklemeyi düşünün.' },
    { name: 'Fonlamadan önce kurtarmayı test edin', text: 'Cihazı silin ve seed\'den geri yükleyerek yedeğin çalıştığını onaylayın.' },
    { name: 'Küçük bir test tutarı gönderin', text: 'Küçük bir tutar gönderin, adresi doğrulayın, sonra uzun vadeli stoğunuzu taşıyın.' },
  ],
  expertQuote: {
    quote: 'Anahtarlarınız değilse, coin\'leriniz değil. Soğuk depolama, borsadan bir IOU değil, gerçekten Bitcoin\'e sahip olmanın yoludur.',
    author: 'Andreas M. Antonopoulos',
    role: 'Mastering Bitcoin yazarı',
    source: 'https://github.com/bitcoinbook/bitcoinbook',
    sourceLabel: 'Mastering Bitcoin (açık kaynak)',
  },
  speakable: true,
};

export default article;
