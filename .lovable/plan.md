# Fix: Turkish learn articles redirect to the homepage

## What is broken

On `/tr/ogrenin`, **every** article card links to `/tr/` instead of the article.
Verified live: 45 article links on the Turkish learn hub all render `href="/tr/"`.

Root cause chain:

1. `ArticleCard` (and the featured hero) always build `to={"/learn/" + article.slug}`.
2. On Turkish routes the listed articles are the TR entries, so the slug is already
   Turkish, producing `/learn/1-bitcoin-kac-dolar`.
3. `useLocalizedHref` → `getLocalizedPath(path, 'tr')` looks up `EN_TO_TR['/learn/1-bitcoin-kac-dolar']`.
   That key does not exist (the map is keyed by English slugs), so it hits the
   catch-all fallback `'/tr/'` — the Turkish homepage.

So it is not "only the latest articles": the fallback silently swallows any
already-Turkish slug, and the newest voice-search articles are simply the ones
being clicked.

## Fix

### 1. Make the locale resolver slug-aware (`src/utils/localizedRoutes.ts`)

- Build `TR_LEARN_SLUGS` / `TR_CALC_SLUGS` sets from the values of `EN_TO_TR`.
- In `getLocalizedPath(path, 'tr')`, before falling back:
  - `/learn/<tr-slug>` → `/tr/ogrenin/<tr-slug>` when the slug is a known TR slug.
  - `/calculators/<tr-slug>` → `/tr/hesaplayicilar/<tr-slug>` likewise.
- Keep `'/tr/'` as the last-resort fallback only for genuinely unknown paths.

### 2. Build article hrefs correctly at the source

- Add `getArticleHref(slug, locale)` to `localizedRoutes.ts`: returns
  `/tr/ogrenin/<slug>` for TR slugs, `/learn/<slug>` otherwise.
- Use it in `ArticleCard.tsx` and `FeaturedArticleHero.tsx` so the link is right
  before any rewriting happens.

### 3. Audit the other surfaces that list articles

Check and, where needed, route through the same helper:
`RelatedLinksSection`, `ArticleSidebar`, `RelatedCalculators`, `SmartSearch`,
and the content-section blocks that hard-code `/learn/...` (those use canonical
EN slugs and already map fine — only confirm, don't churn).

## Verification

- Playwright: load `/tr/ogrenin`, assert no article link equals `/tr/`, then click
  a card and assert the URL ends in `/tr/ogrenin/<tr-slug>` and the article renders.
- Unit test: `getLocalizedPath('/learn/1-bitcoin-kac-dolar', 'tr')` →
  `/tr/ogrenin/1-bitcoin-kac-dolar`; EN paths unchanged.
- Re-run `scripts/audit-tr-links.mjs` and the TR route-parity suite.

## Technical notes

No content, schema, or sitemap changes — sitemap already lists the correct TR
article URLs, so this is purely a client-side link-construction bug.
