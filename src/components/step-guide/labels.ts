export const stepGuideLabels = {
  en: {
    eyebrow: "How It Works",
    step: "Step",
  },
  tr: {
    eyebrow: "Nasıl Çalışır",
    step: "Adım",
  },
} as const;

export type StepGuideLocale = keyof typeof stepGuideLabels;
