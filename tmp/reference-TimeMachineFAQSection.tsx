import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqItems = [
  { q: "How far back can I go?", a: "You can look up any date since Bitcoin's first exchange trade in July 2010. Prices before that are unreliable because Bitcoin did not have a consistent market price." },
  { q: "Where does the price data come from?", a: "Historical prices are fetched from live market data when available and fall back to the local Bitcoin price dataset when an API is rate-limited or offline." },
  { q: "Does this account for fees and taxes?", a: "No. The calculation shows gross returns before exchange fees, withdrawal costs, or capital gains taxes. Use the tax calculator for after-tax planning." },
  { q: "What does this tool prove?", a: "It shows that timing matters, but time in market often matters more. Past performance does not guarantee future results, so treat every result as educational, not financial advice." },
  { q: "Why do some preset dates show huge returns?", a: "Bitcoin was worth fractions of a cent to a few dollars in its early years. Small historical investments can convert into very large current values because the calculator multiplies the BTC amount by today's live price." },
  { q: "Can I calculate Bitcoin's value by year?", a: "Yes. Enter any year from 2010 to today and the Bitcoin time machine shows the historical price, estimated BTC purchased, current value, profit, and ROI." },
  { q: "How do I share a historical Bitcoin milestone?", a: "Each row in the famous historical prices table has a crawlable anchor link. Copy the row URL to share a specific event like Pizza Day, the COVID crash, the 2021 ATH, or the 2024 halving." },
];

export const TimeMachineFAQSection = () => (
  <section id="time-machine-faq" className="py-20 bg-muted/30" aria-labelledby="time-machine-faq-heading">
    <div className="container mx-auto px-6 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
          <HelpCircle className="w-4 h-4" /> FAQ
        </div>
        <h2 id="time-machine-faq-heading" className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">Frequently Asked Questions</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Answers about historical Bitcoin prices, live conversion, sharing milestones, and calculator accuracy.</p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {faqItems.map((item, index) => (
          <AccordionItem key={item.q} value={`faq-${index}`} className="bg-card border border-border/50 rounded-xl px-6">
            <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5 text-base">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
