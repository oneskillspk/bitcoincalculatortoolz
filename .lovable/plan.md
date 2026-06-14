# Fix overflow & modernize "What You Can Buy" grid

**File:** `src/components/purchasing-power/PurchasingPowerComparison.tsx`

## Problems visible in the screenshot
1. Quantity number (e.g. `16.0K`) collides with the icon — both are forced onto one row inside a narrow 4-col card, so the number wraps/overlaps the icon tile.
2. Item names are clipped: "Loaf of…", "Lunch…", "Movie…", "Hardcover…" because of `line-clamp-1` in a too-narrow column.
3. Category badge (`Daily Essentials`) wraps to two lines and squeezes the price (`$2`, `$15`) right against it.
4. Overall density feels cramped and amateur — too many competing horizontal alignments.

## Redesign (single card layout, applied to each item)

Switch each card from "icon-left + number-right + badge-row" to a **clean vertical stack** with proper hierarchy:

```text
┌──────────────────────────┐
│ [icon]            $2     │  ← icon top-left, unit price top-right (tabular)
│                          │
│ 16.0K  units             │  ← big quantity, unit label inline-baseline
│                          │
│ Bottled Water            │  ← full item name, allowed to wrap to 2 lines
│ Daily Essentials         │  ← category as muted caption, NOT a wrapping pill
└──────────────────────────┘
```

Key changes:
- `min-w-0` on card + every text wrapper so flex children can shrink.
- Quantity sits on its own row → no more collision with the icon.
- Use `tabular-nums` + a responsive size (`text-xl sm:text-2xl`) and `leading-none` for the number; "units" becomes a small inline label beside it (not a stacked right-aligned block).
- Item name: drop `line-clamp-1`, allow `line-clamp-2` with `break-words` and a fixed `min-h` so card heights stay aligned.
- Category becomes a lowercase-tracked caption (`text-[11px] uppercase tracking-wider text-muted-foreground`) instead of a `Badge` that wraps. Price moves to the top-right corner where it has room.
- Card padding bumps to `p-5`, radius to `rounded-xl`, border to `border-border/40`, subtle hover lift (`hover:-translate-y-0.5 hover:shadow-sm`).
- Icon tile shrinks to `w-9 h-9 rounded-lg` so it never dominates the card.
- Grid: keep `1 / 2 / 3 / 4` cols but raise gap to `gap-4` for breathing room.

## Toolbar polish (same file, header row)
- Make the three controls (search / category / sort) equal-height `h-10`, consistent radii, and on desktop give search `flex-1` while the two selects stay `w-[180px]` — already mostly there, just confirm spacing with `gap-2 sm:gap-3`.
- "items available" badge → swap to a plain muted caption next to the title (no pill), matching the new card captions.

## Out of scope
- No business logic / data / sort changes.
- No changes to TR strings (only layout/classNames).
- OG image work remains skipped per prior instruction.

## Verification
- Visual check at 360 / 768 / 1280 / 1440 widths, light + dark.
- `bunx vitest run src/services/__tests__/purchasingPowerCalculator.test.ts` (sanity — should still pass; no logic touched).
- Confirm no item name truncates with `…` at any breakpoint ≥ `sm`, and the quantity number never overlaps the icon at the narrowest 4-col width (~280 px card).
