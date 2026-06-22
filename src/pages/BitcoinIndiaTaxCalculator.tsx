import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import RegionalCryptoTaxCalculator from "@/components/tax-calculator/RegionalCryptoTaxCalculator";

const URL = "https://bitcoincalculator.tools/calculators/bitcoin-tax-india";
const TITLE = "Bitcoin Tax Calculator India 2025 — 30% Crypto Tax + 1% TDS";
const DESC =
  "Estimate India crypto tax under §115BBH: flat 30% on Bitcoin gains, 4% cess, and 1% TDS on every sale. Free calculator with the exact 2025 rules.";

const FAQ = [
  {
    q: "How much tax do I pay on Bitcoin in India?",
    a: "Under Section 115BBH of the Income-tax Act, gains from the transfer of virtual digital assets are taxed at a flat 30%, plus 4% health-and-education cess on the tax, plus 1% TDS on every sale under Section 194S. Losses cannot be set off against other income or carried forward.",
  },
  {
    q: "Is the 1% TDS deducted on profit or on the sale value?",
    a: "TDS is deducted on the gross sale consideration, not on the profit. If you sell ₹100,000 of BTC the exchange withholds ₹1,000 as TDS regardless of whether you made a gain or loss.",
  },
  {
    q: "Can I deduct exchange fees or losses from my crypto gains?",
    a: "No. Section 115BBH allows only the cost of acquisition as a deduction. Trading fees, gas fees, and losses from other crypto trades cannot be used to reduce taxable gain.",
  },
  {
    q: "Do I have to pay tax if I just hold Bitcoin?",
    a: "No. Tax is triggered only on transfer — sale for INR, swap for another asset, or use as payment. Holding BTC in a self-custody wallet is not a taxable event.",
  },
];

const BitcoinIndiaTaxCalculator = () => {
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
          { name: "Bitcoin Tax — India", url: URL },
        ]}
      />
      <PageBackground>
        <Header />
        <main className="container mx-auto max-w-4xl px-4 py-8">
          <Breadcrumb
            items={[
              { name: "Calculators", href: "/calculators" },
              { name: "Bitcoin Tax — India" },
            ]}
          />
          <header className="my-6 space-y-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Bitcoin Tax Calculator — India (2025)
            </h1>
            <p className="text-muted-foreground">
              Flat 30% income tax on Bitcoin gains under §115BBH, plus 4% cess
              and 1% TDS on every sale. Enter your numbers below for an
              instant estimate.
            </p>
          </header>

          <RegionalCryptoTaxCalculator region="in" />

          <section className="mt-10 space-y-4">
            <h2 className="text-2xl font-semibold">How India taxes Bitcoin</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The Finance Act 2022 introduced a dedicated regime for Virtual
              Digital Assets. Three things matter:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">30% flat tax</strong> on
                profit — no slab benefit, no indexation.
              </li>
              <li>
                <strong className="text-foreground">4% cess</strong> on the
                tax amount (so the effective rate is 31.2%).
              </li>
              <li>
                <strong className="text-foreground">1% TDS</strong> on the
                full sale value under §194S, withheld by the exchange.
              </li>
            </ul>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Losses from crypto cannot be set off against salary, business,
              or capital-gains income, and cannot be carried forward to
              future years.
            </p>
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

export default BitcoinIndiaTaxCalculator;
