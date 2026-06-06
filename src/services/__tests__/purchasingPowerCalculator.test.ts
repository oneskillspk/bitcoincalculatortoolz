import { describe, it, expect } from 'vitest';
import { PurchasingPowerCalculator, PURCHASING_ITEMS } from '../purchasingPowerCalculator';

describe('PurchasingPowerCalculator.calculatePurchasingPower', () => {
  it('totalValue = btcAmount × price', () => {
    const r = PurchasingPowerCalculator.calculatePurchasingPower(0.5, 100_000, 'USD');
    expect(r.totalValue).toBe(50_000);
  });

  it('quantity per item = floor(totalValue / itemPrice)', () => {
    const r = PurchasingPowerCalculator.calculatePurchasingPower(1, 100_000, 'USD');
    for (const item of r.items) {
      expect(item.quantity).toBe(Math.floor(100_000 / item.priceUSD));
    }
  });

  it('zero holdings → empty items list', () => {
    const r = PurchasingPowerCalculator.calculatePurchasingPower(0, 100_000, 'USD');
    expect(r.items).toHaveLength(0);
    expect(r.totalValue).toBe(0);
  });

  it('topItems sorted by quantity desc, max 10', () => {
    const r = PurchasingPowerCalculator.calculatePurchasingPower(10, 100_000, 'USD');
    expect(r.topItems.length).toBeLessThanOrEqual(10);
    for (let i = 1; i < r.topItems.length; i++) {
      expect(r.topItems[i].quantity).toBeLessThanOrEqual(r.topItems[i - 1].quantity);
    }
  });

  it('formatQuantity uses M/K shorthand', () => {
    expect(PurchasingPowerCalculator.formatQuantity(2_500_000)).toBe('2.5M');
    expect(PurchasingPowerCalculator.formatQuantity(3_400)).toBe('3.4K');
    expect(PurchasingPowerCalculator.formatQuantity(50)).toBe('50');
  });

  it('catalog has at least one item per declared category', () => {
    const cats = new Set(PURCHASING_ITEMS.map((i) => i.category));
    expect(cats.size).toBeGreaterThan(2);
  });
});
