import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-seed-phrase-yedekleme',
  title: 'Bitcoin Seed Phrase Yedekleme: 12/24 Kelimeyi Doğru Şekilde Saklama',
  metaDescription: 'Bitcoin seed cümleniz coin\'lerinizin ana anahtarıdır. Çelik üzerine nasıl yedekleneceğini, Shamir veya çoklu imzayla nasıl bölüneceğini ve 5 yaygın hatayı öğrenin.',
  category: 'Basics',
  publishedDate: '2026-07-26',
  updatedDate: '2026-07-26',
  readingTime: 7,
  keywords: ['bitcoin seed phrase yedekleme', 'seed cümlesi saklama', '24 kelime seed', 'BIP-39 yedekleme', 'bitcoin kurtarma cümlesi'],
  relatedCalculators: ['portfolio-tracker', 'stack-sats'],
  relatedArticles: ['bitcoin-soguk-cuzdan-rehberi', 'bitcoin-hesaplayici-karsilastirma'],
  quickAnswer: 'Bitcoin seed cümlesi, cüzdanınızdaki her özel anahtarı yeniden üreten 12 veya 24 kelimedir. Yangın ve suya dayanıklı çelik üzerinde yedekleyin — asla dijital olarak değil. 100.000 $\'ın üzerindeki bakiyeler için seed\'i Shamir Secret Sharing ile birden fazla konuma bölün veya tek bir yedeğin kaybı coin\'leri kaybettirmeyen 2/3 çoklu imza kurulumuna geçin.',
  faqs: [
    { question: 'Bitcoin seed cümlesi nedir?', answer: 'Seed cümlesi (kurtarma cümlesi veya mnemonic olarak da bilinir), BIP-39 standardıyla tanımlanmış 12 veya 24 kelimelik okunabilir bir listedir. Bu kelimeler, cüzdanınızdaki her adresi, anahtarı ve bakiyeyi yeniden üretebilen ana özel anahtarı kodlar. Seed cümlesine sahip olan herkes coin\'leri kontrol eder — PIN, borsa girişi veya donanım cüzdanı gerekmez.' },
    { question: 'Seed cümlemi kâğıda mı çeliğe mi saklamalıyım?', answer: 'Çelik. Kâğıt yanar, yırtılır, küflenir ve solar. Yangın ve suya dayanıklı çelik plakalar (Cryptosteel Capsule, Blockstream Jade, Seedplate) ev yangınlarından ve sellerden sağ çıkar ve hobiden fazla tutarlar için profesyonel standarttır.' },
    { question: 'Seed cümlemi ikiye bölmek güvenli mi?', answer: 'Hayır. 24 kelimelik bir seed\'i ikiye bölmek güvenliği iki katına çıkarmaz — yarıya indirir; çünkü bir yarımı bulan saldırganın diğer 12 kelimeyi kaba kuvvetle bulması yeterlidir. Bunun yerine Shamir Secret Sharing (SLIP-39) veya çoklu imza kullanın. İkisi de güvenli bölme için kriptografik olarak tasarlanmıştır.' },
    { question: 'Seed cümlemi şifre yöneticisinde saklayabilir miyim?', answer: 'Anlamlı tutarlar için hayır. Şifre yöneticileri, ihlal geçmişi olan çevrimiçi sistemlerdir (LastPass 2022). Soğuk depolamayı sıcak depolamaya dönüştürürler. Kolaylık için bir seed\'i dijitalleştirmek zorundaysanız, ezberlediğiniz bir parola ile şifreleyin ve sıcak cüzdan seviyesinde risk olarak değerlendirin.' },
  ],
  sections: [
    { id: 'seed-nedir', heading: 'Seed Cümlenizin Gerçekte Ne Temsil Ettiği', content: 'Modern bir Bitcoin cüzdanı kurduğunuzda cihaz size 12 veya 24 İngilizce kelime gösterir. Bu kelimeler bir şifre değildir — ana özel anahtarınızı üreten matematiksel seed\'in kompakt bir kodlamasıdır. Bu anahtardan cüzdan milyarlarca adres ve bunların imzalama anahtarlarını türetir.\n\nSeed her şeyin kökü olduğundan, onu elinde tutan herkes cüzdandaki her geçmiş ve gelecek adresi kontrol eder. Seed\'i kaybetmek = ona bağlı her satoshi\'yi kaybetmek. Seed\'i bir yabancıya kopyalamak = cüzdanınızı onlara teslim etmek.' },
    { id: 'yedek-ortami', heading: 'Doğru Yedekleme Ortamını Seçmek', content: 'Yedekleme ortamlarını hayatta kaldıkları tehditlere göre sıralayın:\n\n| Ortam | Yangın | Su | Zaman | Maliyet |\n|---|---|---|---|---|\n| Elle yazılmış kâğıt | Hayır | Hayır | 20+ yıl (kuru) | Ücretsiz |\n| Lamine kâğıt | Hayır | Evet | 30+ yıl | 5 $ |\n| Damgalanmış çelik plaka | Evet | Evet | 100+ yıl | 60–150 $ |\n| Titanyum (özel) | Evet | Evet | 500+ yıl | 200 $+ |\n| Dijital (fotoğraf, bulut) | Yok | Yok | Herhangi ihlal | Ücretsiz ama riskli |\n\nRutin bir ev yangınında kaybetmek istemediğiniz her bakiye için çelik minimum standarttır. İki ayrı konumda saklanan iki özdeş çelik kopya her tek kopya seçeneğine üstündür.', cta: { calculatorId: 'portfolio-tracker', calculatorName: 'Bitcoin Portföy Takipçisi', text: 'Yedeklenmiş cüzdanlarınızın izlenen bakiyenizle eşleştiğini doğrulayın', path: '/calculators/portfolio-tracker' } },
    { id: 'guvenli-bolme', heading: 'Bir Seed\'i Güvenle Bölme (Shamir ve Çoklu İmza)', content: 'Daha büyük bakiyeler için tek konumlu yedekler risklidir. Bölmenin iki güvenli yolu:\n\n**Shamir Secret Sharing (SLIP-39)** — Trezor Model T ve Keystone, seed\'inizi N paya bölmenizi destekler; herhangi M pay geri yükleyebilir (örn. 3\'ün 2\'si). Her pay tek başına işe yaramaz.\n\n**Çoklu imza (2/3 veya 3/5)** — Tek seed\'i bölmek yerine üç donanım cüzdanında üç bağımsız seed oluşturun. Herhangi ikisi bir işlemi imzalayabilir; birini kaybetmek coin\'leri kaybettirmez. Yüksek net değerli stoklar için Casa, Unchained ve öz-emanet savunucularının kullandığı standarttır. Tam adım adım anlatım için [soğuk cüzdan rehberimize](/tr/ogrenin/bitcoin-soguk-cuzdan-rehberi) bakın.' },
    { id: 'bes-hata', heading: 'Kaçınılması Gereken Beş Yedekleme Hatası', content: 'Her yıl gerçek insanlar bu hatalarla gerçek Bitcoin kaybediyor:\n\n1. **Seed\'i fotoğraflama.** Bulut senkronizasyonu onu Apple/Google/Meta sunucularına yükler.\n2. **"Sadece kendine" e-postalama.** E-posta sağlayıcılar çevrimiçi, dizinli ve hacklenebilir.\n3. **Seed\'i donanım cüzdanıyla birlikte saklama.** Tek konumlu bir hırsızlık her şeyi kaybettirir.\n4. **Seed\'in yeterli olduğunu varsayma.** BIP-39 parolası (25. kelime) kullanıyorsanız onu ayrı ve aynı özenle yedekleyin.\n5. **Kurtarmayı hiç test etmeme.** Anlamlı değere güvenmeden önce cihazı silin ve yedekten en az bir kez geri yükleyin.' },
  ],
  howToSteps: [
    { name: 'Seed\'i donanım cüzdanında oluşturun', text: 'Cihazın 12 veya 24 kelimeyi çevrimdışı üretmesine izin verin. Bir seed\'i asla bilgisayara yazmayın.' },
    { name: 'Kelimeleri önce kâğıda yazın', text: 'Kelimeleri sırayla kâğıda kopyalayın. Devam etmeden önce cihazda yeniden girerek doğrulayın.' },
    { name: 'Yangına dayanıklı çelik plakaya aktarın', text: 'Kelimeleri Cryptosteel veya Seedplate çelik yedeğine damgalayın, kazıyın veya yerleştirin.' },
    { name: 'İki konumda kopya saklayın', text: 'Bir kopyayı evdeki bir kasada, ikinciyi bankada kiralık kasada veya güvenilir bir aile üyesinin kasasında tutun.' },
    { name: 'Tutar haklıysa parola ekleyin', text: 'BIP-39 parolası gizli bir cüzdan oluşturur. Parolayı seed\'den ayrı yedekleyin.' },
    { name: 'Kurtarmayı bir kez test edin', text: 'Cihazı silin ve yedeğinizden geri yükleyerek her kelimenin okunabilir ve doğru olduğunu onaylayın.' },
  ],
  expertQuote: {
    quote: 'Kurtarma cümlenizi asla hiçbir web sitesine, bilgisayara veya telefona yazmayın. Asla.',
    author: 'Trezor',
    role: 'Resmi güvenlik kılavuzu',
    source: 'https://trezor.io/support/a/recovery-seed-safety',
    sourceLabel: 'trezor.io güvenlik dokümanları',
  },
  speakable: true,
};

export default article;
