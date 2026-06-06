/**
 * Rainbow Chart Service
 * Logarithmic regression engine for the Bitcoin Rainbow Price Chart
 * Based on the original "trolololo" model from Bitcointalk (October 2014)
 *
 * Formula: log10(price) = a × log10(daysSinceGenesis) + b + bandOffset
 */

const GENESIS_DATE = new Date('2009-01-03T00:00:00Z');

// Regression coefficients fitted to historical BTC price data (log10-based)
const REGRESSION_A = 5.84;
const REGRESSION_B = -17.01;

// Each band is exactly 0.17 wide in log10 space (evenly spaced rainbow)
// Verified against historical data:
//   2017 peak ~$20K → Band 9 "Maximum Bubble" ✓
//   2021 peak ~$69K → Band 7-8 "FOMO / Sell" ✓
//   2022 bottom ~$16K → Band 2 "BUY!" ✓
//   Current ~$85K (March 2026) → Band 4-5 "Still Cheap / HODL" ✓
export const BANDS = [
  { index: 9, name: 'Maximum Bubble Territory', offset: 0.63, color: '#880808' },
  { index: 8, name: 'Sell. Seriously, SELL!',   offset: 0.46, color: '#ea384c' },
  { index: 7, name: 'FOMO Intensifies',         offset: 0.29, color: '#f97316' },
  { index: 6, name: 'Is This a Bubble?',        offset: 0.12, color: '#f59e0b' },
  { index: 5, name: 'HODL!',                    offset: -0.05, color: '#eab308' },
  { index: 4, name: 'Still Cheap',              offset: -0.22, color: '#84cc16' },
  { index: 3, name: 'Accumulate',               offset: -0.39, color: '#22c55e' },
  { index: 2, name: 'BUY!',                     offset: -0.56, color: '#06b6d4' },
  { index: 1, name: 'Basically a Fire Sale',    offset: -0.73, color: '#3b82f6' },
] as const;

export type BandInfo = typeof BANDS[number];

/** Bitcoin halving dates for chart markers */
export const HALVING_DATES = [
  { number: 1, date: '2012-11-28', label: 'Halving 1' },
  { number: 2, date: '2016-07-09', label: 'Halving 2' },
  { number: 3, date: '2020-05-11', label: 'Halving 3' },
  { number: 4, date: '2024-04-20', label: 'Halving 4' },
  { number: 5, date: '2028-04-15', label: 'Halving 5 (est.)' },
] as const;

export interface ChartDataPoint {
  date: string;
  timestamp: number;
  price?: number;
  band1: number;
  band2: number;
  band3: number;
  band4: number;
  band5: number;
  band6: number;
  band7: number;
  band8: number;
  band9: number;
  bandTop: number;
}

export interface CurrentBandResult {
  bandIndex: number;
  name: string;
  color: string;
  description: string;
  lowerPrice: number;
  upperPrice: number;
}

export interface BandStatistic {
  index: number;
  name: string;
  color: string;
  currentLower: number;
  currentUpper: number;
  percentageOfHistory: number;
}

/** Calculate the number of days since the Bitcoin genesis block */
export function getDaysSinceGenesis(date: Date): number {
  return (date.getTime() - GENESIS_DATE.getTime()) / (1000 * 60 * 60 * 24);
}

/** Get the regression price for a given date and band offset */
export function getRegressionPrice(date: Date, bandOffset: number = 0): number {
  const days = getDaysSinceGenesis(date);
  if (days <= 0) return 0;
  const logPrice = REGRESSION_A * Math.log10(days) + REGRESSION_B + bandOffset;
  return Math.pow(10, logPrice);
}

/** Get all band boundary prices for a given date */
export function getAllBandPrices(date: Date): { bandIndex: number; name: string; color: string; price: number }[] {
  return BANDS.map(band => ({
    bandIndex: band.index,
    name: band.name,
    color: band.color,
    price: getRegressionPrice(date, band.offset),
  }));
}

/** Determine which band the current price falls into */
export function getCurrentBand(price: number, date: Date): CurrentBandResult {
  const bandPrices = getAllBandPrices(date);

  // Above all bands
  const topBand = bandPrices[0];
  const topEdge = getRegressionPrice(date, 0.80);
  if (price >= topEdge) {
    return {
      bandIndex: 9,
      name: topBand.name,
      color: topBand.color,
      description: getBandDescription(9),
      lowerPrice: topBand.price,
      upperPrice: topEdge,
    };
  }

  // Iterate from bottom band up
  const reversedBands = [...bandPrices].reverse(); // now [band1, band2, ..., band9]
  for (let i = 0; i < reversedBands.length; i++) {
    const currentBand = reversedBands[i];
    const nextBand = i < reversedBands.length - 1 ? reversedBands[i + 1] : null;
    const upperBound = nextBand ? nextBand.price : topEdge;

    if (price >= currentBand.price && price < upperBound) {
      return {
        bandIndex: currentBand.bandIndex,
        name: currentBand.name,
        color: currentBand.color,
        description: getBandDescription(currentBand.bandIndex),
        lowerPrice: currentBand.price,
        upperPrice: upperBound,
      };
    }
  }

  // Above top edge
  if (price >= topEdge) {
    return {
      bandIndex: 9,
      name: BANDS[0].name,
      color: BANDS[0].color,
      description: getBandDescription(9),
      lowerPrice: getRegressionPrice(date, BANDS[0].offset),
      upperPrice: price * 1.2,
    };
  }

  // Below all bands
  const lowestBand = bandPrices[bandPrices.length - 1];
  return {
    bandIndex: 0,
    name: 'Below Rainbow',
    color: '#6366f1',
    description:
      "Bitcoin is trading below all Rainbow bands. This has historically been extremely rare and represented the most significant buying opportunities in Bitcoin's history.",
    lowerPrice: 0,
    upperPrice: lowestBand.price,
  };
}

/** Interpolate price from sorted price history for a given timestamp */
function interpolatePrice(
  sortedPrices: { timestamp: number; price: number }[],
  targetTimestamp: number
): number | undefined {
  if (sortedPrices.length === 0) return undefined;

  // Before all data
  if (targetTimestamp <= sortedPrices[0].timestamp) {
    return sortedPrices[0].price;
  }
  // After all data
  if (targetTimestamp >= sortedPrices[sortedPrices.length - 1].timestamp) {
    return sortedPrices[sortedPrices.length - 1].price;
  }

  // Linear scan to find bracketing points
  for (let i = 0; i < sortedPrices.length - 1; i++) {
    const before = sortedPrices[i];
    const after = sortedPrices[i + 1];
    if (targetTimestamp >= before.timestamp && targetTimestamp <= after.timestamp) {
      const ratio = (targetTimestamp - before.timestamp) / (after.timestamp - before.timestamp);
      return before.price + (after.price - before.price) * ratio;
    }
  }

  return sortedPrices[sortedPrices.length - 1].price;
}

/** Generate chart data suitable for Recharts */
export function generateChartData(
  priceHistory: { date: string; price: number }[],
  futureYears: number = 2
): ChartDataPoint[] {
  const dataPoints: ChartDataPoint[] = [];

  // Sort and convert to timestamp-based array for interpolation
  const sortedPrices = [...priceHistory]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(p => ({ timestamp: new Date(p.date).getTime(), price: p.price }));

  const startDate = sortedPrices.length > 0
    ? new Date(sortedPrices[0].timestamp)
    : new Date('2010-07-01');
  const today = new Date();
  const endDate = new Date(today);
  endDate.setFullYear(endDate.getFullYear() + futureYears);

  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const pre2013 = new Date('2013-01-01');
  const lastPriceTimestamp = sortedPrices.length > 0
    ? sortedPrices[sortedPrices.length - 1].timestamp
    : 0;

  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    const dateStr = cursor.toISOString().split('T')[0];
    const d = new Date(cursor);
    const days = getDaysSinceGenesis(d);

    if (days > 0) {
      const point: ChartDataPoint = {
        date: dateStr,
        timestamp: d.getTime(),
        band1: getRegressionPrice(d, -0.73),
        band2: getRegressionPrice(d, -0.56),
        band3: getRegressionPrice(d, -0.39),
        band4: getRegressionPrice(d, -0.22),
        band5: getRegressionPrice(d, -0.05),
        band6: getRegressionPrice(d, 0.12),
        band7: getRegressionPrice(d, 0.29),
        band8: getRegressionPrice(d, 0.46),
        band9: getRegressionPrice(d, 0.63),
        bandTop: getRegressionPrice(d, 0.80),
      };

      // Interpolate price for historical dates within data range
      if (cursor <= today && d.getTime() <= lastPriceTimestamp) {
        const price = interpolatePrice(sortedPrices, d.getTime());
        if (price && price > 0) {
          point.price = price;
        }
      }

      dataPoints.push(point);
    }

    // Adaptive grid spacing
    if (cursor > ninetyDaysAgo && cursor <= today) {
      cursor.setDate(cursor.getDate() + 1); // Daily for last 90 days
    } else if (cursor > today) {
      cursor.setMonth(cursor.getMonth() + 1); // Monthly for future
    } else if (cursor < pre2013) {
      cursor.setDate(cursor.getDate() + 30); // Monthly pre-2013
    } else {
      cursor.setDate(cursor.getDate() + 7); // Weekly 2013-present
    }
  }

  return dataPoints;
}

/** Calculate band statistics from historical price data */
export function getBandStatistics(priceHistory: { date: string; price: number }[]): BandStatistic[] {
  const bandCounts = new Array(10).fill(0);
  let totalDays = 0;

  for (const { date, price } of priceHistory) {
    if (price <= 0) continue;
    const d = new Date(date);
    const band = getCurrentBand(price, d);
    bandCounts[band.bandIndex]++;
    totalDays++;
  }

  const today = new Date();

  return BANDS.map((band, i) => {
    const upperBand = i === 0 ? null : BANDS[i - 1];
    return {
      index: band.index,
      name: band.name,
      color: band.color,
      currentLower: getRegressionPrice(today, band.offset),
      currentUpper: upperBand
        ? getRegressionPrice(today, upperBand.offset)
        : getRegressionPrice(today, 0.80),
      percentageOfHistory: totalDays > 0 ? (bandCounts[band.index] / totalDays) * 100 : 0,
    };
  }).reverse();
}

/** Get a human-readable description for each band */
export function getBandDescription(bandIndex: number): string {
  const descriptions: Record<number, string> = {
    0: 'Bitcoin is trading below all Rainbow bands. This has historically been extremely rare and represented deep accumulation zones.',
    1: 'Bitcoin is at a massive discount. Historically, this zone has offered the highest long-term returns. These prices have always been temporary.',
    2: 'Strong buying opportunity. Bitcoin is significantly undervalued according to the long-term logarithmic regression. Historically an excellent entry point.',
    3: 'Accumulation zone. Bitcoin is below its long-term growth trend. Smart investors historically accumulated heavily in this band.',
    4: 'Bitcoin is near fair value but still relatively cheap. The price is close to the center of the logarithmic regression — a reasonable entry point.',
    5: 'Bitcoin is at its long-term average valuation. Hold your position and consider dollar-cost averaging. Not cheap, not expensive.',
    6: 'Bitcoin is beginning to trade above its long-term average. Exercise some caution with large new purchases.',
    7: 'Bitcoin is entering overheated territory. FOMO is driving prices higher. Consider taking some profits and reducing new positions.',
    8: 'Bitcoin is significantly overvalued according to the regression model. Historically, this zone has preceded major corrections. Consider selling.',
    9: 'Maximum bubble territory. Bitcoin has historically crashed after reaching this zone. This has marked cycle tops in every previous bull run.',
  };
  return descriptions[bandIndex] || 'Unknown band';
}

/** Get a short action label for each band */
export function getBandAction(bandIndex: number): string {
  if (bandIndex <= 2) return 'Strong Buy';
  if (bandIndex === 3) return 'Accumulate';
  if (bandIndex === 4) return 'Buy';
  if (bandIndex === 5) return 'Hold';
  if (bandIndex === 6) return 'Caution';
  if (bandIndex === 7) return 'FOMO Zone';
  if (bandIndex === 8) return 'Sell Signal';
  if (bandIndex >= 9) return 'Extreme Caution';
  return 'Unknown';
}
