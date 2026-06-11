import { Link } from "@/components/LocalizedLink";
import { ArrowRight } from 'lucide-react';
import { ArticleMeta } from '@/data/articles';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocale } from '@/hooks/useLocale';
import { getCategoryLabel } from '@/utils/articleCategoryLabel';
import { formatArticleDateShort, formatReadingTime } from '@/utils/articleLocale';

interface FeaturedArticleHeroProps {
  article: ArticleMeta;
}

export const FeaturedArticleHero = ({ article }: FeaturedArticleHeroProps) => {
  const { language } = useLanguage();
  const { locale } = useLocale();
  const tr = language === 'tr';
  const formattedDate = formatArticleDateShort(article.publishedDate, locale);

  return (
    <section className="container mx-auto px-6 pt-10 pb-12">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left: editorial content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.18em] font-semibold">
            <span className="text-primary">
              {tr ? 'Öne Çıkan' : 'Featured'}
            </span>
            <span className="h-px w-8 bg-border" aria-hidden />
            <span className="text-muted-foreground">
              {getCategoryLabel(article.category, locale)}
            </span>
          </div>

          {/* Demoted to h2 — the Learn listing page already owns the single <h1>.
              Two <h1>s on /learn and /tr/ogrenin triggered SEO-audit "Multiple H1" warning. */}
          <h2 className="text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] font-light text-foreground leading-[1.1] tracking-[-0.02em]">
            {article.title}
          </h2>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {article.metaDescription}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formattedDate}</span>
            <span aria-hidden>·</span>
            <span>{formatReadingTime(article.readingTime, locale, 'long')}</span>
          </div>

          <Link
            to={`/learn/${article.slug}`}
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-primary border-b border-primary/40 hover:border-primary pb-1 transition-colors"
          >
            {tr ? 'Makaleyi Oku' : 'Read Article'}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Right: typographic mark */}
        <div className="hidden lg:flex lg:col-span-5 items-center justify-center">
          <div className="relative w-full aspect-[4/5] max-w-sm">
            <div className="absolute inset-0 rounded-sm border border-border/30" />
            <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-mono">
              {tr ? '01 · Öğrenme' : '01 · Learning'}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10rem] font-light text-primary/10 leading-none tracking-tighter select-none">₿</span>
            </div>
            <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-mono">
              {tr ? 'bitcoincalculator.tools' : 'bitcoincalculator.tools'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 border-b border-border/30" />
    </section>
  );
};
