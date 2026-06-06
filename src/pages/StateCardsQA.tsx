import { Helmet } from 'react-helmet-async';
import { TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import {
  StateCard,
  StateValue,
  StateLabel,
  StateCaption,
} from '@/components/ui/state-card';

/**
 * QA page for the StateCard primitive and tone tokens.
 * Renders every tone side-by-side in light and dark mode so we can
 * eyeball WCAG contrast on tinted backgrounds.
 *
 * Route: /qa/state-cards
 */
const Block = ({ theme }: { theme: 'light' | 'dark' }) => (
  <div className={`${theme} bg-background text-foreground rounded-2xl border border-border/40 p-6 space-y-6`}>
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">{theme === 'light' ? 'Light mode' : 'Dark mode'}</h2>
      <span className="text-xs text-muted-foreground uppercase tracking-wider">tone preview</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StateCard tone="success" icon={TrendingUp} title="Best Entry Date">
        <StateLabel>Mar 12, 2020</StateLabel>
        <StateValue tone="success">+1,842.5% ROI</StateValue>
        <StateCaption>$18,425 current value</StateCaption>
      </StateCard>
      <StateCard tone="destructive" icon={TrendingDown} title="Worst Entry Date">
        <StateLabel>Nov 8, 2021</StateLabel>
        <StateValue tone="destructive">-42.3% ROI</StateValue>
        <StateCaption>$577 current value</StateCaption>
      </StateCard>
      <StateCard tone="warning" icon={AlertTriangle} title="High Volatility">
        <StateLabel>Last 30 days</StateLabel>
        <StateValue tone="warning">±18.4%</StateValue>
        <StateCaption>Above 90-day average</StateCaption>
      </StateCard>
      <StateCard tone="neutral" icon={Info} title="Neutral Stat">
        <StateLabel>Average ROI</StateLabel>
        <StateValue>+12.6%</StateValue>
        <StateCaption>Across all entries</StateCaption>
      </StateCard>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: 'Avg ROI', value: '+12.6%', tone: 'success' as const },
        { label: 'Best ROI', value: '+1,842.5%', tone: 'success' as const },
        { label: 'Worst ROI', value: '-42.3%', tone: 'destructive' as const },
        { label: 'Data Points', value: '247', tone: 'neutral' as const },
      ].map(s => (
        <div key={s.label} className="text-center p-3 bg-muted/40 rounded-lg border border-border/40">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</div>
          <StateValue tone={s.tone} className="mt-1">{s.value}</StateValue>
        </div>
      ))}
    </div>

    <div className="space-y-2">
      <p className="text-sm text-foreground/80">Primary label (foreground/80)</p>
      <p className="text-sm text-muted-foreground">Secondary caption (muted-foreground)</p>
      <p className="text-success font-semibold">Inline success text on background</p>
      <p className="text-destructive font-semibold">Inline destructive text on background</p>
      <p className="text-warning font-semibold">Inline warning text on background</p>
    </div>
  </div>
);

const StateCardsQA = () => (
  <>
    <Helmet>
      <title>State Cards QA</title>
      <meta name="robots" content="noindex,nofollow" />
    </Helmet>
    <main className="container mx-auto px-6 py-12 max-w-6xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-h1 font-bold">State Card Contrast QA</h1>
        <p className="text-muted-foreground">
          Visual reference for the unified success / destructive / warning / neutral tones.
          Each block forces its own theme scope so we can spot fade or low-contrast regressions.
        </p>
      </header>
      <Block theme="light" />
      <Block theme="dark" />
    </main>
  </>
);

export default StateCardsQA;
