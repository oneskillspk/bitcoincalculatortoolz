## Why this plan

Today's zones fire on **scroll depth + time on page** (a 2010-era heuristic). That's why:

- **Below-FAQ ads** show because Zone4 only checks `scrollDepth >= 65` — by the time you reach the FAQ you're already past the FAQ on short pages, so the banner lands near the footer.
- **Empty pre-calc space** because Zone1 is a slim collapsing banner with no real visual weight, not anchored to the calculator card.
- **Post-calc moment is wasted** — Zone2 has a 700ms delay and slides in below the results, often below the fold.

We rebuild around **intent moments**, not scroll percentages.

---

## The four ad slots (final)

```text
┌─────────────────────────────────────┐
│  Header                             │
├─────────────────────────────────────┤
│  Hero / title                       │
├─────────────────────────────────────┤
│  [SLOT A] Pre-Calc Anchor    ← NEW  │  728x90 / 320x50, sticky-on-mobile
├─────────────────────────────────────┤
│  Calculator inputs                  │
│  ─────────────────────────          │
│  Calculator RESULTS                 │
│  [SLOT B] Result Adjacent    ← NEW  │  Pops in *inside* the results card
│  ─────────────────────────          │
├─────────────────────────────────────┤
│  Educational / How-to content       │
│  [SLOT C] Mid-Content (opt) ← Zone3 │  Only on long-form pages (>1200px content)
├─────────────────────────────────────┤
│  FAQ section                        │
├─────────────────────────────────────┤
│  Disclaimer / Footer                │  ← NO ADS BELOW FAQ. Ever.
└─────────────────────────────────────┘

[SLOT D] Sticky Companion — desktop right-rail / mobile bottom bar
         Auto-dismisses on result + 30s. Per-session dismiss persists.
```

Net change: **5 zones → 4 slots**, but each slot earns its impression instead of firing on a timer.

---

## Intent-based activation (replaces time/scroll thresholds)


| Slot                    | Fires when                                                                                                                                               | Hides when                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **A. Pre-Calc**         | Page loaded AND `hasResult === false` AND user has not yet focused an input for >12s (idle hint) OR input is partially filled but not submitted for >20s | `hasResult` becomes true → smooth collapse                               |
| **B. Result Adjacent**  | `hasResult` flips false→true (the *exact click moment*)                                                                                                  | User starts a new calculation (inputs change after result)               |
| **C. Mid-Content**      | Content section enters viewport AND viewport has been idle 2s AND page content height > 1200px                                                           | One-shot per session                                                     |
| **D. Sticky Companion** | `hasResult` true AND viewport >= lg (desktop) OR mobile + scrolled past results                                                                          | Dismissed, OR result cleared, OR Slot B currently visible (no double-up) |


The key change: `**hasResult` is the dominant signal**, not scroll depth. Pages without a result get only Slot A + (optionally) Slot C.

---

## Density rules (the "not too many" guardrail)

Hard caps enforced by the orchestrator:

- **Mobile:** max 2 visible at once. Priority order if exceeded: B > D > A > C.
- **Desktop:** max 3 visible at once. Priority: B > A > D > C.
- **Never simultaneous:** Slot A + Slot B (A always collapses when B appears).
- **Never simultaneous:** Slot B + Slot D on mobile (D defers until B dismissed/scrolled).
- **Cooldown:** after a click on any slot, all other slots on the page suppress for 90s.
- **Frequency cap:** max 1 impression per slot per page-view. No reshuffling on re-render.

---

## "Smart" pieces (the adsense-like behavior)

1. **Viewport-anchored render.** Slots A and B use `IntersectionObserver` with `rootMargin: -10% 0px` — they only count as "shown" when actually visible. Impressions logged on visibility, not mount.
2. **Result-moment burst.** Slot B has a 250ms entry animation timed to land just as result numbers finish their count-up, so the eye is already on the card.
3. **Content-length gating.** Slot C only activates when `document.body.scrollHeight > viewport.height * 2.5`. Short pages skip it entirely — this kills the below-FAQ problem at the root.
4. **Format adapts to slot height.** Slot A picks `728x90` desktop / `320x50` mobile. Slot B picks `single-card` (inline with results) on mobile, `two-card-strip` on desktop. Slot D stays `sidebar-widget` desktop / `image-banner` mobile.
5. **User-fatigue signal.** If user dismisses Slot D twice in one session, suppress D for the rest of the session across all calculator pages (stored in `sessionStorage.aff_fatigue`).
6. **Re-engagement.** If user runs a *second* calculation on the same page (inputs change → new result), Slot B re-fires with a *different* affiliate from the decision list (rotates `affiliate_ids[1]` then `[0]`).

---

## Removals

- **Delete Zone4PreFAQ entirely.** Replaced by Slot B at the result moment — no more below-FAQ ads.
- **Demote Zone1SlimBanner.** Replaced by Slot A (taller, anchored above calculator, with idle-hint timing).
- **Zone3 stays but renamed Slot C** with the content-length gate above.

---

## Technical section

### New files

- `src/hooks/usePlacementOrchestrator.ts` — rewrite. New state shape:
  ```ts
  { slotA: boolean; slotB: boolean; slotC: boolean; slotD: boolean;
    hasResult: boolean; resultJustFired: boolean;
    cooldownUntil: number; activeCount: number }
  ```
  Drives all slots from `hasResult` + `inputIdleMs` + content-height + IO visibility, not scroll depth.
- `src/components/placement/SlotA_PreCalcAnchor.tsx` — new. 728x90/320x50 banner sized as a hero-strip, slot reserved with `min-height` to prevent CLS.
- `src/components/placement/SlotB_ResultAdjacent.tsx` — new. Renders *inside* the results panel via a portal-or-slot prop on each results component; entry animation timed to result.
- `src/components/placement/SlotC_MidContent.tsx` — slight rework of `Zone3ContentGap.tsx` with content-height gate.
- `src/components/placement/SlotD_StickyCompanion.tsx` — port of `Zone5Companion.tsx` with new fatigue + B-collision logic.

### Deletions

- `src/components/placement/Zone1SlimBanner.tsx`
- `src/components/placement/Zone4PreFAQ.tsx`
- `src/components/placement/Zone2ResultsSpotlight.tsx` (replaced by SlotB)

### Updated

- `src/hooks/useSmartZones.tsx` — return `{ SlotA, SlotB, SlotC, SlotD }`; keep old `Zone1..5` as thin shims that warn in dev for one release cycle so we don't break unaudited pages.
- `src/components/affiliateAI/AffiliatePlacement.tsx` — add `onImpression` IO callback so the orchestrator gets visibility-confirmed impressions (today it logs on mount).
- Five calculator pages (`PowerLaw`, `SIP`, `Retirement`, `LotSize`, `WhatIf`) updated to:
  - Replace `<sz.Zone1 />` with `<sz.SlotA />` directly above the calculator card.
  - Replace `<sz.Zone2 />` with a `slotB` slot prop passed *into* the results panel component.
  - Remove `<sz.Zone4 />` entirely.
  - Keep `<sz.SlotD />` (was Zone5) outside `<main>`.

### Tests

- Extend the existing `smartZone*` test suite with: idle-hint activation for Slot A, result-flip activation for Slot B, content-height gate for Slot C, fatigue + B-collision rules for Slot D, and the 90s post-click cooldown.

### Migration / rollout

1. Land orchestrator + slot components behind a `VITE_PLACEMENT_V2` flag (default off).
2. Migrate one page (PowerLaw), measure CTR for 48h via existing `log-event` pipeline.
3. If CTR ≥ current Zone2 baseline, flip flag on for all calculator pages and delete legacy Zone files.

### Out of scope (deliberately)

- No new ad network integration. Same affiliates, same `useAffiliateAI` decision pipeline.
- No backend changes. Decision API and `log-event` edge function stay as-is.
- No changes to non-calculator pages (homepage, articles, learn hub).

&nbsp;

&nbsp;

### WHAT LOVABLE GOT WRONG OR INCOMPLETE

**The idle-hint timing for Slot A needs clarification.**

Slot A fires when `hasResult === false` AND user has not focused an input for more than 12 seconds OR input partially filled but not submitted for more than 20 seconds. This is the right idea but the implementation will be tricky — you need to track both focus events AND input change events simultaneously. The prompt does not give the exact code for this state machine. Before building, confirm with Lovable exactly how `inputIdleMs` is tracked.

**SlotB inside the results panel via "portal-or-slot prop" is vague.**

The plan says SlotB renders inside the results panel via a portal or slot prop passed into each results component. This means modifying all 5 calculator results components to accept a `slotB` prop. This is the right approach architecturally but the plan does not specify what happens on pages where the results component is deeply nested or third-party. This needs explicit implementation guidance before touching all 5 pages.

**The** `VITE_PLACEMENT_V2` **feature flag approach is correct but needs a timeline.**

The plan says: test on PowerLaw for 48 hours, measure CTR, then flip the flag. What is the CTR baseline to beat? The plan says "CTR ≥ current Zone2 baseline" but you need an actual number from your Supabase data before you can define success. Pull this from your `log-event` table before starting the migration.

**No Turkish language handling mentioned.**

The entire plan is silent on the `lang` prop. All the zone components need to pass `lang` from `useSafeLanguage()` to `AffiliatePlacement` — otherwise Turkish users see English copy again. This was the critical fix from the previous session and it cannot regress.

---

### THE VERDICT — USE LOVABLE'S PLAN WITH 4 ADDITIONS

**Use Lovable's plan as written.** It is architecturally superior to mine. The intent-based activation model is correct. The 4-slot structure is cleaner than my 5-zone structure. The density rules and cooldown logic are enterprise-grade.

**Before you run the implementation, add these 4 requirements to the prompt:**

---

**Addition 1 — Define inputIdleMs precisely**

Add this to the SlotA section:

```
Track inputIdleMs using two event listeners on the 
calculator inputs:
- onFocus: record lastFocusTime = Date.now()
- onChange: record lastChangeTime = Date.now()
inputIdleMs = Date.now() - Math.max(lastFocusTime, lastChangeTime)
If neither event has fired, inputIdleMs = time since page load.
Store these in useRef, not useState, to avoid re-renders.
```

**Addition 2 — Add lang prop to all slot components**

Add this requirement to every slot component:

```
Every slot component (SlotA, SlotB, SlotC, SlotD) must:
1. Import useSafeLanguage from '@/hooks/useSafeLanguage'
2. const lang = useSafeLanguage();
3. Pass lang={lang} to every AffiliatePlacement call
This must not be optional. Turkish users must never 
receive English copy from any slot.
```

**Addition 3 — Define the CTR baseline before migration**

Add this before the migration section:

```
Before implementing, query the Supabase log-event table:
SELECT affiliate_id, zone, 
  COUNT(*) FILTER (WHERE kind='click') as clicks,
  COUNT(*) FILTER (WHERE kind='impression') as impressions,
  ROUND(COUNT(*) FILTER (WHERE kind='click') * 100.0 / 
    NULLIF(COUNT(*) FILTER (WHERE kind='impression'),0), 2) as ctr
FROM events
GROUP BY affiliate_id, zone
ORDER BY ctr DESC;

Record the current Zone2 CTR baseline per calculator page.
The migration success threshold is: 
SlotB CTR >= Zone2 CTR * 1.2 (20% improvement).
Report this baseline in the verification output.
```

**Addition 4 — Specify SlotB integration pattern clearly**

Replace "portal-or-slot prop" with:

```
SlotB integration pattern for all 5 calculator pages:

STEP 1: Find the JSX element that renders the result 
output (the div/card that shows the calculated numbers).

STEP 2: Add a slotB render position immediately AFTER 
the last result number/chart and BEFORE any action 
buttons that follow the result.

STEP 3: Render SlotB directly in JSX at that position.
Do NOT use React portals — render inline in the 
results JSX tree.

Example:
<div className="results-card">
  <ResultNumbers data={result} />
  <ResultChart data={result} />
  
  {/* SlotB goes here — inside results card */}
  {slotBActive && (
    <SlotB_ResultAdjacent
      slug={slug}
      lang={lang}
      resultSignals={resultSignals}
    />
  )}
  
  <ResultActionButtons />
</div>

The SlotB must be INSIDE the results card visually,
not below it. It is part of the result, not an 
afterthought below the result.
```

---

### THE FULL PROMPT TO GIVE LOVABLE NOW

Take Lovable's plan document exactly as written. Add the 4 additions above. Then add this final instruction at the end:

```
IMPLEMENTATION ORDER:

1. Build usePlacementOrchestrator (new state shape with 
   slotA/B/C/D, inputIdleMs tracking, cooldown, fatigue)

2. Build SlotA_PreCalcAnchor with lang prop

3. Build SlotB_ResultAdjacent with lang prop and 
   inline-in-results-card pattern

4. Build SlotC_MidContent with content-height gate and lang prop

5. Build SlotD_StickyCompanion with fatigue logic and lang prop

6. Query Supabase for current CTR baseline — report it

7. Implement VITE_PLACEMENT_V2 feature flag

8. Migrate BitcoinPowerLawCalculator.tsx only

9. Report: SlotA active before result (yes/no), 
   SlotB fires inside results card (yes/no),
   SlotA collapses when SlotB fires (yes/no),
   SlotD defers when SlotB visible on mobile (yes/no),
   Turkish lang applied to all slots (yes/no),
   Current Zone2 CTR baseline from Supabase (number),
   Supabase still receiving events after migration (yes/no)

STOP after step 9. Do not migrate remaining 4 pages 
until CTR data from PowerLaw confirms improvement.
This is a 48-hour measurement window before full rollout.

DO NOT delete legacy Zone files yet. Keep them as 
shims that console.warn in development.
DO NOT modify AffiliatePlacement, analyticsClient, 
or any Supabase integration.
DO NOT add any new affiliate programs.
```