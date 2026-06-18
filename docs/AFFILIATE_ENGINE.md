# Affiliate Engine

This document is the source of truth for the **AffiliateAI** placement engine
(banners, cards, sponsor strips). It is intentionally short — the code is the
specification, this is the map.

## TL;DR

- Rule-based, **client-side only**. No Cloud round-trip. (Phase 4 ripped out
  `decisions_cache` / `affiliate_overrides` reads — those tables still exist
  for the admin dashboard but the runtime never reads them.)
- One entry point: `useAffiliateAI({ slug, lang, zone, ... })`.
- One renderer: `<AffiliatePlacement />`.
- One config: `src/config/affiliates.config.ts` (programs + creatives) +
  `src/config/placements.config.ts` (zone presets, category map, INTENT_MAP).

## Pipeline

```
slug + lang + zone
        │
        ▼
buildContext()  ─── derives device, segment, signals
        │
        ▼
scoreAndPick()  ─── hard filters (enabled / page / lang / results)
        │           hard exclude (page-view shown + 1h recency)
        │           weighted rotation on remaining scored pool
        ▼
AIDecision { affiliate_ids, format, zone, ... }
        │
        ▼
resolveAffiliates()  ─── localizes URL / CTA / description
        │                returns effectiveLang for analytics + disclosure
        ▼
<AffiliatePlacement /> renders ImageBanner | HtmlBanner | Card | Sidebar | ...
```

## Scoring (see `scoringEngine.ts`)

Each eligible program is scored by:

| Signal                              | Weight       |
| ----------------------------------- | ------------ |
| `priority` (1–10)                   | + value      |
| `tier`                              | 1→4, 2→2, 3→1|
| `conversion_intent`                 | h→3, m→2, l→1|
| target_pages exact match            | +5           |
| target_pages wildcard `*`           | +1           |
| target_results overlap              | +2 each      |
| language_restriction match          | +2           |
| banner zone + has creatives         | +4           |
| INTENT_MAP winner for slug+lang     | + INTENT_BOOST (15) |
| Shown in last 1h (`localStorage`)   | −3 *(soft, only matters when hard filter empties pool)* |

After scoring, rotation uses a **daily-bucketed deterministic seed**
(`slug|lang|segment|zone|dayBucket`) so a single session stays stable
but distribution balances across days.

## Frequency caps (Phase 5)

Two layers, both **hard exclusions** with graceful fallback:

1. **Per page-view** — `pageViewShown.ts` keeps a `Set<affiliate_id>`
   keyed on `location.pathname + search`. When a second
   `<AffiliatePlacement>` mounts on the same page, programs already
   picked are excluded. Resets on SPA navigation.
2. **Per visitor / 1h** — `localStorage["aff_seen"]` records last
   impression timestamp per affiliate. Programs shown in the last hour
   are filtered out.

If a filter would empty the candidate pool, that filter is skipped (we
prefer showing a "recent" banner over showing nothing). The old `−3`
score penalty is kept for that fallback path.

## Localization

- `useSafeLanguage()` reads `LanguageContext` first, falls back to
  pathname only when no provider is present (test isolation).
- `resolveAffiliates()` returns `effectiveLang` — the locale the user
  *actually sees* — and the disclosure + analytics use that, not the
  requested `lang`. This prevents "TR disclosure on EN copy" drift
  when a partner ships English-only assets.

## Creative selection (`creativePicker.ts`)

- `pickCreative(program, zone, device, lang)` — weighted choice across
  size preferences for the zone+device, filtered by orientation
  (horizontal zones never render skyscrapers).
- `pickResponsiveSet(program, chosen, lang)` — returns same-aspect
  creatives sharing `responsive_group`. `<ImageBanner>` renders a
  `<picture>` so larger viewports upgrade to higher-res assets without
  reshaping the box.

`responsive_group` rule: every member MUST share the same aspect ratio
(±5%). `validateCreatives()` enforces this and dev-mode logs warnings.

## URL hygiene

- `appendUtm()` wraps every outbound href.
- `<a target="_blank" rel="sponsored nofollow noopener">` on every link.
- `creative.landing_url` always wins over the program-level URL for
  banner clicks (CJ/Impact-style per-ad tracking).
- `audit-affiliate-links.mjs` (`scripts/`) flags any `PLACEHOLDER`-shaped
  URL regardless of `enabled` so a flip in admin can never ship a stub.
- `intent-map-integrity.test.ts` ensures `INTENT_MAP` IDs all resolve
  to enabled, non-PLACEHOLDER programs.

## Admin surface

- `/admin/login` + `/admin` — Supabase auth gated by `has_role(user,'admin')`.
- `/qa/affiliates` — Phase 7: also gated by `useAdminAuth`. Renders
  validation, coverage matrix, rotation report, and live banner previews.

## Adding a new partner

1. Add row to `AFFILIATES[]` in `affiliates.config.ts` with `enabled: false`
   and real `url_en`/`url_tr` (or leave `null` until referral link arrives).
2. If banner partner, add `creatives[]` with size + `responsive_group`.
3. Add to `target_pages` only with **routed** slugs (check `SLUG_CATEGORY`).
4. Optional: add to `INTENT_MAP[slug].en|tr` for explicit winners.
5. Flip `enabled: true` once the referral link is live.
6. Run `bun run vitest run intent-map noPlaceholder validateCreatives`.

## Files

```
src/
├─ config/
│  ├─ affiliates.config.ts        # AFFILIATES[] + master switches
│  └─ placements.config.ts        # ZONE_PRESETS, CATEGORY_PLACEMENT, INTENT_MAP
├─ hooks/useAffiliateAI.ts        # public hook
├─ components/affiliateAI/
│  ├─ AffiliatePlacement.tsx      # universal renderer
│  └─ AffiliateDisclosure.tsx     # FTC sentence / badge
└─ lib/affiliateAI/
   ├─ contextEngine.ts            # buildContext, deriveResultSignals
   ├─ scoringEngine.ts            # scoreAndPick (rule-based)
   ├─ decisionClient.ts           # thin wrapper over scoreAndPick
   ├─ placementResolver.ts        # localize program → ResolvedAffiliate
   ├─ creativePicker.ts           # pickCreative + pickResponsiveSet
   ├─ pageViewShown.ts            # Phase 5 per-page-view dedup
   ├─ validateCreatives.ts        # size label ↔ width/height parity
   ├─ analyticsClient.ts          # impression / click logging
   └─ utm.ts                      # appendUtm
```
