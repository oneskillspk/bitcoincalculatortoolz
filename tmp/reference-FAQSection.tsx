import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "What is Bitcoin Calculator Tools?",
    answer: "Bitcoin Calculator Tools is a free suite of 45+ professional-grade financial tools designed for smart Bitcoin investors, long-term planners, and anyone curious about cryptocurrency. From basic profit calculators to advanced tools like the Rainbow Chart, everything runs in your browser with no signup needed."
  },
  {
    question: "Why do I need special calculators for Bitcoin?",
    answer: "Standard calculators fail to account for Bitcoin's unique volatility, leading to inaccurate analysis. Our tools are built to model these market factors for a more relevant investment strategy."
  },
  {
    question: "Which calculator should I start with?",
    answer: "If you're new, start with the Bitcoin What If Calculator to see how past investments would have performed. For regular investing, try the DCA Calculator. For long-term planning, use the Retirement Calculator."
  },
  {
    question: "What tools do you offer for market analysis?",
    answer: "We offer a Bitcoin Power Law Calculator for long-term trend analysis, a Drawdown Calculator to understand historical crashes, and an Asset Comparison tool to compare Bitcoin's performance against stocks, gold, and other assets."
  },
  {
    question: "Do you have tools for Bitcoin mining and Lightning Network?",
    answer: "Yes! Our Mining Profitability Calculator helps you estimate mining returns based on hash rate, electricity costs, and current difficulty. Our Lightning Network Fee Calculator helps you understand routing fees and channel economics."
  },
  {
    question: "How accurate and secure are these tools?",
    answer: "Our tools use real-time data from the CoinGecko API for accuracy and run fully in your browser for security. No personal financial data is ever collected, tracked, or stored."
  },
  {
    question: "Can I compare investment strategies like DCA vs. Lump Sum?",
    answer: "Absolutely! Our Lump Sum vs. DCA Comparison Tool lets you compare the historical performance of investing a lump sum versus dollar-cost averaging over any time period since 2013."
  },
  {
    question: "Is this suite of tools completely free to use?",
    answer: "Yes, our entire suite of tools is 100% free to use, with no hidden fees or subscriptions. Our mission is to make powerful financial tools accessible to the entire Bitcoin community."
  }
];

export const FAQSection = () => {
  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-muted/30 relative overflow-hidden"
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-primary mb-4 sm:mb-6">
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            FAQ
          </div>
          <h2 id="faq-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground tracking-tight px-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            Get quick answers about our Bitcoin calculation tools and how they can help optimize your investment strategy.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border/50 rounded-xl px-4 sm:px-6 hover:border-primary/20 transition-all duration-300"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-4 sm:py-5 text-sm sm:text-base min-h-[56px]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 sm:pb-5 text-[13px] sm:text-sm leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
