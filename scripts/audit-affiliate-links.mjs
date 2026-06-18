#!/usr/bin/env node
/**
 * Pre-launch audit: every enabled affiliate must ship with real tracking
 * URLs (no PLACEHOLDER, no null URL when a same-language CTA exists).
 * Exits non-zero on any failure so CI / pre-deploy can block.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cfgPath = join(__dirname, "..", "src", "config", "affiliates.config.ts");
const src = readFileSync(cfgPath, "utf8");

const errors = [];

// Naive but sufficient block scanner: split on `  {` at column 2.
const blocks = src.split(/\n  \{\n/).slice(1);
for (const raw of blocks) {
  const idMatch = raw.match(/id:\s*"([^"]+)"/);
  if (!idMatch) continue;
  const id = idMatch[1];
  const enabled = /enabled:\s*true/.test(raw);
  // NOTE: we no longer `continue` on disabled programs — a single
  // `enabled: true` flip should never be able to ship PLACEHOLDER URLs.
  // The CTA-with-null-URL check below is still scoped to enabled rows
  // (a disabled CTA is allowed to point at no URL), but PLACEHOLDER
  // scanning runs for everyone.

  const grab = (key) => {
    const m = raw.match(new RegExp(`${key}:\\s*(?:"([^"]*)"|null)`));
    if (!m) return undefined;
    return m[1] ?? null;
  };

  const urlEn = grab("url_en");
  const urlTr = grab("url_tr");
  const ctaEn = grab("cta_short_en");
  const ctaTr = grab("cta_short_tr");

  for (const [lang, url, cta] of [
    ["en", urlEn, ctaEn],
    ["tr", urlTr, ctaTr],
  ]) {
    if (cta && !url) {
      errors.push(`[${id}] enabled, has ${lang} CTA "${cta}" but url_${lang} is null`);
      continue;
    }
    if (url && /PLACEHOLDER/i.test(url)) {
      errors.push(`[${id}] url_${lang} still contains PLACEHOLDER → ${url}`);
    }
  }

  // Inline landing_url scan
  const landings = [...raw.matchAll(/landing_url:\s*"([^"]+)"/g)].map((m) => m[1]);
  for (const u of landings) {
    if (/PLACEHOLDER/i.test(u)) {
      errors.push(`[${id}] creative landing_url contains PLACEHOLDER → ${u}`);
    }
  }
}

if (errors.length) {
  console.error("\nAffiliate link audit FAILED:\n");
  for (const e of errors) console.error("  ✗ " + e);
  console.error(`\n${errors.length} issue(s).\n`);
  process.exit(1);
}
console.log("Affiliate link audit passed — no PLACEHOLDER or missing URLs in enabled partners.");
