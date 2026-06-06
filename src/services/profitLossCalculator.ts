// Bitcoin Profit/Loss Calculator Engine
// Supports multi-purchase cost basis, exchange fee presets, and scenario modeling

export interface Purchase {
  id: string;
  amount: number; // USD invested
  pricePerBtc: number; // Price at time of purchase
  btcAmount: number; // Calculated BTC received (after buy fee)
  buyFeePercent: number;
}

export interface ExchangeFeePreset {
  id: string;
  name: string;
  buyFeePercent: number;
  sellFeePercent: number;
  description: string;
}

export interface ProfitLossResult {
  // Cost basis
  totalInvested: number;
  totalBuyFees: number;
  totalCostBasis: number; // totalInvested (includes fees paid)
  weightedAvgCostBasis: number; // per BTC
  totalBtcHeld: number;

  // Sell side
  sellPrice: number;
  grossProceeds: number; // BTC * sell price
  sellFee: number;
  netProceeds: number; // grossProceeds - sellFee

  // P/L
  grossProfitLoss: number; // grossProceeds - totalInvested
  netProfitLoss: number; // netProceeds - totalInvested
  totalFeesPaid: number; // buyFees + sellFee
  roiPercent: number; // (netProceeds - totalInvested) / totalInvested * 100

  // Breakeven
  breakevenPrice: number; // minimum sell price to break even after all fees

  // Scenario data
  scenarios: PriceScenario[];
}

export interface PriceScenario {
  label: string;
  price: number;
  percentChange: number;
  netProfitLoss: number;
  roi: number;
}

export const exchangeFeePresets: ExchangeFeePreset[] = [
  { id: 'binance', name: 'Binance', buyFeePercent: 0.10, sellFeePercent: 0.10, description: 'Spot trading standard tier' },
  { id: 'coinbase', name: 'Coinbase', buyFeePercent: 1.49, sellFeePercent: 1.49, description: 'Standard buy/sell fee' },
  { id: 'coinbase-advanced', name: 'Coinbase Advanced', buyFeePercent: 0.60, sellFeePercent: 0.60, description: 'Advanced trade maker fee' },
  { id: 'kraken', name: 'Kraken', buyFeePercent: 0.26, sellFeePercent: 0.40, description: 'Maker/Taker fees' },
  { id: 'bybit', name: 'Bybit', buyFeePercent: 0.10, sellFeePercent: 0.10, description: 'Spot trading fees' },
  { id: 'gemini', name: 'Gemini', buyFeePercent: 0.40, sellFeePercent: 0.40, description: 'ActiveTrader fees' },
  { id: 'custom', name: 'Custom', buyFeePercent: 0, sellFeePercent: 0, description: 'Set your own fee rates' },
];

export const createPurchase = (
  amount: number,
  pricePerBtc: number,
  buyFeePercent: number
): Purchase => {
  const feeAmount = amount * (buyFeePercent / 100);
  const effectiveAmount = amount - feeAmount;
  const btcAmount = pricePerBtc > 0 ? effectiveAmount / pricePerBtc : 0;

  return {
    id: crypto.randomUUID(),
    amount,
    pricePerBtc,
    btcAmount,
    buyFeePercent,
  };
};

export const calculateProfitLoss = (
  purchases: Purchase[],
  sellPrice: number,
  sellFeePercent: number
): ProfitLossResult | null => {
  if (purchases.length === 0 || sellPrice <= 0) return null;

  const validPurchases = purchases.filter(p => p.amount > 0 && p.pricePerBtc > 0);
  if (validPurchases.length === 0) return null;

  // Aggregate purchases
  const totalInvested = validPurchases.reduce((sum, p) => sum + p.amount, 0);
  const totalBuyFees = validPurchases.reduce((sum, p) => sum + (p.amount * p.buyFeePercent / 100), 0);
  const totalBtcHeld = validPurchases.reduce((sum, p) => sum + p.btcAmount, 0);

  const totalCostBasis = totalInvested;
  const weightedAvgCostBasis = totalBtcHeld > 0 ? totalInvested / totalBtcHeld : 0;

  // Sell calculations
  const grossProceeds = totalBtcHeld * sellPrice;
  const sellFee = grossProceeds * (sellFeePercent / 100);
  const netProceeds = grossProceeds - sellFee;

  // P/L
  const grossProfitLoss = grossProceeds - totalInvested;
  const netProfitLoss = netProceeds - totalInvested;
  const totalFeesPaid = totalBuyFees + sellFee;
  const roiPercent = totalInvested > 0 ? (netProfitLoss / totalInvested) * 100 : 0;

  // Breakeven: totalInvested = btc * breakevenPrice * (1 - sellFee%)
  const breakevenPrice = totalBtcHeld > 0
    ? totalInvested / (totalBtcHeld * (1 - sellFeePercent / 100))
    : 0;

  // Generate scenarios
  const scenarioPercents = [-50, -25, -10, 0, 10, 25, 50, 100];
  const scenarios: PriceScenario[] = scenarioPercents.map(pct => {
    const scenarioPrice = sellPrice * (1 + pct / 100);
    const scenarioGross = totalBtcHeld * scenarioPrice;
    const scenarioSellFee = scenarioGross * (sellFeePercent / 100);
    const scenarioNet = scenarioGross - scenarioSellFee;
    const scenarioPL = scenarioNet - totalInvested;
    const scenarioROI = totalInvested > 0 ? (scenarioPL / totalInvested) * 100 : 0;

    return {
      label: pct === 0 ? 'Current' : `${pct > 0 ? '+' : ''}${pct}%`,
      price: scenarioPrice,
      percentChange: pct,
      netProfitLoss: scenarioPL,
      roi: scenarioROI,
    };
  });

  return {
    totalInvested,
    totalBuyFees,
    totalCostBasis,
    weightedAvgCostBasis,
    totalBtcHeld,
    sellPrice,
    grossProceeds,
    sellFee,
    netProceeds,
    grossProfitLoss,
    netProfitLoss,
    totalFeesPaid,
    roiPercent,
    breakevenPrice,
    scenarios,
  };
};
