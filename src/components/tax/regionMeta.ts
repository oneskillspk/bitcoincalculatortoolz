/**
 * Single source of truth for region-specific copy used across the three
 * regional Bitcoin tax pages (IN / UK / DE). Each entry holds EN + TR
 * variants for hero, chips, methodology, scenario labels, and FAQ.
 *
 * Keep this file pure data — components import it to render.
 */

export type RegionId = "in" | "uk" | "de";

export interface RegionMeta {
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
    flag: "🇮🇳",
    currency: "INR",
    symbol: "₹",
    taxYear: "FY 2026-27 (AY 2027-28)",
    authority: {
      en: "Income-tax Act §115BBH (Finance Act 2022) + §194S TDS",
      tr: "Gelir Vergisi Kanunu §115BBH (2022 Maliye Yasası) + §194S TDS",
    },
    sources: [
      {
        label: "Income-tax Act §115BBH",
        url: "https://incometaxindia.gov.in/_layouts/15/dit/pages/viewer.aspx?path=incometaxact",
      },
      {
        label: "CBDT §194S TDS circular",
        url: "https://incometaxindia.gov.in/communications/circular/circular_13_2022.pdf",
      },
    ],
    heading: {
      en: "Bitcoin Tax Calculator",
      tr: "Bitcoin Vergi Hesaplayıcısı",
    },
    highlight: { en: "India (June 2026)", tr: "Hindistan (Haziran 2026)" },
    subtitle: {
      en: "Flat 30% income tax on Bitcoin gains under §115BBH, plus 4% cess and 1% TDS on every sale. Enter your numbers below for an instant estimate.",
      tr: "§115BBH kapsamında Bitcoin kazançlarına %30 sabit gelir vergisi, ayrıca %4 cess ve her satışta %1 TDS. Anında tahmin için sayılarınızı girin.",
    },
    chips: {
      en: ["30% flat tax", "4% cess", "1% TDS on proceeds"],
      tr: ["%30 sabit vergi", "%4 cess", "Hasılat üzerinden %1 TDS"],
    },
    methodology: {
      en: [
        "Compute gain = proceeds − cost basis (no fees, no losses offset).",
        "Apply flat 30% income-tax rate under §115BBH.",
        "Add 4% health-and-education cess on the tax amount → effective 31.2%.",
        "Add 1% TDS withheld by the exchange on gross sale value under §194S.",
        "Losses cannot be set off against other income or carried forward.",
      ],
      tr: [
        "Kazanç = hasılat − maliyet (komisyon yok, zarar mahsubu yok).",
        "§115BBH'ye göre %30 sabit gelir vergisi uygulayın.",
        "Vergi tutarına %4 cess ekleyin → efektif %31,2.",
        "§194S'ye göre brüt satış değeri üzerinden borsanın kestiği %1 TDS'yi ekleyin.",
        "Zararlar diğer gelirlerden mahsup edilemez ve devredilemez.",
      ],
    },
    faq: [
      {
        q: {
          en: "How much tax do I pay on Bitcoin in India?",
          tr: "Hindistan'da Bitcoin için ne kadar vergi öderim?",
        },
        a: {
          en: "Under §115BBH gains from virtual digital assets are taxed at a flat 30%, plus 4% cess on the tax, plus 1% TDS on every sale under §194S. Losses cannot be set off against other income.",
          tr: "§115BBH kapsamında sanal dijital varlıklardan elde edilen kazançlar %30 sabit, ayrıca vergi üzerinden %4 cess ve §194S kapsamında her satışta %1 TDS ile vergilendirilir. Zararlar diğer gelirlerden mahsup edilemez.",
        },
      },
      {
        q: {
          en: "Is the 1% TDS deducted on profit or on the sale value?",
          tr: "%1 TDS kâr üzerinden mi yoksa satış bedeli üzerinden mi kesilir?",
        },
        a: {
          en: "TDS is deducted on the gross sale consideration. If you sell ₹100,000 of BTC the exchange withholds ₹1,000 as TDS regardless of whether you made a gain or loss.",
          tr: "TDS brüt satış bedeli üzerinden kesilir. ₹100.000'lik BTC satarsanız, kar veya zarar fark etmeksizin borsa ₹1.000 TDS keser.",
        },
      },
      {
        q: {
          en: "Can I deduct exchange fees or losses from my crypto gains?",
          tr: "Borsa ücretlerini veya zararları kazançtan düşebilir miyim?",
        },
        a: {
          en: "No. §115BBH allows only the cost of acquisition as a deduction. Trading fees, gas fees, and losses from other crypto trades cannot reduce taxable gain.",
          tr: "Hayır. §115BBH yalnızca edinme maliyetini gider olarak kabul eder. İşlem ücretleri, gas ücretleri ve diğer kripto işlemlerden zararlar düşülemez.",
        },
      },
      {
        q: {
          en: "Do I have to pay tax if I just hold Bitcoin?",
          tr: "Sadece Bitcoin tutuyorsam vergi öder miyim?",
        },
        a: {
          en: "No. Tax is triggered only on transfer — sale for INR, swap for another asset, or use as payment. Holding BTC in self-custody is not a taxable event.",
          tr: "Hayır. Vergi yalnızca transferde doğar — INR karşılığı satış, başka varlıkla takas veya ödeme amaçlı kullanım. Self-custody'de tutmak vergiye tabi değildir.",
        },
      },
    ],
  },

  uk: {
    id: "uk",
    flag: "🇬🇧",
    currency: "GBP",
    symbol: "£",
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
    highlight: { en: "2025/26", tr: "2025/26" },
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
        "Pool BTC under §104: every unit shares a weighted-average cost basis.",
        "Apply same-day and 30-day matching rules to disposals.",
        "Subtract the £3,000 Annual Exempt Amount (2025/26).",
        "Stack the taxable gain on top of other income; tax basic-band slice at 18%, the rest at 24%.",
        "Losses can be claimed and carried forward indefinitely if reported.",
      ],
      tr: [
        "§104 kapsamında BTC'yi havuzlayın: her birim ağırlıklı ortalama maliyet paylaşır.",
        "Elden çıkarmalara aynı gün ve 30 gün eşleştirme kurallarını uygulayın.",
        "£3.000 Yıllık Muafiyet Tutarını (2025/26) düşün.",
        "Vergiye tabi kazancı diğer gelirin üzerine yığın; temel dilim kısmını %18, üstünü %24 ile vergilendirin.",
        "Zararlar talep edilebilir ve süresiz devredilebilir.",
      ],
    },
    faq: [
      {
        q: {
          en: "What is the UK CGT allowance for Bitcoin in 2025/26?",
          tr: "2025/26'da Bitcoin için CGT muafiyeti nedir?",
        },
        a: {
          en: "The Annual Exempt Amount is £3,000 for individuals. Bitcoin gains above this are charged at 18% (basic rate) or 24% (higher rate) following the October 2024 Budget.",
          tr: "Bireyler için Yıllık Muafiyet Tutarı £3.000'dir. Üzerindeki kazançlar Ekim 2024 Bütçesi sonrası %18 (temel) veya %24 (üst) ile vergilendirilir.",
        },
      },
      {
        q: {
          en: "Which CGT rate applies to my Bitcoin gain?",
          tr: "Bitcoin kazancıma hangi CGT oranı uygulanır?",
        },
        a: {
          en: "HMRC stacks the taxable gain on top of your taxable income. The portion that fits in the basic-rate band (up to £50,270) is taxed at 18%; the portion above at 24%.",
          tr: "HMRC vergilendirilebilir kazancı gelirinizin üstüne yığar. Temel dilime (£50.270'e kadar) sığan kısım %18, üstü %24 ile vergilendirilir.",
        },
      },
      {
        q: {
          en: "Do I have to report Bitcoin gains under the allowance?",
          tr: "Muafiyet altındaki kazançları bildirmek zorunda mıyım?",
        },
        a: {
          en: "If total disposals exceed £50,000 in the tax year, or if you're registered for Self Assessment, you must report even within the allowance.",
          tr: "Toplam elden çıkarmalar vergi yılında £50.000'i aşarsa veya Self Assessment kayıtlıysanız, muafiyet içinde bile bildirim zorunludur.",
        },
      },
      {
        q: {
          en: "Can I use share-pooling rules for Bitcoin?",
          tr: "Bitcoin için hisse havuzlama kurallarını kullanabilir miyim?",
        },
        a: {
          en: "Yes. HMRC treats crypto under the §104 pooling rules with a weighted-average cost basis and same-day / 30-day matching.",
          tr: "Evet. HMRC, kriptoları §104 havuzlama kuralları kapsamında ağırlıklı ortalama maliyet ve aynı gün / 30 gün eşleştirme ile değerlendirir.",
        },
      },
    ],
  },

  de: {
    id: "de",
    flag: "🇩🇪",
    currency: "EUR",
    symbol: "€",
    authority: {
      en: "Einkommensteuergesetz §23 (private sales) + BMF crypto guidance 2022",
      tr: "Einkommensteuergesetz §23 (özel satışlar) + 2022 BMF kripto rehberi",
    },
    sources: [
      {
        label: "BMF Schreiben Kryptowerte (2022)",
        url: "https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Einkommensteuer/2022-05-10-einzelfragen-zur-ertragsteuerrechtlichen-behandlung-bestimmter-kryptowerte.html",
      },
      { label: "EStG §23", url: "https://www.gesetze-im-internet.de/estg/__23.html" },
    ],
    heading: { en: "Germany Bitcoin Tax Calculator", tr: "Almanya Bitcoin Vergi Hesaplayıcısı" },
    highlight: { en: "§23 EStG", tr: "§23 EStG" },
    subtitle: {
      en: "Held over 12 months → 0% tax under §23 EStG. Within 12 months → taxed at your marginal rate after the €1,000 Freigrenze.",
      tr: "12 aydan uzun tutuldu → §23 EStG kapsamında %0 vergi. 12 ay içinde → €1.000 Freigrenze sonrası marjinal oranınızla vergilendirilir.",
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
        q: { en: "Is Bitcoin tax-free in Germany?", tr: "Almanya'da Bitcoin vergisiz midir?" },
        a: {
          en: "Yes — gains from BTC held in private wealth for more than 12 months are tax-free under §23 EStG. Sales within 12 months are taxable as 'sonstige Einkünfte' at your marginal income-tax rate.",
          tr: "Evet — özel varlıkta 12 aydan uzun tutulan BTC kazançları §23 EStG kapsamında vergisizdir. 12 ay içindeki satışlar 'sonstige Einkünfte' olarak marjinal oranınızla vergilendirilir.",
        },
      },
      {
        q: { en: "What is the €1,000 Freigrenze?", tr: "€1.000 Freigrenze nedir?" },
        a: {
          en: "From 2024 the private-sales threshold rose from €600 to €1,000/year. Stay under it and the entire amount is tax-free. Cross it and the full amount is taxable, not just the excess.",
          tr: "2024'ten itibaren özel satış eşiği €600'dan €1.000'a yükseldi. Altında kalırsanız tamamen vergisizdir. Aşarsanız yalnızca fazlası değil tüm tutar vergilendirilir.",
        },
      },
      {
        q: {
          en: "Does staking or lending extend the holding period?",
          tr: "Staking veya borç verme tutma süresini uzatır mı?",
        },
        a: {
          en: "Since the 2022 BMF letter and confirmed by 2023 case law, staking or lending no longer extends the holding period to 10 years. The 12-month §23 rule applies normally.",
          tr: "2022 BMF mektubu ve 2023 içtihatları sonrası staking veya borç verme tutma süresini 10 yıla uzatmaz. 12 aylık §23 kuralı normal işler.",
        },
      },
      {
        q: { en: "How is the holding period calculated?", tr: "Tutma süresi nasıl hesaplanır?" },
        a: {
          en: "Day of acquisition + one calendar year + one day. Germany uses FIFO by default to match disposals against the oldest coins.",
          tr: "Edinme günü + bir takvim yılı + bir gün. Almanya varsayılan olarak en eski coin'leri eşleştirmek için FIFO kullanır.",
        },
      },
    ],
  },
};

export const useRegionCopy = (region: RegionId, isTr: boolean) => {
  const m = REGION_META[region];
  const pick = <T,>(o: { en: T; tr: T }): T => (isTr ? o.tr : o.en);
  return { meta: m, pick };
};
