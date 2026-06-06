/**
 * Bitcoin Converter Service
 * Handles bidirectional conversions between all Bitcoin units and fiat currencies
 */

// Bitcoin unit multipliers relative to BTC
export const BITCOIN_UNITS = {
  btc: { name: 'Bitcoin', symbol: 'BTC', multiplier: 1, decimals: 8 },
  mbtc: { name: 'Millibitcoin', symbol: 'mBTC', multiplier: 1_000, decimals: 5 },
  bits: { name: 'Microbitcoin', symbol: 'bits', multiplier: 1_000_000, decimals: 2 },
  sats: { name: 'Satoshi', symbol: 'sats', multiplier: 100_000_000, decimals: 0 },
} as const;

export type BitcoinUnitKey = keyof typeof BITCOIN_UNITS;

export interface ConversionValues {
  btc: string;
  mbtc: string;
  bits: string;
  sats: string;
  fiat: string;
}

/**
 * Convert from any Bitcoin unit to BTC
 */
export const toBtc = (value: number, fromUnit: BitcoinUnitKey): number => {
  return value / BITCOIN_UNITS[fromUnit].multiplier;
};

/**
 * Convert from BTC to any Bitcoin unit
 */
export const fromBtc = (btcValue: number, toUnit: BitcoinUnitKey): number => {
  return btcValue * BITCOIN_UNITS[toUnit].multiplier;
};

/**
 * Convert from fiat to BTC using the current price
 */
export const fiatToBtc = (fiatAmount: number, btcPriceInFiat: number): number => {
  if (btcPriceInFiat <= 0) return 0;
  return fiatAmount / btcPriceInFiat;
};

/**
 * Convert from BTC to fiat using the current price
 */
export const btcToFiat = (btcAmount: number, btcPriceInFiat: number): number => {
  return btcAmount * btcPriceInFiat;
};

/**
 * Format a number for display with appropriate precision
 */
export const formatUnitValue = (value: number, unit: BitcoinUnitKey): string => {
  const { decimals } = BITCOIN_UNITS[unit];
  if (value === 0) return '0';
  
  // For sats, always show whole numbers
  if (unit === 'sats') {
    return Math.round(value).toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  
  // For other units, use appropriate precision
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format fiat value for display
 */
export const formatFiatValue = (value: number, currencySymbol: string = '$'): string => {
  if (value === 0) return `${currencySymbol}0.00`;
  
  if (value >= 1) {
    return `${currencySymbol}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  // For very small values, show more decimals
  return `${currencySymbol}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
};

/**
 * Quick reference amounts in satoshis
 */
export const QUICK_REFERENCE_AMOUNTS = [
  { sats: 1, label: '1 sat' },
  { sats: 10, label: '10 sats' },
  { sats: 100, label: '100 sats' },
  { sats: 1_000, label: '1,000 sats' },
  { sats: 10_000, label: '10,000 sats' },
  { sats: 100_000, label: '100,000 sats' },
  { sats: 1_000_000, label: '1,000,000 sats' },
  { sats: 100_000_000, label: '1 BTC' },
];

/**
 * Calculate all conversion values from a source unit change
 */
export const calculateConversions = (
  value: number,
  sourceUnit: BitcoinUnitKey | 'fiat',
  btcPriceInFiat: number
): ConversionValues => {
  let btcValue: number;

  if (sourceUnit === 'fiat') {
    btcValue = fiatToBtc(value, btcPriceInFiat);
  } else {
    btcValue = toBtc(value, sourceUnit);
  }

  return {
    btc: btcValue === 0 ? '' : fromBtc(btcValue, 'btc').toFixed(8).replace(/\.?0+$/, ''),
    mbtc: btcValue === 0 ? '' : fromBtc(btcValue, 'mbtc').toFixed(5).replace(/\.?0+$/, ''),
    bits: btcValue === 0 ? '' : fromBtc(btcValue, 'bits').toFixed(2).replace(/\.?0+$/, ''),
    sats: btcValue === 0 ? '' : Math.round(fromBtc(btcValue, 'sats')).toString(),
    fiat: btcValue === 0 ? '' : btcToFiat(btcValue, btcPriceInFiat).toFixed(2),
  };
};
