export interface PurchaseEntry {
  id: string;
  btcAmount: number;
  pricePerBtc: number;
}

export interface AvgBuyResult {
  weightedAvgPrice: number;
  totalBtc: number;
  totalSpent: number;
  currentValue: number;
  unrealizedPL: number;
  roiPercent: number;
  breakEvenPrice: number;
  breakEvenDistancePercent: number;
  isAboveBreakEven: boolean;
}

export const createPurchaseEntry = (
  btcAmount: number = 0,
  pricePerBtc: number = 0
): PurchaseEntry => ({
  id: crypto.randomUUID(),
  btcAmount,
  pricePerBtc,
});

export const calculateAverageBuyPrice = (
  purchases: PurchaseEntry[],
  liveBtcPrice: number
): AvgBuyResult | null => {
  const valid = purchases.filter(p => p.btcAmount > 0 && p.pricePerBtc > 0);
  if (valid.length === 0 || liveBtcPrice <= 0) return null;

  const totalBtc = valid.reduce((s, p) => s + p.btcAmount, 0);
  const totalSpent = valid.reduce((s, p) => s + p.btcAmount * p.pricePerBtc, 0);
  const weightedAvgPrice = totalSpent / totalBtc;
  const currentValue = totalBtc * liveBtcPrice;
  const unrealizedPL = currentValue - totalSpent;
  const roiPercent = totalSpent > 0 ? (unrealizedPL / totalSpent) * 100 : 0;
  const breakEvenPrice = weightedAvgPrice;
  const breakEvenDistancePercent = ((liveBtcPrice - breakEvenPrice) / breakEvenPrice) * 100;
  const isAboveBreakEven = liveBtcPrice >= breakEvenPrice;

  return {
    weightedAvgPrice,
    totalBtc,
    totalSpent,
    currentValue,
    unrealizedPL,
    roiPercent,
    breakEvenPrice,
    breakEvenDistancePercent,
    isAboveBreakEven,
  };
};

const getScenarioValues = (totalBtc: number): { price: number; label: string; value: number }[] => {
  const targets = [100_000, 150_000, 200_000, 500_000, 1_000_000];
  return targets.map(price => ({
    price,
    label: `$${(price / 1000).toFixed(0)}k${price >= 1_000_000 ? '' : ''}`.replace('1000k', '$1M'),
    value: totalBtc * price,
  }));
};
