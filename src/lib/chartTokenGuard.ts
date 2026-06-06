/**
 * Dev-only runtime guard: warns in the browser console when a Recharts
 * <Tooltip>/<Legend> mounts in the DOM with inline styles instead of the
 * shared chartTokens. Pairs with `scripts/audit-chart-tokens.ts` (static).
 *
 * Activated by importing this file once from `src/main.tsx` (no-op in prod).
 */

import { chartTooltipStyle, chartLegendStyle } from '@/components/calculator/chartTokens';

const TOOLTIP_BG = chartTooltipStyle.backgroundColor;
const LEGEND_PADDING = chartLegendStyle.paddingTop;

export function installChartTokenGuard(): void {
  if (!import.meta.env.DEV || typeof window === 'undefined') return;

  const seen = new WeakSet<Element>();

  const audit = () => {
    document.querySelectorAll<HTMLElement>('.recharts-tooltip-wrapper > *').forEach(el => {
      if (seen.has(el)) return;
      seen.add(el);
      const bg = el.style.backgroundColor;
      if (bg && bg !== TOOLTIP_BG) {
        // eslint-disable-next-line no-console
        console.warn(
          '[chart-tokens] Tooltip uses non-token background:',
          bg,
          el,
          '→ use contentStyle={chartTooltipStyle}',
        );
      }
    });
    document.querySelectorAll<HTMLElement>('.recharts-legend-wrapper').forEach(el => {
      if (seen.has(el)) return;
      seen.add(el);
      const pt = el.style.paddingTop;
      if (pt && pt !== LEGEND_PADDING) {
        // eslint-disable-next-line no-console
        console.warn(
          '[chart-tokens] Legend uses non-token padding:',
          pt,
          el,
          '→ use wrapperStyle={chartLegendStyle}',
        );
      }
    });
  };

  const mo = new MutationObserver(() => audit());
  mo.observe(document.body, { childList: true, subtree: true });
  // Initial sweep after first paint.
  requestAnimationFrame(audit);
}
