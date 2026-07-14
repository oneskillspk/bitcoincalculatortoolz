/**
 * Single source of truth for region-specific copy used across the three
 * regional Bitcoin tax pages (IN / UK / DE). Each entry holds EN + TR
 * variants for hero, chips, methodology, scenario labels, and FAQ.
 *
 * Keep this file pure data — components import it to render.
 */

export type RegionId = "in" | "uk" | "de";

interface RegionMeta {
  id: RegionId;
  flag: string;
  currency: string;
  symbol: string;
  /** Display label for the current tax year (e.g. "2026", "2026/27"). */
  taxYear: string;
  /** Authority/citation block — agency name + relevant section/code. */
  authority: { en: string; tr: string };
  /** ISO source URLs used in the methodology section. */
  sources: { label: string; url: string }[];

  heading: { en: string; tr: string };
  highlight: { en: string; tr: string };
  subtitle: { en: string; tr: string };
  chips: { en: string[]; tr: string[] };

  methodology: { en: string[]; tr: string[] };

  faq: { q: { en: string; tr: string }; a: { en: string; tr: string } }[];
}

/** ISO date these regional tax pages were last reviewed against source rules. */
export const TAX_LAST_REVIEWED_ISO = "2026-06-22";
export const TAX_LAST_REVIEWED_LABEL = {
  en: "Last reviewed: June 2026",
  tr: "Son inceleme: Haziran 2026",
};

export const REGION_META: Record<RegionId, RegionMeta> = {
  in: {
    id: "in",
    flag: "IN",
    currency: "INR",
    symbol: "₹",
    taxYear: "FY 2026-27 (AY 2027-28)",
    authority: {
      en: "Income-tax Act Section 115BBH (Finance Act 2022) + Section 194S TDS",
      tr: "Gelir Vergisi Kanunu 115BBH Bölümü (2022 Maliye Yasası) + 194S TDS Bölümü",
    },
    sources: [
      {
        label: "Income-tax Act Section 115BBH",
        url: "https://incometaxindia.gov.in/_layouts/15/dit/pages/viewer.aspx?path=incometaxact",
      },
      {
        label: "CBDT Section 194S TDS circular",
        url: "https://incometaxindia.gov.in/communications/circular/circular_13_2022.pdf",
      },
    ],
    heading: {
      en: "Bitcoin Tax Calculator",
      tr: "Bitcoin Vergi Hesaplayıcısı",
    },
    highlight: { en: "India (June 2026)", tr: "Hindistan (Haziran 2026)" },
    subtitle: {
      en: "Flat 30% income tax on Bitcoin gains under Section 115BBH, plus 4% cess and 1% TDS on every sale. Enter your numbers below for an instant estimate.",
      tr: "115BBH Bölümü kapsamında Bitcoin kazançlarına %30 sabit gelir vergisi, ayrıca %4 cess ve her satışta %1 TDS. Anında tahmin için sayılarınızı girin.",
    },
    chips: {
      en: ["30% flat tax", "4% cess", "1% TDS on proceeds"],
      tr: ["%30 sabit vergi", "%4 cess", "Hasılat üzerinden %1 TDS"],
    },
    methodology: {
      en: [
        "Compute gain = proceeds − cost basis (no fees, no losses offset).",
        "Apply the flat 30% income-tax rate under Section 115BBH.",
        "Add 4% health-and-education cess on the tax amount → effective 31.2%.",
        "Track 1% TDS withheld by the exchange on gross sale value under Section 194S as creditable tax already paid.",
        "Losses cannot be set off against other income or carried forward.",
      ],
      tr: [
        "Kazanç = hasılat − maliyet (komisyon yok, zarar mahsubu yok).",
        "115BBH Bölümü'ne göre %30 sabit gelir vergisi uygulayın.",
        "Vergi tutarına %4 cess ekleyin → efektif %31,2.",
        "194S Bölümü'ne göre brüt satış değeri üzerinden borsanın kestiği %1 TDS'yi ödenmiş vergi olarak takip edin.",
        "Zararlar diğer gelirlerden mahsup edilemez ve devredilemez.",
      ],
    },
    faq: [
      {
        q: {
          en: "How much tax do I pay on Bitcoin in India in FY 2026-27?",
          tr: "FY 2026-27'de Hindistan'da Bitcoin için ne kadar vergi öderim?",
        },
        a: {
          en: "Under Section 115BBH, gains from virtual digital assets are taxed at a flat 30%, plus a 4% health-and-education cess (effective 31.2%), regardless of income slab or holding period.",
          tr: "115BBH Bölümü kapsamında sanal dijital varlık kazançları, gelir dilimi veya tutma süresinden bağımsız olarak %30 sabit oran artı %4 sağlık-ve-eğitim cess'i (efektif %31,2) ile vergilendirilir.",
        },
      },
      {
        q: {
          en: "Is there any tax-free allowance for Bitcoin gains in India?",
          tr: "Hindistan'da Bitcoin kazançları için vergisiz muafiyet var mı?",
        },
        a: {
          en: "No. Section 115BBH provides no basic exemption or threshold — every rupee of gain is taxable at 30% + cess from the first transaction in FY 2026-27.",
          tr: "Yok. 115BBH Bölümü herhangi bir temel muafiyet veya eşik öngörmez — FY 2026-27'de ilk işlemden itibaren her rupi kazanç %30 + cess ile vergilendirilir.",
        },
      },
      {
        q: {
          en: "Does holding Bitcoin longer reduce the tax rate?",
          tr: "Bitcoin'i daha uzun tutmak vergi oranını düşürür mü?",
        },
        a: {
          en: "No. India does not distinguish short-term vs long-term for virtual digital assets — the 30% flat rate applies whether you hold for one day or ten years. Simply holding BTC is not a taxable event; tax is triggered only on transfer.",
          tr: "Hayır. Hindistan sanal dijital varlıklar için kısa-uzun vade ayrımı yapmaz — bir gün de tutsanız on yıl da tutsanız %30 sabit oran uygulanır. BTC tutmak vergiye tabi değildir; vergi yalnızca transferde doğar.",
        },
      },
      {
        q: {
          en: "Can I deduct exchange fees or offset losses against other income?",
          tr: "Borsa ücretlerini düşebilir veya zararları başka gelirden mahsup edebilir miyim?",
        },
        a: {
          en: "No. Section 115BBH allows only the cost of acquisition as a deduction. Trading fees, gas fees, and losses from other crypto trades cannot reduce taxable gain, and losses cannot be set off against other income or carried forward.",
          tr: "Hayır. 115BBH Bölümü yalnızca edinme maliyetini gider olarak kabul eder. İşlem ücretleri, gas ücretleri ve diğer kripto işlemlerden zararlar düşülemez; zararlar diğer gelirlerden mahsup edilemez ve devredilemez.",
        },
      },
      {
        q: {
          en: "When is the ITR filing deadline and how does the 1% TDS work?",
          tr: "ITR son başvuru tarihi nedir ve %1 TDS nasıl işler?",
        },
        a: {
          en: "ITR for FY 2026-27 is due 31 July 2027 for non-audit individuals. The exchange withholds 1% TDS under Section 194S on the gross sale value of every disposal — credit it against your final 30% liability when you file.",
          tr: "FY 2026-27 için ITR, denetime tabi olmayan bireyler için 31 Temmuz 2027'ye kadar verilir. Borsa, 194S Bölümü kapsamında her satışın brüt değeri üzerinden %1 TDS keser — beyan ederken bunu nihai %30 yükümlülüğünüzden mahsup edin.",
        },
      },
    ],
  },

  uk: {
    id: "uk",
    flag: "UK",
    currency: "GBP",
    symbol: "£",
    taxYear: "2026/27",
    authority: {
      en: "HMRC CRYPTO22000 series + TCGA 1992 Annual Exempt Amount",
      tr: "HMRC CRYPTO22000 serisi + TCGA 1992 Yıllık Muafiyet Tutarı",
    },
    sources: [
      {
        label: "HMRC Cryptoassets Manual",
        url: "https://www.gov.uk/hmrc-internal-manuals/cryptoassets-manual",
      },
      {
        label: "Capital Gains Tax rates",
        url: "https://www.gov.uk/capital-gains-tax/rates",
      },
    ],
    heading: { en: "UK Bitcoin CGT Calculator", tr: "İngiltere Bitcoin CGT Hesaplayıcısı" },
    highlight: { en: "2026/27", tr: "2026/27" },
    subtitle: {
      en: "£3,000 annual exempt amount, then 18% inside the basic-rate band and 24% above it. Enter your other taxable income so the rate split is accurate.",
      tr: "£3.000 yıllık muafiyet, sonra temel oran dilimi içinde %18 ve üstünde %24. Oran ayrımının doğru olması için diğer vergiye tabi gelirinizi girin.",
    },
    chips: {
      en: ["£3,000 allowance", "18% basic", "24% higher rate"],
      tr: ["£3.000 muafiyet", "%18 temel", "%24 üst dilim"],
    },
    methodology: {
      en: [
        "Pool BTC under Section 104: every unit shares a weighted-average cost basis.",
        "Apply same-day and 30-day matching rules to disposals.",
        "Subtract the £3,000 Annual Exempt Amount (2026/27).",
        "Stack the taxable gain on top of other income; tax basic-band slice at 18%, the rest at 24%.",
        "Losses can be claimed and carried forward indefinitely if reported.",
      ],
      tr: [
        "Section 104 kapsamında BTC'yi havuzlayın: her birim ağırlıklı ortalama maliyet paylaşır.",
        "Elden çıkarmalara aynı gün ve 30 gün eşleştirme kurallarını uygulayın.",
        "£3.000 Yıllık Muafiyet Tutarını (2026/27) düşün.",
        "Vergiye tabi kazancı diğer gelirin üzerine yığın; temel dilim kısmını %18, üstünü %24 ile vergilendirin.",
        "Zararlar talep edilebilir ve süresiz devredilebilir.",
      ],
    },
    faq: [
      {
        q: {
          en: "How much CGT do I pay on Bitcoin in the UK in 2026/27?",
          tr: "2026/27'de İngiltere'de Bitcoin için ne kadar CGT öderim?",
        },
        a: {
          en: "Gains above the £3,000 Annual Exempt Amount are taxed at 18% inside your basic-rate band and 24% above it, following the rates set by the October 2024 Budget and unchanged for 2026/27.",
          tr: "£3.000 Yıllık Muafiyet Tutarı üzerindeki kazançlar, temel oran diliminde %18, üstünde %24 ile vergilendirilir — Ekim 2024 Bütçesi ile belirlenen oranlar 2026/27 için değişmedi.",
        },
      },
      {
        q: {
          en: "What is the UK CGT allowance for Bitcoin in 2026/27?",
          tr: "2026/27'de Bitcoin için CGT muafiyeti nedir?",
        },
        a: {
          en: "The Annual Exempt Amount stays at £3,000 per individual for the 2026/27 tax year. Gains within this allowance are tax-free; only the excess is taxable.",
          tr: "Yıllık Muafiyet Tutarı 2026/27 vergi yılında birey başına £3.000 olarak korunur. Bu muafiyet içindeki kazançlar vergisizdir; yalnızca aşan kısım vergilendirilir.",
        },
      },
      {
        q: {
          en: "Does holding Bitcoin longer change the CGT rate?",
          tr: "Bitcoin'i daha uzun tutmak CGT oranını değiştirir mi?",
        },
        a: {
          en: "No. The UK has no long-term discount for crypto. HMRC pools all BTC under Section 104 with a weighted-average cost basis and applies the same 18%/24% rates regardless of how long you held.",
          tr: "Hayır. İngiltere'de kripto için uzun vadeli indirim yoktur. HMRC tüm BTC'yi Section 104 kapsamında ağırlıklı ortalama maliyetle havuzlar ve tutma süresinden bağımsız aynı %18/%24 oranlarını uygular.",
        },
      },
      {
        q: {
          en: "Can I offset Bitcoin losses against other income or future gains?",
          tr: "Bitcoin zararlarını diğer gelirden veya gelecekteki kazançlardan mahsup edebilir miyim?",
        },
        a: {
          en: "Capital losses cannot offset income, but once reported to HMRC they can be set against any other capital gains in the same year and carried forward indefinitely.",
          tr: "Sermaye zararları gelirden mahsup edilemez, ancak HMRC'ye bildirildikten sonra aynı yıl içindeki diğer sermaye kazançlarından düşülebilir ve süresiz devredilebilir.",
        },
      },
      {
        q: {
          en: "When is the Self Assessment deadline for 2026/27 gains?",
          tr: "2026/27 kazançları için Self Assessment son tarihi nedir?",
        },
        a: {
          en: "Online Self Assessment for the 2026/27 tax year is due by 31 January 2028. You must report gains if total disposals exceed £50,000 in the year or if you are already in Self Assessment, even when within the allowance.",
          tr: "2026/27 vergi yılı için çevrimiçi Self Assessment, 31 Ocak 2028'e kadar verilmelidir. Toplam elden çıkarmalar yıl içinde £50.000'i aşarsa veya zaten Self Assessment kayıtlıysanız, muafiyet içinde bile bildirim yapılmalıdır.",
        },
      },
    ],
  },

  de: {
    id: "de",
    flag: "DE",
    currency: "EUR",
    symbol: "€",
    taxYear: "Steuerjahr 2026",
    authority: {
      en: "Einkommensteuergesetz Section 23 (private sales) + BMF crypto guidance 2022",
      tr: "Einkommensteuergesetz Section 23 (özel satışlar) + 2022 BMF kripto rehberi",
    },
    sources: [
      {
        label: "BMF Schreiben Kryptowerte (2022)",
        url: "https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Einkommensteuer/2022-05-10-einzelfragen-zur-ertragsteuerrechtlichen-behandlung-bestimmter-kryptowerte.html",
      },
      { label: "EStG Section 23", url: "https://www.gesetze-im-internet.de/estg/__23.html" },
    ],
    heading: { en: "Germany Bitcoin Tax Calculator", tr: "Almanya Bitcoin Vergi Hesaplayıcısı" },
    highlight: { en: "Section 23 EStG", tr: "Section 23 EStG" },
    subtitle: {
      en: "Held over 12 months → 0% tax under Section 23 EStG. Within 12 months → taxed at your marginal rate after the €1,000 Freigrenze.",
      tr: "12 aydan uzun tutuldu → Section 23 EStG kapsamında %0 vergi. 12 ay içinde → €1.000 Freigrenze sonrası marjinal oranınızla vergilendirilir.",
    },
    chips: {
      en: ["0% after 1-yr hold", "€1,000 Freigrenze", "Marginal rate <1yr"],
      tr: ["1 yıl sonra %0", "€1.000 Freigrenze", "<1 yıl marjinal oran"],
    },
    methodology: {
      en: [
        "Identify each disposal lot via FIFO (first-in-first-out by default).",
        "If holding period > 12 months → gain is tax-free under §23 EStG.",
        "If ≤ 12 months and total private-sale profit < €1,000 → fully exempt.",
        "Otherwise apply your marginal income-tax rate to the full taxable gain.",
        "Crypto-to-crypto swaps and use as payment are taxable disposals.",
      ],
      tr: [
        "Her elden çıkarma lotunu FIFO ile belirleyin (varsayılan).",
        "Tutma süresi > 12 ay → kazanç §23 EStG kapsamında vergisizdir.",
        "≤ 12 ay ve toplam özel satış karı < €1.000 → tamamen muaf.",
        "Aksi halde tam vergilendirilebilir kazanca marjinal gelir vergisi oranınızı uygulayın.",
        "Kripto-kripto takas ve ödemede kullanım vergilendirilebilir elden çıkarmadır.",
      ],
    },
    faq: [
      {
        q: {
          en: "How much tax do I pay on Bitcoin in Germany in 2026?",
          tr: "2026'da Almanya'da Bitcoin için ne kadar vergi öderim?",
        },
        a: {
          en: "Gains on BTC held in private wealth for more than 12 months are 0% under §23 EStG. Sales within 12 months are taxed as 'sonstige Einkünfte' at your marginal income-tax rate (14%–45% plus Solidaritätszuschlag).",
          tr: "Özel varlıkta 12 aydan uzun tutulan BTC kazançları §23 EStG kapsamında %0'dır. 12 ay içindeki satışlar 'sonstige Einkünfte' olarak marjinal oranınızla (%14–%45 artı Solidaritätszuschlag) vergilendirilir.",
        },
      },
      {
        q: {
          en: "What is the €1,000 Freigrenze for 2026?",
          tr: "2026 için €1.000 Freigrenze nedir?",
        },
        a: {
          en: "The annual private-sales threshold is €1,000 for 2026 (raised from €600 in 2024). Stay under it across all §23 sales and the entire amount is tax-free; cross it and the full amount becomes taxable, not just the excess.",
          tr: "2026 için yıllık özel satış eşiği €1.000'dir (2024'te €600'dan yükseltildi). Tüm §23 satışlarında altında kalırsanız tamamen vergisizdir; aşarsanız yalnızca fazlası değil tüm tutar vergilendirilir.",
        },
      },
      {
        q: {
          en: "How is the 12-month holding period calculated?",
          tr: "12 aylık tutma süresi nasıl hesaplanır?",
        },
        a: {
          en: "Day of acquisition + one calendar year + one day. Germany uses FIFO by default to match disposals against the oldest coins. Since the 2022 BMF letter, staking or lending no longer extends the holding period to 10 years.",
          tr: "Edinme günü + bir takvim yılı + bir gün. Almanya varsayılan olarak en eski coin'leri eşleştirmek için FIFO kullanır. 2022 BMF mektubu sonrası staking veya borç verme tutma süresini 10 yıla uzatmaz.",
        },
      },
      {
        q: {
          en: "Can I offset Bitcoin losses against other income?",
          tr: "Bitcoin zararlarını diğer gelirden mahsup edebilir miyim?",
        },
        a: {
          en: "No. §23 losses can only be offset against other private-sale (§23) gains in the same year, or carried back one year / forward indefinitely against future §23 gains. They cannot reduce salary or investment income.",
          tr: "Hayır. §23 zararları yalnızca aynı yıl içindeki diğer özel satış (§23) kazançlarından mahsup edilebilir; bir yıl geri taşınabilir veya gelecekteki §23 kazançlarına karşı süresiz devredilebilir. Maaş veya yatırım gelirini azaltamaz.",
        },
      },
      {
        q: {
          en: "When is the German tax return for 2026 due?",
          tr: "2026 Alman vergi beyannamesi ne zaman verilir?",
        },
        a: {
          en: "The Einkommensteuererklärung for tax year 2026 is due by 31 July 2027 if you file yourself, or by the end of February 2028 if a Steuerberater files on your behalf. Report taxable §23 gains on Anlage SO.",
          tr: "2026 vergi yılı için Einkommensteuererklärung, kendiniz veriyorsanız 31 Temmuz 2027'ye kadar, bir Steuerberater veriyorsa Şubat 2028 sonuna kadar verilmelidir. Vergiye tabi §23 kazançlarını Anlage SO'da bildirin.",
        },
      },
    ],
  },
};

