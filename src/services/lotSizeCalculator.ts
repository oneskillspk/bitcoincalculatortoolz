/**
 * Bitcoin Lot Size Calculator Service
 * Risk-based lot sizing for forex/CFD traders + lot-to-USD conversion
 */

export interface BrokerPreset {
  id: string;
  name: string;
  contractSize: number; // BTC per standard lot
  minLot: number;
  maxLeverage: number;
  description: string;
}

export const brokerPresets: BrokerPreset[] = [
  { id: 'standard', name: 'Standard (Most Brokers)', contractSize: 1, minLot: 0.01, maxLeverage: 100, description: '1 lot = 1 BTC' },
  { id: 'exness', name: 'Exness', contractSize: 1, minLot: 0.01, maxLeverage: 400, description: '1 lot = 1 BTC, min 0.01' },
  { id: 'icmarkets', name: 'IC Markets', contractSize: 1, minLot: 0.01, maxLeverage: 200, description: '1 lot = 1 BTC, min 0.01' },
  { id: 'bybit', name: 'Bybit', contractSize: 1, minLot: 0.001, maxLeverage: 100, description: 'USD-M perpetual, min 0.001' },
  { id: 'binance', name: 'Binance Futures', contractSize: 1, minLot: 0.001, maxLeverage: 125, description: 'BTCUSDT perpetual, min 0.001' },
  { id: 'delta', name: 'Delta Exchange', contractSize: 0.001, minLot: 1, maxLeverage: 100, description: 'INR-denominated, 1 contract = 0.001 BTC' },
  { id: 'custom', name: 'Custom', contractSize: 1, minLot: 0.01, maxLeverage: 200, description: 'Set your own contract size' },
];

export interface LotSizeParams {
  accountBalance: number;
  riskPercent: number;
  entryPrice: number;
  stopLossPrice: number;
  leverage: number;
  contractSize: number; // BTC per standard lot
  takeProfitPrice?: number;
  maxDailyDrawdown?: number;
}

export interface LotBreakdown {
  standard: number; // 1.0 lots
  mini: number;     // 0.1 lots
  micro: number;    // 0.01 lots
  nano: number;     // 0.001 lots
}

export interface LotSizeResult {
  recommendedLotSize: number;
  positionSizeBtc: number;
  positionValueUsd: number;
  dollarRisk: number;
  riskRewardRatio: number | null;
  marginRequired: number;
  lotBreakdown: LotBreakdown;
  riskLevel: 'safe' | 'warning' | 'danger';
  exceedsDailyDrawdown: boolean;
}

export interface LotValueRow {
  lotSize: number;
  btcAmount: number;
  usdValue: number;
  label: string;
}

class LotSizeCalculatorService {
  /**
   * Calculate recommended lot size based on risk parameters
   */
  calculateLotSize(params: LotSizeParams): LotSizeResult {
    const {
      accountBalance,
      riskPercent,
      entryPrice,
      stopLossPrice,
      leverage,
      contractSize,
      takeProfitPrice,
      maxDailyDrawdown,
    } = params;

    // Dollar risk = account balance * risk%
    const dollarRisk = accountBalance * (riskPercent / 100);

    // Stop loss distance in USD
    const stopLossDistance = Math.abs(entryPrice - stopLossPrice);

    // Tick value = contract size (1 BTC per lot typically)
    // Lot Size = Dollar Risk / (Stop Loss Distance × Contract Size)
    const recommendedLotSize = stopLossDistance > 0
      ? dollarRisk / (stopLossDistance * contractSize)
      : 0;

    // Position size
    const positionSizeBtc = recommendedLotSize * contractSize;
    const positionValueUsd = positionSizeBtc * entryPrice;

    // Margin required (with leverage)
    const marginRequired = leverage > 0 ? positionValueUsd / leverage : positionValueUsd;

    // Risk/Reward ratio
    let riskRewardRatio: number | null = null;
    if (takeProfitPrice && stopLossDistance > 0) {
      const takeProfitDistance = Math.abs(takeProfitPrice - entryPrice);
      riskRewardRatio = takeProfitDistance / stopLossDistance;
    }

    // Lot breakdown
    const lotBreakdown = this.getLotBreakdown(recommendedLotSize);

    // Risk level
    const riskLevel = this.getRiskLevel(riskPercent);

    // Check daily drawdown
    const exceedsDailyDrawdown = maxDailyDrawdown
      ? dollarRisk > accountBalance * (maxDailyDrawdown / 100)
      : false;

    return {
      recommendedLotSize: Math.round(recommendedLotSize * 10000) / 10000,
      positionSizeBtc: Math.round(positionSizeBtc * 100000000) / 100000000,
      positionValueUsd: Math.round(positionValueUsd * 100) / 100,
      dollarRisk: Math.round(dollarRisk * 100) / 100,
      riskRewardRatio: riskRewardRatio ? Math.round(riskRewardRatio * 100) / 100 : null,
      marginRequired: Math.round(marginRequired * 100) / 100,
      lotBreakdown,
      riskLevel,
      exceedsDailyDrawdown,
    };
  }

  /**
   * Break down a lot size into standard/mini/micro/nano
   */
  getLotBreakdown(totalLots: number): LotBreakdown {
    let remaining = totalLots;
    const standard = Math.floor(remaining);
    remaining -= standard;
    const mini = Math.floor(remaining * 10);
    remaining -= mini / 10;
    const micro = Math.floor(remaining * 100);
    remaining -= micro / 100;
    const nano = Math.round(remaining * 1000);

    return { standard, mini, micro, nano };
  }

  /**
   * Risk level based on risk percentage
   */
  getRiskLevel(riskPercent: number): 'safe' | 'warning' | 'danger' {
    if (riskPercent <= 1) return 'safe';
    if (riskPercent <= 2) return 'warning';
    return 'danger';
  }

  /**
   * Convert lot size to BTC and USD
   */
  convertLotValue(lotSize: number, btcPrice: number, contractSize: number = 1): { btcAmount: number; usdValue: number } {
    const btcAmount = lotSize * contractSize;
    const usdValue = btcAmount * btcPrice;
    return {
      btcAmount: Math.round(btcAmount * 100000000) / 100000000,
      usdValue: Math.round(usdValue * 100) / 100,
    };
  }

  /**
   * Generate quick reference table rows
   */
  generateReferenceTable(btcPrice: number, contractSize: number = 1): LotValueRow[] {
    const lotSizes = [0.001, 0.01, 0.05, 0.1, 0.5, 1.0, 2.0, 5.0];
    return lotSizes.map(lotSize => {
      const { btcAmount, usdValue } = this.convertLotValue(lotSize, btcPrice, contractSize);
      return {
        lotSize,
        btcAmount,
        usdValue,
        label: this.getLotLabel(lotSize),
      };
    });
  }

  /**
   * Generate multi-price reference table
   */
  generateMultiPriceTable(contractSize: number = 1): { lotSize: number; label: string; btcAmount: number }[] {
    const lotSizes = [0.001, 0.01, 0.05, 0.1, 0.5, 1.0, 2.0, 5.0];
    return lotSizes.map(lotSize => ({
      lotSize,
      label: this.getLotLabel(lotSize),
      btcAmount: lotSize * contractSize,
    }));
  }

  /**
   * Get human-readable lot label
   */
  getLotLabel(lotSize: number): string {
    if (lotSize >= 1) return 'Standard';
    if (lotSize >= 0.1) return 'Mini';
    if (lotSize >= 0.01) return 'Micro';
    return 'Nano';
  }
}

export const lotSizeCalculator = new LotSizeCalculatorService();
