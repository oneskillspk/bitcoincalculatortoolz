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
  /** Header alignment. Defaults to "left"; use "center" on pages whose other sections are centered. */
  align?: "left" | "center";
  /** Optional id for in-page anchoring. */
  id?: string;
  className?: string;
}
