import { Link } from "@/components/LocalizedLink";
import { ArticleSection } from '@/data/articles';
import { ArticleCTA } from './ArticleCTA';
import { AffiliatePlacement } from '@/components/affiliateAI/AffiliatePlacement';

interface ArticleContentProps {
  sections: ArticleSection[];
  slug?: string;
}

/**
 * Domains that block crawler HEAD/GET requests (paywalled, anti-bot, or login-gated).
 * Links to these still work for human users, but Lighthouse / SEO crawlers see
 * 402/403/404 and ding our outbound-link health. Marking them nofollow tells
 * Google we know the destination is unverifiable from a crawl, which preserves
 * the citation for users without hurting our SEO score.
 */
const NOFOLLOW_DOMAINS = [
  'investopedia.com',
  'medium.com',
  'reddit.com',
  'wsj.com',
  'ft.com',
  'bloomberg.com',
  'nytimes.com',
];

const shouldNofollow = (href: string) => {
  try {
    const host = new URL(href).hostname.replace(/^www\./, '');
    return NOFOLLOW_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
  } catch {
    return false;
  }
};

/** Render a single link element */
const renderLink = (linkText: string, href: string, key: string | number, bold = false) => {
  const cls = `text-primary hover:text-primary/80 underline underline-offset-2 transition-colors${bold ? ' font-semibold' : ''}`;
  if (href.startsWith('/')) {
    return <Link key={key} to={href} className={cls}>{linkText}</Link>;
  }
  const rel = shouldNofollow(href)
    ? 'noopener noreferrer nofollow'
    : 'noopener noreferrer';
  return <a key={key} href={href} className={cls} target="_blank" rel={rel}>{linkText}</a>;
};

/** Parse links inside a text fragment (used for bold content) */
const parseLinks = (text: string, keyPrefix: string | number, bold = false) => {
  const linkParts = text.split(/(\[[^\]]+\]\([^)]+\))/);
  return linkParts.map((lp, k) => {
    const lm = lp.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (lm) return renderLink(lm[1], lm[2], `${keyPrefix}-${k}`, bold);
    if (!lp) return null;
    return bold ? <strong key={`${keyPrefix}-${k}`} className="text-foreground font-semibold">{lp}</strong> : <span key={`${keyPrefix}-${k}`}>{lp}</span>;
  });
};

/** Parse inline markdown: **bold**, *italic*, [link](url), and nested **text [link](url) text** */
export const renderInlineMarkdown = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/);
  return parts.map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      if (/\[[^\]]+\]\([^)]+\)/.test(inner)) {
        return <span key={j}>{parseLinks(inner, j, true)}</span>;
      }
      return <strong key={j} className="text-foreground font-semibold">{inner}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      const inner = part.slice(1, -1);
      if (/\[[^\]]+\]\([^)]+\)/.test(inner)) {
        return <em key={j}>{parseLinks(inner, j, false)}</em>;
      }
      return <em key={j} className="text-foreground/90">{inner}</em>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return renderLink(linkMatch[1], linkMatch[2], j);
    }
    return <span key={j}>{part}</span>;
  });
};

/** Check if a line is a bullet item */
const isBulletLine = (line: string) => /^\s*[•\-]\s/.test(line);

/** Check if a line is a numbered list item */
const isNumberedLine = (line: string) => /^\s*\d+[.)]\s/.test(line);

/** Strip bullet prefix */
const stripBullet = (line: string) => line.replace(/^\s*[•\-]\s*/, '');

/** Strip number prefix */
const stripNumber = (line: string) => line.replace(/^\s*\d+[.)]\s*/, '');

export const ArticleContent = ({ sections, slug }: ArticleContentProps) => {
  return (
    <div className="space-y-10">
      {sections.map((section, sectionIndex) => (
        <div key={section.id}>
          <section id={section.id} className="scroll-mt-24">
            <h2 className="text-xl font-semibold text-foreground mb-4 border-l-[3px] border-primary pl-4">
              {section.heading}
            </h2>
            <div className="max-w-none text-foreground/80 leading-8 space-y-4">
              {section.content.split('\n\n').map((paragraph, i) => {
                const lines = paragraph.split('\n');
                const nonEmptyLines = lines.filter(l => l.trim());
                const allBullets = nonEmptyLines.length > 0 && nonEmptyLines.every(isBulletLine);

                if (allBullets) {
                  return (
                    <ul key={i} className="space-y-2 pl-1">
                      {nonEmptyLines.map((line, li) => (
                        <li key={li} className="flex items-start gap-2.5 text-base">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2.5 flex-shrink-0" />
                          <span>{renderInlineMarkdown(stripBullet(line))}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                const allNumbered = nonEmptyLines.length > 0 && nonEmptyLines.every(isNumberedLine);

                if (allNumbered) {
                  return (
                    <ol key={i} className="space-y-2 pl-1 list-none">
                      {nonEmptyLines.map((line, li) => (
                        <li key={li} className="flex items-start gap-2.5 text-base">
                          <span className="text-primary/80 font-medium mt-0 flex-shrink-0 min-w-[1.25rem]">{li + 1}.</span>
                          <span>{renderInlineMarkdown(stripNumber(line))}</span>
                        </li>
                      ))}
                    </ol>
                  );
                }

                const hasMixedBullets = nonEmptyLines.some(isBulletLine) && !allBullets;
                const hasMixedNumbers = nonEmptyLines.some(isNumberedLine) && !allNumbered;

                if (hasMixedBullets || hasMixedNumbers) {
                  const groups: { type: 'text' | 'bullet' | 'number'; lines: string[] }[] = [];
                  for (const line of lines) {
                    if (!line.trim()) continue;
                    const lineType: 'text' | 'bullet' | 'number' = isBulletLine(line) ? 'bullet' : isNumberedLine(line) ? 'number' : 'text';
                    const lastGroup = groups[groups.length - 1];
                    if (lastGroup && lastGroup.type === lineType) {
                      lastGroup.lines.push(line);
                    } else {
                      groups.push({ type: lineType, lines: [line] });
                    }
                  }

                  return (
                    <div key={i} className="space-y-3">
                      {groups.map((group, gi) => {
                        if (group.type === 'bullet') {
                          return (
                            <ul key={gi} className="space-y-2 pl-1">
                              {group.lines.map((line, li) => (
                                <li key={li} className="flex items-start gap-2.5 text-base">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2.5 flex-shrink-0" />
                                  <span>{renderInlineMarkdown(stripBullet(line))}</span>
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        if (group.type === 'number') {
                          return (
                            <ol key={gi} className="space-y-2 pl-1 list-none">
                              {group.lines.map((line, li) => (
                                <li key={li} className="flex items-start gap-2.5 text-base">
                                  <span className="text-primary/80 font-medium mt-0 flex-shrink-0 min-w-[1.25rem]">{li + 1}.</span>
                                  <span>{renderInlineMarkdown(stripNumber(line))}</span>
                                </li>
                              ))}
                            </ol>
                          );
                        }
                        return (
                          <p key={gi} className="text-base leading-8">
                            {renderInlineMarkdown(group.lines.join(' '))}
                          </p>
                        );
                      })}
                    </div>
                  );
                }

                // Table detection
                if (paragraph.includes('|') && paragraph.includes('---')) {
                  const tableLines = lines.filter(l => l.trim() && !l.includes('---'));
                  if (tableLines.length > 1) {
                    const headers = tableLines[0].split('|').filter(c => c.trim()).map(c => c.trim());
                    const rows = tableLines.slice(1).map(r => r.split('|').filter(c => c.trim()).map(c => c.trim()));
                    return (
                      <div key={i} className="overflow-x-auto rounded-lg border border-border/30">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/30">
                              {headers.map((h, hi) => (
                                <th key={hi} className="px-4 py-3 text-left font-medium text-foreground">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/40">
                            {rows.map((row, ri) => (
                              <tr key={ri} className={ri % 2 === 1 ? 'bg-muted/10' : ''}>
                                {row.map((cell, ci) => (
                                  <td key={ci} className="px-4 py-3 text-foreground/70">{renderInlineMarkdown(cell)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                }

                return (
                  <p key={i} className="text-base leading-8">
                    {renderInlineMarkdown(paragraph)}
                  </p>
                );
              })}
            </div>
            {section.cta && (
              <div className="mt-6">
                <ArticleCTA
                  calculatorName={section.cta.calculatorName}
                  text={section.cta.text}
                  path={section.cta.path}
                />
              </div>
            )}
          </section>

          {/* Mobile-only affiliate placement after the 2nd section.
              The sidebar (hidden lg:block) gives desktop users a slot, so
              this block uses block lg:hidden to monetize mobile readers
              without doubling up on desktop. */}
          {slug && sectionIndex === 1 && (
            <div className="block lg:hidden my-8">
              <AffiliatePlacement
                slug={slug}
                zone="inline-mid-article"
                forceFormat="image-banner"
              />
            </div>
          )}

          {/* In-article affiliate placement after every 3rd section */}
          {slug && (sectionIndex + 1) % 3 === 0 && sectionIndex < sections.length - 1 && (
            <div className="my-10">
              <AffiliatePlacement
                slug={slug}
                zone="inline"
                forceFormat="image-banner"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
