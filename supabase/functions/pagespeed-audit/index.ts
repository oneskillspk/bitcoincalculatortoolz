// Runs Google PageSpeed Insights against a list of URLs and returns a
// consolidated report with Core Web Vitals, category scores, top
// opportunities (sorted by estimated savings) and a prioritized fix plan.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const PSI_API_KEY = Deno.env.get('PageSpeed_Insights_API');
const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

type Strategy = 'mobile' | 'desktop';

interface AuditRequest {
  urls?: string[];
  strategy?: Strategy;
  categories?: string[];
}

const DEFAULT_URLS = [
  'https://bitcoincalculatortoolz.lovable.app/',
  'https://bitcoincalculatortoolz.lovable.app/calculators',
  'https://bitcoincalculatortoolz.lovable.app/calculators/dca',
  'https://bitcoincalculatortoolz.lovable.app/calculators/retirement',
  'https://bitcoincalculatortoolz.lovable.app/calculators/what-if',
];

const DEFAULT_CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

type Opportunity = {
  id: string;
  title: string;
  description: string;
  displayValue?: string;
  savingsMs?: number;
  savingsBytes?: number;
  score: number | null;
};

type PageReport = {
  url: string;
  strategy: Strategy;
  fetchedAt: string;
  scores: Record<string, number | null>;
  cwv: {
    lcp?: { value: number; displayValue: string; score: number | null };
    cls?: { value: number; displayValue: string; score: number | null };
    inp?: { value: number; displayValue: string; score: number | null };
    fcp?: { value: number; displayValue: string; score: number | null };
    tbt?: { value: number; displayValue: string; score: number | null };
    ttfb?: { value: number; displayValue: string; score: number | null };
  };
  opportunities: Opportunity[];
  diagnostics: Opportunity[];
  failingAudits: Opportunity[];
  error?: string;
};

function pickAudit(audits: any, id: string) {
  const a = audits?.[id];
  if (!a) return undefined;
  return {
    value: a.numericValue ?? 0,
    displayValue: a.displayValue ?? '',
    score: a.score,
  };
}

function extractOpportunity(audit: any): Opportunity {
  const details = audit.details ?? {};
  return {
    id: audit.id,
    title: audit.title,
    description: audit.description,
    displayValue: audit.displayValue,
    savingsMs: details.overallSavingsMs ?? undefined,
    savingsBytes: details.overallSavingsBytes ?? undefined,
    score: audit.score ?? null,
  };
}

async function runPsi(url: string, strategy: Strategy, categories: string[]): Promise<PageReport> {
  const params = new URLSearchParams({ url, strategy });
  for (const c of categories) params.append('category', c);
  if (PSI_API_KEY) params.set('key', PSI_API_KEY);

  const res = await fetch(`${PSI_ENDPOINT}?${params.toString()}`, {
    headers: { 'User-Agent': 'bitcoincalculatortoolz audit/1.0' },
  });

  const json = await res.json();

  if (!res.ok || json.error) {
    return {
      url,
      strategy,
      fetchedAt: new Date().toISOString(),
      scores: {},
      cwv: {},
      opportunities: [],
      diagnostics: [],
      failingAudits: [],
      error: json?.error?.message ?? `PSI ${res.status}`,
    };
  }

  const lh = json.lighthouseResult ?? {};
  const audits = lh.audits ?? {};
  const cats = lh.categories ?? {};

  const scores: Record<string, number | null> = {};
  for (const key of Object.keys(cats)) {
    scores[key] = cats[key]?.score ?? null;
  }

  const cwv = {
    lcp: pickAudit(audits, 'largest-contentful-paint'),
    cls: pickAudit(audits, 'cumulative-layout-shift'),
    inp: pickAudit(audits, 'interaction-to-next-paint') ?? pickAudit(audits, 'experimental-interaction-to-next-paint'),
    fcp: pickAudit(audits, 'first-contentful-paint'),
    tbt: pickAudit(audits, 'total-blocking-time'),
    ttfb: pickAudit(audits, 'server-response-time'),
  };

  const opportunities: Opportunity[] = [];
  const diagnostics: Opportunity[] = [];
  const failing: Opportunity[] = [];

  for (const id of Object.keys(audits)) {
    const a = audits[id];
    if (!a) continue;
    const kind = a.details?.type;
    const score = a.score;
    if (kind === 'opportunity' && (a.details?.overallSavingsMs ?? 0) > 0) {
      opportunities.push(extractOpportunity(a));
    } else if (a.scoreDisplayMode === 'numeric' && score !== null && score < 0.9) {
      diagnostics.push(extractOpportunity(a));
    } else if (a.scoreDisplayMode === 'binary' && score === 0) {
      failing.push(extractOpportunity(a));
    }
  }

  opportunities.sort((a, b) => (b.savingsMs ?? 0) - (a.savingsMs ?? 0));
  diagnostics.sort((a, b) => (a.score ?? 1) - (b.score ?? 1));

  return {
    url,
    strategy,
    fetchedAt: new Date().toISOString(),
    scores,
    cwv,
    opportunities: opportunities.slice(0, 12),
    diagnostics: diagnostics.slice(0, 12),
    failingAudits: failing.slice(0, 12),
  };
}

type FixPlanItem = {
  priority: 'high' | 'medium' | 'low';
  area: string;
  issue: string;
  affectedUrls: string[];
  recommendation: string;
  estimatedImpact: string;
};

function buildFixPlan(reports: PageReport[]): FixPlanItem[] {
  const bucket = new Map<string, FixPlanItem & { _savings: number }>();

  for (const r of reports) {
    if (r.error) continue;
    const all = [...r.opportunities, ...r.diagnostics, ...r.failingAudits];
    for (const o of all) {
      const existing = bucket.get(o.id);
      const savings = o.savingsMs ?? 0;
      if (existing) {
        if (!existing.affectedUrls.includes(r.url)) existing.affectedUrls.push(r.url);
        existing._savings = Math.max(existing._savings, savings);
      } else {
        const priority: FixPlanItem['priority'] =
          savings > 1000 || o.score === 0 ? 'high' : savings > 200 || (o.score ?? 1) < 0.5 ? 'medium' : 'low';
        bucket.set(o.id, {
          priority,
          area: o.id.startsWith('color') || o.id.includes('contrast')
            ? 'accessibility'
            : o.id.includes('seo') || o.id.includes('meta') || o.id.includes('robots') || o.id.includes('canonical')
            ? 'seo'
            : 'performance',
          issue: o.title,
          affectedUrls: [r.url],
          recommendation: o.description.replace(/\s*\[.+?\]\(.+?\)/g, '').trim(),
          estimatedImpact: savings ? `~${Math.round(savings)}ms potential savings` : o.displayValue ?? 'Quality improvement',
          _savings: savings,
        });
      }
    }
  }

  return Array.from(bucket.values())
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
      return b._savings - a._savings;
    })
    .slice(0, 30)
    .map(({ _savings, ...rest }) => rest);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!PSI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'PageSpeed_Insights_API secret is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    let body: AuditRequest = {};
    if (req.method === 'POST') {
      try { body = await req.json(); } catch { body = {}; }
    } else {
      const u = new URL(req.url);
      const urlsParam = u.searchParams.get('urls');
      if (urlsParam) body.urls = urlsParam.split(',').map((s) => s.trim()).filter(Boolean);
      const strat = u.searchParams.get('strategy');
      if (strat === 'mobile' || strat === 'desktop') body.strategy = strat;
    }

    const urls = (body.urls && body.urls.length ? body.urls : DEFAULT_URLS).slice(0, 10);
    const strategy: Strategy = body.strategy ?? 'mobile';
    const categories = body.categories?.length ? body.categories : DEFAULT_CATEGORIES;

    // Validate URLs
    for (const u of urls) {
      try { new URL(u); } catch {
        return new Response(JSON.stringify({ error: `Invalid URL: ${u}` }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const reports: PageReport[] = [];
    // Run sequentially to be polite to PSI quotas
    for (const url of urls) {
      const r = await runPsi(url, strategy, categories);
      reports.push(r);
    }

    const fixPlan = buildFixPlan(reports);

    const summary = {
      pagesScanned: reports.length,
      pagesWithErrors: reports.filter((r) => r.error).length,
      averageScores: ['performance', 'accessibility', 'best-practices', 'seo'].reduce((acc, cat) => {
        const vals = reports.map((r) => r.scores[cat]).filter((v): v is number => typeof v === 'number');
        acc[cat] = vals.length ? Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 100) : null;
        return acc;
      }, {} as Record<string, number | null>),
      highPriorityFixes: fixPlan.filter((f) => f.priority === 'high').length,
    };

    return new Response(
      JSON.stringify({ summary, fixPlan, reports, generatedAt: new Date().toISOString(), strategy }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
