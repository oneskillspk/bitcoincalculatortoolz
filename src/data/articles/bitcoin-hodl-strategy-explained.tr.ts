import { Article } from '../articles';

/** TR counterpart of `bitcoin-hodl-strategy-explained` → `/tr/ogrenin/bitcoin-hodl-stratejisi-aciklamasi`. */
const article: Article = {
  slug: 'bitcoin-hodl-stratejisi-aciklamasi',
  title: 'Bitcoin HODL Stratejisi: HODLer\'lar Trader\'ları Neden Yener?',
  metaDescription:
    'HODL, Bitcoin\'i düşüşlerde satmak yerine tutmak demektir. HODLer\'lar tarihsel olarak trader\'lardan daha iyi performans göstermiştir. Ücretsiz hesaplayıcımızla HODL stratejinizi kurun.',
  category: 'Trading',
  publishedDate: '2026-02-08',
  updatedDate: '2026-05-18',
  readingTime: 7,
  keywords: ['hodl ne demek', 'bitcoin hodl stratejisi', 'bitcoin uzun vadeli', 'bitcoin tutma stratejisi', 'hodl vs trade'],
  relatedCalculators: ['hodl-strategy', 'what-if', 'profit-loss', 'dca'],
  relatedArticles: ['bitcoin-dca-nedir', 'korku-acgozluluk-endeksi-stratejisi', 'bitcoin-kar-zarar-nasil-hesaplanir', 'bitcoin-dca-vs-toplu-yatirim', 'bitcoin-staking-rehberi'],
  faqs: [
    { question: 'Kripto dünyasında HODL ne demek?', answer: 'HODL, 2013\'te bir Bitcoin forum gönderisindeki "hold" kelimesinin yanlış yazılışından doğdu. "Hold On for Dear Life" (Canın Pahasına Tut) anlamına gelir ve fiyat oynaklığından bağımsız olarak Bitcoin\'i uzun vadeli tutma stratejisini temsil eder.' },
    { question: 'Bitcoin HODL\'lemek iyi bir strateji mi?', answer: 'Tarihsel olarak evet. 4+ yıl Bitcoin tutan herkes giriş noktasından bağımsız olarak kâr etti. Uzun vadeli tutucuların (5+ yıl) yıllık ortalama getirileri %100\'ün üzerindedir.' },
    { question: 'Bitcoin\'i ne kadar HODL etmeliyim?', answer: 'En az bir tam piyasa döngüsü (yarılanmalar arası ~4 yıl) tutmak her zaman kârlı olmuştur. Minimum 4 yıl, ideali 10+ yıldır.' },
    { question: 'Bitcoin\'i HODL mı etmeli yoksa trade mı?', answer: 'Çalışmalar, aktif kripto trader\'larının %80-95\'inin para kaybettiğini gösterir. HODL\'leme işlem komisyonlarını ortadan kaldırır, vergi olaylarını azaltır ve duygusal karar vermeyi engeller.' },
  ],
  sections: [
    {
      id: 'hodl-nedir',
      heading: 'HODL Ne Demektir?',
      content: '18 Aralık 2013\'te BitcoinTalk forumunda **GameKyuubi** adlı kullanıcı, Bitcoin fiyatı çakılırken **"I AM HODLING"** başlıklı efsane mesajı paylaştı. Piyasayı zamanlayamadığını fark edip sadece tutacağını ilan etti. Orijinal gönderi [BitcoinTalk](https://bitcointalk.org/index.php?topic=375643.0) ve [Wikipedia](https://en.wikipedia.org/wiki/Hodl) üzerinde belgelenmiştir.\n\nYazım hatası önce meme\'e sonra harekete dönüştü. **HODL** artık uzun vadeli ufukla Bitcoin alıp oynaklıkta satmama felsefesini temsil ediyor.\n\nBu basit stratejinin neden popüler olduğunun yanıtı veride: Aktif trader\'lar sürekli olarak tutuculardan kötü performans gösteriyor.',
    },
    {
      id: 'veri-arguman',
      heading: 'HODL Lehine Veri Argümanı',
      content: 'Bitcoin\'in tarihsel verisi tartışılmaz bir dava sunar:\n\n• **4 yıllık tutma dönemleri:** 4+ yıl tutan tüm alıcılar kârda, alım zamanından bağımsız\n• **Yıllık ortalama getiri (2013-2026):** Tutucular için ~%65 CAGR\n• **HODLer arzı:** Tüm Bitcoin\'in %70+\'ı 1+ yıldır hareketsiz\n• **Gerçekleşmemiş kâr:** Uzun vadeli tutucular ayı piyasalarında bile büyük gerçekleşmemiş kazançların üzerinde oturuyor\n\n| Tutma Süresi | Kârlı Olma % |\n|---|---|\n| 1 gün | ~%53 |\n| 1 ay | ~%58 |\n| 1 yıl | ~%72 |\n| 2 yıl | ~%85 |\n| 4 yıl | ~%100 |',
      cta: { calculatorId: 'hodl-strategy', calculatorName: 'HODL Stratejisi Hesaplayıcısı', text: 'Herhangi bir tarihten HODL yapsaydınız nasıl performans gösterirdi?', path: '/tr/hesaplayicilar/bitcoin-hodl-stratejisi' },
    },
    {
      id: 'hodl-vs-trade',
      heading: 'HODL vs Aktif Trade: Trader\'lar Neden Kaybeder',
      content: 'Aktif trade\'e karşı kanıtlar ezicidir:\n\n• Çoklu borsa çalışmalarına göre **trader\'ların %80-95\'i para kaybeder**\n• **İşlem ücretleri birikir:** İşlem başına %0,1 bile aktif trader\'lar için yıllık sermayenin %50+\'sına ulaşır\n• **Vergi sürtünmesi:** Kısa vadeli kazançlar daha yüksek oranda vergilendirilir (%37\'ye kadar)\n• **Duygusal hatalar:** Korku ve açgözlülük trader\'ları dipte satıp tepede almaya iter\n• **Zaman maliyeti:** Aktif trade tam zamanlı bir iştir ve nadiren stresi telafi eder\n\nEn basit strateji — al ve tut — herhangi bir 4+ yıllık dönemde karmaşık trade stratejilerinin büyük çoğunluğunu yenmiştir.',
    },
    {
      id: 'strateji-kurma',
      heading: 'HODL Stratejinizi Nasıl Kurarsınız?',
      content: 'Doğru HODL stratejisi sadece "al ve unut" değildir:\n\n• **Zaman ufkunuzu tanımlayın.** Minimum 4 yıl (bir [yarılanma](/tr/ogrenin/bitcoin-yarilanmasi-nedir) döngüsü) taahhüt edin.\n• **Birikim yönteminizi seçin.** Önemli düşüşlerde toplu alımları düzenli [DCA alımlarıyla](/tr/ogrenin/bitcoin-dca-nedir) birleştirin.\n• **Bitcoin\'inizi güvende tutun.** Donanım cüzdanına (Ledger, Trezor, Coldcard) taşıyın. Anahtarlarınız değilse coinleriniz de değildir.\n• **Tahsisinizi belirleyin.** Portföyünüzün yüzde kaçının Bitcoin olacağına karar verin.\n• **Satış planı oluşturun.** "500K$\'a ulaşırsa %10 satarım" gibi çıkış koşulları tanımlayın.\n• **Gürültüyü görmezden gelin.** Fiyat alarmlarını silin. Saatlik değil, haftalık bakın.',
      cta: { calculatorId: 'what-if', calculatorName: 'Ya Olsaydı Hesaplayıcısı', text: 'Geçmişte HODL yapsaydınız Bitcoin\'iniz bugün ne kadar olurdu?', path: '/tr/hesaplayicilar/bitcoin-ya-olsaydi' },
    },
    {
      id: 'vergi-avantajlari',
      heading: 'Uzun Vadeli Tutmanın Vergi Avantajları',
      content: 'HODL sadece getiri değil, **kazandığınızdan daha fazlasını korumakla** ilgilidir:\n\n• **Kısa vadeli kazançlar (< 1 yıl):** Sıradan gelir gibi %10-37\n• **Uzun vadeli kazançlar (> 1 yıl):** Tercihli oranlar (%0, %15 veya %20)\n• **Satana kadar vergilendirilebilir olay yok:** Gerçekleşmemiş kazançlar vergilendirilmez\n• **Maliyet adımı (step-up):** Bazı yargı bölgelerinde miras yoluyla devredilen Bitcoin için sermaye kazancı vergisi tamamen ortadan kalkabilir.',
    },
    {
      id: 'ne-zaman-hodl-etme',
      heading: 'NE ZAMAN HODL ETMEMELİ',
      content: 'HODL her zaman doğru hamle değildir:\n\n• **Kısa vadede ihtiyacınız olan parayı yatırdıysanız.** 1-2 yıl içinde ihtiyacınız varsa Bitcoin\'in oynaklığı uygun değildir.\n• **Tahsisiniz çok büyük.** Bitcoin servetinizin %80+\'ı ise ve kaygıya neden oluyorsa, rahat bir seviyeye dengelemek akıllıdır.\n• **Teziniz değişti.** Bitcoin\'in temel değer önerisinin kırıldığına gerçekten inanıyorsanız yeniden değerlendirme rasyoneldir.\n• **Yaşam koşulları değişir.** Tıbbi acil durumlar, ev alımı gibi gerçek ihtiyaçlar her yatırım tezinin önündedir.\n\nHODL\'un amacı finansal özgürlüktür, finansal stres değil.',
    },
  ],
  howToSteps: [
    { name: 'HODL\'un anlamını öğrenin', text: 'Uzun vadeli Bitcoin tutmanın felsefesini ve neden trade\'i yendiğini anlayın' },
    { name: 'Zaman ufkunuzu belirleyin', text: 'En az 4 yıl (bir tam piyasa döngüsü) tutmaya söz verin' },
    { name: 'HODL hesaplayıcısını kullanın', text: 'Herhangi bir başlangıç tarihinden geçmiş tutma getirilerini görün' },
    { name: 'Bitcoin\'inizi güvende tutun', text: 'Tutuşlarınızı maksimum güvenlik için donanım cüzdanına aktarın' },
    { name: 'Satış planı oluşturun', text: 'Hangi koşullarda kâr alacağınızı tanımlayın' },
  ],
  expertQuote: {
    quote: 'Bitcoin alın ve on yıllığına soğuk depolamaya koyun. Tüm strateji budur. Piyasa sizi silkelemeye çalışacaktır. Silkelenmeyin.',
    author: 'Michael Saylor',
    role: 'MicroStrategy Yönetim Kurulu Başkanı',
    source: 'https://www.youtube.com/watch?v=VHKt5cF2H7Y',
    sourceLabel: 'PBD Podcast (2024)',
  },
  speakable: true,
};

export default article;
