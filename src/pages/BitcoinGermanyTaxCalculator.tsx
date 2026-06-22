import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import RegionalCryptoTaxCalculator from "@/components/tax-calculator/RegionalCryptoTaxCalculator";

const URL =
  "https://bitcoincalculator.tools/calculators/bitcoin-tax-germany";
const TITLE =
  "Germany Bitcoin Tax Calculator — §23 EStG 1-Year Holding Rule";
const DESC =
  "Estimate German Bitcoin tax under §23 EStG. Held over 12 months → 0%. Within 12 months → taxed at your marginal rate after the €1,000 exemption.";

const FAQ = [
  {
    q: "Is Bitcoin tax-free in Germany?",
    a: "Yes — gains from the sale of Bitcoin held in private wealth for more than 12 months are tax-free under §23 of the Einkommensteuergesetz (private sale exemption). Sales within 12 months are taxable as 'sonstige Einkünfte' at your marginal income-tax rate.",
  },
  {
    q: "What is the €1,000 Freigrenze?",
    a: "From the 2024 tax year onwards, the threshold for private sales transactions was raised from €600 to €1,000 per year. If your total private-sale profit (crypto plus other §23 assets) stays under €1,000, the entire amount is tax-free. Cross the threshold and the full amount is taxable, not just the excess.",
  },
  {
    q: "Does staking or lending extend the holding period?",
    a: "Since the 2022 BMF letter and confirmed by 2023 case law, simply staking or lending Bitcoin no longer extends the holding period to 10 years. The 12-month §23 EStG rule applies normally.",
  },
  {
    q: "How is the holding period calculated?",
    a: "Day of acquisition + one calendar year + one day. Germany uses FIFO (first-in-first-out) by default to match disposals against the oldest coins in your wallet.",
  },
];

const BitcoinGermanyTaxCalculator = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <BreadcrumbSchema
        language="en"
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          {
            name: "Calculators",
            url: "https://bitcoincalculator.tools/calculators",
          },
          { name: "Bitcoin Tax — Germany", url: URL },
        ]}
      />
      <PageBackground>
        <Header />
        <main className="container mx-auto max-w-4xl px-4 py-8">
          <Breadcrumb
            items={[
              { label: "Calculators", href: "/calculators" },
              { label: "Bitcoin Tax — Germany" },
            ]}
          />
          <header className="my-6 space-y-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Germany Bitcoin Tax Calculator — §23 EStG
            </h1>
            <p className="text-muted-foreground">
              Held longer than 12 months? Your gain is tax-free. Inside the
              one-year window? You're taxed at your marginal rate after the
              €1,000 annual exemption.
            </p>
          </header>

          <RegionalCryptoTaxCalculator region="de" />

          <section className="mt-10 space-y-4">
            <h2 className="text-2xl font-semibold">How §23 EStG works</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">12-month rule</strong> — sell after 12 months and the gain is fully exempt as a private disposal.
              </li>
              <li>
                <strong className="text-foreground">€1,000 Freigrenze</strong> — combined private-sale profits below €1,000 per year are exempt; cross the line and the full amount is taxable.
              </li>
              <li>
                <strong className="text-foreground">Marginal rate, not flat</strong> — taxable BTC gains stack on your other income and are charged at your personal income-tax rate (0–45% plus solidarity surcharge / church tax where applicable).
              </li>
              <li>
                <strong className="text-foreground">FIFO matching</strong> — disposals are matched against the oldest coins acquired first.
              </li>
            </ul>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-2xl font-semibold">FAQ</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="rounded-lg border border-border/60 p-4">
                  <h3 className="font-medium text-foreground">{f.q}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </PageBackground>
    </>
  );
};

export default BitcoinGermanyTaxCalculator;
