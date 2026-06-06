# Full SEO Audit — V2 at `bitcoincalculators.lovable.app`

Date: 2026-05-23 · Scope: V2 staging deployment + repo source. Production `bitcoincalculator.tools` still serves V1 (covered in `audit-2026-05-seo-full.md`).

---

## Executive summary

| Bucket | Result |
|---|---|
| Audit scripts re-run (8 core) | **8 / 8 pass** (3 warnings — QA pages) |
| Live HTML on lovable.app, all 7 sampled routes | **11,640 B SPA shell — identical for every URL** |
| Pre-rendered HTML (Googlebot UA) on lovable.app | **None** — EN and TR both shell-only |
| Pre-rendered HTML on V1 production (bitcoincalculator.tools) | EN ✓ (38–53 KB, canonical + JSON-LD) · TR ✗ (10,986 B shell) |
| sitemap.xml served from lovable.app | 186 entries (94 EN + 92 TR + 279 hreflang refs) — **good** |
| sitemap.xml on V1 production | 90 entries, 0 `/tr/*` — **stale** (V1 deploy artefact) |
| robots.txt | Healthy on both hosts (16 AI crawler allow-list, sitemap → canonical domain) |
| Security headers (lovable.app) | HSTS ✓, X-Content-Type-Options ✓, Referrer-Policy ✓, X-Frame-Options ✗ |
| HTML cache-control (lovable.app) | `no-cache, must-revalidate, max-age=0` — origin-hit every time |
| `vercel.json` headers | **Not applied** — Lovable hosting ignores it |

### The headline finding

V2 in this repo is **SEO-complete in source** (sitemap generator, per-route Helmet, JSON-LD, hreflang, llms.txt, robots.txt are all correct), but the **lovable.app staging host does not pre-render any route**, so crawlers see only the SPA shell on every URL. This is fine for staging — Google can still index post-hydration if it executes JS — but it means **promotion from V1 to V2 must include enabling pre-rendering on the custom domain for both EN and TR**, otherwise the current V1 problem (TR shell-only) carries forward and the EN regression (V1 EN was pre-rendered, V2 staging EN is not) ships too.

---

## P0 — Block before promoting V2 to `bitcoincalculator.tools`

| # | Issue | Evidence | Fix |
|---|---|---|---|
| P0-1 | **No pre-rendering on V2 host.** Every sampled route (`/`, `/calculators/dca`, `/calculators/retirement`, `/learn/what-is-a-satoshi`, `/tr`, `/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi`, `/tr/ogren/satoshi-nedir`) returns the identical 11,640 B SPA shell. Per-page `<title>`, canonical, JSON-LD are all missing in raw HTML — only the static fallback head from `index.html` ships. | curl with `User-Agent: Googlebot/2.1` against lovable.app for all 7 routes ⇒ same `etag` / same byte count / no `data-rh` per-page tags. | Before publishing V2 to the custom domain, confirm the hosting layer's pre-render (or SSR snapshot) is configured to: (a) execute every `<Route>` path in `App.tsx`, (b) include all `EN_TO_TR` Turkish slugs, (c) emit the post-hydration head & JSON-LD into the served HTML. V1 already does this for EN — replicate for TR. |
| P0-2 | **`vercel.json` is not enforced by Lovable hosting.** Response headers on lovable.app show neither the custom `X-Frame-Options`, the asset `Cache-Control: max-age=31536000`, nor the 301 redirects from `/calculators/what-if-bitcoin` etc. | `curl -I https://bitcoincalculators.lovable.app/` returns Cloudflare defaults only; `cache-control: no-cache, must-revalidate, max-age=0` on HTML and no `X-Frame-Options`. | Either (a) keep `vercel.json` and accept it only applies if/when the project is exported to Vercel, or (b) replicate the security headers and the 3 SEO 301 redirects through whatever Lovable supports on the custom domain (Cloudflare Rules or a hosting-config). Until then, the redirects in `vercel.json` are decorative on the lovable.app host. |
| P0-3 | **`/tr` and `/tr/*` legal mirrors are tagged `PRIVATE_EXEMPT`** by `audit-app-readiness.mjs`, which means they were intentionally removed from indexable surface in that script's allow-list — but they *are* public, indexable pages, and they *are* in the sitemap with hreflang. | `npm run audit:app` output: `- /tr → PRIVATE_EXEMPT`, `/tr/iletisim`, `/tr/gizlilik`, `/tr/kosullar` all marked private. | Move `/tr` out of the `PRIVATE_EXEMPT` list in `scripts/audit-app-readiness.mjs` (it's the TR homepage and must be indexable). `/tr/iletisim`, `/tr/gizlilik`, `/tr/kosullar` are correctly `POLICY_EXEMPT` counterparts to `/contact`, `/privacy`, `/terms` — reclassify accordingly so the audit is honest. |

---

## P1 — Fix soon, won't block promotion

| # | Issue | Evidence | Fix |
|---|---|---|---|
| P1-1 | **Dual `og:image:width` / `og:image:height` with `data-rh="true"`** in `index.html` even though the sibling `og:image` is plain. Helmet may emit duplicates per route, and adding `data-rh` to only some siblings is inconsistent. | Lines visible in shell HTML: `<meta property="og:image" content=...>` then `<meta property="og:image:width" content="1200" data-rh="true">`. | Drop `data-rh="true"` from the two `og:image:width/height` tags in `index.html` — Helmet doesn't recognise them as managed, and they confuse the dedupe heuristic for crawlers. |
| P1-2 | **3 QA/preview routes have no canonical** (`AffiliatePlacementQA`, `StateCardsQA`, `TypographyPreview`). Schema audit raises warnings. | `npm run audit:schema` → 3 warnings. | Add `<meta name="robots" content="noindex, nofollow">` (no canonical needed). These are internal preview pages and should be hidden from search regardless. |
| P1-3 | **`<title data-rh="true">` ships baked into `index.html`.** This means React-Helmet's first paint thinks it already owns the tag, but on a hard crawl with JS disabled the static title leaks to every route. | Shell HTML line 8: `<title data-rh="true">Bitcoin Calculators — 45+ Free Tools with Live BTC Prices</title>`. | Either remove `data-rh` from the static title (Helmet adds it on hydration anyway) or accept the EN fallback. Today it's fine for crawlers that run JS; bad for ones that don't. |

---

## P2 — Hygiene

| # | Issue | Fix |
|---|---|---|
| P2-1 | `audit-sitemap-crawl` script exists but isn't in any GH workflow. Add to nightly. |
| P2-2 | Same 15 external `target="_blank"` links missing `rel="noopener noreferrer"` (carried over from V1 audit, unchanged in V2 code). Codemod. |
| P2-3 | No `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400` on HTML responses. Lovable hosting currently serves `no-cache` — wasteful for crawlers. Negotiate with hosting layer or accept Cloudflare default once custom-domain-promoted. |

---

## Per-route head/schema matrix (lovable.app, current state)

| Route | Bytes | `<title>` | `canonical` | `JSON-LD` | hreflang |
|---|---:|---|---:|---:|---:|
| `/` | 11,640 | Static fallback only | 0 | 0 | 0 |
| `/calculators/dca` | 11,640 | Static fallback only | 0 | 0 | 0 |
| `/calculators/retirement` | 11,640 | Static fallback only | 0 | 0 | 0 |
| `/learn/what-is-a-satoshi` | 11,640 | Static fallback only | 0 | 0 | 0 |
| `/tr` | 11,640 | Static fallback only | 0 | 0 | 0 |
| `/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi` | 11,640 | Static fallback only | 0 | 0 | 0 |
| `/tr/ogren/satoshi-nedir` | 11,640 | Static fallback only | 0 | 0 | 0 |

Same matrix on V1 production for reference:

| Route | Bytes | `<title>` | `canonical` | `JSON-LD` |
|---|---:|---|---:|---:|
| `/` | 38,726 | per-route ✓ | 1 | 1 |
| `/calculators/dca` | 53,400 | per-route ✓ | 1 | 5 |
| `/tr` | 10,986 | static fallback | 0 | 0 |
| `/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi` | 10,986 | static fallback | 0 | 0 |

→ V1 EN works, V1 TR doesn't, V2 (both) doesn't yet. Promoting V2 must restore EN parity and finally fix TR.

---

## Sitemap reconciliation

| Surface | EN | TR | hreflang annotations |
|---|---:|---:|---:|
| `App.tsx` Routes (indexable, non-admin) | 94 | 94 | n/a |
| `EN_TO_TR` map | 93 mapped | 93 mapped | n/a |
| `scripts/generate-sitemap.mjs` output (V2 repo) | 94 | 92 | 279 |
| `https://bitcoincalculators.lovable.app/sitemap.xml` (V2 host) | **186 total — matches generator** ✓ | included ✓ | included ✓ |
| `https://bitcoincalculator.tools/sitemap.xml` (V1 prod) | 90 | **0** ✗ | **0** ✗ |

The V2 sitemap is correct. The V1 sitemap is stale and will be replaced the moment V2 is promoted.

---

## Audit script re-run (V2 repo)

```
audit:sitemap-routes      ✓ 186 URLs verified
audit:schema              ✓ 6 unique canonicals (3 warnings: QA pages)
audit:app                 ✓ readiness passed (P0-3 misclassification noted)
audit:slug-route-parity   ✓ 40 calc + 35 EN + 31 TR
audit:internal-links      ✓ TR locale parity, internal links clean
audit:tr-currency         ✓ no stray "$"
audit:tr-og-numbers       ✓ no leaks across 68 pages
audit:tr-related-slugs    ✓ 38 TR articles
audit:en-related-slugs    ✓ 38 EN articles
```

---

## Security headers (lovable.app, V2)

| Header | Status |
|---|---|
| `strict-transport-security: max-age=31536000; includeSubDomains` | ✓ |
| `x-content-type-options: nosniff` | ✓ |
| `referrer-policy: strict-origin-when-cross-origin` | ✓ |
| `x-frame-options` | ✗ (set in `vercel.json` but Lovable hosting doesn't read it) |
| `content-security-policy` | ✗ (none) |
| `permissions-policy` | ✗ (none) |

CSP and Permissions-Policy were not in scope for V1 either — flagging only.

---

## Caveats

- `lovable.app` is the **staging surface**. The site lives at `bitcoincalculator.tools`. Once V2 is promoted, the canonical-domain memory still applies: sitemap and robots.txt advertise `bitcoincalculator.tools/*` URLs. That's correct and intentional — do not rewrite them to the lovable.app host.
- Semrush data is meaningless for `bitcoincalculators.lovable.app` (no backlinks, no rankings — it's a staging URL). All keyword/authority signals stay tied to `bitcoincalculator.tools` until promotion.
- A11y was re-verified in the previous round (9/9 vitest a11y tests pass) and code hasn't changed since — not re-run here. Color-contrast still needs a real-browser Lighthouse run on the deployed theme.

---

## Prioritized fix backlog (V2-specific)

1. **[P0] Verify pre-rendering** for both EN and TR routes on the target custom domain *before* publishing V2. Test plan: curl `bitcoincalculator.tools/` and `bitcoincalculator.tools/tr/` after promotion with Googlebot UA — both should return >30 KB with per-route `<title>` and ≥1 JSON-LD block.
2. **[P0] Replicate `vercel.json` redirects + security headers** in whatever Lovable hosting actually honors (Cloudflare Rules, hosting config) — the 3 SEO 301s and X-Frame-Options are currently no-ops.
3. **[P0] Fix `audit-app-readiness.mjs`** classifications: `/tr` must not be `PRIVATE_EXEMPT`; `/tr/iletisim`, `/tr/gizlilik`, `/tr/kosullar` should be `POLICY_EXEMPT`.
4. **[P1] Add `noindex` to QA preview pages** (`AffiliatePlacementQA`, `StateCardsQA`, `TypographyPreview`).
5. **[P1] Remove `data-rh="true"`** from the 2 `og:image:width/height` tags and the static `<title>` in `index.html`.
6. **[P2] Wire `audit:sitemap-crawl` and a live-head smoke test into nightly CI** so V1's stale-sitemap class of bug can't recur on V2.
7. **[P2] Codemod 15 external `target="_blank"` → add `rel="noopener noreferrer"`**.

Promotion checklist (one-liner): *don't ship V2 until a curl-with-Googlebot to `/tr/<any-route>` returns >20 KB with a `<title>` matching the page.*

---

*Generated by full SEO audit pass against the V2 staging deployment. Source: 8 audit scripts re-run + 11 live curl probes (Googlebot UA) against `bitcoincalculators.lovable.app` and `bitcoincalculator.tools`.*
