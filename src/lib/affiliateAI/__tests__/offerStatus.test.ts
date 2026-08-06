import { describe, it, expect } from "vitest";
import { getOfferStatus, shortBadge } from "@/lib/affiliateAI/offerStatus";

const now = new Date("2026-08-06T10:00:00Z");

describe("getOfferStatus", () => {
  it("treats a partner with no dates as evergreen ongoing (green)", () => {
    const s = getOfferStatus(null, null, "en", now);
    expect(s.state).toBe("ongoing");
    expect(s.label).toBe("Ongoing");
    expect(s.tone).toBe("success");
    expect(s.showBadge).toBe(true);
  });

  it("is ongoing inside a wide window", () => {
    const s = getOfferStatus("2026-01-01", "2026-12-31", "en", now);
    expect(s.state).toBe("ongoing");
    expect(s.tone).toBe("success");
  });

  it("warns when the offer ends within 14 days", () => {
    const s = getOfferStatus(null, "2026-08-12", "en", now);
    expect(s.state).toBe("ending-soon");
    expect(s.tone).toBe("warning");
    expect(s.label).toContain("Ends");
  });

  it("hides the pill and suppresses the badge once expired", () => {
    const s = getOfferStatus(null, "2026-07-01", "en", now);
    expect(s.state).toBe("expired");
    expect(s.label).toBeNull();
    expect(s.showBadge).toBe(false);
  });

  it("hides the pill before the offer starts", () => {
    const s = getOfferStatus("2026-09-01", null, "en", now);
    expect(s.state).toBe("upcoming");
    expect(s.label).toBeNull();
  });

  it("localizes the ongoing label", () => {
    expect(getOfferStatus(null, null, "tr", now).label).toBe("Devam ediyor");
  });
});

describe("shortBadge", () => {
  it("keeps only the first emphasis token", () => {
    expect(shortBadge("Up to $30,000 bonus • MT4")).toBe("Up to $30,000 bonus");
  });
  it("truncates very long tokens", () => {
    expect(shortBadge("8,000 USDT Beginner Reward Package")?.length).toBeLessThanOrEqual(21);
  });
  it("returns null for empty badges", () => {
    expect(shortBadge(null)).toBeNull();
  });
});
