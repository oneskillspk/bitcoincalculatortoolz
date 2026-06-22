import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";
import { REGION_META, type RegionId } from "./regionMeta";

interface Props {
  region: RegionId;
  isTr: boolean;
}

/**
 * Accordion FAQ + FAQPage JSON-LD emitter. Matches the shadcn Accordion
 * styling used by DCA/Retirement pages.
 */
export const TaxAccordionFAQ = ({ region, isTr }: Props) => {
  const items = REGION_META[region].faq;
  const pick = <T,>(o: { en: T; tr: T }): T => (isTr ? o.tr : o.en);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: isTr ? "tr" : "en",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: pick(f.q),
      acceptedAnswer: { "@type": "Answer", text: pick(f.a) },
    })),
  };

  return (
    <section
      aria-labelledby="tax-faq-heading"
      className="container mx-auto max-w-3xl px-6 py-12"
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <h2
        id="tax-faq-heading"
        className="text-2xl md:text-3xl font-semibold text-foreground mb-6 text-center"
      >
        {isTr ? "Sıkça Sorulan Sorular" : "Frequently Asked Questions"}
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {items.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-base font-medium">
              {pick(f.q)}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {pick(f.a)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default TaxAccordionFAQ;
