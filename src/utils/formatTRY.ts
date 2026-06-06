/**
 * Turkish currency and number formatting utilities.
 *
 * Turkish number format:
 *   - Period (.) as thousands separator
 *   - Comma (,) as decimal separator
 *   - ₺ (U+20BA) symbol placed BEFORE the number
 *
 * Examples:
 *   3280530.60  →  ₺3.280.530,60
 *   0.032805    →  ₺0,032805
 */

export const TRY_SYMBOL = '₺';

/**
 * Format a number as Turkish Lira with the ₺ prefix.
 * @param value   Numeric value to format
 * @param decimals Number of decimal places (default 2)
 */
export function formatTRY(value: number, decimals = 2): string {
  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  return `${TRY_SYMBOL}${formatted}`;
}

/**
 * Format a number using Turkish locale conventions without a currency symbol.
 * @param value   Numeric value to format
 * @param decimals Number of decimal places (default 2)
 */
export function formatTRNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a satoshi amount as Turkish Lira.
 * Typically requires more decimal places.
 * @param satoshiValueInTRY  Value of 1 satoshi in TRY
 */
export function formatSatoshiTRY(satoshiValueInTRY: number): string {
  return formatTRY(satoshiValueInTRY, 6);
}
