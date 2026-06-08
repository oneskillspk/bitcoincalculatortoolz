## Current state

Good news — Ledger is already partially integrated:

- `src/config/affiliates.config.ts` → full Ledger entry with all 9 EN + 9 TR creatives at the correct referral URL (`?r=8c4e8e87cac7`), priority 9, `image-banner` default, targeted at security/HODL/wealth slugs.
- `src/config/placements.config.ts` → Ledger is mapped into ~12 calculator slugs for both `en` and `tr`.

What's missing for production:

1. **Cloud `affiliates` table** has only `redotpay`. Ledger lives only in the local fallback registry, so the admin panel (`AdminAffiliates`) can't toggle/edit it, and the AI decision engine never sees it from the database — it always falls back. This is a single-point-of-truth gap.
2. **Legacy `src/config/affiliates.ts`** (used by the older `AffiliateCard`/`CALCULATOR_AFFILIATE_MAP` system) has a stub Ledger entry pointing at the generic `https://www.ledger.com/` (no referral tag).
3. **No regression test** covering Ledger banner rendering, unlike RedotPay (`redotpayFinalBanners.test.tsx`).

## Plan

### 1. Seed Ledger into the Cloud `affiliates` table (migration)

Insert one row mirroring `src/config/affiliates.config.ts` exactly — same id (`ledger`), category `hardware-wallet`, tier 1, priority 9, `enabled=true`, both EN and TR URLs set to the referral link, all 18 creatives serialized into the `creatives` jsonb column, `default_format='image-banner'`. Use `ON CONFLICT (id) DO UPDATE` so re-running the migration is safe and keeps local + Cloud in sync.

After this lands, the admin can manage Ledger from `/admin` → Affiliates (toggle, edit creatives JSON, change priority) and the live AI decision engine will source Ledger from Cloud instead of the fallback.

### 2. Fix legacy `src/config/affiliates.ts`

- Replace Ledger `url` `https://www.ledger.com/` → `https://shop.ledger.com/?r=8c4e8e87cac7` (matches your provided tracking URL).
- Keep description / CTA / featured flag as-is (this file feeds the older `AffiliateCard` UI used in a few learn-side surfaces).

No other entries change.

### 3. Add regression test

Create `src/lib/affiliateAI/__tests__/ledgerFinalBanners.test.tsx` modeled on the existing `redotpayFinalBanners.test.tsx`:

- For each of the 9 sizes × 2 langs (18 cases), assert that `useAffiliateAI({ forceAffiliateId: 'ledger', lang, … })` resolves to the correct `image_url` + `landing_url` and that the rendered `<a>` carries `rel="sponsored noopener noreferrer"` and points at `?r=8c4e8e87cac7`.
- Snapshot the rendered HTML for the 728×90 EN + TR pair (regression-locks the banner markup).

### 4. Verification

- `bunx vitest run src/lib/affiliateAI` → all green including new test.
- `psql -c "SELECT id, enabled, jsonb_array_length(creatives) FROM affiliates WHERE id='ledger';"` → expect 18.
- Manual: visit `/calculators/hodl-strategy` and `/tr/hesaplayicilar/hodl-stratejisi`, confirm a Ledger banner renders with the correct localized creative and the `?r=8c4e8e87cac7` outbound link.

## Files touched

- `supabase/migrations/<timestamp>_seed_ledger_affiliate.sql` (new)
- `src/config/affiliates.ts` (1-line URL fix)
- `src/lib/affiliateAI/__tests__/ledgerFinalBanners.test.tsx` (new)

No changes to `affiliates.config.ts`, `placements.config.ts`, or types — they're already correct.

## Out of scope (flag if you want it)

- Custom Ledger landing-page copy block on hardware-wallet-relevant calculator pages.
- Uploading Ledger creatives to our own CDN (`lovable-assets`) instead of hotlinking `affiliate.ledger.com` — keeps us resilient if Ledger rotates URLs, at the cost of staleness when they refresh designs.
