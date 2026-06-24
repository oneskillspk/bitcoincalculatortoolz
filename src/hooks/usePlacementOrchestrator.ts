import { useEffect, useRef, useState } from "react";

/**
 * V2 Placement Orchestrator — intent-driven (not scroll/time driven).
 *
 * Replaces the old Zone1..5 scroll-depth heuristics with four slots
 * activated by user intent moments. See .lovable/plan.md.
 *
 *   SlotA  Pre-calc anchor   — !hasResult AND idle hint
 *   SlotB  Result adjacent   — fires on hasResult flip false→true
 *   SlotC  Mid-content       — long pages only, viewport+idle gated
 *   SlotD  Sticky companion  — hasResult AND not colliding with B
 *
 * Density caps + 90s post-click cooldown enforce "not too many".
 * Backwards-compat zone flags (zone1..5Active) are derived from slots
 * so legacy callers keep working during the migration.
 */

export interface PlacementState {
  // V2 — slots
  slotAActive: boolean;
  slotBActive: boolean;
  slotCActive: boolean;
  slotDActive: boolean;

  // Signals
  hasResult: boolean;
  resultJustFired: boolean;
  isMobile: boolean;
  activeSlotCount: number;
  cooldownUntil: number;

  // Back-compat (mapped from slots)
  zone1Active: boolean;
  zone2Active: boolean;
  zone3Active: boolean;
  zone4Active: boolean; // always false in V2 — no below-FAQ ads
  zone5Active: boolean;
  scrollDepth: number;
  timeOnPage: number;
  activeZoneCount: number;
}

export interface OrchestratorConfig {
  pageSlug: string;
  hasResultSignal: boolean;
  autoCalc?: boolean;
  suppressZone1?: boolean;
  suppressZone5?: boolean;
}

const FATIGUE_KEY = "aff_fatigue";
const COOLDOWN_KEY = "aff_cooldown_until";
const FLASH_GUARD_MS = 1500; // shorter than the old 3s — intent is the real gate
const IDLE_HINT_MS = 12000;
const PARTIAL_INPUT_HINT_MS = 20000;
const CLICK_COOLDOWN_MS = 90_000;

const getWindowWidth = (): number => {
  if (typeof window === "undefined") return 1280;
  return window.innerWidth;
};

const readSession = (key: string): string | null => {
  try {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

export function usePlacementOrchestrator(
  config: OrchestratorConfig
): PlacementState {
  const [pageReady, setPageReady] = useState(false);
  const [viewport, setViewport] = useState<number>(getWindowWidth);
  const [now, setNow] = useState<number>(() => Date.now());
  const [contentTall, setContentTall] = useState<boolean>(false);
  const [zone5Dismissed, setZone5Dismissed] = useState<boolean>(
    () => readSession(`zone5_dismissed_${config.pageSlug}`) === "1"
  );
  const [fatigued, setFatigued] = useState<boolean>(
    () => readSession(FATIGUE_KEY) === "1"
  );
  const [cooldownUntil, setCooldownUntil] = useState<number>(() => {
    const v = readSession(COOLDOWN_KEY);
    const n = v ? Number(v) : 0;
    return Number.isFinite(n) ? n : 0;
  });

  const startTime = useRef<number>(Date.now());
  const prevHasResult = useRef<boolean>(config.hasResultSignal);
  const resultFiredAt = useRef<number>(
    config.hasResultSignal ? Date.now() : 0
  );

  // Flash guard — short, just enough to avoid layout pop before hydration
  useEffect(() => {
    const t = setTimeout(() => setPageReady(true), FLASH_GUARD_MS);
    return () => clearTimeout(t);
  }, []);

  // Viewport tracking
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setViewport(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Wall-clock tick (1Hz) for idle-hint and cooldown evaluation
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Content-length gate — measure once page is past hydration
  useEffect(() => {
    if (typeof window === "undefined") return;
    const measure = () => {
      const h = document.documentElement.scrollHeight;
      const v = window.innerHeight || 800;
      setContentTall(h > v * 2.5);
    };
    const t = setTimeout(measure, 600);
    return () => clearTimeout(t);
  }, [config.pageSlug]);

  // Re-check dismissals on slug change
  useEffect(() => {
    setZone5Dismissed(
      readSession(`zone5_dismissed_${config.pageSlug}`) === "1"
    );
    setFatigued(readSession(FATIGUE_KEY) === "1");
  }, [config.pageSlug]);

  // Track result flip
  useEffect(() => {
    if (config.hasResultSignal && !prevHasResult.current) {
      resultFiredAt.current = Date.now();
    }
    prevHasResult.current = config.hasResultSignal;
  }, [config.hasResultSignal]);

  // Listen for the global cooldown event fired by AffiliatePlacement on click
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onClick = () => {
      const until = Date.now() + CLICK_COOLDOWN_MS;
      setCooldownUntil(until);
      try {
        sessionStorage.setItem(COOLDOWN_KEY, String(until));
      } catch {
        // ignore
      }
    };
    window.addEventListener("aff:click", onClick);
    return () => window.removeEventListener("aff:click", onClick);
  }, []);

  const isMobile = viewport < 768;
  const isTablet = viewport >= 768 && viewport < 1024;
  const hasResult = config.hasResultSignal;
  const timeOnPage = Math.floor((now - startTime.current) / 1000);
  const inCooldown = now < cooldownUntil;
  const resultJustFired =
    hasResult && now - resultFiredAt.current < 8000;

  // ── Slot A: Pre-Calc Anchor ────────────────────────────────────────
  // Fires when no result yet, page is ready, user has had time to see the
  // calculator (idle hint). Collapses the moment a result fires.
  const idleMs = now - startTime.current;
  const slotAIntent =
    !config.suppressZone1 &&
    !hasResult &&
    pageReady &&
    (idleMs >= IDLE_HINT_MS || timeOnPage >= IDLE_HINT_MS / 1000) &&
    !inCooldown;
  let slotAActive = slotAIntent;

  // ── Slot B: Result Adjacent ────────────────────────────────────────
  // Fires the instant a result lands. Exempt from cooldown (it's the
  // moment the user explicitly asked for an answer).
  let slotBActive = hasResult && pageReady;

  // ── Slot C: Mid-Content ────────────────────────────────────────────
  // Preferred: long-form pages (>2.5× viewport) where SlotC slots into
  // genuine mid-content whitespace. Fallback: short calculator pages
  // where the long-form gate never fires — in that case we still want
  // ONE mid-funnel placement, so SlotC arms once the user is clearly
  // engaged (result fired OR they've dwelled past the idle hint AND
  // the page is past hydration). Density caps + the one-shot impression
  // logger in AffiliatePlacement keep this from doubling up with B/D.
  const slotCEngaged =
    hasResult || timeOnPage >= IDLE_HINT_MS / 1000;
  let slotCActive =
    pageReady &&
    !inCooldown &&
    (contentTall || slotCEngaged);


  // ── Slot D: Sticky Companion ───────────────────────────────────────
  // Desktop right-rail / mobile bottom bar. Suppressed on tablet,
  // when dismissed, when fatigued, or when SlotB is currently visible
  // (no double-up on small screens).
  let slotDActive =
    !config.suppressZone5 &&
    !zone5Dismissed &&
    !fatigued &&
    !isTablet &&
    pageReady &&
    hasResult &&
    !inCooldown;

  // Collision: never A+B simultaneously (A always yields to B)
  if (slotBActive) slotAActive = false;

  // Collision: never B+D on mobile (D defers to B for ~30s after result)
  if (isMobile && slotBActive && resultJustFired) slotDActive = false;

  // Density caps
  const maxSlots = isMobile ? 2 : 3;
  // Priority order on mobile: B > D > A > C
  // Priority order on desktop: B > A > D > C
  const slots: Array<{ key: "A" | "B" | "C" | "D"; on: boolean; pri: number }> =
    isMobile
      ? [
          { key: "B", on: slotBActive, pri: 1 },
          { key: "D", on: slotDActive, pri: 2 },
          { key: "A", on: slotAActive, pri: 3 },
          { key: "C", on: slotCActive, pri: 4 },
        ]
      : [
          { key: "B", on: slotBActive, pri: 1 },
          { key: "A", on: slotAActive, pri: 2 },
          { key: "D", on: slotDActive, pri: 3 },
          { key: "C", on: slotCActive, pri: 4 },
        ];

  let activeCount = slots.filter((s) => s.on).length;
  if (activeCount > maxSlots) {
    // Trim lowest priority until under cap
    const sorted = [...slots].sort((a, b) => b.pri - a.pri);
    for (const s of sorted) {
      if (activeCount <= maxSlots) break;
      if (s.on) {
        s.on = false;
        activeCount--;
      }
    }
    const map = Object.fromEntries(slots.map((s) => [s.key, s.on])) as Record<
      "A" | "B" | "C" | "D",
      boolean
    >;
    slotAActive = map.A;
    slotBActive = map.B;
    slotCActive = map.C;
    slotDActive = map.D;
  }

  const activeSlotCount = [slotAActive, slotBActive, slotCActive, slotDActive]
    .filter(Boolean).length;

  return {
    slotAActive,
    slotBActive,
    slotCActive,
    slotDActive,
    hasResult,
    resultJustFired,
    isMobile,
    activeSlotCount,
    cooldownUntil,

    // Back-compat shim — Zone4 is intentionally always false
    zone1Active: slotAActive,
    zone2Active: slotBActive,
    zone3Active: slotCActive,
    zone4Active: false,
    zone5Active: slotDActive,
    scrollDepth: 0,
    timeOnPage,
    activeZoneCount: activeSlotCount,
  };
}
