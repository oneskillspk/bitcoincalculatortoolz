/**
 * Bitcoin Power Law Calculator Service
 * Based on Giovanni Santostasi's Power Law model
 * Formula: Price = A × (days since Genesis Block)^n
 */

export const GENESIS_DATE = new Date('2009-01-03T00:00:00Z');
const A = Math.pow(10, -16.493);
const N = 5.8;
const SUPPORT_DIVISOR = 3;
const RESISTANCE_MULTIPLIER = 3;

export interface PowerLawResult {
  fairValue: number;
  support: number;
  resistance: number;
  daysSinceGenesis: number;
}

export interface PowerLawChartPoint {
  date: string;
  year: number;
  fairValue: number;
  support: number;
  resistance: number;
}

export interface DeviationResult {
  percentage: number;
  label: 'undervalued' | 'overvalued' | 'fair';
  fairValue: number;
}

export function getDaysSinceGenesis(date: Date): number {
  const diffMs = date.getTime() - GENESIS_DATE.getTime();
  return Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function calculatePowerLawPrice(date: Date): PowerLawResult {
  const days = getDaysSinceGenesis(date);
  const fairValue = A * Math.pow(days, N);
  return {
    fairValue,
    support: fairValue / SUPPORT_DIVISOR,
    resistance: fairValue * RESISTANCE_MULTIPLIER,
    daysSinceGenesis: days,
  };
}

export function generateHistoricalCurve(startYear: number = 2009, endYear: number = 2036): PowerLawChartPoint[] {
  const points: PowerLawChartPoint[] = [];
  const startDate = new Date(`${startYear}-01-01`);
  const endDate = new Date(`${endYear}-12-31`);
  const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const step = Math.max(1, Math.floor(totalDays / 200));

  for (let d = 0; d <= totalDays; d += step) {
    const currentDate = new Date(startDate.getTime() + d * 24 * 60 * 60 * 1000);
    const { fairValue, support, resistance } = calculatePowerLawPrice(currentDate);
    points.push({
      date: currentDate.toISOString().split('T')[0],
      year: currentDate.getFullYear(),
      fairValue: Math.round(fairValue * 100) / 100,
      support: Math.round(support * 100) / 100,
      resistance: Math.round(resistance * 100) / 100,
    });
  }

  return points;
}

export function calculateDeviation(currentPrice: number, date: Date = new Date()): DeviationResult {
  const { fairValue } = calculatePowerLawPrice(date);
  const percentage = ((currentPrice - fairValue) / fairValue) * 100;

  let label: DeviationResult['label'] = 'fair';
  if (percentage < -5) label = 'undervalued';
  else if (percentage > 5) label = 'overvalued';

  return { percentage, label, fairValue };
}

export function getDaysUntilDate(targetDate: Date): number {
  const now = new Date();
  return Math.max(0, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}
