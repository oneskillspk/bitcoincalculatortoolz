# "What You Can Buy" — Redesign Plan

A focused redesign of the section that lives **directly below "Top Items by Quantity"** on the Bitcoin Purchasing Power Calculator. Goal: a clean, modern, professional dashboard — not a card flea-market.

## Problems with the current layout

- Reads as a flat 4-up grid of look-alike tiles; no hierarchy, no scannable rhythm.
- Filter bar (search + 2 selects) eats 100% width and competes with the title.
- Each tile repeats the same three blocks (icon, quantity, name + category) with low contrast and uneven heights.
- USD reference price is a faint top-right number — easy to miss, easy to misread as the user's currency.
- "View More" is a wide outline button at the bottom — feels like a CTA, not a disclosure.
- No grouping by category, no sense of "you can afford a lot of X, a little of Y".

## New structure

```text
┌─────────────────────────────────────────────────────────────┐
│  What You Can Buy                          12 of 45 items   │  ← header row
│  With ₿0.50 (~$31,213) you could afford…                    │  ← context line
├─────────────────────────────────────────────────────────────┤
│  [All] [Tech] [Transport] [Food] [Lifestyle] …    🔍 [▾Sort]│  ← chip filter bar
├─────────────────────────────────────────────────────────────┤
│  TECH · 8 items                                             │  ← category band
│  ┌──────────┬──────────┬──────────┬──────────┐              │
│  │ 31×      │ 26×      │ 12×      │  4×      │              │
│  │ iPhone   │ MacBook  │ iPad Pro │ Mac Studio│             │
│  │ $999     │ $1,299   │ $1,099   │ $1,999    │             │
│  └──────────┴──────────┴──────────┴──────────┘              │
│  TRANSPORT · 3 items                                        │
│  …                                                          │
└─────────────────────────────────────────────────────────────┘
        Show 24 more ▾                (text link, centered)
```

### Header
- Title `What You Can Buy` + right-aligned `X of Y items` (kept, smaller).
- New **context subline**: `With <BTC amount> (~<USD total>) you could afford…` — anchors the section to the calculation above.

### Filter bar (single row, compact)
- **Category as chips**, not a select. Horizontal scroll on mobile, wrap on desktop. Active chip uses `bg-primary/10 text-primary border-primary/30`.
- **Search**: collapses to an icon button on `<sm`, expands inline on `sm+`. `w-[220px]` max.
- **Sort**: ghost button with caret → small popover (`Most quantity`, `Lowest price`, `Highest price`). Removes the second full-width Select.
- Reset filters becomes a subtle `×` inside the search field + a "Clear" link beside the chip row when any filter is active.

### Category bands
- Group items by category (only when "All" is selected). Each band has a thin eyebrow row: `CATEGORY · n items` left, faint `hsl(var(--border))` hairline right.
- When a single category is selected, bands collapse to one band (no eyebrow noise).

### Item card (redesigned)
- Aspect `1 / 1.05`, `rounded-xl`, `border border-border/60`, `bg-card`, no gradient fill (gradient was the noisy part).
- Layout, top to bottom:
  1. Small square icon chip `32×32`, `rounded-md`, `bg-muted` with category-tinted icon (`text-primary` etc.) — no gradient.
  2. **Quantity** as the hero number: `text-3xl font-semibold tabular-nums`, with `×` in `text-muted-foreground text-lg`.
  3. Item name: `text-sm font-medium text-foreground`, single line `truncate` + `title` tooltip.
  4. Footer row: `$1,299` left (tabular-nums, muted), category dot + label right (`text-[11px] uppercase tracking-wider text-muted-foreground`). Footer separated by a `border-t border-border/40 pt-2`.
- Remove the "units / adet" label — `×` already communicates quantity.
- Hover: `border-primary/40` + `shadow-sm` only (no translate; cards are non-interactive).

### Density & grid
- `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3` (one more column at xl, tighter gap). Feels like a dashboard, not a marketing grid.

### Disclosure
- Replace the outline "View More" button with a centered text link: `Show 24 more ▾` / `Show less ▴`, `text-sm text-primary hover:underline`. Outline button reserved for primary actions.

### Empty / filtered state
- Centered muted illustration glyph + `No items match these filters` + a single ghost `Reset filters` link. Same vertical rhythm as the bands so the section height doesn't collapse.

### Footnote
- USD-reference note moves to a subtle inline hint anchored to the **filter bar** (`ⓘ Prices shown in USD`) with a tooltip explaining FX, instead of appearing as orphan text under the grid.

## Accessibility & i18n

- Keep all existing localized strings (`getLocalizedItemName`, `getLocalizedCategory`).
- Chip group: `role="tablist"` + `role="tab"` + `aria-selected` for keyboard nav with arrow keys.
- Sort popover: `aria-label` matches current Select label.
- `aria-live="polite"` count stays.
- Cards: `<ul role="list">` + `<li>` preserved.
- Contrast: footer caption uses `text-muted-foreground` against `bg-card` (already AA in both themes — no `rgba(0,0,0,0.42)` ad-hoc colors).

## Technical notes

Files touched (frontend only, no calculator logic changes):

- `src/components/purchasing-power/PurchasingPowerComparison.tsx` — full re-layout per above. Reuses existing `result.items`, `getLocalizedItemName`, `getLocalizedCategory`, `PurchasingPowerCalculator.formatQuantity`.
- New small subcomponents inside the same file:
  - `<CategoryChips items categories selected onSelect />`
  - `<SortMenu value onChange />` using existing `DropdownMenu` from `@/components/ui/dropdown-menu`.
  - `<ItemCard item localizedName localizedCategory />`.
- Grouping helper: `const grouped = useMemo(() => groupBy(filteredItems, 'category'), [filteredItems])`. When `selectedCategory !== 'all'`, render flat (no bands).
- `showAll` semantics stay (initial cap = 16 to match denser grid; "Show N more" reveals all). Existing reset-on-filter `useEffect` retained.
- No new dependencies. No changes to `purchasingPowerCalculator.ts`, `BitcoinPurchasingPowerCalculator.tsx`, or design tokens.

## Out of scope

- FX conversion of item prices (already decided: lock to USD with footnote).
- Top Items by Quantity widget above it.
- Any calculator math or hook changes.
