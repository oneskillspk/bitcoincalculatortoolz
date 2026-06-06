# Full-Codebase SEO Audit — May 23 2026

Scope: entire repo (code, content, config, infra), plus runtime checks against production (`https://bitcoincalculator.tools`) and Semrush off-page data. Audit only — no code changes were made in this pass.

---

## Executive summary

| Bucket | Result |
|---|---|
| Audit scripts (16) | **16 / 16 pass** |
| SEO vitest suites (22 files, 790 tests) | **790 / 790 pass** |
| Sitemap entries (local generator) | 186 (94 EN + 92 TR mirrors with hreflang) |
| Sitemap entries (production) | **90 — stale; missing every TR route** |
| Pre-rendered routes (Googlebot UA) | EN: yes · **TR: no — shell only (10,987 B)** |
| Image `alt` coverage | clean (1 false positive in admin string literal) |
| External links missing `rel="noopener"` | 15 (P2) |
| Semrush Authority Score | 8 / 100 (new domain, normal) |
| Semrush organic keywords trend | 1 → 64 → **194** over last 3 months — climbing |

### Top 5 risks (prioritized)

1. **P0 — Production sitemap.xml is stale & TR-blind.** Live file has 90 entries, all `/calculators/*` and `/learn/*` EN routes only. Local `npm run sitemap` generates 186 entries with 94 `/tr/*` mirrors and full `xhtml:hreflang` annotations. The last published build did not pick up the regenerated sitemap, or the build/deploy pipeline isn't running `npm run sitemap` before publish. Result: Google can't discover any Turkish page from the sitemap.
2. **P0 — Turkish routes are not pre-rendered.** `/tr/`, `/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi`, etc. return only the 10,987-byte SPA shell — no `<title>`, no `<meta description>`, no canonical, no JSON-LD — even when fetched with `Googlebot/2.1` UA. EN equivalents serve fully-rendered HTML (38 KB+ with head + JSON-LD). Whatever pre-render layer powers EN routes is not configured for the `/tr/*` prefix.
3. **P1 — `rel="canonical"` double-emission risk.** `index.html` ships a default canonical pointing to `/` (fallback) and every page also emits one via `<Helmet>`. Helmet's `data-rh="true"` de-dupes `<meta>` but **not** `<link rel="canonical">`. Local render in `c2-jsonld-snapshots` shows only 1 canonical because Helmet replaces the static node on hydration, but social crawlers and non-JS bots may see two. Verify by curling 3 random EN routes and counting `rel="canonical"` occurrences (already verified for `/` → only 1; spot-check `/calculators/dca` and `/learn/*`).
4. **P1 — Spammy backlinks dominate anchor profile.** Top anchors in Semrush: `telegram @seo_anomaly`, `tg @bhs_links`, `tg @links_dealer` (≈295 unwanted links from 100+ throwaway domains). Authority Score 8 is depressed by this. Action: file Google **Disavow** for those domains. List below.
5. **P2 — Cloudflare `cf-cache-status: DYNAMIC` on key routes.** Cache is being bypassed for `/tr/*` and `/calculators/dca`. Combined with #2 this means crawlers always hit origin and always get the shell. Once #2 is fixed, set HTML cache to `public, s-maxage=300, stale-while-revalidate=86400`.

---

## Findings table

| # | Sev | Area | File / URL | Issue | Recommended fix |
|---|---|---|---|---|---|
| 1 | P0 | Sitemap | `public/sitemap.xml` (production) vs local generator | Live sitemap has 90 entries, 0 `/tr/`. Local `scripts/generate-sitemap.mjs` produces 186 with TR mirrors + `xhtml:hreflang`. | Trigger a fresh production build/publish so `npm run sitemap` (already wired into `"build"`) overwrites `public/sitemap.xml` and ships. Then resubmit in GSC. |
| 2 | P0 | Crawlability | `/tr/*` (all routes) | Served only as SPA shell (`10,987 B`, no head) even to Googlebot. EN routes are pre-rendered. | Extend the pre-render mechanism (Lovable hosting layer / prerender step) to include every path in `EN_TO_TR` values. If using a route-list config, mirror `EN_TO_TR` Turkish slugs. |
| 3 | P1 | Canonical | `index.html` line ~70 + every page `<Helmet>` | Static fallback `<link rel="canonical" href="https://bitcoincalculator.tools/">` ships alongside per-route Helmet canonical. `<link>` tags do not de-dupe in Helmet. | Remove the static `<link rel="canonical">` from `index.html`; let Helmet own it per route. Keep static `og:*` as social-crawler fallback. |
| 4 | P1 | Off-page | Backlink profile | ~295 spam links from `activeboard.com`, `rankinpublic.xyz`, `timsmagazines.com`, `auntsandysskinks.com`, etc. with telegram-channel anchors. | Submit GSC Disavow file. Full list in "Backlink risk" section. |
| 5 | P1 | Speed/SEO | `vercel.json` headers, Cloudflare cache | HTML responses for `/tr/*` and some `/calculators/*` return `cf-cache-status: DYNAMIC` — every crawler hit goes to origin. | After fix #2, add `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400` for HTML; immutable assets already cached correctly. |
| 6 | P2 | External links | 15 occurrences in `src/**/*.tsx` | `target="_blank"` without `rel="noopener"` (tabnabbing risk + minor SEO hygiene). | Run a codemod: any `<a target="_blank">` → add `rel="noopener noreferrer"`. |
| 7 | P2 | Robots | `public/robots.txt` (already healthy) | Good — explicit allow-list for 16 AI crawlers, sitemap declared. No action. | — |
| 8 | P2 | JSON-LD | EN home renders 1 JSON-LD block | Many calculator pages emit WebApplication + FAQPage + BreadcrumbList. Confirm via `c2-jsonld-snapshots` test — currently passing. | None. Continue snapshot test as the regression gate. |
| 9 | P3 | Images | `src/components/admin/AdminAffiliates.tsx:154` | Single `<img>` without `alt=` flagged, but it's a placeholder string inside a `placeholder=` prop — false positive. | No action. |
| 10 | P3 | CI gap | `.github/workflows/lighthouse.yml` exists but lhci runs on PR only | Audit scripts run in `npm run build`, but Lighthouse CI is not blocking on `main`. | Add a scheduled (daily) Lighthouse run against production to catch regressions between releases. |
| 11 | P3 | CI gap | `scripts/audit-sitemap-crawl.mjs` exists but not in `build` chain | The crawl audit (which would catch #1!) isn't wired to either `build` or any GH workflow. | Add `npm run audit:sitemap-crawl` to a nightly workflow against production. This would have caught the stale sitemap immediately. |
| 12 | P3 | i18n SEO | `GlobalHreflang.tsx` | Logic is sound and `sitemap-hreflang-validator` passes locally. But because TR pages aren't rendered (finding #2), hreflang only ships from the EN side. | Resolves automatically when #2 is fixed. |

---

## Sitemap ↔ routes ↔ hreflang reconciliation

| Source | EN routes | TR routes | hreflang annotations |
|---|---|---|---|
| `src/App.tsx` (`<Route>`) | 129 | 94 | n/a |
| `EN_TO_TR` in `src/utils/localizedRoutes.ts` | 94 mapped | 94 mapped | n/a |
| `public/sitemap.xml` (local generated) | 94 | 92 | 279 xhtml:link refs |
| `public/sitemap.xml` (PRODUCTION) | 90 | **0** | **0** |
| Pre-rendered HTML (Googlebot UA) | yes (sampled `/`, `/calculators/drawdown`, `/learn/what-is-a-satoshi` — all served full head) | **no** (sampled `/tr/`, `/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi` — both 10987 B shell) |

Gap actions: republish to refresh sitemap, then enable TR pre-rendering, then `audit:sitemap-crawl` will go green against production.

---

## Backlink risk — disavow candidates

Top spam-anchor domains from Semrush (counts ≈ links from that domain):

```
activeboard.com               87
rankinpublic.xyz              29
4lomza.pl                     14
ellak.gr                       9
sorgentelibera.org             9
timsmagazines.com              9
bergasushi.nu                  8
auntsandysskinks.com           7
carcenteronline.com            7
hxmetal.free.fr                7
```

Anchor texts on these are exclusively SEO-spam ("telegram @seo_anomaly - seo backlinks, black-links, traffic boost…", "tg @bhs_links", "tg @links_dealer"). Total spammy anchor links: ~295 from 200+ throwaway domains.

**Recommended:** create a `disavow.txt` containing these 10 domains (start) and submit via Google Search Console → Disavow tool. Expand with the full backlink export from Semrush once the connector is wired (see CI/Connector below).

---

## On-page SEO snapshot (Semrush)

- **Authority Score:** 8 / 100 (typical for a young domain — Trust 8/100 dragged down by spam links above).
- **Organic keyword growth:** 1 (Oct '25) → 8 (Jan '26) → 64 (Mar '26) → **194 (Apr '26)** — strong upward trend; the underlying SEO foundation is working.
- **Top-converting pages (Semrush, US database):**
  | Page | Keywords | Best position | Top keyword |
  |---|---:|---:|---|
  | `/calculators/drawdown` | 1 | **1** | "bitcoin 30 percent correction calculator" |
  | `/calculators/power-law` | 6 | 6 | "bitcoin power law" |
  | `/calculators/investment` | 2 | 14 | "bitcoin investment calculator" |
  | `/calculators/retirement` | 5 | 8 | "bitcoin retirement calculator" |
  | `/calculators/volatility` | 8 | 3 | "current bitcoin 30 day implied volatility 2025" |
  | `/learn/cf-benchmarks-brti-explained` | 45 | 5 | "cf benchmarks bitcoin real-time index" |
- **Top organic competitors:** `cfbenchmarks.com` (13k keywords / 29.9k traffic — institutional anchor), `cryptoreturncalculator.com`, `bitcoineracademy.com`, `bitcoinpower.law`, `smallake.kr`.

Action implications:
- The site is ranking on hard, money-keyword terms (`bitcoin power law`, `bitcoin retirement calculator`) — keep publishing in this lane.
- Once TR pre-rendering ships (P0 #2), the same content already exists in Turkish for 94 routes — that should unlock the TR (`tr`) Semrush database where current keyword count is **0**.

---

## What's already solid (don't break)

- **Per-page Helmet coverage** on all 65 page components — `seo-meta-coverage.test.tsx` passes against every EN + TR route.
- **JSON-LD schema diversity** — WebApplication, Article, FAQPage, BreadcrumbList, Dataset, SpeakableSpecification, Organization, WebSite. `inLanguage` parity enforced by `tr-jsonld-inlanguage.test.tsx`.
- **`robots.txt`** — explicit allow-list for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, Meta-ExternalAgent, plus 10 more AI crawlers.
- **`llms.txt`** — covers Türkçe section + 15+ TR URLs (asserted by `llms-txt-tr.test.ts`).
- **Accessibility** — all 9 a11y tests pass, ARIA roles fixed (group/aria-pressed pattern), `inert` on collapsed FAQ panels, hero CTA contrast bumped to `--primary-muted`.
- **Sitemap generator quality** — emits `xhtml:hreflang` per URL, generates 186 entries including all TR mirrors. The generator is good; the deploy is just stale.

---

## CI / connector gaps

| Gap | Impact | Recommendation |
|---|---|---|
| `audit:sitemap-crawl` not in CI | Would have caught stale production sitemap | Add to nightly GH Actions workflow |
| Lighthouse CI only runs on PR | Production regressions invisible | Daily scheduled run against `https://bitcoincalculator.tools` |
| No live HTML head smoke test | TR shell-only regression went unnoticed | New script: curl 5 EN + 5 TR routes, assert `<title>` and `<link rel="canonical">` present |
| Semrush connector not enabled | Can't export full backlink list for Disavow, can't track TR keyword growth | Connect Semrush (`standard_connectors--connect`) — covers backlink export, paid-search visibility, multi-country rank tracking, ongoing competitor monitoring |

---

## Prioritized fix backlog (ready to convert to tasks)

1. **[P0] Republish to refresh `sitemap.xml`** + verify `audit:sitemap-crawl` passes against production (5 min).
2. **[P0] Wire `/tr/*` into the pre-render pipeline** so Googlebot sees full HTML head + body. Likely a one-line config edit; verify by curl with Googlebot UA returning >10 KB and `<title>` present (15–30 min).
3. **[P1] Delete static `<link rel="canonical">` from `index.html`** to eliminate dual-canonical risk (2 min).
4. **[P1] Submit Disavow file** to GSC for the 10 top spam domains (15 min).
5. **[P1] Add `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400`** to HTML responses in `vercel.json` (5 min, after #2 lands).
6. **[P2] Codemod 15 external `target="_blank"`** links → add `rel="noopener noreferrer"` (10 min).
7. **[P3] Nightly GH Action** running `audit:sitemap-crawl` + a new live-head smoke test (20 min).
8. **[P3] Schedule daily Lighthouse CI** against production with budget thresholds (15 min).
9. **[P3] Enable Semrush connector** for backlink export + TR-market tracking (5 min user action).

Total time to clear P0+P1: ~40 minutes of work. Want me to open follow-up PRs for #1–#6?

---

*Generated by full-codebase SEO audit pass. Sources: 16 audit scripts, 790 vitest assertions, live curl probes (Googlebot UA), Semrush domain_analysis / top_pages / backlink_analysis / seo_trend / competitive_analysis.*
