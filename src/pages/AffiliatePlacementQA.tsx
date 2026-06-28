/**
 * QA page for visually verifying affiliate placements (image + HTML banners,
 * cards, sidebar, inline CTA) and click/impression tracking without depending
 * on TradingView landing pages.
 *
 * Phase 7: gated behind admin auth — visiting /qa/affiliates while signed
 * out redirects to /admin/login; signed-in non-admins see "Not authorized".
 */
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { AffiliateDisclosure } from "@/components/affiliateAI/AffiliateDisclosure";
import { AFFILIATES } from "@/config/affiliates.config";
import { INTENT_MAP, SLUG_CATEGORY } from "@/config/placements.config";
import { pickCreative } from "@/lib/affiliateAI/creativePicker";
import { scoreAffiliate } from "@/lib/affiliateAI/scoringEngine";
import { validateCreatives } from "@/lib/affiliateAI/validateCreatives";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import type { CalculatorContext, Lang, Zone } from "@/lib/affiliateAI/types";


type Device = "desktop" | "tablet" | "mobile";
const DEVICES: Device[] = ["desktop", "tablet", "mobile"];
const ROTATION_ITERATIONS = 500;

const ZONES: Zone[] = [
  "post-result",
  "inline-mid-article",
  "sidebar",
  "pre-footer",
  "inline",
  "comparison",
  "footer",
];

// Local-only sample creatives so we can verify rendering without a real network
const SAMPLE_IMAGE_728 = "https://placehold.co/728x90/2962ff/ffffff/png?text=Sample+728x90+Banner";
const SAMPLE_IMAGE_300 = "https://placehold.co/300x250/16a34a/ffffff/png?text=Sample+300x250";
const SAMPLE_IMAGE_160 = "https://placehold.co/160x600/9333ea/ffffff/png?text=160x600";

const SAMPLE_HTML_SNIPPET = `
  <a href="https://example.com/sample-affiliate?utm_source=qa" target="_blank" rel="sponsored nofollow noopener" style="display:inline-block;padding:14px 22px;background:linear-gradient(90deg,#e85d3a,#c94a2b);color:#fff;font-weight:600;border-radius:8px;text-decoration:none;font-family:'Manrope',system-ui,sans-serif;">
    Sample HTML Banner → Click to test tracking
  </a>
`;

export default function AffiliatePlacementQAGuard() {
  const { loading, session, isAdmin } = useAdminAuth();
  if (loading) {
    return (
      <main className="min-h-dvh flex items-center justify-center text-muted-foreground">
        Loading…
      </main>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-xl font-semibold">Not authorized</h1>
        <p className="text-sm text-muted-foreground">
          /qa/affiliates is restricted to admin accounts.
        </p>
      </main>
    );
  }
  return <AffiliatePlacementQA />;
}

function AffiliatePlacementQA() {
  const [lang, setLang] = useState<Lang>("en");
  const [slug, setSlug] = useState("bitcoin-dca-calculator");
  const [rotationSeed, setRotationSeed] = useState(0);

  const validation = useMemo(() => validateCreatives(AFFILIATES), []);



  // Coverage widget: for every slug in SLUG_CATEGORY, compute top-2 by score
  // and flag whether documented INTENT_MAP winners are honoured.
  const coverage = useMemo(() => {
    const enabledIds = new Set(AFFILIATES.filter((a) => a.enabled).map((a) => a.id));
    const slugs = Object.keys(SLUG_CATEGORY).sort();
    const buildCtx = (slug: string, l: Lang): CalculatorContext => ({
      slug,
      lang: l,
      segment: "default",
      resultSignals: [],
      device: "desktop",
      isReturning: false,
      optedOut: false,
    });
    return slugs.map((slug) => {
      const langs = (["en", "tr"] as Lang[]).map((l) => {
        const ctx = buildCtx(slug, l);
        const ranked = AFFILIATES.filter(
          (a) =>
            a.enabled &&
            (a.language_restriction.length === 0 ||
              a.language_restriction.includes(l))
        )
          .map((a) => ({ id: a.id, name: a.name, score: scoreAffiliate(a, ctx) }))
          .sort((x, y) => y.score - x.score);
        const top = ranked.slice(0, 2);
        const intent = INTENT_MAP[slug];
        const expected = intent
          ? (l === "tr" ? intent.tr : intent.en).filter((id) => enabledIds.has(id))
          : [];
        const honoured =
          expected.length === 0 ||
          expected.some((e) => top.map((t) => t.id).includes(e));
        return { lang: l, top, expected, honoured };
      });
      return { slug, category: SLUG_CATEGORY[slug], langs };
    });
  }, []);

  const coverageStats = useMemo(() => {
    let total = 0;
    let honoured = 0;
    let withIntent = 0;
    for (const row of coverage) {
      for (const l of row.langs) {
        total++;
        if (l.expected.length > 0) withIntent++;
        if (l.honoured) honoured++;
      }
    }
    return { total, honoured, withIntent };
  }, [coverage]);


  // Rotation tally: for each enabled program with creatives, simulate N picks
  // per (zone × device) and count which sizes were chosen. This is what the
  // user inspects across refreshes — a healthy distribution proves rotation.
  const rotationReport = useMemo(() => {
    const programs = AFFILIATES.filter((a) => a.enabled && (a.creatives?.length ?? 0) > 0);
    return programs.map((p) => {
      const byZone = ZONES.map((zone) => {
        const byDevice = DEVICES.map((device) => {
          const counts = new Map<string, number>();
          for (let i = 0; i < ROTATION_ITERATIONS; i++) {
            const c = pickCreative(p, zone, device, lang);
            if (!c) continue;
            counts.set(c.size, (counts.get(c.size) ?? 0) + 1);
          }
          const total = Array.from(counts.values()).reduce((s, n) => s + n, 0);
          const breakdown = Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([size, n]) => ({ size, n, pct: total ? (n / total) * 100 : 0 }));
          return { device, total, breakdown };
        });
        return { zone, byDevice };
      });
      return { program: p, byZone };
    });
    // rotationSeed is intentionally part of the dependency list so "Re-roll"
    // forces a fresh sample.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, rotationSeed]);

  return (
    <>
      <Helmet>
        <title>Affiliate Placement QA · Internal</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center gap-3 justify-between">
          <div>
            <h1 className="text-xl font-bold">Affiliate Placement QA</h1>
            <p className="text-xs text-muted-foreground">
              Visual + click-tracking sandbox for all zones & formats.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <label className="flex items-center gap-1">
              Slug:
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="border border-border rounded px-2 py-1 bg-background w-56"
              />
            </label>
            <label className="flex items-center gap-1">
              Lang:
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="border border-border rounded px-2 py-1 bg-background"
              >
                <option value="en">EN</option>
                <option value="tr">TR</option>
              </select>
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        {/* Standalone sample image banner (no engine, pure visual sanity) */}
        <section>
          <h2 className="text-lg font-semibold mb-1">1. Static sample image banner (728×90)</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Pure HTML — clicking opens a safe placeholder URL in a new tab.
          </p>
          <AffiliateDisclosure lang={lang} className="mb-2" />
          <div className="flex justify-center">
            <a
              href="https://example.com/sample-728?utm_source=qa"
              target="_blank"
              rel="sponsored nofollow noopener"
              onClick={() => console.log("[QA] sample 728 click")}
            >
              <img src={SAMPLE_IMAGE_728} width={728} height={90} alt="Sample banner" className="rounded-md" />
            </a>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">2. Static sample 300×250</h2>
            <AffiliateDisclosure lang={lang} className="mb-2" />
            <a
              href="https://example.com/sample-300?utm_source=qa"
              target="_blank"
              rel="sponsored nofollow noopener"
              onClick={() => console.log("[QA] sample 300 click")}
            >
              <img src={SAMPLE_IMAGE_300} width={300} height={250} alt="Sample 300" className="rounded-md" />
            </a>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">3. Static sample 160×600</h2>
            <AffiliateDisclosure lang={lang} className="mb-2" />
            <a
              href="https://example.com/sample-160?utm_source=qa"
              target="_blank"
              rel="sponsored nofollow noopener"
              onClick={() => console.log("[QA] sample 160 click")}
            >
              <img src={SAMPLE_IMAGE_160} width={160} height={600} alt="Sample 160" className="rounded-md" />
            </a>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-1">4. Sample HTML banner (sanitized)</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Renders raw HTML through DOMPurify — verifies the same path used for vendor snippets.
          </p>
          <AffiliateDisclosure lang={lang} className="mb-2" />
          <div
            className="flex justify-center"
            dangerouslySetInnerHTML={{ __html: SAMPLE_HTML_SNIPPET }}
          />
        </section>

        {/* Live engine: render each zone */}
        <section>
          <h2 className="text-lg font-semibold mb-1">5. Live engine — all zones</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Each block calls <code>useAffiliateAI</code> with a forced zone for slug{" "}
            <code>{slug}</code> ({lang.toUpperCase()}). Impressions/clicks hit{" "}
            <code>log-event</code>.
          </p>
          <div className="space-y-10">
            {ZONES.map((z) => (
              <div key={z} className="border border-dashed border-border rounded-lg p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  zone: <span className="text-foreground font-mono">{z}</span>
                </div>
                <AffiliatePlacement slug={slug} lang={lang} zone={z} />
              </div>
            ))}
          </div>
        </section>

        {/* 6. Config validation */}
        <section>
          <h2 className="text-lg font-semibold mb-1">6. Creative config validation</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Each creative's <code>size</code> label must match its declared{" "}
            <code>width × height</code>. Build-time test:{" "}
            <code>src/lib/affiliateAI/__tests__/validateCreatives.test.ts</code>.
          </p>
          {validation.length === 0 ? (
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
              <span className="font-semibold text-primary">PASS</span> — all{" "}
              {AFFILIATES.reduce((n, a) => n + (a.creatives?.length ?? 0), 0)} creatives
              across {AFFILIATES.length} programs match their declared dimensions.
            </div>
          ) : (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm space-y-1">
              <div className="font-semibold text-destructive">
                FAIL — {validation.length} mismatch(es):
              </div>
              <ul className="list-disc pl-5 font-mono text-xs">
                {validation.map((e, i) => (
                  <li key={i}>
                    {e.program_id}[{e.index}] — {e.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* 7. Rotation tally */}
        <section>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold">
              7. Weighted rotation tally ({ROTATION_ITERATIONS.toLocaleString()}× per cell)
            </h2>
            <button
              onClick={() => setRotationSeed((s) => s + 1)}
              className="text-xs rounded border border-border px-2 py-1 hover:bg-muted"
            >
              Re-roll
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            For each enabled program, simulates {ROTATION_ITERATIONS} picker calls per
            zone × device and counts the sizes chosen. Multiple sizes appearing in each
            row confirms <em>weighted rotation chooses creatives across sizes</em>.
            Re-roll (or refresh) to verify the distribution stays similar but not identical.
          </p>
          <div className="space-y-6">
            {rotationReport.map(({ program, byZone }) => (
              <div key={program.id} className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted/40 px-3 py-2 flex items-center justify-between">
                  <span className="font-semibold text-sm">{program.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {program.creatives?.length} creatives
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead className="text-muted-foreground">
                      <tr className="border-b border-border">
                        <th className="text-left px-3 py-2">zone</th>
                        <th className="text-left px-3 py-2">device</th>
                        <th className="text-left px-3 py-2">size distribution (count · %)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byZone.flatMap(({ zone, byDevice }) =>
                        byDevice.map(({ device, total, breakdown }) => (
                          <tr key={`${program.id}-${zone}-${device}`} className="border-b border-border/50">
                            <td className="px-3 py-1.5">{zone}</td>
                            <td className="px-3 py-1.5">{device}</td>
                            <td className="px-3 py-1.5">
                              {total === 0 ? (
                                <span className="text-muted-foreground">— no match —</span>
                              ) : (
                                breakdown.map((b, i) => (
                                  <span key={b.size} className="mr-3">
                                    {i > 0 && <span className="text-muted-foreground">· </span>}
                                    <span className="text-foreground">{b.size}</span>{" "}
                                    <span className="text-muted-foreground">
                                      {b.n} ({b.pct.toFixed(1)}%)
                                    </span>
                                  </span>
                                ))
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Coverage widget */}
        <section>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold">
              8. Coverage — slug × language → top-2 picks
            </h2>
            <span className="text-xs text-muted-foreground">
              {coverageStats.honoured}/{coverageStats.total} cells honour intent
              ({coverageStats.withIntent} have INTENT_MAP rules)
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            For every slug in <code>SLUG_CATEGORY</code>, computes the top-2 scored
            affiliates per language. Rows highlighted in red mean the documented
            <code> INTENT_MAP</code> winner did not land in the top 2 — investigate
            scoring weights or affiliate <code>language_restriction</code>.
          </p>
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-xs">
              <thead className="text-muted-foreground bg-muted/40">
                <tr className="border-b border-border text-left">
                  <th className="px-3 py-2 font-medium">slug</th>
                  <th className="px-3 py-2 font-medium">category</th>
                  <th className="px-3 py-2 font-medium">lang</th>
                  <th className="px-3 py-2 font-medium">top 2 picks (score)</th>
                  <th className="px-3 py-2 font-medium">intent winners</th>
                  <th className="px-3 py-2 font-medium">status</th>
                </tr>
              </thead>
              <tbody>
                {coverage.flatMap((row) =>
                  row.langs.map((l) => (
                    <tr
                      key={`${row.slug}-${l.lang}`}
                      className={`border-b border-border/50 ${
                        l.honoured ? "" : "bg-destructive/10"
                      }`}
                    >
                      <td className="px-3 py-1.5 font-mono">{row.slug}</td>
                      <td className="px-3 py-1.5 text-muted-foreground">{row.category}</td>
                      <td className="px-3 py-1.5 uppercase">{l.lang}</td>
                      <td className="px-3 py-1.5 font-mono">
                        {l.top.length === 0 ? (
                          <span className="text-destructive">— none —</span>
                        ) : (
                          l.top
                            .map((t) => `${t.id} (${t.score})`)
                            .join(" · ")
                        )}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-muted-foreground">
                        {l.expected.length === 0 ? "—" : l.expected.join(", ")}
                      </td>
                      <td className="px-3 py-1.5">
                        {l.expected.length === 0 ? (
                          <span className="text-muted-foreground">n/a</span>
                        ) : l.honoured ? (
                          <span className="text-success font-medium">OK</span>
                        ) : (
                          <span className="text-destructive font-medium">MISS</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
    </>
  );
}
