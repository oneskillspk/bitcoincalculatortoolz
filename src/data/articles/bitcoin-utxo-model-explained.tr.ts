import { Article } from '../articles';

const article: Article = {
  slug: 'bitcoin-utxo-modeli-aciklamasi',
  title: 'Bitcoin UTXO Modeli Açıklaması: BTC Neden Banka Bakiyesi Gibi Değil',
  metaDescription: 'Bitcoin, hesap bakiyeleri yerine UTXO\'ları (Harcanmamış İşlem Çıktıları) kullanır. UTXO\'ların nasıl çalıştığını, ücretler, gizlilik ve coin kontrolü için neden önemli olduğunu öğrenin.',
  category: 'Basics',
  publishedDate: '2026-07-26',
  updatedDate: '2026-07-26',
  readingTime: 7,
  keywords: ['bitcoin utxo modeli', 'utxo nedir', 'harcanmamış işlem çıktısı', 'bitcoin coin control', 'bitcoin ücret optimizasyonu'],
  relatedCalculators: ['transaction-fees', 'lightning', 'bitcoin-converter'],
  relatedArticles: ['bitcoin-islem-ucretleri-aciklamasi', 'bitcoin-satoshi-nedir', 'lightning-network-aciklamasi'],
  quickAnswer: 'Bitcoin, hesap bakiyeleri yerine UTXO (Harcanmamış İşlem Çıktısı) modelini kullanır. Cüzdan bakiyeniz aslında geçmiş işlemlerde aldığınız bireysel coin parçalarının toplamıdır. Her gönderim tam UTXO\'ları tüketir ve çıktı olarak yenilerini oluşturur; bu yüzden Bitcoin ücretleri gönderdiğiniz dolar tutarına değil, UTXO sayısı ve boyutuna bağlıdır.',
  faqs: [
    { question: 'Bitcoin\'de UTXO nedir?', answer: 'UTXO, Harcanmamış İşlem Çıktısı\'dır — önceki bir işlemde alınan ve henüz harcanmamış ayrı bir Bitcoin parçası. Cüzdan bakiyeniz, adreslerinizin kontrol ettiği her UTXO\'nun toplamıdır. BTC gönderdiğinizde cüzdan tam UTXO\'ları girdi olarak tüketir ve kendinize dönen bir "para üstü" UTXO\'su dahil yeni UTXO\'lar oluşturur.' },
    { question: 'Bitcoin neden hesap bakiyeleri yerine UTXO kullanır?', answer: 'UTXO modeli önemsiz ölçüde paralelleştirilebilir, doğrulanması kolaydır ve güçlü gizlilik özelliklerini korur. Her işlem tamamen kendi kendine yeterli ve global durum olmadan kanıtlanabilir; bu yüzden Bitcoin her tam düğüm tarafından bağımsız olarak doğrulanabilir.' },
    { question: 'UTXO\'lar Bitcoin işlem ücretlerini nasıl etkiler?', answer: 'Ücretler vByte cinsinden işlem boyutuna bağlıdır ve harcadığınız her UTXO işleme ~68–148 vByte ekler. Aynı toplam tutar için 30 küçük UTXO\'lu bir cüzdan, 3 büyük UTXO\'lu bir cüzdandan çok daha pahalı bir konsolidasyon ödemek zorundadır.' },
    { question: 'UTXO konsolidasyonu nedir ve ne zaman yapmalıyım?', answer: 'Konsolidasyon, birçok küçük UTXO\'yu tek bir işlemde kendinize göndererek tek büyük bir UTXO\'da birleştirir. Ücretler çok düşükken (akşam/hafta sonu 1–3 sat/vB) yapın — bu, gerçekten göndermeniz gerektiğinde bir sonraki ücret patlamasında büyük ücret ödemenizi önler.' },
  ],
  sections: [
    { id: 'utxo-nedir', heading: 'UTXO Gerçekte Nedir', content: 'Ethereum modelinde bir hesabın global durumda saklanan bir bakiyesi vardır: "Alice: 3,5 ETH." Bitcoin böyle çalışmaz. Bunun yerine her Bitcoin işlemi bir veya daha fazla **çıktı** üretir — belirli adreslere atanmış BTC parçaları. Bu çıktılar blok zincirinde harcanmayı bekler. Harcandıklarında sonsuza kadar giderler ve yerlerini yeni çıktılar alır.\n\nSizin "bakiyeniz" hiçbir yerde saklanan bir sayı değildir. Cüzdanınızın adreslerinin kontrol ettiği her UTXO\'nun toplamıdır. Biri size geçen ay 0,3 BTC, geçen hafta 0,2 BTC ödediyse cüzdanınız birlikte 0,5 BTC olarak görünen iki UTXO (0,3 ve 0,2) tutar.' },
    { id: 'gonderim', heading: 'Bir Gönderim Gerçekte Nasıl Çalışır', content: 'Elinizde 0,10, 0,05 ve 0,02 BTC olmak üzere üç UTXO olduğunu ve 0,12 BTC göndermek istediğinizi varsayın. Cüzdanınız **tam** UTXO\'ları tüketmelidir. 0,10 + 0,05 = 0,15 BTC\'yi seçer, alıcıya 0,12 gönderir ve kontrol ettiğiniz yeni bir adrese 0,03 BTC\'lik bir **para üstü UTXO\'su** oluşturur. 0,02 BTC\'lik UTXO dokunulmadan kalır.\n\n| Alan | Değer |\n|---|---|\n| Girdiler (tüketilen UTXO\'lar) | 0,10 + 0,05 = 0,15 BTC |\n| Alıcıya çıktı | 0,12 BTC |\n| Para üstü çıktısı | 0,03 BTC − ücret |\n| Ücret | Dolara değil, vByte\'a bağlı |\n\nBu yüzden Bitcoin işlemlerinde "para üstü adresleri" vardır — protokolde kısmi harcama kavramı yoktur.', cta: { calculatorId: 'transaction-fees', calculatorName: 'Bitcoin İşlem Ücreti Tahmincisi', text: 'UTXO\'larınızı konsolide etmenin veya göndermenin maliyetini tahmin edin', path: '/calculators/transaction-fees' } },
    { id: 'ucret-coin-kontrol', heading: 'UTXO\'lar, Ücretler ve Coin Kontrolü', content: 'Harcanan her UTXO işleminize byte ekler. Yaklaşık boyutlar:\n\n• **Legacy girdi (P2PKH):** ~148 vByte\n• **SegWit girdi (P2WPKH):** ~68 vByte\n• **Taproot girdi (P2TR):** ~57 vByte\n\n20 SegWit UTXO\'sunu tüketen bir gönderim, tek UTXO tüketen bir gönderime göre ~20× daha büyüktür. Ücret patlamasında (100 sat/vB), bu fark 2 $\'lık bir gönderimi 40 $\'lık bir gönderime dönüştürebilir.\n\n**Coin kontrolü** — bir işlemin hangi UTXO\'ları harcayacağını elle seçebilme — Sparrow, Electrum ve Wasabi gibi cüzdanlarda güçlü bir özelliktir. Etiketli UTXO\'ları karıştırmaktan kaçınmanıza (gizlilik), ücret patlamasından önce toz harcamaya (ekonomi) veya büyük UTXO\'ları korumaya olanak tanır.' },
    { id: 'gizlilik', heading: 'UTXO\'lar ve Gizlilik', content: 'UTXO modeli halka açıktır: her girdi ve çıktı sonsuza kadar zincirde görünür. Zincir analizi firmaları, aynı işlemde birlikte harcanan UTXO\'ları belirleyerek adresleri kümelendirir — **ortak girdi sahipliği** adı verilen bir sezgisel.\n\nUTXO\'ları gizli tutmak için en iyi uygulamalar:\n\n• **Farklı kaynaklardan UTXO\'ları asla birleştirmeyin.**\n• **Her alım için yeni bir adres kullanın** — modern cüzdanlar bunu varsayılan olarak yapar.\n• **Büyük UTXO\'ları karıştırmak için CoinJoin\'i (Wasabi, Samourai) düşünün.**\n• **Küçük harcamaları Lightning\'e taşıyın** — [Lightning Network rehberimize](/tr/ogrenin/lightning-network-aciklamasi) bakın — bireysel tutarların zincirde görünmediği yer.\n\nUTXO\'ları anlamak, Bitcoin\'i sıradan kullanmakla coin\'lerinizin nasıl hareket ettiğini gerçekten kontrol etmek arasındaki farktır.' },
  ],
  howToSteps: [
    { name: 'UTXO\'ları gösteren bir cüzdan açın', text: 'Sparrow, Electrum, Bitcoin Core ve BlueWallet cüzdanınızın kontrol ettiği bireysel UTXO\'ları gösterir.' },
    { name: 'Her gelen UTXO\'yu etiketleyin', text: 'UTXO\'ları kaynağa göre (borsa çekimi, maaş, hediye) etiketleyin ve gelecek işlemde bağlanmalarını önleyin.' },
    { name: 'Büyük gönderim öncesi UTXO sayısını kontrol edin', text: 'Çok sayıda küçük UTXO\'nuz varsa daha büyük bir işlem boyutu ve daha yüksek ücret bekleyin.' },
    { name: 'Düşük ücret dönemlerinde konsolide edin', text: 'Mempool ücretleri 1–3 sat/vB\'ye düştüğünde küçük UTXO\'ları tek büyük çıktıda birleştirin.' },
    { name: 'Gizlilik veya ekonomi için coin kontrolü kullanın', text: 'Gizlilik, maliyet veya amaca göre hangi UTXO\'ların harcanacağını elle seçin.' },
  ],
  expertQuote: {
    quote: 'Bitcoin\'in UTXO modeli en az takdir edilen tasarım seçimlerinden biridir — doğrulamayı ucuz, ölçeklemeyi paralel ve gizliliği en azından savunulabilir kılar.',
    author: 'Pieter Wuille',
    role: 'Bitcoin Core geliştiricisi',
    source: 'https://bitcoinops.org/en/topics/utxo-set/',
    sourceLabel: 'Bitcoin Optech UTXO konusu',
  },
  speakable: true,
};

export default article;
