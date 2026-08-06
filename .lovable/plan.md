# High-Converting CTA System for Affiliate Cards

## The problem with today's CTAs

Every partner currently uses a label-style CTA that describes the brand instead of the visitor's next win:

| Partner | Current CTA | Why it under-converts |
| --- | --- | --- |
| Coinbase | "Start buying Bitcoin in minutes" | Generic onboarding copy, no reward, no specificity |
| MEXC | "Sign up on MEXC" | Names a chore ("sign up"), zero value |
| Axi | "Trade Bitcoin CFDs with Axi" | Brand-first, describes the product not the outcome |
| Kraken | "Trade BTC on Kraken" | Same brand-first pattern |
| Bybit | "Claim Bybit bonus" | Vague reward, no number |
| Ledger | "Protect your BTC today" | Closest to good, but no proof or specificity |
| Trezor | "Own your keys — Trezor" | Slogan, not an action |
| CoinLedger | "Crypto tax made easy" | A tagline in a button |
| Paribu / BTCTurk | "Paribu'da işlem yapın" | Pure brand label |

Five of them literally start with the partner's product category, and the partner name is already printed in the card header — so the button repeats information the visitor has.

Nobody clicks "Sign up on MEXC". People click something that names the reward, the effort, or the loss they're avoiding.

## The CTA formula to apply

Every button gets rewritten against one rule set:

1. **Verb the visitor owns** — "Get", "Lock", "Claim", "Keep", "Cut" — never "Sign up", "Register", "Learn more", "Visit".
2. **One specific number** where a real one exists ($200, $79, 0.16%, 20 min, 8,000 USDT). Numbers beat adjectives; specificity is the single largest measured lift in button copy.
3. **Outcome, not mechanism** — "Keep your BTC off exchanges" beats "Buy a hardware wallet".
4. **Never name the partner in the button** — the header already does. This frees 8-14 characters for value.
5. **2-5 words, under 30 characters** so nothing truncates on a 320px card. Turkish gets its own copy, not a translation (TR runs ~20% longer).
6. **Honest** — capped bonuses keep "up to"/"kadar" (already enforced by the config validator).

### Psychology applied per card type

- **Loss aversion** for custody partners (Ledger, Trezor): the pain of losing coins outweighs the pleasure of buying a device. "Keep your BTC off exchanges" / "Get your keys off the exchange".
- **Reciprocity + concreteness** for bonus partners (Coinbase, RedotPay, Bybit, MEXC): lead with the number they receive, not the account they open.
- **Effort reduction** for tax tools (Koinly, CoinLedger): the objection is "this will take a weekend". "Finish your taxes in 20 min".
- **Identity/competence** for pro tools (Kraken, TradingView, Axi, Vantage): traders buy edge — cite the edge, not the label. "Trade at 0.16% fees".
- **Zero-risk framing** where genuinely free (TradingView, Koinly preview): "Start free" removes the price objection at the click moment.

### Proposed copy (EN / TR)

| Partner | New EN CTA | New TR CTA |
| --- | --- | --- |
| Ledger | Keep your BTC off exchanges | BTC'ni borsadan çıkar |
| Trezor | Hold your own keys | Anahtarların sende kalsın |
| Coinbase | Get up to $200 in crypto | $200'e kadar kripto kazan |
| Kraken | Trade at 0.16% fees | %0.16 komisyonla işlem yap |
| MEXC | Unlock up to 8,000 USDT | 8.000 USDT'ye kadar kazan |
| Bybit | Claim up to $30,000 bonus | 30.000$'a kadar bonus al |
| RedotPay | Get $5 + your Visa card | 5$ + Visa kartını al |
| Koinly | Finish your taxes in 20 min | Vergini 20 dakikada bitir |
| CoinLedger | Sort your crypto taxes free | — |
| Swan | Automate weekly sat stacking | — |
| TradingView | Chart BTC free | BTC grafiklerini ücretsiz aç |
| Axi | Trade BTC CFDs from 0.0 pips | 0.0 pip'ten BTC CFD işlem yap |
| Vantage | Open a live account free | Ücretsiz canlı hesap aç |
| BTCTurk | — | TL ile BTC almaya başla |
| Paribu | — | TL ile ilk BTC'ni al |

Final wording is tuned per partner against their real live offer during implementation; anything unverifiable gets dropped rather than invented.

## Beyond the words: three structural conversion upgrades

1. **Reassurance microline under the button.** One 11px muted line ("No KYC to browse", "Free plan, no card", "Regulated since 2011", "30-day returns"). It answers the unspoken objection at the exact moment of hesitation — the highest-leverage 4 words on the card, and it costs no button space.
2. **Intent-aware CTA variants.** The card already knows the page slug and the visitor's result state. A visitor on the liquidation calculator whose position is high-risk should see "Cut your liquidation risk", not the generic broker line. Add an optional `cta_variants` map keyed by intent (`high-risk`, `long-term`, `tax`, `beginner`) with fallback to the default CTA.
3. **Let the bandit pick the winner.** Two CTA variants per partner registered with the existing `useBanditVariant` system, stamped into the click payload so real CTR decides — not opinion. Reuses the tracking already in place.

## Guardrails added to the config validator

New rules so weak copy can never ship again:

- `weak-cta-verb` — flags "sign up", "register", "learn more", "visit", "click here", "kayıt ol".
- `brand-in-cta` — flags a CTA containing the partner's own name (the header already prints it).
- `cta-too-long` — flags EN over 30 chars / TR over 34 chars (truncation risk on mobile).
- `cta-missing-value` — warns when a partner has a monetary badge but the CTA carries no number or benefit word.

Existing rules (arrow-stripping, unqualified amounts, duplicate badges) stay untouched.

## Technical notes

- Copy lives in `src/config/affiliates.config.ts` (`cta_short_en/tr`, `cta_long_en/tr`); no component rewrite needed for the words themselves.
- Microline: optional `reassurance_en/tr` field, rendered by `PromoCard.tsx` under the CTA button, hidden when absent.
- Intent variants: optional `cta_variants` resolved in `placementResolver.ts` before the existing language fallback chain, so every current fallback keeps working.
- Validator rules extend `src/lib/affiliateAI/configValidator.ts` with unit tests in the existing test file; the "shipped registry is clean" test keeps CI honest.
- CFD partners (Axi, Vantage) keep their risk-warning wording intact — no CTA change may imply guaranteed profit.
- Verify visually on the DCA and lot-size pages at 320/768/1280px so no button truncates in either language.

## Sequence

1. Rewrite EN + TR CTAs for all 15 partners.
2. Add the reassurance microline field and render it.
3. Add validator rules + tests, run the affiliate suite.
4. Add intent-aware variants for the trading/tax/custody clusters.
5. Register two variants per partner with the bandit and verify the click payload carries the variant stamp.
