# Placeholder / Code-Prefix Audit

## What I scanned
Searched the entire `src/` and `public/` tree for patterns: `COL-NN`, `APP-NN`, `MOD-NN`, `SEC-NN`, `CALC-NN`, `NAV-`, `FTR-`, `HDR-`, `BLK-`, `ROW-`.

## Findings

### 1. User-visible cryptic IDs (NOT professional — recommend removal)
These render on the public page and look like internal placeholders to a normal visitor:

| File | Line | What shows |
|---|---|---|
| `src/components/FAQSection.tsx` | 70 | `SEC-06 · {faq.badge}` |
| `src/components/modern/LiveCalculationDemo.tsx` | 53 | `SEC-01 · LIVE FEED` / `CANLI VERİ` |
| `src/components/modern/CalculationFlowAnimation.tsx` | 89 | `SEC-04 · FLOW` / `AKIŞ` |
| `src/components/modern/UltraModernAssetComparison.tsx` | 177 | `SEC-05 · COMPARISON` / `KARŞILAŞTIRMA` |
| `src/components/cinematic/EditorialStatement.tsx` | 38 | `moduleId="SEC-02"` shown in terminal strip |
| `src/components/modern/LiveCalculationDemo.tsx` | 61 | `moduleId="CALC-LIVE"` in terminal strip |
| `src/components/CalculatorGrid.tsx` | 182, 195 | `CALC-01 … CALC-NN` rendered on each card header |
| `src/components/PremiumCalculatorCards.tsx` | 22–67 | Hard-coded `CALC-01…06` strings |

These are part of the "instrument-panel / terminal" aesthetic (small monospaced rail at the top of each section/card). The aesthetic itself is fine, but the **`SEC-##` / `CALC-##` tokens read as developer placeholders** to non-technical users. Either:
- **(A) Remove the IDs**, keep just the meaningful label (`LIVE FEED`, `COMPARISON`, the calculator category, etc.) — cleanest.
- **(B) Replace IDs with human words** (e.g. `LIVE`, `FLOW`, `COMPARE`) — keeps the aesthetic, loses the fake "spec sheet" feel.

Recommended: **Option A** — pure removal. The colored dot + label already give the chrome.

### 2. Footer (already clean)
`src/components/Footer.tsx` line 135/146/157 still passes a `'COL-01'` string into `colHeading()`, but the helper now ignores it (`_moduleId`) and prints only the label. Safe but the dead string args should be deleted for tidiness.

### 3. Code comments (keep — internal only)
`src/pages/admin/AdminLogin.tsx` lines 1, 19, 94 contain `// AUDIT-FIX [SEC-002] …` audit-trail comments. Not user-visible, professional in code, **keep as-is**.

### 4. Type/doc comment
`src/components/cinematic/SectionTerminalStrip.tsx` line 5 JSDoc mentions `"SEC-01"` as an example. Update the example after we strip IDs (e.g. `"LIVE"` / `"WEEKLY"`).

## Is this a professional approach?
**No, not for end users.** Strings like `SEC-06`, `CALC-03`, `COL-02` look like un-replaced template tokens. Professional sites use meaningful section labels ("Live Feed", "FAQ", "Compare") rather than spec-sheet codes. The chrome (dot + monospaced label + status pill) can stay — only the `XYZ-NN` tokens go.

## Action plan (read-only — awaiting approval)

1. **CalculatorGrid.tsx** — drop the `moduleId` span (lines 182, 188-197); keep only the dot + category label on the right.
2. **PremiumCalculatorCards.tsx** — remove the `moduleId: "CALC-0X"` field from each of the 6 entries and any JSX that renders it.
3. **FAQSection.tsx** — change `SEC-06 · {t('faq.badge')}` → `{t('faq.badge')}`.
4. **LiveCalculationDemo.tsx** — eyebrow becomes `'CANLI VERİ' : 'LIVE FEED'`; `moduleId="CALC-LIVE"` → `moduleId="LIVE"`.
5. **CalculationFlowAnimation.tsx** — eyebrow becomes `'AKIŞ' : 'FLOW'`.
6. **UltraModernAssetComparison.tsx** — eyebrow becomes `'KARŞILAŞTIRMA' : 'COMPARISON'`.
7. **EditorialStatement.tsx** — change `moduleId="SEC-02"` → `moduleId="STATEMENT"` (or remove the strip entirely if you prefer).
8. **SectionTerminalStrip.tsx** — update JSDoc example from `"SEC-01"` to `"LIVE"`.
9. **Footer.tsx** — remove the dead `'COL-01' / 'COL-02' / 'COL-03'` first arguments (no UI change, just cleanup).
10. **Keep** all `// AUDIT-FIX [SEC-###]` source comments (internal only).

No backend, no routing, no copy keys touched — purely presentation cleanup. After approval I'll apply all edits in one pass and verify the preview.
