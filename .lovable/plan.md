# Homepage Consistency Redesign — Instrument Panel Language

Bring every remaining homepage section into the same visual system already used by the hero, `PremiumCalculatorCards`, and `CalculatorGrid`: light paper surface, near-black text, hairline borders, single ember accent, mono metadata rails, terminal-style section headers, `rounded-xl`. No gradients, no orbs, no purple, no dark-mode variants.

## Homepage section inventory (in render order)

```text
Header
ProfessionalHeroSection        ← reference taste (keep)
LiveCalculationDemo            ← redesign
EditorialStatement             ← lightly align
PremiumCalculatorCards         ← reference taste (keep)
CalculatorGrid (featured+explore) ← reference taste (keep)
CalculationFlowAnimation       ← redesign
UltraModernAssetComparison     ← redesign
FAQSection                     ← redesign
NewsletterSection              ← redesign
Footer
```

## Shared design rules (applied to every section below)

- Section chrome: `max-w-7xl mx-auto px-4 sm:px-6`, vertical rhythm `py-12 md:py-20`, hairline `border-border/60` rules between sections instead of heavy surfaces.
- Section header: a small terminal strip — `SEC-0X` mono module id + ember dot on the left, uppercase mono status on the right, then `SectionHeading` (eyebrow + h2 + lede) directly underneath.
- Cards/panels: `bg-card border border-border/70 rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)]`, optional header/footer rails using `border-border/60 bg-background/40` with mono metadata at `text-[10.5px] tracking-[0.14em]`.
- Typography: titles `font-semibold tracking-[-0.015em]`, body `text-[13–14px] text-muted-foreground leading-relaxed`, mono via existing `font-mono` token.
- Accents: only the ember `bg-primary` 1.5px dot and the `OPEN →` / `ArrowUpRight` hover affordance.
- Mobile: 1-col → 2-col → 3/4-col; all tap targets ≥44px; no horizontal scroll.
- All copy stays in existing `t()` keys; no new translation keys unless a section needs a module id/status label, which will be inline EN/TR (mirroring the cards pattern).

## Per-section changes

### 1. `LiveCalculationDemo` (`src/components/modern/LiveCalculationDemo.tsx`)
- Replace `card-editorial` panel with the Instrument Panel shell: terminal header `CALC-LIVE · BTC/USD` + `LIVE` mono badge with pulsing ember dot, hairline divider, content body, footer rail with `WHAT-IF →` and `DCA →` actions as mono links instead of full buttons.
- Drop the existing eyebrow `01 — Live demo` (now encoded in the terminal strip) and rebuild header with `SectionHeading`.
- Remove the soft surface (`surface-muted`); use plain background + top/bottom hairline rule.
- Investment cycler stays, restyled as a mono ticker row.

### 2. `EditorialStatement` (`src/components/cinematic/EditorialStatement.tsx`)
- Remove the blurred ember orb (`from-primary/40 to-accent/20` blob). Keep parallax grid lines.
- Keep the serif `WordReveal` statement but tighten container to match `max-w-7xl` rhythm and add the standard terminal section strip (`SEC-02 · MANIFESTO`).
- Hairline divider already matches; no other structural changes.

### 3. `CalculationFlowAnimation` (`src/components/modern/CalculationFlowAnimation.tsx`)
- Re-skin the flow steps as Instrument Panel tiles: each step becomes a card with `STEP-0N` mono id header, icon tile (`w-10 h-10` bordered), title, description, and an arrow rail connecting steps on `lg+`.
- Remove any gradient backgrounds, glow rings, or neon strokes; switch to hairline borders + ember dot for the active step.
- Standard section header with `SectionHeading`.

### 4. `UltraModernAssetComparison` (`src/components/modern/UltraModernAssetComparison.tsx`)
- Rework as a single Instrument Panel data card: terminal header `COMP-01 · ASSET vs BTC`, hairline column rules, mono row metadata (ticker, 1Y, 5Y, 10Y), ember accent only on the BTC row.
- Replace any pill/segmented control styling with hairline-bordered buttons matching the cards' `OPEN →` rail.
- Mobile: collapse to a stacked list with the same mono rail per row.

### 5. `FAQSection` (`src/components/FAQSection.tsx`)
- Convert accordion items into Instrument Panel rows: `FAQ-0N` mono index on the left, question in `font-semibold`, `+ / −` toggle on the right; hairline divider between rows; expanded answer in muted body text inside `bg-background/30`.
- Standard section header; remove any current card-in-card nesting.

### 6. `NewsletterSection` (`src/components/NewsletterSection.tsx`)
- Single centered Instrument Panel card: header `SIGNAL-01 · NEWSLETTER` + `WEEKLY` badge, h2 + lede, then an inline form (email input with hairline border + ember submit button labeled `SUBSCRIBE →`), footer rail with privacy note in mono.
- Remove any gradient/background art; section uses plain background with top hairline rule.

## Implementation order

1. Introduce a small shared `SectionTerminalStrip` helper (module id + ember dot + status badge) in `src/components/cinematic/` so every section reuses identical chrome — keeps consistency cheap.
2. Apply per-section changes in the order listed above. Each section is an isolated file edit; no routing, data, or business-logic changes.
3. Visual QA at `375px`, `768px`, `1280px`: confirm no horizontal scroll, ≥44px tap targets, hairline rules align with the cards' grid gutters, ember accent appears at most once per visible viewport.

## Out of scope

- No changes to hero, `PremiumCalculatorCards`, `CalculatorGrid` (already in target language).
- No changes to header, footer, routes, translations beyond inline mono labels, data sources, or any calculator pages.
- No new dependencies.

Reply **go** to implement, or tell me which sections to drop/reorder.
