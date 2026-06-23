import { useEffect, useRef, useState } from "react";

export interface PlacementState {
  zone1Active: boolean; // Pre-calculator slim banner
  zone2Active: boolean; // Post-result spotlight (GOLD ZONE)
  zone3Active: boolean; // Content gap intelligence
  zone4Active: boolean; // Pre-FAQ checkpoint
  zone5Active: boolean; // Sticky sidebar (desktop) / bottom bar (mobile)
  hasResult: boolean;
  scrollDepth: number;
  timeOnPage: number;
  isMobile: boolean;
  activeZoneCount: number;
}

export interface OrchestratorConfig {
  pageSlug: string;
  hasResultSignal: boolean;
  autoCalc?: boolean;
  suppressZone1?: boolean;
  suppressZone5?: boolean;
}

const getWindowWidth = (): number => {
  if (typeof window === "undefined") return 1280;
  return window.innerWidth;
};

export function usePlacementOrchestrator(
  config: OrchestratorConfig
): PlacementState {
  const [scrollDepth, setScrollDepth] = useState(0);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [zone5Dismissed, setZone5Dismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return (
        sessionStorage.getItem(`zone5_dismissed_${config.pageSlug}`) === "1"
      );
    } catch {
      return false;
    }
  });
  const [pageReady, setPageReady] = useState(false);
  const [viewport, setViewport] = useState<number>(getWindowWidth);
  const startTime = useRef<number>(Date.now());

  // 3-second global flash guard (Task 6 §5)
  useEffect(() => {
    const t = setTimeout(() => setPageReady(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // Viewport tracking (mobile/tablet detection)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setViewport(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Scroll depth
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      const el = document.documentElement;
      const denom = el.scrollHeight - el.clientHeight;
      if (denom <= 0) return;
      const depth = Math.round((el.scrollTop / denom) * 100);
      setScrollDepth(Math.max(0, Math.min(100, depth)));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Time on page
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnPage(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Re-check sessionStorage on slug change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setZone5Dismissed(
        sessionStorage.getItem(`zone5_dismissed_${config.pageSlug}`) === "1"
      );
    } catch {
      // ignore
    }
  }, [config.pageSlug]);

  const isMobile = viewport < 768;
  const isTablet = viewport >= 768 && viewport < 1024;
  const maxZones = isMobile ? 2 : 3;
  const hasResult = config.hasResultSignal;

  // Zone 1 — pre-calculator slim banner
  let zone1Active =
    !config.suppressZone1 &&
    !hasResult &&
    (config.autoCalc ? timeOnPage < 8 : true);
  // Apply 3s flash guard (Zone 2 is exempt per spec)
  zone1Active = zone1Active && pageReady;

  // Zone 2 — gold zone
  const zone2Active = hasResult;

  // Zone 3 — content gap
  let zone3Active =
    scrollDepth >= 45 &&
    (hasResult || timeOnPage > 30) &&
    (isMobile ? true : zone2Active);
  zone3Active = zone3Active && pageReady;

  // Zone 4 — pre-FAQ
  let zone4Active =
    scrollDepth >= 65 && (hasResult || timeOnPage > 60);
  zone4Active = zone4Active && pageReady;

  // Zone 5 — sticky companion (suppressed on tablet)
  let zone5Active =
    !config.suppressZone5 &&
    !zone5Dismissed &&
    (hasResult || (isMobile && timeOnPage >= 45)) &&
    !isTablet;
  zone5Active = zone5Active && pageReady;

  // Frequency caps
  const initialActive = [
    zone1Active,
    zone2Active,
    zone3Active,
    zone4Active,
    zone5Active,
  ];
  const activeCount = initialActive.filter(Boolean).length;

  let finalZone1 = zone1Active;
  let finalZone3 = zone3Active;
  let finalZone5 = zone5Active;

  if (activeCount > maxZones) {
    if (isMobile) {
      // Mobile: Zone2 + Zone4 are primary
      finalZone5 = false;
      finalZone3 = false;
      finalZone1 = false;
    } else {
      finalZone1 = false;
      const recount = [
        finalZone1,
        zone2Active,
        finalZone3,
        zone4Active,
        finalZone5,
      ].filter(Boolean).length;
      if (recount > maxZones) {
        finalZone5 = false;
      }
    }
  }

  const activeZoneCount = [
    finalZone1,
    zone2Active,
    finalZone3,
    zone4Active,
    finalZone5,
  ].filter(Boolean).length;

  return {
    zone1Active: finalZone1,
    zone2Active,
    zone3Active: finalZone3,
    zone4Active,
    zone5Active: finalZone5,
    hasResult,
    scrollDepth,
    timeOnPage,
    isMobile,
    activeZoneCount,
  };
}
