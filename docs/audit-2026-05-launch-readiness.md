# Launch Readiness Audit — May 2026

**Scope:** Phase 1 (content-block consistency) + Phase 7 (visual polish + enterprise consistency).
**Mode:** Audit only. No code changes were made in this pass.
**Codebase snapshot:** `src/components` + `src/pages` as of this commit.

---

## 1. Executive summary

The product is structurally close to enterprise-grade — `StepGuide` (45 adopters), `MethodologyBlock`, and the `Accordion` primitive already do most of the heavy lifting. The gap to a true "from one operating system" feel is **token drift, not architecture**. Three patterns account for ~80% of the inconsistency:

1. **Glass-morphism remnants** — `glass-morphism-card` still imported by **121 files**, primarily in calculator panels (`*ResultsPanel`, `*Chart`, `volatility/*`, `tax-calculator/*`, `etf/*`, `cagr/*`). Reads as "crypto dashboard 2023", not "Stripe/Linear 2026".
2. **Gradient text in headings** — `text-gradient-premium` in **49 files**, mostly H2/H3 of content sections. Breaks the editorial calm the new `StepGuide` establishes.
3. **No shared FAQ primitive** — **48 `*FAQSection.tsx` files**, each reimplementing the same Accordion + eyebrow chip + `bg-muted/30` section wrapper. Drift in section padding, max-width, JSON-LD shape, and "ask another question" CTA.

| # | Issue | Severity | Files | Phase |
|---|---|---|---|---|
| 1 | `glass-morphism-card` legacy surface | **P0** | 121 | 7 |
| 2 | `text-gradient-premium` on H2/H3 | **P0** | 49 | 7 |
| 3 | No shared `<FaqSection>` primitive | **P0** | 48 | 1 |
| 4 | No shared `<Callout>` primitive (20+ ad-hoc disclaimers/info/warning) | **P0** | ~25 | 1 |
| 5 | Section `py-*` rhythm (py-12/16/20/24 all in use) | **P1** | 171 | 7 |
| 6 | Container max-width drift (5xl / 6xl / 7xl mixed within same page family) | **P1** | 113 | 7 |
| 7 | `backdrop-blur` used outside header/nav (87 files) | **P1** | 87 | 7 |
| 8 | `bg-gradient-to-*` decorative backgrounds in content sections | **P1** | 42 | 7 |
| 9 | Methodology blocks that bypass `MethodologyBlock` | **P2** | ~6 | 1 |
| 10 | `shadow-*` drift (mostly `shadow-sm`, but `shadow-md/lg/xl/premium/glow/soft` all coexist) | **P2** | — | 7 |

P0 items must ship before launch. P1 lifts the perceived quality from "very good SaaS" to "category-leading". P2 is polish.

---

## 2. Phase 1 — Content block consistency

### 2.1 Family inventory

| Family | Canonical primitive | Adopters | Drifters | Severity |
|---|---|---|---|---|
| Step / How-it-works | `components/step-guide/StepGuide.tsx` | 45 | 0 (just shipped) | done |
| FAQ | **none — needs `<FaqSection>`** | 0 | 48 | **P0** |
| Methodology | `components/calculator/MethodologyBlock.tsx` | ~14 | ~6 | P2 |
| Callout / Disclaimer / Note | **none — needs `<Callout>`** | 0 | ~25 | **P0** |
| Educational `*ContentSections.tsx` | none (long-form copy, intentionally per-page) | n/a | n/a | accept as-is |
| Insight cards (above/below charts) | none (data-driven) | n/a | n/a | secondary |

### 2.2 FAQ drift — the single biggest content-consistency win

48 components implement essentially the same UI. Snapshot of the patterns I found:

| Pattern variant | Where | Notes |
|---|---|---|
| `section py-20 bg-muted/30` + eyebrow chip + `Accordion` + JSON-LD inline | `DrawdownFAQSection`, `ConverterFAQSection`, `RetirementFAQSection`, ~20 others | The de-facto canonical. Use as reference for the new primitive. |
| `section py-16` + no eyebrow + `Accordion` | `LotSizeFAQSection`, `ZakatFAQSection`, several `learn/*` | Reads "lighter" — breaks rhythm. |
| `glass-morphism-card` wrapper around `AccordionItem` | `BitcoinLoanFAQSection`, `LeverageFAQSection`, `LightningFAQSection` | Crypto-dashboard look; clash with the rest. |
| Custom gradient header on the section | `FearGreedFAQSection`, `RainbowFAQSection`, `PowerLawFAQSection` (via parent wrapper) | Loud relative to editorial peers. |
| `HelpCircle` icon vs no icon vs custom emoji | mixed | Inconsistent eyebrow. |
| Inline FAQ JSON-LD via `<script type="application/ld+json">` | most | Good — preserve in primitive. |
| Bilingual EN/TR via `tr ? faqsTr : faqsEn` | universal | Good — preserve in primitive. |

**Recommended primitive (build pass):**

```tsx
// src/components/faq/FaqSection.tsx
<FaqSection
  eyebrow="FAQ"
  title="Frequently asked questions"
  items={items}            // [{ q, a }]
  jsonLd                   // emits FAQPage JSON-LD
  className?               // pages can override section bg if needed
/>
```

Design rules: `section py-20 md:py-24`, `container max-w-4xl`, eyebrow chip (`border border-border/60 rounded-full px-4 py-1.5 text-xs uppercase tracking-wider`), H2 `text-3xl md:text-4xl font-semibold tracking-tight`, `Accordion` with hairline `border-b border-border/50` between items, no glass, no gradient.

### 2.3 Callout drift — currently no primitive at all

Disclaimers, "Important", info notes, warning blocks, and "professional notes" inside `StepGuide` are all reimplemented per file. Variants observed:

- `<div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">` (warning style — at least 6 calculators)
- `<div className="glass-morphism-card p-6 border-l-4 border-primary">` (info — `BitcoinLoanResultsPanel`, `TaxCalculationBreakdown`)
- `<p className="text-xs text-muted-foreground italic">…</p>` (footnote — most calculators)
- `<Alert>` from shadcn (used in `EnhancedErrorDisplay` only)
- Markdown-styled `> blockquote` in `ContentSections`

**Recommended primitive (build pass):**

```tsx
// src/components/callout/Callout.tsx
<Callout variant="info|note|warning|disclaimer" title?={…}>
  body…
</Callout>
```

Design rules: bordered card (`border border-border/60 rounded-xl`), muted icon tile (`size-9 rounded-lg bg-muted text-foreground/70 flex items-center justify-center`), title `text-sm font-medium`, body `text-sm text-muted-foreground leading-relaxed`. **No colored fills**, no `bg-yellow-*/bg-red-*` — variant differs only by icon (`Info`, `BookOpen`, `AlertTriangle`, `ShieldCheck`). The result feels like Linear's note blocks, not crypto-dashboard alerts.

### 2.4 Methodology drift

`MethodologyBlock` is well-adopted. Drifters that should migrate:

- `AboutMethodologySection.tsx` — uses its own card grid (acceptable because it's the About page hero methodology; recommend aligning surface tokens only).
- A handful of calculators embed methodology copy inline inside their own results panel instead of mounting `MethodologyBlock`. List to migrate: `BitcoinLoanResultsPanel`, `TaxCalculationBreakdown`, `EnhancedTaxResultsPanel`, `HalvingProjection`, `PurchasingPowerChart`, `VolatilityPercentileGauge`.

### 2.5 Long-form `*ContentSections.tsx`

These are intentional per-page editorial content and should NOT be collapsed into a primitive. They DO need surface-token normalization in Phase 7 (most still use `glass-morphism-card` and `text-gradient-premium`).

---

## 3. Phase 7 — Visual polish + enterprise consistency

### 3.1 Surface token census

| Token / pattern | Files | Canonical (recommended) | Action |
|---|---|---|---|
| `glass-morphism-card` | **121** | — (remove) | Replace with `bg-card border border-border/60 rounded-xl` |
| `text-gradient-premium` | **49** | — (remove from headings) | Use plain `text-foreground` + `font-semibold tracking-tight`. Keep gradient only on the home hero wordmark. |
| `backdrop-blur*` | **87** | `backdrop-blur` allowed only on sticky header + modal scrims | Strip from inline cards |
| `bg-gradient-to-*` | **42** | — (remove from content cards) | Allowed only on hero / CTA band |
| `rounded-3xl` | 1 | — | Normalize to `rounded-2xl` |
| `rounded-2xl` | 33 | use for hero / feature cards | OK |
| `rounded-xl` | 162 | **default for content cards** | OK |
| `rounded-lg` | 170 | use for inputs / small chips / icon tiles | OK |
| `shadow-sm` | 197 | default card elevation | OK |
| `shadow-md` | 18 | hover state only | tighten usage |
| `shadow-lg` | 38 | modals / popovers only | audit non-modal usage |
| `shadow-xl` / `shadow-premium` / `shadow-glow` / `shadow-soft` | 6 | — (remove) | Replace with `shadow-sm` |
| `max-w-4xl` | (FAQ + methodology canonical) | text-heavy sections | OK |
| `max-w-5xl` | 48 | methodology / step-guide | OK |
| `max-w-6xl` | 56 | calculator pages / dashboards | OK |
| `max-w-7xl` | 9 | — (probably unintended) | Audit; most should be `max-w-6xl` |
| `py-12` | 27 | — (too tight for sections) | Normalize to `py-16 md:py-20` |
| `py-16` | 76 | default section padding | OK |
| `py-20` | 59 | major section padding | OK |
| `py-24` | 9 | hero only | OK |

### 3.2 Glass-morphism hotspots (P0)

Heaviest concentrations of `glass-morphism-card`:

- `volatility/*` — 8 files (`VolatilityLiveDashboard`, `VolatilityHeatmaps`, `VolatilityChart`, `VolatilityCustomCalculator`, `VolatilityComparisonTab`, `VolatilityRollingWindow`, `VolatilityStockComparison`, `VolatilityPercentileGauge`)
- `tax-calculator/*` — 5 files
- `cagr/*` — 4 files
- `etf/*` — 4 files
- `what-if/*` — 4 files
- `inheritance-tax/*` — 2 files
- `transaction-fees/*` — 2 files
- `bitcoin-loan/*` — 4 files
- Loose components: `LiveBitcoinPrice`, `InvestmentChart`, `HistoricalAnalysis`, `BitcoinStorySection`, `ErrorBoundary`, `EnhancedErrorDisplay`, `PurchaseComparison`, `CalculationProgressStages`, `ShareExportPanel`, `RelatedCalculators`

### 3.3 `text-gradient-premium` hotspots (P0)

Concentrated in: `cagr/CAGRContentSections`, `cinematic/HeroLivePriceTicker`, `price-target/PriceTargetMoonPanel`, `hodl/PerformanceMetrics`, `etf/ETFSharesToBTCPanel`, plus most `*ContentSections.tsx` H2s. Remove from every H2/H3. The reference is `StepGuide`'s heading style.

### 3.4 Section padding rhythm

Pick one rhythm and enforce it:

- **Hero sections:** `py-20 md:py-32`
- **Major content sections:** `py-16 md:py-24`
- **Tertiary / FAQ:** `py-16 md:py-20`
- **Compact data bands:** `py-12 md:py-16`

The 27 files using bare `py-12` for full sections should move to `py-16 md:py-20`.

### 3.5 Eyebrow chip standardization

Three styles in the wild:
1. `border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary` (FAQ canonical)
2. `inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground` (StepGuide canonical)
3. `bg-primary/10 rounded-full px-3 py-1 text-xs text-primary` (drift)

Recommend StepGuide's style as the unified eyebrow across FAQ, Methodology, and Callout primitives. Drop the colored chip.

---

## 4. Cross-cutting findings

- **45 components on `StepGuide`, 48 not on a FAQ primitive** — the FAQ migration is the single biggest perceived-consistency win available.
- **`shadow-premium`, `shadow-glow`, `shadow-soft`** appear once each — dead tokens. Remove from `tailwind.config.ts` / `index.css` after migration.
- **`ErrorBoundary` + `EnhancedErrorDisplay`** still use glass-morphism. These render on failure paths — high-trust-impact surfaces. Migrate early.
- **`LiveBitcoinPrice`** uses glass-morphism on the home hero ticker. High visibility. Migrate early.
- **`CalculationProgressStages`** uses glass-morphism for the loading skeleton — appears mid-flow on every calculator. Migrate early.
- **No semantic separation** between "presentational disclaimer" and "regulatory disclaimer". The `Callout` variant `disclaimer` should be paired with a footer-level `RegulatoryDisclaimer` for KVKK / financial-advice copy.

---

## 5. Proposed canonical primitives (for the follow-up build pass)

Two new files, both mirroring the `StepGuide` pattern that's already in place:

### `src/components/faq/FaqSection.tsx`
- Props: `eyebrow?`, `title`, `description?`, `items: { q; a }[]`, `jsonLd?: boolean` (default true), `id?`, `className?`
- Renders: eyebrow chip → H2 → optional description → bordered `Accordion` → optional JSON-LD `<script>`
- EN/TR labels via existing `useLanguage` hook
- Replaces 48 files

### `src/components/callout/Callout.tsx`
- Props: `variant: 'info' | 'note' | 'warning' | 'disclaimer'`, `title?`, `children`, `icon?` override
- Renders: icon tile + title + body, hairline border, no fill
- Replaces 25+ ad-hoc disclaimers and warning blocks
- Companion `RegulatoryDisclaimer` re-exports the `disclaimer` variant with the canonical KVKK/financial copy

### Surface token map
- `docs/surface-tokens.md` documenting which token to use where (card, eyebrow, heading, divider, shadow, padding, max-width) so future components have one place to copy from
- One-page; lives next to this audit

---

## 6. Severity-ranked fix list (for the build pass)

### P0 — Ship before launch
1. Create `<FaqSection>` primitive; migrate all 48 `*FAQSection.tsx` files in batches of ~10
2. Create `<Callout>` primitive; migrate the ~25 ad-hoc disclaimer/info/warning blocks
3. Remove `glass-morphism-card` from all 121 files; replace with `bg-card border border-border/60 rounded-xl` (or `rounded-2xl` for hero-tier cards)
4. Strip `text-gradient-premium` from all 49 H2/H3 occurrences; keep on home hero wordmark only
5. Migrate `ErrorBoundary`, `EnhancedErrorDisplay`, `LiveBitcoinPrice`, `CalculationProgressStages` first (highest visibility)

### P1 — Lift to category-leading
6. Strip `backdrop-blur` outside sticky header + modal scrims (~80 files)
7. Strip decorative `bg-gradient-to-*` from content cards; keep on hero + CTA bands (~35 files)
8. Normalize section padding to the rhythm in §3.4 (27 `py-12` → `py-16 md:py-20`)
9. Audit 9 `max-w-7xl` usages — most should be `max-w-6xl`
10. Unify eyebrow chip to StepGuide style across FAQ, Methodology, Callout

### P2 — Polish
11. Migrate the 6 calculators with inline methodology copy to `MethodologyBlock`
12. Replace `shadow-md/lg/xl/premium/glow/soft` outside modals/popovers with `shadow-sm`
13. Delete unused shadow tokens from `tailwind.config.ts`
14. Normalize the single `rounded-3xl` to `rounded-2xl`
15. Audit divider patterns (`border-b border-border/50` vs `divide-*`) — pick one per family

Estimated effort (build pass): ~3–4 focused sessions. P0 is the bulk (~2 sessions). P1 + P2 can ship in batched migrations after launch.

---

## 7. Secondary-phase appendix

Not actioned this sprint, but tracked so nothing is lost.

**Phase 2 — Layout rhythm.** Container max-width drift (max-w-4xl/5xl/6xl/7xl all in active use); same page family sometimes mixes them. Recommend a `<Section>` wrapper that takes `width="text|content|wide"` and maps to `max-w-4xl|5xl|6xl`. Top-3 offenders: `OptimizedAbout`, `BitcoinInflationDashboard`, `BitcoinFearGreedIndex`.

**Phase 3 — Typography.** H1/H2/H3 sizes drift between pages (e.g., `text-3xl md:text-5xl` vs `text-4xl md:text-6xl` for the same role). Define a 4-tier type ramp (display, h1, h2, h3) as Tailwind utilities; enforce via lint. Body line-length often exceeds 75ch in content sections — cap with `max-w-prose`.

**Phase 4 — Semantic SEO + AI/GEO.** FAQ JSON-LD is good and the new primitive preserves it. Gaps: `Article` JSON-LD missing from `learn/*` posts; `BreadcrumbList` missing entirely; `Calculator` / `SoftwareApplication` schema absent on calculator pages. Entity-richness in FAQ answers is strong (concrete numbers + dates) but calculator H1/H2 are generic — rewrite with target entities ("Bitcoin DCA Calculator with halving-cycle weighting" not "DCA Calculator").

**Phase 5 — Charts + analytics.** Chart token file exists (`calculator/chartTokens.ts`) but adoption is partial; many charts still inline colors. Axis label sizes drift (`text-xs` vs `text-sm`); tooltip styles drift (`glass-morphism-card` vs `bg-popover`). Unify to a single `<ChartShell>` wrapper.

**Phase 6 — Calculator UX.** Result panels each invent their own hierarchy. The strongest pattern is `tax-calculator/EnhancedTaxResultsPanel` — promote to reference. Insight cards above the chart should follow one rule: headline number, delta, one-line context. Today some show 5+ metrics with no hierarchy.

**Phase 8 — Trust + brand perception.** Strong signals already: methodology + sources, dated last-reviewed, professional reviewer, regulatory disclaimer pattern. Weak signals: ad-hoc warning colors (yellow/red) make the product look "alerty"; gradient text reads as "marketing site" not "institutional tool"; glass-morphism reads as "crypto dashboard". P0 fixes resolve this.

**Phase 9 — Luxury refinement.** After P0 + P1 land, do one pass to: (a) reduce border weight by 1 step in dense areas, (b) increase `tracking-tight` on all H1/H2, (c) replace any remaining emoji icons with Lucide, (d) audit hover states — most cards should `hover:border-border` (no shadow change) rather than `hover:shadow-md`.

---

## Approval flow

Review this report. When ready, tell me which P0/P1 items to ship and I'll execute in a focused build pass starting with the `FaqSection` + `Callout` primitives, then migrating the highest-visibility glass-morphism surfaces (`LiveBitcoinPrice`, `ErrorBoundary`, `CalculationProgressStages`) before the long tail.
