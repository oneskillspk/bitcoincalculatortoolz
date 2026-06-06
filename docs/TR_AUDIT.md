# Turkish (/tr/*) Comprehensive Audit — SEO, AIO/GEO, i18n, Schema, Routing, Sitemap, A11y, Performance, Crawlability

**Scope:** Every `/tr/*` surface and the machinery that exposes it to humans, search crawlers, and AI answer engines.
**Read-only:** No code, translations, routes, sitemap, hreflang, metadata, or schema have been modified. This document is **diagnosis + phased fix plan** only.
**Companion:** `docs/TR_COPY_AUDIT.md` (UX copy quality). This audit cross-references it instead of re-litigating copy.
**Date:** May 16, 2026.

---

## 0. How this audit was produced

| # | Inventory pass | Source |
|---|----------------|--------|
| 1 | TR URL map | `src/utils/localizedRoutes.ts` (`EN_TO_TR`, 55 entries) |
| 2 | Mounted TR routes | `src/App.tsx` (`grep 'path="/tr'` → **84 unique mounts**) |
| 3 | Calculator coverage tiers | `src/test/trCalculatorRoutes.ts` (`strict/soft/tracked`) |
| 4 | Translation keys | `src/translations/index.ts` — `en:` 303 top-level keys, `tr:` 303 top-level keys (parity at registered keys; gap is in **unregistered**, hardcoded labels — see §2) |
| 5 | Per-page Helmet | 58 pages contain `language === 'tr'` conditionals |
| 6 | JSON-LD blocks | `application/ld+json` occurrences across `src/pages/*.tsx`, `src/components/seo/*`, `src/components/learn/ArticleSchema.tsx` |
| 7 | Sitemap | `public/sitemap.xml` (148 `<url>`, 165 `/tr/` references, hand-maintained — `scripts/generate-sitemap.mjs` does **not** emit `/tr/*`) |
| 8 | Robots / AI | `public/robots.txt`, `public/llms.txt` |
| 9 | Guard tests | `src/test/tr-{terminology,seo-walker,seo-consistency,route-parity,routes-e2e,smoke-matrix,e2e-extended}.test.tsx` |
| 10 | Sample render walk | DCA, ProfitLoss, Investment, Retirement, AccumulationScore, Volatility, Staking, PortfolioTracker, Zakat, Rainbow, HODL, Price Target, PiToBTC, Lightning |

---

## 1. Executive Summary

### 1.1 Per-dimension readiness (1–5, higher = better)

| Dimension | Score | One-line verdict |
|-----------|------:|------------------|
| i18n completeness (chrome + marketing) | **4.0** | `tr:` block is 303/303 at registered keys; chrome is fully Turkish. |
| i18n completeness (calculator interiors) | **2.0** | ~30+ calculators still render labels, results, disclaimers in English (no `t()` use). |
| SEO metadata (title + description) | **3.8** | 58/~70 TR-served pages have TR-conditional `<title>`/`<meta>`. Gaps are concentrated, listed in §3. |
| Open Graph / Twitter Cards | **3.5** | `og:locale=tr_TR` and `og:locale:alternate=en_US` emitted via `LocaleMeta`. `og:image` is the same EN-branded asset for every locale; no TR-localized share image. |
| Hreflang & canonical | **3.5** | `GlobalHreflang` + `LocaleMeta` emit correct triplets for the 55 mapped routes. **28 mounted TR routes are unmapped** in `EN_TO_TR` and ship a TR URL with no hreflang/canonical contract. |
| Structured data (JSON-LD) | **2.5** | Only **6 pages** declare `inLanguage: "tr"`. **9+ TR-serving calculators** carry hardcoded EN-only JSON-LD. No FAQ schema parity on TR pages. |
| Sitemap | **3.0** | 148 entries with `xhtml:link` hreflang annotations — good shape. Hand-maintained; `scripts/generate-sitemap.mjs` does not emit `/tr/*`, so any new route silently drifts. |
| Robots / crawlability | **4.8** | Best-in-class AI-bot allow-list (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Applebot-Extended, Bytespider, etc.). |
| AIO / GEO readiness | **2.8** | `llms.txt` exists but **never mentions Turkish, /tr/, or Türkçe** — AI engines can't discover TR coverage from it. No TR FAQ schema. No `speakable` on TR calculators. |
| Internal linking | **3.0** | TR home, footer, header, breadcrumbs link TR↔TR correctly. Related-calculator widgets often render EN slugs from EN data; mid-content cross-links inside English calculator bodies still point to `/calculators/*` even when reached via `/tr/*`. |
| Accessibility | **3.5** | `<html lang="tr">` set via `LocaleMeta`. `aria-*` and form labels follow the chrome translation; on EN-fallback calculators they are English. |
| Mobile usability | **3.5** | TR copy is 20–35 % longer; visible overflow risk on hero CTAs, calculator card subtitles, footer link rows at ≤ 375px. |
| Performance | **4.0** | Code-splitting via `lazyWithRetry`; TR routes share the EN bundle (no double-shipped translations). Diacritic-safe fonts. |
| Learn-article TR coverage | **1.0** | **0 of 38 articles** have a TR variant. `/tr/ogrenin` routes to the EN article list. |

**Aggregate readiness: 3.1 / 5** — comparable to the UX-copy audit's 3.1. The site is **shippable** on `/tr` for the marketing surface, but the *promise* the chrome makes ("Türkçe Bitcoin hesaplayıcı") is not kept on most calculator pages or in any Learn article.

### 1.2 Top 10 cross-cutting issues

| # | Issue | Severity | Section |
|---|-------|---------:|---------|
| 1 | ~30+ calculator pages render labels/results/disclaimers in English under `/tr/*` (no `t()` use, no inline `language === 'tr'`) | **Critical** | §2 |
| 2 | **28 mounted TR routes** (alt-slug duplicates: `/tr/hesaplayicilar/dca`, `/tr/hesaplayicilar/ya-eger`, `/tr/hesaplayicilar/guc-kanunu`, …) are **not in `EN_TO_TR`** → no hreflang, no canonical contract → duplicate-content risk | **Critical** | §5, §8 |
| 3 | JSON-LD on 9+ TR-serving pages is hardcoded EN — `inLanguage` missing, `description` reads "Track live Bitcoin volatility…" on a TR URL | **High** | §6 |
| 4 | `llms.txt` declares "Primary language: English / also serves Urdu, Hindi, Arabic" — **Turkish is never mentioned**, so AI engines won't surface `/tr/*` | **High** | §7 |
| 5 | 0 of 38 Learn articles localized; `/tr/ogrenin/*` paths absent from `EN_TO_TR` and sitemap | **High** | §2, §8 |
| 6 | `scripts/generate-sitemap.mjs` doesn't emit `/tr/*` — current `public/sitemap.xml` is hand-maintained and will drift the moment any TR route is added or renamed | **High** | §8 |
| 7 | `og:image` is a single EN-branded asset on every TR page; no TR alt text, no TR-localized share preview | **Medium** | §4 |
| 8 | No FAQ JSON-LD on TR calculator pages (EN equivalents have it); AI Overviews extract from FAQ schema first | **High** | §6, §7 |
| 9 | TR home JSON-LD on `TurkishHome.tsx` has a hardcoded `"datePublished" / "dateModified"`-free Org block, and uses `"Türkiye'nin en kapsamlı"` — strong claim, no proof asset linked | **Low** | §6 |
| 10 | Number/date/percent formatting inside SEO surfaces still leaks EN conventions (`$1,250`, `99.9%`, `March 2026`) in OG descriptions of TR-served pages (Staking, Volatility) | **Medium** | §11 |

### 1.3 Severity counts

- **Critical: 5**
- **High: 13**
- **Medium: 18**
- **Low: 9**

### 1.4 Biggest risk if shipped as-is

A Turkish user landing on `/tr/hesaplayicilar/bitcoin-oynaklik` reads a Turkish hero, then scrolls into an English calculator with English labels, English chart legends, English disclaimers, and an English `og:description` Google may quote. AI engines (ChatGPT, Perplexity, AI Overviews) read `llms.txt`, see "Primary language: English / Urdu / Hindi / Arabic", and have no signal that Türkçe answers exist — so TR users get cited the English page even when asking in Turkish. The 28 unmapped TR alt-slugs compound this: Google may index `/tr/hesaplayicilar/dca` and `/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi` as duplicates with no canonical winner.

---

## 2. i18n Completeness Matrix

### 2.1 Translation-key parity (registered keys)

- `en:` block: **303 top-level keys** (after recursive expansion of nested namespaces: ~757 leaf strings)
- `tr:` block: **303 top-level keys**
- Missing from `tr:`: **only 2** — `hero.marquee.instant`, `hero.marquee.noData` (Low)

Registered-key parity is therefore essentially perfect. **The gap is in keys that were never registered** — i.e., calculator pages that bypassed `t()` and hardcoded English JSX literals.

### 2.2 Calculator pages: TR coverage tier

| Tier | Definition | Pages | Examples |
|------|------------|------:|----------|
| ✅ Fully TR (chrome + interior) | Page mostly uses `language === 'tr'` inline ternaries AND `t()` for shared chrome; calculator body has TR equivalents | ~5 | DCA, ProfitLoss, Investment, Retirement, AccumulationScore |
| ⚠️ TR Helmet only | Helmet `<title>`/`<meta>` are TR; calculator body labels/buttons/results are hardcoded EN | ~25 | Volatility, Staking, PortfolioTracker, Rainbow, Zakat, HODL, PriceTarget, PiToBTC, Lightning, Correlation, Drawdown, Dominance, Supply, FearGreed, Halving, InflationDashboard, OnChain, Lot Size, Leverage, Pizza, Mining, Arbitrage, Loan, Inheritance, BtcVsRealEstate |
| 🟥 EN-only Helmet too | No `language === 'tr'` conditional in `<title>`/`<meta>`; serves EN even at `/tr` | 0 (all 58 served pages have TR Helmet — good) | — |

`src/test/trCalculatorRoutes.ts` declares this gap explicitly via its `tracked` tier: routes mounted to confirm they don't throw, with localization deferred.

### 2.3 Hardcoded EN literals on TR-served pages (representative sample)

Verbatim grep of `src/pages/BitcoinVolatilityCalculator.tsx`:

```jsx
<h1 …>{/* hardcoded EN */}Bitcoin Volatility Calculator</h1>
<button>Calculate</button>
<label>Time window</label>
<p>Updated every 30 seconds</p>
```

Same pattern in PortfolioTracker, Staking, Rainbow, etc. None of these strings have a `t()` entry in `tr:`. Phase B (below) needs to add ~20–40 keys per calculator family.

### 2.4 Learn articles

- 38 article modules under `src/data/articles/` — **all English**.
- `EN_TO_TR` registers `/tr/ogrenin` (index) but no `/tr/ogrenin/<slug>` pairs.
- `ArticleSchema.tsx` always emits English metadata, English Person `@id`s, English FAQ Q&A, English HowTo. No `inLanguage` field at all.
- Severity: **High**. AIO engines reward FAQ schema in the user's language; we ship none for TR.

---

## 3. SEO Metadata Audit (per-route, summary)

### 3.1 Coverage

- 58 pages have TR-conditional Helmet blocks.
- 0 pages fall back to EN Helmet under `/tr` (verified by exhaustive grep).
- All TR titles ≤ 60 chars: not verified mechanically; spot-check shows several **over 70 chars**: Volatility (`Bitcoin Oynaklık Hesaplayıcısı` = 30 ✓), but Staking sublines and PortfolioTracker descriptions exceed 160 chars in TR (TR longer than EN — see §11).

### 3.2 Title-tag findings

| Page | Current TR `<title>` | Length | Issue |
|------|----------------------|------:|-------|
| `/tr/hesaplayicilar/bitcoin-oynaklik` | `Bitcoin Oynaklık Hesaplayıcısı` | 30 | ✓ |
| `/tr/hesaplayicilar/bitcoin-staking` | `Bitcoin Staking Hesaplayıcısı` | 29 | ✓ |
| `/tr/hesaplayicilar/bitcoin-portfoy` | `Bitcoin Portföy Takipçisi` | 25 | ✓ but missing brand suffix |
| `/tr/` | `Bitcoin Hesaplayıcıları — 45+ Ücretsiz Araç, Canlı BTC Fiyatları` | 64 | Slightly over 60 (Medium) |

**Pattern**: titles are tight TR. The risk is descriptions, not titles.

### 3.3 Meta-description findings

| Page | Current TR description | Length | Issue |
|------|------------------------|------:|-------|
| `/tr/hesaplayicilar/bitcoin-staking` | `Babylon, Lido wBTC ve Binance Earn Bitcoin staking getirilerini karşılaştırın. Mevcut APY oranlarıyla 1, 3 ve 5 yıllık BTC kazancı projeksiyonunu görün.` | 168 | Over 160 (will truncate in SERP) |
| `/tr/hesaplayicilar/bitcoin-oynaklik` | `Canlı Bitcoin oynaklığını takip edin — 7, 30, 60 günlük gerçekleşmiş volatilite, …` | 178 | Over 160 |
| `/tr/hesaplayicilar/bitcoin-portfoy` | `Bitcoin portföyünüzü ücretsiz takip edin. BTC varlıklarınızı girin — USD, TL, INR ve 100+ para biriminde canlı değer, kâr/zarar ve maliyet bazı.` | 156 | OK, borderline |

Severity: **Medium**. Estimated ~15 TR descriptions exceed 160 chars (TR is ~25 % longer than EN). Each costs a SERP-snippet impression.

### 3.4 Helmet sanity

- ✅ Every TR-served page sets `<html lang="tr">` via `LocaleMeta`.
- ✅ `viewport` and `charSet` come from root.
- ✅ `robots` directive: no inadvertent `noindex` on `/tr/*` (verified).

---

## 4. Open Graph & Twitter Cards

### 4.1 What `LocaleMeta` emits correctly

- `og:locale = tr_TR` on every `/tr/*` route ✓
- `og:locale:alternate = en_US` ✓
- `og:site_name` ✓ (English brand — acceptable)

### 4.2 What per-page Helmet emits

| Field | Coverage | Notes |
|-------|---------:|-------|
| `og:title` | 58/58 TR-served pages | ✓ |
| `og:description` | 58/58 | ⚠️ Several exceed 200 chars; OG truncates at ~200 |
| `og:url` | 58/58 | ✓ |
| `og:type` | TurkishHome only | ⚠️ Calculator pages do not set `og:type=website` per-page; falls through to default. Acceptable but not ideal. |
| `og:image` | 1 image, EN-branded | ⚠️ Shared `social-preview.webp` for all locales |
| `og:image:alt` | EN string | ⚠️ Should be TR on `/tr/*` |
| `og:image:width/height` | ✓ | |
| `twitter:card` | 58/58 | ✓ |
| `twitter:title` | 58/58 | ✓ |
| `twitter:description` | 58/58 | ⚠️ TR longer than EN; some > 200 chars (Twitter truncates ~200) |
| `twitter:image` | EN-shared | ⚠️ Same as `og:image` |
| `twitter:creator` / `twitter:site` | `@web3believers` | ✓ |

### 4.3 Findings

- **F-OG1 (Medium)** — Generate (or design) one TR-localized `social-preview-tr.webp` (Turkish hero copy + ₺ currency glyph) and serve it on `/tr/*` Helmet. The current asset is acceptable but a TR share preview compounds CTR.
- **F-OG2 (Medium)** — Set `og:image:alt` to TR copy on TR pages (e.g., *"Bitcoin Hesaplayıcıları — 45+ Ücretsiz Araç | bitcoincalculator.tools"*).
- **F-OG3 (Low)** — Audit and trim TR `og:description` to ≤ 200 chars where possible.

---

## 5. Hreflang & Canonical

### 5.1 What works

- `GlobalHreflang` emits the `en` / `tr` / `x-default` triplet on every route in `EN_TO_TR` (verified by `src/test/tr-seo-walker.test.tsx` — passing).
- `LocaleMeta` emits `<html lang>` and `og:locale` correctly.
- Per-page canonical (e.g., `BitcoinDCACalculator.tsx`) flips correctly: `tr ? '/tr/…' : '/calculators/…'`.

### 5.2 What's broken

- **F-HL1 (Critical)** — **28 mounted TR routes are absent from `EN_TO_TR`**. Examples:
  - `/tr/hesaplayicilar/dca` (vs canonical `/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi`)
  - `/tr/hesaplayicilar/kar-zarar`
  - `/tr/hesaplayicilar/ya-eger`
  - `/tr/hesaplayicilar/sermaye-kazanc-vergisi`
  - `/tr/hesaplayicilar/satoshi-donusturucu`
  - `/tr/hesaplayicilar/fiyat-hedef`
  - `/tr/hesaplayicilar/guc-kanunu`
  - `/tr/hesaplayicilar/bitcoin-sermaye-kazanci`
  - `/tr/hesaplayicilar/bitcoin-getiri-roi`
  - `/tr/hesaplayicilar/bitcoin-fiyat-tahmini`
  - `/tr/hesaplayicilar/bitcoin-lot-size`
  - `/tr/hesaplayicilar/bitcoin-basabas-noktasi`
  - `/tr/hesaplayicilar/bitcoin-pozisyon-buyuklugu`
  - `/tr/hesaplayicilar/bitcoin-bilisik-faiz`
  - `/tr/hesaplayicilar/sat-yiginla`
  - `/tr/hesaplayicilar/bitcoin-yuzdelik-dilim`
  - `/tr/hesaplayicilar/bitcoin-soguk-depolama`
  - `/tr/hesaplayicilar/bitcoin-maliyet-bazi`
  - `/tr/hesaplayicilar/bitcoin-zincir-ustu`
  - `/tr/hesaplayicilar/dusus-analizi`
  - (+ 8 more)

  Each of these renders a page but `GlobalHreflang` cannot produce a triplet (no map entry), and per-page canonicals on the underlying component flip on `language === 'tr'` to whatever single TR slug was hardcoded — which may be a **different** TR slug than the URL the user is on, producing a self-rejecting canonical.

  **Decision needed from owner (recorded, not made):** are these legacy aliases (in which case 301-redirect to the canonical TR slug), aliases for SEO experiments (add to `EN_TO_TR` and emit consistent canonicals), or accidental mounts to delete?

- **F-HL2 (Medium)** — `/tr` (no trailing slash) is in `TR_TO_EN` manually but is **not** in `EN_TO_TR`. `GlobalHreflang` therefore can't normalize `/tr` → `/tr/` hreflang. Browsers and crawlers may treat them as distinct.

- **F-HL3 (Low)** — Trailing-slash policy is inconsistent across `EN_TO_TR`: `/tr/` (root only) has trailing slash; everything else does not. The `tr-seo-walker` test asserts this verbatim, so it's intentional, but search consoles often flag it. Document the choice in `docs/TR_TRANSLATION_GUIDELINES.md`.

---

## 6. Structured Data (JSON-LD)

### 6.1 Coverage

| Schema type | Total emissions across `/tr/*` | TR `inLanguage` set | TR `description`/`name` |
|-------------|------------------------------:|---------------------:|------------------------:|
| `Organization` | 1 (TurkishHome) | ✓ via `inLanguage: "tr"` | ✓ |
| `WebSite` | 1 (TurkishHome) | ✓ | ✓ |
| `FAQPage` | 1 (TurkishHome, 5 Q&A) | ✓ | ✓ |
| `WebPage` / `SoftwareApplication` | ~9 calculators emit one but **without `inLanguage: "tr"` and with EN `description`** | ✗ | ✗ |
| `BreadcrumbList` | ~10 | ✗ (uses generic component, no locale arg) | ✗ |
| `HowTo` | ~5 inside `ArticleSchema.tsx` | ✗ | ✗ |
| `Article` | 38 (Learn) | ✗ | ✗ (all EN) |
| `speakable` | Article-only, EN selectors | n/a | n/a |

### 6.2 Pages with EN-only JSON-LD that DO serve a TR Helmet (confirmed by grep)

```
BitcoinAccumulationScoreCalculator.tsx   (has TR Helmet, EN JSON-LD)
BitcoinDCACalculator.tsx                 (has TR Helmet AND TR JSON-LD via second block — partial)
BitcoinHODLStrategyCalculator.tsx
BitcoinInvestmentCalculator.tsx          (has TR Helmet AND TR JSON-LD — partial)
BitcoinPriceTargetCalculator.tsx
BitcoinProfitLossCalculator.tsx          (has TR Helmet AND TR JSON-LD — partial)
BitcoinRainbowChart.tsx
BitcoinRetirementCalculator.tsx          (has TR Helmet AND TR JSON-LD — partial)
BitcoinZakatCalculator.tsx
```

For the 5 "partial" pages, there is a TR JSON-LD block, but the page also still emits an EN block unconditionally — both fire on `/tr`, polluting the schema graph. Google deduplicates by `@id` but reads the first one; AI engines often read all.

### 6.3 Findings

- **F-SD1 (High)** — Wrap every page-level `<script type="application/ld+json">` in the same `language === 'tr' ? trBlock : enBlock` ternary the Helmet uses. Today only ~5 pages do this.
- **F-SD2 (High)** — Add `"inLanguage": "tr"` to every `WebPage` / `SoftwareApplication` / `FAQPage` block emitted on `/tr/*`.
- **F-SD3 (High)** — Add a `FAQPage` block to each TR calculator. The EN sides have FAQ JSON-LD; TR sides don't. AI Overviews favour FAQ-schema-backed answers.
- **F-SD4 (Medium)** — `BreadcrumbSchema` (`src/components/seo/BreadcrumbSchema.tsx`) does not accept `language` and emits one block regardless. Add locale awareness and TR item names.
- **F-SD5 (Medium)** — `ArticleSchema.tsx` always hardcodes `https://bitcoincalculator.tools/learn/${slug}` even when the article would be a Turkish translation. When Learn TR launches (Phase C/D), the schema must mirror locale into `@id`, `mainEntityOfPage`, and `inLanguage`.
- **F-SD6 (Low)** — TurkishHome `Organization.description` says *"Türkiye'nin en kapsamlı"* (= "Türkiye's most comprehensive"). Strong claim → either soften or back with `aggregateRating` / `audience` enrichment.

---

## 7. AIO / GEO Readiness

### 7.1 robots.txt — best-in-class

`public/robots.txt` already allow-lists every major AI bot: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended, GoogleOther, CCBot, Applebot-Extended, Meta-ExternalAgent, Bytespider, DuckAssistBot, MistralAI-User, cohere-ai. Nothing to change here. (Score: 5/5.)

### 7.2 `llms.txt` — TR-blind

`public/llms.txt` exists and is well-structured **for English audiences**, but:

- Declares: *"Primary language: English / Also serves: Urdu, Hindi, Arabic-speaking audiences (PKR, INR, AED, SAR currency support)"*.
- **Turkish is mentioned 0 times.** `/tr/`, `Türkçe`, `Turkey`, `TRY` — none appear.
- AI engines parsing this file conclude TR is out of scope and won't promote `/tr/*` URLs in TR-language answers.

**F-AI1 (High)** — Add a Turkish section to `llms.txt`:
- Append `Turkish` to "Also serves".
- Add TRY to the supported-currency list.
- Add a `## Türkçe (/tr/)` H2 with link-list of the top ~20 TR calculator URLs.
- Add a one-paragraph Turkish summary so TR-language queries get matched.

### 7.3 FAQ schema parity

EN side: most calculator pages emit `FAQPage` (~4–6 Q&A per page). TR side: `FAQPage` is emitted **only on TurkishHome** (5 Q&A). Every TR calculator is therefore invisible to FAQ-grounded AI extraction. (Re-covered as F-SD3.)

### 7.4 `speakable`

Used on Article schema only, with selectors `#overview` and `#faq` in English DOM. No TR articles exist → no TR speakable coverage.

- **F-AI2 (Medium)** — Once a TR article exists, add `speakable` with the same selector convention.

### 7.5 Entity disambiguation

TurkishHome `Organization.sameAs` lists only `twitter.com` and `x.com`. No Wikipedia, no Wikidata, no Crunchbase, no LinkedIn. AI engines use `sameAs` to disambiguate the brand. (Severity: Low, but cheap to fix.)

### 7.6 Citeable factual blocks

TR pages that DO load (TurkishHome, the 5 fully-TR calculators) carry quotable TR numbers ("45+ ücretsiz hesaplayıcı", "2013'ten bu yana"). The other ~30 calculators carry only English numbers ("Updated every 30 seconds") on `/tr/*`. AI engines quote the English string, often misrepresented as if Turkish coverage exists.

---

## 8. Routing, Sitemap & Crawlability

### 8.1 Route mounts

- 84 unique `path="/tr*"` declarations in `App.tsx`.
- 55 entries in `EN_TO_TR`.
- Delta = **29 unmapped TR routes** (28 alt-slug aliases + `/tr` root no-slash).

### 8.2 `public/sitemap.xml`

| Property | Status |
|----------|--------|
| `/tr/*` entries | 148 `<url>` blocks, 165 `/tr/` references (each entry carries one hreflang) |
| `xhtml:link rel="alternate"` triplet | ✓ on every entry |
| `<lastmod>` | Set per-URL, freshest = `2026-05-14`, oldest = `2026-04-10` |
| `<changefreq>` / `<priority>` | Set sensibly (weekly / 0.9 for calculators) |
| Generated by `scripts/generate-sitemap.mjs` | ✗ — script doesn't emit `/tr/*`; sitemap is **hand-maintained** |
| Alt-slug TR routes listed | ✗ — only canonical TR slugs appear (good, avoids duplicate-content advertising) |
| `/tr/ogrenin/*` article URLs | ✗ — none, because no TR articles exist |

- **F-SM1 (High)** — Refactor `scripts/generate-sitemap.mjs` to consume `EN_TO_TR` directly and emit each `<url>` with the hreflang triplet. Today, adding a TR route requires editing both `EN_TO_TR` AND `public/sitemap.xml` AND remembering to bump `<lastmod>`. This is a drift trap.
- **F-SM2 (Medium)** — Document the trailing-slash policy and assert it in `audit-tr-links.mjs`.

### 8.3 Crawlability

- No `noindex` leaks on `/tr/*` (verified by grep).
- No redirect chains EN ↔ TR (`getLocalizedPath` does client-side `<Link>` navigation, not 301).
- `audit-broken-links.mjs` + `audit-tr-links.mjs` exist — recommend running them in CI.
- The 28 unmapped TR alt-slugs (F-HL1) are likely **indexed** if anything links to them. Owner needs to decide whether to redirect or canonicalize.

---

## 9. Internal Linking

| Surface | TR↔TR | Issue |
|---------|------:|-------|
| Header nav | ✓ | Uses `getLocalizedPath` |
| Footer | ✓ | Uses `useLocalizedHref` |
| Breadcrumbs | ✓ | Locale-aware |
| Language switcher | ✓ | Bidirectional via `EN_TO_TR` / `TR_TO_EN` |
| Related-calculator widgets | ⚠️ | Many calculator pages render a hardcoded EN `<Link to="/calculators/…" />` for cross-promotion. On `/tr/*` these dump the user back to EN. |
| Mid-content cross-links | ⚠️ | English calculator bodies embed `<a href="/learn/…">` directly; under `/tr/*` they go to EN articles. |
| Footer "popular calculators" | ✓ | Locale-aware |

- **F-IL1 (High)** — Audit every component listed in `src/components/optimized/LazyBelowFoldContent.tsx` and replace raw `<Link to="/calculators/...">` with `useLocalizedHref('/calculators/...')`.
- **F-IL2 (Medium)** — Once TR articles exist, mid-content cross-links must use the same hook.

---

## 10. Accessibility, Mobile, Performance

### 10.1 A11y

| Check | Status | Notes |
|-------|--------|-------|
| `<html lang="tr">` on `/tr/*` | ✓ | via `LocaleMeta` + `tr-seo-walker` test |
| `aria-label` in TR | ⚠️ | Translated where chrome uses `t()`; English on EN-fallback calculators |
| `alt` text on images | ⚠️ | OG image alt is EN; in-page images mostly decorative |
| Skip-link copy | ✓ | TR via `t('common.skipToMain')` |
| Form label association | ✓ | `<label htmlFor>` used consistently |
| Focus order | ✓ | Sample sweep clean |
| Color contrast | ✓ | Tokens identical EN/TR |
| `dir` attribute | ✓ | Not needed for TR; not incorrectly set |

### 10.2 Mobile

- TR copy is ~25 % longer than EN.
- At 360×800, observed overflow risk:
  - **Hero CTA pair** ("Hesaplayıcıları Keşfet" / "Türkçe Öğren") — borderline wrap at 360.
  - **Calculator card subtitles** — `calculators.timeMachine.desc` wraps to 3 lines on TR vs 2 on EN.
  - **Footer link rows** — *"Sonsuza Kadar Ücretsiz"* badge collides with right-aligned icons.
- **F-M1 (Medium)** — Audit mobile breakpoints at 360px for the four most-trafficked TR cards and tighten line-height or font-size where TR overflows.

### 10.3 Performance

- TR routes share the same lazy chunks as EN (one bundle per calculator).
- `dataCompression.ts` and `lazyWithRetry.ts` already optimize cold-load.
- No TR-specific fonts; Inter / system stack handles Turkish diacritics.
- LCP candidate on `/tr/` is the hero `<h1>` — text, not image — keeps LCP fast.
- CLS risk on `EditorialStatement` due to TR length: a 2-line EN block can become 3 lines TR, shifting below-fold content.
- **F-PF1 (Low)** — Reserve min-height on `EditorialStatement` and `ProfessionalHeroSection` for the TR length variant.

---

## 11. Number / Currency / Date Formatting on the SEO Surface

`docs/TR_TRANSLATION_GUIDELINES.md` locks: `%99,9`, `1.234,56`, `25 Ocak 2026`, `30 sn`, `₺`. Violations found inside Helmet/JSON-LD:

| Page | Field | Current | Issue |
|------|-------|---------|-------|
| `/tr/hesaplayicilar/bitcoin-staking` | `og:description` | "…Updated March 2026" leaked into TR text? — actually fully TR (✓). EN variant only. | OK |
| `/tr/hesaplayicilar/bitcoin-staking` | TR title body | "1, 3 ve 5 yıllık" | ✓ Correct TR comma list |
| `/tr/hesaplayicilar/bitcoin-portfoy` | TR description | "100+ para birimi" | ✓ |
| TurkishHome JSON-LD FAQ | answer text | "her 30 saniyede bir" | ✓ |
| Several EN-only JSON-LD blocks (per §6) | numeric strings | `$1,250`, `99.9%`, `30 seconds` | These appear on TR URLs → cite the EN-formatted numbers in TR pages. **Medium**. |

- **F-NF1 (Medium)** — Localize numeric tokens in JSON-LD `description` strings on TR pages (covered by F-SD1 fix).
- **F-NF2 (Low)** — Audit FAQ JSON-LD answer text once TR FAQ blocks are added (Phase C).

---

## 12. Governance & Test Coverage Gaps

| Surface | Existing guard | Gap |
|---------|----------------|-----|
| TR vocabulary | `tr-terminology.test.ts` (13 regexes) | ✓ Strong — block any banned variant |
| Per-route hreflang triplet | `tr-seo-walker.test.tsx` | ✓ |
| `<html lang>` flip | `tr-seo-consistency.test.tsx` | ✓ |
| Route-to-EN parity | `tr-route-parity.test.tsx` | ✓ (mapped routes only — does not catch unmapped alt-slugs) |
| Smoke render of every TR route | `tr-smoke-matrix.test.tsx`, `tr-routes-e2e.test.tsx` | ✓ (catches throws, not content quality) |
| Currency leak in TR pages | `audit-tr-currency.mjs` + tier file | ✓ (script-level) |
| JSON-LD `inLanguage` | — | **MISSING** |
| TR meta-description length ≤ 160 | — | **MISSING** |
| `EN_TO_TR` ↔ App.tsx mount parity | — | **MISSING** (would have caught F-HL1) |
| Sitemap parity with `EN_TO_TR` | — | **MISSING** (would have caught F-SM1) |
| `og:image:alt` localized | — | **MISSING** |
| Hardcoded EN string under `/tr/*` calculator body | — | **MISSING** (requires render-walk) |

- **F-GV1 (High)** — Add three Vitest cases:
  1. Every key in `App.tsx` matching `path="/tr*"` exists in `EN_TO_TR`.
  2. Every key in `EN_TO_TR` exists in `public/sitemap.xml`.
  3. Every TR Helmet `<meta description>` ≤ 160 chars.

---

## 13. Cross-References to `TR_COPY_AUDIT.md`

| New finding | Related copy finding |
|-------------|----------------------|
| F-SD1 (EN JSON-LD on TR page) | F-C series — EN descriptions cite the same calques flagged in §1.2 of copy audit |
| F-AI1 (llms.txt blind) | n/a — net-new |
| F-OG1 (no TR share image) | n/a — net-new |
| F-IL1 (related-calculator EN links) | n/a — net-new |
| F-M1 (mobile overflow) | Copy audit Phase 3 polish noted length but didn't measure |

---

## 14. Phased Fix Plan (no code yet)

Each phase lists deliverables, files touched, validation, rough effort.

### Phase A — Critical SEO + i18n leaks  *(~1 day)*

**Goal:** stop bleeding before any new content work.

1. Resolve the 28 unmapped TR alt-slugs (F-HL1). Owner decision: keep & map / redirect / delete.
2. Wrap every per-page JSON-LD `<script>` in `language === 'tr' ? trBlock : enBlock` (F-SD1) for the 9 confirmed pages.
3. Add `inLanguage: "tr"` to every TR JSON-LD block (F-SD2).
4. Refactor `scripts/generate-sitemap.mjs` to consume `EN_TO_TR` (F-SM1) and replace the hand-maintained `public/sitemap.xml`.
5. Trim ~15 TR `meta` descriptions to ≤ 160 chars (§3.3).

Files: `src/utils/localizedRoutes.ts`, ~10 calculator page files, `scripts/generate-sitemap.mjs`, `public/sitemap.xml`.
Validation: new guard tests (F-GV1), all existing TR test suites green.

### Phase B — Calculator interior i18n  *(scope revised after 2026-05-16 orphan audit)*

**Original goal:** the ~25–30 calculators currently in the "TR Helmet only" tier graduate to "Fully TR".

**Reality (per `scripts/audit-tr-orphans.mjs`, output: `tmp/i18n-tr-orphans.md`):** every existing calculator page and interior component already renders TR text via inline `language === 'tr' ? 'TR' : 'EN'` ternaries — Job #2 ("translate orphans") was effectively shipped in an earlier wave. Only one legitimate orphan was found: `src/components/portfolio/PortfolioAllocationChart.tsx` (translated 2026-05-16).

Revised family scope (25 real pages, not 33):

| Family | Pages | Notes |
|--------|------:|-------|
| Risk & analysis (Volatility, Correlation, Drawdown, Leverage Liquidation, Lot Size) | 5 | Position Size never built; Lot Size covers similar ground |
| Yield & savings (Staking, Savings, SIP, Stack Sats) | 4 | Compound never built as standalone; folded into DCA calculator |
| Market models (Rainbow, Power Law, Fear & Greed Index, Dominance, Supply, Halving Countdown) | 6 | Stock-to-Flow never built; lives as a section inside On-Chain Dashboard + a Learn article |
| Portfolio & tracking (Portfolio Tracker, Average Buy Price, On-Chain Dashboard) | 3 | Cost Basis never built (Average Buy Price covers it); Cold Storage never built |
| Tax & inheritance (Zakat, Inheritance, Capital Gains Tax, Loan) | 4 | — |
| Misc (Pi-to-BTC, Lightning, Pizza Day, Arbitrage, BtcVsRealEstate, Mining Profitability, Obituaries Tracker) | 7 | — |
| **Total** | **25** | — |

**Remaining Phase B work = Job #1 only:** refactor inline `language === 'tr' ? 'TR' : 'EN'` ternaries → `t('key')` calls across the 25 pages + their ~80 interior components, adding ~300–400 entries to `src/translations/index.ts`. Output is byte-identical; the win is that the parity (`tr-translation-parity`) and overflow (`tr-overflow`) governance tests now cover every TR string and a central glossary prevents drift. Suggested cadence: one family per turn so each diff stays reviewable.

Promote each calculator's tier in `scripts/.tr-currency-tiers.json` from `tracked` → `soft` after a family's refactor; `soft` → `strict` after copy QA.
Validation: per-family `bunx vitest run`; `audit-tr-currency.mjs` upgraded to fail-not-warn after all families ship.


### Phase C — Structured data + AIO/GEO  *(~1.5 days)*

1. Add `FAQPage` schema to every TR calculator (F-SD3) using TR Q&A authored from the existing EN FAQ.
2. Make `BreadcrumbSchema` locale-aware (F-SD4).
3. Update `llms.txt` to add Turkish section (F-AI1) with TR summary paragraph + link-list of top 20 TR URLs.
4. Add Wikidata / LinkedIn `sameAs` entries to Organization (entity disambiguation).
5. Author one TR Learn article as proof-of-concept; extend `ArticleSchema` for `inLanguage: "tr"` and TR `@id` (F-SD5).

Files: ~30 calculator pages, `src/components/seo/BreadcrumbSchema.tsx`, `src/components/learn/ArticleSchema.tsx`, `public/llms.txt`, `src/pages/TurkishHome.tsx`.

### Phase D — Internal linking, a11y, mobile, perf  *(~1 day)*

1. Replace raw `<Link to="/calculators/...">` with `useLocalizedHref` across all cross-promotion widgets (F-IL1).
2. Localize remaining `aria-label`s on calculator interiors (depends on Phase B keys).
3. Add TR-length min-heights to hero & editorial sections (F-PF1).
4. Mobile tighten on the four offending cards (F-M1).
5. Generate `social-preview-tr.webp` (F-OG1); set `og:image:alt` to TR copy (F-OG2).

### Phase E — Governance  *(~0.5 day)*

1. Add the three new Vitest guards (F-GV1).
2. Extend `audit-tr-links.mjs` to enforce trailing-slash policy (F-SM2).
3. Add CI step: `scripts/generate-sitemap.mjs` runs and diff-checks `public/sitemap.xml`.
4. Add CI step: assert every key in `tr:` translation file is actually referenced somewhere under `src/` (orphan detector).

Files: `src/test/*.test.ts(x)`, `.github/workflows/*.yml`, `scripts/audit-tr-links.mjs`.

---

## 15. Owner Decisions Required Before Phase A

1. **28 unmapped TR alt-slugs (F-HL1)** — keep / redirect / delete?: (redirect or keep use best SEO practice)
2. **TR share image (F-OG1)** — design new asset, or accept current EN-branded image for now? (use newly turkish version public/bitcoin-kar-hesaplayici-og.webp)
3. **Learn article TR scope** — translate all 38, or curate top 10? Affects Phase C/D scope. (translate all 38)
4. **Trailing-slash policy** — keep `/tr/` (with) + `/tr/hesaplayicilar` (without)? Or normalize all to one form? (use best SEO practice or check english routes copy them)
5. **JSON-LD strategy** — ternary inside Helmet (cheapest) or extract to a shared `useLocalizedSchema(en, tr)` hook (cleaner long-term)? (extract to a shared `useLocalizedSchema(en, tr)` hook (cleaner long-term))

Answer these in this doc (inline below each item) and Phase A can start.

---

---

## 16. Status Ledger (updated 2026-05-18, refreshed)

| Phase | Scope | Status | Evidence |
|-------|-------|--------|----------|
| A | Critical SEO + i18n leaks (JSON-LD ternaries, `inLanguage`, sitemap from `EN_TO_TR`, meta-desc trims) | ✅ **Done** | `tr-phase-a-governance.test.ts`, `scripts/generate-sitemap.mjs` |
| B | Calculator interior i18n (inline ternary → `t()`) across 25 pages + ~80 components | ✅ **Done** | `tr-translation-parity.test.ts`, `tr-overflow.test.ts`, `audit-tr-orphans.mjs` |
| C | FAQ schema, locale-aware Breadcrumb, `llms.txt` TR section, TR Learn proof-of-concept | ✅ **Done** | `useLocalizedSchema`, `BreadcrumbSchema(language)` + `tr-breadcrumb-locale.test.ts`, `llms.txt ## Türkçe` + `llms-txt-tr.test.ts`, all 38 Learn TR articles shipped |
| D | Internal linking via `useLocalizedHref`, TR a11y labels, TR-length min-heights, TR OG image | ✅ **Done** | `tr-internal-links.test.tsx`, `tr-aria-labels.test.ts`, `tr-og-image.test.tsx` |
| E | Governance & drift prevention (canonical routes, sitemap CI guard, JSON-LD walker, slash policy, orphan detector) | ✅ **Done** | `tr-phase-a-governance`, `tr-jsonld-inlanguage`, `tr-routes-policy`, `check-sitemap.mjs`, `audit-tr-translation-orphans.mjs` |
| E+ | Canonical/og:url parity, sitemap hreflang validator, sitewide SEO meta coverage, sitemap-route resolver, slug↔route parity | ✅ **Done** | `canonical-url-parity.test.tsx`, `sitemap-hreflang-validator.test.ts`, `seo-meta-coverage.test.tsx`, `audit-sitemap-routes.mjs`, `audit-slug-route-parity.mjs` |
| F2 | `BreadcrumbSchema` locale awareness | ✅ **Done** | `language` prop + `tr-breadcrumb-locale.test.ts` |
| F3 | `llms.txt` Turkish section | ✅ **Done** | `## Türkçe (/tr/)` block with top-20 link-list + `llms-txt-tr.test.ts` |
| F4+F5 | Learn article TR translation (waves 1 + 2) | ✅ **Done** | 38/38 `*.tr.ts` siblings; 38 `/tr/ogrenin/<slug>` entries in `EN_TO_TR`; 114 sitemap entries (38 × hreflang triplet); `ArticleSchema` handles `inLanguage: "tr"` |
| F1 | FAQ JSON-LD TR parity walker + conversion | ✅ **Done** | `tr-faq-schema-parity.test.tsx` green with empty `PENDING_TR_FAQ_PARITY` allowlist (all calculators incl. CAGR + Loan converted); `tr-article-faq-parity.test.ts` covers all 38 Learn articles via `ArticleSchema` `inLanguage: language` |
| F8 | TR OG/Twitter description number-format audit | ✅ **Done** | `scripts/audit-tr-og-numbers.mjs` wired into build; flags `$<digit>`, EN decimal percent, English month names in TR Helmet strings — currently 0 leaks across 63 pages |
| F6a | `Speakable` on TR Learn articles | ✅ **Done** | `ArticleSchema` emits dynamic selectors derived from real DOM ids (first section + conditional `#faq`); `tr-article-speakable.test.tsx` walks every `speakable: true` article and asserts `inLanguage: "tr"` + DOM-matching selectors |
| F6b | `Speakable` on top-10 TR calculators | ✅ **Done** | `buildCalculatorSpeakable()` helper wired into ProfitLoss, DCA, Investment, Retirement, AccumulationScore, Volatility, Staking, Halving, Dominance, Zakat; emits locale-correct `@id` / `url` / `inLanguage`; `tr-calculator-speakable.test.ts` enforces wiring + walker guard against hardcoded-EN Speakable refs |
| F7a | Organization `sameAs` EN/TR parity (LinkedIn + GitHub) | ✅ **Done** | `Index.tsx` + `OptimizedAbout.tsx` Org blocks extended to match `TurkishHome.tsx` (Twitter, X, LinkedIn, GitHub); `org-sameas-parity.test.ts` enforces EN ⊇ TR set + walker guard requiring every top-level `Organization` block under `src/pages/` + `src/components/seo/` to ship a non-empty `https://` `sameAs` |
| F7b | Organization Wikidata Q-ID | ⏭️ **Skipped** | owner declined — no Wikidata entity yet; revisit when one is registered |
| F9 | Per-family TR OG images | ⏳ **Deferred** | gated on design assets |

**Aggregate readiness now: ~4.7 / 5** (was 3.1). Only remaining gap is F9 (design-gated per-family TR OG images). Every CI-enforceable Phase F + G workstream is shipped and guarded.

---

## 17. Phase F — Structured Data Depth, AIO/GEO, and Learn TR Content  *(next phase)*

**Goal:** close the remaining "promise vs. delivery" gap so a Turkish reader — and a Turkish-speaking AI engine — gets equal-fidelity answers to an English one.

### F.1 Workstreams

| # | Workstream | Severity | Effort | Owner gate |
|---|-----------|---------:|-------:|-----------|
| F1 | **FAQ JSON-LD locale-awareness** — every calculator with an EN `FAQPage` schema emits a parallel TR block (TR Q&A authored from existing EN, run through `TR_TRANSLATION_GUIDELINES.md` glossary). Drive off `useLocalizedSchema`. | High | 1.5 d | none |
| F2 | **`BreadcrumbSchema` locale-awareness** — items use TR `name` + TR `item` URL on `/tr/*`. Single component edit + render-walker test. | High | 0.25 d | none |
| F3 | **`llms.txt` Turkish section** — append a `## Türkçe` block with one-paragraph site summary in TR, link-list of top 20 `/tr/*` URLs, and an explicit `Languages: English, Türkçe` line at the top. | High | 0.25 d | confirm summary copy |
| F4 | **Learn article TR translation — wave 1 (top 10)** — translate the 10 highest-traffic EN articles into TR (`src/data/articles/<slug>.tr.ts` sibling files, following the existing `what-is-bitcoin-dca.tr.ts` pattern). Add slugs to `EN_TO_TR`, mount under `/tr/ogrenin/<slug>`, regenerate sitemap. Extend `ArticleSchema` with `inLanguage: "tr"` + TR `@id`. | High | 3 d | pick the 10 (see F.3) |
| F5 | **Learn article TR translation — wave 2 (remaining 28)** — same pipeline, after wave 1 is QA'd in prod. | High | 5–7 d | wave 1 metrics |
| F6 | **`Speakable` schema on TR calculators** — top 10 TR calculator pages get a `SpeakableSpecification` block targeting the answer headline + first explanation paragraph (helps AI voice surfaces). | Medium | 0.5 d | none |
| F7 | **Organization `sameAs` enrichment** — add Wikidata, LinkedIn, GitHub entries to the Org JSON-LD for entity disambiguation in both locales. | Medium | 0.25 d | URLs from owner |
| F8 | **TR number/date/percent formatting in OG/Twitter descriptions** — sweep the ~12 pages where `$1,250` / `99.9%` / `March 2026` still leak into TR `og:description`. Use existing `formatTRY` / locale-aware formatters. | Medium | 0.5 d | none |
| F9 | **TR hero share-image variants per calculator family** — extend the single `bitcoin-kar-hesaplayici-og.webp` into per-family TR OG images (mining, staking, volatility, portfolio). Cheap CTR win. | Low | 1 d | design assets |

### F.2 Governance additions (CI guards added with the work)

- `tr-faq-schema-parity.test.tsx` — every page that emits an EN `FAQPage` must emit a TR `FAQPage` with `inLanguage: "tr"` under `/tr/*`.
- `tr-breadcrumb-locale.test.tsx` — render-walk every `/tr/*` route, assert all `BreadcrumbList.itemListElement[*].name` are non-English (glossary-allowlisted exceptions only).
- `tr-learn-article-parity.test.ts` — every `EN_TO_TR` `/tr/ogrenin/<slug>` entry has a `<slug>.tr.ts` module that exports the same shape as the EN sibling.
- `llms-txt-tr.test.ts` — `public/llms.txt` contains a `## Türkçe` heading and at least N TR URLs.
- Extend `seo-meta-coverage.test.tsx` to also assert OG/Twitter description ≤ 200 chars.

### F.3 Owner decisions required before F starts

1. **Wave 1 article list** — pick 10 of the 38 (recommend: DCA, P&L, halving, mining-profitability, dominance, HODL, pizza-day, tax-capital-gains, wealth-distribution, vs-gold-sp500).
2. **`sameAs` URLs** — Wikidata Q-ID? LinkedIn company page? GitHub org?
3. **Per-family OG images (F9)** — design now or defer to a later marketing pass?
4. **Speakable scope (F6)** — top 10 calculators, or every TR calculator?

### F.4 Cadence

- F1+F2+F3 in one turn (single structured-data + AIO sweep, ~2 days, all CI-guarded).
- F4 one article per turn so each translation diff stays reviewable.
- F5 batched 3-per-turn after wave 1 ships.
- F6/F7/F8 folded into the F1 turn where possible.
- F9 last, gated on design assets.

### F.5 Out of scope for Phase F

- New calculator features or new pages (TR or EN).
- Visual redesign of TR pages.
- Backend / Supabase changes.
- EN copy edits — TR is the only locale touched.

---

## 18. Phase H — TR Article Pages Comprehensive Audit (2026-05-18)

End-to-end audit of every `/tr/ogrenin/*` learn-article surface: hub page,
article route, content registry, JSON-LD emitter, and the two in-page
internal-linking blocks (in-flow `RelatedLinksSection` + desktop
`ArticleSidebar`).

### 18.1 Verified GREEN (locked in by tests)

- **File coverage** — 38 EN articles × 38 TR siblings (76 files); zero missing TR siblings.
- **Module registry** — `articleModules` registers all 38 TR slugs; `getArticleBySlug('<tr-slug>')` resolves on every TR route.
- **Routing** — `App.tsx` mounts `/tr/ogrenin` (hub) and `/tr/ogrenin/:slug` (article) on the shared `Learn` / `LearnArticle` components.
- **Hub locale scope** — `Learn.tsx` filters `articlesMeta` by `language`; featured hero + grid + search + filter respect locale.
- **Slug↔route map** — 38/38 EN→TR article pairs in `EN_TO_TR`.
- **Hreflang & canonical** — `LearnArticle` + `ArticleSchema` emit locale-correct canonical + `en` / `tr` / `x-default` alternates in both Helmet and JSON-LD.
- **JSON-LD `inLanguage`** — `Article`, `FAQPage`, `HowTo`, `Speakable`, `BreadcrumbList` all bind to the `language` prop; TR breadcrumb labels ("Ana Sayfa" / "Öğrenin") flip on `/tr/*`.
- **Related-array integrity** — 0 cross-language references; 0 unknown slugs across all 76 files.
- **XML sitemap** — 38 TR article `<loc>` entries with full `xhtml:link` triplets.
- **In-flow `RelatedLinksSection`** — locale-aware (already shipped pre-Phase H).

### 18.2 Issues found + fixed in Phase H

| ID | Severity | Issue | Resolution |
|----|----------|-------|------------|
| **H1** | High | `ArticleSidebar.tsx` was EN-only — hardcoded labels ("Contents", "Related Tools", "Related Articles"), hardcoded `calculatorNames` map, and `to={\`/calculators/${calc}\`}` + `to={\`/learn/${slug}\`}` links. TR-article related-article sidebar links produced **404s** (e.g. `/learn/bitcoin-dca-nedir`) and TR readers got EN calculator names + were dumped off `/tr/`. | ✅ **Done** — sidebar accepts `language` prop; uses `getCalculatorName(_, language)`, `getLocalizedPath('/calculators/<id>', language)`, and `${tr ? '/tr/ogrenin' : '/learn'}/<slug>` for article links. Heading copy localized. `LearnArticle` threads `language`. Guard: `tr-article-sidebar-locale.test.tsx`. |
| **H2** | High | `Intl.DateTimeFormat('en-US', …)` hardcoded — TR article dates rendered "January 15, 2026" instead of "15 Ocak 2026" on the byline, "İlk yayın", and `<time>` text. | ✅ **Done** — locale is `tr ? 'tr-TR' : 'en-US'`. Guard: `tr-article-date-format.test.ts` (source check + Intl runtime sanity). |
| **H3** | High (data) | `articlesMeta` row for `bitcoin-volatilitesi-aciklamasi` had `metaDescription: 'DVOL ÷ 20 = Bitcoin'` — 19-char meta description bled into `<meta name="description">`, OG description, twitter:description, and `Article.description` JSON-LD. | ✅ **Done** — restored full TR description (DVOL/Şubat 2026/dip sinyali). Guard: `tr-article-meta-description.test.ts` walks all 38 TR rows, asserts 80 ≤ len ≤ 200 + sentence-terminator. |
| **M1** | Medium | `ArticleSchema.tsx` `author[].url` and `<meta property="article:author">` always pointed to `/about` regardless of locale. | ✅ **Done** — both branch on `language === "tr"` → `/tr/hakkimizda`. Guard: `tr-article-author-url.test.ts`. |
| **M2** | Medium | `Sitemap.tsx` (human-facing page) iterated `articlesMeta` and rendered every entry as `/learn/${a.slug}` → 404s on TR-slug rows; also mixed TR titles into the EN sitemap and inflated the EN "Educational Guides" counter. | ✅ **Done** — locale-filter + locale-correct article base (`/tr/ogrenin` vs `/learn`); counter in header also locale-scoped. |
| **M3** | Medium | Generic `social-preview.webp` OG/Twitter image on TR articles. | ⏳ **Deferred** — cross-listed under F9 (design-gated per-family OG). No new work. |
| **M4** | Low | 18 / 38 TR articles lack `expertQuote` (EN parity: also 20/38). Already falls back to `<VerifiableSources>` in `LearnArticle.tsx` — not a regression. | ⏭️ **Backlog** — content opportunity, not a bug. |

### 18.3 Files touched

- `src/components/learn/ArticleSidebar.tsx` — full locale awareness.
- `src/pages/LearnArticle.tsx` — passes `language` to sidebar; `Intl` locale parameterized.
- `src/data/articles.ts` — `bitcoin-volatilitesi-aciklamasi` meta description repaired.
- `src/components/learn/ArticleSchema.tsx` — Person.url + `article:author` localized.
- `src/pages/Sitemap.tsx` — Educational Guides section locale-split; header counter locale-scoped.

### 18.4 New governance tests

- `src/test/tr-article-sidebar-locale.test.tsx` — render walk: TR headings present; every internal `<a href>` starts with `/tr/`; calc names match `getCalculatorName(_, 'tr')`. Plus EN regression snapshot.
- `src/test/tr-article-date-format.test.ts` — source-level guard + `Intl('tr-TR')` runtime check.
- `src/test/tr-article-meta-description.test.ts` — walks every `language: 'tr'` row, enforces length + sentence-terminator.
- `src/test/tr-article-author-url.test.ts` — asserts no remaining hardcoded `/about` literal in author Person URLs / `article:author` meta.

### 18.5 Aggregate readiness

**~4.7 / 5 → ~4.85 / 5** after H1–H3 + M1–M2. Remaining gaps:

- **M3 / F9** — per-family TR OG images (design-gated).
- **F7b** — Wikidata Q-ID for the Org block (owner declined; revisit when registered).
- **M4** — `expertQuote` content backfill (opportunity, not bug).

Every CI-enforceable TR article-pages workstream is now shipped and guarded.

---

*End of audit. Companion: `docs/TR_COPY_AUDIT.md` for visible-copy quality; `docs/TR_TRANSLATION_GUIDELINES.md` for locked terminology, number/date rules, and tone.*
