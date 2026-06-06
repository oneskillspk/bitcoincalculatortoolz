import { Article } from '../articles';

/** TR counterpart of `what-is-a-satoshi` → `/tr/ogrenin/bitcoin-satoshi-nedir`. */
const article: Article = {
  slug: 'bitcoin-satoshi-nedir',
  title: 'Satoshi Nedir? Bitcoin\'in En Küçük Birimi Açıklandı',
  metaDescription: 'Satoshi (sat) 0,00000001 BTC\'dir — Bitcoin\'in en küçük birimi. BTC, mBTC, bit ve sat karşılaştırmaları, tam dönüşüm örnekleri ve ücretsiz dönüştürücü.',
  category: 'Basics',
  publishedDate: '2026-02-03',
  updatedDate: '2026-05-18',
  readingTime: 5,
  keywords: ['satoshi nedir', 'satoshi kaç tl', 'satoshi to usd', 'bitcoin birimleri', 'sats', 'sat biriktirme'],
  relatedCalculators: ['bitcoin-converter', 'stack-sats', 'purchasing-power'],
  relatedArticles: ['bitcoin-yarilanmasi-nedir', 'bitcoin-dca-nedir', 'bitcoin-tasarruf-plani-rehberi'],
  faqs: [
    { question: '1 Bitcoin kaç satoshi eder?', answer: '1 Bitcoin = 100.000.000 satoshi (100 milyon sat). Satoshi, baz katmandaki Bitcoin\'in en küçük birimidir.' },
    { question: '1 satoshi kaç TL/USD eder?', answer: 'Bir satoshi\'nin değeri mevcut Bitcoin fiyatına bağlıdır. BTC 100.000$ iken 1 satoshi = 0,001$. Canlı kur için dönüştürücümüzü kullanın.' },
    { question: 'Neden satoshi olarak adlandırıldı?', answer: 'Birim, Bitcoin\'in takma adlı yaratıcısı Satoshi Nakamoto\'nun adını taşır. 2008\'de Bitcoin teknik raporunu yayınladı ve Ocak 2009\'da ilk bloğu kazdı.' },
    { question: '1 satoshi\'den daha azını alabilir misiniz?', answer: 'Bitcoin baz katmanında satoshi en küçük birimdir. Ancak Lightning Network mikro ödemeler için millisatoshi (1/1000 satoshi) destekler.' },
  ],
  sections: [
    { id: 'satoshi-nedir', heading: 'Satoshi Nedir?', content: 'Satoshi (genellikle "sat" olarak kısaltılır), Bitcoin\'in en küçük birimidir. Bir dolar 100 sente bölündüğü gibi, bir Bitcoin de 100.000.000 satoshi\'ye bölünür.\n\nBirim, 2008\'de [Bitcoin teknik raporunu](https://bitcoin.org/bitcoin.pdf) yayınlayan anonim yaratıcı **[Satoshi Nakamoto](https://en.wikipedia.org/wiki/Satoshi_Nakamoto)**\'nun adını taşır. Bitcoin fiyatı yükselmeye devam ettikçe satoshi kullanmak küçük miktarları ifade etmeyi kolaylaştırır.\n\nÖrneğin "0,00050000 BTC sahibim" demek yerine basitçe "50.000 sat sahibim" diyebilirsiniz. Bu daha sezgiseldir ve insanlara bütün bir coin almadan da anlamlı miktarda Bitcoin\'e sahip olabileceklerini gösterir.' },
    { id: 'bitcoin-birimleri', heading: 'Bitcoin Birim Hiyerarşisi', content: 'Bitcoin birkaç biçimde ifade edilebilir:\n\n• **1 BTC** = 1 Bitcoin (temel birim)\n• **1 mBTC** (milibitcoin) = 0,001 BTC = 100.000 sat\n• **1 μBTC / 1 bit** (mikrobitcoin) = 0,000001 BTC = 100 sat\n• **1 sat** (satoshi) = 0,00000001 BTC\n\nTopluluk gündelik birim olarak giderek **"sat"**\'ı benimsedi çünkü:\n1. Tam sayılar psikolojik olarak daha kolaydır\n2. Bitcoin\'in "çok pahalı" algısını ortadan kaldırır\n3. Lightning Network işlemleri sat cinsindendir\n4. "Sat biriktirmek" düzenli Bitcoin biriktirenlerin sloganı haline geldi', cta: { calculatorId: 'bitcoin-converter', calculatorName: 'Bitcoin & Satoshi Dönüştürücü', text: 'BTC, sat ve 100+ fiat para arasında anında dönüşüm', path: '/tr/hesaplayicilar/bitcoin-donusturucu' } },
    { id: 'satoshi-degeri', heading: 'Bir Satoshi Ne Kadar Değerinde?', content: 'Bir satoshi\'nin değeri tamamen Bitcoin\'in fiyatına bağlıdır:\n\n| BTC Fiyatı | 1 Sat Değeri | 10.000 Sat Değeri |\n|-----------|--------------|-------------------|\n| 50.000$ | 0,0005$ | 5,00$ |\n| 100.000$ | 0,001$ | 10,00$ |\n| 250.000$ | 0,0025$ | 25,00$ |\n| 500.000$ | 0,005$ | 50,00$ |\n| 1.000.000$ | 0,01$ | 100,00$ |\n\nBTC 1.000.000$ olduğunda 1 satoshi 1 sent\'e eşit olur — Bitcoin topluluğunun yakından izlediği "sat-sent paritesi" kilometre taşı.' },
    { id: 'sat-biriktirme', heading: '"Sat Biriktirmek" Ne Demek?', content: '"Sat biriktirmek" ([DCA](/tr/ogrenin/bitcoin-dca-nedir) yoluyla veya Bitcoin kazanarak) düzenli olarak satoshi biriktirme pratiğidir. Bütün bir Bitcoin almanız gerekmediği, her satın değer kattığı felsefesidir.\n\nSat biriktirmenin popüler yolları:\n\n• **DCA alımları:** Küçük miktarların otomatik tekrarlayan alımları — [Bitcoin için DCA nasıl çalışır](/tr/ogrenin/bitcoin-dca-nedir)\n• **Cashback uygulamaları:** Fold, Lolli ve Satsback gibi servisler alışverişler için Bitcoin ödülü verir\n• **Lightning bahşişleri:** Nostr ve Stacker News gibi platformlarda içerik üretimiyle sat kazanma\n• **Yuvarlama tasarrufu:** Alışverişleri yuvarlayıp farkı Bitcoin\'e yatıran uygulamalar\n• **Madencilik:** Küçük ölçekli madencilik bile stoğunuza sat ekler\n\nSat stoğunuzu zaman içinde oluşturmaya yönelik tam bir plan için [Bitcoin tasarruf planı rehberimizi](/tr/ogrenin/bitcoin-tasarruf-plani-rehberi) okuyun.', cta: { calculatorId: 'stack-sats', calculatorName: 'Sat Biriktirme Hedef Hesaplayıcı', text: 'Bir satoshi biriktirme hedefi belirleyin ve ilerlemenizi takip edin', path: '/tr/hesaplayicilar/satoshi-biriktirme' } },
    { id: 'lightning', heading: 'Lightning Network\'te Satoshi', content: 'Bitcoin\'in katman-2 ölçekleme çözümü Lightning Network, satoshi\'yi yerel birimi olarak kullanır. Lightning şunları sağlar:\n\n• **Anlık ödemeler** — 1 satoshi kadar küçük\n• **Mikro ödemeler** — içerik için (makale başına ödeme, sat akışı)\n• **Sınır ötesi transferler** — bir sentin küçük kesirleriyle\n• **Millisatoshi** (msat) — Lightning iç yönlendirmesi için 1/1000 satoshi\n\nLightning, satoshi\'yi gündelik para olarak pratik hale getirdi. Bir içerik üreticisine 100 sat (~0,10$) bahşiş verebilir ve neredeyse sıfır ücretle anında transfer yapabilirsiniz.' },
  ],
  howToSteps: [
    { name: 'Birimleri anlayın', text: '1 BTC = 100.000.000 satoshi olduğunu öğrenin' },
    { name: 'Bitcoin Dönüştürücü\'yü açın', text: 'Bitcoin & Satoshi Dönüştürücü aracımızı ziyaret edin' },
    { name: 'Bir miktar girin', text: 'BTC, sat veya fiat para cinsinden herhangi bir miktar girin' },
    { name: 'Dönüşümü görün', text: 'Tüm Bitcoin birimleri ve para birimleri arasındaki eşdeğer değerleri anında görün' },
  ],
  expertQuote: {
    quote: 'Birime farklı bir isim vermek güzel olurdu, ama pek çok şey gibi, isim yapışıp kaldı.',
    author: 'Hal Finney',
    role: 'Bitcoin öncüsü & ilk işlem alıcısı',
    source: 'https://bitcointalk.org/index.php?topic=8000.0',
    sourceLabel: 'bitcointalk.org (2010)',
  },
  speakable: true,
};

export default article;
