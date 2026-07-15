import { describe, it, expect } from 'vitest';
import {
  score,
  rankRelated,
  CATALOG,
  type SmartRelatedContext,
} from '../LotSizeSmartRelated';

/**
 * Unit tests for the LotSizeSmartRelated ranking logic.
 * Verifies that `selectedBroker`, `leverage` and `hasLiquidationRisk`
 * shift recommendations exactly as intended so the surfaced calculators
 * remain relevant to the user's context.
 */

const bySlug = (slug: string) => CATALOG.find(c => c.slug === slug)!;

const baseCtx = (over: Partial<SmartRelatedContext> = {}): SmartRelatedContext => ({
  selectedBroker: 'standard',
  leverage: 1,
  hasLiquidationRisk: false,
  ...over,
});

describe('score()', () => {
  it('applies +4 for liquidation-liquidation combo when risk flag is set', () => {
    const liq = bySlug('/calculators/leverage-liquidation');
    const noRisk = score(liq, baseCtx({ hasLiquidationRisk: false }));
    const withRisk = score(liq, baseCtx({ hasLiquidationRisk: true }));
    expect(withRisk - noRisk).toBe(4);
  });

  it('adds +3 to leverage-liquidation when leverage >= 20', () => {
    const liq = bySlug('/calculators/leverage-liquidation');
    expect(score(liq, baseCtx({ leverage: 19 }))).toBe(1);
    expect(score(liq, baseCtx({ leverage: 20 }))).toBe(1 + 3);
    expect(score(liq, baseCtx({ leverage: 50 }))).toBe(1 + 3);
  });

  it('stacks liquidation and high-leverage bonuses for leverage-liquidation', () => {
    const liq = bySlug('/calculators/leverage-liquidation');
    expect(score(liq, baseCtx({ leverage: 25, hasLiquidationRisk: true }))).toBe(1 + 4 + 3);
  });

  it('gives profit-loss a baseline of +2 and +1 when leverage >= 5', () => {
    const pl = bySlug('/calculators/profit-loss');
    expect(score(pl, baseCtx({ leverage: 4 }))).toBe(1 + 2);
    expect(score(pl, baseCtx({ leverage: 5 }))).toBe(1 + 2 + 1);
    expect(score(pl, baseCtx({ leverage: 50 }))).toBe(1 + 2 + 1);
  });

  it('always adds +2 to risk-reward regardless of context', () => {
    const rr = bySlug('/calculators/risk-reward');
    expect(score(rr, baseCtx())).toBe(1 + 2);
    expect(score(rr, baseCtx({ leverage: 100, hasLiquidationRisk: true, selectedBroker: 'bybit' })))
      .toBe(1 + 2);
  });

  it('boosts arbitrage only for crypto-native brokers (bybit, binance, delta)', () => {
    const arb = bySlug('/calculators/bitcoin-arbitrage');
    expect(score(arb, baseCtx({ selectedBroker: 'exness' }))).toBe(1);
    expect(score(arb, baseCtx({ selectedBroker: 'standard' }))).toBe(1);
    expect(score(arb, baseCtx({ selectedBroker: 'bybit' }))).toBe(1 + 2);
    expect(score(arb, baseCtx({ selectedBroker: 'binance' }))).toBe(1 + 2);
    expect(score(arb, baseCtx({ selectedBroker: 'delta' }))).toBe(1 + 2);
  });

  it('penalises DCA at high leverage but rewards it when liquidation risk is present', () => {
    const dca = bySlug('/calculators/dca');
    expect(score(dca, baseCtx({ leverage: 1 }))).toBe(1 + 2);            // safe: promote
    expect(score(dca, baseCtx({ leverage: 25 }))).toBe(1 - 1);           // high lev: demote
    expect(score(dca, baseCtx({ leverage: 25, hasLiquidationRisk: true })))
      .toBe(1 - 1 + 2);                                                  // still-lifted safety pivot
  });

  it('boosts BTC converter only for MT5-family brokers', () => {
    const cv = bySlug('/calculators/bitcoin-converter');
    expect(score(cv, baseCtx({ selectedBroker: 'bybit' }))).toBe(1);
    expect(score(cv, baseCtx({ selectedBroker: 'exness' }))).toBe(1 + 1);
    expect(score(cv, baseCtx({ selectedBroker: 'icmarkets' }))).toBe(1 + 1);
    expect(score(cv, baseCtx({ selectedBroker: 'standard' }))).toBe(1 + 1);
  });
});

describe('rankRelated()', () => {
  it('returns exactly 4 recommendations by default', () => {
    expect(rankRelated(baseCtx())).toHaveLength(4);
  });

  it('respects the limit argument', () => {
    expect(rankRelated(baseCtx(), 2)).toHaveLength(2);
    expect(rankRelated(baseCtx(), 6)).toHaveLength(CATALOG.length);
  });

  it('returns results sorted by descending weight', () => {
    const ranked = rankRelated(baseCtx({ leverage: 30, hasLiquidationRisk: true }));
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].weight).toBeGreaterThanOrEqual(ranked[i].weight);
    }
  });

  it('surfaces Leverage & Liquidation first when liquidation risk is flagged', () => {
    const ranked = rankRelated(baseCtx({ leverage: 25, hasLiquidationRisk: true }));
    expect(ranked[0].slug).toBe('/calculators/leverage-liquidation');
  });

  it('surfaces Leverage & Liquidation first at high leverage even without a risk flag', () => {
    const ranked = rankRelated(baseCtx({ leverage: 50, hasLiquidationRisk: false }));
    expect(ranked[0].slug).toBe('/calculators/leverage-liquidation');
  });

  it('demotes DCA out of the top 4 at high leverage with no risk pivot', () => {
    const ranked = rankRelated(baseCtx({ leverage: 30, hasLiquidationRisk: false }));
    expect(ranked.map(r => r.slug)).not.toContain('/calculators/dca');
  });

  it('promotes DCA into the top 4 when leverage is low and safety matters', () => {
    const ranked = rankRelated(baseCtx({ leverage: 1, hasLiquidationRisk: false }));
    expect(ranked.map(r => r.slug)).toContain('/calculators/dca');
  });

  it('surfaces Arbitrage in the top 4 for crypto-native brokers', () => {
    const rankedCrypto = rankRelated(baseCtx({ selectedBroker: 'bybit', leverage: 3 }));
    const rankedMt5 = rankRelated(baseCtx({ selectedBroker: 'exness', leverage: 3 }));
    expect(rankedCrypto.map(r => r.slug)).toContain('/calculators/bitcoin-arbitrage');
    expect(rankedMt5.map(r => r.slug)).not.toContain('/calculators/bitcoin-arbitrage');
  });

  it('surfaces BTC ↔ USD Converter in the top 4 for MT5 brokers', () => {
    const rankedMt5 = rankRelated(baseCtx({ selectedBroker: 'exness', leverage: 1 }));
    expect(rankedMt5.map(r => r.slug)).toContain('/calculators/bitcoin-converter');
  });

  it('never returns duplicate slugs', () => {
    const ranked = rankRelated(baseCtx({ leverage: 50, hasLiquidationRisk: true }), CATALOG.length);
    const slugs = ranked.map(r => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
