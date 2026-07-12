# Results Panel Specification

Authoritative rules for every calculator's **results** surface. Every panel
that displays computed output MUST comply. Deviations require an inline
`// spec-exception: <reason>` comment and a linked follow-up issue.

Applies to files under:
- `src/components/**/*ResultsPanel.tsx`
- `src/components/**/*ResultPanel.tsx`
- `src/components/**/*ResultCards.tsx`
- Any component rendering `ResultCard` / `ResultHero` / `ResultRow`.

Primitives (do not fork):
`ResultPanel`, `ResultsGrid`, `ResultCard`, `ResultHero`, `ResultRow`,
`ResultBadge`, `EmptyState` — all from `@/components/calculator`.

---

## 1. Shell — `ResultPanel`

Every results surface is a `ResultPanel`. Never wrap results in a raw
`Card`, `div.calc-surface-card`, or `glass-morphism-card`.

Required props when the panel is user-facing:

| Prop        | Rule                                                                    |
| ----------- | ----------------------------------------------------------------------- |
| `title`     | Required. Sentence case. Under 40 chars. Localized (EN + TR).           |
| `icon`      | Required. Single `lucide-react` icon, no color prop.                    |
| `accentBar` | `positive` for gain, `negative` for loss, `primary` for neutral/target. |
| `action`    | Optional `ResultBadge` (status). Never a button.                        |
| `footer`    | Optional single-line summary sentence. No CTAs.                         |

Accessibility (all required, no exceptions):

```tsx
<ResultPanel
  aria-live="polite"
  aria-atomic="true"
  aria-label={tr ? 'Hesaplama sonucu' : 'Calculator result'}
  /* ... */
>
```

---

## 2. Grid density — `ResultsGrid`

Tile count determines `cols`. No other layout is allowed for metric tiles.

| Metric tiles | `cols` | Layout                                     |
| ------------ | ------ | ------------------------------------------ |
| 1            | —      | `ResultHero` only                          |
| 2            | `2`    | Two tiles                                  |
| 3–4          | `2`    | Two rows of two                            |
| 5–6          | `3`    | Two rows of three                          |
| 7–9          | `4`    | `ResultHero` on top + `ResultsGrid cols=4` |
| 10+          | split  | Group into 2+ panels                       |

Never render more than 9 tiles in one panel. Split by concern
(e.g. "Returns" / "Costs" / "Tax") into separate `ResultPanel`s.

---

## 3. Tile — `ResultCard`

Required per tile:
- `label` — short, sentence case, localized.
- `value` — the compact display string.
- `fullValue` — full precision string (tooltip). Required for any numeric
  value that could be compacted (K/M/B). Skip only for pure counts
  ("42 days") and percentages already at full precision.
- `icon` — required on 4-col grids, optional on 2-col grids.

Tone semantics (strict):

| `tone`     | Use for                                                             |
| ---------- | ------------------------------------------------------------------- |
| `primary`  | The single most important tile (portfolio value, target price).     |
| `positive` | Profit, gain, ROI ≥ 0, "you saved".                                 |
| `negative` | Loss, drawdown, tax owed, ROI < 0.                                  |
| `muted`    | Empty / unavailable / pending state.                                |
| _unset_    | Every other tile. Do not decorate.                                  |

At most **one** `primary` tile per panel. Tone MUST match the sign of the
value: no green loss cards, no red profit cards.

`size`:
- `lg` for the top row of a 2-col grid.
- `sm` for supporting tiles.
- default otherwise. Never mix `lg`/`sm` inside the same row.

---

## 4. Hero — `ResultHero`

Use exactly one `ResultHero` when the panel has a single "headline" number
(current value, projected value, target price). Always pair with `fullValue`
and a one-line `sub`. Never nest a `ResultHero` inside a `ResultsGrid`.

---

## 5. Header pattern

```tsx
<ResultPanel
  icon={<BarChart3 />}
  title={tr ? 'Yatırım Sonuçları' : 'Investment Results'}
  description={`${fmtDate(start)} → ${fmtDate(now)}`}
  accentBar={isProfit ? 'positive' : 'negative'}
  action={<ResultBadge tone={isProfit ? 'positive' : 'negative'}>{...}</ResultBadge>}
  footer={<p className="calc-text-small">{summary}</p>}
>
```

- `eyebrow` is reserved for panels stacked under a parent heading.
- `description` is one line, no numbers requiring `fullValue`.
- `footer` is one sentence, past tense, no marketing copy.

---

## 6. Formatting — one path only

Use `src/utils/numberFormat.ts` (`formatCurrencyDisplay`, `formatBtcDisplay`,
`formatPercent`) for tile values. It returns `{ display, full }` — wire both:

```tsx
const v = formatCurrencyDisplay(value, symbol, { locale, signed: true });
<ResultCard value={v.display} fullValue={v.full} />
```

Do not use `Intl.NumberFormat`, `toLocaleString`, `formatLargeNumber`, or
bespoke helpers inside a results component. `formatCurrency` /
`formatCurrencyAmount` are allowed only inside `src/utils/*` and services.

BTC: always `formatBtcDisplay` (₿ prefix, 4-dp display / 8-dp full).
Percent: always `formatPercent` (1-dp display / 4-dp full, signed).
Dates: `date-fns` `format(date, 'PP')`. Use `tr` locale when `language === 'tr'`.

---

## 7. Loading / empty / error triad

Every results panel MUST implement all three states in this order:

1. **Empty** (pre-calculation): `<ResultPanel><EmptyState icon title description /></ResultPanel>`.
   Description is one line. No CTAs.
2. **Loading**: `<ResultPanel>` + shadcn `<Skeleton>` blocks matching the
   final grid shape (same `cols`, same tile count). Never `bg-muted` divs,
   never spinners inside a panel.
3. **Error**: `<ResultPanel accentBar="negative">` + `EmptyState` with
   `AlertTriangle` icon, human message, and a retry `action` when
   applicable. Never a raw `toast`-only failure.

All three MUST keep the same `aria-live`, `aria-atomic`, `aria-label` as
the populated panel so screen readers announce transitions.

---

## 8. Icon vocabulary

Reuse across the app — do not invent per-panel icons.

| Concept              | Icon              |
| -------------------- | ----------------- |
| Portfolio value      | `Wallet`          |
| BTC amount / holding | `Bitcoin`         |
| Profit               | `TrendingUp`      |
| Loss                 | `TrendingDown`    |
| ROI / target         | `Target`          |
| Time / duration      | `Calendar`        |
| Annualized / rate    | `Timer`           |
| Average / weighted   | `Scale`           |
| Panel header default | `BarChart3`       |
| Warning / error      | `AlertTriangle`   |
| Empty state          | Domain icon (`DollarSign`, `Bitcoin`, …) |

Never pass `color` / `className="text-*"` to an icon — tone comes from the
`ResultCard`.

---

## 9. Forbidden patterns

- Raw `Card` / `CardContent` inside a results component.
- `glass-morphism-card`, `calc-surface-card`, or hand-rolled panel shells.
- Hardcoded color utilities (`text-green-500`, `bg-red-100`, `text-white`).
- Metric tiles built from `<div>` + `<p>` instead of `ResultCard`.
- Inline `Intl.NumberFormat` or `toLocaleString` on numeric values.
- Nested `ResultPanel`s (compose siblings in a `space-y-4` wrapper instead).
- More than one `primary` tone per panel.
- Spinners inside a results panel body.

---

## 10. Guardrails

CI enforces this spec via:

- ESLint rule forbidding `glass-morphism-card` outside
  `src/components/modern/legacy/`.
- Grep guard forbidding `toLocaleString(` inside `**/*Results*Panel.tsx`
  and `**/*ResultCards.tsx`.
- Playwright visual sweep (`e2e/results-panel-*.spec.ts`) across all 49
  calculator routes.
- Snapshot rule: every `ResultCard` numeric `value` must have `fullValue`
  when the raw number ≥ 10 000.

A PR touching a results panel MUST link this document in the description.
