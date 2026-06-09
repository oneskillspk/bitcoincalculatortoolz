import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, AlertTriangle, CheckCircle2, Gauge, Eye, ShieldCheck, Search } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_URLS = [
  "https://bitcoincalculatortoolz.lovable.app/",
  "https://bitcoincalculatortoolz.lovable.app/calculators",
  "https://bitcoincalculatortoolz.lovable.app/calculators/dca",
  "https://bitcoincalculatortoolz.lovable.app/calculators/retirement",
  "https://bitcoincalculatortoolz.lovable.app/calculators/what-if",
];

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
  strategy: "mobile" | "desktop";
  fetchedAt: string;
  scores: Record<string, number | null>;
  cwv: Record<string, { value: number; displayValue: string; score: number | null } | undefined>;
  opportunities: Opportunity[];
  diagnostics: Opportunity[];
  failingAudits: Opportunity[];
  error?: string;
};

type FixPlanItem = {
  priority: "high" | "medium" | "low";
  area: string;
  issue: string;
  affectedUrls: string[];
  recommendation: string;
  estimatedImpact: string;
};

type AuditResponse = {
  summary: {
    pagesScanned: number;
    pagesWithErrors: number;
    averageScores: Record<string, number | null>;
    highPriorityFixes: number;
  };
  fixPlan: FixPlanItem[];
  reports: PageReport[];
  generatedAt: string;
  strategy: "mobile" | "desktop";
};

function scoreColor(score: number | null | undefined) {
  if (score === null || score === undefined) return "bg-muted text-muted-foreground";
  if (score >= 0.9) return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
  if (score >= 0.5) return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
  return "bg-red-500/15 text-red-600 dark:text-red-400";
}

function ScorePill({ label, score }: { label: string; score: number | null | undefined }) {
  const pct = score === null || score === undefined ? "—" : Math.round(score * 100);
  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2 ${scoreColor(score)}`}>
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      <span className="text-lg font-bold tabular-nums">{pct}</span>
    </div>
  );
}

const priorityStyles: Record<FixPlanItem["priority"], string> = {
  high: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  low: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
};

const areaIcons: Record<string, JSX.Element> = {
  performance: <Gauge className="w-4 h-4" aria-hidden="true" />,
  accessibility: <Eye className="w-4 h-4" aria-hidden="true" />,
  seo: <Search className="w-4 h-4" aria-hidden="true" />,
  "best-practices": <ShieldCheck className="w-4 h-4" aria-hidden="true" />,
};

export default function SiteAudit() {
  const [urls, setUrls] = useState(DEFAULT_URLS.join("\n"));
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AuditResponse | null>(null);

  const runAudit = async () => {
    const urlList = urls
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (urlList.length === 0) {
      toast.error("Add at least one URL to audit.");
      return;
    }
    setLoading(true);
    setData(null);
    try {
      const { data: res, error } = await supabase.functions.invoke("pagespeed-audit", {
        body: { urls: urlList, strategy },
      });
      if (error) throw error;
      if ((res as any)?.error) throw new Error((res as any).error);
      setData(res as AuditResponse);
      toast.success(`Scanned ${urlList.length} page${urlList.length === 1 ? "" : "s"}.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Audit failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Site Audit — PageSpeed scan & fix plan</title>
        <meta name="description" content="Run a PageSpeed Insights audit across the site and generate a prioritized fix plan for performance, SEO, accessibility, and best practices." />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="https://bitcoincalculatortoolz.lovable.app/admin/site-audit" />
      </Helmet>
      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Site audit</h1>
          <p className="text-muted-foreground mt-2">
            Run Google PageSpeed Insights across key routes and generate a prioritized fix plan.
          </p>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Scan configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2" htmlFor="urls">
                URLs to scan (one per line, max 10)
              </label>
              <Textarea
                id="urls"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                rows={6}
                className="font-mono text-xs"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Strategy:</span>
                <div className="inline-flex rounded-md border">
                  {(["mobile", "desktop"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStrategy(s)}
                      className={`px-3 py-1.5 text-sm capitalize ${strategy === s ? "bg-primary text-primary-foreground" : "bg-background"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={runAudit} disabled={loading} className="ml-auto">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                    Scanning…
                  </>
                ) : (
                  "Run audit"
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Each URL takes ~10–20s. Scans run sequentially to respect API quotas.
            </p>
          </CardContent>
        </Card>

        {data && (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-primary" aria-hidden="true" />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <ScorePill label="Performance" score={(data.summary.averageScores.performance ?? 0) / 100} />
                  <ScorePill label="Accessibility" score={(data.summary.averageScores.accessibility ?? 0) / 100} />
                  <ScorePill label="Best practices" score={(data.summary.averageScores["best-practices"] ?? 0) / 100} />
                  <ScorePill label="SEO" score={(data.summary.averageScores.seo ?? 0) / 100} />
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <Badge variant="secondary">{data.summary.pagesScanned} pages scanned</Badge>
                  {data.summary.pagesWithErrors > 0 && (
                    <Badge variant="destructive">{data.summary.pagesWithErrors} failed</Badge>
                  )}
                  <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30">
                    {data.summary.highPriorityFixes} high-priority fixes
                  </Badge>
                  <span className="text-muted-foreground ml-auto">
                    {new Date(data.generatedAt).toLocaleString()} · {data.strategy}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="plan" className="mb-8">
              <TabsList>
                <TabsTrigger value="plan">Fix plan ({data.fixPlan.length})</TabsTrigger>
                <TabsTrigger value="pages">Per-page reports ({data.reports.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="plan" className="space-y-3 mt-4">
                {data.fixPlan.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                      No issues detected. Site is in great shape.
                    </CardContent>
                  </Card>
                )}
                {data.fixPlan.map((item, i) => (
                  <Card key={`${item.issue}-${i}`} className={`border ${priorityStyles[item.priority]}`}>
                    <CardContent className="py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{areaIcons[item.area] ?? <AlertTriangle className="w-4 h-4" aria-hidden="true" />}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge className={priorityStyles[item.priority]} variant="outline">
                              {item.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="secondary" className="capitalize">{item.area}</Badge>
                            <span className="text-xs text-muted-foreground">{item.estimatedImpact}</span>
                          </div>
                          <h3 className="font-semibold text-foreground">{item.issue}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{item.recommendation}</p>
                          <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer">
                              Affected URLs ({item.affectedUrls.length})
                            </summary>
                            <ul className="mt-1 text-xs space-y-0.5 pl-4 list-disc">
                              {item.affectedUrls.map((u) => (
                                <li key={u}><a href={u} target="_blank" rel="noreferrer" className="hover:underline">{u}</a></li>
                              ))}
                            </ul>
                          </details>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="pages" className="space-y-4 mt-4">
                {data.reports.map((r) => (
                  <Card key={r.url}>
                    <CardHeader>
                      <CardTitle className="text-base break-all">{r.url}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {r.error ? (
                        <p className="text-sm text-red-500">Error: {r.error}</p>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                            <ScorePill label="Perf" score={r.scores.performance} />
                            <ScorePill label="A11y" score={r.scores.accessibility} />
                            <ScorePill label="BP" score={r.scores["best-practices"]} />
                            <ScorePill label="SEO" score={r.scores.seo} />
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                            {Object.entries(r.cwv).map(([k, v]) =>
                              v ? (
                                <div key={k} className="rounded border px-2 py-1.5 flex justify-between">
                                  <span className="uppercase text-muted-foreground">{k}</span>
                                  <span className="font-mono">{v.displayValue}</span>
                                </div>
                              ) : null,
                            )}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </>
  );
}
