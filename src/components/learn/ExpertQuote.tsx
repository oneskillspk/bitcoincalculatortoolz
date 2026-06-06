import { Quote } from 'lucide-react';

export interface ExpertQuoteData {
  quote: string;
  author: string;
  /** Author's role / credential, e.g. "Author, The Bitcoin Standard". */
  role: string;
  /** Public source URL for the quote (book page, article, talk). Required — no unverified quotes. */
  source: string;
  /** Display label for the source link. */
  sourceLabel: string;
}

interface ExpertQuoteProps {
  data: ExpertQuoteData;
}

/**
 * Attributed expert quote callout for educational articles.
 *
 * Per the April 2026 GEO audit, articles with verifiable expert citations are
 * 37% more likely to be surfaced by ChatGPT and Perplexity. Every quote MUST
 * link to a public, verifiable source — no fabricated or paraphrased citations.
 */
export const ExpertQuote = ({ data }: ExpertQuoteProps) => {
  return (
    <figure
      className="my-8 rounded-2xl border-l-4 border-primary bg-primary/[0.03] p-5 sm:p-6"
      itemScope
      itemType="https://schema.org/Quotation"
    >
      <Quote className="w-6 h-6 text-primary/60 mb-3" aria-hidden="true" />
      <blockquote
        className="text-base sm:text-lg text-foreground/90 leading-relaxed italic"
        itemProp="text"
      >
        &ldquo;{data.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 flex flex-col sm:flex-row sm:items-baseline sm:gap-2 text-sm">
        <span
          itemProp="creator"
          itemScope
          itemType="https://schema.org/Person"
          className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2"
        >
          <span className="font-semibold text-foreground" itemProp="name">
            — {data.author}
          </span>
          <span className="text-muted-foreground" itemProp="jobTitle">
            {data.role}
          </span>
        </span>
        <a
          href={data.source}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-xs text-primary hover:text-primary/80 underline underline-offset-2 sm:ml-auto"
          itemProp="citation"
        >
          Source: {data.sourceLabel}
        </a>
      </figcaption>
    </figure>
  );
};
