import { Article } from '../articles';

/** TR counterpart of `bitcoin-leverage-trading-risks` → `/tr/ogrenin/bitcoin-kaldirac-ticareti-riskleri`. */
const article: Article = {
  slug: 'bitcoin-kaldirac-ticareti-riskleri',
  title: 'Bitcoin Kaldıraçlı İşlem: Tüccarların %95\'i Neden Para Kaybeder',
  metaDescription: 'Ekim 2025\'te 24 saatte 19 milyar $ Bitcoin kaldıraçlı pozisyonu tasfiye edildi. 10x pozisyon yalnızca %10\'luk bir düşüşle her şeyi kaybeder. Riskleri öğrenin.',
  category: 'Trading',
  publishedDate: '2026-02-09',
  updatedDate: '2026-05-18',
  readingTime: 7,
  keywords: ['bitcoin kaldıraçlı işlem', 'bitcoin marjin ticareti', 'bitcoin tasfiye', 'kripto kaldıraç riskleri', 'bitcoin vadeli işlemler'],
  relatedCalculators: ['leverage-liquidation', 'profit-loss', 'transaction-fees', 'bitcoin-lot-size'],
  relatedArticles: ['bitcoin-kar-zarar-nasil-hesaplanir', 'bitcoin-hodl-stratejisi-aciklamasi', 'bitcoin-vergi-rehberi-sermaye-kazanci', 'bitcoin-lot-buyuklugu-nasil-hesaplanir'],
  faqs: [
    { question: 'Bitcoin\'de kaldıraçlı işlem nedir?', answer: 'Kaldıraçlı işlem, borç alarak gerçek sermayenizden daha büyük bir pozisyonu kontrol etmenizi sağlar. 10x kaldıraçla 1.000 $ ile 10.000 $\'lık bir pozisyonu kontrol edersiniz. Kazançları büyütürken, zararları da aynı oranda büyütür — 10x kaldıraçta %10\'luk bir düşüş tüm marjinizi siler.' },
    { question: 'Bitcoin işleminde tasfiye olduğunuzda ne olur?', answer: 'Tasfiye, zararlarınız marjinizi (teminat) tükettiğinde gerçekleşir. Borsa pozisyonunuzu zorla kapatır ve yatırdığınız tüm marji kaybedersiniz. Long pozisyonda 10x kaldıraçla, ~%10\'luk bir düşüş tasfiyeyi tetikler ve sermayenizin tamamını kaybedersiniz.' },
    { question: 'Kaldıraçlı kripto tüccarlarının yüzde kaçı para kaybeder?', answer: 'Çalışmalar, kaldıraçlı kripto tüccarlarının %70-90\'ının para kaybettiğini gösteriyor. Yüksek oynaklık, fonlama oranları ve duygusal kararların birleşimi, deneyimli tüccarlar için bile sürekli kârlılığı son derece zorlaştırır.' },
    { question: 'Bitcoin için 2x kaldıraç güvenli mi?', answer: 'Düşük kaldıraç (2-3x) yüksek kaldıraçtan (10-100x) önemli ölçüde daha güvenlidir, ancak "güvenli" görecelidir. Long pozisyonda 2x kaldıraçta, %50\'lik bir Bitcoin çöküşü (defalarca yaşandı) sizi tamamen tasfiye eder. Kriptoda hiçbir kaldıraç gerçekten güvenli değildir.' },
  ],
  sections: [
    {
      id: 'kaldirac-nedir',
      heading: 'Bitcoin Kaldıraçlı İşlem Nedir?',
      content: '[Kaldıraçlı işlem](https://www.investopedia.com/terms/l/leverage.asp), borsadan farkı borç alarak gerçek sermayenizden daha büyük bir pozisyon açmanıza olanak tanır. 1.000 $ yatırıp 10x kaldıraç kullanırsanız 10.000 $\'lık pozisyonu kontrol edersiniz.\n\n**Nasıl çalışır:**\n• **Marj** (teminatınız) yatırırsınız — genellikle BTC, USDT veya USD\n• Borsa kalan sermayeyi size ödünç verir\n• Kâr ve zararınız yalnızca marjiniz üzerinden değil **tam pozisyon büyüklüğü** üzerinden hesaplanır\n• Fiyat marjinizin ötesinde aleyhinize hareket ederse **tasfiye** edilirsiniz — her şeyi kaybedersiniz\n\nKaldıraç her iki yöne eşit keser. 10x kaldıraçta:\n• %5\'lik fiyat artışı = marjinizde %50 kâr\n• %5\'lik fiyat düşüşü = marjinizde %50 zarar\n• %10\'luk fiyat düşüşü = %100 kayıp (tasfiye)'
    },
    {
      id: 'tasfiye-aciklamasi',
      heading: 'Tasfiye Nasıl Çalışır',
      content: 'Tasfiye, zararlar marj miktarınıza yaklaştığında pozisyonunuzun zorla kapatılmasıdır. Tasfiye fiyatınızı anlamak kritiktir.\n\n| Kaldıraç | Tasfiyeye Fiyat Hareketi (Long) | Tasfiyeye Fiyat Hareketi (Short) |\n|---|---|---|\n| 2x | -%50 | +%50 |\n| 5x | -%20 | +%20 |\n| 10x | -%10 | +%10 |\n| 20x | -%5 | +%5 |\n| 50x | -%2 | +%2 |\n| 100x | -%1 | +%1 |\n\nBitcoin tek bir günde düzenli olarak %5-10 hareket eder ve saatler içinde %20+ hareketler görmüştür. 20x kaldıraçta, normal bir günlük Bitcoin hareketi tüm pozisyonunuzu tasfiye edebilir.\n\n**Kademeli tasfiyeler** durumu daha da kötüleştirir: birçok tüccar aynı anda tasfiye olduğunda, zorunlu satışlar fiyatları daha da aşağı iter ve zincirleme reaksiyonla daha fazla tasfiyeyi tetikler.',
      cta: { calculatorId: 'leverage-liquidation', calculatorName: 'Kaldıraç Tasfiye Hesaplayıcısı', text: 'Herhangi bir kaldıraç ve giriş noktası için tasfiye fiyatınızı hesaplayın', path: '/tr/hesaplayicilar/bitcoin-tasfiye' }
    },
    {
      id: 'gizli-maliyetler',
      heading: 'Kaldıraçlı İşlemin Gizli Maliyetleri',
      content: 'Tasfiye riskinin ötesinde, kaldıraçlı işlemin yeni başlayanların çoğunun fark etmediği maliyetleri vardır:\n\n• **Fonlama oranları:** Sürekli vadeli işlemler her 8 saatte bir fonlama tahsil eder/öder. Boğa piyasalarında long\'lar genellikle 8 saatlik periyot başına %0,01-0,1 öder — bu sadece pozisyon tutmak için ayda %1-12\'dir.\n• **Spread ve kayma:** Volatil anlarda kaldıraçlı pozisyona girip çıkmak daha kötü işlem fiyatları demektir.\n• **İşlem ücretleri:** 10x kaldıraçlı pozisyon açıp kapatmak, sermayeniz üzerinde 10 kat etkili işlem ücreti demektir. %0,05 alıcı ücreti, işlem başına marjinizin %0,5\'ine dönüşür. [Bitcoin işlem ücretlerinin](/tr/ogrenin/bitcoin-islem-ucretleri-aciklamasi) nasıl çalıştığını öğrenin.\n• **Vergi karmaşıklığı:** Her kaldıraçlı işlem vergiye tabi bir olaydır. Yüksek frekanslı kaldıraçlı işlem muhasebe kabusu yaratır. [Bitcoin vergi rehberimiz](/tr/ogrenin/bitcoin-vergi-rehberi-sermaye-kazanci) etkileri açıklıyor.\n• **Duygusal bedel:** Marjinizin %50\'sinin dakikalar içinde buharlaştığını izlemek ciddi strese yol açar ve dürtüsel kararlara ve intikam ticaretine neden olur.'
    },
    {
      id: 'neden-kaybediyorlar',
      heading: 'Kaldıraçlı Tüccarların %80+\'ı Neden Para Kaybeder',
      content: 'İstatistikler acımasız:\n\n• **Asimetrik matematik:** %50 kaybetmek, başabaşa ulaşmak için %100 kazanç gerektirir. Kaldıraç bu asimetriyi büyütür.\n• **Aşırı güven yanlılığı:** Erken kazançlar tüccarları bir avantajları olduğuna ikna eder. Kaçınılmaz bir düşüş onları silene kadar kaldıracı ve pozisyon büyüklüğünü artırırlar.\n• **Kumarbaz yanılgısı:** "Daha fazla düşemez" zarar eden pozisyonlarda daha fazla kaldıraçla ortalama düşürmeye yol açar.\n• **Borsa teşvikleri:** Borsalar işlem ücretlerinden ve tasfiyelerden kâr eder. Yüksek kaldıraç seçenekleri (50x-125x), tüccarlara fayda sağladıkları için değil gelir ürettikleri için vardır.\n• **Bilgi asimetrisi:** Perakende tüccarlar daha hızlı veriye, daha iyi algoritmalara ve daha derin ceplere sahip kurumsal piyasa yapıcılarına karşı rekabet eder.\n\nÇoğu insan için işe yarayan alternatif? **Sadece Bitcoin satın almak ve tutmak.** Analizimiz HODL\'ün ticaret stratejilerinin büyük çoğunluğundan daha iyi performans gösterdiğini gösteriyor. Veriler için [HODL stratejisi rehberimizi](/tr/ogrenin/bitcoin-hodl-stratejisi-aciklamasi) okuyun.'
    },
    {
      id: 'risk-yonetimi',
      heading: 'Eğer İşlem Yapmak Zorundaysanız Risk Yönetim Kuralları',
      content: 'Risklere rağmen kaldıraç kullanmaya kararlıysanız, bu kurallara uyun:\n\n• **Asla 2-3x\'ten fazla kaldıraç kullanmayın.** Daha yüksek kaldıraç ticaret değil kumardır.\n• **Tek bir işlemde toplam portföyünüzün %1-2\'sinden fazlasını asla riske atmayın.** Bu, pozisyon büyüklüğünüzün (kaldıraç dahil) dikkatle hesaplanması gerektiği anlamına gelir.\n• **Her zaman stop loss ayarlayın.** Stop loss olmadan maksimum kaybınız marjinizin %100\'üdür.\n• **Çapraz marj değil izole marj kullanın.** İzole marj kaybınızı belirli pozisyonla sınırlar. Çapraz marj tüm hesabınızı tasfiye edebilir.\n• **Bir ticaret günlüğü tutun.** Her işlemi, gerekçenizi ve sonucu kaydedin. Bunu yapan çoğu tüccar kârlı olmadığını fark eder ve durur.\n• **Girmeden önce tasfiye fiyatınızı hesaplayın.** Tam olarak nerede silineceğinizi bilmek için hesaplayıcımızı kullanın.\n\nRahatsız edici gerçek: Getirilerinizi "değerli" kılmak için kaldıraca ihtiyacınız varsa, muhtemelen spot Bitcoin tahsisinizi artırmak daha iyi olur.',
      cta: { calculatorId: 'profit-loss', calculatorName: 'Kâr & Zarar Hesaplayıcısı', text: 'Ücretler ve kaldıraç etkileri dahil işlem K/Z\'nizi hesaplayın', path: '/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi' }
    },
  ],
  howToSteps: [
    { name: 'Kaldıraç mekaniğini anlayın', text: 'Herhangi bir kaldıraçlı pozisyon açmadan önce marj, kaldıraç oranları ve tasfiye fiyatlarının nasıl çalıştığını öğrenin' },
    { name: 'Tasfiye fiyatınızı hesaplayın', text: 'Pozisyonunuzun tasfiye edileceği tam fiyatı bulmak için Kaldıraç Tasfiye Hesaplayıcımızı kullanın' },
    { name: 'Sıkı risk sınırları belirleyin', text: 'Tek bir kaldıraçlı işlemde toplam portföyünüzün %1-2\'sinden fazlasını asla riske atmayın' },
    { name: 'İzole marj kullanın', text: 'Tek bir kötü işlemin tüm hesabınızı etkilemesini önlemek için her zaman izole marj modunu kullanın' },
    { name: 'Bunun yerine spot alımı düşünün', text: 'Çoğu yatırımcı için kaldıraçsız Bitcoin satın almak ve tutmak daha iyi uzun vadeli sonuçlar üretir' },
  ],
  expertQuote: {
    quote: 'Bileşik faizin ilk kuralı, onu gereksiz yere asla kesintiye uğratmamaktır. Kaldıraç bileşik faizi en çok kesintiye uğratır.',
    author: 'Charlie Munger',
    role: 'Berkshire Hathaway Başkan Yardımcısı',
    source: 'https://www.berkshirehathaway.com/letters/letters.html',
    sourceLabel: 'Berkshire Hathaway hissedar mektupları',
  },
};

export default article;
