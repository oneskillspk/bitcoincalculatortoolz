## Plan

### 1. Strengthen automated affiliate-link coverage
- Add a dedicated RedotPay-focused test file that validates every configured RedotPay landing URL and creative link.
- Verify each resolved outbound URL keeps the existing partner tracking intact:
  - `utm_uid=15980`
  - `utm_source=union`
  - the expected promo slug path (`affiliates-1`, `affiliates-3`, or `affiliates-5`)
- Verify `appendUtm` does not overwrite partner-owned UTM params on RedotPay URLs.
- Verify fallback program URLs (`url_en`, `url_tr`) still point to the correct default promo slug.

### 2. Expand registry-level regression tests
- Extend the existing affiliate regression suite so it checks all enabled affiliate URLs, not only generic UTM behavior.
- Add assertions that every RedotPay creative has:
  - a non-empty `landing_url`
  - the correct UID-tagged tracking params
  - a promo slug that matches its intended campaign variant
- Add a resolution test through `resolveAffiliates` so the app-level URL users actually click is covered too.

### 3. Add the new RedotPay banner sizes to the registry
- Upload the newly attached banners as CDN asset pointers.
- Extend the creative-size type union to support the new real sizes from your new set:
  - `320x50`
  - `960x150`
  - `1600x900`
  - `1920x1080`
  - `1920x1004`
  - `1920x1920`
  - `1400x2000`
  - `900x750`
- Add the new assets into `src/config/affiliates.config.ts` under RedotPay, mapped to the right promo family:
  - pink social-app creatives stay on `affiliates-3` / `affiliates-5`
  - online-ads creatives point to the new online-ads promo slug from the newly uploaded set
- Keep the older creatives unless they are clearly superseded by the new ones.

### 4. Update creative picking preferences for the new sizes
- Expand zone/device size preferences so the new banners can actually be selected in realistic placements.
- Likely mapping:
  - mobile/footer: `320x50`
  - wide desktop inline/pre-footer: `960x150`, `1600x900`, `1920x1080`
  - square/social/sidebar: `900x750`, `1920x1920`
  - tall placements: `1400x2000`
- Keep existing fallbacks so current placements do not regress.

### 5. Extend creative validation tests
- Keep the size-label-vs-dimensions validation, but ensure the new RedotPay assets are included in the shipped registry pass.
- Add targeted tests that the online-ads creative family is represented in the registry and selectable for at least one desktop and one mobile scenario.

### 6. Final verification
- Run the affected test suites only.
- Confirm no affiliate URL loses partner tracking and no RedotPay creative points to the wrong promo slug.

### Technical details
- Files likely to change:
  - `src/config/affiliates.config.ts`
  - `src/lib/affiliateAI/types.ts`
  - `src/lib/affiliateAI/creativePicker.ts`
  - `src/lib/affiliateAI/__tests__/regression.test.ts`
  - `src/lib/affiliateAI/__tests__/validateCreatives.test.ts`
  - new focused test file for RedotPay URL correctness
  - new asset pointer files under `src/assets/affiliates/redotpay/`
- New banner dimensions detected from your uploads:
  - `320x50`, `1600x900`, `1920x1004`, `1920x1920`, `1400x2000`, `900x750`, `1920x237`, `960x150`, `1920x1080`
- One detail still needs to be confirmed during implementation: the exact promo slug for the new “Best Crypto Card for Online Ads” campaign, since the images clearly indicate a separate campaign theme but the current registry only has `affiliates-1`, `affiliates-3`, and `affiliates-5`. If that slug/link is already in the reference project, I’ll pull it from there during build; otherwise I’ll keep the tests strict for the existing known slugs and wire the new assets after that promo URL is identified.