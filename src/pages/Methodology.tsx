import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";

/**
 * Methodology — single page that documents the formulas, data windows, and
 * sources backing every backtest stat quoted on /about and on calculator
 * result panels. Each section uses an anchor so callers can deep-link
 * (e.g. `/methodology#dca-backtest`) right next to the number they cite.
 */

const SECTIONS = [
  {
    id: "data-sources",
    title: "Data sources",
    body: (
      <>
        <p>
          Live spot prices: <strong>CoinGecko</strong> (polled every 30 seconds,
          cached for resilience). Historical daily closes: CoinGecko since 2013;
          Bitcoinity for 2010–2012. On-chain metrics: <strong>mempool.space</strong>.
          Macro / CPI series: <strong>FRED</strong>. Tax references: IRS,
          HMRC, Income-tax Act of India, German EStG.
        </p>
      </>
    ),
  },
  {
    id: "dca-backtest",
    title: "DCA backtest",
    body: (
      <>
        <p>
          The "DCA since 2013 returns ~57% CAGR" figure on the DCA calculator
          and About page is computed as:
        </p>
        <pre className="overflow-x-auto rounded-md bg-muted/40 p-3 text-sm">{`btc_acquired_t = Σ (contribution_i / close_i)
portfolio_t    = btc_acquired_t × spot_t
CAGR           = (portfolio_t / total_contributed) ^ (1 / years) − 1`}</pre>
        <p>
          Window: <strong>1 Jan 2013 → most recent UTC close</strong>. Daily
          contribution at 09:00 UTC, no fees. Past performance ≠ future
          performance.
        </p>
      </>
    ),
  },
  {
    id: "retirement",
    title: "Retirement projection",
    body: (
      <p>
        Future BTC price uses a configurable CAGR (default 18% — the
        2017–2024 trailing 7-year median) compounded annually. Withdrawals
        use the safe-withdrawal model: <code>spend_t = portfolio_t × swr</code>
        with <code>swr</code> defaulting to 4%. Inflation discount uses
        long-run US CPI of 2.5%.
      </p>
    ),
  },
  {
    id: "power-law",
    title: "Power Law model",
    body: (
      <p>
        Implements Giovanni Santostasi's regression:{" "}
        <code>log10(price) = a · log10(days_since_genesis) + b</code> with{" "}
        <code>a ≈ 5.82</code>, <code>b ≈ −17.01</code>. Coefficients re-fit
        monthly against all daily closes since 3 Jan 2009.
      </p>
    ),
  },
  {
    id: "tax-rules",
    title: "Tax calculators",
    body: (
      <p>
        US federal brackets and capital-gains rates are the 2025 IRS schedule.
        UK CGT uses the 2025/26 HMRC rates (£3,000 allowance, 18% / 24%).
        India follows §115BBH (30% + 4% cess + 1% TDS). Germany follows §23
        EStG (12-month exemption, €1,000 Freigrenze). Estimates only — confirm
        with a qualified professional before filing.
      </p>
    ),
  },
  {
    id: "limitations",
    title: "Known limitations",
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li>No exchange-fee or slippage model on historical backtests.</li>
        <li>USD-only base currency for return calculations; fiat conversion is display-only.</li>
        <li>On-chain metrics depend on mempool.space availability.</li>
      </ul>
    ),
  },
];

const URL = "https://bitcoincalculator.tools/methodology";
const TITLE = "Methodology — formulas, data, and assumptions";
const DESC =
  "How every backtest number, projection, and tax estimate on bitcoincalculator.tools is calculated — formulas, data windows, sources, and known limitations.";

const Methodology = () => {
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="article" />
      </Helmet>
      <BreadcrumbSchema
        language="en"
        items={[
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Methodology", url: URL },
        ]}
      />
      <PageBackground>
        <Header />
        <main className="container mx-auto max-w-3xl px-4 py-8">
          <Breadcrumb items={[{ name: "Methodology" }]} />
          <header className="my-6 space-y-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Methodology
            </h1>
            <p className="text-muted-foreground">
              The formulas, data windows, and sources behind every backtest
              number and projection on this site. Deep-link to a section from
              any calculator result panel for transparency.
            </p>
          </header>

          <nav aria-label="On this page" className="mb-8 rounded-lg border border-border/60 p-4">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              On this page
            </h2>
            <ul className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a className="text-primary hover:underline" href={`#${s.id}`}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-10">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24 space-y-3">
                <h2 className="text-2xl font-semibold">{s.title}</h2>
                <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </div>
              </section>
            ))}
          </div>
        </main>
        <Footer />
      </PageBackground>
    </>
  );
};

export default Methodology;
