import { describe, it, expect } from "vitest";
import { PANEL_CUTOUTS, getPanelCutout } from "../panelCutouts";

describe("panelCutouts", () => {
  it("returns null for partners without a cutout", () => {
    expect(getPanelCutout("koinly")).toBeNull();
  });

  it("returns a cutout for produced partners", () => {
    const c = getPanelCutout("ledger");
    expect(c).not.toBeNull();
    expect(c!.src).toBeTruthy();
    expect(c!.source).toBe("native");
  });

  it("every cutout has sane dimensions and scale", () => {
    for (const [id, c] of Object.entries(PANEL_CUTOUTS)) {
      expect(c.width, id).toBeGreaterThan(0);
      expect(c.height, id).toBeGreaterThan(0);
      expect(c.scale, id).toBeGreaterThan(0.4);
      expect(c.scale, id).toBeLessThanOrEqual(1);
    }
  });

  it("no two partners share the same cutout asset", () => {
    const srcs = Object.values(PANEL_CUTOUTS).map((c) => c.src);
    expect(new Set(srcs).size).toBe(srcs.length);
  });
});
