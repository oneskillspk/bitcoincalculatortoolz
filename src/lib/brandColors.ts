/**
 * Brand colors mirrored as raw hex for non-CSS rendering contexts
 * (PDF/canvas/PNG exports via html2canvas where CSS variables don't resolve).
 *
 * Keep these in sync with the editorial paper/ink/ember tokens in
 * `src/index.css` (see :root). Do NOT use these in regular React components —
 * always prefer `hsl(var(--token))` for runtime UI.
 */
export const brand = {
  paper: "#f5f3ee",
  paperSoft: "#f9f6ef",
  surfaceWarm: "#ece7dd",
  ink: "#1a1a1a",
  inkSoft: "rgba(26,26,26,0.72)",
  inkMuted: "rgba(26,26,26,0.66)",
  inkFaint: "rgba(26,26,26,0.18)",
  border: "#e5e1d8",
  ember: "#e85d3a",
  /* Text-safe ember: 4.9:1 on paper (#f5f3ee) and card (#fff9f2) surfaces,
     so small-bold eyebrow labels clear WCAG AA 4.5:1. */
  emberDeep: "#c04426",
  success: "#0a8a5a",
  successSoft: "#e8f5ee",
  danger: "#a8341d",
  dangerSoft: "#fbeae5",
  bitcoin: "#f7931a",
} as const;

export type BrandColor = keyof typeof brand;
