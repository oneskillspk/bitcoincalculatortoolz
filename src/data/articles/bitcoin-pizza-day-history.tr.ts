import { Article } from '../articles';

/** TR counterpart of `bitcoin-pizza-day-history` → `/tr/ogrenin/bitcoin-pizza-gunu-tarihi`. */
const article: Article = {
  slug: 'bitcoin-pizza-gunu-tarihi',
  title: 'Bitcoin Pizza Günü: 10.000 BTC ve İki Pizzanın Hikâyesi',
  metaDescription:
    '22 Mayıs 2010\'da Laszlo Hanyecz iki Papa John\'s pizzası için 10.000 BTC (bugün 1 milyar $+ değerinde) ödedi — Bitcoin\'in gerçek dünyadaki ilk alımı. Tüm hikâye.',
  category: 'Basics',
  publishedDate: '2026-03-02',
  updatedDate: '2026-05-18',
  readingTime: 9,
  keywords: ['bitcoin pizza günü', 'bitcoin pizza tarihi', '10000 btc pizza', 'laszlo hanyecz', 'bitcoin fırsat maliyeti', 'ilk bitcoin işlemi'],
  relatedCalculators: ['pizza-day', 'time-machine', 'what-if', 'profit-loss'],
  relatedArticles: ['bitcoin-dca-nedir', 'bitcoin-hodl-stratejisi-aciklamasi', 'bitcoin-kar-zarar-nasil-hesaplanir'],
  howToSteps: [
    { name: 'Hikâyeyi öğrenin', text: 'Laszlo Hanyecz ve 22 Mayıs 2010 tarihli orijinal 10.000 BTC pizza işlemini okuyun' },
    { name: 'Rakamları görün', text: 'Canlı Pizza Günü Hesaplayıcımızı kullanarak 10.000 BTC\'nin bugünkü değerini kontrol edin' },
    { name: 'Kendi maliyetinizi hesaplayın', text: 'Geçmiş herhangi bir alım miktarı ve tarihi girerek Bitcoin\'de neyi kaçırdığınızı görün' },
    { name: 'Pizza Endeksini keşfedin', text: '2010\'dan bu yana 1 BTC\'nin her yıl kaç pizza alabildiğini görüntüleyin' },
  ],
  faqs: [
    { question: 'Bitcoin Pizza Günü nedir?', answer: 'Bitcoin Pizza Günü, gerçek dünyadaki ilk bilinen Bitcoin işlemini anmak için her 22 Mayıs\'ta kutlanır. 2010\'da programcı Laszlo Hanyecz iki Papa John\'s pizzası için 10.000 BTC ödedi — o zaman ~41$ değerinde, şimdi 1 milyar $\'ın üzerinde.' },
    { question: 'Laszlo Hanyecz kimdir?', answer: 'Jacksonville, Florida\'dan bir programcı ve erken dönem Bitcoin geliştiricisidir. Bitcoin\'e GPU madencilik kodu katkısında bulundu ve 22 Mayıs 2010\'da iki pizza için 10.000 BTC ödeyerek ilk ticari Bitcoin işlemini yaptı.' },
    { question: '10.000 BTC bugün ne kadar eder?', answer: '100.000$ Bitcoin fiyatında 10.000 BTC tam olarak 1 milyar $ eder. Anlık değer için Pizza Günü Hesaplayıcımızı kullanın.' },
    { question: 'Bitcoin Pizza Günü neden önemli?', answer: 'Bitcoin\'in fiziksel bir mal satın almak için ilk kez kullanıldığı andı; bunun gerçek para olarak işlev görebileceğini kanıtladı. Bitcoin\'i değişim aracı olarak meşrulaştırdı.' },
    { question: 'Hanyecz pizza alımından pişman mı?', answer: 'Hanyecz pişman olmadığını açıkça belirtti. Bunu Bitcoin\'in faydasını kanıtlamaya yardım eden önemli bir an olarak görüyor.' },
    { question: 'Bitcoin Pizza Günü nasıl kutlanır?', answer: 'Kripto topluluğu pizza partileri, sosyal medya etkinlikleri ve kripto borsalarından özel kampanyalarla kutlar. Birçok şirket 22 Mayıs\'ta indirim sunar.' },
  ],
  sections: [
    {
      id: 'islem',
      heading: 'Tarihteki En Pahalı Pizza',
      content: '18 Mayıs 2010\'da Laszlo Hanyecz adlı bir programcı [BitcoinTalk forumuna](https://bitcointalk.org/index.php?topic=137.0) basit bir mesaj attı: "Birkaç pizza için 10.000 bitcoin öderim... mesela 2 büyük olsun ki ertesi gün de yiyebileyim." O zaman Bitcoin henüz bir yaşındaydı ve kabul görmüş bir piyasa fiyatı yoktu. 10.000 BTC, mevcut kurla yaklaşık 41$ değerindeydi. Dört gün sonra [22 Mayıs 2010\'da](https://en.wikipedia.org/wiki/Bitcoin_Pizza_Day), "jercos" (Jeremy Sturdivant) teklifi kabul etti ve Hanyecz\'in Jacksonville\'deki evine iki Papa John\'s pizzası sipariş etti. Kimse o iki pizzanın insanlık tarihinin en pahalı yemeği olacağını bilmiyordu — Bitcoin 100.000$\'ı aşarken 1 milyar $\'ın üzerine çıktı.',
      cta: { calculatorId: 'pizza-day', calculatorName: 'Pizza Günü Hesaplayıcısı', text: '10.000 BTC pizza işleminin canlı değerini görün', path: '/tr/hesaplayicilar/bitcoin-pizza-gunu' },
    },
    {
      id: 'laszlo-kim',
      heading: 'Laszlo Hanyecz Kimdi?',
      content: 'Laszlo Hanyecz rastgele bir Bitcoin kullanıcısı değildi — Bitcoin kod tabanına önemli katkılar yapan erken bir geliştiriciydi. En önemlisi, madencilik verimliliğini büyük ölçüde artıran ilk GPU madencilik uygulamasını geliştirdi. Bitcoin\'i pizza gibi günlük alımlara harcamaya istekli olması, Bitcoin\'i sadece spekülatif bir varlık değil, işlevsel bir para birimi olarak desteklemek için bilinçli bir hareketti. Röportajlarda fiyat yükselse de pizza almaya devam ettiğini ve zamanla pizza için toplam yaklaşık 100.000 BTC harcadığını söyledi.',
    },
    {
      id: 'neden-onemli',
      heading: 'Pizza İşlemi Neden Her Şeyi Değiştirdi',
      content: 'Laszlo\'nun pizza alımından önce Bitcoin tamamen teorik bir dijital varlıktı. Hiç kimse onunla gerçek şeyler alınabileceğini kanıtlamamıştı. Birincisi, somut bir döviz kuru oluşturdu — 10.000 BTC ~25$ değerindeki iki pizza alıyorsa, 1 BTC ~0,0025$ ediyordu. İkincisi, Bitcoin\'in paranın üç temel özelliğinden biri olan değişim aracı olarak işlev görebileceğini kanıtladı. Üçüncüsü, gelecekteki benimseyenleri çekecek güçlü bir anlatı yarattı.',
    },
    {
      id: 'firsat-maliyeti',
      heading: 'Bitcoin Fırsat Maliyetini Anlamak',
      content: 'Pizza işlemi fırsat maliyetinin nihai örneğidir — harcanan her dolar yatırılmayan bir dolardır. Akşam yemeğine 100$ harcadığınızda aynı zamanda o 100$ ile Bitcoin almamayı SEÇİYORSUNUZ. Bitcoin önemli ölçüde değer kazanırsa, o akşam yemeğinin "gerçek" maliyeti menü fiyatından çok daha yüksekti. Bu hiç para harcamamanız gerektiği anlamına gelmez ancak değiş tokuşu anlamak değerlidir. Ocak 2011\'de alınan 5$\'lık bir kahve, 20 milyon $\'ın üzerinde kaçırılmış Bitcoin kazancını temsil eder.',
      cta: { calculatorId: 'pizza-day', calculatorName: 'Fırsat Maliyeti Hesaplayıcısı', text: 'Kişisel Bitcoin fırsat maliyetinizi hesaplayın', path: '/tr/hesaplayicilar/bitcoin-pizza-gunu' },
    },
    {
      id: 'pizza-endeksi',
      heading: 'Bitcoin Pizza Endeksi: Eğlenceli Bir Metrik',
      content: 'Bitcoin Pizza Endeksi basit bir soruyu izler: 1 Bitcoin kaç tane 20$\'lık pizza alabilir? 2010\'da yanıt sıfırdı. 2013\'te 1 BTC yaklaşık 10 pizza alabiliyordu. 2017 boğa koşusu sırasında 1.000+ pizzaya sıçradı. 2021\'de Bitcoin\'in 69.000$ zirvesinde tek bir Bitcoin ~3.450 pizza alabilirdi. 100.000$\'da ise Bitcoin başına 5.000 pizza. Pizza Endeksi, Bitcoin\'in satın alma gücü büyümesini soyut dolar rakamlarından daha sezgisel görselleştirmenin hafif bir yoludur.',
    },
    {
      id: 'kilometre-taslari',
      heading: 'Pizza İşleminden Bu Yana Önemli Kilometre Taşları',
      content: '41$\'dan 1 milyar $\'a yolculuk kurgu gibi okunuyor. Şubat 2011\'de Bitcoin ilk kez 1$\'a ulaştı; pizza 10.000$ değerinde. Kasım 2013\'te Bitcoin 1.000$\'ı aştı; pizza BTC\'si 10 milyon $ değerinde. Aralık 2017 boğa koşusu Bitcoin\'i 20.000$\'a itti, pizzayı 200 milyon $ yaptı. Kasım 2021\'de 69.000$\'da pizza 690 milyon $ değerinde. En dramatik kilometre taşı, Ocak 2025\'te Bitcoin 100.000$\'ı aştığında Laszlo\'nun pizzasını resmi olarak milyar dolarlık bir işleme dönüştürdü.',
      cta: { calculatorId: 'time-machine', calculatorName: 'Zaman Makinesi Hesaplayıcısı', text: 'Herhangi bir tarihten Bitcoin yatırımının bugünkü değerini görün', path: '/tr/hesaplayicilar/bitcoin-zaman-makinesi' },
    },
    {
      id: 'dersler',
      heading: 'Günümüz Bitcoin Yatırımcıları İçin Dersler',
      content: 'Pizza hikâyesi zamansız dersler öğretir. Birincisi, erken benimseme muazzam önemlidir. İkincisi, Bitcoin harcamak doğası gereği yanlış değildir; Hanyecz Bitcoin\'in faydasını kanıtlamaya yardım etti. Üçüncüsü, fırsat maliyeti gerçektir ama sizi felç etmemelidir. Herkes Bitcoin biriktirip hiç harcamasaydı, para olarak hiçbir faydası ve potansiyel olarak hiçbir değeri olmazdı. Temel çıkarım pişmanlık değil, farkındalıktır.',
      cta: { calculatorId: 'what-if', calculatorName: 'Ya Olsaydı Hesaplayıcısı', text: 'Kendi tarihsel Bitcoin yatırım senaryolarınızı çalıştırın', path: '/tr/hesaplayicilar/bitcoin-ya-olsaydi' },
    },
  ],
};

export default article;
