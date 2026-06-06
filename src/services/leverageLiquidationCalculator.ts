/**
 * Bitcoin Leverage & Liquidation Calculator Service
 * Industry-standard formulas for margin trading calculations
 * Uses real-time BTC price data - NO demo/fake values
 */

export interface PositionParams {
  entryPrice: number;
  positionType: 'long' | 'short';
  leverage: number;
  marginAmount: number;
  marginMode?: 'isolated' | 'cross';
  accountCollateral?: number;
  maintenanceMargin: number; // As percentage (e.g., 0.5 for 0.5%)
  takeProfitPercent?: number;
  stopLossPercent?: number;
}

export interface LiquidationResult {
  liquidationPrice: number;
  distanceToLiquidation: number;
  distanceToLiquidationUsd: number;
  positionSizeUsd: number;
  positionSizeBtc: number;
  marginMode: 'isolated' | 'cross';
  accountCollateral: number;
  totalCollateralAtRisk: number;
  maxProfitAtTarget: number;
  maxLossAtStopLoss: number;
  effectiveLeverage: number;
  marginCallPrice: number;
  riskScore: 'low' | 'medium' | 'high' | 'extreme';
  breakEvenPrice: number;
  fundingRateImpact: number;
  takeProfitPrice: number | null;
  stopLossPrice: number | null;
}

export interface LeverageComparison {
  leverage: number;
  liquidationPrice: number;
  distancePercent: number;
  maxProfit10: number;
  maxLoss10: number;
  riskScore: 'low' | 'medium' | 'high' | 'extreme';
}

export interface ExchangePreset {
  id: string;
  name: string;
  maintenanceMargin: number;
  maxLeverage: number;
  takerFee: number;
  makerFee: number;
}

// Exchange presets with real maintenance margin rates
export const exchangePresets: ExchangePreset[] = [
  { id: 'binance', name: 'Binance', maintenanceMargin: 0.5, maxLeverage: 125, takerFee: 0.04, makerFee: 0.02 },
  { id: 'bybit', name: 'Bybit', maintenanceMargin: 0.5, maxLeverage: 100, takerFee: 0.055, makerFee: 0.02 },
  { id: 'okx', name: 'OKX', maintenanceMargin: 0.5, maxLeverage: 100, takerFee: 0.05, makerFee: 0.02 },
  { id: 'kraken', name: 'Kraken', maintenanceMargin: 0.8, maxLeverage: 50, takerFee: 0.02, makerFee: 0.01 },
  { id: 'coinbase', name: 'Coinbase', maintenanceMargin: 1.0, maxLeverage: 10, takerFee: 0.06, makerFee: 0.04 },
  { id: 'deribit', name: 'Deribit', maintenanceMargin: 0.5, maxLeverage: 100, takerFee: 0.05, makerFee: 0.02 },
];

// Leverage presets for quick selection
export const leveragePresets = [
  { label: 'Conservative', value: 2, description: 'Low risk for beginners' },
  { label: 'Moderate', value: 5, description: 'Balanced risk/reward' },
  { label: 'Aggressive', value: 10, description: 'Higher risk trading' },
  { label: 'High Risk', value: 20, description: 'Experienced traders' },
  { label: 'Extreme', value: 50, description: 'Max risk (use caution)' },
];

// Average funding rate per 8 hours (0.01% is typical)
const AVG_FUNDING_RATE = 0.0001;

// Trading fee estimate (taker)
const TRADING_FEE_RATE = 0.001; // 0.1%

class LeverageLiquidationCalculator {
  /**
   * Calculate liquidation price for a leveraged position
   * 
   * Long Position: liquidationPrice = entryPrice * (1 - (1/leverage) + maintenanceMarginRate)
   * Short Position: liquidationPrice = entryPrice * (1 + (1/leverage) - maintenanceMarginRate)
   */
  calculateLiquidationPrice(
    entryPrice: number,
    leverage: number,
    positionType: 'long' | 'short',
    maintenanceMarginPercent: number = 0.5
  ): number {
    const maintenanceMarginRate = maintenanceMarginPercent / 100;
    const initialMarginRate = 1 / leverage;

    if (positionType === 'long') {
      // Long: liquidated when price drops
      return Math.max(0, entryPrice * (1 - initialMarginRate + maintenanceMarginRate));
    } else {
      // Short: liquidated when price rises
      return entryPrice * (1 + initialMarginRate - maintenanceMarginRate);
    }
  }

  /**
   * Calculate margin call price (warning before liquidation).
   *
   * Derived from margin mechanics rather than a fixed % heuristic:
   * a margin call is triggered when account equity drops to
   * `bufferMultiplier × maintenance margin requirement` (default 1.5×).
   *
   * Loss at margin call = initialMargin − bufferMultiplier × maintMargin × positionSize
   *                     = positionSize × (1/leverage − bufferMultiplier × mmRate)
   * priceChange = lossAtMarginCall / positionSize, applied in the
   * direction that hurts the position.
   */
  calculateMarginCallPrice(
    entryPrice: number,
    liquidationPrice: number,
    positionType: 'long' | 'short',
    leverage?: number,
    maintenanceMarginPercent: number = 0.5,
    bufferMultiplier: number = 1.5
  ): number {
    // Derive leverage from entry/liquidation when not supplied (back-compat)
    if (!leverage || leverage <= 0) {
      const mm = maintenanceMarginPercent / 100;
      const drop = Math.abs(entryPrice - liquidationPrice) / entryPrice;
      // liquidationPrice = entry*(1 - 1/L + mm)  =>  1/L = drop + mm
      const inv = drop + mm;
      leverage = inv > 0 ? 1 / inv : 1;
    }
    const mmRate = maintenanceMarginPercent / 100;
    const initialMarginRate = 1 / leverage;
    // Fraction of position size lost when equity hits the buffer threshold
    const adverseMove = Math.max(
      0,
      initialMarginRate - bufferMultiplier * mmRate
    );

    if (positionType === 'long') {
      return Math.max(0, entryPrice * (1 - adverseMove));
    }
    return entryPrice * (1 + adverseMove);
  }

  /**
   * Calculate position size based on margin and leverage
   */
  calculatePositionSize(marginAmount: number, leverage: number): number {
    return marginAmount * leverage;
  }

  /**
   * Calculate profit or loss at a given exit price
   */
  calculatePnL(
    entryPrice: number,
    exitPrice: number,
    positionSizeUsd: number,
    positionType: 'long' | 'short'
  ): number {
    const priceChange = (exitPrice - entryPrice) / entryPrice;
    
    if (positionType === 'long') {
      return positionSizeUsd * priceChange;
    } else {
      return positionSizeUsd * -priceChange;
    }
  }

  /**
   * Calculate distance to liquidation as percentage
   */
  calculateDistanceToLiquidation(
    currentPrice: number,
    liquidationPrice: number,
    positionType: 'long' | 'short'
  ): number {
    if (positionType === 'long') {
      return ((currentPrice - liquidationPrice) / currentPrice) * 100;
    } else {
      return ((liquidationPrice - currentPrice) / currentPrice) * 100;
    }
  }

  /**
   * Determine risk score based on distance to liquidation
   */
  getRiskScore(distancePercent: number): 'low' | 'medium' | 'high' | 'extreme' {
    if (distancePercent > 50) return 'low';
    if (distancePercent > 20) return 'medium';
    if (distancePercent > 10) return 'high';
    return 'extreme';
  }

  /**
   * Calculate break-even price including trading fees
   */
  calculateBreakEvenPrice(
    entryPrice: number,
    positionType: 'long' | 'short',
    feeRate: number = TRADING_FEE_RATE
  ): number {
    // Account for entry and exit fees
    const totalFeeRate = feeRate * 2;
    
    if (positionType === 'long') {
      return entryPrice * (1 + totalFeeRate);
    } else {
      return entryPrice * (1 - totalFeeRate);
    }
  }

  /**
   * Estimate funding rate impact over a period
   */
  estimateFundingImpact(
    positionSizeUsd: number,
    holdingPeriodHours: number = 24,
    fundingRate: number = AVG_FUNDING_RATE
  ): number {
    const fundingPeriods = holdingPeriodHours / 8;
    return positionSizeUsd * fundingRate * fundingPeriods;
  }

  /**
   * Complete position calculation with all metrics
   */
  calculatePosition(params: PositionParams, currentPrice?: number): LiquidationResult {
    const {
      entryPrice,
      positionType,
      leverage,
      marginAmount,
      marginMode = 'isolated',
      accountCollateral = 0,
      maintenanceMargin,
      takeProfitPercent,
      stopLossPercent
    } = params;

    const effectiveCurrentPrice = currentPrice || entryPrice;
    const totalCollateralAtRisk = marginMode === 'cross'
      ? marginAmount + Math.max(0, accountCollateral)
      : marginAmount;
    const effectiveLeverage = this.calculatePositionSize(marginAmount, leverage) / totalCollateralAtRisk;

    // Core calculations
    const liquidationPrice = this.calculateLiquidationPrice(
      entryPrice,
      effectiveLeverage,
      positionType,
      maintenanceMargin
    );

    const positionSizeUsd = this.calculatePositionSize(marginAmount, leverage);
    const positionSizeBtc = positionSizeUsd / entryPrice;

    const distanceToLiquidation = this.calculateDistanceToLiquidation(
      effectiveCurrentPrice,
      liquidationPrice,
      positionType
    );

    const distanceToLiquidationUsd = Math.abs(effectiveCurrentPrice - liquidationPrice);

    const marginCallPrice = this.calculateMarginCallPrice(
      entryPrice,
      liquidationPrice,
      positionType,
      effectiveLeverage,
      maintenanceMargin
    );

    const riskScore = this.getRiskScore(distanceToLiquidation);

    const breakEvenPrice = this.calculateBreakEvenPrice(entryPrice, positionType);

    const fundingRateImpact = this.estimateFundingImpact(positionSizeUsd);

    // Take profit calculations
    let takeProfitPrice: number | null = null;
    let maxProfitAtTarget = 0;
    
    if (takeProfitPercent !== undefined && takeProfitPercent > 0) {
      if (positionType === 'long') {
        takeProfitPrice = entryPrice * (1 + takeProfitPercent / 100);
      } else {
        takeProfitPrice = entryPrice * (1 - takeProfitPercent / 100);
      }
      maxProfitAtTarget = this.calculatePnL(entryPrice, takeProfitPrice, positionSizeUsd, positionType);
    }

    // Stop loss calculations
    let stopLossPrice: number | null = null;
    let maxLossAtStopLoss = 0;
    
    if (stopLossPercent !== undefined && stopLossPercent > 0) {
      if (positionType === 'long') {
        stopLossPrice = entryPrice * (1 - stopLossPercent / 100);
      } else {
        stopLossPrice = entryPrice * (1 + stopLossPercent / 100);
      }
      maxLossAtStopLoss = Math.abs(this.calculatePnL(entryPrice, stopLossPrice, positionSizeUsd, positionType));
    }

    return {
      liquidationPrice,
      distanceToLiquidation,
      distanceToLiquidationUsd,
      positionSizeUsd,
      positionSizeBtc,
      marginMode,
      accountCollateral: Math.max(0, accountCollateral),
      totalCollateralAtRisk,
      maxProfitAtTarget,
      maxLossAtStopLoss,
      effectiveLeverage,
      marginCallPrice,
      riskScore,
      breakEvenPrice,
      fundingRateImpact,
      takeProfitPrice,
      stopLossPrice
    };
  }

  /**
   * Generate leverage comparison table
   */
  generateLeverageComparison(
    entryPrice: number,
    marginAmount: number,
    positionType: 'long' | 'short',
    maintenanceMargin: number,
    leverageValues: number[] = [2, 5, 10, 25, 50, 100]
  ): LeverageComparison[] {
    return leverageValues.map(leverage => {
      const liquidationPrice = this.calculateLiquidationPrice(
        entryPrice,
        leverage,
        positionType,
        maintenanceMargin
      );

      const distancePercent = this.calculateDistanceToLiquidation(
        entryPrice,
        liquidationPrice,
        positionType
      );

      const positionSize = this.calculatePositionSize(marginAmount, leverage);

      // Calculate profit/loss if price moves 10%
      const priceMove10 = entryPrice * 0.1;
      const exitPriceUp = entryPrice + priceMove10;
      const exitPriceDown = entryPrice - priceMove10;

      let maxProfit10: number, maxLoss10: number;
      
      if (positionType === 'long') {
        maxProfit10 = this.calculatePnL(entryPrice, exitPriceUp, positionSize, positionType);
        maxLoss10 = Math.abs(this.calculatePnL(entryPrice, exitPriceDown, positionSize, positionType));
      } else {
        maxProfit10 = this.calculatePnL(entryPrice, exitPriceDown, positionSize, positionType);
        maxLoss10 = Math.abs(this.calculatePnL(entryPrice, exitPriceUp, positionSize, positionType));
      }

      const riskScore = this.getRiskScore(distancePercent);

      return {
        leverage,
        liquidationPrice,
        distancePercent,
        maxProfit10,
        maxLoss10,
        riskScore
      };
    });
  }

  /**
   * Get exchange preset by ID
   */
  getExchangePreset(exchangeId: string): ExchangePreset | undefined {
    return exchangePresets.find(e => e.id === exchangeId);
  }

  /**
   * Validate leverage within exchange limits
   */
  validateLeverage(leverage: number, maxLeverage: number = 125): boolean {
    return leverage >= 1 && leverage <= maxLeverage;
  }
}

export const leverageLiquidationCalculator = new LeverageLiquidationCalculator();
