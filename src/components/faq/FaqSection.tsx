import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: FaqItem[];
  title?: string;
  description?: string;
  eyebrow?: string;
  /** Render JSON-LD FAQPage schema (default: true) */
  jsonLd?: boolean;
  /** Custom section className for spacing/background overrides */
  className?: string;
  /** Container max width (default: max-w-4xl) */
  maxWidth?: 'max-w-3xl' | 'max-w-4xl' | 'max-w-5xl';
  id?: string;
}

/**
 * Canonical FAQ section. Replaces ~48 ad-hoc *FAQSection.tsx files.
 *
 * Editorial style: bordered card list (no glass / no gradient text),
 * standard rhythm (py-20), max-w-4xl container, accordion items
 * with consistent padding, and optional FAQPage JSON-LD schema.
 */
export const FaqSection = ({
  items,
  title = 'Frequently Asked Questions',
  description,
  eyebrow = 'FAQ',
  jsonLd = true,
  className,
  maxWidth = 'max-w-4xl',
  id,
}: FaqSectionProps) => {
  const schema = jsonLd
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <section id={id} className={cn('py-20 bg-muted/30', className)}>
      <div className={cn('container mx-auto px-6', maxWidth)}>
        <div className="text-center mb-12">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <HelpCircle className="w-4 h-4" />
              {eyebrow}
            </div>
          )}
          <h2 className="text-h2 font-bold mb-4 text-foreground">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
          )}
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card border border-border/50 rounded-xl px-6"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5 text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )}
      </div>
    </section>
  );
};

export default FaqSection;
