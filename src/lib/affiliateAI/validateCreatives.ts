/**
 * Config-time validation for affiliate creative metadata.
 * Ensures each creative's `size` label ("WxH") matches its declared
 * width/height. Used by tests and the QA page; also runs once at module
 * load in development so mis-configured creatives surface immediately.
 */
import type { AffiliateProgram } from "./types";

export interface CreativeValidationError {
  program_id: string;
  index: number;
  size: string;
  width: number;
  height: number;
  reason: string;
}

export function validateCreatives(
  programs: AffiliateProgram[]
): CreativeValidationError[] {
  const errors: CreativeValidationError[] = [];
  for (const p of programs) {
    const list = p.creatives ?? [];
    list.forEach((c, i) => {
      const m = /^(\d+)x(\d+)$/.exec(c.size);
      if (!m) {
        errors.push({
          program_id: p.id, index: i, size: c.size, width: c.width, height: c.height,
          reason: `Invalid size label "${c.size}" — must be "<width>x<height>"`,
        });
        return;
      }
      const w = Number(m[1]);
      const h = Number(m[2]);
      if (w !== c.width || h !== c.height) {
        errors.push({
          program_id: p.id, index: i, size: c.size, width: c.width, height: c.height,
          reason: `Size label "${c.size}" does not match width×height (${c.width}×${c.height})`,
        });
      }
    });
  }
  return errors;
}

export function assertCreativesValid(programs: AffiliateProgram[]): void {
  const errors = validateCreatives(programs);
  if (errors.length === 0) return;
  const summary = errors
    .map((e) => `  • ${e.program_id}[${e.index}]: ${e.reason}`)
    .join("\n");
  throw new Error(`Affiliate creative validation failed:\n${summary}`);
}
