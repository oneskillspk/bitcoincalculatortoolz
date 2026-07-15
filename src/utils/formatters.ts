/**
 * Utility functions for formatting values with proper handling of edge cases
 */

/**
 * Formats ROI percentage with modern infinity symbol for extreme values
 * @param percentage - The ROI percentage value
 * @param decimalPlaces - Number of decimal places (default: 1)
 * @returns Formatted string with modern infinity symbol if needed
 */
export function formatROI(percentage: number, decimalPlaces: number = 1): string {
  if (!isFinite(percentage)) {
    return "—";
  }

  const sign = percentage >= 0 ? '+' : '';
  const abs = Math.abs(percentage);

  // Keep very large historical gains readable without implying an infinite ROI.
  if (abs >= 1_000_000) {
    return `${sign}${(percentage / 1_000_000).toFixed(1)}M%`;
  }

  if (abs >= 10_000) {
    const kValue = percentage / 1000;
    return `${sign}${kValue.toFixed(1)}K%`;
  }

  if (abs >= 1000) {
    return `${sign}${percentage.toLocaleString('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    })}%`;
  }

  return `${sign}${percentage.toFixed(decimalPlaces)}%`;
}


/**
 * Formats currency values with proper localization
 * @param value - The numeric value to format
 * @param currency - Currency object with symbol and code
 * @param showInBtc - Whether to display in BTC instead
 */
export function formatCurrency(
  value: number,
  currency: { symbol: string; code: string } | undefined,
  showInBtc: boolean = false,
  locale: string = 'en-US',
): string {
  if (showInBtc) {
    return `${value.toFixed(8)} BTC`;
  }

  if (!isFinite(value)) {
    return `${currency?.symbol || '$'}∞`;
  }

  const formatted = Math.abs(value).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const sign = value < 0 ? '-' : '';
  return `${sign}${currency?.symbol || '$'}${formatted}`;
}

/**
 * Formats large numbers with appropriate suffixes (K, M, B, T)
 * @param value - The numeric value to format
 * @param decimalPlaces - Number of decimal places
 */
export function formatLargeNumber(value: number, decimalPlaces: number = 1): string {
  if (!isFinite(value)) {
    return "∞";
  }
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1e12) {
    return `${sign}${(absValue / 1e12).toFixed(decimalPlaces)}T`;
  }
  
  if (absValue >= 1e9) {
    return `${sign}${(absValue / 1e9).toFixed(decimalPlaces)}B`;
  }
  
  if (absValue >= 1e6) {
    return `${sign}${(absValue / 1e6).toFixed(decimalPlaces)}M`;
  }
  
  if (absValue >= 1e3) {
    return `${sign}${(absValue / 1e3).toFixed(decimalPlaces)}K`;
  }
  
  return `${sign}${absValue.toFixed(decimalPlaces)}`;
}