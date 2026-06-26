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
  // Handle infinity and extreme values
  if (!isFinite(percentage)) {
    return "∞"; // Modern infinity symbol
  }
  
  // Handle extremely large values (over 10,000%)
  if (Math.abs(percentage) >= 10000) {
    return "∞"; // Use infinity symbol for very large gains/losses
  }
  
  // Handle very large values with K notation
  if (Math.abs(percentage) >= 1000) {
    const kValue = percentage / 1000;
    return `${percentage >= 0 ? '+' : ''}${kValue.toFixed(1)}K%`;
  }
  
  // Normal formatting
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(decimalPlaces)}%`;
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