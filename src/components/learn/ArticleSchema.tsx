import { Helmet } from 'react-helmet-async';
import { Article } from '@/data/articles';

interface ArticleSchemaProps {
  article: Article;
  /**
   * Page language. Controls `inLanguage` on every emitted JSON-LD block and
   * mirrors locale into `@id` / `mainEntityOfPage` / `url`. Defaults to "en"
   * for backward compatibility with existing /learn/* routes.
   */
  language?: string;
  /**
   * Optional canonical override. Use for TR articles where the slug lives
   * under `/tr/ogrenin/<tr-slug>` rather than `/learn/<slug>`.
   */
  canonicalUrl?: string;
}

/** Truncate to first sentence or max chars for twitter:description */
const truncateForTwitter = (text: string, maxLength = 95): string => {
  const firstSentence = text.split(/[.!?]/)[0];
  if (firstSentence.length <= maxLength) return firstSentence + '.';
  return text.slice(0, maxLength - 3).trim() + '...';
};

export const ArticleSchema = ({ article, language: rawLanguage = "en", canonicalUrl: canonicalOverride }: ArticleSchemaProps) => {
  const language: "en" | "tr" = rawLanguage === "tr" ? "tr" : "en";
  const canonicalUrl = canonicalOverride ?? `https://bitcoincalculator.tools/learn/${article.slug}`;
  const imageUrl = 'https://bitcoincalculator.tools/social-preview.webp';
  const twitterDescription = truncateForTwitter(article.metaDescription);
  const imageAlt = `${article.title} — bitcoincalculator.tools`;

  // Dynamic HowTo name: use title directly if it starts with "How to", otherwise prefix
  const howToName = article.howToSteps.length > 0
    ? article.title.toLowerCase().startsWith('how to')
      ? article.title
      : `How to Use the ${article.title}`
    : '';

  // TR breadcrumb labels for /tr/ogrenin/* so crawlers see Turkish trail names
  const breadcrumbLabels = language === "tr"
    ? { home: "Ana Sayfa", learn: "Öğrenin", learnUrl: "https://bitcoincalculator.tools/tr/ogrenin" }
    : { home: "Home", learn: "Learn", learnUrl: "https://bitcoincalculator.tools/learn" };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    "inLanguage": language,
    "headline": article.title,
    "description": article.metaDescription,
    "datePublished": article.publishedDate,
    "dateModified": article.updatedDate,
    "author": [
      {
        "@type": "Person",
        "@id": "https://bitcoincalculator.tools/#web3believer",
        "name": "Web3Believer",
        "url": `https://bitcoincalculator.tools${language === "tr" ? "/tr/hakkimizda" : "/about"}`
      },
      {
        "@type": "Person",
        "@id": "https://bitcoincalculator.tools/#webio",
        "name": "Webio",
        "url": `https://bitcoincalculator.tools${language === "tr" ? "/tr/hakkimizda" : "/about"}`
      }
    ],
    "publisher": {
      "@type": "Organization",
      "name": "Bitcoin Calculator Tools",
      "url": "https://bitcoincalculator.tools",
      "logo": {
        "@type": "ImageObject",
        "url": imageUrl
      }
    },
    "image": imageUrl,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "keywords": article.keywords.join(', ')
  };

  const faqSchema = article.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${canonicalUrl}#faq`,
    "inLanguage": language,
    "mainEntity": article.faqs.map((faq, i) => ({
      "@type": "Question",
      "@id": `${canonicalUrl}#faq-${i + 1}`,
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const howToSchema = article.howToSteps.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${canonicalUrl}#howto`,
    "inLanguage": language,
    "name": howToName,
    "description": article.metaDescription,
    "step": article.howToSteps.map((step, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": step.name,
      "text": step.text
    }))
  } : null;

  // Speakable selectors must match real DOM ids on the rendered article:
  //  - the first article section (e.g. `#overview`, `#what-is-halving`,
  //    `#genel-bakis` on TR) — always present because every article has
  //    at least one section.
  //  - `#faq` — added explicitly on the FAQ <section> in LearnArticle.tsx
  //    when `article.faqs.length > 0`. Omit if the article has no FAQs.
  const speakableSelectors: string[] = [];
  if (article.sections.length > 0) {
    speakableSelectors.push(`#${article.sections[0].id}`);
  }
  if (article.faqs.length > 0) {
    speakableSelectors.push('#faq');
  }
  const speakableSchema = article.speakable && speakableSelectors.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#speakable`,
    "inLanguage": language,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": speakableSelectors
    },
    "url": canonicalUrl
  } : null;

  // BreadcrumbList intentionally omits `inLanguage` — schema.org rejects it on
  // this type (Rich Results "Unexpected property" error). Locale is carried by
  // the sibling Article / WebPage / FAQPage blocks below.
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": breadcrumbLabels.home, "item": `https://bitcoincalculator.tools${language === "tr" ? "/tr/" : "/"}` },
      { "@type": "ListItem", "position": 2, "name": breadcrumbLabels.learn, "item": breadcrumbLabels.learnUrl },
      { "@type": "ListItem", "position": 3, "name": article.title, "item": canonicalUrl }
    ]
  };

  return (
    <Helmet htmlAttributes={{ lang: language }}>
      <title>{article.title}</title>
      <meta name="description" content={article.metaDescription} />
      <meta name="keywords" content={article.keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:locale" content={language === "tr" ? "tr_TR" : "en_US"} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={article.title} />
      <meta property="og:description" content={article.metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="bitcoincalculator.tools" />
      <meta property="article:author" content={`https://bitcoincalculator.tools${language === "tr" ? "/tr/hakkimizda" : "/about"}`} />
      <meta property="article:published_time" content={article.publishedDate} />
      <meta property="article:modified_time" content={article.updatedDate} />
      <meta property="article:section" content={article.category} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={article.title} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@web3believers" />
      <meta name="twitter:site" content="@web3believers" />

      {/* Schemas */}
      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      {howToSchema && <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>}
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      {speakableSchema && <script type="application/ld+json">{JSON.stringify(speakableSchema)}</script>}
    </Helmet>
  );
};
