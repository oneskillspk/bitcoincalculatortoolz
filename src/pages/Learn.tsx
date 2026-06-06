import { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageBackground } from '@/components/modern/PageBackground';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ArticleCard } from '@/components/learn/ArticleCard';
import { CategoryFilter } from '@/components/learn/CategoryFilter';
import { FeaturedArticleHero } from '@/components/learn/FeaturedArticleHero';
import { InlineNewsletterStrip } from '@/components/learn/InlineNewsletterStrip';
import { LearnFAQSection } from '@/components/learn/LearnFAQSection';
import { ArticleSearchBar } from '@/components/learn/ArticleSearchBar';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { articlesMeta } from '@/data/articles';
import { useLanguage } from '@/contexts/LanguageContext';

const Learn = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Locale-scoped catalog: EN hub shows EN articles, /tr/ogrenin shows TR articles.
  const localizedArticles = useMemo(
    () => articlesMeta.filter(a => (a.language ?? 'en') === language),
    [language]
  );

  // Keep filter selection consistent across /learn ↔ /tr/ogrenin switches.
  // Categories are stored as locale-agnostic English keys, so the selection
  // survives a locale change — but if the new locale has no articles in that
  // category, reset to 'All' so the user doesn't see a blank list.
  useEffect(() => {
    if (selectedCategory === 'All') return;
    const stillValid = localizedArticles.some(a => a.category === selectedCategory);
    if (!stillValid) setSelectedCategory('All');
  }, [language, localizedArticles, selectedCategory]);

  // Featured = most recent article (last in array)
  const featuredArticle = localizedArticles[localizedArticles.length - 1];

  const filteredArticles = useMemo(() => {
    let results = selectedCategory === 'All'
      ? localizedArticles
      : localizedArticles.filter(a => a.category === selectedCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      results = results.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.metaDescription.toLowerCase().includes(q) ||
        a.keywords.some(k => k.toLowerCase().includes(q))
      );
    }

    return results;
  }, [selectedCategory, searchQuery, localizedArticles]);

  // Exclude featured from the grid
  const gridArticles = filteredArticles.filter(a => a.slug !== featuredArticle?.slug);

  // Split: first 2 "large" cards, rest in 3-col grid
  const prominentArticles = gridArticles.slice(0, 2);
  const remainingArticles = gridArticles.slice(2);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": tr ? 'tr' : 'en',
    "mainEntity": [
      { "@type": "Question", "name": tr ? "Bitcoin Öğrenme Merkezi hangi konuları kapsıyor?" : "What topics does the Bitcoin Learning Hub cover?", "acceptedAnswer": { "@type": "Answer", "text": tr ? "Öğrenme merkezimiz Bitcoin yatırım stratejileri, piyasa analizi, madencilik kârlılığı, vergi etkileri, Bitcoin temelleri ve emeklilik planlamasını kapsar." : "Our learning hub covers Bitcoin investing strategies, market analysis, mining profitability, tax implications, Bitcoin basics, and retirement planning." } },
      { "@type": "Question", "name": tr ? "Bu yazılar ücretsiz mi?" : "Are these articles free?", "acceptedAnswer": { "@type": "Answer", "text": tr ? "Evet, Bitcoin Calculator Tools üzerindeki tüm yazılar ve hesaplayıcılar tamamen ücretsizdir." : "Yes, all articles and calculators on Bitcoin Calculator Tools are completely free to use." } },
    ]
  };

  return (
    <PageBackground variant="clean">
      <Helmet>
        <title>{tr ? 'Bitcoin Öğrenme Merkezi' : 'Bitcoin Learning Hub'}</title>
        <meta name="description" content={tr ? 'Gerçekten öğreten ücretsiz Bitcoin rehberleri. DCA, yarılanma, madencilik, vergiler — her rehber canlı bir hesaplayıcıya bağlanır.' : 'Free Bitcoin guides that actually teach you something. DCA strategy, halving, mining, taxes, on-chain metrics — every guide links to a live calculator tool.'} />
        <meta name="keywords" content={tr ? 'bitcoin rehberi, bitcoin öğren, bitcoin yatırım, bitcoin eğitimi, kripto eğitimleri' : 'bitcoin guide, learn bitcoin, bitcoin investing, bitcoin education, crypto tutorials'} />
        <link rel="canonical" href={tr ? "https://bitcoincalculator.tools/tr/ogrenin" : "https://bitcoincalculator.tools/learn"} />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/learn" />
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/ogrenin" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/learn" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={tr ? 'Bitcoin Öğrenme Merkezi' : 'Bitcoin Learning Hub'} />
        <meta property="og:description" content={tr ? 'Gerçekten bir şey öğreten ücretsiz Bitcoin rehberleri. DCA stratejisi, yarılanma, madencilik, vergiler, zincir üstü metrikler — her rehber canlı bir hesaplayıcıya bağlanır.' : 'Free Bitcoin guides that actually teach you something. DCA strategy, halving, mining, taxes, on-chain metrics — every guide links to a live calculator tool.'} />
        <meta property="og:url" content={tr ? "https://bitcoincalculator.tools/tr/ogrenin" : "https://bitcoincalculator.tools/learn"} />
        <meta property="og:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta property="og:image:alt" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'Bitcoin Öğrenme Merkezi | bitcoincalculator.tools' : 'Bitcoin Learning Hub | bitcoincalculator.tools'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={language==='tr'?'Bitcoin Öğrenme Merkezi':'Bitcoin Learning Hub'} />
        <meta name="twitter:description" content={language==='tr'?'Size gerçekten bir şeyler öğreten ücretsiz Bitcoin rehberleri — her rehber canlı bir hesaplayıcıya bağlanır.':'Free Bitcoin guides that actually teach you something — every guide links to a live calculator.'} />
        <meta name="twitter:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": tr ? "Bitcoin Öğrenme Merkezi" : "Bitcoin Learning Hub",
            "description": tr ? "Gerçekten bir şey öğreten ücretsiz Bitcoin rehberleri. DCA stratejisi, yarılanma, madencilik, vergiler, zincir üstü metrikler — her rehber canlı bir hesaplayıcıya bağlanır." : "Free Bitcoin guides that actually teach you something. DCA strategy, halving, mining, taxes, on-chain metrics — every guide links to a live calculator tool.",
            "url": tr ? "https://bitcoincalculator.tools/tr/ogrenin" : "https://bitcoincalculator.tools/learn",
            "isPartOf": {
              "@type": "WebSite",
              "url": "https://bitcoincalculator.tools"
            }
          })}
        </script>
      </Helmet>

      <BreadcrumbSchema language={language}
        items={[
        { name: tr ? "Ana Sayfa" : "Home", url: "https://bitcoincalculator.tools/" },
        { name: tr ? "Öğren" : "Learn", url: tr ? "https://bitcoincalculator.tools/tr/ogrenin" : "https://bitcoincalculator.tools/learn" }
        ]}
      />

      <Header />

      <main id="main-content" className="pt-20 relative z-10">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 pt-8">
          <Breadcrumb items={[{ label: tr ? "Öğren" : "Learn" }]} />
        </div>

        {/* Editorial hero */}
        <section className="container mx-auto px-6 pt-10 pb-14">
          <span className="block text-[11px] uppercase tracking-[0.18em] text-primary/80 font-semibold mb-5">
            {tr ? 'Bitcoin Öğrenme Merkezi' : 'Bitcoin Learning Hub'}
          </span>
          <h1 className="text-[clamp(2.25rem,1.6rem+2.8vw,3.75rem)] font-light text-foreground leading-[1.05] tracking-[-0.02em] max-w-4xl">
            {tr
              ? 'Bitcoin\u2019i derinlemesine öğrenin — her rehber bir hesaplayıcıya bağlanır.'
              : 'Learn Bitcoin in depth — every guide wires straight to a live calculator.'}
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {tr
              ? 'DCA, yarılanma, madencilik, vergiler ve zincir üstü metrikler üzerine bağımsız, kaynaklı rehberler.'
              : 'Independent, sourced guides on DCA, halving, mining, taxes, and on-chain metrics.'}
          </p>

          {/* Stat row */}
          <div className="mt-10 pt-6 border-t border-border/30 grid grid-cols-3 max-w-2xl divide-x divide-border/40">
            <div className="pr-6">
              <div className="font-mono text-2xl md:text-3xl font-light text-foreground">{localizedArticles.length}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{tr ? 'Rehber' : 'Guides'}</div>
            </div>
            <div className="px-6">
              <div className="font-mono text-2xl md:text-3xl font-light text-foreground">
                {new Set(localizedArticles.map(a => a.category)).size}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{tr ? 'Kategori' : 'Categories'}</div>
            </div>
            <div className="pl-6">
              <div className="font-mono text-2xl md:text-3xl font-light text-foreground">2026</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{tr ? 'Güncellenmiş' : 'Updated'}</div>
            </div>
          </div>
        </section>

        {/* Featured Article Hero */}
        {featuredArticle && <FeaturedArticleHero article={featuredArticle} />}

        {/* Sticky filter bar */}
        <div className="sticky top-16 z-30 bg-background/85 backdrop-blur-md border-y border-border/30">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
              <CategoryFilter
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                articles={localizedArticles}
              />
              <div className="pb-3 md:pb-0 md:py-2 shrink-0">
                <ArticleSearchBar query={searchQuery} onChange={setSearchQuery} />
              </div>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="container mx-auto px-6 pt-12">
          {prominentArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {prominentArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} featured />
              ))}
            </div>
          )}

          {remainingArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {remainingArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}

          {filteredArticles.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              {tr ? 'Bu kategoride henüz yazı bulunamadı.' : 'No articles found in this category yet.'}
            </p>
          )}
        </div>

        {/* Inline Newsletter */}
        <InlineNewsletterStrip />

        {/* FAQ */}
        <LearnFAQSection />
      </main>

      <Footer />
    </PageBackground>
  );
};

export default Learn;
