// Age-to-BTC target lookup table from the Bitcoin Lifecycle Accumulation Model
// Based on Power Law appreciation curve × lifecycle income bell curve
const AGE_BTC_TARGETS: Record<number, number> = {
  13: 0.0014, 14: 0.0034, 15: 0.0068, 16: 0.0204, 17: 0.0476,
  18: 0.102, 19: 0.2039, 20: 0.3398, 21: 0.5437, 22: 0.8156,
  23: 1.2234, 24: 1.7662, 25: 2.4451, 26: 3.3973, 27: 4.7562,
  28: 6.7932, 29: 9.5124, 30: 13.5864, 31: 17.6604, 32: 23.1067,
  33: 29.9009, 34: 38.043, 35: 47.5562, 36: 59.785, 37: 74.7454,
  38: 93.7367, 39: 116.858, 40: 144.0404,
  41: 142.6877, 42: 141.335, 43: 139.98, 44: 137.94,
  45: 135.8902, 46: 133.2, 47: 130.5, 48: 127.8, 49: 125.05,
  50: 122.2942, 51: 119.0, 52: 115.7, 53: 112.4, 54: 109.0,
  55: 105.5697, 56: 102.0, 57: 98.5, 58: 95.0, 59: 91.8,
  60: 88.6453, 61: 84.5, 62: 80.3, 63: 76.1, 64: 71.5,
  65: 66.8186, 66: 62.5, 67: 58.1, 68: 53.8, 69: 49.4,
  70: 44.992, 71: 40.5, 72: 36.0, 73: 31.6, 74: 27.4,
  75: 23.1653, 76: 19.8, 77: 16.4, 78: 13.1, 79: 9.9,
  80: 6.7932, 81: 4.1, 82: 2.2, 83: 0.6793,
};

export interface AccumulationGrade {
  grade: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  emoji: string;
}

export interface AccumulationResult {
  targetBtc: number;
  grade: AccumulationGrade;
  ratio: number;
  gap: number;
  phase: LifePhase;
  percentile: number;
}

export interface LifePhase {
  name: string;
  description: string;
  color: string;
}

export const getBtcTarget = (age: number): number => {
  const clampedAge = Math.max(13, Math.min(83, Math.round(age)));
  if (AGE_BTC_TARGETS[clampedAge] !== undefined) {
    return AGE_BTC_TARGETS[clampedAge];
  }
  // Interpolate between known points
  const ages = Object.keys(AGE_BTC_TARGETS).map(Number).sort((a, b) => a - b);
  let lower = ages[0], upper = ages[ages.length - 1];
  for (let i = 0; i < ages.length - 1; i++) {
    if (ages[i] <= clampedAge && ages[i + 1] >= clampedAge) {
      lower = ages[i];
      upper = ages[i + 1];
      break;
    }
  }
  const t = upper === lower ? 0 : (clampedAge - lower) / (upper - lower);
  return AGE_BTC_TARGETS[lower] + t * (AGE_BTC_TARGETS[upper] - AGE_BTC_TARGETS[lower]);
};

const GRADES: { minRatio: number; grade: AccumulationGrade }[] = [
  { minRatio: 1.5, grade: { grade: 'A+', label: 'Elite Accumulator', color: 'text-success', bgColor: 'bg-success/10', borderColor: 'border-success/30', emoji: '🏆' } },
  { minRatio: 1.1, grade: { grade: 'A', label: 'Ahead of Schedule', color: 'text-success', bgColor: 'bg-success/10', borderColor: 'border-success/30', emoji: '🌟' } },
  { minRatio: 0.9, grade: { grade: 'B+', label: 'On Track', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', emoji: '✅' } },
  { minRatio: 0.75, grade: { grade: 'B', label: 'Almost There', color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', emoji: '👍' } },
  { minRatio: 0.5, grade: { grade: 'C', label: 'Room to Grow', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30', emoji: '📈' } },
  { minRatio: 0.25, grade: { grade: 'D', label: 'Getting Started', color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30', emoji: '⚡' } },
  { minRatio: 0, grade: { grade: 'F', label: 'Start Stacking!', color: 'text-destructive', bgColor: 'bg-destructive/10', borderColor: 'border-destructive/30', emoji: '🚀' } },
];

export const getAccumulationGrade = (target: number, holdings: number): AccumulationGrade => {
  if (target === 0) return GRADES[0].grade;
  const ratio = holdings / target;
  for (const g of GRADES) {
    if (ratio >= g.minRatio) return g.grade;
  }
  return GRADES[GRADES.length - 1].grade;
};

export const getLifePhase = (age: number): LifePhase => {
  if (age <= 17) return { name: 'Teenager', description: 'Early awareness — every sat counts', color: 'text-violet-400' };
  if (age <= 22) return { name: 'Young Adult', description: 'Maximum time advantage — compound growth starts here', color: 'text-blue-400' };
  if (age <= 27) return { name: 'Prime Accumulator', description: 'Career income growing — prime stacking years', color: 'text-success' };
  if (age <= 40) return { name: 'Peak Builder', description: 'Maximum earning power — accelerate accumulation', color: 'text-primary' };
  if (age <= 44) return { name: 'Transition', description: 'Shifting from accumulation to preservation', color: 'text-amber-400' };
  if (age <= 59) return { name: 'Enjoy Phase', description: 'Lifestyle spending with strategic drawdown', color: 'text-orange-400' };
  if (age <= 74) return { name: 'Retirement', description: 'Living on your Bitcoin stack', color: 'text-rose-400' };
  return { name: 'Legacy', description: 'Inheritance planning and wealth transfer', color: 'text-muted-foreground' };
};

export const getAccumulationResult = (age: number, holdings: number): AccumulationResult => {
  const targetBtc = getBtcTarget(age);
  const grade = getAccumulationGrade(targetBtc, holdings);
  const ratio = targetBtc > 0 ? holdings / targetBtc : 0;
  const gap = Math.max(0, targetBtc - holdings);
  const phase = getLifePhase(age);
  const percentile = Math.min(100, Math.round(ratio * 100));
  return { targetBtc, grade, ratio, gap, phase, percentile };
};

export const getDcaCatchUp = (gapBtc: number, btcPrice: number, months: number): number => {
  if (gapBtc <= 0 || months <= 0 || btcPrice <= 0) return 0;
  return (gapBtc * btcPrice) / months;
};

export interface BellCurvePoint {
  age: number;
  target: number;
  phase: string;
}

export const generateBellCurveData = (): BellCurvePoint[] => {
  const data: BellCurvePoint[] = [];
  for (let age = 13; age <= 83; age++) {
    data.push({
      age,
      target: getBtcTarget(age),
      phase: getLifePhase(age).name,
    });
  }
  return data;
};

// Static benchmark data for SEO table
export const BENCHMARK_TABLE_DATA = [
  { age: 18, btc: 0.102, phase: 'Young Adult' },
  { age: 20, btc: 0.3398, phase: 'Young Adult' },
  { age: 25, btc: 2.4451, phase: 'Prime Accumulator' },
  { age: 28, btc: 6.7932, phase: 'Peak Builder' },
  { age: 30, btc: 13.5864, phase: 'Peak Builder' },
  { age: 35, btc: 47.5562, phase: 'Peak Builder' },
  { age: 40, btc: 144.0404, phase: 'Peak (Maximum)' },
  { age: 45, btc: 135.8902, phase: 'Enjoy Phase' },
  { age: 50, btc: 122.2942, phase: 'Enjoy Phase' },
  { age: 55, btc: 105.5697, phase: 'Enjoy Phase' },
  { age: 60, btc: 88.6453, phase: 'Enjoy Phase' },
  { age: 65, btc: 66.8186, phase: 'Retirement' },
  { age: 70, btc: 44.992, phase: 'Retirement' },
  { age: 75, btc: 23.1653, phase: 'Legacy' },
];
