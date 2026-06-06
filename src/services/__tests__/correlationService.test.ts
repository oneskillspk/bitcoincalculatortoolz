import { describe, it, expect } from 'vitest';
import { getScatterDataForAsset } from '../correlationService';

describe('correlationService', () => {
  it('getScatterDataForAsset: converts decimal returns to percentages', () => {
    const btc = [0.01, -0.02, 0.03];
    const asset = [0.005, -0.01, 0.02];
    const data = getScatterDataForAsset(btc, asset);
    expect(data).toEqual([
      { btcReturn: 1, assetReturn: 0.5 },
      { btcReturn: -2, assetReturn: -1 },
      { btcReturn: 3, assetReturn: 2 },
    ]);
  });

  it('missing asset returns coerce to 0', () => {
    const data = getScatterDataForAsset([0.1, 0.2], []);
    expect(data[0].assetReturn).toBe(0);
    expect(data[1].assetReturn).toBe(0);
  });
});
