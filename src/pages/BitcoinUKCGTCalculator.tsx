import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import RegionalCryptoTaxCalculator from "@/components/tax-calculator/RegionalCryptoTaxCalculator";

const EN_URL = "https://bitcoincalculator.tools/calculators/bitcoin-tax-uk-cgt";
const TR_URL = "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-vergi-ingiltere-cgt";
const TITLE = "UK Bitcoin CGT Calculator 2025/26 — £3,000 Allowance, 18%/24%";
const DESC =
  "Estimate your UK Bitcoin capital gains tax for 2025/26. Applies the £3,000 annual exempt amount and the 18% basic / 24% higher CGT rates set by HMRC.";

const FAQ = [
  {
    q: "What is the UK CGT allowance for Bitcoin in 2025/26?",
    a: "The Annual Exempt Amount for capital gains is £3,000 for individuals in the 2025/26 tax year. Bitcoin gains above this allowance are charged at 18% (basic rate) or 24% (higher rate) following the October 2024 Budget changes.",
  },
  {
    q: "Which CGT rate applies to my Bitcoin gain?",
    a: "HMRC stacks the taxable gain on top of your taxable income. The portion that fits inside the basic-rate band (up to £50,270) is taxed at 18%; the portion above is taxed at 24%.",
  },
  {
    q: "Do I have to report Bitcoin gains under the allowance?",
    a: "If total disposals exceed £50,000 in the tax year, or if you're registered for Self Assessment, you must report even when the gain is within the allowance. Otherwise, gains within the £3,000 allowance do not need to be reported.",
  },
  {
    q: "Can I use share-pooling rules for Bitcoin?",
    a: "Yes. HMRC treats crypto under the §104 pooling rules: all units of the same token form a single pool with a weighted-average cost basis. This calculator estimates a single disposal — for multi-trade pools use the full Capital Gains Tax calculator.",
  },
];

const BitcoinUKCGTCalculator = () => {
  const isTr = useLocation().pathname.startsWith("/tr/");
  const URL = isTr ? TR_URL : EN_URL;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: isTr ? "tr" : "en",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Helmet>
        <html lang={isTr ? "tr" : "en"} />
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <link rel="alternate" hrefLang="en" href={EN_URL} />
        <link rel="alternate" hrefLang="tr" href={TR_URL} />
        <link rel="alternate" hrefLang="x-default" href={EN_URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={isTr ? "tr_TR" : "en_US"} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <BreadcrumbSchema
        language={isTr ? "tr" : "en"}
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          {
            name: "Calculators",
            url: "https://bitcoincalculator.tools/calculators",
          },
          { name: "Bitcoin CGT — UK", url: URL },
        ]}
      />
      <PageBackground>
        <Header />
        <main className="container mx-auto max-w-4xl px-4 py-8">
          <Breadcrumb
            items={[
              { label: "Calculators", href: "/calculators" },
              { label: "Bitcoin CGT — UK" },
            ]}
          />
          <header className="my-6 space-y-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              UK Bitcoin Capital Gains Tax Calculator (2025/26)
            </h1>
            <p className="text-muted-foreground">
              £3,000 annual exempt amount, then 18% inside the basic-rate
              band and 24% above it. Enter your other taxable income for the
              rate split to be accurate.
            </p>
          </header>

          <RegionalCryptoTaxCalculator region="uk" />

          <section className="mt-10 space-y-4">
            <h2 className="text-2xl font-semibold">
              HMRC rules at a glance (2025/26)
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">£3,000 Annual Exempt Amount</strong> — first £3,000 of gains is tax-free.
              </li>
              <li>
                <strong className="text-foreground">18% / 24% split</strong> — rate depends on how much basic-rate band you have left after other income.
              </li>
              <li>
                <strong className="text-foreground">Share pooling (§104)</strong> — every BTC unit shares one weighted-average cost basis; same-day and 30-day matching rules still apply.
              </li>
              <li>
                <strong className="text-foreground">Losses</strong> — claimable against other capital gains and carried forward indefinitely if reported.
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

export default BitcoinUKCGTCalculator;
