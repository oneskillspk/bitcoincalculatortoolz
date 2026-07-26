import { Article } from '../articles';

const article: Article = {
  slug: 'coinbase-kraken-karsilastirma-2026',
  title: 'Coinbase vs Kraken 2026: Ücretler, Güvenlik ve Bitcoin Özellikleri',
  metaDescription: '2026 için Coinbase ve Kraken karşılaştırması: gerçek ücretler, güvenlik geçmişi, staking yasallığı, Advanced ve Pro platformları ve Bitcoin için hangisi daha iyi.',
  category: 'Trading',
  publishedDate: '2026-07-26',
  updatedDate: '2026-07-26',
  readingTime: 8,
  keywords: ['coinbase vs kraken', 'en iyi bitcoin borsası 2026', 'kraken pro ücretleri', 'coinbase advanced ücretleri'],
  relatedCalculators: ['profit-loss', 'dca', 'capital-gains-tax'],
  relatedArticles: ['bitcoin-vergi-rehberi-sermaye-kazanci', 'bitcoin-kar-zarar-nasil-hesaplanir', 'bitcoin-etf-karsilastirma-ibit-fbtc-arkb'],
  quickAnswer: 'ABD\'de en düşük toplam Bitcoin ücreti isteyen aktif traderlar için Kraken Pro kazanır: giriş kademesinde 0,16 % / 0,26 % maker-taker, Coinbase Advanced\'te ise 0,60 % / 1,20 %. Coinbase; düzenleyici netlik, IRA seçenekleri ve başlangıç deneyimi ile öne çıkar. Staking\'de Kraken, ABD\'de Bitcoin ile ilgili getiri ürünlerini 2025\'te yeniden başlattı; Coinbase hâlâ ABD\'deki bireysel müşterilere staking sunamıyor.',
  faqs: [
    { question: 'Kraken, Coinbase\'ten daha mı ucuz?', answer: 'Aktif Bitcoin ticareti için evet. Kraken Pro giriş kademesi %0,16 maker / %0,26 taker\'dır. Coinbase Advanced giriş kademesi %0,60 maker / %1,20 taker\'dır. 10.000 $ BTC alımında bu Kraken\'de yaklaşık 16 – 26 $, Coinbase\'te 60 – 120 $ eder. Basit Coinbase arayüzü daha da pahalıdır (yaklaşık %1,49 + spread).' },
    { question: 'Coinbase mi Kraken mı daha güvenli?', answer: 'Her ikisi de üst düzey saklayıcı sayılır. Coinbase, SOC 1/2 denetimli ve varlıklarının %98\'ini soğuk depolamada tutan halka açık bir ABD şirketidir (Nasdaq: COIN). Kraken, Merkle-tree tabanlı Rezerv Kanıtı yayımlar ve 16 yıllık geçmişinde platform düzeyinde hiç saldırıya uğramamıştır. Uzun vadeli tutuş için hiçbiri Ledger veya Trezor üzerinde kendi saklamanın yerini tutmaz.' },
    { question: 'ABD\'de Coinbase veya Kraken\'de staking yapabilir miyim?', answer: '2026 itibarıyla: Kraken, 2025 başında bir uzlaşma sonrasında ABD müşterileri için staking\'i yeniden başlattı; ancak Bitcoin\'in kendisi staking\'e uygun değildir — ilgili getiri ürünleri eyalete göre değişir. Coinbase, 2024\'te SEC ile uzlaştı ve 37 eyalette belirli varlıklar için staking sunabiliyor, ancak Bitcoin sunmuyor (Layer 1\'de staking mümkün değil).' },
    { question: 'Yeni başlayanlar için hangisi daha iyi?', answer: 'Coinbase. Basit arayüz, rehberli onboarding, Coinbase Learn ödülleri ve Coinbase One aboneliği (ücretsiz işlemler) ilk kez alıcılar için daha kolay yapar. Kraken\'in avantajı Kraken Pro\'ya geçtiğinizde başlar.' },
    { question: 'İkisi de anlık banka çekimini destekliyor mu?', answer: 'Coinbase: banka kartına anlık USD çekim (%1,5 ücret) veya PayPal; ACH ücretsiz, 1 – 3 gün. Kraken: doğrulanmış ABD müşterileri için FedNow anlık çekim 2025\'ten beri ücretsizdir; havale kademeye bağlı olarak 4 – 35 $ arasındadır.' },
  ],
  sections: [
    { id: 'hizli-karar', heading: 'Hızlı Karar', content: 'Aktif Bitcoin ticareti yapıyor, ücretleri önemsiyor ve Rezerv Kanıtı şeffaflığı istiyorsanız **Kraken Pro**\'yu seçin. Yeni başlıyorsanız, ETF benzeri IRA (Coinbase Custody üzerinden) istiyorsanız veya cilalı mobil deneyim istiyorsanız **Coinbase**\'i seçin. Hiçbiri uzun vadeli depolama için kullanılmamalıdır — pozisyonunuz anlamlı hale geldiğinde BTC\'yi donanım cüzdanına taşıyın.' },
    { id: 'ucret-karsilastirma', heading: 'Gerçek Ücret Karşılaştırması (Temmuz 2026)', content: '| Ücret | Coinbase Simple | Coinbase Advanced | Kraken (Instant Buy) | Kraken Pro |\n|---|---|---|---|---|\n| Bitcoin alış | ~%1,49 + spread | %0,60 / %1,20 | %1,5 + spread | %0,16 / %0,26 |\n| USD yatırma (ACH / FedNow) | Ücretsiz | Ücretsiz | Ücretsiz | Ücretsiz |\n| USD çekim | Ücretsiz (ACH) / %1,5 (anlık) | Ücretsiz (ACH) | Ücretsiz (FedNow) | Ücretsiz (FedNow) |\n| Havale çekim | 25 $ | 25 $ | 4 – 35 $ | 4 – 35 $ |\n| Coinbase One aboneliği | 29,99 $/ay — ücretsiz işlem | Aynı | Yok | Yok |\n\nMaker-taker ücretleri Kraken Pro\'da 10 M $+ 30-günlük hacimde %0,00 / %0,10\'a, Coinbase Advanced\'te 400 M $+ hacimde %0,00 / %0,05\'e düşer.' },
    { id: 'guvenlik', heading: 'Güvenlik ve Düzenleme', content: '**Coinbase** 50 ABD eyaletinde düzenlenmiştir, Nasdaq\'ta listelenir ve üç aylık denetlenmiş raporlar yayımlar. Müşteri varlıklarının ~%98\'ini coğrafi olarak dağıtılmış soğuk depolamada tutar ve sıcak cüzdan kısmı için ticari suç sigortası bulunur.\n\n**Kraken**, Merkle-tree tabanlı, kriptografik olarak doğrulanabilir Rezerv Kanıtı yayımlar. 16 yıllık geçmişinde platform düzeyinde ihlal yaşamadı. 2023 SEC uzlaşmasından sonra ABD staking\'i durduruldu; 2025 uzlaşması sınırlı bir versiyonu geri getirdi. Kraken FinCEN MSB kaydı ve çeşitli ABD eyalet güven belgeleri altında çalışır.\n\nHer iki borsa da donanım destekli 2FA (YubiKey destekli), çekim adresi izin listesi ve sosyal mühendislik önlemleri kullanır. Hiçbiri uzun vadeli Bitcoin tutuşu için kendi saklamanın yerini tutmaz.' },
    { id: 'kim-hangisini-secmeli', heading: 'Kim Hangisini Seçmeli', content: '**ABD\'de yeni başlayanlar:** Coinbase — daha basit arayüz, marka bilinirliği, kolay vergi raporlama (2026\'da Form 1099-DA yerel destekli). Beyanname zamanında [sermaye kazancı vergisi hesaplayıcısı](/tr/hesaplayicilar/sermaye-kazanci-vergisi) ile eşleştirin.\n\n**Aktif Bitcoin traderları:** Kraken Pro — giriş kademesinde 3 – 7 × daha düşük ücretler, daha derin BTC emir defterleri, yerel vadeli işlemler ve marjin (5 × kadar) ve Rezerv Kanıtı.\n\n**Yalnızca DCA yatırımcıları:** İkisi de çalışır; ancak Coinbase One (29,99 $/ay) ~2.000 $/ay DCA\'da başa baş noktasına gelir. Bunun altında Kraken\'in ucuz temel ücretleri kazanır. İkisini de [DCA hesaplayıcısı](/tr/hesaplayicilar/dca) ile modelleyin.\n\n**IRA / emeklilik:** Coinbase (Alto ve Rocket Dollar gibi ortaklar üzerinden) daha derin ekosisteme sahiptir. Kraken belirli eyaletlerde sınırlı emeklilik ürünleri sunar.', cta: { calculatorId: 'profit-loss', calculatorName: 'Bitcoin Kâr ve Zarar Hesaplayıcı', text: 'Borsa ücretlerinden sonra net getiriyi hesaplayın', path: '/tr/hesaplayicilar/kar-zarar' } },
  ],
  howToSteps: [
    { name: 'Amaca göre seçin', text: 'Basitlik ve IRA erişimi için Coinbase; en düşük ücretler ve aktif ticaret için Kraken Pro seçin.' },
    { name: 'Donanım 2FA\'yı etkinleştirin', text: 'YubiKey veya Titan anahtarı kullanın. SMS 2FA yeterli değildir — SIM değişimi saldırıları en büyük borsa kayıp nedenidir.' },
    { name: 'Çekim adresi izin listesi ayarlayın', text: 'Her iki borsa da 24 saatlik bekleme süresiyle önceden onaylanmış BTC adreslerine çekimleri kilitlemeyi destekler.' },
    { name: 'Uzun vadeli BTC\'yi borsadan çıkarın', text: 'Birkaç maaşın üstünde tuttuğunuzda donanım cüzdanına taşıyın.' },
    { name: 'Vergi verisini üç ayda bir dışa aktarın', text: 'Her iki platform da CSV ve 1099-DA uyumlu raporlar sunar; Koinly, CoinTracker veya muhasebecinizin aracına aktarın.' },
  ],
};

export default article;
