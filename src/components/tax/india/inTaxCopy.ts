/**
 * India Bitcoin Tax Calculator — bilingual copy strings.
 * Keep all EN/TR text used by the India-specific sections in one place so
 * translation-parity tests can enforce keys match 1:1.
 */

export const IN_COPY = {
  glance: {
    heading: { en: "Section 115BBH at a glance", tr: "115BBH Bölümü özeti" },
    cards: [
      {
        key: "flat",
        title: { en: "30% flat rate", tr: "%30 sabit oran" },
        body: {
          en: "Gains from virtual digital assets are taxed at a flat 30%, no slab, no deductions except cost of acquisition.",
          tr: "Sanal dijital varlık kazançları, sabit %30 oranla vergilenir; dilim yok, edinim maliyeti dışında indirim yok.",
        },
      },
      {
        key: "cess",
        title: { en: "4% health & education cess", tr: "%4 sağlık ve eğitim kesintisi" },
        body: {
          en: "Cess is applied on top of the 30% tax, taking the effective headline rate to 31.2%.",
          tr: "Cess, %30 verginin üzerine uygulanır; efektif başlık oranı %31,2'ye çıkar.",
        },
      },
      {
        key: "tds",
        title: { en: "1% TDS per sale", tr: "Her satışta %1 TDS" },
        body: {
          en: "Exchanges deduct 1% TDS on gross sale proceeds under Section 194S. Reclaim any excess against your final Section 115BBH liability.",
          tr: "Borsalar 194S Bölümü kapsamında brüt satış tutarı üzerinden %1 TDS keser. Fazlasını nihai 115BBH Bölümü borcuna karşı geri alın.",
        },
      },
      {
        key: "noOffset",
        title: { en: "No loss set-off", tr: "Zarar mahsubu yok" },
        body: {
          en: "Losses from one VDA cannot offset gains from another VDA, other income, or be carried forward.",
          tr: "Bir VDA'daki zarar, başka bir VDA veya diğer gelirlerin kazancına mahsup edilemez, ileriye taşınamaz.",
        },
      },
    ],
  },
  tds: {
    heading: { en: "TDS reclaim estimator", tr: "TDS iade hesaplayıcısı" },
    subtitle: {
      en: "Exchanges deduct 1% TDS on every crypto sale. Compare it to your Section 115BBH liability to see how much is refundable when you file ITR-2.",
      tr: "Borsalar her kripto satışında %1 TDS keser. ITR-2 ile ne kadarının iade edilebileceğini görmek için 115BBH Bölümü borcunuzla karşılaştırın.",
    },
    inputs: {
      proceeds: { en: "Gross sale proceeds (INR)", tr: "Brüt satış tutarı (INR)" },
      cost: { en: "Cost of acquisition (INR)", tr: "Edinim maliyeti (INR)" },
    },
    outputs: {
      gain: { en: "Taxable gain", tr: "Vergilendirilebilir kazanç" },
      liability: { en: "115BBH tax + cess", tr: "115BBH vergi + cess" },
      tds: { en: "TDS deducted (1%)", tr: "Kesilen TDS (%1)" },
      refund: { en: "Refundable TDS", tr: "İade edilebilir TDS" },
      payable: { en: "Additional payable", tr: "Ek ödenecek tutar" },
    },
    note: {
      en: "Refund is capped at TDS actually deducted. Losses do not reduce Section 115BBH liability but you can still reclaim the full TDS on those sales.",
      tr: "İade, fiilen kesilen TDS ile sınırlıdır. Zararlar 115BBH Bölümü borcunu azaltmaz ancak bu satışlardaki TDS'nin tamamını geri alabilirsiniz.",
    },
  },
  vda: {
    heading: { en: "ITR Schedule VDA preview", tr: "ITR VDA Çizelgesi önizlemesi" },
    subtitle: {
      en: "Preview how a transaction row appears in Schedule VDA of ITR-2 / ITR-3. Each disposal of a virtual digital asset is a separate row.",
      tr: "Bir işlem satırının ITR-2 / ITR-3 VDA Çizelgesinde nasıl göründüğünü önizleyin. Her VDA elden çıkarma ayrı bir satırdır.",
    },
    columns: {
      acquired: { en: "Date of acquisition", tr: "Edinim tarihi" },
      transferred: { en: "Date of transfer", tr: "Devir tarihi" },
      cost: { en: "Cost of acquisition (INR)", tr: "Edinim maliyeti (INR)" },
      consideration: { en: "Consideration (INR)", tr: "Karşılık (INR)" },
      income: { en: "Income from transfer (INR)", tr: "Devirden gelir (INR)" },
    },
    sample: [
      { acquired: "2026-04-12", transferred: "2026-11-18", cost: 250_000, consideration: 400_000 },
      { acquired: "2026-08-01", transferred: "2027-03-20", cost: 500_000, consideration: 480_000 },
      { acquired: "2026-01-10", transferred: "2026-12-05", cost: 100_000, consideration: 350_000 },
    ],
    footnote: {
      en: "Losses (negative Income from Transfer) must still be reported but cannot be set off under Section 115BBH(2).",
      tr: "Zararlar (negatif Devirden Gelir) yine raporlanmalıdır ancak 115BBH(2) Bölümü kapsamında mahsup edilemez.",
    },
  },
  filingHowTo: {
    name: {
      en: "How to file Bitcoin tax in India (Schedule VDA)",
      tr: "Hindistan'da Bitcoin vergisi nasıl beyan edilir (VDA Çizelgesi)",
    },
    steps: {
      en: [
        "Export every buy and sell from your exchanges with dates, INR amounts, and TDS deducted.",
        "Compute gain per disposal as consideration minus cost of acquisition — no other deductions allowed.",
        "Apply 30% + 4% cess on total gains under Section 115BBH. Losses cannot offset any gains.",
        "Enter each disposal as a row in Schedule VDA of ITR-2 (or ITR-3 if business income).",
        "Claim the 1% TDS deducted under Section 194S as tax already paid; excess is refunded.",
      ],
      tr: [
        "Borsalardan tarih, INR tutar ve kesilen TDS ile birlikte tüm alım-satımları dışa aktarın.",
        "Her elden çıkarma için kazancı karşılık eksi edinim maliyeti olarak hesaplayın — başka indirim yoktur.",
        "Toplam kazanca 115BBH Bölümü kapsamında %30 + %4 cess uygulayın. Zararlar hiçbir kazancı mahsup edemez.",
        "Her elden çıkarmayı ITR-2'nin VDA Çizelgesine (işletme geliri ise ITR-3) satır olarak girin.",
        "194S Bölümü kapsamında kesilen %1 TDS'yi ödenmiş vergi olarak talep edin; fazlası iade edilir.",
      ],
    },
  },
} as const;
