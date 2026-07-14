# Pre-ship Regression Checklist — Germany Bitcoin Tax Calculator

Run before shipping any change that touches:
`src/pages/BitcoinGermanyTaxCalculator.tsx`,
`src/components/tax/regionMeta.ts` (DE block),
`src/components/tax-calculator/RegionalCryptoTaxCalculator.tsx` (DE compute),
`src/components/tax/TaxComparisonTable.tsx`.

## 1. Automated checks (must be green)

```bash
bunx vitest run src/components/tax/de/__tests__
bunx vitest run src/components/tax/__tests__/tax-section-labels.test.tsx
bunx vitest run src/test/tax-pages-seo.test.tsx
```

Covers:

- >12-month hold → tax = 0 (Section 23 EStG)
- ≤12 months + €1,000 Freigrenze rule
- Marginal-rate multiplier applied to short-term gain
- "Section 23 EStG" spelled out, `§` never rendered
- Country-comparison table `min-w-[720px]` (mobile scroll)

## 2. Manual layout sweep (Playwright)

Screenshot 360 / 390 / 414 / 768 / 1280 widths:

- [ ] Breadcrumb clear of the fixed header (`pt-20 sm:pt-24`)
- [ ] Hero H1 fits without hyphenation
- [ ] Chips wrap cleanly (including `€1,000 Freigrenze`)
- [ ] Effective-rate chart legend does not clip
- [ ] Scenario cards align in a consistent 1/2/3-column grid
- [ ] Cookie banner does not cover primary CTAs on mobile

## 3. Numbers spot-check

Defaults (proceeds €50,000 / cost €20,000 / holding 18 mo / marginal 30%):

| Field         | Expected                              |
|---------------|---------------------------------------|
| Gain          | €30,000                               |
| Rule          | Held >12 months — tax-free (Section 23) |
| Estimated tax | €0                                    |

Same inputs at 9 months / 30% marginal:

| Field         | Expected            |
|---------------|---------------------|
| Taxable       | €29,000             |
| Estimated tax | €8,700              |

## 4. When the checklist reveals a bug

1. Add a failing case to `src/components/tax/de/__tests__/de-page.test.tsx` first, then fix.
2. If the bug was a layout overflow, add the guarding class (`min-w-*`, `flex-wrap`, `whitespace-nowrap`) and assert its presence in the test.
