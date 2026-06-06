#!/usr/bin/env node
/**
 * CI guard — fails if public/sitemap.xml has drifted from EN_TO_TR.
 * Thin wrapper around `generate-sitemap.mjs --check`.
 */
import { spawnSync } from 'node:child_process';
const r = spawnSync('node', ['scripts/generate-sitemap.mjs', '--check'], { stdio: 'inherit' });
process.exit(r.status ?? 1);
