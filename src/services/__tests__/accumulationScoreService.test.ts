import { describe, it, expect } from 'vitest';
import {
  getBtcTarget,
  getAccumulationGrade,
  getLifePhase,
  getAccumulationResult,
  getDcaCatchUp,
  generateBellCurveData,
} from '../accumulationScoreService';

describe('accumulationScoreService', () => {
  it('getBtcTarget: exact table lookup at age 25 = 2.4451', () => {
    expect(getBtcTarget(25)).toBeCloseTo(2.4451, 4);
  });

  it('getBtcTarget: clamps ages below 13 and above 83 to bounds', () => {
    expect(getBtcTarget(10)).toBe(getBtcTarget(13));
    expect(getBtcTarget(99)).toBe(getBtcTarget(83));
  });

  it('getBtcTarget: peak target near age 40', () => {
    expect(getBtcTarget(40)).toBeGreaterThan(getBtcTarget(30));
    expect(getBtcTarget(40)).toBeGreaterThan(getBtcTarget(50));
  });

  it('getAccumulationGrade: ratio ≥ 1.5 → A+', () => {
    expect(getAccumulationGrade(1, 2).grade).toBe('A+');
  });

  it('getAccumulationGrade: ratio between 0.9 and 1.1 → B+ (on track)', () => {
    expect(getAccumulationGrade(10, 10).grade).toBe('B+');
  });

  it('getAccumulationGrade: ratio = 0 → F', () => {
    expect(getAccumulationGrade(10, 0).grade).toBe('F');
  });

  it('getLifePhase boundaries', () => {
    expect(getLifePhase(17).name).toBe('Teenager');
    expect(getLifePhase(22).name).toBe('Young Adult');
    expect(getLifePhase(27).name).toBe('Prime Accumulator');
    expect(getLifePhase(40).name).toBe('Peak Builder');
    expect(getLifePhase(44).name).toBe('Transition');
    expect(getLifePhase(59).name).toBe('Enjoy Phase');
    expect(getLifePhase(74).name).toBe('Retirement');
    expect(getLifePhase(80).name).toBe('Legacy');
  });

  it('getAccumulationResult: gap = max(0, target - holdings)', () => {
    const r = getAccumulationResult(25, 1);
    expect(r.gap).toBeCloseTo(getBtcTarget(25) - 1, 6);
    const surplus = getAccumulationResult(25, 100);
    expect(surplus.gap).toBe(0);
  });

  it('getDcaCatchUp: gap=1 BTC, $100k, 10 months → $10,000/mo', () => {
    expect(getDcaCatchUp(1, 100_000, 10)).toBe(10_000);
  });

  it('getDcaCatchUp: guards zero/negative inputs', () => {
    expect(getDcaCatchUp(0, 100_000, 10)).toBe(0);
    expect(getDcaCatchUp(1, 0, 10)).toBe(0);
    expect(getDcaCatchUp(1, 100_000, 0)).toBe(0);
  });

  it('generateBellCurveData covers ages 13–83 inclusive', () => {
    const data = generateBellCurveData();
    expect(data).toHaveLength(83 - 13 + 1);
    expect(data[0].age).toBe(13);
    expect(data.at(-1)!.age).toBe(83);
  });
});
