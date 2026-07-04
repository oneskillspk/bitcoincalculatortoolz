import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, List } from 'lucide-react';
import { Link } from '@/components/LocalizedLink';
import { ArticleSection, articlesMeta } from '@/data/articles';
import { AffiliatePlacement } from '@/components/affiliateAI/AffiliatePlacement';
import { getCategoryLabel } from '@/utils/articleCategoryLabel';
import { formatReadingTime } from '@/utils/articleLocale';


interface ArticleSidebarProps {
  sections: ArticleSection[];
  relatedCalculators?: string[];
  relatedArticles?: string[];
  language?: 'en' | 'tr';
  slug?: string;
}

export const ArticleSidebar = ({
  sections,
  relatedArticles = [],
  language = 'en',
  slug,
}: ArticleSidebarProps) => {
  const tr = language === 'tr';
  const [tocOpen, setTocOpen] = useState(true);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const sectionEls = sections
      .map(s => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];
    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          const sorted = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(sorted[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    sectionEls.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Compact related articles (desktop sidebar only, capped at 4)
  const relatedArticleMetas = articlesMeta
    .filter(a => relatedArticles.includes(a.slug))
    .slice(0, 4);

  const labels = {
    contents: tr ? 'İçindekiler' : 'Contents',
    related: tr ? 'İlgili Makaleler' : 'Related Articles',
  };

  return (
    <aside className="space-y-6">
      {/* Table of Contents */}
      <div className="rounded-xl border border-border/30 bg-card p-5">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="flex items-center justify-between w-full text-sm font-semibold text-foreground"
        >
          <span className="flex items-center gap-2">
            <List className="w-4 h-4 text-primary" />
            {labels.contents}
          </span>
          {tocOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {tocOpen && (
          <nav className="mt-3 space-y-0.5">
            {sections.map((section) => {
              const isActive = activeId === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`block text-[13px] py-1.5 pl-3 border-l-2 transition-colors duration-150 ${
                    isActive
                      ? 'border-primary text-primary font-medium'
                      : 'border-border/20 text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  {section.heading}
                </a>
              );
            })}
          </nav>
        )}
      </div>

      {/* Related Articles — editorial sidebar block. Uses a non-heading
          label so the in-flow RelatedLinksSection remains the sole h2 source. */}
      {relatedArticleMetas.length > 0 && (
        <div className="relative">
          {/* hairline rule with eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono">
              {tr ? 'Devamı' : 'Further Reading'}
            </span>
            <span className="flex-1 h-px bg-border/40" aria-hidden />
          </div>

          <ul className="space-y-5">
            {relatedArticleMetas.map((a, idx) => {
              const basePath = tr ? `/tr/ogrenin/${a.slug}` : `/learn/${a.slug}`;
              const num = String(idx + 1).padStart(2, '0');
              return (
                <li key={a.slug}>
                  <Link to={basePath} className="group block">
                    <div className="flex gap-3">
                      <span className="font-mono text-[10px] text-muted-foreground pt-0.5 tracking-wider shrink-0">
                        {num}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="block text-[13px] leading-[1.45] font-light tracking-[-0.005em] text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
                          {a.title}
                        </span>
                        <span className="mt-1.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                          <span>{getCategoryLabel(a.category, language)}</span>
                          <span aria-hidden className="h-px w-3 bg-border" />
                          <span className="font-mono normal-case tracking-normal">
                            {formatReadingTime(a.readingTime, language, 'long')}
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}



      {slug && (
        <div className="hidden lg:block">
          {/* Single sidebar slot — stacking two sidebar affiliates back-to-back
              hurt CTR and looked promotional. We keep the contextual single-card
              and drop the second sidebar-widget. */}
          <AffiliatePlacement slug={slug} lang={language} zone="sidebar" forceFormat="single-card" />
        </div>
      )}

    </aside>
  );
};
