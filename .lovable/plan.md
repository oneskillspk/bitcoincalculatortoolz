# AffiliateAI Ads & Banners — How It Works + Full Fix Plan

## 1. How the existing engine works (current state)

The "AI affiliate" system is a rule-based recommender with an optional Cloud cache. There is **no live LLM call** — "AI" refers to the scoring layer plus a Cloud-side decision precompute that is read at runtime.

```text
Page (e.g. /calculators/dca)
  └─ <AffiliatePlacement slug="dca" lang? zone? resultSignals? />
        └─ useAffiliateAI(ctx)
              ├─ buildContext()                ── slug, lang, segment, device, optedOut
              ├─ fetchDecision(ctx)            ── async, Cloud-first
              │    ├─ supabase.decisions_cache (precomputed AI pick)
              │    ├─ supabase.affiliate_overrides (force / hide)
              │    └─ fallback → scoreAndPick(ctx)   (rule-based, sync)
              └─ resolveAffiliates(decision, lang)
                    └─ AFFILIATES registry (src/config/affiliates.config.ts)
        └─ renders by `format`:
              image-banner | html-banner | single-card | two-card-strip |
              sidebar-widget | comparison | inline-cta
        └─ pickCreative() chooses a per-creative <picture>/<source> set
        └─ appendUtm() adds utm_source/medium/campaign/content (unless
          partner already owns utm_source — RedotPay, TradingView, Koinly)
        └─ logEvent() writes impression / click rows
```

Key pieces:

- `**src/config/affiliates.config.ts**` — program registry (id, urls, CTAs, creatives, target_pages, target_results, language_restriction, default_format).
- `**src/config/placements.config.ts**` — `DEFAULT_PLACEMENT`, `CATEGORY_PLACEMENT`, `ZONE_PRESETS`, `SLUG_CATEGORY`, `INTENT_MAP` (+15 boost), `ARTICLE_CATEGORY_AFFILIATE`.
- `**src/lib/affiliateAI/scoringEngine.ts**` — `scoreAffiliate` (priority + tier + intent + page/result overlap + banner-zone bonus + intent-map boost − recency penalty); `scoreAndPick` does daily-bucketed weighted rotation.
- `**src/lib/affiliateAI/placementResolver.ts**` — maps decision IDs to renderable items, falls back EN↔TR if one locale is missing.
- `**src/lib/affiliateAI/creativePicker.ts**` — chooses a creative by zone+device+lang, builds a responsive set by `responsive_group`.
- `**src/components/affiliateAI/AffiliatePlacement.tsx**` — universal renderer (image/html/cards), tracks impressions/clicks, 1h recency dedup via `localStorage["aff_seen"]`.
- `**scripts/audit-affiliate-links.mjs**` — pre-launch guard against PLACEHOLDER and null-URL-with-CTA on enabled programs.

Enabled today: `ledger`, `coinbase`, `koinly`, `tradingview`, `redotpay`. Everything else (`trezor`, `kraken`, `mexc`, `bybit`, `paribu`, `btcturk`, `swan_bitcoin`, `coinledger`) is `enabled: false` with `PLACEHOLDER` URLs.

---

## 2. Concrete issues found

### A. Wrong / broken links

1. **INTENT_MAP references mostly disabled affiliates.** `mexc`, `bybit`, `paribu`, `kraken`, `coinledger`, `trezor` appear as preferred picks for dozens of slugs but are all `enabled: false`. The `+15` intent boost is silently wasted; users keep getting Coinbase/Ledger no matter what the slug is.
2. **Duplicate IDs in INTENT_MAP lists.** `"what-if": { en: ["coinbase", "coinbase"] }`, same for `price-target`, `time-machine`, `pizza-day`, `cagr`, `average-buy-price`, `lump-sum-vs-dca`. Duplicates inflate weighted rotation and bypass tier/priority logic.
3. `**target_pages` typos / non-existent slugs.** Ledger targets `"cold-storage"`, `"security"`, `"millionaire"` — none of those are routed calculator slugs, so the page-match bonus never fires for them.
4. **PLACEHOLDER URLs on disabled programs aren't validated.** `audit-affiliate-links.mjs` skips disabled entries. The moment someone flips `enabled: true` (Bybit, MEXC, Trezor, CoinLedger, Paribu) the site ships `?ref=PLACEHOLDER` links.
5. `**url_en` and `url_tr` are identical** for every enabled partner. TR users go to English landing pages (no locale parameter, no TR sub-affiliate ID). RedotPay even hard-codes `/en/invite/` on `url_tr`.
6. **HtmlBanner sanitization drops landing UTM.** When `creative_html` rewrites `<a href>` we call `appendUtm` blindly; partners with their own utm_source survive but the rewritten click loses our `slug` attribution.

### B. Localization bugs

7. `**detectLang()` uses `window.location.pathname**` (same pattern we replaced site-wide for SEO). Pages that don't pass `lang` (`arbitrage`, `cagr`, `dominance`, `correlation`, `hodl-strategy`, `lot-size`, `bitcoin-loan`, `pizza-day`, etc. — ~25 calculators) silently render English copy on `/tr/...` until React rehydrates.
8. **Language fallback in `placementResolver**` returns the EN url/cta/description when TR is missing, but `AffiliatePlacement` keeps logging `lang: "tr"`. Result: TR FAQ-locale parity is fine, but the rendered CTA is in English and analytics says "tr".
9. `**AffiliateDisclosure` is hard-coded to "FTC sentence" lang** but several non-`Card` formats (HtmlBanner) skip the disclosure entirely when the HTML doesn't include it — borderline FTC issue.

### C. Decision engine + Cloud

10. `**fetchDecision` reads `decisions_cache` and `affiliate_overrides` tables** but there is no migration in the repo confirming these tables exist with the right GRANTs/RLS. Every call probably errors → falls through to rule-based scoring. We should verify, and either ship the migration or remove the Cloud path.
11. `**refresh-decisions` edge function exists** (`supabase/functions/refresh-decisions`) but the cron / trigger that populates `decisions_cache` is undocumented. If it never runs, `source: "cache"` is unreachable.
12. **Recency dedup is a `-3` penalty, not a hard skip.** With only 5 enabled programs, a high-priority partner (Coinbase prio=10) outranks the −3 within the same hour, so the same banner repeats.
13. **No frequency cap per page-view session** — pre-footer + post-result + sidebar on a single page can all render the same affiliate.
14. `**AdManager` (AdSense/Carbon)** is a parallel ad system loaded from `App.tsx`. With `DEFAULT_AD_NETWORK = "house"` and empty publisher ID it's inert, but the duplicate concept will confuse future contributors.

### D. Creative pipeline

15. `**responsive_group` is left empty** for Ledger skyscrapers (120×600, 160×600, 300×600). The picker falls back to "standalone", so no real responsive `<picture>` switching across the skyscraper sizes.
16. `**pickCreative` returning `null**` silently downgrades to a `SingleCard` whose href is `item.url` — bypassing the creative-specific `landing_url`. Bug for Impact-style attribution (RedotPay especially).
17. **Aspect-ratio guard in `ImageBanner**` is correct, but `pool` excludes the chosen creative when it differs by >5% — possible empty `<img>` fallback in rare configs.

### E. Tooling / governance

18. `**audit-affiliate-links.mjs` ignores disabled programs**; the link-rot risk above means a flag flip ships broken links. Audit should fail on PLACEHOLDER everywhere, regardless of `enabled`.
19. **No outbound HTTP audit** for the active affiliate URLs (we have `audit-outbound-links.mjs` but the affiliate registry isn't included there).
20. `**AffiliatePlacementQA` (`/qa/affiliates`)** isn't linked from admin nav and isn't gated; useful for QA but should be admin-only.
21. **Analytics** (`logEvent`) writes to a single Cloud table but there's no dashboard / aggregation surface, and no schema doc in the repo.

---

## 3. Fix plan (phased)

### Phase 1 — Stop shipping wrong links (1 PR)

- Update `audit-affiliate-links.mjs` to flag PLACEHOLDER **regardless of `enabled**`, and run it in CI on every PR.
- Add a unit test that asserts every `INTENT_MAP` id resolves to an `enabled: true` affiliate (or is explicitly allow-listed as "future"). Same test must reject duplicate ids within an `en` / `tr` list.
- Remove the bogus `target_pages` entries (`cold-storage`, `security`, `millionaire`) or add real route slugs.
- Add an `outbound-affiliate-http` audit that HEADs each enabled `url_en`/`url_tr` and every `creative.landing_url` and fails on non-2xx/3xx.

### Phase 2 — Fix locale handling (1 PR)

- Replace `detectLang()` in `AffiliatePlacement.tsx` with a `useLanguage()` read (same hook the rest of the app uses). Keep the optional `lang` prop as override.
- In `useAffiliateAI`, when `resolveAffiliates` swaps to the EN fallback, also rewrite `decision.lang` so analytics, disclosure, and creative picker stay coherent.
- Add a TR-specific landing parameter (`?lang=tr` or partner-supplied TR sub-id) to `url_tr` for Coinbase, Ledger, Koinly, TradingView; document in registry that `url_tr` MUST differ when the partner supports it.
- Render `AffiliateDisclosure` next to `HtmlBanner` outputs as well (currently only image/card formats get it).

### Phase 3 — Make INTENT_MAP useful (1 PR)

- Replace disabled-only intent picks with currently-enabled fallbacks (Coinbase/Ledger/Koinly/TradingView/RedotPay).
- Introduce a `WISHLIST_INTENT_MAP` that is applied only when the targeted partner becomes enabled — keeps strategic intent visible without poisoning scoring today.
- De-duplicate every list; assert with the Phase-1 test.

### Phase 4 — Decision cache + overrides (1 PR)

- Add a Supabase migration creating `decisions_cache` and `affiliate_overrides` with `GRANT SELECT TO anon, authenticated`, RLS read-only policies, and `service_role` write. Confirm `refresh-decisions` edge function inserts into `decisions_cache` on a cron schedule (document in `supabase/config.toml`).
- If we decide not to ship the Cloud path, delete `fetchDecision`'s Supabase calls and run rule-based scoring only.
- Add a smoke test that mocks `decisions_cache` rows and asserts `source: "cache"` is reachable.

### Phase 5 — Rotation + frequency cap (1 PR)

- Convert recency from `-3` score penalty to a hard exclusion when ≥2 other eligible programs exist.
- Add a per-page-view "shown set" (React context) so post-result + pre-footer + sidebar on the same page never duplicate the same affiliate.
- Reduce Coinbase priority from `10` → `8` so weighted rotation actually rotates among the 5 enabled programs.

### Phase 6 — Creative pipeline hygiene (1 PR)

- Add `responsive_group` to the Ledger skyscraper creatives ("ledger-skyscraper").
- When `pickCreative` returns `null`, still use `landing_url` of the program's primary creative for the SingleCard fallback href (preserve Impact attribution).
- Lint: add a `validateCreatives` test ensuring every program with `default_format: "image-banner"` has at least one creative per `(lang, zone-family)` it targets.

### Phase 7 — Governance + observability (1 PR)

- Gate `/qa/affiliates` behind `useAdminAuth`.
- Add a small admin dashboard page that reads `affiliate_events` and shows impressions / CTR per slug × affiliate × zone.
- Add `docs/AFFILIATE_ENGINE.md` with the diagram above and the registry/playbook for adding a new partner.

### Phase 8 — Decide on AdManager

- Either delete `AdManager` + `ArticleAdSlot` + `adConfig.ts` (no AdSense rollout planned), or wire a real publisher ID and document the policy of "house ads = affiliate engine, network ads = AdSense".

---

## 4. Acceptance criteria

- `bun run vitest run` green, including the new tests in Phases 1, 3, 4, 6.
- `node scripts/audit-affiliate-links.mjs` exits 0, including disabled programs (no PLACEHOLDER anywhere).
- `node scripts/audit-outbound-affiliate-http.mjs` exits 0 against live affiliate URLs.
- On `/tr/hesaplayicilar/bitcoin-dca` the rendered CTA, alt-text, and `data-affiliate-zone` impression event all carry `lang=tr` (no language drift).
- Visiting 5 distinct calculator pages in one session shows ≥3 distinct affiliates (rotation works).
- No `console.error` from missing Supabase tables in the network panel.

---

## 5. Open questions for you

1. Do you want me to keep the Cloud `decisions_cache` path (Phase 4) or rip it out and stay rule-based only? It's currently a no-op.
2. Should we delete the AdSense/Carbon scaffolding (`AdManager`, `ArticleAdSlot`, `adConfig.ts`) or keep it for a future rollout?
3. For each disabled partner (Bybit, MEXC, Trezor, CoinLedger, Paribu, BTCTurk, Swan, Kraken) — do you have real referral IDs to paste in now, or should I keep them disabled and just strip them from `INTENT_MAP`?
4. Confirm priority for Phase 1+2 first (link correctness + TR locale) before the deeper engine work.

&nbsp;

**Architectural Decisions for the Open Questions**

The recommended strategy for the architecture decisions, designed to optimize the codebase for performance, maintainability, and standard practices, includes:

1. **Delete the Cloud** `decisions_cache` **Path (Phase 4)**
  - **Decision:** Completely rip out the remote database lookups from `fetchDecision` and rely **strictly on the client-side local rule-based scoring engine**.
  - **Reasoning:** Since this is a client-side layout built via Lovable, making network requests to a database before rendering ad zones adds unnecessary layout shifts and latency. A robust, local deterministic calculation matching language, category, and priority provides zero-latency page loads.
2. **Delete the AdSense/Carbon Scaffolding**
  - **Decision:** **Delete** `AdManager.tsx`, `ArticleAdSlot.tsx`, and `adConfig.ts` entirely.
  - **Reasoning:** Your platform values clean design and alignment with privacy-conscious Bitcoin users. Keeping inert network scripts adds tracking overhead and bloat. Clean, localized house banners perform better for crypto utilities anyway. [[1](https://bitcoincalculator.tools/about)]
3. **Handle Disabled Partners via Code Sanitization**
  - **Decision:** Keep the future partners `enabled: false` inside `affiliates.config.ts`, but **completely scrub them from the active** `INTENT_MAP` **arrays**.
  - **Reasoning:** Moving them to a isolated metadata tracker (`WISHLIST_INTENT_MAP`) satisfies the audit criteria without polluting the weighted engine loop or throwing `PLACEHOLDER` exceptions during compilation.
4. **Enforce Implementation Sequencing (Phase 1 & 2 Priority)**
  - **Decision:** **Yes**, enforce this sequence. Link correctness and eliminating language leaks on the Turkish localization routes (`/tr/hesaplayicilar/*`) take top priority. They must be resolved before proceeding with the algorithmic rotation overhaul.

---