#!/usr/bin/env node
/**
 * Audit live JSON-LD blocks for schema.org validation issues.
 *
 * Fetches every URL in public/sitemap.xml from BASE_URL (default
 * production) and parses every <script type="application/ld+json">.
 * Applies a small allowlist of forbidden property/type combos that
 * schema.org's Structured Data Testing Tool flags as "Unexpected
 * property" — these are the ones our crawler has reported as
 * "Schema.org validation error" in past audits.
 *
 * Adds new rules here as we identify new patterns. Exits 1 on any
 * violation so CI catches regressions.
 *
 * Usage:
 *   node scripts/audit-jsonld.mjs
 *   BASE_URL=https://bitcoincalculator.tools node scripts/audit-jsonld.mjs
 *   LIMIT=20 node scripts/audit-jsonld.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

// Lovable's static host serves the prerendered HTML to typical crawlers but
// strips it for some non-curl clients (different TLS fingerprint / no
// cloudflare bot-management cookie). We shell out to `curl` so the JSON-LD
// blocks are reliably present.
function curlGet(url) {
  return execFileSync("curl", ["-sSL", "--compressed", "-A", "Mozilla/5.0 JsonLdAudit", url], {
    maxBuffer: 50 * 1024 * 1024, encoding: "utf8",
  });
}

const BASE = (process.env.BASE_URL || "https://bitcoincalculator.tools").replace(/\/$/, "");
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : Infinity;
const CONCURRENCY = Number(process.env.CONCURRENCY || 6);

// Properties that schema.org rejects on the given @type. Extend as needed.
const FORBIDDEN = [
  { type: "BreadcrumbList", prop: "inLanguage" },
];

function paths() {
  const xml = readFileSync("public/sitemap.xml", "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => { try { return new URL(m[1]).pathname; } catch { return null; } })
    .filter(Boolean)
    .slice(0, LIMIT);
}

function* walk(obj) {
  if (Array.isArray(obj)) for (const v of obj) yield* walk(v);
  else if (obj && typeof obj === "object") { yield obj; for (const v of Object.values(obj)) yield* walk(v); }
}

async function audit(p) {
  const url = BASE + p;
  let html;
  try { html = curlGet(url); }
  catch (e) { return { url, error: e.message, issues: [] }; }

  const issues = [];
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  for (const [, raw] of blocks) {
    let data;
    try { data = JSON.parse(raw); }
    catch (e) { issues.push({ kind: "parse", msg: e.message }); continue; }
    for (const node of walk(data)) {
      const t = node["@type"];
      const types = Array.isArray(t) ? t : [t];
      for (const rule of FORBIDDEN) {
        if (types.includes(rule.type) && rule.prop in node) {
          issues.push({ kind: "forbidden", type: rule.type, prop: rule.prop });
        }
      }
    }
  }
  return { url, issues };
}

async function run() {
  const all = paths();
  console.log(`Auditing ${all.length} URLs @ ${BASE}`);
  const out = [];
  for (let i = 0; i < all.length; i += CONCURRENCY) {
    const batch = all.slice(i, i + CONCURRENCY);
    const r = await Promise.all(batch.map(audit));
    out.push(...r);
    process.stdout.write(".");
  }
  console.log();
  const offenders = out.filter((r) => r.issues.length || r.error);
  try { mkdirSync("/tmp", { recursive: true }); } catch {}
  writeFileSync("/tmp/jsonld-audit.json", JSON.stringify(out, null, 2));
  if (offenders.length === 0) { console.log("OK — no JSON-LD validation issues"); process.exit(0); }
  console.error(`FAIL — ${offenders.length} URL(s) with issues:`);
  for (const o of offenders.slice(0, 30)) {
    console.error(" ", o.url, o.error ? `(${o.error})` : "");
    for (const i of o.issues) console.error("    -", i.kind === "forbidden" ? `${i.type}.${i.prop} forbidden by schema.org` : `parse: ${i.msg}`);
  }
  process.exit(1);
}

run().catch((e) => { console.error(e); process.exit(2); });
