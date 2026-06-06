import { describe, it, expect } from 'vitest';
import { TaxCalculatorService, type Transaction } from '../taxCalculator';

// Reference: US-style FIFO cost basis matching, long-term threshold = 365 days.

const mkTx = (overrides: Partial<Transaction>): Transaction => ({
  id: Math.random().toString(),
  date: '2024-01-01',
  type: 'buy',
  amount: 0,
  price: 0,
  fiatAmount: 0,
  currency: 'USD',
  ...overrides,
});

describe('TaxCalculatorService.calculateTaxes', () => {
  it('FIFO: single buy at $20k, sell at $40k within a year → short-term gain $20k', () => {
    const txs: Transaction[] = [
      mkTx({ id: 'b1', date: '2024-01-01', type: 'buy', amount: 1, price: 20_000, fiatAmount: 20_000 }),
      mkTx({ id: 's1', date: '2024-06-01', type: 'sell', amount: 1, price: 40_000, fiatAmount: 40_000 }),
    ];
    const r = TaxCalculatorService.calculateTaxes(txs, 'US', 2024, 'FIFO');
    expect(r.taxableEvents).toHaveLength(1);
    expect(r.taxableEvents[0].gainLoss).toBeCloseTo(20_000, 6);
    expect(r.taxableEvents[0].isLongTerm).toBe(false);
    expect(r.shortTermGains).toBeCloseTo(20_000, 6);
    expect(r.longTermGains).toBe(0);
  });

  it('long-term: held > 365 days flips to longTermGains bucket', () => {
    const txs: Transaction[] = [
      mkTx({ id: 'b1', date: '2022-01-01', type: 'buy', amount: 1, price: 20_000, fiatAmount: 20_000 }),
      mkTx({ id: 's1', date: '2024-06-01', type: 'sell', amount: 1, price: 40_000, fiatAmount: 40_000 }),
    ];
    const r = TaxCalculatorService.calculateTaxes(txs, 'US', 2024, 'FIFO');
    expect(r.taxableEvents[0].isLongTerm).toBe(true);
    expect(r.longTermGains).toBeCloseTo(20_000, 6);
    expect(r.shortTermGains).toBe(0);
  });

  it('partial sale: 0.5 BTC of 1 BTC lot → cost basis is half', () => {
    const txs: Transaction[] = [
      mkTx({ id: 'b1', date: '2024-01-01', type: 'buy', amount: 1, price: 20_000, fiatAmount: 20_000 }),
      mkTx({ id: 's1', date: '2024-06-01', type: 'sell', amount: 0.5, price: 40_000, fiatAmount: 20_000 }),
    ];
    const r = TaxCalculatorService.calculateTaxes(txs, 'US', 2024, 'FIFO');
    expect(r.taxableEvents[0].costBasis).toBeCloseTo(10_000, 6);
    expect(r.taxableEvents[0].gainLoss).toBeCloseTo(10_000, 6);
  });

  it('sell at a loss → capital_loss event and negative gainLoss', () => {
    const txs: Transaction[] = [
      mkTx({ id: 'b1', date: '2024-01-01', type: 'buy', amount: 1, price: 50_000, fiatAmount: 50_000 }),
      mkTx({ id: 's1', date: '2024-06-01', type: 'sell', amount: 1, price: 30_000, fiatAmount: 30_000 }),
    ];
    const r = TaxCalculatorService.calculateTaxes(txs, 'US', 2024, 'FIFO');
    expect(r.taxableEvents[0].type).toBe('capital_loss');
    expect(r.taxableEvents[0].gainLoss).toBeCloseTo(-20_000, 6);
    expect(r.totalLosses).toBeCloseTo(20_000, 6);
    expect(r.taxableEvents[0].taxOwed).toBe(0);
  });

  it('mining income is taxed at ordinary income rate', () => {
    const txs: Transaction[] = [
      mkTx({ id: 'm1', date: '2024-03-01', type: 'mining', amount: 0.1, price: 60_000, fiatAmount: 6_000 }),
    ];
    const r = TaxCalculatorService.calculateTaxes(txs, 'US', 2024, 'FIFO');
    expect(r.taxableEvents).toHaveLength(1);
    expect(r.taxableEvents[0].type).toBe('mining_income');
    expect(r.taxableEvents[0].proceeds).toBe(6_000);
  });

  it('sales outside taxYear are ignored', () => {
    const txs: Transaction[] = [
      mkTx({ id: 'b1', date: '2023-01-01', type: 'buy', amount: 1, price: 20_000, fiatAmount: 20_000 }),
      mkTx({ id: 's1', date: '2023-06-01', type: 'sell', amount: 1, price: 30_000, fiatAmount: 30_000 }),
    ];
    const r = TaxCalculatorService.calculateTaxes(txs, 'US', 2024, 'FIFO');
    expect(r.taxableEvents).toHaveLength(0);
  });
});
