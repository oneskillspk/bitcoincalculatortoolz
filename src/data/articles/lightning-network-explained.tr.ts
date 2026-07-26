import { Article } from '../articles';

const article: Article = {
  slug: 'lightning-network-aciklamasi',
  title: 'Lightning Network Açıklaması: 2026\'da Anında Bitcoin Ödemeleri',
  metaDescription: 'Lightning Network, ödemeleri saniyeden kısa sürede ve cent\'in kesirleri karşılığında hallden bir Bitcoin ikinci katmanıdır. Kanallar, yönlendirme ve likidite nasıl çalışır?',
  category: 'Basics',
  publishedDate: '2026-07-26',
  updatedDate: '2026-07-26',
  readingTime: 7,
  keywords: ['lightning network nedir', 'lightning network açıklaması', 'bitcoin ikinci katman', 'lightning ödemeleri', 'lightning kanalları'],
  relatedCalculators: ['lightning', 'transaction-fees', 'bitcoin-converter'],
  relatedArticles: ['bitcoin-islem-ucretleri-aciklamasi', 'bitcoin-satoshi-nedir', 'bitcoin-yarilanmasi-nedir'],
  quickAnswer: 'Lightning Network, önceden fonlanmış ödeme kanalları aracılığıyla ödemeleri zincir dışında taşıyan bir Bitcoin ikinci katman protokolüdür. Transferleri bir saniyeden kısa sürede ve cent altı ücretlerle gerçekleştirir, ardından son bakiyeyi ana zincire kaydeder — böylece Bitcoin, temel katmanı değiştirmeden günlük harcama için gerekli hızı kazanır.',
  faqs: [
    { question: 'Lightning Network nedir?', answer: 'Lightning Network, Bitcoin üzerine kurulu bir ödeme katmanıdır. İki taraf, zincir üzeri BTC ile fonlanmış paylaşımlı bir "kanal" açar ve ardından sınırsız anlık ödemeyi zincir dışında yapar. Yalnızca açılış ve kapanış işlemleri ana blok zincirine dokunur, bu nedenle ücretler sıfıra yakındır.' },
    { question: 'Lightning, zincir üzeri Bitcoin\'den daha güvenli mi?', answer: 'Lightning, Bitcoin\'in temel katman güvenliğini miras alır ama kanal yönetim riski ekler: bir tarafın eski kanal durumunu yayınlamasını tespit etmek için çevrimiçi olmanız (veya bir watchtower kullanmanız) gerekir. Günlük nakit tutarları için bu makul; büyük birikim için soğuk cüzdanda zincir üzeri tutun.' },
    { question: 'Bir Lightning ödemesi ne kadara mal olur?', answer: 'Yönlendirme ücretleri tipik olarak 1 satoshi + tutarın %0,01\'idir — 100 $\'lık bir ödeme için genellikle 0,01 $\'ın çok altında. Kanal açma veya kapama hâlâ normal zincir üzeri ücret gerektirir, bu yüzden Lightning en ucuz bir kanalı açık tutup tekrar kullandığınızda olur.' },
    { question: 'Kendi Lightning düğümümü çalıştırmam gerekiyor mu?', answer: 'Hayır. Emanet cüzdanlar (Wallet of Satoshi, Cash App) karmaşıklığı gizler. Kendinden emin olmayan mobil cüzdanlar (Phoenix, Muun, Breez) sizin için hafif bir düğüm çalıştırır. Tam egemenlik kendi düğümünüzü (Umbrel, Start9, Voltage) çalıştırmayı gerektirir.' },
  ],
  sections: [
    { id: 'nasil-calisir', heading: 'Lightning Network Nasıl Çalışır', content: 'Lightning, **ödeme kanalları** kullanır — iki katılımcı tarafından zincir üzerinde fonlanmış 2/2 çoklu imza adresleri. Açıldıktan sonra her iki taraf da bakiye durumlarını zincir dışında imzalar; her yeni imza bir öncekini geçersiz kılar. Her iki taraf da son durumu istediği zaman blok zincirine yayınlayabildiğinden kanal güvenilirsizdir.\n\nBir yabancıya ödeme yaptığınızda ödemeniz, alıcıya ulaşana kadar bağlı kanallar üzerinden **yönlendirilir**. Hash Kilitli Zaman Sözleşmeleri (HTLC), tam ödemenin başarılı olmasını veya her sıçramanın geri ödeme yapmasını garanti eder.\n\n2026 ortası itibarıyla kamu Lightning Network\'ünde yaklaşık 50.000 kanal boyunca ~5.300 BTC yönlendirilebilir kapasite vardır.' },
    { id: 'ucret-hiz', heading: 'Ücretler, Hız ve Gerçek Dünya Kullanımı', content: 'Tipik bir Lightning ödemesi **bir saniyeden kısa sürede** yerleşir ve **birkaç sat\'a** mal olur — çoğu zaman zincir üzeri ücretin 1/1000\'inden az. 50 $\'lık bir kahve ödemesini karşılaştırın:\n\n| Katman | Ücret | Onay |\n|---|---|---|\n| Zincir üzeri BTC (hızlı) | 2–8 $ | 10–30 dakika |\n| Zincir üzeri BTC (ekonomi) | 0,50–2 $ | 1–24 saat |\n| Lightning | < 0,01 $ | < 1 saniye |\n\nEl Salvador\'un Chivo cüzdanı, Strike ve Cash App, sınır ötesi havaleler için Lightning kullanır. ABD\'den Latin Amerika\'ya 200 $\'lık transfer Lightning\'de kuruşa mal olur; Western Union\'da 10–20 $.', cta: { calculatorId: 'lightning', calculatorName: 'Lightning vs Zincir Üzeri Ücret Hesaplayıcı', text: 'Herhangi bir tutar için Lightning ücretlerini zincir üzeri Bitcoin ücretleriyle karşılaştırın', path: '/calculators/lightning' } },
    { id: 'kanallar-likidite', heading: 'Kanallar, Likidite ve Gelen Kapasite', content: 'Bir kanalın iki tarafı vardır: **giden likiditeniz** (gönderebileceğiniz) ve **gelen likiditeniz** (alabileceğiniz). Yeni cüzdanların genellikle sıfır gelen likiditesi vardır — biri size kanal açana veya Lightning Loop ya da Amboss Magma\'dan gelen kapasite satın alana kadar ödeme alamazsınız.\n\nModern cüzdanlar (Phoenix, Breez) bunu otomatikleştirir: ilk ödemeyi aldığınızda zincir üzeri ücreti gelen tutardan düşerek bir kanal açar. İleri düzey kullanıcılar likiditeyi yönlendirme ücreti kazanmak veya harcama maliyetini düşürmek için elle yönetir.' },
    { id: 'riskler-sinirlar', heading: 'Riskler ve Lightning\'in Olmadığı Şeyler', content: 'Lightning, zincir üzeri Bitcoin\'in yerini almaz — onu tamamlar. Önemli takaslar:\n\n• **Çevrimiçi zorunluluğu.** Hile yapan tarafı cezalandırmak için siz (veya bir watchtower) çevrimiçi olmalısınız.\n• **Kanal kapasitesi sınırları.** Bir kanal, tek yönde bakiyesinden fazlasını yönlendiremez. Çok büyük ödemeler hâlâ zincir üzerini tercih eder.\n• **Kolay cüzdanlarda emanet riski.** Wallet of Satoshi ve Cash App anahtarlarınızı tutar — fonları dondurabilirler. Bunları yalnızca harcama parası için kullanın.\n• **Yönlendirme hataları.** Ödemeler bazen zayıf likiditeye sahip hedeflerde başarısız olur.\n\nGünlük kahve, bahşiş ve havale için Lightning üretime hazırdır. Uzun vadeli stoğunuz için zincir üzeri soğuk depolama hâlâ standarttır.' },
  ],
  howToSteps: [
    { name: 'Lightning cüzdanı seçin', text: 'Kolaylık ve self-custody dengesi için Phoenix, Breez veya Muun gibi kendinden emanet olmayan bir cüzdan seçin.' },
    { name: 'Cüzdanı fonlayın', text: 'Cüzdanın yatırma adresine zincir üzeri BTC gönderin. Cüzdan ilk kullanımda otomatik olarak bir Lightning kanalı açar.' },
    { name: 'Fatura oluşturun veya tarayın', text: 'Her Lightning ödemesi tek kullanımlık bir fatura (BOLT11) veya statik bir Lightning Adresi (kullanici@alanadi.com) kullanır.' },
    { name: 'Onaylayın ve yerleşin', text: 'Ödeme ağ üzerinden yönlendirilir ve bir saniyeden kısa sürede yerleşir. Onay gerekmez.' },
    { name: 'Büyüdükçe likiditeyi yönetin', text: 'Büyük düzenli alımlar için Loop, Magma veya cüzdan sağlayıcınızdan ücretli kanalla gelen likidite ekleyin.' },
  ],
  expertQuote: {
    quote: 'Lightning Network, Bitcoin\'in ölçeklenme sorusunun cevabıdır — temel katmanı büyüterek değil, küçük ödemeleri ondan uzaklaştırarak.',
    author: 'Elizabeth Stark',
    role: 'CEO, Lightning Labs',
    source: 'https://lightning.engineering/posts/2018-03-15-lnd-0.4-beta/',
    sourceLabel: 'Lightning Labs sürüm notları',
  },
  speakable: true,
};

export default article;
