# Calculator Page Template Specification

> Source of truth for redesigning the remaining 44 calculators. Each calculator gets its own phase-by-phase pass mirroring the Bitcoin Retirement Calculator rebuild. This spec is the brief: every pass must satisfy every checklist below before it's considered template-ready.

---

## 0. Scope rule

One calculator per pass. Scope is locked to:
- `src/pages/<CalculatorName>.tsx`
- `src/components/<calculator-folder>/*`

Never touch global `index.css` tokens, other calculator pages, or shared primitives during a pass. If a shared primitive needs to change, that's its own separate phase.

---

## 1. Visual zone architecture (PageSection)

Every calculator page below the hero/calculator grid is composed of `<PageSection>` zones from `src/components/calculator/PageSection.tsx`. No ad-hoc `<section>` wrappers in page bodies.

### Required zones (in order)

| Zone | Purpose | Props |
| --- | --- | --- |
| 1. Hero + calculator grid | Inputs + results. **Not** wrapped in `PageSection`. | — |
| 2. By the Numbers | Data tables, scenarios. | `tone="subtle" width="wide" spacing="default" eyebrow="By the Numbers"` |
| 3. How It Works | Editorial: SEO H2, content sections, methodology primers. | `tone="default" width="wide" spacing="loose" eyebrow="How It Works"` |
| (Affiliate placement) | Sits **outside** any zone, unchanged. | — |
| 4. Questions & Sources | FAQ, methodology, related calculators, disclaimer. | `tone="dark" width="wide" spacing="loose" eyebrow="Questions & Sources"` |

### Preset vocabulary (fixed — do not invent new values)

- **tone**: `default` (background) · `subtle` (muted) · `dark` (secondary)
- **width**: `wide` (`max-w-6xl`) · `prose` (`max-w-3xl`)
- **spacing**: `tight` (`py-12`) · `default` (`py-16 md:py-20`) · `loose` (`py-20 md:py-28`)

### Dark-zone contrast rule

Any child rendered inside `tone="dark"` must use semantic foreground tokens (`text-foreground`, `text-muted-foreground`, `text-secondary-foreground`) — **never** hardcoded light-bg-only colors (`text-gray-900`, `text-black`, `bg-white`). Flag and fix offenders during the pass; do not silently paper over them.

---

## 2. Content redundancy audit

Before redesigning, delete duplicate content. Default rule: **one canonical asset per concept per page.**

Per-pass checklist:
- [ ] Identify every table, chart, and editorial block that conveys the same idea. Keep the strongest one; delete the rest including headings, lead-ins, orphan imports, and unused component files.
- [ ] Remove TR-only end-of-page duplicate blocks that re-state content already shown above (a recurring pattern in the legacy pages).
- [ ] Add at most one new comparison asset if the page genuinely lacks a head-to-head framing (e.g. "Bitcoin Retirement vs. 60/40 Portfolio"). Mark illustrative figures clearly, matching the existing `MethodologyBlock` disclaimer tone.

---

## 3. Input panel rules

All input panels use `src/components/calculator/InputPanel.tsx`. No bespoke shells.

### 3a. Slider ↔ input parity (the fixed pattern)

For every numeric input that has both a slider and a typed input:

1. **Slider `max` must match the realistic upper bound of the input field**, not an arbitrary low number. Audit every slider for clipped ranges (the retirement pass found three: BTC holdings 10→50, monthly DCA 5000→10000, growth rate 30→50).
2. Slider and input are bound to the same state. Typing past the slider `max` is allowed; the slider clamps visually but the value persists.
3. Step values are sensible for the range (no 1-step sliders on 0–100000 ranges).
4. Each control has a label, units, and — where it materially helps — a one-line muted microcopy under the control using `calc-text-small text-muted-foreground`.

### 3b. Mode-aware empty states

When a panel has multiple tabs/modes, each tab's empty-state icon background must be **tinted to match the mode**, not a single shared accent:

- Primary/default mode → `bg-primary/10 text-primary`
- Secondary/planning mode → `bg-blue-soft text-blue-accent` (fallback: `bg-[hsl(var(--blue-accent)/0.1)] text-[hsl(var(--blue-accent))]`)
- High-intensity / advanced mode → `bg-warning/10 text-warning`

### 3c. Localization

Every user-visible string (including mode names rendered in results) must go through the locale layer. **Never** rely on `className="capitalize"` over a raw mode key — build a `{forecaster|planner|fire: {en, tr}}` map and look up.

---

## 4. Results panel rules

All result panels use `src/components/calculator/ResultPanel.tsx`.

### Honest progress metric (the fixed pattern)

Any "% to goal" or progress indicator MUST be the literal ratio of current state to target:

```ts
const progress = Math.min(100, (currentValue / targetValue) * 100);
```

Forbidden:
- Multiplying by arbitrary constants (e.g. `* 0.1`) to make early progress feel "smoother".
- Comparing against a benchmark other than the user's actual stated target.
- Showing a number whose tooltip can't be written as one honest sentence.

Each progress metric needs:
- A heading naming both sides of the ratio (e.g. "Current Holdings vs. Target", TR "Mevcut Varlık vs. Hedef").
- A tooltip that literally describes the formula in plain language, EN + TR.
- A sanity test case documented in the pass notes (inputs → expected %).

---

## 5. Mobile parity

Every data table renders a stacked card UI under `sm:` and switches to a table at `sm` and above. Mobile cards across all tables on a page must be visually identical:

- Container: `rounded-xl border border-border/50 bg-card p-5 shadow-sm`
- Header: `SectionHeader` eyebrow — `text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4`
- Rows: semantic `<dl>` with `divide-y divide-border/40` and `py-3` per row
- Labels: `text-xs text-muted-foreground`
- Values: `text-sm font-mono tabular-nums`
- All tables on the same page flip at the **same** Tailwind breakpoint (`sm:hidden` / `hidden sm:block`). No mixed breakpoints.
- Tooltip triggers carry `aria-label` or visible text.
- No horizontal page overflow at 375px width.

Covered by `e2e/retirement-mobile-audit.spec.ts` — replicate that test file structure per calculator.

---

## 6. SEO & i18n parity

Per-pass checklist:
- [ ] Canonical URL provided (inline in page or delegated to the calculator's `*SEOHead` component). If delegated, add the page to `NO_CANONICAL_OK` in `scripts/audit-schema.mjs` with a one-line comment.
- [ ] FAQ JSON-LD item count is identical EN vs TR. Visible FAQ list count matches the schema count. Both locales tested.
- [ ] All internal links use `useLocalizedHref` — never hardcode `/calculators/...` paths in components that render on TR routes.

---

## 7. Contextual internal links

Add **up to 3** "Read our full guide…" callouts per calculator, only where topically defensible. Reuse the existing callout component pattern; route via `useLocalizedHref`. If a candidate link doesn't fit the surrounding paragraph's intent, skip it rather than force it.

---

## 8. Phase-by-phase execution template

Every calculator pass ships in this exact sequence. One phase = one message. Wait for verification between phases.

| Phase | Goal | Revertible? |
| --- | --- | --- |
| 1 | Shared primitive prep (usually none — `PageSection` already exists). | yes |
| 2 | Wrap post-calculator sections into the 4 zones. No copy or logic edits. | no — overlaps with 3, 5 |
| 3 | Kill content redundancy. Delete duplicates, add at most one new comparison. | no |
| 4 | Confirmed bugs (sliders, mode labels, FAQ parity, etc). Report before/after per bug. | yes |
| 5 | Input panel polish (microcopy, tinted empty states, slider parity). | no |
| 6 | Results panel: honest progress metric + sanity test. | yes |
| 7 | Up to 3 contextual internal links via `useLocalizedHref`. | yes |
| 8 | Final QA pass EN + TR. Confirm every checklist in this spec. | — |

Phases 2, 3, 5 touch overlapping JSX — keep them strictly sequential. Phases 1, 4, 6, 7 are independently revertible.

---

## 9. Final QA checklist (Phase 8)

Walk both locales (`/calculators/<slug>` and `/tr/hesaplayicilar/<tr-slug>`) top-to-bottom and confirm:

- [ ] 4 zones render with clean backgrounds. No low-contrast text in Zone 4. No layout shift across tabs.
- [ ] Exactly one canonical asset per concept; no duplicate tables or editorial blocks.
- [ ] No TR-only end-of-page duplicate block.
- [ ] Every slider's `max` matches the input field's realistic upper bound (Section 3a).
- [ ] All mode/tab labels are localized — no `capitalize` over raw keys.
- [ ] FAQ schema count = visible FAQ count, EN = TR.
- [ ] Progress metric uses the honest ratio formula. Tooltip and heading name both sides. Sanity test recorded.
- [ ] Mobile (375px): all tables render as stacked cards with the same styling, same breakpoint, no horizontal overflow.
- [ ] All internal links route to locale-correct destinations.
- [ ] Schema audit (`scripts/audit-schema.mjs`) passes with 0 warnings attributable to this page.
- [ ] Playwright retirement-style visual + mobile-audit specs replicated for this calculator and passing.

Pass is complete only when every box above is checked. Anything not covered is reported back, not silently skipped.

---

## 10. After all 44 passes

Re-evaluate this spec. Anything every pass had to work around becomes a shared primitive change (own phase, own review). Anything used only once stays in that calculator.
