import { Helmet } from 'react-helmet-async';

export interface DatasetSchemaProps {
  /** Display name of the dataset, e.g. "Historical Bitcoin DCA Returns 2010–2026". */
  name: string;
  /** One-paragraph description for AI / search engines. */
  description: string;
  /** Canonical URL of the page hosting the dataset. */
  url: string;
  /** ISO-8601 temporal coverage, e.g. "2010-07-17/.." for "since the genesis price up to today". */
  temporalCoverage: string;
  /** Plain-language list of fields measured. */
  variableMeasured: string[];
  /** ISO-8601 last update date for `dateModified`. Defaults to today. */
  dateModified?: string;
  /** Optional list of keyword strings. */
  keywords?: string[];
}

/**
 * Adds Google-recommended schema.org/Dataset structured data to data-heavy
 * calculator pages. Generative engines and Google Dataset Search both index
 * Dataset blocks separately from WebApplication, expanding the surface area
 * where the page can be cited.
 *
 * Source data: CoinGecko historical price API + the local JSON fallback. We
 * declare CC-BY-4.0 because that is how CoinGecko licenses derived charts.
 */
export const DatasetSchema = ({
  name,
  description,
  url,
  temporalCoverage,
  variableMeasured,
  dateModified,
  keywords = [],
}: DatasetSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    creator: {
      '@type': 'Organization',
      name: 'Bitcoin Calculator Tools',
      url: 'https://bitcoincalculator.tools',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bitcoin Calculator Tools',
      url: 'https://bitcoincalculator.tools',
    },
    temporalCoverage,
    variableMeasured,
    keywords: keywords.length ? keywords : undefined,
    dateModified: dateModified ?? new Date().toISOString().slice(0, 10),
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/html',
        contentUrl: url,
      },
    ],
    citation: 'CoinGecko Historical Price API — https://www.coingecko.com/en/api',
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
