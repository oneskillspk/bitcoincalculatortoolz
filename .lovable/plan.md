# Stabilize the imported Bitcoin Calculator Tools project

## Diagnosis

The dev server IS running (`vite v5.4.21` on port 8080, returning 200 OK with the real SPA HTML). The Vite SPA stack from your GitHub repo is intact:
- `index.html` → `src/main.tsx` → `src/App.tsx` → React Router v6 → all 47 calculators and 38 articles.
- `vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `vercel.json`, `public/sitemap.xml` all match the original.

What's broken is that this project was originally created as a **TanStack Start scaffold**, and when the GitHub import landed, the TanStack files were left in place underneath your SPA. Right now both stacks coexist on disk:

```text
src/
  main.tsx          ← SPA entry (used by index.html)  ✅ keep
  App.tsx           ← SPA router                       ✅ keep
  pages/, components/, services/, ... (your real app)  ✅ keep
  router.tsx        ← TanStack Router bootstrap         ❌ leftover
  start.ts          ← TanStack Start instance           ❌ leftover
  server.ts         ← Cloudflare Worker entry           ❌ leftover
  routeTree.gen.ts  ← TanStack generated routes         ❌ leftover
  routes/__root.tsx ← TanStack root layout              ❌ leftover
  routes/index.tsx  ← TanStack home                     ❌ leftover
wrangler.jsonc      ← Cloudflare Worker config          ❌ leftover
```

Nothing in your SPA imports those files, so `bun dev` works. But:
1. The TanStack Router Vite plugin (if any future edit re-enables it) will try to regenerate `routeTree.gen.ts` and crash because route filenames conflict with React Router paths.
2. `src/routes/__root.tsx` imports `../styles.css?url` — your SPA already has `src/styles.css`, so this compiles silently but ships a duplicate stylesheet if anything ever imports it.
3. The Lovable preview shell was provisioned for a TanStack/Cloudflare project, so the iframe loader sometimes waits for an SSR worker that doesn't exist, which matches the "stuck loading" symptom you described.

## Plan

### Step 1 — Delete the TanStack scaffold files

Remove only the dead-code leftovers. None of these are referenced by `index.html`, `src/main.tsx`, `src/App.tsx`, `vite.config.ts`, or anything your repo's build scripts use.

```text
src/router.tsx
src/start.ts
src/server.ts
src/routeTree.gen.ts
src/routes/__root.tsx
src/routes/index.tsx
src/routes/README.md
src/routes/                  (the now-empty directory)
src/lib/error-capture.ts     (only used by src/server.ts)
src/lib/error-page.ts        (only used by src/server.ts)
src/lib/api/example.functions.ts   (TanStack server-fn sample)
wrangler.jsonc
```

I'll grep each one first to confirm no SPA code imports it. If something does (unlikely for `error-capture.ts` / `error-page.ts`), I'll leave that specific file in place.

### Step 2 — Restart the dev server

After file deletions, restart Vite once so it drops any cached module graph that still references the deleted TanStack files. Then verify:
- `curl http://localhost:8080/` returns the SPA HTML.
- Preview iframe loads the homepage.
- Hard-refresh `/calculators` and `/tr/hesaplayicilar` still resolve (your `calculatorDeepLinkFallback` Vite plugin handles SPA deep links — already in your `vite.config.ts`, untouched).

### Step 3 — Do nothing else

Per your instructions: no changes to `App.tsx` routing, `vite.config.ts`, `vercel.json`, `public/sitemap.xml`, calculator logic, Turkish translations, SEO meta, or JSON-LD.

## What this does NOT touch

- `package.json` (keeps your `vite_react_shadcn_ts` name and all build/audit scripts)
- `vite.config.ts` (your SPA config with `componentTagger`, `deferCss`, `calculatorDeepLinkFallback`, manualChunks, etc.)
- `tailwind.config.ts`, `postcss.config.js`, `components.json`
- Any file under `src/pages/`, `src/components/`, `src/services/`, `src/hooks/`, `src/data/`, `src/utils/`, `src/lib/affiliateAI/`, `src/integrations/`, `src/contexts/`, `src/styles*`
- `supabase/functions/*`, `scripts/*`, `docs/*`, `public/*`
- `vercel.json`, `wrangler.jsonc` is deleted (Vercel is your host, not Cloudflare Workers)

## Risk

Low. All deleted files are TanStack Start scaffold code that your SPA doesn't import. If after deletion any file complains, it means I missed a reference — I'll restore that specific file and find the importer.

## Technical notes (for reference)

- `tsconfig.app.json` may list `src/routeTree.gen.ts` or `src/routes/**` in its includes. After deletion, TS will simply have fewer files to check; no config edit required.
- The TanStack Router Vite plugin is NOT in your `vite.config.ts`, so deleting `src/routes/` won't trigger plugin errors on dev/build.
- The Lovable project metadata still tags this as a TanStack project. That doesn't affect build/runtime — `bun dev` follows whatever `package.json` says (`vite`). The preview iframe behavior should normalize once the TanStack files are gone and the dev server restarts cleanly.
