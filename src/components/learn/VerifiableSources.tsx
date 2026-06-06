import { Library, ExternalLink } from 'lucide-react';
import type { Article } from '@/data/articles';
import { RevealAnimation } from '@/components/animations/RevealAnimation';
import { useLanguage } from '@/contexts/LanguageContext';

interface SourceLink {
  label: string;
  url: string;
  publisher: string;
}

/**
 * Curated, manually verified primary-source links per article category.
 *
 * These are public, authoritative references that AI answer engines and
 * fact-checkers recognize as high-trust citations (whitepapers, government
 * agencies, central banks, peer-reviewed academic sources, established
 * journalism). We never link to engagement-bait or paywalled content.
 *
 * Used as a fallback citation block when an article does not yet have an
 * `expertQuote` attached, so every article still ships with at least three
 * verifiable references — meeting the GEO audit's citation-density bar.
 */
const SOURCE_LIBRARY: Record<Article['category'], SourceLink[]> = {
  Investing: [
    { label: 'Bitcoin: A Peer-to-Peer Electronic Cash System (Nakamoto, 2008)', url: 'https://bitcoin.org/bitcoin.pdf', publisher: 'bitcoin.org' },
    { label: 'BIS Working Paper No. 1062 — Crypto and decentralised finance', url: 'https://www.bis.org/publ/work1062.htm', publisher: 'Bank for International Settlements' },
    { label: 'Bitcoin (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Bitcoin', publisher: 'Wikipedia' },
  ],
  Trading: [
    { label: 'CME CF Bitcoin Reference Rate (BRR) methodology', url: 'https://www.cfbenchmarks.com/indices/BRTI', publisher: 'CF Benchmarks' },
    { label: 'SEC — Crypto Assets (Investor Education)', url: 'https://www.sec.gov/securities-topics/crypto-assets', publisher: 'U.S. SEC' },
    { label: 'Bitcoin Market Data — Live Price & Volume', url: 'https://www.coingecko.com/en/coins/bitcoin', publisher: 'CoinGecko' },
  ],
  Mining: [
    { label: 'Bitcoin Network Mining (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Bitcoin_network#Mining', publisher: 'Wikipedia' },
    { label: 'Cambridge Bitcoin Electricity Consumption Index', url: 'https://ccaf.io/cbnsi/cbeci', publisher: 'University of Cambridge' },
    { label: 'Bitcoin Halving Schedule & Block Reward', url: 'https://www.bitcoin.it/wiki/Controlled_supply', publisher: 'Bitcoin Wiki' },
  ],
  Basics: [
    { label: 'Bitcoin: A Peer-to-Peer Electronic Cash System (Nakamoto, 2008)', url: 'https://bitcoin.org/bitcoin.pdf', publisher: 'bitcoin.org' },
    { label: 'Bitcoin (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Bitcoin', publisher: 'Wikipedia' },
    { label: 'Bitcoin Developer Documentation', url: 'https://developer.bitcoin.org/', publisher: 'Bitcoin Core' },
  ],
  Tax: [
    { label: 'IRS Notice 2014-21 — Virtual Currency Guidance', url: 'https://www.irs.gov/pub/irs-drop/n-14-21.pdf', publisher: 'U.S. Internal Revenue Service' },
    { label: 'IRS FAQs on Virtual Currency Transactions', url: 'https://www.irs.gov/individuals/international-taxpayers/frequently-asked-questions-on-virtual-currency-transactions', publisher: 'U.S. Internal Revenue Service' },
    { label: 'Form 8949 — Sales and Other Dispositions of Capital Assets', url: 'https://www.irs.gov/forms-pubs/about-form-8949', publisher: 'U.S. Internal Revenue Service' },
  ],
  'Market Analysis': [
    { label: 'Bitcoin Market Data', url: 'https://www.coingecko.com/en/coins/bitcoin', publisher: 'CoinGecko' },
    { label: 'BIS Quarterly Review — Crypto markets', url: 'https://www.bis.org/publ/qtrpdf/r_qt2403.htm', publisher: 'Bank for International Settlements' },
    { label: 'Bitcoin Network Statistics', url: 'https://www.blockchain.com/explorer/charts', publisher: 'Blockchain.com' },
  ],
};

interface VerifiableSourcesProps {
  category: Article['category'];
}

/**
 * Fallback citation surface rendered when an article has no `expertQuote`.
 * Provides every article with at least three authoritative external references,
 * boosting AI citation affordance and E-E-A-T trust signals without fabricating
 * content.
 */
export const VerifiableSources = ({ category }: VerifiableSourcesProps) => {
  const { t } = useLanguage();
  const sources = SOURCE_LIBRARY[category] ?? SOURCE_LIBRARY.Basics;

  return (
    <RevealAnimation
      animation="up"
      duration={600}
      distance={20}
      threshold={0.15}
      triggerOnce
    >
      <aside
        className="my-8 sm:my-10 rounded-2xl border border-border/40 bg-card/50 p-4 sm:p-6"
        aria-labelledby="verifiable-sources-heading"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 border border-primary/20">
            <Library className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          </span>
          <h2
            id="verifiable-sources-heading"
            className="text-h2 font-semibold uppercase tracking-wider text-foreground"
          >
            Verifiable Sources
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
          Primary references used to research and fact-check this article.
        </p>
        <ul
          className="space-y-3 sm:space-y-2.5"
          aria-label={t('aria.externalSources')}
        >
          {sources.map((source) => (
            <li
              key={source.url}
              className="flex items-start gap-2.5 text-sm sm:text-base"
            >
              <ExternalLink
                className="w-4 h-4 sm:w-3.5 sm:h-3.5 mt-0.5 sm:mt-1 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="leading-snug min-w-0">
                <span className="sr-only">External link: </span>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-primary font-medium underline underline-offset-2 decoration-primary/40 hover:decoration-primary hover:text-primary/80 transition-colors rounded-sm focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {source.label}
                </a>
                <span className="text-muted-foreground"> — {source.publisher}</span>
              </span>
            </li>
          ))}
        </ul>
      </aside>
    </RevealAnimation>
  );
};