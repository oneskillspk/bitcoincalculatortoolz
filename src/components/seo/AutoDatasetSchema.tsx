import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { EN_TO_TR } from "@/utils/localizedRoutes";

const TR_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(EN_TO_TR).map(([en, tr]) => [tr, en]),
);

const BASE = "https://bitcoincalculator.tools";

interface DatasetConfig {
  name: { en: string; tr: string };
  description: { en: string; tr: string };
  temporalCoverage: string;
  variableMeasured: string[];
  keywords?: string[];
}

/**
 * Data-heavy routes that warrant a schema.org/Dataset block. Keyed by the
 * EN canonical path. TR mirrors are resolved via the localized route table.
 */
const DATASETS: Record<string, DatasetConfig> = {
  "/calculators/halving-countdown": {
    name: {
      en: "Bitcoin Halving History & Countdown Dataset",
      tr: "Bitcoin Yarılanma Geçmişi ve Sayaç Veri Seti",
    },
    description: {
      en: "Block-by-block record of every Bitcoin halving event since 2012, including block height, date, block reward, and projected dates for upcoming halvings.",
      tr: "2012'den bu yana her Bitcoin yarılanma olayının blok bazlı kaydı; blok yüksekliği, tarih, blok ödülü ve gelecek yarılanmalar için tahmini tarihler.",
    },
    temporalCoverage: "2012-11-28/..",
    variableMeasured: ["Block height", "Halving date", "Block reward (BTC)", "Days until next halving"],
    keywords: ["bitcoin halving", "block reward", "halving countdown"],
  },
  "/calculators/inflation-dashboard": {
    name: {
      en: "Fiat Money Supply vs Bitcoin Inflation Dataset",
      tr: "Fiat Para Arzı vs Bitcoin Enflasyon Veri Seti",
    },
    description: {
      en: "Annual M2 money supply for major fiat currencies versus the programmatic Bitcoin issuance schedule, used to compare debasement rates side by side.",
      tr: "Başlıca fiat para birimleri için yıllık M2 para arzı ile programatik Bitcoin ihraç takvimi; değer kaybı oranlarını yan yana karşılaştırmak için kullanılır.",
    },
    temporalCoverage: "1960-01-01/..",
    variableMeasured: ["USD M2 supply", "EUR M2 supply", "GBP M2 supply", "JPY M2 supply", "BTC circulating supply"],
    keywords: ["money supply", "inflation", "bitcoin debasement"],
  },
  "/calculators/pizza-day": {
    name: {
      en: "Bitcoin Pizza Day Historical Price Dataset",
      tr: "Bitcoin Pizza Günü Tarihsel Fiyat Veri Seti",
    },
    description: {
      en: "Daily BTC/USD closing prices since May 22, 2010 (Bitcoin Pizza Day), used to compute the present-day value of historical purchases.",
      tr: "22 Mayıs 2010'dan (Bitcoin Pizza Günü) bu yana günlük BTC/USD kapanış fiyatları; tarihsel alımların güncel değerini hesaplamak için kullanılır.",
    },
    temporalCoverage: "2010-05-22/..",
    variableMeasured: ["BTC/USD daily close", "Days since pizza day", "Equivalent USD value"],
    keywords: ["bitcoin pizza day", "historical btc price"],
  },
  "/calculators/power-law": {
    name: {
      en: "Bitcoin Power Law Regression Dataset",
      tr: "Bitcoin Güç Yasası Regresyon Veri Seti",
    },
    description: {
      en: "Log-log regression dataset modelling Bitcoin price as a power-law function of time since genesis block, with confidence bands.",
      tr: "Bitcoin fiyatını yaratılış bloğundan bu yana zamanın güç yasası fonksiyonu olarak modelleyen log-log regresyon veri seti, güven aralıkları dahil.",
    },
    temporalCoverage: "2009-01-03/..",
    variableMeasured: ["Days since genesis", "BTC/USD price", "Power-law fair value", "Upper band", "Lower band"],
    keywords: ["power law", "bitcoin valuation"],
  },
  "/calculators/rainbow-chart": {
    name: {
      en: "Bitcoin Logarithmic Rainbow Chart Dataset",
      tr: "Bitcoin Logaritmik Gökkuşağı Grafiği Veri Seti",
    },
    description: {
      en: "Logarithmic regression bands ('rainbow') applied to BTC/USD historical price, segmenting market sentiment from fire-sale to bubble territory.",
      tr: "BTC/USD tarihsel fiyatına uygulanan logaritmik regresyon bantları ('gökkuşağı'); piyasa duyarlılığını yangın indirimi alanından balon alanına segmentler.",
    },
    temporalCoverage: "2010-07-17/..",
    variableMeasured: ["BTC/USD price", "Rainbow band", "Sentiment label"],
    keywords: ["rainbow chart", "bitcoin sentiment"],
  },
  "/calculators/on-chain": {
    name: {
      en: "Bitcoin On-Chain Metrics Dataset",
      tr: "Bitcoin Zincir Üstü Metrikler Veri Seti",
    },
    description: {
      en: "Daily on-chain metrics including hash rate, difficulty, active addresses, transaction count, and miner revenue.",
      tr: "Hash oranı, zorluk, aktif adresler, işlem sayısı ve madenci geliri dahil günlük zincir üstü metrikler.",
    },
    temporalCoverage: "2010-07-17/..",
    variableMeasured: ["Hash rate", "Difficulty", "Active addresses", "Transactions per day", "Miner revenue"],
    keywords: ["on-chain", "hash rate", "bitcoin network"],
  },
};

/**
 * Auto-emits a schema.org/Dataset JSON-LD block on a curated set of
 * data-heavy calculator routes. Mounts in App.tsx alongside the
 * SoftwareApplication and HowTo emitters.
 */
export const AutoDatasetSchema = () => {
  const { pathname } = useLocation();
  const isTr = pathname.startsWith("/tr/");
  const language: "en" | "tr" = isTr ? "tr" : "en";

  let enPath = pathname.replace(/\/$/, "");
  if (isTr) enPath = TR_TO_EN[enPath] ?? "";
  const cfg = DATASETS[enPath];
  if (!cfg) return null;

  const url = `${BASE}${pathname.replace(/\/$/, "") || "/"}`;
  const today = new Date().toISOString().slice(0, 10);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: cfg.name[language],
    description: cfg.description[language],
    url,
    inLanguage: language,
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "Bitcoin Calculator Tools",
      url: BASE,
    },
    publisher: {
      "@type": "Organization",
      name: "Bitcoin Calculator Tools",
      url: BASE,
    },
    temporalCoverage: cfg.temporalCoverage,
    variableMeasured: cfg.variableMeasured,
    keywords: cfg.keywords,
    dateModified: today,
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "text/html",
        contentUrl: url,
      },
    ],
    citation: "CoinGecko Historical Price API — https://www.coingecko.com/en/api",
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
