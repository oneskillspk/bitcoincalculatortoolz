import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const learnFaqs = [
  { question: "What topics does the Bitcoin Learning Hub cover?", answer: "Our learning hub covers Bitcoin investing strategies (DCA, lump sum), market analysis (Fear & Greed Index, Bitcoin vs traditional assets), mining profitability, tax implications, Bitcoin basics (satoshis, halving), and retirement planning with Bitcoin." },
  { question: "Are these articles written by financial advisors?", answer: "Our articles are educational content created by Bitcoin analysts and researchers. They are not financial advice. Always consult a qualified financial advisor before making investment decisions." },
  { question: "How often is the content updated?", answer: "We regularly update our articles to reflect the latest market data, regulatory changes, and Bitcoin network updates. Each article displays its last updated date." },
  { question: "Can I use the calculators mentioned in the articles?", answer: "Yes! Every article links directly to the relevant free calculator tools on our site. These interactive tools let you model scenarios discussed in the articles with your own numbers." },
  { question: "Is this content free to access?", answer: "Yes, all articles and calculators on Bitcoin Calculator Tools are completely free to use. No account or subscription required." },
];

export const LearnFAQSection = () => (
  <section className="py-20 bg-muted/30">
    <div className="container mx-auto px-6 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
          <HelpCircle className="w-4 h-4" />
          FAQ
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Common questions about the Bitcoin Learning Hub
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {learnFaqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`} className="bg-card border border-border/50 rounded-xl px-6">
            <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5 text-base">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
