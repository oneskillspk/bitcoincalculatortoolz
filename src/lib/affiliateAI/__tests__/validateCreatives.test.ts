import { describe, it, expect } from "vitest";
import { AFFILIATES } from "@/config/affiliates.config";
import { validateCreatives } from "../validateCreatives";
import type { AffiliateProgram } from "../types";

describe("validateCreatives", () => {
  it("passes for every configured Coinbase creative", () => {
    const coinbase = AFFILIATES.find((a) => a.id === "coinbase")!;
    expect(coinbase).toBeDefined();
    expect(validateCreatives([coinbase])).toEqual([]);
  });

  it("passes for the full registry as shipped", () => {
    expect(validateCreatives(AFFILIATES)).toEqual([]);
  });

  it("fails when size label disagrees with width/height", () => {
    const bad: AffiliateProgram = {
      ...(AFFILIATES.find((a) => a.id === "coinbase")!),
      id: "bad",
      creatives: [
        { size: "300x250", width: 728, height: 90, image_url: "x", alt: "x" },
      ],
    };
    const errs = validateCreatives([bad]);
    expect(errs).toHaveLength(1);
    expect(errs[0].reason).toMatch(/does not match/);
  });

  it("fails on malformed size labels", () => {
    const bad: AffiliateProgram = {
      ...(AFFILIATES.find((a) => a.id === "coinbase")!),
      id: "bad2",
      creatives: [
        // @ts-expect-error intentional bad label
        { size: "leaderboard", width: 728, height: 90, image_url: "x", alt: "x" },
      ],
    };
    const errs = validateCreatives([bad]);
    expect(errs[0].reason).toMatch(/Invalid size label/);
  });
});
