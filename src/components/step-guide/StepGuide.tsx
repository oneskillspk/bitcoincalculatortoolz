import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { stepGuideLabels } from "./labels";
import type { StepGuideProps } from "./types";

/**
 * Unified "How It Works" / step-guide primitive.
 * Editorial Stripe/Linear-grade rhythm — no glass cards, no gradient text,
 * no animated blobs. Use this for every process/steps/how-it-works surface.
 */
export const StepGuide = ({
  eyebrow,
  title,
  lead,
  steps,
  note,
  columns,
  id,
  className,
}: StepGuideProps) => {
  const { language } = useLanguage();
  const locale = language === "tr" ? "tr" : "en";
  const labels = stepGuideLabels[locale];
  const cols = columns ?? (steps.length === 3 ? 3 : 4);
  const gridCols = cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <section
      id={id}
      className={cn("py-20 md:py-24", className)}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <header className="mb-14 text-left">
          <div className="flex justify-start">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow ?? labels.eyebrow}
            </span>
          </div>
          <h2 className="mt-5 text-h2 font-semibold text-foreground">
            {title}
          </h2>
          {lead && (
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {lead}
            </p>
          )}
        </header>

        <ol
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/50 rounded-xl overflow-hidden border border-border/60",
            gridCols,
          )}
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            const num = String(i + 1).padStart(2, "0");
            return (
              <li
                key={i}
                className="group flex flex-col gap-4 bg-card p-6 md:p-7 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  {Icon ? (
                    <span className="w-10 h-10 rounded-md border border-border/60 bg-muted/40 flex items-center justify-center">
                      <Icon className="w-[18px] h-[18px] text-foreground/70" strokeWidth={1.75} />
                    </span>
                  ) : (
                    <span className="w-10 h-10" aria-hidden />
                  )}
                  <span
                    className="text-xs font-medium text-muted-foreground tabular-nums tracking-[0.15em]"
                    aria-label={`${labels.step} ${i + 1}`}
                  >
                    {num}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-[15px] font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {note && (
          <aside className="mt-10 flex items-start gap-4 rounded-xl border border-border/60 bg-muted/30 p-5 md:p-6">
            {note.icon && (
              <span className="shrink-0 w-9 h-9 rounded-md border border-border/60 bg-card flex items-center justify-center">
                <note.icon className="w-[16px] h-[16px] text-foreground/70" strokeWidth={1.75} />
              </span>
            )}
            <div className="space-y-1">
              {note.title && (
                <h3 className="text-sm font-semibold text-foreground">{note.title}</h3>
              )}
              <p className="text-sm leading-relaxed text-muted-foreground">{note.body}</p>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
};
