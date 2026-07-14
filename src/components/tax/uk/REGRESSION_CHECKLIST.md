# Pre-ship Regression Checklist — UK Bitcoin CGT Calculator

Run before shipping any change that touches:
`src/pages/BitcoinUKCGTCalculator.tsx`,
`src/components/tax/regionMeta.ts` (UK block),
`src/components/tax-calculator/RegionalCryptoTaxCalculator.tsx` (UK compute),
`src/components/tax/TaxComparisonTable.tsx`.

## 1. Automated checks (must be green)

```bash
bunx vitest run src/components/tax/uk/__tests__
bunx vitest run src/components/tax/__tests__/tax-section-labels.test.tsx
bunx vitest run src/test/tax-pages-seo.test.tsx
```

Covers:

- £3,000 Annual Exempt Amount + 18% / 24% band split
- Section 104 pooling wording present, `§` never rendered
- Country-comparison table `min-w-[720px]` (mobile scroll)
- Hero heading + 2026/27 chip present

## 2. Manual layout sweep (Playwright)

Screenshot 360 / 390 / 414 / 768 / 1280 widths:

- [ ] Breadcrumb clear of the fixed header (`pt-20 sm:pt-24`)
- [ ] Hero H1 fits without hyphenation
- [ ] Chips wrap cleanly
- [ ] Effective-rate chart legend does not clip
- [ ] Scenario cards align in a consistent 1/2/3-column grid
- [ ] Cookie banner does not cover primary CTAs on mobile

## 3. Numbers spot-check

Defaults (proceeds £50,000 / cost £20,000 / other income £30,000):

| Field         | Expected            |
|---------------|---------------------|
| Gain          | £30,000             |
| Allowance     | £3,000              |
| Taxable       | £27,000             |
| Basic slice   | £20,270 @ 18%       |
| Higher slice  | £6,730 @ 24%        |
| Estimated tax | £5,263.80           |

## 4. When the checklist reveals a bug

1. Add a failing case to `src/components/tax/uk/__tests__/uk-page.test.tsx` first, then fix.
2. If the bug was a layout overflow, add the guarding class (`min-w-*`, `flex-wrap`, `whitespace-nowrap`) and assert its presence in the test.
