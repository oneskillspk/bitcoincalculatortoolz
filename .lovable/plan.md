## RedotPay Affiliate Integration Plan

RedotPay is a crypto debit-card program (not an exchange, wallet, or tax tool), so it needs a new `card` affiliate category plus a creative library covering the 3 promo themes you shared. Everything plugs into the existing AffiliateAI engine — no new components required.

---

### 1. Program metadata

Commission profile to record (used for sorting + admin UI):

- Card Application: 20%
- Card Spending: 0.05%
- Tier-2: 10% for 365 days
- UID: 15980
- Conversion intent: `high`
- Cookie days: 365

Three landing URLs (all already UID-tagged):

- **affiliates-1** (Crypto Card / "Spend Crypto Like Fiat" — dark theme) → `https://wap.redotpay.com/en/invite/affiliates-1?utm_id=36rgik&utm_source=union&utm_uid=15980&utm_s=f29a110dc987f17ad366813652572664712174e0`
- **affiliates-3** (Social App-Friendly Card — pink theme) → `…/affiliates-3/?utm_id=ue39ua…`
- **affiliates-5** (Social App-Friendly Card — pink, variant 2) → `…/affiliates-5/?utm_id=a5pkmi…`
- Affiliate signup (footer/CTA only) → `https://affiliates.redotpay.com/login?mode=register&inviteCode=15980`

### 2. Asset normalization

Upload the 9 PNGs as Lovable Assets (avoids bloating the repo) and map each to a `CreativeSize`. The current registry types support these sizes; I'll add the new ones the assets actually need:


| Source image | Dim (px)  | Maps to size                        | Theme / variant                           |
| ------------ | --------- | ----------------------------------- | ----------------------------------------- |
| image_8.png  | 728×90    | `728x90`                            | Pink / Social                             |
| image_7.png  | 300×250   | `300x250`                           | Pink / Social                             |
| image_6.png  | 700×1000  | `**700x1000` new**                  | Pink / Social (vertical mobile / sidebar) |
| image_5.png  | 1080×1080 | `**1080x1080` new** (square social) | Pink / Social                             |
| image_4.png  | 1200×628  | `**1200x628` new** (OG / wide)      | Pink / Social                             |
| image_3.png  | 700×1000  | `700x1000`                          | Dark / Crypto Card                        |
| image_2.png  | 1600×836  | `**1600x836` new** (hero / wide)    | Dark / Crypto Card                        |
| image_1.png  | 1200×628  | `1200x628`                          | Dark / Crypto Card                        |
| image.png    | 1080×1080 | `1080x1080`                         | Dark / Crypto Card                        |


I'll extend `CreativeSize` in `src/lib/affiliateAI/types.ts` with the four new sizes (`"700x1000" | "1080x1080" | "1200x628" | "1600x836"`) and add matching width/height awareness in `validateCreatives.ts` so the existing creative-size guard still passes.

### 3. Files changed / added

1. `**src/lib/affiliateAI/types.ts**` — extend `AffiliateCategory` with `"card"` and `CreativeSize` with the 4 new dimensions.
2. `**src/lib/affiliateAI/validateCreatives.ts**` + its test — add the 4 new size→dimension entries.
3. `**src/config/affiliates.config.ts**` — append a `redotpay` program with:
  - `category: "card"`, `tier: 1`, `priority: 9`, `enabled: true`
  - localized CTAs (EN + TR) — "Get $5, spend crypto like fiat" / "5$ kazan, kriptoyu fiat gibi harca"
  - `url_en` = affiliates-1, `url_tr` = affiliates-1 (same; lang-neutral landing)
  - `target_pages: ["*"]` so it can serve anywhere, with stronger weighting on spend/cashout slugs (`bitcoin-converter`, `purchasing-power`, `lightning-fee`, `transaction-fee`, `tax`, `inheritance-tax`, `bitcoin-loan`, `bitcoin-savings`, `dca`)
  - `target_results: ["profit", "cashout", "spend", "high-value"]`
  - `default_format: "image-banner"`
  - 9 creatives: each entry uses `landing_url` pointing to **affiliates-3/5** for the pink "social" creatives and **affiliates-1** for the dark "crypto card" creatives, so click attribution stays aligned with the visual.
4. `**src/config/affiliates.ts**` — add a simpler `redotpay` entry under a new `card` category for the legacy `AffiliateCard`/`RecommendedTools` strip used by `ContextualAffiliateStrip`. Icon: `💳`, featured: true. Default link = affiliates-1.
5. `**src/lib/affiliateAI/scoringEngine.ts**` (intent map) — give `card` category a small boost on `spend`/`cashout`/`profit` result signals so RedotPay surfaces naturally next to converter/tax/loan calculators without crowding out Ledger/Koinly on storage/tax pages.
6. `**src/config/placements.config.ts**` — no structural change, but document that the new wide sizes (`1200x628`, `1600x836`) prefer `pre-footer` / `inline-mid-article` zones and the vertical (`700x1000`, `1080x1080`) prefer `sidebar`.
7. **Asset registration** — for each of the 9 PNGs, run `lovable-assets create --file /mnt/user-uploads/<name>.png` and import the resulting JSON pointers in `affiliates.config.ts`. No binaries are checked in.
8. **DB sync (optional, recommended)** — add a migration `insert into public.affiliates (id, name, category, enabled) values ('redotpay','RedotPay','card', true)` so the `log-event` edge function's allow-list accepts impression/click events for the new ID. Without this the file fallback still renders, but analytics get silently dropped.
9. **Tests**
  - Extend `src/lib/affiliateAI/__tests__/validateCreatives.test.ts` with the 4 new sizes.
  - Extend `src/lib/affiliateAI/__tests__/regression.test.ts` to assert RedotPay resolves with a non-`#` URL in EN and TR and that creative picking returns the right asset for each requested zone size.

### 4. Where RedotPay will visibly appear

- **Sidebar widget** on accumulation/spend/tax calculators → `700x1000` or `1080x1080` pink creative (image_6 / image_5).
- **Inline mid-article banner** on Learn articles about spending Bitcoin, cards, lightning, fees → `728x90` (image_8) on desktop, `300x250` (image_7) on narrow.
- **Pre-footer** site-wide hero → `1200x628` or `1600x836` (image_1 / image_2 / image_4) — paired with affiliates-1 landing.
- **RecommendedTools strip** (legacy `AffiliateCard`) on Bitcoin Converter, Lightning Fee, Transaction Fee, Inheritance Tax, Bitcoin Loan, Purchasing Power pages.

### 5. QA checklist after build

- 360×800 mobile: pink `300x250` and `700x1000` creatives render fully inside the viewport without horizontal scroll.
- Desktop ≥1280px: `1600x836` and `1200x628` hero variants fit pre-footer without overflowing the container max-width (`max-w-6xl`).
- All outbound links resolve to a 200 and carry the UID-tagged `utm_*` query string (already baked into the supplied URLs — UTM appender must not overwrite `utm_source=union`).
- `appendUtm` already early-returns when `utm_source` is preset → verify with a unit test addition.
- `log-event` impression hits succeed for `affiliateId=redotpay` (requires the DB row from step 8).
- TR locale falls back to EN landing (RedotPay has no `/tr/` page) — `pickLabel` already handles null gracefully.   OK I HAVE ADDED NEW IMAGE IN NEXT CHAT

### Out of scope (won't touch this turn)

- No new placement components or layout work — uses existing `image-banner`, `single-card`, and sidebar widget renderers.
- No changes to `useAffiliateAI` API shape.
- No edits to autogenerated Supabase client files.