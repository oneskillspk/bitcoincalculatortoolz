/**
 * Unified centered section header for the Bitcoin Lot Size Calculator page.
 * Mirrors src/components/lumpsum-dca/SectionHeader.tsx so every content
 * section on the page shares the same editorial rhythm:
 * centered eyebrow pill → H2 → muted lede.
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
    <h2
      id={id}
      className="text-h2 font-semibold text-foreground max-w-3xl mx-auto [text-wrap:balance] break-words"
    >
      {title}
    </h2>
    {lead && (
      <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
        {lead}
      </p>
    )}
  </header>
);

export default SectionHeader;
