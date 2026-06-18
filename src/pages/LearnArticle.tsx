import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useLocation, Navigate } from "react-router-dom";
import { Link } from "@/components/LocalizedLink";
import { ChevronRight, Calendar, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArticleShareButtons } from '@/components/learn/ArticleShareButtons';
import { FloatingNavigation } from '@/components/layout/FloatingNavigation';
import { BackToTopButton } from '@/components/learn/BackToTopButton';
import { Footer } from '@/components/Footer';
import { PageBackground } from '@/components/modern/PageBackground';
import { ArticleContent, renderInlineMarkdown } from '@/components/learn/ArticleContent';
import { ArticleSidebar } from '@/components/learn/ArticleSidebar';
import { ArticleSchema } from '@/components/learn/ArticleSchema';
import { ArticleAuthorBox } from '@/components/learn/ArticleAuthorBox';
import { AffiliatePlacement } from '@/components/affiliateAI/AffiliatePlacement';
import { ARTICLE_CATEGORY_AFFILIATE } from '@/config/placements.config';
import { RelatedLinksSection } from '@/components/learn/RelatedLinksSection';
import { ExpertQuote } from '@/components/learn/ExpertQuote';
import { VerifiableSources } from '@/components/learn/VerifiableSources';
import { ReadingProgressBar } from '@/components/learn/ReadingProgressBar';
import { Skeleton } from '@/components/ui/skeleton';
import { getArticleBySlug, getArticleMetaBySlug, type Article } from '@/data/articles';
import { EN_TO_TR, TR_TO_EN } from '@/utils/localizedRoutes';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LearnArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { pathname } = useLocation();
  // Derive TR-ness from the URL first — it's synchronous on every render and
  // beats the language context if the latter hasn't caught up yet (e.g. when
  // a TR article is loaded directly with localStorage='en'). Fall back to
  // context for non-/tr surfaces.
  const tr = pathname === '/tr' || pathname.startsWith('/tr/') || language === 'tr';
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const meta = getArticleMetaBySlug(slug);
    if (!meta) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    getArticleBySlug(slug).then((data) => {
      if (data) setArticle(data);
      else setNotFound(true);
      setLoading(false);
    });
  }, [slug]);

  if (notFound) return <Navigate to={tr ? '/tr/ogrenin' : '/learn'} replace />;

  // Resolve EN/TR slug pair for canonical + hreflang. The route slug is the
  // language-native slug; the counterpart slug is looked up via EN_TO_TR.
  const currentSlug = slug || '';
  const enPath = tr
    ? (TR_TO_EN[`/tr/ogrenin/${currentSlug}`] ?? `/learn/${currentSlug}`)
    : `/learn/${currentSlug}`;
  const trPath = tr
    ? `/tr/ogrenin/${currentSlug}`
    : (EN_TO_TR[`/learn/${currentSlug}`] ?? null);
  const enUrl = `https://bitcoincalculator.tools${enPath}`;
  const trUrl = trPath ? `https://bitcoincalculator.tools${trPath}` : null;
  const canonicalUrl = tr ? (trUrl ?? enUrl) : enUrl;

  if (loading || !article) {
    const loadingMeta = getArticleMetaBySlug(slug || '');
    return (
    <PageBackground variant="subtle">
      {loadingMeta && (
        <Helmet>
          <title>{loadingMeta.title}</title>
          <meta name="description" content={loadingMeta.metaDescription} />
          <link rel="canonical" href={canonicalUrl} />
          <link rel="alternate" hrefLang="en" href={enUrl} />
          {trUrl && <link rel="alternate" hrefLang="tr" href={trUrl} />}
          <link rel="alternate" hrefLang="x-default" href={enUrl} />
          {/* Social/OG fallback for crawlers hitting the page mid-load */}
          <meta property="og:title" content={loadingMeta.title} />
          <meta property="og:description" content={loadingMeta.metaDescription} />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:type" content="article" />
          <meta property="og:image" content={tr ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
          <meta property="og:site_name" content="bitcoincalculator.tools" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={loadingMeta.title} />
          <meta name="twitter:description" content={loadingMeta.metaDescription} />
          <meta name="twitter:image" content={tr ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
          <meta name="twitter:creator" content="@web3believers" />
          <meta name="twitter:site" content="@web3believers" />
        </Helmet>
      )}
      <FloatingNavigation />
      <main id="main-content" className="container mx-auto px-4 sm:px-6 pt-28 pb-16">
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-4 w-12" /><Skeleton className="h-4 w-12" /><Skeleton className="h-4 w-32" />
        </div>
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-48" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
          <div className="hidden lg:block space-y-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </main>
    </PageBackground>
  );
  }

  const dateFormatter = new Intl.DateTimeFormat(tr ? 'tr-TR' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const formattedUpdated = dateFormatter.format(new Date(article.updatedDate));
  const formattedPublished = dateFormatter.format(new Date(article.publishedDate));
  const wasUpdated = article.updatedDate !== article.publishedDate;

  return (
    <PageBackground variant="subtle">
      <ReadingProgressBar />
      <BackToTopButton />
      <ArticleSchema article={article} language={tr ? 'tr' : 'en'} canonicalUrl={canonicalUrl} />
      <Helmet>
        <link rel="alternate" hrefLang="en" href={enUrl} />
        {trUrl && <link rel="alternate" hrefLang="tr" href={trUrl} />}
        <link rel="alternate" hrefLang="x-default" href={enUrl} />
      </Helmet>
      <FloatingNavigation />

      <main id="main-content" className="container mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-8" aria-label={t('aria.breadcrumb')}>
          <Link to="/" className="hover:text-primary transition-colors shrink-0">{tr ? 'Ana Sayfa' : 'Home'}</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link to={tr ? '/tr/ogrenin' : '/learn'} className="hover:text-primary transition-colors shrink-0">{tr ? 'Öğren' : 'Learn'}</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-foreground/70 font-medium truncate">{article.title}</span>
        </nav>

        {/* Full-width Article Header */}
        <header className="mb-10 pb-8 border-b border-border/20">
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
            {article.category}
          </span>
          <h1 className="text-h1 font-bold text-foreground mb-5">
            {article.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                {tr ? 'Yazan' : 'By'}{' '}
                <Link to={tr ? '/tr/hakkimizda' : '/about'} className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                  Web3Believer &amp; Webio
                </Link>
              </span>
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  {wasUpdated ? (
                    <>
                      <span>{tr ? 'Güncellendi ' : 'Updated '}</span>
                      <time dateTime={article.updatedDate}>{formattedUpdated}</time>
                    </>
                  ) : (
                    <time dateTime={article.publishedDate}>{tr ? 'Yayınlandı ' : 'Published '}{formattedPublished}</time>
                  )}
                </span>
                {wasUpdated && (
                  <span className="hidden sm:inline text-muted-foreground/70">
                    · {tr ? 'İlk yayın:' : 'Originally published'} <time dateTime={article.publishedDate}>{formattedPublished}</time>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {article.readingTime} {tr ? 'dk okuma' : 'min read'}
                </span>
              </div>
            </div>
            <ArticleShareButtons title={article.title} slug={article.slug} language={tr ? 'tr' : 'en'} />
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Main Content */}
          <article className="lg:col-span-2">
            {/* Mobile TOC */}
            <div className="lg:hidden mb-8">
              <Accordion type="single" collapsible>
                <AccordionItem value="toc" className="border border-border/30 rounded-xl">
                  <AccordionTrigger className="px-5 py-3 text-sm font-semibold">
                    {tr ? 'İçindekiler' : 'Table of Contents'}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-4">
                    <nav className="space-y-2">
                      {article.sections.map((section) => (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                        >
                          {section.heading}
                        </a>
                      ))}
                    </nav>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <ArticleContent sections={article.sections} slug={article.slug} />

            {/* Inline-mid-article banner placement — seeded with category intent. */}
            <AffiliatePlacement
              slug={article.slug}
              lang={tr ? 'tr' : 'en'}
              zone="inline-mid-article"
              forceAffiliateId={
                ARTICLE_CATEGORY_AFFILIATE[article.category]?.[tr ? 'tr' : 'en']
              }
              forceFormat="image-banner"
            />


            {/* Expert citation — boosts AI answer-engine surfacing */}
            {article.expertQuote ? (
              <ExpertQuote data={article.expertQuote} />
            ) : (
              <VerifiableSources category={article.category} />
            )}

            {/* FAQs */}
            {article.faqs.length > 0 && (
              <section id="faq" className="mt-14 pt-8 border-t border-border/20 scroll-mt-24">
                <h2 className="text-h2 font-semibold text-foreground mb-6">{tr ? 'Sık Sorulan Sorular' : 'Frequently Asked Questions'}</h2>
                <div className="rounded-xl border border-border/30 bg-card">
                  <Accordion type="single" collapsible className="divide-y divide-border/40">
                    {article.faqs.map((faq, i) => (
                      <AccordionItem key={i} value={`faq-${i}`} className="border-0">
                        <AccordionTrigger className="px-6 py-4 text-sm font-medium text-foreground hover:text-primary text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                          {renderInlineMarkdown(faq.answer)}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </section>
            )}

            {/* Visible internal-linking block — primary discovery surface
                for all breakpoints. The sidebar version below is desktop-only. */}
            <RelatedLinksSection
              relatedCalculators={article.relatedCalculators}
              relatedArticles={article.relatedArticles}
              language={tr ? 'tr' : 'en'}
            />

            {/* E-E-A-T author bio */}
            <ArticleAuthorBox />
          </article>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <ArticleSidebar
                sections={article.sections}
                relatedCalculators={article.relatedCalculators}
                relatedArticles={article.relatedArticles}
                language={tr ? 'tr' : 'en'}
                slug={article.slug}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
};

export default LearnArticle;
