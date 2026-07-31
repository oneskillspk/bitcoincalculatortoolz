import { Link } from "@/components/LocalizedLink";
import { ArrowUpRight } from 'lucide-react';
import { ArticleMeta } from '@/data/articles';
import { useLocale } from '@/hooks/useLocale';
import { getCategoryLabel } from '@/utils/articleCategoryLabel';
import { formatArticleDateShort, formatReadingTime } from '@/utils/articleLocale';

interface ArticleCardProps {
  article: ArticleMeta;
  featured?: boolean;
}

export const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const { locale } = useLocale();
  const formattedDate = formatArticleDateShort(article.publishedDate, locale);

  return (
    <Link
      to={getArticleHref(article.slug, locale)}
      className="group block rounded-2xl border border-border/40 bg-card hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className={`p-6 ${featured ? 'sm:p-8' : ''} flex flex-col h-full min-h-[220px]`}>
        {/* Top: category eyebrow */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-primary">
            {getCategoryLabel(article.category, locale)}
          </span>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200" />
        </div>

        {/* Title */}
        <h3 className={`mt-5 font-light tracking-[-0.01em] text-foreground leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-3 ${featured ? 'text-2xl md:text-[1.625rem]' : 'text-lg'}`}>
          {article.title}
        </h3>

        {/* Description */}
        <p className={`mt-3 text-sm text-muted-foreground leading-relaxed flex-1 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
          {article.metaDescription}
        </p>

        {/* Footer: hairline meta */}
        <div className="mt-6 pt-4 border-t border-border/30 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{formattedDate}</span>
          <span aria-hidden>·</span>
          <span>{formatReadingTime(article.readingTime, locale)}</span>
        </div>
      </div>
    </Link>
  );
};
