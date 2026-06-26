/**
 * Pure check helpers for `scripts/audit-tr-coverage.mjs`.
 *
 * Each helper accepts a source string (a .tsx file's contents) and returns
 * an array of human-readable violation strings (empty array = pass). Kept
 * dependency-free so they can be unit-tested with synthetic fixtures.
 */

export const TR_GATE = /language\s*===?\s*['"]tr['"]|\bt\(['"]|isTurkish/;
export const LOOKS_TR = /[çğıİöşüÇĞÖŞÜ]|\b(ve|ile|için|bir|bu|şu|kaç|nasıl|nedir|hesaplay|adım|sayfa|ana)\b/i;

const TITLE_BRANCH = /language\s*===?\s*['"]tr['"]|\btr\s*\?|\bt\(['"]/;

/** ±6-line context window check: returns true if the window contains a TR gate. */
function hasTrGateNear(lines, i, radius = 6) {
  const s = Math.max(0, i - radius);
  const e = Math.min(lines.length, i + radius + 1);
  return TR_GATE.test(lines.slice(s, e).join('\n'));
}

/** EN-only <title>...</title> tags (no TR branch inside). */
export function checkTitles(src) {
  const out = [];
  // If the file localizes via a hoisted const (e.g. `const TITLE = isTr ?
  // TITLE_TR : TITLE_EN`) and renders `<title>{TITLE}</title>`, that's a
  // valid TR branch — just not visible inside the tag body. Accept any
  // pure `{identifier}` body when the file has a TR gate elsewhere.
  const fileHasTrGate = TR_GATE.test(src);
  for (const m of src.matchAll(/<title>([\s\S]*?)<\/title>/g)) {
    const body = m[1];
    if (fileHasTrGate && /^\s*\{[A-Za-z_$][\w$]*\}\s*$/.test(body)) continue;
    if (!TITLE_BRANCH.test(body)) out.push(body.slice(0, 80).trim());
  }
  return out;
}

/** EN-only <h1>...</h1> tags (no TR branch, skipping pure {expr} headings). */
export function checkH1(src) {
  const out = [];
  for (const m of src.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)) {
    const body = m[1];
    if (/^\s*\{[^}]+\}\s*$/.test(body)) continue;
    if (!TITLE_BRANCH.test(body)) out.push(body.slice(0, 80).trim());
  }
  return out;
}

/** Generic JSX-text suspect scan with TR-gate context window. */
export function checkSuspectJsxText(src) {
  const lines = src.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/>([A-Z][A-Za-z][A-Za-z ,.'\-/&]{5,70})</);
    if (!m) continue;
    const txt = m[1].trim();
    if (/^(BTC|USD|EUR|TRY)$/.test(txt)) continue;
    if (!/\s/.test(txt)) continue;
    if (LOOKS_TR.test(txt)) continue;
    if (hasTrGateNear(lines, i)) continue;
    out.push(txt);
  }
  return out;
}

/** EN-only <Button>Text</Button> (and lowercase <button>) literal children. */
export function checkButtons(src) {
  const lines = src.split('\n');
  const out = [];
  const re = /<(?:[Bb]utton)[^>]*>([A-Z][A-Za-z][A-Za-z ,.'\-/&]{3,60})<\/(?:[Bb]utton)>/;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(re);
    if (!m) continue;
    const txt = m[1].trim();
    if (LOOKS_TR.test(txt)) continue;
    if (hasTrGateNear(lines, i)) continue;
    out.push(txt);
  }
  return out;
}

/** EN-only placeholder="..." attributes (string literal, not {expression}). */
export function checkPlaceholders(src) {
  const lines = src.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/\bplaceholder\s*=\s*"([A-Z][A-Za-z][^"]{3,60})"/);
    if (!m) continue;
    const txt = m[1].trim();
    if (LOOKS_TR.test(txt)) continue;
    if (hasTrGateNear(lines, i)) continue;
    out.push(txt);
  }
  return out;
}

/** EN-only aria-label="..." attributes (string literal). */
export function checkAriaLabels(src) {
  const lines = src.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/\baria-label\s*=\s*"([A-Z][A-Za-z][^"]{3,60})"/);
    if (!m) continue;
    const txt = m[1].trim();
    if (LOOKS_TR.test(txt)) continue;
    if (hasTrGateNear(lines, i)) continue;
    out.push(txt);
  }
  return out;
}

/** Breadcrumb items={[{ label: "Raw English" }]} with no TR branching. */
export function checkBreadcrumbLabels(src) {
  const out = [];
  if (!/<Breadcrumb\b/.test(src)) return out;
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/\blabel\s*:\s*"([A-Z][A-Za-z][^"]{3,60})"/);
    if (!m) continue;
    const txt = m[1].trim();
    if (LOOKS_TR.test(txt)) continue;
    if (hasTrGateNear(lines, i)) continue;
    out.push(txt);
  }
  return out;
}

/** FAQ EN/TR parity. Returns { missingTr, mismatch }. */
export function checkFaqParity(src) {
  const FAQ_EN_RE = /\b(faq(?:Data)?_?en|FAQ_EN|faqEn|faqDataEn)\b/i;
  const FAQ_TR_RE = /\b(faq(?:Data)?_?tr|FAQ_TR|faqTr|faqDataTr)\b/i;
  if (!FAQ_EN_RE.test(src) || !/question\s*:/i.test(src)) {
    return { missingTr: false, mismatch: null };
  }
  if (!FAQ_TR_RE.test(src)) return { missingTr: true, mismatch: null };

  const blockOf = (name) => {
    const i = src.search(new RegExp(`const\\s+${name}\\s*=\\s*\\[`));
    if (i < 0) return null;
    let depth = 0, end = i;
    for (let k = src.indexOf('[', i); k < src.length; k++) {
      if (src[k] === '[') depth++;
      else if (src[k] === ']') { depth--; if (depth === 0) { end = k; break; } }
    }
    return src.slice(i, end);
  };
  const enName = (src.match(FAQ_EN_RE) || [])[0];
  const trName = (src.match(FAQ_TR_RE) || [])[0];
  const enBlock = enName && blockOf(enName);
  const trBlock = trName && blockOf(trName);
  if (!enBlock || !trBlock) return { missingTr: false, mismatch: null };
  const enQ = (enBlock.match(/question\s*:/g) || []).length;
  const trQ = (trBlock.match(/question\s*:/g) || []).length;
  if (enQ !== trQ) return { missingTr: false, mismatch: { en: enQ, tr: trQ } };
  return { missingTr: false, mismatch: null };
}
