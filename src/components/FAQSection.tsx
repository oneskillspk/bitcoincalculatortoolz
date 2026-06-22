import { useRef, useState, type KeyboardEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollScene } from "@/components/cinematic/ScrollScene";

const FAQ_KEYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const FAQSection = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  // First FAQ is open on mount — avoids "all collapsed" flash and removes IO timing race.

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
      className="relative overflow-hidden bg-background py-10 md:py-14 border-t border-border/60"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Section header */}
          <ScrollScene reveal="fade-up" className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="eyebrow eyebrow--primary mb-3">
                {t('faq.badge')}
              </div>
              <h2
                id="faq-heading"
                className="font-display font-semibold text-foreground text-3xl md:text-4xl lg:text-[2.5rem] tracking-[-0.028em] leading-[1.05]"
              >
                {t('faq.title')}
              </h2>
              <p className="lede max-w-prose mt-3">
                {t('faq.subtitle')}
              </p>

              {/* Companion card — fills empty right column at lg */}
              <div className="mt-8 hidden lg:block rounded-xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground mb-2">
                  Still curious?
                </div>
                <p className="text-[14px] leading-relaxed text-foreground/85 mb-4">
                  Jump straight into the tools — every calculator is free, no signup, no fees.
                </p>
                <a
                  href="/calculators"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:opacity-80 transition-opacity"
                >
                  <span>Browse all 49+ tools</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </ScrollScene>

          {/* Instrument Panel FAQ card */}
          <ScrollScene reveal="fade-up" className="lg:col-span-8">
            <div
              role="list"
              className="bg-card border border-border/70 rounded-xl shadow-[var(--shadow-card)] overflow-hidden divide-y divide-border/60"
            >
              {FAQ_KEYS.map((i, idx) => {
                const isOpen = openIndex === idx;
                const isLast = idx === FAQ_KEYS.length - 1;
                const num = String(idx + 1).padStart(2, '0');
                return (
                  <div key={i} role="listitem" className="group">
                    <button
                      ref={(el) => { buttonRefs.current[idx] = el; }}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${idx}`}
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className={`flex w-full items-center justify-between gap-4 px-4 sm:px-5 py-4 sm:py-5 text-left transition-colors duration-200 min-h-[56px] hover:bg-background/40 focus-visible:outline-none focus-visible:bg-background/40 ${isOpen ? 'bg-background/40' : ''}`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground shrink-0">
                          FAQ-{num}
                        </span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${isOpen ? 'bg-primary ip-anim-breathe' : 'bg-border'}`}
                          aria-hidden
                        />
                        <h3
                          className={`font-semibold text-[14.5px] sm:text-[15.5px] leading-snug tracking-[-0.01em] transition-colors ${isOpen ? 'text-foreground' : 'text-foreground/90'}`}
                        >
                          {t(`faq.q${i}`)}
                        </h3>
                      </div>
                      <span
                        aria-hidden
                        className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center"
                      >
                        <span className={`absolute h-px w-3 transition-colors duration-300 ${isOpen ? 'bg-primary' : 'bg-foreground/70'}`} />
                        <span className={`absolute h-3 w-px transition-all duration-300 ${isOpen ? 'rotate-90 bg-primary' : 'bg-foreground/70'}`} />
                      </span>
                    </button>

                    <div
                      id={`faq-panel-${idx}`}
                      role="region"
                      {...(!isOpen && { inert: '' as unknown as boolean })}
                      className={`grid overflow-hidden transition-[grid-template-rows,opacity] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                      style={{ transitionDuration: '420ms', transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
                    >
                      <div className="min-h-0">
                        <div className="px-4 sm:px-5 pb-5 pl-[4.5rem] sm:pl-[5.5rem] bg-background/20 border-t border-border/40">
                          <p className="max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground sm:text-[14px] pt-4">
                            {t(`faq.a${i}`)}
                          </p>
                          {!isLast && (
                            <div className="mt-4 flex items-center">
                              <button
                                type="button"
                                onClick={() => openAndScroll(idx + 1)}
                                className="group/next inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:text-primary min-h-[36px]"
                              >
                                <span>{t('faq.next')}</span>
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  aria-hidden
                                  className="transition-transform duration-200 group-hover/next:translate-x-0.5"
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
          </ScrollScene>
        </div>
      </div>
    </section>
  );
};
