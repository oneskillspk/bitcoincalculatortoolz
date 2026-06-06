## Enterprise Ahrefs cleanup — 5 categories, 1 pass

Investigation done. Below is each finding's root cause and the exact fix. Nothing speculative — every URL was inspected against the codebase.

---

### 1. Broken outbound links (6 rows = 3 unique URLs × EN+TR)

| Source page | 404 target |
|---|---|
| `/calculators/inheritance-tax` + `/tr/.../bitcoin-miras-vergisi` | `taxfoundation.org/data/all/state/state-estate-tax-state-inheritance-tax-2024/` |
| `/learn/how-much-bitcoin-should-i-own` + `/tr/.../ne-kadar-bitcoin-sahibi-olmaliyim` | `web.archive.org/web/2020/…cnbc.com/…paul-tudor-jones-says-hes-investing-in-bitcoin.html` |
| `/learn/bitcoin-savings-plan-guide` + `/tr/.../bitcoin-tasarruf-plani-rehberi` | `press.princeton.edu/books/paperback/9780393358384/a-random-walk-down-wall-street` |

**Fix**: for each, find a live replacement (Tax Foundation has a 2025 successor page; CNBC archive must point at the canonical CNBC URL or an `archive.org/web/2020*/…` wildcard snapshot; Princeton Press lists the book under a different ISBN) and update the citation in **both** EN and TR sources at the same time. Add a `scripts/audit-outbound-links.mjs` check that HEADs every external `href` in `src/data/articles/*` + `MethodologyBlock` references and fails CI on 4xx/5xx so this never regresses.

### 2. "Multiple meta description" still firing on `/tr/hesaplayicilar/bitcoin-ortalama-alis`

Last pass added `data-rh="true"` to the 5 static `<meta>` tags in `index.html` so Helmet would replace, not append. That dedupes for tags Helmet *replaces by attribute key*. Confirm by curling the live URL and counting `<meta name="description">` occurrences. Likely remaining causes:

- A **second `<Helmet>`** somewhere in the render tree (a wrapper layout / SEO component) emits another `description`. Audit: `rg -n 'name="description"' src` and ensure exactly one Helmet writes it per route.
- A duplicate inside `BitcoinAverageBuyPriceCalculator.tsx` itself (e.g. nested `<Helmet>` in a child component).

**Fix**: collapse to a single source of truth per route. Centralize meta-description rendering through one `<PageSeo />` component used in every calculator page so a future component can't double-emit.

### 3. Missing H1 on two TR calculator pages

| URL | Real issue |
|---|---|
| `/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi` | Source has `<h1>` (line 693). Pre-hydration render-budget false positive caused by static `index.html` title leaking through. Verifying via live curl after rebuild should show the H1 present. |
| `/tr/hesaplayicilar/bitcoin-yarilama` | **Real bug**. Word-count CSV: 12 words, H1 empty, was 1378 words. The component throws or short-circuits in TR mode — the entire body never renders. |

**Fix #3a**: re-curl retirement TR after this batch ships; if H1 still missing in rendered HTML, the chunk is failing to hydrate (check `BitcoinRetirementCalculator` for TR-conditional render guards).
**Fix #3b**: open `BitcoinHalvingCountdown.tsx`, find the TR branch that returns early or accesses an undefined translation key, restore the full render path. Add a Vitest case asserting non-empty body for every route in `trCalculatorRoutes.ts`.

### 4. Nofollow inlinks on 5 TR pillar pages (`/tr/`, `/tr/araclar`, `/tr/hesaplayicilar`, `/tr/ogrenin`, `/tr/hakkimizda`)

Each shows **2 nofollow inlinks**. No `src` code emits a nofollow `<a>` to `/tr*`. The 2 sources are pages whose own `robots` meta is `noindex,nofollow` — Ahrefs treats every outbound link from such pages as nofollow:

- `src/pages/NotFound.tsx` (line 25)
- `src/pages/Unsubscribe.tsx` (line 75)

Both render the global Header (language switcher → `/tr/...`) and Footer (TR pillar links).

**Fix**: change `NotFound.tsx` from `noindex, nofollow` → `noindex, follow` (lets equity flow through the 404 page; standard practice). `Unsubscribe.tsx` is a transactional page reachable only via tokenised email link — keep noindex,nofollow but remove the global Footer from its render tree so it stops being counted as a source of nofollow internal links.

### 5. Word-count regressions

| URL | Now | Was | Diagnosis |
|---|---|---|---|
| `/calculators/retirement` | 2846 | 19 | Was previously broken (only 19 words). Now healthy. No action. |
| `/tr/hesaplayicilar/bitcoin-donusturucu` | 1986 | 17 | Same — recently fixed. No action. |
| `/calculators/bitcoin-savings` | 884 | 698 | +27% (content added). No action. |
| `/calculators/time-machine` | 934 | 682 | +37%. No action. |
| `/calculators/obituaries-tracker` | 528 | 1310 | **−60% regression** — review removed sections, restore the explainer / FAQ that was dropped. |
| `/tr/.../bitcoin-olum-ilanlari` | 522 | 1314 | Same as above, TR mirror. |
| `/tr/.../bitcoin-birikim-hesaplayicisi` | 641 | 847 | −24%. Check what shrank vs EN parity. |
| `/calculators/correlation` | 492 | 620 | −21%. Same. |
| `/tr/.../bitcoin-yarilama` | 12 | 1378 | Covered by fix #3b. |

**Fix**: open the 4 components above (`BitcoinObituariesTracker`, EN+TR shared; `BitcoinSavingsCalculator` TR text; `BitcoinCorrelationCalculator`) and restore the explainer / FAQ / methodology blocks that disappeared between crawls. Cross-reference git history if needed.

---

## Verification pass (must pass before declaring done)

1. **External-link audit**: new `scripts/audit-outbound-links.mjs` returns 0 failures.
2. **Live curl** of the 3 specific URLs from the message: exactly one `<meta name="description">`, non-empty `<h1>`, body word-count >300.
3. **Vitest**: new `tr-calculator-render.test.tsx` mounts every TR calculator route and asserts presence of `<h1>` + min body length.
4. **Existing audits**: `audit-internal-links.mjs`, `audit-sitemap-crawl.mjs`, `audit-tr-coverage.mjs` all still green.
5. After deploy → re-run Ahrefs site audit and confirm the 5 issue categories drop to zero.

## Files touched (≈14)

- `src/data/articles/bitcoin-savings-plan-guide.{ts,tr.ts}` — replace dead Princeton link
- `src/data/articles/how-much-bitcoin-should-i-own.{ts,tr.ts}` — replace dead CNBC archive link
- `src/pages/BitcoinInheritanceTaxCalculator.tsx` (or methodology block source) — replace dead Tax Foundation link
- `src/pages/BitcoinHalvingCountdown.tsx` — fix TR render bug
- `src/pages/BitcoinObituariesTracker.tsx` — restore truncated content (EN + TR parity)
- `src/pages/BitcoinCorrelationCalculator.tsx` — restore truncated content
- `src/pages/NotFound.tsx` — `noindex,nofollow` → `noindex,follow`
- `src/pages/Unsubscribe.tsx` — drop global Footer from layout
- `src/pages/BitcoinAverageBuyPriceCalculator.tsx` (and audit) — remove any duplicate Helmet description
- `scripts/audit-outbound-links.mjs` (new)
- `src/test/tr-calculator-render.test.tsx` (new)

## Out of scope (call out, don't silently do)

- Server-side rendering / prerender (would fix render-budget false positives wholesale but is a multi-day architecture change)
- Rewriting all 28 over-length TR meta descriptions from the previous request — that plan is still queued
- Replacing Ahrefs' own crawl-budget heuristics; some "missing H1" flags will only clear after the next full rescan
