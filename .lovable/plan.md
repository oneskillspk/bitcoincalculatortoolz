## Audit findings (from the four CSVs)

| # | Issue | Affected | Root cause |
|---|---|---|---|
| 1 | No outgoing links | `/calculators/bitcoin-savings` | Suspected stale crawl — page already renders `<RelatedCalculators />` + `<SavingsFAQSection />` with internal `<Link>`s. Need to verify rendered HTML actually contains anchors. |
| 2 | Broken image 404 | `/__l5e/assets-v1/b3b7dd2e…/redotpay-image_2.png` (6 inlinks) and `/__l5e/assets-v1/49e1d7ce…/image_13_1920x1920.png` (1 inlink) | Old PNG asset IDs. We migrated both to WebP (new asset IDs `b2738dac…` and `a21364d0…`). The audit (13-Jun) ran against pre-migration HTML. |
| 3 | Image file size >1 MB | `redotpay-image_5.png` (1.18 MB), `image_11_1920x1004.png` (1.12 MB) | Same — both already migrated to WebP (~64 KB and ~70 KB). Stale crawl. |
| 4 | Schema.org validation error | 173 indexable pages | Auditor reports only the generic flag. Need a local validator pass to identify the actual offending property/type so we can fix at source. |
| 5 | Page-broken inlinks (7272-byte CSV) | Multiple `/learn/*` and `/tr/hesaplayicilar/*` pages link to the dead `redotpay-image_2.png` URL | Same root cause as #2 — fixed by the redeploy. |

## Action plan

### A. Outgoing-links verification — `/calculators/bitcoin-savings`
1. Build the route and snapshot the rendered HTML (vitest render or `curl` against preview).
2. Confirm `<a href="/calculators/...">` count > 0 from `RelatedCalculators` + sidebar + FAQ + breadcrumb.
3. If anchors are missing under SSR/prerender path, add an in-content "Related calculators" prose block with explicit `<Link>`s (DCA, SIP, Stack Sats, Investment) above the fold to guarantee crawler-visible outlinks.

### B. Broken images (#2) + oversized images (#3) — already migrated
1. Grep the repo for any straggling reference to the two dead PNG URLs / asset IDs and remove if found.
2. Confirm `affiliates.config.ts` only imports `.webp.asset.json` for image_2, image_5, image_11, image_13.
3. Trigger a republish so the live HTML stops emitting the old PNG CDN URLs; ask the user to re-run the audit afterwards.

### C. Page-has-broken-image inlinks (CSV #1)
- Same fix as (B) — the only broken inlink listed is `redotpay-image_2.png`, which the WebP migration already replaces.

### D. Structured-data validation — diagnose then fix
The auditor only reports "Schema.org validation error" without details. To stop guessing:

1. **Write `scripts/audit-jsonld.mjs`**:
   - Walk the sitemap, fetch each page from the preview URL.
   - Extract every `<script type="application/ld+json">` block.
   - POST each to `https://validator.schema.org/validate` (or run a local JSON-schema check against schema.org's published shapes) and collect errors.
   - Output a markdown report grouped by `@type` and error message.
2. **Run it** on a representative slice (5 EN calculators, 5 EN articles, 5 TR mirrors, About, Tools, Learn, Calculators index) — same page mix the auditor flagged.
3. **Fix at source** in the schema components likely to be the culprit:
   - `ArticleSchema.tsx`, `BreadcrumbSchema.tsx`, `DatasetSchema.tsx`, `HowToSchema`, `FAQSchema`, `WebApplicationSchema`, `PersonSchema`.
   - Known prior offender pattern: extra `inLanguage` on `BreadcrumbList`. Confirm no other type carries an unsupported property (e.g. `inLanguage` on `Person`, `keywords` on `HowTo`, `datePublished` on `Quotation`).
4. **Add a regression test** (`src/test/jsonld-schema-validity.test.tsx`) that renders one page per layout type, extracts JSON-LD, and asserts no validator errors using a small local allowlist of valid schema.org properties per `@type` (covers the common ones we emit).

### E. Verify and report
- `npm run build` green.
- Re-run `scripts/audit-jsonld.mjs` → 0 errors.
- Re-run `scripts/audit-internal-links.mjs` and `audit-broken-links.mjs` → no references to the old PNG asset URLs.
- Tell the user to click Rescan in the SEO panel and re-run their external audit after the next publish so the stale 404/file-size rows clear.

## Out of scope
- og:image migration (still skipped per earlier instruction).
- Any visual / copy changes to bitcoin-savings beyond ensuring crawler-visible outlinks.

## Technical notes
- WebP asset IDs already live: `image_2` → `b2738dac…`, `image_5` → `897329ba…`, `image_11` → (new), `image_13` → `a21364d0…`.
- Schema validator: prefer the local allowlist approach for the regression test (no network in CI); use the live validator only for the one-off diagnostic run.
- JSON-LD walker should re-use the route list in `src/test/allLocalizedRoutes.ts`.
