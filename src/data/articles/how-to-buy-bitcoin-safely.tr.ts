import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-nasil-guvenli-alinir',
  title: 'Bitcoin Nasıl Güvenli Alınır: Yeni Başlayanlar İçin Adım Adım Rehber',
  metaDescription: '2026\'da Bitcoin nasıl güvenli alınır: düzenlemeli borsa seçin, kimlik doğrulayın, hesabı fonlayın, emir verin ve BTC\'yi öz saklamaya taşıyın.',
  category: 'Basics',
  publishedDate: '2026-07-26',
  updatedDate: '2026-07-26',
  readingTime: 8,
  keywords: ['bitcoin nasıl güvenli alınır', 'bitcoin nasıl alınır', 'yeni başlayanlar bitcoin alma', 'en güvenli bitcoin alma yolu', 'bitcoin alma adım adım'],
  relatedCalculators: ['dca', 'bitcoin-converter', 'transaction-fees'],
  relatedArticles: ['coinbase-kraken-karsilastirma-2026', 'ledger-trezor-karsilastirma-2026', 'bitcoin-soguk-cuzdan-rehberi', 'bitcoin-seed-phrase-yedekleme'],
  quickAnswer: 'Bitcoin\'i güvenli almak için düzenlemeli bir borsa kullanın (Coinbase, Kraken veya lisanslı yerel bir platform), kimlik doğrulamayı tamamlayın, ücretleri en aza indirmek için banka havalesiyle fon aktarın, güncel piyasa fiyatında limit emri verin ve — birikiminiz birkaç aylık geliri aşınca — BTC\'yi kontrol ettiğiniz donanım cüzdanına taşıyın. Büyük miktarları asla uzun süre borsada tutmayın.',
  faqs: [
    { question: 'Bitcoin almanın en güvenli yolu nedir?', answer: 'En güvenli yol, ülkenizde düzenlemeli bir borsadır (Türkiye\'de lisanslı yerel platformlar, ABD\'de Coinbase/Kraken, AB\'de Bitstamp) ve doğrudan banka havalesiyle fonlanmasıdır. SMS yerine kimlik doğrulayıcı uygulamayla iki faktörlü doğrulamayı etkinleştirin. Uzun vadeli tutuşlar için donanım cüzdanına (Ledger, Trezor, Coldcard) çekin.' },
    { question: 'Bitcoin almak ne kadara mal olur?', answer: 'Borsa komisyonları %0,1 (Kraken Pro, MEXC) ile %1,5 (Coinbase basit akış) arasında değişir. Banka havalesi yatırımları genellikle ücretsizdir; kart yatırımları %2–4 ekler. Kendi cüzdanınıza çekim, tıkanıklığa bağlı olarak genellikle 1–10 $ arası küçük bir Bitcoin ağ ücretidir.' },
    { question: 'Bitcoin\'i borsada bırakmalı mıyım?', answer: 'Hayır, büyük miktarları bırakmayın. Her büyük kripto borsası çöküşü (Mt. Gox, FTX, Celsius) müşteri fonlarını da yanında götürdü. "Anahtarlarınız değilse, coinleriniz de değil" kuralı geçerlidir. Sadece aktif işlem yaptığınızı borsada tutun; gerisini donanım cüzdanına taşıyın.' },
    { question: 'Alabileceğim minimum Bitcoin miktarı nedir?', answer: 'Çoğu borsa 1–10 $ değerinde Bitcoin almanıza izin verir. Bütün bir BTC alma zorunluluğu yoktur. Bitcoin 8 ondalık basamağa kadar bölünebilir — bkz. [satoshi nedir rehberi](/tr/ogrenin/bitcoin-satoshi-nedir).' },
  ],
  sections: [
    { id: 'borsa-secimi', heading: 'Adım 1: Düzenlemeli Bir Borsa Seçin', content: 'Düzenlemeli borsa, ülkenizde gerekli lisansları olan ve düzenli denetim geçiren borsa demektir. Pratikte:\n\n• **Türkiye:** MASAK\'a kayıtlı yerel lisanslı platformlar.\n• **Amerika Birleşik Devletleri:** Coinbase, Kraken, Gemini.\n• **Avrupa Birliği:** Bitstamp, Kraken, Coinbase.\n• **Küresel (ABD dışı):** Bybit, MEXC, OKX.\n\nKaydolmadan önce iki şeyi kontrol edin: (1) borsanın ülkenizde lisanslı olduğu ve (2) alım büyüklüğünüz için komisyonlar. Detaylı karşılaştırma için [Coinbase vs Kraken analizimize](/tr/ogrenin/coinbase-kraken-karsilastirma-2026) bakın.' },
    { id: 'kimlik-dogrulama', heading: 'Adım 2: Kimlik Doğrulaması (KYC)', content: 'Her düzenlemeli borsa "Müşterini Tanı" doğrulaması ister: resmi kimlik, adres kanıtı ve genellikle bir selfie. Onay genellikle 5 dakika ile 24 saat sürer.\n\nİpuçları: kimliğinizdeki adı tam olarak kullanın, yüksek çözünürlüklü fotoğraflar yükleyin ve mevcut en yüksek doğrulama seviyesini tamamlayın — bu, sonraki çekim limitlerini kaldırır.' },
    { id: 'hesap-fonlama', heading: 'Adım 3: Hesabınızı Fonlayın', content: 'Maliyete göre sıralanmış fonlama yöntemleri:\n\n| Yöntem | Tipik ücret | Hız |\n|---|---|---|\n| Banka havalesi (EFT / SEPA) | Ücretsiz | 1–3 gün |\n| Uluslararası havale | 10–25 $ | Aynı gün |\n| Banka kartı | %2–4 | Anında |\n| Kredi kartı | %3–5 | Anında |\n\n**Büyük miktarlarda her zaman banka havalesi kullanın.** 10.000 $\'lık kart alımı 200–400 $ komisyon; EFT ile 0 $. Kart ücretleri, borsa ücretleri ve spread hızla katlanır.', cta: { calculatorId: 'dca', calculatorName: 'Bitcoin DCA Hesaplayıcı', text: 'Banka havalesiyle tekrarlayan alımlarınızı DCA ile planlayın', path: '/tr/hesaplayicilar/dca' } },
    { id: 'emir-verme', heading: 'Adım 4: Emrinizi Verin', content: 'İki ana emir türünüz var:\n\n• **Piyasa emri** — en iyi mevcut fiyattan anında alır. Basittir ama spread\'i ödersiniz.\n• **Limit emri** — sadece belirlediğiniz fiyattan alır. Biraz daha ucuz (birçok borsada daha düşük "maker" komisyonu) ancak piyasa uzaklaşırsa dolmayabilir.\n\n1.000 $ altı alım yapan çoğu yeni başlayan için piyasa emri uygundur. Üzerinde limit emrini öğrenin — komisyon tasarrufu hızla kendini amorti eder. Uzun vadeli yatırımcılar için tekrarlayan alımlarla [dolar maliyet ortalaması](/tr/ogrenin/bitcoin-dca-vs-toplu-yatirim) daha da iyidir.' },
    { id: 'oz-saklama', heading: 'Adım 5: Öz Saklamaya Taşıyın', content: 'Birikiminiz birkaç aylık geliri aştığında borsada bırakmayın. Bir donanım cüzdanı alın:\n\n• **Ledger Nano S Plus** — ~79 $, ana akım seçim.\n• **Trezor Safe 5** — ~169 $, tam açık kaynak.\n• **Coldcard Mk4** — ~150 $, sadece Bitcoin, en yüksek güvenlik.\n\nKurulumu dikkatle takip edin: seed phrase\'i **cihaz üzerinde** oluşturun, kağıt veya çelik üzerine yazın, iki fiziksel konumda saklayın ve asla fotoğrafını çekmeyin veya bilgisayara yazmayın. Tam kılavuz: [seed phrase yedekleme rehberi](/tr/ogrenin/bitcoin-seed-phrase-yedekleme) ve [soğuk saklama rehberi](/tr/ogrenin/bitcoin-soguk-cuzdan-rehberi).' },
    { id: 'yaygin-hatalar', heading: 'Kaçınılması Gereken Yaygın Yeni Başlayan Hataları', content: '• **Dürtüsel kartla alım** — sadece fonlama için %3–5 ödersiniz.\n• **2FA\'yı görmezden gelmek** — SMS tabanlı 2FA SIM swap ile hacklenebilir. Authy, Google Authenticator veya YubiKey kullanın.\n• **Büyük bakiyeleri yıllarca borsada bırakmak** — kripto tarihindeki tek en büyük risk.\n• **Seed phrase\'i notes uygulamasına yazmak** — cihaz ele geçirilirse anında uzlaşma.\n• **%80 düşüşe dayanamayacağınızdan fazlasını almak** — pozisyon boyutlandırma, HODL ile panik satış arasındaki farktır.' },
  ],
  howToSteps: [
    { name: 'Ülkenizde düzenlemeli bir borsa seçin', text: 'Türkiye: lisanslı yerel platformlar. ABD: Coinbase veya Kraken. Kaydolmadan önce ücretleri karşılaştırın.' },
    { name: 'Kimlik doğrulamayı tamamlayın', text: 'Resmi kimlik ve adres kanıtı yükleyin. Onay 5 dakika ile 24 saat sürer.' },
    { name: 'Authenticator uygulamalı 2FA\'yı etkinleştirin', text: 'SMS 2FA kullanmayın. Authy, Google Authenticator veya donanım anahtarı yükleyin.' },
    { name: 'Banka havalesiyle fonlayın', text: 'EFT/SEPA ücretsizdir. Kart yatırımları %2–4 tutar — büyük miktarlarda kaçının.' },
    { name: 'Piyasa fiyatında limit emri verin', text: 'Piyasa emrinden ucuzdur ve giriş fiyatınızı sabitler.' },
    { name: 'Donanım cüzdanına çekin', text: 'Birikiminiz birkaç aylık geliri aştığında borsadan çıkarın.' },
    { name: 'Seed phrase\'i çelik üzerine yedekleyin', text: '12 veya 24 kelimeyi iki fiziksel konumda saklayın. Asla dijital olmasın.' },
  ],
  speakable: true,
};

export default article;
