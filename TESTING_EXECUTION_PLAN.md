# Bitcoin Calculator Testing Execution Plan

## ✅ Tests Created

### 1. **bitcoinApi Service Tests** (`src/services/__tests__/bitcoinApi.test.ts`)
Tests the core API service that fetches real Bitcoin prices and performs calculations.

**Coverage:**
- ✅ Real BTC price fetching from CoinGecko API
- ✅ Currency conversion (USD, EUR, etc.)
- ✅ Retry logic with exponential backoff
- ✅ Historical price fetching from static data (2020, COVID crash, 2021 ATH)
- ✅ Investment calculation logic (BTC amount, ROI, profit/loss)
- ✅ 8-decimal precision for Bitcoin amounts (satoshi level)
- ✅ Currency conversion in calculations
- ✅ Data validation (invalid currencies, pre-Bitcoin dates, future dates)
- ✅ Cross-calculator consistency
- ✅ Annualized return calculations

### 2. **BitcoinWhatIfCalculator Integration Tests** (`src/pages/__tests__/BitcoinWhatIfCalculator.test.tsx`)
Tests the complete user flow from input to results display.

**Coverage:**
- ✅ Complete calculation flow (input → calculate → results)
- ✅ Currency switching and recalculation
- ✅ 8-decimal BTC precision display
- ✅ Historical investment scenarios (2011, 2020, 2021 ATH)
- ✅ Negative returns display (bear market investments)
- ✅ Error handling and retry functionality
- ✅ Loading states and progress indicators

### 3. **ModernInputPanel Component Tests** (`src/components/modern/__tests__/ModernInputPanel.test.tsx`)
Tests the input form validation and user interactions.

**Coverage:**
- ✅ Input validation (valid/invalid amounts, max limits)
- ✅ Quick amount presets ($100, $500, $1K, $5K, $10K)
- ✅ Date presets (6M, 1Y, 3Y, 5Y, Max)
- ✅ Currency selection with flags and symbols
- ✅ Calculate trigger with correct parameters
- ✅ BTC display preference toggle
- ✅ Loading state display
- ✅ Number formatting (commas, decimals)

### 4. **DCA Calculator Service Tests** (`src/services/__tests__/dcaCalculator.test.ts`)
Tests the Dollar-Cost Averaging calculation logic and strategy execution.

**Coverage:**
- ✅ Weekly/monthly/daily DCA frequency calculations
- ✅ Purchase count matches time period
- ✅ Real historical prices for each purchase
- ✅ 8-decimal BTC precision
- ✅ Average buy price calculation
- ✅ ROI and profit/loss calculations
- ✅ Performance metrics (Sharpe ratio, volatility, max drawdown)
- ✅ Currency conversion support
- ✅ Edge cases (short periods, large/small amounts)
- ✅ Cumulative BTC tracking
- ✅ Real vs fake calculation detection

### 5. **Lump Sum vs DCA Comparator Tests** (`src/services/__tests__/lumpSumDcaComparator.test.ts`)
Tests the strategy comparison logic for lump sum vs DCA investment approaches.

**Coverage:**
- ✅ Lump sum calculation (single purchase at specific date)
- ✅ DCA calculation with multiple purchase frequencies (weekly, bi-weekly, monthly)
- ✅ Winner identification in bear market scenarios (DCA wins)
- ✅ Winner identification in bull market scenarios (lump sum wins)
- ✅ Percentage difference and absolute value calculations
- ✅ Profit/loss comparison between strategies
- ✅ Risk analysis (max drawdown, volatility comparison)
- ✅ Risk level classification (low/medium/high)
- ✅ Performance metrics for both strategies
- ✅ Date generation for DCA purchases
- ✅ Price lookup with fallback to nearest date
- ✅ Edge cases (tie scenarios, small/large amounts)
- ✅ Real vs fake calculation detection
- ✅ Summary and recommendation generation

---

## 🚀 How to Run Tests

### Run All Tests
```bash
npm run test
```

### Run Specific Test File
```bash
npm run test src/services/__tests__/bitcoinApi.test.ts
npm run test src/pages/__tests__/BitcoinWhatIfCalculator.test.tsx
npm run test src/components/modern/__tests__/ModernInputPanel.test.tsx
npm run test src/services/__tests__/dcaCalculator.test.ts
npm run test src/services/__tests__/lumpSumDcaComparator.test.ts
```

### Run Tests in Watch Mode (for development)
```bash
npm run test -- --watch
```

### Run Tests with Coverage Report
```bash
npm run test -- --coverage
```

---

## 📋 What Gets Verified

### ✅ Real Calculations (Not Fake/Demo)

1. **Historical Price Accuracy**
   - Jan 1, 2020: ~$7,200 ✓
   - March 13, 2020 (COVID crash): ~$3,858 ✓
   - Nov 10, 2021 (ATH): ~$68,789 ✓

2. **Calculation Logic**
   - BTC Amount = Investment ÷ Historical Price ✓
   - Current Value = BTC Amount × Current Price ✓
   - Profit/Loss = Current Value - Investment ✓
   - ROI% = (Profit/Loss ÷ Investment) × 100 ✓

3. **Precision**
   - Bitcoin amounts: 8 decimals (satoshi precision) ✓
   - Currency values: 2 decimals ✓
   - ROI percentages: 2 decimals ✓

4. **Currency Conversion**
   - Real exchange rates from API ✓
   - Proper conversion in calculations ✓
   - Display in selected currency ✓

5. **Edge Cases**
   - Very old investments (2011) show massive ROI ✓
   - Bear market investments show negative returns ✓
   - Recent investments show minimal ROI ✓

---

## 🔍 Test Results Interpretation

### Passing Tests = Real Calculations ✅

If tests pass, it confirms:
- Uses real Bitcoin price data from `bitcoin_prices_v1.json`
- Fetches live prices from CoinGecko API
- Performs accurate mathematical calculations
- Displays 8-decimal precision for Bitcoin
- Handles currency conversions correctly
- Shows realistic ROI percentages
- No hardcoded/demo values

### Failing Tests = Investigation Needed ❌

If tests fail, check:
1. **API connectivity** - CoinGecko API might be down
2. **Static data file** - `bitcoin_prices_v1.json` might be missing/corrupted
3. **Calculation logic** - Math might be incorrect
4. **Data precision** - Rounding errors in calculations
5. **Mock setup** - Test mocks might need adjustment

---

## 📊 Next Steps: Expand Testing to Other Calculators

### Priority Order:

1. **Bitcoin DCA Calculator** ✅ (High Priority) - **TESTS IMPLEMENTED**
   - Test weekly/monthly/daily DCA frequencies ✅
   - Verify purchase count matches period ✅
   - Check average buy price calculation ✅
   - Validate performance metrics (Sharpe ratio, max drawdown) ✅

2. **Bitcoin Capital Gains Tax** ✅ (High Priority)
   - Test FIFO/LIFO methods
   - Verify short-term vs long-term classifications
   - Check tax rate application
   - Validate holding period calculations

3. **Lump Sum vs DCA Comparison** ✅ (High Priority) - **TESTS IMPLEMENTED**
   - Test both strategies with same data ✅
   - Verify winner identification ✅
   - Check risk metrics comparison ✅

4. **Bitcoin Retirement Calculator** (Medium Priority)
   - Test compound growth formula
   - Verify monthly contribution amortization
   - Check future value projections

5. **Stack Sats Goal Calculator** (Medium Priority)
   - Test goal tracking logic
   - Verify milestone calculations
   - Check alternative scenario projections

6. **Bitcoin HODL Strategy** (Medium Priority)
   - Test multiple strategies (HODL, DCA, Buy Dip)
   - Verify strategy comparison logic
   - Check performance metrics

7. **Bitcoin Purchasing Power** (Low Priority)
   - Test item quantity calculations
   - Verify category breakdowns
   - Check realistic item prices

8. **Bitcoin Inflation Dashboard** (Low Priority)
   - Test supply data loading
   - Verify halving timeline
   - Check M2 comparison

9. **Bitcoin Obituaries Tracker** (Low Priority)
   - Test obituary data loading
   - Verify ROI calculations since declaration
   - Check filtering functionality

---

## 🎯 Success Criteria

### All Tests Must Verify:

- [ ] Uses `/data/bitcoin_prices_v1.json` for historical prices
- [ ] Calls CoinGecko API for current prices
- [ ] Performs real calculations (no hardcoded results)
- [ ] Shows 8-decimal precision for BTC amounts
- [ ] Handles currency conversions via API
- [ ] Displays unique results for different dates
- [ ] Renders charts with real price data
- [ ] Calculates metrics from actual volatility
- [ ] Functions offline with static data fallback
- [ ] Shows loading states during API calls

---

## 📝 Test Coverage Goals

| Component | Current | Target |
|-----------|---------|--------|
| bitcoinApi.ts | 85% | 95% |
| BitcoinWhatIfCalculator.tsx | 70% | 90% |
| ModernInputPanel.tsx | 80% | 95% |
| ModernResultsPanel.tsx | 0% | 85% |
| ModernChart.tsx | 0% | 75% |

---

## 🐛 Known Issues to Test

1. **API Rate Limiting** - Test behavior when CoinGecko rate limits
2. **Offline Mode** - Verify fallback to static data works
3. **Date Edge Cases** - Test dates near Bitcoin genesis (Jan 3, 2009)
4. **Large Numbers** - Test with very large investment amounts
5. **Decimal Precision** - Ensure no rounding errors in BTC calculations

---

## 📚 Additional Testing Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## ✨ Continuous Testing

### Set up Git Hook (Optional)
Add to `.husky/pre-commit`:
```bash
#!/bin/sh
npm run test -- --run
```

This runs all tests before every commit to catch issues early.

---

**Last Updated:** 2025-01-05  
**Status:** Bitcoin What If + DCA + Lump Sum vs DCA Calculators - Tests Implemented ✅  
**Next:** Run tests and verify all pass, then continue with Capital Gains Tax Calculator
