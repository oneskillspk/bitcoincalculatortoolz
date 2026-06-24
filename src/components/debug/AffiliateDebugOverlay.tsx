import { useEffect, useState } from "react";

/**
 * Temporary debug overlay for affiliate / slot regions.
 *
 * Activation (any one of):
 *   • URL query  ?debugAds=1
 *   • localStorage.setItem('debug_ads','1')
 *   • window.__DEBUG_ADS__ = true
 *
 * Behaviour:
 *   Every 500ms it walks the DOM for known affiliate / slot selectors,
 *   outlines each one in a bright color, and pins a label badge with
 *   the detected placement metadata (zone, slug, format, dimensions).
 *   A fixed legend in the top-right shows the running totals so a
 *   route with zero visible ads is instantly obvious.
 *
 * Renders nothing in production unless explicitly enabled — safe to
 * mount unconditionally at the app root.
 */

interface TaggedRegion {
  el: HTMLElement;
  kind: string;
  label: string;
  color: string;
}

const SELECTORS: Array<{ sel: string; kind: string; color: string }> = [
  { sel: "[data-affiliate-placement]", kind: "AFFILIATE", color: "#22c55e" },
  { sel: "[data-slot-d-collision]", kind: "SLOT-D-COLLISION", color: "#f97316" },
  { sel: '[role="complementary"][aria-label="Sponsored offer"]', kind: "SLOT-D", color: "#3b82f6" },
  { sel: '[role="complementary"][aria-label="Sponsored partner"]', kind: "PARTNER-BAND", color: "#a855f7" },
  { sel: '[data-affiliate-state="loading"]', kind: "AFFILIATE-LOADING", color: "#eab308" },
];

const OUTLINE_ATTR = "data-debug-ads-outlined";
const LABEL_ATTR = "data-debug-ads-label-for";

function isActive(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if ((window as unknown as { __DEBUG_ADS__?: boolean }).__DEBUG_ADS__) return true;
    if (new URLSearchParams(window.location.search).get("debugAds") === "1") return true;
    if (localStorage.getItem("debug_ads") === "1") return true;
  } catch {
    /* ignore */
  }
  return false;
}

export const AffiliateDebugOverlay = () => {
  const [active, setActive] = useState<boolean>(() => isActive());
  const [regions, setRegions] = useState<TaggedRegion[]>([]);

  // Persist activation via query param so it survives the next nav.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("debugAds") === "1") {
      try {
        localStorage.setItem("debug_ads", "1");
      } catch {
        /* ignore */
      }
      setActive(true);
    }
  }, []);

  useEffect(() => {
    if (!active || typeof document === "undefined") return;

    const tick = () => {
      const next: TaggedRegion[] = [];
      const seen = new Set<HTMLElement>();

      for (const { sel, kind, color } of SELECTORS) {
        document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);
          const zone = el.getAttribute("data-affiliate-placement") || el.getAttribute("data-affiliate-zone");
          const slug = el.getAttribute("data-affiliate-slug");
          const fmt = el.getAttribute("data-affiliate-format");
          const r = el.getBoundingClientRect();
          const dims = `${Math.round(r.width)}×${Math.round(r.height)}`;
          const meta = [zone, slug, fmt].filter(Boolean).join(" · ");
          const label = `${kind}${meta ? ` [${meta}]` : ""} ${dims}`;
          next.push({ el, kind, label, color });

          el.style.outline = `2px dashed ${color}`;
          el.style.outlineOffset = "-2px";
          el.setAttribute(OUTLINE_ATTR, kind);
        });
      }

      // Remove labels whose anchors disappeared.
      document.querySelectorAll<HTMLElement>(`[${LABEL_ATTR}]`).forEach((badge) => {
        const id = badge.getAttribute(LABEL_ATTR)!;
        if (!next.some((r) => r.el.getAttribute(OUTLINE_ATTR) + ":" + r.label === id)) {
          badge.remove();
        }
      });

      setRegions(next);
    };

    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [active]);

  if (!active) return null;

  return (
    <>
      {/* Floating per-region labels (rendered as fixed badges next to each region). */}
      {regions.map((r, i) => {
        const rect = r.el.getBoundingClientRect();
        return (
          <div
            key={i}
            style={{
              position: "fixed",
              top: Math.max(2, rect.top + 2),
              left: Math.max(2, rect.left + 2),
              zIndex: 2147483646,
              background: r.color,
              color: "#000",
              font: "600 10px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace",
              padding: "2px 6px",
              borderRadius: 3,
              pointerEvents: "none",
              maxWidth: Math.max(120, rect.width - 4),
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            {r.label}
          </div>
        );
      })}

      {/* Fixed legend / totals panel. */}
      <div
        style={{
          position: "fixed",
          top: 8,
          right: 8,
          zIndex: 2147483647,
          background: "rgba(15,23,42,0.95)",
          color: "#e5e7eb",
          font: "600 11px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace",
          padding: "8px 10px",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          maxWidth: 280,
          pointerEvents: "auto",
        }}
      >
        <div style={{ marginBottom: 6, color: "#fbbf24" }}>
          AFFILIATE DEBUG · {regions.length} region{regions.length === 1 ? "" : "s"}
        </div>
        {SELECTORS.map(({ kind, color }) => {
          const n = regions.filter((r) => r.kind === kind).length;
          return (
            <div key={kind} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  background: color,
                  borderRadius: 2,
                }}
              />
              <span style={{ flex: 1 }}>{kind}</span>
              <span style={{ color: n === 0 ? "#ef4444" : "#22c55e" }}>{n}</span>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.removeItem("debug_ads");
            } catch {
              /* ignore */
            }
            const u = new URL(window.location.href);
            u.searchParams.delete("debugAds");
            window.location.replace(u.toString());
          }}
          style={{
            marginTop: 8,
            width: "100%",
            background: "#374151",
            color: "#e5e7eb",
            border: "none",
            borderRadius: 4,
            padding: "4px 6px",
            font: "inherit",
            cursor: "pointer",
          }}
        >
          disable overlay
        </button>
      </div>
    </>
  );
};

export default AffiliateDebugOverlay;
