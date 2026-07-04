import { Link } from "@/components/LocalizedLink";
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { articlesMeta } from '@/data/articles';
import { getCalculatorName } from '@/data/calculatorMeta';
import { getLocalizedPath } from '@/utils/localizedRoutes';
import { getCategoryLabel } from '@/utils/articleCategoryLabel';
import { formatReadingTime } from '@/utils/articleLocale';

interface RelatedLinksSectionProps {
  relatedCalculators: string[];
  relatedArticles: string[];
  language: 'en' | 'tr';
}

/**
 * In-flow related-links block.
 * - Related Calculators: premium card grid, visible everywhere.
 * - Related Articles: mobile-only (sidebar owns desktop).
 */
export const RelatedLinksSection = ({
  relatedCalculators,
  relatedArticles,
  language,
}: RelatedLinksSectionProps) => {
  const tr = language === 'tr';
  const articleMetas = articlesMeta.filter((a) => relatedArticles.includes(a.slug));

  if (relatedCalculators.length === 0 && articleMetas.length === 0) return null;

  const calcEyebrow = tr ? 'Hesaplayıcılarla Dene' : 'Try the Calculators';
  const calcHeading = tr ? 'İlgili Hesaplayıcılar' : 'Related Calculators';
  const calcSubtitle = tr
    ? 'Bu kavramları kendi rakamlarınızla canlı çalıştırın.'
    : 'Run these concepts with your own numbers, live.';
  const articleHeading = tr ? 'İlgili Makaleler' : 'Related Articles';
  const articleSubtitle = tr
    ? 'Bu konuyu daha derinlemesine inceleyin.'
    : 'Go deeper on this topic.';
  const openLabel = tr ? 'Hesaplayıcıyı Başlat' : 'Launch Calculator';

  return (
    <section
      aria-label={tr ? 'İlgili içerikler' : 'Related content'}
      className="mt-16 pt-12 border-t border-border/30 space-y-16"
    >
      {/* Related Calculators — editorial numbered list, institutional grade */}
      {relatedCalculators.length > 0 && (
        <div>
          {/* Section header: eyebrow + hairline rule */}
          <div className="flex items-end justify-between gap-6 mb-10 pb-6 border-b border-border/30">
            <div className="max-w-2xl">
              <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono mb-3">
                {calcEyebrow}
              </span>
              <h2 className="text-h2 font-light tracking-[-0.02em] text-foreground leading-[1.1]">
                {calcHeading}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground max-w-md">{calcSubtitle}</p>
            </div>
            <span className="hidden md:block text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono shrink-0 pb-1">
              {String(relatedCalculators.length).padStart(2, '0')} {tr ? 'araç' : 'tools'}
            </span>
          </div>

          {/* Numbered editorial rows */}
          <ul className="divide-y divide-border/40 border-b border-border/30">
            {relatedCalculators.map((calc, idx) => {
              const path = getLocalizedPath(`/calculators/${calc}`, language);
              const name = getCalculatorName(calc, language);
              const num = String(idx + 1).padStart(2, '0');
              return (
                <li key={calc}>
                  <Link
                    to={path}
                    className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-6 md:gap-10 py-7 md:py-8 transition-colors duration-300"
                  >
                    {/* Index */}
                    <span className="font-mono text-xs md:text-sm text-muted-foreground tracking-[0.15em] group-hover:text-primary transition-colors">
                      {num}
                    </span>

                    {/* Title + open label */}
                    <div className="min-w-0">
                      <h3 className="text-h3 md:text-[1.625rem] font-light tracking-[-0.015em] text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                        {name}
                      </h3>
                      <span className="mt-1.5 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 font-mono">
                        {openLabel}
                      </span>
                    </div>

                    {/* Arrow */}
                    <span className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-border/40 group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground/70 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
                    </span>

                    {/* Hover accent — left rail */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}



      {/* Related Articles — mobile only; desktop sidebar owns this. */}
      {articleMetas.length > 0 && (
        <div className="lg:hidden">
          <div className="mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">{articleHeading}</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{articleSubtitle}</p>
          <ul className="divide-y divide-border/40 border-y border-border/30">
            {articleMetas.map((a) => {
              const basePath = tr ? `/tr/ogrenin/${a.slug}` : `/learn/${a.slug}`;
              return (
                <li key={a.slug}>
                  <Link to={basePath} className="group block py-4">
                    <span className="block text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {a.title}
                    </span>
                    <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{getCategoryLabel(a.category, language)}</span>
                      <span aria-hidden>·</span>
                      <span>{formatReadingTime(a.readingTime, language, 'long')}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
};
