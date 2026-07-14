/**
 * Unified section header for the What If calculator page.
 * Mirrors src/components/retirement/SectionHeader.tsx — centered eyebrow pill
 * + centered H2 + optional centered lead. Kept as a per-calculator copy per
 * docs/CALCULATOR_TEMPLATE_SPEC.md Section 0 (shared-primitive changes are
 * their own phase).
 */
interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  id?: string;
  className?: string;
}

export const SectionHeader = ({ eyebrow, title, lead, id, className = "" }: SectionHeaderProps) => (
  <header className={`text-center mb-10 md:mb-12 ${className}`}>
    {eyebrow && (
      <span className="inline-flex items-center px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-5">
        {eyebrow}
      </span>
    )}
    <h2 id={id} className="text-h2 font-semibold text-foreground">
      {title}
    </h2>
    {lead && (
      <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        {lead}
      </p>
    )}
  </header>
);
