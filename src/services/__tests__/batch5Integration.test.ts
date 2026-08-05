import { describe, it, expect } from 'vitest';
import { leverageLiquidationCalculator } from '../leverageLiquidationCalculator';
import { calculateProfitLoss } from '../profitLossCalculator';
import { calculateETFReturns, BITCOIN_ETFS } from '../etfData';

describe('Batch 5 Service Logic Integration', () => {
  describe('Leverage & Liquidation Logic', () => {
    it('calculates liquidation price correctly for long positions', () => {
      const params = {
        entryPrice: 50000,
        positionType: 'long' as const,
        leverage: 10,
        marginAmount: 1000,
        marginMode: 'isolated' as const,
        maintenanceMargin: 0.5 // 0.5%
      };
      
      const result = leverageLiquidationCalculator.calculatePosition(params, 50000);
      expect(result.liquidationPrice).toBeLessThan(50000);
      expect(result.distanceToLiquidation).toBeGreaterThan(0);
      expect(result.positionSizeUsd).toBe(10000);
    });

    it('identifies high risk correctly based on leverage', () => {
      const result = leverageLiquidationCalculator.calculatePosition({
        entryPrice: 50000,
        positionType: 'long',
        leverage: 50,
        marginAmount: 1000,
        maintenanceMargin: 0.5
      }, 50000);
      
      expect(result.riskScore).toBe('extreme');
    });
  });

  describe('Profit & Loss Logic', () => {
    it('calculates net profit after exchange fees', () => {
      const purchases = [{
        id: '1',
        amount: 10000,
        pricePerBtc: 50000,
        btcAmount: 0.1998, // after 0.1% fee
        buyFeePercent: 0.1
      }];
      
      const result = calculateProfitLoss(purchases, 60000, 0.1);
      expect(result).not.toBeNull();
      if (result) {
        expect(result.netProfitLoss).toBeLessThan(result.grossProfitLoss);
        expect(result.totalFeesPaid).toBeGreaterThan(0);
      }
    });
  });

  describe('ETF Fee Drag Logic', () => {
    it('calculates 10-year fee drag impact', () => {
      const investment = 10000;
      const ibit = BITCOIN_ETFS.find(e => e.ticker === 'IBIT')!;
      const annualReturn = 0.25; // 25% annual growth
      
      const result = calculateETFReturns(investment, ibit, 10, 50000, annualReturn);
      expect(result.valueAfterFees).toBeLessThan(result.valueWithoutFees);
      expect(result.totalFeesPaid).toBeGreaterThan(1000); // 0.25% compounded over 10 years at 25% growth is significant
    });
  });
});