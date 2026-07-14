# Pre-ship Regression Checklist — India Bitcoin Tax Calculator

Run before shipping any change that touches:
`src/pages/BitcoinIndiaTaxCalculator.tsx`,
`src/components/tax/india/**`,
`src/components/tax-calculator/RegionalCryptoTaxCalculator.tsx`,
`src/components/tax/TaxComparisonTable.tsx`.

## 1. Automated checks (must be green)

```bash
# math + structural regressions
bunx vitest run src/components/tax/india/__tests__
# full tax-page SEO regression bundle
bunx vitest run src/test/tax-pages-seo.test.tsx
```

Covers:

- §115BBH liability = gain × 31.2% (base + cess), TDS shown separately
- §194S TDS = 1% × proceeds, still charged on loss-making sales
- Refund vs additional-payable split matches ITR-2 filing behavior
- Composition chart renders all 4 scenarios with distinct TDS shares
- Legend has `flex-wrap` (never truncates at narrow widths)
- VDA loss row has visible `(loss)` text (not color-only)
- Country-comparison table has `min-w-[720px]` (mobile scroll)

## 2. Manual layout sweep (Playwright)

```bash
python3 /tmp/browser/india/audit3.py   # or the current audit script
```

Screenshot review checklist:

- [ ] Desktop 1280 × 900: no clipped text in the country-comparison table
- [ ] Mobile 390 × 844: comparison table scrolls; header cells intact
- [ ] TDS reclaim: 5-card grid heights match; no label overflow
- [ ] Composition chart: bars vary in width; TDS % differs per scenario
- [ ] VDA table: loss row shows red number **and** the `(loss)` suffix
- [ ] Hero H1 fits without hyphenation
- [ ] Cookie banner does not cover primary CTAs on mobile

## 3. Navigation smoke

- [ ] Breadcrumb: `Home › Calculators › Bitcoin Tax — India` visible + links resolve
- [ ] Header nav clickable at every viewport
- [ ] Related-calculators cards navigate to real routes (no 404 in console)
- [ ] Console shows no `React Router` errors beyond the two documented future-flag warnings
- [ ] `#in-tldr`, `#tds-reclaim`, `#schedule-vda` in-page anchors scroll correctly

## 4. Numbers spot-check

Default inputs (proceeds ₹50,000 / cost ₹20,000):

| Field         | Expected                    |
|---------------|-----------------------------|
| Taxable base  | ₹30,000                     |
| Estimated tax | ₹9,360  (31.2% × 30,000)    |
| Effective     | 31.2%                       |
| TDS withheld  | ₹500    (1% × 50,000)       |

If `Estimated tax` ever reads **₹9,860** again, TDS has been re-added to
the liability — revert immediately.

## 5. When the checklist reveals a bug

1. Add a failing case to `src/components/tax/india/__tests__/india-page.test.tsx`
   or `india115bbh.test.ts` **first**, then fix.
2. If the bug was a layout overflow, add the guarding class (`min-w-*`,
   `flex-wrap`, `whitespace-nowrap`) and assert its presence in the test.
