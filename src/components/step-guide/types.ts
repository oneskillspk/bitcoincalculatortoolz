import type { LucideIcon } from "lucide-react";

export interface StepGuideStep {
  icon?: LucideIcon;
  title: string;
  description: string;
}

export interface StepGuideNote {
  icon?: LucideIcon;
  title?: string;
  body: string;
}

export interface StepGuideProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  steps: StepGuideStep[];
  note?: StepGuideNote;
  /** Grid columns on lg+. Defaults based on step count (3 or 4). */
  columns?: 3 | 4;
  /** Optional id for in-page anchoring. */
  id?: string;
  className?: string;
}
