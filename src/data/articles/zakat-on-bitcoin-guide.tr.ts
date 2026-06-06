import { Article } from '../articles';

/** TR counterpart of `zakat-on-bitcoin-guide` → `/tr/ogrenin/bitcoin-zekati-rehberi`. */
const article: Article = {
  slug: 'bitcoin-zekati-rehberi',
  title: 'Bitcoin Zekâtı 2026: Nisap, Havl ve %2,5 Hesaplama',
  metaDescription:
    'Bitcoin önde gelen Şer\'i görüşlere göre Mal\'dır — Havl sonrası toplam değerin %2,5\'i Zekât olarak verilir. Çoğu âlim Gümüş Nisabı esas alır. Ücretsiz hesaplayın.',
  category: 'Investing',
  publishedDate: '2026-03-13',
  updatedDate: '2026-05-18',
  readingTime: 10,
  keywords: ['bitcoin zekâtı', 'bitcoin zekat', 'kripto zekât hesaplayıcı', 'bitcoin nisap', 'bitcoin havl', 'kripto zekat hesaplama'],
  relatedCalculators: ['bitcoin-zakat', 'bitcoin-converter', 'wealth-percentile', 'capital-gains-tax'],
  relatedArticles: ['ne-kadar-bitcoin-sahibi-olmaliyim', 'bitcoin-vergi-rehberi-sermaye-kazanci', 'bitcoin-tasarruf-plani-rehberi'],
  howToSteps: [
    { name: 'Bitcoin\'in zekâta tabi olup olmadığını belirleyin', text: 'Bitcoin çoğu âlim tarafından parasal bir varlık kabul edilir; Nisabı aşan miktar bir Havl boyunca tutulursa %2,5 Zekâta tabidir.' },
    { name: 'Nisap eşiğini kontrol edin', text: 'Gümüş Nisabını (612,36g gümüş, Mart 2026\'da ~1.671$) veya Altın Nisabını (87,48g altın, ~14.377$) kullanın. Gümüş tavsiye edilir.' },
    { name: 'Toplam zekâta tabi servetinizi hesaplayın', text: 'Bitcoin değeri + nakit + altın + gümüş + hisse senedi toplayın. 12 ay içindeki borçları düşün.' },
    { name: 'Havl\'inizi doğrulayın', text: 'Servetinizin tam bir kameri yıl (354 gün) boyunca Nisabın üzerinde kaldığından emin olun.' },
    { name: 'Net zekâta tabi servetin %2,5\'ini ödeyin', text: 'Net servetinizi %2,5 ile çarpın. Fiat veya Bitcoin ile ödeyebilirsiniz.' },
  ],
  faqs: [
    { question: 'Bitcoin için Zekât öder miyim?', answer: 'Evet, çağdaş İslam âlimlerinin çoğunluğuna göre. Bitcoin parasal varlık olarak değerlendirilir; toplam servetiniz tam bir kameri yıl boyunca Nisabı aşarsa değerinin %2,5\'i oranında Zekâta tabidir.' },
    { question: 'Bitcoin İslam\'da haram mıdır?', answer: 'Âlimlerin çoğunluğu Bitcoin\'i tutmayı ve ticaretini caiz (helal) kabul eder. Bitcoin\'i değer saklayıcı olarak tutmak yaygın biçimde caiz görülür.' },
    { question: 'Bitcoin Zekâtı için Nisap nedir?', answer: 'Bitcoin için ayrı bir Nisap yoktur. Bitcoin değeriniz diğer zekâta tabi varlıklarınızla toplanır ve Gümüş Nisabı (612,36g gümüş) veya Altın Nisabı (87,48g altın) ile karşılaştırılır.' },
    { question: 'Bitcoin için Havl nasıl hesaplanır?', answer: 'Havl, toplam zekâta tabi servetinizin Nisabı ilk aştığı tarihten itibaren bir tam kameri yıldır (354 gün). Servetiniz Nisabın altına düşüp tekrar çıkarsa Havl sıfırlanır.' },
    { question: 'Zekâtı Bitcoin ile ödeyebilir miyim?', answer: 'Evet, birçok âlim alıcının kullanabilmesi veya çevirebilmesi şartıyla Zekâtın Bitcoin ile ödenmesine izin verir. Tutar, Zekât tarihinizdeki piyasa değerine göre servetinizin %2,5\'ine eşit olmalıdır.' },
  ],
  sections: [
    {
      id: 'bitcoin-helal-mi',
      heading: 'Bitcoin Helal mi? 2026\'da Âlimler Ne Diyor?',
      content: 'Çağdaş İslam âlimlerinin çoğunluğu Bitcoin\'i tutmayı ve ticaretini caiz (helal) kabul eder. Bitcoin dijital parasal varlık olarak görülür — değeri olan, sahip olunabilen ve mübadele edilebilen bir mâl (servet) biçimidir.\n\nGörüşler tamamen caizden şartlı caize uzanır. Kısıtlayıcı âlimlerin öne sürdüğü başlıca endişeler aşırı fiyat spekülasyonu, yasak işlemlerde potansiyel kullanım ve devlet desteğinin olmamasıdır. Ancak aynı endişeler birçok geleneksel varlık için de geçerlidir.\n\nBitcoin\'in cevazını destekleyen başlıca görüşler:\n\n- **İslam Fıkıh Akademisi** — dijital paraları İslami finans kurallarına tabi varlıklar olarak değerlendirir\n- **Müftü Taki Usmani çerçevesi** — piyasa değeri ve faydası olan dijital varlıklar mâl olarak ele alınabilir\n- **AAOIFI standartları** — kripto paranın Şeriat altında sınıflandırılmasına ilişkin süregelen inceleme\n\nBitcoin\'i uzun vadeli yatırım olarak satın almak kumar (meysir) sayılmaz.',
    },
    {
      id: 'dort-sart',
      heading: 'Bitcoin\'de Zekâtın Dört Şartı',
      content: 'Bitcoin varlıklarınız üzerinde Zekâtın farz olması için dört şartın aynı anda yerine getirilmesi gerekir:\n\n- **Tam mülkiyet (milkiyyet tâmme):** Bitcoin\'e tam sahip olmalısınız — ödünç değil, teminat olarak rehinli değil ve çıkaramadığınız bir akıllı sözleşmede kilitli değil.\n- **Nisap eşiğinin üzerinde:** Toplam zekâta tabi servetiniz (Bitcoin + nakit + altın + gümüş + hisse − borçlar) Nisabı aşmalıdır. Çoğu âlim daha fazla alıcıya fayda sağladığı için Gümüş Nisabını (612,36g gümüş ≈ 1.671$, Mart 2026) tavsiye eder.\n- **Havl\'in tamamlanması:** Servetiniz bir tam kameri yıl (354 gün) Nisabın üzerinde kalmalıdır.\n- **Temel ihtiyaçlardan fazla:** Servet, temel yaşam giderlerinizin ötesinde olmalıdır.',
    },
    {
      id: 'gumus-vs-altin-nisap',
      heading: 'Gümüş vs Altın Nisabı — 2026\'da Hangisini Kullanmalı?',
      content: 'Zekât hesaplamasındaki en önemli kararlardan biridir ve 2026\'da her zamankinden daha önemlidir.\n\n**Gümüş Nisabı (612,36g):** yaklaşık 1.671$ (Mart 2026)\n**Altın Nisabı (87,48g):** yaklaşık 14.377$ (Mart 2026)\n\nFark devasa — neredeyse 9 kat. Buna rağmen Gümüş Nisabı şu nedenlerle hâlâ tavsiye edilen standarttır:\n\n- Daha düşük eşik, daha fazla insanın Zekâta uygun olması anlamına gelir\n- Daha fazla alıcıya fayda sağlar ve servet arındırma olarak Zekât ruhuna uyar\n- Dört mezhepteki âlimlerin çoğu karma varlıklar için Gümüş Nisabını tavsiye eder\n\nAltın Nisabını yalnızca servetiniz tamamen veya ağırlıklı olarak altından oluşuyorsa kullanın.',
      cta: { calculatorId: 'bitcoin-zakat', calculatorName: 'Bitcoin Zekât Hesaplayıcısı', text: 'Canlı Nisap eşiğinizi kontrol edin', path: '/tr/hesaplayicilar/bitcoin-zekat-hesaplayicisi' },
    },
    {
      id: 'havl-nasil-calisir',
      heading: 'Bitcoin için Havl Nasıl Çalışır?',
      content: 'Havl İslami kameri yıldır — 354 gün (365 değil). Toplam zekâta tabi servetinizin Nisap eşiğini ilk aştığı tarihten başlar.\n\n**Temel kurallar:**\n\n- Yıl içinde servetiniz Nisabın altına düşerse, bir sonraki Nisabı aştığı tarihten itibaren Havl sıfırlanır\n- Yıl içinde yeni Bitcoin alımları mevcut servetinize eklenir — ayrı Havl almazlar\n- Zekâtınız ortalamaya göre değil, Havl yıldönümü tarihindeki toplam değer üzerinden hesaplanır\n- Bitcoin\'in fiyat oynaklığı Nisap durumunuzun sık değişebileceği anlamına gelir — gerçek Zekât tarihinizde kontrol edin\n\n**Pratik ipucu:** Birçok Müslüman manevi sevap için Zekâtı Ramazan\'da hesaplayıp ödemeyi tercih eder.',
    },
    {
      id: 'hesaplama',
      heading: 'TRY, USD, EUR\'da Zekât Hesaplama',
      content: 'Formül para biriminden bağımsızdır:\n\n**Zekât = (Toplam Zekâta Tabi Varlıklar − 12 Ay İçindeki Borçlar) × %2,5**\n\nTRY cinsinden örnek:\n\n- 0,5 BTC × 2.880.000 ₺/BTC = 1.440.000 ₺\n- Nakit birikim: 60.000 ₺\n- 50g 22 ayar altın: 99.000 ₺\n- Toplam: 1.599.000 ₺\n- Borçlar: 0 ₺\n- Gümüş Nisabı: ~56.500 ₺ — ✅ Aşıldı\n- Zekât = 1.599.000 × %2,5 = **39.975 ₺**',
      cta: { calculatorId: 'bitcoin-zakat', calculatorName: 'Bitcoin Zekât Hesaplayıcısı', text: 'Tam Zekâtınızı şimdi hesaplayın', path: '/tr/hesaplayicilar/bitcoin-zekat-hesaplayicisi' },
    },
    {
      id: 'bitcoin-otesi-kripto',
      heading: 'Bitcoin Ötesinde Kripto Zekâtı',
      content: 'Aynı Zekât ilkeleri tüm kripto paralar için geçerlidir — yalnızca Bitcoin için değil. Ethereum, XRP, Solana veya piyasa değeri olan başka bir dijital varlık tutuyorsanız zekâta tabidir.\n\nZekât amacıyla tüm kripto varlıkların TRY/USD değerini diğer zekâta tabi varlıklarınızla toplayın. Farklı kripto paralar için ayrı Nisap veya oran yoktur — hepsi toplam net zekâta tabi servetin %2,5\'idir.',
    },
    {
      id: 'bitcoin-ile-zekat',
      heading: 'Zekâtı Bitcoin ile Ödeyebilir misiniz?',
      content: 'Evet — birçok çağdaş âlim Zekâtın Bitcoin ile ödenmesine, şartlarla izin verir:\n\n- Alıcı Bitcoin\'i kullanabilmeli veya çevirebilmelidir\n- Bitcoin miktarı Zekât tarihinizdeki piyasa değerine göre servetinizin %2,5\'ine eşit olmalıdır\n- Bazı âlimler Zekâtın alıcının yerel para biriminde ödenmesini anında kullanılabilirlik için tercih eder\n\nZekâtı Bitcoin olarak kabul eden kuruluşlar artıyor — yerel İslami yardım kuruluşunuza danışın.',
    },
    {
      id: 'sik-yapilan-hatalar',
      heading: 'Sık Yapılan Hatalar — 2026 Uyarısı',
      content: 'Zekât hesaplamasında en sık yapılan beş hata:\n\n- **Gümüş geçerliyken Altın Nisabını kullanmak:** Altın Nisabı ~14.377$, Gümüş ~1.671$ — 9 kat fark.\n- **Bitcoin ve kripto unutmak:** Dijital varlıklar nakit gibi zekâta tabidir.\n- **Tüm ipotek bakiyesini düşmek:** Yalnızca 12 aylık taksit düşülebilir, toplam borç değil.\n- **Havl\'i göz ardı etmek:** Zekât yalnızca 354 gün boyunca Nisabın üzerinde tutulan servet üzerinde tahakkuk eder.\n- **Eski Nisap değerlerini kullanmak:** Gümüş 2025 başından bu yana %180 yükseldi. Daima canlı fiyatları kullanın.',
      cta: { calculatorId: 'bitcoin-zakat', calculatorName: 'Bitcoin Zekât Hesaplayıcısı', text: 'Hesaplayıcıda canlı Nisap fiyatlarını kullanın', path: '/tr/hesaplayicilar/bitcoin-zekat-hesaplayicisi' },
    },
  ],
  expertQuote: {
    quote: 'Kripto paralar mal (mâl) olarak kabul edilir ve Nisaba ulaşıp tam bir kameri yılı tamamlarlarsa %2,5 oranında Zekâta tabidir.',
    author: 'AAOIFI',
    role: 'İslami Finans Kuruluşları Muhasebe ve Denetim Kuruluşu',
    source: 'https://aaoifi.com/shariaa-standards/?lang=en',
    sourceLabel: 'AAOIFI Şeriat Standardı No. 35',
  },
  speakable: true,
};

export default article;
