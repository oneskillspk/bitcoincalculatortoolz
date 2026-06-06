# Turkish Translation & Copy Guidelines

This is the canonical reference for any Turkish copy added to the project. It distills the decisions made during the Phase 1–4 TR copy audit (`docs/TR_COPY_AUDIT.md`) into a short, enforceable style guide.

Scope: visible UX/UI strings in `src/translations/index.ts` (`tr:` block), hardcoded TR literals in `src/pages/TurkishHome.tsx` and `src/pages/TurkishNotFound.tsx`, and any `lang === 'tr'` conditional copy in shared components.

Out of scope (governed elsewhere): SEO titles/descriptions, OG/Twitter tags, JSON-LD wording, hreflang, canonicals, sitemap, routing.

---

## 1. Tone & voice

- **Default address form: formal *siz*** across all body copy, microcopy, marketing, and disclaimers.
  - Use `-nız / -niz / -nuz / -nüz` suffixes; `görün`, `hesaplayın`, `yatırımınız`.
  - Never mix in informal *sen* (`-na`, `-nı`, `senin`, `arkadaşına`) — that is a tone bug.
- **Buttons stay bare imperative** (`Hesapla`, `Sıfırla`, `Dışa Aktar`). These are tonally neutral in Turkish UI convention.
- **Editorial copy must read like Turkish, not translated Turkish.** If a sentence only makes sense after mentally retranslating it into English, rewrite from intent.
- **No second-person informal in any user-facing string.**

## 2. Terminology lock (canonical glossary)

Use these forms everywhere. New strings introducing different variants will be rejected by `src/test/tr-terminology.test.ts`.

| English | Canonical TR | Notes |
|---|---|---|
| Notify me | **Bana Haber Ver** | Never *Beni Bildir* (= "Report me"). |
| Invest (verb) | **yatırım yapmak** | Never *yatırmak* (= "deposit"). |
| Volatility | **oynaklık** | Reserve *dalgalanma* for narrative "ups and downs", not as a translation of *volatility*. |
| Percentile | **yüzdelik dilim** | Never *yüzde* (= "percent"). |
| Tracker (software) | **Takip Aracı** or **İzleyici** | Never *Takipçi* (= "follower"). |
| DCA | **Dolar Maliyeti Ortalaması (DCA)** | First mention gloss + acronym; later: *DCA*. |
| Score (calculator) | **Skor** | Lock; do not also use *Not* on the same product. |
| Lump sum | **Toplu Yatırım** | Not *Toplu Tutar*. |
| Drawdown | **Maksimum Düşüş** | Bare *Düşüş* is too generic. |
| CAGR | **YBBO (CAGR)** | First mention; later: *YBBO*. |
| Stock-to-Flow | **Stok-Akış (S2F)** | Dash, not slash. |
| Staking | **Staking** | Keep English (industry standard). |
| Coin | **coin** with `coin'leri` apostrophe-suffix, or **jeton** | Pick one per surface; do not mix. |
| Live / Real-time / Instant | **Canlı** for streams · **Anlık** for results · **Gerçek zamanlı** only when literally accurate | Three near-synonyms — do not freely interchange. |
| Forever-free | **Sonsuza Kadar Ücretsiz** | Not *Sonsuza Dek*. |
| vs (benchmark) | **`-e Kıyasla`** or **Karşılaştırma** | *Karşı* is adversarial; reserve for fight/contest contexts. |
| Fear & Greed Index | **Korku ve Açgözlülük Endeksi** | Per owner decision; *Hırs* is too behavioral. |
| Step-up basis (US tax) | *(omit from main flow)* | US-specific concept; do not surface in TR UX. |

## 3. Numbers, currency, dates, units

- **Decimals: comma.** `%99,9`, `1,5x`. Never `%99.9`.
- **Thousands: dot.** `10.000 BTC`, `1.000.000 ₺`.
- **Percent sign before the number, no space.** `%99,9` (TR convention; the opposite of English `99.9%`).
- **Currency:** `₺` for TRY, `$` only when literally USD. On `/tr` financial outputs, prefer `₺` and `dolar` (lowercase) in body copy instead of `USD`.
- **Dates:** *gün ay yıl* (`25 Ocak 2026`). Months always lowercase in body text.
- **Time units:** space before unit (`30 sn`, `60 dk`, `100 BTC`). Never `30sn`.
- **Dynamic dates must be interpolated tokens** (`{updatedAt}`), never hardcoded strings inside translation values.

## 4. Apostrophe & suffix rules

- Attach TR case suffixes to **proper nouns** with an apostrophe: `Bitcoin'in`, `2013'ten`, `2010'da`, `X'te`.
- **Do not** apostrophize common nouns: write *Dolar Maliyeti Ortalamasının*, not *Dolar Maliyeti Ortalaması'nın*.
- For brand renames, attach the suffix to the active name: **`X'te takip edin`**, not `X (Twitter)'da takip edin`.

## 5. Do / Don't

| Don't | Do | Why |
|---|---|---|
| `Beni Bildir` | `Bana Haber Ver` | "Beni bildir" means *Report me*. |
| `Yatırmadan önce…` | `Yatırım yapmadan önce…` | *Yatırmak* = *deposit*, not *invest*. |
| `Servet Yüzdesi` | `Servet Yüzdelik Dilim` | *Yüzde* = percent, not percentile. |
| `Portföy Takipçisi` | `Portföy Takip Aracı` | *Takipçi* = follower. |
| `Tıklama için değil, netlik için tasarlandı.` | `Tıklatmak için değil, netlik sunmak için tasarlandı.` | Word-for-word calque; supply the missing verbs. |
| `Mali avantaj sağlayan` | `Daha bilinçli kararlar için` | *Mali* in TR = fiscal/tax — bureaucratic. |
| `editöryal tipografi gibi davranıyoruz` | `dergi sayfasındaki tipografi gibi ele alıyoruz` | English metaphor doesn't transfer; rewrite from intent. |
| `arkadaşına` | `arkadaşınıza` | Don't drop into informal *sen* in formal copy. |
| `%99.9` / `30sn` | `%99,9` / `30 sn` | TR locale formatting. |
| `S&P 500'e Karşı` | `S&P 500'e Kıyasla` | *Karşı* is adversarial. |
| `Son güncelleme: 25 Ocak 2026` (hardcoded) | `Son güncelleme: {updatedAt}` (interpolated) | Hardcoded dates silently lie after a refresh. |
| Stacking 4+ attributive nouns (`doğrulanmış tarihsel Bitcoin günlük kapanış fiyat verilerini`) | Split with commas, relative clauses, or two sentences. | Hard to parse, reads as MT. |

## 6. Loanword policy

Hybrid approach (per owner decision):

- **Keep in English** when the term is industry-standard in TR crypto/tech: *staking*, *coin*, *DCA*, *S2F*, *MVRV*.
- **Localize** generic UI vocabulary: *gradient* → *gradyan*, *grid* → *ızgara*. Buttons may remain *buton* if existing app uses that consistently.
- When unsure, default to the form that the target reader is **most likely to recognize without a dictionary**.

## 7. Process

1. Any new TR string MUST be added to `src/translations/index.ts` (`tr:` block) — never hardcoded inline outside `TurkishHome.tsx` / `TurkishNotFound.tsx`.
2. Reuse keys when the same concept is expressed; don't create near-duplicates.
3. New strings must pass `bunx vitest run src/test/tr-terminology.test.ts`. If a new banned variant emerges from a real-world finding, **add** a guard to that test before fixing the string.
4. Dynamic content (dates, counts, currencies) must be `{token}` interpolations, not hardcoded text inside the translation value.
5. JSON-LD / SEO wording changes are out of scope for this guide — handle in a separate, deliberate pass.

---

For the full evidence base (per-key findings, severity, before/after suggestions), see [`docs/TR_COPY_AUDIT.md`](./TR_COPY_AUDIT.md).
