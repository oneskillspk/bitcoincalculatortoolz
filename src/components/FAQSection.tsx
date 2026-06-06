import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollScene } from "@/components/cinematic/ScrollScene";

const FAQ_KEYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const FAQSection = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const autoOpenedRef = useRef(false);

  // Open the first FAQ automatically the first time the section scrolls into view.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || autoOpenedRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !autoOpenedRef.current) {
            autoOpenedRef.current = true;
            setOpenIndex(0);
            io.disconnect();
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const focusItem = (idx: number) => {
    const btn = buttonRefs.current[idx];
    if (btn) btn.focus();
  };

  const openAndScroll = (idx: number) => {
    if (idx < 0 || idx >= FAQ_KEYS.length) return;
    setOpenIndex(idx);
    requestAnimationFrame(() => {
      const btn = buttonRefs.current[idx];
      if (btn) {
        btn.scrollIntoView({ behavior: "smooth", block: "center" });
        btn.focus({ preventScroll: true });
      }
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusItem(Math.min(idx + 1, FAQ_KEYS.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        focusItem(Math.max(idx - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        focusItem(0);
        break;
      case "End":
        e.preventDefault();
        focusItem(FAQ_KEYS.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        setOpenIndex(openIndex === idx ? null : idx);
        break;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-labelledby="faq-heading"
      className="relative overflow-hidden bg-background section-y-lg"
    >
      <div className="container mx-auto px-5 sm:px-8">
        {/* Centered editorial intro */}
        <ScrollScene reveal="fade-up" className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
            {t('faq.badge')}
          </span>
          <h2
            id="faq-heading"
            className="mt-4 font-editorial font-light text-balance text-foreground text-[1.875rem] leading-[1.12] tracking-[-0.01em] sm:text-[2.25rem] md:text-[2.75rem]"
          >
            {t('faq.title')}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {t('faq.subtitle')}
          </p>
        </ScrollScene>

        {/* FAQ panel */}
        <ScrollScene
          reveal="fade-up"
          className="mx-auto mt-12 sm:mt-16 max-w-3xl"
        >
          <div
            role="list"
            className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_hsl(var(--foreground)/0.04),0_24px_60px_-32px_hsl(var(--foreground)/0.12)]"
          >
            <div className="divide-y divide-border/40">
              {FAQ_KEYS.map((i, idx) => {
                const isOpen = openIndex === idx;
                const isLast = idx === FAQ_KEYS.length - 1;
                const num = String(idx + 1).padStart(2, '0');
                return (
                  <div
                    key={i}
                    role="listitem"
                    className={`group transition-shadow duration-300 ${isOpen ? 'ring-1 ring-inset ring-primary/20' : ''}`}
                  >
                    <button
                      ref={(el) => { buttonRefs.current[idx] = el; }}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${idx}`}
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className={`flex w-full items-center justify-between gap-6 px-6 py-5 sm:px-8 sm:py-6 text-left transition-colors duration-200 hover:bg-muted/40 focus-visible:outline-none focus-visible:bg-muted/40 ${isOpen ? 'bg-muted/30' : ''}`}
                    >
                      <div className="flex items-baseline gap-4 sm:gap-5 min-w-0">
                        <span className="font-mono text-[11px] tracking-[0.18em] text-foreground/40 shrink-0">
                          {num}
                        </span>
                        <h3
                          className={`font-editorial tracking-editorial text-[15px] sm:text-[17px] leading-snug transition-colors ${isOpen ? 'text-primary' : 'text-foreground'}`}
                        >
                          {t(`faq.q${i}`)}
                        </h3>
                      </div>
                      {/* Animated + / × indicator */}
                      <span
                        aria-hidden
                        className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center"
                      >
                        <span
                          className={`absolute h-px w-3 transition-colors duration-300 ${isOpen ? 'bg-primary' : 'bg-foreground'}`}
                        />
                        <span
                          className={`absolute h-3 w-px transition-all duration-300 ${isOpen ? 'rotate-90 bg-primary' : 'bg-foreground'}`}
                        />
                      </span>
                    </button>
                    {/* Animated panel */}
                    <div
                      id={`faq-panel-${idx}`}
                      role="region"
                      {...(!isOpen && { inert: '' as unknown as boolean })}
                      className={`grid overflow-hidden transition-[grid-template-rows,opacity] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                      style={{ transitionDuration: '420ms', transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
                    >
                      <div className="min-h-0">
                        <div className="px-6 pb-6 pl-[2.75rem] sm:pl-[3.75rem] sm:px-8 sm:pb-7">
                          <p className="max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground sm:text-[14.5px]">
                            {t(`faq.a${i}`)}
                          </p>
                          {!isLast && (
                            <div className="mt-5 flex items-center">
                              <button
                                type="button"
                                onClick={() => openAndScroll(idx + 1)}
                                className="group/next inline-flex items-center gap-2 rounded-full bg-muted/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/80 transition-all duration-200 hover:bg-muted/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:text-primary"
                              >

                                <span>{t('faq.next')}</span>
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  aria-hidden
                                  className="transition-transform duration-200 group-hover/next:translate-x-0.5 group-focus-visible/next:rotate-45"
                                >
                                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollScene>
      </div>
    </section>
  );
};
