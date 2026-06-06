import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

type Row = {
  file: string;
  slug: string;
  title: string;
  calcCount: number;
  artCount: number;
  calcs: string[];
  articles: string[];
  brokenCalcs: string[];
  brokenArticles: string[];
  warnings: string[];
};

type LangAudit = {
  articleCount: number;
  brokenReferences: number;
  thinWarnings: number;
  rows: Row[];
};

type Audit = {
  generatedAt: string;
  calculatorSlugCount: number;
  en: LangAudit;
  tr: LangAudit;
};

const Stat = ({ label, value, tone }: { label: string; value: number | string; tone?: "ok" | "warn" | "bad" }) => {
  const color =
    tone === "bad"
      ? "text-destructive"
      : tone === "warn"
        ? "text-amber-500"
        : "text-success";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${typeof value === "number" ? color : ""}`}>{value}</div>
    </div>
  );
};

const Section = ({ lang, data }: { lang: "EN" | "TR"; data: LangAudit }) => {
  const broken = data.rows.filter((r) => r.brokenCalcs.length || r.brokenArticles.length);
  const thin = data.rows.filter((r) => r.warnings.length && !r.brokenCalcs.length && !r.brokenArticles.length);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{lang} articles</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Articles" value={data.articleCount} />
        <Stat label="Broken refs" value={data.brokenReferences} tone={data.brokenReferences ? "bad" : "ok"} />
        <Stat label="Thin links" value={data.thinWarnings} tone={data.thinWarnings ? "warn" : "ok"} />
        <Stat label="Issue rows" value={broken.length + thin.length} tone={broken.length ? "bad" : thin.length ? "warn" : "ok"} />
      </div>

      {broken.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-destructive">Broken references</h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-3 py-2">Slug</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Broken calculators</th>
                  <th className="px-3 py-2">Broken articles</th>
                </tr>
              </thead>
              <tbody>
                {broken.map((r) => (
                  <tr key={r.file} className="border-t border-border">
                    <td className="px-3 py-2 font-mono text-xs">{r.slug}</td>
                    <td className="px-3 py-2">{r.title}</td>
                    <td className="px-3 py-2 font-mono text-xs text-destructive">{r.brokenCalcs.join(", ") || "—"}</td>
                    <td className="px-3 py-2 font-mono text-xs text-destructive">{r.brokenArticles.join(", ") || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {thin.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-amber-500">Thin-link warnings</h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-3 py-2">Slug</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2 text-right">Calcs</th>
                  <th className="px-3 py-2 text-right">Articles</th>
                  <th className="px-3 py-2">Warnings</th>
                </tr>
              </thead>
              <tbody>
                {thin.map((r) => (
                  <tr key={r.file} className="border-t border-border">
                    <td className="px-3 py-2 font-mono text-xs">{r.slug}</td>
                    <td className="px-3 py-2">{r.title}</td>
                    <td className="px-3 py-2 text-right">{r.calcCount}</td>
                    <td className="px-3 py-2 text-right">{r.artCount}</td>
                    <td className="px-3 py-2 text-xs text-amber-600 dark:text-amber-400">{r.warnings.join("; ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {broken.length === 0 && thin.length === 0 && (
        <p className="rounded-lg border border-border bg-card p-4 text-sm text-success">
          All {lang} articles pass — no broken references or thin-link warnings.
        </p>
      )}
    </section>
  );
};

export default function AdminLinkAudit() {
  const [audit, setAudit] = useState<Audit | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/audit/link-audit.json?ts=${Date.now()}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setAudit)
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <>
      <Helmet>
        <title>Internal Link Audit — Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <main className="container mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-h1 font-bold">Internal Link Audit</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Developer-only view of broken references and thin-link warnings across EN and TR articles.
            Data is regenerated by <code className="rounded bg-muted px-1">npm run audit:link-json</code> (also during build).
          </p>
        </header>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load audit data: {error}
            <div className="mt-2 text-muted-foreground">
              Run <code className="rounded bg-muted px-1">node scripts/emit-link-audit-json.mjs</code> to generate it.
            </div>
          </div>
        )}

        {!audit && !error && <p className="text-sm text-muted-foreground">Loading audit…</p>}

        {audit && (
          <div className="space-y-8">
            <div className="text-xs text-muted-foreground">
              Generated {new Date(audit.generatedAt).toLocaleString()} · {audit.calculatorSlugCount} calculator slugs known
            </div>
            <Section lang="EN" data={audit.en} />
            <Section lang="TR" data={audit.tr} />
          </div>
        )}
      </main>
    </>
  );
}
