# Fix: no ads render on calculator pages (slot claim deadlock)

## What the audit found

I ran a live headless audit across `/calculators/dca`, `/profit-loss`, `/retirement`, `/investment`, `/mining-profitability` at desktop (1280) and mobile (390), with consent granted, scrolling to the bottom, and clicking Calculate on DCA.

Result on every route, both breakpoints:

- `[data-slot="A|B|C|D"]` elements in the DOM: **0**
- Visible affiliate surfaces: **1** — and it is only the pre-footer editorial band (`data-affiliate-placement="pre-footer"`)
- No ad renders below the calculate CTA, before or after a calculation
- No JS runtime errors

Console proves the cause:

```text
[placement] Duplicate slot mount suppressed for "dca:A" ... (same for B, C, D)
[V2 coverage] No SlotB/SlotC mounted on calculator route "/calculators/dca"
```

So the pages are wired correctly (DCA renders `<sz.SlotA/>`, `<sz.SlotB/>`, `<sz.SlotC/>`, `<sz.SlotD/>` inside `PlacementProvider`) — the slots are being suppressed by the dedupe registry.

## Root cause

`src/lib/placement/slotClaim.ts` claims a slot **during render**:

1. First render pass stores `owners[key] = tokenA`.
2. React StrictMode (dev) throws away that pass and re-renders; the new pass creates `tokenB` via a fresh ref.
3. `owners[key]` is still `tokenA`, so the committed instance sees `isOwner === false` and returns `null`.
4. `tokenA` never mounted, so its cleanup never runs — the claim is orphaned and the slot stays dead for the whole page life.

This is a single shared bug affecting every V2 calculator route, not a per-page migration gap.

## The fix

Rewrite `slotClaim.ts` so ownership is decided at **commit** time, not render time:

- Claim inside `useEffect` (commit phase). The first *committed* instance wins; render-phase side effects are removed entirely.
- On unmount, release the claim and notify waiters so a queued instance can take over (route transitions, conditional remounts).
- Keep `useSyncExternalStore` for subscription, but seed `isOwner` as `false` until the effect claims, then flip. Slots already tolerate a one-frame delayed mount (they animate in), so no CLS change.
- Keep the dev duplicate warning, but only fire it for genuinely simultaneous committed owners.
- Keep `__resetSlotClaims()` for tests.

## Verification

1. Re-run the live audit script on the five calculator routes at desktop + mobile: expect SlotA present pre-result, SlotB present below the results after clicking Calculate, SlotC on long pages, SlotD sticky — and zero "Duplicate slot mount suppressed" / "No SlotB/SlotC mounted" warnings.
2. Re-run the existing guards: `e2e/no-duplicate-slots.spec.ts` (still at most one owner per slot), `e2e/promo-slot-tracking.spec.ts` (click tracking), and the overlap guard in `e2e/calculator-ads-overlap-visual.spec.ts`.
3. Capture desktop + mobile screenshots of the below-CTA band on DCA and two other calculators for visual confirmation.

## Scope

- Change: `src/lib/placement/slotClaim.ts` only.
- No visual/design changes, no page-level edits, no config changes. If verification reveals a route that genuinely never mounts a slot, I will report it rather than redesign placements.
