# Turkish (/tr/*) Language & UX Copy Audit

**Scope:** Visible Turkish UI/UX copy rendered under `/tr/*`.
**Read-only:** No code, translation, route, SEO, sitemap, hreflang, or metadata changes were made. This document is diagnosis + plan only.
**Sources reviewed:**
- `src/translations/index.ts` — `tr:` block (lines ~660–1010, ~250 keys)
- `src/pages/TurkishHome.tsx` (hardcoded TR JSON-LD + page chrome — JSON-LD wording is in scope as it is also surfaced in `<title>`/`<meta description>` mirror copy; only the UX phrasing is evaluated, not the SEO surface itself)
- `src/pages/TurkishNotFound.tsx`
- Route inventory: `src/test/trCalculatorRoutes.ts`
- Spot-check of representative calculator pages (DCA, Profit/Loss, Retirement, Accumulation Score) for hardcoded TR literals
- Shared chrome components rendered on `/tr` (`Header`, `Footer`, `ProfessionalHeroSection`, `PremiumCalculatorCards`, `EditorialStatement`)

Out of scope: SEO copy (titles, meta descriptions, OG/Twitter, JSON-LD wording), routing, prerender wiring, canonicals, sitemap. Where the same string is used both as UX copy and an SEO surface, the audit comments only on UX quality; any SEO-bearing key requires a separate, deliberate pass.

---

## 1. Executive Summary

### Overall quality score: **3.1 / 5**

The Turkish surface is largely understandable and visibly hand-touched (correct circumflex on *kâr*, mostly correct suffix harmony, idiomatic constructions in many marketing strings). However, it is **not yet native-grade for a finance product**. The corpus shows three structural problems:

1. **Critical mistranslations that change meaning** — the most damaging being `common.notifyMe: "Beni Bildir"` (means *"Report me / Tag me"*, not *"Notify me"*) and `features.precision.desc: "Yatırmadan önce …"` (means *"Before depositing"*, not *"Before investing"*).
2. **Terminology drift** — the same concept appears with different Turkish words across pages (e.g. *Skor* vs *Not* for "score"; *Dolar Maliyet Ortalaması* vs *Dolar Maliyeti Ortalaması* vs *Maliyet Ortalaması* for "DCA"; *dalgalanma* vs *oynaklık* for "volatility").
3. **Literal English calques in editorial copy** — high-visibility hero/why-section lines were translated word-for-word and read as "English in Turkish words" (e.g. *"Tıklama için değil, netlik için tasarlandı"*, *"Sayılara editöryal tipografi gibi davranıyoruz"*, *"Mali avantaj sağlayan…"*).

There is also one decimal-format violation of TR convention (`%99.9` instead of `%99,9`) and inconsistent formality (mostly formal *siz*, with occasional imperative tone shifts).

### Top 5 recurring problem patterns

| # | Pattern | Example | Where |
|---|---------|---------|-------|
| 1 | Wrong-meaning literal translation | `Beni Bildir` (= *Report me*) | `common.notifyMe` |
| 2 | Verb confusion *yatırmak* (deposit) vs *yatırım yapmak* (invest) | `Yatırmadan önce potansiyel kazanç…` | `features.precision.desc` |
| 3 | Terminology drift across pages | `Birikim Skoru` (card) vs `Birikim Notu` (badge) for the same calculator | `accumulation.*` |
| 4 | English-calque editorial voice | `Sayılara editöryal tipografi gibi davranıyoruz` | `why.a3` |
| 5 | Decimal/units not Turkish-formatted | `%99.9 Doğruluk`, `30sn` | `hero.marquee.*` |

### Severity counts (in this report)

- **Critical:** 4
- **High:** 14
- **Medium:** 21
- **Low:** 12

(Counts cover findings explicitly enumerated below. A full key-by-key sweep will surface more Medium/Low items during Phase 3.)

### Coverage gap (must call out)

The `tr:` block contains only ~250 keys, almost all for marketing chrome (hero, FAQ, footer, calculator card titles/descriptions) and four calculator page shells (DCA, Profit/Loss, Investment, Retirement, Accumulation Score). **The other ~40 calculator pages mounted under `/tr/*` (per `src/test/trCalculatorRoutes.ts`) currently render their internal labels, placeholders, results, charts, and disclaimers in English**, falling through `t()`'s English fallback. This is a localization completeness issue, not a translation-quality issue, but it is the single biggest UX problem on `/tr` and must be acknowledged here so it isn't masked by a "fix the existing Turkish" pass.

---

## 2. Detailed Findings

Conventions:
- **Key** = the translation key id (or `[hardcoded]` for inline literals).
- **Current** = exact string as rendered today.
- **Issue** = why it's wrong/awkward.
- **Öneri** = suggested replacement (clearly marked as a suggestion, not a decision).
- **Severity** = Critical / High / Medium / Low.

### 2.1 Critical — meaning is wrong or misleading

#### F-C1 — `common.notifyMe`
- **Current:** `Beni Bildir`
- **Issue:** *Beni bildir* literally means *"Report me / Flag me / Denounce me"*. The intended meaning ("Notify me when available") is conveyed by *Bana haber ver* or *Bana bildir*. The current string is the most prominent CTA on every "Coming Soon" calculator card and reads as a privacy/abuse action.
- **Öneri:** `Bana Haber Ver` (most natural) or `Bana Bildir`.
- **Severity:** Critical.

#### F-C2 — `features.precision.desc`
- **Current:** `Yatırmadan önce potansiyel kazanç veya kayıpları görün. …`
- **Issue:** *Yatırmak* in finance Turkish means *to deposit*, not *to invest*. "Before depositing" is misleading on an investment-analysis calculator. The English source ("Before you invest") requires *Yatırım yapmadan önce*.
- **Öneri:** `Yatırım yapmadan önce potansiyel kazançları veya kayıpları görün. Hesaplayıcımız, işlemleri anında modellemenizi kolaylaştırır.`
- **Severity:** Critical.

#### F-C3 — `accumulation.badge` vs `accumulation.breadcrumb`
- **Current:** badge `Bitcoin Birikim Notu`; breadcrumb `Bitcoin Birikim Skoru`.
- **Issue:** Same product, two different Turkish names on the same page. *Not* (= grade/mark) and *Skor* (= score) are both defensible standalone but cannot coexist on one screen.
- **Öneri:** Lock one. Recommended: `Birikim Skoru` (matches the calculator card title `calculators.accumulationScore.title`). The badge then becomes `Bitcoin Birikim Skoru`.
- **Severity:** Critical (visible self-contradiction).

#### F-C4 — `calculators.bitcoinLoan.desc`
- **Current:** `… Bitcoin'e karşı borçlanmayı satmakla karşılaştırın`
- **Issue:** Word order makes the sentence parse as *"compare borrowing-against-Bitcoin with selling [it]"* but only after re-reading; first pass reads as *"compare selling [the act of] borrowing against Bitcoin"*. Source intent is "compare borrowing against your Bitcoin vs. selling it".
- **Öneri:** `LTV oranlarını ve tasfiye fiyatlarını hesaplayın; Bitcoin'inizi teminat gösterip kredi almakla satmayı karşılaştırın.`
- **Severity:** Critical (financial product misunderstanding risk).

---

### 2.2 High — unnatural / clearly non-native

#### F-H1 — `why.title`
- **Current:** `Tıklama için değil, netlik için tasarlandı.`
- **Issue:** Word-for-word calque of "Designed for clarity, not for clicks." In Turkish the contrast verb is missing; reads as a slogan that hasn't been finished.
- **Öneri:** `Tıklatmak için değil, netlik sunmak için tasarlandı.` or rewrite: `Tıklama tuzağı değil, net cevap.`
- **Severity:** High.

#### F-H2 — `why.intro`
- **Current:** `Tek satır hesaplayıcı kodu yazmadan önce kendimize sorduğumuz beş soru.`
- **Issue:** *"Tek satır hesaplayıcı kodu"* compounds two nouns without a connector and reads awkwardly. A Turkish reader expects *"hesaplayıcı için tek satır kod"*.
- **Öneri:** `Hesaplayıcı için tek satır kod yazmadan önce kendimize sorduğumuz beş soru.`
- **Severity:** High.

#### F-H3 — `why.a3`
- **Current:** `… Biz sayılara editöryal tipografi gibi davranıyoruz: büyük, sakin ve tek bakışta okunabilir.`
- **Issue:** *"Editöryal tipografi gibi davranmak"* is an English metaphor translated literally; *editöryal* is borderline in Turkish editorial discourse and "treat numbers like typography" doesn't carry in TR. Also *yanıp sönen göstergeler, neon gradyanlar* — *gradyan* is uncommon outside dev jargon.
- **Öneri:** `… Biz sayıları, dergi sayfasındaki tipografi gibi ele alıyoruz: büyük, sakin ve tek bakışta okunabilir.` and replace *neon gradyanlar* with *parlak renk geçişleri*.
- **Severity:** High.

#### F-H4 — `why.a5`
- **Current:** `… 12 dakikalık bir YouTube reklamı izlemeden bir arkadaşına Bitcoin matematiğini anlatmak isteyen herkes için.`
- **Issue:** *"Bir arkadaşına"* uses informal 2nd person possessive (-ına) — the rest of the site uses formal *siz* / *-nız*. Tone whiplash.
- **Öneri:** `… ve 12 dakikalık bir YouTube reklamına katlanmadan bir arkadaşınıza Bitcoin matematiğini anlatmak isteyen herkes için.`
- **Severity:** High.

#### F-H5 — `hero.subtitle`
- **Current:** `… Mali avantaj sağlayan güçlü, ücretsiz kripto yatırım araçları.`
- **Issue:** *Mali avantaj sağlayan* is a literal of "that give you a financial edge"; in TR *mali* means *fiscal/tax-related*, not *financial-as-personal-finance*. Reads bureaucratic.
- **Öneri:** Drop or rewrite: `… Daha bilinçli kripto yatırım kararları için güçlü, ücretsiz araçlar.`
- **Severity:** High.

#### F-H6 — Volatility terminology drift
- **Current:** `Bitcoin Oynaklık Hesaplayıcısı` (`calculators.volatility.title`) **but** `Bitcoin'in eşsiz dalgalanmasını` (`faq.a2`) and `piyasa dalgalanmasının` (`faq.answers.dca`).
- **Issue:** TR finance term is *oynaklık* (= volatility). *Dalgalanma* (= fluctuation) is colloquial and used inconsistently. Reader sees two different concepts.
- **Öneri:** Use *oynaklık* everywhere when translating *volatility*; reserve *dalgalanma* for narrative "ups and downs".
- **Severity:** High.

#### F-H7 — `calculators.wealthPercentile.title`
- **Current:** `Bitcoin Servet Yüzdesi Hesaplayıcısı`
- **Issue:** *Yüzde* = percent. *Percentile* = *yüzdelik dilim*. The calculator places the user in a percentile, not a percent.
- **Öneri:** `Bitcoin Servet Yüzdelik Dilim Hesaplayıcısı` (or marketing-friendly: `Bitcoin Servet Sıralaması`).
- **Severity:** High.

#### F-H8 — `calculators.obituariesTracker.title`
- **Current:** `Bitcoin Ölüm İlanları Takipçisi`
- **Issue:** *Takipçi* in TR means *follower* (as in a person who follows). For "tracker" (the tool), the established calque is *İzleyici* or *Takip Aracı*.
- **Öneri:** `Bitcoin Ölüm İlanları İzleyicisi` or `Bitcoin "Öldü" İlanları Takip Aracı`.
- **Severity:** High.

#### F-H9 — `calculators.portfolioTracker.title`
- **Current:** `Bitcoin Portföy Takipçisi`
- **Issue:** Same *Takipçi* problem (= follower, not tracker).
- **Öneri:** `Bitcoin Portföy Takip Aracı` (or just `Bitcoin Portföyüm`).
- **Severity:** High.

#### F-H10 — DCA terminology drift
- **Currents (all in the corpus):**
  - `Dolar Maliyet Ortalama Hesaplayıcısı` (`calculators.dca.title`)
  - `Dolar Maliyet Ortalaması'nın` (`features.strategic.desc`)
  - `dolar maliyeti ortalama` (`faq.answers.dca`)
  - `dolar maliyet ortalaması almanın` (`faq.q7` answer / `calculators.lumpSumVsDca.desc`)
- **Issue:** The Turkish proper-noun form should consistently use the genitive *Dolar Maliyeti Ortalaması* (= "the averaging of dollar cost"). Current strings drop the genitive *-i* on *Maliyet*, mix capitalization, and alternate between noun and verb-noun forms.
- **Öneri:** Lock canonical form **`Dolar Maliyeti Ortalaması (DCA)`** and use it consistently; on second mention, just *DCA*.
- **Severity:** High.

#### F-H11 — `about.creator.desc`
- **Current:** `Satoshi Labs'tan beri Bitcoin Maxi, neredeyse 2010'dan beri.`
- **Issue:** Two *-dan beri* clauses awkwardly stacked; reads like a draft. *Satoshi Labs* is also not a date — the source likely means "since the Satoshi era" or "since whitepaper days".
- **Öneri:** `2010'a yakın bir tarihten beri Bitcoin maksimalisti.` (or whatever the founder actually wants to claim — flag for owner review).
- **Severity:** High (founder bio is high-trust copy).

#### F-H12 — `about.follow`
- **Current:** `X (Twitter)'da takip edin:`
- **Issue:** Apostrophe + suffix on a parenthesized brand renders as "X (Twitter)'da" — TR style would attach the suffix to the active name only: `X'te (eski adıyla Twitter) takip edin:`.
- **Öneri:** `X'te takip edin:` (Twitter rename is now ambient enough to drop the gloss).
- **Severity:** High.

#### F-H13 — `comparison.vsSP500`
- **Current:** `S&P 500'e Karşı`
- **Issue:** *Karşı* (= against, hostile) is the wrong preposition for benchmark comparison. TR convention is *-e kıyasla* or *-e karşı* only in adversarial framing.
- **Öneri:** `S&P 500'e Kıyasla` or `S&P 500 Karşılaştırması`.
- **Severity:** High.

#### F-H14 — `editorial.statement`
- **Current:** `Zamanınıza saygı duyan rakamlar. Gizliliğinize saygı duyan araçlar.`
- **Issue:** Grammatically fine, but *rakamlar* "respecting your time" is a literal English personification that doesn't carry in TR. Reads like a translation, not a tagline.
- **Öneri:** `Zamanınızı boşa harcamayan rakamlar. Gizliliğinizi korumayan araçlar yok.` or rewrite from intent: `Hızlı sonuçlar. Gizli kalan veriler.`
- **Severity:** High.

---

### 2.3 Medium — awkward, sub-optimal, or inconsistent

#### F-M1 — `hero.marquee.accuracy`
- **Current:** `%99.9 Doğruluk` → **Issue:** Decimal separator must be comma in TR. → **Öneri:** `%99,9 Doğruluk`. **Severity:** Medium (locale violation, visible in hero marquee).

#### F-M2 — `hero.marquee.liveUpdates`
- **Current:** `30sn Canlı Güncelleme`
- **Issue:** `sn` without space + ambiguous reading. → **Öneri:** `30 sn'de bir canlı güncelleme` or `Her 30 saniyede güncelleme`. **Severity:** Medium.

#### F-M3 — `hero.trust.realTime` vs `hero.marquee.realTimePrices`
- **Currents:** `Gerçek Zamanlı Veri` and `Gerçek Zamanlı Fiyatlar` and elsewhere *Canlı* (live) and *anlık* (instant) are used interchangeably.
- **Issue:** Three near-synonyms for the same product claim. → **Öneri:** Pick *Canlı* for tickers, *Anlık* for results, *Gerçek zamanlı* only where literally accurate. **Severity:** Medium.

#### F-M4 — `hero.marquee.freeForever` vs `calculators.portfolioTracker.desc`
- `Sonsuza Dek Ücretsiz` (marquee) vs `Sonsuza kadar ücretsiz.` (card desc).
- **Issue:** Inconsistent phrasing for the same claim. → **Öneri:** Lock `Sonsuza Kadar Ücretsiz`. **Severity:** Medium.

#### F-M5 — `faq.q1`
- **Current:** `Bitcoin Calculator Tools Nedir?` → **Issue:** TR sentence-case after a non-Turkish brand name is lowercase *nedir*. → **Öneri:** `Bitcoin Calculator Tools nedir?`. **Severity:** Medium.

#### F-M6 — `calculators.fearGreed.title`
- **Current:** `Bitcoin Korku ve Açgözlülük Endeksi` → **Issue:** Established TR-finance translation is *Korku ve Hırs Endeksi*. *Açgözlülük* is correct dictionary translation but the index is conventionally branded with *Hırs* in TR crypto press. → **Öneri:** Confirm with editor; if mass-market reach is the goal, `Korku ve Hırs Endeksi`. **Severity:** Medium (terminology choice, not error).

#### F-M7 — `calculators.onChain.desc`
- **Current:** `… Stok/Akış modeli …` → **Issue:** S2F is canonically *Stok-Akı Oranı* or *Stok-Akış Modeli* (with dash, not slash). Slash reads as "stock divided by flow" which is the formula, not the model name. → **Öneri:** `Stok-Akış Modeli (S2F)`. **Severity:** Medium.

#### F-M8 — `calculators.drawdown.title`
- **Current:** `Bitcoin Düşüş Hesaplayıcısı` → **Issue:** *Düşüş* alone = generic "decline". The financial term *drawdown* is *maksimum düşüş* / *düşüş oranı*. → **Öneri:** `Bitcoin Maksimum Düşüş Hesaplayıcısı`. **Severity:** Medium.

#### F-M9 — `calculators.cagr.title`
- **Current:** `Bitcoin YBBO Hesaplayıcısı` → **Issue:** Acronym *YBBO* is not in common TR usage; TR audience recognises *CAGR* untranslated. → **Öneri:** `Bitcoin CAGR (Yıllık Bileşik Büyüme) Hesaplayıcısı`. **Severity:** Medium.

#### F-M10 — `calculators.timeMachine.desc`
- **Current:** `Önceden ayarlanmış ünlü tarihi olaylarla …` → **Issue:** *Önceden ayarlanmış* (= pre-set) is jargon-y; *tarihi olay* is fine but adjacency reads oddly. → **Öneri:** `Önceden tanımlı ünlü olaylarla veya seçtiğiniz bir tarihten …`. **Severity:** Medium.

#### F-M11 — `calculators.inheritanceTax.desc`
- **Current:** `… adım yükseltme bazını, miras vergisini …` → **Issue:** *Step-up basis* literal-translated as *adım yükseltme bazı* — this concept doesn't exist in TR tax law; the term is foreign to TR readers. → **Öneri:** Either gloss it (`miras maliyet bazı yeniden değerlemesi (step-up)`) or drop and rephrase. **Severity:** Medium.

#### F-M12 — `calculators.staking.title`
- **Current:** `Bitcoin Staking Hesaplayıcısı` → **Issue:** *Staking* kept in English while neighbouring titles translate ("Madencilik", "Yatırım"). Inconsistent. → **Öneri:** Either lock `Bitcoin Staking` (industry term) or `Bitcoin Stake Etme Hesaplayıcısı`. **Severity:** Medium.

#### F-M13 — `calculators.piToBitcoin.desc`
- **Current:** `Pi Network coinlerini …` → **Issue:** *coin* untranslated mid-sentence; TR uses *jeton* or *coin* + Turkish suffix attached properly (`Pi Network coin'lerini`). → **Öneri:** `Pi Network jetonlarını canlı piyasa fiyatlarıyla Bitcoin ve dolara dönüştürün.`. **Severity:** Medium.

#### F-M14 — `calculators.stackSats.title`
- **Current:** `Satoshi Yığma Hedef Hesaplayıcısı` → **Issue:** *Yığma* (= piling up) is informal/slangy; *biriktirme* is the neutral term. The English brand "Stack Sats" is itself slang, so this is a tone decision. → **Öneri:** Marketing tone OK as-is; for clarity prefer `Satoshi Biriktirme Hedefi Hesaplayıcısı`. **Severity:** Medium.

#### F-M15 — `calculators.lightning.desc`
- **Current:** `Ödemeler için Lightning Network ücretleri ve yönlendirme optimizasyonu` → **Issue:** Reads as a noun pile with no verb. → **Öneri:** `Ödemeleriniz için Lightning Network ücretlerini hesaplayın ve yönlendirmeyi optimize edin.`. **Severity:** Medium.

#### F-M16 — `comparison.dataUpdated`
- **Current:** `Veri dönemi: {period} | Son güncelleme: 25 Ocak 2026` → **Issue:** Hardcoded date in a translation key — will silently lie once the data is refreshed. → **Öneri:** Make the date a `{updatedAt}` variable. **Severity:** Medium (governance, not phrasing).

#### F-M17 — `editorial.eyebrow`
- **Current:** `KURULUŞ 2024 · 45 ARAÇ · CANLI BTC` → **Issue:** *Kuruluş 2024* without a verb reads abruptly. → **Öneri:** `2024'TEN BERİ · 45 ARAÇ · CANLI BTC`. **Severity:** Medium.

#### F-M18 — `footer.dataSources`
- **Current:** `Veri: CoinGecko API (canlı fiyatlar, 60sn yenileme) · Temmuz 2010'dan günlük tarihsel fiyatlar · …` → **Issue:** Mixed `60sn` and *Temmuz 2010* and `100'den fazla` — phrasing is fine but `60sn` should be `60 sn` or `60 saniyede`. **Severity:** Medium.

#### F-M19 — Apostrophe + suffix consistency
- Multiple keys use TR proper-noun apostrophe correctly (`Bitcoin'in`, `2013'ten`, `2010'da`), but `Dolar Maliyet Ortalaması'nın` (line `features.strategic.desc`) attaches a possessive to a non-proper noun, which TR style guides discourage.
- **Öneri:** Drop the apostrophe: `Dolar Maliyeti Ortalamasının`. **Severity:** Medium.

#### F-M20 — `whatif.inputs.toggle`
- **Current:** `Sonuçları BTC Cinsinden Göster` → **Issue:** OK literally, but toggle labels are usually verbs in TR: *Göster* alone implies the action; longer form is bulky for a switch. → **Öneri:** `BTC cinsinden göster`. **Severity:** Low–Medium.

#### F-M21 — `retirement.tab.fire.sub`
- **Current:** `Ne zaman bırakabilirim?` → **Issue:** *Bırakmak* is bare ("quit what?"). FIRE = quitting work; needs an object. → **Öneri:** `İşi ne zaman bırakabilirim?`. **Severity:** Medium.

---

### 2.4 Low — polish / stylistic

- **F-L1** `hero.cta.secondary: "Demoyu İzle"` — *Demoyu* (accusative on *demo*) is fine but TR readers often see `Demoyu izle` lowercase or `Demoyu Oynat`. Keep as-is unless tone-checking. **Low.**
- **F-L2** `hero.title` is split into `Bitcoin Hesaplayıcı` + `Araçları` (`hero.title.bitcoin`) — concatenation may produce *Bitcoin Hesaplayıcı Araçları* which is grammatical but verbose. **Low.**
- **F-L3** `common.available: "Mevcut"` — fine; consider `Kullanılabilir` for parity with TR app-store conventions. **Low.**
- **F-L4** `features.future.desc: "Emekli olmak için ne kadar Bitcoin'e ihtiyacınız var?"` — natural; question-form CTAs are good. No change. **Low.**
- **F-L5** `comparison.realData: "Gerçek Veri"` — pure label; consider `Gerçek Piyasa Verisi`. **Low.**
- **F-L6** `comparison.topBadge: "Zirve"` — single word badge OK; alternative `En İyi`. **Low.**
- **F-L7** `comparison.disclaimerText` — long, dense; readable but could be broken into bullets in a future polish. **Low.**
- **F-L8** `ticker.error: "Fiyat alınamadı — yeniden deneniyor"` — natural; em-dash usage is correct. **Low.**
- **F-L9** `dca.empty.subtitle: "… ve hesapla butonuna tıklayın"` — *buton* is loanword OK; *düğme* is the native equivalent. Decide once project-wide. **Low.**
- **F-L10** `accumulation.disclaimer` — *Yalnızca Eğitim Amaçlı* prefix is fine; English-style "for educational purposes only" lock-up consider sentence-cased `Yalnızca eğitim amaçlıdır`. **Low.**
- **F-L11** Most `*.breadcrumb` strings duplicate the page title — fine, but breadcrumb convention is short noun: e.g. `DCA`, `Kâr ve Zarar` (already shortened — good). **Low.**
- **F-L12** `footer.madeWith: "Bitcoin topluluğu için 💙 ile yapıldı"` — natural; the heart matches BTC brand. **Low / no change.**

---

### 2.5 TurkishHome.tsx — hardcoded body / JSON-LD prose

Most strings in this file are SEO surfaces (title, meta description, OG, FAQ schema) which the audit explicitly does **not** rewrite. However, two hardcoded prose strings are visible to users via search/AI surfaces and exhibit the same patterns:

- **F-M22 (JSON-LD FAQ answer for "doğru mu")** — *"… 2013'ten bu yana her günü kapsayan CoinGecko API'sinden alınan doğrulanmış tarihsel Bitcoin günlük kapanış fiyat verilerini kullanır."* — noun pile (*doğrulanmış tarihsel Bitcoin günlük kapanış fiyat verilerini*) is grammatical but six attributive nouns in a row is hard to parse. **Öneri:** *"… CoinGecko API'sinden alınan, 2013'e kadar uzanan doğrulanmış günlük Bitcoin kapanış fiyatlarını kullanır."* **Severity:** Medium (but JSON-LD — flag, do not edit in this phase).
- **F-L13 (JSON-LD answer 4)** — *"Hayır, asla hesap, kayıt veya ödeme gerekmez."* — comma-heavy listing; minor. **Low.**

### 2.6 TurkishNotFound.tsx

- **F-L14** `Bu Bitcoin hesaplayıcısı henüz mevcut değil gibi görünüyor. Sizi hesaplamaya geri götürelim!` — natural and warm. No change.
- **F-M23** Button `Hesaplayıcıları Görüntüle` links to `/tr/hesaplayicilar` — out of audit scope (routing), but the label is good.

### 2.7 Shared chrome (Header / Footer / Hero) — observations

- Header nav strings (`nav.home`, `nav.calculators`, `nav.tools`, `nav.about`, `nav.contact`) are clean.
- Footer link labels (`footer.link.*`) are clean and consistent.
- The single biggest risk is `footer.link.lumpSum: "Toplu Yatırım vs DCA"` vs `calculators.lumpSumVsDca.title: "Toplu Tutar vs. DCA Karşılaştırma Aracı"` — same target, two different names (*Toplu Yatırım* vs *Toplu Tutar*). Add to terminology lock.

---

## 3. Cross-Cutting Issues

### 3.1 Terminology inconsistencies (lock these)

| English | Variants currently in TR corpus | Recommended canonical |
|---------|---------------------------------|------------------------|
| Notify me | `Beni Bildir` | **`Bana Haber Ver`** |
| Invest (verb) | `yatırmak`, `yatırım yapmak` | **`yatırım yapmak`** |
| Volatility | `oynaklık`, `dalgalanma` | **`oynaklık`** (reserve *dalgalanma* for narrative) |
| Percentile | `Yüzde`, *(missing)* | **`yüzdelik dilim`** |
| Tracker (tool) | `Takipçi`, `İzleyici` | **`Takip Aracı`** or **`İzleyici`** |
| DCA | `Dolar Maliyet Ortalama(sı)` variants | **`Dolar Maliyeti Ortalaması (DCA)`** |
| Score (calculator) | `Skor`, `Not` | **`Skor`** |
| Lump sum | `Toplu Yatırım`, `Toplu Tutar` | **`Toplu Yatırım`** |
| Drawdown | `Düşüş` | **`Maksimum Düşüş`** |
| CAGR | `YBBO` | **`CAGR (Yıllık Bileşik Büyüme)`** |
| Stock-to-Flow | `Stok/Akış` | **`Stok-Akış (S2F)`** |
| Staking | `Staking` | Decide once; prefer **`Staking`** (industry standard) |
| Coin (token) | `coin`, `jeton` | **`coin`** with TR apostrophe-suffix, OR **`jeton`** — decide once |
| Live / Real-time / Instant | `Canlı`, `Gerçek zamanlı`, `Anlık` | **`Canlı`** for streams, **`Anlık`** for results, **`Gerçek zamanlı`** only when literally true |
| Forever-free | `Sonsuza Dek` / `Sonsuza kadar` | **`Sonsuza Kadar`** |
| Tracker badge | (`Skor` vs `Not`) | covered above |
| vs (benchmark) | `vs`, `vs.`, `Karşı` | **`-e Kıyasla`** or **`Karşılaştırma`** |

### 3.2 Formality / address form

The corpus is ~95% formal *siz* (`-nız`, `-niz`, *yatırımınız*, *görün*). Three drifts to informal *sen* found:
- `why.a5` — `bir arkadaşına` (informal possessive).
- `dca.empty.subtitle` — imperative `tıklayın` formal-OK, but `girin` (in same string) formal-OK; consistent here, no issue.
- Minor: occasional bare imperatives (`Hesapla`) on buttons read as informal — TR app convention accepts this (buttons are tonally neutral).

**Recommendation:** Lock **formal *siz*** site-wide. Buttons remain bare imperative.

### 3.3 Number / currency / date phrasing

- **Decimals:** must use **comma** (`%99,9`, not `%99.9`). One violation found (F-M1).
- **Thousands:** TR uses `.` (e.g. `10.000 BTC`) — `calculators.pizzaDay.desc` correctly says `10.000 BTC`. ✅
- **Currency symbol:** TRY symbol is `₺` (already used in `formatTRY.ts`); no UI string in the audited corpus writes `TL` or `TRY` in body copy — good.
- **Dates:** TR convention is *gün ay yıl* (`25 Ocak 2026`) — corpus is consistent ✅.
- **Time units:** `sn` for *saniye* should be space-separated (`30 sn`, not `30sn`).

### 3.4 Calque inventory (translate intent, not words)

| Calque | Where | Intent |
|--------|-------|--------|
| *Tıklama için değil, netlik için tasarlandı* | `why.title` | "Built to give clear answers, not to farm clicks" |
| *Sayılara editöryal tipografi gibi davranıyoruz* | `why.a3` | "We typeset numbers like a magazine" |
| *Mali avantaj sağlayan* | `hero.subtitle` | "That give you an edge in your investments" |
| *Zamanınıza saygı duyan rakamlar* | `editorial.statement` | "Fast results that don't waste your time" |
| *Adım yükseltme bazı* | `calculators.inheritanceTax.desc` | "Inherited cost basis reset (US 'step-up basis')" — likely n/a in TR market |

---

## 4. Fix Plan (Phased, no code yet)

> Each phase touches only `src/translations/index.ts` (`tr:` block) plus the hardcoded TR strings in `TurkishHome.tsx` / `TurkishNotFound.tsx`. No route, SEO, or sitemap files are modified. JSON-LD prose changes are deferred to a separate SEO-aware pass.

### Phase 1 — Critical fixes (target: 1 PR, ≤10 keys)

Ship the 4 Critical findings + the 2 most user-visible Highs:
- F-C1 `common.notifyMe` → `Bana Haber Ver`
- F-C2 `features.precision.desc` → fix *yatırmak* → *yatırım yapmak*
- F-C3 `accumulation.badge` → align with `Skor`
- F-C4 `calculators.bitcoinLoan.desc` → reorder sentence
- F-H1 `why.title` → rewrite
- F-H7 `calculators.wealthPercentile.title` → `Yüzdelik Dilim`

**Validation:** visual walk of `/tr`, `/tr/bitcoin-emeklilik-hesaplayicisi` (any coming-soon CTA), `/tr/bitcoin-kar-hesaplayicisi`, `/tr/birikim-skoru`, `/tr/bitcoin-kredi`. No existing tests break (`bunx vitest run`).

### Phase 2 — Terminology lock (target: 1 PR, ~25 keys)

Apply the §3.1 canonical glossary to every occurrence. Mostly mechanical search-replace inside the `tr:` block.

**Validation:** add a lightweight test `src/test/tr-terminology.test.ts` that asserts the `tr:` block does not contain banned variants (e.g. no `Beni Bildir`, no `Birikim Notu`, no `dalgalanma` as a `volatility` translation in `calculators.*` keys, no `%[0-9]+\.[0-9]` decimal-dot pattern). Pure regex, no runtime cost.

### Phase 3 — UX clarity & native voice (target: 1 PR, ~30 keys)

Rewrite the remaining High + Medium findings, focusing on:
- Editorial/hero strings (`why.*`, `editorial.*`, `hero.subtitle`)
- Card descriptions with noun-pile sentences (`calculators.lightning.desc`, `calculators.staking.title`, etc.)
- Formality alignment (`why.a5`)

**Validation:** human read-through by a TR-native reviewer (flag in PR description as required).

### Phase 4 — Polish + governance (target: 1 PR + 1 small refactor)

- Apply Low items as cleanup.
- Replace hardcoded `Son güncelleme: 25 Ocak 2026` with a `{updatedAt}` interpolation token (`comparison.dataUpdated`).
- Add the TR style guide (§5 below) to `docs/TR_TRANSLATION_GUIDELINES.md`.

### Phase 5 (separate track, not part of this audit) — Localization coverage

The ~40 calculator pages currently falling back to English need their internal labels/placeholders/results/disclaimers added to `tr:`. This is a multi-week effort and should be scoped as its own initiative; do **not** bundle with quality fixes.

---

## 5. Translation Guidelines (forward-looking)

### 5.1 Tone

- **Formal *siz*** throughout body copy and microcopy.
- **Bare imperative** for action buttons (`Hesapla`, `Sıfırla`, `Dışa Aktar`).
- No second-person informal (`-na`, `-nı`, `senin`) in marketing or product copy.

### 5.2 Terminology — preferred forms

(See §3.1 table.) Treat it as a glossary; every new TR string must reuse these forms.

### 5.3 Numbers, currency, dates, units

- Decimal: **comma** (`%99,9`, `1,5x`).
- Thousands: **dot** (`10.000 BTC`, `1.000.000 ₺`).
- Currency: **`₺`** for TRY, **`$`** only when literally USD (never on `/tr` financial outputs — those use `₺`).
- Dates: `gün ay yıl` (`25 Ocak 2026`).
- Units: space before unit (`30 sn`, `60 dk`, `100 BTC`).
- Percent: `%` immediately before the number (`%99,9`), TR convention.

### 5.4 Do / Don't (from real findings)

- **Don't** translate *Notify me* as `Beni Bildir`. **Do** `Bana Haber Ver`.
- **Don't** use *yatırmak* for "invest". **Do** `yatırım yapmak`.
- **Don't** use *yüzde* for "percentile". **Do** `yüzdelik dilim`.
- **Don't** use *Takipçi* for a software tracker. **Do** `Takip Aracı` / `İzleyici`.
- **Don't** translate marketing slogans word-for-word. **Do** rewrite from intent.
- **Don't** mix *Skor* / *Not*, *Toplu Yatırım* / *Toplu Tutar* across one product. **Do** lock one form in the glossary.
- **Don't** stack 4+ attributive nouns in JSON-LD/body prose. **Do** insert commas, relative clauses, or split sentences.

### 5.5 Open questions for product/editorial owner

1. **Formality default** — confirm formal *siz* site-wide (this audit recommends it).
2. **Brand voice for crypto slang** — keep *Satoshi Yığma* (slangy, brand-y) or normalize to *Biriktirme*?
3. **Loanwords** — *Staking*, *coin*, *gradyan*, *buton*: lock TR or EN form?
4. **CAGR / YBBO** — keep TR acronym, English acronym, or gloss both?
5. **Step-up basis** — does the TR audience need this concept at all? (US-specific tax mechanism.)
6. **Fear & Greed** — *Hırs* (popular TR-crypto press) vs *Açgözlülük* (literal)?
7. **Founder bio** — confirm intended dates/claims in `about.creator.desc` (current string is grammatically awkward and factually ambiguous).


Here are clear recommended answers for the open product/editorial decisions:

1. Formality default

Use formal “siz” across the entire site as default.
Keeps tone consistent with fintech/finance expectations in Turkish market.
Avoid mixing with informal “sen” except in explicitly branded slang sections.

2. Brand voice — “Satoshi Yığma”

Keep “Satoshi Yığma” as branded slang term, but:
Use it sparingly (hero, marketing, glossary, memes)
Do not use it as the general term in UI labels or serious financial explanations
Default term in UX should still be neutral Turkish (“biriktirme / birikim” depending on context)

3. Loanwords (Staking, coin, gradient, button)

Recommendation: Hybrid approach
Keep widely adopted crypto/tech terms as-is: staking, coin
Use Turkish for UI basics: buton → düğme (or keep “buton” if UI consistency demands it)
“gradyan” is acceptable Turkishized form (preferred over “gradient” in UI copy)
Rule: if term is industry-standard in English → keep EN, otherwise localize.

4. CAGR / YBBO

Use both on first mention:
“YBBO (CAGR)”
After first mention: use YBBO only in Turkish UI
Avoid leaving only CAGR for Turkish users

5. Step-up basis

Recommendation: Do NOT expose as core concept in Turkish UX
It is US tax-specific and low relevance
If needed in educational content:
Simplify explanation or hide behind “ileri seviye vergi terimi”
Otherwise omit from main product flow entirely

6. Fear & Greed Index

Use: “Korku ve Açgözlülük Endeksi”
Avoid “Hırs” (too behavioral and not standard financial usage)
Optional tooltip: “Fear & Greed Index (Piyasa Duyarlılığı Endeksi)”

7. Founder bio (about.creator.desc)

Needs rewrite + verification pass
Issues:
Current phrasing is grammatically inconsistent
Likely mixes timeline/claims without clarity
Recommendation:
Split into: who / what built / when / current role
Ensure no ambiguous dates or unverifiable claims
Use short, factual sentences in formal Turkish

---

## 6. Confirmation of audit guardrails

- ❌ No source files modified.
- ❌ No translation keys edited.
- ❌ No SEO, routing, sitemap, hreflang, prerender, or metadata changes.
- ✅ Single deliverable: this document (`docs/TR_COPY_AUDIT.md`).
- ✅ Findings are evidence-based (every Current quote is verbatim from the corpus).
- ✅ Suggestions are clearly marked `Öneri:` and require owner approval before any Phase-1 change.

End of audit.
