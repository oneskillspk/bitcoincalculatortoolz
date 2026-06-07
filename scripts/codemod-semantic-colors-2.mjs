#!/usr/bin/env node
/**
 * Round 2 follow-up: extend semantic codemod to blue/sky/cyan/indigo (-> info)
 * and orange (-> warning).
 *
 * Files in SKIP use the full palette as data/category tints (charts, category
 * cards) and must be preserved verbatim.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('src');
const SKIP = new Set([
  // multi-color category / chart palettes (intentional)
  'src/components/RelatedCalculators.tsx',
  'src/services/purchasingPowerCalculator.ts',
  'src/services/accumulationScoreService.ts',
  'src/services/assetComparisonService.ts',
  'src/services/onChainMetricsService.ts',
  'src/services/fearGreedService.ts',
  'src/components/lightning/RouteFinderVisualization.tsx',
  'src/components/lightning/FeeEconomicsVisualization.tsx',
  'src/components/leverage/RiskRewardVisualization.tsx',
  'src/components/leverage/LiquidationPriceChart.tsx',
  'src/components/halving/HalvingProjection.tsx',
  'src/components/halving/SupplyDashboard.tsx',
  'src/components/halving/HalvingCountdownTimer.tsx',
  'src/components/portfolio/PortfolioAllocationChart.tsx',
  'src/components/lumpsum-dca/StrategyComparison.tsx',
  'src/components/lumpsum-dca/ComparisonResultsPanel.tsx',
  'src/components/modern/ModernPurchaseComparison.tsx',
  'src/components/modern/ModernDCAChart.tsx',
  'src/components/modern/UltraModernAssetComparison.tsx',
  'src/components/advanced/RiskAnalysisPanel.tsx',
  'src/components/advanced/ProfessionalResults.tsx',
  'src/components/optimized/MemoizedProfessionalResults.tsx',
  'src/components/PurchaseComparison.tsx',
  'src/components/obituaries/ObituariesTimeline.tsx',
  'src/components/comparison/ProgressBar.tsx',
  'src/components/InvestmentChart.tsx',
  'src/lib/chartTokenGuard.ts',
  'src/lib/brandColors.ts',
  // exporters paint their own theme; Round 3 collapses these
  'src/components/retirement/RetirementExportReport.tsx',
  'src/components/leverage/LeverageExportReport.tsx',
  'src/components/profit-loss/ProfitLossExportReport.tsx',
  'src/components/average-buy-price/AvgBuyExportReport.tsx',
  'src/components/pizzaday/PizzaExportReport.tsx',
  'src/components/transaction-fees/FeeExportReport.tsx',
  'src/components/mining/MiningExportReport.tsx',
]);

const RULES = [
  // info (blue / sky / cyan / indigo)
  [/\bbg-(blue|sky|cyan|indigo)-(50|100)\b/g, 'bg-info-soft'],
  [/\bbg-(blue|sky|cyan|indigo)-(500|600|700)\/(\d{1,2})\b/g, 'bg-info/$3'],
  [/\bborder-(blue|sky|cyan|indigo)-(100|200|300)\b/g, 'border-info/30'],
  [/\bborder-(blue|sky|cyan|indigo)-(400|500|600|700)\b/g, 'border-info'],
  [/\btext-(blue|sky|cyan|indigo)-(50|100|200|300|400|500)\b/g, 'text-info'],
  [/\btext-(blue|sky|cyan|indigo)-(600|700|800|900)\b/g, 'text-info'],
  [/\bring-(blue|sky|cyan|indigo)-(400|500|600)\b/g, 'ring-info'],
  [/\bfill-(blue|sky|cyan|indigo)-(400|500|600)\b/g, 'fill-info'],

  // orange folds into warning
  [/\bbg-orange-(50|100)\b/g, 'bg-warning-soft'],
  [/\bbg-orange-(500|600|700)\/(\d{1,2})\b/g, 'bg-warning/$2'],
  [/\bborder-orange-(100|200|300)\b/g, 'border-warning/30'],
  [/\bborder-orange-(400|500|600|700)\b/g, 'border-warning'],
  [/\btext-orange-(50|100|200|300|400|500)\b/g, 'text-warning'],
  [/\btext-orange-(600|700|800|900)\b/g, 'text-warning'],
];

const exts = new Set(['.ts', '.tsx']);
let changed = 0; let touched = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules','__tests__','test'].includes(e.name)) continue;
      walk(p); continue;
    }
    if (!exts.has(path.extname(e.name))) continue;
    const rel = path.relative('.', p);
    if (SKIP.has(rel)) continue;
    const src = fs.readFileSync(p, 'utf8');
    let out = src, hits = 0;
    for (const [re, repl] of RULES) {
      out = out.replace(re, (...a) => { hits++; return typeof repl === 'function' ? repl(...a) : repl; });
    }
    if (out !== src) { fs.writeFileSync(p, out); changed += hits; touched.push(`${rel}  (${hits})`); }
  }
}
walk(ROOT);
console.log(`Replacements: ${changed}. Files touched: ${touched.length}`);
for (const t of touched) console.log('  ' + t);
